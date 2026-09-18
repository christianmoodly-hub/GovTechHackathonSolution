import type { AppLocale } from "./types";
import { isAppLocale } from "./types";

type TabStrings = {
  home: string;
  decisions: string;
  directory: string;
  saved: string;
  helpline: string;
};

const en: TabStrings = {
  home: "Home",
  decisions: "Decisions",
  directory: "Directory",
  saved: "Saved",
  helpline: "Helpline",
};

const zu: TabStrings = {
  home: "Ikhaya",
  decisions: "Izinqumo",
  directory: "Isizindalwazi",
  saved: "Okulondoloziwe",
  helpline: "Ulayini Wosizo",
};

const xh: TabStrings = {
  home: "Ikhaya",
  decisions: "Izigqibo",
  directory: "Isizindalwazi",
  saved: "Okugciniweyo",
  helpline: "Umgca Woncedo",
};

const af: TabStrings = {
  home: "Tuis",
  decisions: "Besluite",
  directory: "Gids",
  saved: "Gestoor",
  helpline: "Hulplyn",
};

const TAB_I18N: Record<AppLocale, TabStrings> = { en, zu, xh, af };

export function getTabStrings(locale: string | null | undefined): TabStrings {
  const key = isAppLocale(locale) ? locale : "en";
  return TAB_I18N[key];
}
