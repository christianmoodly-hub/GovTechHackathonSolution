import type { ImageSourcePropType } from "react-native";
import type { CareerFilterId } from "../utils/occupationPresentation";
import type { QualTypeFilterId } from "../utils/qualificationPresentation";

export const QUESTIONNAIRE_PATH_IMAGES = {
  subjectChooser: require("../assets/stitch/paths/subject-choice.jpg"),
  careerChoice: require("../assets/stitch/paths/career-profiler.jpg"),
  jobFit: require("../assets/stitch/paths/tvet-artisan.jpg"),
} as const satisfies Record<string, ImageSourcePropType>;

export type FieldPathId = "university" | "health" | "digital";

export type FieldPath = {
  id: FieldPathId;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  /** Expo Router path including optional query string */
  href: string;
  accent: string;
  icon: string;
};

export const FIELD_PATHS: FieldPath[] = [
  {
    id: "university",
    title: "University & Degrees",
    subtitle: "Bachelor’s pathways & APS-aligned study",
    image: require("../assets/stitch/paths/university-degrees.jpg"),
    href: "/directory/qualifications?type=degree",
    accent: "#1960A3",
    icon: "account_balance",
  },
  {
    id: "health",
    title: "Health & Social Services",
    subtitle: "Nursing, care, and community pathways",
    image: require("../assets/stitch/paths/health-social.jpg"),
    href: "/directory?filter=health",
    accent: "#BA1A1A",
    icon: "medical_services",
  },
  {
    id: "digital",
    title: "Digital & Emerging Tech",
    subtitle: "ICT, coding, and data careers",
    image: require("../assets/stitch/paths/digital-tech.jpg"),
    href: "/directory?filter=ict",
    accent: "#2B6CB0",
    icon: "computer",
  },
];

const CAREER_FILTERS: CareerFilterId[] = [
  "all",
  "demand",
  "green",
  "trades",
  "ict",
  "health",
  "agriculture",
];

export function parseCareerFilterParam(
  value: string | string[] | undefined,
): CareerFilterId | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  return CAREER_FILTERS.includes(raw as CareerFilterId)
    ? (raw as CareerFilterId)
    : null;
}

const QUAL_TYPES: QualTypeFilterId[] = [
  "all",
  "nated",
  "degree",
  "hcert",
  "occupational",
  "ncv",
];

export function parseQualTypeParam(
  value: string | string[] | undefined,
): QualTypeFilterId | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  return QUAL_TYPES.includes(raw as QualTypeFilterId)
    ? (raw as QualTypeFilterId)
    : null;
}
