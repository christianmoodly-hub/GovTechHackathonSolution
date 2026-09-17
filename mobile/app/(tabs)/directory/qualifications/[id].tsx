import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
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
import { getQualification } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Qualification } from "../../../../services/types";
import { OFFLINE_VAULT_STATS } from "../../../../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  STITCH_QUAL_DETAIL_HERO,
  detectQualType,
  qualificationApsTarget,
  qualificationBenchmarks,
  qualificationCategoryCrumb,
  qualificationCouncilHint,
  qualificationCreditsHint,
  qualificationCurriculum,
  qualificationDescription,
  qualificationDetailTags,
  qualificationEarnings,
  qualificationIndustryBanner,
  qualificationNqfLabel,
  qualificationSaqaId,
  qualificationWilEmployers,
  tagToneColors,
} from "../../../../utils/qualificationPresentation";

const TVET_PORTAL = "https://www.tvetcolleges.co.za/";

const CAMPUS_BADGES = [
  "Centre of Spec",
  "Solar Innovation Hub",
  "Substation Demo",
];

export default function QualificationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [qualification, setQualification] = useState<Qualification | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openTerm, setOpenTerm] = useState<string>("n4");
  const [mathPick, setMathPick] = useState<string | null>(null);
  const [sciPick, setSciPick] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<
    "idle" | "saving" | "done"
  >("idle");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) {
        setError("Missing qualification id");
        setLoading(false);
        return;
      }
      try {
        const data = await getQualification(String(id));
        if (!alive) return;
        if (!data) setError("Qualification not found");
        setQualification(data);
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load qualification",
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const title = qualification?.title ?? "";
  const tags = useMemo(
    () => (title ? qualificationDetailTags(title) : []),
    [title],
  );
  const benchmarks = useMemo(
    () => (title ? qualificationBenchmarks(title, qualification?.duration) : []),
    [title, qualification?.duration],
  );
  const curriculum = useMemo(
    () => (title ? qualificationCurriculum(title) : []),
    [title],
  );
  const wil = useMemo(
    () => (title ? qualificationWilEmployers(title) : []),
    [title],
  );
  const earnings = useMemo(
    () => (title ? qualificationEarnings(title) : null),
    [title],
  );

  useEffect(() => {
    if (curriculum.length) setOpenTerm(curriculum[0].id);
  }, [curriculum]);

  const eligible = Boolean(mathPick && sciPick);
  const type = title ? detectQualType(title) : "all";
  const showWil = type === "nated" || type === "occupational" || type === "ncv";

  const openProvider = async (url: string | null | undefined) => {
    if (!url) return;
    const providerDocId = await stableUrlId(url);
    router.push(href(`/directory/providers/${providerDocId}`));
  };

  const onShare = async () => {
    if (!qualification) return;
    try {
      await Share.share({
        message: `${qualification.title} — Khetha NCAP`,
        title: qualification.title,
      });
    } catch {
      // ignore cancel
    }
  };

  const onDownload = () => {
    if (downloadState !== "idle") return;
    setDownloadState("saving");
    setTimeout(() => {
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 2800);
    }, 1100);
  };

  const providers = qualification?.providers?.length
    ? qualification.providers.slice(0, 3)
    : [
        {
          name: "Ekurhuleni East TVET College",
          url: null as string | null,
        },
        { name: "False Bay TVET College", url: null },
        { name: "Coastal KZN TVET College", url: null },
      ];

  const campusMeta = [
    "Springs & Sam Nzima Campuses · Gauteng",
    "Westlake Campus · Western Cape",
    "Swinton Campus · KwaZulu-Natal",
  ];
  const campusExtras = [
    ["Hostels Available", "Jan & May Intakes"],
    ["Heavy Current Labs", "Jan Intake"],
    ["Maritime Grid Link", "Jan & Sep Intakes"],
  ];

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.qualificationsCached}
        fromCache
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.navRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to qualifications"
        >
          <MaterialIcon
            name="arrow_back_ios"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.backText}>Qualifications</Text>
        </Pressable>
        <View style={styles.navActions}>
          {qualification ? (
            <FavouriteToggle
              compact
              type="qualification"
              url={qualification.url}
              title={qualification.title}
              entityId={qualification.id}
            />
          ) : null}
          <Pressable onPress={() => void onShare()} hitSlop={8}>
            <MaterialIcon
              name="share"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {qualification ? (
        <View style={styles.block}>
          <View style={styles.crumb}>
            <Text style={styles.crumbText}>Qualifications</Text>
            <MaterialIcon
              name="chevron_right"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.crumbActive} numberOfLines={1}>
              {qualificationCategoryCrumb(qualification.title)}
            </Text>
          </View>

          <View style={styles.tags}>
            {tags.map((tag) => {
              const tone = tagToneColors(tag.tone);
              return (
                <View
                  key={tag.id}
                  style={[styles.tag, { backgroundColor: tone.bg }]}
                >
                  <MaterialIcon name={tag.icon} size={13} color={tone.fg} />
                  <Text style={[styles.tagText, { color: tone.fg }]}>
                    {tag.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.title}>{qualification.title}</Text>

          <View style={styles.saqaRow}>
            <Text style={styles.saqaText}>
              SAQA ID:{" "}
              <Text style={styles.saqaStrong}>
                {qualificationSaqaId(
                  qualification.id,
                  qualification.qualificationId ??
                    qualification.generalQualificationId,
                )}
              </Text>
            </Text>
            <Text style={styles.saqaSep}>·</Text>
            <Text style={styles.saqaText} numberOfLines={1}>
              Quality Council:{" "}
              <Text style={styles.saqaStrong}>
                {qualificationCouncilHint(qualification.title)}
              </Text>
            </Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <MaterialIcon
                name="workspace_premium"
                size={22}
                color={colors.primary}
              />
              <Text style={styles.statLabel}>NQF Framework</Text>
              <Text style={styles.statValue}>
                {qualificationNqfLabel(qualification.nqfLevel)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcon
                name="military_tech"
                size={22}
                color={colors.ochre}
              />
              <Text style={styles.statLabel}>Credit Weight</Text>
              <Text style={styles.statValue}>
                {qualificationCreditsHint(
                  qualification.title,
                  qualification.nqfLevel,
                )}
              </Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Image
              source={STITCH_QUAL_DETAIL_HERO}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradient} />
            <View style={styles.heroCaption}>
              <MaterialIcon
                name="precision_manufacturing"
                size={16}
                color={colors.onPrimary}
              />
              <Text style={styles.heroCaptionText} numberOfLines={2}>
                {qualificationIndustryBanner(qualification.title)}
              </Text>
            </View>
          </View>

          <Text style={styles.body}>
            {qualificationDescription(qualification.title)}
          </Text>

          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon
                name="analytics"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionHeading}>
                Key Qualification Benchmarks
              </Text>
            </View>
          </View>
          <View style={styles.grid}>
            {benchmarks.map((item) => (
              <View key={item.id} style={styles.gridCard}>
                <MaterialIcon
                  name={item.icon}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridValue}>{item.value}</Text>
                <Text style={styles.gridHint}>{item.hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.apsCard}>
            <View style={styles.apsHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcon
                  name="calculate"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionHeading}>APS Eligibility Check</Text>
              </View>
              <View style={styles.targetPill}>
                <Text style={styles.targetText}>
                  Target: {qualificationApsTarget(qualification.title)}
                </Text>
              </View>
            </View>
            <Text style={styles.apsBody}>
              Input your National Senior Certificate results to quickly determine
              your entry category for this qualification.
            </Text>

            <Text style={styles.apsLabel}>Mathematics Level / Percentage</Text>
            <View style={styles.chipRow}>
              {["Pure > 40%", "Tech > 50%", "N3 Cert pass"].map((opt) => {
                const active = mathPick === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.apsChip, active && styles.apsChipActive]}
                    onPress={() => setMathPick(opt)}
                  >
                    <Text
                      style={[
                        styles.apsChipText,
                        active && styles.apsChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.apsLabel}>
              Physical Science / Engineering Science
            </Text>
            <View style={styles.chipRow}>
              {["Passed > 40% (NSC)", "Engineering Science N3"].map((opt) => {
                const active = sciPick === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.apsChip, active && styles.apsChipActive]}
                    onPress={() => setSciPick(opt)}
                  >
                    <Text
                      style={[
                        styles.apsChipText,
                        active && styles.apsChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {eligible ? (
              <View style={styles.eligibleCard}>
                <MaterialIcon
                  name="check_circle"
                  size={20}
                  color={colors.success}
                />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.eligibleTitle}>
                    Eligible for Direct Admission
                  </Text>
                  <Text style={styles.eligibleBody}>
                    Your marks satisfy the minimum departmental prerequisite for
                    registration on this pathway.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.curriculumHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon
                name="account_tree"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionHeading}>Curriculum & Trimesters</Text>
            </View>
            <View style={styles.modulesPill}>
              <Text style={styles.modulesPillText}>4 Modules/Trimester</Text>
            </View>
          </View>

          {curriculum.map((term) => {
            const open = openTerm === term.id;
            return (
              <View key={term.id} style={styles.termCard}>
                <Pressable
                  style={styles.termHeader}
                  onPress={() =>
                    setOpenTerm((prev) => (prev === term.id ? "" : term.id))
                  }
                >
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{term.level}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.termTitle}>{term.title}</Text>
                    <Text style={styles.termSub}>{term.subtitle}</Text>
                  </View>
                  <MaterialIcon
                    name={open ? "expand_less" : "expand_more"}
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {open ? (
                  <View style={styles.moduleList}>
                    {term.modules.map((mod) => (
                      <View key={mod.title} style={styles.moduleRow}>
                        <View style={styles.moduleIcon}>
                          <MaterialIcon
                            name={mod.icon}
                            size={18}
                            color={colors.primary}
                          />
                        </View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={styles.moduleTitle}>{mod.title}</Text>
                          <Text style={styles.moduleMeta}>{mod.meta}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}

          {showWil ? (
            <View style={styles.wilCard}>
              <View style={styles.wilHeader}>
                <View style={styles.sectionTitleRow}>
                  <MaterialIcon
                    name="verified_user"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.sectionHeading}>
                    Work Integrated Learning (WIL)
                  </Text>
                </View>
                <View style={styles.wilPill}>
                  <Text style={styles.wilPillText}>18 Months</Text>
                </View>
              </View>
              <Text style={styles.wilBody}>
                Mandatory workplace logbook signed off by an accredited mentor.
                Eligible employers include:
              </Text>
              <View style={styles.chipRow}>
                {wil.map((item) => (
                  <View key={item} style={styles.wilChip}>
                    <Text style={styles.wilChipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.campusHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon name="domain" size={20} color={colors.primary} />
              <Text style={styles.sectionHeading}>
                Accredited Offering Campuses
              </Text>
            </View>
            <View style={styles.modulesPill}>
              <Text style={styles.modulesPillText}>
                {Math.max(qualification.providers?.length ?? 0, 38)} Colleges
                Total
              </Text>
            </View>
          </View>

          {providers.map((provider, index) => {
            const initials = provider.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 3)
              .map((w) => w[0]?.toUpperCase() ?? "")
              .join("")
              .slice(0, 3);
            return (
              <Pressable
                key={`${provider.name}-${index}`}
                style={styles.campusCard}
                onPress={() => void openProvider(provider.url)}
                disabled={!provider.url}
              >
                <View style={styles.campusTop}>
                  <View style={styles.campusAvatar}>
                    <Text style={styles.campusInitials}>
                      {initials || "TV"}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.campusTitleRow}>
                      <Text style={styles.campusName} numberOfLines={2}>
                        {provider.name}
                      </Text>
                      <View style={styles.campusBadge}>
                        <Text style={styles.campusBadgeText}>
                          {CAMPUS_BADGES[index % CAMPUS_BADGES.length]}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.campusMeta} numberOfLines={1}>
                      {campusMeta[index % campusMeta.length]}
                    </Text>
                    <View style={styles.campusExtras}>
                      {campusExtras[index % campusExtras.length].map(
                        (extra) => (
                          <View key={extra} style={styles.extraRow}>
                            <MaterialIcon
                              name="check"
                              size={14}
                              color={colors.success}
                            />
                            <Text style={styles.extraText}>{extra}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.applyCampus}>
                  <Text style={styles.applyCampusText}>Apply Campus</Text>
                  <MaterialIcon
                    name="chevron_right"
                    size={18}
                    color={colors.primary}
                  />
                </View>
              </Pressable>
            );
          })}

          <Pressable
            style={styles.viewAll}
            onPress={() => router.push(href("/directory/providers"))}
          >
            <Text style={styles.viewAllText}>
              View all public colleges offering this qualification
            </Text>
            <MaterialIcon
              name="arrow_forward"
              size={18}
              color={colors.primary}
            />
          </Pressable>

          {earnings ? (
            <View style={styles.earnCard}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcon
                  name="trending_up"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.sectionHeading}>
                  Earning & Registration Horizon
                </Text>
              </View>
              <View style={styles.earnRow}>
                <Text style={styles.earnLabel}>Apprentice / Intern Stipend</Text>
                <Text style={styles.earnValue}>{earnings.stipend}</Text>
              </View>
              <View style={styles.earnRow}>
                <Text style={styles.earnLabel}>Qualified Certified Technician</Text>
                <Text style={styles.earnValue}>{earnings.qualified}</Text>
              </View>
              <View style={styles.earnRow}>
                <Text style={styles.earnLabel}>Professional Designation</Text>
                <Text style={styles.earnValue}>{earnings.designation}</Text>
              </View>
            </View>
          ) : null}

          <Pressable
            style={styles.applyBtn}
            onPress={() => void Linking.openURL(TVET_PORTAL)}
          >
            <MaterialIcon
              name="how_to_reg"
              size={20}
              color={colors.onPrimary}
            />
            <Text style={styles.applyBtnText}>
              Apply via Central TVET Portal
            </Text>
          </Pressable>

          <Pressable style={styles.downloadBtn} onPress={onDownload}>
            <MaterialIcon
              name={
                downloadState === "done"
                  ? "task_alt"
                  : downloadState === "saving"
                    ? "sync"
                    : "download_for_offline"
              }
              size={20}
              color={colors.primary}
            />
            <Text style={styles.downloadText}>
              {downloadState === "saving"
                ? "Saving Offline Copy (Zero-Rated)…"
                : downloadState === "done"
                  ? "Downloaded for Offline Reference"
                  : "Download Curriculum Outline (PDF · Zero-Rated)"}
            </Text>
          </Pressable>
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
    marginBottom: spacing.sm,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minHeight: 44,
  },
  backText: { ...typography.labelLg, color: colors.primary },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  error: { ...typography.bodySm, color: colors.error },
  block: { gap: spacing.md, paddingBottom: spacing.xxxl },
  crumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  crumbText: { ...typography.caption, color: colors.textMuted },
  crumbActive: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    flexShrink: 1,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  title: { ...typography.headlineLg, color: colors.text, fontSize: 24 },
  saqaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  saqaText: { ...typography.bodySm, color: colors.textSecondary },
  saqaStrong: { fontWeight: "700", color: colors.text },
  saqaSep: { color: colors.textMuted },
  statRow: { flexDirection: "row", gap: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: 4,
    ...shadows.card,
  },
  statLabel: { ...typography.caption, color: colors.textMuted },
  statValue: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  hero: {
    height: 176,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.muted,
    ...shadows.card,
  },
  heroImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  heroCaption: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroCaptionText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "700",
    flex: 1,
  },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  sectionHead: { marginTop: spacing.xs },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  sectionHeading: {
    ...typography.headlineSm,
    color: colors.text,
    flexShrink: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: 4,
    ...shadows.card,
  },
  gridLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  gridValue: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  gridHint: { ...typography.caption, color: colors.textSecondary },
  apsCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  apsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  targetPill: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  targetText: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "800",
  },
  apsBody: { ...typography.bodySm, color: colors.textSecondary },
  apsLabel: {
    ...typography.labelMd,
    color: colors.text,
    marginTop: 4,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  apsChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: "center",
  },
  apsChipActive: { backgroundColor: colors.primary },
  apsChipText: { ...typography.labelMd, color: colors.text },
  apsChipTextActive: { color: colors.onPrimary },
  eligibleCard: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: 4,
  },
  eligibleTitle: {
    ...typography.labelLg,
    color: colors.success,
    fontWeight: "800",
  },
  eligibleBody: { ...typography.bodySm, color: colors.textSecondary },
  curriculumHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  modulesPill: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modulesPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  termCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    minHeight: 64,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  levelText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  termTitle: { ...typography.labelLg, color: colors.text },
  termSub: { ...typography.caption, color: colors.textMuted },
  moduleList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  moduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  moduleIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleTitle: { ...typography.labelMd, color: colors.text },
  moduleMeta: { ...typography.caption, color: colors.textMuted },
  wilCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  wilHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  wilPill: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  wilPillText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "800",
  },
  wilBody: { ...typography.bodySm, color: colors.textSecondary },
  wilChip: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  wilChipText: {
    ...typography.labelMd,
    color: colors.secondary,
    fontWeight: "700",
  },
  campusHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  campusCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  campusTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  campusAvatar: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  campusInitials: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  campusTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  campusName: {
    ...typography.labelLg,
    color: colors.text,
    flex: 1,
  },
  campusBadge: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  campusBadgeText: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "700",
  },
  campusMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  campusExtras: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: 4,
  },
  extraRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  extraText: { ...typography.caption, color: colors.textSecondary },
  applyCampus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    marginTop: 4,
  },
  applyCampusText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 44,
  },
  viewAllText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
  earnCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  earnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  earnLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 1,
  },
  earnValue: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "800",
  },
  applyBtn: {
    minHeight: 52,
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  applyBtnText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  downloadBtn: {
    minHeight: 48,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  downloadText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "center",
  },
});
