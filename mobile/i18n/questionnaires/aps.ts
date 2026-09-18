import { expandSaLocales, resolveLocale } from "../createBundle";

export type ApsStrings = {
  title: string;
  subtitle: string;
  totalLabel: string;
  bandLabel: string;
  guidanceTitle: string;
  saveResults: string;
  browseQuals: string;
  levelLabel: (level: number, pct: string) => string;
  missingPackage: string;
  saving: string;
  bands: {
    "32": { label: string; short: string; guidance: string };
    "28": { label: string; short: string; guidance: string };
    "24": { label: string; short: string; guidance: string };
    "21": { label: string; short: string; guidance: string };
    "18": { label: string; short: string; guidance: string };
    below18: { label: string; short: string; guidance: string };
  };
};

const en: ApsStrings = {
  title: "APS Calculator",
  subtitle: "Estimate your NSC Admission Point Score from your subject package.",
  totalLabel: "Estimated APS",
  bandLabel: "Guidance band",
  guidanceTitle: "What this score suggests",
  saveResults: "Save APS to vault",
  browseQuals: "Browse matching qualifications",
  missingPackage: "Complete your subject package first (3 electives).",
  saving: "Saving…",
  levelLabel: (level, pct) => `Level ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Foundational",
      short: "APS 18+",
      guidance: "Suitable for many TVET NC(V) and foundational pathways. Consider upgrading key subjects if you aim for degree study."
    },
    "21": {
      label: "APS 21+ · Higher Certificate",
      short: "APS 21+",
      guidance: "Opens Higher Certificate routes and some diploma access programmes."
    },
    "24": {
      label: "APS 24+ · Diploma Gateway",
      short: "APS 24+",
      guidance: "Aligned with many diploma and some degree pathways (including TVET NATED progression)."
    },
    "28": {
      label: "APS 28+ · Degree Track",
      short: "APS 28+",
      guidance: "Typical bachelor’s-degree gateway at many public universities. Check faculty-specific Maths/Science requirements."
    },
    "32": {
      label: "APS 32+ · High Demand / Science",
      short: "APS 32+",
      guidance: "Strong range for competitive degree programmes in science, engineering, and health. Always confirm faculty subject minima."
    },
    below18: {
      label: "Below APS 18 · Build foundations",
      short: "APS <18",
      guidance: "Focus on improving core subjects (languages, Maths). TVET and bridging options can still open doors."
    }
  }
};

const af: ApsStrings = {
  title: "APS-sakrekenaar",
  subtitle: "Skat jou NSO-toelatingspuntetelling vanaf jou vakpakket.",
  totalLabel: "Geskatte APS",
  bandLabel: "Leidingsband",
  guidanceTitle: "Wat hierdie telling voorstel",
  saveResults: "Stoor APS in kluis",
  browseQuals: "Blaai deur pasgemaakte kwalifikasies",
  missingPackage: "Voltooi eers jou vakpakket (3 keusevakke).",
  saving: "Stoor…",
  levelLabel: (level, pct) => `Vlak ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Grondslag",
      short: "APS 18+",
      guidance: "Geskik vir baie TVET NC(V) en grondslagpaaie. Oorweeg om sleutelvakke op te gradeer as jy graadstudie beoog."
    },
    "21": {
      label: "APS 21+ · Hoër sertifikaat",
      short: "APS 21+",
      guidance: "Maak Hoër Sertifikaat-roetes en sommige diploma-toegangsprogramme oop."
    },
    "24": {
      label: "APS 24+ · Diploma-hek",
      short: "APS 24+",
      guidance: "Belyn met baie diploma- en sommige graadpaaie (insluitend TVET NATED-vordering)."
    },
    "28": {
      label: "APS 28+ · Graadbaan",
      short: "APS 28+",
      guidance: "Tipiese baccalaureus-toegang by baie openbare universiteite. Kontroleer fakulteitspesifieke Wiskunde/Wetenskap-vereistes."
    },
    "32": {
      label: "APS 32+ · Hoë aanvraag / Wetenskap",
      short: "APS 32+",
      guidance: "Sterk reeks vir mededingende graadprogramme in wetenskap, ingenieurswese en gesondheid. Bevestig altyd fakulteitsvakminima."
    },
    below18: {
      label: "Onder APS 18 · Bou fondamente",
      short: "APS <18",
      guidance: "Fokus op die verbetering van kernvakke (tale, Wiskunde). TVET- en oorbruggingsopsies kan steeds deure oopmaak."
    }
  }
};

const zu: ApsStrings = {
  title: "Isibali se-APS",
  subtitle: "Linganisa amaphuzu akho okwamukelwa e-NSC kusuka kuphakheji yakho yezifundo.",
  totalLabel: "I-APS Elinganisiwe",
  bandLabel: "Ibhande lesiqondiso",
  guidanceTitle: "Lokho leli phuzu lisikisayo",
  saveResults: "Londoloza i-APS ku-vault",
  browseQuals: "Phequlula iziqu ezifanayo",
  missingPackage: "Qeda kuqala iphakheji yakho yezifundo (izifundo ezingu-3).",
  saving: "Iyalondoloza…",
  levelLabel: (level, pct) => `Ileveli ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Isisekelo",
      short: "APS 18+",
      guidance: "Kulungele izindlela eziningi ze-TVET NC(V) nezesisekelo. Cabanga ukuthuthukisa izifundo ezibalulekile uma uhlose iziqu."
    },
    "21": {
      label: "APS 21+ · Isitifiketi Esiphakeme",
      short: "APS 21+",
      guidance: "Ivula izindlela zesitifiketi esiphakeme nezinye izinhlelo zokufinyelela idiploma."
    },
    "24": {
      label: "APS 24+ · Isango Lediploma",
      short: "APS 24+",
      guidance: "Kuhambisana namadiploma amaningi nezinye izindlela zeziqu (kuhlanganise i-TVET NATED)."
    },
    "28": {
      label: "APS 28+ · Indlela Yeziqu",
      short: "APS 28+",
      guidance: "Isango elivamile leziqu ze-bachelor kumanyuvesi amaningi asehulumeni. Hlola izidingo zezibalo/zesayensi zefakhalthi."
    },
    "32": {
      label: "APS 32+ · Ukudingeka Okukhulu / iSayensi",
      short: "APS 32+",
      guidance: "Ibanga eliqinile lezinhlelo zeziqu ezincintisanayo kusayensi, ubunjiniyela, nempilo. Qinisekisa njalo imingcele yezifundo zefakhalthi."
    },
    below18: {
      label: "Ngaphansi kwe-APS 18 · Yakha izisekelo",
      short: "APS <18",
      guidance: "Gxila ekuthuthukiseni izifundo eziyinhloko (izilimi, Izibalo). I-TVET nezinketho zokubhuloja zisavula iminyango."
    }
  }
};

const xh: ApsStrings = {
  title: "Isibali se-APS",
  subtitle: "Linganisa amanqaku akho okwamkelwa e-NSC ukusuka kwiphakheji yakho yezifundo.",
  totalLabel: "I-APS Eqikelelweyo",
  bandLabel: "Ibhande lesikhokelo",
  guidanceTitle: "Oku kukucebisa kweli nqaku",
  saveResults: "Gcina i-APS kwi-vault",
  browseQuals: "Khangela iziqinisekiso ezifanayo",
  missingPackage: "Gqiba kuqala iphakheji yakho yezifundo (izifundo ezintathu).",
  saving: "Iyagcina…",
  levelLabel: (level, pct) => `Ileveli ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Isiseko",
      short: "APS 18+",
      guidance: "Ilungele iindlela ezininzi ze-TVET NC(V) nezesiseko. Cinga ukuphucula izifundo ezibalulekileyo ukuba ujonga izidanga."
    },
    "21": {
      label: "APS 21+ · Isatifikethi Esiphezulu",
      short: "APS 21+",
      guidance: "Ivula iindlela zesatifikethi esiphezulu nezinye iinkqubo zokufikelela idiploma."
    },
    "24": {
      label: "APS 24+ · Isango Lediploma",
      short: "APS 24+",
      guidance: "Ihambelana neediploma ezininzi nezinye iindlela zezidanga (kuquka i-TVET NATED)."
    },
    "28": {
      label: "APS 28+ · Indlela Yezidanga",
      short: "APS 28+",
      guidance: "Isango eliqhelekileyo lezidanga ze-bachelor kwiidyunivesithi ezininzi zikarhulumente. Jonga iimfuno zezibalo/zesayensi zefakhalthi."
    },
    "32": {
      label: "APS 32+ · Ukufuneka Okuphezulu / iSayensi",
      short: "APS 32+",
      guidance: "Uluhlu olomeleleyo lweenkqubo zezidanga ezikhuphisanayo kwinzululwazi, ubunjineli, nempilo. Qinisekisa rhoqo imida yezifundo zefakhalthi."
    },
    below18: {
      label: "Ngaphantsi kwe-APS 18 · Yakha iziseko",
      short: "APS <18",
      guidance: "Gxila ekuphuculeni izifundo ezingundoqo (iilwimi, Izibalo). I-TVET neenketho zokubhuloja zisavula iingcango."
    }
  }
};

const nso: ApsStrings = {
  title: "Sekhalokhalatha sa APS",
  subtitle: "Lekanisa dintlha tša gago tša go amogelwa tša NSC go tšwa go sephuthelwana sa gago sa dithuto.",
  totalLabel: "APS ye e Lekanšitšwego",
  bandLabel: "Paka ya keletšo",
  guidanceTitle: "Seo dintlha tše di šišinyago",
  saveResults: "Boloka APS vault-eng",
  browseQuals: "Hlahloba dikwalifikaseo tše di swanago",
  missingPackage: "Feditša pele sephuthelwana sa gago sa dithuto (dithuto tše 3).",
  saving: "E a boloka…",
  levelLabel: (level, pct) => `Maemo ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Motheo",
      short: "APS 18+",
      guidance: "E loketše ditsela tše dintši tša TVET NC(V) le tša motheo. Nagana go kaonafatša dithuto tša bohlokwa ge o ikaeletša ditikerii."
    },
    "21": {
      label: "APS 21+ · Setifikeiti se Se Phagamego",
      short: "APS 21+",
      guidance: "E bula ditsela tša setifikeiti se se phagamego le mananeo a mangwe a go fihlelela diploma."
    },
    "24": {
      label: "APS 24+ · Kgoro ya Diploma",
      short: "APS 24+",
      guidance: "E nyalelana le diploma tše dintši le ditsela tše dingwe tša ditikerii (go akaretša TVET NATED)."
    },
    "28": {
      label: "APS 28+ · Tsela ya Ditikerii",
      short: "APS 28+",
      guidance: "Kgoro ye e tlwaelegilego ya ditikerii tša bachelor diyunibesithing tše dintši tša setšhaba. Lekola dinyakwa tša dipalo/saense tša fakhalithi."
    },
    "32": {
      label: "APS 32+ · Tlhotlo ye Phagamego / Saense",
      short: "APS 32+",
      guidance: "Tekanyo ye maatla ya mananeo a ditikerii a tlholišano ka saense, boenjinere, le maphelo. Netefatša ka mehla meedi ya dithuto tša fakhalithi."
    },
    below18: {
      label: "Ka fase ga APS 18 · Aga metheo",
      short: "APS <18",
      guidance: "Negiša go kaonafatša dithuto tša motheo (dipolelo, Dipalo). TVET le dikgetho tša go kgokaganya di sa kgona go bula menyako."
    }
  }
};

const ve: ApsStrings = {
  title: "Tshivhaleli tsha APS",
  subtitle: "Linganani phointhi dzanu dza u ṱanganedzwa dza NSC u bva kha tshiphuthelwana tshanu tsha zwiguda.",
  totalLabel: "APS yo Linganwaho",
  bandLabel: "Banda ya ndaedzo",
  guidanceTitle: "Zwe phointhi idzi dza eletshedza",
  saveResults: "Vhulungani APS kha vault",
  browseQuals: "Ṱolani zwiga zwo fanelaho",
  missingPackage: "Fhedzisani u thoma tshiphuthelwana tshanu tsha zwiguda (zwiguda zwa 3).",
  saving: "I khou vhulunga…",
  levelLabel: (level, pct) => `Maimo ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Mutheo",
      short: "APS 18+",
      guidance: "Yo tea kha ndila nnzhi dza TVET NC(V) na dza mutheo. Humbulani u khwinisa zwiguda zwa ndeme arali ni tshi sedza digirii."
    },
    "21": {
      label: "APS 21+ · Sitifikhethi tsho Phakamaho",
      short: "APS 21+",
      guidance: "I vula ndila dza sitifikhethi tsho phakamaho na mbekanyamushumo dziṅwe dza u swikelela diploma."
    },
    "24": {
      label: "APS 24+ · Vhogoho ha Diploma",
      short: "APS 24+",
      guidance: "Yo tendelana na diploma nnzhi na ndila dziṅwe dza digirii (hu katela TVET NATED)."
    },
    "28": {
      label: "APS 28+ · Ndila ya Digirii",
      short: "APS 28+",
      guidance: "Vhogoho ho ḓoweleaho ha digirii dza bachelor kha yunivesithi nnzhi dza muvhuso. Sedzani zwi ṱoḓeaho zwa nomboro/sayensi zwa fakhalithi."
    },
    "32": {
      label: "APS 32+ · U Ṱoḓea ho Phakamaho / Sayensi",
      short: "APS 32+",
      guidance: "Vhupimo vhuhulwane ha mbekanyamushumo dza digirii dza nndwa kha sayensi, vhunjiniare, na mutakalo. Khwaṱhisedzani tshifhinga tshoṱhe milinganedzo ya zwiguda zwa fakhalithi."
    },
    below18: {
      label: "Fhasi ha APS 18 · Fhatani mitheo",
      short: "APS <18",
      guidance: "Sedzani u khwinisa zwiguda zwa ndeme (nyambo, Nomboro). TVET na khetho dza u ṱumanya zwi kha ḓi nga vula milomo."
    }
  }
};

const ts: ApsStrings = {
  title: "Xihlayi xa APS",
  subtitle: "Pima tiphoyinti ta wena to amukeriwa ta NSC kusuka eka phakheji ya wena ya swidyondzo.",
  totalLabel: "APS leyi Pimiweke",
  bandLabel: "Bhandi ra ndziviso",
  guidanceTitle: "Leswi tiphoyinti ti tiphimiselaka",
  saveResults: "Hlayisa APS eka vault",
  browseQuals: "Lava switifiketi leswi fanaka",
  missingPackage: "Hetisa ku rhanga phakheji ya wena ya swidyondzo (swidyondzo swinharhu).",
  saving: "Yi hlayisa…",
  levelLabel: (level, pct) => `Xiyimo ${level} · ${pct}`,
  bands: {
    "18": {
      label: "APS 18+ · TVET / Xisekelo",
      short: "APS 18+",
      guidance: "Yi fanele eka tindlela to tala ta TVET NC(V) na ta xisekelo. Anakanya ku antswisa swidyondzo swa nkoka loko u languta tidigirii."
    },
    "21": {
      label: "APS 21+ · Xitifiketi xa le Henhla",
      short: "APS 21+",
      guidance: "Yi pfula tindlela ta xitifiketi xa le henhla na tiphurogireme tin'wana to fikelela diploma."
    },
    "24": {
      label: "APS 24+ · Rirhangelo ra Diploma",
      short: "APS 24+",
      guidance: "Yi fambelana na tidiploma to tala na tindlela tin'wana ta tidigirii (ku katsa TVET NATED)."
    },
    "28": {
      label: "APS 28+ · Ndlela ya Tidigirii",
      short: "APS 28+",
      guidance: "Rirhangelo leri tolovelekeke ra tidigirii ta bachelor eka tiyunivesiti to tala ta mfumo. Kambela swilaveko swa tinomboro/sayense swa fakhalithi."
    },
    "32": {
      label: "APS 32+ · Ku Lava loku Tlakukeke / Sayense",
      short: "APS 32+",
      guidance: "Mpimo lowu tiyeke wa tiphurogireme ta tidigirii to phikizana eka sayense, vunjiniare, na rihanyo. Tiyisisa nkarhi na nkarhi milawu ya swidyondzo swa fakhalithi."
    },
    below18: {
      label: "Ehansi ka APS 18 · Aka swisekelo",
      short: "APS <18",
      guidance: "Kongomisa eka ku antswisa swidyondzo swa nkoka (tindzimi, Tinomboro). TVET na swihlawulekisi swo khomisa swi ha swi kota ku pfula minyango."
    }
  }
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getApsStrings(
  locale: string | null | undefined,
): ApsStrings {
  return BUNDLE[resolveLocale(locale)];
}
