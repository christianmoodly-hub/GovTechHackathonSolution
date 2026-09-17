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

type Method = "sa_id" | "mobile_email" | "passport";

export default function SignInScreen() {
  const router = useRouter();
  const {
    signInWithPassword,
    sendSignInLink,
    continueAsGuest,
    error,
    clearError,
    isLoading,
  } = useAuth();

  const [method, setMethod] = useState<Method>("mobile_email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [linkSentTo, setLinkSentTo] = useState<string | null>(null);

  const message = localError || error;

  const onSignIn = async () => {
    setLocalError(null);
    clearError();

    if (method !== "mobile_email") {
      setLocalError(
        "SA ID and Passport sign-in UI is ready for demo. Use Mobile / Email for live Firebase auth.",
      );
      return;
    }

    setBusy(true);
    try {
      await signInWithPassword(identifier, password);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  const onEmailLink = async () => {
    setLocalError(null);
    clearError();
    if (method !== "mobile_email") {
      setLocalError("Email magic-link works from the Mobile / Email tab.");
      return;
    }
    setBusy(true);
    try {
      await sendSignInLink(identifier);
      setLinkSentTo(identifier.trim().toLowerCase());
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Could not send sign-in link.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onGuest = async () => {
    setLocalError(null);
    clearError();
    setBusy(true);
    try {
      await continueAsGuest();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Guest mode failed.");
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
          <Text style={styles.brand}>Khetha NCAP · DHET</Text>
          <Text style={styles.badge}>Zero-rated · Official DHET career services</Text>
          <Text style={styles.title}>Sign in to Khetha NCAP</Text>
          <Text style={styles.subtitle}>
            Access saved questionnaires, APS calculations, bursary pathways, and your career vault.
          </Text>

          <View style={styles.methodRow}>
            {(
              [
                ["sa_id", "SA ID"],
                ["mobile_email", "Mobile / Email"],
                ["passport", "Passport"],
              ] as const
            ).map(([id, label]) => (
              <Pressable
                key={id}
                onPress={() => setMethod(id)}
                style={[styles.methodChip, method === id && styles.methodChipOn]}
              >
                <Text style={[styles.methodText, method === id && styles.methodTextOn]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {linkSentTo ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Check your inbox</Text>
              <Text style={styles.body}>
                A one-tap sign-in link was sent to{" "}
                <Text style={styles.emphasis}>{linkSentTo}</Text>. Open it on this device.
              </Text>
              <Pressable onPress={() => setLinkSentTo(null)}>
                <Text style={styles.link}>Use a different email</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.label}>
                {method === "sa_id"
                  ? "South African ID number"
                  : method === "passport"
                    ? "Passport / refugee number"
                    : "Email address"}
              </Text>
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={method === "mobile_email" ? "email-address" : "default"}
                placeholder={
                  method === "sa_id"
                    ? "13-digit ID number"
                    : method === "passport"
                      ? "Passport or asylum number"
                      : "you@example.com"
                }
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                editable={!busy && !isLoading}
              />

              <View style={styles.rowBetween}>
                <Text style={styles.label}>Password or 5–6 digit PIN</Text>
                <Pressable onPress={() => router.push(href("/recover"))}>
                  <Text style={styles.link}>Forgot?</Text>
                </Pressable>
              </View>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, styles.passwordInput]}
                  editable={!busy && !isLoading}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eye}>
                  <Text style={styles.link}>{showPassword ? "Hide" : "Show"}</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.checkRow}
                onPress={() => setRememberDevice((v) => !v)}
              >
                <View style={[styles.checkbox, rememberDevice && styles.checkboxOn]}>
                  {rememberDevice ? <Text style={styles.checkMark}>✓</Text> : null}
                </View>
                <Text style={styles.checkLabel}>
                  Remember device for offline career access
                </Text>
              </Pressable>

              {message ? <Text style={styles.error}>{message}</Text> : null}

              <Pressable
                style={[styles.primaryBtn, (busy || isLoading) && styles.disabled]}
                disabled={busy || isLoading}
                onPress={() => void onSignIn()}
              >
                {busy ? (
                  <ActivityIndicator color={colors.onPrimary} />
                ) : (
                  <Text style={styles.primaryText}>Sign in to NCAP</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.secondaryBtn}
                disabled={busy || isLoading}
                onPress={() => void onEmailLink()}
              >
                <Text style={styles.secondaryText}>Sign in with one-time email link</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.footerCard}>
            <Text style={styles.body}>Don&apos;t have a Khetha NCAP profile yet?</Text>
            <Pressable onPress={() => router.push(href("/register"))}>
              <Text style={styles.link}>Register / create free account →</Text>
            </Pressable>
            <Pressable onPress={() => void onGuest()} disabled={busy}>
              <Text style={styles.guest}>Continue as guest / explore careers</Text>
            </Pressable>
          </View>

          <View style={styles.help}>
            <Text style={styles.helpTitle}>Need help logging in?</Text>
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
  brand: {
    ...typography.labelMd,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  badge: { ...typography.caption, color: colors.secondary },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  methodRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  methodChip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  methodChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  methodText: { ...typography.labelLg, color: colors.text },
  methodTextOn: { color: colors.onPrimary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  label: { ...typography.labelLg, color: colors.text },
  body: { ...typography.bodySm, color: colors.textSecondary },
  emphasis: { fontWeight: "700", color: colors.primary },
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
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 72 },
  eye: { position: "absolute", right: spacing.lg, top: 14 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkRow: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.onPrimary, fontWeight: "700", fontSize: 12 },
  checkLabel: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    minHeight: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radii.md,
    minHeight: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { ...typography.labelLg, color: colors.primary },
  disabled: { opacity: 0.5 },
  error: { ...typography.bodySm, color: colors.error },
  link: { ...typography.labelLg, color: colors.primary },
  footerCard: { gap: spacing.sm },
  guest: { ...typography.bodyMd, color: colors.textSecondary, textDecorationLine: "underline" },
  help: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helpTitle: { ...typography.labelLg, color: colors.text },
});
