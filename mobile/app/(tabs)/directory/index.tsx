import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen, EmptyState, LoadingState } from "../../../components/Screen";
import { SearchField } from "../../../components/SearchField";
import { EntityCard } from "../../../components/EntityCard";
import { getOccupationSummaries } from "../../../services/ncapData";
import type { OccupationSummary } from "../../../services/types";
import { colors, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";

export default function CareersDirectoryScreen() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<OccupationSummary[]>([]);
  const [query, setQuery] = useState("");
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
    if (!q) return summaries;
    return summaries.filter((item) => item.searchText.includes(q));
  }, [summaries, query]);

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <Text style={styles.kicker}>Directory</Text>
      <Text style={styles.title}>Careers directory</Text>
      <Text style={styles.body}>
        Government-vetted occupation pathways from the NCAP database.
        {fromCache ? " Showing cached index." : ""}
      </Text>

      <View style={styles.links}>
        <Pressable onPress={() => router.push(href("/directory/qualifications"))}>
          <Text style={styles.link}>Qualifications →</Text>
        </Pressable>
        <Pressable onPress={() => router.push(href("/directory/providers"))}>
          <Text style={styles.link}>Providers →</Text>
        </Pressable>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search title, code, or alternative titles"
      />

      {loading ? <LoadingState label="Loading occupations…" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !filtered.length ? (
        <EmptyState
          title="No careers found"
          body="Try a different search term."
        />
      ) : null}

      <FlatList
        data={filtered}
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
        renderItem={({ item }) => (
          <EntityCard
            title={item.title}
            subtitle={`OFO ${item.occupationCode}`}
            meta={
              item.alternativeTitles?.length
                ? item.alternativeTitles.slice(0, 2).join(" · ")
                : undefined
            }
            onPress={() =>
              router.push(href(`/directory/occupations/${item.occupationCode}`))
            }
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
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  links: { flexDirection: "row", gap: spacing.xl },
  link: { ...typography.labelLg, color: colors.secondary },
  list: { gap: spacing.sm, paddingBottom: spacing.xxxl },
  error: { ...typography.bodySm, color: colors.error },
});
