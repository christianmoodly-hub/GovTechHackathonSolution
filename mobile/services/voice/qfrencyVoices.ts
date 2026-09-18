import type { AppLocale } from "../../i18n/types";

/**
 * Preferred Qfrency voice codes per app locale (DNN when available).
 * @see https://github.com/qfrency/tts-cloud-api
 */
export const QFRENCY_VOICE_BY_LOCALE: Record<AppLocale, string> = {
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

/** HMM fallback when a DNN voice is not provisioned on the account. */
export const QFRENCY_HMM_FALLBACK: Partial<Record<AppLocale, string>> = {
  en: "eng-ZA-hmm-tim",
  af: "afr-ZA-hmm-kobus",
  zu: "zul-ZA-hmm-sifiso",
  xh: "xho-ZA-hmm-vuyo",
};

export function qfrencyVoiceForLocale(locale: AppLocale): string {
  return QFRENCY_VOICE_BY_LOCALE[locale];
}
