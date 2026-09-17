import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { colors, layout, radii, spacing, typography } from "../theme";

export default function SignInScreen() {
  const { sendSignInLink, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLocalError(null);
    clearError();
    setBusy(true);
    try {
      await sendSignInLink(email);
      setSentTo(email.trim().toLowerCase());
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Could not send sign-in link.",
      );
    } finally {
      setBusy(false);
    }
  };

  const message = localError || error;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.brand}>NCAP · Khetha</Text>
        <Text style={styles.title}>Sign in with email</Text>
        <Text style={styles.subtitle}>
          We will email you a one-tap sign-in link. No password needed.
        </Text>

        {sentTo ? (
          <View style={styles.card}>
            <Text style={styles.sentTitle}>Check your inbox</Text>
            <Text style={styles.sentBody}>
              A sign-in link was sent to{" "}
              <Text style={styles.emailHighlight}>{sentTo}</Text>. Open it on
              this device to finish signing in.
            </Text>
            <Pressable
              onPress={() => {
                setSentTo(null);
                setEmail("");
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Use a different email</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={!busy && !isLoading}
            />

            {message ? <Text style={styles.error}>{message}</Text> : null}

            <Pressable
              onPress={onSubmit}
              disabled={busy || isLoading || !email.trim()}
              style={[
                styles.button,
                (!email.trim() || busy || isLoading) && styles.buttonDisabled,
              ]}
            >
              {busy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Email me a sign-in link</Text>
              )}
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  container: {
    flex: 1,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.xxxl,
    justifyContent: "center",
  },
  brand: {
    ...typography.labelMd,
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: spacing.md,
    textTransform: "uppercase",
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  form: {
    gap: spacing.md,
  },
  label: {
    ...typography.labelLg,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    ...typography.bodyLg,
    color: colors.text,
    minHeight: layout.minTouch,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    minHeight: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.labelLg,
    color: colors.onPrimary,
  },
  error: {
    color: colors.error,
    ...typography.bodySm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  sentTitle: {
    ...typography.headlineMd,
    color: colors.text,
  },
  sentBody: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  emailHighlight: {
    fontWeight: "700",
    color: colors.primary,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
  },
  secondaryButtonText: {
    ...typography.labelLg,
    color: colors.primary,
  },
});
