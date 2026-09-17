import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, EmptyState } from "../../../../components/Screen";
import { MatchResultsList } from "../../../../components/MatchResultsList";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import { KhethaBrandBar } from "../../../../components/KhethaBrandBar";
import { useAuth } from "../../../../contexts/AuthContext";
import type { QuestionnaireId } from "../../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import { domainBadges } from "../../../../utils/occupationPresentation";

const TITLES: Record<QuestionnaireId, string> = {
  subjectChooser: "Subject Choice",
  careerChoice: "Career Choice",
  jobFit: "Job Fit",
};

export default function QuestionnaireResultsScreen() {
  const router = useRouter();
  const { questionnaireId } = useLocalSearchParams<{ questionnaireId: string }>();
  const { profile } = useAuth();

  const key = questionnaireId as QuestionnaireId;
  const result = profile?.questionnaireResults?.[key];
  const badges = domainBadges(result?.domainScores);

  const retakeHref =
    key === "subjectChooser"
      ? "/questionnaires/subject-chooser"
      : key === "careerChoice"
        ? "/questionnaires/career-choice"
        : "/questionnaires/job-fit";

  if (!result?.matches?.length) {
    return (
      <Screen>
        <EmptyState
          title="No results yet"
          body="Complete the questionnaire to see personalized occupation matches."
        />
        <PrimaryButton
          label="Start questionnaire"
          onPress={() => router.replace(href(retakeHref))}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <KhethaBrandBar />
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <MaterialIcon name="verified" size={16} color={colors.success} />
          <Text style={styles.statusText}>Verified Assessment · SAQA / DHET Aligned</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroKicker}>{TITLES[key] ?? "Questionnaire"}</Text>
        <Text style={styles.heroTitle}>Your Personalized Career Blueprint</Text>
        <Text style={styles.heroSub}>Isiqondiso Semisebenzi Yakho</Text>
        <Text style={styles.heroBody}>
          Synthesized from your interest inventory combined with work preferences
          and national labour market demand data.
        </Text>

        {badges.length ? (
          <View style={styles.badgeRow}>
            {badges.map((badge) => (
              <View key={`${badge.label}-${badge.pct}`} style={styles.badge}>
                <MaterialIcon name={badge.icon} size={14} color={colors.onPrimary} />
                <Text style={styles.badgeText}>
                  {badge.label} {badge.pct}%
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.downloadRow}>
          <MaterialIcon name="download" size={18} color={colors.primaryDark} />
          <Text style={styles.downloadText}>
            Offline blueprint saved to your Khetha profile
          </Text>
          <View style={styles.freePill}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        </View>
      </View>

      <MatchResultsList
        matches={result.matches}
        completedAt={result.completedAt}
      />

      <PrimaryButton
        label="Browse all careers"
        variant="secondary"
        onPress={() => router.push(href("/directory"))}
      />
      <PrimaryButton
        label="Retake questionnaire"
        onPress={() => router.push(href(retakeHref))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusText: { ...typography.caption, color: colors.success, fontWeight: "700" },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadows.card,
  },
  heroKicker: {
    ...typography.labelMd,
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: { ...typography.headlineLg, color: colors.onPrimary },
  heroSub: {
    ...typography.bodyMd,
    color: "rgba(255,255,255,0.85)",
    fontStyle: "italic",
  },
  heroBody: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing.xs,
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: { ...typography.labelMd, color: colors.onPrimary },
  downloadRow: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  downloadText: { ...typography.bodySm, color: colors.text, flex: 1 },
  freePill: {
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  freeText: { ...typography.caption, color: colors.text, fontWeight: "800" },
});
