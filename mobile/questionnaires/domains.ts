export type CareerDomain =
  | "stem"
  | "health"
  | "business"
  | "education"
  | "creative"
  | "trades"
  | "agriculture"
  | "law_security"
  | "services"
  | "digital";

export type QuestionOption = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  /** Optional local image for rich Stitch-style option cards. */
  image?: number;
  /** Domain weights added when this option is selected. */
  weights: Partial<Record<CareerDomain, number>>;
};

export type Question = {
  id: string;
  prompt: string;
  helpText?: string;
  options: QuestionOption[];
};

export type QuestionnaireDefinition = {
  id: "subjectChooser" | "careerChoice" | "jobFit";
  title: string;
  subtitle: string;
  questions: Question[];
};

/** Keywords used to score occupations against domain weights. */
export const DOMAIN_KEYWORDS: Record<CareerDomain, string[]> = {
  stem: [
    "engineer",
    "engineering",
    "scientist",
    "science",
    "mathematic",
    "physic",
    "chemist",
    "biolog",
    "technologist",
    "technician",
    "laboratory",
    "research",
    "statistic",
    "actuary",
    "architect",
  ],
  health: [
    "nurse",
    "doctor",
    "medical",
    "health",
    "clinic",
    "therapist",
    "pharmacist",
    "dentist",
    "paramedic",
    "counsellor",
    "counselor",
    "psycholog",
    "veterinary",
    "midwife",
  ],
  business: [
    "accountant",
    "account",
    "manager",
    "management",
    "finance",
    "financial",
    "econom",
    "market",
    "sales",
    "business",
    "admin",
    "human resource",
    "hr ",
    "bank",
    "audit",
    "supply chain",
  ],
  education: [
    "teacher",
    "teaching",
    "lecturer",
    "educator",
    "tutor",
    "trainer",
    "training",
    "school",
    "education",
    "curriculum",
    "early childhood",
  ],
  creative: [
    "design",
    "designer",
    "artist",
    "actor",
    "music",
    "film",
    "media",
    "writer",
    "journalis",
    "photographer",
    "fashion",
    "creative",
    "animator",
    "graphic",
  ],
  trades: [
    "electrician",
    "plumber",
    "welder",
    "carpenter",
    "mechanic",
    "fitter",
    "boiler",
    "millwright",
    "artisan",
    "trade",
    "construction",
    "builder",
    "installer",
    "operator",
  ],
  agriculture: [
    "agricultur",
    "farm",
    "farmer",
    "livestock",
    "crop",
    "horticultur",
    "forestry",
    "fisher",
    "veterinary",
    "soil",
    "irrigation",
    "abattoir",
    "food processing",
  ],
  law_security: [
    "lawyer",
    "legal",
    "attorney",
    "police",
    "security",
    "soldier",
    "military",
    "compliance",
    "judge",
    "prosecutor",
    "correctional",
    "forensic",
  ],
  services: [
    "hospitality",
    "chef",
    "cook",
    "tourism",
    "hotel",
    "retail",
    "customer",
    "service",
    "beauty",
    "hairdress",
    "logistics",
    "driver",
    "clerk",
  ],
  digital: [
    "software",
    "developer",
    "programmer",
    "computer",
    "it ",
    "ict",
    "data",
    "network",
    "cyber",
    "web",
    "systems analyst",
    "database",
    "information system",
  ],
};
