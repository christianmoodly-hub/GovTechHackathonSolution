import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, EmptyState } from "../../../../components/Screen";
import { MatchResultsList } from "../../../../components/MatchResultsList";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../../components/KhethaBrandBar";
import { useAuth } from "../../../../contexts/AuthContext";
import { OFFLINE_VAULT_STATS } from "../../../../data/staticContent";
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
  const [toastVisible, setToastVisible] = useState(false);

  const key = questionnaireId as QuestionnaireId;
  const result = profile?.questionnaireResults?.[key];
  const badges = domainBadges(result?.domainScores);
  const topTwo = badges.slice(0, 2);
  const riasecPhrase =
    topTwo.length >= 2
      ? `${topTwo[0].label} & ${topTwo[1].label}`
      : topTwo[0]?.label ?? "Interest";

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

  const onDownload = () => {
    setToastVisible(true);
    Alert.alert(
      "Blueprint Saved for Offline Use",
      "Accessible anytime from your Saved profile vault.",
    );
    setTimeout(() => setToastVisible(false), 2500);
  };

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.hero}>
        <View style={styles.heroShimmer} />
        <View style={styles.verifiedRow}>
          <View style={styles.verifiedPill}>
            <MaterialIcon name="verified" size={14} color={colors.text} />
            <Text style={styles.verifiedText}>Verified Assessment</Text>
          </View>
          <Text style={styles.alignedText}>SAQA / DHET Aligned</Text>
        </View>
        <Text style={styles.heroKicker}>{TITLES[key] ?? "Questionnaire"}</Text>
        <Text style={styles.heroTitle}>Your Personalized Career Blueprint</Text>
        <Text style={styles.heroSub}>Isiqondiso Semisebenzi Yakho</Text>
        <Text style={styles.heroBody}>
          Synthesized from your Holland RIASEC ({riasecPhrase}) inventory
          combined with field work preferences and national labour market demand
          data.
        </Text>

        <View style={styles.badgeRow}>
          {badges.slice(0, 2).map((badge) => (
            <View key={`${badge.label}-${badge.pct}`} style={styles.traitBadge}>
              <MaterialIcon name={badge.icon} size={15} color="#9EF4D0" />
              <Text style={styles.traitText}>
                {badge.label} {badge.pct}%
              </Text>
            </View>
          ))}
          <View style={styles.traitBadgeSoft}>
            <MaterialIcon name="handyman" size={15} color={colors.onPrimary} />
            <Text style={styles.traitTextSoft}>Technical & Applied</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.downloadCard} onPress={onDownload}>
        <View style={styles.downloadLeft}>
          <View style={styles.downloadIcon}>
            <MaterialIcon name="download" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.downloadTitle}>Download Offline Blueprint</Text>
            <Text style={styles.downloadMeta}>
              Official DHET PDF · Zero data rate · 1.4 MB
            </Text>
          </View>
        </View>
        <View style={styles.freePill}>
          <Text style={styles.freeText}>FREE</Text>
        </View>
      </Pressable>

      {toastVisible ? (
        <View style={styles.toast}>
          <MaterialIcon name="cloud_done" size={22} color="#9EF4D0" />
          <View style={{ flex: 1 }}>
            <Text style={styles.toastTitle}>Blueprint Saved for Offline Use</Text>
            <Text style={styles.toastBody}>
              Accessible anytime in your Saved Documents tab.
            </Text>
          </View>
        </View>
      ) : null}

      <MatchResultsList
        matches={result.matches}
        completedAt={result.completedAt}
        domainBadges={badges}
      />

      <PrimaryButton
        label="Retake questionnaire"
        variant="secondary"
        onPress={() => router.push(href(retakeHref))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    overflow: "hidden",
    ...shadows.card,
  },
  heroShimmer: {
    position: "absolute",
    right: -40,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(242,169,0,0.2)",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  alignedText: {
    ...typography.caption,
    color: "rgba(158,244,208,0.95)",
    fontWeight: "600",
  },
  heroKicker: {
    ...typography.labelMd,
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  heroTitle: {
    ...typography.headlineMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  heroSub: {
    ...typography.labelMd,
    color: "#9EF4D0",
    fontStyle: "italic",
  },
  heroBody: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.88)",
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  traitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  traitText: { ...typography.labelMd, color: "#9EF4D0", fontWeight: "700" },
  traitBadgeSoft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  traitTextSoft: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "600",
  },
  downloadCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    ...shadows.card,
  },
  downloadLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  downloadIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  downloadMeta: { ...typography.caption, color: colors.textSecondary },
  freePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  freeText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "800",
  },
  toast: {
    backgroundColor: "#263143",
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  toastTitle: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  toastBody: {
    ...typography.caption,
    color: "rgba(255,255,255,0.85)",
  },
});
