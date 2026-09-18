import type { AppLocale, HomeLocale } from "./types";
import { isAppLocale } from "./types";

export type { AppLocale, HomeLocale };
export { APP_LOCALES } from "./types";

export const HOME_LOCALES: AppLocale[] = ["en", "zu", "xh", "af"];

type HomeStrings = {
  homeTab: string;
  offlineDetail: (careers: string, qualifications: number, providers: number) => string;
  officialPill: string;
  heroTitle: string;
  heroBody: string;
  voiceLabel: string;
  counselKicker: string;
  free: string;
  counselBody: (hours: string) => string;
  tollFree: string;
  whatsapp: string;
  gatewaysTitle: string;
  gatewaysSub: string;
  subjectTag: string;
  subjectTitle: string;
  subjectBody: string;
  subjectMeta: string;
  subjectCta: string;
  careerTag: string;
  careerTitle: string;
  careerBody: string;
  careerMeta: string;
  careerCta: string;
  jobFitTag: string;
  jobFitTitle: string;
  jobFitBody: string;
  jobFitMeta: string;
  jobFitCta: string;
  directoryTitle: string;
  directorySub: string;
  careersDirTitle: string;
  careersDirBody: (count: string) => string;
  careersDirCta: string;
  whatStudyTitle: string;
  whatStudyBody: (count: number) => string;
  whatStudyCta: string;
  whereStudyTitle: string;
  whereStudyBody: string;
  whereStudyCta: string;
  fundingTitle: string;
  fundingBody: string;
  fundingCta: string;
  demandTitle: string;
  gazetted: string;
  demandSub: string;
  solarTitle: string;
  solarMeta: string;
  softwareTitle: string;
  softwareMeta: string;
  millwrightTitle: string;
  millwrightMeta: string;
  policy: string;
  quote: string;
  quoteAttr: string;
  version: string;
};

const en: HomeStrings = {
  homeTab: "Home",
  offlineDetail: (careers, qualifications, providers) =>
    `Offline Database Active · ${careers} Careers · ${qualifications} Qualifications · ${providers} Providers`,
  officialPill: "Official DHET CDS Portal",
  heroTitle: "National Career Advice Portal",
  heroBody:
    "Your self-help tool for informed career and study decisions, brought to you by Career Development Services, DHET.",
  voiceLabel: "Choose your language:",
  counselKicker: "Free Career Counselling",
  free: "FREE",
  counselBody: (hours) => `Speak to a qualified Career Advisor (${hours})`,
  tollFree: "Toll-Free",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Core Decision Gateways",
  gatewaysSub: "Take guided steps to unlock your post-school options",
  subjectTag: "For Grades 9 & 10",
  subjectTitle: "Subject Choice (Ukukhetha Izifundo)",
  subjectBody:
    "Find out which Grade 10–12 subjects keep your dream career doors open and meet tertiary admission point (APS) minimums.",
  subjectMeta: "Pre-requisite Checker",
  subjectCta: "Explore Subjects",
  careerTag: "15 min assessment · RIASEC Model",
  careerTitle: "Career Choice Questionnaire",
  careerBody:
    "Discover occupations aligned with your interests and personality. Answer quick, accessible questions to map your field.",
  careerMeta: "Progress auto-saves",
  careerCta: "Start Assessment",
  jobFitTag: "Work Seekers & Gr 12",
  jobFitTitle: "Job Fit Questionnaire",
  jobFitBody:
    "Match your working style, environment preferences, and hands-on technical skills with TVET trades and modern workplace roles.",
  jobFitMeta: "Trade & Artisan Ready",
  jobFitCta: "Check Job Fit",
  directoryTitle: "Explore Directory",
  directorySub: "Official databases accredited by DHET & SAQA",
  careersDirTitle: "Careers Directory",
  careersDirBody: (count) =>
    `${count} occupations, Trades, Green Careers & High Demand`,
  careersDirCta: "Browse Occupations",
  whatStudyTitle: "What to Study",
  whatStudyBody: (count) =>
    `${count} Qualifications, APS Calculator, TVET NATED, Diplomas`,
  whatStudyCta: "View Degrees/NATED",
  whereStudyTitle: "Where to Study",
  whereStudyBody: "26 Public Universities, 50 TVET Colleges, 9 Provinces",
  whereStudyCta: "Find Institutions",
  fundingTitle: "Funding & NSFAS",
  fundingBody: "Fee-free criteria, Provincial Bursaries, Funza Lushaka",
  fundingCta: "Apply for Bursaries",
  demandTitle: "High Demand Occupations 2024/2025",
  gazetted: "DHET Gazetted",
  demandSub:
    "Priority skills critical for South Africa's Economic Reconstruction & Recovery Plan.",
  solarTitle: "Solar PV Technician / Installer",
  solarMeta: "Green Economy · TVET N4–N6",
  softwareTitle: "Software & Web Developer",
  softwareMeta: "ICT Sector · Degree / Diploma",
  millwrightTitle: "Millwright / Mechatronics",
  millwrightMeta: "Manufacturing · Trade Test / TVET",
  policy:
    "All career profiles, higher institutions, and TVET colleges are officially vetted by the Department of Higher Education and Training (DHET) & SAQA.",
  quote: "“An investment in knowledge pays the best interest.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const zu: HomeStrings = {
  homeTab: "Ikhaya",
  offlineDetail: (careers, qualifications, providers) =>
    `Isizindalwazi esingaxhumeki ku-inthanethi sisebenza · Imisebenzi ${careers} · Iziqu ${qualifications} · Abahlinzeki ${providers}`,
  officialPill: "Iphothali esemthethweni ye-DHET CDS",
  heroTitle: "Iphothali Kazwelonke Yezeluleko Zomsebenzi",
  heroBody:
    "Ithuluzi lakho lokuzisiza ukuze wenze izinqumo ezinolwazi ngomsebenzi nokufunda, elethwa yi-Career Development Services, DHET.",
  voiceLabel: "Khetha ulimi lwakho:",
  counselKicker: "Ukwelulekwa Ngomsebenzi Mahhala",
  free: "MAHHALA",
  counselBody: (hours) =>
    `Khuluma nomeluleki womsebenzi oqeqeshiwe (${hours})`,
  tollFree: "Mahhala",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Amasango Ezinqumo Ezingqangi",
  gatewaysSub: "Thatha izinyathelo eziqondisiwe ukuvula izinketho zakho emva kwesikole",
  subjectTag: "Ibanga 9 no-10",
  subjectTitle: "Ukukhetha Izifundo",
  subjectBody:
    "Thola ukuthi yiziphi izifundo zebanga 10–12 ezivula iminyango yomsebenzi wakho wephupho futhi ezihlangabezana namaphuzu okungena esikhungweni (APS).",
  subjectMeta: "Isihloli Sezidingo Zangaphambilini",
  subjectCta: "Hlola Izifundo",
  careerTag: "Ukuhlola kwemizuzu engu-15 · Imodeli ye-RIASEC",
  careerTitle: "Uhlu Lwemibuzo Lokukhetha Umsebenzi",
  careerBody:
    "Thola imisebenzi ehambisana nezintshisekelo zakho nobuntu bakho. Phendula imibuzo emfushane ukuze uhlele inkambu yakho.",
  careerMeta: "Inqubekelaphambili iyazilondoloza",
  careerCta: "Qala Ukuhlola",
  jobFitTag: "Abafuna Umsebenzi & Ibanga 12",
  jobFitTitle: "Uhlu Lwemibuzo Lokufaneleka Komsebenzi",
  jobFitBody:
    "Fanisa indlela yakho yokusebenza, izinto ozithandayo endaweni yokusebenza, namakhono ezandla nemisebenzi ye-TVET nezikhundla zesimanje.",
  jobFitMeta: "Kulungele Umsebenzi Wokuhweba & Ubuchwepheshe",
  jobFitCta: "Hlola Ukufaneleka",
  directoryTitle: "Hlola Isizindalwazi",
  directorySub: "Izizindalwazi ezisemthethweni ezigunyazwe yi-DHET ne-SAQA",
  careersDirTitle: "Isizindalwazi Semisebenzi",
  careersDirBody: (count) =>
    `Imisebenzi engu-${count}, Imisebenzi Yezandla, Imisebenzi Eluhlaza & Edingeka Kakhulu`,
  careersDirCta: "Buka Imisebenzi",
  whatStudyTitle: "Okufundwayo",
  whatStudyBody: (count) =>
    `Iziqu ezingu-${count}, Isibali se-APS, i-TVET NATED, Amadiploma`,
  whatStudyCta: "Buka Iziqu/NATED",
  whereStudyTitle: "Lapho Kungafundwa Khona",
  whereStudyBody:
    "Amanyuvesi omphakathi angu-26, Amakolishi e-TVET angu-50, Izifundazwe eziyisi-9",
  whereStudyCta: "Thola Izikhungo",
  fundingTitle: "Uxhaso & NSFAS",
  fundingBody: "Imigomo yokufunda mahhala, Amabhasari Ezifundazwe, Funza Lushaka",
  fundingCta: "Faka Isicelo Sebhasari",
  demandTitle: "Imisebenzi Edingeka Kakhulu 2024/2025",
  gazetted: "Ishicilelwe yi-DHET",
  demandSub:
    "Amakhono abalulekile oHlelo Lokwakha Kabusha Nokubuyisela Umnotho waseNingizimu Afrika.",
  solarTitle: "Uchwepheshe / Umfaki we-Solar PV",
  solarMeta: "Umnotfo Oluhlaza · TVET N4–N6",
  softwareTitle: "Umdwebi Wesofthiwe & Iwebhu",
  softwareMeta: "Umkhakha we-ICT · Iziqu / Idiploma",
  millwrightTitle: "Umillwright / I-Mechatronics",
  millwrightMeta: "Ukukhiqiza · Ukuhlolwa Komsebenzi / TVET",
  policy:
    "Wonke amaphrofayili emisebenzi, izikhungo eziphakeme, namakolishi e-TVET ahlolwa ngokusemthethweni uMnyango Wezemfundo Ephakeme Nokuqeqeshwa (DHET) kanye ne-SAQA.",
  quote: "“Ukutshala olwazini kuletha inzalo enhle kunazo zonke.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const xh: HomeStrings = {
  homeTab: "Ikhaya",
  offlineDetail: (careers, qualifications, providers) =>
    `Isizindalwazi esingaxhunyiwe kwi-intanethi sisebenza · Imisebenzi ${careers} · Iziqu ${qualifications} · Ababoneleli ${providers}`,
  officialPill: "Iphothali ye-DHET CDS esemthethweni",
  heroTitle: "Iphothali yeSizwe yeengCebiso zoMsebenzi",
  heroBody:
    "Isixhobo sakho sokuzinceda ukwenza izigqibo ezinolwazi ngomsebenzi nokufunda, eziziswa yi-Career Development Services, DHET.",
  voiceLabel: "Khetha ulwimi lwakho:",
  counselKicker: "Ukucetyiswa ngoMsebenzi Simahla",
  free: "SIMAHLA",
  counselBody: (hours) =>
    `Thetha nomcebisi womsebenzi oqeqeshiweyo (${hours})`,
  tollFree: "Simahla",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Amasango eziGqibo eziPhambili",
  gatewaysSub:
    "Thatha amanyathelo akhokelwayo ukuvula iinketho zakho emva kwesikolo",
  subjectTag: "Ibanga lesi-9 nese-10",
  subjectTitle: "Ukukhetha Izifundo",
  subjectBody:
    "Fumanisa ukuba zeziphi izifundo zebanga le-10–12 ezivula iingcango zomsebenzi wakho wephupha kwaye zihlangabezane namanqaku okungena kwiziko (APS).",
  subjectMeta: "Isihloli seeMfuneko zangaphambili",
  subjectCta: "Phonononga Izifundo",
  careerTag: "Uvavanyo lwemizuzu engama-15 · Imodeli ye-RIASEC",
  careerTitle: "Uluhlu lweMibuzo lokuKhetha uMsebenzi",
  careerBody:
    "Fumana imisebenzi ehambelana nemidla yakho nobuntu bakho. Phendula imibuzo emfutshane ukuze uhlele icandelo lakho.",
  careerMeta: "Inkqubela iyazigcina",
  careerCta: "Qala Uvavanyo",
  jobFitTag: "Abafuna uMsebenzi & Ibanga le-12",
  jobFitTitle: "Uluhlu lweMibuzo lokuFanela uMsebenzi",
  jobFitBody:
    "Linganisa indlela yakho yokusebenza, izinto ozithandayo kwindawo yokusebenza, nezakhono zezandla kunye nemisebenzi ye-TVET neendima zale mihla.",
  jobFitMeta: "Kulungele uMsebenzi woRhwebo noBuchule",
  jobFitCta: "Jonga ukuFanela",
  directoryTitle: "Phonononga iSizindalwazi",
  directorySub: "Izizindalwazi ezisemthethweni ezivunyiweyo yi-DHET ne-SAQA",
  careersDirTitle: "Isizindalwazi seMisebenzi",
  careersDirBody: (count) =>
    `Imisebenzi engama-${count}, Imisebenzi yezandla, Imisebenzi eluhlaza & edingeka kakhulu`,
  careersDirCta: "Khangela Imisebenzi",
  whatStudyTitle: "Into onokuyiFunda",
  whatStudyBody: (count) =>
    `Iziqu ezingama-${count}, Isibali se-APS, i-TVET NATED, iiDiploma`,
  whatStudyCta: "Jonga Iziqu/NATED",
  whereStudyTitle: "Apho ungafunda Khona",
  whereStudyBody:
    "IiYunivesithi zikawonke-wonke ezingama-26, iiKholeji ze-TVET ezingama-50, amaPhondo asi-9",
  whereStudyCta: "Fumana Amaziko",
  fundingTitle: "Inkxaso-mali & NSFAS",
  fundingBody:
    "Imigaqo yokufunda simahla, iiBhursari zamaPhondo, Funza Lushaka",
  fundingCta: "Faka isicelo seBhursari",
  demandTitle: "Imisebenzi eDingeka kakhulu 2024/2025",
  gazetted: "Ipapashiwe yi-DHET",
  demandSub:
    "Izakhono eziphambili ezibalulekileyo kwiSicwangciso sokuPhinda kuKhiwe nokuBuyiselwa koQoqosho lwaseMzantsi Afrika.",
  solarTitle: "Igcisa / Umfaki we-Solar PV",
  solarMeta: "Uqoqosho oluLuhlaza · TVET N4–N6",
  softwareTitle: "Umphuhlisi weSoftware & iWebhu",
  softwareMeta: "Icandelo le-ICT · Isidanga / iDiploma",
  millwrightTitle: "Umillwright / i-Mechatronics",
  millwrightMeta: "Imveliso · Uvavanyo loRhwebo / TVET",
  policy:
    "Zonke iiprofayile zemisebenzi, amaziko emfundo ephakamileyo, neekholeji ze-TVET zihlolwa ngokusemthethweni liSebe leMfundo ePhakamileyo nokuQeqeshwa (DHET) kunye ne-SAQA.",
  quote: "“Utyalo-mali kulwazi luhlawula eyona nzala intle.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const af: HomeStrings = {
  homeTab: "Tuis",
  offlineDetail: (careers, qualifications, providers) =>
    `Aflyn-databasis aktief · ${careers} Loopbane · ${qualifications} Kwalifikasies · ${providers} Verskaffers`,
  officialPill: "Amptelike DHET CDS-portaal",
  heroTitle: "Nasionale Loopbaanadviesportaal",
  heroBody:
    "Jou selfhulpinstrument vir ingeligte loopbaan- en studiebesluite, aangebied deur Career Development Services, DHET.",
  voiceLabel: "Kies jou taal:",
  counselKicker: "Gratis Loopbaanberading",
  free: "GRATIS",
  counselBody: (hours) =>
    `Praat met 'n gekwalifiseerde loopbaanadviseur (${hours})`,
  tollFree: "Tolvry",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Kern-besluitspoorte",
  gatewaysSub: "Neem begeleidde stappe om jou ná-skool-opsies oop te sluit",
  subjectTag: "Vir Graad 9 & 10",
  subjectTitle: "Vakkeuse",
  subjectBody:
    "Ontdek watter Graad 10–12-vakke jou droomloopbaandeure oop hou en aan tersiêre toelatingspunt- (APS) minimums voldoen.",
  subjectMeta: "Voorvereiste-kontroleerder",
  subjectCta: "Verken Vakke",
  careerTag: "15 min assessering · RIASEC-model",
  careerTitle: "Loopbaankeuse-vraelys",
  careerBody:
    "Ontdek beroepe wat by jou belange en persoonlikheid pas. Beantwoord vinnige, toeganklike vrae om jou veld te karteer.",
  careerMeta: "Vordering word outomaties gestoor",
  careerCta: "Begin Assessering",
  jobFitTag: "Werksoekers & Gr 12",
  jobFitTitle: "Werkspasings-vraelys",
  jobFitBody:
    "Pas jou werkstyl, omgewingsvoorkeure en praktiese tegniese vaardighede by TVET-ambagte en moderne werkplekrolle.",
  jobFitMeta: "Ambag- & Ambagsman-gereed",
  jobFitCta: "Kontroleer Werkspassing",
  directoryTitle: "Verken Gids",
  directorySub: "Amptelike databasisse geakkrediteer deur DHET & SAQA",
  careersDirTitle: "Loopbaangids",
  careersDirBody: (count) =>
    `${count} beroepe, Ambagte, Groen Loopbane & Hoë Aanvraag`,
  careersDirCta: "Blaai deur Beroepe",
  whatStudyTitle: "Wat om te Studeer",
  whatStudyBody: (count) =>
    `${count} Kwalifikasies, APS-sakrekenaar, TVET NATED, Diplomas`,
  whatStudyCta: "Bekyk Grade/NATED",
  whereStudyTitle: "Waar om te Studeer",
  whereStudyBody: "26 Openbare Universiteite, 50 TVET-kolleges, 9 Provinsies",
  whereStudyCta: "Vind Instellings",
  fundingTitle: "Befondsing & NSFAS",
  fundingBody: "Fooivrye kriteria, Provinsiale Beurse, Funza Lushaka",
  fundingCta: "Doen aansoek om Beurse",
  demandTitle: "Hoë-aanvraag-beroep 2024/2025",
  gazetted: "DHET-gegasetteer",
  demandSub:
    "Prioriteitsvaardighede krities vir Suid-Afrika se Ekonomiese Heropbou- & Herstelplan.",
  solarTitle: "Sonkrag-PV-tegnikus / Installeerder",
  solarMeta: "Groen Ekonomie · TVET N4–N6",
  softwareTitle: "Sagteware- & Webontwikkelaar",
  softwareMeta: "IKT-sektor · Graad / Diploma",
  millwrightTitle: "Meulmaker / Megatronika",
  millwrightMeta: "Vervaardiging · Ambagstoets / TVET",
  policy:
    "Alle loopbaanprofiele, hoër onderwysinstellings en TVET-kolleges word amptelik gekeur deur die Departement van Hoër Onderwys en Opleiding (DHET) & SAQA.",
  quote: "“'n Belegging in kennis betaal die beste rente.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const HOME_I18N: Record<AppLocale, HomeStrings> = { en, zu, xh, af };

export function isHomeLocale(value: string | null | undefined): value is AppLocale {
  return isAppLocale(value);
}

export function getHomeStrings(locale: string | null | undefined): HomeStrings {
  const key = isAppLocale(locale) ? locale : "en";
  return HOME_I18N[key];
}
