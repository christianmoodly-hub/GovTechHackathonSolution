import type { AppLocale } from "./types";
import { createBundle, resolveLocale } from "./createBundle";

/** Deep-clone English and overlay per-locale partials for string leaves. */
export function overlayLocales<T extends Record<string, unknown>>(
  en: T,
  overlays: Partial<Record<Exclude<AppLocale, "en">, DeepPartial<T>>>,
): Record<AppLocale, T> {
  const result = { en } as Record<AppLocale, T>;
  const locales: Exclude<AppLocale, "en">[] = [
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
  ];
  for (const locale of locales) {
    result[locale] = deepMerge(en, overlays[locale] ?? {}) as T;
  }
  return createBundle(result);
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function deepMerge(base: unknown, overlay: unknown): unknown {
  if (overlay == null) return base;
  if (typeof base === "function" || typeof overlay === "function") {
    return overlay ?? base;
  }
  if (Array.isArray(base) || Array.isArray(overlay)) {
    return overlay ?? base;
  }
  if (typeof base === "object" && base && typeof overlay === "object" && overlay) {
    const out: Record<string, unknown> = {
      ...(base as Record<string, unknown>),
    };
    for (const [key, value] of Object.entries(overlay as Record<string, unknown>)) {
      out[key] = deepMerge(
        (base as Record<string, unknown>)[key],
        value,
      );
    }
    return out;
  }
  return overlay !== undefined ? overlay : base;
}

export { resolveLocale };
