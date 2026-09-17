import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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
import { PROVINCES, REGISTER_ROLES } from "../data/staticContent";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

type DocType = "rsa_id" | "passport" | "asylum";

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
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const message = localError || error;

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
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.replace(href("/sign-in"))}>
            <Text style={styles.back}>← Back to sign in</Text>
          </Pressable>

          <Text style={styles.brand}>Khetha NCAP · Register citizen</Text>
          <Text style={styles.title}>Create your free Khetha profile</Text>
          <Text style={styles.subtitle}>
            Synchronize subject choice scores, RIASEC profile, and bursary eligibility across devices.
          </Text>

          <Text style={styles.section}>1. Personal information</Text>
          <Text style={styles.label}>Full legal name & surname</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="As on birth certificate / ID"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Citizen document type</Text>
          <View style={styles.chipRow}>
            {(
              [
                ["rsa_id", "RSA ID"],
                ["passport", "Passport"],
                ["asylum", "Asylum"],
              ] as const
            ).map(([id, label]) => (
              <Pressable
                key={id}
                onPress={() => setDocType(id)}
                style={[styles.chip, docType === id && styles.chipOn]}
              >
                <Text style={[styles.chipText, docType === id && styles.chipTextOn]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>
            {docType === "rsa_id" ? "South African 13-digit ID" : "Passport / asylum number"}
          </Text>
          <TextInput
            style={styles.input}
            value={saIdOrPassport}
            onChangeText={setSaIdOrPassport}
            placeholder={docType === "rsa_id" ? "0000000000000" : "Document number"}
            placeholderTextColor={colors.textMuted}
            keyboardType={docType === "rsa_id" ? "number-pad" : "default"}
            maxLength={docType === "rsa_id" ? 13 : 40}
          />

          <Text style={styles.label}>Date of birth (optional)</Text>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.label}>Gender (optional)</Text>
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

          <Text style={styles.section}>2. Contact & province</Text>
          <Text style={styles.label}>South African mobile number</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="+27 …"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Email address *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Required for account security"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.hint}>
            Email is used for Firebase sign-in and password recovery (live).
          </Text>

          <Text style={styles.label}>Province of residence</Text>
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

          <Text style={styles.section}>3. Your current situation</Text>
          {REGISTER_ROLES.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setRole(item.id)}
              style={[styles.roleCard, role === item.id && styles.roleOn]}
            >
              <Text style={styles.roleTitle}>{item.label}</Text>
              <Text style={styles.roleBody}>{item.description}</Text>
            </Pressable>
          ))}

          <Text style={styles.section}>4. Security access</Text>
          <Text style={styles.label}>Create 6-digit PIN or password *</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            secureTextEntry={!showPin}
            placeholder="Min 6 characters"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={styles.label}>Confirm PIN / password *</Text>
          <TextInput
            style={styles.input}
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry={!showPin}
            placeholder="Repeat PIN / password"
            placeholderTextColor={colors.textMuted}
          />
          <Pressable onPress={() => setShowPin((v) => !v)}>
            <Text style={styles.link}>{showPin ? "Hide PIN" : "Show PIN"}</Text>
          </Pressable>

          <Pressable style={styles.checkRow} onPress={() => setHasDisability((v) => !v)}>
            <View style={[styles.checkbox, hasDisability && styles.checkboxOn]}>
              {hasDisability ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={styles.checkLabel}>
              I am a person living with a disability (enables assistive pathways)
            </Text>
          </Pressable>

          <Pressable style={styles.checkRow} onPress={() => setAgreed((v) => !v)}>
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={styles.checkLabel}>
              I agree that anonymized career and aptitude data may be used by DHET
              (POPIA compliant) *
            </Text>
          </Pressable>

          {message ? <Text style={styles.error}>{message}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, (!canSubmit || busy || isLoading) && styles.disabled]}
            disabled={!canSubmit || busy || isLoading}
            onPress={() => void onSubmit()}
          >
            {busy ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryText}>Create free account</Text>
            )}
          </Pressable>
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
    gap: spacing.md,
  },
  back: { ...typography.labelLg, color: colors.primary },
  brand: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary, marginBottom: spacing.sm },
  section: { ...typography.headlineSm, color: colors.text, marginTop: spacing.md },
  label: { ...typography.labelLg, color: colors.text },
  hint: { ...typography.caption, color: colors.textMuted },
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
  roleCard: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    gap: 4,
    ...shadows.card,
  },
  roleOn: { borderColor: colors.primary },
  roleTitle: { ...typography.labelLg, color: colors.text },
  roleBody: { ...typography.bodySm, color: colors.textSecondary },
  checkRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { color: colors.onPrimary, fontWeight: "700", fontSize: 12 },
  checkLabel: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  primaryBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    minHeight: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  primaryText: { ...typography.labelLg, color: colors.text },
  disabled: { opacity: 0.45 },
  error: { ...typography.bodySm, color: colors.error },
  link: { ...typography.labelLg, color: colors.primary },
});
