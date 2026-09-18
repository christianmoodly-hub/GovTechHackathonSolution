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
import { useLocale } from "../../../../contexts/LocaleContext";
import { useVaultStats } from "../../../../hooks/useVaultStats";
import { downloadOfflineBlueprint } from "../../../../services/offlineBlueprint";
import type { QuestionnaireId } from "../../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import { domainBadges } from "../../../../utils/occupationPresentation";

export default function QuestionnaireResultsScreen() {
  const router = useRouter();
  const { questionnaireId } = useLocalSearchParams<{ questionnaireId: string }>();
  const { user, profile } = useAuth();
  const { strings, tabs, common } = useLocale();
  const chrome = strings.questionnaires.chrome;
  const decisions = strings.questionnaires.decisions;
  const aps = strings.questionnaires.aps;
  const saved = strings.saved;
  const vault = useVaultStats();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    `${saved.blueprintSavedTitle}. ${saved.blueprintSavedBody}`,
  );
  const [downloading, setDownloading] = useState(false);

  const key = questionnaireId as QuestionnaireId;
  const result = profile?.questionnaireResults?.[key];
  const badges = domainBadges(result?.domainScores);
  const topTwo = badges.slice(0, 2);
  const riasecPhrase =
    topTwo.length >= 2
      ? `${topTwo[0].label} & ${topTwo[1].label}`
      : topTwo[0]?.label ?? saved.tradesWorkplaceFit;
  const savedAps = result?.answers?.apsTotal;
  const savedApsBand = result?.answers?.apsBand;

  const displayName =
    profile?.demographics?.fullName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    saved.guestExplorer;

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
          title={saved.noDiagnosticsTitle}
          body={saved.noDiagnosticsBody}
        />
        <PrimaryButton
          label={chrome.start}
          onPress={() => router.replace(href(retakeHref))}
        />
      </Screen>
    );
  }

  const onDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadOfflineBlueprint({
        questionnaireId: key,
        result,
        displayName,
      });
      setToastMessage(
        `${saved.blueprintSavedTitle}. ${saved.noBlueprintsBody}`,
      );
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3600);
    } catch (err) {
      Alert.alert(
        common.errorGeneric,
        err instanceof Error ? err.message : saved.couldNotOpenBlueprint,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.careersCached}
        fromCache
        rightLabel={tabs.decisions}
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.hero}>
        <View style={styles.heroShimmer} />
        <View style={styles.verifiedRow}>
          <View style={styles.verifiedPill}>
            <MaterialIcon name="verified" size={14} color={colors.text} />
            <Text style={styles.verifiedText}>{saved.verified}</Text>
          </View>
          <Text style={styles.alignedText}>{saved.dhetSaqaAccredited}</Text>
        </View>
        <Text style={styles.heroTitle}>{saved.exportTitle}</Text>
        <Text style={styles.heroSub}>{decisions.subtitle}</Text>
        <Text style={styles.heroBody}>
          {saved.hollandProfiler}{" "}
          <Text style={styles.heroStrong}>
            ({riasecPhrase})
          </Text>
          {" · "}
          {saved.exportBody}
        </Text>

        <View style={styles.badgeRow}>
          {(badges.length
            ? badges.slice(0, 2)
            : [
                { label: "Realistic", pct: 88, icon: "build" },
                { label: "Investigative", pct: 76, icon: "biotech" },
              ]
          ).map((badge) => (
            <View key={`${badge.label}-${badge.pct}`} style={styles.traitBadge}>
              <MaterialIcon
                name={badge.icon || "build"}
                size={15}
                color="#9EF4D0"
              />
              <Text style={styles.traitText}>
                {badge.label} {badge.pct}%
              </Text>
            </View>
          ))}
          <View style={styles.traitBadgeSoft}>
            <MaterialIcon name="handyman" size={15} color={colors.onPrimary} />
            <Text style={styles.traitTextSoft}>{saved.tradesWorkplaceFit}</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.downloadCard, downloading && styles.downloadCardBusy]}
        onPress={() => void onDownload()}
        disabled={downloading}
        accessibilityRole="button"
        accessibilityLabel={saved.offlineBlueprints}
      >
        <View style={styles.downloadLeft}>
          <View style={styles.downloadIcon}>
            <MaterialIcon
              name={downloading ? "pending" : "download"}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.downloadTitle}>
              {downloading
                ? common.loading
                : saved.offlineBlueprints}
            </Text>
            <Text style={styles.downloadMeta}>
              {saved.zeroRatedData}
            </Text>
          </View>
        </View>
        <View style={styles.freePill}>
          <Text style={styles.freeText}>FREE</Text>
        </View>
      </Pressable>

      {key === "subjectChooser" ? (
        <Pressable
          style={styles.downloadCard}
          onPress={() => router.push(href("/questionnaires/aps-calculator"))}
          accessibilityRole="button"
          accessibilityLabel={aps.title}
        >
          <View style={styles.downloadLeft}>
            <View style={styles.downloadIcon}>
              <MaterialIcon name="calculate" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.downloadTitle}>
                {savedAps
                  ? `${aps.totalLabel} ${savedAps}`
                  : aps.title}
              </Text>
              <Text style={styles.downloadMeta}>
                {savedApsBand
                  ? `${aps.bandLabel} ${savedApsBand}+`
                  : aps.subtitle}
              </Text>
            </View>
          </View>
          <MaterialIcon
            name="chevron_right"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
      ) : null}

      <MatchResultsList
        matches={result.matches}
        completedAt={result.completedAt}
        domainBadges={badges}
      />

      {toastVisible ? (
        <View style={styles.toast}>
          <MaterialIcon name="cloud_done" size={22} color="#9EF4D0" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.toastTitle}>{saved.blueprintSavedTitle}</Text>
            <Text style={styles.toastBody}>{toastMessage}</Text>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#006A4E",
    borderRadius: radii.xl,
    padding: spacing.lg,
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
    backgroundColor: "rgba(242,169,0,0.18)",
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
    color: "#92E7C3",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
    color: colors.onPrimary,
    letterSpacing: -0.3,
  },
  heroSub: {
    ...typography.labelMd,
    color: "#9EF4D0",
    fontStyle: "italic",
    marginTop: -2,
  },
  heroBody: {
    ...typography.bodySm,
    color: "#DEE8FF",
  },
  heroStrong: {
    fontWeight: "700",
    color: colors.onPrimary,
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  traitBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#08503C",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  traitText: { ...typography.labelMd, color: "#9EF4D0", fontWeight: "700" },
  traitBadgeSoft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
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
  downloadCardBusy: { opacity: 0.7 },
  downloadLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  downloadIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
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
