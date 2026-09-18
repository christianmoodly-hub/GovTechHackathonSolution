import { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "../../../components/Screen";
import { MaterialIcon } from "../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../components/KhethaBrandBar";
import { useAuth } from "../../../contexts/AuthContext";
import { OFFLINE_VAULT_STATS } from "../../../data/staticContent";
import {
  ELECTIVES,
  FAL_LANGUAGES,
  HOME_LANGUAGES,
  type ElectiveId,
  type MathStream,
} from "../../../questionnaires/subjectPackage";
import { updateProfile } from "../../../services/ncapData";
import type {
  QuestionnaireResult,
  QuestionnaireResultsMap,
} from "../../../services/types";
import {
  apsBandForTotal,
  buildSubjectRows,
  calculateNscAps,
  clampNscLevel,
  nscLevelLabel,
  serializeApsLevels,
  type NscLevel,
} from "../../../utils/aps";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";

function parseElectivesParam(raw: string | string[] | undefined): ElectiveId[] {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return [];
  const allowed = new Set(ELECTIVES.map((e) => e.id));
  return value
    .split(",")
    .map((id) => id.trim())
    .filter((id): id is ElectiveId => allowed.has(id as ElectiveId));
}

function parseMathParam(raw: string | string[] | undefined): MathStream | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "pure" || value === "lit") return value;
  return null;
}

export default function ApsCalculatorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    homeLanguage?: string | string[];
    falLanguage?: string | string[];
    math?: string | string[];
    electives?: string | string[];
    grade?: string | string[];
  }>();
  const { user, profile, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saved = profile?.questionnaireResults?.subjectChooser;
  const savedAnswers = saved?.answers ?? {};

  const packageData = useMemo(() => {
    const fromParamsElectives = parseElectivesParam(params.electives);
    const fromParamsMath = parseMathParam(params.math);
    const paramHl = Array.isArray(params.homeLanguage)
      ? params.homeLanguage[0]
      : params.homeLanguage;
    const paramFal = Array.isArray(params.falLanguage)
      ? params.falLanguage[0]
      : params.falLanguage;
    const paramGrade = Array.isArray(params.grade)
      ? params.grade[0]
      : params.grade;

    const electivesFromSaved = (savedAnswers.electives ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter((id): id is ElectiveId =>
        ELECTIVES.some((e) => e.id === id),
      );

    const electives =
      fromParamsElectives.length === 3
        ? fromParamsElectives
        : electivesFromSaved;
    const math: MathStream =
      fromParamsMath ??
      (savedAnswers.math === "lit" || savedAnswers.math === "pure"
        ? savedAnswers.math
        : "pure");
    const homeLanguage =
      paramHl ||
      savedAnswers.homeLanguage ||
      HOME_LANGUAGES[0];
    const falLanguage =
      paramFal ||
      savedAnswers.falLanguage ||
      FAL_LANGUAGES[0];
    const grade = paramGrade || savedAnswers.grade || "grade10";

    return { electives, math, homeLanguage, falLanguage, grade };
  }, [params, savedAnswers]);

  const initialLevels = useMemo(() => {
    const fromSaved: Record<string, number> = {};
    const raw = savedAnswers.apsLevels;
    if (raw) {
      for (const part of raw.split("|")) {
        const [id, levelRaw] = part.split(":");
        if (!id || !levelRaw) continue;
        fromSaved[id] = clampNscLevel(Number(levelRaw));
      }
    }
    return fromSaved;
  }, [savedAnswers.apsLevels]);

  const [levels, setLevels] = useState<Record<string, NscLevel>>({});

  useEffect(() => {
    // Seed steppers once from saved APS or defaults when package is ready.
    if (packageData.electives.length !== 3) return;
    setLevels((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const rows = buildSubjectRows({
        homeLanguage: packageData.homeLanguage,
        falLanguage: packageData.falLanguage,
        math: packageData.math,
        electives: packageData.electives,
        levels: initialLevels,
      });
      const map: Record<string, NscLevel> = {};
      for (const row of rows) map[row.id] = row.level;
      return map;
    });
  }, [packageData, initialLevels]);

  const rows = useMemo(() => {
    const built = buildSubjectRows({
      homeLanguage: packageData.homeLanguage,
      falLanguage: packageData.falLanguage,
      math: packageData.math,
      electives: packageData.electives,
      levels: { ...initialLevels, ...levels },
    });
    return built.map((row) => ({
      ...row,
      level: levels[row.id] ?? initialLevels[row.id] ?? row.level,
    }));
  }, [packageData, levels, initialLevels]);

  const { total } = calculateNscAps(rows.map((row) => row.level));
  const band = apsBandForTotal(total);
  const packageReady = packageData.electives.length === 3;

  const setLevel = (id: string, next: number) => {
    setLevels((prev) => ({ ...prev, [id]: clampNscLevel(next) }));
  };

  const persistAps = async () => {
    if (!user?.uid) {
      setError("Sign in to save your APS simulation.");
      return false;
    }
    if (!packageReady) {
      Alert.alert(
        "Complete your subject package",
        "Select exactly 3 electives in Subject Chooser before calculating APS.",
      );
      return false;
    }

    setBusy(true);
    setError(null);
    try {
      const apsLevels = serializeApsLevels(rows);
      const prior = profile?.questionnaireResults?.subjectChooser;
      const nextResult: QuestionnaireResult = {
        questionnaireId: "subjectChooser",
        completedAt: prior?.completedAt ?? new Date().toISOString(),
        answers: {
          ...(prior?.answers ?? {}),
          grade: packageData.grade,
          homeLanguage: packageData.homeLanguage,
          falLanguage: packageData.falLanguage,
          math: packageData.math,
          electives: packageData.electives.join(","),
          apsLevels,
          apsTotal: String(total),
          apsBand: band.filterId,
        },
        domainScores: prior?.domainScores ?? {},
        matches: prior?.matches ?? [],
      };
      const nextMap: QuestionnaireResultsMap = {
        ...(profile?.questionnaireResults ?? {}),
        subjectChooser: nextResult,
      };
      await updateProfile(user.uid, { questionnaireResults: nextMap });
      await refreshProfile();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save APS simulation.",
      );
      return false;
    } finally {
      setBusy(false);
    }
  };

  const onSave = async () => {
    const ok = await persistAps();
    if (ok) {
      Alert.alert(
        "APS saved",
        `Your indicative APS is ${total} (${band.short}). Find it anytime under Saved diagnostics.`,
      );
    }
  };

  const onBrowseQualifications = async () => {
    await persistAps();
    router.push(
      href(`/directory/qualifications?aps=${band.filterId}`),
    );
  };

  if (!packageReady) {
    return (
      <Screen>
        <KhethaBrandBar />
        <View style={styles.emptyCard}>
          <MaterialIcon name="calculate" size={28} color={colors.primary} />
          <Text style={styles.emptyTitle}>Subject package needed</Text>
          <Text style={styles.emptyBody}>
            Choose your languages, maths stream, and exactly 3 electives first.
            APS uses that package with your estimated NSC levels.
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() =>
              router.replace(href("/questionnaires/subject-chooser"))
            }
          >
            <Text style={styles.primaryBtnText}>Open Subject Chooser</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.crumbRow}>
        <Pressable onPress={() => router.push(href("/questionnaires"))}>
          <Text style={styles.crumbMuted}>Decisions</Text>
        </Pressable>
        <MaterialIcon name="chevron_right" size={14} color={colors.textMuted} />
        <Pressable
          onPress={() => router.push(href("/questionnaires/subject-chooser"))}
        >
          <Text style={styles.crumbMuted}>Subjects</Text>
        </Pressable>
        <MaterialIcon name="chevron_right" size={14} color={colors.textMuted} />
        <Text style={styles.crumbActive}>APS Calculator</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroKicker}>NSC Admission Point Score</Text>
        <Text style={styles.heroTitle}>Estimate your APS</Text>
        <Text style={styles.heroBody}>
          Set an achievement level (1–7) for each subject in your package. We
          sum your best 6 subjects (Life Orientation excluded).
        </Text>
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Indicative APS</Text>
        <Text style={styles.resultTotal}>{total}</Text>
        <View style={styles.bandPill}>
          <Text style={styles.bandText}>{band.label}</Text>
        </View>
        <Text style={styles.resultGuidance}>{band.guidance}</Text>
      </View>

      <Text style={styles.sectionTitle}>Your subject package</Text>
      {rows.map((row) => (
        <View key={row.id} style={styles.subjectCard}>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text style={styles.subjectLabel} numberOfLines={2}>
              {row.label}
            </Text>
            <Text style={styles.subjectMeta}>{nscLevelLabel(row.level)}</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setLevel(row.id, row.level - 1)}
              accessibilityLabel={`Decrease ${row.label}`}
            >
              <MaterialIcon name="remove" size={18} color={colors.primary} />
            </Pressable>
            <Text style={styles.stepValue}>{row.level}</Text>
            <Pressable
              style={styles.stepBtn}
              onPress={() => setLevel(row.id, row.level + 1)}
              accessibilityLabel={`Increase ${row.label}`}
            >
              <MaterialIcon name="add" size={18} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={styles.disclaimer}>
        Indicative NSC APS only — institutions may weight subjects differently
        or set faculty-specific minima. Confirm with each university or TVET
        college before applying.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.primaryBtn, busy && styles.disabled]}
        disabled={busy}
        onPress={() => void onBrowseQualifications()}
      >
        {busy ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            <Text style={styles.primaryBtnText}>
              Browse qualifications ({band.short})
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
        style={[styles.secondaryBtn, busy && styles.disabled]}
        disabled={busy}
        onPress={() => void onSave()}
      >
        <MaterialIcon name="check_circle" size={18} color={colors.primary} />
        <Text style={styles.secondaryBtnText}>Save APS to my profile</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  crumbRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  crumbMuted: { ...typography.caption, color: colors.textMuted },
  crumbActive: { ...typography.caption, color: colors.primary, fontWeight: "700" },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  heroKicker: {
    ...typography.caption,
    color: colors.gold,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: { ...typography.headlineMd, color: colors.onPrimary },
  heroBody: { ...typography.bodySm, color: "rgba(255,255,255,0.88)" },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  resultLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultTotal: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: "800",
    color: colors.primary,
  },
  bandPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  bandText: { ...typography.labelMd, color: colors.primary, fontWeight: "800" },
  resultGuidance: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  subjectCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  subjectLabel: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  subjectMeta: { ...typography.caption, color: colors.textSecondary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: 4,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  stepValue: {
    minWidth: 28,
    textAlign: "center",
    ...typography.headlineSm,
    color: colors.text,
  },
  disclaimer: { ...typography.caption, color: colors.textMuted },
  error: { ...typography.bodySm, color: colors.error },
  primaryBtn: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  primaryBtnText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  secondaryBtn: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  secondaryBtnText: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "700",
  },
  disabled: { opacity: 0.6 },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: "flex-start",
    ...shadows.card,
  },
  emptyTitle: { ...typography.headlineSm, color: colors.text },
  emptyBody: { ...typography.bodyMd, color: colors.textSecondary },
});
