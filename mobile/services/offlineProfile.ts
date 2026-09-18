import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ProfileUpdate,
  QuestionnaireId,
  UserProfile,
} from "./types";

const mirrorKey = (uid: string) => `ncap.profileMirror.v1:${uid}`;
const outboxKey = (uid: string) => `ncap.profileOutbox.v1:${uid}`;
const draftsKey = (uid: string) => `ncap.questionnaireDrafts.v1:${uid}`;
const HELPLINE_OUTBOX_KEY = "ncap.helplineOutbox.v1";

export type ProfileOutboxOp = {
  id: string;
  createdAt: string;
  patch: ProfileUpdate;
};

export type QuestionnaireDraft = {
  questionnaireId: string;
  resultKey: QuestionnaireId | string;
  answers: Record<string, string>;
  step: number;
  updatedAt: string;
};

export type HelplineOutboxItem = {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  province: string;
  topic: string;
  message: string;
};

function emptyProfile(uid: string): UserProfile {
  return {
    id: uid,
    questionnaireResults: {},
    favourites: [],
    demographics: null,
    pushToken: null,
  };
}

export function applyProfilePatch(
  base: UserProfile,
  patch: ProfileUpdate,
): UserProfile {
  return {
    ...base,
    ...(patch.questionnaireResults !== undefined
      ? { questionnaireResults: patch.questionnaireResults }
      : {}),
    ...(patch.favourites !== undefined ? { favourites: patch.favourites } : {}),
    ...(patch.demographics !== undefined
      ? { demographics: patch.demographics }
      : {}),
    ...(patch.pushToken !== undefined ? { pushToken: patch.pushToken } : {}),
    updatedAt: new Date().toISOString(),
  };
}

export async function readProfileMirror(
  uid: string,
): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(mirrorKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed?.id) return null;
    return {
      ...emptyProfile(uid),
      ...parsed,
      id: uid,
      questionnaireResults: parsed.questionnaireResults ?? {},
      favourites: Array.isArray(parsed.favourites) ? parsed.favourites : [],
    };
  } catch {
    return null;
  }
}

export async function writeProfileMirror(
  uid: string,
  profile: UserProfile,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      mirrorKey(uid),
      JSON.stringify({ ...profile, id: uid }),
    );
  } catch {
    // Ignore mirror write failures
  }
}

export async function readOutbox(uid: string): Promise<ProfileOutboxOp[]> {
  try {
    const raw = await AsyncStorage.getItem(outboxKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProfileOutboxOp[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOutbox(uid: string, ops: ProfileOutboxOp[]): Promise<void> {
  await AsyncStorage.setItem(outboxKey(uid), JSON.stringify(ops));
}

export async function enqueueProfileOutbox(
  uid: string,
  patch: ProfileUpdate,
): Promise<void> {
  const ops = await readOutbox(uid);
  ops.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    patch,
  });
  await writeOutbox(uid, ops);
}

export async function clearOutbox(uid: string): Promise<void> {
  await AsyncStorage.setItem(outboxKey(uid), JSON.stringify([]));
}

export async function removeOutboxOps(
  uid: string,
  ids: string[],
): Promise<void> {
  const set = new Set(ids);
  const ops = await readOutbox(uid);
  await writeOutbox(
    uid,
    ops.filter((op) => !set.has(op.id)),
  );
}

export async function outboxPendingCount(uid: string): Promise<number> {
  return (await readOutbox(uid)).length;
}

/** Merge pending outbox patches onto a base profile (local wins). */
export async function resolveLocalProfile(
  uid: string,
  remote: UserProfile | null,
): Promise<UserProfile> {
  const mirror = await readProfileMirror(uid);
  const base = mirror ?? remote ?? emptyProfile(uid);
  const ops = await readOutbox(uid);
  return ops.reduce(
    (acc, op) => applyProfilePatch(acc, op.patch),
    remote && !ops.length ? remote : base,
  );
}

// --- Questionnaire drafts ---

async function readDraftsMap(
  uid: string,
): Promise<Record<string, QuestionnaireDraft>> {
  try {
    const raw = await AsyncStorage.getItem(draftsKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, QuestionnaireDraft>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveQuestionnaireDraft(
  uid: string,
  draft: Omit<QuestionnaireDraft, "updatedAt">,
): Promise<void> {
  const map = await readDraftsMap(uid);
  map[draft.resultKey] = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(draftsKey(uid), JSON.stringify(map));
}

export async function getQuestionnaireDraft(
  uid: string,
  resultKey: string,
): Promise<QuestionnaireDraft | null> {
  const map = await readDraftsMap(uid);
  return map[resultKey] ?? null;
}

export async function clearQuestionnaireDraft(
  uid: string,
  resultKey: string,
): Promise<void> {
  const map = await readDraftsMap(uid);
  if (!(resultKey in map)) return;
  delete map[resultKey];
  await AsyncStorage.setItem(draftsKey(uid), JSON.stringify(map));
}

// --- Helpline outbox ---

export async function readHelplineOutbox(): Promise<HelplineOutboxItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HELPLINE_OUTBOX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HelplineOutboxItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function enqueueHelplineSubmission(
  item: Omit<HelplineOutboxItem, "id" | "createdAt">,
): Promise<HelplineOutboxItem> {
  const entry: HelplineOutboxItem = {
    ...item,
    id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const items = await readHelplineOutbox();
  items.push(entry);
  await AsyncStorage.setItem(HELPLINE_OUTBOX_KEY, JSON.stringify(items));
  return entry;
}

export async function clearHelplineOutbox(): Promise<void> {
  await AsyncStorage.setItem(HELPLINE_OUTBOX_KEY, JSON.stringify([]));
}

/**
 * "Flush" helpline queue — no backend endpoint yet, so we clear after
 * acknowledging local persistence when online (demo sync).
 */
export async function flushHelplineOutbox(): Promise<number> {
  const items = await readHelplineOutbox();
  if (!items.length) return 0;
  await clearHelplineOutbox();
  return items.length;
}
