import {
  DIGITAL_CHANNELS,
  DISABILITY_CATEGORIES,
  GUIDANCE_TOPICS,
  HELPLINE,
  LEARNER_ROLES,
  PROVINCES,
  WALK_IN_CENTRES,
} from "../../data/staticContent";
import { LOCALE_LABELS, APP_LOCALES } from "../../i18n/types";
import { ASSISTANT_SCREENS, ASSISTANT_SCREEN_IDS } from "./routes";
import { params, str, tool, type ToolRegistry, type ToolResult } from "./types";

export type HelpTopic =
  | "overview"
  | "navigation"
  | "questionnaires"
  | "aps"
  | "bursaries"
  | "favourites"
  | "offline"
  | "accessibility"
  | "languages"
  | "helpline"
  | "account"
  | "assistant";

const TOPICS: Record<HelpTopic, () => ToolResult> = {
  overview: () => ({
    what: "Khetha is the Department of Higher Education and Training's National Career Advice Portal app. It helps South Africans choose a career, find a qualification and an institution that offers it, and find money to study.",
    mainParts: [
      "Home: learning paths and shortcuts",
      "Decisions: four guidance questionnaires",
      "Directory: careers, qualifications, institutions and bursaries",
      "Saved: profile, favourites and settings",
      "Helpline: talk to a real DHET career adviser",
    ],
    cost: "The app is free. The helpline number is toll free.",
  }),

  navigation: () => ({
    screens: ASSISTANT_SCREEN_IDS.map((id) => ({
      screen: id,
      name: ASSISTANT_SCREENS[id].label,
      whatItDoes: ASSISTANT_SCREENS[id].description,
    })),
    tip: "Use the navigate tool to take the user there instead of describing the route.",
  }),

  questionnaires: () => ({
    available: [
      {
        screen: "subjectChooser",
        name: "Subject chooser",
        forWho: "Grade 9 to 10 learners picking subjects",
        what: "Build an NSC subject package and see which careers and qualifications it keeps open.",
      },
      {
        screen: "careerChoice",
        name: "Career interest profiler",
        forWho: "Anyone unsure what they want to do",
        what: "Rate how much you like different kinds of work; it scores your interests and suggests occupations.",
      },
      {
        screen: "jobFit",
        name: "Job fit",
        forWho: "People choosing between work environments",
        what: "A short wizard about how and where you like to work, matched to occupations.",
      },
      {
        screen: "apsCalculator",
        name: "APS calculator",
        forWho: "Grade 11 to 12 learners",
        what: "Work out your Admission Point Score from your subject levels, then see qualifications in range.",
      },
    ],
    progress:
      "Answers are saved as you go, so a questionnaire can be left and resumed later. Finished results appear on the Saved screen and on their own results screen.",
  }),

  aps: () => ({
    what: "APS stands for Admission Point Score. South African universities convert each NSC subject percentage into points and add the best subjects together to decide whether you meet the minimum for a programme.",
    whereInApp:
      "The APS calculator is under Decisions. After calculating, it can jump straight to qualifications that fit that score.",
    caution:
      "The app's APS figure is a guide. Every institution has its own rule about which subjects count, so always confirm with the institution.",
  }),

  bursaries: () => ({
    what: "The Bursaries directory lists study funding with who qualifies, closing dates, documents needed and how to apply.",
    filters:
      "Bursaries can be filtered by study field and by closing date, and searched by keyword or provider.",
    caution:
      "Applications are made on the bursary provider's own website, not inside this app. Never pay anyone to apply for a bursary.",
    nsfas:
      "NSFAS is the government's student financial aid scheme. Search bursaries for NSFAS to see what the app holds, and use the helpline for application help.",
  }),

  favourites: () => ({
    what: "Tapping the heart on any career, qualification, institution or bursary saves it to the vault on the Saved screen.",
    why: "Saved items are downloaded for offline reading, so they work without data.",
    requires: "Saving needs a signed-in profile, including a guest session.",
  }),

  offline: () => ({
    what: "Khetha keeps a copy of the directory on the phone, so careers, qualifications, institutions and bursaries can be browsed without data.",
    how: "The Saved screen has a sync control that refreshes the offline copy and downloads saved items.",
    limits:
      "While offline the assistant can only do simple commands like moving between screens. Answering questions needs a connection.",
  }),

  accessibility: () => ({
    textSize:
      "Text size cycles through three levels, AA, AA+ and AAA, from the top bar or the Saved screen.",
    highContrast:
      "A high contrast black-on-white mode can be switched on from the Saved screen.",
    voice:
      "The assistant can be opened and spoken to hands free: press and hold the volume down button, shake the phone, or tap the microphone button. It reads its answers aloud and can move around the app and operate the screens on request.",
    screenReader:
      "The app is labelled for TalkBack on Android and VoiceOver on iOS.",
    disabilitySupport: DISABILITY_CATEGORIES.map((d) => d.label),
    helplineNote:
      "The helpline has guidance specifically for learners with disabilities.",
  }),

  languages: () => ({
    supported: APP_LOCALES.map((locale) => ({
      code: locale,
      name: LOCALE_LABELS[locale],
    })),
    howToChange:
      "The language picker is on the Home screen and the Saved screen. The assistant can also change it with set_language.",
    spokenCaution:
      "Spoken replies depend on the voices installed on the phone. English and Afrikaans are usually available; several other official languages have no voice yet, so replies appear as text.",
  }),

  helpline: () => ({
    tollFree: HELPLINE.tollFreeDisplay,
    whatsapp: HELPLINE.whatsappDisplay,
    hours: HELPLINE.hours,
    topicsAdvisersCover: GUIDANCE_TOPICS,
    walkInCentres: WALK_IN_CENTRES.map((c) => ({
      name: c.name,
      city: c.city,
      address: c.address,
      hours: c.hours,
      access: c.accessLabel,
    })),
    digitalChannels: DIGITAL_CHANNELS.map((c) => ({
      label: c.label,
      what: c.subtitle,
    })),
    callbackForm:
      "The Helpline screen has a callback request form. It is saved on the phone and sent when there is a connection.",
    provinces: PROVINCES,
  }),

  account: () => ({
    signIn:
      "People can sign in with email and password, a Google account, an email link, or continue as a guest.",
    whySignIn:
      "A profile stores questionnaire results and saved items and syncs them across devices.",
    roles: LEARNER_ROLES.map((r) => ({ id: r.id, label: r.label })),
    assistantLimit:
      "The assistant cannot sign anyone in or out, register an account, reset a password or change identity details. The user must do those themselves.",
  }),

  assistant: () => ({
    whatICanDo: [
      "Answer questions about careers, qualifications, institutions and bursaries in this app",
      "Move to any screen and open a specific career, qualification, institution or bursary",
      "Search and filter the list the user is looking at, and open a result",
      "Start a questionnaire",
      "Change language, text size and high contrast",
      "Read the current screen aloud",
      "Save or unsave an item",
    ],
    whatICannotDo: [
      "Anything outside careers, study, funding and operating this app",
      "Sign in, sign out, register, or change a password or identity details",
      "Submit a bursary or institution application",
      "Phone or email anyone without being asked to",
    ],
    howToTalkToMe:
      "Press and hold volume down, shake the phone, or tap the microphone button, then speak. Typing works too.",
  }),
};

const TOPIC_IDS = Object.keys(TOPICS) as HelpTopic[];

export const appHelpTools: ToolRegistry = Object.fromEntries([
  tool(
    "get_app_help",
    `Explain how this app works, what is on a screen, or how to reach the DHET helpline. Call this for any "how do I", "where is", "what is this app" or "can you" question, and before saying you cannot do something. Topics: ${TOPIC_IDS.join(", ")}.`,
    params(
      {
        topic: str("Which aspect of the app to explain.", { enum: TOPIC_IDS }),
      },
      ["topic"],
    ),
    async (args) => {
      const topic = String(args.topic ?? "").trim() as HelpTopic;
      const build = TOPICS[topic];
      if (!build) {
        return {
          ok: false,
          error: `Unknown topic. Choose one of: ${TOPIC_IDS.join(", ")}.`,
        };
      }
      return { ok: true, topic, ...build() };
    },
  ),
]);
