/**
 * The complete set of destinations the assistant may navigate to.
 *
 * Auth routes are deliberately absent — the assistant must never move a user
 * through sign-in, registration or onboarding on their behalf.
 */
export type AssistantScreenId =
  | "home"
  | "decisions"
  | "careers"
  | "qualifications"
  | "providers"
  | "bursaries"
  | "saved"
  | "helpline"
  | "subjectChooser"
  | "careerChoice"
  | "jobFit"
  | "apsCalculator"
  | "subjectChooserResults"
  | "careerChoiceResults"
  | "jobFitResults";

type ScreenDef = {
  path: string;
  /** Spoken in the current locale's fallback (English) when confirming a move. */
  label: string;
  description: string;
};

export const ASSISTANT_SCREENS: Record<AssistantScreenId, ScreenDef> = {
  home: {
    path: "/",
    label: "Home",
    description: "Home hub with learning paths, directory shortcuts and helpline cards",
  },
  decisions: {
    path: "/questionnaires",
    label: "Decisions",
    description: "Hub listing the four guidance questionnaires and saved progress",
  },
  careers: {
    path: "/directory",
    label: "Careers directory",
    description: "Searchable list of every occupation in the DHET/SAQA catalogue",
  },
  qualifications: {
    path: "/directory/qualifications",
    label: "Qualifications directory",
    description: "Searchable list of qualifications with NQF level and APS filters",
  },
  providers: {
    path: "/directory/providers",
    label: "Institutions directory",
    description: "Public universities and TVET colleges, filterable by province",
  },
  bursaries: {
    path: "/directory/bursaries",
    label: "Bursaries directory",
    description: "Bursary listings filterable by study field and closing date",
  },
  saved: {
    path: "/saved",
    label: "Saved",
    description: "Profile, favourites vault, questionnaire results and accessibility settings",
  },
  helpline: {
    path: "/helpline",
    label: "Helpline",
    description: "DHET Khetha helpline numbers, walk-in centres and the callback form",
  },
  subjectChooser: {
    path: "/questionnaires/subject-chooser",
    label: "Subject chooser",
    description: "Build an NSC subject package and see which careers it opens",
  },
  careerChoice: {
    path: "/questionnaires/career-choice",
    label: "Career interest profiler",
    description: "RIASEC-style interest questionnaire that suggests occupations",
  },
  jobFit: {
    path: "/questionnaires/job-fit",
    label: "Job fit",
    description: "Work environment and job-fit wizard",
  },
  apsCalculator: {
    path: "/questionnaires/aps-calculator",
    label: "APS calculator",
    description: "Work out an NSC Admission Point Score from subject levels",
  },
  subjectChooserResults: {
    path: "/questionnaires/results/subjectChooser",
    label: "Subject chooser results",
    description: "Saved matches from the subject chooser",
  },
  careerChoiceResults: {
    path: "/questionnaires/results/careerChoice",
    label: "Career interest results",
    description: "Saved matches from the career interest profiler",
  },
  jobFitResults: {
    path: "/questionnaires/results/jobFit",
    label: "Job fit results",
    description: "Saved matches from the job-fit wizard",
  },
};

export const ASSISTANT_SCREEN_IDS = Object.keys(
  ASSISTANT_SCREENS,
) as AssistantScreenId[];

export function isAssistantScreenId(value: unknown): value is AssistantScreenId {
  return typeof value === "string" && value in ASSISTANT_SCREENS;
}

export type AssistantEntityType =
  | "occupation"
  | "qualification"
  | "provider"
  | "bursary";

const ENTITY_PATHS: Record<AssistantEntityType, (id: string) => string> = {
  occupation: (id) => `/directory/occupations/${encodeURIComponent(id)}`,
  qualification: (id) => `/directory/qualifications/${encodeURIComponent(id)}`,
  provider: (id) => `/directory/providers/${encodeURIComponent(id)}`,
  bursary: (id) => `/directory/bursaries/${encodeURIComponent(id)}`,
};

export function isAssistantEntityType(
  value: unknown,
): value is AssistantEntityType {
  return typeof value === "string" && value in ENTITY_PATHS;
}

export function entityPath(type: AssistantEntityType, id: string): string {
  return ENTITY_PATHS[type](id.trim());
}

/** Human-readable name for whichever screen a path belongs to. */
export function describePath(path: string): string {
  const exact = ASSISTANT_SCREEN_IDS.find(
    (id) => ASSISTANT_SCREENS[id].path === path,
  );
  if (exact) return ASSISTANT_SCREENS[exact].label;
  if (path.startsWith("/directory/occupations/")) return "a career detail page";
  if (path.startsWith("/directory/qualifications/")) return "a qualification detail page";
  if (path.startsWith("/directory/providers/")) return "an institution detail page";
  if (path.startsWith("/directory/bursaries/")) return "a bursary detail page";
  return "this screen";
}
