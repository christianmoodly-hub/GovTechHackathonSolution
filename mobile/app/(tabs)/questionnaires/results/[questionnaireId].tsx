import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, EmptyState } from "../../../../components/Screen";
import { MatchResultsList } from "../../../../components/MatchResultsList";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { useAuth } from "../../../../contexts/AuthContext";
import type { QuestionnaireId } from "../../../../services/types";
import { colors, radii, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";

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

  const topDomains = useMemo(() => {
    if (!result?.domainScores) return [];
    return Object.entries(result.domainScores)
      .filter(([, score]) => (score as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([domain, score]) => `${domain.replace("_", " ")} (${score})`);
  }, [result]);

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
        <PrimaryButton label="Start questionnaire" onPress={() => router.replace(href(retakeHref))} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.kicker}>Personalized results</Text>
      <Text style={styles.title}>Your career blueprint</Text>
      <Text style={styles.subtitle}>
        {TITLES[key] ?? "Questionnaire"} recommendations based on your answers.
      </Text>

      <View style={styles.card}>
        {topDomains.length ? (
          <Text style={styles.domains}>
            Strongest signals: {topDomains.join(", ")}
          </Text>
        ) : null}
        <MatchResultsList
          matches={result.matches}
          completedAt={result.completedAt}
        />
      </View>

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
  kicker: {
    ...typography.labelMd,
    color: colors.goldHover,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  domains: { ...typography.bodySm, color: colors.textSecondary },
});
