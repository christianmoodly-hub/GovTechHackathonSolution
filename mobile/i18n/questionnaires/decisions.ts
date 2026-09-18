import { createBundle, resolveLocale } from "../createBundle";

export type PathwayCardStrings = {
  badgeLabel: string;
  duration: string;
  title: string;
  subtitle: string;
  body: string;
  tags: [string, string, string];
  cta: string;
  journeyLabel: string;
};

export type FaqItemStrings = {
  question: string;
  best: string;
  answer: string;
};

export type DecisionsStrings = {
  enginePill: string;
  careersCached: (count: string) => string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  journeyTitle: string;
  pathwaysCompleted: (done: number, total: number) => string;
  statusCompleted: string;
  statusInProgress: string;
  statusPending: string;
  resumeAssessment: string;
  pathwaysSection: string;
  pathwaysMeta: string;
  exploreByField: string;
  browseDirectories: string;
  fieldIntro: string;
  faqTitle: string;
  faqSub: string;
  helpTitle: string;
  helpBody: string;
  callTollFree: (number: string) => string;
  whatsappLabel: (number: string) => string;
  offlineDetail: string;
  subject: PathwayCardStrings;
  career: PathwayCardStrings;
  jobFit: PathwayCardStrings;
  faq1: FaqItemStrings;
  faq2: FaqItemStrings;
  faq3: FaqItemStrings;
};

const en: DecisionsStrings = {
  enginePill: "DHET National Guidance Engine",
  careersCached: (count) => `${count} careers cached`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Decisions",
  heroBody:
    "Unsure where to start? Use our three scientifically calibrated decision pathways to match school subjects, personality interests, or workplace environment preferences with accredited South African qualifications.",
  journeyTitle: "Your Decision Journey",
  pathwaysCompleted: (done, total) =>
    `${done} of ${total} Pathways Completed`,
  statusCompleted: "Completed",
  statusInProgress: "In Progress",
  statusPending: "Pending",
  resumeAssessment: "Resume Active Assessment",
  pathwaysSection: "3 Tailored Pathways",
  pathwaysMeta: "Official DHET Validated",
  exploreByField: "Explore by field",
  browseDirectories: "Browse directories",
  fieldIntro:
    "Visual gateways into university, health, and digital careers — no new questionnaires, just curated directory routes.",
  faqTitle: "Which tool should I take first?",
  faqSub: "Tap the question that best matches your situation",
  helpTitle: "Need personalized help deciding?",
  helpBody:
    "A DHET career practitioner is on standby to explain your diagnostic results, APS score, and application deadlines at zero charge.",
  callTollFree: (number) => `Call Toll-Free: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "DHET National Guidance Engine · Device cache",
  subject: {
    badgeLabel: "Recommended for High School",
    duration: "5–8 mins",
    title: "1. Subject Chooser",
    subtitle: "Ukukhetha Izifundo · CAPS Aligned",
    body: "Select your current or prospective Grade 10–12 subjects to test admission into university degrees, TVET college diplomas, and high-demand trades. Prevent closing academic doors early.",
    tags: ["APS Calculator", "Pure Maths vs Math Lit", "Faculty Prerequisites"],
    cta: "Launch Subject Chooser",
    journeyLabel: "Subject Choice (Grade 10–12)",
  },
  career: {
    badgeLabel: "Most Popular Diagnostic",
    duration: "12–15 mins",
    title: "2. Career Choice Questionnaire",
    subtitle: "Holland RIASEC Model · 11 Languages",
    body: "Discover which fields truly match your natural personality, passions, and core thinking style. Generates your official 3-letter RIASEC profile mapped to registered SAQA occupations.",
    tags: [
      "Realistic · Investigative · Artistic",
      "1,432+ SAQA Careers",
      "Audio Voice-Over",
    ],
    cta: "Start Interest Profiler",
    journeyLabel: "Career Interest (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Great for Vocational & TVET",
    duration: "10 mins",
    title: "3. Job Fit Questionnaire",
    subtitle: "Workplace Environment Match",
    body: "Evaluate tangible day-to-day realities: outdoor physical trades, engineering workshops, healthcare wards, corporate teams, or independent digital environments.",
    tags: [
      "SETA Apprenticeships",
      "Centres of Specialisation",
      "Work Climate Demands",
    ],
    cta: "Assess Your Job Fit",
    journeyLabel: "Job Fit (Trade & Artisan Focus)",
  },
  faq1: {
    question: "In Grade 9 or choosing Matric subjects?",
    best: "Best choice: 1. Subject Chooser",
    answer:
      "Helps you check APS thresholds early so you don't drop Mathematics or Science if your dream qualification requires it.",
  },
  faq2: {
    question: "No idea what career fits you?",
    best: "Best choice: 2. Career Choice Questionnaire",
    answer:
      "Examines your core psychological preferences and personality affinities to provide a curated shortlist of South African occupations.",
  },
  faq3: {
    question: "Prefer hands-on trades or TVET paths?",
    best: "Best choice: 3. Job Fit Questionnaire",
    answer:
      "Focuses directly on physical, technical, and trade conditions to connect you with SETA artisanal qualifications and Centres of Specialisation.",
  },
};

const af: DecisionsStrings = {
  enginePill: "DHET Nasionale Leidingsenjin",
  careersCached: (count) => `${count} loopbane gekasheer`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Besluite",
  heroBody:
    "Onseker waar om te begin? Gebruik ons drie wetenskaplik gekalibreerde besluitpaaie om skoolvakke, persoonlikheidsbelangstellings of werksomgewingsvoorkeure by geakkrediteerde Suid-Afrikaanse kwalifikasies te pas.",
  journeyTitle: "Jou besluitreis",
  pathwaysCompleted: (done, total) =>
    `${done} van ${total} paaie voltooi`,
  statusCompleted: "Voltooi",
  statusInProgress: "Besig",
  statusPending: "Hangend",
  resumeAssessment: "Hervat aktiewe assessering",
  pathwaysSection: "3 Pasgemaakte paaie",
  pathwaysMeta: "Amptelik DHET-bekragtig",
  exploreByField: "Verken per veld",
  browseDirectories: "Blaai gidse",
  fieldIntro:
    "Visuele toegang tot universiteit-, gesondheid- en digitale loopbane — geen nuwe vraelyste nie, net gekeurde gidsroetes.",
  faqTitle: "Watter hulpmiddel moet ek eerste doen?",
  faqSub: "Tik die vraag wat die beste by jou situasie pas",
  helpTitle: "Persoonlike hulp nodig om te besluit?",
  helpBody:
    "’n DHET-loopbaanpraktisyn is gereed om jou diagnostiese resultate, APS-telling en aansoeksperke gratis te verduidelik.",
  callTollFree: (number) => `Bel tolvry: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "DHET Nasionale Leidingsenjin · Toestelkas",
  subject: {
    badgeLabel: "Aanbeveel vir hoërskool",
    duration: "5–8 min",
    title: "1. Vakkeuse",
    subtitle: "Ukukhetha Izifundo · CAPS-belyn",
    body: "Kies jou huidige of beoogde Graad 10–12-vakke om toelating tot universiteitsgrade, TVET-diplomas en hoë-aanvraag ambagte te toets. Voorkom dat akademiese deure te vroeg toegaan.",
    tags: ["APS-sakrekenaar", "Suiwer Wiskunde vs Wiskundige Geletterdheid", "Fakulteitsvoorvereistes"],
    cta: "Begin Vakkeuse",
    journeyLabel: "Vakkeuse (Graad 10–12)",
  },
  career: {
    badgeLabel: "Gewildste diagnostiek",
    duration: "12–15 min",
    title: "2. Loopbaankeuse-vraelys",
    subtitle: "Holland RIASEC-model · 11 Tale",
    body: "Ontdek watter velde by jou natuurlike persoonlikheid, passies en denkstyl pas. Skep jou amptelike 3-letter RIASEC-profiel gekoppel aan geregistreerde SAQA-beroeppe.",
    tags: [
      "Realistic · Investigative · Artistic",
      "1 432+ SAQA-loopbane",
      "Oudio-stem",
    ],
    cta: "Begin belangstellingsprofiel",
    journeyLabel: "Loopbaanbelangstelling (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Ideaal vir beroeps- & TVET-paaie",
    duration: "10 min",
    title: "3. Werksaanpas-vraelys",
    subtitle: "Werksomgewingspassing",
    body: "Evalueer konkrete daaglikse realiteite: buitelug-ambagte, ingenieurswerkswinkels, gesondheidsafdelings, korporatiewe spanne of onafhanklike digitale omgewings.",
    tags: [
      "SETA-vakleerlingskappe",
      "Sentrums van Spesialisasie",
      "Werksklimaatvereistes",
    ],
    cta: "Assesseer jou werksaanpas",
    journeyLabel: "Werksaanpas (Ambag & Artisan-fokus)",
  },
  faq1: {
    question: "In Graad 9 of kies Matriek-vakke?",
    best: "Beste keuse: 1. Vakkeuse",
    answer:
      "Help jou om APS-drempels vroeg te toets sodat jy nie Wiskunde of Wetenskap laat val as jou droomkwalifikasie dit vereis nie.",
  },
  faq2: {
    question: "Geen idee watter loopbaan by jou pas nie?",
    best: "Beste keuse: 2. Loopbaankeuse-vraelys",
    answer:
      "Ondersoek jou sielkundige voorkeure en persoonlikheid om ’n gekeurde kortlys van Suid-Afrikaanse beroeppe te gee.",
  },
  faq3: {
    question: "Verkies jy praktiese ambagte of TVET-paaie?",
    best: "Beste keuse: 3. Werksaanpas-vraelys",
    answer:
      "Fokus direk op fisiese, tegniese en ambagstoestande om jou met SETA-artisaan-kwalifikasies en Sentrums van Spesialisasie te verbind.",
  },
};

const zu: DecisionsStrings = {
  enginePill: "Injini Kazwelonke Yesiqondiso ye-DHET",
  careersCached: (count) => `Imisebenzi engu-${count} igciniwe`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Izinqumo",
  heroBody:
    "Awazi ukuthi uqala kuphi? Sebenzisa izindlela zethu ezintathu ezilinganiswe ngokwesayensi ukuze ufanise izifundo zesikole, izintshisekelo zobuntu, noma izintandokazi zendawo yokusebenza neziqu ezaziwa eNingizimu Afrika.",
  journeyTitle: "Uhambo Lwezinqumo Zakho",
  pathwaysCompleted: (done, total) =>
    `${done} kokungu-${total} kwezindlela kuqediwe`,
  statusCompleted: "Kuqediwe",
  statusInProgress: "Kuyaqhubeka",
  statusPending: "Kulindile",
  resumeAssessment: "Qhubeka Nokuhlola Okusebenzayo",
  pathwaysSection: "Izindlela Ezi-3 Eziqondene",
  pathwaysMeta: "Kuqinisekiswe yi-DHET",
  exploreByField: "Hlola ngomkhakha",
  browseDirectories: "Phequlula izizindalwazi",
  fieldIntro:
    "Amasango abonakalayo ayunivhesithi, ezempilo, nemisebenzi yedijithali — awukho uhlu lwemibuzo olusha, kuphela imizila yesizindalwazi ekhethiwe.",
  faqTitle: "Yiluphi ithuluzi engilithatha kuqala?",
  faqSub: "Thepha umbuzo ohambisana nesimo sakho",
  helpTitle: "Udinga usizo oluqondene nawe ukuze uqonde?",
  helpBody:
    "Umsebenzi weziluleko ze-DHET ulindile ukuchaza imiphumela yakho, i-APS, nezinsuku zokufaka isicelo mahhala.",
  callTollFree: (number) => `Shayela Mahhala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Injini Kazwelonke Yesiqondiso ye-DHET · Isitoreji sedivayisi",
  subject: {
    badgeLabel: "Kunconywa esikoleni esiphakeme",
    duration: "Imizuzu engu-5–8",
    title: "1. Ukukhetha Izifundo",
    subtitle: "Ukukhetha Izifundo · Kuhambisana ne-CAPS",
    body: "Khetha izifundo zakho zebanga 10–12 ukuhlola ukungena kumadigri, amadiploma e-TVET, nemisebenzi yezandla edingeka kakhulu. Vimbela ukuvala iminyango yemfundo kusenesikhathi.",
    tags: ["Isibali se-APS", "I-Maths Eqinile vs Math Lit", "Izidingo zefakhalthi"],
    cta: "Qala Ukukhetha Izifundo",
    journeyLabel: "Ukukhetha Izifundo (Ibanga 10–12)",
  },
  career: {
    badgeLabel: "Ukuhlola okuthandwa kakhulu",
    duration: "Imizuzu engu-12–15",
    title: "2. Uhlu Lwemibuzo Lokukhetha Umsebenzi",
    subtitle: "Imodeli ye-Holland RIASEC · Izilimi eziyi-11",
    body: "Thola ukuthi yimiphi imikhakha ehambisana nobuntu bakho, izintshisekelo, nendlela yakho yokucabanga. Yakha iphrofayili yakho ye-RIASEC enemibhalo emi-3 ehambisana nemisebenzi ye-SAQA.",
    tags: [
      "Realistic · Investigative · Artistic",
      "Imisebenzi ye-SAQA engu-1,432+",
      "Izwi Lomsindo",
    ],
    cta: "Qala Isihloli Sentshisekelo",
    journeyLabel: "Intshisekelo Yomsebenzi (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Kuhle kwe-TVET nemisebenzi yezandla",
    duration: "Imizuzu engu-10",
    title: "3. Uhlu Lwemibuzo Lokufaneleka Komsebenzi",
    subtitle: "Ukufanisa Indawo Yokusebenza",
    body: "Hlola izimo zansuku zonke: imisebenzi yangaphandle, izindawo zobunjiniyela, izibhedlela, amaqembu ehhovisi, noma izindawo zedijithali ezizimele.",
    tags: [
      "Ukufunda komsebenzi kwe-SETA",
      "Izikhungo Zobungcweti",
      "Izidingo Zendawo Yokusebenza",
    ],
    cta: "Hlola Ukufaneleka Komsebenzi",
    journeyLabel: "Ukufaneleka Komsebenzi (Umsebenzi Wezandla)",
  },
  faq1: {
    question: "Usebanga 9 noma ukhetha izifundo zeMatric?",
    best: "Okungcono: 1. Ukukhetha Izifundo",
    answer:
      "Kuyakusiza uhlole amazinga e-APS kusenesikhathi ukuze ungayeki i-Mathematics noma i-Science uma isiqu sephupho sakho siyidinga.",
  },
  faq2: {
    question: "Awazi ukuthi yimuphi umsebenzi okufanele?",
    best: "Okungcono: 2. Uhlu Lwemibuzo Lokukhetha Umsebenzi",
    answer:
      "Kuhlola izintandokazi zakho zobuntu ukuze kunikeze uhlu olufingqiwe lwemisebenzi yaseNingizimu Afrika.",
  },
  faq3: {
    question: "Uthanda imisebenzi yezandla noma i-TVET?",
    best: "Okungcono: 3. Uhlu Lwemibuzo Lokufaneleka Komsebenzi",
    answer:
      "Kugxila ezimeni zomzimba, zobuchwepheshe, nezomsebenzi wezandla ukukuxhumanisa neziqu ze-SETA nezikhungo zobungcweti.",
  },
};

const xh: DecisionsStrings = {
  enginePill: "Injini yeSizwe yeziKhokelo ye-DHET",
  careersCached: (count) => `Imisebenzi engama-${count} igciniwe`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Izigqibo",
  heroBody:
    "Awazi apho uqala khona? Sebenzisa iindlela zethu ezintathu ezilinganiswe ngesayensi ukuze ufanise izifundo zesikolo, umdla wobuntu, okanye iintandokazi zendawo yokusebenza neziqu ezivunyiweyo zaseMzantsi Afrika.",
  journeyTitle: "Uhambo Lwezigqibo Zakho",
  pathwaysCompleted: (done, total) =>
    `${done} kwi-${total} yeendlela zigqityiwe`,
  statusCompleted: "Kugqityiwe",
  statusInProgress: "Kuyaqhubeka",
  statusPending: "Kulindile",
  resumeAssessment: "Qhubeka Novavanyo Olusebenzayo",
  pathwaysSection: "Iindlela ezi-3 Eziqulunqiweyo",
  pathwaysMeta: "Iqinisekisiwe yi-DHET",
  exploreByField: "Khangela ngommandla",
  browseDirectories: "Khangela izizindalwazi",
  fieldIntro:
    "Amasango abonakalayo eyunivesithi, ezempilo, nemisebenzi yedijithali — akukho luhlu lwemibuzo olutsha, kuphela iindlela zesizindalwazi ezikhethiweyo.",
  faqTitle: "Sesiphi isixhobo endinokuthatha kuqala?",
  faqSub: "Cofa umbuzo ohambelana nemeko yakho",
  helpTitle: "Ufuna uncedo olulungiselelwe wena ukugqiba?",
  helpBody:
    "Ingcali yomsebenzi ye-DHET ilindile ukucacisa iziphumo zakho, i-APS, nemihla yokufaka isicelo simahla.",
  callTollFree: (number) => `Fowunela Simahla: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Injini yeSizwe yeziKhokelo ye-DHET · Isitoreji sesixhobo",
  subject: {
    badgeLabel: "Kucetyiswa kwisikolo esiphakamileyo",
    duration: "Imizuzu engama-5–8",
    title: "1. Ukukhetha Izifundo",
    subtitle: "Ukukhetha Izifundo · Kuhambelana ne-CAPS",
    body: "Khetha izifundo zakho zebanga le-10–12 ukuvavanya ukungena kwiidigri, iidploma ze-TVET, nemisebenzi yezandla efunekayo kakhulu. Thintela ukuvala iingcango zemfundo kwangethuba.",
    tags: ["Isibali se-APS", "I-Maths Enyulu vs Math Lit", "Iimfuneko zefakhalthi"],
    cta: "Qala Ukukhetha Izifundo",
    journeyLabel: "Ukukhetha Izifundo (Ibanga le-10–12)",
  },
  career: {
    badgeLabel: "Uvavanyo oluthandwa kakhulu",
    duration: "Imizuzu engama-12–15",
    title: "2. Uluhlu Lwemibuzo Lokukhetha Umsebenzi",
    subtitle: "Imodeli ye-Holland RIASEC · Iilwimi ezili-11",
    body: "Fumanisa ukuba yeyiphi imimandla ehambelana nobuntu bakho, iminqweno, nendlela yakho yokucinga. Yenza iprofayile yakho ye-RIASEC enoonobumba aba-3 ehambelana nemisebenzi ye-SAQA.",
    tags: [
      "Realistic · Investigative · Artistic",
      "Imisebenzi ye-SAQA engama-1,432+",
      "Ilizwi Lomsindo",
    ],
    cta: "Qala Isihloli Somdla",
    journeyLabel: "Umdla Womsebenzi (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Kulungele i-TVET nemisebenzi yezandla",
    duration: "Imizuzu engama-10",
    title: "3. Uluhlu Lwemibuzo Lokulungelelana Komsebenzi",
    subtitle: "Ukufanisa Indawo Yokusebenza",
    body: "Vavanya iinyani zemihla ngemihla: imisebenzi yangaphandle, iivenkile zobunjineli, iiwadhi zezempilo, amaqela eofisi, okanye iindawo zedijithali ezizimeleyo.",
    tags: [
      "Ukufunda komsebenzi kwe-SETA",
      "Iziko ZoBugcisa",
      "Iimfuneko Zomoya Wokusebenza",
    ],
    cta: "Vavanya Ukufaneleka Komsebenzi",
    journeyLabel: "Ukufaneleka Komsebenzi (Umsebenzi Wezandla)",
  },
  faq1: {
    question: "Usebanga lesi-9 okanye ukhetha izifundo zeMatric?",
    best: "Eyona khetho: 1. Ukukhetha Izifundo",
    answer:
      "Ikunceda uhlole imigangatho ye-APS kwangethuba ukuze ungayeki iMathematics okanye iScience xa isiqu sephupha sakho siyifuna.",
  },
  faq2: {
    question: "Awuyazi ukuba ngowuphi umsebenzi okufaneleyo?",
    best: "Eyona khetho: 2. Uluhlu Lwemibuzo Lokukhetha Umsebenzi",
    answer:
      "Ihlola iintandokazi zakho zobuntu ukuze inike uluhlu olufutshane lwemisebenzi yaseMzantsi Afrika.",
  },
  faq3: {
    question: "Ukhetha imisebenzi yezandla okanye iindlela ze-TVET?",
    best: "Eyona khetho: 3. Uluhlu Lwemibuzo Lokulungelelana Komsebenzi",
    answer:
      "Igxile kwiimeko zomzimba, zobugcisa, nezomsebenzi wezandla ukukudibanisa neziqu ze-SETA neziko zobugcisa.",
  },
};

const ss: DecisionsStrings = {
  ...zu,
  enginePill: "Injini Yesive Yesicondziso ye-DHET",
  careersCached: (count) => `Imisebenti lengu-${count} igciniwe`,
  heroTitle: "Tinchumo",
  journeyTitle: "Luhambo Lwetinchumo Takho",
  pathwaysCompleted: (done, total) =>
    `${done} ku-${total} kwetindlela kucedziwe`,
  statusCompleted: "Kucedziwe",
  statusInProgress: "Kuyachubeka",
  statusPending: "Kulindile",
  resumeAssessment: "Chubeka Nekuhlola Lokusebentako",
  pathwaysSection: "Tindlela Leti-3 Letihleliwe",
  pathwaysMeta: "Kucinisekisiwe yi-DHET",
  exploreByField: "Hlola ngemkhakha",
  browseDirectories: "Phequlula tilulu telwati",
  faqTitle: "Yiluphi lithuluzi engilitsatsa kucala?",
  faqSub: "Thepha umbuto lohambisana nesimo sakho",
  helpTitle: "Udzinga lusito loluhambisana nawe kuze ucine?",
  callTollFree: (number) => `Shayela Mahhala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Injini Yesive Yesicondziso ye-DHET · Sitolo sedivayisi",
  career: {
    ...zu.career,
    subtitle: "Imodeli ye-Holland RIASEC · Tilwimi letingu-11",
    title: "2. Luhlu Lwemibuto Lwekukhetsa Umsebenti",
    cta: "Cala Sihloli Sentshisekelo",
  },
  subject: {
    ...zu.subject,
    title: "1. Kukhetsa Tifundvo",
    cta: "Cala Kukhetsa Tifundvo",
  },
  jobFit: {
    ...zu.jobFit,
    title: "3. Luhlu Lwemibuto Lwekufaneleka Kwemsebenti",
    cta: "Hlola Kufaneleka Kwemsebenti",
  },
};

const nso: DecisionsStrings = {
  enginePill: "Enjene ya Bosetšhaba ya Tšhupetšo ya DHET",
  careersCached: (count) => `Mešomo ye ${count} e bolokilwe`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Diphetho",
  heroBody:
    "Ga o tsebe gore o thome kae? Diriša ditsela tša rena tše tharo tše di lekantšhwego ka mahlale go nyalantšha dithuto tša sekolo, dikgahlego tša botho, goba dikgetho tša tikology ya mošomo le ditshwanelo tša Afrika Borwa.",
  journeyTitle: "Leeto la Gago la Diphetho",
  pathwaysCompleted: (done, total) =>
    `${done} ya ${total} ya ditsela di phethilwe`,
  statusCompleted: "E phethilwe",
  statusInProgress: "E a tšwela pele",
  statusPending: "E emetše",
  resumeAssessment: "Tšwela pele ka Teko ye e Šomago",
  pathwaysSection: "Ditsela tše 3 tše di Rulagantšwego",
  pathwaysMeta: "E tišeditšwe ke DHET",
  exploreByField: "Nyakišiša ka lekala",
  browseDirectories: "Phetla ditšhupetšo",
  fieldIntro:
    "Dikgoro tša go bonagala tša yunibesithi, maphelo, le mešomo ya dijithale — ga go na lenaneo le leswa la dipotšišo, ke ditsela tša tšhupetšo tše di kgethilwego fela.",
  faqTitle: "Ke sedirišwa sefe seo ke swanetšego go se thoma?",
  faqSub: "Kgotla potšišo ye e swanago le seemo sa gago",
  helpTitle: "O nyaka thušo ye e ikgethilego go phetha?",
  helpBody:
    "Mothušimšomo wa DHET o emetše go hlalosa dipoelo tša gago, APS, le dinako tša go dira kgopelo mahala.",
  callTollFree: (number) => `Letšetša Mahala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Enjene ya Bosetšhaba ya Tšhupetšo ya DHET · Polokelo ya sedirišwa",
  subject: {
    badgeLabel: "E šišinywa sekolo se se phagamego",
    duration: "Metsotso ye 5–8",
    title: "1. Kgetho ya Dithuto",
    subtitle: "Ukukhetha Izifundo · E nyalantšhwa le CAPS",
    body: "Kgetha dithuto tša gago tša Mphato wa 10–12 go leka go tsena digrii, diploma tša TVET, le mešomo ya diatla ye e nyakegago kudu. Thibela go tswalela menyako ya thuto gabonolo.",
    tags: ["Sekhokhathi sa APS", "Pure Maths vs Math Lit", "Dinyakwa tša fakhalthi"],
    cta: "Thoma Kgetho ya Dithuto",
    journeyLabel: "Kgetho ya Dithuto (Mphato wa 10–12)",
  },
  career: {
    badgeLabel: "Teko ye e rategago kudu",
    duration: "Metsotso ye 12–15",
    title: "2. Lenaneo la Dipotšišo tša Kgetho ya Mošomo",
    subtitle: "Modeli ya Holland RIASEC · Maleme a 11",
    body: "Hwetša gore ke makala afe ao a swanago le botho bja gago, dikgahlego, le mokgwa wa gago wa go nagana. Hlama profili ya gago ya RIASEC ya ditlhaka tše 3 ye e nyalantšhwago le mešomo ya SAQA.",
    tags: [
      "Realistic · Investigative · Artistic",
      "Mešomo ya SAQA ye 1,432+",
      "Lentšu la Odio",
    ],
    cta: "Thoma Sehlahlobi sa Kgahlego",
    journeyLabel: "Kgahlego ya Mošomo (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "E loketše TVET le mešomo ya diatla",
    duration: "Metsotso ye 10",
    title: "3. Lenaneo la Dipotšišo tša Go Swana le Mošomo",
    subtitle: "Go Nyalantšha Tikology ya Mošomo",
    body: "Sekaseka ditiragalo tša letšatši le letšatši: mešomo ya ka ntle, dibaka tša boenjinere, diwadu tša maphelo, ditlhopha tša ofisi, goba dibaka tša dijithale tše di ikemetšego.",
    tags: [
      "Dithuto tša SETA",
      "Disenthara tša Bokgoni",
      "Dinyakwa tša Mooya wa Mošomo",
    ],
    cta: "Leka Go Swana le Mošomo",
    journeyLabel: "Go Swana le Mošomo (Mešomo ya Diatla)",
  },
  faq1: {
    question: "O Mphatong wa 9 goba o kgetha dithuto tša Matric?",
    best: "Kgetho ye kaone: 1. Kgetho ya Dithuto",
    answer:
      "E go thuša go leka melawana ya APS gabonolo gore o se ke wa tlogela Mathematics goba Science ge setifikeiti sa gago sa ditoro se se nyaka.",
  },
  faq2: {
    question: "Ga o tsebe gore ke mošomo ofe wo o go swanago?",
    best: "Kgetho ye kaone: 2. Lenaneo la Dipotšišo tša Kgetho ya Mošomo",
    answer:
      "E sekaseka dikgetho tša gago tša botho go fana ka lenaneo le le kopana la mešomo ya Afrika Borwa.",
  },
  faq3: {
    question: "O rata mešomo ya diatla goba ditsela tša TVET?",
    best: "Kgetho ye kaone: 3. Lenaneo la Dipotšišo tša Go Swana le Mošomo",
    answer:
      "E lebeletše ka go lebanya maemo a mmele, a tekniki, le a mešomo ya diatla go go kgokaganya le ditshwanelo tša SETA le Disenthara tša Bokgoni.",
  },
};

const st: DecisionsStrings = {
  ...nso,
  enginePill: "Enjene ea Naha ea Tataiso ea DHET",
  careersCached: (count) => `Mesebetsi e ${count} e bolokiloeng`,
  heroTitle: "Liqeto",
  journeyTitle: "Leeto la Hao la Liqeto",
  pathwaysCompleted: (done, total) =>
    `${done} ea ${total} ea litsela e phethiloe`,
  statusCompleted: "E phethiloe",
  statusInProgress: "E ntse e tsoela pele",
  statusPending: "E emetse",
  resumeAssessment: "Tsoela pele ka Tlhahlobo e Sebetsang",
  pathwaysSection: "Litsela tse 3 tse Reriloeng",
  pathwaysMeta: "E tiisitsoe ke DHET",
  exploreByField: "Hlahloba ka lekala",
  browseDirectories: "Bala litataiso",
  faqTitle: "Ke sesebelisoa sefe seo ke lokelang ho se qala?",
  faqSub: "Tobetsa potso e u loketseng",
  helpTitle: "U hloka thuso e ikhethileng ho etsa qeto?",
  callTollFree: (number) => `Letsetsa Mahala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Enjene ea Naha ea Tataiso ea DHET · Polokelo ea sesebelisoa",
  career: {
    ...nso.career,
    subtitle: "Modeli ea Holland RIASEC · Lipuo tse 11",
    title: "2. Lenane la Lipotso tsa Khetho ea Mosebetsi",
    cta: "Qala Sehlahlobi sa Thahasello",
  },
  subject: {
    ...nso.subject,
    title: "1. Khetho ea Lithuto",
    cta: "Qala Khetho ea Lithuto",
  },
  jobFit: {
    ...nso.jobFit,
    title: "3. Lenane la Lipotso tsa Ho Tšoana le Mosebetsi",
    cta: "Hlahloba Ho Tšoana le Mosebetsi",
  },
};

const tn: DecisionsStrings = {
  ...nso,
  enginePill: "Enjene ya Bosetšhaba ya Tshupiso ya DHET",
  careersCached: (count) => `Ditiro tse ${count} di bolokilwe`,
  heroTitle: "Ditshwetso",
  journeyTitle: "Loeto lwa Gago lwa Ditshwetso",
  pathwaysCompleted: (done, total) =>
    `${done} ya ${total} ya ditsela di weditswe`,
  statusCompleted: "E weditswe",
  statusInProgress: "E a tswelela",
  statusPending: "E emetse",
  resumeAssessment: "Tswelela ka Teko e e Dirang",
  pathwaysSection: "Ditsela tse 3 tse di Rulagantsweng",
  pathwaysMeta: "E netefaditswe ke DHET",
  exploreByField: "Batlisisa ka lekala",
  browseDirectories: "Bala ditshupiso",
  faqTitle: "Ke sediriswa sefe se ke tshwanetseng go se simolola?",
  faqSub: "Tobetsa potso e e tshwanetseng maemo a gago",
  helpTitle: "O tlhoka thuso e e ikgethileng go tsaya tshwetso?",
  callTollFree: (number) => `Letsetsa Mahala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Enjene ya Bosetšhaba ya Tshupiso ya DHET · Polokelo ya sediriswa",
  career: {
    ...nso.career,
    subtitle: "Modeli ya Holland RIASEC · Dipuo di le 11",
    title: "2. Lenaneo la Dipotso tsa Tlhopho ya Tiro",
    cta: "Simolola Sehlahlobi sa Kgatlhego",
  },
  subject: {
    ...nso.subject,
    title: "1. Tlhopho ya Dithuto",
    cta: "Simolola Tlhopho ya Dithuto",
  },
  jobFit: {
    ...nso.jobFit,
    title: "3. Lenaneo la Dipotso tsa Go Tshwana le Tiro",
    cta: "Sekaseka Go Tshwana le Tiro",
  },
};

const ve: DecisionsStrings = {
  enginePill: "Injini ya Lushaka ya Tshumisano ya DHET",
  careersCached: (count) => `Mishumo ya ${count} yo vhulungwa`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Zwitatiso",
  heroBody:
    "A ni ḓivhi hune na thoma hone? Shumisani nḓila dzashu tharu dzo kaliburiwaho nga sainthi u swikelela thero dza tshikolo, zwipfiwa zwa vhuthu, kana zwine na zwi funa kha vhuthithi ha mushumo na zwitirekho zwo tendelwaho zwa Afrika Tshipembe.",
  journeyTitle: "Luendo lwanu lwa Zwitatiso",
  pathwaysCompleted: (done, total) =>
    `${done} ya ${total} ya nḓila dzo fhela`,
  statusCompleted: "Yo fhela",
  statusInProgress: "I khou bvela phanda",
  statusPending: "I khou linda",
  resumeAssessment: "Bvelani phanda nga U Sedzulusa ho Shumaho",
  pathwaysSection: "Nḓila 3 dzo Rulusiwaho",
  pathwaysMeta: "Yo khwaṱhisedzwa nga DHET",
  exploreByField: "Ṱolisani nga muhasho",
  browseDirectories: "Vhalani tshumisano",
  fieldIntro:
    "Mikovhe i vhonalaho ya yunivesithi, mutakalo, na mishumo ya didzhithala — a huna muṅwalo muswa wa mbudziso, ndi nḓila dza tshumisano dzo nangiwaho fhedzi.",
  faqTitle: "Ndi tshishumiswa tchifhio tshine nda tea u thoma ngatsho?",
  faqSub: "Kitikitelani mbudziso i teaho kha tshiimo tshanu",
  helpTitle: "Ni khou ṱoḓa thuso yo ḓoweledzwaho u tatisani?",
  helpBody:
    "Mugudisi wa mushumo wa DHET u khou linda u ṱalutshedza mvelelo dzanu, APS, na maduvha a u ita khumbelo mahala.",
  callTollFree: (number) => `Fonani Mahala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Injini ya Lushaka ya Tshumisano ya DHET · Tshivhulungi tsha tshishumiswa",
  subject: {
    badgeLabel: "Yo eletshedzwa tshikoloni tsha nṱha",
    duration: "Miminithi 5–8",
    title: "1. U Nanga Thero",
    subtitle: "Ukukhetha Izifundo · Yo tevhedzana na CAPS",
    body: "Nangani thero dzanu dza Gireidi 10–12 u linga u dzhena digirii, diploma dza TVET, na mishumo ya zwanda i ṱoḓeaho vhukuma. Thivhelani u vala mikovhe ya pfunzo kha tshifhinga.",
    tags: ["Tshiṱaluli tsha APS", "Pure Maths vs Math Lit", "Zwine zwa tea kha fakhalthi"],
    cta: "Thomani U Nanga Thero",
    journeyLabel: "U Nanga Thero (Gireidi 10–12)",
  },
  career: {
    badgeLabel: "U sedzulusa ho funwaho vhukuma",
    duration: "Miminithi 12–15",
    title: "2. Muṅwalo wa Mbudziso wa U Nanga Mushumo",
    subtitle: "Modeli ya Holland RIASEC · Nyambo dza 11",
    body: "Wanani uri ndi mahasho afhio a teaho na vhuthu hanu, zwipfiwa, na nḓila yanu ya u humbula. Sikani profili yanu ya RIASEC ya maletere a 3 yo tevhedzanaho na mishumo ya SAQA.",
    tags: [
      "Realistic · Investigative · Artistic",
      "Mishumo ya SAQA ya 1,432+",
      "Ipfi ḽa Odio",
    ],
    cta: "Thomani Tshiṱolisisi tsha Ḓaḓa",
    journeyLabel: "Ḓaḓa ya Mushumo (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Yo lugiswa TVET na mishumo ya zwanda",
    duration: "Miminithi 10",
    title: "3. Muṅwalo wa Mbudziso wa U Tea Mushumoni",
    subtitle: "U Swikelela Vhuthithi ha Mushumo",
    body: "Sedzulusani zwa ḓuvha ḽiṅwe na ḽiṅwe: mishumo ya nnda, zwifheto zwa vhunzhiniere, dziwadu dza mutakalo, zwigwada zwa ofisi, kana vhuthithi ha didzhithala ho ḓiimisaho.",
    tags: [
      "U guda mushumo ha SETA",
      "Zwikolo zwa Vhukoni",
      "Zwine zwa tea kha Vhuthithi ha Mushumo",
    ],
    cta: "Sedzulusani U Tea Mushumoni",
    journeyLabel: "U Tea Mushumoni (Mishumo ya Zwanda)",
  },
  faq1: {
    question: "Ni kha Gireidi 9 kana ni khou nanga thero dza Matric?",
    best: "Khetho yavhuḓi: 1. U Nanga Thero",
    answer:
      "I ni thusa u linga milingo ya APS kha tshifhinga uri ni songo litsha Mathematics kana Science arali tshitirekho tshanu tsha ndoro tshi tshi tshi ṱoḓa.",
  },
  faq2: {
    question: "A ni ḓivhi uri ndi mushumo ufhio u teaho kha inwi?",
    best: "Khetho yavhuḓi: 2. Muṅwalo wa Mbudziso wa U Nanga Mushumo",
    answer:
      "I sedzulusa zwine na zwi funa kha vhuthu uri i ṋee mutevhe mupfufhi wa mishumo ya Afrika Tshipembe.",
  },
  faq3: {
    question: "Ni funa mishumo ya zwanda kana nḓila dza TVET?",
    best: "Khetho yavhuḓi: 3. Muṅwalo wa Mbudziso wa U Tea Mushumoni",
    answer:
      "I sedza nga u tou vhonisa maemo a muvhili, a thekiniki, na a mishumo ya zwanda u ni ṱumanya na zwitirekho zwa SETA na Zwikolo zwa Vhukoni.",
  },
};

const ts: DecisionsStrings = {
  enginePill: "Injini ya Rixaka ya Xikombiso xa DHET",
  careersCached: (count) => `Mintirho ya ${count} yi hlayisiwile`,
  heroKicker: "Thatha Isinqumo Esifanele · Neem die regte besluit",
  heroTitle: "Swiboho",
  heroBody:
    "A wu tivi laha u sungulaka kona? Tirhisa tindlela ta hina ta tinharhu leti pimanisiweke hi sayense ku fambisana tidyondzo ta xikolo, ku tsakela ka vumunhu, kumbe swihlawulekisi swa mbangu wa ntirho na switifikheti leswi amukeriweke swa Afrika Dzonga.",
  journeyTitle: "Rendzo ra Wena ra Swiboho",
  pathwaysCompleted: (done, total) =>
    `${done} ya ${total} ya tindlela ti hetisiwile`,
  statusCompleted: "Yi hetisiwile",
  statusInProgress: "Yi ya emahlweni",
  statusPending: "Yi rindzile",
  resumeAssessment: "Yisa Emahlweni Nkambelo lowu Tirhaka",
  pathwaysSection: "Tindlela ta 3 leti Lunghiseriweke",
  pathwaysMeta: "Yi tiyisisiwile hi DHET",
  exploreByField: "Lavisisa hi nsimu",
  browseDirectories: "Hlaya swikombiso",
  fieldIntro:
    "Tinyangwa leti vonakaka ta yunivhesiti, rihanyu, na mintirho ya dijithali — a ku na nxaxamelo wuntshwa wa swivutiso, i tindlela ta xikombiso leti hlawuriweke ntsena.",
  faqTitle: "I xitirho xihi lexi ndzi faneleke ku xi sungula?",
  faqSub: "Tshikelela xivutiso lexi fambelanaka na xiyimo xa wena",
  helpTitle: "U lava mpfuno lowu hlawuriweke ku teka xiboho?",
  helpBody:
    "Mudyondzisi wa ntirho wa DHET u rindzile ku hlamusela mbuyelo ya wena, APS, na masiku ya ku endla xikombelo mahala.",
  callTollFree: (number) => `Fowuna Mahala: ${number}`,
  whatsappLabel: (number) => `WhatsApp: ${number}`,
  offlineDetail: "Injini ya Rixaka ya Xikombiso xa DHET · Vuhlayiselo bya xitirhisiwa",
  subject: {
    badgeLabel: "Yi bumabumeriwa eka xikolo xa le henhla",
    duration: "Timinete ta 5–8",
    title: "1. Hlawula Tidyondzo",
    subtitle: "Ukukhetha Izifundo · Yi fambisana na CAPS",
    body: "Hlawula tidyondzo ta wena ta Gireidi 10–12 ku ringeta ku nghena tidigiri, tidiploma ta TVET, na mintirho ya mavoko leyi lavaka swinene. Sivela ku pfala tinyangwa ta dyondzo hi nkarhi.",
    tags: ["Xihlayisi xa APS", "Pure Maths vs Math Lit", "Swilaveko swa fakhalthi"],
    cta: "Sungula Ku Hlawula Tidyondzo",
    journeyLabel: "Ku Hlawula Tidyondzo (Gireidi 10–12)",
  },
  career: {
    badgeLabel: "Nkambelo lowu rhandziwaka swinene",
    duration: "Timinete ta 12–15",
    title: "2. Nxaxamelo wa Swivutiso swa Ku Hlawula Ntirho",
    subtitle: "Modeli ya Holland RIASEC · Tindzimi ta 11",
    body: "Kuma leswaku i masimu wahi lama fambelanaka na vumunhu bya wena, ku tsakela, na ndlela ya wena yo ehleketa. Tumbuluxa profili ya wena ya RIASEC ya maletere ya 3 leyi fambisanaka na mintirho ya SAQA.",
    tags: [
      "Realistic · Investigative · Artistic",
      "Mintirho ya SAQA ya 1,432+",
      "Rito ra Odio",
    ],
    cta: "Sungula Xikambeli xa Ku Tsakela",
    journeyLabel: "Ku Tsakela Ntirho (Holland RIASEC)",
  },
  jobFit: {
    badgeLabel: "Yi lulamile eka TVET na mintirho ya mavoko",
    duration: "Timinete ta 10",
    title: "3. Nxaxamelo wa Swivutiso swa Ku Fambelana na Ntirho",
    subtitle: "Ku Fambisana Mbangu wa Ntirho",
    body: "Kambela swa siku ni siku: mintirho ya handle, tindhawu ta vunjinere, tiwadu ta rihanyu, mintlawa ya ofisi, kumbe mimbangu ya dijithali leyi tiyimeleke.",
    tags: [
      "Dyondzo ya ntirho ya SETA",
      "Swikolo swa Vuswikoti",
      "Swilaveko swa Mbangu wa Ntirho",
    ],
    cta: "Kambela Ku Fambelana na Ntirho",
    journeyLabel: "Ku Fambelana na Ntirho (Mintirho ya Mavoko)",
  },
  faq1: {
    question: "U eka Gireidi 9 kumbe u hlawula tidyondzo ta Matric?",
    best: "Hlawulo ra kahle: 1. Hlawula Tidyondzo",
    answer:
      "Yi ku pfuna ku ringeta milawu ya APS hi nkarhi leswaku u nga tshiki Mathematics kumbe Science loko xitifikheti xa norho xa wena xi xi lava.",
  },
  faq2: {
    question: "A wu tivi leswaku i ntirho wihi lowu fambelanaka na wena?",
    best: "Hlawulo ra kahle: 2. Nxaxamelo wa Swivutiso swa Ku Hlawula Ntirho",
    answer:
      "Yi kambela swihlawulekisi swa wena swa vumunhu ku nyika nxaxamelo lowu koma wa mintirho ya Afrika Dzonga.",
  },
  faq3: {
    question: "U tsakela mintirho ya mavoko kumbe tindlela ta TVET?",
    best: "Hlawulo ra kahle: 3. Nxaxamelo wa Swivutiso swa Ku Fambelana na Ntirho",
    answer:
      "Yi kongomisa eka swiyimo swa miri, swa thekiniki, na swa mintirho ya mavoko ku ku khomanisa na switifikheti swa SETA na Swikolo swa Vuswikoti.",
  },
};

// Fix nr — rebuild cleanly without the botched clone
const nrClean: DecisionsStrings = {
  ...zu,
  heroTitle: "Iinqumo",
  career: {
    ...zu.career,
    subtitle: "Imodeli ye-Holland RIASEC · Iilimi eziyi-11",
  },
};

const DECISIONS_I18N = createBundle<DecisionsStrings>({
  en,
  af,
  zu,
  xh,
  nr: nrClean,
  ss,
  nso,
  st,
  tn,
  ve,
  ts,
});

export function getDecisionsStrings(
  locale: string | null | undefined,
): DecisionsStrings {
  return DECISIONS_I18N[resolveLocale(locale)];
}
