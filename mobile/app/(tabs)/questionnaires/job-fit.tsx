import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../../components/Screen";
import { MaterialIcon } from "../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../components/KhethaBrandBar";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { useAuth } from "../../../contexts/AuthContext";
import { OFFLINE_VAULT_STATS } from "../../../data/staticContent";
import {
  JOB_FIT_DEMAND,
  JOB_FIT_ENVIRONMENTS,
  JOB_FIT_FOLLOW_UPS,
  JOB_FIT_TOTAL_STEPS,
  scoreJobFitAnswers,
} from "../../../questionnaires/jobFitData";
import { matchOccupations } from "../../../questionnaires/scoring";
import { getOccupationSummaries, updateProfile } from "../../../services/ncapData";
import type {
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";

type Answers = {
  environment?: string;
  physical?: string;
  interaction?: string;
  structure?: string;
  schedule?: string;
};

export default function JobFitRoute() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const existing = profile?.questionnaireResults?.jobFit;

  const [phase, setPhase] = useState<"intro" | "questions">(
    existing?.matches?.length ? "intro" : "questions",
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(
    (existing?.answers as Answers) ?? {
      environment: "outdoors",
      physical: "moderate",
    },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = JOB_FIT_TOTAL_STEPS;
  const progressPct = Math.round(((step + 1) / total) * 100);
  const minsLeft = Math.max(1, Math.ceil(((total - step) * 60) / 60));
  const followUp = step > 0 ? JOB_FIT_FOLLOW_UPS[step - 1] : null;

  const canAdvance = useMemo(() => {
    if (step === 0) return Boolean(answers.environment && answers.physical);
    if (!followUp) return false;
    return Boolean(answers[followUp.id as keyof Answers]);
  }, [answers, followUp, step]);

  const startFresh = () => {
    setAnswers({ environment: undefined, physical: "moderate" });
    setStep(0);
    setError(null);
    setPhase("questions");
  };

  const saveAndExit = () => {
    router.replace(href("/questionnaires"));
  };

  const finish = async () => {
    if (!user?.uid) {
      setError("You need to be signed in to save questionnaire results.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const domainScores = scoreJobFitAnswers(answers);
      const { summaries } = await getOccupationSummaries();
      const matches = matchOccupations(domainScores, summaries, 12);
      const nextResult: QuestionnaireResult = {
        questionnaireId: "jobFit",
        completedAt: new Date().toISOString(),
        answers: {
          environment: answers.environment ?? "",
          physical: answers.physical ?? "",
          interaction: answers.interaction ?? "",
          structure: answers.structure ?? "",
          schedule: answers.schedule ?? "",
        },
        domainScores,
        matches,
      };
      const nextMap: QuestionnaireResultsMap = {
        ...(profile?.questionnaireResults ?? {}),
        jobFit: nextResult,
      };
      await updateProfile(user.uid, { questionnaireResults: nextMap });
      await refreshProfile();
      router.replace(href("/questionnaires/results/jobFit"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save questionnaire results.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onNext = () => {
    if (!canAdvance) return;
    if (step < total - 1) {
      setStep((value) => value + 1);
      return;
    }
    void finish();
  };

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      {phase === "intro" ? (
        <View style={styles.introCard}>
          <View style={styles.modulePill}>
            <MaterialIcon name="engineering" size={16} color={colors.text} />
            <Text style={styles.modulePillText}>
              Module 2: Work Environment & Task Aptitude
            </Text>
          </View>
          <Text style={styles.introTitle}>Job Fit Diagnostic</Text>
          <Text style={styles.introBody}>
            Match your preferred work environment, physical demand, and working
            style with TVET trades and modern workplace roles.
          </Text>
          {existing?.matches?.length ? (
            <>
              <PrimaryButton
                label="View past results"
                onPress={() =>
                  router.push(href("/questionnaires/results/jobFit"))
                }
              />
              <PrimaryButton
                label="Retake diagnostic"
                variant="secondary"
                onPress={startFresh}
              />
            </>
          ) : (
            <PrimaryButton label="Start diagnostic" onPress={startFresh} />
          )}
        </View>
      ) : null}

      {phase === "questions" ? (
        <>
          <View style={styles.progressCard}>
            <View style={styles.crumbRow}>
              <Pressable
                style={styles.crumbBack}
                onPress={() => router.push(href("/questionnaires"))}
              >
                <MaterialIcon
                  name="chevron_left"
                  size={18}
                  color={colors.primary}
                />
                <Text style={styles.crumbPrimary}>Decisions</Text>
              </Pressable>
              <Text style={styles.crumbSep}>/</Text>
              <Text style={styles.crumbCurrent}>Job Fit Diagnostic</Text>
              <View style={styles.stepPill}>
                <Text style={styles.stepPillText}>
                  Step {step + 1} of {total}
                </Text>
              </View>
            </View>
            <View style={styles.progressMeta}>
              <Text style={styles.pctLabel}>{progressPct}% Complete</Text>
              <Text style={styles.eta}>Estimated {minsLeft} mins remaining</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          <View style={styles.autoSave}>
            <View style={styles.autoSaveLeft}>
              <MaterialIcon name="offline_pin" size={16} color={colors.success} />
              <Text style={styles.autoSaveText}>
                Answers saved locally to device cache · Zero data cost
              </Text>
            </View>
            <View style={styles.autoSaveBadge}>
              <Text style={styles.autoSaveBadgeText}>Auto-Save</Text>
            </View>
          </View>

          <View style={styles.moduleBlock}>
            <View style={styles.modulePill}>
              <MaterialIcon name="engineering" size={16} color={colors.text} />
              <Text style={styles.modulePillText}>
                Module 2: Work Environment & Task Aptitude
              </Text>
            </View>
            <Text style={styles.focusLabel}>
              Focus: Trades, Office & Field Adaptation
            </Text>
          </View>

          {step === 0 ? (
            <EnvironmentStep
              environment={answers.environment}
              physical={answers.physical}
              onSelectEnv={(id) =>
                setAnswers((prev) => ({ ...prev, environment: id }))
              }
              onSelectPhysical={(id) =>
                setAnswers((prev) => ({ ...prev, physical: id }))
              }
            />
          ) : followUp ? (
            <FollowUpStep
              stepNumber={step + 1}
              prompt={followUp.prompt}
              helpText={followUp.helpText}
              options={followUp.options}
              selected={answers[followUp.id as keyof Answers]}
              onSelect={(id) =>
                setAnswers((prev) => ({ ...prev, [followUp.id]: id }))
              }
            />
          ) : null}

          <View style={styles.guidance}>
            <MaterialIcon name="tips_and_updates" size={24} color={colors.gold} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.guidanceTitle}>Khetha Guidance Note</Text>
              <Text style={styles.guidanceBody}>
                78% of registered Artisan graduates report high job satisfaction
                when their training module aligns with their outdoor stamina
                preference during early schooling.
              </Text>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              style={[styles.prevBtn, (step === 0 || busy) && styles.disabled]}
              disabled={step === 0 || busy}
              onPress={() => setStep((value) => Math.max(0, value - 1))}
            >
              <MaterialIcon name="chevron_left" size={20} color={colors.text} />
              <Text style={styles.prevText}>Previous</Text>
            </Pressable>
            <Pressable
              style={[
                styles.nextBtn,
                (!canAdvance || busy) && styles.disabled,
              ]}
              disabled={!canAdvance || busy}
              onPress={onNext}
            >
              {busy ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.nextText}>
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

          <Pressable style={styles.saveLater} onPress={saveAndExit}>
            <MaterialIcon name="cloud_sync" size={16} color={colors.secondary} />
            <Text style={styles.saveLaterText}>
              Save Progress & Finish Later (Offline Friendly)
            </Text>
          </Pressable>
          <Text style={styles.footerNote}>
            Department of Higher Education & Training · National Career Advice
            Portal
          </Text>
        </>
      ) : null}
    </Screen>
  );
}

function EnvironmentStep({
  environment,
  physical,
  onSelectEnv,
  onSelectPhysical,
}: {
  environment?: string;
  physical?: string;
  onSelectEnv: (id: string) => void;
  onSelectPhysical: (id: string) => void;
}) {
  return (
    <>
      <View style={styles.questionCard}>
        <View style={styles.questionTop}>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q1</Text>
          </View>
          <Text style={styles.questionTitle}>
            Which type of work environment would you be most comfortable working
            in every day?
          </Text>
        </View>
        <View style={styles.zuluBox}>
          <MaterialIcon name="translate" size={18} color={colors.secondary} />
          <Text style={styles.zuluText}>
            “Yiluphi uhlobo lwesimo sokusebenza ongaxola kakhulu ukusebenza kulo
            nsuku zonke?”
          </Text>
        </View>
        <Text style={styles.hint}>
          Select the setting that best reflects where your energy and natural
          attention thrive.
        </Text>
      </View>

      {JOB_FIT_ENVIRONMENTS.map((option) => {
        const selected = environment === option.id;
        return (
          <Pressable
            key={option.id}
            style={[styles.envCard, selected && styles.envCardSelected]}
            onPress={() => onSelectEnv(option.id)}
          >
            <View style={styles.envTop}>
              <View style={styles.envTitleRow}>
                <View
                  style={[
                    styles.envIcon,
                    {
                      backgroundColor: selected
                        ? colors.card
                        : "#E7EEFF",
                    },
                  ]}
                >
                  <MaterialIcon
                    name={option.icon}
                    size={22}
                    color={selected ? colors.primary : option.accent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.envLabel,
                      selected && styles.envLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.envSubtitle,
                      selected
                        ? styles.envSubtitleSelected
                        : { color: option.accent },
                    ]}
                  >
                    {option.subtitle}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.radioOuter, selected && styles.radioOuterSelected]}
              >
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
            </View>
            <Text
              style={[styles.envBody, selected && styles.envBodySelected]}
            >
              {option.description}
            </Text>
            <View style={styles.envImageWrap}>
              <Image
                source={option.image}
                style={[styles.envImage, selected && { opacity: 0.9 }]}
                resizeMode="cover"
              />
              <View style={styles.envOverlay}>
                <Text style={styles.envOverlayText}>{option.imageOverlay}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}

      <View style={styles.demandCard}>
        <View style={styles.demandHead}>
          <View style={styles.demandTitleRow}>
            <MaterialIcon
              name="fitness_center"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.demandTitle}>Physical Demand Tolerance</Text>
          </View>
          <View style={styles.selfPill}>
            <Text style={styles.selfPillText}>Self-Assessment</Text>
          </View>
        </View>
        <Text style={styles.demandPrompt}>
          How much daily physical exertion, lifting, or prolonged standing feels
          comfortable for you?
        </Text>
        <View style={styles.demandRow}>
          {JOB_FIT_DEMAND.map((option) => {
            const selected = physical === option.id;
            return (
              <Pressable
                key={option.id}
                style={[
                  styles.demandBtn,
                  selected && styles.demandBtnSelected,
                ]}
                onPress={() => onSelectPhysical(option.id)}
              >
                <Text
                  style={[
                    styles.demandBtnTitle,
                    selected && styles.demandBtnTitleSelected,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.demandBtnDetail,
                    selected && styles.demandBtnDetailSelected,
                  ]}
                >
                  {option.detail}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.accommodation}>
          <MaterialIcon name="check_circle" size={14} color={colors.success} />
          <Text style={styles.accommodationText}>
            Accommodations for varying mobility and physical abilities will be
            factored into TVET & University matching.
          </Text>
        </View>
      </View>
    </>
  );
}

function FollowUpStep({
  stepNumber,
  prompt,
  helpText,
  options,
  selected,
  onSelect,
}: {
  stepNumber: number;
  prompt: string;
  helpText?: string;
  options: {
    id: string;
    label: string;
    description?: string;
    icon: string;
  }[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <View style={styles.questionCard}>
        <View style={styles.questionTop}>
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>Q{stepNumber}</Text>
          </View>
          <Text style={styles.questionTitle}>{prompt}</Text>
        </View>
        {helpText ? <Text style={styles.hint}>{helpText}</Text> : null}
      </View>
      {options.map((option) => {
        const active = selected === option.id;
        return (
          <Pressable
            key={option.id}
            style={[styles.followCard, active && styles.envCardSelected]}
            onPress={() => onSelect(option.id)}
          >
            <View style={styles.envTop}>
              <View style={styles.envTitleRow}>
                <View
                  style={[
                    styles.envIcon,
                    {
                      backgroundColor: active ? colors.card : "#E7EEFF",
                    },
                  ]}
                >
                  <MaterialIcon
                    name={option.icon}
                    size={22}
                    color={active ? colors.primary : colors.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.envLabel,
                      active && styles.envLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {option.description ? (
                    <Text
                      style={[
                        styles.envBody,
                        active && styles.envBodySelected,
                        { marginBottom: 0 },
                      ]}
                    >
                      {option.description}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View
                style={[styles.radioOuter, active && styles.radioOuterSelected]}
              >
                {active ? <View style={styles.radioInner} /> : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  introCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.card,
  },
  introTitle: { ...typography.headlineLg, color: colors.text },
  introBody: { ...typography.bodyMd, color: colors.textSecondary },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  crumbRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  crumbBack: { flexDirection: "row", alignItems: "center" },
  crumbPrimary: { ...typography.labelMd, color: colors.primary },
  crumbSep: { ...typography.caption, color: colors.textMuted },
  crumbCurrent: {
    ...typography.labelMd,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  stepPill: {
    marginLeft: "auto",
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepPillText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "800",
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pctLabel: { ...typography.labelMd, color: colors.text, fontWeight: "700" },
  eta: { ...typography.caption, color: colors.textSecondary },
  progressTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: "#E7EEFF",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  autoSave: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  autoSaveLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  autoSaveText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
  },
  autoSaveBadge: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  autoSaveBadgeText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "800",
  },
  moduleBlock: { gap: 6 },
  modulePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFDEA8",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modulePillText: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  focusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  questionCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  questionTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  qBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  qBadgeText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  questionTitle: {
    ...typography.headlineSm,
    color: colors.text,
    fontWeight: "700",
    flex: 1,
  },
  zuluBox: {
    backgroundColor: "#F0F3FF",
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  zuluText: {
    ...typography.bodySm,
    color: colors.secondary,
    fontStyle: "italic",
    flex: 1,
  },
  hint: { ...typography.caption, color: colors.textSecondary },
  envCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  envCardSelected: {
    backgroundColor: colors.primary,
  },
  envTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  envTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  envIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  envLabel: {
    ...typography.headlineSm,
    color: colors.text,
    fontWeight: "700",
  },
  envLabelSelected: { color: colors.onPrimary },
  envSubtitle: {
    ...typography.caption,
    fontWeight: "800",
  },
  envSubtitleSelected: { color: "#9EF4D0" },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: { backgroundColor: colors.card },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  envBody: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  envBodySelected: { color: "rgba(255,255,255,0.95)" },
  envImageWrap: {
    height: 96,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },
  envImage: { width: "100%", height: "100%" },
  envOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  envOverlayText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  demandCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  demandHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  demandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  demandTitle: {
    ...typography.headlineSm,
    color: colors.text,
    fontWeight: "700",
  },
  selfPill: {
    backgroundColor: "#E7EEFF",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  selfPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  demandPrompt: { ...typography.bodySm, color: colors.textSecondary },
  demandRow: { flexDirection: "row", gap: 8 },
  demandBtn: {
    flex: 1,
    minHeight: 52,
    borderRadius: radii.md,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  demandBtnSelected: { backgroundColor: colors.primary },
  demandBtnTitle: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "800",
    textAlign: "center",
  },
  demandBtnTitleSelected: { color: colors.onPrimary },
  demandBtnDetail: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  demandBtnDetailSelected: { color: "#9EF4D0" },
  accommodation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  accommodationText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
    fontWeight: "600",
  },
  followCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  guidance: {
    backgroundColor: "#F0F3FF",
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  guidanceTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  guidanceBody: { ...typography.bodySm, color: colors.textSecondary },
  actions: { flexDirection: "row", gap: spacing.md },
  prevBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: "#E7EEFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  prevText: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  nextBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  nextText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  disabled: { opacity: 0.45 },
  saveLater: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
  },
  saveLaterText: {
    ...typography.labelMd,
    color: colors.secondary,
    fontWeight: "700",
  },
  footerNote: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  error: { ...typography.bodySm, color: colors.error },
});
