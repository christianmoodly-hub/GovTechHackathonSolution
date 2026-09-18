import { createBundle, resolveLocale } from "../createBundle";

export type QuestionnaireChromeStrings = {
  nextQuestion: string;
  seeResults: string;
  back: string;
  previous: string;
  saveAndExit: string;
  saveProgressLater: string;
  autoSaveBadge: string;
  autoSaveHint: string;
  autoSaveCareer: string;
  progressComplete: (pct: number) => string;
  stepOf: (step: number, total: number) => string;
  minsRemaining: (mins: number) => string;
  restoredProgress: string;
  viewPastResults: string;
  retakeQuestionnaire: string;
  retakeDiagnostic: string;
  startDiagnostic: string;
  startInterestProfiler: string;
  previousResultsFound: string;
  needSignIn: string;
  couldNotSave: string;
  downloadBlueprint: string;
  preparingBlueprint: string;
  blueprintMeta: string;
  blueprintSaved: string;
  blueprintSavedBody: string;
  downloadFailed: string;
  downloadFailedBody: string;
  free: string;
  verifiedAssessment: string;
  saqaAligned: string;
  blueprintTitle: string;
  blueprintSub: string;
  calculateAps: string;
  indicativeAps: (score: string | number) => string;
  apsHint: string;
  noResultsTitle: string;
  noResultsBody: string;
  startQuestionnaire: string;
  pauseA11y: string;
  decisionsCrumb: string;
  homeCrumb: string;
  footerNote: string;
  guidanceNoteTitle: string;
  hollandKicker: string;
  jobFitModule: string;
  careerProfilerTitle: string;
  careerProfilerSubtitle: string;
};

const en: QuestionnaireChromeStrings = {
  nextQuestion: "Next Question",
  seeResults: "See results",
  back: "Back",
  previous: "Previous",
  saveAndExit: "Save & Exit (Resume anytime offline)",
  saveProgressLater: "Save Progress & Finish Later (Offline Friendly)",
  autoSaveBadge: "Auto-Save",
  autoSaveHint:
    "Answers saved on this device when you pause · syncs when online",
  autoSaveCareer:
    "Tap your choice. Your answers are automatically saved offline on this device.",
  progressComplete: (pct) => `${pct}% Complete`,
  stepOf: (step, total) => `Step ${step} of ${total}`,
  minsRemaining: (mins) => `Estimated ${mins} mins remaining`,
  restoredProgress: "Restored your saved progress on this device.",
  viewPastResults: "View past results",
  retakeQuestionnaire: "Retake questionnaire",
  retakeDiagnostic: "Retake diagnostic",
  startDiagnostic: "Start diagnostic",
  startInterestProfiler: "Start Interest Profiler",
  previousResultsFound:
    "Previous results found. View your matches or retake the diagnostic.",
  needSignIn: "You need to be signed in to save questionnaire results.",
  couldNotSave: "Could not save questionnaire results.",
  downloadBlueprint: "Download Offline Blueprint",
  preparingBlueprint: "Preparing Offline Blueprint…",
  blueprintMeta: "Official DHET PDF · Saved on device · Share to Files",
  blueprintSaved: "Blueprint saved",
  blueprintSavedBody:
    "PDF saved on this device. You can reopen it anytime from Saved → Offline Blueprints.",
  downloadFailed: "Download failed",
  downloadFailedBody: "Could not create your offline blueprint. Please try again.",
  free: "FREE",
  verifiedAssessment: "Verified Assessment",
  saqaAligned: "SAQA / DHET Aligned",
  blueprintTitle: "Your Personalized Career Blueprint",
  blueprintSub: "Isiqondiso Semisebenzi Yakho",
  calculateAps: "Calculate Admission Point Score",
  indicativeAps: (score) => `Indicative APS ${score}`,
  apsHint: "Use your subject package with NSC levels 1–7",
  noResultsTitle: "No results yet",
  noResultsBody:
    "Complete the questionnaire to see personalized occupation matches.",
  startQuestionnaire: "Start questionnaire",
  pauseA11y: "Pause questionnaire and save progress",
  decisionsCrumb: "Decisions",
  homeCrumb: "Home",
  footerNote:
    "Department of Higher Education & Training · National Career Advice Portal",
  guidanceNoteTitle: "Khetha Guidance Note",
  hollandKicker: "HOLLAND RIASEC · CAREER INTEREST PROFILER",
  jobFitModule: "MODULE: WORK ENVIRONMENT & TASK APTITUDE",
  careerProfilerTitle: "Career Interest Profiler",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const af: QuestionnaireChromeStrings = {
  nextQuestion: "Volgende vraag",
  seeResults: "Sien resultate",
  back: "Terug",
  previous: "Vorige",
  saveAndExit: "Stoor & Verlaat (Hervat enige tyd aflyn)",
  saveProgressLater: "Stoor vordering & voltooi later (aflynvriendelik)",
  autoSaveBadge: "Outo-stoor",
  autoSaveHint:
    "Antwoorde word op hierdie toestel gestoor wanneer jy pouseer · sinkroniseer aanlyn",
  autoSaveCareer:
    "Tik jou keuse. Jou antwoorde word outomaties aflyn op hierdie toestel gestoor.",
  progressComplete: (pct) => `${pct}% voltooi`,
  stepOf: (step, total) => `Stap ${step} van ${total}`,
  minsRemaining: (mins) => `Geskatte ${mins} min oor`,
  restoredProgress: "Jou gestoorde vordering is op hierdie toestel herstel.",
  viewPastResults: "Sien vorige resultate",
  retakeQuestionnaire: "Doen vraelys weer",
  retakeDiagnostic: "Doen diagnostiek weer",
  startDiagnostic: "Begin diagnostiek",
  startInterestProfiler: "Begin belangstellingsprofiel",
  previousResultsFound:
    "Vorige resultate gevind. Sien jou passende keuses of doen die diagnostiek weer.",
  needSignIn: "Jy moet aangemeld wees om vraelysresultate te stoor.",
  couldNotSave: "Kon nie vraelysresultate stoor nie.",
  downloadBlueprint: "Laai aflyn-bloudruk af",
  preparingBlueprint: "Berei aflyn-bloudruk voor…",
  blueprintMeta: "Amptelike DHET-PDF · Op toestel gestoor · Deel na Lêers",
  blueprintSaved: "Bloudruk gestoor",
  blueprintSavedBody:
    "PDF is op hierdie toestel gestoor. Heropen enige tyd vanaf Gestoor → Aflyn-bloudrukke.",
  downloadFailed: "Aflaai het misluk",
  downloadFailedBody:
    "Kon nie jou aflyn-bloudruk skep nie. Probeer asseblief weer.",
  free: "GRATIS",
  verifiedAssessment: "Geverifieerde assessering",
  saqaAligned: "SAQA / DHET-belyn",
  blueprintTitle: "Jou verpersoonlikte loopbaanbloudruk",
  blueprintSub: "Jou loopbaanriglyn",
  calculateAps: "Bereken toelatingspuntetelling",
  indicativeAps: (score) => `Indikatiewe APS ${score}`,
  apsHint: "Gebruik jou vakpakket met NSC-vlakke 1–7",
  noResultsTitle: "Nog geen resultate nie",
  noResultsBody:
    "Voltooi die vraelys om verpersoonlikte beroepspassings te sien.",
  startQuestionnaire: "Begin vraelys",
  pauseA11y: "Pouseer vraelys en stoor vordering",
  decisionsCrumb: "Besluite",
  homeCrumb: "Tuis",
  footerNote:
    "Departement van Hoër Onderwys en Opleiding · Nasionale Loopbaanadviesportaal",
  guidanceNoteTitle: "Khetha-riglynnota",
  hollandKicker: "HOLLAND RIASEC · LOOPBAANBELANGSTELLINGSPROFIEL",
  jobFitModule: "MODULE: WERKSOMGEWING & TAAKAPTITUDE",
  careerProfilerTitle: "Loopbaanbelangstellingsprofiel",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const zu: QuestionnaireChromeStrings = {
  nextQuestion: "Umbuzo olandelayo",
  seeResults: "Buka imiphumela",
  back: "Emuva",
  previous: "Okwangaphambilini",
  saveAndExit: "Londoloza & Phuma (Qhubeka noma nini ngaphandle kwe-inthanethi)",
  saveProgressLater:
    "Londoloza inqubekelaphambili & qeda kamuva (kulungele ngaphandle kwe-inthanethi)",
  autoSaveBadge: "Ukulondoloza okuzenzekelayo",
  autoSaveHint:
    "Izimpendulo zilondolozwa kule divayisi uma umisa · ziyavumelaniswa uma use-inthanethini",
  autoSaveCareer:
    "Thepha ukukhetha kwakho. Izimpendulo zakho zilondolozwa ngokuzenzakalelayo kule divayisi.",
  progressComplete: (pct) => `${pct}% Kuqediwe`,
  stepOf: (step, total) => `Isinyathelo ${step} kokungu-${total}`,
  minsRemaining: (mins) => `Cishe imizuzu engu-${mins} esele`,
  restoredProgress: "Kubuyiselwe inqubekelaphambili yakho egciniwe kule divayisi.",
  viewPastResults: "Buka imiphumela yangaphambilini",
  retakeQuestionnaire: "Phinda uhlu lwemibuzo",
  retakeDiagnostic: "Phinda ukuhlola",
  startDiagnostic: "Qala ukuhlola",
  startInterestProfiler: "Qala isihloli sentshisekelo",
  previousResultsFound:
    "Kutholakale imiphumela yangaphambilini. Buka okufanele noma uphinde ukuhlola.",
  needSignIn: "Kudingeka ungene ngemvume ukuze ulondoloze imiphumela yohlulwemibuzo.",
  couldNotSave: "Ayikwazanga ukulondoloza imiphumela yohlulwemibuzo.",
  downloadBlueprint: "Landa ipulani elingaxhuneki ku-inthanethi",
  preparingBlueprint: "Kulungiswa ipulani elingaxhuneki…",
  blueprintMeta: "I-PDF ye-DHET · Igcinwe kudivayisi · Yabelana namafayela",
  blueprintSaved: "Ipulani ilondoloziwe",
  blueprintSavedBody:
    "I-PDF igcinwe kule divayisi. Ungayivula noma nini ku-Okulondoloziwe → Amapulani angaxhuneki.",
  downloadFailed: "Ukulanda kuhlulekile",
  downloadFailedBody:
    "Ayikwazanga ukwakha ipulani yakho. Sicela uzame futhi.",
  free: "MAHHALA",
  verifiedAssessment: "Ukuhlola okuqinisekisiwe",
  saqaAligned: "Kuhambisana ne-SAQA / DHET",
  blueprintTitle: "Ipulani yakho yomsebenzi eqondene nawe",
  blueprintSub: "Isiqondiso Semisebenzi Yakho",
  calculateAps: "Bala amaphuzu okungena (APS)",
  indicativeAps: (score) => `I-APS ebonakalayo ${score}`,
  apsHint: "Sebenzisa iphakheji yezifundo zakho namazinga e-NSC 1–7",
  noResultsTitle: "Ayikho imiphumela okwamanje",
  noResultsBody:
    "Qeda uhlu lwemibuzo ukuze ubone imisebenzi ehambisana nawe.",
  startQuestionnaire: "Qala uhlu lwemibuzo",
  pauseA11y: "Misa uhlu lwemibuzo ulondoloze inqubekelaphambili",
  decisionsCrumb: "Izinqumo",
  homeCrumb: "Ikhaya",
  footerNote:
    "UMnyango Wezemfundo Ephakeme Nokuqeqeshwa · Iphothali Kazwelonke Yezeluleko Zomsebenzi",
  guidanceNoteTitle: "Inothi Lesiqondiso se-Khetha",
  hollandKicker: "HOLLAND RIASEC · ISIHLOLI SENTSHISEKELO YOMSEBENZI",
  jobFitModule: "IMODULI: INDAWO YOKUSEBENZA & UKULUNGELELA UMSEBENZI",
  careerProfilerTitle: "Isihloli Sentshisekelo Yomsebenzi",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const xh: QuestionnaireChromeStrings = {
  nextQuestion: "Umbuzo olandelayo",
  seeResults: "Jonga iziphumo",
  back: "Emva",
  previous: "Owangaphambili",
  saveAndExit: "Gcina & Phuma (Qhubeka nanini ngaphandle kwe-intanethi)",
  saveProgressLater:
    "Gcina inkqubela & gqiba kamva (kulungele ngaphandle kwe-intanethi)",
  autoSaveBadge: "Ukugcina okuzenzekelayo",
  autoSaveHint:
    "Iimpendulo zigcinwa kwesi sixhobo xa unqumama · ziyavumelaniswa xa ukwi-intanethi",
  autoSaveCareer:
    "Cofa ukhetho lwakho. Iimpendulo zakho zigcinwa ngokuzenzekelayo kwesi sixhobo.",
  progressComplete: (pct) => `${pct}% Gqityiwe`,
  stepOf: (step, total) => `Inyathelo ${step} kwi-${total}`,
  minsRemaining: (mins) => `Malunga nemizuzu engama-${mins} eseleyo`,
  restoredProgress: "Kubuyiselwe inkqubela yakho egciniweyo kwesi sixhobo.",
  viewPastResults: "Jonga iziphumo zangaphambili",
  retakeQuestionnaire: "Phinda uluhlu lwemibuzo",
  retakeDiagnostic: "Phinda uvavanyo",
  startDiagnostic: "Qala uvavanyo",
  startInterestProfiler: "Qala isihloli somdla",
  previousResultsFound:
    "Kufunyenwe iziphumo zangaphambili. Jonga ezikufaneleyo okanye uphinde uvavanyo.",
  needSignIn: "Kufuneka ungene ngemvume ukuze ugcine iziphumo zoluhlu lwemibuzo.",
  couldNotSave: "Ayikwazi ukugcina iziphumo zoluhlu lwemibuzo.",
  downloadBlueprint: "Khuphela iplani engaxhunywanga kwi-intanethi",
  preparingBlueprint: "Kulungiswa iplani engaxhunywanga…",
  blueprintMeta: "I-PDF ye-DHET · Igcinwe kwisixhobo · Yabelana neefayile",
  blueprintSaved: "Iplani igciniwe",
  blueprintSavedBody:
    "I-PDF igcinwe kwesi sixhobo. Ungayivula nanini kwi-Okugciniweyo → Iiplani ezingaxhunywanga.",
  downloadFailed: "Ukhuphelo aluphumelelanga",
  downloadFailedBody:
    "Ayikwazi ukwenza iplani yakho. Nceda uzame kwakhona.",
  free: "SIMAHLA",
  verifiedAssessment: "Uvavanyo oluqinisekisiweyo",
  saqaAligned: "Kuhambelana ne-SAQA / DHET",
  blueprintTitle: "Iplani yakho yomsebenzi eyenzelwe wena",
  blueprintSub: "Isiqondiso Semisebenzi Yakho",
  calculateAps: "Bala amanqaku okungena (APS)",
  indicativeAps: (score) => `I-APS ebonakalayo ${score}`,
  apsHint: "Sebenzisa iphakheji yezifundo zakho namanqanaba e-NSC 1–7",
  noResultsTitle: "Azikho iziphumo okwangoku",
  noResultsBody:
    "Gqiba uluhlu lwemibuzo ukuze ubone imisebenzi ehambelana nawe.",
  startQuestionnaire: "Qala uluhlu lwemibuzo",
  pauseA11y: "Nqumama uluhlu lwemibuzo ugcine inkqubela",
  decisionsCrumb: "Izigqibo",
  homeCrumb: "Ikhaya",
  footerNote:
    "ISebe leMfundo ePhakamileyo noQeqesho · Iphothali yeSizwe yeengCebiso zoMsebenzi",
  guidanceNoteTitle: "Inothi Lesiqondiso se-Khetha",
  hollandKicker: "HOLLAND RIASEC · ISIHLOLI SOMDLA WOMSEBENZI",
  jobFitModule: "IMODULI: INDAWO YOKUSEBENZA & UKULUNGELA UMSEBENZI",
  careerProfilerTitle: "Isihloli Somdla Womsebenzi",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const nr: QuestionnaireChromeStrings = {
  nextQuestion: "Umbuzo olandelako",
  seeResults: "Buka imiphumela",
  back: "Emuva",
  previous: "Okwangaphambilini",
  saveAndExit: "Londoloza & Phuma (Qhubeka noma nini ngaphandle kwe-inthanethi)",
  saveProgressLater:
    "Londoloza inqubekelaphambili & qeda kamuva (kulungele ngaphandle kwe-inthanethi)",
  autoSaveBadge: "Ukulondoloza okuzenzekelako",
  autoSaveHint:
    "Iimpendulo zilondolozwa kule divayisi ngesi uyeka · ziyavumelaniswa ngesi uku-inthanethini",
  autoSaveCareer:
    "Thebha ukukhetha kwakho. Iimpendulo zakho zilondolozwa ngokuzenzakalelako kule divayisi.",
  progressComplete: (pct) => `${pct}% Kuqedile`,
  stepOf: (step, total) => `Isinyathelo ${step} kokungu-${total}`,
  minsRemaining: (mins) => `Cishe imizuzu engu-${mins} esele`,
  restoredProgress: "Kubuyiselwe inqubekelaphambili yakho egcinweko kule divayisi.",
  viewPastResults: "Buka imiphumela yangaphambilini",
  retakeQuestionnaire: "Phinda uhlu lwemibuzo",
  retakeDiagnostic: "Phinda ukuhlola",
  startDiagnostic: "Qala ukuhlola",
  startInterestProfiler: "Qala isihloli sentshisekelo",
  previousResultsFound:
    "Kutholakale imiphumela yangaphambilini. Buka okufaneleko noma uphinde ukuhlola.",
  needSignIn: "Kudingeka ungene ngemvumo ukuze ulondoloze imiphumela yohlulwemibuzo.",
  couldNotSave: "Ayikghani ukulondoloza imiphumela yohlulwemibuzo.",
  downloadBlueprint: "Landa ipulani elingaxhumeki ku-inthanethi",
  preparingBlueprint: "Kulungiswa ipulani elingaxhumeki…",
  blueprintMeta: "I-PDF ye-DHET · Igcinwe kudivayisi · Yabelana namafayela",
  blueprintSaved: "Ipulani ilondoloziweko",
  blueprintSavedBody:
    "I-PDF igcinwe kule divayisi. Ungayivula noma nini ku-Okulondoloziweko → Amapulani angaxhumeki.",
  downloadFailed: "Ukulanda kuhlulekile",
  downloadFailedBody: "Ayikghani ukwakha ipulani yakho. Sicela uzame godu.",
  free: "MAHHALA",
  verifiedAssessment: "Ukuhlola okuqinisekisiweko",
  saqaAligned: "Kuhambisana ne-SAQA / DHET",
  blueprintTitle: "Ipulani yakho yomsebenzi eqondene nawe",
  blueprintSub: "Isiqondiso Semisebenzi Yakho",
  calculateAps: "Bala amaphuzu okungena (APS)",
  indicativeAps: (score) => `I-APS ebonakalako ${score}`,
  apsHint: "Sebenzisa iphakheji yezifundo zakho namazinga e-NSC 1–7",
  noResultsTitle: "Akukho miphumela okwamanje",
  noResultsBody:
    "Qeda uhlu lwemibuzo ukuze ubone imisebenzi ehambisana nawe.",
  startQuestionnaire: "Qala uhlu lwemibuzo",
  pauseA11y: "Misa uhlu lwemibuzo ulondoloze inqubekelaphambili",
  decisionsCrumb: "Iinqumo",
  homeCrumb: "Ikhaya",
  footerNote:
    "UMnyango Wezemfundo Ephakeme Nokuqeqeshwa · Iphothali Kazwelonke Yezeluleko Zomsebenzi",
  guidanceNoteTitle: "Inothi Lesiqondiso se-Khetha",
  hollandKicker: "HOLLAND RIASEC · ISIHLOLI SENTSHISEKELO YOMSEBENZI",
  jobFitModule: "IMODULI: INDAWO YOKUSEBENZA & UKULUNGELELA UMSEBENZI",
  careerProfilerTitle: "Isihloli Sentshisekelo Yomsebenzi",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const ss: QuestionnaireChromeStrings = {
  nextQuestion: "Umbuto lolandelako",
  seeResults: "Buka imiphumela",
  back: "Emuva",
  previous: "Lokwangaphambilini",
  saveAndExit: "Londoloza & Phuma (Chubeka noma nini ngaphandle kwe-inthanethi)",
  saveProgressLater:
    "Londoloza inqubekelaphambili & cedza kamuva (kulungele ngaphandle kwe-inthanethi)",
  autoSaveBadge: "Kulondoloza ngekuzenzekela",
  autoSaveHint:
    "Timphendvulo tilondolozwa kule divayisi uma umisa · tiyavumelaniswa uma use-inthanethini",
  autoSaveCareer:
    "Thepha lukhetfo lwakho. Timphendvulo takho tilondolozwa ngekuzenzakalela kule divayisi.",
  progressComplete: (pct) => `${pct}% Kucedziwe`,
  stepOf: (step, total) => `Sinyatselo ${step} ku-${total}`,
  minsRemaining: (mins) => `Cishe imizuzu lengu-${mins} lesele`,
  restoredProgress: "Kubuyiselwe inqubekelaphambili yakho legciniwe kule divayisi.",
  viewPastResults: "Buka imiphumela yangaphambilini",
  retakeQuestionnaire: "Phindza luhlu lwemibuto",
  retakeDiagnostic: "Phindza kuhlola",
  startDiagnostic: "Cala kuhlola",
  startInterestProfiler: "Cala sihloli sentshisekelo",
  previousResultsFound:
    "Kutfolakale imiphumela yangaphambilini. Buka lokufanele noma uphindze kuhlola.",
  needSignIn: "Kudingeka ungene ngemvumo kuze ulondoloze imiphumela yeluhlu lwemibuto.",
  couldNotSave: "Ayikwati kulondoloza imiphumela yeluhlu lwemibuto.",
  downloadBlueprint: "Layisha ipulani lengaxhumeki ku-inthanethi",
  preparingBlueprint: "Kulungiswa ipulani lengaxhumeki…",
  blueprintMeta: "I-PDF ye-DHET · Igcinwe kudivayisi · Yabelana namafayela",
  blueprintSaved: "Ipulani ilondoloziwe",
  blueprintSavedBody:
    "I-PDF igcinwe kule divayisi. Ungayivula noma nini ku-Lokulondoloziwe → Mapulani angaxhumeki.",
  downloadFailed: "Kulayisha kuhlulekile",
  downloadFailedBody: "Ayikwati kwakha ipulani yakho. Sicela uzame futsi.",
  free: "MAHHALA",
  verifiedAssessment: "Kuhlola lokuqinisekisiwe",
  saqaAligned: "Kuhambisana ne-SAQA / DHET",
  blueprintTitle: "Ipulani yakho yemsebenti lehlanganiswe nawe",
  blueprintSub: "Sicondziso Semisebenti Yakho",
  calculateAps: "Bala emaphuzu ekungena (APS)",
  indicativeAps: (score) => `I-APS lebonakalako ${score}`,
  apsHint: "Sebentisa iphakheji yetifundvo takho nemazinga e-NSC 1–7",
  noResultsTitle: "Akukho miphumela okwamanje",
  noResultsBody:
    "Cedza luhlu lwemibuto kuze ubone imisebenti lehambisana nawe.",
  startQuestionnaire: "Cala luhlu lwemibuto",
  pauseA11y: "Misa luhlu lwemibuto ulondoloze inqubekelaphambili",
  decisionsCrumb: "Tinchumo",
  homeCrumb: "Likhaya",
  footerNote:
    "UMnyango Wetimfundo Letiphakeme Nekuceceshwa · Iphothali Yesive Yeteluleko Temsebenti",
  guidanceNoteTitle: "Linothi Lesicondziso se-Khetha",
  hollandKicker: "HOLLAND RIASEC · SIHLOLI SENTSHISEKELO YEMSEBENTI",
  jobFitModule: "IMODULI: INDAWO YEKUSEBENTA & KULUNGELA UMSEBENTI",
  careerProfilerTitle: "Sihloli Sentshisekelo Yemsebenti",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const nso: QuestionnaireChromeStrings = {
  nextQuestion: "Potšišo ye e latelago",
  seeResults: "Bona dipoelo",
  back: "Morago",
  previous: "Ya pele",
  saveAndExit: "Boloka & Tšwa (Tšwela pele nako efe goba efe ntle le inthanete)",
  saveProgressLater:
    "Boloka tšwelopele & fetša morago (e loketše ntle le inthanete)",
  autoSaveBadge: "Go boloka ka boitšhireletšo",
  autoSaveHint:
    "Dikarabo di bolokwa sedirišweng se ge o khutša · di nyalantšhwa ge o le inthaneteng",
  autoSaveCareer:
    "Kgotla kgetho ya gago. Dikarabo tša gago di bolokwa ka boitšhireletšo sedirišweng se.",
  progressComplete: (pct) => `${pct}% E phethilwe`,
  stepOf: (step, total) => `Kgato ${step} ya ${total}`,
  minsRemaining: (mins) => `Metsotso ye e ka bago ${mins} e setšego`,
  restoredProgress: "Tšwelopele ya gago ye e bolokilwego e bušitšwe sedirišweng se.",
  viewPastResults: "Bona dipoelo tša pejana",
  retakeQuestionnaire: "Dira lenaneo la dipotšišo gape",
  retakeDiagnostic: "Dira teko gape",
  startDiagnostic: "Thoma teko",
  startInterestProfiler: "Thoma sehlahlobi sa kgahlego",
  previousResultsFound:
    "Go hweditšwe dipoelo tša pejana. Bona tše di swanago goba o dire teko gape.",
  needSignIn: "O swanetše go tsena gore o boloke dipoelo tša lenaneo la dipotšišo.",
  couldNotSave: "Ga se ya kgona go boloka dipoelo tša lenaneo la dipotšišo.",
  downloadBlueprint: "Taolla polane ya ntle le inthanete",
  preparingBlueprint: "Go lokišwa polane ya ntle le inthanete…",
  blueprintMeta: "PDF ya DHET · E bolokilwe sedirišweng · Abelana le difaele",
  blueprintSaved: "Polane e bolokilwe",
  blueprintSavedBody:
    "PDF e bolokilwe sedirišweng se. O ka e bula nako efe goba efe go Tše di bolokilwego → Dipolane tša ntle le inthanete.",
  downloadFailed: "Go taolla go padile",
  downloadFailedBody: "Ga se ya kgona go hlama polane ya gago. Hle leka gape.",
  free: "MAHALA",
  verifiedAssessment: "Teko ye e kgonthišeditšwego",
  saqaAligned: "E nyalantšhwa le SAQA / DHET",
  blueprintTitle: "Polane ya gago ya mošomo ye e ikgethilego",
  blueprintSub: "Tšhupetšo ya Mešomo ya Gago",
  calculateAps: "Bala dintlha tša go tsena (APS)",
  indicativeAps: (score) => `APS ye e bontšhago ${score}`,
  apsHint: "Diriša sephuthelwana sa gago sa dithuto le maemo a NSC 1–7",
  noResultsTitle: "Ga go na dipoelo gabjale",
  noResultsBody:
    "Phetha lenaneo la dipotšišo gore o bone mešomo ye e swanago le wena.",
  startQuestionnaire: "Thoma lenaneo la dipotšišo",
  pauseA11y: "Khutša lenaneo la dipotšišo o boloke tšwelopele",
  decisionsCrumb: "Diphetho",
  homeCrumb: "Gae",
  footerNote:
    "Kgoro ya Thuto ye e Phagamilego le Katiso · Phothale ya Bosetšhaba ya Keletšo ya Mošomo",
  guidanceNoteTitle: "Noutu ya Tšhupetšo ya Khetha",
  hollandKicker: "HOLLAND RIASEC · SEHLAHLOBI SA KGAHLEGO YA MOŠOMO",
  jobFitModule: "MOJULE: TIKOLOGY YA MOŠOMO & BOKGONI BJA MOŠOMO",
  careerProfilerTitle: "Sehlahlobi sa Kgahlego ya Mošomo",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const st: QuestionnaireChromeStrings = {
  nextQuestion: "Potso e latelang",
  seeResults: "Sheba liphetho",
  back: "Morao",
  previous: "E fetileng",
  saveAndExit: "Boloka & Tsoa (Tsoela pele neng kapa neng ntle le marang-rang)",
  saveProgressLater:
    "Boloka tsoelopele & qetella hamorao (e loketse ntle le marang-rang)",
  autoSaveBadge: "Ho boloka ka boithapo",
  autoSaveHint:
    "Likarabo li bolokoa sesebelisoeng sena ha u emisa · li nyallanngoa ha u le marang-rang",
  autoSaveCareer:
    "Tobetsa khetho ea hau. Likarabo tsa hau li bolokoa ka boithapo sesebelisoeng sena.",
  progressComplete: (pct) => `${pct}% E phethiloe`,
  stepOf: (step, total) => `Mohato ${step} oa ${total}`,
  minsRemaining: (mins) => `Metsotso e ka bang ${mins} e setseng`,
  restoredProgress: "Tsoelopele ea hau e bolokiloeng e khutlisitsoe sesebelisoeng sena.",
  viewPastResults: "Sheba liphetho tsa pele",
  retakeQuestionnaire: "Etsa lenane la lipotso hape",
  retakeDiagnostic: "Etsa tlhahlobo hape",
  startDiagnostic: "Qala tlhahlobo",
  startInterestProfiler: "Qala sehlahlobi sa thahasello",
  previousResultsFound:
    "Ho fumanoe liphetho tsa pele. Sheba tse u loketseng kapa u etse tlhahlobo hape.",
  needSignIn: "U tlameha ho kena hore u boloke liphetho tsa lenane la lipotso.",
  couldNotSave: "Ha ea khona ho boloka liphetho tsa lenane la lipotso.",
  downloadBlueprint: "Kenna polane ea ntle le marang-rang",
  preparingBlueprint: "Ho lokisoa polane ea ntle le marang-rang…",
  blueprintMeta: "PDF ea DHET · E bolokiloe sesebelisoeng · Arolelana le lifaele",
  blueprintSaved: "Polane e bolokiloe",
  blueprintSavedBody:
    "PDF e bolokiloe sesebelisoeng sena. U ka e bula neng kapa neng ho Tse bolokiloeng → Lipolane tsa ntle le marang-rang.",
  downloadFailed: "Ho kenna ha atleha",
  downloadFailedBody: "Ha ea khona ho theha polane ea hau. Ka kopo leka hape.",
  free: "MAHALA",
  verifiedAssessment: "Tlhahlobo e netefalitsoeng",
  saqaAligned: "E nyallanngoa le SAQA / DHET",
  blueprintTitle: "Polane ea hau ea mosebetsi e ikhethileng",
  blueprintSub: "Tataiso ea Mesebetsi ea Hao",
  calculateAps: "Bala lintlha tsa ho kena (APS)",
  indicativeAps: (score) => `APS e bontšang ${score}`,
  apsHint: "Sebelisa sephutheloana sa hau sa lithuto le maemo a NSC 1–7",
  noResultsTitle: "Ha ho liphetho hajoale",
  noResultsBody:
    "Qetella lenane la lipotso hore u bone mesebetsi e u loketseng.",
  startQuestionnaire: "Qala lenane la lipotso",
  pauseA11y: "Emisa lenane la lipotso u boloke tsoelopele",
  decisionsCrumb: "Liqeto",
  homeCrumb: "Hae",
  footerNote:
    "Lekala la Thuto e Phahameng le Koetliso · Portal ea Naha ea Likeletso tsa Mosebetsi",
  guidanceNoteTitle: "Noutu ea Tataiso ea Khetha",
  hollandKicker: "HOLLAND RIASEC · SEHLAHLOBI SA THAHASELLO EA MOSEBETSI",
  jobFitModule: "MOJULE: TIKOLOHO EA MOSEBETSI & BOKHONI BA MOSEBETSI",
  careerProfilerTitle: "Sehlahlobi sa Thahasello ea Mosebetsi",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const tn: QuestionnaireChromeStrings = {
  nextQuestion: "Potso e e latelang",
  seeResults: "Bona dipoelo",
  back: "Morago",
  previous: "E e fetileng",
  saveAndExit: "Boloka & Tswa (Tswelela nako nngwe le nngwe kwa ntle ga inthanete)",
  saveProgressLater:
    "Boloka tswelelopele & fetsa morago (e siametse kwa ntle ga inthanete)",
  autoSaveBadge: "Go boloka ka go itirisa",
  autoSaveHint:
    "Dikarabo di bolokwa mo sedirisong se fa o emisa · di nyalantshwa fa o le mo inthaneteng",
  autoSaveCareer:
    "Tobetsa tlhopho ya gago. Dikarabo tsa gago di bolokwa ka go itirisa mo sedirisong se.",
  progressComplete: (pct) => `${pct}% E weditswe`,
  stepOf: (step, total) => `Kgato ${step} ya ${total}`,
  minsRemaining: (mins) => `Metsotso e ka nnang ${mins} e setseng`,
  restoredProgress: "Tswelelopele ya gago e e bolokilweng e buseditswe mo sedirisong se.",
  viewPastResults: "Bona dipoelo tsa pele",
  retakeQuestionnaire: "Dira lenaneo la dipotso gape",
  retakeDiagnostic: "Dira teko gape",
  startDiagnostic: "Simolola teko",
  startInterestProfiler: "Simolola sehlahlobi sa kgatlhego",
  previousResultsFound:
    "Go fitlhetswe dipoelo tsa pele. Bona tse di tshwanetseng kgotsa o dire teko gape.",
  needSignIn: "O tshwanetse go tsena gore o boloke dipoelo tsa lenaneo la dipotso.",
  couldNotSave: "Ga e a kgona go boloka dipoelo tsa lenaneo la dipotso.",
  downloadBlueprint: "Kopolola polane ya kwa ntle ga inthanete",
  preparingBlueprint: "Go baakanyediwa polane ya kwa ntle ga inthanete…",
  blueprintMeta: "PDF ya DHET · E bolokilwe mo sedirisong · Abelana le difaele",
  blueprintSaved: "Polane e bolokilwe",
  blueprintSavedBody:
    "PDF e bolokilwe mo sedirisong se. O ka e bula nako nngwe le nngwe go Tse di bolokilweng → Dipolane tsa kwa ntle ga inthanete.",
  downloadFailed: "Go kopolola go paletswe",
  downloadFailedBody: "Ga e a kgona go tlhama polane ya gago. Tsweetswee leka gape.",
  free: "MAHALA",
  verifiedAssessment: "Teko e e netefaditsweng",
  saqaAligned: "E nyalantshwa le SAQA / DHET",
  blueprintTitle: "Polane ya gago ya tiro e e ikgethileng",
  blueprintSub: "Tshupiso ya Ditiro tsa Gago",
  calculateAps: "Bala dintlha tsa go tsena (APS)",
  indicativeAps: (score) => `APS e e bontshang ${score}`,
  apsHint: "Dirisa sephuthelwana sa gago sa dithuto le maemo a NSC 1–7",
  noResultsTitle: "Ga go na dipoelo ga jaana",
  noResultsBody:
    "Wedisa lenaneo la dipotso gore o bone ditiro tse di tshwanetseng wena.",
  startQuestionnaire: "Simolola lenaneo la dipotso",
  pauseA11y: "Emisa lenaneo la dipotso o boloke tswelelopele",
  decisionsCrumb: "Ditshwetso",
  homeCrumb: "Gae",
  footerNote:
    "Lefapha la Thuto e e Phagameng le Katiso · Phothale ya Bosetšhaba ya Keletšo ya Tiro",
  guidanceNoteTitle: "Noutu ya Tshupiso ya Khetha",
  hollandKicker: "HOLLAND RIASEC · SEHLAHLOBI SA KGATLHEGO YA TIRO",
  jobFitModule: "MOJULE: TIKOLOGY YA TIRO & BOKGONI JWA TIRO",
  careerProfilerTitle: "Sehlahlobi sa Kgatlhego ya Tiro",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const ve: QuestionnaireChromeStrings = {
  nextQuestion: "Mbudziso i tevhelaho",
  seeResults: "Vhonani mvelelo",
  back: "Murahu",
  previous: "Yo fhiraho",
  saveAndExit: "Vhulungani & Bvisani (Bvelani phanda tshifhinga tshiṅwe na tshiṅwe nnda ha inthanethe)",
  saveProgressLater:
    "Vhulungani mvelaphanda & fhedzisani nga murahu (yo lugiswa nnda ha inthanethe)",
  autoSaveBadge: "U vhulunga nga u ḓiitela",
  autoSaveHint:
    "Phindulo dzi vhulungwa kha tshishumiswa itshi musi ni tshi khou ima · dzi khwiniswa musi ni kha inthanethe",
  autoSaveCareer:
    "Kitikitelani khetho yanu. Phindulo dzanu dzi vhulungwa nga u ḓiitela kha tshishumiswa itshi.",
  progressComplete: (pct) => `${pct}% Yo fhela`,
  stepOf: (step, total) => `Tshiteṅwa ${step} tsha ${total}`,
  minsRemaining: (mins) => `Miminithi i nga vha ${mins} i salaho`,
  restoredProgress: "Mvelaphanda yanu yo vhulungwaho yo vhuedzedzwa kha tshishumiswa itshi.",
  viewPastResults: "Vhonani mvelelo dza kale",
  retakeQuestionnaire: "Itani muṅwalo wa mbudziso hafhu",
  retakeDiagnostic: "Itani u sedzulusa hafhu",
  startDiagnostic: "Thomani u sedzulusa",
  startInterestProfiler: "Thomani tshiṱolisisi tsha ḓaḓa",
  previousResultsFound:
    "Ho wanala mvelelo dza kale. Vhonani zwo teaho kana ni ite u sedzulusa hafhu.",
  needSignIn: "Ni tea u ḓa nga u tendelwa uri ni vhulunge mvelelo dza muṅwalo wa mbudziso.",
  couldNotSave: "A yo ngo kona u vhulunga mvelelo dza muṅwalo wa mbudziso.",
  downloadBlueprint: "Longolozani tshiga tsha nnda ha inthanethe",
  preparingBlueprint: "Hu khou lugiswa tshiga tsha nnda ha inthanethe…",
  blueprintMeta: "PDF ya DHET · Yo vhulungwa kha tshishumiswa · Faranani na faele",
  blueprintSaved: "Tshiga tsho vhulungwa",
  blueprintSavedBody:
    "PDF yo vhulungwa kha tshishumiswa itshi. Ni nga i vula tshifhinga tshiṅwe na tshiṅwe kha Zwo vhulungwaho → Zwiga zwa nnda ha inthanethe.",
  downloadFailed: "U longolosa ho kundelwa",
  downloadFailedBody: "A yo ngo kona u sika tshiga tshanu. Ni khou humbela u linga hafhu.",
  free: "MAHALA",
  verifiedAssessment: "U sedzulusa ho khwaṱhisedzwaho",
  saqaAligned: "Yo tevhedzana na SAQA / DHET",
  blueprintTitle: "Tshiga tshanu tsha mushumo tsho ḓoweledzwaho",
  blueprintSub: "Tshumisano ya Mishumo yanu",
  calculateAps: "Vhalani phointe dza u dzhena (APS)",
  indicativeAps: (score) => `APS i sumbedzaho ${score}`,
  apsHint: "Shumisani tshibugu tshanu tsha thero na milingo ya NSC 1–7",
  noResultsTitle: "A huna mvelelo zwino",
  noResultsBody:
    "Fhedzisani muṅwalo wa mbudziso uri ni vhone mishumo yo teaho kha inwi.",
  startQuestionnaire: "Thomani muṅwalo wa mbudziso",
  pauseA11y: "Imani muṅwalo wa mbudziso ni vhulunge mvelaphanda",
  decisionsCrumb: "Zwitatiso",
  homeCrumb: "Haya",
  footerNote:
    "Muhasho wa Pfunzo ya Nṱha na u Gudiwa · Portal ya Lushaka ya Nḓivhadzo ya Mushumo",
  guidanceNoteTitle: "Noutu ya Tshumisano ya Khetha",
  hollandKicker: "HOLLAND RIASEC · TSHIṰOLISISI TSHA ḒAḒA YA MUSHUMO",
  jobFitModule: "MODULE: VHUTHIHI HA MUSHUMO & VHUKONI HA MUSHUMO",
  careerProfilerTitle: "Tshiṱolisisi tsha Ḓaḓa ya Mushumo",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const ts: QuestionnaireChromeStrings = {
  nextQuestion: "Xivutiso lexi landzelaka",
  seeResults: "Languta mbuyelo",
  back: "Endzhaku",
  previous: "Lexi hundzeke",
  saveAndExit: "Hlayisa & Humesa (Yisa emahlweni nkarhi wun'wana ni wun'wana handle ka inthanete)",
  saveProgressLater:
    "Hlayisa ku ya emahlweni & hetisa endzhaku (yi lulamile handle ka inthanete)",
  autoSaveBadge: "Ku hlayisa hi ku tiendlekela",
  autoSaveHint:
    "Tinhlamulo ti hlayisiwa eka xitirhisiwa lexi loko u yima · ti fambisanisiwa loko u ri eka inthanete",
  autoSaveCareer:
    "Tshikelela hlawulo ra wena. Tinhlamulo ta wena ti hlayisiwa hi ku tiendlekela eka xitirhisiwa lexi.",
  progressComplete: (pct) => `${pct}% Yi hetisiwile`,
  stepOf: (step, total) => `Goza ${step} ra ${total}`,
  minsRemaining: (mins) => `Timinete leti nga va ${mins} leti salaka`,
  restoredProgress: "Ku ya emahlweni ka wena loku hlayisiweke ku tlheriseriwile eka xitirhisiwa lexi.",
  viewPastResults: "Languta mbuyelo ya khale",
  retakeQuestionnaire: "Endla nxaxamelo wa swivutiso nakambe",
  retakeDiagnostic: "Endla nkambelo nakambe",
  startDiagnostic: "Sungula nkambelo",
  startInterestProfiler: "Sungula xikambeli xa ku tsakela",
  previousResultsFound:
    "Ku kumiwile mbuyelo ya khale. Languta leswi fambelanaka kumbe u endle nkambelo nakambe.",
  needSignIn: "U fanele ku nghena leswaku u hlayisa mbuyelo ya nxaxamelo wa swivutiso.",
  couldNotSave: "A yi swi kotanga ku hlayisa mbuyelo ya nxaxamelo wa swivutiso.",
  downloadBlueprint: "Kopa pulani ya handle ka inthanete",
  preparingBlueprint: "Ku lulamisiwa pulani ya handle ka inthanete…",
  blueprintMeta: "PDF ya DHET · Yi hlayisiwile eka xitirhisiwa · Avelana na tifayela",
  blueprintSaved: "Pulani yi hlayisiwile",
  blueprintSavedBody:
    "PDF yi hlayisiwile eka xitirhisiwa lexi. U nga yi pfula nkarhi wun'wana ni wun'wana eka Swo hlayisiwa → Tipulani ta handle ka inthanete.",
  downloadFailed: "Ku kopa a ku humeleranga",
  downloadFailedBody: "A yi swi kotanga ku tumbuluxa pulani ya wena. Hi kombela u ringeta nakambe.",
  free: "MAHALA",
  verifiedAssessment: "Nkambelo lowu tiyisisiweke",
  saqaAligned: "Yi fambisana na SAQA / DHET",
  blueprintTitle: "Pulani ya wena ya ntirho leyi hlawuriweke",
  blueprintSub: "Xikombiso xa Mintirho ya Wena",
  calculateAps: "Hlayela tipointi ta ku nghena (APS)",
  indicativeAps: (score) => `APS leyi kombisaka ${score}`,
  apsHint: "Tirhisa xipakete xa wena xa tidyondzo na maemo ya NSC 1–7",
  noResultsTitle: "A ku na mbuyelo sweswi",
  noResultsBody:
    "Hetisa nxaxamelo wa swivutiso leswaku u vona mintirho leyi fambelanaka na wena.",
  startQuestionnaire: "Sungula nxaxamelo wa swivutiso",
  pauseA11y: "Yima nxaxamelo wa swivutiso u hlayise ku ya emahlweni",
  decisionsCrumb: "Swiboho",
  homeCrumb: "Kaya",
  footerNote:
    "Ndzawulo wa Dyondzo ya le Henhla na Vuleteri · Portal ya Rixaka ya Switsundzuxo swa Ntirho",
  guidanceNoteTitle: "Nouti ya Xikombiso xa Khetha",
  hollandKicker: "HOLLAND RIASEC · XIKAMBELI XA KU TSAKELA NTIRHO",
  jobFitModule: "MODULE: MBANGU WA NTIRHO & VUSWIKOTI BYA NTIRHO",
  careerProfilerTitle: "Xikambeli xa Ku Tsakela Ntirho",
  careerProfilerSubtitle: "Khetha NCAP • Holland RIASEC",
};

const CHROME_I18N = createBundle<QuestionnaireChromeStrings>({
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

export function getQuestionnaireChromeStrings(
  locale: string | null | undefined,
): QuestionnaireChromeStrings {
  return CHROME_I18N[resolveLocale(locale)];
}

/** @deprecated Prefer getQuestionnaireChromeStrings */
export function getChromeStrings(locale: string | null | undefined) {
  return getQuestionnaireChromeStrings(locale);
}
