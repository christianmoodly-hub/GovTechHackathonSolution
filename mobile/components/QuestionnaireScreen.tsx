import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "./KhethaBrandBar";
import { useAuth } from "../contexts/AuthContext";
import { useLocale } from "../contexts/LocaleContext";
import { useVaultStats } from "../hooks/useVaultStats";
import { getOccupationSummaries, updateProfile } from "../services/ncapData";
import {
  clearQuestionnaireDraft,
  getQuestionnaireDraft,
  saveQuestionnaireDraft,
} from "../services/offlineProfile";
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
  const { user, profile, refreshProfile, applyLocalProfile } = useAuth();
  const { strings, tabs } = useLocale();
  const chrome = strings.questionnaires.chrome;
  const vault = useVaultStats();
  const isCareerChoice = resultKey === "careerChoice";

  const existing = profile?.questionnaireResults?.[resultKey] as
    | QuestionnaireResult
    | undefined;

  const [phase, setPhase] = useState<"intro" | "questions">(
    isCareerChoice && !existing?.matches?.length ? "questions" : "intro",
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(
    existing?.answers ?? {},
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    if (existing?.answers) {
      setAnswers(existing.answers);
    }
  }, [existing?.completedAt]);

  useEffect(() => {
    if (!user?.uid || existing?.matches?.length) return;
    let alive = true;
    void getQuestionnaireDraft(user.uid, resultKey).then((draft) => {
      if (!alive || !draft) return;
      setAnswers(draft.answers ?? {});
      setStep(draft.step ?? 0);
      setPhase("questions");
      setDraftRestored(true);
    });
    return () => {
      alive = false;
    };
  }, [user?.uid, resultKey, existing?.matches?.length]);

  const question = definition.questions[step];
  const total = definition.questions.length;
  const selected = question ? answers[question.id] : undefined;
  const progressPct = Math.round(((step + 1) / total) * 100);

  const startFresh = () => {
    setAnswers({});
    setStep(0);
    setError(null);
    setPhase("questions");
    setDraftRestored(false);
    if (user?.uid) {
      void clearQuestionnaireDraft(user.uid, resultKey);
    }
  };

  const onSelect = (optionId: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  };

  const saveAndExit = () => {
    if (user?.uid) {
      void saveQuestionnaireDraft(user.uid, {
        questionnaireId: definition.id,
        resultKey,
        answers,
        step,
      });
    }
    router.replace(href("/questionnaires"));
  };

  const onNext = async () => {
    if (!question || !selected) return;

    if (step < total - 1) {
      const nextAnswers = { ...answers, [question.id]: selected };
      setAnswers(nextAnswers);
      setStep((value) => value + 1);
      if (user?.uid) {
        void saveQuestionnaireDraft(user.uid, {
          questionnaireId: definition.id,
          resultKey,
          answers: nextAnswers,
          step: step + 1,
        });
      }
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

      const nextProfile = await updateProfile(user.uid, {
        questionnaireResults: nextMap,
      });
      applyLocalProfile(nextProfile);
      await clearQuestionnaireDraft(user.uid, resultKey);
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
      {isCareerChoice ? (
        <OfflineStatusBar
          cachedCount={vault.careersCached}
          rightLabel={tabs.decisions}
          onRightPress={() => router.push(href("/questionnaires"))}
        />
      ) : (
        <View style={styles.crumbRow}>
          <Pressable onPress={() => router.back()} style={styles.crumbBack}>
            <MaterialIcon name="arrow_back" size={18} color={colors.primary} />
            <Text style={styles.crumbText}>{tabs.decisions}</Text>
          </Pressable>
          <Text style={styles.crumbSep}>/</Text>
          <Text style={styles.crumbCurrent}>{definition.title}</Text>
        </View>
      )}
      {draftRestored ? (
        <Text style={styles.draftHint}>{chrome.draftRestored}</Text>
      ) : null}
      {phase === "intro" ? (
        <View style={styles.card}>
          <View style={styles.moduleBanner}>
            <MaterialIcon
              name={isCareerChoice ? "psychology" : "engineering"}
              size={18}
              color={isCareerChoice ? colors.primary : colors.ochre}
            />
            <Text
              style={[
                styles.moduleBannerText,
                isCareerChoice && { color: colors.primary },
              ]}
            >
              {isCareerChoice
                ? "HOLLAND RIASEC · CAREER INTEREST PROFILER"
                : resultKey === "jobFit"
                  ? "MODULE: WORK ENVIRONMENT & TASK APTITUDE"
                  : `MODULE: ${definition.title.toUpperCase()}`}
            </Text>
          </View>
          <Text style={styles.title}>
            {definition.profilerTitle ?? definition.title}
          </Text>
          <Text style={styles.subtitle}>{definition.subtitle}</Text>

          {existing?.matches?.length ? (
            <>
              <Text style={styles.cardBody}>
                Previous results found. View your matches or retake the diagnostic.
              </Text>
              <PrimaryButton
                label={chrome.seeResults}
                onPress={() =>
                  router.push(href(`/questionnaires/results/${resultKey}`))
                }
              />
              <PrimaryButton
                label={chrome.retake}
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
              <PrimaryButton
                label={
                  isCareerChoice
                    ? chrome.startInterestProfiler
                    : chrome.startDiagnostic
                }
                onPress={startFresh}
              />
            </>
          )}
        </View>
      ) : null}

      {phase === "questions" && question && isCareerChoice ? (
        <CareerChoiceFlow
          definition={definition}
          question={question}
          step={step}
          total={total}
          progressPct={progressPct}
          selected={selected}
          busy={busy}
          error={error}
          chrome={chrome}
          onPause={saveAndExit}
          onSelect={onSelect}
          onBack={() => setStep((value) => Math.max(0, value - 1))}
          onNext={() => void onNext()}
          onSaveExit={saveAndExit}
        />
      ) : null}

      {phase === "questions" && question && !isCareerChoice ? (
        <View style={styles.card}>
          <View style={styles.progressMeta}>
            <Text style={styles.stepLabel}>
              {chrome.questionOf(step + 1, total)}
            </Text>
            <Text style={styles.pctLabel}>
              {chrome.progressComplete(progressPct)}
            </Text>
          </View>
          <ProgressBar current={step + 1} total={total} />
          <Text style={styles.eta}>
            Estimated {Math.max(1, Math.ceil(((total - step) * 45) / 60))} mins
            remaining
          </Text>

          <View style={styles.offlineBanner}>
            <MaterialIcon name="offline_pin" size={16} color={colors.success} />
            <Text style={styles.offlineText}>{chrome.autoSaveHint}</Text>
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
                emoji={option.emoji}
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
            <Text style={styles.guidanceText}>{chrome.autoSaveHint}</Text>
          </View>

          <View style={styles.row}>
            <Pressable
              style={[styles.secondaryBtn, (step === 0 || busy) && styles.disabled]}
              disabled={step === 0 || busy}
              onPress={() => setStep((value) => Math.max(0, value - 1))}
            >
              <MaterialIcon name="chevron_left" size={20} color={colors.text} />
              <Text style={styles.secondaryText}>{chrome.back}</Text>
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
                    {step === total - 1
                      ? chrome.seeResults
                      : chrome.nextQuestion}
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

          <Pressable onPress={saveAndExit} style={styles.saveLater}>
            <MaterialIcon name="cloud_sync" size={16} color={colors.primary} />
            <Text style={styles.saveLaterText}>
              {chrome.saveProgressLater}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
}

function CareerChoiceFlow({
  definition,
  question,
  step,
  total,
  progressPct,
  selected,
  busy,
  error,
  chrome,
  onPause,
  onSelect,
  onBack,
  onNext,
  onSaveExit,
}: {
  definition: QuestionnaireDefinition;
  question: QuestionnaireDefinition["questions"][number];
  step: number;
  total: number;
  progressPct: number;
  selected?: string;
  busy: boolean;
  error: string | null;
  chrome: ReturnType<typeof useLocale>["strings"]["questionnaires"]["chrome"];
  onPause: () => void;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveExit: () => void;
}) {
  return (
    <>
      <View style={styles.profilerHeader}>
        <View style={styles.profilerLeft}>
          <MaterialIcon name="psychology" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.profilerTitle}>
              {definition.profilerTitle ?? "Career Interest Profiler"}
            </Text>
            <Text style={styles.profilerSub}>
              {definition.profilerSubtitle ?? "Khetha NCAP • Holland RIASEC"}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onPause}
          style={styles.pauseBtn}
          accessibilityLabel={chrome.pauseSave}
        >
          <MaterialIcon name="pause_circle" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressMeta}>
          <Text style={styles.ccStep}>
            {chrome.questionOf(step + 1, total)}
          </Text>
          <Text style={styles.ccPct}>
            {chrome.progressComplete(progressPct)}
          </Text>
        </View>
        <View style={styles.ccTrack}>
          <View style={[styles.ccFill, { width: `${progressPct}%` }]} />
        </View>
        {question.categoryLabel ? (
          <View style={styles.categoryPill}>
            <MaterialIcon
              name={question.categoryIcon ?? "build"}
              size={15}
              color={colors.success}
            />
            <Text style={styles.categoryText}>{question.categoryLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.ccCard}>
        {question.heroImage ? (
          <View style={styles.heroWrap}>
            <Image
              source={question.heroImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradient} />
            <View style={styles.heroOverlays}>
              {question.heroTag ? (
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>{question.heroTag}</Text>
                </View>
              ) : (
                <View />
              )}
              {question.heroMeta ? (
                <View style={styles.heroMeta}>
                  <MaterialIcon name="bolt" size={14} color={colors.onPrimary} />
                  <Text style={styles.heroMetaText}>{question.heroMeta}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <View style={styles.promptBlock}>
          <Text style={styles.ccPrompt}>{question.prompt}</Text>
          {question.helpText ? (
            <Text style={styles.ccHelp}>{question.helpText}</Text>
          ) : null}
        </View>

        <View style={styles.options}>
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              label={option.label}
              emoji={option.emoji}
              selected={selected === option.id}
              onPress={() => onSelect(option.id)}
            />
          ))}
        </View>

        <View style={styles.autoSave}>
          <MaterialIcon name="cloud_done" size={18} color={colors.success} />
          <Text style={styles.autoSaveText}>{chrome.autoSaveHint}</Text>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.ccActions}>
        <Pressable
          style={[styles.ccBack, (step === 0 || busy) && styles.disabled]}
          disabled={step === 0 || busy}
          onPress={onBack}
        >
          <MaterialIcon name="arrow_back" size={18} color={colors.primary} />
          <Text style={styles.ccBackText}>{chrome.back}</Text>
        </Pressable>
        <Pressable
          style={[styles.ccNext, (!selected || busy) && styles.disabled]}
          disabled={!selected || busy}
          onPress={onNext}
        >
          {busy ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <>
              <Text style={styles.ccNextText}>
                {step === total - 1
                  ? chrome.seeResults
                  : chrome.nextQuestion}
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

      <Pressable onPress={onSaveExit} style={styles.saveExit}>
        <MaterialIcon name="save" size={16} color={colors.textSecondary} />
        <Text style={styles.saveExitText}>{chrome.saveExit}</Text>
      </Pressable>

      <View style={styles.trust}>
        <View style={styles.trustRow}>
          <MaterialIcon name="verified" size={16} color={colors.gold} />
          <Text style={styles.trustTitle}>
            National Career Advice Portal (NCAP)
          </Text>
        </View>
        <Text style={styles.trustBody}>
          Career Development Services · Department of Higher Education and
          Training
        </Text>
      </View>
    </>
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
  draftHint: {
    ...typography.caption,
    color: colors.success,
    marginBottom: spacing.sm,
  },
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
  options: { gap: 10 },
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
  profilerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F3FF",
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  profilerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  profilerTitle: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  profilerSub: { ...typography.caption, color: colors.textSecondary },
  pauseBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBlock: { gap: 8 },
  ccStep: { ...typography.caption, color: colors.primary, fontWeight: "700" },
  ccPct: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "800",
  },
  ccTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: "#E7EEFF",
    padding: 2,
    overflow: "hidden",
  },
  ccFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  categoryPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
    flexShrink: 1,
  },
  ccCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  heroWrap: {
    height: 144,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },
  heroImage: { width: "100%", height: "100%" },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  heroOverlays: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  heroTag: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "65%",
  },
  heroTagText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "600",
  },
  promptBlock: { gap: 6 },
  ccPrompt: { ...typography.headlineSm, color: colors.text },
  ccHelp: {
    ...typography.bodySm,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  autoSave: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  autoSaveText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
    lineHeight: 16,
  },
  ccActions: { flexDirection: "row", gap: 12 },
  ccBack: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: "#E7EEFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ccBackText: { ...typography.labelLg, color: colors.primary, fontWeight: "700" },
  ccNext: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ccNextText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  saveExit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
  },
  saveExitText: { ...typography.labelMd, color: colors.textSecondary },
  trust: {
    alignItems: "center",
    gap: 4,
    paddingTop: spacing.md,
    opacity: 0.85,
  },
  trustRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  trustTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  trustBody: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
