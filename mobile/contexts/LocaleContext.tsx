import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHomeStrings, type HomeStrings } from "../i18n/home";
import { getTabStrings, type TabStrings } from "../i18n/tabs";
import { getCommonStrings, type CommonStrings } from "../i18n/common";
import { getAuthStrings, type AuthStrings } from "../i18n/auth";
import {
  getOnboardingStrings,
  type OnboardingStrings,
} from "../i18n/onboarding";
import { getSavedStrings, type SavedStrings } from "../i18n/saved";
import { getHelplineStrings, type HelplineStrings } from "../i18n/helpline";
import {
  getDirectoryStrings,
  type DirectoryStrings,
} from "../i18n/directory";
import {
  getQuestionnaireChromeStrings,
  type QuestionnaireChromeStrings,
} from "../i18n/questionnaires/chrome";
import {
  getDecisionsStrings,
  type DecisionsStrings,
} from "../i18n/questionnaires/decisions";
import {
  getCareerChoiceStrings,
  type CareerChoiceStrings,
} from "../i18n/questionnaires/careerChoice";
import {
  getJobFitStrings,
  type JobFitStrings,
} from "../i18n/questionnaires/jobFit";
import {
  getSubjectChooserStrings,
  type SubjectChooserStrings,
} from "../i18n/questionnaires/subjectChooser";
import { getApsStrings, type ApsStrings } from "../i18n/questionnaires/aps";
import { isAppLocale, type AppLocale } from "../i18n/types";

const STORAGE_KEY = "ncap.locale.v1";

export type AppStrings = {
  common: CommonStrings;
  tabs: TabStrings;
  home: HomeStrings;
  auth: AuthStrings;
  onboarding: OnboardingStrings;
  directory: DirectoryStrings;
  saved: SavedStrings;
  helpline: HelplineStrings;
  questionnaires: {
    chrome: QuestionnaireChromeStrings;
    decisions: DecisionsStrings;
    careerChoice: CareerChoiceStrings;
    jobFit: JobFitStrings;
    subjectChooser: SubjectChooserStrings;
    aps: ApsStrings;
  };
};

type LocaleState = {
  locale: AppLocale;
  ready: boolean;
  setLocale: (next: AppLocale) => void;
  strings: AppStrings;
  /** @deprecated Prefer strings.home */
  home: HomeStrings;
  /** @deprecated Prefer strings.tabs */
  tabs: TabStrings;
  /** @deprecated Prefer strings.common */
  common: CommonStrings;
};

const LocaleContext = createContext<LocaleState | null>(null);

function buildStrings(locale: AppLocale): AppStrings {
  return {
    common: getCommonStrings(locale),
    tabs: getTabStrings(locale),
    home: getHomeStrings(locale),
    auth: getAuthStrings(locale),
    onboarding: getOnboardingStrings(locale),
    directory: getDirectoryStrings(locale),
    saved: getSavedStrings(locale),
    helpline: getHelplineStrings(locale),
    questionnaires: {
      chrome: getQuestionnaireChromeStrings(locale),
      decisions: getDecisionsStrings(locale),
      careerChoice: getCareerChoiceStrings(locale),
      jobFit: getJobFitStrings(locale),
      subjectChooser: getSubjectChooserStrings(locale),
      aps: getApsStrings(locale),
    },
  };
}

/** Locale only — no Auth import (avoids Metro/Hermes circular init failures). */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (alive && isAppLocale(stored)) {
          setLocaleState(stored);
        }
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<LocaleState>(() => {
    const strings = buildStrings(locale);
    return {
      locale,
      ready,
      setLocale,
      strings,
      home: strings.home,
      tabs: strings.tabs,
      common: strings.common,
    };
  }, [locale, ready, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleState {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
