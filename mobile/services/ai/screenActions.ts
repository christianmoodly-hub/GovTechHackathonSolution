/**
 * What a screen offers the assistant beyond navigation.
 *
 * Screens register these on focus. The assistant never simulates taps — it
 * calls the same handlers the on-screen controls call, so state stays honest.
 */
export type AssistantFilter = {
  /** Name the model uses in set_filter, e.g. "field" or "province". */
  name: string;
  description: string;
  options: { value: string; label: string }[];
  /** Currently applied value. */
  current: string;
  apply: (value: string) => void;
};

export type AssistantResultRow = {
  /** Id to pass to open_entity, when the row maps to a catalogue entity. */
  id: string;
  title: string;
  detail?: string;
};

export type CurrentQuestion = {
  prompt: string;
  options: { id: string; label: string }[];
};

export type ScreenActionSet = {
  /** Short human name, spoken back when confirming, e.g. "Bursaries directory". */
  title: string;
  /** One or two sentences describing what is on screen right now. */
  describe: () => string;
  /** Type into the screen's search field. */
  setQuery?: (query: string) => void;
  currentQuery?: () => string;
  filters?: AssistantFilter[];
  /** Rows the user can currently see, in display order. */
  results?: () => AssistantResultRow[];
  /** Open the row at a 1-based position. Returns what was opened, or null. */
  activateResult?: (position: number) => AssistantResultRow | null;
  /** Clear search and filters back to defaults. */
  reset?: () => void;
  /** The question currently on screen, for voice answering. */
  currentQuestion?: () => CurrentQuestion | null;
  /**
   * Pick an answer by option id, label, or 1-based position. Returns what was
   * selected, or null if nothing matched.
   */
  answer?: (value: string) => { selected: string } | null;
};

export type ScreenActionRegistry = {
  register: (actions: ScreenActionSet) => () => void;
  current: () => ScreenActionSet | null;
};

export function createScreenActionRegistry(
  onChange: (names: string[]) => void,
): ScreenActionRegistry {
  /** A stack, so a detail screen pushed over a list restores the list on unmount. */
  let stack: ScreenActionSet[] = [];

  const notify = () => {
    const top = stack[stack.length - 1];
    if (!top) {
      onChange([]);
      return;
    }
    const names = ["describe_screen"];
    if (top.setQuery) names.push("search_in_list");
    if (top.filters?.length) {
      names.push(`set_filter (${top.filters.map((f) => f.name).join(", ")})`);
    }
    if (top.results) names.push("list_visible_results");
    if (top.activateResult) names.push("activate_result");
    if (top.reset) names.push("clear_filters");
    if (top.answer) names.push("answer_current_question");
    onChange(names);
  };

  return {
    register(actions) {
      stack = [...stack, actions];
      notify();
      return () => {
        stack = stack.filter((entry) => entry !== actions);
        notify();
      };
    },
    current() {
      return stack[stack.length - 1] ?? null;
    },
  };
}
