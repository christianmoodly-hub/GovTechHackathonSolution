import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthField, AuthCheckbox } from "../components/auth/AuthField";
import { AuthFooter, HelpContactCards } from "../components/auth/AuthFooter";
import { AuthHeader } from "../components/auth/AuthHeader";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { MaterialIcon } from "../components/MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

const vaultImg = require("../assets/auth/feature-vault.jpg");
const tvetImg = require("../assets/auth/feature-tvet.jpg");

type Method = "sa_id" | "mobile_email" | "passport";

const METHODS: { id: Method; label: string; icon: string }[] = [
  { id: "sa_id", label: "SA ID", icon: "badge" },
  { id: "mobile_email", label: "Mobile / Email", icon: "contact_phone" },
  { id: "passport", label: "Passport /\nRefugee", icon: "flight" },
];

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

  const [method, setMethod] = useState<Method>("sa_id");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [linkSentTo, setLinkSentTo] = useState<string | null>(null);

  const message = localError || error;

  const fieldMeta = useMemo(() => {
    if (method === "sa_id") {
      return {
        label: "South African ID Number",
        trailing: "13 Digits",
        placeholder: "e.g. 050112 5089 088",
        hint: "Official 13-digit identity number as recorded in the National Population Register.",
        keyboardType: "number-pad" as const,
        icon: "pin",
      };
    }
    if (method === "passport") {
      return {
        label: "Passport / Refugee Document",
        trailing: "Alphanumeric",
        placeholder: "e.g. A01234567 or DHA-No",
        hint: "Provide your valid Home Affairs-recognized foreign passport or asylum permit number.",
        keyboardType: "default" as const,
        icon: "badge",
      };
    }
    return {
      label: "Mobile Phone Number or Email",
      trailing: "Registered",
      placeholder: "e.g. 072 123 4567 or you@email.com",
      hint: "Enter the cellular number or email address linked to your Khetha profile.",
      keyboardType: "email-address" as const,
      icon: "contact_phone",
    };
  }, [method]);

  const onSignIn = async () => {
    setLocalError(null);
    clearError();

    if (method !== "mobile_email") {
      setLocalError(
        "SA ID and Passport sign-in UI matches the design. Switch to Mobile / Email for live Firebase auth.",
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
      setLocalError("One-time email / OTP sign-in works from the Mobile / Email tab.");
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
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title="Sign In" showBack={false} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.ssoBanner}>
            <View style={styles.ssoLeft}>
              <View style={styles.ssoIcon}>
                <MaterialIcon name="verified_user" size={18} color={colors.card} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.ssoTitle} numberOfLines={1}>
                  Official DHET Single Sign-On
                </Text>
                <View style={styles.ssoSubRow}>
                  <View style={styles.pulse} />
                  <Text style={styles.ssoSub} numberOfLines={1}>
                    Zero-Rated (No Data or Airtime Needed)
                  </Text>
                </View>
              </View>
            </View>
            <MaterialIcon name="cell_tower" size={20} color={colors.success} />
          </View>

          <View style={styles.intro}>
            <Text style={styles.headline}>Sign In to Khetha NCAP</Text>
            <Text style={styles.subtitle}>
              Access your saved questionnaires, APS calculations, bursary applications,
              and DHET career vault.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.methodLabel}>Choose Sign-In Method</Text>
            <View style={styles.methodTrack}>
              {METHODS.map((item) => {
                const on = method === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setMethod(item.id)}
                    style={[styles.methodTab, on && styles.methodTabOn]}
                  >
                    <MaterialIcon
                      name={item.icon}
                      size={18}
                      color={on ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[styles.methodTabText, on && styles.methodTabTextOn]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {linkSentTo ? (
              <View style={styles.linkSent}>
                <Text style={styles.linkSentTitle}>Check your inbox</Text>
                <Text style={styles.subtitle}>
                  A one-tap sign-in link was sent to{" "}
                  <Text style={styles.emphasis}>{linkSentTo}</Text>. Open it on this device.
                </Text>
                <Pressable onPress={() => setLinkSentTo(null)}>
                  <Text style={styles.forgot}>Use a different email</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <AuthField
                  label={fieldMeta.label}
                  trailingLabel={fieldMeta.trailing}
                  leadingIcon={fieldMeta.icon}
                  placeholder={fieldMeta.placeholder}
                  hint={fieldMeta.hint}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={fieldMeta.keyboardType}
                  editable={!busy && !isLoading}
                />

                <View>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>Password or 5-Digit PIN</Text>
                    <Pressable onPress={() => router.push(href("/recover"))}>
                      <Text style={styles.forgot}>Forgot?</Text>
                    </Pressable>
                  </View>
                  <AuthField
                    leadingIcon="lock"
                    placeholder="Enter password or PIN"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!busy && !isLoading}
                    autoCapitalize="none"
                    autoCorrect={false}
                    trailing={
                      <Pressable
                        onPress={() => setShowPassword((v) => !v)}
                        accessibilityLabel="Toggle password visibility"
                        hitSlop={8}
                      >
                        <MaterialIcon
                          name={showPassword ? "visibility_off" : "visibility"}
                          size={20}
                          color={colors.textSecondary}
                        />
                      </Pressable>
                    }
                  />
                </View>

                <AuthCheckbox
                  checked={rememberDevice}
                  onToggle={() => setRememberDevice((v) => !v)}
                  title="Remember device for offline career access"
                  body="Allows opening cached CVs, saved qualifications, and APS records without logging in each time."
                />

                {message ? <Text style={styles.error}>{message}</Text> : null}

                <View style={styles.btnStack}>
                  <Pressable
                    style={[styles.primaryBtn, (busy || isLoading) && styles.disabled]}
                    disabled={busy || isLoading}
                    onPress={() => void onSignIn()}
                  >
                    {busy ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <>
                        <MaterialIcon name="lock_open" size={20} color={colors.onPrimary} />
                        <Text style={styles.primaryText}>Sign In to NCAP</Text>
                      </>
                    )}
                  </Pressable>
                  <Pressable
                    style={styles.secondaryBtn}
                    disabled={busy || isLoading}
                    onPress={() => void onEmailLink()}
                  >
                    <MaterialIcon name="sms" size={20} color={colors.primary} />
                    <Text style={styles.secondaryText} numberOfLines={2}>
                      Sign in with One-Time PIN (SMS)
                    </Text>
                  </Pressable>

                  <View style={styles.orRow}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.orLine} />
                  </View>

                  <GoogleSignInButton
                    disabled={busy || isLoading}
                    onError={(msg) => {
                      if (!msg) {
                        setLocalError(null);
                        return;
                      }
                      setLocalError(msg);
                    }}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.bioCard}>
            <View style={styles.bioLeft}>
              <View style={styles.bioIcon}>
                <MaterialIcon name="fingerprint" size={22} color={colors.secondary} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.bioTitle} numberOfLines={1}>
                  Quick Biometric Sign-In
                </Text>
                <Text style={styles.bioSub} numberOfLines={2}>
                  Enable Fingerprint or Face ID for this device
                </Text>
              </View>
            </View>
            <Pressable style={styles.enableBtn}>
              <Text style={styles.enableText}>Enable</Text>
            </Pressable>
          </View>

          <View style={styles.featureRow}>
            <ImageBackground source={vaultImg} style={styles.featureCard} imageStyle={styles.featureImg}>
              <View style={styles.featureOverlay}>
                <Text style={styles.featureKickerGold} numberOfLines={1}>
                  Career Vault
                </Text>
                <Text style={styles.featureTitle} numberOfLines={2}>
                  Access Stored APS & Bursaries
                </Text>
              </View>
            </ImageBackground>
            <ImageBackground source={tvetImg} style={styles.featureCard} imageStyle={styles.featureImg}>
              <View style={styles.featureOverlay}>
                <Text style={styles.featureKickerGreen} numberOfLines={1}>
                  TVET & Skills
                </Text>
                <Text style={styles.featureTitle} numberOfLines={2}>
                  Track Your Artisan Progress
                </Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.registerBlock}>
            <Text style={styles.registerPrompt}>Don&apos;t have a Khetha NCAP profile yet?</Text>
            <Pressable
              style={styles.goldBtn}
              onPress={() => router.push(href("/register"))}
            >
              <MaterialIcon name="person_add" size={20} color={colors.text} />
              <Text style={styles.goldBtnText}>Register / Create Free Account</Text>
            </Pressable>
            <Text style={styles.caption}>
              Free for all South African citizens and resident learners
            </Text>
          </View>

          <Pressable
            style={styles.guestBtn}
            disabled={busy}
            onPress={() => void onGuest()}
          >
            <MaterialIcon name="explore" size={18} color={colors.textSecondary} />
            <Text style={styles.guestText} numberOfLines={2}>
              Continue as Guest / Explore Careers Without Signing In
            </Text>
          </Pressable>

          <HelpContactCards />
        </ScrollView>
        <AuthFooter />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9F9FF" },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  ssoBanner: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    ...shadows.card,
  },
  ssoLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 },
  ssoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#08503C",
    alignItems: "center",
    justifyContent: "center",
  },
  ssoTitle: {
    ...typography.labelMd,
    color: "#08503C",
    fontWeight: "700",
  },
  ssoSubRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  ssoSub: { ...typography.caption, color: colors.success },
  intro: { gap: 4, marginBottom: spacing.xs },
  headline: { fontSize: 22, fontWeight: "700", lineHeight: 30, color: colors.text },
  subtitle: { ...typography.bodySm, color: colors.textSecondary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadows.card,
  },
  methodLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: -spacing.sm,
  },
  methodTrack: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: 4,
    gap: 4,
  },
  methodTab: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  methodTabOn: {
    backgroundColor: colors.card,
    ...shadows.card,
  },
  methodTabText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },
  methodTabTextOn: { fontWeight: "700", color: colors.primary },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 4,
  },
  fieldLabel: { ...typography.labelLg, color: colors.text, flexShrink: 1 },
  forgot: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  btnStack: { gap: spacing.sm, paddingTop: spacing.xs },
  primaryBtn: {
    minHeight: 52,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.card,
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  secondaryBtn: {
    minHeight: layout.minTouch,
    backgroundColor: "#E7EEFF",
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    ...typography.labelLg,
    color: colors.text,
    flexShrink: 1,
    textAlign: "center",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: 2,
  },
  orLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.borderStrong },
  orText: { ...typography.caption, color: colors.textMuted, textTransform: "uppercase" },
  disabled: { opacity: 0.5 },
  error: { ...typography.bodySm, color: colors.error },
  emphasis: { fontWeight: "700", color: colors.primary },
  linkSent: { gap: spacing.sm },
  linkSentTitle: { ...typography.headlineSm, color: colors.text },
  bioCard: {
    backgroundColor: "#F0F3FF",
    borderRadius: radii.xl,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  bioLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flex: 1 },
  bioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  bioTitle: { ...typography.labelMd, color: colors.text, fontWeight: "700" },
  bioSub: { ...typography.caption, color: colors.textSecondary },
  enableBtn: {
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  enableText: { ...typography.labelMd, color: colors.onPrimary },
  featureRow: { flexDirection: "row", gap: spacing.sm },
  featureCard: {
    flex: 1,
    minWidth: 0,
    height: 112,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },
  featureImg: { borderRadius: radii.xl },
  featureOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "rgba(15,23,42,0.55)",
  },
  featureKickerGold: {
    ...typography.caption,
    color: colors.gold,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featureKickerGreen: {
    ...typography.caption,
    color: "#9EF4D0",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  featureTitle: {
    ...typography.labelMd,
    color: colors.card,
    fontWeight: "700",
    lineHeight: 16,
  },
  registerBlock: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  registerPrompt: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: "center",
  },
  goldBtn: {
    width: "100%",
    minHeight: layout.minTouch,
    backgroundColor: colors.gold,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  goldBtnText: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  guestBtn: {
    minHeight: layout.minTouch,
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  guestText: {
    ...typography.labelMd,
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    textAlign: "center",
  },
});
