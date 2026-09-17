import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/Screen";
import { EntityCard } from "../../../components/EntityCard";
import { useAuth } from "../../../contexts/AuthContext";
import { colors, spacing, typography } from "../../../theme";

const TOOLS = [
  {
    href: "/questionnaires/subject-chooser",
    title: "Subject Choice",
    body: "Find which Grade 10–12 subjects keep your career doors open.",
    key: "subjectChooser" as const,
  },
  {
    href: "/questionnaires/career-choice",
    title: "Career Choice",
    body: "Discover occupations aligned with your interests and personality.",
    key: "careerChoice" as const,
  },
  {
    href: "/questionnaires/job-fit",
    title: "Job Fit",
    body: "Match working style and skills with TVET trades and workplace roles.",
    key: "jobFit" as const,
  },
];

export default function QuestionnairesHub() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <Screen>
      <Text style={styles.kicker}>Decisions</Text>
      <Text style={styles.title}>Guided career tools</Text>
      <Text style={styles.subtitle}>
        Three separate NCAP-style tools. Each saves its own results to your profile.
      </Text>

      {TOOLS.map((tool) => {
        const prior = profile?.questionnaireResults?.[tool.key];
        return (
          <EntityCard
            key={tool.href}
            title={tool.title}
            subtitle={tool.body}
            meta={
              prior?.matches?.length
                ? `${prior.matches.length} saved matches`
                : "Not completed yet"
            }
            onPress={() => router.push(tool.href as never)}
          />
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.labelMd,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
