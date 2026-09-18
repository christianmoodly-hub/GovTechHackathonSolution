export type AppLocale =
  | "en"
  | "af"
  | "zu"
  | "xh"
  | "nr"
  | "ss"
  | "nso"
  | "st"
  | "tn"
  | "ve"
  | "ts";

export const APP_LOCALES: readonly AppLocale[] = [
  "en",
  "af",
  "zu",
  "xh",
  "nr",
  "ss",
  "nso",
  "st",
  "tn",
  "ve",
  "ts",
] as const;

const LOCALE_SET = new Set<string>(APP_LOCALES);

export function isAppLocale(
  value: string | null | undefined,
): value is AppLocale {
  return typeof value === "string" && LOCALE_SET.has(value);
}

/** @deprecated Use AppLocale — kept for existing home imports. */
export type HomeLocale = AppLocale;

/** Native endonyms for language picker / profile pill. */
export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  af: "Afrikaans",
  zu: "isiZulu",
  xh: "isiXhosa",
  nr: "isiNdebele",
  ss: "siSwati",
  nso: "Sepedi",
  st: "Sesotho",
  tn: "Setswana",
  ve: "Tshivenda",
  ts: "Xitsonga",
};
