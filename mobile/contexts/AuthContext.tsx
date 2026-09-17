import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { getFirebaseAuth } from "../firebase/client";
import { ensureProfile, getProfile, updateProfile } from "../services/ncapData";
import { registerForPushNotificationsAsync } from "../services/notifications";
import type { UserProfile } from "../services/types";

const EMAIL_FOR_SIGN_IN_KEY = "ncap.emailForSignIn";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
  sendSignInLink: (email: string) => Promise<void>;
  completeSignInFromLink: (url: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildActionCodeSettings() {
  // Continues on Firebase Hosting, which deep-links into the app (ncap://sign-in).
  return {
    url: "https://nationalcreeradviceapp.firebaseapp.com/auth/complete.html",
    handleCodeInApp: true,
    iOS: {
      bundleId: "za.gov.ncap.careeradvice",
    },
    android: {
      packageName: "za.gov.ncap.careeradvice",
      installApp: true,
      minimumVersion: "1",
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handlingLink = useRef(false);

  const bootstrapProfile = useCallback(async (nextUser: User) => {
    let nextProfile = await ensureProfile(nextUser.uid);

    // Register Expo push token on every sign-in / session restore and
    // persist it on profiles/{uid}.pushToken (best-effort; never blocks auth).
    try {
      const token = await registerForPushNotificationsAsync();
      if (token && token !== nextProfile.pushToken) {
        nextProfile = await updateProfile(nextUser.uid, { pushToken: token });
      }
    } catch (err) {
      console.warn("[notifications] Push token registration failed", err);
    }

    setProfile(nextProfile);
  }, []);

  const refreshProfile = useCallback(async () => {
    const auth = getFirebaseAuth();
    const current = auth.currentUser;
    if (!current) {
      setProfile(null);
      return;
    }
    const nextProfile = await getProfile(current.uid);
    setProfile(nextProfile);
  }, []);

  const completeSignInFromLink = useCallback(
    async (url: string) => {
      const auth = getFirebaseAuth();
      if (!isSignInWithEmailLink(auth, url)) {
        throw new Error("This link is not a valid sign-in link.");
      }

      const email = await AsyncStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
      if (!email) {
        throw new Error(
          "Open the link on the same device you requested it from, then try again.",
        );
      }

      if (handlingLink.current) return;
      handlingLink.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const credential = await signInWithEmailLink(auth, email, url);
        await AsyncStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
        await bootstrapProfile(credential.user);
        setUser(credential.user);
      } finally {
        handlingLink.current = false;
        setIsLoading(false);
      }
    },
    [bootstrapProfile],
  );

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        await bootstrapProfile(nextUser);
      } catch (err) {
        console.error("Profile bootstrap failed", err);
        setError(
          err instanceof Error
            ? err.message
            : "Signed in, but failed to create your profile.",
        );
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, [bootstrapProfile]);

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      try {
        const auth = getFirebaseAuth();
        if (!isSignInWithEmailLink(auth, url)) return;
        await completeSignInFromLink(url);
      } catch (err) {
        console.error("Email link handling failed", err);
        setError(
          err instanceof Error
            ? err.message
            : "Could not complete email sign-in from link.",
        );
      }
    };

    void Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener("url", ({ url }) => {
      void handleUrl(url);
    });
    return () => sub.remove();
  }, [completeSignInFromLink]);

  const sendSignInLink = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      throw new Error("Enter a valid email address.");
    }

    setError(null);
    const auth = getFirebaseAuth();
    await sendSignInLinkToEmail(auth, trimmed, buildActionCodeSettings());
    await AsyncStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, trimmed);
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    await firebaseSignOut(getFirebaseAuth());
    setProfile(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isSignedIn: !!user,
      isLoading,
      error,
      sendSignInLink,
      completeSignInFromLink,
      signOut,
      refreshProfile,
      clearError: () => setError(null),
    }),
    [
      user,
      profile,
      isLoading,
      error,
      sendSignInLink,
      completeSignInFromLink,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
