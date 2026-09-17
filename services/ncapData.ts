/**
 * NCAP Firestore data-access helpers (Firebase JS SDK).
 *
 * Catalogue collections are public-read. Profile reads/writes require
 * the signed-in user to match profiles/{uid}.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "../firebase/client";
import type {
  Occupation,
  ProfileUpdate,
  Provider,
  Qualification,
  UserProfile,
} from "./types";

const OCCUPATIONS = "occupations";
const QUALIFICATIONS = "qualifications";
const PROVIDERS = "providers";
const PROFILES = "profiles";

export class NcapDataError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "NcapDataError";
    this.code = code;
  }
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

function mapQualification(id: string, data: DocumentData): Qualification {
  return {
    id,
    title: String(data.title ?? ""),
    url: String(data.url ?? ""),
    generalQualificationId: data.generalQualificationId,
    qualificationId: data.qualificationId ?? null,
    nqfLevel: data.nqfLevel ?? null,
    duration: data.duration ?? null,
    saqaUrl: data.saqaUrl ?? null,
    providers: Array.isArray(data.providers) ? data.providers : [],
    providerUrls: Array.isArray(data.providerUrls) ? data.providerUrls : [],
    schemaVersion: data.schemaVersion,
    scrapedAt: data.scrapedAt,
  };
}

function mapProvider(id: string, data: DocumentData): Provider {
  return {
    id,
    name: String(data.name ?? ""),
    url: String(data.url ?? ""),
    providerId: String(data.providerId ?? id),
    website: data.website ?? null,
    email: data.email ?? null,
    telephone: data.telephone ?? null,
    fax: data.fax ?? null,
    streetAddress: data.streetAddress ?? null,
    postalAddress: data.postalAddress ?? null,
    offeredQualifications: Array.isArray(data.offeredQualifications)
      ? data.offeredQualifications
      : [],
    offeredSaqaUrls: Array.isArray(data.offeredSaqaUrls)
      ? data.offeredSaqaUrls
      : [],
    schemaVersion: data.schemaVersion,
    scrapedAt: data.scrapedAt,
  };
}

function mapProfile(id: string, data: DocumentData): UserProfile {
  return {
    id,
    questionnaireResults:
      data.questionnaireResults && typeof data.questionnaireResults === "object"
        ? (data.questionnaireResults as Record<string, unknown>)
        : {},
    favourites: Array.isArray(data.favourites) ? data.favourites : [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function wrapError(code: string, message: string, cause: unknown): never {
  throw new NcapDataError(code, message, { cause });
}

/** Fetch a single occupation by OFO / occupation code (doc ID). */
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
    wrapError("get-occupation-failed", `Failed to load occupation ${trimmed}`, err);
  }
}

/**
 * Search occupations by free-text query against title, code, and alternate titles.
 * Catalogue is ~1.4k docs — client-side filter is fine for the hackathon build.
 */
export async function searchOccupations(
  query: string,
  options: { limit?: number } = {},
): Promise<Occupation[]> {
  const needle = query.trim().toLowerCase();
  const limit = options.limit ?? 25;
  if (!needle) return [];

  try {
    const snap = await getDocs(collection(getDb(), OCCUPATIONS));
    const matches: Occupation[] = [];

    for (const docSnap of snap.docs) {
      const occupation = mapOccupation(docSnap.id, docSnap.data());
      const haystack = [
        occupation.title,
        occupation.occupationCode,
        ...occupation.alternativeTitles,
      ]
        .join(" ")
        .toLowerCase();

      if (haystack.includes(needle)) {
        matches.push(occupation);
        if (matches.length >= limit) break;
      }
    }

    return matches;
  } catch (err) {
    wrapError("search-occupations-failed", "Failed to search occupations", err);
  }
}

/** Fetch a qualification by stable URL-hash doc ID. */
export async function getQualification(
  id: string,
): Promise<Qualification | null> {
  const trimmed = id.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Qualification id is required");
  }

  try {
    const snap = await getDoc(doc(getDb(), QUALIFICATIONS, trimmed));
    if (!snap.exists()) return null;
    return mapQualification(snap.id, snap.data());
  } catch (err) {
    wrapError(
      "get-qualification-failed",
      `Failed to load qualification ${trimmed}`,
      err,
    );
  }
}

/** Fetch a provider by stable URL-hash doc ID. */
export async function getProvider(id: string): Promise<Provider | null> {
  const trimmed = id.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Provider id is required");
  }

  try {
    const snap = await getDoc(doc(getDb(), PROVIDERS, trimmed));
    if (!snap.exists()) return null;
    return mapProvider(snap.id, snap.data());
  } catch (err) {
    wrapError("get-provider-failed", `Failed to load provider ${trimmed}`, err);
  }
}

/** Fetch the signed-in user's profile. Returns null if it does not exist yet. */
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
    wrapError("get-profile-failed", `Failed to load profile ${trimmed}`, err);
  }
}

/**
 * Create or merge-update a user profile.
 * Sets updatedAt on every write; createdAt only when the doc is new.
 */
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
    wrapError("update-profile-failed", `Failed to update profile ${trimmed}`, err);
  }
}
