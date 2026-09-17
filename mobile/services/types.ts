export type FavouriteRef = {
  collection: "occupations" | "qualifications" | "providers";
  id: string;
  url?: string;
};

export type Occupation = {
  id: string;
  occupationCode: string;
  title: string;
  url: string;
  tasks: string[];
  qualifications: { title: string; url: string | null }[];
  qualificationUrls: string[];
  entryRequirements: string[];
  alternativeTitles: string[];
  schemaVersion?: number;
  scrapedAt?: string;
};

/** Lightweight row used for questionnaire matching / list indexes. */
export type OccupationSummary = {
  occupationCode: string;
  title: string;
  alternativeTitles: string[];
  searchText: string;
};

export type UserProfile = {
  id: string;
  questionnaireResults: QuestionnaireResultsMap;
  favourites: FavouriteRef[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProfileUpdate = {
  questionnaireResults?: QuestionnaireResultsMap;
  favourites?: FavouriteRef[];
};

export type QuestionnaireId =
  | "subjectChooser"
  | "careerChoice"
  | "jobFit";

export type QuestionnaireMatch = {
  occupationCode: string;
  title: string;
  score: number;
};

export type QuestionnaireResult = {
  questionnaireId: QuestionnaireId;
  completedAt: string;
  answers: Record<string, string>;
  domainScores: Record<string, number>;
  matches: QuestionnaireMatch[];
};

export type QuestionnaireResultsMap = {
  subjectChooser?: QuestionnaireResult;
  careerChoice?: QuestionnaireResult;
  jobFit?: QuestionnaireResult;
};
