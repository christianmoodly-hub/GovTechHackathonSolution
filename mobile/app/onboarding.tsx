import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../components/Screen";
import { MaterialIcon } from "../components/MaterialIcon";
import { LanguagePicker } from "../components/LanguagePicker";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { updateProfile } from "../services/ncapData";
import type { Demographics } from "../services/types";
import {
  DISABILITY_CATEGORIES,
  LEARNER_ROLES,
} from "../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";

const ROLE_ICONS: Record<string, string> = {
  grade10: "auto_stories",
  grade11: "menu_book",
  grade12: "school",
  below_grade10: "explore",
  tertiary: "account_balance",
  work_seeker: "work_outline",
  parent: "groups",
  teacher: "history_edu",
  practitioner: "engineering",
};

/** Map register form role ids onto onboarding role cards. */
function mapRegisterRoleToOnboarding(role?: string | null): string | null {
  if (!role) return "grade10";
  if (LEARNER_ROLES.some((item) => item.id === role)) return role;
  if (role === "grade9_10") return "grade10";
  if (role === "grade11_12") return "grade11";
  if (role === "tvet" || role === "university") return "tertiary";
  if (role === "work_seeker") return "work_seeker";
  if (role === "guest") return "work_seeker";
  return "grade10";
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile, continueAsGuest, clearError } = useAuth();
  const { locale, common } = useLocale();

  const existing = profile?.demographics;
  const mappedRole = mapRegisterRoleToOnboarding(existing?.role);

  const [role, setRole] = useState<string | null>(mappedRole);
  const [hasDisability, setHasDisability] = useState(
    Boolean(existing?.hasDisability),
  );
  const [disabilityCategories, setDisabilityCategories] = useState<string[]>(
    existing?.disabilityCategories ?? [],
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => Boolean(locale && role), [locale, role]);

  const toggleCategory = (id: string) => {
    setDisabilityCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const onSubmit = async () => {
    if (!user?.uid || !role) return;
    setBusy(true);
    setError(null);
    clearError();
    try {
      const demographics: Demographics = {
        preferredLanguage: locale,
        role,
        hasDisability,
        disabilityCategories: hasDisability ? disabilityCategories : [],
        completedAt: new Date().toISOString(),
      };
      // Keep registration fields collected earlier.
      if (existing?.fullName) demographics.fullName = existing.fullName;
      if (existing?.email) demographics.email = existing.email;
      if (existing?.documentType) demographics.documentType = existing.documentType;
      if (existing?.saIdOrPassport) {
        demographics.saIdOrPassport = existing.saIdOrPassport;
      }
      if (existing?.mobile) demographics.mobile = existing.mobile;
      if (existing?.province) demographics.province = existing.province;
      if (existing?.dateOfBirth) demographics.dateOfBirth = existing.dateOfBirth;
      if (existing?.gender) demographics.gender = existing.gender;

      await updateProfile(user.uid, { demographics });
      await refreshProfile();
      router.replace(href("/"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save your profile details.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onGuest = async () => {
    setBusy(true);
    setError(null);
    clearError();
    try {
      if (user?.uid && !user.isAnonymous) {
        const demographics: Demographics = {
          preferredLanguage: locale || "en",
          role: "guest",
          hasDisability: false,
          disabilityCategories: [],
          completedAt: new Date().toISOString(),
          fullName: existing?.fullName,
          email: existing?.email,
        };
        await updateProfile(user.uid, { demographics });
        await refreshProfile();
      } else {
        await continueAsGuest();
      }
      router.replace(href("/"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest mode unavailable.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.topRow}>
        <View style={styles.govRow}>
          <MaterialIcon name="account_balance" size={18} color={colors.primary} />
          <View>
            <Text style={styles.govLabel}>REPUBLIC OF SOUTH AFRICA</Text>
            <Text style={styles.govSub}>DHET · Khetha NCAP</Text>
          </View>
        </View>
        <View style={styles.zeroPill}>
          <View style={styles.zeroDot} />
          <Text style={styles.zeroText}>Zero-Rated Portal</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialIcon name="school" size={28} color={colors.gold} />
        </View>
        <Text style={styles.heroKicker}>NATIONAL CAREER ADVICE PORTAL</Text>
        <Text style={styles.heroTitle}>Welcome to Khetha NCAP</Text>
        <Text style={styles.heroBody}>
          Please complete below for statistics & tailored guidance.
        </Text>
      </View>

      <View style={styles.sectionHead}>
        <MaterialIcon name="translate" size={18} color={colors.secondary} />
        <Text style={styles.section}>{common.preferredLanguage}</Text>
      </View>
      <LanguagePicker showLabel={false} />

      <View style={styles.sectionHead}>
        <Text style={styles.section}>Who are you? (Select your current role)</Text>
        <View style={styles.requiredPill}>
          <Text style={styles.requiredText}>Required</Text>
        </View>
      </View>
      <View style={styles.list}>
        {LEARNER_ROLES.map((item) => {
          const selected = role === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setRole(item.id)}
              style={[styles.roleCard, selected && styles.roleSelected]}
            >
              <View
                style={[styles.radio, selected && styles.radioSelected]}
              >
                {selected ? (
                  <MaterialIcon name="check" size={14} color={colors.onPrimary} />
                ) : null}
              </View>
              <View style={styles.roleCopy}>
                <Text style={styles.roleTitle}>{item.label}</Text>
                <Text style={styles.roleBody}>{item.description}</Text>
              </View>
              <MaterialIcon
                name={ROLE_ICONS[item.id] ?? "person"}
                size={22}
                color={selected ? colors.primary : colors.textMuted}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.disabilityBlock}>
        <View style={styles.disabilityIcon}>
          <MaterialIcon
            name="accessible_forward"
            size={22}
            color={colors.secondary}
          />
        </View>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Text style={styles.section}>Disability Status</Text>
          <Text style={styles.roleBody}>
            Are you a person living with a disability?
          </Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => {
                setHasDisability(false);
                setDisabilityCategories([]);
              }}
              style={[styles.yesNo, !hasDisability && styles.yesNoSelected]}
            >
              {!hasDisability ? (
                <MaterialIcon name="check" size={16} color={colors.onPrimary} />
              ) : null}
              <Text
                style={[
                  styles.yesNoText,
                  !hasDisability && styles.yesNoTextSelected,
                ]}
              >
                No
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setHasDisability(true)}
              style={[styles.yesNo, hasDisability && styles.yesNoSelected]}
            >
              <MaterialIcon
                name="accessible_forward"
                size={16}
                color={hasDisability ? colors.onPrimary : colors.text}
              />
              <Text
                style={[
                  styles.yesNoText,
                  hasDisability && styles.yesNoTextSelected,
                ]}
              >
                Yes
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {hasDisability ? (
        <View style={styles.chipRow}>
          {DISABILITY_CATEGORIES.map((item) => {
            const selected = disabilityCategories.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleCategory(item.id)}
                style={[styles.langChip, selected && styles.langChipSelected]}
              >
                <Text
                  style={[styles.langText, selected && styles.langTextSelected]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <View style={styles.infoBanner}>
        <MaterialIcon name="check_circle" size={20} color={colors.secondary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Offline Ready · Zero Data Charges</Text>
          <Text style={styles.infoBody}>
            All questionnaires and guides run completely offline once loaded.
            Zero data charges on supported networks.
          </Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.cta, (!canSubmit || busy) && styles.ctaDisabled]}
        disabled={!canSubmit || busy}
        onPress={() => void onSubmit()}
      >
        <View style={styles.ctaIcon}>
          <MaterialIcon name="explore" size={20} color={colors.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>Start Exploring / Qala</Text>
          <Text style={styles.ctaSub}>Unlock personalized study pathways</Text>
        </View>
        <MaterialIcon name="arrow_forward" size={22} color={colors.gold} />
      </Pressable>

      <Pressable style={styles.guest} onPress={() => void onGuest()} disabled={busy}>
        <Text style={styles.guestText}>Continue as Guest</Text>
        <MaterialIcon name="chevron_right" size={18} color={colors.primary} />
      </Pressable>

      <View style={styles.quoteBox}>
        <Text style={styles.quoteMark}>“</Text>
        <Text style={styles.quote}>
          Education is the most powerful weapon which you can use to change the
          world.
        </Text>
        <Text style={styles.quoteAttr}>— Nelson Rolihlahla Mandela —</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  govRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  govLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  govSub: { ...typography.caption, color: colors.textMuted },
  zeroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  zeroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  zeroText: { ...typography.caption, color: colors.success, fontWeight: "700" },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadows.card,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(242,169,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  heroKicker: {
    ...typography.caption,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    fontWeight: "700",
  },
  heroTitle: { ...typography.headlineLg, color: colors.onPrimary },
  heroBody: { ...typography.bodySm, color: "rgba(255,255,255,0.85)" },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  section: { ...typography.headlineSm, color: colors.text, flexShrink: 1 },
  requiredPill: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  requiredText: { ...typography.caption, color: colors.secondary, fontWeight: "700" },
  langGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  langChip: {
    width: "48%",
    flexGrow: 1,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.secondarySubtle,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  langChipSelected: { backgroundColor: colors.primaryDark },
  langText: { ...typography.labelLg, color: colors.text },
  langTextSelected: { color: colors.onPrimary },
  list: { gap: spacing.sm },
  roleCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.card,
  },
  roleSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark,
  },
  roleCopy: { flex: 1, gap: 2 },
  roleTitle: { ...typography.labelLg, color: colors.text },
  roleBody: { ...typography.bodySm, color: colors.textSecondary },
  disabilityBlock: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  disabilityIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.secondarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  yesNo: {
    minHeight: 44,
    minWidth: 88,
    borderRadius: radii.md,
    backgroundColor: colors.secondarySubtle,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  yesNoSelected: { backgroundColor: colors.primaryDark },
  yesNoText: { ...typography.labelLg, color: colors.text },
  yesNoTextSelected: { color: colors.onPrimary },
  infoBanner: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  infoTitle: { ...typography.labelLg, color: colors.secondary },
  infoBody: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  cta: {
    minHeight: 64,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaTitle: { ...typography.labelLg, color: colors.onPrimary },
  ctaSub: { ...typography.caption, color: "rgba(255,255,255,0.8)" },
  guest: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: spacing.sm,
  },
  guestText: { ...typography.labelLg, color: colors.primary },
  quoteBox: {
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.sm,
    overflow: "hidden",
  },
  quoteMark: {
    position: "absolute",
    right: 12,
    top: -8,
    fontSize: 72,
    color: "rgba(15,23,42,0.08)",
    fontWeight: "700",
  },
  quote: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  quoteAttr: {
    ...typography.labelMd,
    color: colors.ochre,
    textAlign: "center",
  },
  error: { ...typography.bodySm, color: colors.error },
});
