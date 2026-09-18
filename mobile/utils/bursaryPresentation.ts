import { colors } from "../theme";
import type { Bursary, BursarySummary } from "../services/types";

/** Canonical field filters for the bursaries directory chip row. */
export const BURSARY_FIELD_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All fields" },
  { id: "general-bursaries-south-africa", label: "General" },
  { id: "engineering-bursaries-south-africa", label: "Engineering" },
  { id: "government-bursaries-south-africa", label: "Government" },
  { id: "science-bursaries-south-africa", label: "Science" },
  { id: "universities", label: "Universities" },
  { id: "mba-postgraduate", label: "MBA / Postgrad" },
  { id: "computer-science-it-bursaries-south-africa", label: "IT" },
  { id: "commerce-bursaries-south-africa", label: "Commerce" },
  { id: "accounting-bursaries-south-africa", label: "Accounting" },
  { id: "medical-bursaries-south-africa", label: "Medical" },
  { id: "law-bursaries-south-africa", label: "Law" },
  { id: "education-bursaries-south-africa", label: "Education" },
  { id: "learnerships", label: "Learnerships" },
];

const FIELD_ACCENTS: Record<string, string> = {
  "engineering-bursaries-south-africa": colors.ochre,
  "science-bursaries-south-africa": colors.secondary,
  "computer-science-it-bursaries-south-africa": colors.secondary,
  "medical-bursaries-south-africa": "#0F766E",
  "education-bursaries-south-africa": colors.primary,
  "government-bursaries-south-africa": colors.primary,
  "accounting-bursaries-south-africa": "#B45309",
  "commerce-bursaries-south-africa": "#B45309",
  "law-bursaries-south-africa": "#6D28D9",
};

export function bursaryFieldLabel(slug: string): string {
  const hit = BURSARY_FIELD_FILTERS.find((f) => f.id === slug);
  if (hit) return hit.label;
  return slug
    .replace(/-bursaries-south-africa$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function bursaryFieldAccent(slug: string): string {
  return FIELD_ACCENTS[slug] ?? colors.ochre;
}

export type ClosingUrgency = {
  label: string;
  tone: "open" | "soon" | "ok" | "closed";
};

export function isExpired(bursary: {
  closingDateIso?: string | null;
  openAllYear?: boolean;
}): boolean {
  if (bursary.openAllYear) return false;
  if (!bursary.closingDateIso) return false;
  return bursary.closingDateIso < new Date().toISOString().slice(0, 10);
}

export function closingUrgency(
  closingDateIso: string | null | undefined,
  openAllYear: boolean,
  closingDate?: string | null,
): ClosingUrgency {
  if (openAllYear) {
    return { label: "Open all year", tone: "open" };
  }
  if (!closingDateIso) {
    return {
      label: closingDate?.trim() || "Closing date TBC",
      tone: "ok",
    };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (closingDateIso < today) {
    return { label: "Closed", tone: "closed" };
  }
  const ms =
    new Date(closingDateIso + "T12:00:00").getTime() -
    new Date(today + "T12:00:00").getTime();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (days <= 7) {
    return {
      label: days <= 0 ? "Closes today" : `Closes in ${days} day${days === 1 ? "" : "s"}`,
      tone: "soon",
    };
  }
  const pretty = new Date(closingDateIso + "T12:00:00").toLocaleDateString(
    "en-ZA",
    { day: "numeric", month: "short", year: "numeric" },
  );
  return { label: `Closes ${pretty}`, tone: "ok" };
}

export function bursaryTags(bursary: Bursary | BursarySummary): string[] {
  const tags: string[] = [bursary.fieldLabel];
  if (bursary.openAllYear) tags.push("Open all year");
  if (bursary.providerName) tags.push(bursary.providerName);
  return tags.slice(0, 3);
}

/**
 * Map an occupation to related bursary field slugs via lightweight keywords.
 * Framed as "related fields", not eligibility matching.
 */
export function occupationBursaryFields(occupation: {
  title: string;
  tasks?: string[];
  alternativeTitles?: string[];
}): string[] {
  const blob = [
    occupation.title,
    ...(occupation.alternativeTitles ?? []),
    ...(occupation.tasks ?? []).slice(0, 6),
  ]
    .join(" ")
    .toLowerCase();

  const hits: string[] = [];
  const rules: [RegExp, string][] = [
    [/engineer|electric|solar|mechanic|millwright|civil|mining/, "engineering-bursaries-south-africa"],
    [/nurse|medical|health|pharmac|clinic|doctor/, "medical-bursaries-south-africa"],
    [/teach|educat|lectur/, "education-bursaries-south-africa"],
    [/account|audit|tax|financ/, "accounting-bursaries-south-africa"],
    [/software|data|network|information tech|\bit\b|computer/, "computer-science-it-bursaries-south-africa"],
    [/law|legal|attorney|advocate/, "law-bursaries-south-africa"],
    [/commerce|business|market|econom/, "commerce-bursaries-south-africa"],
    [/science|chemist|biolog|physic|lab/, "science-bursaries-south-africa"],
    [/construct|architect|quantity survey|built environment/, "construction-and-built-environment-bursaries-south-africa"],
  ];

  for (const [re, slug] of rules) {
    if (re.test(blob) && !hits.includes(slug)) hits.push(slug);
  }

  if (!hits.length) hits.push("general-bursaries-south-africa");
  return hits.slice(0, 2);
}

export function matchesFieldFilter(
  fieldSlug: string,
  filterId: string,
): boolean {
  if (filterId === "all") return true;
  if (fieldSlug === filterId) return true;
  // Treat short/long slug variants as the same filter bucket
  const normalize = (s: string) =>
    s.replace(/-bursaries-south-africa$/, "").replace(/-bursaries$/, "");
  return normalize(fieldSlug) === normalize(filterId);
}
