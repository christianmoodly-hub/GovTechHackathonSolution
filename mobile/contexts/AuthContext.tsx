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
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  type User,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import { getFirebaseAuth } from "../firebase/client";
import { ensureProfile, getProfile, updateProfile } from "../services/ncapData";
import { registerForPushNotificationsAsync } from "../services/notifications";
import type { Demographics, UserProfile } from "../services/types";

const EMAIL_FOR_SIGN_IN_KEY = "ncap.emailForSignIn";

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  demographics: Omit<Demographics, "completedAt"> & { completedAt?: string };
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  isSignedIn: boolean;
  isLoading: boolean;
  error: string | null;
  sendSignInLink: (email: string) => Promise<void>;
  completeSignInFromLink: (url: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  registerWithPassword: (input: RegisterInput) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function buildActionCodeSettings() {
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

function mapAuthError(err: unknown, fallback: string): string {
  if (!(err instanceof Error)) return fallback;
  const code = (err as { code?: string }).code ?? "";
  if (code.includes("email-already-in-use")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (code.includes("invalid-email")) return "Enter a valid email address.";
  if (code.includes("weak-password")) {
    return "Use a stronger password or a 6-digit PIN (at least 6 characters).";
  }
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Email or password is incorrect.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  return err.message || fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handlingLink = useRef(false);

  const bootstrapProfile = useCallback(async (nextUser: User) => {
    let nextProfile = await ensureProfile(nextUser.uid);

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

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) throw new Error("Enter a valid email address.");
    if (password.length < 6) throw new Error("Enter your password or 6-digit PIN.");

    setError(null);
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        trimmed,
        password,
      );
      await bootstrapProfile(credential.user);
      setUser(credential.user);
    } catch (err) {
      const message = mapAuthError(err, "Could not sign in.");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [bootstrapProfile]);

  const registerWithPassword = useCallback(
    async (input: RegisterInput) => {
      const trimmed = input.email.trim().toLowerCase();
      if (!trimmed.includes("@")) throw new Error("Enter a valid email address.");
      if (input.password.length < 6) {
        throw new Error("Create a password or 6-digit PIN (min 6 characters).");
      }
      if (!input.fullName.trim()) throw new Error("Enter your full legal name.");

      setError(null);
      setIsLoading(true);
      try {
        const credential = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          trimmed,
          input.password,
        );
        await updateFirebaseProfile(credential.user, {
          displayName: input.fullName.trim(),
        });

        const demographics: Demographics = {
          ...input.demographics,
          email: trimmed,
          fullName: input.fullName.trim(),
          completedAt: new Date().toISOString(),
        };

        await ensureProfile(credential.user.uid);
        await updateProfile(credential.user.uid, { demographics });
        await bootstrapProfile(credential.user);
        setUser(credential.user);
      } catch (err) {
        const message = mapAuthError(err, "Could not create your account.");
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [bootstrapProfile],
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      throw new Error("Enter the email address on your Khetha profile.");
    }
    setError(null);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), trimmed);
    } catch (err) {
      const message = mapAuthError(err, "Could not send reset email.");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const continueAsGuest = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const credential = await signInAnonymously(getFirebaseAuth());
      const demographics: Demographics = {
        preferredLanguage: "en",
        role: "guest",
        hasDisability: false,
        disabilityCategories: [],
        completedAt: new Date().toISOString(),
        fullName: "Guest explorer",
      };
      await ensureProfile(credential.user.uid);
      await updateProfile(credential.user.uid, { demographics });
      await bootstrapProfile(credential.user);
      setUser(credential.user);
    } catch (err) {
      const message = mapAuthError(
        err,
        "Guest mode is unavailable. Enable Anonymous Auth in Firebase, or sign in with email.",
      );
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [bootstrapProfile]);

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
      signInWithPassword,
      registerWithPassword,
      sendPasswordReset,
      continueAsGuest,
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
      signInWithPassword,
      registerWithPassword,
      sendPasswordReset,
      continueAsGuest,
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
