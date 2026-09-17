import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AuthCheckbox, AuthField } from "../components/auth/AuthField";
import { AuthFooter } from "../components/auth/AuthFooter";
import { AuthHeader } from "../components/auth/AuthHeader";
import { MaterialIcon } from "../components/MaterialIcon";
import { useAuth } from "../contexts/AuthContext";
import { HELPLINE, PROVINCES, REGISTER_ROLES } from "../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

const classroomImg = require("../assets/auth/feature-classroom.jpg");

type DocType = "rsa_id" | "passport" | "asylum";

const ROLE_ICONS: Record<string, { icon: string; color: string }> = {
  grade9_10: { icon: "auto_stories", color: colors.primary },
  grade11_12: { icon: "history_edu", color: colors.primary },
  tvet: { icon: "engineering", color: colors.ochre },
  university: { icon: "account_balance", color: colors.secondary },
  work_seeker: { icon: "work_outline", color: "#6D28D9" },
};

export default function RegisterScreen() {
  const router = useRouter();
  const { registerWithPassword, clearError, error, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [docType, setDocType] = useState<DocType>("rsa_id");
  const [saIdOrPassport, setSaIdOrPassport] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [role, setRole] = useState("grade11_12");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [hasDisability, setHasDisability] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const message = localError || error;

  const idValid = useMemo(() => {
    if (docType !== "rsa_id") return null;
    const digits = saIdOrPassport.replace(/\D/g, "");
    if (digits.length < 13) return null;
    let sum = 0;
    for (let i = 0; i < 13; i += 1) {
      let n = Number(digits[i]);
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    return sum % 10 === 0;
  }, [docType, saIdOrPassport]);

  const canSubmit = useMemo(
    () =>
      Boolean(
        fullName.trim() &&
          email.trim() &&
          pin.length >= 6 &&
          pin === confirmPin &&
          role &&
          agreed,
      ),
    [fullName, email, pin, confirmPin, role, agreed],
  );

  const onSubmit = async () => {
    setLocalError(null);
    clearError();
    if (pin !== confirmPin) {
      setLocalError("PIN / password confirmation does not match.");
      return;
    }
    if (!agreed) {
      setLocalError("Please accept the DHET data collection agreement.");
      return;
    }

    setBusy(true);
    try {
      await registerWithPassword({
        email,
        password: pin,
        fullName,
        demographics: {
          preferredLanguage: "en",
          role,
          hasDisability,
          disabilityCategories: [],
          fullName: fullName.trim(),
          documentType: docType,
          saIdOrPassport: saIdOrPassport.trim() || undefined,
          mobile: mobile.trim() || undefined,
          email: email.trim().toLowerCase(),
          province: province || undefined,
          dateOfBirth: dateOfBirth.trim() || undefined,
          gender: gender || undefined,
        },
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title="Create Profile" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.metaRow}>
            <View style={styles.locationPill}>
              <View style={styles.liveDot} />
              <Text style={styles.locationText} numberOfLines={1}>
                White River · Nelspruit (Mbombela), MP-SA
              </Text>
            </View>
            <View style={styles.sessionPill}>
              <Text style={styles.sessionText}>Session 25m</Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.headline}>Create Your Free Khetha Profile</Text>
            <Text style={styles.subtitle}>
              Get personalized career, bursary and study guidance.
            </Text>
            <View style={styles.trustRow}>
              <View style={styles.trustChip}>
                <MaterialIcon name="wifi_tethering" size={16} color={colors.success} />
                <Text style={styles.trustText}>100% Free · Zero-Rated</Text>
              </View>
              <View style={styles.trustChip}>
                <MaterialIcon name="bolt" size={14} color={colors.success} />
                <Text style={styles.trustText}>Instant SMS Access</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressLabel}>Step 1 of 4</Text>
          </View>

          {/* Personal Information */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="badge" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Follow the prompts for particulars below.
                </Text>
              </View>
              <MaterialIcon name="badge" size={20} color={colors.primary} />
            </View>

            <AuthField
              label="Full Legal Name & Surname"
              leadingIcon="person"
              placeholder="e.g. Lerato Nomvula Shabangu"
              hint="As per ID Document / Copy"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.fieldLabel}>Citizen Document Type</Text>
            <View style={styles.docRow}>
              {(
                [
                  ["asylum", "Asylum / Refugee"],
                  ["rsa_id", "RSA ID"],
                  ["passport", "Passport / Foreign"],
                ] as const
              ).map(([id, label]) => {
                const on = docType === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setDocType(id)}
                    style={[styles.docChip, on && styles.docChipOn]}
                  >
                    {id === "rsa_id" ? (
                      <Text style={{ fontSize: 12 }}>{on ? "🇿🇦" : ""}</Text>
                    ) : null}
                    <Text style={[styles.docChipText, on && styles.docChipTextOn]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <AuthField
              label={
                docType === "rsa_id"
                  ? "RSA ID Number (13 Digits)"
                  : "Passport / Asylum Number"
              }
              leadingIcon="fingerprint"
              placeholder={
                docType === "rsa_id" ? "e.g. 7401015800088" : "Document number"
              }
              value={saIdOrPassport}
              onChangeText={setSaIdOrPassport}
              keyboardType={docType === "rsa_id" ? "number-pad" : "default"}
              maxLength={docType === "rsa_id" ? 13 : 40}
              trailing={
                idValid === true ? (
                  <MaterialIcon name="check_circle" size={22} color={colors.success} />
                ) : idValid === false ? (
                  <MaterialIcon name="warning" size={22} color={colors.warning} />
                ) : (
                  <MaterialIcon name="fingerprint" size={20} color={colors.borderStrong} />
                )
              }
            />
            {idValid === true ? (
              <View style={styles.validRow}>
                <MaterialIcon name="verified" size={16} color={colors.success} />
                <Text style={styles.validText}>ID checksum verified</Text>
              </View>
            ) : null}

            <AuthField
              label="Date of Birth"
              leadingIcon="history_edu"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {["Female", "Male", "Prefer not to say"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  style={[styles.chip, gender === item && styles.chipOn]}
                >
                  <Text style={[styles.chipText, gender === item && styles.chipTextOn]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Contact */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="mark_chat_read" size={20} color="#1D4ED8" />
                  <Text style={styles.sectionTitle}>Contact & Province</Text>
                </View>
                <Text style={styles.sectionSub}>
                  We need primary contact information to serve you.
                </Text>
              </View>
              <MaterialIcon name="mark_chat_read" size={20} color="#1D4ED8" />
            </View>

            <AuthField
              label="Primary Mobile Number"
              leadingIcon="sms"
              placeholder="+27 72 000 0000"
              hint="Select +27 for South Africa. Used for free OTP login, exam reminders & advisor calls."
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <AuthField
              label="Email Address"
              trailingLabel="Optional but advised"
              leadingIcon="mail"
              placeholder="your@emailaddress.co.za"
              hint="Required for Firebase account security and password recovery."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.fieldLabel}>Province of Residence</Text>
            <View style={styles.chipRow}>
              {PROVINCES.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setProvince(item)}
                  style={[styles.chip, province === item && styles.chipOn]}
                >
                  <Text style={[styles.chipText, province === item && styles.chipTextOn]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Situation */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="school" size={20} color={colors.ochre} />
                  <Text style={styles.sectionTitle}>Your Current Situation</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Please describe your current education and training options.
                </Text>
              </View>
              <MaterialIcon name="school" size={20} color={colors.ochre} />
            </View>

            <View style={styles.roleGrid}>
              {REGISTER_ROLES.filter((r) => r.id !== "work_seeker").map((item) => {
                const meta = ROLE_ICONS[item.id] ?? {
                  icon: "school",
                  color: colors.primary,
                };
                const on = role === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setRole(item.id)}
                    style={[styles.roleTile, on && styles.roleTileOn]}
                  >
                    <View style={styles.roleTileTop}>
                      <MaterialIcon name={meta.icon} size={22} color={meta.color} />
                      <View style={[styles.radio, on && styles.radioOn]}>
                        {on ? (
                          <View style={styles.radioDot} />
                        ) : null}
                      </View>
                    </View>
                    <Text style={styles.roleTitle}>{item.label}</Text>
                    <Text style={styles.roleBody}>{item.description}</Text>
                  </Pressable>
                );
              })}
            </View>

            {REGISTER_ROLES.filter((r) => r.id === "work_seeker").map((item) => {
              const on = role === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setRole(item.id)}
                  style={[styles.roleWide, on && styles.roleTileOn]}
                >
                  <View style={styles.roleTileTop}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <MaterialIcon name="work_outline" size={22} color="#6D28D9" />
                      <Text style={styles.roleTitle}>{item.label}</Text>
                    </View>
                    <View style={[styles.radio, on && styles.radioOn]}>
                      {on ? <View style={styles.radioDot} /> : null}
                    </View>
                  </View>
                  <Text style={styles.roleBody}>{item.description}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Security */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="lock_reset" size={20} color={colors.text} />
                  <Text style={styles.sectionTitle}>Security Access</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Create a memorable 6-digit PIN or password
                </Text>
              </View>
              <MaterialIcon name="lock_reset" size={20} color={colors.text} />
            </View>

            <AuthField
              label="Create 6-Digit PIN / Password"
              leadingIcon="lock"
              placeholder="Minimum 6 characters"
              value={pin}
              onChangeText={setPin}
              secureTextEntry={!showPin}
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
              label="Confirm PIN / Password"
              leadingIcon="lock"
              placeholder="Repeat PIN / password"
              value={confirmPin}
              onChangeText={setConfirmPin}
              secureTextEntry={!showConfirm}
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
          </View>

          <AuthCheckbox
            checked={hasDisability}
            onToggle={() => setHasDisability((v) => !v)}
            title="I am a person living with a disability"
            body="Enables assistive pathways and accessible career guidance options."
          />

          <AuthCheckbox
            checked={agreed}
            onToggle={() => setAgreed((v) => !v)}
            title="DHET Privacy Policy & Service Level Agreement (POPIA Compliant)"
            body="I agree that anonymized career and aptitude data may be used by DHET to improve national career services."
          />

          <ImageBackground
            source={classroomImg}
            style={styles.banner}
            imageStyle={styles.bannerImg}
          >
            <View style={styles.bannerOverlay}>
              <MaterialIcon name="stars" size={28} color={colors.gold} />
              <Text style={styles.bannerText}>
                Personalized bursaries, artisan routes, and universities.
              </Text>
            </View>
          </ImageBackground>

          {message ? <Text style={styles.error}>{message}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, (!canSubmit || busy || isLoading) && styles.disabled]}
            disabled={!canSubmit || busy || isLoading}
            onPress={() => void onSubmit()}
          >
            {busy ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.primaryText}>
                  Create Account & Verify via Free SMS OTP
                </Text>
                <MaterialIcon name="arrow_forward" size={20} color={colors.onPrimary} />
              </>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace(href("/sign-in"))}>
            <Text style={styles.signInLink}>
              Already registered with Khetha?{" "}
              <Text style={styles.signInLinkBold}>Sign-In here</Text>
            </Text>
          </Pressable>

          <View style={styles.helpBox}>
            <View style={styles.helpIcon}>
              <MaterialIcon name="support_agent" size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpTitle}>Need help registering?</Text>
              <Text style={styles.helpBody}>
                Speak to a DHET Career Adviser toll-free at{" "}
                <Text
                  style={styles.inlineLink}
                  onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
                >
                  {HELPLINE.tollFreeDisplay}
                </Text>{" "}
                or SMS {HELPLINE.whatsappDisplay} for a free callback.
              </Text>
            </View>
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  locationText: { ...typography.caption, color: colors.textSecondary, flexShrink: 1 },
  sessionPill: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sessionText: { ...typography.caption, color: colors.textSecondary, fontWeight: "600" },
  intro: { gap: 6 },
  headline: { fontSize: 22, fontWeight: "700", lineHeight: 30, color: colors.text },
  subtitle: { ...typography.bodySm, color: colors.textSecondary },
  trustRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  trustChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trustText: { ...typography.caption, color: colors.success, fontWeight: "600" },
  progressTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: spacing.sm,
  },
  progressFill: { width: "25%", height: "100%", backgroundColor: colors.primary },
  progressLabel: { ...typography.caption, color: colors.textSecondary },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  sectionSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  fieldLabel: { ...typography.labelLg, color: colors.text },
  docRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  docChip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.canvas,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  docChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  docChipText: { ...typography.labelMd, color: colors.text },
  docChipTextOn: { color: colors.onPrimary },
  validRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: -8 },
  validText: { ...typography.caption, color: colors.success },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.labelLg, color: colors.text },
  chipTextOn: { color: colors.onPrimary },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  roleTile: {
    width: "48%",
    flexGrow: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    gap: 4,
  },
  roleWide: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.card,
    gap: 4,
  },
  roleTileOn: { borderColor: colors.primary },
  roleTileTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: colors.primary },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  roleTitle: { ...typography.labelLg, color: colors.text },
  roleBody: { ...typography.caption, color: colors.textSecondary },
  banner: {
    height: 128,
    borderRadius: radii.xl,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  bannerImg: { borderRadius: radii.xl },
  bannerOverlay: {
    backgroundColor: "rgba(15,23,42,0.55)",
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  bannerText: {
    ...typography.labelLg,
    color: colors.card,
    flex: 1,
    fontWeight: "700",
  },
  primaryBtn: {
    minHeight: 52,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.lg,
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary, textAlign: "center" },
  disabled: { opacity: 0.45 },
  error: { ...typography.bodySm, color: colors.error },
  signInLink: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: "center",
  },
  signInLinkBold: { color: colors.primary, fontWeight: "700" },
  helpBox: {
    backgroundColor: "#FFF8E7",
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF1C2",
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  inlineLink: { color: colors.primary, fontWeight: "700" },
});
