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
  FavouriteRef,
  FavouriteType,
  Occupation,
  OccupationSummary,
  PageCursor,
  PagedResult,
  ProfileUpdate,
  Provider,
  ProviderSummary,
  Qualification,
  QualificationSummary,
  QuestionnaireResultsMap,
  UserProfile,
} from "./types";

const PROFILES = "profiles";
const OCCUPATIONS = "occupations";
const QUALIFICATIONS = "qualifications";
const PROVIDERS = "providers";
const OCC_INDEX_CACHE_KEY = "ncap.occupationSummaries.v1";
const QUAL_PAGE_CACHE_KEY = "ncap.qualificationPage.v1";
const PROVIDER_PAGE_CACHE_KEY = "ncap.providerPage.v1";
const PAGE_SIZE = 100;
const DIRECTORY_PAGE_SIZE = 40;

export class NcapDataError extends Error {
  readonly code: string;

  constructor(code: string, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "NcapDataError";
    this.code = code;
  }
}

/** Firestore rejects `undefined` field values — strip them before writes. */
function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested !== undefined) {
        out[key] = stripUndefinedDeep(nested);
      }
    }
    return out as T;
  }
  return value;
}

function firestoreErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const code = (err as { code?: string }).code;
  if (code === "permission-denied") {
    return "Firestore permission denied. Deploy firestore.rules and ensure you are signed in.";
  }
  return err.message || String(err);
}

function mapProfile(id: string, data: DocumentData): UserProfile {
  return {
    id,
    questionnaireResults:
      data.questionnaireResults && typeof data.questionnaireResults === "object"
        ? (data.questionnaireResults as QuestionnaireResultsMap)
        : {},
    favourites: Array.isArray(data.favourites) ? data.favourites : [],
    demographics:
      data.demographics && typeof data.demographics === "object"
        ? (data.demographics as UserProfile["demographics"])
        : null,
    pushToken: data.pushToken ?? null,
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
    console.error("[ncapData] ensureProfile failed", uid, err);
    throw new NcapDataError(
      "ensure-profile-failed",
      `Failed to create profile: ${firestoreErrorMessage(err)}`,
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
    const existingData = existing.exists() ? existing.data() : {};

    // Always send required keys so security rules' hasAll() passes even on merge writes.
    const payload: DocumentData = {
      questionnaireResults:
        data.questionnaireResults !== undefined
          ? data.questionnaireResults
          : (existingData.questionnaireResults ?? {}),
      favourites:
        data.favourites !== undefined
          ? data.favourites
          : (existingData.favourites ?? []),
      updatedAt: serverTimestamp(),
    };

    if (data.demographics !== undefined) {
      payload.demographics =
        data.demographics === null
          ? null
          : stripUndefinedDeep(data.demographics);
    }
    if (data.pushToken !== undefined) {
      payload.pushToken = data.pushToken;
    }

    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
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
    console.error("[ncapData] updateProfile failed", trimmed, err);
    throw new NcapDataError(
      "update-profile-failed",
      `Failed to update profile: ${firestoreErrorMessage(err)}`,
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
    throw new NcapDataError(
      "get-qualification-failed",
      `Failed to load qualification ${trimmed}`,
      { cause: err },
    );
  }
}

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
    throw new NcapDataError(
      "get-provider-failed",
      `Failed to load provider ${trimmed}`,
      { cause: err },
    );
  }
}

export function isFavourited(
  favourites: FavouriteRef[] | undefined,
  url: string,
): boolean {
  return (favourites ?? []).some((item) => item.url === url);
}

/**
 * Toggle a favourite on the profile. Returns the updated favourites array
 * and whether the item was added (true) or removed (false).
 */
export async function toggleFavourite(
  uid: string,
  item: { type: FavouriteType; url: string; title: string; entityId?: string },
  currentFavourites: FavouriteRef[] = [],
): Promise<{ favourites: FavouriteRef[]; added: boolean }> {
  const exists = currentFavourites.some((fav) => fav.url === item.url);
  const favourites = exists
    ? currentFavourites.filter((fav) => fav.url !== item.url)
    : [
        ...currentFavourites,
        {
          type: item.type,
          url: item.url,
          title: item.title,
          ...(item.entityId ? { entityId: item.entityId } : {}),
        },
      ];

  await updateProfile(uid, { favourites });
  return { favourites, added: !exists };
}

function toQualificationSummary(
  qualification: Qualification,
): QualificationSummary {
  return {
    id: qualification.id,
    title: qualification.title,
    nqfLevel: qualification.nqfLevel ?? null,
    duration: qualification.duration ?? null,
    searchText: [qualification.title, qualification.nqfLevel ?? ""]
      .join(" ")
      .toLowerCase(),
  };
}

function toProviderSummary(provider: Provider): ProviderSummary {
  return {
    id: provider.id,
    name: provider.name,
    providerId: provider.providerId,
    streetAddress: provider.streetAddress ?? null,
    searchText: [provider.name, provider.streetAddress ?? "", provider.providerId]
      .join(" ")
      .toLowerCase(),
  };
}

async function readPageCache<T>(
  key: string,
): Promise<{ cachedAt: string; items: T[] } | null> {
  const cached = await AsyncStorage.getItem(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as { cachedAt: string; items: T[] };
  } catch {
    return null;
  }
}

export async function getQualificationPage(options?: {
  cursor?: PageCursor | null;
  pageSize?: number;
  forceRefresh?: boolean;
}): Promise<PagedResult<QualificationSummary>> {
  const pageSize = options?.pageSize ?? DIRECTORY_PAGE_SIZE;
  const cursor = options?.cursor ?? null;

  if (!cursor && !options?.forceRefresh) {
    const cached = await readPageCache<QualificationSummary>(QUAL_PAGE_CACHE_KEY);
    if (cached?.items?.length) {
      return {
        items: cached.items,
        nextCursor:
          cached.items.length >= pageSize
            ? {
                sortValue: cached.items[cached.items.length - 1].title,
                id: cached.items[cached.items.length - 1].id,
              }
            : null,
        fromCache: true,
      };
    }
  }

  try {
    const pageQuery = cursor
      ? query(
          collection(getDb(), QUALIFICATIONS),
          orderBy("title"),
          startAfter(cursor.sortValue),
          limit(pageSize),
        )
      : query(
          collection(getDb(), QUALIFICATIONS),
          orderBy("title"),
          limit(pageSize),
        );

    const snap = await getDocs(pageQuery);
    const items = snap.docs.map((docSnap) =>
      toQualificationSummary(mapQualification(docSnap.id, docSnap.data())),
    );

    if (!cursor) {
      await AsyncStorage.setItem(
        QUAL_PAGE_CACHE_KEY,
        JSON.stringify({ cachedAt: new Date().toISOString(), items }),
      );
    }

    const last = items[items.length - 1];
    return {
      items,
      nextCursor:
        items.length === pageSize && last
          ? { sortValue: last.title, id: last.id }
          : null,
      fromCache: false,
    };
  } catch (err) {
    if (!cursor) {
      const cached = await readPageCache<QualificationSummary>(QUAL_PAGE_CACHE_KEY);
      if (cached?.items?.length) {
        return {
          items: cached.items,
          nextCursor: null,
          fromCache: true,
        };
      }
    }
    throw new NcapDataError(
      "list-qualifications-failed",
      "Failed to load qualifications",
      { cause: err },
    );
  }
}

export async function getProviderPage(options?: {
  cursor?: PageCursor | null;
  pageSize?: number;
  forceRefresh?: boolean;
}): Promise<PagedResult<ProviderSummary>> {
  const pageSize = options?.pageSize ?? DIRECTORY_PAGE_SIZE;
  const cursor = options?.cursor ?? null;

  if (!cursor && !options?.forceRefresh) {
    const cached = await readPageCache<ProviderSummary>(PROVIDER_PAGE_CACHE_KEY);
    if (cached?.items?.length) {
      return {
        items: cached.items,
        nextCursor:
          cached.items.length >= pageSize
            ? {
                sortValue: cached.items[cached.items.length - 1].name,
                id: cached.items[cached.items.length - 1].id,
              }
            : null,
        fromCache: true,
      };
    }
  }

  try {
    const pageQuery = cursor
      ? query(
          collection(getDb(), PROVIDERS),
          orderBy("name"),
          startAfter(cursor.sortValue),
          limit(pageSize),
        )
      : query(
          collection(getDb(), PROVIDERS),
          orderBy("name"),
          limit(pageSize),
        );

    const snap = await getDocs(pageQuery);
    const items = snap.docs.map((docSnap) =>
      toProviderSummary(mapProvider(docSnap.id, docSnap.data())),
    );

    if (!cursor) {
      await AsyncStorage.setItem(
        PROVIDER_PAGE_CACHE_KEY,
        JSON.stringify({ cachedAt: new Date().toISOString(), items }),
      );
    }

    const last = items[items.length - 1];
    return {
      items,
      nextCursor:
        items.length === pageSize && last
          ? { sortValue: last.name, id: last.id }
          : null,
      fromCache: false,
    };
  } catch (err) {
    if (!cursor) {
      const cached = await readPageCache<ProviderSummary>(PROVIDER_PAGE_CACHE_KEY);
      if (cached?.items?.length) {
        return {
          items: cached.items,
          nextCursor: null,
          fromCache: true,
        };
      }
    }
    throw new NcapDataError(
      "list-providers-failed",
      "Failed to load providers",
      { cause: err },
    );
  }
}
