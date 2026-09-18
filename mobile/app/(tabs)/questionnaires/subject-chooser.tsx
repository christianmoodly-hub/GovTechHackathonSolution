import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
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
import { useAuth } from "../../../contexts/AuthContext";
import { HELPLINE, OFFLINE_VAULT_STATS } from "../../../data/staticContent";
import {
  ELECTIVES,
  estimateUnlockedCount,
  FAL_LANGUAGES,
  GRADE_STAGES,
  HOME_LANGUAGES,
  previewCareerChips,
  scoreSubjectPackage,
  type ElectiveId,
  type GradeStage,
  type MathStream,
} from "../../../questionnaires/subjectPackage";
import { matchOccupations } from "../../../questionnaires/scoring";
import { getOccupationSummaries, updateProfile } from "../../../services/ncapData";
import type {
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";

const MAX_ELECTIVES = 3;

export default function SubjectChooserRoute() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const [grade, setGrade] = useState<GradeStage>("grade9");
  const [homeLanguage, setHomeLanguage] = useState<string>(HOME_LANGUAGES[0]);
  const [falLanguage, setFalLanguage] = useState<string>(FAL_LANGUAGES[0]);
  const [math, setMath] = useState<MathStream>("pure");
  const [electives, setElectives] = useState<ElectiveId[]>([
    "phys-sci",
    "life-sci",
    "it",
  ]);
  const [openPicker, setOpenPicker] = useState<"hl" | "fal" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlockedCount = estimateUnlockedCount(math, electives.length);
  const chips = useMemo(
    () => previewCareerChips(math, electives),
    [math, electives],
  );
  const needsPureWarning =
    math === "lit" &&
    electives.some((id) => ELECTIVES.find((e) => e.id === id)?.requiresPureMath);
  const electiveComplete = electives.length === MAX_ELECTIVES;

  const toggleElective = (id: ElectiveId) => {
    setElectives((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_ELECTIVES) {
        Alert.alert(
          "Elective limit",
          "Please pick exactly 3 elective subjects to fit your standard 7-subject NSC package.",
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const saveAndViewCareers = async () => {
    if (!user?.uid) {
      setError("You need to be signed in to save your subject package.");
      return;
    }
    if (electives.length !== MAX_ELECTIVES) {
      Alert.alert(
        "Choose 3 electives",
        "Select exactly 3 elective subjects before viewing unlocked careers.",
      );
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const domainScores = scoreSubjectPackage(math, electives);
      const { summaries } = await getOccupationSummaries();
      const matches = matchOccupations(domainScores, summaries, 12);
      const nextResult: QuestionnaireResult = {
        questionnaireId: "subjectChooser",
        completedAt: new Date().toISOString(),
        answers: {
          grade,
          homeLanguage,
          falLanguage,
          math,
          electives: electives.join(","),
        },
        domainScores,
        matches,
      };
      const nextMap: QuestionnaireResultsMap = {
        ...(profile?.questionnaireResults ?? {}),
        subjectChooser: nextResult,
      };
      await updateProfile(user.uid, { questionnaireResults: nextMap });
      await refreshProfile();
      router.replace(href("/questionnaires/results/subjectChooser"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save subject package.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.crumbRow}>
          <Pressable onPress={() => router.push(href("/"))}>
            <Text style={styles.crumbMuted}>Home</Text>
          </Pressable>
          <MaterialIcon name="chevron_right" size={14} color={colors.textMuted} />
          <Text style={styles.crumbActive}>Subject Chooser</Text>
        </View>

        <View style={styles.progressHead}>
          <View style={styles.progressMeta}>
            <Text style={styles.stepLabel}>Step 2 of 3</Text>
            <Text style={styles.pctLabel}>66% Completed</Text>
          </View>
          <Text style={styles.title}>Select Your Subject Package</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "66%" }]}>
              <View style={styles.progressDot} />
            </View>
          </View>
        </View>

        <Text style={styles.stageLabel}>Your Current Stage</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gradeRow}
        >
          {GRADE_STAGES.map((item) => {
            const active = grade === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setGrade(item.id)}
                style={[styles.gradePill, active && styles.gradePillActive]}
              >
                {active ? (
                  <MaterialIcon
                    name="verified"
                    size={16}
                    color={colors.onPrimary}
                  />
                ) : null}
                <Text
                  style={[styles.gradeText, active && styles.gradeTextActive]}
                >
                  {item.label}
                  {item.detail ? (
                    <Text
                      style={[
                        styles.gradeDetail,
                        active && styles.gradeDetailActive,
                      ]}
                    >
                      {" "}
                      {item.detail}
                    </Text>
                  ) : null}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Compulsory */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardHeadLeft}>
              <View style={styles.checkBubble}>
                <MaterialIcon
                  name="check_circle"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>4 Compulsory Subjects</Text>
                <Text style={styles.cardSub}>
                  National Curriculum Statement (CAPS) Requirements
                </Text>
              </View>
            </View>
            <View style={styles.lockedPill}>
              <Text style={styles.lockedText}>Locked (4/4)</Text>
            </View>
          </View>

          <LanguageField
            label="Subject 1: Home Language (HL)"
            credits="20 Credits"
            value={homeLanguage}
            options={[...HOME_LANGUAGES]}
            open={openPicker === "hl"}
            onToggle={() =>
              setOpenPicker((prev) => (prev === "hl" ? null : "hl"))
            }
            onSelect={(value) => {
              setHomeLanguage(value);
              setOpenPicker(null);
            }}
          />

          <LanguageField
            label="Subject 2: First Additional Language (FAL)"
            credits="20 Credits"
            value={falLanguage}
            options={[...FAL_LANGUAGES]}
            open={openPicker === "fal"}
            onToggle={() =>
              setOpenPicker((prev) => (prev === "fal" ? null : "fal"))
            }
            onSelect={(value) => {
              setFalLanguage(value);
              setOpenPicker(null);
            }}
          />

          <View style={styles.compulsoryBlock}>
            <View style={styles.fieldTop}>
              <View style={styles.fieldLabelRow}>
                <MaterialIcon name="lock" size={14} color={colors.success} />
                <Text style={styles.fieldLabel}>
                  Subject 3: Mathematics Stream Choice
                </Text>
              </View>
              <Text style={styles.credits}>20 Credits</Text>
            </View>
            <View style={styles.mathSwitch}>
              <Pressable
                style={[
                  styles.mathBtn,
                  math === "pure" && styles.mathBtnActive,
                ]}
                onPress={() => setMath("pure")}
              >
                <Text
                  style={[
                    styles.mathBtnTitle,
                    math === "pure" && styles.mathBtnTitleActive,
                  ]}
                >
                  Mathematics
                </Text>
                <Text
                  style={[
                    styles.mathBtnSub,
                    math === "pure" && styles.mathBtnSubActive,
                  ]}
                >
                  Pure / Academic
                </Text>
              </Pressable>
              <Pressable
                style={[styles.mathBtn, math === "lit" && styles.mathBtnActive]}
                onPress={() => setMath("lit")}
              >
                <Text
                  style={[
                    styles.mathBtnTitle,
                    math === "lit" && styles.mathBtnTitleActive,
                  ]}
                >
                  Mathematical Literacy
                </Text>
                <Text
                  style={[
                    styles.mathBtnSub,
                    math === "lit" && styles.mathBtnSubActive,
                  ]}
                >
                  Applied / Contextual
                </Text>
              </Pressable>
            </View>
            <View style={styles.advisory}>
              <MaterialIcon
                name={math === "pure" ? "tips_and_updates" : "info"}
                size={20}
                color={colors.secondary}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.advisoryTitle}>
                  {math === "pure"
                    ? "Opens High-Demand STEM Gates"
                    : "Best for Humanities, Commerce & Law"}
                </Text>
                <Text style={styles.advisoryBody}>
                  {math === "pure"
                    ? "Pure Mathematics is strictly required for Engineering, Medicine, Actuarial Science, and Computer Science. Minimum 50-70% needed for university degree pathways."
                    : "Mathematical Literacy builds everyday applied numeric capability. It is accepted for Law (LLB), Media, Education, TVET Diplomas, and Human Resources."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.loRow}>
            <View style={styles.loLeft}>
              <MaterialIcon name="lock" size={16} color={colors.success} />
              <View>
                <Text style={styles.loTitle}>Life Orientation</Text>
                <Text style={styles.loSub}>Holistic Wellness & Citizenship</Text>
              </View>
            </View>
            <View style={styles.loCredits}>
              <Text style={styles.loCreditsText}>10 Credits</Text>
            </View>
          </View>
        </View>

        {/* Electives */}
        <View style={styles.electiveHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Choose 3 Elective Subjects</Text>
            <Text style={styles.cardSub}>
              Tailor your profile for university, TVET, or workforce readiness
            </Text>
          </View>
          <View
            style={[
              styles.electiveBadge,
              !electiveComplete && styles.electiveBadgeWarn,
            ]}
          >
            <Text style={styles.electiveBadgeText}>
              {electives.length} / {MAX_ELECTIVES} Selected
            </Text>
          </View>
        </View>

        {ELECTIVES.map((item) => {
          const selected = electives.includes(item.id);
          return (
            <Pressable
              key={item.id}
              style={[styles.electiveCard, !selected && styles.electiveDim]}
              onPress={() => toggleElective(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selected && styles.checkboxSelected,
                ]}
              >
                {selected ? (
                  <MaterialIcon name="check" size={16} color={colors.onPrimary} />
                ) : null}
              </View>
              <View style={[styles.electiveBar, { backgroundColor: item.barColor }]} />
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.electiveTop}>
                  <Text style={styles.electiveTitle}>{item.title}</Text>
                  <View style={styles.catPill}>
                    <Text style={styles.catText}>{item.category}</Text>
                  </View>
                </View>
                <Text style={styles.electiveBody}>{item.body}</Text>
                {item.requiresPureMath ? (
                  <View style={styles.prereqRow}>
                    <MaterialIcon name="info" size={14} color={colors.secondary} />
                    <Text style={styles.prereqText}>Requires Pure Mathematics</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={styles.helpBanner}
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        >
          <View style={styles.helpIcon}>
            <MaterialIcon name="psychology" size={22} color={colors.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Unsure about your package?</Text>
            <Text style={styles.helpBody}>
              Chat free with a Khetha Career Guidance practitioner via Toll-Free{" "}
              {HELPLINE.tollFreeDisplay} or WhatsApp.
            </Text>
          </View>
        </Pressable>

        {/* Match meter deck */}
        <View style={styles.meterCard}>
          <View style={styles.meterTop}>
            <View style={styles.meterTitleRow}>
              <View style={styles.liveDot} />
              <Text style={styles.meterTitle}>
                {unlockedCount} Careers Unlocked!
              </Text>
            </View>
            <View style={styles.eligPill}>
              <Text style={styles.eligText}>High Eligibility</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {chips.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </ScrollView>

          {needsPureWarning || math === "lit" ? (
            <View style={styles.warningBox}>
              <MaterialIcon name="warning" size={16} color={colors.error} />
              <Text style={styles.warningText}>
                Pure Mathematics required for Engineering & Science disciplines.
              </Text>
            </View>
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryBtn, busy && styles.disabled]}
            disabled={busy}
            onPress={() => void saveAndViewCareers()}
          >
            {busy ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.primaryBtnText}>
                  View All Unlocked Careers ({unlockedCount})
                </Text>
                <MaterialIcon
                  name="arrow_forward"
                  size={18}
                  color={colors.onPrimary}
                />
              </>
            )}
          </Pressable>

          <Pressable
            style={styles.secondaryBtn}
            onPress={() => {
              if (electives.length !== MAX_ELECTIVES) {
                Alert.alert(
                  "Choose 3 electives",
                  "Select exactly 3 elective subjects before calculating APS.",
                );
                return;
              }
              const qs = new URLSearchParams({
                grade,
                homeLanguage,
                falLanguage,
                math,
                electives: electives.join(","),
              });
              router.push(
                href(`/questionnaires/aps-calculator?${qs.toString()}`),
              );
            }}
          >
            <MaterialIcon name="calculate" size={18} color={colors.primary} />
            <Text style={styles.secondaryBtnText}>
              Calculate Admission Point Score (APS)
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

function LanguageField({
  label,
  credits,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  credits: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.langBlock}>
      <View style={styles.fieldTop}>
        <View style={styles.fieldLabelRow}>
          <MaterialIcon name="lock" size={14} color={colors.success} />
          <Text style={styles.fieldLabel}>{label}</Text>
        </View>
        <Text style={styles.credits}>{credits}</Text>
      </View>
      <Pressable style={styles.select} onPress={onToggle}>
        <Text style={styles.selectValue}>{value}</Text>
        <MaterialIcon
          name={open ? "expand_more" : "arrow_drop_down"}
          size={22}
          color={colors.textSecondary}
        />
      </Pressable>
      {open
        ? options.map((option) => (
            <Pressable
              key={option}
              style={[
                styles.selectOption,
                option === value && styles.selectOptionActive,
              ]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  option === value && styles.selectOptionTextActive,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.md },
  scroll: { flex: 1 },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  crumbRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  crumbMuted: { ...typography.caption, color: colors.textSecondary },
  crumbActive: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  progressHead: { gap: 8 },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepLabel: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "800",
  },
  pctLabel: { ...typography.labelMd, color: colors.textSecondary },
  title: { ...typography.headlineMd, color: colors.text, fontWeight: "700" },
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
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 4,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
  stageLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  gradeRow: { gap: 8, paddingRight: spacing.md },
  gradePill: {
    minHeight: 48,
    borderRadius: radii.pill,
    backgroundColor: "#E7EEFF",
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  gradePillActive: { backgroundColor: colors.primary },
  gradeText: { ...typography.labelLg, color: colors.textSecondary },
  gradeTextActive: { color: colors.onPrimary },
  gradeDetail: { ...typography.caption, color: colors.textMuted },
  gradeDetailActive: { color: "rgba(255,255,255,0.8)" },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardHeadLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    flex: 1,
  },
  checkBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardSub: { ...typography.caption, color: colors.textSecondary },
  lockedPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lockedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  langBlock: { gap: 8 },
  fieldTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  fieldLabel: { ...typography.labelMd, color: colors.textSecondary, flex: 1 },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  credits: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  select: {
    minHeight: 48,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.card,
  },
  selectValue: { ...typography.bodyMd, color: colors.text, flex: 1 },
  selectOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  selectOptionActive: { backgroundColor: colors.primaryMuted },
  selectOptionText: { ...typography.bodySm, color: colors.text },
  selectOptionTextActive: { color: colors.primary, fontWeight: "700" },
  compulsoryBlock: {
    backgroundColor: colors.canvas,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  mathSwitch: {
    flexDirection: "row",
    backgroundColor: "#E7EEFF",
    borderRadius: radii.md,
    padding: 4,
    gap: 4,
  },
  mathBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  mathBtnActive: { backgroundColor: colors.primaryDark },
  mathBtnTitle: {
    ...typography.labelMd,
    color: colors.textMuted,
    textAlign: "center",
  },
  mathBtnTitleActive: { color: colors.onPrimary, fontWeight: "800" },
  mathBtnSub: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  mathBtnSubActive: { color: "rgba(255,255,255,0.8)" },
  advisory: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  advisoryTitle: {
    ...typography.labelMd,
    color: "#1D4ED8",
    fontWeight: "800",
  },
  advisoryBody: { ...typography.caption, color: colors.textSecondary },
  loRow: {
    backgroundColor: colors.canvas,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  loLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  loTitle: { ...typography.bodyMd, color: colors.text, fontWeight: "700" },
  loSub: { ...typography.caption, color: colors.textSecondary },
  loCredits: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loCreditsText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "800",
  },
  electiveHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  electiveBadge: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  electiveBadgeWarn: { backgroundColor: colors.ochre },
  electiveBadgeText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  electiveCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    ...shadows.card,
  },
  electiveDim: { opacity: 0.85 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxSelected: { backgroundColor: colors.primary },
  electiveBar: { width: 4, alignSelf: "stretch", borderRadius: 999 },
  electiveTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  electiveTitle: {
    ...typography.bodyMd,
    color: colors.text,
    fontWeight: "700",
    flex: 1,
  },
  catPill: {
    backgroundColor: "#E7EEFF",
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  catText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  electiveBody: { ...typography.bodySm, color: colors.textSecondary },
  prereqRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  prereqText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
  helpBanner: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: {
    ...typography.labelLg,
    color: colors.success,
    fontWeight: "800",
  },
  helpBody: { ...typography.bodySm, color: colors.success },
  meterCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  meterTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  meterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  meterTitle: {
    ...typography.headlineSm,
    color: colors.primary,
    fontWeight: "800",
    flexShrink: 1,
  },
  eligPill: {
    backgroundColor: "#9EF4D0",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eligText: {
    ...typography.caption,
    color: "#002116",
    fontWeight: "800",
  },
  chipRow: { gap: 8 },
  chip: {
    backgroundColor: "#E7EEFF",
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { ...typography.caption, color: colors.text, fontWeight: "700" },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFDAD6",
    borderRadius: radii.md,
    padding: spacing.md,
  },
  warningText: { ...typography.caption, color: "#93000A", flex: 1 },
  primaryBtn: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  primaryBtnText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  secondaryBtn: {
    minHeight: 44,
    borderRadius: radii.md,
    backgroundColor: "#E7EEFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secondaryBtnText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  disabled: { opacity: 0.5 },
  error: { ...typography.bodySm, color: colors.error },
});
