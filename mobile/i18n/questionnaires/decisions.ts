import { expandSaLocales, resolveLocale } from "../createBundle";

export type DecisionsStrings = {
  title: string;
  subtitle: string;
  journeyTitle: string;
  faqTitle: string;
  statusCompleted: string;
  statusInProgress: string;
  statusPending: string;
  subjectChooser: {
    badgeLabel: string;
    duration: string;
    title: string;
    subtitle: string;
    body: string;
    tags: string[];
    cta: string;
    journeyLabel: string;
  };
  careerChoice: {
    badgeLabel: string;
    duration: string;
    title: string;
    subtitle: string;
    body: string;
    tags: string[];
    cta: string;
    journeyLabel: string;
  };
  jobFit: {
    badgeLabel: string;
    duration: string;
    title: string;
    subtitle: string;
    body: string;
    tags: string[];
    cta: string;
    journeyLabel: string;
  };
  faq: {
    q1: string;
    best1: string;
    a1: string;
    q2: string;
    best2: string;
    a2: string;
    q3: string;
    best3: string;
    a3: string;
  };
};

const en: DecisionsStrings = {
  title: "Career Decision Tools",
  subtitle: "Choose a pathway diagnostic to match subjects, interests, or workplace fit.",
  journeyTitle: "Your decision journey",
  faqTitle: "Which tool should I start with?",
  statusCompleted: "Completed",
  statusInProgress: "In Progress",
  statusPending: "Pending",
  subjectChooser: {
    badgeLabel: "Recommended for High School",
    duration: "5–8 mins",
    title: "1. Subject Chooser",
    subtitle: "Ukukhetha Izifundo · CAPS Aligned",
    body: "Select your current or prospective Grade 10–12 subjects to test admission into university degrees, TVET college diplomas, and high-demand trades. Prevent closing academic doors early.",
    tags: [
      "APS Calculator",
      "Pure Maths vs Math Lit",
      "Faculty Prerequisites"
    ],
    cta: "Launch Subject Chooser",
    journeyLabel: "Subject Choice (Grade 10–12)"
  },
  careerChoice: {
    badgeLabel: "Most Popular Diagnostic",
    duration: "12–15 mins",
    title: "2. Career Choice Questionnaire",
    subtitle: "Holland RIASEC Model · 11 Languages",
    body: "Discover which fields truly match your natural personality, passions, and core thinking style. Generates your official 3-letter RIASEC profile mapped to registered SAQA occupations.",
    tags: [
      "Realistic · Investigative · Artistic",
      "1,432+ SAQA Careers",
      "Audio Voice-Over"
    ],
    cta: "Start Interest Profiler",
    journeyLabel: "Career Interest (Holland RIASEC)"
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
      "Work Climate Demands"
    ],
    cta: "Assess Your Job Fit",
    journeyLabel: "Job Fit (Trade & Artisan Focus)"
  },
  faq: {
    q1: "In Grade 9 or choosing Matric subjects?",
    best1: "Best choice: 1. Subject Chooser",
    a1: "Helps you check APS thresholds early so you don't drop Mathematics or Science if your dream qualification requires it.",
    q2: "No idea what career fits you?",
    best2: "Best choice: 2. Career Choice Questionnaire",
    a2: "Examines your core psychological preferences and personality affinities to provide a curated shortlist of South African occupations.",
    q3: "Prefer hands-on trades or TVET paths?",
    best3: "Best choice: 3. Job Fit Questionnaire",
    a3: "Focuses directly on physical, technical, and trade conditions to connect you with SETA artisanal qualifications and Centres of Specialisation."
  }
};

const af: DecisionsStrings = {
  title: "Loopbaanbesluit-hulpmiddels",
  subtitle: "Kies 'n pad-diagnostiek om vakke, belangstellings of werkplekpassing te pas.",
  journeyTitle: "Jou besluitreis",
  faqTitle: "Met watter hulpmiddel moet ek begin?",
  statusCompleted: "Voltooi",
  statusInProgress: "Besig",
  statusPending: "Hangende",
  subjectChooser: {
    badgeLabel: "Aanbeveel vir hoërskool",
    duration: "5–8 min",
    title: "1. Vakkieuse",
    subtitle: "Ukukhetha Izifundo · CAPS-belyn",
    body: "Kies jou huidige of toekomstige Graad 10–12-vakke om toelating tot universiteitsgrade, TVET-diplomas en hoë-aanvraag ambagte te toets. Moenie akademiese deure vroeg toemaak nie.",
    tags: [
      "APS-sakrekenaar",
      "Suiwer Wiskunde vs Wiskunde-geletterdheid",
      "Fakulteitsvoorvereistes"
    ],
    cta: "Begin Vakkieuse",
    journeyLabel: "Vakkeuse (Graad 10–12)"
  },
  careerChoice: {
    badgeLabel: "Gewildste diagnostiek",
    duration: "12–15 min",
    title: "2. Loopbaankeuse-vraelys",
    subtitle: "Holland RIASEC-model · 11 Tale",
    body: "Ontdek watter velde werklik by jou natuurlike persoonlikheid, passies en denkstyl pas. Skep jou amptelike 3-letter RIASEC-profiel gekoppel aan geregistreerde SAQA-beroeppe.",
    tags: [
      "Realisties · Ondersoekend · Artistiek",
      "1,432+ SAQA-loopbane",
      "Oudio-stemoorlegging"
    ],
    cta: "Begin Belangstellingsprofiler",
    journeyLabel: "Loopbaanbelangstelling (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "Ideaal vir beroeps- & TVET",
    duration: "10 min",
    title: "3. Werkspassing-vraelys",
    subtitle: "Werkplekomgewing-passing",
    body: "Evalueer tasbare daaglikse realiteite: buitelug-fisiese ambagte, ingenieurswerkswinkels, gesondheidsale, korporatiewe spanne of onafhanklike digitale omgewings.",
    tags: [
      "SETA-leerlingskappe",
      "Spesialisasiesentrums",
      "Werkklimaatvereistes"
    ],
    cta: "Assesseer jou werkspassing",
    journeyLabel: "Werkspassing (Ambag- & Ambagsfokus)"
  },
  faq: {
    q1: "In Graad 9 of kies Matriekvakke?",
    best1: "Beste keuse: 1. Vakkieuse",
    a1: "Help jou om APS-drempels vroeg te kontroleer sodat jy nie Wiskunde of Wetenskap laat vaar as jou droomkwalifikasie dit vereis nie.",
    q2: "Geen idee watter loopbaan by jou pas nie?",
    best2: "Beste keuse: 2. Loopbaankeuse-vraelys",
    a2: "Ondersoek jou kern sielkundige voorkeure en persoonlikheidsaffiniteite om 'n gekeurde kortlys van Suid-Afrikaanse beroeppe te bied.",
    q3: "Verkies jy hands-on ambagte of TVET-paaie?",
    best3: "Beste keuse: 3. Werkspassing-vraelys",
    a3: "Fokus direk op fisiese, tegniese en ambagstoestande om jou te verbind met SETA-ambagskwalifikasies en Spesialisasiesentrums."
  }
};

const zu: DecisionsStrings = {
  title: "Amathuluzi Ezinqumo Zomsebenzi",
  subtitle: "Khetha ukuhlola kwendlela ukuze ufanise izifundo, izintshisekelo, noma ukufaneleka kwendawo yokusebenza.",
  journeyTitle: "Uhambo lwakho lwezinqumo",
  faqTitle: "Yiliphi ithuluzi engiqala ngalo?",
  statusCompleted: "Kuqediwe",
  statusInProgress: "Kuyaqhubeka",
  statusPending: "Kulindile",
  subjectChooser: {
    badgeLabel: "Kunconywa esikoleni esiphakeme",
    duration: "Imizuzu engu-5–8",
    title: "1. Ukukhetha Izifundo",
    subtitle: "Ukukhetha Izifundo · CAPS",
    body: "Khetha izifundo zakho zamanje noma ezizayo zebanga le-10–12 ukuze uhlola ukwamukelwa eziqu zasenyuvesi, amadiploma e-TVET, nemisebenzi edingekayo kakhulu.",
    tags: [
      "Isibali se-APS",
      "Izibalo Ezihlanzekile vs Ukufunda Izibalo",
      "Izidingo Zefakhalthi"
    ],
    cta: "Qala Ukukhetha Izifundo",
    journeyLabel: "Ukukhetha Izifundo (Ibanga 10–12)"
  },
  careerChoice: {
    badgeLabel: "Ukuhlola Okudume Kakhulu",
    duration: "Imizuzu engu-12–15",
    title: "2. Uhlu Lwemibuzo Lokukhetha Umsebenzi",
    subtitle: "Imodeli ye-Holland RIASEC · Izilimi ezingu-11",
    body: "Thola ukuthi yimaphi amasimu afana nobuntu bakho, izinkanuko, nendlela yokucabanga. Idala iphrofayela yakho ye-RIASEC yezinhlamvu ezingu-3 exhunywe emisebenzini ye-SAQA.",
    tags: [
      "Okungokoqobo · Okuphenyayo · Kobuciko",
      "Imisebenzi ye-SAQA engu-1,432+",
      "Ukufunda ngezwi"
    ],
    cta: "Qala I-Interest Profiler",
    journeyLabel: "Intshisekelo Yomsebenzi (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "Kuhle kwezobuchwepheshe ne-TVET",
    duration: "Imizuzu engu-10",
    title: "3. Uhlu Lwemibuzo Lokufaneleka Komsebenzi",
    subtitle: "Ukufana Kwendawo Yokusebenza",
    body: "Hlola izimo zansuku zonke: imisebenzi yangaphandle, izindawo zobunjiniyela, izibhedlela, amaqembu ezinkampani, noma izindawo zedijithali.",
    tags: [
      "Ukufunda kwe-SETA",
      "Izikhungo Zobuchwepheshe",
      "Izidingo Zesimo Sokusebenza"
    ],
    cta: "Hlola Ukufaneleka Komsebenzi",
    journeyLabel: "Ukufaneleka Komsebenzi (Ukugxila Emisebenzini)"
  },
  faq: {
    q1: "Usebanga le-9 noma ukhetha izifundo zomatikuletsheni?",
    best1: "Ukukhetha okuhle: 1. Ukukhetha Izifundo",
    a1: "Kukusiza uhlole imingcele ye-APS kusenesikhathi ukuze ungayeki Izibalo noma iSayensi uma iziqu zakho zaphupha zidinga.",
    q2: "Awazi ukuthi yimuphi umsebenzi ofanele wena?",
    best2: "Ukukhetha okuhle: 2. Uhlu Lwemibuzo Lokukhetha Umsebenzi",
    a2: "Kuhlola izintandokazi zakho zobungqondo nobuntu ukuze kuhlinzeke uhlu olukhethiwe lwemisebenzi yaseNingizimu Afrika.",
    q3: "Ukhetha imisebenzi yezandla noma izindlela ze-TVET?",
    best3: "Ukukhetha okuhle: 3. Uhlu Lwemibuzo Lokufaneleka Komsebenzi",
    a3: "Kugxile ezimweni zomzimba, zobuchwepheshe, nemisebenzi ukuze kukuxhume neziqu ze-SETA nezikhungo zobuchwepheshe."
  }
};

const xh: DecisionsStrings = {
  title: "Izixhobo Zezigqibo Zomsebenzi",
  subtitle: "Khetha uvavanyo lwendlela ukuze ufanise izifundo, iintshisekelo, okanye ukufanela indawo yokusebenza.",
  journeyTitle: "Uhambo lwakho lwezigqibo",
  faqTitle: "Yeyiphi isixhobo endiqala ngayo?",
  statusCompleted: "Kugqityiwe",
  statusInProgress: "Kuyaqhubeka",
  statusPending: "Kulindile",
  subjectChooser: {
    badgeLabel: "Kucetyiswa kwisikolo esiphakamileyo",
    duration: "Imizuzu emi-5–8",
    title: "1. Ukukhetha Izifundo",
    subtitle: "Ukukhetha Izifundo · CAPS",
    body: "Khetha izifundo zakho zangoku okanye ezizayo zebanga le-10–12 ukuze uvavanye ukwamkelwa kwizidanga zeyunivesithi, iidiploma ze-TVET, nemisebenzi efunekayo kakhulu.",
    tags: [
      "Isibali se-APS",
      "Izibalo Ezihlambulukileyo vs Ukufunda Izibalo",
      "Iimfuno Zefakhalthi"
    ],
    cta: "Qala Ukukhetha Izifundo",
    journeyLabel: "Ukukhetha Izifundo (Ibanga 10–12)"
  },
  careerChoice: {
    badgeLabel: "Uvavanyo Oludume Kakhulu",
    duration: "Imizuzu eli-12–15",
    title: "2. Uluhlu Lwemibuzo Lokukhetha Umsebenzi",
    subtitle: "Imodeli ye-Holland RIASEC · Iilwimi ezili-11",
    body: "Fumanisa ukuba ngawaphi amasimi afana nobuntu bakho, iinkanuko, nendlela yokucinga. Yenza iprofayile yakho ye-RIASEC yoonobumba aba-3 edityaniswe nemisebenzi ye-SAQA.",
    tags: [
      "Okungokoqobo · Okuphandayo · Kobugcisa",
      "Imisebenzi ye-SAQA engama-1,432+",
      "Ukufunda ngezwi"
    ],
    cta: "Qala I-Interest Profiler",
    journeyLabel: "Intshisekelo Yomsebenzi (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "Kuhle kwezobuchule ne-TVET",
    duration: "Imizuzu eli-10",
    title: "3. Uluhlu Lwemibuzo Lokufanela Umsebenzi",
    subtitle: "Ukufana Kwendawo Yokusebenza",
    body: "Vavanya iimeko zemihla ngemihla: imisebenzi yangaphandle, iindawo zobunjineli, izibhedlele, amaqela eenkampani, okanye iindawo zedijithali.",
    tags: [
      "Ukufunda kwe-SETA",
      "Izikhungo Zobuchule",
      "Iimfuno Zemeko Yokusebenza"
    ],
    cta: "Vavanya Ukufanela Umsebenzi",
    journeyLabel: "Ukufanela Umsebenzi (Ukugxila Emisebenzini)"
  },
  faq: {
    q1: "Usebanga le-9 okanye ukhetha izifundo zomatrik?",
    best1: "Ukhetho olungcono: 1. Ukukhetha Izifundo",
    a1: "Ikunceda ujonga imida ye-APS kwangethuba ukuze ungayeki Izibalo okanye iSayensi ukuba isiqinisekiso saphupha sifuna.",
    q2: "Awazi ukuba ngumsebenzi mni ofanele wena?",
    best2: "Ukhetho olungcono: 2. Uluhlu Lwemibuzo Lokukhetha Umsebenzi",
    a2: "Ivavanya iintandokazi zakho zengqondo nobuntu ukuze ibonelele ngoluhlu olukhethiweyo lwemisebenzi yaseMzantsi Afrika.",
    q3: "Ukhetha imisebenzi yezandla okanye iindlela ze-TVET?",
    best3: "Ukhetho olungcono: 3. Uluhlu Lwemibuzo Lokufanela Umsebenzi",
    a3: "Igxile kwiimeko zomzimba, zobuchule, nemisebenzi ukuze ikudibanise neziqinisekiso ze-SETA nezikhungo zobuchule."
  }
};

const nso: DecisionsStrings = {
  title: "Didirišwa tša Dipego tša Mošomo",
  subtitle: "Kgetha teko ya tsela go swanela dithuto, dikgahlego, goba go swanela lefelo la mošomo.",
  journeyTitle: "Leeto la gago la dipego",
  faqTitle: "Ke sedirišwa sefe seo ke swanetšego go thoma ka sona?",
  statusCompleted: "E feditšwe",
  statusInProgress: "E a tšwela pele",
  statusPending: "E emetše",
  subjectChooser: {
    badgeLabel: "E eletšwa bakeng sa sekolo se se phagamego",
    duration: "Metsotso e 5–8",
    title: "1. Kgetho ya Dithuto",
    subtitle: "Ukukhetha Izifundo · CAPS",
    body: "Kgetha dithuto tša gago tša bjale goba tša ka moso tša Mphato wa 10–12 go leka go amogelwa go ditikerii tša yunibesithi, diploma tša TVET, le mešomo ye e nyakegago kudu.",
    tags: [
      "Sekhalokhalatha sa APS",
      "Dipalo tše di Hlwekilego vs Go Bala Dipalo",
      "Dinyakwa tša Fakhalithi"
    ],
    cta: "Thoma Kgetho ya Dithuto",
    journeyLabel: "Kgetho ya Dithuto (Mphato 10–12)"
  },
  careerChoice: {
    badgeLabel: "Teko ye e Tumilego Kudu",
    duration: "Metsotso e 12–15",
    title: "2. Lenaneo la Dipotšišo tša Kgetho ya Mošomo",
    subtitle: "Modeli ya Holland RIASEC · Dipolelo tše 11",
    body: "Hwetša gore ke mafelo afe ao a swanelago botho bja gago, dikganyogo, le mokgwa wa go nagana. E hlama profaele ya gago ya RIASEC ya ditlhaka tše 3 ye e kgokaganywago le mešomo ya SAQA.",
    tags: [
      "Ya Nnete · Ya go Nyakišiša · Ya Bokgabo",
      "Mešomo ya SAQA e 1,432+",
      "Go balwa ka lentšu"
    ],
    cta: "Thoma Interest Profiler",
    journeyLabel: "Kgahlego ya Mošomo (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "E lokile bakeng sa botsebi le TVET",
    duration: "Metsotso e 10",
    title: "3. Lenaneo la Dipotšišo tša Go Swanela Mošomo",
    subtitle: "Go Swanela ga Tikologo ya Lefelo la Mošomo",
    body: "Lekola maemo a letšatši le letšatši: mešomo ya ka ntle, mafelo a boenjinere, diphetlekele, dihlopha tša dikhampani, goba tikologo tša digital.",
    tags: [
      "Go ithuta ga SETA",
      "Disenthara tša Botsebi",
      "Dinyakwa tša Seemong sa Mošomo"
    ],
    cta: "Lekola Go Swanela Mošomo",
    journeyLabel: "Go Swanela Mošomo (Go Negiša Mešomo)"
  },
  faq: {
    q1: "O Mphatong wa 9 goba o kgetha dithuto tša matekene?",
    best1: "Kgetho ye botse: 1. Kgetho ya Dithuto",
    a1: "E go thuša go lekola meedi ya APS ka pela gore o se ke wa tlogela Dipalo goba Saense ge kwalikifikaseo ya gago ya ditoro e e nyaka.",
    q2: "Ga o tsebe gore ke mošomo ofe wo o go swanetsago?",
    best2: "Kgetho ye botse: 2. Lenaneo la Dipotšišo tša Kgetho ya Mošomo",
    a2: "E hlahloba dikgetho tša gago tša monagano le botho go fana ka lenaneo le le kgethilwego la mešomo ya Afrika Borwa.",
    q3: "O kgetha mešomo ya diatla goba ditsela tša TVET?",
    best3: "Kgetho ye botse: 3. Lenaneo la Dipotšišo tša Go Swanela Mošomo",
    a3: "E negiša ka kotara maemo a mmele, a botsebi, le a mešomo go go kgokaganya le dikwalifikaseo tša SETA le Disenthara tša Botsebi."
  }
};

const ve: DecisionsStrings = {
  title: "Zwishumiswa zwa Zwito zwa Mushumo",
  subtitle: "Nangani u sedzulusa ha ndila u itela u fanela zwiguda, dovhololo, kana u tea fhethu ha mushumo.",
  journeyTitle: "Luendo lwanu lwa zwito",
  faqTitle: "Ndi tshishumiswa tchifhio tshine nda tea u thoma ngatsho?",
  statusCompleted: "Yo fhedziswa",
  statusInProgress: "I khou bvela phanda",
  statusPending: "I khou linda",
  subjectChooser: {
    badgeLabel: "Yo eletshwa kha tshikolo tsho phakamaho",
    duration: "Mitsotso ya 5–8",
    title: "1. U Nanga Zwiguda",
    subtitle: "Ukukhetha Izifundo · CAPS",
    body: "Nangani zwiguda zwanu zwa zwino kana zwa tshifhinga tshi ḓaho zwa Gireidi ya 10–12 u itela u linga u ṱanganedzwa kha digirii dza yunivesithi, diploma dza TVET, na mishumo ine ya ṱoḓea vhukuma.",
    tags: [
      "Tshivhaleli tsha APS",
      "Nomboro dzo Kwesekaho vs U Vhala Nomboro",
      "Zwi ṱoḓeaho zwa Fakhalithi"
    ],
    cta: "Thomani u Nanga Zwiguda",
    journeyLabel: "U Nanga Zwiguda (Gireidi 10–12)"
  },
  careerChoice: {
    badgeLabel: "U Sedzulusa ho Dummeliwaho Vhukuma",
    duration: "Mitsotso ya 12–15",
    title: "2. Mutevhe wa Mibudziso ya u Nanga Mushumo",
    subtitle: "Modeli ya Holland RIASEC · Nyambo dza 11",
    body: "Wanani uri ndi masimu a fhio ane a tea vhuḓifari hanu, dzitshilisadzo, na ndila ya u humbula. I vhuma phrofaule yanu ya RIASEC ya maletere a 3 yo ṱumanyiwaho na mishumo ya SAQA.",
    tags: [
      "Ha Nnete · Ha u Ṱola · Ha Vhutsila",
      "Mishumo ya SAQA ya 1,432+",
      "U vhalwa nga ipfi"
    ],
    cta: "Thomani Interest Profiler",
    journeyLabel: "Dovhololo ya Mushumo (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "Zwo tea kha vhufundi na TVET",
    duration: "Mitsotso ya 10",
    title: "3. Mutevhe wa Mibudziso ya u Tea Mushumo",
    subtitle: "U Fanela ha Vhupo ha Fhethu ha Mushumo",
    body: "Sedzulusani maimo a ḓuvha ḽiṅwe na ḽiṅwe: mishumo ya nnḓa, fhethu ha vhunjiniare, zwibadela, zwigwada zwa khamphani, kana vhupo ha digital.",
    tags: [
      "U guda ha SETA",
      "Zwitasha zwa Vhufundi",
      "Zwi ṱoḓeaho zwa Vhupo ha Mushumo"
    ],
    cta: "Sedzani u Tea Mushumo",
    journeyLabel: "U Tea Mushumo (U Sedza Mishumo)"
  },
  faq: {
    q1: "Ni kha Gireidi ya 9 kana ni khou nanga zwiguda zwa matric?",
    best1: "Khetho yavhudi: 1. U Nanga Zwiguda",
    a1: "I ni thusa u sedza milinganedzo ya APS nga u ṱavhanya uri ni songo ḓiisa Nomboro kana Sayensi arali zwiga zwanu zwa ndiḓo zwi tshi zwi ṱoḓa.",
    q2: "A ni ḓivhi uri ndi mushumo ufhio une wa ni tea?",
    best2: "Khetho yavhudi: 2. Mutevhe wa Mibudziso ya u Nanga Mushumo",
    a2: "I sedzulusa zwi funwaho zwanu zwa muhumbulo na vhuḓifari u itela u ṋea mutevhe wo nangwaho wa mishumo ya Afrika Tshipembe.",
    q3: "Ni nanga mishumo ya zwanda kana ndila dza TVET?",
    best3: "Khetho yavhudi: 3. Mutevhe wa Mibudziso ya u Tea Mushumo",
    a3: "I sedza thwiṱhi maimo a muvhili, a vhufundi, na a mishumo u itela u ni ṱumanya na zwiga zwa SETA na Zwitasha zwa Vhufundi."
  }
};

const ts: DecisionsStrings = {
  title: "Switirhisiwa swa Swiboho swa Ntirho",
  subtitle: "Hlawula ku kambela ka ndlela leswaku u fananisa swidyondzo, swinavelo, kumbe ku faneleka ka ndhawu ya ntirho.",
  journeyTitle: "Rendzo ra wena ra swiboho",
  faqTitle: "Hi xitirhisiwa xihi lexi ndzi faneleke ku sungula ha xona?",
  statusCompleted: "Yi herile",
  statusInProgress: "Yi ya emahlweni",
  statusPending: "Yi yimerile",
  subjectChooser: {
    badgeLabel: "Yi tsundzuxiwa eka xikolo xa le henhla",
    duration: "Timinete ta 5–8",
    title: "1. Ku Hlawula Swidyondzo",
    subtitle: "Ukukhetha Izifundo · CAPS",
    body: "Hlawula swidyondzo swa wena swa sweswi kumbe swa nkarhi lowu taka swa Gireyi ya 10–12 leswaku u kambela ku amukeriwa eka tidigirii ta yunivesiti, tidiploma ta TVET, na mintirho leyi lavaka swinene.",
    tags: [
      "Xihlayi xa APS",
      "Tinomboro leti Hlamarisaka vs Ku Hlaya Tinomboro",
      "Swilaveko swa Fakhalithi"
    ],
    cta: "Sungula ku Hlawula Swidyondzo",
    journeyLabel: "Ku Hlawula Swidyondzo (Gireyi 10–12)"
  },
  careerChoice: {
    badgeLabel: "Ku Kambela loku Dumeke Swinene",
    duration: "Timinete ta 12–15",
    title: "2. Nxaxamelo wa Swivutiso swo Hlawula Ntirho",
    subtitle: "Modeli ya Holland RIASEC · Tindzimi ta 11",
    body: "Kuma leswaku hi masimu wahi lawa ya fanaka na vumunhu bya wena, swinavelo, na ndlela yo ehleketa. Yi endla phurofayile ya wena ya RIASEC ya maletere ya 3 leyi khomisiweke na mintirho ya SAQA.",
    tags: [
      "Ya Ntiyiso · Ya ku Lava · Ya Vutshila",
      "Mintirho ya SAQA ya 1,432+",
      "Ku hlaya hi rito"
    ],
    cta: "Sungula Interest Profiler",
    journeyLabel: "Ntsako wa Ntirho (Holland RIASEC)"
  },
  jobFit: {
    badgeLabel: "Yi lulamile eka vutshila na TVET",
    duration: "Timinete ta 10",
    title: "3. Nxaxamelo wa Swivutiso swo Faneleka Ntirho",
    subtitle: "Ku Fana ka Mbangu wa Ndhawu ya Ntirho",
    body: "Kambela swiyimo swa siku na siku: mintirho ya le handle, tindhawu ta vunjiniare, swibedlele, mintlawa ya tikhampani, kumbe mbangu wa dijithali.",
    tags: [
      "Ku dyondza ka SETA",
      "Switichi swa Vutshila",
      "Swilaveko swa Xiyimo xa Ntirho"
    ],
    cta: "Kambela ku Faneleka ka Ntirho",
    journeyLabel: "Ku Faneleka ka Ntirho (Ku Kongomisa Mintirho)"
  },
  faq: {
    q1: "U eka Gireyi ya 9 kumbe u hlawula swidyondzo swa matric?",
    best1: "Nhlawulo lowunene: 1. Ku Hlawula Swidyondzo",
    a1: "Yi ku pfuna ku kambela milawu ya APS hi ku hatlisa leswaku u nga tshiki Tinomboro kumbe Sayense loko xitifiketi xa wena xa norho xi xi lava.",
    q2: "A wu tivi ntirho wihi lowu faneleke wena?",
    best2: "Nhlawulo lowunene: 2. Nxaxamelo wa Swivutiso swo Hlawula Ntirho",
    a2: "Yi kambela swirhandzo swa wena swa miehleketo na vumunhu leswaku yi nyika nxaxamelo lowu hlawuriweke wa mintirho ya Afrika Dzonga.",
    q3: "U hlawula mintirho ya mavoko kumbe tindlela ta TVET?",
    best3: "Nhlawulo lowunene: 3. Nxaxamelo wa Swivutiso swo Faneleka Ntirho",
    a3: "Yi kongomisa hi ku kongoma eka swiyimo swa mirhi, swa vutshila, na swa mintirho leswaku yi ku khomisa na switifiketi swa SETA na Switichi swa Vutshila."
  }
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getDecisionsStrings(
  locale: string | null | undefined,
): DecisionsStrings {
  return BUNDLE[resolveLocale(locale)];
}
