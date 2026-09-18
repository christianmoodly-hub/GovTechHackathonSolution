import type { AppLocale } from "./types";
import { createBundle, resolveLocale } from "./createBundle";

export type TabStrings = {
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

const af: TabStrings = {
  home: "Tuis",
  decisions: "Besluite",
  directory: "Gids",
  saved: "Gestoor",
  helpline: "Hulplyn",
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

const nr: TabStrings = {
  home: "Ikhaya",
  decisions: "Iinqumo",
  directory: "Isizindalwazi",
  saved: "Okulondoloziweko",
  helpline: "Ulayini Wosizo",
};

const ss: TabStrings = {
  home: "Likhaya",
  decisions: "Tinchumo",
  directory: "Silulu Selwati",
  saved: "Lokulondoloziwe",
  helpline: "Ulayini Wesito",
};

const nso: TabStrings = {
  home: "Gae",
  decisions: "Diphetho",
  directory: "Tšhupetšo",
  saved: "Tše di bolokilwego",
  helpline: "Mogala wa Thušo",
};

const st: TabStrings = {
  home: "Hae",
  decisions: "Liqeto",
  directory: "Tataiso",
  saved: "Tse bolokiloeng",
  helpline: "Mohala oa Thuso",
};

const tn: TabStrings = {
  home: "Gae",
  decisions: "Ditshwetso",
  directory: "Tshupiso",
  saved: "Tse di bolokilweng",
  helpline: "Mogala wa Thuso",
};

const ve: TabStrings = {
  home: "Haya",
  decisions: "Zwitatiso",
  directory: "Tshumisano",
  saved: "Zwo vhulungwaho",
  helpline: "Lutingo lwa Thuso",
};

const ts: TabStrings = {
  home: "Kaya",
  decisions: "Swiboho",
  directory: "Xikombiso",
  saved: "Swo hlayisiwa",
  helpline: "Noyini wa Mpfuno",
};

const TAB_I18N = createBundle<TabStrings>({
  en,
  af,
  zu,
  xh,
  nr,
  ss,
  nso,
  st,
  tn,
  ve,
  ts,
});

export function getTabStrings(locale: string | null | undefined): TabStrings {
  return TAB_I18N[resolveLocale(locale)];
}
