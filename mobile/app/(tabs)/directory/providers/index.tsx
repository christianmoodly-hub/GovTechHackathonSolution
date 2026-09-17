import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, EmptyState, LoadingState } from "../../../../components/Screen";
import { SearchField } from "../../../../components/SearchField";
import { EntityCard } from "../../../../components/EntityCard";
import { PrimaryButton } from "../../../../components/PrimaryButton";
import { getProviderPage } from "../../../../services/ncapData";
import type { PageCursor, ProviderSummary } from "../../../../services/types";
import { colors, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";

export default function ProvidersDirectoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ProviderSummary[]>([]);
  const [cursor, setCursor] = useState<PageCursor | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (opts?: { refresh?: boolean; next?: PageCursor | null }) => {
    setError(null);
    try {
      const page = await getProviderPage({
        cursor: opts?.refresh ? null : opts?.next ?? null,
        forceRefresh: Boolean(opts?.refresh),
      });
      setItems((prev) =>
        opts?.next ? [...prev, ...page.items] : page.items,
      );
      setCursor(page.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load providers");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load({ refresh: true });
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.searchText.includes(q));
  }, [items, query]);

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <Text style={styles.kicker}>Where to study</Text>
      <Text style={styles.title}>Learning providers</Text>
      <Text style={styles.body}>
        Public universities, TVET colleges, and campuses listed in NCAP.
      </Text>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search provider or address…"
      />

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !filtered.length ? (
        <EmptyState title="No providers found" body="Try another search." />
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
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
          cursor && !query.trim() ? (
            <View style={styles.footer}>
              <PrimaryButton
                label={loadingMore ? "Loading…" : "Load more"}
                variant="secondary"
                busy={loadingMore}
                onPress={() => {
                  setLoadingMore(true);
                  void load({ next: cursor });
                }}
              />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <EntityCard
            title={item.name}
            subtitle={item.streetAddress ?? undefined}
            meta={`ID ${item.providerId}`}
            onPress={() => router.push(href(`/directory/providers/${item.id}`))}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: spacing.lg },
  kicker: {
    ...typography.labelMd,
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  list: { gap: spacing.sm, paddingBottom: spacing.xxxl },
  footer: { paddingVertical: spacing.lg },
  error: { ...typography.bodySm, color: colors.error },
});
