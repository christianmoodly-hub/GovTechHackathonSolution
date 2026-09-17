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
import { Screen, EmptyState, LoadingState } from "../../../../components/Screen";
import { SearchField } from "../../../../components/SearchField";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../../components/KhethaBrandBar";
import {
  HELPLINE,
  OFFLINE_VAULT_STATS,
} from "../../../../data/staticContent";
import { getQualificationPage } from "../../../../services/ncapData";
import type {
  PageCursor,
  QualificationSummary,
} from "../../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  APS_OPTIONS,
  matchesApsFilter,
  matchesQualType,
  qualificationAccent,
  qualificationCreditsHint,
  qualificationDurationHint,
  qualificationEntryHint,
  qualificationNqfLabel,
  qualificationProvidersHint,
  qualificationSaqaId,
  qualificationTags,
  qualTypeFilterDefs,
  tagToneColors,
  type ApsFilterId,
  type QualTypeFilterId,
} from "../../../../utils/qualificationPresentation";

const PAGE_SIZE = 20;

export default function QualificationsDirectoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<QualificationSummary[]>([]);
  const [cursor, setCursor] = useState<PageCursor | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<QualTypeFilterId>("all");
  const [apsFilter, setApsFilter] = useState<ApsFilterId>("all");
  const [apsOpen, setApsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(
    async (opts?: { refresh?: boolean; next?: PageCursor | null }) => {
      setError(null);
      try {
        const page = await getQualificationPage({
          cursor: opts?.refresh ? null : (opts?.next ?? null),
          pageSize: PAGE_SIZE,
          forceRefresh: Boolean(opts?.refresh),
        });
        setItems((prev) =>
          opts?.next ? [...prev, ...page.items] : page.items,
        );
        setCursor(page.nextCursor);
        setFromCache(page.fromCache);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load qualifications",
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load({ refresh: true });
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (!matchesQualType(item.title, typeFilter)) return false;
      if (!matchesApsFilter(item.title, item.nqfLevel, apsFilter)) return false;
      if (!q) return true;
      return item.searchText.includes(q);
    });
  }, [items, query, typeFilter, apsFilter]);

  const totalCached = OFFLINE_VAULT_STATS.qualificationsCached;
  const typeFilters = qualTypeFilterDefs();
  const apsShort =
    APS_OPTIONS.find((o) => o.id === apsFilter)?.short ?? "Any APS";

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.registerRow}>
        <MaterialIcon name="school" size={16} color={colors.textSecondary} />
        <Text style={styles.registerText}>DHET · SAQA National Register</Text>
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.title}>Qualifications Directory</Text>
          <Text style={styles.subtitle}>
            {totalCached.toLocaleString()} Accredited South African
            Qualifications (SAQA Vetted)
          </Text>
        </View>
        <Pressable
          style={styles.bookmarkBtn}
          onPress={() => router.push(href("/saved"))}
          accessibilityLabel="View saved qualifications"
        >
          <MaterialIcon name="bookmarks" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.offlinePill}>
        <View style={styles.offlineDot} />
        <Text style={styles.offlineText}>
          Offline Active · {totalCached} Qualifications
        </Text>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search qualification title, SAQA ID, field..."
      />

      <View style={styles.apsRow}>
        <Pressable style={styles.apsTrigger} onPress={() => setApsOpen(true)}>
          <Text style={styles.apsTriggerText} numberOfLines={1}>
            {apsFilter === "all"
              ? "Filter by APS (e.g. Any APS)"
              : APS_OPTIONS.find((o) => o.id === apsFilter)?.label}
          </Text>
          <MaterialIcon
            name="expand_more"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>
        <Pressable style={styles.filtersBtn} onPress={() => setApsOpen(true)}>
          <MaterialIcon name="tune" size={18} color={colors.primary} />
          <Text style={styles.filtersBtnText}>Filters</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {typeFilters.map((item) => {
          const active = typeFilter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setTypeFilter(item.id)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {loading ? <LoadingState label="Loading qualifications…" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          title="No qualifications found"
          body="Try another search, APS band, or qualification type."
        />
      ) : null}
    </View>
  );

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={items.length}
        fromCache={fromCache}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
        detail={`Offline Database Active · ${totalCached} Qualifications · Updated yesterday`}
      />

      <FlatList
        data={loading ? [] : filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load({ refresh: true });
            }}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          !loading && (filtered.length > 0 || cursor) ? (
            <View style={styles.footerBlock}>
              <Text style={styles.pageMeta}>
                Showing {filtered.length.toLocaleString()} of{" "}
                {items.length.toLocaleString()} loaded · APS {apsShort}
              </Text>
              {cursor && !query.trim() ? (
                <Pressable
                  style={styles.loadMore}
                  disabled={loadingMore}
                  onPress={() => {
                    setLoadingMore(true);
                    void load({ next: cursor });
                  }}
                >
                  <MaterialIcon
                    name="sync"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.loadMoreText}>
                    {loadingMore
                      ? "Loading…"
                      : `Load Next ${PAGE_SIZE} Qualifications`}
                  </Text>
                </Pressable>
              ) : null}

              <View style={styles.helpBanner}>
                <View style={styles.helpTop}>
                  <View style={styles.helpTitleRow}>
                    <MaterialIcon
                      name="support_agent"
                      size={24}
                      color={colors.gold}
                    />
                    <Text style={styles.helpTitle}>Need Career Guidance?</Text>
                  </View>
                  <View style={styles.tollPill}>
                    <Text style={styles.tollText}>Toll Free</Text>
                  </View>
                </View>
                <Text style={styles.helpBody}>
                  Speak directly with an accredited DHET Khetha Career Advisor
                  for qualification matching, entry path verification, and
                  bursary assistance.
                </Text>
                <View style={styles.helpActions}>
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
                  <Pressable
                    style={styles.smsBtn}
                    onPress={() =>
                      void Linking.openURL(`sms:${HELPLINE.whatsapp}`)
                    }
                  >
                    <MaterialIcon
                      name="sms"
                      size={18}
                      color={colors.onPrimary}
                    />
                    <Text style={styles.smsText}>SMS &quot;Khetha&quot;</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const accent = qualificationAccent(item.title);
          const tags = qualificationTags(item.title);
          const saqa = qualificationSaqaId(item.id, item.qualificationId);
          const nqf = qualificationNqfLabel(item.nqfLevel);
          const credits = qualificationCreditsHint(item.title, item.nqfLevel);
          const duration = qualificationDurationHint(
            item.title,
            item.duration,
          );
          const entry = qualificationEntryHint(item.title, item.nqfLevel);
          const providers = qualificationProvidersHint(
            item.title,
            item.providerCount,
          );
          const qualUrl = `ncap://qualification/${item.id}`;

          return (
            <View style={styles.card}>
              <View
                style={[styles.accentBar, { backgroundColor: accent }]}
              />
              <View style={styles.cardInner}>
                <View style={styles.badgeRow}>
                  <View style={styles.badges}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>SAQA ID: {saqa}</Text>
                    </View>
                    <View style={[styles.badge, styles.badgeNqf]}>
                      <Text style={[styles.badgeText, styles.badgeNqfText]}>
                        {nqf}
                      </Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={styles.badgeMuted}>{credits}</Text>
                    </View>
                  </View>
                  <FavouriteToggle
                    compact
                    type="qualification"
                    url={qualUrl}
                    title={item.title}
                    entityId={item.id}
                  />
                </View>

                <Text style={styles.cardTitle} numberOfLines={3}>
                  {item.title}
                </Text>
                <View style={styles.durationRow}>
                  <MaterialIcon
                    name="schedule"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.durationText} numberOfLines={2}>
                    {duration}
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
                        <MaterialIcon
                          name={tag.icon}
                          size={14}
                          color={tone.fg}
                        />
                        <Text style={[styles.tagText, { color: tone.fg }]}>
                          {tag.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.entryBox}>
                  <View style={styles.entryHeader}>
                    <MaterialIcon
                      name="verified"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.entryLabel}>
                      Minimum Entry Requirements
                    </Text>
                  </View>
                  <Text style={styles.entryBody}>{entry}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.providers}>
                    <MaterialIcon
                      name="apartment"
                      size={18}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.providersText} numberOfLines={2}>
                      {providers}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.detailsBtn}
                    onPress={() =>
                      router.push(href(`/directory/qualifications/${item.id}`))
                    }
                  >
                    <Text style={styles.detailsText}>View Details</Text>
                    <MaterialIcon
                      name="arrow_forward"
                      size={16}
                      color={colors.primary}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={apsOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setApsOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setApsOpen(false)}
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
                <Text style={styles.modalTitle}>Filter by APS score</Text>
              </View>
              <Pressable
                onPress={() => setApsOpen(false)}
                style={styles.modalClose}
                accessibilityLabel="Close APS filter"
              >
                <MaterialIcon
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <View style={styles.apsList}>
              {APS_OPTIONS.map((opt) => {
                const active = apsFilter === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.apsOption,
                      active && styles.apsOptionActive,
                    ]}
                    onPress={() => {
                      setApsFilter(opt.id);
                      setApsOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.apsOptionText,
                        active && styles.apsOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.resetBtn}
              onPress={() => {
                setApsFilter("all");
                setTypeFilter("all");
                setApsOpen(false);
              }}
            >
              <Text style={styles.resetText}>Reset filters</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.sm },
  headerBlock: { gap: spacing.md, marginBottom: spacing.sm },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  registerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  title: {
    ...typography.headlineLg,
    color: colors.text,
    fontSize: 24,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bookmarkBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  offlinePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  offlineText: {
    ...typography.caption,
    color: "#08503C",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  apsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  apsTrigger: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    ...shadows.card,
  },
  apsTriggerText: {
    ...typography.labelMd,
    color: colors.text,
    flex: 1,
  },
  filtersBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...shadows.card,
  },
  filtersBtnText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  filterRow: {
    gap: spacing.sm,
    paddingVertical: 2,
    paddingRight: spacing.lg,
  },
  filterChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 36,
    justifyContent: "center",
    ...shadows.card,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
  },
  filterChipText: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "600",
  },
  filterChipTextActive: { color: colors.onPrimary },
  list: { gap: spacing.md, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
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
  cardInner: {
    padding: spacing.lg,
    paddingLeft: spacing.lg + 6,
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  badges: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    minWidth: 0,
  },
  badge: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeNqf: {
    backgroundColor: "#DEE8FF",
  },
  badgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  badgeNqfText: {
    color: colors.primary,
  },
  badgeMuted: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  cardTitle: {
    ...typography.headlineSm,
    color: colors.text,
    lineHeight: 24,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  durationText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 1,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    ...typography.labelMd,
    fontWeight: "700",
  },
  entryBox: {
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: 10,
    gap: 4,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  entryLabel: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  entryBody: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingTop: 4,
  },
  providers: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  providersText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    flex: 1,
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  detailsText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  footerBlock: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  pageMeta: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  loadMore: {
    minHeight: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  loadMoreText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  helpBanner: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helpTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  helpTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  helpTitle: {
    ...typography.headlineSm,
    color: colors.onPrimary,
    flexShrink: 1,
  },
  tollPill: {
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tollText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  helpBody: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.9)",
  },
  helpActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: 4,
  },
  callBtn: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.gold,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  callText: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  smsBtn: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  smsText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  error: { ...typography.bodySm, color: colors.error },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    maxHeight: "80%",
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
  modalTitle: {
    ...typography.headlineSm,
    color: colors.text,
  },
  modalClose: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  apsList: { gap: spacing.sm },
  apsOption: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  apsOptionActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  apsOptionText: {
    ...typography.bodyMd,
    color: colors.text,
  },
  apsOptionTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  resetBtn: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    ...typography.labelLg,
    color: colors.textSecondary,
  },
});
