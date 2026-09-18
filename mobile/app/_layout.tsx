import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";
import { ConnectivityProvider } from "../contexts/ConnectivityContext";
import { ConnectivitySync } from "../contexts/ConnectivitySync";
import { LocaleProvider } from "../contexts/LocaleContext";
import { LocaleProfileSync } from "../contexts/LocaleProfileSync";
import { AssistantProvider } from "../contexts/AssistantContext";
import { AssistantOverlay } from "../components/assistant/AssistantOverlay";
import { AssistantLauncher } from "../components/assistant/AssistantLauncher";
import { HandsFreeTriggers } from "../components/assistant/HandsFreeTriggers";
import { colors } from "../theme";
import { href } from "../utils/href";

// Finish in-app browser OAuth returns (Google Sign-In) at the root.
WebBrowser.maybeCompleteAuthSession();

const PUBLIC_ROUTES = new Set(["sign-in", "register", "recover"]);
const ASSISTANT_HIDDEN_ROUTES = new Set([
  "sign-in",
  "register",
  "recover",
  "verify-email",
  "onboarding",
]);

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading, profile, emailVerificationRequired } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const root = String(segments[0] ?? "");
    const onPublic = PUBLIC_ROUTES.has(root);
    const onVerifyEmail = root === "verify-email";
    const onOnboarding = root === "onboarding";
    const hasDemographics = Boolean(profile?.demographics?.completedAt);

    if (!isSignedIn && !onPublic) {
      router.replace(href("/sign-in"));
      return;
    }

    if (isSignedIn && emailVerificationRequired && !onVerifyEmail) {
      router.replace(href("/verify-email"));
      return;
    }

    if (isSignedIn && !emailVerificationRequired && onVerifyEmail) {
      router.replace(href(hasDemographics ? "/" : "/onboarding"));
      return;
    }

    if (isSignedIn && onPublic) {
      router.replace(
        href(
          emailVerificationRequired
            ? "/verify-email"
            : hasDemographics
              ? "/"
              : "/onboarding",
        ),
      );
      return;
    }

    if (
      isSignedIn &&
      !emailVerificationRequired &&
      !hasDemographics &&
      !onOnboarding &&
      !onVerifyEmail
    ) {
      router.replace(href("/onboarding"));
      return;
    }

    if (isSignedIn && hasDemographics && onOnboarding) {
      router.replace(href("/"));
    }
  }, [
    isSignedIn,
    isLoading,
    emailVerificationRequired,
    profile?.demographics?.completedAt,
    segments,
    router,
  ]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const root = String(segments[0] ?? "");
  const showAssistant =
    isSignedIn && !emailVerificationRequired && !ASSISTANT_HIDDEN_ROUTES.has(root);

  return (
    <>
      {children}
      {showAssistant ? (
        <>
          <HandsFreeTriggers />
          <AssistantLauncher />
          <AssistantOverlay />
        </>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <ConnectivityProvider>
        <AuthProvider>
          <LocaleProvider>
            <AssistantProvider>
              <LocaleProfileSync />
              <ConnectivitySync />
              <StatusBar style="dark" />
              <AuthGate>
                <Stack screenOptions={{ headerShown: false }} />
              </AuthGate>
            </AssistantProvider>
          </LocaleProvider>
        </AuthProvider>
      </ConnectivityProvider>
    </AccessibilityProvider>
  );
}
