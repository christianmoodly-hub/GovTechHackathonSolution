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
import { Screen, EmptyState, LoadingState } from "../../../../components/Screen";
import { SearchField } from "../../../../components/SearchField";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../../components/KhethaBrandBar";
import { useVaultStats } from "../../../../hooks/useVaultStats";
import { getBursaryPage } from "../../../../services/ncapData";
import type { BursarySummary, PageCursor } from "../../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  BURSARY_FIELD_FILTERS,
  bursaryFieldAccent,
  closingUrgency,
  isExpired,
  matchesFieldFilter,
} from "../../../../utils/bursaryPresentation";

const PAGE_SIZE = 20;

type ClosingFilter = "all" | "soon" | "open";

export default function BursariesDirectoryScreen() {
  const router = useRouter();
  const vault = useVaultStats();
  const [items, setItems] = useState<BursarySummary[]>([]);
  const [cursor, setCursor] = useState<PageCursor | null>(null);
  const [query, setQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [closingFilter, setClosingFilter] = useState<ClosingFilter>("all");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(
    async (opts?: { refresh?: boolean; next?: PageCursor | null }) => {
      setError(null);
      try {
        const page = await getBursaryPage({
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
        setError(err instanceof Error ? err.message : "Failed to load bursaries");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const today = new Date().toISOString().slice(0, 10);
    return items.filter((item) => {
      if (!matchesFieldFilter(item.fieldSlug, fieldFilter)) return false;
      if (closingFilter === "open" && !item.openAllYear) return false;
      if (closingFilter === "soon") {
        if (item.openAllYear || !item.closingDateIso) return false;
        if (item.closingDateIso < today) return false;
        const days =
          (new Date(item.closingDateIso + "T12:00:00").getTime() -
            new Date(today + "T12:00:00").getTime()) /
          (1000 * 60 * 60 * 24);
        if (days > 45) return false;
      }
      if (!q) return true;
      return item.searchText.includes(q);
    });
  }, [items, query, fieldFilter, closingFilter]);

  const totalCached = Math.max(vault.bursariesCached, items.length);

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.registerRow}>
        <MaterialIcon name="payments" size={16} color={colors.textSecondary} />
        <Text style={styles.registerText}>
          Aggregated from ZABursaries · verify on the provider&apos;s site
        </Text>
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.title}>Bursaries Directory</Text>
          <Text style={styles.subtitle}>
            {totalCached.toLocaleString()} South African bursary listings
          </Text>
        </View>
        <Pressable
          style={styles.bookmarkBtn}
          onPress={() => router.push(href("/saved"))}
          accessibilityLabel="View saved bursaries"
        >
          <MaterialIcon name="bookmarks" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search bursaries, sponsors, fields…"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {(
          [
            ["all", "All"],
            ["soon", "Closing soon"],
            ["open", "Open all year"],
          ] as const
        ).map(([id, label]) => {
          const active = closingFilter === id;
          return (
            <Pressable
              key={id}
              onPress={() => setClosingFilter(id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {BURSARY_FIELD_FILTERS.map((f) => {
          const active = fieldFilter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFieldFilter(f.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {fromCache ? (
        <Text style={styles.cacheHint}>Showing cached bursaries</Text>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  if (loading && !items.length) {
    return (
      <Screen scroll={false} contentStyle={styles.fill}>
        <KhethaBrandBar />
        <OfflineStatusBar cachedCount={vault.bursariesCached} fromCache />
        <LoadingState label="Loading bursaries…" />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.bursariesCached}
        fromCache={fromCache}
        rightLabel="Saved"
        onRightPress={() => router.push(href("/saved"))}
      />
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
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
        onEndReached={() => {
          if (!cursor || loadingMore) return;
          setLoadingMore(true);
          void load({ next: cursor });
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <EmptyState
            title="No bursaries match"
            body="Try another field filter or clear your search."
          />
        }
        ListFooterComponent={
          loadingMore ? (
            <Text style={styles.footerHint}>Loading more…</Text>
          ) : null
        }
        renderItem={({ item }) => {
          const urgency = closingUrgency(
            item.closingDateIso,
            item.openAllYear,
            item.closingDate,
          );
          const accent = bursaryFieldAccent(item.fieldSlug);
          const expired = isExpired(item);
          return (
            <Pressable
              style={[styles.card, expired && styles.cardExpired]}
              onPress={() => router.push(href(`/directory/bursaries/${item.id}`))}
            >
              <View style={[styles.accentBar, { backgroundColor: accent }]} />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <View style={[styles.fieldPill, { backgroundColor: accent + "22" }]}>
                    <Text style={[styles.fieldPillText, { color: accent }]}>
                      {item.fieldLabel}
                    </Text>
                  </View>
                  <FavouriteToggle
                    compact
                    type="bursary"
                    url={item.url}
                    title={item.title}
                    entityId={item.id}
                  />
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.providerName ? (
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {item.providerName}
                  </Text>
                ) : null}
                <View style={styles.urgencyRow}>
                  <MaterialIcon
                    name={
                      urgency.tone === "closed"
                        ? "event_busy"
                        : urgency.tone === "soon"
                          ? "schedule"
                          : "event_available"
                    }
                    size={14}
                    color={
                      urgency.tone === "soon"
                        ? colors.ochre
                        : urgency.tone === "closed"
                          ? colors.textSecondary
                          : colors.success
                    }
                  />
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency.tone === "soon" && { color: colors.ochre },
                      urgency.tone === "closed" && {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    {urgency.label}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.sm },
  list: { flex: 1 },
  headerBlock: { gap: spacing.md, marginBottom: spacing.md },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  registerText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  title: { ...typography.headlineSm, color: colors.text },
  subtitle: { ...typography.bodySm, color: colors.textSecondary, marginTop: 4 },
  bookmarkBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  chipRow: { gap: spacing.sm, paddingVertical: 2 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: { ...typography.labelMd, color: colors.textSecondary },
  chipTextActive: { color: colors.onPrimary },
  cacheHint: { ...typography.caption, color: colors.ochre },
  errorText: { ...typography.bodySm, color: colors.error },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  card: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...shadows.card,
    marginBottom: spacing.md,
  },
  cardExpired: { opacity: 0.72 },
  accentBar: { width: 4 },
  cardBody: { flex: 1, padding: spacing.md, gap: 6 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  fieldPillText: { ...typography.labelMd, fontWeight: "600" },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardMeta: { ...typography.caption, color: colors.textSecondary },
  urgencyRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  urgencyText: { ...typography.labelMd, color: colors.success },
  footerHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    paddingVertical: spacing.md,
  },
});
