import { useEffect, useRef, useState } from "react";
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

const OTP_LENGTH = 6;
const OTP_SECONDS = 5 * 60;

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 6) return value.trim() || "your number";
  return `${digits.slice(0, 3)} *** ${digits.slice(-3)}`;
}

export default function RecoverScreen() {
  const router = useRouter();
  const { sendPasswordReset, clearError, error } = useAuth();
  const [channel, setChannel] = useState<Channel>("sms");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [success, setSuccess] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS);
  const otpRefs = useRef<(TextInput | null)[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const message = localError || error;
  const otpComplete = otp.every((d) => d.length === 1);
  const pinsMatch =
    newPin.length >= 4 && confirmPin.length >= 4 && newPin === confirmPin;

  useEffect(() => {
    if (step !== 2 || channel !== "sms" || success) return;
    setSecondsLeft(OTP_SECONDS);
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [step, channel, success]);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => {
      router.replace(href("/sign-in"));
    }, 2800);
    return () => clearTimeout(t);
  }, [success, router]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const onSend = async () => {
    setLocalError(null);
    clearError();
    const value = identifier.trim();
    if (!value) {
      setLocalError("Enter your ID, cellphone, or email to continue.");
      return;
    }

    if (channel === "email") {
      setBusy(true);
      try {
        await sendPasswordReset(value);
        setStep(2);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
      } catch (err) {
        setLocalError(
          err instanceof Error
            ? err.message
            : "Could not send reset instructions.",
        );
      } finally {
        setBusy(false);
      }
      return;
    }

    // SMS recovery UI matches Stitch; OTP entry is client-side demo until SMS gateway is wired.
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      setStep(2);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
        otpRefs.current[0]?.focus();
      }, 200);
    } finally {
      setBusy(false);
    }
  };

  const onResend = () => {
    setSecondsLeft(OTP_SECONDS);
    setLocalError(null);
    setOtp(Array(OTP_LENGTH).fill(""));
    otpRefs.current[0]?.focus();
  };

  const setOtpDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      // Paste support
      const chars = cleaned.slice(0, OTP_LENGTH).split("");
      setOtp((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = c;
        });
        return next;
      });
      const focusAt = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpRefs.current[focusAt]?.focus();
      return;
    }
    const digit = cleaned.slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onOtpKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onUpdate = () => {
    setLocalError(null);
    if (channel === "email") {
      router.replace(href("/sign-in"));
      return;
    }
    if (!otpComplete) {
      setLocalError("Enter the 6-digit verification code from your SMS.");
      return;
    }
    if (!pinsMatch) {
      setLocalError("PINs must match and be at least 4 digits.");
      return;
    }
    setSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title="Reset Password" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topRow}>
            <Pressable
              style={styles.backLink}
              onPress={() => router.replace(href("/sign-in"))}
            >
              <MaterialIcon name="arrow_back" size={18} color={colors.primary} />
              <Text style={styles.backLinkText}>Back to Sign In</Text>
            </Pressable>
            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Zero-Rated Line</Text>
            </View>
          </View>

          <View style={styles.introCard}>
            <View style={styles.introTop}>
              <View style={styles.introIcon}>
                <MaterialIcon name="lock_reset" size={24} color={colors.primary} />
              </View>
              <View style={styles.introCopy}>
                <Text style={styles.introTitle}>Reset Your Password or PIN</Text>
                <Text style={styles.introAlt}>
                  Setha kabusha iphasiwedi yakho · Khetha NCAP Citizen Access
                </Text>
                <Text style={styles.introBody}>
                  Enter your registered South African ID Number or Mobile Phone.
                  We will send a free zero-rated SMS verification code to safely
                  reset your login credentials.
                </Text>
              </View>
            </View>
            <View style={styles.popiaBar}>
              <MaterialIcon
                name="verified_user"
                size={16}
                color={colors.secondary}
              />
              <Text style={styles.popiaText}>
                POPIA Protected – Zero Airtime or Mobile Data Required
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.steps}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepBadge,
                    step === 1 && styles.stepBadgeOn,
                    step === 2 && styles.stepBadgeDone,
                  ]}
                >
                  {step === 2 ? (
                    <MaterialIcon name="check" size={14} color={colors.primary} />
                  ) : (
                    <Text style={styles.stepNumOn}>1</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step === 1 ? styles.stepLabelOn : styles.stepLabelMuted,
                  ]}
                >
                  Verify Identity
                </Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepItem}>
                <View
                  style={[styles.stepBadge, step === 2 && styles.stepBadgeOn]}
                >
                  <Text
                    style={step === 2 ? styles.stepNumOn : styles.stepNum}
                  >
                    2
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step === 2 ? styles.stepLabelOn : styles.stepLabelMuted,
                  ]}
                >
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
                    onPress={() => {
                      setChannel(id);
                      setStep(1);
                      setSuccess(false);
                      setLocalError(null);
                      clearError();
                    }}
                    style={[styles.channelTab, on && styles.channelTabOn]}
                  >
                    <MaterialIcon
                      name={icon}
                      size={18}
                      color={on ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[styles.channelText, on && styles.channelTextOn]}
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <AuthField
              label={
                channel === "email"
                  ? "Registered Email Address *"
                  : "SA National ID (13 digits) or Cellphone Number *"
              }
              leadingIcon={channel === "email" ? "mail" : "badge"}
              placeholder={
                channel === "email"
                  ? "e.g. learner@matric.dhet.gov.za"
                  : "e.g. 020514 5821 088 or 072 000 0000"
              }
              hint={
                channel === "email"
                  ? "We’ll email a secure Firebase password-reset link."
                  : "Free carrier lookup for Vodacom, MTN, Telkom, Cell C & Rain"
              }
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={channel === "email" ? "email-address" : "default"}
              editable={!busy && !success}
            />

            {message && step === 1 ? (
              <Text style={styles.error}>{message}</Text>
            ) : null}

            <Pressable
              style={[
                styles.primaryBtn,
                (busy || !identifier.trim() || success) && styles.disabled,
              ]}
              disabled={busy || !identifier.trim() || success}
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
                  <Text style={styles.primaryText} numberOfLines={2}>
                    {channel === "email"
                      ? "Send Free Verification / Reset Link"
                      : "Send Free Verification Code (OTP)"}
                  </Text>
                </>
              )}
            </Pressable>

            {step === 2 ? (
              <View style={styles.step2Panel}>
                <View style={styles.step2Head}>
                  <View style={styles.step2TitleRow}>
                    <MaterialIcon name="lock" size={18} color={colors.primary} />
                    <Text style={styles.step2Title}>
                      Step 2: Enter OTP & Create New PIN
                    </Text>
                  </View>
                  <View style={styles.sentPill}>
                    <Text style={styles.sentPillText}>
                      {channel === "email"
                        ? "Reset email sent"
                        : "Zero-Rated SMS Sent"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.step2Body}>
                  {channel === "email" ? (
                    <>
                      We sent password-reset instructions to{" "}
                      <Text style={styles.emphasis}>
                        {identifier.trim().toLowerCase()}
                      </Text>
                      . Open the link to set a new password, then sign in.
                    </>
                  ) : (
                    <>
                      We dispatched a free one-time token to{" "}
                      <Text style={styles.emphasis}>
                        {maskPhone(identifier)}
                      </Text>
                      .
                    </>
                  )}
                </Text>

                {channel === "sms" ? (
                  <>
                    <Text style={styles.fieldLabel}>
                      6-Digit Verification Code (OTP)
                    </Text>
                    <View style={styles.otpRow}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={`otp-${index}`}
                          ref={(el) => {
                            otpRefs.current[index] = el;
                          }}
                          value={digit}
                          onChangeText={(v) => setOtpDigit(index, v)}
                          onKeyPress={({ nativeEvent }) =>
                            onOtpKeyPress(index, nativeEvent.key)
                          }
                          keyboardType="number-pad"
                          maxLength={1}
                          style={styles.otpBox}
                          editable={!success}
                          selectTextOnFocus
                          textContentType="oneTimeCode"
                        />
                      ))}
                    </View>
                    <View style={styles.timerRow}>
                      <MaterialIcon name="timer" size={16} color={colors.error} />
                      <Text style={styles.timerText}>
                        Code expires in {mm}:{ss}
                      </Text>
                      <Pressable onPress={onResend} disabled={success}>
                        <Text style={styles.resend}>
                          Resend Free SMS (Toll-Free)
                        </Text>
                      </Pressable>
                    </View>

                    <AuthField
                      label="Set New 6-Digit PIN / Password"
                      leadingIcon="pin"
                      placeholder="e.g. 582914"
                      value={newPin}
                      onChangeText={setNewPin}
                      secureTextEntry={!showPin}
                      editable={!success}
                      keyboardType="number-pad"
                      maxLength={12}
                      trailing={
                        <Pressable
                          onPress={() => setShowPin((v) => !v)}
                          hitSlop={8}
                        >
                          <MaterialIcon
                            name={showPin ? "visibility_off" : "visibility"}
                            size={20}
                            color={colors.textSecondary}
                          />
                        </Pressable>
                      }
                    />
                    <AuthField
                      label="Confirm New 6-Digit PIN"
                      leadingIcon="lock_reset"
                      placeholder="Re-type 6-digit PIN"
                      value={confirmPin}
                      onChangeText={setConfirmPin}
                      secureTextEntry={!showConfirm}
                      editable={!success}
                      keyboardType="number-pad"
                      maxLength={12}
                      trailing={
                        <Pressable
                          onPress={() => setShowConfirm((v) => !v)}
                          hitSlop={8}
                        >
                          <MaterialIcon
                            name={
                              showConfirm ? "visibility_off" : "visibility"
                            }
                            size={20}
                            color={colors.textSecondary}
                          />
                        </Pressable>
                      }
                    />
                  </>
                ) : null}

                {message && step === 2 ? (
                  <Text style={styles.error}>{message}</Text>
                ) : null}

                <Pressable
                  style={[styles.goldBtn, success && styles.disabled]}
                  disabled={success}
                  onPress={onUpdate}
                >
                  <MaterialIcon
                    name="check_circle"
                    size={20}
                    color={colors.text}
                  />
                  <Text style={styles.goldBtnText} numberOfLines={1}>
                    Update Password & Sign In
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </View>

          {success ? (
            <View style={styles.successToast}>
              <View style={styles.successIcon}>
                <MaterialIcon
                  name="celebration"
                  size={22}
                  color={colors.onPrimary}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.successTitle}>PIN Updated Successfully!</Text>
                <Text style={styles.successBody}>
                  Redirecting to your Khetha NCAP Career Dashboard in 3
                  seconds...
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.helpCard}>
            <View style={styles.helpHead}>
              <MaterialIcon
                name="contact_support"
                size={22}
                color={colors.gold}
              />
              <Text style={styles.helpTitle}>
                Can&apos;t access your registered phone?
              </Text>
            </View>
            <Text style={styles.helpBody}>
              If your cellphone number has been lost, stolen, or expired, verify
              your identity directly with our dedicated DHET advisors.
            </Text>
            <Pressable
              style={styles.helpRow}
              onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
            >
              <MaterialIcon name="call" size={20} color={colors.primary} />
              <Text style={styles.helpRowText}>
                {HELPLINE.tollFreeDisplay} – Toll-Free Helpline
              </Text>
              <MaterialIcon
                name="chevron_right"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
            <Pressable
              style={styles.helpRow}
              onPress={() =>
                void Linking.openURL(
                  `https://wa.me/27${HELPLINE.whatsapp.slice(1)}`,
                )
              }
            >
              <MaterialIcon name="chat" size={20} color={colors.success} />
              <Text style={styles.helpRowText}>
                {HELPLINE.whatsappDisplay} – WhatsApp Callback
              </Text>
              <MaterialIcon
                name="open_in_new"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          </View>

          <Text style={styles.langHint}>
            Udinga usizo ngolimi lwakho? · Udinga uncedo ngolwimi lwakho? · Hulp
            nodig in jou taal?
          </Text>
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 44,
  },
  backLinkText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  liveText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  introCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  introTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  introIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  introCopy: { flex: 1, minWidth: 0, gap: 4 },
  introTitle: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 30,
    color: colors.text,
  },
  introAlt: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  introBody: { ...typography.bodySm, color: colors.textSecondary },
  popiaBar: {
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  popiaText: {
    ...typography.caption,
    color: colors.secondary,
    flex: 1,
    flexShrink: 1,
    fontWeight: "600",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadows.card,
  },
  steps: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeOn: { backgroundColor: colors.primary },
  stepBadgeDone: { backgroundColor: colors.primaryMuted },
  stepNum: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: "700",
  },
  stepNumOn: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  stepLabel: { ...typography.labelMd, flexShrink: 1 },
  stepLabelOn: { color: colors.primary, fontWeight: "700" },
  stepLabelMuted: { color: colors.textSecondary, fontWeight: "500" },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E7EEFF",
    borderRadius: 1,
  },
  channelTrack: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: 4,
    gap: 4,
  },
  channelTab: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.sm,
  },
  channelTabOn: {
    backgroundColor: colors.card,
    ...shadows.card,
  },
  channelText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "500",
    flexShrink: 1,
  },
  channelTextOn: { color: colors.primary, fontWeight: "700" },
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
    fontWeight: "700",
  },
  step2Panel: {
    backgroundColor: "rgba(240,243,255,0.85)",
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  step2Head: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  step2TitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  step2Title: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
    flexShrink: 1,
  },
  sentPill: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexShrink: 0,
  },
  sentPillText: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "700",
  },
  step2Body: { ...typography.bodySm, color: colors.textSecondary },
  emphasis: { fontWeight: "700", color: colors.primary },
  fieldLabel: { ...typography.labelLg, color: colors.text },
  otpRow: { flexDirection: "row", justifyContent: "space-between", gap: 6 },
  otpBox: {
    flex: 1,
    minWidth: 0,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.canvas,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    paddingVertical: Platform.OS === "android" ? 8 : 10,
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  timerText: { ...typography.caption, color: colors.error, fontWeight: "600" },
  resend: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  goldBtn: {
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
  },
  disabled: { opacity: 0.45 },
  error: { ...typography.bodySm, color: colors.error },
  successToast: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    ...typography.labelLg,
    color: colors.success,
    fontWeight: "700",
  },
  successBody: { ...typography.caption, color: colors.textSecondary },
  helpCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  helpHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  helpTitle: {
    ...typography.headlineSm,
    color: colors.text,
    flex: 1,
    flexShrink: 1,
  },
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
  helpRowText: {
    ...typography.labelMd,
    color: colors.text,
    flex: 1,
    flexShrink: 1,
  },
  langHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: spacing.sm,
  },
});
