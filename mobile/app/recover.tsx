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
import { AuthField } from "../components/auth/AuthField";
import { AuthFooter } from "../components/auth/AuthFooter";
import { AuthHeader } from "../components/auth/AuthHeader";
import { MaterialIcon } from "../components/MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { HELPLINE } from "../data/staticContent";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

type Channel = "sms" | "email";

export default function RecoverScreen() {
  const router = useRouter();
  const { sendPasswordReset, clearError, error } = useAuth();
  const [channel, setChannel] = useState<Channel>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const message = localError || error;

  const onSend = async () => {
    setLocalError(null);
    clearError();
    if (channel === "sms") {
      setLocalError(
        "SMS OTP recovery matches the design. Use Via Email for live Firebase password reset.",
      );
      return;
    }
    setBusy(true);
    try {
      await sendPasswordReset(identifier);
      setSent(true);
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Could not send reset instructions.",
      );
    } finally {
      setBusy(false);
    }
  };

  const setOtpDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title="Reset Password" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={styles.backLink}
            onPress={() => router.replace(href("/sign-in"))}
          >
            <MaterialIcon name="arrow_back" size={16} color={colors.primary} />
            <Text style={styles.backLinkText}>Back to Sign In</Text>
          </Pressable>

          <Text style={styles.pageTitle}>Reset Password</Text>

          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <MaterialIcon name="lock_reset" size={28} color={colors.card} />
            </View>
            <Text style={styles.introTitle}>Reset Your Password or PIN</Text>
            <Text style={styles.introBody}>
              Enter your registered South African ID Number, Mobile Phone, or Email. We
              will send a free zero-rated verification so you can safely reset your login
              credentials.
            </Text>
            <View style={styles.popiaBar}>
              <MaterialIcon name="verified_user" size={16} color={colors.secondary} />
              <Text style={styles.popiaText}>
                POPIA Protected – Zero Actions on Mobile Data Required
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.steps}>
              <View style={styles.stepItem}>
                <View style={[styles.stepBadge, !sent && styles.stepBadgeOn]}>
                  {sent ? (
                    <MaterialIcon name="check" size={14} color={colors.onPrimary} />
                  ) : (
                    <Text style={styles.stepNum}>1</Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, !sent && styles.stepLabelOn]}>
                  Verify Identity
                </Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <View style={[styles.stepBadge, sent && styles.stepBadgeOn]}>
                  <MaterialIcon
                    name="pin"
                    size={14}
                    color={sent ? colors.onPrimary : colors.textMuted}
                  />
                </View>
                <Text style={[styles.stepLabel, sent && styles.stepLabelOn]}>
                  Create New PIN
                </Text>
              </View>
            </View>

            <View style={styles.channelTrack}>
              {(
                [
                  ["sms", "Via SMS (Free)", "sms"],
                  ["email", "Via Email", "mail"],
                ] as const
              ).map(([id, label, icon]) => {
                const on = channel === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setChannel(id)}
                    style={[styles.channelTab, on && styles.channelTabOn]}
                  >
                    <MaterialIcon
                      name={icon}
                      size={18}
                      color={on ? colors.secondary : colors.textSecondary}
                    />
                    <Text style={[styles.channelText, on && styles.channelTextOn]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {!sent ? (
              <>
                <AuthField
                  label={
                    channel === "email"
                      ? "Email address on your profile *"
                      : "SA National ID (13 digits) or Cellphone Number *"
                  }
                  leadingIcon={channel === "email" ? "mail" : "badge"}
                  placeholder={
                    channel === "email"
                      ? "you@example.com"
                      : "e.g. 020514 5821 088 or 072 000 0000"
                  }
                  hint={
                    channel === "email"
                      ? "Live recovery uses your registered email via Firebase."
                      : "Free name lookup for Vodacom, MTN, Telkom, Cell C & Rain"
                  }
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType={channel === "email" ? "email-address" : "default"}
                  editable={!busy}
                />

                {message ? <Text style={styles.error}>{message}</Text> : null}

                <Pressable
                  style={[
                    styles.primaryBtn,
                    (busy || !identifier.trim()) && styles.disabled,
                  ]}
                  disabled={busy || !identifier.trim()}
                  onPress={() => void onSend()}
                >
                  {busy ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <>
                      <MaterialIcon
                        name="send_to_mobile"
                        size={20}
                        color={colors.onPrimary}
                      />
                      <Text style={styles.primaryText}>
                        {channel === "email"
                          ? "Send Free Verification / Reset Link"
                          : "Send Free Verification Code (OTP)"}
                      </Text>
                    </>
                  )}
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.sentBanner}>
                  <MaterialIcon name="celebration" size={18} color={colors.ochre} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sentBadge}>Reset email sent</Text>
                    <Text style={styles.sentBody}>
                      We sent password-reset instructions to{" "}
                      <Text style={styles.emphasis}>
                        {identifier.trim().toLowerCase()}
                      </Text>
                      . Open the link, set a new password or PIN, then sign in.
                    </Text>
                  </View>
                </View>

                <Text style={styles.fieldLabel}>6-Digit Verification Code (OTP)</Text>
                <View style={styles.otpRow}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={`otp-${index}`}
                      value={digit}
                      onChangeText={(v) => setOtpDigit(index, v)}
                      keyboardType="number-pad"
                      maxLength={1}
                      style={styles.otpBox}
                      editable={false}
                    />
                  ))}
                </View>
                <View style={styles.timerRow}>
                  <MaterialIcon name="timer" size={16} color={colors.error} />
                  <Text style={styles.timerText}>Code expires in 04:41</Text>
                  <Pressable>
                    <Text style={styles.resend}>Resend Free SMS (Toll-Free)</Text>
                  </Pressable>
                </View>

                <AuthField
                  label="Set New 4–6 Digit PIN / Password"
                  leadingIcon="lock"
                  placeholder="New PIN or password"
                  value={newPin}
                  onChangeText={setNewPin}
                  secureTextEntry={!showPin}
                  editable={false}
                  trailing={
                    <Pressable onPress={() => setShowPin((v) => !v)}>
                      <MaterialIcon
                        name={showPin ? "visibility_off" : "visibility"}
                        size={20}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                  }
                />
                <AuthField
                  label="Confirm New PIN / Password"
                  leadingIcon="lock_reset"
                  placeholder="Confirm PIN or password"
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  secureTextEntry={!showConfirm}
                  editable={false}
                  trailing={
                    <Pressable onPress={() => setShowConfirm((v) => !v)}>
                      <MaterialIcon
                        name={showConfirm ? "visibility_off" : "visibility"}
                        size={20}
                        color={colors.textSecondary}
                      />
                    </Pressable>
                  }
                />

                <Pressable
                  style={styles.goldBtn}
                  onPress={() => router.replace(href("/sign-in"))}
                >
                  <MaterialIcon name="check_circle" size={20} color={colors.text} />
                  <Text style={styles.goldBtnText}>Update Password & Sign In</Text>
                </Pressable>
                <Pressable onPress={() => setSent(false)}>
                  <Text style={styles.linkCenter}>Use a different email</Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={styles.helpCard}>
            <View style={styles.helpHead}>
              <MaterialIcon name="contact_support" size={22} color={colors.gold} />
              <Text style={styles.helpTitle}>Can&apos;t access your registered phone?</Text>
            </View>
            <Text style={styles.helpBody}>
              If your cellphone number has been lost, stolen or expired, verify your
              identity directly with our dedicated DHET advisors.
            </Text>
            <Pressable
              style={styles.helpRow}
              onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
            >
              <MaterialIcon name="call" size={20} color={colors.primary} />
              <Text style={styles.helpRowText}>
                {HELPLINE.tollFreeDisplay} – Toll Free Helpline
              </Text>
              <MaterialIcon name="chevron_right" size={20} color={colors.textMuted} />
            </Pressable>
            <Pressable
              style={styles.helpRow}
              onPress={() =>
                void Linking.openURL(`https://wa.me/27${HELPLINE.whatsapp.slice(1)}`)
              }
            >
              <MaterialIcon name="chat" size={20} color={colors.success} />
              <Text style={styles.helpRowText}>
                {HELPLINE.whatsappDisplay} – WhatsApp CallBack
              </Text>
              <MaterialIcon name="open_in_new" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
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
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  backLinkText: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  pageTitle: { fontSize: 28, fontWeight: "700", color: colors.text, lineHeight: 34 },
  introCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  introTitle: { ...typography.headlineSm, color: colors.text, textAlign: "center" },
  introBody: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  popiaBar: {
    marginTop: spacing.sm,
    width: "100%",
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.md,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  popiaText: { ...typography.caption, color: colors.secondary, flex: 1, fontWeight: "600" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.card,
  },
  steps: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeOn: { backgroundColor: colors.primary },
  stepNum: { ...typography.caption, color: colors.textMuted, fontWeight: "700" },
  stepLabel: { ...typography.caption, color: colors.textMuted },
  stepLabelOn: { color: colors.primary, fontWeight: "700" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  channelTrack: {
    flexDirection: "row",
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  channelTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  channelTabOn: { borderBottomColor: colors.secondary },
  channelText: { ...typography.labelMd, color: colors.textSecondary },
  channelTextOn: { color: colors.secondary, fontWeight: "700" },
  primaryBtn: {
    minHeight: 52,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  primaryText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    textAlign: "center",
    flexShrink: 1,
  },
  goldBtn: {
    minHeight: layout.minTouch,
    backgroundColor: colors.gold,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  goldBtnText: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  disabled: { opacity: 0.45 },
  error: { ...typography.bodySm, color: colors.error },
  sentBanner: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  sentBadge: { ...typography.labelMd, color: colors.ochre, fontWeight: "700" },
  sentBody: { ...typography.bodySm, color: colors.textSecondary },
  emphasis: { fontWeight: "700", color: colors.primary },
  fieldLabel: { ...typography.labelLg, color: colors.text },
  otpRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  otpBox: {
    flex: 1,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.canvas,
    textAlign: "center",
    ...typography.headlineSm,
    color: colors.text,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: -8,
  },
  timerText: { ...typography.caption, color: colors.error, fontWeight: "600" },
  resend: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  linkCenter: {
    ...typography.labelLg,
    color: colors.primary,
    textAlign: "center",
  },
  helpCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  helpHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  helpTitle: { ...typography.headlineSm, color: colors.text, flex: 1 },
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  helpRow: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  helpRowText: { ...typography.labelMd, color: colors.text, flex: 1 },
});
