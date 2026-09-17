export type FavouriteType = "occupation" | "qualification" | "provider";

export type FavouriteRef = {
  type: FavouriteType;
  url: string;
  title: string;
  entityId?: string;
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

export type Qualification = {
  id: string;
  title: string;
  url: string;
  generalQualificationId?: string;
  qualificationId?: string | null;
  nqfLevel?: string | null;
  duration?: string | null;
  saqaUrl?: string | null;
  providers: {
    name: string;
    url?: string | null;
    provider_id?: string | null;
  }[];
  providerUrls: string[];
  schemaVersion?: number;
  scrapedAt?: string;
};

export type Provider = {
  id: string;
  name: string;
  url: string;
  providerId: string;
  website?: string | null;
  email?: string | null;
  telephone?: string | null;
  fax?: string | null;
  streetAddress?: string | null;
  postalAddress?: string | null;
  offeredQualifications: {
    title: string;
    saqa_url?: string | null;
    saqa_id?: string | null;
    nqf_level?: string | null;
  }[];
  offeredSaqaUrls: string[];
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

export type Demographics = {
  preferredLanguage: string;
  role: string;
  hasDisability: boolean;
  disabilityCategories: string[];
  completedAt: string;
};

export type UserProfile = {
  id: string;
  questionnaireResults: QuestionnaireResultsMap;
  favourites: FavouriteRef[];
  demographics?: Demographics | null;
  pushToken?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProfileUpdate = {
  questionnaireResults?: QuestionnaireResultsMap;
  favourites?: FavouriteRef[];
  demographics?: Demographics | null;
  pushToken?: string | null;
};

export type QualificationSummary = {
  id: string;
  title: string;
  nqfLevel?: string | null;
  duration?: string | null;
  searchText: string;
};

export type ProviderSummary = {
  id: string;
  name: string;
  providerId: string;
  streetAddress?: string | null;
  searchText: string;
};

export type PageCursor = {
  sortValue: string;
  id: string;
};

export type PagedResult<T> = {
  items: T[];
  nextCursor: PageCursor | null;
  fromCache: boolean;
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
