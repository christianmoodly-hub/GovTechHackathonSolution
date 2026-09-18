import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, LoadingState } from "../../../../components/Screen";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../../components/KhethaBrandBar";
import { getOccupation } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Occupation } from "../../../../services/types";
import { HELPLINE } from "../../../../data/staticContent";
import { useVaultStats } from "../../../../hooks/useVaultStats";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  STITCH_CAMPUS_IMAGES,
  STITCH_DETAIL_HERO,
  occupationEducationHint,
  occupationMathHint,
  occupationSalaryYearlyHint,
  occupationTags,
  tagToneColors,
} from "../../../../utils/occupationPresentation";

type AccordionId = "tasks" | "pathways" | "funding";

const DEFAULT_TASKS = [
  {
    icon: "solar_power",
    title: "Structural Roof Mounting",
    body: "Securely mounting and orienting photovoltaic modules on tile, corrugated, and IBR roofs in compliance with national safety and wind-load codes.",
  },
  {
    icon: "electrical_services",
    title: "Wiring & Inverter Integration (SANS 10142)",
    body: "Connecting DC combiner boxes, surge protection, lithium-ion battery banks, and hybrid inverters according to SANS 10142-1 regulations.",
  },
  {
    icon: "speed",
    title: "Circuit Verification & Commissioning",
    body: "Conducting open circuit voltage (Voc), short-circuit current (Isc) tests, earth leakage checks, and system efficiency sign-offs with registered Master Electricians.",
  },
];

const PATHWAYS = [
  {
    id: "a",
    eyebrow: "PATHWAY A · ARTISAN RED SEAL",
    badge: "Fastest to Employment",
    badgeTone: "gold" as const,
    title: "TVET College NATED N1–N6 + Trade Test",
    body: "Enroll at a public TVET college in Electrical Engineering (Light/Heavy Current). Complete institutional theory followed by 18–24 months of documented workplace experience at an accredited contractor to sit for the National Trade Test.",
  },
  {
    id: "b",
    eyebrow: "PATHWAY B · DIPLOMA",
    badge: "3 Years (University of Tech)",
    badgeTone: "blue" as const,
    title: "Diploma in Renewable Energy Technologies",
    body: "Full-time national diploma offered by Universities of Technology (DUT, CPUT, TUT, VUT). Focuses on power electronics, mini-grids, and commercial solar design.",
  },
  {
    id: "c",
    eyebrow: "PATHWAY C · LEARNERSHIP",
    badge: "Earn while learning",
    badgeTone: "green" as const,
    title: "EWSETA Solar PV Service Technician Apprenticeship",
    body: "Sponsored workplace training with stipends through the Energy & Water SETA. Includes SAPVIA PV GreenCard assessment certification.",
  },
];

const FUNDING = [
  {
    icon: "verified_user",
    title: "NSFAS TVET College Bursary Scheme",
    body: "Qualifying South African citizens with household income under R350,000/year receive 100% free tuition, personal care allowances, transport, and accommodation support for NATED engineering courses.",
  },
  {
    icon: "handshake",
    title: "EWSETA & Chieta Discretionary Grants",
    body: "Sector Education & Training Authorities disburse annual grants for apprentice stipends and toolsets for accredited green skills apprenticeships.",
  },
];

const CAMPUSES = [
  {
    province: "Gauteng",
    name: "Ekurhuleni East TVET",
    campus: "Sam Nzima Campus",
    ready: "PV GreenCard Ready",
    img: STITCH_CAMPUS_IMAGES[0],
  },
  {
    province: "Western Cape",
    name: "False Bay TVET College",
    campus: "Westlake Campus",
    ready: "Center of Specialisation",
    img: STITCH_CAMPUS_IMAGES[1],
  },
];

function badgeTone(tone: "gold" | "blue" | "green") {
  if (tone === "gold") return { bg: "#FFF4E5", fg: colors.ochre };
  if (tone === "blue") return { bg: colors.secondarySubtle, fg: colors.secondary };
  return { bg: colors.primaryMuted, fg: colors.success };
}

function buildDescription(occupation: Occupation): string {
  if (occupation.alternativeTitles?.length) {
    return `Also known as ${occupation.alternativeTitles.slice(0, 4).join(", ")}. ${
      occupation.tasks?.[0]
        ? occupation.tasks[0]
        : "Government-vetted pathway from the National Career Advice Portal aligned to national skills priorities."
    }`;
  }
  const t = occupation.title.toLowerCase();
  if (/solar|pv/.test(t)) {
    return "Installs, tests, maintains, and repairs solar photovoltaic systems, smart inverters, and battery storage solutions across residential, agricultural, and commercial sites to address national energy transition goals.";
  }
  return "Government-vetted pathway from the National Career Advice Portal. Review linked qualifications, entry notes, and accredited providers to plan your next step.";
}

export default function OccupationDetailScreen() {
  const router = useRouter();
  const vault = useVaultStats();
  const { code } = useLocalSearchParams<{ code: string }>();
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Record<AccordionId, boolean>>({
    tasks: true,
    pathways: false,
    funding: false,
  });
  const [toast, setToast] = useState(false);

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

  const tags = useMemo(
    () => (occupation ? occupationTags(occupation.title) : []),
    [occupation],
  );

  const taskItems = useMemo(() => {
    if (!occupation?.tasks?.length) return DEFAULT_TASKS;
    const icons = ["solar_power", "electrical_services", "speed", "build", "engineering"];
    return occupation.tasks.slice(0, 5).map((task, i) => {
      const parts = task.split(/[:.–-]/);
      const title =
        parts[0] && parts[0].length < 48 && parts.length > 1
          ? parts[0].trim()
          : `Core responsibility ${i + 1}`;
      const body =
        parts.length > 1 ? task.slice(parts[0].length).replace(/^[:.–-\s]+/, "") : task;
      return { icon: icons[i % icons.length], title, body: body || task };
    });
  }, [occupation]);

  const openQualification = async (url: string | null | undefined) => {
    if (!url) return;
    const id = await stableUrlId(url);
    router.push(href(`/directory/qualifications/${id}`));
  };

  const toggle = (id: AccordionId) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const onShare = async () => {
    if (!occupation) return;
    try {
      await Share.share({
        message: `${occupation.title} (OFO ${occupation.occupationCode}) — Khetha NCAP`,
        title: occupation.title,
      });
    } catch {
      // ignore cancel
    }
  };

  const showSavedToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2400);
  };

  const providerCount = Math.max(occupation?.qualifications?.length ?? 0, 12);

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.careersCached}
        fromCache
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.navRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to directory"
        >
          <MaterialIcon name="arrow_back_ios" size={18} color={colors.primary} />
          <Text style={styles.backText}>Careers Directory</Text>
        </Pressable>
        <View style={styles.navActions}>
          <View style={styles.langPill}>
            <MaterialIcon name="translate" size={14} color={colors.textSecondary} />
            <Text style={styles.langText}>ENG</Text>
          </View>
          <MaterialIcon name="offline_pin" size={20} color={colors.success} />
          {occupation ? (
            <FavouriteToggle
              type="occupation"
              url={occupation.url}
              title={occupation.title}
              entityId={occupation.occupationCode}
              compact
            />
          ) : null}
          <Pressable onPress={() => void onShare()} hitSlop={8}>
            <MaterialIcon name="share" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
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
            <View style={styles.heroGradient} />
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <MaterialIcon name="verified" size={14} color={colors.onPrimary} />
                <Text style={styles.heroBadgeText}>
                  Official DHET Priority Occupation
                </Text>
              </View>
              <View style={styles.heroBadgeLight}>
                <MaterialIcon name="bolt" size={14} color={colors.primary} />
                <Text style={styles.heroBadgeLightText}>Green Economy</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.meta}>OFO: {occupation.occupationCode}</Text>
            <View style={styles.metaUpdate}>
              <MaterialIcon name="update" size={14} color={colors.textMuted} />
              <Text style={styles.meta}>
                Updated{" "}
                {occupation.scrapedAt
                  ? new Date(occupation.scrapedAt).toLocaleDateString()
                  : "2024 Gazette"}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{occupation.title}</Text>

          <View style={styles.tags}>
            {(tags.length
              ? tags
              : [
                  { id: "demand", label: "DHET High Demand 2024/2025", tone: "demand" as const },
                  { id: "green", label: "Green Career", tone: "green" as const },
                  { id: "trade", label: "Artisan / TVET Pathway", tone: "trade" as const },
                ]
            ).slice(0, 3).map((tag) => {
              const tone = tagToneColors(tag.tone);
              const icon =
                tag.id === "demand"
                  ? "trending_up"
                  : tag.id === "green"
                    ? "nature"
                    : "construction";
              return (
                <View
                  key={tag.id}
                  style={[styles.tag, { backgroundColor: tone.bg }]}
                >
                  <MaterialIcon name={icon} size={13} color={tone.fg} />
                  <Text style={[styles.tagText, { color: tone.fg }]}>
                    {tag.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.body}>{buildDescription(occupation)}</Text>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionHeading}>Key Indicators at a Glance</Text>
            <Text style={styles.sectionMeta}>National Averages</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.gridCard}>
              <View style={styles.gridTop}>
                <MaterialIcon name="payments" size={20} color={colors.primary} />
                <View style={[styles.chip, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={[styles.chipText, { color: colors.success }]}>
                    Entry to Mid
                  </Text>
                </View>
              </View>
              <Text style={styles.gridLabel}>Estimated Salary</Text>
              <Text style={styles.gridValue}>
                {occupationSalaryYearlyHint(occupation.title)
                  .replace(" – ", " - ")
                  .replace(" /yr", "")
                  .replace("R180,000", "R180k")
                  .replace("R360,000", "R360k")
                  .replace("R220,000", "R220k")
                  .replace("R480,000", "R480k")
                  .replace("R240,000", "R240k")
                  .replace("R520,000", "R520k")
                  .replace("R280,000", "R280k")
                  .replace("R650,000", "R650k") || "R180k - R380k"}
              </Text>
              <Text style={styles.gridHint}>per annum</Text>
            </View>

            <View style={styles.gridCard}>
              <View style={styles.gridTop}>
                <MaterialIcon name="rocket_launch" size={20} color={colors.ochre} />
                <View style={[styles.chip, { backgroundColor: "#FFF4E5" }]}>
                  <Text style={[styles.chipText, { color: colors.ochre }]}>
                    Accelerated
                  </Text>
                </View>
              </View>
              <Text style={styles.gridLabel}>Job Demand Outlook</Text>
              <Text style={styles.gridValue}>
                {tags.some((t) => t.id === "demand") ? "+18% Annually" : "Stable outlook"}
              </Text>
              <Text style={styles.gridHint}>Critical Shortage</Text>
            </View>

            <View style={styles.gridCard}>
              <View style={styles.gridTop}>
                <MaterialIcon name="school" size={20} color={colors.secondary} />
                <View style={[styles.chip, { backgroundColor: colors.secondarySubtle }]}>
                  <Text style={[styles.chipText, { color: colors.secondary }]}>
                    NQF 4
                  </Text>
                </View>
              </View>
              <Text style={styles.gridLabel}>Minimum Entry</Text>
              <Text style={styles.gridValue}>
                {occupationEducationHint(occupation.title).includes("Grade")
                  ? "Grade 12 / TVET N3"
                  : occupationEducationHint(occupation.title)}
              </Text>
              <Text style={styles.gridHint}>NSC or Equivalent</Text>
            </View>

            <View style={styles.gridCard}>
              <View style={styles.gridTop}>
                <MaterialIcon name="calculate" size={20} color={colors.textSecondary} />
                <View style={[styles.chip, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.chipText, { color: colors.text }]}>
                    Mandatory
                  </Text>
                </View>
              </View>
              <Text style={styles.gridLabel}>Math Benchmark</Text>
              <Text style={styles.gridValue}>
                {occupationMathHint(occupation.title)
                  .replace("Pure 40% / Tech 50%", "Math 40% / Tech 50%")
                  .replace("Pure Maths 60%+", "Math 60%+")}
              </Text>
              <Text style={styles.gridHint}>Physical Science added</Text>
            </View>
          </View>

          {/* Tasks */}
          <Pressable style={styles.accordionHeader} onPress={() => toggle("tasks")}>
            <View style={styles.accordionLeft}>
              <MaterialIcon
                name="assignment_turned_in"
                size={20}
                color={colors.primary}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.accordionTitle}>Core Daily Tasks</Text>
                <Text style={styles.accordionSub}>
                  Installation standards and field compliance
                </Text>
              </View>
            </View>
            <MaterialIcon
              name={open.tasks ? "expand_less" : "expand_more"}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
          {open.tasks ? (
            <View style={styles.section}>
              {taskItems.map((task) => (
                <View key={task.title} style={styles.taskCard}>
                  <View style={styles.taskIcon}>
                    <MaterialIcon name={task.icon} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.taskBody}>{task.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {/* Pathways */}
          <Pressable
            style={styles.accordionHeader}
            onPress={() => toggle("pathways")}
          >
            <View style={styles.accordionLeft}>
              <MaterialIcon name="alt_route" size={20} color={colors.primary} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.accordionTitle}>Educational Pathways</Text>
                <Text style={styles.accordionSub}>
                  {occupation.qualifications?.length
                    ? `${occupation.qualifications.length} verified routes to qualify`
                    : "3 verified routes to qualify"}
                </Text>
              </View>
            </View>
            <MaterialIcon
              name={open.pathways ? "expand_less" : "expand_more"}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
          {open.pathways ? (
            <View style={styles.section}>
              {occupation.qualifications?.length
                ? occupation.qualifications.slice(0, 6).map((qual, index) =>
                    qual.url ? (
                      <Pressable
                        key={`${qual.title}-${index}`}
                        style={styles.pathwayLive}
                        onPress={() => void openQualification(qual.url)}
                      >
                        <Text style={styles.pathwayLiveTitle}>{qual.title}</Text>
                        <MaterialIcon
                          name="chevron_right"
                          size={18}
                          color={colors.primary}
                        />
                      </Pressable>
                    ) : (
                      <Text key={`${qual.title}-${index}`} style={styles.taskBody}>
                        {qual.title}
                      </Text>
                    ),
                  )
                : null}
              {PATHWAYS.map((path) => {
                const tone = badgeTone(path.badgeTone);
                return (
                  <View key={path.id} style={styles.pathwayCard}>
                    <View style={styles.pathwayCardTop}>
                      <Text style={styles.pathwayEyebrow}>{path.eyebrow}</Text>
                      <View style={[styles.chip, { backgroundColor: tone.bg }]}>
                        <Text style={[styles.chipText, { color: tone.fg }]}>
                          {path.badge}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.pathwayTitle}>{path.title}</Text>
                    <Text style={styles.pathwayBody}>{path.body}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          {/* Funding */}
          <Pressable
            style={styles.accordionHeader}
            onPress={() => toggle("funding")}
          >
            <View style={styles.accordionLeft}>
              <MaterialIcon
                name="account_balance_wallet"
                size={20}
                color={colors.primary}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.accordionTitle}>Funding & Bursaries</Text>
                <Text style={styles.accordionSub}>
                  Fee-free government subsidies & grants
                </Text>
              </View>
            </View>
            <MaterialIcon
              name={open.funding ? "expand_less" : "expand_more"}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
          {open.funding ? (
            <View style={styles.section}>
              {FUNDING.map((item) => (
                <View key={item.title} style={styles.taskCard}>
                  <View style={styles.taskIcon}>
                    <MaterialIcon
                      name={item.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.taskTitle}>{item.title}</Text>
                    <Text style={styles.taskBody}>{item.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}

          {occupation.entryRequirements?.length ? (
            <View style={styles.section}>
              <Text style={styles.taskTitle}>Entry notes</Text>
              {occupation.entryRequirements.slice(0, 6).map((item) => (
                <Text key={item} style={styles.taskBody}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}

          <Pressable
            style={styles.whereCard}
            onPress={() => router.push(href("/directory/providers"))}
          >
            <View style={styles.whereIcon}>
              <MaterialIcon name="domain" size={22} color={colors.secondary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={styles.whereTitleRow}>
                <Text style={styles.whereTitle}>Where to Study</Text>
                <View style={styles.placesPill}>
                  <Text style={styles.placesText}>{providerCount} Found</Text>
                </View>
              </View>
              <Text style={styles.whereBody}>
                Public TVET Colleges, UoTs & Accredited Centers
              </Text>
            </View>
            <MaterialIcon name="arrow_forward" size={20} color={colors.primary} />
          </Pressable>

          <View style={styles.campusHeader}>
            <Text style={styles.sectionHeading}>Top Verified Campuses</Text>
            <Pressable onPress={() => router.push(href("/directory/providers"))}>
              <Text style={styles.viewMore}>View map</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.campusRow}
          >
            {CAMPUSES.map((campus) => (
              <Pressable
                key={campus.name}
                style={styles.campusCard}
                onPress={() => router.push(href("/directory/providers"))}
              >
                <Image
                  source={campus.img}
                  style={styles.campusImg}
                  resizeMode="cover"
                />
                <View style={styles.campusBody}>
                  <Text style={styles.campusPlace}>{campus.province}</Text>
                  <Text style={styles.campusName}>{campus.name}</Text>
                  <Text style={styles.campusSub}>{campus.campus}</Text>
                  <View style={styles.campusReady}>
                    <MaterialIcon
                      name="check_circle"
                      size={14}
                      color={colors.success}
                    />
                    <Text style={styles.campusReadyText}>{campus.ready}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.ctaBar}>
            <View style={styles.ctaLeft}>
              <MaterialIcon
                name="support_agent"
                size={22}
                color={colors.onPrimary}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.ctaTitle}>Need Guidance?</Text>
                <Text style={styles.ctaText}>
                  Speak to a certified Khetha Career Advisor
                </Text>
              </View>
            </View>
            <Pressable
              style={styles.callFree}
              onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
            >
              <Text style={styles.callFreeText}>Call Free</Text>
            </Pressable>
          </View>

          <View style={styles.bottomActions}>
            <Pressable
              style={styles.findStudyBtn}
              onPress={() => router.push(href("/directory/providers"))}
            >
              <MaterialIcon name="school" size={18} color={colors.onPrimary} />
              <Text style={styles.findStudyText}>
                Find Where to Study ({providerCount})
              </Text>
            </Pressable>
            <Pressable
              style={styles.bookmarkBtn}
              onPress={showSavedToast}
              accessibilityLabel="Save career"
            >
              <MaterialIcon name="bookmark_add" size={22} color={colors.primary} />
            </Pressable>
          </View>

          {toast ? (
            <View style={styles.toast}>
              <MaterialIcon name="check_circle" size={18} color={colors.success} />
              <Text style={styles.toastText}>
                Career saved to your profile (syncs when online)
              </Text>
            </View>
          ) : null}
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
    gap: spacing.sm,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    minHeight: 44,
  },
  backText: { ...typography.labelLg, color: colors.primary, fontWeight: "700" },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  langText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  error: { color: colors.error },
  block: { gap: spacing.md, paddingBottom: spacing.xl },
  hero: {
    height: 200,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  heroImage: { width: "100%", height: "100%" },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.28)",
  },
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
    maxWidth: "100%",
  },
  heroBadgeText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "700",
    flexShrink: 1,
  },
  heroBadgeLight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeLightText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  metaUpdate: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.headlineLg, color: colors.text, fontSize: 24 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  body: { ...typography.bodySm, color: colors.textSecondary },
  sectionHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionHeading: { ...typography.headlineSm, color: colors.text },
  sectionMeta: { ...typography.caption, color: colors.textSecondary },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gridCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
    ...shadows.card,
  },
  gridTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: { ...typography.caption, fontWeight: "700" },
  gridLabel: { ...typography.caption, color: colors.textMuted },
  gridValue: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  gridHint: { ...typography.caption, color: colors.textSecondary },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  accordionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  accordionTitle: { ...typography.headlineSm, color: colors.text },
  accordionSub: { ...typography.caption, color: colors.textSecondary },
  section: {
    gap: spacing.sm,
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: -4,
  },
  taskCard: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.card,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  taskBody: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  pathwayLive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  pathwayLiveTitle: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: "600",
    flex: 1,
  },
  pathwayCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 6,
    ...shadows.card,
  },
  pathwayCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  pathwayEyebrow: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    letterSpacing: 0.4,
    flexShrink: 1,
  },
  pathwayTitle: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  pathwayBody: { ...typography.bodySm, color: colors.textSecondary },
  whereCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  whereIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.secondarySubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  whereTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  whereTitle: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  whereBody: { ...typography.bodySm, color: colors.textSecondary, marginTop: 2 },
  placesPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  placesText: { ...typography.caption, color: colors.primary, fontWeight: "700" },
  campusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewMore: { ...typography.labelMd, color: colors.primary, fontWeight: "700" },
  campusRow: { gap: spacing.md, paddingRight: spacing.md },
  campusCard: {
    width: 220,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...shadows.card,
  },
  campusImg: { width: "100%", height: 110 },
  campusBody: { padding: spacing.md, gap: 2 },
  campusPlace: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "700",
  },
  campusName: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  campusSub: { ...typography.caption, color: colors.textSecondary },
  campusReady: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  campusReadyText: { ...typography.caption, color: colors.success, fontWeight: "600" },
  ctaBar: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  ctaLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  ctaTitle: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  ctaText: { ...typography.caption, color: "rgba(255,255,255,0.85)" },
  callFree: {
    alignSelf: "flex-start",
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  callFreeText: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  findStudyBtn: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  findStudyText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
    flexShrink: 1,
  },
  bookmarkBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  toastText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: "700",
    flex: 1,
  },
});
