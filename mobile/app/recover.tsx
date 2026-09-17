import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { HELPLINE } from "../data/staticContent";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

export default function RecoverScreen() {
  const router = useRouter();
  const { sendPasswordReset, clearError, error } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const message = localError || error;

  const onSend = async () => {
    setLocalError(null);
    clearError();
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Could not send reset instructions.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.replace(href("/sign-in"))}>
            <Text style={styles.back}>← Back to sign in</Text>
          </Pressable>

          <Text style={styles.brand}>Khetha NCAP · Reset access</Text>
          <Text style={styles.title}>Reset your password or PIN</Text>
          <Text style={styles.subtitle}>
            Enter the email on your Khetha profile. We will send a secure Firebase reset link
            so you can set a new password / PIN.
          </Text>

          <View style={styles.card}>
            <View style={styles.steps}>
              <Text style={[styles.step, !sent && styles.stepOn]}>1 Verify identity</Text>
              <Text style={[styles.step, sent && styles.stepOn]}>2 Create new PIN</Text>
            </View>

            {!sent ? (
              <>
                <Text style={styles.label}>Email address on your profile *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  editable={!busy}
                />
                <Text style={styles.hint}>
                  SA ID / SMS OTP UI from the design is shown for continuity. Live recovery uses
                  your registered email.
                </Text>

                {message ? <Text style={styles.error}>{message}</Text> : null}

                <Pressable
                  style={[styles.primaryBtn, (busy || !email.trim()) && styles.disabled]}
                  disabled={busy || !email.trim()}
                  onPress={() => void onSend()}
                >
                  {busy ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text style={styles.primaryText}>Send free verification / reset link</Text>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.successTitle}>Reset email sent</Text>
                <Text style={styles.body}>
                  We sent password-reset instructions to{" "}
                  <Text style={styles.emphasis}>{email.trim().toLowerCase()}</Text>. Open the
                  link, set a new password or 6-digit PIN, then return here to sign in.
                </Text>
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => router.replace(href("/sign-in"))}
                >
                  <Text style={styles.primaryText}>Back to sign in</Text>
                </Pressable>
                <Pressable onPress={() => setSent(false)}>
                  <Text style={styles.link}>Use a different email</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.help}>
            <Text style={styles.helpTitle}>Can&apos;t access your registered phone or email?</Text>
            <Text style={styles.body}>
              Verify your identity with a DHET career advisor.
            </Text>
            <Pressable onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}>
              <Text style={styles.link}>Toll-free {HELPLINE.tollFreeDisplay}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                void Linking.openURL(`https://wa.me/27${HELPLINE.whatsapp.slice(1)}`)
              }
            >
              <Text style={styles.link}>WhatsApp {HELPLINE.whatsappDisplay}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.canvas },
  content: {
    padding: layout.gutter,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  back: { ...typography.labelLg, color: colors.primary },
  brand: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  steps: { flexDirection: "row", gap: spacing.md },
  step: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepOn: { color: colors.primary, fontWeight: "700" },
  label: { ...typography.labelLg, color: colors.text },
  hint: { ...typography.caption, color: colors.textMuted },
  body: { ...typography.bodySm, color: colors.textSecondary },
  emphasis: { fontWeight: "700", color: colors.primary },
  successTitle: { ...typography.headlineSm, color: colors.success },
  input: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.minTouch,
    ...typography.bodyMd,
    color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    minHeight: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  disabled: { opacity: 0.45 },
  error: { ...typography.bodySm, color: colors.error },
  link: { ...typography.labelLg, color: colors.primary },
  help: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helpTitle: { ...typography.labelLg, color: colors.text },
});
