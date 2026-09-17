import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { EntityCard } from "../../components/EntityCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../contexts/AuthContext";
import { LANGUAGES, LEARNER_ROLES } from "../../data/staticContent";
import { stableUrlId } from "../../services/ids";
import { colors, radii, spacing, typography } from "../../theme";
import type { FavouriteType, QuestionnaireId } from "../../services/types";
import { href } from "../../utils/href";

const FILTERS: Array<"all" | FavouriteType> = [
  "all",
  "occupation",
  "qualification",
  "provider",
];

export default function SavedScreen() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const roleLabel =
    LEARNER_ROLES.find((item) => item.id === profile?.demographics?.role)?.label ??
    "Learner";
  const languageLabel =
    LANGUAGES.find((item) => item.id === profile?.demographics?.preferredLanguage)
      ?.label ?? "English";

  const favourites = useMemo(() => {
    const items = profile?.favourites ?? [];
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }, [profile?.favourites, filter]);

  const results = (
    Object.entries(profile?.questionnaireResults ?? {}) as Array<
      [QuestionnaireId, { matches?: unknown[]; completedAt?: string } | undefined]
    >
  ).filter((entry): entry is [QuestionnaireId, { matches: unknown[]; completedAt?: string }] =>
    Boolean(entry[1]?.matches?.length),
  );

  const openFavourite = async (
    type: FavouriteType,
    url: string,
    entityId?: string,
  ) => {
    if (type === "occupation") {
      if (entityId) {
        router.push(href(`/directory/occupations/${entityId}`));
        return;
      }
      // Legacy favourites without entityId cannot resolve OFO code from URL alone.
      return;
    }
    const id = entityId ?? (await stableUrlId(url));
    if (type === "qualification") {
      router.push(href(`/directory/qualifications/${id}`));
      return;
    }
    router.push(href(`/directory/providers/${id}`));
  };

  return (
    <Screen>
      <Text style={styles.kicker}>My profile & vault</Text>
      <Text style={styles.title}>{user?.email}</Text>
      <Text style={styles.body}>
        {roleLabel} · Preferred language: {languageLabel} (switcher coming later)
      </Text>

      <Text style={styles.section}>Completed diagnostic tools</Text>
      {results.length ? (
        results.map(([id, result]) => (
          <EntityCard
            key={id}
            title={titleForQuestionnaire(id)}
            subtitle={`${result.matches.length} matches`}
            meta={
              result.completedAt
                ? `Saved ${new Date(result.completedAt).toLocaleDateString()}`
                : undefined
            }
            onPress={() => router.push(href(`/questionnaires/results/${id}`))}
          />
        ))
      ) : (
        <Text style={styles.body}>No questionnaires completed yet.</Text>
      )}

      <Text style={styles.section}>Bookmarked vault items</Text>
      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.chip, filter === item && styles.chipSelected]}
          >
            <Text
              style={[styles.chipText, filter === item && styles.chipTextSelected]}
            >
              {item === "all" ? "All" : item}
            </Text>
          </Pressable>
        ))}
      </View>

      {favourites.length ? (
        favourites.map((item) => (
          <EntityCard
            key={`${item.type}-${item.url}`}
            title={item.title}
            subtitle={item.type}
            meta={
              item.type === "occupation" && !item.entityId
                ? "Re-favourite from career detail to open"
                : undefined
            }
            onPress={
              item.type === "occupation" && !item.entityId
                ? undefined
                : () => void openFavourite(item.type, item.url, item.entityId)
            }
          />
        ))
      ) : (
        <Text style={styles.body}>No saved items yet. Favourite careers, quals, or campuses from detail screens.</Text>
      )}

      <PrimaryButton
        label="Sign out"
        variant="secondary"
        onPress={() => void signOut()}
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}

function titleForQuestionnaire(id: QuestionnaireId) {
  if (id === "subjectChooser") return "Subject Choice";
  if (id === "careerChoice") return "Career Choice";
  return "Job Fit";
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  section: { ...typography.headlineSm, color: colors.text, marginTop: spacing.sm },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.labelLg, color: colors.text, textTransform: "capitalize" },
  chipTextSelected: { color: colors.onPrimary },
});
