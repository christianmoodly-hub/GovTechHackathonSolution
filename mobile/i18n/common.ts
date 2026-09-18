import type { AppLocale } from "./types";
import { isAppLocale } from "./types";

type CommonStrings = {
  voiceLabel: string;
  preferredLanguage: string;
  online: string;
  offlineReady: string;
  loading: string;
  resetAccessibility: string;
  languageUpdated: string;
};

const en: CommonStrings = {
  voiceLabel: "Choose your language:",
  preferredLanguage: "Preferred language",
  online: "Online",
  offlineReady: "Offline Ready",
  loading: "Loading…",
  resetAccessibility: "Tap to reset accessibility",
  languageUpdated: "Language updated",
};

const zu: CommonStrings = {
  voiceLabel: "Khetha ulimi lwakho:",
  preferredLanguage: "Ulimi olukhethayo",
  online: "Ku-inthanethi",
  offlineReady: "Kulungele Ngaphandle Kwe-inthanethi",
  loading: "Iyalayisha…",
  resetAccessibility: "Thepha ukuze usethe kabusha ukufinyeleleka",
  languageUpdated: "Ulimi lubuyekeziwe",
};

const xh: CommonStrings = {
  voiceLabel: "Khetha ulwimi lwakho:",
  preferredLanguage: "Ulwimi olukhethiweyo",
  online: "Kwi-intanethi",
  offlineReady: "Kulungele ngaphandle kwe-intanethi",
  loading: "Iyalayisha…",
  resetAccessibility: "Cofa ukuseta kwakhona ufikelelo",
  languageUpdated: "Ulwimi luhlaziyiwe",
};

const af: CommonStrings = {
  voiceLabel: "Kies jou taal:",
  preferredLanguage: "Voorkeurtaal",
  online: "Aanlyn",
  offlineReady: "Aflyn gereed",
  loading: "Laai…",
  resetAccessibility: "Tik om toeganklikheid terug te stel",
  languageUpdated: "Taal opgedateer",
};

const COMMON_I18N: Record<AppLocale, CommonStrings> = { en, zu, xh, af };

export function getCommonStrings(
  locale: string | null | undefined,
): CommonStrings {
  const key = isAppLocale(locale) ? locale : "en";
  return COMMON_I18N[key];
}
