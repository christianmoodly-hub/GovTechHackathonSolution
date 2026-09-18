import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { hmmFallback, isAppLocale, voiceForLocale } from "./voices";

initializeApp();

setGlobalOptions({
  region: "us-central1",
  maxInstances: 20,
});

const qfrencyApiKey = defineSecret("QFRENCY_API_KEY");

const QFRENCY_SYNTHESIZE = "https://tts.qfrency.com/api/v1/synthesize";
/** Soft cap so a runaway reply cannot burn the whole token pool. */
const MAX_CHARS = 600;

type SynthesizeRequest = {
  text?: unknown;
  locale?: unknown;
};

type SynthesizeResponse = {
  wav64: string;
  voiceCode: string;
  locale: string;
};

async function callQfrency(
  apiKey: string,
  voiceCode: string,
  text: string,
): Promise<{ ok: true; wav64: string } | { ok: false; status: number; message: string }> {
  const response = await fetch(QFRENCY_SYNTHESIZE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      "voice-code": voiceCode,
      text,
      "auto-clean": true,
      "auto-segmentation": true,
    }),
  });

  const body = (await response.json().catch(() => null)) as
    | { wav_64?: string; error?: { message?: string; code?: number } }
    | null;

  if (!response.ok || !body?.wav_64) {
    return {
      ok: false,
      status: response.status,
      message:
        body?.error?.message ??
        `Qfrency synthesize failed (${response.status})`,
    };
  }

  return { ok: true, wav64: body.wav_64 };
}

/**
 * Proxy to CSIR Qfrency TTS. The API key stays on the server.
 * Client sends { text, locale }; receives { wav64, voiceCode, locale }.
 */
export const synthesizeSpeech = onCall(
  {
    secrets: [qfrencyApiKey],
    // Auth preferred; anonymous Firebase users are fine. Unauthenticated
    // callers are allowed for pre-login demos — tighten before public launch.
    invoker: "public",
  },
  async (request): Promise<SynthesizeResponse> => {
    const apiKey = qfrencyApiKey.value();
    if (!apiKey) {
      throw new HttpsError(
        "failed-precondition",
        "Qfrency is not configured. Set the QFRENCY_API_KEY secret.",
      );
    }

    const data = (request.data ?? {}) as SynthesizeRequest;
    const locale = isAppLocale(data.locale) ? data.locale : "en";
    const raw =
      typeof data.text === "string" ? data.text.trim() : "";
    if (!raw) {
      throw new HttpsError("invalid-argument", "text is required");
    }

    const text = raw.length > MAX_CHARS ? `${raw.slice(0, MAX_CHARS).trim()}…` : raw;
    const preferred = voiceForLocale(locale);

    let result = await callQfrency(apiKey, preferred, text);

    // If DNN voice is not on this account, retry with the HMM twin.
    if (!result.ok && result.status === 400) {
      const fallback = hmmFallback(locale);
      if (fallback && fallback !== preferred) {
        result = await callQfrency(apiKey, fallback, text);
        if (result.ok) {
          return { wav64: result.wav64, voiceCode: fallback, locale };
        }
      }
    }

    if (!result.ok) {
      console.warn("[synthesizeSpeech]", result.status, result.message);
      throw new HttpsError(
        "unavailable",
        result.message || "Speech synthesis is unavailable right now.",
      );
    }

    return { wav64: result.wav64, voiceCode: preferred, locale };
  },
);
