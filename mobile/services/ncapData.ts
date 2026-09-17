import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb } from "../firebase/client";
import type {
  Occupation,
  OccupationSummary,
  ProfileUpdate,
  QuestionnaireResultsMap,
  UserProfile,
} from "./types";

const PROFILES = "profiles";
const OCCUPATIONS = "occupations";
const OCC_INDEX_CACHE_KEY = "ncap.occupationSummaries.v1";
const PAGE_SIZE = 100;

export class NcapDataError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "NcapDataError";
    this.code = code;
  }
}

function mapProfile(id: string, data: DocumentData): UserProfile {
  return {
    id,
    questionnaireResults:
      data.questionnaireResults && typeof data.questionnaireResults === "object"
        ? (data.questionnaireResults as QuestionnaireResultsMap)
        : {},
    favourites: Array.isArray(data.favourites) ? data.favourites : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function mapOccupation(id: string, data: DocumentData): Occupation {
  return {
    id,
    occupationCode: String(data.occupationCode ?? id),
    title: String(data.title ?? ""),
    url: String(data.url ?? ""),
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
    qualifications: Array.isArray(data.qualifications) ? data.qualifications : [],
    qualificationUrls: Array.isArray(data.qualificationUrls)
      ? data.qualificationUrls
      : [],
    entryRequirements: Array.isArray(data.entryRequirements)
      ? data.entryRequirements
      : [],
    alternativeTitles: Array.isArray(data.alternativeTitles)
      ? data.alternativeTitles
      : [],
    schemaVersion: data.schemaVersion,
    scrapedAt: data.scrapedAt,
  };
}

function toSummary(occupation: Occupation): OccupationSummary {
  const alternativeTitles = occupation.alternativeTitles ?? [];
  const searchText = [
    occupation.title,
    occupation.occupationCode,
    ...alternativeTitles,
    ...(occupation.tasks ?? []).slice(0, 4),
  ]
    .join(" ")
    .toLowerCase();

  return {
    occupationCode: occupation.occupationCode,
    title: occupation.title,
    alternativeTitles,
    searchText,
  };
}

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Profile uid is required");
  }

  try {
    const snap = await getDoc(doc(getDb(), PROFILES, trimmed));
    if (!snap.exists()) return null;
    return mapProfile(snap.id, snap.data());
  } catch (err) {
    throw new NcapDataError(
      "get-profile-failed",
      `Failed to load profile ${trimmed}`,
      { cause: err },
    );
  }
}

/** Create profiles/{uid} once on first sign-in if missing. */
export async function ensureProfile(uid: string): Promise<UserProfile> {
  const existing = await getProfile(uid);
  if (existing) return existing;

  const ref = doc(getDb(), PROFILES, uid);
  const payload: DocumentData = {
    questionnaireResults: {},
    favourites: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(ref, payload, { merge: true });
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new NcapDataError(
        "profile-missing-after-write",
        "Profile bootstrap succeeded but document is missing",
      );
    }
    return mapProfile(snap.id, snap.data());
  } catch (err) {
    if (err instanceof NcapDataError) throw err;
    throw new NcapDataError(
      "ensure-profile-failed",
      `Failed to create profile ${uid}`,
      { cause: err },
    );
  }
}

export async function updateProfile(
  uid: string,
  data: ProfileUpdate,
): Promise<UserProfile> {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Profile uid is required");
  }

  try {
    const ref = doc(getDb(), PROFILES, trimmed);
    const existing = await getDoc(ref);
    const payload: DocumentData = {
      updatedAt: serverTimestamp(),
    };

    if (data.questionnaireResults !== undefined) {
      payload.questionnaireResults = data.questionnaireResults;
    }
    if (data.favourites !== undefined) {
      payload.favourites = data.favourites;
    }

    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
      if (payload.questionnaireResults === undefined) {
        payload.questionnaireResults = {};
      }
      if (payload.favourites === undefined) {
        payload.favourites = [];
      }
    }

    await setDoc(ref, payload, { merge: true });
    const refreshed = await getDoc(ref);
    if (!refreshed.exists()) {
      throw new NcapDataError(
        "profile-missing-after-write",
        "Profile write succeeded but document is missing",
      );
    }
    return mapProfile(refreshed.id, refreshed.data());
  } catch (err) {
    if (err instanceof NcapDataError) throw err;
    throw new NcapDataError(
      "update-profile-failed",
      `Failed to update profile ${trimmed}`,
      { cause: err },
    );
  }
}

export async function getOccupation(code: string): Promise<Occupation | null> {
  const trimmed = code.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Occupation code is required");
  }

  try {
    const snap = await getDoc(doc(getDb(), OCCUPATIONS, trimmed));
    if (!snap.exists()) return null;
    return mapOccupation(snap.id, snap.data());
  } catch (err) {
    throw new NcapDataError(
      "get-occupation-failed",
      `Failed to load occupation ${trimmed}`,
      { cause: err },
    );
  }
}

/**
 * Load occupation summaries in Firestore pages and cache locally.
 * Used by questionnaire scoring — avoids keeping full docs in memory.
 */
export async function getOccupationSummaries(options?: {
  forceRefresh?: boolean;
}): Promise<{ summaries: OccupationSummary[]; cachedAt: string; fromCache: boolean }> {
  if (!options?.forceRefresh) {
    const cached = await AsyncStorage.getItem(OCC_INDEX_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as {
          cachedAt: string;
          summaries: OccupationSummary[];
        };
        if (parsed.summaries?.length) {
          return {
            summaries: parsed.summaries,
            cachedAt: parsed.cachedAt,
            fromCache: true,
          };
        }
      } catch {
        // rebuild below
      }
    }
  }

  try {
    const summaries: OccupationSummary[] = [];
    let lastDoc: QueryDocumentSnapshot | null = null;

    for (;;) {
      const pageQuery = lastDoc
        ? query(
            collection(getDb(), OCCUPATIONS),
            orderBy("title"),
            startAfter(lastDoc),
            limit(PAGE_SIZE),
          )
        : query(
            collection(getDb(), OCCUPATIONS),
            orderBy("title"),
            limit(PAGE_SIZE),
          );

      const snap = await getDocs(pageQuery);
      if (snap.empty) break;

      for (const docSnap of snap.docs) {
        summaries.push(toSummary(mapOccupation(docSnap.id, docSnap.data())));
      }

      lastDoc = snap.docs[snap.docs.length - 1] ?? null;
      if (snap.size < PAGE_SIZE) break;
    }

    const cachedAt = new Date().toISOString();
    await AsyncStorage.setItem(
      OCC_INDEX_CACHE_KEY,
      JSON.stringify({ cachedAt, summaries }),
    );

    return { summaries, cachedAt, fromCache: false };
  } catch (err) {
    const cached = await AsyncStorage.getItem(OCC_INDEX_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as {
        cachedAt: string;
        summaries: OccupationSummary[];
      };
      return {
        summaries: parsed.summaries,
        cachedAt: parsed.cachedAt,
        fromCache: true,
      };
    }
    throw new NcapDataError(
      "list-occupations-failed",
      "Failed to load occupations for matching",
      { cause: err },
    );
  }
}
