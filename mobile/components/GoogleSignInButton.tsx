import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcon } from "./MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { colors, layout, radii, spacing, typography } from "../theme";

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

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

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
  });

  const onPress = async () => {
    onError?.("");
    if (!webClientId) {
      onError?.(
        "Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. Add it to mobile/.env and restart Expo.",
      );
      return;
    }

    setBusy(true);
    try {
      const result = await promptAsync();
      if (result.type !== "success") {
        if (result.type === "error") {
          const message =
            result.error?.message ?? "Google sign-in failed. Try again.";
          console.error("[google] auth error", result.error);
          onError?.(message);
        }
        return;
      }

      const idToken = result.params.id_token;
      if (!idToken) {
        onError?.("Google did not return an ID token.");
        return;
      }

      await signInWithGoogleIdToken(idToken);
    } catch (err) {
      console.error("[google] sign-in failed", err);
      onError?.(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
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
          <MaterialIcon name="arrow_forward" size={18} color={colors.textSecondary} />
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
