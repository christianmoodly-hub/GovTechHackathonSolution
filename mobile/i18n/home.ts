import type { AppLocale, HomeLocale } from "./types";
import { APP_LOCALES } from "./types";
import { createBundle, resolveLocale } from "./createBundle";

export type { AppLocale, HomeLocale };
export { APP_LOCALES };

export const HOME_LOCALES: readonly AppLocale[] = APP_LOCALES;

export type HomeStrings = {
  homeTab: string;
  offlineDetail: (
    careers: string,
    qualifications: number,
    providers: number,
  ) => string;
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
  fundingBody: (count: number) => string;
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
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} bursary listings · verify before you apply`
      : "Fee-free criteria, Provincial Bursaries, Funza Lushaka",
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
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} beurslyste · verifieer voor jy aansoek doen`
      : "Fooivrye kriteria, Provinsiale Beurse, Funza Lushaka",
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
  gatewaysSub:
    "Thatha izinyathelo eziqondisiwe ukuvula izinketho zakho emva kwesikole",
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
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} amabhasari · qinisekisa ngaphambi kokufaka isicelo`
      : "Imigomo yokufunda mahhala, Amabhasari Ezifundazwe, Funza Lushaka",
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
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} iibhursari ·qinisekisa phambi kokufaka isicelo`
      : "Imigaqo yokufunda simahla, iiBhursari zamaPhondo, Funza Lushaka",
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

/** Nguni-family locales adapt from isiZulu with light orthography tweaks. */
function nguniFromZu(
  overrides: Partial<HomeStrings> & Pick<HomeStrings, "homeTab" | "voiceLabel">,
): HomeStrings {
  return { ...zu, ...overrides };
}

const nr = nguniFromZu({
  homeTab: "Ikhaya",
  voiceLabel: "Khetha ilimi lakho:",
  heroTitle: "Iphothali Kazwelonke Yezeluleko Zemisebenzi",
  counselKicker: "Ukwelulekwa Ngomsebenzi Mahhala",
});

const ss = nguniFromZu({
  homeTab: "Likhaya",
  voiceLabel: "Khetsa lulwimi lwakho:",
  heroTitle: "Iphothali Yesive Yeteluleko Temsebenti",
  counselKicker: "Kwelulekwa Ngemsebenti Mahhala",
  gatewaysTitle: "Emasango Etinchumo Letibalulekile",
});

const nso: HomeStrings = {
  homeTab: "Gae",
  offlineDetail: (careers, qualifications, providers) =>
    `Database ya ntle le inthanete e šoma · Mesomo ${careers} · Dikwalofikeišene ${qualifications} · Bafani ${providers}`,
  officialPill: "Portal ya semmušo ya DHET CDS",
  heroTitle: "Portal ya Bosetšhaba ya Dikeletšo tša Mošomo",
  heroBody:
    "Sedirišwa sa gago sa go ithuša go tšea diphetho tša mošomo le thuto tše di nago le tsebo, se tlišitšwego ke Career Development Services, DHET.",
  voiceLabel: "Kgetha polelo ya gago:",
  counselKicker: "Dikeletšo tša Mošomo tša Mahala",
  free: "MAHALA",
  counselBody: (hours) =>
    `Bolela le molekodi wa mošomo yo a nago le bokgoni (${hours})`,
  tollFree: "Mahala",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Dikgoro tša Diphetho tša Motheo",
  gatewaysSub:
    "Tšea magato a go hlahlišwa go bula dikgetho tša gago ka morago ga sekolo",
  subjectTag: "Bakeng sa Mphato wa 9 le 10",
  subjectTitle: "Kgetho ya Dithuto",
  subjectBody:
    "Hwetša gore ke dife dithuto tša Mphato wa 10–12 tše di bulago menyako ya mošomo wa gago wa ditoro le go fihlelela dinomoro tša go tsena (APS).",
  subjectMeta: "Molekodi wa Ditlhokego tša Pele",
  subjectCta: "Utolla Dithuto",
  careerTag: "Tekolo ya metsotso ye 15 · Model ya RIASEC",
  careerTitle: "Lenaneo la Dipotšišo tša Kgetho ya Mošomo",
  careerBody:
    "Hwetša mesomo ye e swanelago dikgahlego le botho bja gago. Araba dipotšišo tše kopana go mapa lefelo la gago.",
  careerMeta: "Tšwelopele e a ipoloka",
  careerCta: "Thoma Tekolo",
  jobFitTag: "Banyakišiši ba Mošomo & Mphato wa 12",
  jobFitTitle: "Lenaneo la Dipotšišo tša Go Swanela Mošomo",
  jobFitBody:
    "Bapiša mokgwa wa gago wa go šoma, dikgetho tša tikologo, le bokgoni bja matsogo le mesomo ya TVET le mešomo ya sebjalebjale.",
  jobFitMeta: "E loketše Mošomo wa Botsebi & Boartišane",
  jobFitCta: "Lekola Go Swanela",
  directoryTitle: "Utolla Tšhupetšo",
  directorySub: "Didatabase tša semmušo tše di netefaditšwego ke DHET le SAQA",
  careersDirTitle: "Tšhupetšo ya Mesomo",
  careersDirBody: (count) =>
    `Mesomo ye ${count}, Ditrade, Mesomo ye Tala & ye e Nyakegago Kudu`,
  careersDirCta: "Lebelela Mesomo",
  whatStudyTitle: "Seo o ka se Ithutago",
  whatStudyBody: (count) =>
    `Dikwalofikeišene tše ${count}, Sibalanyi sa APS, TVET NATED, Diploma`,
  whatStudyCta: "Lebelela Digirii/NATED",
  whereStudyTitle: "Mo o ka Ithutago",
  whereStudyBody:
    "Diunibesithi tša Setšhaba tše 26, Dikholetšhe tša TVET tše 50, Diprovensi tše 9",
  whereStudyCta: "Hwetša Diinstitšušene",
  fundingTitle: "Thekgo ya Ditšhelete & NSFAS",
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} dibursari · netefatša pele o kgopela`
      : "Melao ya thuto ya mahala, Dibursari tša Diprovensi, Funza Lushaka",
  fundingCta: "Kgopela Dibursari",
  demandTitle: "Mesomo ye e Nyakegago Kudu 2024/2025",
  gazetted: "E gasetetšwe ke DHET",
  demandSub:
    "Bokgoni bja bohlokwa bja Lenaneo la Go Aga Leswa le Go Tsosolosa Ekonomi ya Afrika Borwa.",
  solarTitle: "Setsebi / Mofaki wa Solar PV",
  solarMeta: "Ekonomi ye Tala · TVET N4–N6",
  softwareTitle: "Motšweletši wa Software & Web",
  softwareMeta: "Lefapha la ICT · Digirii / Diploma",
  millwrightTitle: "Millwright / Mechatronics",
  millwrightMeta: "Tšweletšo · Teko ya Trade / TVET",
  policy:
    "Diprofaele ka moka tša mesomo, diinstitšušene tša thuto ye ephagameng, le dikholetšhe tša TVET di netefaditšwe semmušo ke Lefapha la Thuto ye Ephagameng le Training (DHET) le SAQA.",
  quote: "“Peeletšo tsebong e hwetša tswalo ye kaone.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const st: HomeStrings = {
  ...nso,
  homeTab: "Hae",
  voiceLabel: "Khetha puo ea hao:",
  heroTitle: "Portal ea Naha ea Keletso ea Mosebetsi",
  counselKicker: "Keletso ea Mosebetsi ea Mahala",
  free: "MAHALA",
  gatewaysTitle: "Likhoro tsa Liqeto tsa Motheo",
  subjectTitle: "Khetho ea Lithuto",
  careerTitle: "Lenaneo la Lipotso tsa Khetho ea Mosebetsi",
  jobFitTitle: "Lenaneo la Lipotso tsa Ho Tšoanela Mosebetsi",
  directoryTitle: "Hlahloba Tataiso",
  fundingTitle: "Tšehetso ea Lichelete & NSFAS",
};

const tn: HomeStrings = {
  ...nso,
  homeTab: "Gae",
  voiceLabel: "Tlhopha puo ya gago:",
  heroTitle: "Portal ya Bosetšhaba ya Dikeletšo tsa Tiro",
  counselKicker: "Dikeletšo tsa Tiro tsa Mahala",
  free: "MAHALA",
  gatewaysTitle: "Dikgoro tsa Ditshwetso tsa Motheo",
  subjectTitle: "Tlhopho ya Dithuto",
  careerTitle: "Lenaneo la Dipotso tsa Tlhopho ya Tiro",
  jobFitTitle: "Lenaneo la Dipotso tsa Go Tshwanela Tiro",
  directoryTitle: "Tlhola Tshupiso",
  fundingTitle: "Thekgo ya Madi & NSFAS",
};

const ve: HomeStrings = {
  homeTab: "Haya",
  offlineDetail: (careers, qualifications, providers) =>
    `Database ya nnda ha inthanethe i khou shuma · Mishumo ${careers} · Zwikwalifikheisheni ${qualifications} · Vhafari ${providers}`,
  officialPill: "Portal ya DHET CDS ya mulayo",
  heroTitle: "Portal ya Lushaka ya Ndaeledzo ya Mushumo",
  heroBody:
    "Tshishumiswa tshanu tsha u thusa nga vhone vho u dzhia zwitatiso zwa mushumo na u guda zwi re na ndivho, zwo dalwa nga Career Development Services, DHET.",
  voiceLabel: "Nangani luambo lwanu:",
  counselKicker: "Ndaeledzo ya Mushumo ya Mahala",
  free: "MAHALA",
  counselBody: (hours) =>
    `Ambani na mueluleli wa mushumo o pfumiswaho (${hours})`,
  tollFree: "Mahala",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Mikoro ya Zwitatiso zwa Motheo",
  gatewaysSub:
    "Dzhenani magato a u hulutshedzwa u vula khetho dzaṋu nga murahu ha tshikolo",
  subjectTag: "Kha Gireidi ya 9 na 10",
  subjectTitle: "Khetho ya Zwifundo",
  subjectBody:
    "Wanani uri ndi zwifundo zwifhio zwa Gireidi ya 10–12 zwi vulaho mikoro ya mushumo wanu wa ndoro na u swikelela manomboro a u dzhena (APS).",
  subjectMeta: "Tsedzuluso ya Zwine zwa Ṱodwa Phanda",
  subjectCta: "Gonisani Zwifundo",
  careerTag: "Tsedzuluso ya miminithi ya 15 · Modela wa RIASEC",
  careerTitle: "Mutevhe wa Mibudziso ya Khetho ya Mushumo",
  careerBody:
    "Wanani mishumo i tevhelanaho na zwine na takalela na vhuthu haṋu. Fhindulani mibudziso yo pfufhafaho u mapa nḓila yaṋu.",
  careerMeta: "Mveledziso i a ḓi vhulunga",
  careerCta: "Thomani Tsedzuluso",
  jobFitTag: "Vhaṱoḓi vha Mushumo & Gireidi ya 12",
  jobFitTitle: "Mutevhe wa Mibudziso ya u Tea Mushumo",
  jobFitBody:
    "Lingani nḓila yaṋu ya u shuma, zwiṱakadzi zwa mupo, na vhukoni ha zwanda na mishumo ya TVET na mishumo ya zwino.",
  jobFitMeta: "Yo lugiswa Mushumo wa Vhufundi & Vhartisan",
  jobFitCta: "Sedzani u Tea",
  directoryTitle: "Gonisani Tshumisano",
  directorySub: "Dhidatabase dza mulayo dzo tendelwaho nga DHET na SAQA",
  careersDirTitle: "Tshumisano ya Mishumo",
  careersDirBody: (count) =>
    `Mishumo ya ${count}, Dzitrade, Mishumo dza Green & dzo Ṱodwaho Vhukuma`,
  careersDirCta: "Lavhelesani Mishumo",
  whatStudyTitle: "Zwine na nga Guda",
  whatStudyBody: (count) =>
    `Zwikwalifikheisheni zwa ${count}, Tshibaledzi tsha APS, TVET NATED, Diploma`,
  whatStudyCta: "Lavhelesani Digirii/NATED",
  whereStudyTitle: "Hune na nga Guda hone",
  whereStudyBody:
    "Dziyunivesithi dza Lushaka dza 26, Dzikholichi dza TVET dza 50, Maprovinsi a 9",
  whereStudyCta: "Wanani Zwiinstitusheni",
  fundingTitle: "Thuso ya Masheleni & NSFAS",
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} dibhasari · khwaṱhisedzani musi ni sa athu u ita khumbelo`
      : "Milayo ya u guda mahala, Dibhasari dza Maprovinsi, Funza Lushaka",
  fundingCta: "Kumbelani Dibhasari",
  demandTitle: "Mishumo yo Ṱodwaho Vhukuma 2024/2025",
  gazetted: "Yo gasetiwa nga DHET",
  demandSub:
    "Vhukoni ha ndeme ha Pulane ya u Fhaṱa Hafhu na u Vhuedzedza Ikonomi ya Afurika Tshipembe.",
  solarTitle: "Mudivhi / Muisa wa Solar PV",
  solarMeta: "Ikonomi ya Green · TVET N4–N6",
  softwareTitle: "Muvhambadzi wa Software & Web",
  softwareMeta: "Sekithara ya ICT · Digirii / Diploma",
  millwrightTitle: "Millwright / Mechatronics",
  millwrightMeta: "U bveledza · Tsedzuluso ya Trade / TVET",
  policy:
    "Phurofaele dzothe dza mishumo, zwiinstitusheni zwa pfunzo ya nṱha, na dzikholichi dza TVET zwo tendelwa nga Muhasho wa Pfunzo ya Nṱha na Training (DHET) & SAQA.",
  quote: "“U vhea tshelede kha ndivho zwi vhuyedza vhukuma.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const ts: HomeStrings = {
  homeTab: "Kaya",
  offlineDetail: (careers, qualifications, providers) =>
    `Database leyi handle ka inthanete yi tirha · Mintirho ${careers} · Swikiliifikheixini ${qualifications} · Vanyikeri ${providers}`,
  officialPill: "Portal ya DHET CDS ya ximfumo",
  heroTitle: "Portal ya Rixaka ya Swiletelo swa Ntirho",
  heroBody:
    "Xitirhisiwa xa wena xo tipfunisa ku teka swiboho swa ntirho na dyondzo leswi nga ni vutivi, leswi tisiwaka hi Career Development Services, DHET.",
  voiceLabel: "Hlawula ririmi ra wena:",
  counselKicker: "Swiletelo swa Ntirho swa Mahala",
  free: "MAHALA",
  counselBody: (hours) =>
    `Vulavula na muceleteri wa ntirho loyi a nga ni vuswikoti (${hours})`,
  tollFree: "Mahala",
  whatsapp: "WhatsApp",
  gatewaysTitle: "Tinyangwa ta Swiboho swa Xisekelo",
  gatewaysSub:
    "Tekela magoza lama kongomisiweke ku pfulela swihlawulekisi swa wena endzhaku ka xikolo",
  subjectTag: "Eka Gireyi ya 9 na 10",
  subjectTitle: "Nhlawulo wa Swifundzo",
  subjectBody:
    "Kuma swifundzo swihi swa Gireyi ya 10–12 leswi pfulaka tinyangwa ta ntirho wa wena wa norho na ku fikelela tinomboro ta ku nghena (APS).",
  subjectMeta: "Mukambisisi wa Swilaveko swa Ku Sungula",
  subjectCta: "Kambisisa Swifundzo",
  careerTag: "Nkambisiso wa timinete ta 15 · Modela wa RIASEC",
  careerTitle: "Nxaxamelo wa Swivutiso swa Nhlawulo wa Ntirho",
  careerBody:
    "Kuma mintirho leyi fambelanaka na swinavelo na vumunhu bya wena. Hlamula swivutiso swo koma ku mapa nsimu ya wena.",
  careerMeta: "Ndzulamiso wu tipfunela",
  careerCta: "Sungula Nkambisiso",
  jobFitTag: "Valavi va Ntirho & Gireyi ya 12",
  jobFitTitle: "Nxaxamelo wa Swivutiso swa Ku Faneleka ka Ntirho",
  jobFitBody:
    "Fanisa ndlela ya wena yo tirha, swinavelo swa mbango, na vuswikoti bya mavoko na mintirho ya TVET na mintirho ya sweswinyana.",
  jobFitMeta: "Yi lulamile eka Ntirho wa Vutshila & Vuartisan",
  jobFitCta: "Kambela Ku Faneleka",
  directoryTitle: "Kambisisa Xikombiso",
  directorySub: "Tidatabase ta ximfumo leti amukeriweke hi DHET na SAQA",
  careersDirTitle: "Xikombiso xa Mintirho",
  careersDirBody: (count) =>
    `Mintirho ya ${count}, Titrade, Mintirho ya Rihlaza & leyi Laviwaka Ngopfu`,
  careersDirCta: "Languta Mintirho",
  whatStudyTitle: "Leswi u nga swi Dyondzaka",
  whatStudyBody: (count) =>
    `Swikiliifikheixini swa ${count}, Xibalo xa APS, TVET NATED, Diploma`,
  whatStudyCta: "Languta Digirii/NATED",
  whereStudyTitle: "Laha u nga Dyondza kona",
  whereStudyBody:
    "Tiyunivhesiti ta Rixaka ta 26, Tikholichi ta TVET ta 50, Tiprovhinsi ta 9",
  whereStudyCta: "Kuma Swiyimo",
  fundingTitle: "Nseketelo wa Mali & NSFAS",
  fundingBody: (count) =>
    count > 0
      ? `${count.toLocaleString()} tibhasari · tiyisisa emahlweni ka ku endla xikombelo`
      : "Milawu ya dyondzo ya mahala, Tibhasari ta Tiprovhinsi, Funza Lushaka",
  fundingCta: "Endla xikombelo xa Tibhasari",
  demandTitle: "Mintirho leyi Laviwaka Ngopfu 2024/2025",
  gazetted: "Yi gasetiwile hi DHET",
  demandSub:
    "Vuswikoti bya nkoka bya Pulani yo Aka Nakambe na ku Tlherisela Ikonomi ya Afrika Dzonga.",
  solarTitle: "Mudyondzi / Muongori wa Solar PV",
  solarMeta: "Ikonomi ya Rihlaza · TVET N4–N6",
  softwareTitle: "Mutumbuluxi wa Software & Web",
  softwareMeta: "Xiyenge xa ICT · Digirii / Diploma",
  millwrightTitle: "Millwright / Mechatronics",
  millwrightMeta: "Vutumbuluxi · Nkambisiso wa Trade / TVET",
  policy:
    "Tiphurofaele hinkwato ta mintirho, swiyimo swa dyondzo ya le henhla, na tikholichi ta TVET swi kamberiwa hi ndlela ya ximfumo hi Ndzawulo ya Dyondzo ya le Henhla na Training (DHET) & SAQA.",
  quote: "“Ku veka mali eka vutivi swi humesa ribye ra kahle.”",
  quoteAttr: "— Benjamin Franklin",
  version: "Khetha CDS · NCAP Mobile",
};

const HOME_I18N = createBundle<HomeStrings>({
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

export function isHomeLocale(
  value: string | null | undefined,
): value is AppLocale {
  return resolveLocale(value) === value;
}

export function getHomeStrings(locale: string | null | undefined): HomeStrings {
  return HOME_I18N[resolveLocale(locale)];
}
