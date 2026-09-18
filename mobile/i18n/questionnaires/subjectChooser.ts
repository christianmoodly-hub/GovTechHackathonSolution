import { expandSaLocales, resolveLocale } from "../createBundle";

export type SubjectChooserStrings = {
  title: string;
  subtitle: string;
  screenTitle: string;
  gradeLabel: string;
  homeLanguageLabel: string;
  falLanguageLabel: string;
  mathLabel: string;
  electivesLabel: string;
  electivesHint: string;
  continueAps: string;
  pureMath: string;
  mathLit: string;
  selectThree: string;
  grades: Record<"grade9" | "grade10" | "grade11" | "grade12", { label: string; detail?: string }>;
  homeLanguages: Record<string, string>;
  falLanguages: Record<string, string>;
  electives: Record<
    "phys-sci" | "life-sci" | "it" | "acc" | "bus" | "geo" | "his" | "egd",
    { title: string; category: string; body: string }
  >;
  questions: {
    favourite_subject: {
      prompt: string;
      options: Record<string, string>;
    };
    second_subject: {
      prompt: string;
      options: Record<string, string>;
    };
    study_style: {
      prompt: string;
      options: Record<string, string>;
    };
    further_study: {
      prompt: string;
      options: Record<string, string>;
    };
  };
};

const en: SubjectChooserStrings = {
  title: "Subject Chooser",
  subtitle: "Pick the school subjects and study styles you enjoy. We will match careers that lean on those strengths.",
  screenTitle: "Build your subject package",
  gradeLabel: "Current / entering grade",
  homeLanguageLabel: "Home Language",
  falLanguageLabel: "First Additional Language",
  mathLabel: "Mathematics stream",
  electivesLabel: "Choose 3 electives",
  electivesHint: "Pick three subjects that open the pathways you care about.",
  continueAps: "Continue to APS Calculator",
  pureMath: "Mathematics (Pure)",
  mathLit: "Mathematical Literacy",
  selectThree: "Select exactly 3 electives",
  grades: {
    grade9: {
      label: "Grade 9",
      detail: "(Entering Gr 10)"
    },
    grade10: {
      label: "Grade 10"
    },
    grade11: {
      label: "Grade 11"
    },
    grade12: {
      label: "Grade 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const af: SubjectChooserStrings = {
  title: "Vakkieuse",
  subtitle: "Kies die skoolvakke en studiemetodes wat jy geniet. Ons sal loopbane pas wat op daardie sterkpunte steun.",
  screenTitle: "Bou jou vakpakket",
  gradeLabel: "Huidige / intree-graad",
  homeLanguageLabel: "Huistaal",
  falLanguageLabel: "Eerste Addisionele Taal",
  mathLabel: "Wiskunde-stroom",
  electivesLabel: "Kies 3 keusevakke",
  electivesHint: "Kies drie vakke wat die paaie oopmaak waarvoor jy omgee.",
  continueAps: "Gaan voort na APS-sakrekenaar",
  pureMath: "Wiskunde (Suiwer)",
  mathLit: "Wiskundige Geletterdheid",
  selectThree: "Kies presies 3 keusevakke",
  grades: {
    grade9: {
      label: "Graad 9",
      detail: "(Gaan Gr 10 binne)"
    },
    grade10: {
      label: "Graad 10"
    },
    grade11: {
      label: "Graad 11"
    },
    grade12: {
      label: "Graad 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const zu: SubjectChooserStrings = {
  title: "Ukukhetha Izifundo",
  subtitle: "Khetha izifundo zesikole nezindlela zokufunda ozithandayo. Sizofanisa imisebenzi esekelwe kulawo amandla.",
  screenTitle: "Yakha iphakheji yakho yezifundo",
  gradeLabel: "Ibanga lamanje / lokungena",
  homeLanguageLabel: "Ulimi Lwasekhaya",
  falLanguageLabel: "Ulimi Lokuqala Olwengeziwe",
  mathLabel: "Ukugeleza kwezibalo",
  electivesLabel: "Khetha izifundo ezingu-3",
  electivesHint: "Khetha izifundo ezintathu ezivula izindlela ozikhathalelayo.",
  continueAps: "Qhubekela Kusibali se-APS",
  pureMath: "Izibalo (Ezihlanzekile)",
  mathLit: "Ukufunda Izibalo",
  selectThree: "Khetha izifundo ezingu-3 ngqo",
  grades: {
    grade9: {
      label: "Ibanga 9",
      detail: "(Ungena ku-Gr 10)"
    },
    grade10: {
      label: "Ibanga 10"
    },
    grade11: {
      label: "Ibanga 11"
    },
    grade12: {
      label: "Ibanga 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const xh: SubjectChooserStrings = {
  title: "Ukukhetha Izifundo",
  subtitle: "Khetha izifundo zesikolo neendlela zokufunda ozithandayo. Siza kufanisa imisebenzi esekelwe kulaa mandla.",
  screenTitle: "Yakha iphakheji yakho yezifundo",
  gradeLabel: "Ibanga langoku / lokungena",
  homeLanguageLabel: "Ulwimi Lwasekhaya",
  falLanguageLabel: "Ulwimi Lokuqala Olongezelelweyo",
  mathLabel: "Ukugeleza kwezibalo",
  electivesLabel: "Khetha izifundo ezintathu",
  electivesHint: "Khetha izifundo ezintathu ezivula iindlela ozikhathalelayo.",
  continueAps: "Qhubekela Kwisibali se-APS",
  pureMath: "Izibalo (Ezihlambulukileyo)",
  mathLit: "Ukufunda Izibalo",
  selectThree: "Khetha izifundo ezintathu kanye",
  grades: {
    grade9: {
      label: "Ibanga 9",
      detail: "(Ungena ku-Gr 10)"
    },
    grade10: {
      label: "Ibanga 10"
    },
    grade11: {
      label: "Ibanga 11"
    },
    grade12: {
      label: "Ibanga 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const nso: SubjectChooserStrings = {
  title: "Kgetho ya Dithuto",
  subtitle: "Kgetha dithuto tša sekolo le mekgwa ya go ithuta ye o e ratago. Re tla swanela mešomo ye e thekgago maatla ao.",
  screenTitle: "Aga sephuthelwana sa gago sa dithuto",
  gradeLabel: "Mphato wa bjale / wa go tsena",
  homeLanguageLabel: "Polelo ya Gae",
  falLanguageLabel: "Polelo ya Mathomo ye e Okeditšwego",
  mathLabel: "Noka ya dipalo",
  electivesLabel: "Kgetha dithuto tše 3",
  electivesHint: "Kgetha dithuto tše tharo tše di bulago ditsela tše o di hlokomelago.",
  continueAps: "Tšwela pele go Sekhalokhalatha sa APS",
  pureMath: "Dipalo (Tše di Hlwekilego)",
  mathLit: "Go Bala Dipalo",
  selectThree: "Kgetha dithuto tše 3 fela",
  grades: {
    grade9: {
      label: "Mphato wa 9",
      detail: "(O tsena Gr 10)"
    },
    grade10: {
      label: "Mphato wa 10"
    },
    grade11: {
      label: "Mphato wa 11"
    },
    grade12: {
      label: "Mphato wa 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const ve: SubjectChooserStrings = {
  title: "U Nanga Zwiguda",
  subtitle: "Nangani zwiguda zwa tshikolo na ndila dza u guda dzine na dzi funa. Ri ḓo fanela mishumo ine ya tikedza maanḓa ayo.",
  screenTitle: "Fhatani tshiphuthelwana tshanu tsha zwiguda",
  gradeLabel: "Gireidi ya zwino / ya u dzhena",
  homeLanguageLabel: "Luambo lwa Hayani",
  falLanguageLabel: "Luambo lwa u Thoma lwo Engedzwaho",
  mathLabel: "Mulambo wa nomboro",
  electivesLabel: "Nangani zwiguda zwa 3",
  electivesHint: "Nangani zwiguda zwiraru zwine zwa vula ndila dzine na dzi ṱhogomela.",
  continueAps: "Bvelani phanda kha Tshivhaleli tsha APS",
  pureMath: "Nomboro (Dzo Kwesekaho)",
  mathLit: "U Vhala Nomboro",
  selectThree: "Nangani zwiguda zwa 3 fhedzi",
  grades: {
    grade9: {
      label: "Gireidi ya 9",
      detail: "(Ni khou dzhena Gr 10)"
    },
    grade10: {
      label: "Gireidi ya 10"
    },
    grade11: {
      label: "Gireidi ya 11"
    },
    grade12: {
      label: "Gireidi ya 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};

const ts: SubjectChooserStrings = {
  title: "Ku Hlawula Swidyondzo",
  subtitle: "Hlawula swidyondzo swa xikolo na tindlela to dyondza leti u ti rhandzaka. Hi ta fananisa mintirho leyi seketeraka matimba wolawo.",
  screenTitle: "Aka phakheji ya wena ya swidyondzo",
  gradeLabel: "Gireyi ya sweswi / yo nghena",
  homeLanguageLabel: "Ririmi ra Kaya",
  falLanguageLabel: "Ririmi ro Sungula leri Engeteriweke",
  mathLabel: "Nambu wa tinomboro",
  electivesLabel: "Hlawula swidyondzo swinharhu",
  electivesHint: "Hlawula swidyondzo swinharhu leswi pfulaka tindlela leti u ti khathalelaka.",
  continueAps: "Yisa emahlweni eka Xihlayi xa APS",
  pureMath: "Tinomboro (Leti Hlamarisaka)",
  mathLit: "Ku Hlaya Tinomboro",
  selectThree: "Hlawula swidyondzo swinharhu ntsena",
  grades: {
    grade9: {
      label: "Gireyi ya 9",
      detail: "(U nghena Gr 10)"
    },
    grade10: {
      label: "Gireyi ya 10"
    },
    grade11: {
      label: "Gireyi ya 11"
    },
    grade12: {
      label: "Gireyi ya 12"
    }
  },
  homeLanguages: {
    "english-hl": "English Home Language",
    "isizulu-hl": "isiZulu Home Language",
    "isixhosa-hl": "isiXhosa Home Language",
    "afrikaans-hl": "Afrikaans Huistaal",
    "sepedi-hl": "Sepedi Home Language",
    "sesotho-hl": "Sesotho Home Language",
    "setswana-hl": "Setswana Home Language"
  },
  falLanguages: {
    "afrikaans-fal": "Afrikaans Eerste Addisionele Taal",
    "isizulu-fal": "isiZulu First Additional Language",
    "english-fal": "English First Additional Language",
    "isixhosa-fal": "isiXhosa First Additional Language",
    "setswana-fal": "Setswana First Additional Language"
  },
  electives: {
    "phys-sci": {
      title: "Physical Sciences (Physics & Chemistry)",
      category: "STEM",
      body: "Essential companion for Engineering, Health Sciences, Pure Science research."
    },
    "life-sci": {
      title: "Life Sciences (Biology)",
      category: "Health / Bio",
      body: "Cellular biology, genetics, ecology, human physiology."
    },
    it: {
      title: "Information Technology (IT)",
      category: "Tech",
      body: "Software programming (Java/Delphi), database design, systems theory."
    },
    acc: {
      title: "Accounting",
      category: "Commerce",
      body: "Financial reporting, audits, managerial accounting, cash budgets."
    },
    bus: {
      title: "Business Studies",
      category: "Commerce",
      body: "Entrepreneurship, market environments, labor legislation, contracts."
    },
    geo: {
      title: "Geography",
      category: "Social / Earth",
      body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability."
    },
    his: {
      title: "History",
      category: "Humanities",
      body: "Critical source analysis, South African heritage, Cold War geopolitics."
    },
    egd: {
      title: "Engineering Graphics & Design (EGD)",
      category: "Technical",
      body: "Isometric projection, civil & mechanical drafting, CAD basics."
    }
  },
  questions: {
    favourite_subject: {
      prompt: "Which school subject do you enjoy most?",
      options: {
        maths: "Mathematics / Mathematical Literacy",
        science: "Physical / Life Sciences",
        languages: "Languages / Literature",
        commerce: "Accounting / Business Studies / Economics",
        tech: "CAT / IT / Engineering Graphics & Design",
        arts: "Visual Arts / Dramatic Arts / Music"
      }
    },
    second_subject: {
      prompt: "Which other subject area do you want to keep in your mix?",
      options: {
        life_orientation_people: "Working with people / Life Orientation themes",
        geography_agri: "Geography / Agricultural Sciences",
        history_law: "History / Law-related topics",
        consumer_hospitality: "Consumer Studies / Hospitality",
        more_stem: "More STEM / technical subjects"
      }
    },
    study_style: {
      prompt: "How do you prefer to learn?",
      options: {
        theory: "Reading, theory, and exams",
        labs: "Labs, experiments, and problem sets",
        hands_on: "Hands-on making and fixing",
        projects: "Projects, presentations, and group work"
      }
    },
    further_study: {
      prompt: "What kind of further study feels right after school?",
      options: {
        university: "University degree",
        diploma: "University of Technology / diploma",
        tvet: "TVET college / occupational certificate",
        unsure: "Not sure yet — show a broad mix"
      }
    }
  }
};


const BUNDLE = expandSaLocales({ en, af, zu, xh, nso, ve, ts });

export function getSubjectChooserStrings(
  locale: string | null | undefined,
): SubjectChooserStrings {
  return BUNDLE[resolveLocale(locale)];
}
