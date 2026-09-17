import type { CareerDomain } from "../questionnaires/domains";

export type CareerTag = {
  id: string;
  label: string;
  tone: "demand" | "green" | "trade" | "ict" | "health" | "neutral";
};

export type CareerFilterId =
  | "all"
  | "demand"
  | "green"
  | "trades"
  | "ict"
  | "health"
  | "agriculture";

const FILTERS: {
  id: CareerFilterId;
  label: string;
  icon: string;
  match?: RegExp;
}[] = [
  { id: "all", label: "All", icon: "menu_book" },
  {
    id: "demand",
    label: "High Demand",
    icon: "bolt",
    match: /solar|electric|software|developer|technician|artisan|nurse|data|mechatronic|millwright/i,
  },
  {
    id: "green",
    label: "Green Economy",
    icon: "eco",
    match: /solar|renewable|environment|agricultur|water|waste|energy|pv/i,
  },
  {
    id: "trades",
    label: "Trades & Artisans",
    icon: "build",
    match: /electrician|plumber|welder|artisan|mechanic|millwright|carpenter|fitter|boilermaker/i,
  },
  {
    id: "ict",
    label: "ICT & Tech",
    icon: "computer",
    match: /software|developer|program|data|network|cyber|ict|system|analyst|web/i,
  },
  {
    id: "health",
    label: "Health & Care",
    icon: "medical_services",
    match: /nurse|doctor|health|clinic|therapist|pharmacist|paramedic|care/i,
  },
  {
    id: "agriculture",
    label: "Agriculture",
    icon: "agriculture",
    match: /agricultur|farm|horticult|livestock|forestry|fisher/i,
  },
];

export function careerFilterDefs() {
  return FILTERS;
}

export function matchesCareerFilter(
  title: string,
  filter: CareerFilterId,
): boolean {
  if (filter === "all") return true;
  const def = FILTERS.find((f) => f.id === filter);
  if (!def?.match) return true;
  return def.match.test(title);
}

export function occupationIcon(title: string): string {
  const t = title.toLowerCase();
  if (/solar|pv|renewable/.test(t)) return "wb_sunny";
  if (/software|developer|program|web|data|ict|cyber/.test(t)) return "code";
  if (/electric/.test(t)) return "bolt";
  if (/nurse|health|clinic|doctor|care/.test(t)) return "medical_services";
  if (/agricultur|farm/.test(t)) return "agriculture";
  if (/teach|educat|lectur/.test(t)) return "school";
  if (/engineer|mechatronic|millwright|technician/.test(t)) return "engineering";
  if (/plumb|weld|carpenter|artisan|mechanic|fitter/.test(t)) return "build";
  return "work_outline";
}

export function occupationTags(title: string): CareerTag[] {
  const tags: CareerTag[] = [];
  const t = title.toLowerCase();
  if (
    /solar|electric|software|developer|technician|artisan|nurse|data|mechatronic/.test(
      t,
    )
  ) {
    tags.push({ id: "demand", label: "High Demand DHET", tone: "demand" });
  }
  if (/solar|renewable|environment|agricultur|energy|pv|green/.test(t)) {
    tags.push({ id: "green", label: "Green Economy", tone: "green" });
  }
  if (/electrician|plumber|welder|artisan|mechanic|millwright|carpenter/.test(t)) {
    tags.push({ id: "trade", label: "Trade / TVET", tone: "trade" });
  }
  if (/software|developer|data|ict|network|cyber|analyst/.test(t)) {
    tags.push({ id: "ict", label: "ICT Sector", tone: "ict" });
  }
  if (/nurse|health|clinic|care|therapist/.test(t)) {
    tags.push({ id: "health", label: "Health & Care", tone: "health" });
  }
  if (!tags.length) {
    tags.push({ id: "ncap", label: "NCAP Pathway", tone: "neutral" });
  }
  return tags.slice(0, 3);
}

export function tagToneColors(tone: CareerTag["tone"]): {
  bg: string;
  fg: string;
  border: string;
} {
  switch (tone) {
    case "demand":
      return { bg: "#FFF4E5", fg: "#C2611A", border: "#F2C094" };
    case "green":
      return { bg: "#E6F4EA", fg: "#15803D", border: "#B7E0C2" };
    case "trade":
      return { bg: "#EFF6FF", fg: "#2B6CB0", border: "#BFDBFE" };
    case "ict":
      return { bg: "#F3E8FF", fg: "#6D28D9", border: "#DDD6FE" };
    case "health":
      return { bg: "#FCE7F3", fg: "#BE185D", border: "#FBCFE8" };
    default:
      return { bg: "#F1F5F9", fg: "#475569", border: "#E2E8F0" };
  }
}

/** Map questionnaire domain scores into display badges (RIASEC-style labels). */
export function domainBadges(
  domainScores: Record<string, number> | undefined,
): { label: string; pct: number; icon: string }[] {
  if (!domainScores) return [];
  const total = Object.values(domainScores).reduce(
    (sum, n) => sum + Math.max(0, Number(n) || 0),
    0,
  );
  if (total <= 0) return [];

  const labelMap: Partial<Record<CareerDomain | string, { label: string; icon: string }>> = {
    trades: { label: "Realistic", icon: "build" },
    agriculture: { label: "Realistic", icon: "agriculture" },
    stem: { label: "Investigative", icon: "biotech" },
    digital: { label: "Investigative", icon: "computer" },
    creative: { label: "Artistic", icon: "palette" },
    education: { label: "Social", icon: "school" },
    health: { label: "Social", icon: "medical_services" },
    services: { label: "Social", icon: "support_agent" },
    business: { label: "Enterprising", icon: "trending_up" },
    law_security: { label: "Conventional", icon: "verified" },
  };

  return Object.entries(domainScores)
    .filter(([, score]) => (score as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([domain, score]) => {
      const meta = labelMap[domain] ?? {
        label: domain.replace(/_/g, " "),
        icon: "stars",
      };
      return {
        label: meta.label,
        icon: meta.icon,
        pct: Math.round(((score as number) / total) * 100),
      };
    });
}

export function matchPercent(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return Math.min(99, Math.max(40, Math.round((score / maxScore) * 100)));
}

export function fitLabel(rank: number): string {
  if (rank === 0) return "#1 Optimal Fit";
  if (rank === 1) return "#2 Strong Fit";
  if (rank === 2) return "#3 Emerging Fit";
  return `#${rank + 1} Match`;
}

export function occupationAccent(title: string): string {
  const t = title.toLowerCase();
  if (/solar|renewable|agricultur|environment|green/.test(t)) return "#15803D";
  if (/software|developer|data|ict|cyber|analyst/.test(t)) return "#2B6CB0";
  if (/electric|artisan|mechanic|weld|plumb|millwright/.test(t)) return "#C2611A";
  if (/nurse|health|clinic|care/.test(t)) return "#BE185D";
  return "#006A4E";
}

export function occupationEducationHint(title: string): string {
  const t = title.toLowerCase();
  if (/doctor|engineer|scientist|analyst|lawyer|accountant/.test(t)) {
    return "Grade 12 NSC (Degree route)";
  }
  if (/nurse|teacher|technician|developer/.test(t)) {
    return "Grade 12 or Diploma / NQF 5";
  }
  if (/electrician|plumber|welder|artisan|mechanic|millwright/.test(t)) {
    return "Grade 12 or N3 Cert";
  }
  return "Grade 12 / TVET N3 or equivalent";
}

export function occupationMathHint(title: string): string {
  const t = title.toLowerCase();
  if (/engineer|scientist|actuary|data|software/.test(t)) return "Pure Maths 60%+";
  if (/technician|electric|mechatronic/.test(t)) return "Pure 40% / Tech 50%";
  if (/nurse|teacher|admin|care/.test(t)) return "Math Lit 50% / Pure 40%";
  return "Math Lit or Pure (pathway dependent)";
}

export function occupationSalaryHint(title: string): string {
  const t = title.toLowerCase();
  if (/doctor|engineer|data|software|actuary/.test(t)) return "R22,000 – R45,000 /pm";
  if (/technician|electrician|nurse|developer/.test(t)) return "R15,000 – R28,000 /pm";
  if (/artisan|mechanic|plumb|weld/.test(t)) return "R12,000 – R25,000 /pm";
  return "Varies by region & experience";
}

export function occupationPathwayHint(title: string): string {
  const t = title.toLowerCase();
  if (/solar|electric|artisan|technician|mechatronic/.test(t)) {
    return "TVET Colleges Nearby";
  }
  if (/software|data|analyst|developer/.test(t)) return "University / UoT Pathways";
  if (/nurse|health|care/.test(t)) return "Health training providers";
  return "Accredited providers nearby";
}

/** Cycle Stitch lifestyle photos for recommendation / option cards. */
export const STITCH_RESULT_IMAGES = [
  require("../assets/stitch/results/img1.jpg"),
  require("../assets/stitch/results/img2.jpg"),
  require("../assets/stitch/career-detail/img1.jpg"),
] as const;

export const STITCH_JOBFIT_IMAGES = {
  outdoors: require("../assets/stitch/job-fit/img1.jpg"),
  workshop: require("../assets/stitch/job-fit/img2.jpg"),
  office: require("../assets/stitch/job-fit/img3.jpg"),
  community: require("../assets/stitch/job-fit/img4.jpg"),
} as const;

export const STITCH_DETAIL_HERO = require("../assets/stitch/career-detail/img1.jpg");
export const STITCH_CAMPUS_IMAGES = [
  require("../assets/stitch/career-detail/img2.jpg"),
  require("../assets/stitch/career-detail/img3.jpg"),
] as const;
