import { expandSaLocales, resolveLocale } from "../createBundle";

export type JobFitStrings = {
  title: string;
  subtitle: string;
  envPrompt: string;
  envHelp: string;
  physicalPrompt: string;
  physicalHelp: string;
  environments: Record<
    "outdoors" | "workshop" | "office" | "community",
    { label: string; subtitle: string; description: string; imageOverlay: string }
  >;
  demand: Record<"low" | "moderate" | "high", { label: string; detail: string }>;
  followUps: {
    interaction: {
      prompt: string;
      helpText: string;
      options: Record<
        "high_people" | "mixed" | "low_people",
        { label: string; description: string }
      >;
    };
    structure: {
      prompt: string;
      options: Record<
        "rules" | "creative_freedom" | "targets" | "craft_quality",
        { label: string }
      >;
    };
    schedule: {
      prompt: string;
      options: Record<
        "office_hours" | "shifts" | "project_bursts" | "seasonal",
        { label: string }
      >;
    };
  };
};

const en: JobFitStrings = {
  title: "Job Fit Diagnostic",
  subtitle: "Module focused on work environment and task aptitude. Answers save to your profile and match real NCAP occupations.",
  envPrompt: "Which type of work environment would you be most comfortable working in every day?",
  envHelp: "Select the setting that best reflects where your energy and natural attention thrive.",
  physicalPrompt: "How much daily physical exertion feels comfortable for you?",
  physicalHelp: "Accommodations for varying mobility are factored into TVET & university matching.",
  environments: {
    outdoors: {
      label: "Active Outdoors / On-Site",
      subtitle: "Field & Outdoor Ready",
      description: "Construction projects, agricultural research, land surveys, solar and renewable energy installations. Involves movement, fresh air, and seasonal changes.",
      imageOverlay: "Practical • High Mobility"
    },
    workshop: {
      label: "Workshop / Industrial Plant",
      subtitle: "Artisan & Technical Trades",
      description: "Machinery operation, metal fabrication, electrical diagnostics, TVET testing bays, and automotive maintenance. Hands-on tools and calibrated gear.",
      imageOverlay: "Structured Workshop • Equipment Driven"
    },
    office: {
      label: "Structured Office / Tech Desk",
      subtitle: "Corporate & Digital Tech",
      description: "Computer data processing, administrative records, software coding, and public accounting. Predictable schedules, ergonomic seating, and digital collaboration.",
      imageOverlay: "Digital Systems • Desk Focus"
    },
    community: {
      label: "Community & Healthcare",
      subtitle: "Care & Public Service",
      description: "Public health clinics, learning centres, community advisory desks, and municipal public service. Centred on direct human engagement and empathy.",
      imageOverlay: "Human Centred • High Empathy"
    }
  },
  demand: {
    low: {
      label: "Low",
      detail: "Predominantly Seated"
    },
    moderate: {
      label: "Moderate",
      detail: "Light Walking • Standing"
    },
    high: {
      label: "High / Heavy",
      detail: "Lifting • Strenuous"
    }
  },
  followUps: {
    interaction: {
      prompt: "How much people-time do you want in a typical work week?",
      helpText: "Choose the balance of client, team, and independent work that feels sustainable.",
      options: {
        high_people: {
          label: "Mostly with clients, patients, learners, or teams",
          description: "High engagement, coaching, and service contact."
        },
        mixed: {
          label: "A mix of solo work and collaboration",
          description: "Alternate between deep focus and team delivery."
        },
        low_people: {
          label: "Mostly independent / technical work",
          description: "Systems, tools, and craft over constant meetings."
        }
      }
    },
    structure: {
      prompt: "Which work structure fits you best?",
      options: {
        rules: {
          label: "Clear rules, standards, and accountability"
        },
        creative_freedom: {
          label: "Room to invent and interpret"
        },
        targets: {
          label: "Targets, metrics, and delivery deadlines"
        },
        craft_quality: {
          label: "Craft quality and practical excellence"
        }
      }
    },
    schedule: {
      prompt: "What schedule preference do you have?",
      options: {
        office_hours: {
          label: "Mostly regular daytime hours"
        },
        shifts: {
          label: "Shifts / after-hours is acceptable"
        },
        project_bursts: {
          label: "Project bursts with quieter gaps"
        },
        seasonal: {
          label: "Seasonal or location-based work"
        }
      }
    }
  }
};

const af: JobFitStrings = {
  title: "Werkspassing-diagnostiek",
  subtitle: "Module gerig op werksomgewing en taakaanleg. Antwoorde stoor na jou profiel en pas by werklike NCAP-beroeppe.",
  envPrompt: "In watter tipe werksomgewing sou jy die gemaklikste wees om elke dag te werk?",
  envHelp: "Kies die omgewing wat die beste weerspieël waar jou energie en natuurlike aandag floreer.",
  physicalPrompt: "Hoeveel daaglikse fisiese inspanning voel gemaklik vir jou?",
  physicalHelp: "Aanpassings vir wisselende mobiliteit word in TVET- & universiteitspassing verreken.",
  environments: {
    outdoors: {
      label: "Aktiewe buitelug / Ter plaatse",
      subtitle: "Veld & Buitelug-gereed",
      description: "Konstruksieprojekte, landbounavorsing, landopmetings, son- en hernubare energie-installasies. Behels beweging, vars lug en seisoenale veranderinge.",
      imageOverlay: "Prakties • Hoë mobiliteit"
    },
    workshop: {
      label: "Werkswinkel / Industriële aanleg",
      subtitle: "Ambag- & Tegniese ambagte",
      description: "Masjineriebedryf, metaalvervaardiging, elektriese diagnostiek, TVET-toetsbaye en motoronderhoud. Hands-on gereedskap en gekalibreerde toerusting.",
      imageOverlay: "Gestruktureerde werkswinkel • Toerustinggedrewe"
    },
    office: {
      label: "Gestruktureerde kantoor / Tegniese lessenaar",
      subtitle: "Korporatief & Digitale tegnologie",
      description: "Rekenaardataverwerking, administratiewe rekords, sagtewarekodering en openbare rekeningkunde. Voorspelbare skedules, ergonomiese sitplekke en digitale samewerking.",
      imageOverlay: "Digitale stelsels • Lessenaar-fokus"
    },
    community: {
      label: "Gemeenskap & Gesondheidsorg",
      subtitle: "Sorg & Openbare diens",
      description: "Openbare gesondheidsklinieke, leersentrums, gemeenskapsadviesdeske en munisipale openbare diens. Gesentreer op direkte menslike betrokkenheid en empatie.",
      imageOverlay: "Mensgesentreerd • Hoë empatie"
    }
  },
  demand: {
    low: {
      label: "Laag",
      detail: "Hoofsaaklik sittend"
    },
    moderate: {
      label: "Matig",
      detail: "Ligte stap • Staan"
    },
    high: {
      label: "Hoog / Swaar",
      detail: "Optel • Strawwe"
    }
  },
  followUps: {
    interaction: {
      prompt: "Hoeveel menstyd wil jy in 'n tipiese werkweek hê?",
      helpText: "Kies die balans van kliënt-, span- en onafhanklike werk wat volhoubaar voel.",
      options: {
        high_people: {
          label: "Meestal met kliënte, pasiënte, leerders of spanne",
          description: "Hoë betrokkenheid, afrigting en dienskontak."
        },
        mixed: {
          label: "'n Mengsel van solo-werk en samewerking",
          description: "Wissel tussen diep fokus en spanspanning."
        },
        low_people: {
          label: "Meestal onafhanklike / tegniese werk",
          description: "Stelsels, gereedskap en vakmanskap bo konstante vergaderings."
        }
      }
    },
    structure: {
      prompt: "Watter werkstruktuur pas jou die beste?",
      options: {
        rules: {
          label: "Duidelike reëls, standaarde en aanspreeklikheid"
        },
        creative_freedom: {
          label: "Ruimte om te skep en interpreteer"
        },
        targets: {
          label: "Teikens, maatstawwe en afleweringsdatums"
        },
        craft_quality: {
          label: "Vakmanskapgehalte en praktiese uitnemendheid"
        }
      }
    },
    schedule: {
      prompt: "Watter skedulevoorkeur het jy?",
      options: {
        office_hours: {
          label: "Meestal gereelde dagure"
        },
        shifts: {
          label: "Skofte / na-ure is aanvaarbaar"
        },
        project_bursts: {
          label: "Projekuitbarstings met stiller gapings"
        },
        seasonal: {
          label: "Seisoenale of ligging-gebaseerde werk"
        }
      }
    }
  }
};

const zu: JobFitStrings = {
  title: "Ukuhlola Ukufaneleka Komsebenzi",
  subtitle: "Imodyuli egxile endaweni yokusebenza namakhono omsebenzi. Izimpendulo zilondolozwa kuphrofayela yakho futhi zifaniswa nemisebenzi yangempela ye-NCAP.",
  envPrompt: "Iyiphi indawo yokusebenza ongakhululeka kuyo nsuku zonke?",
  envHelp: "Khetha indawo ebonisa kangcono lapho amandla akho nokunaka kwakho kukhula khona.",
  physicalPrompt: "Ungakujabulela kangakanani ukusebenzisa umzimba nsuku zonke?",
  physicalHelp: "Ukulungiswa kokuhamba okuhlukile kubalwa ekufanisweni kwe-TVET nenyuvesi.",
  environments: {
    outdoors: {
      label: "Ngaphandle / Endaweni Yomsebenzi",
      subtitle: "Kulungele Insimu & Ngaphandle",
      description: "Amaphrojekthi okwakha, ucwaningo lwezolimo, ukuhlola umhlaba, nokufakwa kwamandla elanga. Kubandakanya ukunyakaza, umoya omuhle, nezinguquko zesizini.",
      imageOverlay: "Okusebenzayo • Ukuhamba Okukhulu"
    },
    workshop: {
      label: "Indawo Yokusebenza / Isakhiwo Sezimboni",
      subtitle: "Imisebenzi Yobuchwepheshe",
      description: "Ukusebenza kwemishini, ukwenza izinsimbi, ukuhlola ugesi, izindawo zokuhlola ze-TVET, nokulungiswa kwezimoto.",
      imageOverlay: "Indawo Ehleliwe • Kugxilwe Emishinini"
    },
    office: {
      label: "Ihhovisi / Ideski Lobuchwepheshe",
      subtitle: "Ezinkampani & Ubuchwepheshe Bedijithali",
      description: "Ukucubungula idatha, amarekhodi ezokuphatha, ukubhala ikhodi, nokubala. Izinhlelo ezilindelwe, izihlalo ezilungele umzimba, nokusebenzisana kwedijithali.",
      imageOverlay: "Izinhlelo Zedijithali • Kugxilwe Edeskini"
    },
    community: {
      label: "Umphakathi & Ezempilo",
      subtitle: "Ukunakekela & Inkonzo Yomphakathi",
      description: "Imitholampilo, izikhungo zokufunda, amadeski eluleko, nenkonzo kamasipala. Kugxile ekuxhumaneni nabantu nangokuzwelana.",
      imageOverlay: "Abantu Phakathi • Ukuzwelana Okukhulu"
    }
  },
  demand: {
    low: {
      label: "Phansi",
      detail: "Kakhulu Uhlezi"
    },
    moderate: {
      label: "Phakathi",
      detail: "Ukuhamba Okulula • Ukuma"
    },
    high: {
      label: "Phezulu / Kukhulu",
      detail: "Ukuphakamisa • Okunzima"
    }
  },
  followUps: {
    interaction: {
      prompt: "Ufuna isikhathi esingakanani nabantu ngesonto lomsebenzi?",
      helpText: "Khetha ibhalansi yomsebenzi wamakhasimende, weqembu, nowodwa ozinzile.",
      options: {
        high_people: {
          label: "Kakhulu namakhasimende, iziguli, abafundi, noma amaqembu",
          description: "Ukuzibandakanya okukhulu, ukuqeqesha, nokuxhumana nesevisi."
        },
        mixed: {
          label: "Inhlanganisela yomsebenzi wodwa nokusebenzisana",
          description: "Shintsha phakathi kokugxila kakhulu nokulethwa kweqembu."
        },
        low_people: {
          label: "Kakhulu umsebenzi ozimele / wobuchwepheshe",
          description: "Izinhlelo, amathuluzi, nobuciko kunemihlangano engapheli."
        }
      }
    },
    structure: {
      prompt: "Iyiphi isakhiwo somsebenzi esikufanele kakhulu?",
      options: {
        rules: {
          label: "Imithetho ecacile, amazinga, nokuziphendulela"
        },
        creative_freedom: {
          label: "Indawo yokusungula nokuhumusha"
        },
        targets: {
          label: "Izinhloso, izilinganiso, nemiqulu yokulethwa"
        },
        craft_quality: {
          label: "Ikhwalithi yobuciko nokuhlela okusebenzayo"
        }
      }
    },
    schedule: {
      prompt: "Yikuphi ukhetho lwesheduli onalo?",
      options: {
        office_hours: {
          label: "Kakhulu amahora asemini ajwayelekile"
        },
        shifts: {
          label: "Amashifu / ngemva kwamahora kuyamukeleka"
        },
        project_bursts: {
          label: "Ukugqama kwamaphrojekthi ngezikhathi ezithule"
        },
        seasonal: {
          label: "Umsebenzi wesizini noma oususelwe endaweni"
        }
      }
    }
  }
};

const xh: JobFitStrings = {
  title: "Uvavanyo Lokufanela Umsebenzi",
  subtitle: "Imodyuli egxile kwindawo yokusebenza nezakhono zomsebenzi. Iimpendulo zigcinwa kwiprofayile yakho kwaye zifaniswa nemisebenzi yangempela ye-NCAP.",
  envPrompt: "Yeyiphi indawo yokusebenza ongakhululeka kuyo yonke imihla?",
  envHelp: "Khetha indawo ebonisa ngcono apho amandla akho nokuqaphela kwakho kukhula khona.",
  physicalPrompt: "Ungakonwabela kangakanani ukusebenzisa umzimba yonke imihla?",
  physicalHelp: "Ukulungiswa kokuhamba okuhlukile kubalwa ekufanisweni kwe-TVET nenyuvesi.",
  environments: {
    outdoors: {
      label: "Ngaphandle / Endaweni Yomsebenzi",
      subtitle: "Kulungele Insimu & Ngaphandle",
      description: "Amaphrojekthi okwakha, ucwaningo lwezolimo, ukuhlola umhlaba, nokufakwa kwamandla elanga. Kubandakanya ukunyakaza, umoya omuhle, nezinguquko zesizini.",
      imageOverlay: "Okusebenzayo • Ukuhamba Okukhulu"
    },
    workshop: {
      label: "Indawo Yokusebenza / Isakhiwo Sezimboni",
      subtitle: "Imisebenzi Yobuchwepheshe",
      description: "Ukusebenza kwemishini, ukwenza izinsimbi, ukuhlola ugesi, izindawo zokuhlola ze-TVET, nokulungiswa kwezimoto.",
      imageOverlay: "Indawo Ehleliwe • Kugxilwe Emishinini"
    },
    office: {
      label: "Ihhovisi / Ideski Lobuchwepheshe",
      subtitle: "Ezinkampani & Ubuchwepheshe Bedijithali",
      description: "Ukucubungula idatha, amarekhodi ezokuphatha, ukubhala ikhodi, nokubala. Izinhlelo ezilindelwe, izihlalo ezilungele umzimba, nokusebenzisana kwedijithali.",
      imageOverlay: "Izinhlelo Zedijithali • Kugxilwe Edeskini"
    },
    community: {
      label: "Umphakathi & Ezempilo",
      subtitle: "Ukunakekela & Inkonzo Yomphakathi",
      description: "Imitholampilo, izikhungo zokufunda, amadeski eluleko, nenkonzo kamasipala. Kugxile ekuxhumaneni nabantu nangokuzwelana.",
      imageOverlay: "Abantu Phakathi • Ukuzwelana Okukhulu"
    }
  },
  demand: {
    low: {
      label: "Phantsi",
      detail: "Ubukhulu bexesha Uhleli"
    },
    moderate: {
      label: "Phakathi",
      detail: "Ukuhamba Okulula • Ukuma"
    },
    high: {
      label: "Phezulu / Nzima",
      detail: "Ukuphakamisa • Okunzima"
    }
  },
  followUps: {
    interaction: {
      prompt: "Ufuna isikhathi esingakanani nabantu ngesonto lomsebenzi?",
      helpText: "Khetha ibhalansi yomsebenzi wamakhasimende, weqembu, nowodwa ozinzile.",
      options: {
        high_people: {
          label: "Kakhulu namakhasimende, iziguli, abafundi, noma amaqembu",
          description: "Ukuzibandakanya okukhulu, ukuqeqesha, nokuxhumana nesevisi."
        },
        mixed: {
          label: "Inhlanganisela yomsebenzi wodwa nokusebenzisana",
          description: "Shintsha phakathi kokugxila kakhulu nokulethwa kweqembu."
        },
        low_people: {
          label: "Kakhulu umsebenzi ozimele / wobuchwepheshe",
          description: "Izinhlelo, amathuluzi, nobuciko kunemihlangano engapheli."
        }
      }
    },
    structure: {
      prompt: "Iyiphi isakhiwo somsebenzi esikufanele kakhulu?",
      options: {
        rules: {
          label: "Imithetho ecacile, amazinga, nokuziphendulela"
        },
        creative_freedom: {
          label: "Indawo yokusungula nokuhumusha"
        },
        targets: {
          label: "Izinhloso, izilinganiso, nemiqulu yokulethwa"
        },
        craft_quality: {
          label: "Ikhwalithi yobuciko nokuhlela okusebenzayo"
        }
      }
    },
    schedule: {
      prompt: "Yikuphi ukhetho lwesheduli onalo?",
      options: {
        office_hours: {
          label: "Kakhulu amahora asemini ajwayelekile"
        },
        shifts: {
          label: "Amashifu / ngemva kwamahora kuyamukeleka"
        },
        project_bursts: {
          label: "Ukugqama kwamaphrojekthi ngezikhathi ezithule"
        },
        seasonal: {
          label: "Umsebenzi wesizini noma oususelwe endaweni"
        }
      }
    }
  },
};

const nso: JobFitStrings = {
  title: "Teko ya Go Swanela Mošomo",
  subtitle: "Mojulu o negišitšego tikologo ya mošomo le bokgoni bja mešomo. Dikarabo di bolokwa profaeleng ya gago gomme di swanela mešomo ya nnete ya NCAP.",
  envPrompt: "Ke tikologo efe ya mošomo ye o ka ikhomolelago go šoma go yona letšatši le letšatši?",
  envHelp: "Kgetha lefelo leo le bontšhago gabotse moo maatla a gago le šedi ya tlhago di atlegago.",
  physicalPrompt: "O ka ikhomolela kudu go šomiša mmele ka letšatši le letšatši?",
  physicalHelp: "Dipeakanyo tša go sepela tše di fapanego di akaretšwa go swanela TVET le yunibesithi.",
  environments: {
    outdoors: {
      label: "Ka Ntle / Lefelong la Mošomo",
      subtitle: "E loketše Naga & Ka Ntle",
      description: "Diprojeke tša kago, dinyakišišo tša temo, diteko tša naga, le go tsenya maatla a letšatši. Go akaretša go sepela, moya o mokgethwa, le diphetogo tša sehla.",
      imageOverlay: "Ya Tiršo • Go Sepela go Phagamego"
    },
    workshop: {
      label: "Lefelo la Mošomo / Setšene sa Diintasteri",
      subtitle: "Mešomo ya Botsebi",
      description: "Go šomiša mešini, go dira tšhipi, go hlahloba mohlagase, mafelo a teko a TVET, le go hlokomela dikoloi.",
      imageOverlay: "Lefelo le Hlotšego • Le Negišitšego Didirišwa"
    },
    office: {
      label: "Ofisi / Teske ya Theknolotši",
      subtitle: "Kgwebo & Theknolotši ya Digital",
      description: "Go šoma ka data, direkhoto tša tsamaiso, go ngwala khoutu, le go balela. Dišetulo tše di lebanyago, ditulo tše di loketšego mmele, le tirišano ya digital.",
      imageOverlay: "Ditshepedišo tša Digital • Go Negiša Teske"
    },
    community: {
      label: "Setšhaba & Maphelo",
      subtitle: "Tlhokomelo & Tirelo ya Setšhaba",
      description: "Dikliniki, disenthara tša thuto, dideske tša keletšo, le tirelo ya masepala. E negišitše kgokagano ya batho le kutlwelo-bohloko.",
      imageOverlay: "Batho Pele • Kutlwelo-bohloko ye Phagamego"
    }
  },
  demand: {
    low: {
      label: "Fase",
      detail: "Kudu O Dutše"
    },
    moderate: {
      label: "Magareng",
      detail: "Go Sepela go Bobebe • Go Ema"
    },
    high: {
      label: "Godimo / Boima",
      detail: "Go Tšea • Go Šoma ka Maatla"
    }
  },
  followUps: {
    interaction: {
      prompt: "O nyaka nako e kae le batho bekeng ya mošomo?",
      helpText: "Kgetha tekatekano ya mošomo wa bareki, sehlopha, le wa noši ye e tšwelago pele.",
      options: {
        high_people: {
          label: "Kudu le bareki, balwetši, baithuti, goba dihlopha",
          description: "Go kgatha tema go phagamego, go hlahla, le kgokagano ya tirelo."
        },
        mixed: {
          label: "Motswako wa mošomo wa noši le tirišano",
          description: "Fetoga magareng ga go negiša kudu le go aba ga sehlopha."
        },
        low_people: {
          label: "Kudu mošomo wa go ikema / wa botsebi",
          description: "Ditshepedišo, didirišwa, le bokgoni go feta dikopano tše di sa felego."
        }
      }
    },
    structure: {
      prompt: "Ke sebopego sefe sa mošomo seo se go swanetsago?",
      options: {
        rules: {
          label: "Melao ye e hlakilego, maemo, le maikarabelo"
        },
        creative_freedom: {
          label: "Sebaka sa go hlama le go hlatholla"
        },
        targets: {
          label: "Dipakane, diteanyo, le mehla ya go aba"
        },
        craft_quality: {
          label: "Khwalithi ya bokgoni le bokgoni bja tiršo"
        }
      }
    },
    schedule: {
      prompt: "Ke kgetho efe ya šetulo ye o nago le yona?",
      options: {
        office_hours: {
          label: "Kudu diiri tša mosegare tše di tlwaetšego"
        },
        shifts: {
          label: "Dišifto / ka morago ga diiri di a amogelwa"
        },
        project_bursts: {
          label: "Go tšwelela ga diprojeke ka dikgoba tše di khutšago"
        },
        seasonal: {
          label: "Mošomo wa sehla goba o theilwego godimo ga lefelo"
        }
      }
    }
  }
};

const ve: JobFitStrings = {
  title: "U Sedzulusa u Tea Mushumo",
  subtitle: "Mojulu une wa sedza vhupo ha mushumo na vhukoni ha mishumo. Phindulo dzi vhulungwa kha phrofaule yanu nahone dzi fanela mishumo ya nnete ya NCAP.",
  envPrompt: "Ndi vhupo vhufhio ha mushumo vhune na nga khululekela u shuma khaho ḓuvha ḽiṅwe na ḽiṅwe?",
  envHelp: "Nangani fhethu hune ha sumbedza zwavhudi hune maanḓa anu na u dzhiela nḓa ha mupo zwa alusa.",
  physicalPrompt: "Ni nga khululekela hani u shumisa muvhili ḓuvha ḽiṅwe na ḽiṅwe?",
  physicalHelp: "U lugiswa ha u tshimbila ho fhambanaho hu vhalwa kha u fanela TVET na yunivesithi.",
  environments: {
    outdoors: {
      label: "Nnḓa / Fhethu ha Mushumo",
      subtitle: "Yo Lugiswa Shango & Nnḓa",
      description: "Phurodzhekithi dza u fhata, ṱhoḓisiso ya vhulimi, u linga shango, na u dzhenisa maanḓa a ḓuvha. Hu katela u tshimbila, muya wavhudi, na tshanduko dza zwifhinga.",
      imageOverlay: "Ha u Shuma • U Tshimbila ho Phakamaho"
    },
    workshop: {
      label: "Fhethu ha Mushumo / Phurannda ya Indasitiri",
      subtitle: "Mishumo ya Vhufundi",
      description: "U shumisa mitshini, u ita tshipi, u sedzulusa elekithiriki, fhethu ha u linga ha TVET, na u khwinisa goloi.",
      imageOverlay: "Fhethu ho Lugiswaho • Ho Sedza Zwishumiswa"
    },
    office: {
      label: "Ofisi / Desiki ya Thekinolodzhi",
      subtitle: "Khampani & Thekinolodzhi ya Digital",
      description: "U shuma nga data, rekhodu dza ndaulo, u ṅwala khoudhu, na u vhala. Tshedule dzo ḓivhiwaho, zwiṱulo zwo lugiselwaho muvhili, na u shumisana ha digital.",
      imageOverlay: "Sistimu dza Digital • U Sedza Desiki"
    },
    community: {
      label: "Tshitshavha & Mutakalo",
      subtitle: "Ṱhogomelo & Tshumelo ya Tshitshavha",
      description: "Dziliniki, zwitasha zwa u guda, dzidesiki dza ndaedzo, na tshumelo ya masipala. Yo sedza u kwama vhathu na kutlwelo.",
      imageOverlay: "Vhathu Phanḓa • Kutlwelo ho Phakamaho"
    }
  },
  demand: {
    low: {
      label: "Fhasi",
      detail: "Vhukuma Ni Khou Dzula"
    },
    moderate: {
      label: "Vhukati",
      detail: "U Tshimbila ho Lehu • U Ima"
    },
    high: {
      label: "Nṱha / Vhuleme",
      detail: "U Ḓosa • Ho Shuma nga Maanḓa"
    }
  },
  followUps: {
    interaction: {
      prompt: "Ni ṱoḓa tshifhinga tshingana na vhathu kha vhege ya mushumo?",
      helpText: "Nangani tshiimo tsha mushumo wa vharengi, tshigwada, na wa ṋotshi tshine tsha tshila.",
      options: {
        high_people: {
          label: "Vhukuma na vharengi, vhalwadze, vhagudi, kana zwigwada",
          description: "U dzhenelela ho phakamaho, u ḓivhadza, na vhukwamani ha tshumelo."
        },
        mixed: {
          label: "Tshiimo tsha mushumo wa ṋotshi na u shumisana",
          description: "Shandukani vhukati ha u sedza vhukuma na u ṋea ha tshigwada."
        },
        low_people: {
          label: "Vhukuma mushumo wo ḓiimisaho / wa vhufundi",
          description: "Sistumu, zwishumiswa, na vhutsila u fhira mitangano i songo fhelaho."
        }
      }
    },
    structure: {
      prompt: "Ndi tshivhumbeo tchifhio tsha mushumo tshine tsha ni tea?",
      options: {
        rules: {
          label: "Milayo yo pfalaho, maimo, na vhuḓifhinduleli"
        },
        creative_freedom: {
          label: "Fhethu ha u vhuma na u ṱalutshedza"
        },
        targets: {
          label: "Zwipikwa, zwilinganyo, na maduvha a u ṋea"
        },
        craft_quality: {
          label: "Khwalithi ya vhutsila na vhuvhuya ha u shuma"
        }
      }
    },
    schedule: {
      prompt: "Ndi khetho ifhio ya tshedule ine na vha nayo?",
      options: {
        office_hours: {
          label: "Vhukuma awara dza masiari dzo ḓoweleaho"
        },
        shifts: {
          label: "Dzišifto / nga murahu ha awara zwi a tendelwa"
        },
        project_bursts: {
          label: "U tshimbila ha phurodzhekithi na zwikhala zwo khuthaho"
        },
        seasonal: {
          label: "Mushumo wa zwifhinga kana wo ḓadziswa nga fhethu"
        }
      }
    }
  }
};

const ts: JobFitStrings = {
  title: "Ku Kambela ku Faneleka ka Ntirho",
  subtitle: "Mojulu lowu kongomisaka eka mbangu wa ntirho na vuswikoti bya mintirho. Tinhlamulo ti hlayisiwa eka phurofayile ya wena naswona ti fananisiwa na mintirho ya ntiyiso ya NCAP.",
  envPrompt: "Hi mbangu wihi wa ntirho lowu u nga khululeka ku tirha eka wona siku na siku?",
  envHelp: "Hlawula ndhawu leyi kombisaka kahle laha matimba ya wena na ku vona ka ntumbuluko swi kula kona.",
  physicalPrompt: "U nga khululeka kangakani ku tirhisa mirhi siku na siku?",
  physicalHelp: "Ku lulamisiwa ka ku famba loku hambaneke ku tekeriwa eka ku fananisa TVET na yunivesiti.",
  environments: {
    outdoors: {
      label: "Handle / Eka Ndhawu ya Ntirho",
      subtitle: "Yi Lulamile Nsimu & Handle",
      description: "Tiphurodzhekithi to aka, ndzavisiso wa vurimi, ku kambela misava, na ku nghenisa matimba ya dyambu. Yi katsa ku famba, moya lowunene, na ku cinca ka nkarhi.",
      imageOverlay: "Yo Tirha • Ku Famba loku Tlakukeke"
    },
    workshop: {
      label: "Ndhawu ya Ntirho / Xitichi xa Tiindasitiri",
      subtitle: "Mintirho ya Vutshila",
      description: "Ku tirhisa mitshini, ku endla tinsimbi, ku kambela gezi, tindhawu to kambela ta TVET, na ku lunghisa tikoloyi.",
      imageOverlay: "Ndhawu leyi Lulamisiweke • Yi Kongomisa Switirho"
    },
    office: {
      label: "Ofisi / Desiki ya Thekinoloji",
      subtitle: "Khamphani & Thekinoloji ya Dijithali",
      description: "Ku tirha hi data, tirekhodi ta mafambiselo, ku tsala khoudu, na ku hlayela. Tishedule leti twisisekaka, switulu leswi lulamisiweke mirhi, na ku tirhisana ka dijithali.",
      imageOverlay: "Sistimu ta Dijithali • Ku Kongomisa Desiki"
    },
    community: {
      label: "Vaaki & Rihanyo",
      subtitle: "Ku Hlayisa & Vukorhokeri bya Vaaki",
      description: "Tikiliniki, switichi swo dyondza, tidesiki ta ndziviso, na vukorhokeri bya masipala. Yi kongomisa eka ku khoma vanhu na ku twela vanhu vusiwana.",
      imageOverlay: "Vanhu Ku Rhanga • Ku Twela Vanhu Vusiwana"
    }
  },
  demand: {
    low: {
      label: "Ehansi",
      detail: "Swinene U Tshamile"
    },
    moderate: {
      label: "Exikarhi",
      detail: "Ku Famba ka Olova • Ku Yima"
    },
    high: {
      label: "Ehenhla / Ku Tika",
      detail: "Ku Teka • Ku Tirha hi Matimba"
    }
  },
  followUps: {
    interaction: {
      prompt: "U lava nkarhi wuni na vanhu eka vhiki ya ntirho?",
      helpText: "Hlawula mpimo wa ntirho wa vaxavi, ntlawa, na wa wexe lowu tiyeke.",
      options: {
        high_people: {
          label: "Swinene na vaxavi, vavabyi, vadyondzi, kumbe mintlawa",
          description: "Ku nghenelela loku tlakukeke, ku kongomisa, na vuhlanganisi bya vukorhokeri."
        },
        mixed: {
          label: "Ntlawa wa ntirho wa wexe na ku tirhisana",
          description: "Cinca exikarhi ka ku kongomisa swinene na ku nyika ka ntlawa."
        },
        low_people: {
          label: "Swinene ntirho wo tiyimela / wa vutshila",
          description: "Sistimu, switirho, na vutshila ku tlula minhlangano leyi nga heriki."
        }
      }
    },
    structure: {
      prompt: "Hi xivumbeko xihi xa ntirho lexi u faneleke xona?",
      options: {
        rules: {
          label: "Milawu leyi twisisekaka, swiyimo, na vutihlamuleri"
        },
        creative_freedom: {
          label: "Ndhawu yo endla na ku hlamusela"
        },
        targets: {
          label: "Swikongomelo, swipimo, na masiku yo nyika"
        },
        craft_quality: {
          label: "Khwaliti ya vutshila na ku hetiseka ko tirha"
        }
      }
    },
    schedule: {
      prompt: "Hi nhlawulo wihi wa shedule lowu u na wona?",
      options: {
        office_hours: {
          label: "Swinene tiawara ta nfampela leti tolovelekeke"
        },
        shifts: {
          label: "Tishifto / endzhaku ka tiawara swi amukeleka"
        },
        project_bursts: {
          label: "Ku humesa tiphurodzhekithi na swikhala swo rhula"
        },
        seasonal: {
          label: "Ntirho wa nkarhi kumbe lowu seketeriwaka hi ndhawu"
        }
      }
    }
  }
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getJobFitStrings(
  locale: string | null | undefined,
): JobFitStrings {
  return BUNDLE[resolveLocale(locale)];
}
