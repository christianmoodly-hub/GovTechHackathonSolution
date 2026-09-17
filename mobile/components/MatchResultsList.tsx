import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcon } from "./MaterialIcon";
import { FavouriteToggle } from "./FavouriteToggle";
import type { QuestionnaireMatch } from "../services/types";
import { HELPLINE } from "../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../theme";
import { href } from "../utils/href";
import {
  STITCH_RESULT_IMAGES,
  fitLabel,
  matchAccent,
  matchPercent,
  occupationEducationHint,
  occupationPathwayCta,
  occupationSalaryYearlyHint,
  occupationSectorOverlay,
  occupationTags,
  riasecCodeFromBadges,
  tagToneColors,
} from "../utils/occupationPresentation";

type Props = {
  matches: QuestionnaireMatch[];
  completedAt?: string;
  domainBadges?: { label: string; pct: number; icon: string }[];
};

export function MatchResultsList({
  matches,
  completedAt,
  domainBadges = [],
}: Props) {
  const router = useRouter();
  const maxScore = matches.reduce((m, item) => Math.max(m, item.score), 0);
  const shown = matches.slice(0, 8);
  const riasec = riasecCodeFromBadges(domainBadges);

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
        <View style={{ flex: 1 }}>
          <View style={styles.headerLeft}>
            <MaterialIcon name="stars" size={20} color={colors.ochre} />
            <Text style={styles.sectionTitle}>Top Career Recommendations</Text>
          </View>
          <Text style={styles.sectionSub}>
            Ranked by RIASEC fit & national gazetted demand
            {completedAt
              ? ` · Saved ${new Date(completedAt).toLocaleDateString()}`
              : ""}
          </Text>
        </View>
        <Text style={styles.matchCount}>{shown.length} Matches</Text>
      </View>

      {shown.map((item, index) => {
        const pct = matchPercent(item.score, maxScore);
        const tags = occupationTags(item.title);
        const photo = STITCH_RESULT_IMAGES[index % STITCH_RESULT_IMAGES.length];
        const accent = matchAccent(index);
        const overlay = occupationSectorOverlay(item.title);
        const cta = occupationPathwayCta(item.title);
        const primary = index === 0;
        const occupationUrl = `ncap://occupation/${item.occupationCode}`;

        return (
          <View key={item.occupationCode} style={styles.card}>
            <View style={[styles.accentBar, { backgroundColor: accent }]} />

            <View style={styles.cardTop}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <View style={styles.fitRow}>
                  <View style={[styles.fitDot, { backgroundColor: accent }]} />
                  <Text style={[styles.fitLabel, { color: accent }]}>
                    {fitLabel(index)}
                  </Text>
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <View style={styles.scoreCol}>
                <View style={styles.matchPill}>
                  <MaterialIcon name="thumb_up" size={14} color={accent} />
                  <Text style={styles.matchPct}>{pct}% Match</Text>
                </View>
                <Text style={styles.riasec}>RIASEC: {riasec}</Text>
              </View>
            </View>

            <View style={styles.photoWrap}>
              <Image source={photo} style={styles.photo} resizeMode="cover" />
              <View style={styles.photoGradient} />
              <View style={styles.photoOverlays}>
                <View style={styles.sectorRow}>
                  <MaterialIcon
                    name={overlay.icon}
                    size={14}
                    color={colors.onPrimary}
                  />
                  <Text style={styles.sectorText}>{overlay.label}</Text>
                </View>
                <View
                  style={[
                    styles.gazettedPill,
                    index === 1 && styles.gazettedOchre,
                  ]}
                >
                  <Text
                    style={[
                      styles.gazettedText,
                      index === 1 && styles.gazettedTextOchre,
                    ]}
                  >
                    {overlay.badge}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tagRow}>
              {tags.slice(0, 3).map((tag) => {
                const tone = tagToneColors(tag.tone);
                return (
                  <View
                    key={tag.id}
                    style={[styles.tag, { backgroundColor: tone.bg }]}
                  >
                    {tag.id === "demand" ? (
                      <MaterialIcon
                        name="trending_up"
                        size={12}
                        color={tone.fg}
                      />
                    ) : null}
                    <Text style={[styles.tagText, { color: tone.fg }]}>
                      {tag.label}
                    </Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.metrics}>
              <View style={styles.metricRow}>
                <View style={styles.metricLabel}>
                  <MaterialIcon name="payments" size={16} color={colors.ochre} />
                  <Text style={styles.metricLabelText}>
                    Estimated Entry–Mid Salary
                  </Text>
                </View>
                <Text style={styles.metricValue}>
                  {occupationSalaryYearlyHint(item.title)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricLabel}>
                  <MaterialIcon name="school" size={16} color={colors.primary} />
                  <Text style={styles.metricLabelText}>Min Requirements</Text>
                </View>
                <Text style={styles.metricReq}>
                  {occupationEducationHint(item.title)}
                </Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={[styles.pathwayBtn, !primary && styles.pathwayBtnAlt]}
                onPress={() =>
                  router.push(
                    href(`/directory/occupations/${item.occupationCode}`),
                  )
                }
              >
                <Text
                  style={[
                    styles.pathwayText,
                    !primary && styles.pathwayTextAlt,
                  ]}
                  numberOfLines={1}
                >
                  {cta}
                </Text>
                <MaterialIcon
                  name={primary ? "arrow_forward" : "chevron_right"}
                  size={18}
                  color={primary ? colors.onPrimary : colors.primary}
                />
              </Pressable>
              <FavouriteToggle
                compact
                type="occupation"
                url={occupationUrl}
                title={item.title}
                entityId={item.occupationCode}
              />
            </View>
          </View>
        );
      })}

      <Text style={styles.nextHeading}>Direct Next Actions</Text>

      <Pressable
        style={styles.nextCard}
        onPress={() => router.push(href("/helpline"))}
      >
        <View style={[styles.nextIcon, { backgroundColor: "#FFF4E5" }]}>
          <MaterialIcon name="account_balance" size={28} color={colors.ochre} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.nextTitleRow}>
            <Text style={styles.nextTitle}>Check NSFAS & Bursary Eligibility</Text>
            <View style={styles.govPill}>
              <Text style={styles.govText}>Government</Text>
            </View>
          </View>
          <Text style={styles.nextBody}>
            Free full-cost tuition & living allowance for households with
            combined income under R350,000 p.a.
          </Text>
          <View style={styles.nextLink}>
            <Text style={styles.nextLinkText}>Check My Status Now</Text>
            <MaterialIcon
              name="arrow_forward"
              size={16}
              color={colors.primary}
            />
          </View>
        </View>
      </Pressable>

      <Pressable
        style={styles.nextCard}
        onPress={() => router.push(href("/directory/providers"))}
      >
        <View style={[styles.nextIcon, { backgroundColor: colors.primaryMuted }]}>
          <MaterialIcon name="location_on" size={28} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.nextTitle}>Find Nearest Accredited Institutions</Text>
          <Text style={styles.nextBody}>
            Locate 50 Public TVET colleges and 26 Universities across all 9
            Provinces offering these exact pathways.
          </Text>
          <View style={styles.nextLink}>
            <Text style={styles.nextLinkText}>Search by Province & Field</Text>
            <MaterialIcon
              name="travel_explore"
              size={16}
              color={colors.primary}
            />
          </View>
        </View>
      </Pressable>

      <View style={styles.helpCard}>
        <View style={styles.helpTop}>
          <View style={styles.helpAvatar}>
            <MaterialIcon
              name="support_agent"
              size={22}
              color={colors.onPrimary}
            />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.helpTitle}>
              Need help making sense of your options?
            </Text>
            <Text style={styles.helpBody}>
              Speak to a dedicated Khetha Career Adviser free of charge. No
              airtime needed for toll-free line.
            </Text>
            <View style={styles.helpActions}>
              <Pressable
                style={styles.callBtn}
                onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
              >
                <MaterialIcon name="call" size={16} color={colors.onPrimary} />
                <Text style={styles.callText}>
                  Toll-Free: {HELPLINE.tollFreeDisplay}
                </Text>
              </Pressable>
              <Pressable
                style={styles.waBtn}
                onPress={() =>
                  void Linking.openURL(
                    `https://wa.me/27${HELPLINE.whatsapp.slice(1)}`,
                  )
                }
              >
                <MaterialIcon name="chat" size={16} color={colors.success} />
                <Text style={styles.waText}>
                  WhatsApp: {HELPLINE.whatsappDisplay}
                </Text>
              </Pressable>
            </View>
            <View style={styles.hoursRow}>
              <MaterialIcon name="schedule" size={14} color={colors.textSecondary} />
              <Text style={styles.hoursText}>{HELPLINE.hours} (SAST)</Text>
            </View>
          </View>
        </View>
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
    alignItems: "flex-start",
    gap: spacing.md,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { ...typography.headlineSm, color: colors.text, fontWeight: "800" },
  matchCount: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  sectionSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    paddingLeft: spacing.lg + 6,
    gap: spacing.sm,
    overflow: "hidden",
    ...shadows.card,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  fitRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  fitDot: { width: 6, height: 6, borderRadius: 3 },
  fitLabel: {
    ...typography.caption,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreCol: { alignItems: "flex-end", gap: 2 },
  matchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchPct: { ...typography.labelMd, color: colors.success, fontWeight: "800" },
  riasec: { ...typography.caption, color: colors.textSecondary },
  title: { ...typography.headlineSm, color: colors.text, fontWeight: "800", marginTop: 2 },
  photoWrap: {
    height: 112,
    borderRadius: radii.md,
    overflow: "hidden",
    marginTop: 4,
    backgroundColor: colors.muted,
  },
  photo: { width: "100%", height: "100%" },
  photoGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.35)",
  },
  photoOverlays: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  sectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  sectorText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "700",
    flexShrink: 1,
  },
  gazettedPill: {
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gazettedOchre: { backgroundColor: "#FFDEA8" },
  gazettedText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
  },
  gazettedTextOchre: { color: "#5C4000" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  metrics: {
    backgroundColor: colors.canvas,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  metricLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    maxWidth: "48%",
  },
  metricLabelText: { ...typography.caption, color: colors.textSecondary },
  metricValue: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "800",
    textAlign: "right",
    flex: 1,
  },
  metricReq: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  pathwayBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  pathwayBtnAlt: {
    backgroundColor: colors.canvas,
  },
  pathwayText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
    flexShrink: 1,
  },
  pathwayTextAlt: { color: colors.primary },
  nextHeading: {
    ...typography.headlineSm,
    color: colors.text,
    fontWeight: "800",
    marginTop: spacing.sm,
  },
  nextCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    ...shadows.card,
  },
  nextIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  nextTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  nextTitle: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  govPill: {
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  govText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
  },
  nextBody: { ...typography.bodySm, color: colors.textSecondary },
  nextLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  nextLinkText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  helpCard: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  helpTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  helpAvatar: {
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
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  helpActions: { gap: 8, marginTop: 8 },
  callBtn: {
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  callText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  waBtn: {
    minHeight: 44,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  waText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: "800",
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  hoursText: { ...typography.caption, color: colors.textSecondary },
});
