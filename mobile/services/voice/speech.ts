import {
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from "expo-audio";
// createAudioPlayer is exported at runtime; types lag behind in 57.0.5.
import { createAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { LOCALE_LABELS, type AppLocale } from "../../i18n/types";
import { synthesizeSpeechRemote } from "./synthesize";

export type SpeechPlan = {
  /** Voice / engine tag used for playback. */
  tag: string;
  /** True when cloud TTS failed — reply stays on screen only. */
  fellBack: boolean;
  /** Name of the language we could not speak, for the notice. */
  missingLanguage?: string;
};

type SpeakOptions = {
  onDone?: () => void;
  onStart?: () => void;
};

/** Short identical cues (listening prompt) — avoid re-burning tokens. */
const cueCache = new Map<string, string>();
const MAX_CUE_CACHE = 24;
const CUE_MAX_CHARS = 80;

let activePlayer: AudioPlayer | null = null;
let activeUri: string | null = null;
let playGeneration = 0;

/**
 * Clean model replies for on-screen display and TTS.
 * Gemini sometimes injects audio-caption timestamps into voice answers;
 * emoji get read aloud as "smiling face" and similar.
 */
export function sanitizeAssistantReply(text: string): string {
  return text
    // Timed caption markers (sometimes glued mid-word: "00:06atshisi")
    .replace(/\[?\d{1,2}:\d{2}(?:\.\d{1,3})?\]?/g, " ")
    .replace(/\p{Extended_Pictographic}/gu, " ")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_#>|]/g, " ")
    .replace(/^\s*[-•]\s*/gm, "")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Text ready for synthesis. */
export function forSpeech(text: string): string {
  return sanitizeAssistantReply(text)
    .replace(/\s+([.,!?])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .trim();
}

async function writeWavFile(wav64: string): Promise<string> {
  const dir = FileSystem.cacheDirectory;
  if (!dir) throw new Error("No cache directory for speech audio");
  const uri = `${dir}khetha-tts-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.wav`;
  await FileSystem.writeAsStringAsync(uri, wav64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return uri;
}

async function deleteQuiet(uri: string | null): Promise<void> {
  if (!uri) return;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // Best-effort cleanup.
  }
}

function releasePlayer(): void {
  if (activePlayer) {
    try {
      activePlayer.pause();
      activePlayer.remove();
    } catch {
      // Already released.
    }
    activePlayer = null;
  }
}

/**
 * Stop any in-flight playback and bump the generation so late callbacks ignore.
 */
export function stopSpeaking(): void {
  playGeneration += 1;
  releasePlayer();
  const uri = activeUri;
  activeUri = null;
  void deleteQuiet(uri);
}

async function fetchWav64(text: string, locale: AppLocale): Promise<string> {
  const cacheKey = `${locale}::${text}`;
  if (text.length <= CUE_MAX_CHARS) {
    const hit = cueCache.get(cacheKey);
    if (hit) return hit;
  }

  const { wav64 } = await synthesizeSpeechRemote(text, locale);

  if (text.length <= CUE_MAX_CHARS) {
    if (cueCache.size >= MAX_CUE_CACHE) {
      const first = cueCache.keys().next().value;
      if (first) cueCache.delete(first);
    }
    cueCache.set(cacheKey, wav64);
  }

  return wav64;
}

async function playWavUri(
  uri: string,
  generation: number,
  options?: SpeakOptions,
): Promise<void> {
  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: true,
  }).catch(() => undefined);

  releasePlayer();
  activeUri = uri;

  const player = createAudioPlayer({ uri }, { updateInterval: 250 });
  activePlayer = player;

  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      try {
        player.removeListener("playbackStatusUpdate", onStatus);
      } catch {
        // Listener may already be gone.
      }
      resolve();
    };

    const onStatus = (status: AudioStatus) => {
      if (generation !== playGeneration) {
        finish();
        return;
      }
      if (status.didJustFinish) finish();
    };

    player.addListener("playbackStatusUpdate", onStatus);
    options?.onStart?.();
    player.play();

    // Safety net if didJustFinish never fires (load glitches).
    setTimeout(() => {
      if (generation !== playGeneration || settled) {
        finish();
        return;
      }
      if (!player.playing) finish();
    }, 45_000);
  });
}

/**
 * Speak via Qfrency (cloud). On failure, do not fall back to English device TTS —
 * the UI shows a text-only notice instead.
 */
export async function speak(
  text: string,
  locale: AppLocale,
  options?: SpeakOptions,
): Promise<SpeechPlan> {
  const body = forSpeech(text);
  if (!body) {
    options?.onDone?.();
    return { tag: "qfrency", fellBack: false };
  }

  stopSpeaking();
  const generation = playGeneration;

  try {
    const wav64 = await fetchWav64(body, locale);
    if (generation !== playGeneration) {
      options?.onDone?.();
      return { tag: "qfrency", fellBack: false };
    }

    const uri = await writeWavFile(wav64);
    if (generation !== playGeneration) {
      await deleteQuiet(uri);
      options?.onDone?.();
      return { tag: "qfrency", fellBack: false };
    }

    await playWavUri(uri, generation, options);
    if (generation === playGeneration) {
      releasePlayer();
      activeUri = null;
      await deleteQuiet(uri);
    }
    options?.onDone?.();
    return { tag: "qfrency", fellBack: false };
  } catch (err) {
    console.warn("[speech] Qfrency playback failed", err);
    if (generation === playGeneration) {
      releasePlayer();
      const uri = activeUri;
      activeUri = null;
      await deleteQuiet(uri);
    }
    options?.onDone?.();
    return {
      tag: "qfrency",
      fellBack: true,
      missingLanguage: LOCALE_LABELS[locale],
    };
  }
}

/** Speak and resolve once playback finishes (or is stopped / errors). */
export async function speakAndWait(
  text: string,
  locale: AppLocale,
): Promise<SpeechPlan> {
  return speak(text, locale);
}

export async function isSpeaking(): Promise<boolean> {
  return Boolean(activePlayer?.playing);
}
