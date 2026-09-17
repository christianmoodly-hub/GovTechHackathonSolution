import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ProgressBar } from "./ProgressBar";
import { OptionButton } from "./OptionButton";
import { Screen } from "./Screen";
import { PrimaryButton } from "./PrimaryButton";
import { useAuth } from "../contexts/AuthContext";
import { getOccupationSummaries, updateProfile } from "../services/ncapData";
import type {
  QuestionnaireId,
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../services/types";
import type { QuestionnaireDefinition } from "../questionnaires/domains";
import { matchOccupations, scoreAnswers } from "../questionnaires/scoring";
import { colors, radii, spacing, typography } from "../theme";
import { href } from "../utils/href";

type Props = {
  definition: QuestionnaireDefinition;
  resultKey: QuestionnaireId;
};

export function QuestionnaireScreen({ definition, resultKey }: Props) {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const existing = profile?.questionnaireResults?.[resultKey] as
    | QuestionnaireResult
    | undefined;

  const [phase, setPhase] = useState<"intro" | "questions">(
    existing?.matches?.length ? "intro" : "intro",
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {},
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing?.answers) {
      setAnswers(existing.answers);
    }
  }, [existing?.completedAt]);

  const question = definition.questions[step];
  const total = definition.questions.length;
  const selected = question ? answers[question.id] : undefined;

  const startFresh = () => {
    setAnswers({});
    setStep(0);
    setError(null);
    setPhase("questions");
  };

  const onSelect = (optionId: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const onNext = async () => {
    if (!question || !selected) return;

    if (step < total - 1) {
      setStep((value) => value + 1);
      return;
    }

    if (!user?.uid) {
      setError("You need to be signed in to save questionnaire results.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const domainScores = scoreAnswers(definition, {
        ...answers,
        [question.id]: selected,
      });
      const { summaries } = await getOccupationSummaries();
      const matches = matchOccupations(domainScores, summaries, 12);
      const nextResult: QuestionnaireResult = {
        questionnaireId: definition.id,
        completedAt: new Date().toISOString(),
        answers: { ...answers, [question.id]: selected },
        domainScores,
        matches,
      };

      const nextMap: QuestionnaireResultsMap = {
        ...(profile?.questionnaireResults ?? {}),
        [resultKey]: nextResult,
      };

      await updateProfile(user.uid, { questionnaireResults: nextMap });
      await refreshProfile();
      router.replace(href(`/questionnaires/results/${resultKey}`));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save questionnaire results.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.kicker}>Questionnaire</Text>
      <Text style={styles.title}>{definition.title}</Text>
      <Text style={styles.subtitle}>{definition.subtitle}</Text>

      {phase === "intro" ? (
        <View style={styles.card}>
          {existing?.matches?.length ? (
            <>
              <Text style={styles.cardTitle}>Previous results found</Text>
              <Text style={styles.cardBody}>
                You already completed this tool. View your matches or retake it.
              </Text>
              <PrimaryButton
                label="View past results"
                onPress={() => router.push(href(`/questionnaires/results/${resultKey}`))}
              />
              <PrimaryButton
                label="Retake questionnaire"
                variant="secondary"
                onPress={startFresh}
              />
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>{total} short questions</Text>
              <Text style={styles.cardBody}>
                Answer one at a time. Your results are saved to your profile and
                link into real NCAP occupations.
              </Text>
              <PrimaryButton label="Start" onPress={startFresh} />
            </>
          )}
        </View>
      ) : null}

      {phase === "questions" && question ? (
        <View style={styles.card}>
          <ProgressBar current={step + 1} total={total} />
          <Text style={styles.prompt}>{question.prompt}</Text>
          {question.helpText ? (
            <Text style={styles.help}>{question.helpText}</Text>
          ) : null}
          <View style={styles.options}>
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                selected={selected === option.id}
                onPress={() => onSelect(option.id)}
              />
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.row}>
            <PrimaryButton
              label="Back"
              variant="secondary"
              disabled={step === 0 || busy}
              onPress={() => setStep((value) => Math.max(0, value - 1))}
              style={styles.flex}
            />
            <Pressable
              style={[
                styles.primary,
                (!selected || busy) && styles.primaryDisabled,
                styles.flex,
              ]}
              disabled={!selected || busy}
              onPress={() => void onNext()}
            >
              {busy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.primaryText}>
                  {step === total - 1 ? "See results" : "Next"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: "flex-start", paddingVertical: spacing.xs },
  backText: { ...typography.labelLg, color: colors.primary },
  kicker: {
    ...typography.labelMd,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textMuted,
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
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardBody: { ...typography.bodySm, color: colors.textSecondary },
  prompt: { ...typography.headlineSm, color: colors.text, marginTop: spacing.xs },
  help: { ...typography.bodySm, color: colors.textMuted },
  options: { gap: spacing.md },
  row: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
  flex: { flex: 1 },
  primary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryDisabled: { opacity: 0.45 },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  error: { color: colors.error, ...typography.bodySm },
});
