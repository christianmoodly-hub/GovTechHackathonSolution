export type AppLocale = "en" | "zu" | "xh" | "af";

export const APP_LOCALES: AppLocale[] = ["en", "zu", "xh", "af"];

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === "en" || value === "zu" || value === "xh" || value === "af";
}

/** @deprecated Use AppLocale — kept for existing home imports. */
export type HomeLocale = AppLocale;
