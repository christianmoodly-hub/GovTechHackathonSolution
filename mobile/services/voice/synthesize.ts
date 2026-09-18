import { httpsCallable } from "firebase/functions";
import { getFirebaseFunctions } from "../../firebase/client";
import type { AppLocale } from "../../i18n/types";

export type SynthesizeSpeechResult = {
  wav64: string;
  voiceCode: string;
  locale: string;
};

/**
 * Ask the Cloud Function to synthesize speech via Qfrency.
 * The Qfrency API key never leaves the server.
 */
export async function synthesizeSpeechRemote(
  text: string,
  locale: AppLocale,
): Promise<SynthesizeSpeechResult> {
  const callable = httpsCallable<
    { text: string; locale: AppLocale },
    SynthesizeSpeechResult
  >(getFirebaseFunctions(), "synthesizeSpeech");

  const result = await callable({ text, locale });
  const data = result.data;
  if (!data?.wav64 || typeof data.wav64 !== "string") {
    throw new Error("Speech synthesis returned no audio");
  }
  return data;
}
