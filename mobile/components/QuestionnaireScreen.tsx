import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProgressBar } from "./ProgressBar";
import { OptionButton } from "./OptionButton";
import { MatchResultsList } from "./MatchResultsList";
import { useAuth } from "../contexts/AuthContext";
import { getOccupationSummaries, updateProfile } from "../services/ncapData";
import type {
  QuestionnaireId,
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../services/types";
import type { QuestionnaireDefinition } from "../questionnaires/domains";
import { matchOccupations, scoreAnswers } from "../questionnaires/scoring";

type Props = {
  definition: QuestionnaireDefinition;
  resultKey: QuestionnaireId;
};

/**
 * Screen-local flow shell used by each questionnaire route.
 * Definitions / copy / question order stay ownership of each tool file —
 * this only handles progress UI, persistence, and matching.
 */
export function QuestionnaireScreen({ definition, resultKey }: Props) {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const existing = profile?.questionnaireResults?.[resultKey] as
    | QuestionnaireResult
    | undefined;

  const [phase, setPhase] = useState<"intro" | "questions" | "results">(
    existing?.matches?.length ? "results" : "intro",
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {},
  );
  const [result, setResult] = useState<QuestionnaireResult | null>(
    existing ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing?.matches?.length) {
      setResult(existing);
      setAnswers(existing.answers ?? {});
      setPhase("results");
    }
  }, [existing?.completedAt]);

  const question = definition.questions[step];
  const total = definition.questions.length;
  const selected = question ? answers[question.id] : undefined;

  const topDomains = useMemo(() => {
    if (!result?.domainScores) return [];
    return Object.entries(result.domainScores)
      .filter(([, score]) => (score as number) > 0)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([domain, score]) => `${domain.replace("_", " ")} (${score})`);
  }, [result]);

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
      setResult(nextResult);
      setPhase("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save questionnaire results.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
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
                <Pressable
                  style={styles.primary}
                  onPress={() => setPhase("results")}
                >
                  <Text style={styles.primaryText}>View past results</Text>
                </Pressable>
                <Pressable style={styles.secondary} onPress={startFresh}>
                  <Text style={styles.secondaryText}>Retake questionnaire</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>
                  {total} short questions
                </Text>
                <Text style={styles.cardBody}>
                  Answer one at a time. Your results are saved to your profile and
                  link into real NCAP occupations.
                </Text>
                <Pressable style={styles.primary} onPress={startFresh}>
                  <Text style={styles.primaryText}>Start</Text>
                </Pressable>
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
              <Pressable
                style={styles.secondary}
                disabled={step === 0 || busy}
                onPress={() => setStep((value) => Math.max(0, value - 1))}
              >
                <Text style={styles.secondaryText}>Back</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.primary,
                  (!selected || busy) && styles.primaryDisabled,
                ]}
                disabled={!selected || busy}
                onPress={() => void onNext()}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryText}>
                    {step === total - 1 ? "See results" : "Next"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : null}

        {phase === "results" && result ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your matches</Text>
            {topDomains.length ? (
              <Text style={styles.cardBody}>
                Strongest signals: {topDomains.join(", ")}
              </Text>
            ) : null}
            <MatchResultsList
              matches={result.matches}
              completedAt={result.completedAt}
            />
            <Pressable style={styles.secondary} onPress={startFresh}>
              <Text style={styles.secondaryText}>Retake</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  content: { padding: 24, gap: 16, paddingBottom: 48 },
  back: { alignSelf: "flex-start", paddingVertical: 4 },
  backText: { color: "#0B3D2E", fontWeight: "600" },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#6A7B73",
    fontWeight: "700",
  },
  title: { fontSize: 30, fontWeight: "700", color: "#10231C" },
  subtitle: { fontSize: 15, lineHeight: 22, color: "#4A5C54" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D7E2DC",
    padding: 18,
    gap: 14,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#10231C" },
  cardBody: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  prompt: { fontSize: 18, fontWeight: "700", color: "#10231C", marginTop: 4 },
  help: { fontSize: 13, color: "#6A7B73" },
  options: { gap: 10 },
  row: { flexDirection: "row", gap: 10, marginTop: 4 },
  primary: {
    flex: 1,
    backgroundColor: "#0B3D2E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryDisabled: { opacity: 0.45 },
  primaryText: { color: "#fff", fontWeight: "700" },
  secondary: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0B3D2E",
  },
  secondaryText: { color: "#0B3D2E", fontWeight: "700" },
  error: { color: "#A11B1B", fontSize: 13 },
});
