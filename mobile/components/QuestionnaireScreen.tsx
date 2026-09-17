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
import { MaterialIcon } from "./MaterialIcon";
import { KhethaBrandBar } from "./KhethaBrandBar";
import { useAuth } from "../contexts/AuthContext";
import { getOccupationSummaries, updateProfile } from "../services/ncapData";
import type {
  QuestionnaireId,
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../services/types";
import type { QuestionnaireDefinition } from "../questionnaires/domains";
import { matchOccupations, scoreAnswers } from "../questionnaires/scoring";
import { colors, radii, shadows, spacing, typography } from "../theme";
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

  const [phase, setPhase] = useState<"intro" | "questions">("intro");
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
  const progressPct = Math.round(((step + 1) / total) * 100);
  const minsLeft = Math.max(1, Math.ceil(((total - step) * 45) / 60));

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
      <KhethaBrandBar />
      <View style={styles.crumbRow}>
        <Pressable onPress={() => router.back()} style={styles.crumbBack}>
          <MaterialIcon name="arrow_back" size={18} color={colors.primary} />
          <Text style={styles.crumbText}>Decisions</Text>
        </Pressable>
        <Text style={styles.crumbSep}>/</Text>
        <Text style={styles.crumbCurrent}>{definition.title}</Text>
      </View>

      {phase === "intro" ? (
        <View style={styles.card}>
          <View style={styles.moduleBanner}>
            <MaterialIcon name="engineering" size={18} color={colors.ochre} />
            <Text style={styles.moduleBannerText}>
              {resultKey === "jobFit"
                ? "MODULE: WORK ENVIRONMENT & TASK APTITUDE"
                : `MODULE: ${definition.title.toUpperCase()}`}
            </Text>
          </View>
          <Text style={styles.title}>{definition.title}</Text>
          <Text style={styles.subtitle}>{definition.subtitle}</Text>

          {existing?.matches?.length ? (
            <>
              <Text style={styles.cardBody}>
                Previous results found. View your matches or retake the diagnostic.
              </Text>
              <PrimaryButton
                label="View past results"
                onPress={() =>
                  router.push(href(`/questionnaires/results/${resultKey}`))
                }
              />
              <PrimaryButton
                label="Retake questionnaire"
                variant="secondary"
                onPress={startFresh}
              />
            </>
          ) : (
            <>
              <Text style={styles.cardBody}>
                {total} short questions · answers save offline-friendly to your
                profile and link into real NCAP occupations.
              </Text>
              <PrimaryButton label="Start diagnostic" onPress={startFresh} />
            </>
          )}
        </View>
      ) : null}

      {phase === "questions" && question ? (
        <View style={styles.card}>
          <View style={styles.progressMeta}>
            <Text style={styles.stepLabel}>
              Step {step + 1} of {total}
            </Text>
            <Text style={styles.pctLabel}>{progressPct}% Complete</Text>
          </View>
          <ProgressBar current={step + 1} total={total} />
          <Text style={styles.eta}>Estimated {minsLeft} mins remaining</Text>

          <View style={styles.offlineBanner}>
            <MaterialIcon name="offline_pin" size={16} color={colors.success} />
            <Text style={styles.offlineText}>
              Answers saved locally to device cache · Zero data cost
            </Text>
          </View>

          <View style={styles.moduleBanner}>
            <MaterialIcon name="engineering" size={16} color={colors.ochre} />
            <Text style={styles.moduleBannerText}>
              {resultKey === "jobFit"
                ? "MODULE: WORK ENVIRONMENT & TASK APTITUDE"
                : `Q${step + 1}`}
            </Text>
          </View>

          <Text style={styles.prompt}>{question.prompt}</Text>
          {question.helpText ? (
            <View style={styles.helpBox}>
              <Text style={styles.help}>{question.helpText}</Text>
            </View>
          ) : null}

          <View style={styles.options}>
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                label={option.label}
                description={option.description}
                icon={option.icon}
                image={option.image}
                selected={selected === option.id}
                onPress={() => onSelect(option.id)}
              />
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.guidance}>
            <MaterialIcon name="tips_and_updates" size={18} color={colors.secondary} />
            <Text style={styles.guidanceText}>
              Khetha Guidance: honest answers improve occupation matching against
              the national NCAP database.
            </Text>
          </View>

          <View style={styles.row}>
            <Pressable
              style={[styles.secondaryBtn, (step === 0 || busy) && styles.disabled]}
              disabled={step === 0 || busy}
              onPress={() => setStep((value) => Math.max(0, value - 1))}
            >
              <MaterialIcon name="chevron_left" size={20} color={colors.text} />
              <Text style={styles.secondaryText}>Previous</Text>
            </Pressable>
            <Pressable
              style={[
                styles.primaryBtn,
                (!selected || busy) && styles.disabled,
              ]}
              disabled={!selected || busy}
              onPress={() => void onNext()}
            >
              {busy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.primaryText}>
                    {step === total - 1 ? "See results" : "Next Question"}
                  </Text>
                  <MaterialIcon
                    name="arrow_forward"
                    size={18}
                    color={colors.onPrimary}
                  />
                </>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.replace(href("/questionnaires"))}
            style={styles.saveLater}
          >
            <MaterialIcon name="cloud_sync" size={16} color={colors.primary} />
            <Text style={styles.saveLaterText}>
              Save Progress & Finish Later (Offline Friendly)
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  crumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  crumbBack: { flexDirection: "row", alignItems: "center", gap: 4 },
  crumbText: { ...typography.labelLg, color: colors.primary },
  crumbSep: { ...typography.bodySm, color: colors.textMuted },
  crumbCurrent: { ...typography.labelLg, color: colors.text },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  moduleBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF4E5",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  moduleBannerText: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "700",
    letterSpacing: 0.4,
    flex: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  subtitle: { ...typography.bodyMd, color: colors.textSecondary },
  cardBody: { ...typography.bodySm, color: colors.textSecondary },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: { ...typography.labelMd, color: colors.textSecondary },
  pctLabel: { ...typography.labelMd, color: colors.primary },
  eta: { ...typography.caption, color: colors.textMuted },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  offlineText: { ...typography.caption, color: colors.success, flex: 1 },
  prompt: { ...typography.headlineSm, color: colors.text },
  helpBox: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  help: { ...typography.bodySm, color: colors.secondary },
  options: { gap: spacing.md },
  guidance: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: "#F0F9FF",
    borderRadius: radii.md,
    padding: spacing.md,
  },
  guidanceText: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  row: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xs },
  secondaryBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.muted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  secondaryText: { ...typography.labelLg, color: colors.text },
  primaryBtn: {
    flex: 1.3,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryText: { ...typography.labelLg, color: colors.onPrimary },
  disabled: { opacity: 0.45 },
  saveLater: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
  },
  saveLaterText: { ...typography.labelMd, color: colors.primary },
  error: { color: colors.error, ...typography.bodySm },
});
