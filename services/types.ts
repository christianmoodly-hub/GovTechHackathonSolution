/**
 * Shared Firestore document shapes for the NCAP app.
 * Field names match what scripts/seed_firestore.py writes (camelCase).
 */

export type QualificationRef = {
  title: string;
  url: string | null;
};

export type ProviderRef = {
  name: string;
  provider_id?: string | null;
  place_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  url?: string | null;
};

export type OfferedQualification = {
  title: string;
  saqa_url?: string | null;
  saqa_id?: string | null;
  nqf_level?: string | null;
};

export type Occupation = {
  id: string;
  occupationCode: string;
  title: string;
  url: string;
  tasks: string[];
  qualifications: QualificationRef[];
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
  providers: ProviderRef[];
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
  offeredQualifications: OfferedQualification[];
  offeredSaqaUrls: string[];
  schemaVersion?: number;
  scrapedAt?: string;
};

export type FavouriteRef = {
  collection: "occupations" | "qualifications" | "providers";
  id: string;
  url?: string;
};

export type UserProfile = {
  id: string;
  questionnaireResults: Record<string, unknown>;
  favourites: FavouriteRef[];
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type ProfileUpdate = {
  questionnaireResults?: Record<string, unknown>;
  favourites?: FavouriteRef[];
};
