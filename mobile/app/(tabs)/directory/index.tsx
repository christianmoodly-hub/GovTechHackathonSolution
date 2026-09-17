import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, EmptyState, LoadingState } from "../../../components/Screen";
import { SearchField } from "../../../components/SearchField";
import { MaterialIcon } from "../../../components/MaterialIcon";
import { FavouriteToggle } from "../../../components/FavouriteToggle";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../components/KhethaBrandBar";
import { HELPLINE } from "../../../data/staticContent";
import { getOccupationSummaries } from "../../../services/ncapData";
import type { OccupationSummary } from "../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";
import {
  careerFilterDefs,
  matchesCareerFilter,
  matchesGradeFilter,
  matchesMathFilter,
  occupationAccent,
  occupationEducationHint,
  occupationIcon,
  occupationMathHint,
  occupationPathwayHint,
  occupationPathwayIcon,
  occupationSalaryHint,
  occupationSubtitleHint,
  occupationTags,
  tagIcon,
  tagToneColors,
  type CareerFilterId,
  type GradeFilterId,
  type MathFilterId,
} from "../../../utils/occupationPresentation";

const PAGE_SIZE = 20;

const GRADE_OPTIONS: { id: GradeFilterId; label: string; short: string }[] = [
  { id: "any", label: "Show all pathways (Any level)", short: "All Grades" },
  {
    id: "grade9",
    label: "Grade 9 Completed (GETC / AET Level 4)",
    short: "Grade 9+",
  },
  { id: "grade10", label: "Grade 10 / N1 Certificate", short: "Grade 10+" },
  { id: "grade11", label: "Grade 11 / N2 Certificate", short: "Grade 11+" },
  {
    id: "grade12-dip",
    label: "Grade 12 NSC (Diploma Endorsement)",
    short: "Grade 12 Dip",
  },
  {
    id: "grade12-deg",
    label: "Grade 12 NSC (Bachelor's Endorsement)",
    short: "Grade 12 Deg",
  },
  { id: "n3", label: "N3 / NCV Level 4 Certificate", short: "N3 / NCV 4" },
];

const MATH_OPTIONS: { id: MathFilterId; label: string }[] = [
  { id: "pure", label: "Pure Maths (Caps)" },
  { id: "lit", label: "Maths Literacy" },
  { id: "tech", label: "Technical Maths" },
  { id: "none", label: "No Maths / Other" },
];

const FILTER_ICON_COLOR: Record<CareerFilterId, string> = {
  all: colors.primary,
  demand: colors.gold,
  green: colors.success,
  trades: colors.ochre,
  ict: colors.secondary,
  health: colors.error,
  agriculture: colors.warning,
};

export default function CareersDirectoryScreen() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<OccupationSummary[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CareerFilterId>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilterId>("any");
  const [mathFilter, setMathFilter] = useState<MathFilterId>("any");
  const [draftGrade, setDraftGrade] = useState<GradeFilterId>("any");
  const [draftMath, setDraftMath] = useState<MathFilterId>("pure");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(async (forceRefresh = false) => {
    setError(null);
    try {
      const result = await getOccupationSummaries({ forceRefresh });
      setSummaries(result.summaries);
      setFromCache(result.fromCache);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load careers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return summaries.filter((item) => {
      if (!matchesCareerFilter(item.title, filter)) return false;
      if (!matchesGradeFilter(item.title, gradeFilter)) return false;
      if (!matchesMathFilter(item.title, mathFilter)) return false;
      if (!q) return true;
      return item.searchText.includes(q);
    });
  }, [summaries, query, filter, gradeFilter, mathFilter]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, filter, gradeFilter, mathFilter]);

  const page = filtered.slice(0, visibleCount);
  const filters = careerFilterDefs();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(
    totalPages,
    Math.ceil(page.length / PAGE_SIZE) || 1,
  );
  const progress =
    filtered.length > 0 ? Math.min(1, page.length / filtered.length) : 0;
  const gradeShort =
    GRADE_OPTIONS.find((g) => g.id === gradeFilter)?.short ?? "All Grades";

  const openFilter = () => {
    setDraftGrade(gradeFilter);
    setDraftMath(mathFilter === "any" ? "pure" : mathFilter);
    setFilterOpen(true);
  };

  const applyFilter = () => {
    setGradeFilter(draftGrade);
    setMathFilter(draftMath);
    setFilterOpen(false);
  };

  const resetFilter = () => {
    setDraftGrade("any");
    setDraftMath("pure");
    setGradeFilter("any");
    setMathFilter("any");
    setFilterOpen(false);
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            Careers Directory{" "}
            <Text style={styles.titleAlt}>(Imisebenzi)</Text>
          </Text>
        </View>
        <View style={styles.saqaPill}>
          <Text style={styles.saqaText}>DHET & SAQA</Text>
        </View>
      </View>
      <Text style={styles.body}>
        {summaries.length.toLocaleString()} Government-vetted career pathways
        across South Africa.
      </Text>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search occupation, OFO code, trade..."
      />

      <Pressable style={styles.filterTrigger} onPress={openFilter}>
        <View style={styles.filterTriggerLeft}>
          <MaterialIcon name="tune" size={20} color={colors.primary} />
          <Text style={styles.filterTriggerLabel}>
            Filter by Grade & Math Requirement
          </Text>
        </View>
        <View style={styles.gradePill}>
          <Text style={styles.gradePillText}>{gradeShort}</Text>
          <MaterialIcon
            name="expand_more"
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((item) => {
          const count =
            item.id === "all"
              ? summaries.length
              : summaries.filter((s) => matchesCareerFilter(s.title, item.id))
                  .length;
          const active = filter === item.id;
          const iconColor = active
            ? colors.onPrimary
            : FILTER_ICON_COLOR[item.id];
          return (
            <Pressable
              key={item.id}
              onPress={() => setFilter(item.id)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              {item.id !== "all" ? (
                <MaterialIcon name={item.icon} size={14} color={iconColor} />
              ) : null}
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
              <View
                style={[styles.countPill, active && styles.countPillActive]}
              >
                <Text
                  style={[
                    styles.countText,
                    active && styles.countTextActive,
                  ]}
                >
                  {count.toLocaleString()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? <LoadingState label="Loading occupations…" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          title="No careers found"
          body="Try a different search term or filter."
        />
      ) : null}
    </View>
  );

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={summaries.length}
        fromCache={fromCache}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <FlatList
        data={loading ? [] : page}
        keyExtractor={(item) => item.occupationCode}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load(true);
            }}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          filtered.length ? (
            <View style={styles.footerBlock}>
              <Text style={styles.pageMeta}>
                Showing {page.length.toLocaleString()} of{" "}
                {filtered.length.toLocaleString()} occupations · Page{" "}
                {currentPage} of {totalPages}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.max(2, progress * 100)}%` },
                  ]}
                />
              </View>
              {filtered.length > visibleCount ? (
                <Pressable
                  style={styles.loadMore}
                  onPress={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  <MaterialIcon
                    name="sync"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.loadMoreText}>
                    Load Next {PAGE_SIZE} Occupations
                  </Text>
                </Pressable>
              ) : null}
              <View style={styles.helpBanner}>
                <View style={styles.helpLeft}>
                  <View style={styles.helpIcon}>
                    <MaterialIcon
                      name="headset_mic"
                      size={20}
                      color={colors.onPrimary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.helpTitle}>Need help choosing?</Text>
                    <Text style={styles.helpBody}>
                      Toll-free DHET Khetha advice line
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={styles.callBtn}
                  onPress={() =>
                    void Linking.openURL(`tel:${HELPLINE.tollFree}`)
                  }
                >
                  <MaterialIcon name="call" size={18} color={colors.text} />
                  <Text style={styles.callText}>
                    {HELPLINE.tollFreeDisplay}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const tags = occupationTags(item.title);
          const icon = occupationIcon(item.title);
          const accent = occupationAccent(item.title);
          const subtitle = occupationSubtitleHint(item.title);
          const pathwayIcon = occupationPathwayIcon(item.title);
          const occupationUrl = `ncap://occupation/${item.occupationCode}`;
          return (
            <View style={styles.card}>
              <View style={[styles.accentBar, { backgroundColor: accent }]} />
              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.iconTile,
                      { backgroundColor: `${accent}22` },
                    ]}
                  >
                    <MaterialIcon name={icon} size={28} color={accent} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.cardCode} numberOfLines={1}>
                      OFO Code: {item.occupationCode}
                      {subtitle ? (
                        <Text style={[styles.cardCodeAccent, { color: accent }]}>
                          {" "}
                          · {subtitle}
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                  <FavouriteToggle
                    compact
                    type="occupation"
                    url={occupationUrl}
                    title={item.title}
                    entityId={item.occupationCode}
                  />
                </View>

                <View style={styles.tags}>
                  {tags.map((tag) => {
                    const tone = tagToneColors(tag.tone);
                    return (
                      <View
                        key={tag.id}
                        style={[
                          styles.tag,
                          {
                            backgroundColor: tone.bg,
                          },
                        ]}
                      >
                        <MaterialIcon
                          name={tagIcon(tag)}
                          size={13}
                          color={tone.fg}
                        />
                        <Text style={[styles.tagText, { color: tone.fg }]}>
                          {tag.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.metaGrid}>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Min Education</Text>
                    <Text style={styles.metaValue}>
                      {occupationEducationHint(item.title)}
                    </Text>
                  </View>
                  <View style={styles.metaCell}>
                    <Text style={styles.metaLabel}>Required Math</Text>
                    <Text style={styles.metaValue}>
                      {occupationMathHint(item.title)}
                    </Text>
                  </View>
                  <View style={styles.salaryRow}>
                    <Text style={styles.metaLabel}>Avg Entry Salary</Text>
                    <Text style={styles.salaryValue}>
                      {occupationSalaryHint(item.title)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.nearby}>
                    <MaterialIcon
                      name={pathwayIcon}
                      size={16}
                      color={accent}
                    />
                    <Text
                      style={[styles.nearbyText, { color: accent }]}
                      numberOfLines={1}
                    >
                      {occupationPathwayHint(item.title)}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.pathwayBtn}
                    onPress={() =>
                      router.push(
                        href(`/directory/occupations/${item.occupationCode}`),
                      )
                    }
                  >
                    <Text style={styles.pathwayText}>View Pathway</Text>
                    <MaterialIcon
                      name="arrow_forward"
                      size={16}
                      color={colors.onPrimary}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={filterOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setFilterOpen(false)}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <MaterialIcon
                  name="filter_alt"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.modalTitle}>Filter Requirements</Text>
              </View>
              <Pressable
                onPress={() => setFilterOpen(false)}
                style={styles.modalClose}
                accessibilityLabel="Close filter dialog"
              >
                <MaterialIcon
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>
              Your Highest Level of Completed Education
            </Text>
            <View style={styles.gradeList}>
              {GRADE_OPTIONS.map((opt) => {
                const active = draftGrade === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.gradeOption,
                      active && styles.gradeOptionActive,
                    ]}
                    onPress={() => setDraftGrade(opt.id)}
                  >
                    <Text
                      style={[
                        styles.gradeOptionText,
                        active && styles.gradeOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.modalLabel}>Your Mathematics Subject</Text>
            <View style={styles.mathGrid}>
              {MATH_OPTIONS.map((opt) => {
                const active = draftMath === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.mathOption,
                      active && styles.mathOptionActive,
                    ]}
                    onPress={() => setDraftMath(opt.id)}
                  >
                    <View
                      style={[
                        styles.radio,
                        active && styles.radioActive,
                      ]}
                    >
                      {active ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.mathOptionText,
                        active && styles.mathOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.resetBtn} onPress={resetFilter}>
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
              <Pressable style={styles.applyBtn} onPress={applyFilter}>
                <Text style={styles.applyText}>Apply Filters</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.sm },
  headerBlock: { gap: spacing.md, marginBottom: spacing.sm },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  title: { ...typography.headlineLg, color: colors.text, fontSize: 22 },
  titleAlt: {
    ...typography.headlineSm,
    color: colors.primary,
    fontWeight: "400",
  },
  saqaPill: {
    backgroundColor: "#D3E4FF",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saqaText: {
    ...typography.labelMd,
    color: "#001C38",
    fontWeight: "700",
  },
  body: { ...typography.bodySm, color: colors.textSecondary, marginTop: -4 },
  filterTrigger: {
    minHeight: 48,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    ...shadows.card,
  },
  filterTriggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  filterTriggerLabel: { ...typography.labelLg, color: colors.text, flex: 1 },
  gradePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gradePillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  filterRow: { gap: spacing.sm, paddingVertical: 2, paddingRight: spacing.lg },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 40,
    ...shadows.card,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
  },
  filterChipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterChipTextActive: { color: colors.onPrimary },
  countPill: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countPillActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  countText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  countTextActive: { color: colors.onPrimary },
  list: { gap: spacing.md, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  accentBar: { height: 6, width: "100%" },
  cardInner: { padding: spacing.lg, gap: spacing.sm },
  cardTop: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardCode: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  cardCodeAccent: { fontWeight: "700" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingTop: 2 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  metaGrid: {
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaCell: { width: "47%", gap: 2 },
  metaLabel: { ...typography.caption, color: colors.textSecondary },
  metaValue: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "700",
  },
  salaryRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    gap: spacing.sm,
  },
  salaryValue: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: 4,
  },
  nearby: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nearbyText: { ...typography.caption, fontWeight: "700", flex: 1 },
  pathwayBtn: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pathwayText: { ...typography.labelMd, color: colors.onPrimary },
  footerBlock: {
    gap: spacing.md,
    marginTop: spacing.lg,
    alignItems: "center",
  },
  pageMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  progressTrack: {
    width: 192,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  loadMore: {
    width: "100%",
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...shadows.card,
  },
  loadMoreText: { ...typography.labelLg, color: colors.primary },
  helpBanner: {
    width: "100%",
    backgroundColor: "#E7EEFF",
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    ...shadows.card,
  },
  helpLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: { ...typography.labelLg, color: colors.text },
  helpBody: { ...typography.caption, color: colors.textSecondary },
  callBtn: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  callText: { ...typography.labelMd, color: colors.text, fontWeight: "700" },
  error: { ...typography.bodySm, color: colors.error },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  modalTitle: { ...typography.headlineSm, color: colors.text },
  modalClose: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalLabel: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "700",
  },
  gradeList: { gap: 6 },
  gradeOption: {
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  gradeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  gradeOptionText: { ...typography.bodySm, color: colors.text },
  gradeOptionTextActive: { color: colors.primary, fontWeight: "700" },
  mathGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  mathOption: {
    width: "48%",
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.canvas,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  mathOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  mathOptionText: { ...typography.bodySm, color: colors.text, flex: 1 },
  mathOptionTextActive: { fontWeight: "600" },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  modalActions: { flexDirection: "row", gap: spacing.sm, paddingTop: 4 },
  resetBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: { ...typography.labelLg, color: colors.textSecondary },
  applyBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { ...typography.labelLg, color: colors.onPrimary },
});
