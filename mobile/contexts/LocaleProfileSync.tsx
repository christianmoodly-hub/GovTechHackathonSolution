import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useLocale } from "./LocaleContext";
import { isAppLocale } from "../i18n/types";
import { updateProfile } from "../services/ncapData";

/**
 * Syncs preferredLanguage ↔ app locale.
 * Renders under AuthProvider + LocaleProvider.
 */
export function LocaleProfileSync() {
  const { user, profile, refreshProfile } = useAuth();
  const { locale, setLocale, ready } = useLocale();
  const lastWritten = useRef<string | null>(null);
  const hydratedFromProfile = useRef(false);

  // Profile → local (once when demographics load)
  useEffect(() => {
    if (!ready || hydratedFromProfile.current) return;
    const preferred = profile?.demographics?.preferredLanguage;
    if (isAppLocale(preferred)) {
      hydratedFromProfile.current = true;
      if (preferred !== locale) {
        setLocale(preferred);
      }
      lastWritten.current = preferred;
    }
  }, [ready, profile?.demographics?.preferredLanguage, locale, setLocale]);

  // Local → profile when user changes language
  useEffect(() => {
    if (!ready || !user?.uid || !profile?.demographics) return;
    if (profile.demographics.preferredLanguage === locale) {
      lastWritten.current = locale;
      return;
    }
    if (lastWritten.current === locale) return;

    lastWritten.current = locale;
    void (async () => {
      try {
        await updateProfile(user.uid, {
          demographics: {
            ...profile.demographics,
            preferredLanguage: locale,
          },
        });
        await refreshProfile();
      } catch {
        // Keep local locale if sync fails.
      }
    })();
  }, [ready, locale, user?.uid, profile?.demographics, refreshProfile]);

  return null;
}
