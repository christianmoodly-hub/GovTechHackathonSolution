import { expandSaLocales, resolveLocale } from "./createBundle";

export type OnboardingStrings = {
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
};

const en: OnboardingStrings = {
  govLabel: "REPUBLIC OF SOUTH AFRICA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Zero-Rated Portal",
  heroKicker: "NATIONAL CAREER ADVICE PORTAL",
  heroTitle: "Welcome to Khetha NCAP",
  heroBody: "Please complete below for statistics & tailored guidance.",
  whoAreYou: "Who are you? (Select your current role)",
  required: "Required",
  roles: {
    grade10: {
      label: "Grade 10 Learner",
      description: "Subject choice & future study stream"
    },
    grade11: {
      label: "Grade 11 Learner",
      description: "Early tertiary & TVET benchmark"
    },
    grade12: {
      label: "Grade 12 Learner",
      description: "Matric final prep, CAO & NSFAS"
    },
    below_grade10: {
      label: "Less than Grade 10",
      description: "Senior phase guidance & TVET access"
    },
    tertiary: {
      label: "Student (Tertiary / TVET)",
      description: "Colleges, artisan trades & diplomas"
    },
    work_seeker: {
      label: "Work Seeker",
      description: "Upskilling, learnerships & jobs"
    },
    parent: {
      label: "Parent / Guardian",
      description: "Guiding youth through career paths"
    },
    teacher: {
      label: "Career Guidance Teacher",
      description: "Life Orientation & classroom tools"
    },
    practitioner: {
      label: "Career Practitioner",
      description: "Professional advisory diagnostic tools"
    }
  },
  disabilityStatus: "Disability Status",
  disabilityQuestion: "Are you a person living with a disability?",
  yes: "Yes",
  no: "No",
  disabilities: {
    visual: "Visual",
    hearing: "Hearing",
    physical: "Physical",
    learning: "Learning"
  },
  offlineTitle: "Works offline after first sync",
  offlineBody: "Browse cached careers and continue questionnaires without signal. Favourites and results save on device and sync when you reconnect.",
  startExploring: "Start Exploring / Qala",
  startExploringSub: "Unlock personalized study pathways",
  continueGuest: "Continue as Guest",
  quote: "Education is the most powerful weapon which you can use to change the world.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "Could not save your profile details.",
  errorGuest: "Guest mode unavailable."
};

const af: OnboardingStrings = {
  govLabel: "REPUBLIEK VAN SUID-AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Nul-gegradeerde portaal",
  heroKicker: "NASIONALE LOOPBAANADVIESPORTAAL",
  heroTitle: "Welkom by Khetha NCAP",
  heroBody: "Voltooi asseblief hieronder vir statistiek & pasgemaakte leiding.",
  whoAreYou: "Wie is jy? (Kies jou huidige rol)",
  required: "Verpligtend",
  roles: {
    grade10: {
      label: "Graad 10-leerder",
      description: "Vakkeuse & toekomstige studierigting"
    },
    grade11: {
      label: "Graad 11-leerder",
      description: "Vroeë tersiêre & TVET-maatstaf"
    },
    grade12: {
      label: "Graad 12-leerder",
      description: "Matriek-eindvoorbereiding, CAO & NSFAS"
    },
    below_grade10: {
      label: "Minder as Graad 10",
      description: "Seniorfase-leiding & TVET-toegang"
    },
    tertiary: {
      label: "Student (Tersiêr / TVET)",
      description: "Kolleges, ambagte & diplomas"
    },
    work_seeker: {
      label: "Werksoeker",
      description: "Opgradering, leerlingskappe & werk"
    },
    parent: {
      label: "Ouer / Voog",
      description: "Lei jeug deur loopbaanpaaie"
    },
    teacher: {
      label: "Loopbaanbegeleidingsonderwyser",
      description: "Lewensoriëntering & klaskamerhulpmiddels"
    },
    practitioner: {
      label: "Loopbaanpraktisyn",
      description: "Professionele adviserende diagnostiese hulpmiddels"
    }
  },
  disabilityStatus: "Gestremdheidstatus",
  disabilityQuestion: "Is jy 'n persoon wat met 'n gestremdheid leef?",
  yes: "Ja",
  no: "Nee",
  disabilities: {
    visual: "Visueel",
    hearing: "Gehoor",
    physical: "Fisies",
    learning: "Leer"
  },
  offlineTitle: "Werk aflyn na eerste sinkronisering",
  offlineBody: "Blaai deur gekaste loopbane en gaan voort met vraelyste sonder sein. Gunstelinge en resultate stoor op die toestel en sinkroniseer wanneer jy weer verbind.",
  startExploring: "Begin Verken / Qala",
  startExploringSub: "Ontsluit persoonlike studiepaaie",
  continueGuest: "Gaan voort as gas",
  quote: "Onderwys is die kragtigste wapen waarmee jy die wêreld kan verander.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "Kon nie jou profielbesonderhede stoor nie.",
  errorGuest: "Gasmodus nie beskikbaar nie."
};

const zu: OnboardingStrings = {
  govLabel: "IRIPHABHULIKHI YASENINGIZIMU AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Iphothali ye-Zero-Rated",
  heroKicker: "IPHOTHALI YESIZWE YEZELULEKO ZOMSEBENZI",
  heroTitle: "Siyakwamukela ku-Khetha NCAP",
  heroBody: "Sicela ugcwalise ngezansi ukuze uthole izibalo nesiqondiso esenzelwe wena.",
  whoAreYou: "Ungubani? (Khetha indima yakho yamanje)",
  required: "Kuyadingeka",
  roles: {
    grade10: {
      label: "Umfundi webanga le-10",
      description: "Ukukhetha izifundo nendlela yokufunda yesikhathi esizayo"
    },
    grade11: {
      label: "Umfundi webanga le-11",
      description: "Isilinganiso sokuqala setertiary ne-TVET"
    },
    grade12: {
      label: "Umfundi webanga le-12",
      description: "Ukulungiselela umatikuletsheni, CAO & NSFAS"
    },
    below_grade10: {
      label: "Ngaphansi kwebanga le-10",
      description: "Isiqondiso sesigaba esiphakeme nokufinyelela i-TVET"
    },
    tertiary: {
      label: "Umfundi (Tertiary / TVET)",
      description: "Amakolishi, imisebenzi yobuchwepheshe namadiploma"
    },
    work_seeker: {
      label: "Umfuni womsebenzi",
      description: "Ukuthuthukisa amakhono, ukufunda nemisebenzi"
    },
    parent: {
      label: "Umzali / Umqaphi",
      description: "Ukuqondisa intsha ezindleleni zomsebenzi"
    },
    teacher: {
      label: "Uthisha wesiqondiso somsebenzi",
      description: "I-Life Orientation namathuluzi ekilasini"
    },
    practitioner: {
      label: "Uchwepheshe womsebenzi",
      description: "Amathuluzi okuhlola okwelulekayo"
    }
  },
  disabilityStatus: "Isimo Sokukhubazeka",
  disabilityQuestion: "Ingabe ungumuntu ophila nokukhubazeka?",
  yes: "Yebo",
  no: "Cha",
  disabilities: {
    visual: "Ukubona",
    hearing: "Ukuzwa",
    physical: "Umzimba",
    learning: "Ukufunda"
  },
  offlineTitle: "Iyasebenza ngaphandle kwe-inthanethi ngemva kokuvumelanisa kokuqala",
  offlineBody: "Phequlula imisebenzi egciniwe uqhubeke nemibuzo ngaphandle kwesignali. Okuthandayo nemiphumela kugcinwa kudivayisi futhi kuvumelaniswa lapho uphinde uxhuma.",
  startExploring: "Qala Ukuhlola / Qala",
  startExploringSub: "Vula izindlela zokufunda ezenzelwe wena",
  continueGuest: "Qhubeka njengeSivakashi",
  quote: "Imfundo iyisikhali esinamandla kunazo zonke ongasebenzisa ngaso ukushintsha umhlaba.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "Akukwazanga ukulondoloza imininingwane yephrofayela yakho.",
  errorGuest: "Imodi yesivakashi ayitholakali."
};

const xh: OnboardingStrings = {
  govLabel: "IRIPHABLIKHI YOMZANTSI AFRIKA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Iphothali ye-Zero-Rated",
  heroKicker: "IPHOTHALI YESIZWE YEECEBISO ZOMSEBENZI",
  heroTitle: "Wamkelekile ku-Khetha NCAP",
  heroBody: "Nceda ugcwalise ngezantsi ukuze ufumane izibalo nesikhokelo esenzelwe wena.",
  whoAreYou: "Ungubani? (Khetha indima yakho yangoku)",
  required: "Iyafuneka",
  roles: {
    grade10: {
      label: "Umfundi webanga le-10",
      description: "Ukukhetha izifundo nendlela yokufunda yexesha elizayo"
    },
    grade11: {
      label: "Umfundi webanga le-11",
      description: "Umlinganiselo wokuqala wetertiary ne-TVET"
    },
    grade12: {
      label: "Umfundi webanga le-12",
      description: "Ukulungiselela umatrik, CAO & NSFAS"
    },
    below_grade10: {
      label: "Ngaphantsi kwebanga le-10",
      description: "Isikhokelo sesigaba esiphezulu nokufikelela i-TVET"
    },
    tertiary: {
      label: "Umfundi (Tertiary / TVET)",
      description: "Iikholeji, imisebenzi yobuchule neediploma"
    },
    work_seeker: {
      label: "Umfuni womsebenzi",
      description: "Ukuphucula izakhono, ukufunda nemisebenzi"
    },
    parent: {
      label: "Umzali / Umlondolozi",
      description: "Ukuqondisa ulutsha kwiindlela zomsebenzi"
    },
    teacher: {
      label: "Utitshala wesikhokelo somsebenzi",
      description: "I-Life Orientation nezixhobo zeklasi"
    },
    practitioner: {
      label: "Ingcali yomsebenzi",
      description: "Izixhobo zokuhlola ezicebisayo"
    }
  },
  disabilityStatus: "Isimo Sokukhubazeka",
  disabilityQuestion: "Ingaba ungumntu ophila nokukhubazeka?",
  yes: "Ewe",
  no: "Hayi",
  disabilities: {
    visual: "Ukubona",
    hearing: "Ukuva",
    physical: "Umzimba",
    learning: "Ukufunda"
  },
  offlineTitle: "Iyasebenza ngaphandle kwe-intanethi emva kokuvumelanisa kokuqala",
  offlineBody: "Khangela imisebenzi egciniweyo uqhubeke neemibuzo ngaphandle kwesignali. Izinto ozithandayo neziphumo zigcinwa kwisixhobo kwaye zivumelaniswa xa uphinda uqhagamshela.",
  startExploring: "Qala Ukuhlola / Qala",
  startExploringSub: "Vula iindlela zokufunda ezenzelwe wena",
  continueGuest: "Qhubeka njengoNdwendwe",
  quote: "Imfundo sesona sixhobo sinamandla onokusebenzisa ngaso ukutshintsha ihlabathi.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "Ayikwazanga ukugcina iinkcukacha zeprofayile yakho.",
  errorGuest: "Imowudi yondwendwe ayifumaneki."
};

const nso: OnboardingStrings = {
  govLabel: "REPHABLIKI YA AFRIKA BORWA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Photale ya Zero-Rated",
  heroKicker: "PHOTALE YA NAGA YA KELETŠO YA MOŠOMO",
  heroTitle: "O amogetšwe go Khetha NCAP",
  heroBody: "Hle tlatša ka fase bakeng sa dipalo le keletšo ye e dirilwego ka wena.",
  whoAreYou: "O mang? (Kgetha karolo ya gago ya bjale)",
  required: "E a nyakega",
  roles: {
    grade10: {
      label: "Moithuti wa Mphato wa 10",
      description: "Kgetho ya dithuto le tsela ya thuto ya ka moso"
    },
    grade11: {
      label: "Moithuti wa Mphato wa 11",
      description: "Tekanyo ya pele ya tertiary le TVET"
    },
    grade12: {
      label: "Moithuti wa Mphato wa 12",
      description: "Ithokišetšo ya matekene, CAO & NSFAS"
    },
    below_grade10: {
      label: "Ka fase ga Mphato wa 10",
      description: "Keletšo ya kgato e phagamego le go fihlelela TVET"
    },
    tertiary: {
      label: "Moithuti (Tertiary / TVET)",
      description: "Dikholetšhe, mešomo ya botsebi le diploma"
    },
    work_seeker: {
      label: "Monyakišiši wa mošomo",
      description: "Go kaonafatša mabokgoni, go ithuta le mešomo"
    },
    parent: {
      label: "Motswadi / Mohlokomedi",
      description: "Go hlahla baswa ka ditsela tša mošomo"
    },
    teacher: {
      label: "Morutiši wa keletšo ya mošomo",
      description: "Life Orientation le didirišwa tša phapošaborutelo"
    },
    practitioner: {
      label: "Setsebi sa mošomo",
      description: "Didirišwa tša go hlahloba tša keletšo"
    }
  },
  disabilityStatus: "Maemo a Bogole",
  disabilityQuestion: "Na o motho yo a phelago ka bogole?",
  yes: "Ee",
  no: "Aowa",
  disabilities: {
    visual: "Go bona",
    hearing: "Go kwa",
    physical: "Mmele",
    learning: "Go ithuta"
  },
  offlineTitle: "E šoma ntle le inthanete ka morago ga go swanya la mathomo",
  offlineBody: "Hlahloba mešomo ye e bolokilwego o tšwele pele ka dipotšišo ntle le signal. Dilokwa le dipoelo di bolokwa sedirišweng gomme di swanywa ge o kgokaganya gape.",
  startExploring: "Thoma go Hlahloba / Qala",
  startExploringSub: "Bula ditsela tša thuto tše di dirilwego ka wena",
  continueGuest: "Tšwela pele bjalo ka Moeng",
  quote: "Thuto ke sebetsa se maatla kudu seo o ka se šomišago go fetoša lefase.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "Ga se ya kgona go boloka dintlha tša profaele ya gago.",
  errorGuest: "Mokgwa wa moeng ga o hwetšagale."
};

const ve: OnboardingStrings = {
  govLabel: "RIPHABULIKI YA AFRIKA TSHIPEMBE",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Photale ya Zero-Rated",
  heroKicker: "PHOTALE YA LUSHAKA YA NDAEDZO YA MUSHUMO",
  heroTitle: "No tanganedzwa kha Khetha NCAP",
  heroBody: "Ni khou humbela u ḓadzisa fhasi u itela nomboro na ndaedzo yo itelwaho inwi.",
  whoAreYou: "Ni nnyi? (Nangani tshimo tshanu tsha zwino)",
  required: "Zwi a ṱoḓea",
  roles: {
    grade10: {
      label: "Mugudi wa Gireidi ya 10",
      description: "U nanga zwiguda na ndila ya u guda ya tshifhinga tshi ḓaho"
    },
    grade11: {
      label: "Mugudi wa Gireidi ya 11",
      description: "Mulinganyo wa u thoma wa tertiary na TVET"
    },
    grade12: {
      label: "Mugudi wa Gireidi ya 12",
      description: "U lugisela matric, CAO & NSFAS"
    },
    below_grade10: {
      label: "Fhasi ha Gireidi ya 10",
      description: "Ndaedzo ya tshiteṅwa tsho phakamaho na u swikelela TVET"
    },
    tertiary: {
      label: "Mugudi (Tertiary / TVET)",
      description: "Kholetshi, mishumo ya vhufundi na diploma"
    },
    work_seeker: {
      label: "Muṱoḓi wa mushumo",
      description: "U khwinisa vhukoni, u guda na mishumo"
    },
    parent: {
      label: "Mubebi / Mulindi",
      description: "U ḓivhadza vhaswa nga ndila dza mushumo"
    },
    teacher: {
      label: "Mudededzi wa ndaedzo ya mushumo",
      description: "Life Orientation na zwishumiswa zwa kilasi"
    },
    practitioner: {
      label: "Mudinganyi wa mushumo",
      description: "Zwishumiswa zwa u sedzulusa zwa ndaedzo"
    }
  },
  disabilityStatus: "Tshimo tsha Vhukundi",
  disabilityQuestion: "Ni muthu ane a tshi tshila nga vhukundi?",
  yes: "Ee",
  no: "Hai",
  disabilities: {
    visual: "U vhona",
    hearing: "U pfa",
    physical: "Muvhili",
    learning: "U guda"
  },
  offlineTitle: "I shuma nnda ha inthanethe nga murahu ha u swanya ha u thoma",
  offlineBody: "Ṱolani mishumo yo vhulungiwaho ni bvele phanda nga mibudziso nnda ha signal. Zwi funwaho na mvelelo zwi vhulungwa kha tshishumiswa nahone zwi swanywa musi ni tshi vhuedzedza.",
  startExploring: "Thomani u Ṱola / Qala",
  startExploringSub: "Vulani ndila dza u guda dzo itelwaho inwi",
  continueGuest: "Bvelani phanda sa Mueni",
  quote: "Pfunzo ndi tshishumiswa tshine tsha vha na maanḓa u fhira zwoṱhe zwine na nga shumisa ngatsho u shandukisa shango.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "A zwo ngo kona u vhulunga zwidodombedzwa zwa phrofaule yanu.",
  errorGuest: "Modu ya mueni a i wanali."
};

const ts: OnboardingStrings = {
  govLabel: "RIPHABULIKI YA AFRIKA DZONGA",
  govSub: "DHET · Khetha NCAP",
  zeroRated: "Photale ya Zero-Rated",
  heroKicker: "PHOTALE YA RIXAKA YA NDZIVISO YA NTIRHO",
  heroTitle: "U amukeriwile eka Khetha NCAP",
  heroBody: "Hi kombela u tata laha hansi leswaku u kuma tinomboro na ndziviso leyi endleriweke wena.",
  whoAreYou: "U mani? (Hlawula xiyimo xa wena xa sweswi)",
  required: "Ya laveka",
  roles: {
    grade10: {
      label: "Mudyondzi wa Gireyi ya 10",
      description: "Ku hlawula swidyondzo na ndlela yo dyondza ya nkarhi lowu taka"
    },
    grade11: {
      label: "Mudyondzi wa Gireyi ya 11",
      description: "Mpimo wo sungula wa tertiary na TVET"
    },
    grade12: {
      label: "Mudyondzi wa Gireyi ya 12",
      description: "Ku lulamisa matric, CAO & NSFAS"
    },
    below_grade10: {
      label: "Ehansi ka Gireyi ya 10",
      description: "Ndziviso ya xiyenge xa le henhla na ku fikelela TVET"
    },
    tertiary: {
      label: "Mudyondzi (Tertiary / TVET)",
      description: "Tikholeji, mintirho ya vutshila na tidiploma"
    },
    work_seeker: {
      label: "Mulavi wa ntirho",
      description: "Ku antswisa vuswikoti, ku dyondza na mintirho"
    },
    parent: {
      label: "Mutswari / Mulondzovoti",
      description: "Ku kongomisa vahluvukisi hi tindlela ta ntirho"
    },
    teacher: {
      label: "Mudyondzisi wa ndziviso ya ntirho",
      description: "Life Orientation na switirhisiwa swa kilasi"
    },
    practitioner: {
      label: "Mucekeli wa ntirho",
      description: "Switirhisiwa swo kambela swa ndziviso"
    }
  },
  disabilityStatus: "Xiyimo xa Vusweti",
  disabilityQuestion: "Xana u munhu loyi a hanya hi vusweti?",
  yes: "Ina",
  no: "E-e",
  disabilities: {
    visual: "Ku vona",
    hearing: "Ku twa",
    physical: "Mirhi",
    learning: "Ku dyondza"
  },
  offlineTitle: "Yi tirha handle ka inthanete endzhaku ka ku synca ka sungula",
  offlineBody: "Lava mintirho leyi hlayisiweke u yisa emahlweni hi swivutiso handle ka signal. Swi rhandziwa na mbuyelo swi hlayisiwa eka xitirhisiwa naswona swi synca loko u khomisa nakambe.",
  startExploring: "Sungula ku Lava / Qala",
  startExploringSub: "Pfula tindlela to dyondza leti endleriweke wena",
  continueGuest: "Yisa emahlweni tanihi Muendzi",
  quote: "Dyondzo i xitirho xa matimba swinene lexi u nga xi tirhisaka ku cinca misava.",
  quoteAttr: "— Nelson Rolihlahla Mandela —",
  errorSave: "A swi kotanga ku hlayisa vuxokoxoko bya phurofayile ya wena.",
  errorGuest: "Modu ya muendzi a yi kumi."
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getOnboardingStrings(
  locale: string | null | undefined,
): OnboardingStrings {
  return BUNDLE[resolveLocale(locale)];
}
