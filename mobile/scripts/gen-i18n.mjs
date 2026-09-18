/**
 * Generates remaining i18n TypeScript modules for GovTech2026 mobile.
 * Run: node scripts/gen-i18n.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18n = path.join(__dirname, "..", "i18n");
const qDir = path.join(i18n, "questionnaires");
fs.mkdirSync(qDir, { recursive: true });

function write(rel, content) {
  const full = path.join(i18n, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

const importTop = `import { expandSaLocales, resolveLocale } from "./createBundle";\n`;
const importQ = `import { expandSaLocales, resolveLocale } from "../createBundle";\n`;

function bundleExport(getter, typeName) {
  return `
const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function ${getter}(
  locale: string | null | undefined,
): ${typeName} {
  return BUNDLE[resolveLocale(locale)];
}
`;
}

// ---------- ONBOARDING ----------
const onboardingType = `{
  govLabel: string;
  govSub: string;
  zeroRated: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  whoAreYou: string;
  required: string;
  roles: Record<
    | "grade10"
    | "grade11"
    | "grade12"
    | "below_grade10"
    | "tertiary"
    | "work_seeker"
    | "parent"
    | "teacher"
    | "practitioner",
    { label: string; description: string }
  >;
  disabilityStatus: string;
  disabilityQuestion: string;
  yes: string;
  no: string;
  disabilities: Record<"visual" | "hearing" | "physical" | "learning", string>;
  offlineTitle: string;
  offlineBody: string;
  startExploring: string;
  startExploringSub: string;
  continueGuest: string;
  quote: string;
  quoteAttr: string;
  errorSave: string;
  errorGuest: string;
}`;

function roles(l10, d10, l11, d11, l12, d12, lbg, dbg, lt, dt, lw, dw, lp, dp, lte, dte, lpr, dpr) {
  return {
    grade10: { label: l10, description: d10 },
    grade11: { label: l11, description: d11 },
    grade12: { label: l12, description: d12 },
    below_grade10: { label: lbg, description: dbg },
    tertiary: { label: lt, description: dt },
    work_seeker: { label: lw, description: dw },
    parent: { label: lp, description: dp },
    teacher: { label: lte, description: dte },
    practitioner: { label: lpr, description: dpr },
  };
}

const onboarding = {
  en: {
    govLabel: "REPUBLIC OF SOUTH AFRICA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Zero-Rated Portal",
    heroKicker: "NATIONAL CAREER ADVICE PORTAL",
    heroTitle: "Welcome to Khetha NCAP",
    heroBody: "Please complete below for statistics & tailored guidance.",
    whoAreYou: "Who are you? (Select your current role)",
    required: "Required",
    roles: roles(
      "Grade 10 Learner", "Subject choice & future study stream",
      "Grade 11 Learner", "Early tertiary & TVET benchmark",
      "Grade 12 Learner", "Matric final prep, CAO & NSFAS",
      "Less than Grade 10", "Senior phase guidance & TVET access",
      "Student (Tertiary / TVET)", "Colleges, artisan trades & diplomas",
      "Work Seeker", "Upskilling, learnerships & jobs",
      "Parent / Guardian", "Guiding youth through career paths",
      "Career Guidance Teacher", "Life Orientation & classroom tools",
      "Career Practitioner", "Professional advisory diagnostic tools",
    ),
    disabilityStatus: "Disability Status",
    disabilityQuestion: "Are you a person living with a disability?",
    yes: "Yes",
    no: "No",
    disabilities: { visual: "Visual", hearing: "Hearing", physical: "Physical", learning: "Learning" },
    offlineTitle: "Works offline after first sync",
    offlineBody: "Browse cached careers and continue questionnaires without signal. Favourites and results save on device and sync when you reconnect.",
    startExploring: "Start Exploring / Qala",
    startExploringSub: "Unlock personalized study pathways",
    continueGuest: "Continue as Guest",
    quote: "Education is the most powerful weapon which you can use to change the world.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "Could not save your profile details.",
    errorGuest: "Guest mode unavailable.",
  },
  af: {
    govLabel: "REPUBLIEK VAN SUID-AFRIKA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Nul-gegradeerde portaal",
    heroKicker: "NASIONALE LOOPBAANADVIESPORTAAL",
    heroTitle: "Welkom by Khetha NCAP",
    heroBody: "Voltooi asseblief hieronder vir statistiek & pasgemaakte leiding.",
    whoAreYou: "Wie is jy? (Kies jou huidige rol)",
    required: "Verpligtend",
    roles: roles(
      "Graad 10-leerder", "Vakkeuse & toekomstige studierigting",
      "Graad 11-leerder", "Vroeë tersiêre & TVET-maatstaf",
      "Graad 12-leerder", "Matriek-eindvoorbereiding, CAO & NSFAS",
      "Minder as Graad 10", "Seniorfase-leiding & TVET-toegang",
      "Student (Tersiêr / TVET)", "Kolleges, ambagte & diplomas",
      "Werksoeker", "Opgradering, leerlingskappe & werk",
      "Ouer / Voog", "Lei jeug deur loopbaanpaaie",
      "Loopbaanbegeleidingsonderwyser", "Lewensoriëntering & klaskamerhulpmiddels",
      "Loopbaanpraktisyn", "Professionele adviserende diagnostiese hulpmiddels",
    ),
    disabilityStatus: "Gestremdheidstatus",
    disabilityQuestion: "Is jy 'n persoon wat met 'n gestremdheid leef?",
    yes: "Ja",
    no: "Nee",
    disabilities: { visual: "Visueel", hearing: "Gehoor", physical: "Fisies", learning: "Leer" },
    offlineTitle: "Werk aflyn na eerste sinkronisering",
    offlineBody: "Blaai deur gekaste loopbane en gaan voort met vraelyste sonder sein. Gunstelinge en resultate stoor op die toestel en sinkroniseer wanneer jy weer verbind.",
    startExploring: "Begin Verken / Qala",
    startExploringSub: "Ontsluit persoonlike studiepaaie",
    continueGuest: "Gaan voort as gas",
    quote: "Onderwys is die kragtigste wapen waarmee jy die wêreld kan verander.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "Kon nie jou profielbesonderhede stoor nie.",
    errorGuest: "Gasmodus nie beskikbaar nie.",
  },
  zu: {
    govLabel: "IRIPHABHULIKHI YASENINGIZIMU AFRIKA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Iphothali ye-Zero-Rated",
    heroKicker: "IPHOTHALI YESIZWE YEZELULEKO ZOMSEBENZI",
    heroTitle: "Siyakwamukela ku-Khetha NCAP",
    heroBody: "Sicela ugcwalise ngezansi ukuze uthole izibalo nesiqondiso esenzelwe wena.",
    whoAreYou: "Ungubani? (Khetha indima yakho yamanje)",
    required: "Kuyadingeka",
    roles: roles(
      "Umfundi webanga le-10", "Ukukhetha izifundo nendlela yokufunda yesikhathi esizayo",
      "Umfundi webanga le-11", "Isilinganiso sokuqala setertiary ne-TVET",
      "Umfundi webanga le-12", "Ukulungiselela umatikuletsheni, CAO & NSFAS",
      "Ngaphansi kwebanga le-10", "Isiqondiso sesigaba esiphakeme nokufinyelela i-TVET",
      "Umfundi (Tertiary / TVET)", "Amakolishi, imisebenzi yobuchwepheshe namadiploma",
      "Umfuni womsebenzi", "Ukuthuthukisa amakhono, ukufunda nemisebenzi",
      "Umzali / Umqaphi", "Ukuqondisa intsha ezindleleni zomsebenzi",
      "Uthisha wesiqondiso somsebenzi", "I-Life Orientation namathuluzi ekilasini",
      "Uchwepheshe womsebenzi", "Amathuluzi okuhlola okwelulekayo",
    ),
    disabilityStatus: "Isimo Sokukhubazeka",
    disabilityQuestion: "Ingabe ungumuntu ophila nokukhubazeka?",
    yes: "Yebo",
    no: "Cha",
    disabilities: { visual: "Ukubona", hearing: "Ukuzwa", physical: "Umzimba", learning: "Ukufunda" },
    offlineTitle: "Iyasebenza ngaphandle kwe-inthanethi ngemva kokuvumelanisa kokuqala",
    offlineBody: "Phequlula imisebenzi egciniwe uqhubeke nemibuzo ngaphandle kwesignali. Okuthandayo nemiphumela kugcinwa kudivayisi futhi kuvumelaniswa lapho uphinde uxhuma.",
    startExploring: "Qala Ukuhlola / Qala",
    startExploringSub: "Vula izindlela zokufunda ezenzelwe wena",
    continueGuest: "Qhubeka njengeSivakashi",
    quote: "Imfundo iyisikhali esinamandla kunazo zonke ongasebenzisa ngaso ukushintsha umhlaba.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "Akukwazanga ukulondoloza imininingwane yephrofayela yakho.",
    errorGuest: "Imodi yesivakashi ayitholakali.",
  },
  xh: {
    govLabel: "IRIPHABLIKHI YOMZANTSI AFRIKA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Iphothali ye-Zero-Rated",
    heroKicker: "IPHOTHALI YESIZWE YEECEBISO ZOMSEBENZI",
    heroTitle: "Wamkelekile ku-Khetha NCAP",
    heroBody: "Nceda ugcwalise ngezantsi ukuze ufumane izibalo nesikhokelo esenzelwe wena.",
    whoAreYou: "Ungubani? (Khetha indima yakho yangoku)",
    required: "Iyafuneka",
    roles: roles(
      "Umfundi webanga le-10", "Ukukhetha izifundo nendlela yokufunda yexesha elizayo",
      "Umfundi webanga le-11", "Umlinganiselo wokuqala wetertiary ne-TVET",
      "Umfundi webanga le-12", "Ukulungiselela umatrik, CAO & NSFAS",
      "Ngaphantsi kwebanga le-10", "Isikhokelo sesigaba esiphezulu nokufikelela i-TVET",
      "Umfundi (Tertiary / TVET)", "Iikholeji, imisebenzi yobuchule neediploma",
      "Umfuni womsebenzi", "Ukuphucula izakhono, ukufunda nemisebenzi",
      "Umzali / Umlondolozi", "Ukuqondisa ulutsha kwiindlela zomsebenzi",
      "Utitshala wesikhokelo somsebenzi", "I-Life Orientation nezixhobo zeklasi",
      "Ingcali yomsebenzi", "Izixhobo zokuhlola ezicebisayo",
    ),
    disabilityStatus: "Isimo Sokukhubazeka",
    disabilityQuestion: "Ingaba ungumntu ophila nokukhubazeka?",
    yes: "Ewe",
    no: "Hayi",
    disabilities: { visual: "Ukubona", hearing: "Ukuva", physical: "Umzimba", learning: "Ukufunda" },
    offlineTitle: "Iyasebenza ngaphandle kwe-intanethi emva kokuvumelanisa kokuqala",
    offlineBody: "Khangela imisebenzi egciniweyo uqhubeke neemibuzo ngaphandle kwesignali. Izinto ozithandayo neziphumo zigcinwa kwisixhobo kwaye zivumelaniswa xa uphinda uqhagamshela.",
    startExploring: "Qala Ukuhlola / Qala",
    startExploringSub: "Vula iindlela zokufunda ezenzelwe wena",
    continueGuest: "Qhubeka njengoNdwendwe",
    quote: "Imfundo sesona sixhobo sinamandla onokusebenzisa ngaso ukutshintsha ihlabathi.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "Ayikwazanga ukugcina iinkcukacha zeprofayile yakho.",
    errorGuest: "Imowudi yondwendwe ayifumaneki.",
  },
  nso: {
    govLabel: "REPHABLIKI YA AFRIKA BORWA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Photale ya Zero-Rated",
    heroKicker: "PHOTALE YA NAGA YA KELETŠO YA MOŠOMO",
    heroTitle: "O amogetšwe go Khetha NCAP",
    heroBody: "Hle tlatša ka fase bakeng sa dipalo le keletšo ye e dirilwego ka wena.",
    whoAreYou: "O mang? (Kgetha karolo ya gago ya bjale)",
    required: "E a nyakega",
    roles: roles(
      "Moithuti wa Mphato wa 10", "Kgetho ya dithuto le tsela ya thuto ya ka moso",
      "Moithuti wa Mphato wa 11", "Tekanyo ya pele ya tertiary le TVET",
      "Moithuti wa Mphato wa 12", "Ithokišetšo ya matekene, CAO & NSFAS",
      "Ka fase ga Mphato wa 10", "Keletšo ya kgato e phagamego le go fihlelela TVET",
      "Moithuti (Tertiary / TVET)", "Dikholetšhe, mešomo ya botsebi le diploma",
      "Monyakišiši wa mošomo", "Go kaonafatša mabokgoni, go ithuta le mešomo",
      "Motswadi / Mohlokomedi", "Go hlahla baswa ka ditsela tša mošomo",
      "Morutiši wa keletšo ya mošomo", "Life Orientation le didirišwa tša phapošaborutelo",
      "Setsebi sa mošomo", "Didirišwa tša go hlahloba tša keletšo",
    ),
    disabilityStatus: "Maemo a Bogole",
    disabilityQuestion: "Na o motho yo a phelago ka bogole?",
    yes: "Ee",
    no: "Aowa",
    disabilities: { visual: "Go bona", hearing: "Go kwa", physical: "Mmele", learning: "Go ithuta" },
    offlineTitle: "E šoma ntle le inthanete ka morago ga go swanya la mathomo",
    offlineBody: "Hlahloba mešomo ye e bolokilwego o tšwele pele ka dipotšišo ntle le signal. Dilokwa le dipoelo di bolokwa sedirišweng gomme di swanywa ge o kgokaganya gape.",
    startExploring: "Thoma go Hlahloba / Qala",
    startExploringSub: "Bula ditsela tša thuto tše di dirilwego ka wena",
    continueGuest: "Tšwela pele bjalo ka Moeng",
    quote: "Thuto ke sebetsa se maatla kudu seo o ka se šomišago go fetoša lefase.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "Ga se ya kgona go boloka dintlha tša profaele ya gago.",
    errorGuest: "Mokgwa wa moeng ga o hwetšagale.",
  },
  ve: {
    govLabel: "RIPHABULIKI YA AFRIKA TSHIPEMBE",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Photale ya Zero-Rated",
    heroKicker: "PHOTALE YA LUSHAKA YA NDAEDZO YA MUSHUMO",
    heroTitle: "No tanganedzwa kha Khetha NCAP",
    heroBody: "Ni khou humbela u ḓadzisa fhasi u itela nomboro na ndaedzo yo itelwaho inwi.",
    whoAreYou: "Ni nnyi? (Nangani tshimo tshanu tsha zwino)",
    required: "Zwi a ṱoḓea",
    roles: roles(
      "Mugudi wa Gireidi ya 10", "U nanga zwiguda na ndila ya u guda ya tshifhinga tshi ḓaho",
      "Mugudi wa Gireidi ya 11", "Mulinganyo wa u thoma wa tertiary na TVET",
      "Mugudi wa Gireidi ya 12", "U lugisela matric, CAO & NSFAS",
      "Fhasi ha Gireidi ya 10", "Ndaedzo ya tshiteṅwa tsho phakamaho na u swikelela TVET",
      "Mugudi (Tertiary / TVET)", "Kholetshi, mishumo ya vhufundi na diploma",
      "Muṱoḓi wa mushumo", "U khwinisa vhukoni, u guda na mishumo",
      "Mubebi / Mulindi", "U ḓivhadza vhaswa nga ndila dza mushumo",
      "Mudededzi wa ndaedzo ya mushumo", "Life Orientation na zwishumiswa zwa kilasi",
      "Mudinganyi wa mushumo", "Zwishumiswa zwa u sedzulusa zwa ndaedzo",
    ),
    disabilityStatus: "Tshimo tsha Vhukundi",
    disabilityQuestion: "Ni muthu ane a tshi tshila nga vhukundi?",
    yes: "Ee",
    no: "Hai",
    disabilities: { visual: "U vhona", hearing: "U pfa", physical: "Muvhili", learning: "U guda" },
    offlineTitle: "I shuma nnda ha inthanethe nga murahu ha u swanya ha u thoma",
    offlineBody: "Ṱolani mishumo yo vhulungiwaho ni bvele phanda nga mibudziso nnda ha signal. Zwi funwaho na mvelelo zwi vhulungwa kha tshishumiswa nahone zwi swanywa musi ni tshi vhuedzedza.",
    startExploring: "Thomani u Ṱola / Qala",
    startExploringSub: "Vulani ndila dza u guda dzo itelwaho inwi",
    continueGuest: "Bvelani phanda sa Mueni",
    quote: "Pfunzo ndi tshishumiswa tshine tsha vha na maanḓa u fhira zwoṱhe zwine na nga shumisa ngatsho u shandukisa shango.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "A zwo ngo kona u vhulunga zwidodombedzwa zwa phrofaule yanu.",
    errorGuest: "Modu ya mueni a i wanali.",
  },
  ts: {
    govLabel: "RIPHABULIKI YA AFRIKA DZONGA",
    govSub: "DHET · Khetha NCAP",
    zeroRated: "Photale ya Zero-Rated",
    heroKicker: "PHOTALE YA RIXAKA YA NDZIVISO YA NTIRHO",
    heroTitle: "U amukeriwile eka Khetha NCAP",
    heroBody: "Hi kombela u tata laha hansi leswaku u kuma tinomboro na ndziviso leyi endleriweke wena.",
    whoAreYou: "U mani? (Hlawula xiyimo xa wena xa sweswi)",
    required: "Ya laveka",
    roles: roles(
      "Mudyondzi wa Gireyi ya 10", "Ku hlawula swidyondzo na ndlela yo dyondza ya nkarhi lowu taka",
      "Mudyondzi wa Gireyi ya 11", "Mpimo wo sungula wa tertiary na TVET",
      "Mudyondzi wa Gireyi ya 12", "Ku lulamisa matric, CAO & NSFAS",
      "Ehansi ka Gireyi ya 10", "Ndziviso ya xiyenge xa le henhla na ku fikelela TVET",
      "Mudyondzi (Tertiary / TVET)", "Tikholeji, mintirho ya vutshila na tidiploma",
      "Mulavi wa ntirho", "Ku antswisa vuswikoti, ku dyondza na mintirho",
      "Mutswari / Mulondzovoti", "Ku kongomisa vahluvukisi hi tindlela ta ntirho",
      "Mudyondzisi wa ndziviso ya ntirho", "Life Orientation na switirhisiwa swa kilasi",
      "Mucekeli wa ntirho", "Switirhisiwa swo kambela swa ndziviso",
    ),
    disabilityStatus: "Xiyimo xa Vusweti",
    disabilityQuestion: "Xana u munhu loyi a hanya hi vusweti?",
    yes: "Ina",
    no: "E-e",
    disabilities: { visual: "Ku vona", hearing: "Ku twa", physical: "Mirhi", learning: "Ku dyondza" },
    offlineTitle: "Yi tirha handle ka inthanete endzhaku ka ku synca ka sungula",
    offlineBody: "Lava mintirho leyi hlayisiweke u yisa emahlweni hi swivutiso handle ka signal. Swi rhandziwa na mbuyelo swi hlayisiwa eka xitirhisiwa naswona swi synca loko u khomisa nakambe.",
    startExploring: "Sungula ku Lava / Qala",
    startExploringSub: "Pfula tindlela to dyondza leti endleriweke wena",
    continueGuest: "Yisa emahlweni tanihi Muendzi",
    quote: "Dyondzo i xitirho xa matimba swinene lexi u nga xi tirhisaka ku cinca misava.",
    quoteAttr: "— Nelson Rolihlahla Mandela —",
    errorSave: "A swi kotanga ku hlayisa vuxokoxoko bya phurofayile ya wena.",
    errorGuest: "Modu ya muendzi a yi kumi.",
  },
};

function serializeLocale(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  const pad2 = "  ".repeat(indent + 1);
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map((v) => serializeLocale(v, indent + 1)).join(", ")}]`;
  }
  const entries = Object.entries(obj);
  return `{\n${entries
    .map(([k, v]) => {
      const key = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      return `${pad2}${key}: ${serializeLocale(v, indent + 1)}`;
    })
    .join(",\n")}\n${pad}}`;
}

function emitModule(rel, importLine, typeName, typeBody, getter, locales) {
  let out = importLine + "\n";
  out += `export type ${typeName} = ${typeBody};\n\n`;
  for (const loc of ["en", "af", "zu", "xh", "nso", "ve", "ts"]) {
    out += `const ${loc}: ${typeName} = ${serializeLocale(locales[loc])};\n\n`;
  }
  out += bundleExport(getter, typeName);
  write(rel, out);
}

emitModule("onboarding.ts", importTop, "OnboardingStrings", onboardingType, "getOnboardingStrings", onboarding);

console.log("onboarding done");
