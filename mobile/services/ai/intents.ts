import type { AssistantStrings } from "../../i18n/assistant";
import { APP_LOCALES, LOCALE_LABELS, type AppLocale } from "../../i18n/types";
import { ASSISTANT_SCREENS, type AssistantScreenId } from "./routes";

/**
 * Deterministic matches for the handful of commands people repeat constantly.
 *
 * Two jobs: skip the ~1.5s model round trip for "open bursaries", and keep the
 * assistant partly usable with no network at all. Anything not listed here
 * falls through to Gemini.
 */
export type IntentMatch = {
  tool: string;
  args: Record<string, unknown>;
  /** Confirmation to show and speak; the tool result is not consulted. */
  reply: (strings: AssistantStrings) => string;
};

type Rule = {
  test: RegExp;
  build: (match: RegExpMatchArray) => IntentMatch;
};

function navigateTo(screen: AssistantScreenId): IntentMatch {
  return {
    tool: "navigate",
    args: { screen },
    reply: (s) => s.openedScreen(ASSISTANT_SCREENS[screen].label),
  };
}

/**
 * English-only on purpose: these are typed or spoken shortcuts, and a wrong
 * guess in another language is worse than the model handling it properly.
 */
const RULES: Rule[] = [
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:home|home screen|start|main)(?: screen| page)?$/i,
    build: () => navigateTo("home"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?bursar(?:y|ies)(?: screen| page| directory| list)?$/i,
    build: () => navigateTo("bursaries"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:careers?|occupations?|jobs?)(?: screen| page| directory| list)?$/i,
    build: () => navigateTo("careers"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:qualifications?|courses?|degrees?|diplomas?)(?: screen| page| directory| list)?$/i,
    build: () => navigateTo("qualifications"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:institutions?|universit(?:y|ies)|colleges?|providers?|tvets?)(?: screen| page| directory| list)?$/i,
    build: () => navigateTo("providers"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:saved|favourites?|favorites?|my vault|vault|profile)(?: screen| page| items)?$/i,
    build: () => navigateTo("saved"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?|call )?(?:the )?(?:helpline|help line|helpdesk|support)(?: screen| page)?$/i,
    build: () => navigateTo("helpline"),
  },
  {
    test: /^(?:go (?:to )?|open |show (?:me )?|take me (?:to )?)?(?:the )?(?:decisions?|questionnaires?|quizzes|tests?)(?: screen| page| hub)?$/i,
    build: () => navigateTo("decisions"),
  },
  {
    test: /^(?:go (?:to )?|open |start |show (?:me )?)?(?:the )?aps(?: calculator| score)?$/i,
    build: () => navigateTo("apsCalculator"),
  },
  {
    test: /^(?:go (?:to )?|open |start |show (?:me )?)?(?:the )?subject(?: chooser| choice| picker)$/i,
    build: () => navigateTo("subjectChooser"),
  },
  {
    test: /^(?:go (?:to )?|open |start |show (?:me )?)?(?:the )?(?:career (?:choice|interest)(?: profiler| questionnaire| test)?)$/i,
    build: () => navigateTo("careerChoice"),
  },
  {
    test: /^(?:go (?:to )?|open |start |show (?:me )?)?(?:the )?job[ -]?fit(?: wizard| questionnaire| test)?$/i,
    build: () => navigateTo("jobFit"),
  },
  {
    test: /^(?:go |take me )?back$/i,
    build: () => ({
      tool: "go_back",
      args: {},
      reply: (s) => s.wentBack,
    }),
  },
  {
    test: /^(?:read|describe|what(?:'s| is) on)(?: out)?(?: this| the)?(?: screen| page)?$/i,
    build: () => ({
      tool: "describe_screen",
      args: {},
      // The spoken text is the description itself, filled in by the caller.
      reply: () => "",
    }),
  },
  {
    test: /^(?:where am i|what screen(?: is this| am i on)?)\??$/i,
    build: () => ({
      tool: "describe_screen",
      args: {},
      reply: () => "",
    }),
  },
  {
    test: /^(?:(?:turn on|enable|switch on)(?: the)? high[ -]?contrast|high[ -]?contrast on)$/i,
    build: () => ({
      tool: "set_accessibility",
      args: { highContrast: true },
      reply: (s) => s.contrastOn,
    }),
  },
  {
    test: /^(?:(?:turn off|disable|switch off)(?: the)? high[ -]?contrast|high[ -]?contrast off)$/i,
    build: () => ({
      tool: "set_accessibility",
      args: { highContrast: false },
      reply: (s) => s.contrastOff,
    }),
  },
  {
    test: /^(?:make(?: the)? text |text )?(?:bigger|larger|biggest)$/i,
    build: () => ({
      tool: "set_accessibility",
      args: { textSize: "largest" },
      reply: (s) => s.textSizeSet,
    }),
  },
  {
    test: /^(?:make(?: the)? text |text )?(?:smaller|normal|default)$/i,
    build: () => ({
      tool: "set_accessibility",
      args: { textSize: "normal" },
      reply: (s) => s.textSizeSet,
    }),
  },
  {
    test: /^(?:clear|reset)(?: the)?(?: search| filters| search and filters)?$/i,
    build: () => ({
      tool: "clear_filters",
      args: {},
      reply: (s) => s.cleared,
    }),
  },
  {
    test: /^(?:search|find|look) (?:for )?(.{2,80})$/i,
    build: (match) => {
      const query = match[1].trim();
      return {
        tool: "search_in_list",
        args: { query },
        reply: (s) => s.searched(query),
      };
    },
  },
  {
    test: /^(?:open|tap|select)(?: the)? (first|second|third|fourth|fifth|1st|2nd|3rd|4th|5th|one|two|three|four|five)(?: one| result| item)?$/i,
    build: (match) => {
      const positions: Record<string, number> = {
        first: 1, "1st": 1, one: 1,
        second: 2, "2nd": 2, two: 2,
        third: 3, "3rd": 3, three: 3,
        fourth: 4, "4th": 4, four: 4,
        fifth: 5, "5th": 5, five: 5,
      };
      const position = positions[match[1].toLowerCase()] ?? 1;
      return {
        tool: "activate_result",
        args: { position },
        reply: () => "",
      };
    },
  },
  {
    test: /^(?:start|open|begin)(?: the)? (?:subject chooser|subject choice|subject picker)$/i,
    build: () => ({
      tool: "start_questionnaire",
      args: { questionnaire: "subjectChooser" },
      reply: (s) => s.openedScreen(ASSISTANT_SCREENS.subjectChooser.label),
    }),
  },
  {
    test: /^(?:start|open|begin)(?: the)? (?:career (?:choice|interest)(?: profiler| questionnaire| test)?)$/i,
    build: () => ({
      tool: "start_questionnaire",
      args: { questionnaire: "careerChoice" },
      reply: (s) => s.openedScreen(ASSISTANT_SCREENS.careerChoice.label),
    }),
  },
  {
    test: /^(?:start|open|begin)(?: the)? job[ -]?fit(?: wizard| questionnaire| test)?$/i,
    build: () => ({
      tool: "start_questionnaire",
      args: { questionnaire: "jobFit" },
      reply: (s) => s.openedScreen(ASSISTANT_SCREENS.jobFit.label),
    }),
  },
  {
    test: /^(?:start|open|begin)(?: the)? aps(?: calculator| score)?$/i,
    build: () => ({
      tool: "start_questionnaire",
      args: { questionnaire: "apsCalculator" },
      reply: (s) => s.openedScreen(ASSISTANT_SCREENS.apsCalculator.label),
    }),
  },
  {
    test: /^(?:switch|change|set|use)(?: (?:the )?(?:app |assistant )?)?(?:language(?: to)?|to) (.+)$/i,
    build: (match) => {
      const code = languageCode(match[1]);
      if (!code) {
        return {
          tool: "get_app_help",
          args: { topic: "languages" },
          reply: () => "",
        };
      }
      return {
        tool: "set_language",
        args: { language: code },
        reply: (s) => s.languageSet(LOCALE_LABELS[code]),
      };
    },
  },
];

/** Strip filler so "um, please open bursaries now" still matches. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.!?,;:"']/g, " ")
    .replace(/\b(?:um+|uh+|er+|please|hey|hi|ok|okay|khetha|assistant|can you|could you|i want to|i wanna|let's|lets|now)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LANGUAGE_ALIASES: Record<string, AppLocale> = {
  english: "en",
  en: "en",
  afrikaans: "af",
  af: "af",
  zulu: "zu",
  isizulu: "zu",
  zu: "zu",
  xhosa: "xh",
  isixhosa: "xh",
  xh: "xh",
  ndebele: "nr",
  isindebele: "nr",
  nr: "nr",
  swati: "ss",
  siswati: "ss",
  ss: "ss",
  sepedi: "nso",
  pedi: "nso",
  nso: "nso",
  sotho: "st",
  sesotho: "st",
  st: "st",
  tswana: "tn",
  setswana: "tn",
  tn: "tn",
  venda: "ve",
  tshivenda: "ve",
  ve: "ve",
  tsonga: "ts",
  xitsonga: "ts",
  ts: "ts",
};

function languageCode(raw: string): AppLocale | null {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (LANGUAGE_ALIASES[key]) return LANGUAGE_ALIASES[key];
  const spaced = raw.trim().toLowerCase();
  for (const locale of APP_LOCALES) {
    if (LOCALE_LABELS[locale].toLowerCase() === spaced) return locale;
  }
  return null;
}

export function matchIntent(input: string): IntentMatch | null {
  const text = normalise(input);
  if (!text || text.length > 90) return null;

  for (const rule of RULES) {
    const match = text.match(rule.test);
    if (match) return rule.build(match);
  }
  return null;
}
