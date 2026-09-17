export type QualTypeFilterId =
  | "all"
  | "nated"
  | "degree"
  | "hcert"
  | "occupational"
  | "ncv";

export type ApsFilterId = "all" | "18" | "21" | "24" | "28" | "32";

export type QualTag = {
  id: string;
  label: string;
  icon: string;
  tone: "funded" | "field" | "neutral";
};

const TYPE_FILTERS: {
  id: QualTypeFilterId;
  label: string;
  match?: RegExp;
}[] = [
  { id: "all", label: "All" },
  {
    id: "nated",
    label: "National Diploma (NATED)",
    match: /\bn\s*diploma|nated|national n diploma|n4|n5|n6/i,
  },
  {
    id: "degree",
    label: "Bachelor's Degree",
    match: /bachelor|bsc|ba\b|bcom|bed|btech|degree/i,
  },
  {
    id: "hcert",
    label: "Higher Certificate",
    match: /higher certificate/i,
  },
  {
    id: "occupational",
    label: "Occupational Certificate",
    match: /occupational certificate|learnership|trade certificate/i,
  },
  {
    id: "ncv",
    label: "TVET NC(V)",
    match: /\bnc\(v\)|\bncv\b|national certificate \(vocational\)/i,
  },
];

export const APS_OPTIONS: { id: ApsFilterId; label: string; short: string }[] =
  [
    { id: "all", label: "Filter by APS (e.g. Any APS)", short: "Any APS" },
    { id: "18", label: "APS 18+ (TVET / Foundational)", short: "APS 18+" },
    { id: "21", label: "APS 21+ (Higher Certificate)", short: "APS 21+" },
    { id: "24", label: "APS 24+ (Diploma Gateway)", short: "APS 24+" },
    { id: "28", label: "APS 28+ (Degree Track)", short: "APS 28+" },
    { id: "32", label: "APS 32+ (High Demand / Science)", short: "APS 32+" },
  ];

export function qualTypeFilterDefs() {
  return TYPE_FILTERS;
}

export function detectQualType(title: string): QualTypeFilterId {
  for (const def of TYPE_FILTERS) {
    if (def.id === "all" || !def.match) continue;
    if (def.match.test(title)) return def.id;
  }
  return "all";
}

export function matchesQualType(
  title: string,
  filter: QualTypeFilterId,
): boolean {
  if (filter === "all") return true;
  const def = TYPE_FILTERS.find((f) => f.id === filter);
  if (!def?.match) return true;
  return def.match.test(title);
}

function parseNqfLevel(nqfLevel?: string | null): number | null {
  if (!nqfLevel) return null;
  const m = String(nqfLevel).match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

/** Soft APS gate using NQF / qualification type heuristics. */
export function matchesApsFilter(
  title: string,
  nqfLevel: string | null | undefined,
  aps: ApsFilterId,
): boolean {
  if (aps === "all") return true;
  const threshold = Number(aps);
  const nqf = parseNqfLevel(nqfLevel);
  const type = detectQualType(title);

  let typicalAps = 24;
  if (type === "ncv" || type === "occupational") typicalAps = 18;
  else if (type === "hcert") typicalAps = 21;
  else if (type === "nated") typicalAps = 24;
  else if (type === "degree") typicalAps = 28;
  else if (nqf != null) {
    if (nqf <= 4) typicalAps = 18;
    else if (nqf === 5) typicalAps = 21;
    else if (nqf === 6) typicalAps = 24;
    else typicalAps = 28;
  }

  if (/science|engineering|medicine|actuar|math/i.test(title)) {
    typicalAps = Math.max(typicalAps, 28);
  }

  return typicalAps <= threshold + 4;
}

export function qualificationSaqaId(
  id: string,
  qualificationId?: string | null,
): string {
  if (qualificationId && /\d{4,}/.test(qualificationId)) {
    const digits = qualificationId.match(/\d{4,}/)?.[0];
    if (digits) return digits;
  }
  const fromId = id.match(/\d{4,}/)?.[0];
  if (fromId) return fromId;
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return String(10000 + (hash % 90000));
}

export function qualificationNqfLabel(nqfLevel?: string | null): string {
  const n = parseNqfLevel(nqfLevel);
  if (n != null) return `NQF Level ${n}`;
  if (nqfLevel?.trim()) return nqfLevel.trim();
  return "NQF Level —";
}

export function qualificationCreditsHint(
  title: string,
  nqfLevel?: string | null,
): string {
  const type = detectQualType(title);
  const nqf = parseNqfLevel(nqfLevel);
  if (type === "ncv") return "130 Credits";
  if (type === "hcert") return "120 Credits";
  if (type === "occupational") return "120–180 Credits";
  if (type === "nated") return "360 Credits";
  if (type === "degree") return nqf && nqf >= 8 ? "180–360 Credits" : "360–480 Credits";
  if (nqf === 5) return "120 Credits";
  if (nqf === 6) return "240–360 Credits";
  if (nqf != null && nqf >= 7) return "360 Credits";
  return "Credits vary";
}

export function qualificationDurationHint(
  title: string,
  duration?: string | null,
): string {
  if (duration?.trim()) return duration.trim();
  const type = detectQualType(title);
  if (type === "nated") return "3 Years (Theory + In-Service)";
  if (type === "degree") return "3–4 Years Full-time";
  if (type === "hcert") return "1 Year Full-time";
  if (type === "occupational") return "12–24 Months";
  if (type === "ncv") return "3 Years (NC(V) Levels 2–4)";
  return "Duration varies by provider";
}

export function qualificationEntryHint(
  title: string,
  nqfLevel?: string | null,
): string {
  const type = detectQualType(title);
  if (type === "nated") {
    if (/electric|engineer/i.test(title)) {
      return "Grade 12 with Pure Maths 40% or Technical Maths 50%, Physical Science 40%, or N3 Electrical Certificate.";
    }
    return "Grade 12 NSC (Diploma endorsement) or N3 Certificate in a related field.";
  }
  if (type === "degree") {
    if (/computer|science|engineer/i.test(title)) {
      return "NSC Bachelor's endorsement with Maths 50%+ and relevant science subjects. APS typically 28–32.";
    }
    return "NSC Bachelor's endorsement. APS typically 28+. Check faculty-specific subject requirements.";
  }
  if (type === "hcert") {
    return "NSC / NC(V) Level 4 or equivalent. APS typically 21+.";
  }
  if (type === "occupational") {
    return "Grade 9–12 depending on trade, plus SETA / QCTO entry assessment where required.";
  }
  if (type === "ncv") {
    return "Grade 9 completed (GETC / AET Level 4) for NC(V) Level 2 entry.";
  }
  const nqf = parseNqfLevel(nqfLevel);
  if (nqf != null && nqf <= 4) {
    return "Grade 9 or equivalent foundational schooling.";
  }
  return "Check SAQA / provider pages for the latest minimum entry requirements.";
}

export function qualificationProvidersHint(
  title: string,
  providerCount?: number | null,
): string {
  if (providerCount && providerCount > 0) {
    const label =
      providerCount === 1 ? "1 accredited provider" : `${providerCount} accredited providers`;
    return label;
  }
  const type = detectQualType(title);
  if (type === "nated" || type === "ncv") {
    return "TVET Colleges across 9 provinces";
  }
  if (type === "degree") return "Public universities & universities of technology";
  if (type === "occupational") return "SETA / QCTO accredited skills providers";
  return "Accredited DHET / SAQA providers";
}

export function qualificationAccent(title: string): string {
  const type = detectQualType(title);
  switch (type) {
    case "degree":
      return "#2B6CB0";
    case "hcert":
      return "#C2611A";
    case "occupational":
      return "#B45309";
    case "ncv":
      return "#15803D";
    case "nated":
    default:
      return "#006A4E";
  }
}

export function qualificationTags(title: string): QualTag[] {
  const tags: QualTag[] = [
    {
      id: "nsfas",
      label: "NSFAS Funded",
      icon: "check_circle",
      tone: "funded",
    },
  ];

  if (/electric|engineer|mechanic|weld|plumb|fitter|artisan|trade/i.test(title)) {
    tags.push({
      id: "eng",
      label: "Engineering & Trades",
      icon: "engineering",
      tone: "field",
    });
  } else if (/computer|ict|software|data|information|cyber/i.test(title)) {
    tags.push({
      id: "ict",
      label: "ICT & Digital",
      icon: "computer",
      tone: "field",
    });
  } else if (/nurs|health|care|medic|pharma/i.test(title)) {
    tags.push({
      id: "health",
      label: "Health & Care",
      icon: "medical_services",
      tone: "field",
    });
  } else if (/agricultur|farm|horticult/i.test(title)) {
    tags.push({
      id: "agri",
      label: "Agriculture",
      icon: "agriculture",
      tone: "field",
    });
  } else if (/business|commerce|manag|account|financ/i.test(title)) {
    tags.push({
      id: "biz",
      label: "Business & Management",
      icon: "account_balance",
      tone: "field",
    });
  } else if (/educat|teach|pedagog/i.test(title)) {
    tags.push({
      id: "edu",
      label: "Education",
      icon: "school",
      tone: "field",
    });
  } else {
    const type = detectQualType(title);
    if (type === "ncv") {
      tags.push({
        id: "tvet",
        label: "TVET Pathway",
        icon: "school",
        tone: "field",
      });
    } else if (type === "degree") {
      tags.push({
        id: "he",
        label: "Higher Education",
        icon: "account_balance",
        tone: "field",
      });
    }
  }

  return tags;
}

export function tagToneColors(tone: QualTag["tone"]): { bg: string; fg: string } {
  switch (tone) {
    case "funded":
      return { bg: "#E6F4EA", fg: "#08503C" };
    case "field":
      return { bg: "#F1F5F9", fg: "#475569" };
    default:
      return { bg: "#F1F5F9", fg: "#64748B" };
  }
}
