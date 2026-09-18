import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { AudioQuality, IOSOutputFormat, type RecordingOptions } from "expo-audio";

/**
 * Speech-tuned recording settings, chosen so the file lands in a container
 * Gemini accepts directly as inline data.
 *
 * Android writes raw ADTS AAC (`audio/aac`); iOS writes linear PCM WAV
 * (`audio/wav`). Both are on Gemini's supported audio list, unlike the `.m4a`
 * that `RecordingPresets.HIGH_QUALITY` produces.
 *
 * Mono at 16 kHz is what speech models want anyway, and keeps a 15-second clip
 * around 30 KB on Android — which matters on a metered connection.
 */
export const VOICE_RECORDING_OPTIONS: RecordingOptions = {
  extension: Platform.OS === "ios" ? ".wav" : ".aac",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 32000,
  isMeteringEnabled: true,
  android: {
    outputFormat: "aac_adts",
    audioEncoder: "aac",
    extension: ".aac",
  },
  ios: {
    extension: ".wav",
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.MEDIUM,
    sampleRate: 16000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 32000,
  },
};

export function voiceMimeType(): string {
  if (Platform.OS === "ios") return "audio/wav";
  if (Platform.OS === "web") return "audio/webm";
  return "audio/aac";
}

/** Shortest clip we bother sending — below this the user tapped by mistake. */
export const MIN_RECORDING_MS = 400;

/** Cap a turn so a stuck button cannot upload minutes of audio. */
export const MAX_RECORDING_SECONDS = 30;

export type VoiceClip = {
  base64: string;
  mimeType: string;
  bytes: number;
};

export async function readClip(uri: string): Promise<VoiceClip> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  if (!base64) throw new Error("The recording was empty.");

  return {
    base64,
    mimeType: voiceMimeType(),
    // Base64 inflates by 4/3; good enough for a "did we capture anything" check.
    bytes: Math.round((base64.length * 3) / 4),
  };
}

export async function deleteClip(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // Cache directory; the OS will reclaim it.
  }
}
