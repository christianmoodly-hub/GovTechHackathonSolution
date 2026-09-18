import { expandSaLocales, resolveLocale } from "../createBundle";

export type QuestionnaireChromeStrings = {
  next: string;
  nextQuestion: string;
  back: string;
  saveExit: string;
  saveProgressLater: string;
  progressComplete: (pct: number) => string;
  autoSaveHint: string;
  start: string;
  startDiagnostic: string;
  startInterestProfiler: string;
  retake: string;
  seeResults: string;
  offlineDraft: string;
  draftRestored: string;
  pauseSave: string;
  questionOf: (step: number, total: number) => string;
  continueLabel: string;
};

const en: QuestionnaireChromeStrings = {
  next: "Next",
  nextQuestion: "Next Question",
  back: "Back",
  saveExit: "Save & Exit",
  saveProgressLater: "Save Progress & Finish Later (Offline Friendly)",
  start: "Start",
  startDiagnostic: "Start diagnostic",
  startInterestProfiler: "Start Interest Profiler",
  retake: "Retake questionnaire",
  seeResults: "See results",
  offlineDraft: "Offline draft saved",
  draftRestored: "Restored your saved progress on this device.",
  pauseSave: "Pause questionnaire and save progress",
  continueLabel: "Continue",
  autoSaveHint: "Tap your choice. Your answers are automatically saved offline on this device.",
  progressComplete: (pct) => `${pct}% Complete`,
  questionOf: (step, total) => `Question ${step} of ${total}`
};

const af: QuestionnaireChromeStrings = {
  next: "Volgende",
  nextQuestion: "Volgende vraag",
  back: "Terug",
  saveExit: "Stoor & Verlaat",
  saveProgressLater: "Stoor vordering & eindig later (aflyn-vriendelik)",
  start: "Begin",
  startDiagnostic: "Begin diagnostiek",
  startInterestProfiler: "Begin Belangstellingsprofiler",
  retake: "Herkies vraelys",
  seeResults: "Sien resultate",
  offlineDraft: "Aflyn-konsep gestoor",
  draftRestored: "Jou gestoorde vordering is op hierdie toestel herstel.",
  pauseSave: "Pouseer vraelys en stoor vordering",
  continueLabel: "Gaan voort",
  autoSaveHint: "Tik jou keuse. Jou antwoorde word outomaties aflyn op hierdie toestel gestoor.",
  progressComplete: (pct) => `${pct}% Voltooi`,
  questionOf: (step, total) => `Vraag ${step} van ${total}`
};

const zu: QuestionnaireChromeStrings = {
  next: "Okulandelayo",
  nextQuestion: "Umbuzo Olandelayo",
  back: "Emuva",
  saveExit: "Londoloza & Phuma",
  saveProgressLater: "Londoloza Inqubekelaphambili & Qeda Kamuva (Kulungele Ngaphandle Kwe-inthanethi)",
  start: "Qala",
  startDiagnostic: "Qala ukuhlola",
  startInterestProfiler: "Qala I-Interest Profiler",
  retake: "Phinda uhlu lwemibuzo",
  seeResults: "Buka imiphumela",
  offlineDraft: "Uhlaka lwangaphandle kwe-inthanethi lulondoloziwe",
  draftRestored: "Kubuyiselwe inqubekelaphambili yakho elondoloziwe kule divayisi.",
  pauseSave: "Misa uhlu lwemibuzo futhi ulondoloze inqubekelaphambili",
  continueLabel: "Qhubeka",
  autoSaveHint: "Thepha ukukhetha kwakho. Izimpendulo zakho zilondolozwa ngokuzenzakalelayo ngaphandle kwe-inthanethi kule divayisi.",
  progressComplete: (pct) => `${pct}% Kuqediwe`,
  questionOf: (step, total) => `Umbuzo ${step} kwangu-${total}`
};

const xh: QuestionnaireChromeStrings = {
  next: "Okulandelayo",
  nextQuestion: "Umbuzo Olandelayo",
  back: "Emva",
  saveExit: "Gcina & Phuma",
  saveProgressLater: "Gcina Inkqubela & Gqiba Kamva (Kulungele Ngaphandle Kwe-intanethi)",
  start: "Qala",
  startDiagnostic: "Qala ukuhlola",
  startInterestProfiler: "Qala I-Interest Profiler",
  retake: "Phinda uluhlu lwemibuzo",
  seeResults: "Jonga iziphumo",
  offlineDraft: "Uyilo lwangaphandle kwe-intanethi lugciniwe",
  draftRestored: "Kubuyiselwe inkqubela yakho egciniweyo kwesi sixhobo.",
  pauseSave: "Nqumama uluhlu lwemibuzo uze ugcine inkqubela",
  continueLabel: "Qhubeka",
  autoSaveHint: "Cofa ukhetho lwakho. Iimpendulo zakho zigcinwa ngokuzenzekelayo ngaphandle kwe-intanethi kwesi sixhobo.",
  progressComplete: (pct) => `${pct}% Kugqityiwe`,
  questionOf: (step, total) => `Umbuzo ${step} kwali-${total}`
};

const nso: QuestionnaireChromeStrings = {
  next: "E latelang",
  nextQuestion: "Potšišo e Latelang",
  back: "Morao",
  saveExit: "Boloka & Tšwa",
  saveProgressLater: "Boloka Tšwelopele & Feditša Morago (E loketše ntle le inthanete)",
  start: "Thoma",
  startDiagnostic: "Thoma teko",
  startInterestProfiler: "Thoma Interest Profiler",
  retake: "Bušeletša lenaneo la dipotšišo",
  seeResults: "Bona dipoelo",
  offlineDraft: "Draft ya ntle le inthanete e bolokilwe",
  draftRestored: "Go bušetšwa tšwelopele ya gago ye e bolokilwego sedirišweng se.",
  pauseSave: "Emiša lenaneo la dipotšišo o boloke tšwelopele",
  continueLabel: "Tšwela pele",
  autoSaveHint: "Tobetsa kgetho ya gago. Dikarabo tša gago di bolokwa ka go itiriša ntle le inthanete sedirišweng se.",
  progressComplete: (pct) => `${pct}% E feditšwe`,
  questionOf: (step, total) => `Potšišo ${step} ya ${total}`
};

const ve: QuestionnaireChromeStrings = {
  next: "I tevhelaho",
  nextQuestion: "Mbudziso i Tevhelaho",
  back: "Murahu",
  saveExit: "Vhulungani & Budani",
  saveProgressLater: "Vhulungani Mvelaphanda & Fhedzisani Murahu (Yo lugiswa nnda ha inthanethe)",
  start: "Thomani",
  startDiagnostic: "Thomani u sedzulusa",
  startInterestProfiler: "Thomani Interest Profiler",
  retake: "Dovholani mutevhe wa mibudziso",
  seeResults: "Sedzani mvelelo",
  offlineDraft: "Draft ya nnda ha inthanethe yo vhulungwa",
  draftRestored: "Ho vhuedzedzwa mvelaphanda yanu yo vhulungiwaho kha itshi tshishumiswa.",
  pauseSave: "Imisani mutevhe wa mibudziso ni vhulunge mvelaphanda",
  continueLabel: "Bvelani phanda",
  autoSaveHint: "Kitikitelani khetho yanu. Phindulo dzanu dzi vhulungwa nga u ḓiitela nnda ha inthanethe kha itshi tshishumiswa.",
  progressComplete: (pct) => `${pct}% Yo fhedziswa`,
  questionOf: (step, total) => `Mbudziso ${step} ya ${total}`
};

const ts: QuestionnaireChromeStrings = {
  next: "Leyi landzelaka",
  nextQuestion: "Xivutiso lexi Landzelaka",
  back: "Endzhaku",
  saveExit: "Hlayisa & Huma",
  saveProgressLater: "Hlayisa Ndzulamiso & Hetisa Endzhaku (Yi lulamile handle ka inthanete)",
  start: "Sungula",
  startDiagnostic: "Sungula ku kambela",
  startInterestProfiler: "Sungula Interest Profiler",
  retake: "Phindza nxaxamelo wa swivutiso",
  seeResults: "Vona mbuyelo",
  offlineDraft: "Draft ya handle ka inthanete yi hlayisiwile",
  draftRestored: "Ku vuyiseriwile ndzulamiso ya wena leyi hlayisiweke eka xitirhisiwa lexi.",
  pauseSave: "Yimisa nxaxamelo wa swivutiso u hlayisa ndzulamiso",
  continueLabel: "Yisa emahlweni",
  autoSaveHint: "Tshikelela nhlawulo ya wena. Tinhlamulo ta wena ti hlayisiwa hi ku tiendlekela handle ka inthanete eka xitirhisiwa lexi.",
  progressComplete: (pct) => `${pct}% Yi herile`,
  questionOf: (step, total) => `Xivutiso ${step} xa ${total}`
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getQuestionnaireChromeStrings(
  locale: string | null | undefined,
): QuestionnaireChromeStrings {
  return BUNDLE[resolveLocale(locale)];
}
