import type { ApsFilterId } from "./qualificationPresentation";
import type { ElectiveId, MathStream } from "../questionnaires/subjectPackage";
import { ELECTIVES } from "../questionnaires/subjectPackage";

/** NSC achievement level 1–7 (points equal the level). */
export type NscLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ApsSubjectRow = {
  id: string;
  label: string;
  level: NscLevel;
};

export type ApsBandInfo = {
  filterId: ApsFilterId;
  label: string;
  short: string;
  guidance: string;
};

const LEVEL_PERCENT: Record<NscLevel, string> = {
  7: "80–100%",
  6: "70–79%",
  5: "60–69%",
  4: "50–59%",
  3: "40–49%",
  2: "30–39%",
  1: "0–29%",
};

export function nscLevelLabel(level: NscLevel): string {
  return `Level ${level} · ${LEVEL_PERCENT[level]}`;
}

export function clampNscLevel(value: number): NscLevel {
  const n = Math.round(value);
  if (n <= 1) return 1;
  if (n >= 7) return 7;
  return n as NscLevel;
}

/**
 * Standard indicative NSC APS: sum achievement levels for the best 6 subjects.
 * Life Orientation is not in the Khetha subject package and is excluded.
 */
export function calculateNscAps(levels: NscLevel[]): {
  total: number;
  counted: NscLevel[];
  subjectCount: number;
} {
  const sorted = [...levels].sort((a, b) => b - a);
  const counted = sorted.slice(0, 6);
  const total = counted.reduce((sum, level) => sum + level, 0);
  return { total, counted, subjectCount: counted.length };
}

/** Map total APS onto directory filter bands. */
export function apsBandForTotal(total: number): ApsBandInfo {
  if (total >= 32) {
    return {
      filterId: "32",
      label: "APS 32+ · High Demand / Science",
      short: "APS 32+",
      guidance:
        "Strong range for competitive degree programmes in science, engineering, and health. Always confirm faculty subject minima.",
    };
  }
  if (total >= 28) {
    return {
      filterId: "28",
      label: "APS 28+ · Degree Track",
      short: "APS 28+",
      guidance:
        "Typical bachelor’s-degree gateway at many public universities. Check faculty-specific Maths/Science requirements.",
    };
  }
  if (total >= 24) {
    return {
      filterId: "24",
      label: "APS 24+ · Diploma Gateway",
      short: "APS 24+",
      guidance:
        "Aligned with many diploma and some degree pathways (including TVET NATED progression).",
    };
  }
  if (total >= 21) {
    return {
      filterId: "21",
      label: "APS 21+ · Higher Certificate",
      short: "APS 21+",
      guidance:
        "Opens Higher Certificate routes and some diploma access programmes.",
    };
  }
  if (total >= 18) {
    return {
      filterId: "18",
      label: "APS 18+ · TVET / Foundational",
      short: "APS 18+",
      guidance:
        "Suitable for many TVET NC(V) and foundational pathways. Consider upgrading key subjects if you aim for degree study.",
    };
  }
  return {
    filterId: "18",
    label: "Below APS 18 · Build foundations",
    short: "APS <18",
    guidance:
      "Focus on improving core subjects (languages, Maths). TVET and bridging options can still open doors.",
  };
}

export function mathSubjectLabel(math: MathStream): string {
  return math === "pure" ? "Mathematics (Pure)" : "Mathematical Literacy";
}

export function electiveLabel(id: ElectiveId): string {
  return ELECTIVES.find((item) => item.id === id)?.title ?? id;
}

export function buildSubjectRows(input: {
  homeLanguage: string;
  falLanguage: string;
  math: MathStream;
  electives: ElectiveId[];
  levels?: Record<string, number>;
}): ApsSubjectRow[] {
  const defaultLevel = (id: string): NscLevel =>
    clampNscLevel(input.levels?.[id] ?? 4);

  const rows: ApsSubjectRow[] = [
    {
      id: "hl",
      label: input.homeLanguage,
      level: defaultLevel("hl"),
    },
    {
      id: "fal",
      label: input.falLanguage,
      level: defaultLevel("fal"),
    },
    {
      id: "math",
      label: mathSubjectLabel(input.math),
      level: defaultLevel("math"),
    },
  ];

  for (const electiveId of input.electives) {
    rows.push({
      id: electiveId,
      label: electiveLabel(electiveId),
      level: defaultLevel(electiveId),
    });
  }

  return rows;
}

export function serializeApsLevels(rows: ApsSubjectRow[]): string {
  return rows.map((row) => `${row.id}:${row.level}`).join("|");
}

export function parseApsLevels(
  raw: string | null | undefined,
): Record<string, number> {
  if (!raw) return {};
  const out: Record<string, number> = {};
  for (const part of raw.split("|")) {
    const [id, levelRaw] = part.split(":");
    if (!id || !levelRaw) continue;
    const level = Number(levelRaw);
    if (Number.isFinite(level)) out[id] = clampNscLevel(level);
  }
  return out;
}

export function parseApsFilterParam(
  value: string | string[] | undefined,
): ApsFilterId | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (
    raw === "18" ||
    raw === "21" ||
    raw === "24" ||
    raw === "28" ||
    raw === "32"
  ) {
    return raw;
  }
  return null;
}
