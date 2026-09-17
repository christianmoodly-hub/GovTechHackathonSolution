import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
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
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../components/KhethaBrandBar";
import { getOccupationSummaries } from "../../../services/ncapData";
import type { OccupationSummary } from "../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";
import {
  careerFilterDefs,
  matchesCareerFilter,
  occupationAccent,
  occupationEducationHint,
  occupationIcon,
  occupationMathHint,
  occupationPathwayHint,
  occupationSalaryHint,
  occupationTags,
  tagToneColors,
  type CareerFilterId,
} from "../../../utils/occupationPresentation";

const PAGE_SIZE = 20;

export default function CareersDirectoryScreen() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<OccupationSummary[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CareerFilterId>("all");
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
      if (!q) return true;
      return item.searchText.includes(q);
    });
  }, [summaries, query, filter]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, filter]);

  const page = filtered.slice(0, visibleCount);
  const filters = careerFilterDefs();

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={summaries.length}
        fromCache={fromCache}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Careers Directory</Text>
          <Text style={styles.titleAlt}>(Imisebenzi)</Text>
        </View>
        <View style={styles.saqaPill}>
          <Text style={styles.saqaText}>DHET & SAQA</Text>
        </View>
      </View>
      <Text style={styles.body}>
        {summaries.length.toLocaleString()} Government-vetted career pathways
        across South Africa.
      </Text>

      <View style={styles.links}>
        <Pressable
          style={styles.linkChip}
          onPress={() => router.push(href("/directory/qualifications"))}
        >
          <MaterialIcon name="school" size={16} color={colors.primary} />
          <Text style={styles.link}>Qualifications</Text>
        </Pressable>
        <Pressable
          style={styles.linkChip}
          onPress={() => router.push(href("/directory/providers"))}
        >
          <MaterialIcon name="location_on" size={16} color={colors.primary} />
          <Text style={styles.link}>Providers</Text>
        </Pressable>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search occupation, OFO code, trade..."
      />

      <View style={styles.filterLabelRow}>
        <MaterialIcon name="tune" size={16} color={colors.textSecondary} />
        <Text style={styles.filterLabel}>Filter by Grade & pathway type</Text>
      </View>

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
          return (
            <Pressable
              key={item.id}
              onPress={() => setFilter(item.id)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <MaterialIcon
                name={item.icon}
                size={14}
                color={active ? colors.onPrimary : colors.primary}
              />
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {item.label} {count}
              </Text>
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

      <FlatList
        data={page}
        keyExtractor={(item) => item.occupationCode}
        contentContainerStyle={styles.list}
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
          filtered.length > visibleCount ? (
            <View style={styles.footerBlock}>
              <Text style={styles.pageMeta}>
                Showing {page.length} of {filtered.length.toLocaleString()}{" "}
                occupations
              </Text>
              <Pressable
                style={styles.loadMore}
                onPress={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                <MaterialIcon
                  name="cloud_sync"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text style={styles.loadMoreText}>
                  Load Next {PAGE_SIZE} Occupations
                </Text>
              </Pressable>
              <Pressable
                style={styles.helpBanner}
                onPress={() => router.push(href("/questionnaires"))}
              >
                <Text style={styles.helpBannerText}>Need help choosing?</Text>
                <View style={styles.helpTrack}>
                  <View style={styles.helpFill} />
                </View>
              </Pressable>
            </View>
          ) : filtered.length ? (
            <Text style={styles.pageMeta}>
              Showing {page.length} of {filtered.length.toLocaleString()}{" "}
              occupations
            </Text>
          ) : null
        }
        renderItem={({ item }) => {
          const tags = occupationTags(item.title);
          const icon = occupationIcon(item.title);
          const accent = occupationAccent(item.title);
          return (
            <View style={styles.card}>
              <View style={[styles.accentBar, { backgroundColor: accent }]} />
              <View style={styles.cardInner}>
                <View style={styles.cardTop}>
                  <View
                    style={[styles.iconTile, { backgroundColor: `${accent}22` }]}
                  >
                    <MaterialIcon name={icon} size={22} color={accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardCode}>
                      OFO Code: {item.occupationCode}
                      {tags.some((t) => t.id === "demand")
                        ? " · Priority Skills List"
                        : ""}
                    </Text>
                  </View>
                  <MaterialIcon
                    name="bookmark_border"
                    size={22}
                    color={colors.textMuted}
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
                            borderColor: tone.border,
                          },
                        ]}
                      >
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
                  <View style={[styles.metaCell, styles.metaFull]}>
                    <Text style={styles.metaLabel}>Avg Entry Salary</Text>
                    <Text style={styles.salaryValue}>
                      {occupationSalaryHint(item.title)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.nearby}>
                    <MaterialIcon
                      name="location_on"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.nearbyText} numberOfLines={1}>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.md },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  title: { ...typography.headlineLg, color: colors.text },
  titleAlt: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  saqaPill: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  saqaText: { ...typography.caption, color: colors.secondary, fontWeight: "700" },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  links: { flexDirection: "row", gap: spacing.sm },
  linkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  link: { ...typography.labelMd, color: colors.primary },
  filterLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterLabel: { ...typography.labelMd, color: colors.textSecondary },
  filterRow: { gap: spacing.sm, paddingVertical: 2 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterChipText: { ...typography.caption, color: colors.text, fontWeight: "700" },
  filterChipTextActive: { color: colors.onPrimary },
  list: { gap: spacing.md, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.card,
  },
  accentBar: { height: 4, width: "100%" },
  cardInner: { padding: spacing.lg, gap: spacing.md },
  cardTop: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardCode: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { ...typography.caption, fontWeight: "700" },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  metaCell: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 2,
  },
  metaFull: { width: "100%" },
  metaLabel: { ...typography.caption, color: colors.textMuted },
  metaValue: { ...typography.labelMd, color: colors.text },
  salaryValue: { ...typography.labelLg, color: colors.primaryDark },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nearby: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nearbyText: { ...typography.caption, color: colors.primary, flex: 1 },
  pathwayBtn: {
    minHeight: 40,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pathwayText: { ...typography.labelMd, color: colors.onPrimary },
  footerBlock: { gap: spacing.md, marginTop: spacing.sm },
  loadMore: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadMoreText: { ...typography.labelLg, color: colors.textSecondary },
  pageMeta: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  helpBanner: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helpBannerText: { ...typography.labelLg, color: colors.ochre },
  helpTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F2C094",
    overflow: "hidden",
  },
  helpFill: {
    width: "45%",
    height: "100%",
    backgroundColor: colors.gold,
  },
  error: { ...typography.bodySm, color: colors.error },
});
