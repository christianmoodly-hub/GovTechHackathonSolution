import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BURSARY_INDEX_CACHE_KEY,
  BURSARY_PAGE_CACHE_KEY,
  PROVIDER_INDEX_CACHE_KEY,
  PROVIDER_PAGE_CACHE_KEY,
  QUAL_INDEX_CACHE_KEY,
  QUAL_PAGE_CACHE_KEY,
  getBursariesByField,
  getBursary,
  getBursaryPage,
  getOccupation,
  getOccupationSummaries,
  getProfile,
  getProvider,
  getProviderPage,
  getQualification,
  getQualificationPage,
} from "../ncapData";
import {
  getQuestionnaireDraft,
  readProfileMirror,
} from "../offlineProfile";
import { LEARNER_ROLES } from "../../data/staticContent";
import type {
  BursarySummary,
  OccupationSummary,
  ProviderSummary,
  QualificationSummary,
  QuestionnaireId,
  UserProfile,
} from "../types";
import { BURSARY_FIELD_FILTERS, closingUrgency } from "../../utils/bursaryPresentation";
import { params, str, int, bool, tool, toolError, type ToolRegistry } from "./types";

/** Keep tool responses small — long payloads cost latency on every turn. */
const MAX_HITS = 8;
const MAX_LIST_FIELD = 6;

function trimList(values: string[] | undefined, cap = MAX_LIST_FIELD): string[] {
  if (!values?.length) return [];
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, cap)
    .map((v) => (v.length > 240 ? `${v.slice(0, 237)}…` : v));
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asLimit(value: unknown, fallback = MAX_HITS): number {
  const n = typeof value === "number" ? Math.floor(value) : Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, MAX_HITS);
}

/**
 * Score a cached row against the query. Rows already carry a lowercased
 * `searchText`, so this is a substring/token match rather than a vector search:
 * it works offline and needs no extra infrastructure.
 */
function rank<T extends { searchText: string }>(
  rows: T[],
  query: string,
  titleOf: (row: T) => string,
  limit: number,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows.slice(0, limit);

  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  const scored: { row: T; score: number }[] = [];

  for (const row of rows) {
    const haystack = row.searchText || titleOf(row).toLowerCase();
    const title = titleOf(row).toLowerCase();
    let score = 0;

    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    if (haystack.includes(q)) score += 40;

    for (const token of tokens) {
      if (title.includes(token)) score += 8;
      else if (haystack.includes(token)) score += 3;
    }

    if (score > 0) scored.push({ row, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.row);
}

type IndexCache<T> = { cachedAt: string; items: T[] };

async function readIndex<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as IndexCache<T>).items ?? [];
  } catch {
    return [];
  }
}

/**
 * Widest set of rows we can search without a network round trip per keystroke:
 * the offline index if the vault was prepared, else the last directory page,
 * else one fresh page from Firestore.
 */
async function qualificationRows(): Promise<QualificationSummary[]> {
  const index = await readIndex<QualificationSummary>(QUAL_INDEX_CACHE_KEY);
  if (index.length) return index;
  const page = await readIndex<QualificationSummary>(QUAL_PAGE_CACHE_KEY);
  if (page.length) return page;
  const fresh = await getQualificationPage({ pageSize: 100 });
  return fresh.items;
}

async function providerRows(): Promise<ProviderSummary[]> {
  const index = await readIndex<ProviderSummary>(PROVIDER_INDEX_CACHE_KEY);
  if (index.length) return index;
  const page = await readIndex<ProviderSummary>(PROVIDER_PAGE_CACHE_KEY);
  if (page.length) return page;
  const fresh = await getProviderPage({ pageSize: 100 });
  return fresh.items;
}

async function bursaryRows(): Promise<BursarySummary[]> {
  const index = await readIndex<BursarySummary>(BURSARY_INDEX_CACHE_KEY);
  if (index.length) return index;
  const page = await readIndex<BursarySummary>(BURSARY_PAGE_CACHE_KEY);
  if (page.length) return page;
  const fresh = await getBursaryPage({ pageSize: 100 });
  return fresh.items;
}

function occupationHit(row: OccupationSummary) {
  return {
    id: row.occupationCode,
    title: row.title,
    alsoKnownAs: trimList(row.alternativeTitles, 3),
  };
}

function bursaryHit(row: BursarySummary) {
  return {
    id: row.id,
    title: row.title,
    field: row.fieldLabel,
    provider: row.providerName ?? undefined,
    closing: closingUrgency(row.closingDateIso, row.openAllYear, row.closingDate)
      .label,
  };
}

const FIELD_SLUGS = BURSARY_FIELD_FILTERS.filter((f) => f.id !== "all").map(
  (f) => f.id,
);

export const retrievalTools: ToolRegistry = Object.fromEntries([
  tool(
    "search_careers",
    "Search the DHET NCAP/SAQA occupation catalogue by job title, keyword or interest area. REQUIRED before answering anything about a career. Returns occupation ids you can pass to get_career or open_entity.",
    params(
      {
        query: str("What to search for, e.g. 'electrician', 'nursing', 'work with computers'."),
        limit: int("How many results to return, 1 to 8. Defaults to 8."),
      },
      ["query"],
    ),
    async (args) => {
      const query = asString(args.query);
      if (!query) return toolError("A search query is required.");

      const { summaries, fromCache } = await getOccupationSummaries();
      const hits = rank(summaries, query, (r) => r.title, asLimit(args.limit));

      return {
        ok: true,
        totalCatalogue: summaries.length,
        fromCache,
        matchCount: hits.length,
        results: hits.map(occupationHit),
      };
    },
  ),

  tool(
    "get_career",
    "Get the full detail of one occupation: what the work involves, entry requirements and the qualifications that lead to it. Only call with an id returned by search_careers.",
    params({ id: str("The occupation code from a search result.") }, ["id"]),
    async (args) => {
      const id = asString(args.id);
      if (!id) return toolError("An occupation id is required.");

      const occupation = await getOccupation(id);
      if (!occupation) {
        return { ok: false, found: false, error: `No occupation with id ${id}.` };
      }

      return {
        ok: true,
        found: true,
        id: occupation.occupationCode,
        title: occupation.title,
        alsoKnownAs: trimList(occupation.alternativeTitles, 4),
        dailyTasks: trimList(occupation.tasks),
        entryRequirements: trimList(occupation.entryRequirements),
        qualificationsThatLeadHere: occupation.qualifications
          .slice(0, MAX_LIST_FIELD)
          .map((q) => q.title)
          .filter(Boolean),
      };
    },
  ),

  tool(
    "search_qualifications",
    "Search qualifications (degrees, diplomas, certificates, NC(V) and NATED programmes) by name or subject. Returns qualification ids for get_qualification or open_entity.",
    params(
      {
        query: str("Qualification name or subject, e.g. 'civil engineering diploma'."),
        nqfLevel: str("Optional NQF level to keep only, e.g. '6'."),
        limit: int("How many results to return, 1 to 8."),
      },
      ["query"],
    ),
    async (args) => {
      const query = asString(args.query);
      if (!query) return toolError("A search query is required.");

      const rows = await qualificationRows();
      const nqf = asString(args.nqfLevel);
      const pool = nqf
        ? rows.filter((r) => (r.nqfLevel ?? "").includes(nqf))
        : rows;
      const hits = rank(pool, query, (r) => r.title, asLimit(args.limit));

      return {
        ok: true,
        searchedRows: pool.length,
        matchCount: hits.length,
        results: hits.map((row) => ({
          id: row.id,
          title: row.title,
          nqfLevel: row.nqfLevel ?? undefined,
          duration: row.duration ?? undefined,
          institutionsOffering: row.providerCount ?? undefined,
        })),
      };
    },
  ),

  tool(
    "get_qualification",
    "Get one qualification in full: NQF level, duration, SAQA id and which institutions offer it. Only call with an id from search_qualifications.",
    params({ id: str("The qualification id from a search result.") }, ["id"]),
    async (args) => {
      const id = asString(args.id);
      if (!id) return toolError("A qualification id is required.");

      const qualification = await getQualification(id);
      if (!qualification) {
        return { ok: false, found: false, error: `No qualification with id ${id}.` };
      }

      return {
        ok: true,
        found: true,
        id: qualification.id,
        title: qualification.title,
        nqfLevel: qualification.nqfLevel ?? undefined,
        duration: qualification.duration ?? undefined,
        saqaId: qualification.qualificationId ?? undefined,
        institutionsOffering: qualification.providers
          .slice(0, MAX_LIST_FIELD)
          .map((p) => p.name)
          .filter(Boolean),
        totalInstitutions: qualification.providers.length,
      };
    },
  ),

  tool(
    "search_institutions",
    "Search the DHET register of public universities and TVET colleges by name, city or province. Returns institution ids for get_institution or open_entity.",
    params(
      {
        query: str("Institution name, city or province, e.g. 'Tshwane', 'Western Cape'."),
        limit: int("How many results to return, 1 to 8."),
      },
      ["query"],
    ),
    async (args) => {
      const query = asString(args.query);
      if (!query) return toolError("A search query is required.");

      const rows = await providerRows();
      const hits = rank(rows, query, (r) => r.name, asLimit(args.limit));

      return {
        ok: true,
        searchedRows: rows.length,
        matchCount: hits.length,
        results: hits.map((row) => ({
          id: row.id,
          name: row.name,
          address: row.streetAddress ?? undefined,
        })),
      };
    },
  ),

  tool(
    "get_institution",
    "Get one institution in full: contact details, address and the qualifications it offers. Only call with an id from search_institutions.",
    params({ id: str("The institution id from a search result.") }, ["id"]),
    async (args) => {
      const id = asString(args.id);
      if (!id) return toolError("An institution id is required.");

      const provider = await getProvider(id);
      if (!provider) {
        return { ok: false, found: false, error: `No institution with id ${id}.` };
      }

      return {
        ok: true,
        found: true,
        id: provider.id,
        name: provider.name,
        telephone: provider.telephone ?? undefined,
        email: provider.email ?? undefined,
        website: provider.website ?? undefined,
        address: provider.streetAddress ?? undefined,
        qualificationsOffered: provider.offeredQualifications
          .slice(0, MAX_LIST_FIELD)
          .map((q) => q.title)
          .filter(Boolean),
        totalQualificationsOffered: provider.offeredQualifications.length,
      };
    },
  ),

  tool(
    "search_bursaries",
    "Search bursaries and study funding in the DHET NCAP catalogue by keyword, study field or closing status. REQUIRED before answering any funding question. Returns bursary ids for get_bursary or open_entity.",
    params(
      {
        query: str("Keyword, provider or study area, e.g. 'engineering', 'NSFAS', 'teaching'."),
        field: str("Optional study field to restrict to.", { enum: FIELD_SLUGS }),
        onlyOpen: bool("True to exclude bursaries whose closing date has passed. Defaults to true."),
        limit: int("How many results to return, 1 to 8."),
      },
      ["query"],
    ),
    async (args) => {
      const query = asString(args.query);
      const field = asString(args.field);
      const onlyOpen = args.onlyOpen === undefined ? true : Boolean(args.onlyOpen);
      const limit = asLimit(args.limit);

      if (!query && !field) {
        return toolError("Give either a query or a field to search bursaries.");
      }

      const today = new Date().toISOString().slice(0, 10);
      let rows: BursarySummary[];

      if (field) {
        rows = await getBursariesByField(field, { limit: Math.max(limit * 3, 24) });
      } else {
        rows = await bursaryRows();
      }

      if (onlyOpen) {
        rows = rows.filter(
          (r) => r.openAllYear || !r.closingDateIso || r.closingDateIso >= today,
        );
      }

      const hits = query
        ? rank(rows, query, (r) => r.title, limit)
        : rows
            .slice()
            .sort((a, b) => a.closingSortKey.localeCompare(b.closingSortKey))
            .slice(0, limit);

      return {
        ok: true,
        searchedRows: rows.length,
        matchCount: hits.length,
        onlyOpen,
        results: hits.map(bursaryHit),
      };
    },
  ),

  tool(
    "get_bursary",
    "Get one bursary in full: who qualifies, closing date, documents needed, how to apply and who to contact. Only call with an id from search_bursaries.",
    params({ id: str("The bursary id from a search result.") }, ["id"]),
    async (args) => {
      const id = asString(args.id);
      if (!id) return toolError("A bursary id is required.");

      const bursary = await getBursary(id);
      if (!bursary) {
        return { ok: false, found: false, error: `No bursary with id ${id}.` };
      }

      const urgency = closingUrgency(
        bursary.closingDateIso,
        bursary.openAllYear,
        bursary.closingDate,
      );

      return {
        ok: true,
        found: true,
        id: bursary.id,
        title: bursary.title,
        field: bursary.fieldLabel,
        provider: bursary.providerName ?? undefined,
        summary: bursary.description
          ? bursary.description.slice(0, 600)
          : undefined,
        closing: urgency.label,
        closingDate: bursary.closingDateIso ?? bursary.closingDate ?? undefined,
        stillOpen: urgency.tone !== "closed",
        whoQualifies: trimList(bursary.eligibility),
        documentsNeeded: trimList(bursary.requiredDocuments),
        howToApply: trimList(bursary.applicationSteps),
        applicationLink: bursary.applicationLink ?? undefined,
        contactEmail: bursary.contactEmail ?? undefined,
        contactPhone: bursary.contactPhone ?? undefined,
      };
    },
  ),

  tool(
    "list_bursary_fields",
    "List the study fields bursaries are grouped under, with the slug to pass to search_bursaries or set_filter.",
    null,
    async () => ({
      ok: true,
      fields: BURSARY_FIELD_FILTERS.filter((f) => f.id !== "all").map((f) => ({
        slug: f.id,
        label: f.label,
      })),
    }),
  ),
]);

const QUESTIONNAIRE_IDS: QuestionnaireId[] = [
  "subjectChooser",
  "careerChoice",
  "jobFit",
];

const QUESTIONNAIRE_LABELS: Record<QuestionnaireId, string> = {
  subjectChooser: "Subject chooser",
  careerChoice: "Career interest profiler",
  jobFit: "Job fit",
};

function roleLabel(role: string | null | undefined): string | undefined {
  if (!role) return undefined;
  const hit = LEARNER_ROLES.find((r) => r.id === role);
  return hit?.label ?? role;
}

/**
 * Profile lookups need the signed-in uid, so they are built per session rather
 * than living in the static registry. Falls back to the device mirror so the
 * assistant can still personalise while offline.
 */
export function createProfileTools(uid: string | null): ToolRegistry {
  return Object.fromEntries([
    tool(
      "get_my_profile",
      "Get what this app already knows about the user: their role or grade, preferred language, saved favourites, and which questionnaires they have finished or left part-done. Call this before giving personalised advice or suggesting a next step.",
      null,
      async () => {
        if (!uid) {
          return {
            ok: true,
            signedIn: false,
            note: "No profile yet. Suggest signing in to save results.",
          };
        }

        let profile: UserProfile | null = null;
        try {
          profile = await getProfile(uid);
        } catch {
          profile = null;
        }
        if (!profile) profile = await readProfileMirror(uid);

        const completed: string[] = [];
        const inProgress: string[] = [];
        for (const id of QUESTIONNAIRE_IDS) {
          if (profile?.questionnaireResults?.[id]) {
            completed.push(QUESTIONNAIRE_LABELS[id]);
            continue;
          }
          const draft = await getQuestionnaireDraft(uid, id).catch(() => null);
          if (draft) inProgress.push(QUESTIONNAIRE_LABELS[id]);
        }

        const topMatches = QUESTIONNAIRE_IDS.flatMap((id) => {
          const result = profile?.questionnaireResults?.[id];
          if (!result) return [];
          return result.matches.slice(0, 3).map((m) => ({
            from: QUESTIONNAIRE_LABELS[id],
            careerId: m.occupationCode,
            title: m.title,
          }));
        });

        return {
          ok: true,
          signedIn: true,
          name: profile?.demographics?.fullName ?? undefined,
          role: roleLabel(profile?.demographics?.role),
          province: profile?.demographics?.province ?? undefined,
          preferredLanguage: profile?.demographics?.preferredLanguage ?? undefined,
          questionnairesCompleted: completed,
          questionnairesInProgress: inProgress,
          suggestedCareersFromQuestionnaires: topMatches,
          savedItems: (profile?.favourites ?? []).slice(0, 10).map((f) => ({
            type: f.type,
            id: f.entityId ?? undefined,
            title: f.title,
          })),
          savedItemCount: profile?.favourites?.length ?? 0,
        };
      },
    ),
  ]);
}
