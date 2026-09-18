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
import { useLocale } from "../contexts/LocaleContext";
import { HELPLINE, PROVINCES } from "../data/staticContent";
import type { Demographics } from "../services/types";
import { colors, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";
import { deriveFromSaId } from "../utils/saId";

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
  const { strings } = useLocale();
  const t = strings.auth;
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

  const registerRoles = useMemo(
    () => [
      {
        id: "grade9_10",
        label: t.regRoleGrade910Label,
        description: t.regRoleGrade910Desc,
      },
      {
        id: "grade11_12",
        label: t.regRoleGrade1112Label,
        description: t.regRoleGrade1112Desc,
      },
      {
        id: "tvet",
        label: t.regRoleTvetLabel,
        description: t.regRoleTvetDesc,
      },
      {
        id: "university",
        label: t.regRoleUniversityLabel,
        description: t.regRoleUniversityDesc,
      },
      {
        id: "work_seeker",
        label: t.regRoleWorkSeekerLabel,
        description: t.regRoleWorkSeekerDesc,
      },
    ],
    [t],
  );

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

  const onSaIdChange = (value: string) => {
    const cleaned =
      docType === "rsa_id" ? value.replace(/\D/g, "").slice(0, 13) : value;
    setSaIdOrPassport(cleaned);

    if (docType !== "rsa_id") return;

    const derived = deriveFromSaId(cleaned);
    if (!derived) return;

    // Autofill as soon as YYMMDD is valid (6+ digits); refresh gender at 10+.
    setDateOfBirth(derived.dateOfBirth);
    if (cleaned.length >= 10) {
      setGender(derived.gender);
    }
  };

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

  const buildDemographics = (): Omit<Demographics, "completedAt"> => {
    const base: Omit<Demographics, "completedAt"> = {
      preferredLanguage: "en",
      role,
      hasDisability,
      disabilityCategories: [],
      fullName: fullName.trim(),
      documentType: docType,
      email: email.trim().toLowerCase(),
    };
    const saId = saIdOrPassport.trim();
    const mobileTrim = mobile.trim();
    const dob = dateOfBirth.trim();
    if (saId) base.saIdOrPassport = saId;
    if (mobileTrim) base.mobile = mobileTrim;
    if (province) base.province = province;
    if (dob) base.dateOfBirth = dob;
    if (gender) base.gender = gender;
    return base;
  };

  const onSubmit = async () => {
    setLocalError(null);
    clearError();
    if (pin !== confirmPin) {
      setLocalError(t.errPinMismatch);
      return;
    }
    if (!agreed) {
      setLocalError(t.errAcceptAgreement);
      return;
    }

    setBusy(true);
    try {
      await registerWithPassword({
        email,
        password: pin,
        fullName,
        demographics: buildDemographics(),
      });
      // AuthGate routes to /verify-email until Firebase emailVerified is true.
    } catch (err) {
      console.error("[register] create failed", err);
      setLocalError(err instanceof Error ? err.message : t.errRegistrationFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <AuthHeader title={t.createProfileTitle} />
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
              <Text style={styles.sessionText}>{t.sessionLabel}</Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.headline}>{t.registerHeadline}</Text>
            <Text style={styles.subtitle}>
              {t.registerSubtitle}
            </Text>
            <View style={styles.trustRow}>
              <View style={styles.trustChip}>
                <MaterialIcon name="wifi_tethering" size={16} color={colors.success} />
                <Text style={styles.trustText}>{t.trustFree}</Text>
              </View>
              <View style={styles.trustChip}>
                <MaterialIcon name="bolt" size={14} color={colors.success} />
                <Text style={styles.trustText}>{t.trustFirebase}</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressLabel}>{t.stepOf4}</Text>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="badge" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>{t.personalInfo}</Text>
                </View>
                <Text style={styles.sectionSub}>
                  {t.personalInfoSub}
                </Text>
              </View>
              <MaterialIcon name="badge" size={20} color={colors.primary} />
            </View>

            <AuthField
              label={t.fullNameLabel}
              leadingIcon="person"
              placeholder={t.fullNamePlaceholder}
              hint={t.fullNameHint}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.fieldLabel}>{t.docTypeLabel}</Text>
            <View style={styles.docRow}>
              {(
                [
                  ["asylum", t.docAsylum],
                  ["rsa_id", t.docRsaId],
                  ["passport", t.docPassport],
                ] as const
              ).map(([id, label]) => {
                const on = docType === id;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setDocType(id)}
                    style={[styles.docChip, on && styles.docChipOn]}
                  >
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
                  ? t.rsaIdLabel
                  : t.passportAsylumLabel
              }
              leadingIcon="fingerprint"
              placeholder={
                docType === "rsa_id" ? t.rsaIdPlaceholder : t.docNumberPlaceholder
              }
              value={saIdOrPassport}
              onChangeText={onSaIdChange}
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
                <Text style={styles.validText}>{t.idVerified}</Text>
              </View>
            ) : null}

            <AuthField
              label={t.dobLabel}
              leadingIcon="history_edu"
              placeholder={t.dobPlaceholder}
              hint={
                docType === "rsa_id"
                  ? t.dobHintFromId
                  : undefined
              }
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />

            <Text style={styles.fieldLabel}>{t.genderLabel}</Text>
            <View style={styles.chipRow}>
              {(
                [
                  ["Female", t.genderFemale],
                  ["Male", t.genderMale],
                  ["Prefer not to say", t.genderPreferNot],
                ] as const
              ).map(([value, label]) => (
                <Pressable
                  key={value}
                  onPress={() => setGender(value)}
                  style={[styles.chip, gender === value && styles.chipOn]}
                >
                  <Text
                    style={[styles.chipText, gender === value && styles.chipTextOn]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="mark_chat_read" size={20} color="#1D4ED8" />
                  <Text style={styles.sectionTitle}>{t.contactProvince}</Text>
                </View>
                <Text style={styles.sectionSub}>
                  {t.contactProvinceSub}
                </Text>
              </View>
              <MaterialIcon name="mark_chat_read" size={20} color="#1D4ED8" />
            </View>

            <AuthField
              label={t.mobileLabel}
              leadingIcon="sms"
              placeholder={t.mobilePlaceholder}
              hint={t.mobileHint}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <AuthField
              label={t.emailLabel}
              trailingLabel={t.emailRequired}
              leadingIcon="mail"
              placeholder={t.emailPlaceholder}
              hint={t.emailHint}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.fieldLabel}>{t.provinceLabel}</Text>
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

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="school" size={20} color={colors.ochre} />
                  <Text style={styles.sectionTitle}>{t.situationTitle}</Text>
                </View>
                <Text style={styles.sectionSub}>
                  {t.situationSub}
                </Text>
              </View>
              <MaterialIcon name="school" size={20} color={colors.ochre} />
            </View>

            <View style={styles.roleGrid}>
              {registerRoles.filter((r) => r.id !== "work_seeker").map((item) => {
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
                        {on ? <View style={styles.radioDot} /> : null}
                      </View>
                    </View>
                    <Text style={styles.roleTitle}>{item.label}</Text>
                    <Text style={styles.roleBody}>{item.description}</Text>
                  </Pressable>
                );
              })}
            </View>

            {registerRoles.filter((r) => r.id === "work_seeker").map((item) => {
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

          <View style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={{ flex: 1 }}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon name="lock_reset" size={20} color={colors.text} />
                  <Text style={styles.sectionTitle}>{t.securityTitle}</Text>
                </View>
                <Text style={styles.sectionSub}>
                  {t.securitySub}
                </Text>
              </View>
              <MaterialIcon name="lock_reset" size={20} color={colors.text} />
            </View>

            <AuthField
              label={t.createPinLabel}
              leadingIcon="lock"
              placeholder={t.createPinPlaceholder}
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
              label={t.confirmPinLabel}
              leadingIcon="lock"
              placeholder={t.confirmPinPlaceholder}
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
            title={t.disabilityCheckTitle}
            body={t.disabilityCheckBody}
          />

          <AuthCheckbox
            checked={agreed}
            onToggle={() => setAgreed((v) => !v)}
            title={t.privacyCheckTitle}
            body={t.privacyCheckBody}
          />

          <ImageBackground
            source={classroomImg}
            style={styles.banner}
            imageStyle={styles.bannerImg}
          >
            <View style={styles.bannerOverlay}>
              <MaterialIcon name="stars" size={28} color={colors.gold} />
              <Text style={styles.bannerText}>
                {t.bannerText}
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
                  {t.createAccountCta}
                </Text>
                <MaterialIcon name="arrow_forward" size={20} color={colors.onPrimary} />
              </>
            )}
          </Pressable>

          <Pressable onPress={() => router.replace(href("/sign-in"))}>
            <Text style={styles.signInLink}>
              {t.alreadyRegistered}{" "}
              <Text style={styles.signInLinkBold}>{t.signInHere}</Text>
            </Text>
          </Pressable>

          <View style={styles.helpBox}>
            <View style={styles.helpIcon}>
              <MaterialIcon name="support_agent" size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.helpTitle}>{t.needHelpRegister}</Text>
              <Text style={styles.helpBody}>
                {t.needHelpRegisterBodyPrefix}{" "}
                <Text
                  style={styles.inlineLink}
                  onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
                >
                  {HELPLINE.tollFreeDisplay}
                </Text>{" "}
                {t.needHelpRegisterBodyMid} {HELPLINE.whatsappDisplay}{" "}
                {t.needHelpRegisterBodySuffix}
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
