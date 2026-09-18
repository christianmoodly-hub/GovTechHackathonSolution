import { APP_LOCALES, isAppLocale, type AppLocale } from "./types";

/** Build a locale map; TypeScript requires every AppLocale key. */
export function createBundle<T>(
  locales: Record<AppLocale, T>,
): Record<AppLocale, T> {
  for (const locale of APP_LOCALES) {
    if (locales[locale] == null) {
      throw new Error(`Missing i18n locale: ${locale}`);
    }
  }
  return locales;
}

/**
 * Author en/af/zu/xh/nso/ve/ts; derive Nguni (nr, ss) from zu and
 * Sotho-Tswana (st, tn) from nso.
 */
export function expandSaLocales<T>(partial: {
  en: T;
  af: T;
  zu: T;
  xh: T;
  nso: T;
  ve: T;
  ts: T;
}): Record<AppLocale, T> {
  return createBundle({
    en: partial.en,
    af: partial.af,
    zu: partial.zu,
    xh: partial.xh,
    nr: partial.zu,
    ss: partial.zu,
    nso: partial.nso,
    st: partial.nso,
    tn: partial.nso,
    ve: partial.ve,
    ts: partial.ts,
  });
}

export function resolveLocale(
  locale: string | null | undefined,
): AppLocale {
  return isAppLocale(locale) ? locale : "en";
}
