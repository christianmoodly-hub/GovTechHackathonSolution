import { expandSaLocales, resolveLocale } from "../createBundle";

export type CareerChoiceStrings = {
  title: string;
  subtitle: string;
  profilerTitle: string;
  profilerSubtitle: string;
  likert: {
    strongly_dislike: string;
    dislike: string;
    neutral: string;
    like: string;
    strongly_like: string;
  };
  questions: Record<
    | "riasec_trades_solar"
    | "riasec_stem_lab"
    | "riasec_digital"
    | "riasec_health"
    | "riasec_education"
    | "riasec_business"
    | "riasec_creative"
    | "riasec_agriculture"
    | "riasec_law_security"
    | "riasec_services",
    {
      prompt: string;
      helpText?: string;
      categoryLabel: string;
      heroTag: string;
      heroMeta: string;
    }
  >;
};

const en: CareerChoiceStrings = {
  title: "Career Choice",
  subtitle: "Rate how much you would enjoy each activity. Honest answers improve occupation matching against the national NCAP database.",
  profilerTitle: "Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "Strongly Dislike",
    dislike: "Dislike",
    neutral: "Unsure / Neutral",
    like: "Like",
    strongly_like: "Strongly Like"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "How much would you enjoy assembling electrical components, fixing machinery, or installing solar panels?",
      helpText: "Think about hands-on work with tools, energy systems, and practical problem-solving.",
      categoryLabel: "Realistic & Investigative • Hands-on & Analytical",
      heroTag: "Practical Skills • Green Tech",
      heroMeta: "TVET Pathway"
    },
    riasec_stem_lab: {
      prompt: "How much would you enjoy solving technical problems, running experiments, or analysing data in a lab or workshop?",
      helpText: "STEM work often mixes curiosity, careful measurement, and systematic thinking.",
      categoryLabel: "Investigative • STEM & Analysis",
      heroTag: "STEM • Problem Solving",
      heroMeta: "University / UoT"
    },
    riasec_digital: {
      prompt: "How much would you enjoy building software, websites, apps, or digital systems?",
      helpText: "Digital roles reward logic, iteration, and designing useful tools for people.",
      categoryLabel: "Investigative & Conventional • Digital",
      heroTag: "ICT & Coding",
      heroMeta: "Digital Economy"
    },
    riasec_health: {
      prompt: "How much would you enjoy caring for people’s health, wellbeing, or recovery?",
      helpText: "Care work centres empathy, patience, and supporting others through challenges.",
      categoryLabel: "Social • Care & Support",
      heroTag: "Health & Care",
      heroMeta: "Public Service"
    },
    riasec_education: {
      prompt: "How much would you enjoy teaching, coaching, or helping others learn new skills?",
      helpText: "Education pathways suit people who explain clearly and celebrate others’ growth.",
      categoryLabel: "Social • Learning & Guidance",
      heroTag: "Education Pathway",
      heroMeta: "Life Orientation"
    },
    riasec_business: {
      prompt: "How much would you enjoy leading teams, managing money, or growing a business?",
      helpText: "Enterprise work blends targets, persuasion, organisation, and decision-making.",
      categoryLabel: "Enterprising • Business & Leadership",
      heroTag: "Enterprise & Finance",
      heroMeta: "Commerce Route"
    },
    riasec_creative: {
      prompt: "How much would you enjoy designing, creating media, performing, or making visual art?",
      helpText: "Creative industries value original ideas, aesthetics, and expressive communication.",
      categoryLabel: "Artistic • Creative Expression",
      heroTag: "Creative Industries",
      heroMeta: "Design & Media"
    },
    riasec_agriculture: {
      prompt: "How much would you enjoy working with plants, animals, land, or food production outdoors?",
      helpText: "Green economy roles connect nature, food systems, and practical outdoor work.",
      categoryLabel: "Realistic • Land & Food Systems",
      heroTag: "Agriculture & Environment",
      heroMeta: "Green Economy"
    },
    riasec_law_security: {
      prompt: "How much would you enjoy enforcing rules, protecting people, or working in justice and security?",
      helpText: "Justice and safety roles need fairness, calm under pressure, and clear procedures.",
      categoryLabel: "Conventional & Enterprising • Law & Security",
      heroTag: "Justice & Safety",
      heroMeta: "Public Service"
    },
    riasec_services: {
      prompt: "How much would you enjoy helping customers, hospitality work, or hands-on community service?",
      helpText: "Service roles put people first — listening, solving problems, and creating welcome experiences.",
      categoryLabel: "Social & Enterprising • Services",
      heroTag: "Service Economy",
      heroMeta: "People First"
    }
  }
};

const af: CareerChoiceStrings = {
  title: "Loopbaankeuse",
  subtitle: "Beoordeel hoeveel jy elke aktiwiteit sou geniet. Eerlike antwoorde verbeter beroepspassing teen die nasionale NCAP-databasis.",
  profilerTitle: "Loopbaanbelangstellingsprofiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "Hou glad nie daarvan nie",
    dislike: "Hou nie daarvan nie",
    neutral: "Onseker / Neutraal",
    like: "Hou daarvan",
    strongly_like: "Hou baie daarvan"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "Hoeveel sou jy geniet om elektriese komponente aanmekaar te sit, masjinerie te herstel of sonpanele te installeer?",
      helpText: "Dink aan hands-on werk met gereedskap, energiestelsels en praktiese probleemoplossing.",
      categoryLabel: "Realisties & Ondersoekend • Hands-on & Analities",
      heroTag: "Praktiese Vaardighede • Groen Tegnologie",
      heroMeta: "TVET-pad"
    },
    riasec_stem_lab: {
      prompt: "Hoeveel sou jy geniet om tegniese probleme op te los, eksperimente uit te voer of data in 'n lab of werkswinkel te ontleed?",
      helpText: "STEM-werk meng dikwels nuuskierigheid, noukeurige meting en sistematiese denke.",
      categoryLabel: "Ondersoekend • STEM & Analise",
      heroTag: "STEM • Probleemoplossing",
      heroMeta: "Universiteit / UoT"
    },
    riasec_digital: {
      prompt: "Hoeveel sou jy geniet om sagteware, webwerwe, programme of digitale stelsels te bou?",
      helpText: "Digitale rolle beloon logika, herhaling en die ontwerp van nuttige hulpmiddels vir mense.",
      categoryLabel: "Ondersoekend & Konvensioneel • Digitaal",
      heroTag: "IKT & Kodering",
      heroMeta: "Digitale Ekonomie"
    },
    riasec_health: {
      prompt: "Hoeveel sou jy geniet om na mense se gesondheid, welstand of herstel om te sien?",
      helpText: "Versorgingswerk sentreer empatie, geduld en ondersteuning deur uitdagings.",
      categoryLabel: "Sosiaal • Versorging & Ondersteuning",
      heroTag: "Gesondheid & Sorg",
      heroMeta: "Openbare Diens"
    },
    riasec_education: {
      prompt: "Hoeveel sou jy geniet om te onderrig, afrig of ander te help om nuwe vaardighede te leer?",
      helpText: "Onderwyspaaie pas mense wat duidelik verduidelik en ander se groei vier.",
      categoryLabel: "Sosiaal • Leer & Leiding",
      heroTag: "Onderwyspad",
      heroMeta: "Lewensoriëntering"
    },
    riasec_business: {
      prompt: "Hoeveel sou jy geniet om spanne te lei, geld te bestuur of 'n besigheid te groei?",
      helpText: "Ondernemingswerk meng teikens, oortuiging, organisasie en besluitneming.",
      categoryLabel: "Ondernemend • Besigheid & Leierskap",
      heroTag: "Onderneming & Finansies",
      heroMeta: "Handelsroete"
    },
    riasec_creative: {
      prompt: "Hoeveel sou jy geniet om te ontwerp, media te skep, op te tree of visuele kuns te maak?",
      helpText: "Kreatiewe industrieë waardeer oorspronklike idees, estetika en ekspressiewe kommunikasie.",
      categoryLabel: "Artistiek • Kreatiewe Uitdrukking",
      heroTag: "Kreatiewe Industrieë",
      heroMeta: "Ontwerp & Media"
    },
    riasec_agriculture: {
      prompt: "Hoeveel sou jy geniet om met plante, diere, grond of voedselproduksie buite te werk?",
      helpText: "Groen-ekonomie-rolle verbind natuur, voedselstelsels en praktiese buitelugwerk.",
      categoryLabel: "Realisties • Grond- & Voedselsisteme",
      heroTag: "Landbou & Omgewing",
      heroMeta: "Groen Ekonomie"
    },
    riasec_law_security: {
      prompt: "Hoeveel sou jy geniet om reëls af te dwing, mense te beskerm of in geregtigheid en sekuriteit te werk?",
      helpText: "Geregtigheid- en veiligheidsrolle benodig billikheid, kalmte onder druk en duidelike prosedures.",
      categoryLabel: "Konvensioneel & Ondernemend • Reg & Sekuriteit",
      heroTag: "Geregtigheid & Veiligheid",
      heroMeta: "Openbare Diens"
    },
    riasec_services: {
      prompt: "Hoeveel sou jy geniet om kliënte te help, gasvryheidswerk of hands-on gemeenskapsdiens?",
      helpText: "Diensrolle sit mense eerste — luister, probleme oplos en verwelkomende ervarings skep.",
      categoryLabel: "Sosiaal & Ondernemend • Dienste",
      heroTag: "Diensekonomie",
      heroMeta: "Mense Eerste"
    }
  }
};

const zu: CareerChoiceStrings = {
  title: "Ukukhetha Umsebenzi",
  subtitle: "Linganisa ukuthi ungakujabulela kangakanani umsebenzi ngamunye. Izimpendulo eziqotho zithuthukisa ukufanisa umsebenzi nesizindalwazi se-NCAP.",
  profilerTitle: "I-Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "Angikuthandi Nhlobo",
    dislike: "Angikuthandi",
    neutral: "Anginasiqiniseko / Phakathi",
    like: "Ngiyakuthanda",
    strongly_like: "Ngiyakuthanda Kakhulu"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "Ungakujabulela kangakanani ukuhlanganisa izingxenye zikagesi, ukulungisa imishini, noma ukufaka amapulangwe elanga?",
      helpText: "Cabanga ngomsebenzi wezandla namathuluzi, izinhlelo zamandla, nokuxazulula izinkinga.",
      categoryLabel: "Okungokoqobo & Okuphenyayo • Izandla & Ukuhlaziya",
      heroTag: "Amakhono Okusebenza • Ubuchwepheshe Obuluhlaza",
      heroMeta: "Indlela ye-TVET"
    },
    riasec_stem_lab: {
      prompt: "Ungakujabulela kangakanani ukuxazulula izinkinga zobuchwepheshe, ukwenza ukuhlola, noma ukuhlaziya idatha elabhorethri noma endaweni yokusebenza?",
      helpText: "Umsebenzi we-STEM uvamise ukuxuba ilukuluku, ukulinganisa ngokucophelela, nokucabanga ngohlelo.",
      categoryLabel: "Okuphenyayo • STEM & Ukuhlaziya",
      heroTag: "STEM • Ukuxazulula Izinkinga",
      heroMeta: "Inyuvesi / UoT"
    },
    riasec_digital: {
      prompt: "Ungakujabulela kangakanani ukwakha isofthiwe, amawebhusayithi, izinhlelo, noma izinhlelo zedijithali?",
      helpText: "Izindima zedijithali ziklomelisa ukucabanga okunengqondo nokwakha amathuluzi awusizo.",
      categoryLabel: "Okuphenyayo & Okwejwayelekile • Digithali",
      heroTag: "ICT & Ukubhala Ikhodi",
      heroMeta: "Umotho Wedijithali"
    },
    riasec_health: {
      prompt: "Ungakujabulela kangakanani ukunakekela impilo, inhlalakahle, noma ukululama kwabantu?",
      helpText: "Umsebenzi wokunakekela ugxile ezwaneni, ukubekezela, nokusekela abanye.",
      categoryLabel: "Komphakathi • Ukunakekela & Ukusekela",
      heroTag: "Impilo & Ukunakekela",
      heroMeta: "Inkonzo Yomphakathi"
    },
    riasec_education: {
      prompt: "Ungakujabulela kangakanani ukufundisa, ukuqeqesha, noma ukusiza abanye ukufunda amakhono amasha?",
      helpText: "Izindlela zemfundo zifanele abantu abachaza ngokucacile nabagubha ukukhula kwabanye.",
      categoryLabel: "Komphakathi • Ukufunda & Isiqondiso",
      heroTag: "Indlela Yemfundo",
      heroMeta: "I-Life Orientation"
    },
    riasec_business: {
      prompt: "Ungakujabulela kangakanani ukuhola amaqembu, ukuphatha imali, noma ukukhulisa ibhizinisi?",
      helpText: "Umsebenzi webhizinisi uxuba izinhloso, ukukholisa, ukuhlela, nokwenza izinqumo.",
      categoryLabel: "Okosomabhizinisi • Ibhizinisi & Ubuholi",
      heroTag: "Ibizinisi & Ezezimali",
      heroMeta: "Indlela Yezohwebo"
    },
    riasec_creative: {
      prompt: "Ungakujabulela kangakanani ukudizayina, ukudala imidiya, ukwenza, noma ukwenza ubuciko?",
      helpText: "Izimboni zobuciko zihlonipha imibono emisha nokuxhumana okubonakalayo.",
      categoryLabel: "Kobuciko • Ukuzwakalisa",
      heroTag: "Izimboni Zobuciko",
      heroMeta: "Idizayini & Imidiya"
    },
    riasec_agriculture: {
      prompt: "Ungakujabulela kangakanani ukusebenza ngezitshalo, izilwane, umhlaba, noma ukukhiqiza ukudla ngaphandle?",
      helpText: "Izindima zomnotho oluhlaza zixhuma imvelo, izinhlelo zokudla, nomsebenzi wangaphandle.",
      categoryLabel: "Okungokoqobo • Umhlaba & Izinhlelo Zokudla",
      heroTag: "Ezolimo & Imvelo",
      heroMeta: "Umotho Oluhlaza"
    },
    riasec_law_security: {
      prompt: "Ungakujabulela kangakanani ukuphoqelela imithetho, ukuvikela abantu, noma ukusebenza kwezomthetho nokuphepha?",
      helpText: "Izindima zobulungiswa zidinga ukulingana, ukuzola ngaphansi kwengcindezi, nezinqubo ezicacile.",
      categoryLabel: "Okwejwayelekile & Okosomabhizinisi • Umthetho & Ukuphepha",
      heroTag: "Ubulungiswa & Ukuphepha",
      heroMeta: "Inkonzo Yomphakathi"
    },
    riasec_services: {
      prompt: "Ungakujabulela kangakanani ukusiza amakhasimende, umsebenzi wokuphatha izivakashi, noma inkonzo yomphakathi?",
      helpText: "Izindima zesevisi zibeka abantu kuqala — ukulalela, ukuxazulula izinkinga, nokwamukela.",
      categoryLabel: "Komphakathi & Okosomabhizinisi • Izinsiza",
      heroTag: "Umotho Wezinsiza",
      heroMeta: "Abantu Kuqala"
    }
  }
};

const xh: CareerChoiceStrings = {
  title: "Ukukhetha Umsebenzi",
  subtitle: "Linganisa ukuba ungakonwabela kangakanani umsebenzi ngamnye. Iimpendulo ezinyanisekileyo ziphucula ukufanisa umsebenzi nesizindalwazi se-NCAP.",
  profilerTitle: "I-Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "Andikuthandi Konke",
    dislike: "Andikuthandi",
    neutral: "Andiqinisekanga / Phakathi",
    like: "Ndiyakuthanda",
    strongly_like: "Ndiyakuthanda Kakhulu"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "Ungakonwabela kangakanani ukudibanisa amacandelo ombane, ukulungisa oomatshini, okanye ukufaka iiphaneli zelanga?",
      helpText: "Cinga ngomsebenzi wezandla ngezixhobo, iinkqubo zamandla, nokusombulula iingxaki.",
      categoryLabel: "Okungokoqobo & Okuphandayo • Izandla & Ukuhlalutya",
      heroTag: "Izakhono Zokusebenza • Ubuchule Obuluhlaza",
      heroMeta: "Indlela ye-TVET"
    },
    riasec_stem_lab: {
      prompt: "Ungakonwabela kangakanani ukusombulula iingxaki zobuchule, ukwenza iimvavanyo, okanye ukuhlalutya idatha elabhorethri okanye kwindawo yokusebenza?",
      helpText: "Umsebenzi we-STEM udla ngokuxuba umdla, ukulinganisa ngononophelo, nokucinga ngendlela.",
      categoryLabel: "Okuphandayo • STEM & Ukuhlalutya",
      heroTag: "STEM • Ukusombulula Iingxaki",
      heroMeta: "Iyunivesithi / UoT"
    },
    riasec_digital: {
      prompt: "Ungakonwabela kangakanani ukwakha isoftware, iiwebhusayithi, ii-apps, okanye iinkqubo zedijithali?",
      helpText: "Iindima zedijithali zivuzwa yingqiqo nokwakha izixhobo eziluncedo.",
      categoryLabel: "Okuphandayo & Okuqhelekileyo • Dijithali",
      heroTag: "ICT & Ukubhala Ikhowudi",
      heroMeta: "Uqoqosho Lwedijithali"
    },
    riasec_health: {
      prompt: "Ungakonwabela kangakanani ukukhathalela impilo, intlalontle, okanye ukululama kwabantu?",
      helpText: "Umsebenzi wokukhathalela ugxile kuvakalelwano, ukunyamezela, nokuxhasa abanye.",
      categoryLabel: "Sentlalo • Ukukhathalela & Inkxaso",
      heroTag: "Impilo & Ukukhathalela",
      heroMeta: "Inkonzo Yoluntu"
    },
    riasec_education: {
      prompt: "Ungakonwabela kangakanani ukufundisa, ukuqeqesha, okanye ukunceda abanye ukufunda izakhono ezintsha?",
      helpText: "Iindlela zemfundo zifanele abantu abacacisa ngokucacileyo nababhiyozela ukukhula kwabanye.",
      categoryLabel: "Sentlalo • Ukufunda & Isikhokelo",
      heroTag: "Indlela Yemfundo",
      heroMeta: "I-Life Orientation"
    },
    riasec_business: {
      prompt: "Ungakonwabela kangakanani ukukhokela amaqela, ukulawula imali, okanye ukukhulisa ishishini?",
      helpText: "Umsebenzi weshishini uxuba iinjongo, ukweyisela, ukucwangcisa, nokwenza izigqibo.",
      categoryLabel: "Soshishino • Ishishini & Ubunkokheli",
      heroTag: "Ishishini & Ezemali",
      heroMeta: "Indlela Yorhwebo"
    },
    riasec_creative: {
      prompt: "Ungakonwabela kangakanani ukuyila, ukudala imidiya, ukwenza, okanye ukwenza ubugcisa?",
      helpText: "Amashishini obugcisa axabisa iingcamango ezintsha nonxibelelwano olubonakalayo.",
      categoryLabel: "Sobugcisa • Ukuzibonakalisa",
      heroTag: "Amashishini Obugcisa",
      heroMeta: "Uyilo & Imidiya"
    },
    riasec_agriculture: {
      prompt: "Ungakonwabela kangakanani ukusebenza ngezityalo, izilwanyana, umhlaba, okanye ukuvelisa ukutya ngaphandle?",
      helpText: "Iindima zoqoqosho oluhlaza zidibanisa indalo, iinkqubo zokutya, nomsebenzi wangaphandle.",
      categoryLabel: "Okungokoqobo • Umhlaba & Iinkqubo Zokutya",
      heroTag: "Ezolimo & Indalo",
      heroMeta: "Uqoqosho Oluhlaza"
    },
    riasec_law_security: {
      prompt: "Ungakonwabela kangakanani ukunyanzelisa imithetho, ukukhusela abantu, okanye ukusebenza kubulungisa nokhuseleko?",
      helpText: "Iindima zobulungisa zifuna ukulingana, ukuzola phantsi koxinzelelo, neenkqubo ezicacileyo.",
      categoryLabel: "Okuqhelekileyo & Soshishino • Umthetho & Ukhuseleko",
      heroTag: "Ubulungisa & Ukhuseleko",
      heroMeta: "Inkonzo Yoluntu"
    },
    riasec_services: {
      prompt: "Ungakonwabela kangakanani ukunceda abathengi, umsebenzi wobubele, okanye inkonzo yoluntu?",
      helpText: "Iindima zenkonzo zibeka abantu kuqala — ukumamela, ukusombulula iingxaki, nokwamkela.",
      categoryLabel: "Sentlalo & Soshishino • Iinkonzo",
      heroTag: "Uqoqosho Lweenkonzo",
      heroMeta: "Abantu Kuqala"
    }
  }
};

const nso: CareerChoiceStrings = {
  title: "Kgetho ya Mošomo",
  subtitle: "Leka gore o ka thaba kudu ka mošomo o mongwe le o mongwe. Dikarabo tša nnete di kaonafatša go swanela mošomo le database ya NCAP.",
  profilerTitle: "Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "Ga ke rate le ga e tee",
    dislike: "Ga ke rate",
    neutral: "Ga ke na bonnete / Magareng",
    like: "Ke a rata",
    strongly_like: "Ke rata kudu"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "O ka thaba kudu go kopanya dikarolo tša mohlagase, go lokiša mešini, goba go tsenya diphanele tša letšatši?",
      helpText: "Nagana ka mošomo wa diatla ka didirišwa, ditshepedišo tša maatla, le go rarolla mathata.",
      categoryLabel: "Ya Nnete & Ya go Nyakišiša • Diatla & Go Sekaseka",
      heroTag: "Mabokgoni a Tiršo • Theknolotši ye Tala",
      heroMeta: "Tsela ya TVET"
    },
    riasec_stem_lab: {
      prompt: "O ka thaba kudu go rarolla mathata a botsebi, go dira diteko, goba go sekaseka data ka laboratheri goba lefelo la mošomo?",
      helpText: "Mošomo wa STEM o tlwaetše go hlakanya kgahlišego, go ela ka hloko, le go nagana ka tshepedišo.",
      categoryLabel: "Ya go Nyakišiša • STEM & Go Sekaseka",
      heroTag: "STEM • Go Rarolla Mathata",
      heroMeta: "Yunibesithi / UoT"
    },
    riasec_digital: {
      prompt: "O ka thaba kudu go aga software, diwebsaete, di-app, goba ditshepedišo tša digital?",
      helpText: "Dikarolo tša digital di putsa go nagana ga maleba le go aga didirišwa tše di thušago.",
      categoryLabel: "Ya go Nyakišiša & Ya Tlwaelo • Digital",
      heroTag: "ICT & Go Ngwala Khoutu",
      heroMeta: "Ekonomi ya Digital"
    },
    riasec_health: {
      prompt: "O ka thaba kudu go hlokomela maphelo, go phela gabotse, goba go fola ga batho?",
      helpText: "Mošomo wa tlhokomelo o negiša kutlwelo-bohloko, kgotlelelo, le thekgo.",
      categoryLabel: "Ya Setšhaba • Tlhokomelo & Thekgo",
      heroTag: "Maphelo & Tlhokomelo",
      heroMeta: "Tirelo ya Setšhaba"
    },
    riasec_education: {
      prompt: "O ka thaba kudu go ruta, go hlahla, goba go thuša ba bangwe go ithuta mabokgoni a maswa?",
      helpText: "Ditsela tša thuto di swanetše batho bao ba hlalošago gabotse le bao ba ketekago kgolo ya ba bangwe.",
      categoryLabel: "Ya Setšhaba • Go Ithuta & Keletšo",
      heroTag: "Tsela ya Thuto",
      heroMeta: "Life Orientation"
    },
    riasec_business: {
      prompt: "O ka thaba kudu go etelela dihlopha, go laola tšhelete, goba go godiša kgwebo?",
      helpText: "Mošomo wa kgwebo o hlakanya dipakane, go kgotsofatša, peakanyo, le go tšea diphetho.",
      categoryLabel: "Ya Kgwebo • Kgwebo & Boetapele",
      heroTag: "Kgwebo & Ditšhelete",
      heroMeta: "Tsela ya Kgwebo"
    },
    riasec_creative: {
      prompt: "O ka thaba kudu go dira dizayine, go hlama media, go dira, goba go dira bokgabo?",
      helpText: "Diintasteri tša bokgabo di tlotla dikgopolo tše diswa le kgokagano ye e bonagalago.",
      categoryLabel: "Ya Bokgabo • Go Itlhalosa",
      heroTag: "Diintasteri tša Bokgabo",
      heroMeta: "Dizayine & Media"
    },
    riasec_agriculture: {
      prompt: "O ka thaba kudu go šoma ka dimela, diphoofolo, naga, goba go tšweletša dijo ka ntle?",
      helpText: "Dikarolo tša ekonomi ye tala di kgokaganya tlhago, ditshepedišo tša dijo, le mošomo wa ka ntle.",
      categoryLabel: "Ya Nnete • Naga & Ditshepedišo tša Dijo",
      heroTag: "Temo & Tikologo",
      heroMeta: "Ekonomi ye Tala"
    },
    riasec_law_security: {
      prompt: "O ka thaba kudu go tshepediša melao, go šireletša batho, goba go šoma tshekong le tšhireletšong?",
      helpText: "Dikarolo tša toka di nyaka go lekana, go khutša ka fase ga kgatelelo, le ditshepedišo tše di hlakilego.",
      categoryLabel: "Ya Tlwaelo & Ya Kgwebo • Molao & Tšhireletšo",
      heroTag: "Toka & Polokego",
      heroMeta: "Tirelo ya Setšhaba"
    },
    riasec_services: {
      prompt: "O ka thaba kudu go thuša bareki, mošomo wa hospitality, goba tirelo ya setšhaba?",
      helpText: "Dikarolo tša tirelo di bea batho pele — go theeletša, go rarolla mathata, le go amogela.",
      categoryLabel: "Ya Setšhaba & Ya Kgwebo • Ditirelo",
      heroTag: "Ekonomi ya Ditirelo",
      heroMeta: "Batho Pele"
    }
  }
};

const ve: CareerChoiceStrings = {
  title: "U Nanga Mushumo",
  subtitle: "Linganani uri ni nga takalela hani mushumo muṅwe na muṅwe. Phindulo dza vhutali dzi khwinisa u fanela mushumo na database ya NCAP.",
  profilerTitle: "Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "A thi funi luthihi",
    dislike: "A thi funi",
    neutral: "A thi na vhuṱanzi / Vhukati",
    like: "Ndi a funa",
    strongly_like: "Ndi funa vhukuma"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "Ni nga takalela hani u ṱanganisa zwiṱuku zwa elekithiriki, u khwinisa mitshini, kana u dzhenisa phaneli dza ḓuvha?",
      helpText: "Humbulani nga mushumo wa zwanda nga zwishumiswa, sistemu dza maanḓa, na u ṱalutshedza thaidzo.",
      categoryLabel: "Ha Nnete & Ha u Ṱola • Zwanda & U Sedzulusa",
      heroTag: "Vhukoni ha u Shuma • Thekinolodzhi ya Tshihaza",
      heroMeta: "Ndila ya TVET"
    },
    riasec_stem_lab: {
      prompt: "Ni nga takalela hani u ṱalutshedza thaidzo dza vhufundi, u ita u linga, kana u sedzulusa data kha lab kana fhethu ha mushumo?",
      helpText: "Mushumo wa STEM u tshi vhanganya ḓovhololo, u ela nga vhuronwane, na u humbula nga ndila.",
      categoryLabel: "Ha u Ṱola • STEM & U Sedzulusa",
      heroTag: "STEM • U Ṱalutshedza Thaidzo",
      heroMeta: "Yunivesithi / UoT"
    },
    riasec_digital: {
      prompt: "Ni nga takalela hani u fhata software, websaete, apps, kana sistemu dza digital?",
      helpText: "Tshimo tsha digital tshi fhaṱha nga muhumbulo wavhudi na u fhata zwishumiswa zwa thuso.",
      categoryLabel: "Ha u Ṱola & Ha Tshikhala • Digital",
      heroTag: "ICT & U Ṅwala Khoudhu",
      heroMeta: "Ikonomi ya Digital"
    },
    riasec_health: {
      prompt: "Ni nga takalela hani u ṱhogomela mutakalo, u tshila zwavhudi, kana u fhola ha vhathu?",
      helpText: "Mushumo wa ṱhogomelo u sedza kutlwelo, u kundelwa, na thuso.",
      categoryLabel: "Ha Tshitshavha • Ṱhogomelo & Thuso",
      heroTag: "Mutakalo & Ṱhogomelo",
      heroMeta: "Tshumelo ya Tshitshavha"
    },
    riasec_education: {
      prompt: "Ni nga takalela hani u funza, u ḓivhadza, kana u thusa vhaṅwe u guda vhukoni vhuswa?",
      helpText: "Ndila dza pfunzo dzi tea vhathu vhane vha ṱalusa zwavhudi nahone vha keteka kukura kwa vhaṅwe.",
      categoryLabel: "Ha Tshitshavha • U Guda & Ndaedzo",
      heroTag: "Ndila ya Pfunzo",
      heroMeta: "Life Orientation"
    },
    riasec_business: {
      prompt: "Ni nga takalela hani u etelela zwigwada, u langa tshelede, kana u alusa bindu?",
      helpText: "Mushumo wa bindu u vhanganya zwipikwa, u tendisa, u lugisa, na u dzhia zwito.",
      categoryLabel: "Ha Bindu • Bindu & Vhurulwane",
      heroTag: "Bindu & Tshelede",
      heroMeta: "Ndila ya Vhubindudzi"
    },
    riasec_creative: {
      prompt: "Ni nga takalela hani u dizaina, u vhuma midia, u ita, kana u ita vhutsila?",
      helpText: "Indasitiri dza vhutsila dzi tshi ṱhonifha mihumbulo miswa na vhukwamani ho vhonalaho.",
      categoryLabel: "Ha Vhutsila • U Ḓivhadza",
      heroTag: "Indasitiri dza Vhutsila",
      heroMeta: "Dizaini & Midia"
    },
    riasec_agriculture: {
      prompt: "Ni nga takalela hani u shuma nga zwimela, zwipuka, shango, kana u bveledza zwiḽiwa nnḓa?",
      helpText: "Tshimo tsha ikonomi ya tshihaza tshi ṱumanya mupo, sistemu dza zwiḽiwa, na mushumo wa nnḓa.",
      categoryLabel: "Ha Nnete • Shango & Sistumu dza Zwiḽiwa",
      heroTag: "Vhulimi & Mupo",
      heroMeta: "Ikonomi ya Tshihaza"
    },
    riasec_law_security: {
      prompt: "Ni nga takalela hani u shumisa milayo, u tsireledza vhathu, kana u shuma kha vhulamukanyi na tshireledzo?",
      helpText: "Tshimo tsha vhulamukanyi tshi ṱoḓa u lingana, u khutha fhasi ha kholelo, na ndila dzo pfalaho.",
      categoryLabel: "Ha Tshikhala & Ha Bindu • Mulayo & Tshireledzo",
      heroTag: "Vhulamukanyi & Tshireledzo",
      heroMeta: "Tshumelo ya Tshitshavha"
    },
    riasec_services: {
      prompt: "Ni nga takalela hani u thusa vharengi, mushumo wa hospitality, kana tshumelo ya tshitshavha?",
      helpText: "Tshimo tsha tshumelo tshi vhea vhathu phanḓa — u thetshelesa, u ṱalutshedza thaidzo, na u ṱanganedza.",
      categoryLabel: "Ha Tshitshavha & Ha Bindu • Tshumelo",
      heroTag: "Ikonomi ya Tshumelo",
      heroMeta: "Vhathu Phanḓa"
    }
  }
};

const ts: CareerChoiceStrings = {
  title: "Ku Hlawula Ntirho",
  subtitle: "Pima ku nga tsakela kangakani ntirho wun'wana ni wun'wana. Tinhlamulo ta ntiyiso ti antswisa ku fananisa ntirho na database ya NCAP.",
  profilerTitle: "Career Interest Profiler",
  profilerSubtitle: "Khetha NCAP • Holland RIASEC",
  likert: {
    strongly_dislike: "A ndzi rhandzi naswona",
    dislike: "A ndzi rhandzi",
    neutral: "A ndzi na ntiyiso / Exikarhi",
    like: "Ndzi ya rhandza",
    strongly_like: "Ndzi rhandza swinene"
  },
  questions: {
    riasec_trades_solar: {
      prompt: "U nga tsakela kangakani ku hlanganisa swiphemu swa gezi, ku lunghisa mitshini, kumbe ku nghenisa tiphaneli ta dyambu?",
      helpText: "Ehleketa hi ntirho wa mavoko hi switirho, sistimu ta matimba, na ku lulamisa swiphiqo.",
      categoryLabel: "Ya Ntiyiso & Ya ku Lava • Mavoko & Ku Kambela",
      heroTag: "Vuswikoti byo Tirha • Thekinoloji ya Rihlaza",
      heroMeta: "Ndlela ya TVET"
    },
    riasec_stem_lab: {
      prompt: "U nga tsakela kangakani ku lulamisa swiphiqo swa vutshila, ku endla swikambelo, kumbe ku kambela data eka labhorethri kumbe ndhawu ya ntirho?",
      helpText: "Ntirho wa STEM wu tala ku hlanganisa ntsako, ku pima hi vukheta, na ku ehleketa hi ndlela.",
      categoryLabel: "Ya ku Lava • STEM & Ku Kambela",
      heroTag: "STEM • Ku Lulamisa Swiphiqo",
      heroMeta: "Yunivesiti / UoT"
    },
    riasec_digital: {
      prompt: "U nga tsakela kangakani ku aka software, tiwebhusayithi, ti-apps, kumbe sistimu ta dijithali?",
      helpText: "Swiyimo swa dijithali swi hakela miehleketo leyinene na ku aka switirho swo pfuna.",
      categoryLabel: "Ya ku Lava & Ya Ntolovelo • Dijithali",
      heroTag: "ICT & Ku Tsala Khoudu",
      heroMeta: "Ikonomi ya Dijithali"
    },
    riasec_health: {
      prompt: "U nga tsakela kangakani ku hlayisa rihanyo, ku hanya kahle, kumbe ku hola ka vanhu?",
      helpText: "Ntirho wo hlayisa wu kongomisa eka ku twela vanhu vusiwana, ku tiyisela, na nseketelo.",
      categoryLabel: "Ya Vaaki • Ku Hlayisa & Nseketelo",
      heroTag: "Rihanyo & Ku Hlayisa",
      heroMeta: "Vukorhokeri bya Vaaki"
    },
    riasec_education: {
      prompt: "U nga tsakela kangakani ku dyondzisa, ku kongomisa, kumbe ku pfuna van'wana ku dyondza vuswikoti byintshwa?",
      helpText: "Tindlela ta dyondzo ti fanele vanhu lava hlamuselaka kahle na lava tekelaka ku kula ka van'wana.",
      categoryLabel: "Ya Vaaki • Ku Dyondza & Ndziviso",
      heroTag: "Ndlela ya Dyondzo",
      heroMeta: "Life Orientation"
    },
    riasec_business: {
      prompt: "U nga tsakela kangakani ku rhangela mintlawa, ku lawula mali, kumbe ku kula bindzu?",
      helpText: "Ntirho wa bindzu wu hlanganisa swikongomelo, ku khorwisa, ku lulamisa, na ku endla swiboho.",
      categoryLabel: "Ya Bindzu • Bindzu & Vurhangeri",
      heroTag: "Bindzu & Mali",
      heroMeta: "Ndlela ya Mafambiselo"
    },
    riasec_creative: {
      prompt: "U nga tsakela kangakani ku dizayina, ku endla midia, ku endla, kumbe ku endla vutshila?",
      helpText: "Tiindasitiri ta vutshila ti xixima miehleketo leyintshwa na vuhlanganisi lebyi vonakaka.",
      categoryLabel: "Ya Vutshila • Ku Tihlamusela",
      heroTag: "Tiindasitiri ta Vutshila",
      heroMeta: "Dizayini & Midia"
    },
    riasec_agriculture: {
      prompt: "U nga tsakela kangakani ku tirha hi swimila, swiharhi, misava, kumbe ku tswala swakudya handle?",
      helpText: "Swiyimo swa ikonomi ya rihlaza swi khomisa ntumbuluko, sistimu ta swakudya, na ntirho wa le handle.",
      categoryLabel: "Ya Ntiyiso • Misava & Sistimu ta Swakudya",
      heroTag: "Vurimi & Mbangu",
      heroMeta: "Ikonomi ya Rihlaza"
    },
    riasec_law_security: {
      prompt: "U nga tsakela kangakani ku tirhisa milawu, ku sirhelela vanhu, kumbe ku tirha eka vululami na vuhlayiseki?",
      helpText: "Swiyimo swa vululami swi lava ku ringanisa, ku rhula ehansi ka ntshikelelo, na tindlela leti twisisekaka.",
      categoryLabel: "Ya Ntolovelo & Ya Bindzu • Nawu & Vuhlayiseki",
      heroTag: "Vululami & Vuhlayiseki",
      heroMeta: "Vukorhokeri bya Vaaki"
    },
    riasec_services: {
      prompt: "U nga tsakela kangakani ku pfuna vaxavi, ntirho wa hospitality, kumbe vukorhokeri bya vaaki?",
      helpText: "Swiyimo swa vukorhokeri swi veka vanhu ku rhanga — ku yingisela, ku lulamisa swiphiqo, na ku amukela.",
      categoryLabel: "Ya Vaaki & Ya Bindzu • Vukorhokeri",
      heroTag: "Ikonomi ya Vukorhokeri",
      heroMeta: "Vanhu Ku Rhanga"
    }
  }
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getCareerChoiceStrings(
  locale: string | null | undefined,
): CareerChoiceStrings {
  return BUNDLE[resolveLocale(locale)];
}
