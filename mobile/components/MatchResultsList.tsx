import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcon } from "./MaterialIcon";
import type { QuestionnaireMatch } from "../services/types";
import { HELPLINE } from "../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";
import {
  STITCH_RESULT_IMAGES,
  fitLabel,
  matchPercent,
  occupationEducationHint,
  occupationSalaryHint,
  occupationTags,
  tagToneColors,
} from "../utils/occupationPresentation";

type Props = {
  matches: QuestionnaireMatch[];
  completedAt?: string;
};

export function MatchResultsList({ matches, completedAt }: Props) {
  const router = useRouter();
  const maxScore = matches.reduce((m, item) => Math.max(m, item.score), 0);

  if (!matches.length) {
    return (
      <Text style={styles.empty}>
        No strong occupation matches yet. Try different answers for a broader set.
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <MaterialIcon name="stars" size={20} color={colors.goldHover} />
          <Text style={styles.sectionTitle}>Top Career Recommendations</Text>
        </View>
        <Text style={styles.matchCount}>{matches.length} Matches</Text>
      </View>
      <Text style={styles.sectionSub}>
        Ranked by interest fit & national labour demand signals
        {completedAt
          ? ` · Saved ${new Date(completedAt).toLocaleDateString()}`
          : ""}
      </Text>

      {matches.slice(0, 8).map((item, index) => {
        const pct = matchPercent(item.score, maxScore);
        const tags = occupationTags(item.title);
        const photo = STITCH_RESULT_IMAGES[index % STITCH_RESULT_IMAGES.length];
        const primary = index === 0;
        return (
          <View key={item.occupationCode} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.fitLabel}>{fitLabel(index)}</Text>
              <View style={styles.matchPill}>
                <MaterialIcon name="thumb_up" size={14} color={colors.success} />
                <Text style={styles.matchPct}>{pct}% Match</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.code}>OFO {item.occupationCode}</Text>

            <View style={styles.photoWrap}>
              <Image source={photo} style={styles.photo} resizeMode="cover" />
              <View style={styles.photoBadges}>
                {tags.slice(0, 2).map((tag) => {
                  const tone = tagToneColors(tag.tone);
                  return (
                    <View
                      key={tag.id}
                      style={[styles.photoBadge, { backgroundColor: tone.bg }]}
                    >
                      <Text style={[styles.photoBadgeText, { color: tone.fg }]}>
                        {tag.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.detailRow}>
              <MaterialIcon name="payments" size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {occupationSalaryHint(item.title).replace("/pm", "/yr estimate")}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialIcon name="school" size={16} color={colors.secondary} />
              <Text style={styles.detailText}>
                {occupationEducationHint(item.title)}
              </Text>
            </View>

            <Pressable
              style={[styles.pathwayBtn, !primary && styles.pathwayBtnAlt]}
              onPress={() =>
                router.push(href(`/directory/occupations/${item.occupationCode}`))
              }
            >
              <Text
                style={[styles.pathwayText, !primary && styles.pathwayTextAlt]}
              >
                View Pathway & TVET Colleges
              </Text>
              <MaterialIcon
                name="arrow_forward"
                size={18}
                color={primary ? colors.onPrimary : colors.primary}
              />
            </Pressable>
          </View>
        );
      })}

      <View style={styles.nextActions}>
        <Pressable
          style={[styles.nextCard, { backgroundColor: "#FFF4E5" }]}
          onPress={() => router.push(href("/helpline"))}
        >
          <MaterialIcon name="school" size={22} color={colors.ochre} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nextTitle}>Check NSFAS & Bursary Eligibility</Text>
            <Text style={styles.nextMeta}>RECOMMENDED</Text>
          </View>
          <MaterialIcon name="chevron_right" size={20} color={colors.ochre} />
        </Pressable>
        <Pressable
          style={[styles.nextCard, { backgroundColor: colors.primaryMuted }]}
          onPress={() => router.push(href("/directory/providers"))}
        >
          <MaterialIcon name="location_on" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nextTitle}>Find Accredited Institutions</Text>
            <Text style={styles.nextMeta}>Providers directory</Text>
          </View>
          <MaterialIcon name="chevron_right" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>
          Need help making sense of your options?
        </Text>
        <Text style={styles.helpBody}>
          Speak to a dedicated Khetha Career Advisor — free DHET helpline.
        </Text>
        <Pressable
          style={styles.callBtn}
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        >
          <MaterialIcon name="call" size={18} color={colors.onPrimary} />
          <Text style={styles.callText}>
            Toll-free: {HELPLINE.tollFreeDisplay}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  empty: { ...typography.bodyMd, color: colors.textSecondary },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  sectionTitle: { ...typography.headlineSm, color: colors.text, flexShrink: 1 },
  matchCount: { ...typography.labelMd, color: colors.primary },
  sectionSub: { ...typography.bodySm, color: colors.textMuted, marginTop: -4 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fitLabel: {
    ...typography.labelMd,
    color: colors.goldHover,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  matchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  matchPct: { ...typography.labelMd, color: colors.success },
  title: { ...typography.headlineSm, color: colors.text },
  code: { ...typography.caption, color: colors.textMuted },
  photoWrap: {
    height: 140,
    borderRadius: radii.lg,
    overflow: "hidden",
    marginVertical: spacing.xs,
  },
  photo: { width: "100%", height: "100%" },
  photoBadges: {
    position: "absolute",
    left: 8,
    bottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  photoBadge: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoBadgeText: { ...typography.caption, fontWeight: "700" },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  pathwayBtn: {
    marginTop: spacing.sm,
    minHeight: 44,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pathwayBtnAlt: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  pathwayText: { ...typography.labelLg, color: colors.onPrimary },
  pathwayTextAlt: { color: colors.primary },
  nextActions: { gap: spacing.sm, marginTop: spacing.sm },
  nextCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  nextTitle: { ...typography.labelLg, color: colors.text },
  nextMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  helpCard: {
    backgroundColor: "#E8F5F0",
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  helpTitle: { ...typography.headlineSm, color: colors.text },
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  callBtn: {
    minHeight: 48,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  callText: { ...typography.labelLg, color: colors.onPrimary },
});
