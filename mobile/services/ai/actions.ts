import {
  getBursary,
  getOccupation,
  getProvider,
  getQualification,
  toggleFavourite,
} from "../ncapData";
import type { FavouriteRef, UserProfile } from "../types";
import { APP_LOCALES, LOCALE_LABELS, isAppLocale, type AppLocale } from "../../i18n/types";
import { HELPLINE } from "../../data/staticContent";
import {
  ASSISTANT_SCREENS,
  ASSISTANT_SCREEN_IDS,
  describePath,
  entityPath,
  isAssistantEntityType,
  isAssistantScreenId,
  type AssistantEntityType,
  type AssistantScreenId,
} from "./routes";
import type { ScreenActionRegistry } from "./screenActions";
import {
  bool,
  int,
  params,
  str,
  tool,
  toolError,
  type ToolRegistry,
} from "./types";

/** Everything the action tools need from the running app. */
export type ActionHost = {
  navigate: (path: string) => void;
  goBack: () => boolean;
  currentPath: () => string;
  screens: ScreenActionRegistry;
  setLocale: (locale: AppLocale) => void;
  currentLocale: () => AppLocale;
  setHighContrast: (on: boolean) => void;
  setTextZoom: (level: 0 | 1 | 2) => void;
  uid: () => string | null;
  profile: () => UserProfile | null;
  applyProfile: (profile: UserProfile) => void;
  /** Ask the user to confirm before leaving the app. Resolves false on decline. */
  confirmLeaveApp: (what: string) => Promise<boolean>;
  openExternal: (url: string) => Promise<void>;
};

const ENTITY_LABELS: Record<AssistantEntityType, string> = {
  occupation: "career",
  qualification: "qualification",
  provider: "institution",
  bursary: "bursary",
};

async function loadEntity(
  type: AssistantEntityType,
  id: string,
): Promise<{ title: string; url: string } | null> {
  if (type === "occupation") {
    const hit = await getOccupation(id);
    return hit ? { title: hit.title, url: hit.url } : null;
  }
  if (type === "qualification") {
    const hit = await getQualification(id);
    return hit ? { title: hit.title, url: hit.url } : null;
  }
  if (type === "provider") {
    const hit = await getProvider(id);
    return hit ? { title: hit.name, url: hit.url } : null;
  }
  const hit = await getBursary(id);
  return hit ? { title: hit.title, url: hit.url } : null;
}

/**
 * Favourites are keyed by URL, and list screens use an `ncap://` alias while
 * detail screens use the catalogue URL. Match either so the assistant unsaves
 * the row the user actually saved.
 */
function findExistingFavourite(
  favourites: FavouriteRef[],
  type: AssistantEntityType,
  id: string,
  canonicalUrl: string,
): FavouriteRef | undefined {
  const alias = `ncap://${type}/${id}`;
  return favourites.find(
    (fav) =>
      fav.url === canonicalUrl ||
      fav.url === alias ||
      (fav.type === type && fav.entityId === id),
  );
}

export function createActionTools(host: ActionHost): ToolRegistry {
  const screen = () => host.screens.current();

  return Object.fromEntries([
    tool(
      "navigate",
      "Move the user to one of the app's screens. Prefer doing this over describing where a screen is.",
      params(
        {
          screen: str("Which screen to open.", { enum: ASSISTANT_SCREEN_IDS }),
        },
        ["screen"],
      ),
      async (args) => {
        const id = args.screen;
        if (!isAssistantScreenId(id)) {
          return toolError(
            `Unknown screen. Choose one of: ${ASSISTANT_SCREEN_IDS.join(", ")}.`,
          );
        }
        const def = ASSISTANT_SCREENS[id];
        host.navigate(def.path);
        return { ok: true, openedScreen: id, screenName: def.label };
      },
    ),

    tool(
      "open_entity",
      "Open the detail page for one career, qualification, institution or bursary. Only use an id that came from a search tool.",
      params(
        {
          type: str("What kind of thing to open.", {
            enum: ["occupation", "qualification", "provider", "bursary"],
          }),
          id: str("The id from a search result."),
        },
        ["type", "id"],
      ),
      async (args) => {
        const type = args.type;
        const id = String(args.id ?? "").trim();
        if (!isAssistantEntityType(type)) {
          return toolError("type must be occupation, qualification, provider or bursary.");
        }
        if (!id) return toolError("An id is required.");

        const entity = await loadEntity(type, id);
        if (!entity) {
          return {
            ok: false,
            found: false,
            error: `No ${ENTITY_LABELS[type]} with id ${id}. Search again before opening.`,
          };
        }

        host.navigate(entityPath(type, id));
        return { ok: true, opened: ENTITY_LABELS[type], title: entity.title };
      },
    ),

    tool(
      "go_back",
      "Go back to the previous screen.",
      null,
      async () => {
        const moved = host.goBack();
        return moved
          ? { ok: true, wentBack: true, nowOn: describePath(host.currentPath()) }
          : { ok: true, wentBack: false, note: "Already at the first screen." };
      },
    ),

    tool(
      "describe_screen",
      "Describe what is on the screen the user is looking at right now, including how many results are showing. Call this when the user asks what is on screen, where they are, or to read it out.",
      null,
      async () => {
        const active = screen();
        const path = host.currentPath();
        if (!active) {
          return {
            ok: true,
            screenName: describePath(path),
            description: `The user is on ${describePath(path)}. This screen has not registered any detail for reading out.`,
          };
        }
        const rows = active.results?.() ?? [];
        const question = active.currentQuestion?.();
        return {
          ok: true,
          screenName: active.title,
          description: active.describe(),
          searchQuery: active.currentQuery?.() || undefined,
          appliedFilters: active.filters?.map((f) => ({
            name: f.name,
            value:
              f.options.find((o) => o.value === f.current)?.label ?? f.current,
          })),
          visibleResultCount: rows.length,
          firstResults: rows.slice(0, 3).map((r, i) => ({
            position: i + 1,
            title: r.title,
          })),
          currentQuestion: question
            ? {
                prompt: question.prompt,
                options: question.options.map((o, i) => ({
                  position: i + 1,
                  id: o.id,
                  label: o.label,
                })),
              }
            : undefined,
        };
      },
    ),

    tool(
      "search_in_list",
      "Type a search term into the search box on the screen the user is on. Use this to narrow a directory list rather than searching in the background.",
      params({ query: str("What to type into the search box.") }, ["query"]),
      async (args) => {
        const active = screen();
        if (!active?.setQuery) {
          return toolError(
            `The ${describePath(host.currentPath())} has no search box. Navigate to a directory screen first.`,
          );
        }
        const query = String(args.query ?? "").trim();
        active.setQuery(query);
        return {
          ok: true,
          searchedFor: query,
          onScreen: active.title,
          note: "Results update on screen. Call list_visible_results to read them.",
        };
      },
    ),

    tool(
      "set_filter",
      "Change a filter on the screen the user is on. Call describe_screen first if you are unsure which filters exist or what they are set to.",
      params(
        {
          name: str("Which filter to change, as reported by describe_screen."),
          value: str("The value to set it to."),
        },
        ["name", "value"],
      ),
      async (args) => {
        const active = screen();
        const name = String(args.name ?? "").trim().toLowerCase();
        const value = String(args.value ?? "").trim();

        if (!active?.filters?.length) {
          return toolError(
            `The ${describePath(host.currentPath())} has no filters.`,
          );
        }

        const filter = active.filters.find((f) => f.name.toLowerCase() === name);
        if (!filter) {
          return toolError(
            `No filter called "${name}". Available: ${active.filters.map((f) => f.name).join(", ")}.`,
          );
        }

        const option =
          filter.options.find((o) => o.value === value) ??
          filter.options.find(
            (o) => o.label.toLowerCase() === value.toLowerCase(),
          );
        if (!option) {
          return toolError(
            `"${value}" is not a valid ${filter.name}. Options: ${filter.options
              .map((o) => o.label)
              .join(", ")}.`,
          );
        }

        filter.apply(option.value);
        return { ok: true, filter: filter.name, setTo: option.label };
      },
    ),

    tool(
      "clear_filters",
      "Reset the search box and filters on the current screen back to showing everything.",
      null,
      async () => {
        const active = screen();
        if (!active?.reset) {
          return toolError("This screen has nothing to reset.");
        }
        active.reset();
        return { ok: true, reset: active.title };
      },
    ),

    tool(
      "list_visible_results",
      "Read the rows currently showing on the screen, in order, so you can describe them or open one by position.",
      params({
        limit: int("How many rows to return, 1 to 10. Defaults to 5."),
      }),
      async (args) => {
        const active = screen();
        if (!active?.results) {
          return toolError(
            `The ${describePath(host.currentPath())} has no result list.`,
          );
        }
        const requested = Number(args.limit);
        const limit =
          Number.isFinite(requested) && requested > 0
            ? Math.min(Math.floor(requested), 10)
            : 5;
        const rows = active.results();
        return {
          ok: true,
          onScreen: active.title,
          totalShowing: rows.length,
          results: rows.slice(0, limit).map((row, index) => ({
            position: index + 1,
            id: row.id,
            title: row.title,
            detail: row.detail,
          })),
        };
      },
    ),

    tool(
      "activate_result",
      "Open a row from the current screen by its position in the list, the way tapping it would. Use this after list_visible_results when the user says things like 'open the first one'.",
      params({ position: int("1 for the first row, 2 for the second, and so on.") }, [
        "position",
      ]),
      async (args) => {
        const active = screen();
        if (!active?.activateResult) {
          return toolError(
            `Nothing on the ${describePath(host.currentPath())} can be opened by position.`,
          );
        }
        const position = Number(args.position);
        if (!Number.isFinite(position) || position < 1) {
          return toolError("position must be 1 or greater.");
        }
        const opened = active.activateResult(Math.floor(position));
        if (!opened) {
          const total = active.results?.().length ?? 0;
          return toolError(
            `There is no row ${Math.floor(position)}. The list is showing ${total}.`,
          );
        }
        return { ok: true, opened: opened.title, position: Math.floor(position) };
      },
    ),

    tool(
      "toggle_favourite",
      "Save an item to the user's vault, or remove it if already saved. Works for a career, qualification, institution or bursary.",
      params(
        {
          type: str("What kind of thing to save.", {
            enum: ["occupation", "qualification", "provider", "bursary"],
          }),
          id: str("The id from a search result."),
        },
        ["type", "id"],
      ),
      async (args) => {
        const type = args.type;
        const id = String(args.id ?? "").trim();
        if (!isAssistantEntityType(type)) {
          return toolError("type must be occupation, qualification, provider or bursary.");
        }
        if (!id) return toolError("An id is required.");

        const uid = host.uid();
        if (!uid) {
          return toolError(
            "The user is not signed in, so nothing can be saved. Tell them to sign in first.",
          );
        }

        const entity = await loadEntity(type, id);
        if (!entity) {
          return { ok: false, found: false, error: `No ${ENTITY_LABELS[type]} with id ${id}.` };
        }

        const profile = host.profile();
        const favourites = profile?.favourites ?? [];
        const existing = findExistingFavourite(favourites, type, id, entity.url);

        const { favourites: next, added } = await toggleFavourite(
          uid,
          {
            type,
            url: existing?.url ?? entity.url,
            title: entity.title,
            entityId: id,
          },
          favourites,
        );

        if (profile) host.applyProfile({ ...profile, favourites: next });

        return {
          ok: true,
          title: entity.title,
          saved: added,
          totalSaved: next.length,
        };
      },
    ),

    tool(
      "set_language",
      "Change the language the app and this assistant use.",
      params(
        {
          language: str("Language code to switch to.", { enum: [...APP_LOCALES] }),
        },
        ["language"],
      ),
      async (args) => {
        const code = String(args.language ?? "").trim();
        if (!isAppLocale(code)) {
          return toolError(
            `Unsupported language. Choose one of: ${APP_LOCALES.join(", ")}.`,
          );
        }
        host.setLocale(code);
        return { ok: true, language: LOCALE_LABELS[code] };
      },
    ),

    tool(
      "set_accessibility",
      "Change how the app looks for readability: high contrast mode and text size.",
      params({
        highContrast: bool("True to switch on black-on-white high contrast, false to switch it off."),
        textSize: str("Text size to set.", {
          enum: ["normal", "large", "largest"],
        }),
      }),
      async (args) => {
        const changed: string[] = [];

        if (typeof args.highContrast === "boolean") {
          host.setHighContrast(args.highContrast);
          changed.push(
            args.highContrast ? "high contrast on" : "high contrast off",
          );
        }

        const size = String(args.textSize ?? "").trim();
        if (size) {
          const levels: Record<string, 0 | 1 | 2> = {
            normal: 0,
            large: 1,
            largest: 2,
          };
          if (!(size in levels)) {
            return toolError("textSize must be normal, large or largest.");
          }
          host.setTextZoom(levels[size]);
          changed.push(`text size ${size}`);
        }

        if (!changed.length) {
          return toolError("Pass highContrast, textSize, or both.");
        }
        return { ok: true, changed };
      },
    ),

    tool(
      "start_questionnaire",
      "Start one of the app's guidance questionnaires. Prefer this over describing how to find it.",
      params(
        {
          questionnaire: str("Which questionnaire to start.", {
            enum: ["subjectChooser", "careerChoice", "jobFit", "apsCalculator"],
          }),
        },
        ["questionnaire"],
      ),
      async (args) => {
        const id = String(args.questionnaire ?? "").trim();
        const map: Record<string, AssistantScreenId> = {
          subjectChooser: "subjectChooser",
          careerChoice: "careerChoice",
          jobFit: "jobFit",
          apsCalculator: "apsCalculator",
        };
        const screenId = map[id];
        if (!screenId) {
          return toolError(
            "questionnaire must be subjectChooser, careerChoice, jobFit or apsCalculator.",
          );
        }
        const def = ASSISTANT_SCREENS[screenId];
        host.navigate(def.path);
        return { ok: true, openedScreen: screenId, screenName: def.label };
      },
    ),

    tool(
      "answer_current_question",
      "Answer the question currently on screen, the way tapping an option would. Use after describe_screen so you know the options. Accepts an option label, id, or 1-based position.",
      params(
        {
          option: str(
            "The option to pick: its label, its id, or a number (1 for the first option).",
          ),
        },
        ["option"],
      ),
      async (args) => {
        const active = screen();
        const value = String(args.option ?? "").trim();
        if (!value) return toolError("An option is required.");

        if (active?.answer) {
          const picked = active.answer(value);
          if (!picked) {
            const question = active.currentQuestion?.();
            const available = question?.options.map((o) => o.label).join(", ");
            return toolError(
              available
                ? `"${value}" is not an option. Choose one of: ${available}.`
                : `"${value}" is not an option on this screen.`,
            );
          }
          return { ok: true, selected: picked.selected, onScreen: active.title };
        }

        if (active?.activateResult && /^\d+$/.test(value)) {
          const opened = active.activateResult(Number(value));
          if (!opened) {
            return toolError(`There is no option ${value} on this screen.`);
          }
          return { ok: true, selected: opened.title, onScreen: active.title };
        }

        return toolError(
          `The ${describePath(host.currentPath())} is not a questionnaire question. Navigate to one first.`,
        );
      },
    ),

    tool(
      "contact_helpline",
      "Offer to phone or WhatsApp the DHET Khetha helpline. The user is asked to confirm before the dialler opens, so never call this without them asking for it.",
      params({
        method: str("How to reach the helpline.", {
          enum: ["phone", "whatsapp"],
        }),
      }),
      async (args) => {
        const method = String(args.method ?? "phone").trim();
        const isWhatsapp = method === "whatsapp";
        const label = isWhatsapp
          ? `WhatsApp the Khetha helpline on ${HELPLINE.whatsappDisplay}`
          : `call the Khetha helpline on ${HELPLINE.tollFreeDisplay}`;

        const allowed = await host.confirmLeaveApp(label);
        if (!allowed) {
          return {
            ok: true,
            opened: false,
            note: "The user declined. Do not try again unless they ask.",
          };
        }

        await host.openExternal(
          isWhatsapp
            ? `https://wa.me/27${HELPLINE.whatsapp.replace(/^0/, "")}`
            : `tel:${HELPLINE.tollFree}`,
        );
        return {
          ok: true,
          opened: true,
          method: isWhatsapp ? "WhatsApp" : "phone call",
          number: isWhatsapp ? HELPLINE.whatsappDisplay : HELPLINE.tollFreeDisplay,
          hours: HELPLINE.hours,
        };
      },
    ),

    tool(
      "open_external_link",
      "Open a bursary application page or an institution's website in the browser. Only use a link that came from a tool result, and only after the user agrees to leave the app.",
      params(
        {
          url: str("The https link from a tool result."),
          what: str("Short description of where this goes, e.g. 'the NSFAS application page'."),
        },
        ["url", "what"],
      ),
      async (args) => {
        const url = String(args.url ?? "").trim();
        const what = String(args.what ?? "").trim() || "an external website";

        if (!/^https?:\/\//i.test(url)) {
          return toolError("Only http or https links from tool results can be opened.");
        }

        const allowed = await host.confirmLeaveApp(`open ${what}`);
        if (!allowed) {
          return { ok: true, opened: false, note: "The user declined." };
        }

        await host.openExternal(url);
        return { ok: true, opened: true, what };
      },
    ),
  ]);
}
