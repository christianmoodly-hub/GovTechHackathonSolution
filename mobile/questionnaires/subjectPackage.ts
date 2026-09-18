import type { CareerDomain } from "./domains";

export type GradeStage = "grade9" | "grade10" | "grade11" | "grade12";

export type MathStream = "pure" | "lit";

export type ElectiveId =
  | "phys-sci"
  | "life-sci"
  | "it"
  | "acc"
  | "bus"
  | "geo"
  | "his"
  | "egd";

export const GRADE_STAGES: {
  id: GradeStage;
  label: string;
  detail?: string;
}[] = [
  { id: "grade9", label: "Grade 9", detail: "(Entering Gr 10)" },
  { id: "grade10", label: "Grade 10" },
  { id: "grade11", label: "Grade 11" },
  { id: "grade12", label: "Grade 12" },
];

export type LanguageOption = { id: string; label: string };

export const HOME_LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "english-hl", label: "English Home Language" },
  { id: "isizulu-hl", label: "isiZulu Home Language" },
  { id: "isixhosa-hl", label: "isiXhosa Home Language" },
  { id: "afrikaans-hl", label: "Afrikaans Huistaal" },
  { id: "sepedi-hl", label: "Sepedi Home Language" },
  { id: "sesotho-hl", label: "Sesotho Home Language" },
  { id: "setswana-hl", label: "Setswana Home Language" },
];

export const FAL_LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: "afrikaans-fal", label: "Afrikaans Eerste Addisionele Taal" },
  { id: "isizulu-fal", label: "isiZulu First Additional Language" },
  { id: "english-fal", label: "English First Additional Language" },
  { id: "isixhosa-fal", label: "isiXhosa First Additional Language" },
  { id: "setswana-fal", label: "Setswana First Additional Language" },
];

/** @deprecated Prefer HOME_LANGUAGE_OPTIONS — label list for legacy UI. */
export const HOME_LANGUAGES = HOME_LANGUAGE_OPTIONS.map((o) => o.label);

/** @deprecated Prefer FAL_LANGUAGE_OPTIONS — label list for legacy UI. */
export const FAL_LANGUAGES = FAL_LANGUAGE_OPTIONS.map((o) => o.label);

function normalizeToId(
  value: string,
  options: LanguageOption[],
): string {
  const trimmed = value.trim();
  const byId = options.find((o) => o.id === trimmed);
  if (byId) return byId.id;
  const byLabel = options.find((o) => o.label === trimmed);
  if (byLabel) return byLabel.id;
  const lower = trimmed.toLowerCase();
  const fuzzy = options.find(
    (o) =>
      o.label.toLowerCase() === lower ||
      o.id.toLowerCase() === lower ||
      o.label.toLowerCase().includes(lower),
  );
  return fuzzy?.id ?? options[0].id;
}

export function normalizeHomeLanguageToId(value: string): string {
  return normalizeToId(value, HOME_LANGUAGE_OPTIONS);
}

export function normalizeFalLanguageToId(value: string): string {
  return normalizeToId(value, FAL_LANGUAGE_OPTIONS);
}

export function homeLanguageLabel(idOrLabel: string): string {
  const id = normalizeHomeLanguageToId(idOrLabel);
  return HOME_LANGUAGE_OPTIONS.find((o) => o.id === id)?.label ?? idOrLabel;
}

export function falLanguageLabel(idOrLabel: string): string {
  const id = normalizeFalLanguageToId(idOrLabel);
  return FAL_LANGUAGE_OPTIONS.find((o) => o.id === id)?.label ?? idOrLabel;
}

export type ElectiveDef = {
  id: ElectiveId;
  title: string;
  category: string;
  body: string;
  barColor: string;
  requiresPureMath?: boolean;
  weights: Partial<Record<CareerDomain, number>>;
  previewCareers: string[];
};

export const ELECTIVES: ElectiveDef[] = [
  {
    id: "phys-sci",
    title: "Physical Sciences (Physics & Chemistry)",
    category: "STEM",
    body: "Essential companion for Engineering, Health Sciences, Pure Science research.",
    barColor: "#006A4E",
    requiresPureMath: true,
    weights: { stem: 3, health: 1, trades: 1 },
    previewCareers: ["Mechanical Engineer", "Chemical Engineer", "Physicist"],
  },
  {
    id: "life-sci",
    title: "Life Sciences (Biology)",
    category: "Health / Bio",
    body: "Cellular biology, genetics, ecology, human physiology.",
    barColor: "#15803D",
    weights: { health: 3, stem: 1, agriculture: 1 },
    previewCareers: ["Medical Doctor", "Biochemist", "Nurse"],
  },
  {
    id: "it",
    title: "Information Technology (IT)",
    category: "Tech",
    body: "Software programming (Java/Delphi), database design, systems theory.",
    barColor: "#2B6CB0",
    weights: { digital: 3, stem: 1 },
    previewCareers: ["Data Scientist", "Software Developer", "Systems Analyst"],
  },
  {
    id: "acc",
    title: "Accounting",
    category: "Commerce",
    body: "Financial reporting, audits, managerial accounting, cash budgets.",
    barColor: "#C2611A",
    weights: { business: 3, digital: 1 },
    previewCareers: ["Accountant", "Auditor", "Financial Manager"],
  },
  {
    id: "bus",
    title: "Business Studies",
    category: "Commerce",
    body: "Entrepreneurship, market environments, labor legislation, contracts.",
    barColor: "#C2611A",
    weights: { business: 3, services: 1 },
    previewCareers: ["Entrepreneur", "HR Specialist", "Marketing Manager"],
  },
  {
    id: "geo",
    title: "Geography",
    category: "Social / Earth",
    body: "Climatology, GIS mapping, urban settlement patterns, resource sustainability.",
    barColor: "#7DB6FF",
    weights: { agriculture: 2, stem: 1, services: 1 },
    previewCareers: ["Environmental Scientist", "Urban Planner", "GIS Technician"],
  },
  {
    id: "his",
    title: "History",
    category: "Humanities",
    body: "Critical source analysis, South African heritage, Cold War geopolitics.",
    barColor: "#7DB6FF",
    weights: { law_security: 2, education: 2 },
    previewCareers: ["Legal Practitioner", "Teacher", "Public Relations"],
  },
  {
    id: "egd",
    title: "Engineering Graphics & Design (EGD)",
    category: "Technical",
    body: "Isometric projection, civil & mechanical drafting, CAD basics.",
    barColor: "#C2611A",
    weights: { trades: 2, stem: 2, creative: 1 },
    previewCareers: ["Draughtsperson", "Architect Technician", "Millwright"],
  },
];

export function mathStreamWeights(
  stream: MathStream,
): Partial<Record<CareerDomain, number>> {
  if (stream === "pure") {
    return { stem: 3, digital: 2, health: 1, trades: 1 };
  }
  return { business: 2, law_security: 2, education: 2, services: 2, creative: 1 };
}

export function scoreSubjectPackage(
  math: MathStream,
  electiveIds: ElectiveId[],
): Record<CareerDomain, number> {
  const scores: Record<CareerDomain, number> = {
    stem: 0,
    health: 0,
    business: 0,
    education: 0,
    creative: 0,
    trades: 0,
    agriculture: 0,
    law_security: 0,
    services: 0,
    digital: 0,
  };

  for (const [domain, weight] of Object.entries(mathStreamWeights(math)) as [
    CareerDomain,
    number,
  ][]) {
    scores[domain] += weight;
  }

  for (const id of electiveIds) {
    const elective = ELECTIVES.find((item) => item.id === id);
    if (!elective) continue;
    for (const [domain, weight] of Object.entries(elective.weights) as [
      CareerDomain,
      number,
    ][]) {
      scores[domain] += weight ?? 0;
    }
  }

  return scores;
}

export function estimateUnlockedCount(
  math: MathStream,
  electiveCount: number,
): number {
  const base = math === "pure" ? 220 : 140;
  return base + electiveCount * 30 + (math === "pure" ? 22 : 14);
}

export function previewCareerChips(
  math: MathStream,
  electiveIds: ElectiveId[],
): string[] {
  if (math === "lit" && electiveIds.length === 0) {
    return ["Legal Practitioner", "UX Designer", "HR Specialist", "Public Relations"];
  }
  const chips: string[] = [];
  for (const id of electiveIds) {
    const elective = ELECTIVES.find((item) => item.id === id);
    if (!elective) continue;
    for (const career of elective.previewCareers) {
      if (!chips.includes(career)) chips.push(career);
    }
  }
  if (math === "pure" && chips.length < 4) {
    for (const fallback of [
      "Mechanical Engineer",
      "Data Scientist",
      "Medical Doctor",
      "Biochemist",
    ]) {
      if (!chips.includes(fallback)) chips.push(fallback);
    }
  }
  if (math === "lit" && chips.length < 4) {
    for (const fallback of [
      "Legal Practitioner",
      "UX Designer",
      "HR Specialist",
      "Public Relations",
    ]) {
      if (!chips.includes(fallback)) chips.push(fallback);
    }
  }
  return chips.slice(0, 4);
}
