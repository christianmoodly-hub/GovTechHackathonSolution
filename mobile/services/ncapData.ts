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
  type Query,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getDb } from "../firebase/client";
import {
  applyProfilePatch,
  clearOutbox,
  enqueueProfileOutbox,
  readOutbox,
  readProfileMirror,
  removeOutboxOps,
  writeProfileMirror,
} from "./offlineProfile";
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
export const OCC_INDEX_CACHE_KEY = "ncap.occupationSummaries.v1";
export const QUAL_PAGE_CACHE_KEY = "ncap.qualificationPage.v1";
export const PROVIDER_PAGE_CACHE_KEY = "ncap.providerPage.v1";
export const QUAL_INDEX_CACHE_KEY = "ncap.qualificationIndex.v1";
export const PROVIDER_INDEX_CACHE_KEY = "ncap.providerIndex.v1";
const PAGE_SIZE = 100;
const DIRECTORY_PAGE_SIZE = 40;
/** Cap offline pack indexes to keep low-data downloads reasonable. */
const OFFLINE_INDEX_CAP = 300;

function entityCacheKey(
  type: "occupation" | "qualification" | "provider",
  id: string,
): string {
  return `ncap.entity.${type}.${id}.v1`;
}

async function readEntityCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeEntityCache(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore cache write failures
  }
}

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

function emptyLocalProfile(uid: string): UserProfile {
  return {
    id: uid,
    questionnaireResults: {},
    favourites: [],
    demographics: null,
    pushToken: null,
  };
}

async function fetchProfileRemote(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getDb(), PROFILES, uid));
  if (!snap.exists()) return null;
  return mapProfile(snap.id, snap.data());
}

/**
 * Load profile: prefer local mirror when outbox has pending writes;
 * otherwise fetch Firestore and refresh the mirror. Falls back to mirror offline.
 */
export async function getProfile(uid: string): Promise<UserProfile | null> {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Profile uid is required");
  }

  const pending = await readOutbox(trimmed);
  if (pending.length) {
    const mirror = await readProfileMirror(trimmed);
    if (mirror) return mirror;
  }

  try {
    const remote = await fetchProfileRemote(trimmed);
    if (remote) {
      await writeProfileMirror(trimmed, remote);
      return remote;
    }
    return await readProfileMirror(trimmed);
  } catch (err) {
    const mirror = await readProfileMirror(trimmed);
    if (mirror) return mirror;
    throw new NcapDataError(
      "get-profile-failed",
      `Failed to load profile ${trimmed}`,
      { cause: err },
    );
  }
}

/** Create profiles/{uid} once on first sign-in if missing. Offline → local mirror. */
export async function ensureProfile(uid: string): Promise<UserProfile> {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Profile uid is required");
  }

  try {
    const existing = await fetchProfileRemote(trimmed);
    if (existing) {
      const pending = await readOutbox(trimmed);
      if (pending.length) {
        const local = pending.reduce(
          (acc, op) => applyProfilePatch(acc, op.patch),
          existing,
        );
        await writeProfileMirror(trimmed, local);
        return local;
      }
      await writeProfileMirror(trimmed, existing);
      return existing;
    }

    const ref = doc(getDb(), PROFILES, trimmed);
    const payload: DocumentData = {
      questionnaireResults: {},
      favourites: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, payload, { merge: true });
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new NcapDataError(
        "profile-missing-after-write",
        "Profile bootstrap succeeded but document is missing",
      );
    }
    const created = mapProfile(snap.id, snap.data());
    await writeProfileMirror(trimmed, created);
    return created;
  } catch (err) {
    if (err instanceof NcapDataError && err.code === "profile-missing-after-write") {
      throw err;
    }
    const mirror = await readProfileMirror(trimmed);
    if (mirror) return mirror;
    const local = emptyLocalProfile(trimmed);
    await writeProfileMirror(trimmed, local);
    console.warn("[ncapData] ensureProfile offline fallback", trimmed, err);
    return local;
  }
}

async function writeProfileRemote(
  uid: string,
  data: ProfileUpdate,
  base: UserProfile,
): Promise<UserProfile> {
  const ref = doc(getDb(), PROFILES, uid);
  const payload: DocumentData = {
    questionnaireResults:
      data.questionnaireResults !== undefined
        ? data.questionnaireResults
        : (base.questionnaireResults ?? {}),
    favourites:
      data.favourites !== undefined ? data.favourites : (base.favourites ?? []),
    updatedAt: serverTimestamp(),
  };

  if (data.demographics !== undefined) {
    payload.demographics =
      data.demographics === null ? null : stripUndefinedDeep(data.demographics);
  } else if (base.demographics !== undefined) {
    payload.demographics =
      base.demographics === null
        ? null
        : stripUndefinedDeep(base.demographics);
  }
  if (data.pushToken !== undefined) {
    payload.pushToken = data.pushToken;
  } else if (base.pushToken !== undefined) {
    payload.pushToken = base.pushToken;
  }

  payload.createdAt = base.createdAt ?? serverTimestamp();

  await setDoc(ref, payload, { merge: true });
  const refreshed = await getDoc(ref);
  if (!refreshed.exists()) {
    throw new NcapDataError(
      "profile-missing-after-write",
      "Profile write succeeded but document is missing",
    );
  }
  return mapProfile(refreshed.id, refreshed.data());
}

/**
 * Local-first profile update: mirror + Auth UI update immediately;
 * Firestore write or outbox enqueue when offline / failed.
 */
export async function updateProfile(
  uid: string,
  data: ProfileUpdate,
): Promise<UserProfile> {
  const trimmed = uid.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Profile uid is required");
  }

  const mirror =
    (await readProfileMirror(trimmed)) ?? emptyLocalProfile(trimmed);
  const local = applyProfilePatch(mirror, data);
  await writeProfileMirror(trimmed, local);

  try {
    const remote = await writeProfileRemote(trimmed, data, local);
    await writeProfileMirror(trimmed, remote);
    return remote;
  } catch (err) {
    console.warn("[ncapData] updateProfile queued for sync", trimmed, err);
    await enqueueProfileOutbox(trimmed, data);
    return local;
  }
}

/** Push pending profile outbox ops to Firestore. Returns number flushed. */
export async function flushProfileOutbox(uid: string): Promise<number> {
  const trimmed = uid.trim();
  if (!trimmed) return 0;
  const ops = await readOutbox(trimmed);
  if (!ops.length) return 0;

  let base =
    (await readProfileMirror(trimmed)) ?? emptyLocalProfile(trimmed);
  const flushed: string[] = [];

  for (const op of ops) {
    try {
      base = applyProfilePatch(base, op.patch);
      base = await writeProfileRemote(trimmed, op.patch, base);
      flushed.push(op.id);
    } catch (err) {
      console.warn("[ncapData] flushProfileOutbox stopped", op.id, err);
      break;
    }
  }

  if (flushed.length === ops.length) {
    await clearOutbox(trimmed);
  } else if (flushed.length) {
    await removeOutboxOps(trimmed, flushed);
  }
  await writeProfileMirror(trimmed, base);
  return flushed.length;
}

export async function getOccupation(code: string): Promise<Occupation | null> {
  const trimmed = code.trim();
  if (!trimmed) {
    throw new NcapDataError("invalid-argument", "Occupation code is required");
  }

  const cacheKey = entityCacheKey("occupation", trimmed);
  try {
    const snap = await getDoc(doc(getDb(), OCCUPATIONS, trimmed));
    if (!snap.exists()) return null;
    const occupation = mapOccupation(snap.id, snap.data());
    await writeEntityCache(cacheKey, occupation);
    return occupation;
  } catch (err) {
    const cached = await readEntityCache<Occupation>(cacheKey);
    if (cached) return cached;
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
      const pageQuery: Query = lastDoc
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
  const cacheKey = entityCacheKey("qualification", trimmed);
  try {
    const snap = await getDoc(doc(getDb(), QUALIFICATIONS, trimmed));
    if (!snap.exists()) return null;
    const qualification = mapQualification(snap.id, snap.data());
    await writeEntityCache(cacheKey, qualification);
    return qualification;
  } catch (err) {
    const cached = await readEntityCache<Qualification>(cacheKey);
    if (cached) return cached;
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
  const cacheKey = entityCacheKey("provider", trimmed);
  try {
    const snap = await getDoc(doc(getDb(), PROVIDERS, trimmed));
    if (!snap.exists()) return null;
    const provider = mapProvider(snap.id, snap.data());
    await writeEntityCache(cacheKey, provider);
    return provider;
  } catch (err) {
    const cached = await readEntityCache<Provider>(cacheKey);
    if (cached) return cached;
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
 * Toggle a favourite on the profile. Prefetches entity detail when adding.
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

  if (!exists && item.entityId) {
    void (async () => {
      try {
        if (item.type === "occupation") await getOccupation(item.entityId!);
        else if (item.type === "qualification")
          await getQualification(item.entityId!);
        else await getProvider(item.entityId!);
      } catch {
        // Best-effort prefetch
      }
    })();
  }

  return { favourites, added: !exists };
}

function toQualificationSummary(
  qualification: Qualification,
): QualificationSummary {
  const qualificationId =
    qualification.qualificationId ??
    qualification.generalQualificationId ??
    null;
  return {
    id: qualification.id,
    title: qualification.title,
    nqfLevel: qualification.nqfLevel ?? null,
    duration: qualification.duration ?? null,
    qualificationId,
    providerCount: qualification.providers?.length ?? 0,
    searchText: [
      qualification.title,
      qualification.nqfLevel ?? "",
      qualificationId ?? "",
    ]
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
    const index = await readPageCache<QualificationSummary>(QUAL_INDEX_CACHE_KEY);
    if (index?.items?.length) {
      const page = index.items.slice(0, pageSize);
      const last = page[page.length - 1];
      return {
        items: page,
        nextCursor:
          index.items.length > pageSize && last
            ? { sortValue: last.title, id: last.id }
            : null,
        fromCache: true,
      };
    }
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
      const index = await readPageCache<QualificationSummary>(QUAL_INDEX_CACHE_KEY);
      if (index?.items?.length) {
        return {
          items: index.items.slice(0, pageSize),
          nextCursor: null,
          fromCache: true,
        };
      }
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
    const index = await readPageCache<ProviderSummary>(PROVIDER_INDEX_CACHE_KEY);
    if (index?.items?.length) {
      const page = index.items.slice(0, pageSize);
      const last = page[page.length - 1];
      return {
        items: page,
        nextCursor:
          index.items.length > pageSize && last
            ? { sortValue: last.name, id: last.id }
            : null,
        fromCache: true,
      };
    }
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
      const index = await readPageCache<ProviderSummary>(PROVIDER_INDEX_CACHE_KEY);
      if (index?.items?.length) {
        return {
          items: index.items.slice(0, pageSize),
          nextCursor: null,
          fromCache: true,
        };
      }
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

/** Prefetch up to OFFLINE_INDEX_CAP qualifications into the offline index. */
export async function prefetchQualificationIndex(options?: {
  cap?: number;
}): Promise<{ count: number; cachedAt: string }> {
  const cap = options?.cap ?? OFFLINE_INDEX_CAP;
  const items: QualificationSummary[] = [];
  let lastDoc: QueryDocumentSnapshot | null = null;

  while (items.length < cap) {
    const take = Math.min(PAGE_SIZE, cap - items.length);
    const pageQuery: Query = lastDoc
      ? query(
          collection(getDb(), QUALIFICATIONS),
          orderBy("title"),
          startAfter(lastDoc),
          limit(take),
        )
      : query(
          collection(getDb(), QUALIFICATIONS),
          orderBy("title"),
          limit(take),
        );
    const snap = await getDocs(pageQuery);
    if (snap.empty) break;
    for (const docSnap of snap.docs) {
      items.push(toQualificationSummary(mapQualification(docSnap.id, docSnap.data())));
    }
    lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    if (snap.size < take) break;
  }

  const cachedAt = new Date().toISOString();
  await AsyncStorage.setItem(
    QUAL_INDEX_CACHE_KEY,
    JSON.stringify({ cachedAt, items }),
  );
  await AsyncStorage.setItem(
    QUAL_PAGE_CACHE_KEY,
    JSON.stringify({ cachedAt, items: items.slice(0, DIRECTORY_PAGE_SIZE) }),
  );
  return { count: items.length, cachedAt };
}

/** Prefetch up to OFFLINE_INDEX_CAP providers into the offline index. */
export async function prefetchProviderIndex(options?: {
  cap?: number;
}): Promise<{ count: number; cachedAt: string }> {
  const cap = options?.cap ?? OFFLINE_INDEX_CAP;
  const items: ProviderSummary[] = [];
  let lastDoc: QueryDocumentSnapshot | null = null;

  while (items.length < cap) {
    const take = Math.min(PAGE_SIZE, cap - items.length);
    const pageQuery: Query = lastDoc
      ? query(
          collection(getDb(), PROVIDERS),
          orderBy("name"),
          startAfter(lastDoc),
          limit(take),
        )
      : query(
          collection(getDb(), PROVIDERS),
          orderBy("name"),
          limit(take),
        );
    const snap = await getDocs(pageQuery);
    if (snap.empty) break;
    for (const docSnap of snap.docs) {
      items.push(toProviderSummary(mapProvider(docSnap.id, docSnap.data())));
    }
    lastDoc = snap.docs[snap.docs.length - 1] ?? null;
    if (snap.size < take) break;
  }

  const cachedAt = new Date().toISOString();
  await AsyncStorage.setItem(
    PROVIDER_INDEX_CACHE_KEY,
    JSON.stringify({ cachedAt, items }),
  );
  await AsyncStorage.setItem(
    PROVIDER_PAGE_CACHE_KEY,
    JSON.stringify({ cachedAt, items: items.slice(0, DIRECTORY_PAGE_SIZE) }),
  );
  return { count: items.length, cachedAt };
}

export async function readCachedOccupationCount(): Promise<number> {
  const cached = await AsyncStorage.getItem(OCC_INDEX_CACHE_KEY);
  if (!cached) return 0;
  try {
    const parsed = JSON.parse(cached) as { summaries?: unknown[] };
    return parsed.summaries?.length ?? 0;
  } catch {
    return 0;
  }
}

export async function readCachedQualificationCount(): Promise<number> {
  const index = await readPageCache<QualificationSummary>(QUAL_INDEX_CACHE_KEY);
  if (index?.items?.length) return index.items.length;
  const page = await readPageCache<QualificationSummary>(QUAL_PAGE_CACHE_KEY);
  return page?.items?.length ?? 0;
}

export async function readCachedProviderCount(): Promise<number> {
  const index = await readPageCache<ProviderSummary>(PROVIDER_INDEX_CACHE_KEY);
  if (index?.items?.length) return index.items.length;
  const page = await readPageCache<ProviderSummary>(PROVIDER_PAGE_CACHE_KEY);
  return page?.items?.length ?? 0;
}
