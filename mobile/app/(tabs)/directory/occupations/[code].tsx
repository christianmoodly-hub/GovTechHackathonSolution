import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, LoadingState } from "../../../../components/Screen";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import { KhethaBrandBar } from "../../../../components/KhethaBrandBar";
import { getOccupation } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Occupation } from "../../../../services/types";
import { HELPLINE } from "../../../../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  STITCH_CAMPUS_IMAGES,
  STITCH_DETAIL_HERO,
  occupationEducationHint,
  occupationMathHint,
  occupationSalaryHint,
  occupationTags,
  tagToneColors,
} from "../../../../utils/occupationPresentation";

export default function OccupationDetailScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksOpen, setTasksOpen] = useState(true);
  const [pathwaysOpen, setPathwaysOpen] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!code) {
        setError("Missing occupation code");
        setLoading(false);
        return;
      }
      try {
        const data = await getOccupation(String(code));
        if (!alive) return;
        if (!data) setError("Occupation not found");
        setOccupation(data);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load occupation");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const openQualification = async (url: string | null | undefined) => {
    if (!url) return;
    const id = await stableUrlId(url);
    router.push(href(`/directory/qualifications/${id}`));
  };

  const tags = occupation ? occupationTags(occupation.title) : [];

  return (
    <Screen>
      <KhethaBrandBar />

      <View style={styles.navRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to directory"
        >
          <MaterialIcon name="arrow_back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Careers Directory</Text>
        </Pressable>
        {occupation ? (
          <FavouriteToggle
            type="occupation"
            url={occupation.url}
            title={occupation.title}
            entityId={occupation.occupationCode}
            compact
          />
        ) : null}
      </View>

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {occupation ? (
        <View style={styles.block}>
          <View style={styles.hero}>
            <Image
              source={STITCH_DETAIL_HERO}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <MaterialIcon name="verified" size={14} color={colors.onPrimary} />
                <Text style={styles.heroBadgeText}>Official DHET Occupation</Text>
              </View>
              {tags.slice(0, 1).map((tag) => (
                <View key={tag.id} style={styles.heroBadgeLight}>
                  <Text style={styles.heroBadgeLightText}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.meta}>
            OFO: {occupation.occupationCode}
            {occupation.scrapedAt
              ? ` · Updated ${new Date(occupation.scrapedAt).toLocaleDateString()}`
              : ""}
          </Text>
          <Text style={styles.title}>{occupation.title}</Text>

          <View style={styles.tags}>
            {tags.map((tag) => {
              const tone = tagToneColors(tag.tone);
              return (
                <View
                  key={tag.id}
                  style={[
                    styles.tag,
                    { backgroundColor: tone.bg, borderColor: tone.border },
                  ]}
                >
                  <Text style={[styles.tagText, { color: tone.fg }]}>
                    {tag.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {occupation.alternativeTitles?.length ? (
            <Text style={styles.body}>
              Also known as: {occupation.alternativeTitles.slice(0, 6).join(" · ")}
            </Text>
          ) : (
            <Text style={styles.body}>
              Government-vetted pathway from the National Career Advice Portal.
            </Text>
          )}

          <Text style={styles.sectionHeading}>Key Indicators at a Glance</Text>
          <View style={styles.grid}>
            <View style={styles.gridCard}>
              <MaterialIcon name="payments" size={20} color={colors.primary} />
              <Text style={styles.gridLabel}>Estimated Salary</Text>
              <Text style={styles.gridValue}>
                {occupationSalaryHint(occupation.title)}
              </Text>
              <Text style={styles.gridHint}>Entry guidance · regional variance</Text>
            </View>
            <View style={styles.gridCard}>
              <MaterialIcon name="trending_up" size={20} color={colors.ochre} />
              <Text style={styles.gridLabel}>Job Demand Outlook</Text>
              <Text style={styles.gridValue}>
                {tags.some((t) => t.id === "demand")
                  ? "Elevated demand"
                  : "Check DHET lists"}
              </Text>
              <Text style={styles.gridHint}>National skills priority cues</Text>
            </View>
            <View style={styles.gridCard}>
              <MaterialIcon name="school" size={20} color={colors.secondary} />
              <Text style={styles.gridLabel}>Minimum Entry</Text>
              <Text style={styles.gridValue}>
                {occupation.entryRequirements?.[0]?.slice(0, 42) ||
                  occupationEducationHint(occupation.title)}
                {occupation.entryRequirements?.[0] &&
                occupation.entryRequirements[0].length > 42
                  ? "…"
                  : ""}
              </Text>
              <Text style={styles.gridHint}>NSC / TVET / diploma routes</Text>
            </View>
            <View style={styles.gridCard}>
              <MaterialIcon name="calculate" size={20} color={colors.textSecondary} />
              <Text style={styles.gridLabel}>Math Benchmark</Text>
              <Text style={styles.gridValue}>
                {occupationMathHint(occupation.title)}
              </Text>
              <Text style={styles.gridHint}>
                {occupation.qualifications?.length ?? 0} linked qualifications
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.accordionHeader}
            onPress={() => setTasksOpen((v) => !v)}
          >
            <View style={styles.accordionLeft}>
              <MaterialIcon
                name="assignment_turned_in"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.accordionTitle}>Core Daily Tasks</Text>
            </View>
            <MaterialIcon
              name="expand_more"
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
          {tasksOpen ? (
            <View style={styles.section}>
              {(occupation.tasks?.length
                ? occupation.tasks
                : ["No tasks listed on this NCAP record."]
              ).map((task) => (
                <View key={task} style={styles.taskRow}>
                  <MaterialIcon name="check_circle" size={16} color={colors.success} />
                  <Text style={styles.bullet}>{task}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <Pressable
            style={styles.accordionHeader}
            onPress={() => setPathwaysOpen((v) => !v)}
          >
            <View style={styles.accordionLeft}>
              <MaterialIcon name="school" size={20} color={colors.primary} />
              <Text style={styles.accordionTitle}>Educational Pathways</Text>
            </View>
            <View style={styles.placesPill}>
              <Text style={styles.placesText}>
                {occupation.qualifications?.length ?? 0} linked
              </Text>
            </View>
          </Pressable>
          {pathwaysOpen ? (
            <View style={styles.section}>
              {(occupation.qualifications?.length
                ? occupation.qualifications
                : [{ title: "No linked qualifications on this record.", url: null }]
              ).map((qual, index) =>
                qual.url ? (
                  <Pressable
                    key={`${qual.title}-${index}`}
                    style={styles.pathwayRow}
                    onPress={() => void openQualification(qual.url)}
                  >
                    <Text style={styles.link}>{qual.title}</Text>
                    <MaterialIcon
                      name="chevron_right"
                      size={18}
                      color={colors.primary}
                    />
                  </Pressable>
                ) : (
                  <Text key={`${qual.title}-${index}`} style={styles.bullet}>
                    {qual.title}
                  </Text>
                ),
              )}
            </View>
          ) : null}

          {occupation.entryRequirements?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Entry notes</Text>
              {occupation.entryRequirements.slice(0, 8).map((item) => (
                <Text key={item} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}

          <Pressable
            style={styles.whereCard}
            onPress={() => router.push(href("/directory/providers"))}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.whereTitle}>Where to Study</Text>
              <Text style={styles.whereBody}>
                Public TVET Colleges, UoTs & accredited providers
              </Text>
            </View>
            <View style={styles.placesPill}>
              <Text style={styles.placesText}>Browse</Text>
            </View>
            <MaterialIcon name="arrow_forward" size={20} color={colors.primary} />
          </Pressable>

          <View style={styles.campusHeader}>
            <Text style={styles.sectionHeading}>Top Verified Campuses</Text>
            <Pressable onPress={() => router.push(href("/directory/providers"))}>
              <Text style={styles.viewMore}>View more</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.campusRow}
          >
            {[
              { name: "Ekurhuleni East TVET", place: "Gauteng", img: STITCH_CAMPUS_IMAGES[0] },
              { name: "False Bay TVET", place: "Western Cape", img: STITCH_CAMPUS_IMAGES[1] },
            ].map((campus) => (
              <Pressable
                key={campus.name}
                style={styles.campusCard}
                onPress={() => router.push(href("/directory/providers"))}
              >
                <Image source={campus.img} style={styles.campusImg} resizeMode="cover" />
                <View style={styles.campusBody}>
                  <Text style={styles.campusPlace}>{campus.place}</Text>
                  <Text style={styles.campusName}>{campus.name}</Text>
                  <View style={styles.campusReady}>
                    <MaterialIcon name="check_circle" size={14} color={colors.success} />
                    <Text style={styles.campusReadyText}>Accredited provider</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.ctaBar}>
            <Text style={styles.ctaText}>
              Need Guidance? Speak to a certified Khetha Career Advisor
            </Text>
            <Pressable
              style={styles.callFree}
              onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
            >
              <Text style={styles.callFreeText}>Call Free</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  backText: { ...typography.labelLg, color: colors.primary },
  error: { color: colors.error },
  block: { gap: spacing.md },
  hero: {
    height: 180,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  heroImage: { width: "100%", height: "100%" },
  heroBadges: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeText: { ...typography.caption, color: colors.onPrimary, fontWeight: "700" },
  heroBadgeLight: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeLightText: { ...typography.caption, color: colors.primary, fontWeight: "700" },
  meta: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.headlineLg, color: colors.text },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  body: { ...typography.bodySm, color: colors.textSecondary },
  sectionHeading: { ...typography.headlineSm, color: colors.text, marginTop: spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gridCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
  },
  gridLabel: { ...typography.caption, color: colors.textMuted },
  gridValue: { ...typography.labelLg, color: colors.text },
  gridHint: { ...typography.caption, color: colors.textSecondary },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  accordionLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  accordionTitle: { ...typography.headlineSm, color: colors.text },
  placesPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  placesText: { ...typography.caption, color: colors.primary, fontWeight: "700" },
  section: {
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: -4,
  },
  sectionTitle: { ...typography.headlineSm, color: colors.primary },
  taskRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  bullet: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  pathwayRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingVertical: 4,
  },
  link: { ...typography.bodySm, color: colors.primary, fontWeight: "600", flex: 1 },
  whereCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  whereTitle: { ...typography.labelLg, color: colors.text },
  whereBody: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  campusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewMore: { ...typography.labelMd, color: colors.primary },
  campusRow: { gap: spacing.md },
  campusCard: {
    width: 220,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.card,
  },
  campusImg: { width: "100%", height: 100 },
  campusBody: { padding: spacing.md, gap: 4 },
  campusPlace: { ...typography.caption, color: colors.secondary, fontWeight: "700" },
  campusName: { ...typography.labelLg, color: colors.text },
  campusReady: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  campusReadyText: { ...typography.caption, color: colors.success },
  ctaBar: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  ctaText: { ...typography.labelMd, color: colors.onPrimary, flex: 1 },
  callFree: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  callFreeText: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
});
