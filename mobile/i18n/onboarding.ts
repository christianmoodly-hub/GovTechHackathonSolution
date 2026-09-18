import { createBundle, resolveLocale } from "./createBundle";

export type RoleStrings = { label: string; description: string };

export type OnboardingStrings = {
  republicLabel: string;
  govSub: string;
  zeroRatedPortal: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  whoAreYou: string;
  required: string;
  disabilityStatus: string;
  disabilityQuestion: string;
  yes: string;
  no: string;
  offlineTitle: string;
  offlineBody: string;
  startExploring: string;
  startExploringSub: string;
  continueAsGuest: string;
  quote: string;
  quoteAttr: string;
  saveError: string;
  guestError: string;
  roles: {
    grade10: RoleStrings;
    grade11: RoleStrings;
    grade12: RoleStrings;
    below_grade10: RoleStrings;
    tertiary: RoleStrings;
    work_seeker: RoleStrings;
    parent: RoleStrings;
    teacher: RoleStrings;
    practitioner: RoleStrings;
  };
  disabilityCategories: {
    visual: string;
    hearing: string;
    physical: string;
    learning: string;
  };
};

const en: OnboardingStrings = {
  republicLabel: "REPUBLIC OF SOUTH AFRICA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Zero-Rated Portal",
  heroKicker: "NATIONAL CAREER ADVICE PORTAL",
  heroTitle: "Welcome to Khetha NCAP",
  heroBody: "Please complete below for statistics & tailored guidance.",
  whoAreYou: "Who are you? (Select your current role)",
  required: "Required",
  disabilityStatus: "Disability Status",
  disabilityQuestion: "Are you a person living with a disability?",
  yes: "Yes",
  no: "No",
  offlineTitle: "Works offline after first sync",
  offlineBody:
    "Browse cached careers and continue questionnaires without signal. Favourites and results save on device and sync when you reconnect.",
  startExploring: "Start Exploring / Qala",
  startExploringSub: "Unlock personalized study pathways",
  continueAsGuest: "Continue as Guest",
  quote:
    "Education is the most powerful weapon which you can use to change the world.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "Could not save your profile details.",
  guestError: "Guest mode unavailable.",
  roles: {
    grade10: {
      label: "Grade 10 Learner",
      description: "Subject choice & future study stream",
    },
    grade11: {
      label: "Grade 11 Learner",
      description: "Early tertiary & TVET benchmark",
    },
    grade12: {
      label: "Grade 12 Learner",
      description: "Matric final prep, CAO & NSFAS",
    },
    below_grade10: {
      label: "Less than Grade 10",
      description: "Senior phase guidance & TVET access",
    },
    tertiary: {
      label: "Student (Tertiary / TVET)",
      description: "Colleges, artisan trades & diplomas",
    },
    work_seeker: {
      label: "Work Seeker",
      description: "Upskilling, learnerships & jobs",
    },
    parent: {
      label: "Parent / Guardian",
      description: "Guiding youth through career paths",
    },
    teacher: {
      label: "Career Guidance Teacher",
      description: "Life Orientation & classroom tools",
    },
    practitioner: {
      label: "Career Practitioner",
      description: "Professional advisory diagnostic tools",
    },
  },
  disabilityCategories: {
    visual: "Visual",
    hearing: "Hearing",
    physical: "Physical",
    learning: "Learning",
  },
};

const af: OnboardingStrings = {
  republicLabel: "REPUBLIEK VAN SUID-AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Nul-tariefportaal",
  heroKicker: "NASIONALE LOOPBAANADVIESPORTAAL",
  heroTitle: "Welkom by Khetha NCAP",
  heroBody: "Voltooi asseblief hieronder vir statistiek en pasgemaakte leiding.",
  whoAreYou: "Wie is jy? (Kies jou huidige rol)",
  required: "Verpligtend",
  disabilityStatus: "Gestremdheidstatus",
  disabilityQuestion: "Is jy ’n persoon wat met ’n gestremdheid leef?",
  yes: "Ja",
  no: "Nee",
  offlineTitle: "Werk aflyn ná eerste sinkronisering",
  offlineBody:
    "Blaai gekasheerde loopbane en gaan voort met vraelyste sonder sein. Gunstelinge en resultate stoor op die toestel en sinkroniseer wanneer jy weer verbind.",
  startExploring: "Begin verken / Qala",
  startExploringSub: "Ontsluit verpersoonlikte studiemoontlikhede",
  continueAsGuest: "Gaan voort as gas",
  quote:
    "Onderwys is die kragtigste wapen waarmee jy die wêreld kan verander.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "Kon nie jou profielbesonderhede stoor nie.",
  guestError: "Gasmodus nie beskikbaar nie.",
  roles: {
    grade10: {
      label: "Graad 10-leerder",
      description: "Vakkeuse & toekomstige studierigting",
    },
    grade11: {
      label: "Graad 11-leerder",
      description: "Vroeë tersiêre & TVET-maatstaf",
    },
    grade12: {
      label: "Graad 12-leerder",
      description: "Matriek-eindvoorbereiding, CAO & NSFAS",
    },
    below_grade10: {
      label: "Laer as Graad 10",
      description: "Seniorfase-leiding & TVET-toegang",
    },
    tertiary: {
      label: "Student (Tersiêr / TVET)",
      description: "Kolleges, ambagte & diplomas",
    },
    work_seeker: {
      label: "Werksoeker",
      description: "Vaardigheidsbou, leerlingskappe & werk",
    },
    parent: {
      label: "Ouer / Voog",
      description: "Ondersteun ’n leerder se loopbaanreis",
    },
    teacher: {
      label: "Onderwyser / LO-opvoeder",
      description: "Lei leerders met klaskamerhulpmiddels",
    },
    practitioner: {
      label: "Loopbaanpraktisyn",
      description: "CDS-adviseur & fasiliteringsondersteuning",
    },
  },
  disabilityCategories: {
    visual: "Visueel",
    hearing: "Gehoor",
    physical: "Fisies",
    learning: "Leer",
  },
};

const zu: OnboardingStrings = {
  republicLabel: "IRIPHABHULIKHI YASENINGIZIMU AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Iphothali Engakhokhiswa Idatha",
  heroKicker: "IPHOTHALI KAZWELONKE YEZELELEKO ZOMSEBENZI",
  heroTitle: "Siyakwamukela ku-Khetha NCAP",
  heroBody: "Sicela ugcwalise ngezansi kuzibalo nesiqondiso esiqondene nawe.",
  whoAreYou: "Ungubani? (Khetha indima yakho yamanje)",
  required: "Kuyadingeka",
  disabilityStatus: "Isimo Sokukhubazeka",
  disabilityQuestion: "Ingabe ungumuntu ophila nokukhubazeka?",
  yes: "Yebo",
  no: "Cha",
  offlineTitle: "Iyasebenza ngaphandle kwe-inthanethi ngemva kokuvumelanisa kokuqala",
  offlineBody:
    "Phequlula imisebenzi egciniwe uqhubeke nohlulwemibuzo ngaphandle kwesignali. Izintandokazi nemiphumela kugcinwa kudivayisi bese kuvumelaniswa uma uphinde uxhuma.",
  startExploring: "Qala Ukuhlola / Qala",
  startExploringSub: "Vula izindlela zokufunda eziqondene nawe",
  continueAsGuest: "Qhubeka njengesimenywa",
  quote:
    "Imfundo iyikhali enamandla kunazo zonke ongasebenzisa ukushintsha umhlaba.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "Ayikwazanga ukulondoloza imininingwane yephrofayili yakho.",
  guestError: "Imodi yesimenywa ayitholakali.",
  roles: {
    grade10: {
      label: "Umfundi Webanga 10",
      description: "Ukukhetha izifundo nomkhakha wesikhathi esizayo",
    },
    grade11: {
      label: "Umfundi Webanga 11",
      description: "Ibhenchimakhi yezikhungo eziphakeme ne-TVET",
    },
    grade12: {
      label: "Umfundi Webanga 12",
      description: "Ukulungiselela iMatric, i-CAO ne-NSFAS",
    },
    below_grade10: {
      label: "Ngaphansi Kwebanga 10",
      description: "Isiqondiso sesigaba esiphakeme nokufinyelela i-TVET",
    },
    tertiary: {
      label: "Umfundi (Ephakeme / TVET)",
      description: "Amakolishi, imisebenzi yezandla namadiploma",
    },
    work_seeker: {
      label: "Ofuna Umsebenzi",
      description: "Ukuthuthukisa amakhono, ukufunda komsebenzi nemisebenzi",
    },
    parent: {
      label: "Umzali / Umqaphi",
      description: "Sekela uhambo lomfundi lomsebenzi",
    },
    teacher: {
      label: "Uthisha / Umfundisi we-LO",
      description: "Qondisa abafundi ngamathuluzi ekilasini",
    },
    practitioner: {
      label: "Uchwepheshe Womsebenzi",
      description: "Umeluleki we-CDS nokusekela",
    },
  },
  disabilityCategories: {
    visual: "Ukubona",
    hearing: "Ukuzwa",
    physical: "Umzimba",
    learning: "Ukufunda",
  },
};

const xh: OnboardingStrings = {
  republicLabel: "IRIPHABLIKHI YOMZANTSI AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Iphothali Engakhokhisi Datha",
  heroKicker: "IPHOTHALI YESIZWE YEENGCEBISO ZOMSEBENZI",
  heroTitle: "Wamkelekile ku-Khetha NCAP",
  heroBody: "Nceda ugcwalise ngezantsi kumanani nesiqondiso esilungiselelwe wena.",
  whoAreYou: "Ungubani? (Khetha indima yakho yangoku)",
  required: "Kuyafuneka",
  disabilityStatus: "Isimo Sokukhubazeka",
  disabilityQuestion: "Ingaba ungumntu ophila nokukhubazeka?",
  yes: "Ewe",
  no: "Hayi",
  offlineTitle: "Iyasebenza ngaphandle kwe-intanethi emva kovumelaniso lokuqala",
  offlineBody:
    "Khangela imisebenzi egciniweyo uqhubeke noluhlu lwemibuzo ngaphandle kwesignali. Izintandokazi neziphumo zigcinwa kwisixhobo zize zivumelaniswe xa uphinda uqhagamshelana.",
  startExploring: "Qala Ukuhlola / Qala",
  startExploringSub: "Vula iindlela zokufunda ezilungiselelwe wena",
  continueAsGuest: "Qhubeka njengendwendwe",
  quote:
    "Imfundo sesona sixhobo sinamandla ungasebenzisa ukutshintsha ihlabathi.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "Ayikwazi ukugcina iinkcukacha zeprofayile yakho.",
  guestError: "Imowudi yendwendwe ayifumaneki.",
  roles: {
    grade10: {
      label: "Umfundi Webanga le-10",
      description: "Ukukhetha izifundo nomkhakha wesixa esizayo",
    },
    grade11: {
      label: "Umfundi Webanga le-11",
      description: "Ibhenchimakhi yezikhungo eziphakamileyo ne-TVET",
    },
    grade12: {
      label: "Umfundi Webanga le-12",
      description: "Ukulungiselela iMatric, i-CAO ne-NSFAS",
    },
    below_grade10: {
      label: "Ngaphantsi Kwebanga le-10",
      description: "Isiqondiso sesigaba esiphakamileyo nokufikelela i-TVET",
    },
    tertiary: {
      label: "Umfundi (Ephakamileyo / TVET)",
      description: "Iikholeji, imisebenzi yezandla neediploma",
    },
    work_seeker: {
      label: "Ofuna Umsebenzi",
      description: "Ukuphucula izakhono, ukufunda komsebenzi nemisebenzi",
    },
    parent: {
      label: "Umzali / Umgcini",
      description: "Xhasa uhambo lomfundi lomsebenzi",
    },
    teacher: {
      label: "Utitshala / Umfundisi we-LO",
      description: "Khokela abafundi ngezixhobo zeklasi",
    },
    practitioner: {
      label: "Ingcali Yomsebenzi",
      description: "Umcebisi we-CDS nenkxaso",
    },
  },
  disabilityCategories: {
    visual: "Ukubona",
    hearing: "Ukuva",
    physical: "Umzimba",
    learning: "Ukufunda",
  },
};

const nr: OnboardingStrings = {
  ...zu,
  republicLabel: "IRIPHABHULIKHI YASENINGIZIMU AFRIKA",
  heroTitle: "Siyakwamukela ku-Khetha NCAP",
  whoAreYou: "Ungubani? (Khetha indima yakho yamanje)",
  yes: "Yebo",
  no: "Awa",
  startExploring: "Qala Ukuhlola / Qala",
  continueAsGuest: "Qhubeka njengesimenywa",
  saveError: "Ayikghani ukulondoloza imininingwane yephrofayili yakho.",
  guestError: "Imodi yesimenywa ayitholakali.",
  roles: {
    ...zu.roles,
    grade10: {
      label: "Umfundi Webanga 10",
      description: "Ukukhetha izifundo nomkhakha wesikhathi esizako",
    },
  },
};

const ss: OnboardingStrings = {
  ...zu,
  republicLabel: "UMBUTFO WASENINGIZIMU AFRIKA",
  heroTitle: "Siyakwemukela ku-Khetha NCAP",
  whoAreYou: "Ungubani? (Khetsa indima yakho yamanje)",
  yes: "Yebo",
  no: "Cha",
  startExploring: "Cala Kuhlola / Qala",
  continueAsGuest: "Chubeka njengesimenyiwa",
  saveError: "Ayikwati kulondoloza imininingwane yephrofayili yakho.",
  guestError: "Imodi yesimenyiwa ayitholakali.",
  roles: {
    grade10: {
      label: "Umfundi Webanga 10",
      description: "Kukhetsa tifundvo nemkhakha wesikhatsi lesitako",
    },
    grade11: {
      label: "Umfundi Webanga 11",
      description: "Ibhenchimakhi yetikhungo letiphakeme ne-TVET",
    },
    grade12: {
      label: "Umfundi Webanga 12",
      description: "Kulungiselela iMatric, i-CAO ne-NSFAS",
    },
    below_grade10: {
      label: "Ngaphansi Kwebanga 10",
      description: "Sicondziso sesigaba lesiphakeme nekufinyelela i-TVET",
    },
    tertiary: {
      label: "Umfundi (Lephakeme / TVET)",
      description: "Emakolishi, imisebenti yezandla namadiploma",
    },
    work_seeker: {
      label: "Lofuna Umsebenti",
      description: "Kutfutfukisa emakhono, kufundza umsebenti nemisebenti",
    },
    parent: {
      label: "Umzal' / Umlondvoli",
      description: "Sekela luhambo lomfundi lomsebenti",
    },
    teacher: {
      label: "Uthisha / Umfundisi we-LO",
      description: "Condza bafundzi ngematuluzi ekilasini",
    },
    practitioner: {
      label: "Uchwepheshe Wemsebenti",
      description: "Umeluleki we-CDS nekusekela",
    },
  },
};

const nso: OnboardingStrings = {
  republicLabel: "REPHABLIKI YA AFRIKA BORWA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Phothale ye e sa Lefišego Datha",
  heroKicker: "PHOTHALE YA BOSETŠHABA YA KELETŠO YA MOŠOMO",
  heroTitle: "O amogetšwe go Khetha NCAP",
  heroBody: "Hle tlatša ka fase bakeng sa dipalopalo le tšhupetšo ye e ikgethilego.",
  whoAreYou: "O mang? (Kgetha karolo ya gago ya bjale)",
  required: "E a nyakega",
  disabilityStatus: "Maemo a Bogole",
  disabilityQuestion: "Na o motho yo a phelago le bogole?",
  yes: "Ee",
  no: "Aowa",
  offlineTitle: "E šoma ntle le inthanete ka morago ga go nyalantšha ga mathomo",
  offlineBody:
    "Phetla mešomo ye e bolokilwego o tšwele pele ka mananeo a dipotšišo ntle le signal. Ditabatabelo le dipoelo di bolokwa sedirišweng gomme di nyalantšhwa ge o kgokaganya gape.",
  startExploring: "Thoma go Nyakišiša / Qala",
  startExploringSub: "Bula ditsela tša thuto tše di ikgethilego",
  continueAsGuest: "Tšwela pele bjalo ka Moeng",
  quote:
    "Thuto ke sebetsa se maatla kudu seo o ka se dirišago go fetola lefase.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "Ga se ya kgona go boloka dintlha tša profili ya gago.",
  guestError: "Mokgwa wa moeng ga o hwetšagale.",
  roles: {
    grade10: {
      label: "Moithuti wa Mphato wa 10",
      description: "Kgetho ya dithuto le ntshelete ya thuto ya ka moso",
    },
    grade11: {
      label: "Moithuti wa Mphato wa 11",
      description: "Tekanyo ya thuto ye e phagamego le TVET",
    },
    grade12: {
      label: "Moithuti wa Mphato wa 12",
      description: "Iphaparatšo ya Matric, CAO le NSFAS",
    },
    below_grade10: {
      label: "Ka fase ga Mphato wa 10",
      description: "Tšhupetšo ya kgato ye e phagamego le phihlelelo ya TVET",
    },
    tertiary: {
      label: "Moithuti (Phagamego / TVET)",
      description: "Dikholetšhe, mešomo ya diatla le diploma",
    },
    work_seeker: {
      label: "Monyakišiši wa Mošomo",
      description: "Go kaonafatša bokgoni, dithuto tša mošomo le mešomo",
    },
    parent: {
      label: "Motswadi / Mohlokomedi",
      description: "Thekga leeto la moithuti la mošomo",
    },
    teacher: {
      label: "Morutiši / Morutiši wa LO",
      description: "Hlahla baithuti ka didirišwa tša phapošong",
    },
    practitioner: {
      label: "Setsebi sa Mošomo",
      description: "Moeletši wa CDS le thekgo",
    },
  },
  disabilityCategories: {
    visual: "Go bona",
    hearing: "Go kwa",
    physical: "Mmele",
    learning: "Go ithuta",
  },
};

const st: OnboardingStrings = {
  ...nso,
  republicLabel: "REPHABLIKI EA AFRIKA BOROA",
  heroTitle: "U amohetsoe ho Khetha NCAP",
  whoAreYou: "U mang? (Khetha karolo ea hau ea hona joale)",
  yes: "E",
  no: "Che",
  startExploring: "Qala ho Hlahloba / Qala",
  continueAsGuest: "Tsoela pele joalo ka Moeti",
  saveError: "Ha ea khona ho boloka lintlha tsa profili ea hau.",
  guestError: "Mokhoa oa moeti ha o fumanehe.",
  roles: {
    grade10: {
      label: "Moithuti oa Sehlopha sa 10",
      description: "Khetho ea lithuto le tsela ea thuto ea ka moso",
    },
    grade11: {
      label: "Moithuti oa Sehlopha sa 11",
      description: "Tekanyo ea thuto e phahameng le TVET",
    },
    grade12: {
      label: "Moithuti oa Sehlopha sa 12",
      description: "Tokisetso ea Matric, CAO le NSFAS",
    },
    below_grade10: {
      label: "Ka tlase ho Sehlopha sa 10",
      description: "Tataiso ea mohato o phahameng le phihlello ea TVET",
    },
    tertiary: {
      label: "Moithuti (E phahameng / TVET)",
      description: "Likoleche, mesebetsi ea matsoho le diploma",
    },
    work_seeker: {
      label: "Monyakišiši oa Mosebetsi",
      description: "Ho ntlafatsa bokhoni, lithuto tsa mosebetsi le mesebetsi",
    },
    parent: {
      label: "Motsoali / Mohlokomeli",
      description: "Tšehetsa leeto la moithuti la mosebetsi",
    },
    teacher: {
      label: "Mosuoe / Mosuoe oa LO",
      description: "Tataisa baithuti ka lisebelisoa tsa ka sehlopheng",
    },
    practitioner: {
      label: "Setsebi sa Mosebetsi",
      description: "Moeletsi oa CDS le tšehetso",
    },
  },
  disabilityCategories: {
    visual: "Ho bona",
    hearing: "Ho utloa",
    physical: "'Mele",
    learning: "Ho ithuta",
  },
};

const tn: OnboardingStrings = {
  ...nso,
  republicLabel: "REPHABOLIKI YA AFRIKA BORWA",
  heroTitle: "O amogetswe go Khetha NCAP",
  whoAreYou: "O mang? (Tlhopha karolo ya gago ya jaanong)",
  yes: "Ee",
  no: "Nnyaa",
  startExploring: "Simolola go Batlisisa / Qala",
  continueAsGuest: "Tswelela jaaka Moeng",
  saveError: "Ga e a kgona go boloka dintlha tsa profili ya gago.",
  guestError: "Mokgwa wa moeng ga o bonale.",
  roles: {
    grade10: {
      label: "Moithuti wa Mphato wa 10",
      description: "Tlhopho ya dithuto le tsela ya thuto ya isago",
    },
    grade11: {
      label: "Moithuti wa Mphato wa 11",
      description: "Tekanyo ya thuto e e phagameng le TVET",
    },
    grade12: {
      label: "Moithuti wa Mphato wa 12",
      description: "Iphaparatšo ya Matric, CAO le NSFAS",
    },
    below_grade10: {
      label: "Ka fa tlase ga Mphato wa 10",
      description: "Tshupiso ya kgato e e phagameng le phitlhelelo ya TVET",
    },
    tertiary: {
      label: "Moithuti (E e Phagameng / TVET)",
      description: "Dikholetšhe, ditiro tsa diatla le diploma",
    },
    work_seeker: {
      label: "Monyakišiši wa Tiro",
      description: "Go tokafatsa bokgoni, dithuto tsa tiro le ditiro",
    },
    parent: {
      label: "Motswadi / Mothokomedi",
      description: "Tshegetsa loeto lwa moithuti lwa tiro",
    },
    teacher: {
      label: "Morutabana / Morutabana wa LO",
      description: "Kaela baithuti ka didiriswa tsa phaposing",
    },
    practitioner: {
      label: "Setsebi sa Tiro",
      description: "Moeletši wa CDS le tshegetso",
    },
  },
  disabilityCategories: {
    visual: "Go bona",
    hearing: "Go utlwa",
    physical: "Mmele",
    learning: "Go ithuta",
  },
};

const ve: OnboardingStrings = {
  republicLabel: "RIPHABULIKI YA AFRIKA TSHEMBE",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Portal i sa Badeliho Datha",
  heroKicker: "PORTAL YA LUSHAKA YA NḒIVHADZO YA MUSHUMO",
  heroTitle: "Ni tendelwa kha Khetha NCAP",
  heroBody: "Ni khou humbela u ḓadzisa fhasi u itela statistics na tshumisano yo ḓoweledzwaho.",
  whoAreYou: "Ni nnyi? (Nangani mushumo wanu wa zwino)",
  required: "Zwi a tea",
  disabilityStatus: "Tshiimo tsha Vhukololo",
  disabilityQuestion: "Naa ni muthu a tshi tshila na vhukololo?",
  yes: "Ee",
  no: "Hai",
  offlineTitle: "I a shuma nnda ha inthanethe nga murahu ha u khwinisa ha u thoma",
  offlineBody:
    "Vhalani mishumo yo vhulungwaho ni bvele phanda nga miṅwalo ya mbudziso nnda ha signal. Zwo funwaho na mvelelo zwi vhulungwa kha tshishumiswa zwa khwiniswa musi ni tshi vhuedzedza u ṱumanya.",
  startExploring: "Thomani u Ṱolisa / Qala",
  startExploringSub: "Vulani nḓila dza u guda dzo ḓoweledzwaho",
  continueAsGuest: "Bvelani phanda sa Mueni",
  quote:
    "Pfunzo ndi tshibetsa tshine tsha vha na maanḓa vhukuma tshine na nga tshi shumisa u shandukisa shango.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "A yo ngo kona u vhulunga zwidodombedzwa zwa profili yanu.",
  guestError: "Modi ya mueni a i wanali.",
  roles: {
    grade10: {
      label: "Mugudi wa Gireidi 10",
      description: "U nanga thero na muhasho wa tshifhinga tshi ḓaho",
    },
    grade11: {
      label: "Mugudi wa Gireidi 11",
      description: "Tshiṱaluli tsha pfunzo ya nṱha na TVET",
    },
    grade12: {
      label: "Mugudi wa Gireidi 12",
      description: "U lugisela Matric, CAO na NSFAS",
    },
    below_grade10: {
      label: "Fhasi ha Gireidi 10",
      description: "Tshumisano ya tshiṅwe tshiṱaluli na u swikelela TVET",
    },
    tertiary: {
      label: "Mugudi (Nṱha / TVET)",
      description: "Zwikolo, mishumo ya zwanda na diploma",
    },
    work_seeker: {
      label: "Muṱoḓi wa Mushumo",
      description: "U khwinisa vhukoni, u guda mushumo na mishumo",
    },
    parent: {
      label: "Mubebi / Mulindeli",
      description: "Tikedzani luendo lwa mugudi lwa mushumo",
    },
    teacher: {
      label: "Mudededzi / Mudededzi wa LO",
      description: "Khokhedzani vhagudi nga zwishumiswa zwa kilasini",
    },
    practitioner: {
      label: "Muṅwe wa Mushumo",
      description: "Muéeletshedzi wa CDS na thuso",
    },
  },
  disabilityCategories: {
    visual: "U vhona",
    hearing: "U pfa",
    physical: "Muvhili",
    learning: "U guda",
  },
};

const ts: OnboardingStrings = {
  republicLabel: "RIPHABULIKI YA AFRIKA DZONGA",
  govSub: "DHET · Khetha NCAP",
  zeroRatedPortal: "Portal leyi nga Hakeliki Datha",
  heroKicker: "PORTAL YA RIXAKA YA SWITSUNDZUXO SWA NTIRHO",
  heroTitle: "U amukeriwile eka Khetha NCAP",
  heroBody: "Hi kombela u tatisa ehansi eka tinhlayo na xikombiso lexi hlawuriweke.",
  whoAreYou: "U mani? (Hlawula ntirho wa wena wa sweswi)",
  required: "Swa laveka",
  disabilityStatus: "Xiyimo xa Vutsoniwa",
  disabilityQuestion: "Xana u munhu loyi a hanya na vutsoniwa?",
  yes: "Ina",
  no: "E-e",
  offlineTitle: "Yi tirha handle ka inthanete endzhaku ka ku fambisanisa ka sungula",
  offlineBody:
    "Hlaya mintirho leyi hlayisiweke u yisa emahlweni nxaxamelo wa swivutiso handle ka signal. Swo rhandza na mbuyelo swi hlayisiwa eka xitirhisiwa swi fambisanisiwa loko u tlhela u khoma.",
  startExploring: "Sungula ku Lavisisa / Qala",
  startExploringSub: "Pfula tindlela ta dyondzo leti hlawuriweke",
  continueAsGuest: "Yisa emahlweni tanihi Muendzi",
  quote:
    "Dyondzo i xitlhangu lexi nga ni matimba swinene lexi u nga xi tirhisaka ku cinca misava.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  saveError: "A yi swi kotanga ku hlayisa vuxokoxoko bya profili ya wena.",
  guestError: "Modi ya muendzi a yi kumeki.",
  roles: {
    grade10: {
      label: "Mudyondzi wa Gireidi 10",
      description: "Ku hlawula tidyondzo na ndlela ya dyondzo ya nkarhi lowu taka",
    },
    grade11: {
      label: "Mudyondzi wa Gireidi 11",
      description: "Xipimo xa dyondzo ya le henhla na TVET",
    },
    grade12: {
      label: "Mudyondzi wa Gireidi 12",
      description: "Ku lulungisela Matric, CAO na NSFAS",
    },
    below_grade10: {
      label: "Ehansi ka Gireidi 10",
      description: "Xikombiso xa xiyimo xa le henhla na ku fikelela TVET",
    },
    tertiary: {
      label: "Mudyondzi (Le Henhla / TVET)",
      description: "Tikholeji, mintirho ya mavoko na tidiploma",
    },
    work_seeker: {
      label: "Mulavisisi wa Ntirho",
      description: "Ku antswisa vuswikoti, dyondzo ya ntirho na mintirho",
    },
    parent: {
      label: "Mutswari / Muhlayisi",
      description: "Sekela rendzo ra mudyondzi ra ntirho",
    },
    teacher: {
      label: "Mudyondzisi / Mudyondzisi wa LO",
      description: "Kongomisa vadyondzi hi switirho swa ekilasini",
    },
    practitioner: {
      label: "Xiyimo xa Ntirho",
      description: "Muéletsi wa CDS na nseketelo",
    },
  },
  disabilityCategories: {
    visual: "Ku vona",
    hearing: "Ku twa",
    physical: "Miri",
    learning: "Ku dyondza",
  },
};

const ONBOARDING_I18N = createBundle<OnboardingStrings>({
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

export function getOnboardingStrings(
  locale: string | null | undefined,
): OnboardingStrings {
  return ONBOARDING_I18N[resolveLocale(locale)];
}
