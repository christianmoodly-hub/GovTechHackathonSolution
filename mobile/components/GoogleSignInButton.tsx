import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { MaterialIcon } from "./MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { colors, layout, radii, spacing, typography } from "../theme";

// Must run at module load so the returning browser session can finish.
WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ?? "";

type Props = {
  disabled?: boolean;
  onError?: (message: string) => void;
};

/**
 * Google Sign-In via Expo Auth Session + Firebase credential.
 * Uses the Firebase / Google Cloud Web client ID (works in Expo Go).
 */
export function GoogleSignInButton({ disabled, onError }: Props) {
  const { signInWithGoogleIdToken, isLoading } = useAuth();
  const [busy, setBusy] = useState(false);
  const handledResponse = useRef<string | null>(null);

  // Keep redirect stable across Fast Refresh so OAuth "state" still matches.
  const redirectUri = makeRedirectUri({
    scheme: "ncap",
    path: "oauthredirect",
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      // Explicit web client — required for id_token in Expo Go.
      clientId: webClientId || undefined,
      webClientId: webClientId || undefined,
      selectAccount: true,
    },
    {
      scheme: "ncap",
      path: "oauthredirect",
    },
  );

  useEffect(() => {
    if (__DEV__) {
      console.log("[google] redirectUri", redirectUri);
    }
  }, [redirectUri]);

  useEffect(() => {
    if (!response) return;

    const responseKey = `${response.type}:${JSON.stringify(response.params ?? {})}`;
    if (handledResponse.current === responseKey) return;
    handledResponse.current = responseKey;

    if (response.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) {
        onError?.("Google did not return an ID token.");
        setBusy(false);
        return;
      }
      setBusy(true);
      void (async () => {
        try {
          await signInWithGoogleIdToken(idToken);
        } catch (err) {
          console.error("[google] Firebase credential failed", err);
          onError?.(
            err instanceof Error ? err.message : "Google sign-in failed.",
          );
        } finally {
          setBusy(false);
        }
      })();
      return;
    }

    if (response.type === "error") {
      const raw = response.error?.message ?? "Google sign-in failed. Try again.";
      console.error("[google] auth error", response.error);
      if (/state do not match|Cross-Site request verification/i.test(raw)) {
        onError?.(
          "Google sign-in was interrupted (app reloaded or session mismatch). Close the browser tab, reload the app once, then tap Continue with Google again.",
        );
      } else {
        onError?.(raw);
      }
      setBusy(false);
    }

    if (response.type === "dismiss" || response.type === "cancel") {
      setBusy(false);
    }
  }, [response, onError, signInWithGoogleIdToken]);

  const onPress = async () => {
    onError?.("");
    if (!webClientId) {
      onError?.(
        "Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. Add it to mobile/.env and restart Expo.",
      );
      return;
    }
    if (!request) {
      onError?.("Google sign-in is still preparing. Wait a second and try again.");
      return;
    }

    setBusy(true);
    handledResponse.current = null;
    try {
      // showInRecents avoids Android dropping the auth return into a new task
      // (a common cause of OAuth state mismatch in Expo Go).
      const result = await promptAsync({
        ...(Platform.OS === "android" ? { showInRecents: true } : null),
      });
      // Success is handled in the response effect (avoids state-mismatch races).
      if (result.type !== "success") {
        setBusy(false);
      }
    } catch (err) {
      console.error("[google] prompt failed", err);
      onError?.(err instanceof Error ? err.message : "Google sign-in failed.");
      setBusy(false);
    }
  };

  const waiting = busy || isLoading;

  return (
    <Pressable
      style={[styles.btn, (disabled || !request || waiting) && styles.disabled]}
      disabled={disabled || !request || waiting}
      onPress={() => void onPress()}
    >
      {waiting ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          <View style={styles.gMark}>
            <Text style={styles.gLetter}>G</Text>
          </View>
          <Text style={styles.label}>Continue with Google</Text>
          <MaterialIcon
            name="arrow_forward"
            size={18}
            color={colors.textSecondary}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: layout.minTouch,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  disabled: { opacity: 0.5 },
  gMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EA4335",
    alignItems: "center",
    justifyContent: "center",
  },
  gLetter: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16,
  },
  label: { ...typography.labelLg, color: colors.text, flexShrink: 1 },
});
