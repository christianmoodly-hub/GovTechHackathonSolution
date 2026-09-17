import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "../services/ncapData";
import type { Demographics } from "../services/types";
import {
  DISABILITY_CATEGORIES,
  LANGUAGES,
  LEARNER_ROLES,
} from "../data/staticContent";
import { colors, radii, spacing, typography } from "../theme";
import { href } from "../utils/href";

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [language, setLanguage] = useState("en");
  const [role, setRole] = useState<string | null>(null);
  const [hasDisability, setHasDisability] = useState(false);
  const [disabilityCategories, setDisabilityCategories] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => Boolean(language && role), [language, role]);

  const toggleCategory = (id: string) => {
    setDisabilityCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const onSubmit = async () => {
    if (!user?.uid || !role) return;
    setBusy(true);
    setError(null);
    try {
      const demographics: Demographics = {
        preferredLanguage: language,
        role,
        hasDisability,
        disabilityCategories: hasDisability ? disabilityCategories : [],
        completedAt: new Date().toISOString(),
      };
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

  return (
    <Screen>
      <Text style={styles.brand}>NCAP · Khetha · DHET</Text>
      <Text style={styles.title}>Welcome to Khetha NCAP</Text>
      <Text style={styles.body}>
        Please complete below for statistics and tailored guidance.
      </Text>

      <Text style={styles.section}>Preferred language</Text>
      <View style={styles.chipRow}>
        {LANGUAGES.map((item) => {
          const selected = language === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setLanguage(item.id)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Who are you?</Text>
      <View style={styles.list}>
        {LEARNER_ROLES.map((item) => {
          const selected = role === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setRole(item.id)}
              style={[styles.roleCard, selected && styles.roleSelected]}
            >
              <Text style={styles.roleTitle}>{item.label}</Text>
              <Text style={styles.roleBody}>{item.description}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.section}>Disability status</Text>
      <View style={styles.chipRow}>
        <Pressable
          onPress={() => {
            setHasDisability(false);
            setDisabilityCategories([]);
          }}
          style={[styles.chip, !hasDisability && styles.chipSelected]}
        >
          <Text style={[styles.chipText, !hasDisability && styles.chipTextSelected]}>
            No
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setHasDisability(true)}
          style={[styles.chip, hasDisability && styles.chipSelected]}
        >
          <Text style={[styles.chipText, hasDisability && styles.chipTextSelected]}>
            Yes
          </Text>
        </Pressable>
      </View>

      {hasDisability ? (
        <View style={styles.chipRow}>
          {DISABILITY_CATEGORIES.map((item) => {
            const selected = disabilityCategories.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleCategory(item.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label="Start exploring"
        onPress={() => void onSubmit()}
        disabled={!canSubmit}
        busy={busy}
        variant="gold"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    ...typography.labelMd,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  section: { ...typography.headlineSm, color: colors.text, marginTop: spacing.sm },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { ...typography.labelLg, color: colors.text },
  chipTextSelected: { color: colors.onPrimary },
  list: { gap: spacing.sm },
  roleCard: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    padding: spacing.lg,
    backgroundColor: colors.card,
    gap: 4,
  },
  roleSelected: { borderColor: colors.primary },
  roleTitle: { ...typography.labelLg, color: colors.text },
  roleBody: { ...typography.bodySm, color: colors.textSecondary },
  error: { ...typography.bodySm, color: colors.error },
});
