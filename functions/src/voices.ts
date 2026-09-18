/**
 * Preferred Qfrency voice codes (DNN when available).
 * Keep in sync with mobile/services/voice/qfrencyVoices.ts.
 */
export const QFRENCY_VOICE_BY_LOCALE: Record<string, string> = {
  en: "eng-ZA-dnn-tim",
  af: "afr-ZA-dnn-kobus",
  zu: "zul-ZA-dnn-sifiso",
  xh: "xho-ZA-dnn-zoleka",
  nr: "nbl-ZA-hmm-banele",
  ss: "ssw-ZA-hmm-temaswati",
  nso: "nso-ZA-hmm-mmapitsi",
  st: "sot-ZA-hmm-kamohelo",
  tn: "tsn-ZA-hmm-lethabo",
  ve: "ven-ZA-hmm-rabelani",
  ts: "tso-ZA-hmm-sasekani",
};

export const QFRENCY_HMM_FALLBACK: Record<string, string> = {
  en: "eng-ZA-hmm-tim",
  af: "afr-ZA-hmm-kobus",
  zu: "zul-ZA-hmm-sifiso",
  xh: "xho-ZA-hmm-vuyo",
};

const LOCALE_SET = new Set(Object.keys(QFRENCY_VOICE_BY_LOCALE));

export function isAppLocale(value: unknown): value is string {
  return typeof value === "string" && LOCALE_SET.has(value);
}

export function voiceForLocale(locale: string): string {
  return QFRENCY_VOICE_BY_LOCALE[locale] ?? QFRENCY_VOICE_BY_LOCALE.en;
}

export function hmmFallback(locale: string): string | undefined {
  return QFRENCY_HMM_FALLBACK[locale];
}
