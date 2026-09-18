import type { AppLocale } from "./types";
import { createBundle, resolveLocale } from "./createBundle";

export type CommonStrings = {
  voiceLabel: string;
  preferredLanguage: string;
  online: string;
  offline: string;
  offlineReady: string;
  loading: string;
  resetAccessibility: string;
  languageUpdated: string;
  cached: string;
  cancel: string;
  close: string;
  save: string;
  next: string;
  back: string;
  continue: string;
  search: string;
  retry: string;
  errorGeneric: string;
  selectLanguage: string;
  changeLanguage: string;
};

const en: CommonStrings = {
  voiceLabel: "Choose your language:",
  preferredLanguage: "Preferred language",
  online: "Online",
  offline: "Offline",
  offlineReady: "Offline Ready",
  loading: "Loading…",
  resetAccessibility: "Tap to reset accessibility",
  languageUpdated: "Language updated",
  cached: "Cached",
  cancel: "Cancel",
  close: "Close",
  save: "Save",
  next: "Next",
  back: "Back",
  continue: "Continue",
  search: "Search",
  retry: "Retry",
  errorGeneric: "Something went wrong. Please try again.",
  selectLanguage: "Select language",
  changeLanguage: "Change language",
};

const af: CommonStrings = {
  voiceLabel: "Kies jou taal:",
  preferredLanguage: "Voorkeurtaal",
  online: "Aanlyn",
  offline: "Aflyn",
  offlineReady: "Aflyn gereed",
  loading: "Laai…",
  resetAccessibility: "Tik om toeganklikheid terug te stel",
  languageUpdated: "Taal opgedateer",
  cached: "Gekasheer",
  cancel: "Kanselleer",
  close: "Sluit",
  save: "Stoor",
  next: "Volgende",
  back: "Terug",
  continue: "Gaan voort",
  search: "Soek",
  retry: "Probeer weer",
  errorGeneric: "Iets het verkeerd geloop. Probeer asseblief weer.",
  selectLanguage: "Kies taal",
  changeLanguage: "Verander taal",
};

const zu: CommonStrings = {
  voiceLabel: "Khetha ulimi lwakho:",
  preferredLanguage: "Ulimi olukhethayo",
  online: "Ku-inthanethi",
  offline: "Ngaphandle kwe-inthanethi",
  offlineReady: "Kulungele Ngaphandle Kwe-inthanethi",
  loading: "Iyalayisha…",
  resetAccessibility: "Thepha ukuze usethe kabusha ukufinyeleleka",
  languageUpdated: "Ulimi lubuyekeziwe",
  cached: "Kugciniwe",
  cancel: "Khansela",
  close: "Vala",
  save: "Londoloza",
  next: "Okulandelayo",
  back: "Emuva",
  continue: "Qhubeka",
  search: "Sesha",
  retry: "Zama futhi",
  errorGeneric: "Kukhona okungahambanga kahle. Sicela uzame futhi.",
  selectLanguage: "Khetha ulimi",
  changeLanguage: "Shintsha ulimi",
};

const xh: CommonStrings = {
  voiceLabel: "Khetha ulwimi lwakho:",
  preferredLanguage: "Ulwimi olukhethiweyo",
  online: "Kwi-intanethi",
  offline: "Ngaphandle kwe-intanethi",
  offlineReady: "Kulungele ngaphandle kwe-intanethi",
  loading: "Iyalayisha…",
  resetAccessibility: "Cofa ukuseta kwakhona ufikelelo",
  languageUpdated: "Ulwimi luhlaziyiwe",
  cached: "Kugciniwe",
  cancel: "Rhoxisa",
  close: "Vala",
  save: "Gcina",
  next: "Okulandelayo",
  back: "Emva",
  continue: "Qhubeka",
  search: "Khangela",
  retry: "Zama kwakhona",
  errorGeneric: "Kukho into engahambanga kakuhle. Nceda uzame kwakhona.",
  selectLanguage: "Khetha ulwimi",
  changeLanguage: "Tshintsha ulwimi",
};

const nr: CommonStrings = {
  voiceLabel: "Khetha ilimi lakho:",
  preferredLanguage: "Ilimi olikhethako",
  online: "Ku-inthanethi",
  offline: "Ngaphandle kwe-inthanethi",
  offlineReady: "Kulungele ngaphandle kwe-inthanethi",
  loading: "Iyalayida…",
  resetAccessibility: "Thebha ukuze usethe godu ukufinyelela",
  languageUpdated: "Ilimi libuyekeziwe",
  cached: "Kugcinwe",
  cancel: "Khansela",
  close: "Vala",
  save: "Londoloza",
  next: "Olandelako",
  back: "Emuva",
  continue: "Qhubeka",
  search: "Sesha",
  retry: "Zama godu",
  errorGeneric: "Kukhona okungahambanga kuhle. Sicela uzame godu.",
  selectLanguage: "Khetha ilimi",
  changeLanguage: "Tjhugulula ilimi",
};

const ss: CommonStrings = {
  voiceLabel: "Khetsa lulwimi lwakho:",
  preferredLanguage: "Lulwimi lolukhetsile",
  online: "Ku-inthanethi",
  offline: "Ngaphandle kwe-inthanethi",
  offlineReady: "Kulungele ngaphandle kwe-inthanethi",
  loading: "Iyalayisha…",
  resetAccessibility: "Thepha kuze usete kabusha kufinyeleleka",
  languageUpdated: "Lulwimi lubuyekeziwe",
  cached: "Kugciniwe",
  cancel: "Khansela",
  close: "Vala",
  save: "Londoloza",
  next: "Lokulandelako",
  back: "Emuva",
  continue: "Chubeka",
  search: "Sesha",
  retry: "Zama futsi",
  errorGeneric: "Kukhona lokungahambanga kahle. Sicela uzame futsi.",
  selectLanguage: "Khetsa lulwimi",
  changeLanguage: "Shintja lulwimi",
};

const nso: CommonStrings = {
  voiceLabel: "Kgetha polelo ya gago:",
  preferredLanguage: "Polelo ye o e kgethago",
  online: "Inthaneteng",
  offline: "Ntle le inthanete",
  offlineReady: "E loketše ntle le inthanete",
  loading: "E a laolla…",
  resetAccessibility: "Kgotla go beakanya gape phihlelelo",
  languageUpdated: "Polelo e mpshafaditšwe",
  cached: "E bolokilwe",
  cancel: "Khansela",
  close: "Tswala",
  save: "Boloka",
  next: "Latelago",
  back: "Morago",
  continue: "Tšwela pele",
  search: "Nyaka",
  retry: "Leka gape",
  errorGeneric: "Go na le seo se sa sepago gabotse. Hle leka gape.",
  selectLanguage: "Kgetha polelo",
  changeLanguage: "Fetola polelo",
};

const st: CommonStrings = {
  voiceLabel: "Khetha puo ea hao:",
  preferredLanguage: "Puo eo u e khethang",
  online: "Marang-rang",
  offline: "Ntle le marang-rang",
  offlineReady: "E loketse ntle le marang-rang",
  loading: "E a jarolla…",
  resetAccessibility: "Tobetsa ho hlophisa bocha phihlello",
  languageUpdated: "Puo e ntlafalitsoe",
  cached: "E bolokiloe",
  cancel: "Hlakola",
  close: "Koala",
  save: "Boloka",
  next: "E latelang",
  back: "Morao",
  continue: "Tsoela pele",
  search: "Batla",
  retry: "Leka hape",
  errorGeneric: "Ho na le se sa tsamaeeng hantle. Ka kopo leka hape.",
  selectLanguage: "Khetha puo",
  changeLanguage: "Fetola puo",
};

const tn: CommonStrings = {
  voiceLabel: "Tlhopha puo ya gago:",
  preferredLanguage: "Puo e o e tlhophang",
  online: "Mo inthaneteng",
  offline: "Kwa ntle ga inthanete",
  offlineReady: "E siametse kwa ntle ga inthanete",
  loading: "E a laola…",
  resetAccessibility: "Tobetsa go rulaganya gape phitlhelelo",
  languageUpdated: "Puo e ntšhwafaditswe",
  cached: "E bolokilwe",
  cancel: "Khansela",
  close: "Tswala",
  save: "Boloka",
  next: "E e latelang",
  back: "Morago",
  continue: "Tswelela",
  search: "Batla",
  retry: "Leka gape",
  errorGeneric: "Go na le se se sa tsamaeng sentle. Tsweetswee leka gape.",
  selectLanguage: "Tlhopha puo",
  changeLanguage: "Fetola puo",
};

const ve: CommonStrings = {
  voiceLabel: "Nangani luambo lwanu:",
  preferredLanguage: "Luambo lune na lu nanga",
  online: "Kha inthanethe",
  offline: "Nnda ha inthanethe",
  offlineReady: "Yo lugiswa nnda ha inthanethe",
  loading: "I khou longolosa…",
  resetAccessibility: "Kitikitelani u dovholola u swikelela",
  languageUpdated: "Luambo lo khwiniswa",
  cached: "Yo vhulungwa",
  cancel: "Khansela",
  close: "Valani",
  save: "Vhulungani",
  next: "I tevhelaho",
  back: "Murahu",
  continue: "Bvelani phanda",
  search: "Tolgoni",
  retry: "Lingani hafhu",
  errorGeneric: "Hu na zwi songo tshimbilaho zwavhudi. Ni khou humbela u linga hafhu.",
  selectLanguage: "Nangani luambo",
  changeLanguage: "Shandukisani luambo",
};

const ts: CommonStrings = {
  voiceLabel: "Hlawula ririmi ra wena:",
  preferredLanguage: "Ririmi leri u ri hlawulaka",
  online: "Eka inthanete",
  offline: "Handle ka inthanete",
  offlineReady: "Yi lulamile handle ka inthanete",
  loading: "Yi layicha…",
  resetAccessibility: "Tshikelela ku veka nakambe ku fikelela",
  languageUpdated: "Ririmi ri hundluriwile",
  cached: "Yi hlayisiwile",
  cancel: "Khansela",
  close: "Pfala",
  save: "Hlayisa",
  next: "Leyi landzelaka",
  back: "Endzhaku",
  continue: "Yisa emahlweni",
  search: "Lava",
  retry: "Ringeta nakambe",
  errorGeneric: "Ku na leswi nga fambangiki kahle. Hi kombela u ringeta nakambe.",
  selectLanguage: "Hlawula ririmi",
  changeLanguage: "Cinca ririmi",
};

const COMMON_I18N = createBundle<CommonStrings>({
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

export function getCommonStrings(
  locale: string | null | undefined,
): CommonStrings {
  return COMMON_I18N[resolveLocale(locale)];
}
