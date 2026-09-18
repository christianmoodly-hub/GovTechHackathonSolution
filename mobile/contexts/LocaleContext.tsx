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
import { useAuth } from "./AuthContext";
import { getHomeStrings } from "../i18n/home";
import { getTabStrings } from "../i18n/tabs";
import { getCommonStrings } from "../i18n/common";
import { isAppLocale, type AppLocale } from "../i18n/types";
import { updateProfile } from "../services/ncapData";

const STORAGE_KEY = "ncap.locale.v1";

type LocaleState = {
  locale: AppLocale;
  ready: boolean;
  setLocale: (next: AppLocale) => void;
  home: ReturnType<typeof getHomeStrings>;
  tabs: ReturnType<typeof getTabStrings>;
  common: ReturnType<typeof getCommonStrings>;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile } = useAuth();
  const profileLanguage = profile?.demographics?.preferredLanguage;
  const [locale, setLocaleState] = useState<AppLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (isAppLocale(profileLanguage)) {
          if (alive) setLocaleState(profileLanguage);
          return;
        }
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
  }, [profileLanguage]);

  const setLocale = useCallback(
    (next: AppLocale) => {
      setLocaleState(next);
      void AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);

      if (!user?.uid || !profile?.demographics) return;
      void (async () => {
        try {
          await updateProfile(user.uid, {
            demographics: {
              ...profile.demographics,
              preferredLanguage: next,
            },
          });
          await refreshProfile();
        } catch {
          // Keep local locale if profile sync fails.
        }
      })();
    },
    [user?.uid, profile?.demographics, refreshProfile],
  );

  const value = useMemo<LocaleState>(
    () => ({
      locale,
      ready,
      setLocale,
      home: getHomeStrings(locale),
      tabs: getTabStrings(locale),
      common: getCommonStrings(locale),
    }),
    [locale, ready, setLocale],
  );

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
