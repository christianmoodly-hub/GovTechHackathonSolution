import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import * as Location from "expo-location";
import { Screen, EmptyState, LoadingState } from "../../../../components/Screen";
import { SearchField } from "../../../../components/SearchField";
import { MaterialIcon } from "../../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../../components/KhethaBrandBar";
import {
  HELPLINE,
} from "../../../../data/staticContent";
import { useConnectivity } from "../../../../contexts/ConnectivityContext";
import { useVaultStats } from "../../../../hooks/useVaultStats";
import { getProviderPage } from "../../../../services/ncapData";
import {
  formatDistanceKm,
  hasGoogleMapsApiKey,
  openNearbyEducationSearch,
  openProviderInMaps,
  rankProvidersByDistance,
  type LatLng,
  type ProviderWithDistance,
} from "../../../../services/providerGeo";
import type { PageCursor, ProviderSummary } from "../../../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  PROVINCE_OPTIONS,
  matchesProvince,
  matchesProviderType,
  providerAccent,
  providerAmenities,
  providerCampusCount,
  providerCampusFootprint,
  providerCtaLabel,
  providerFocusAreas,
  providerFocusIcons,
  providerImage,
  providerLocationLabel,
  providerSpecialtyBadge,
  providerTagline,
  providerTypeBadge,
  providerTypeFilterDefs,
  type ProvinceFilterId,
  type ProviderTypeFilterId,
} from "../../../../utils/providerPresentation";

const PAGE_SIZE = 20;
const NEAR_ME_GEOCODE_LIMIT = 35;
const NEAR_ME_SHOW = 10;

export default function ProvidersDirectoryScreen() {
  const router = useRouter();
  const vault = useVaultStats();
  const { canSync } = useConnectivity();
  const [items, setItems] = useState<ProviderSummary[]>([]);
  const [cursor, setCursor] = useState<PageCursor | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProviderTypeFilterId>("all");
  const [province, setProvince] = useState<ProvinceFilterId>("all");
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const [nearMeLoading, setNearMeLoading] = useState(false);
  const [nearMeError, setNearMeError] = useState<string | null>(null);
  const [nearMeProgress, setNearMeProgress] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<LatLng | null>(null);
  const [nearby, setNearby] = useState<ProviderWithDistance[]>([]);

  const load = useCallback(
    async (opts?: { refresh?: boolean; next?: PageCursor | null }) => {
      setError(null);
      try {
        const page = await getProviderPage({
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
          err instanceof Error ? err.message : "Failed to load providers",
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
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (!matchesProviderType(item.name, item.streetAddress, typeFilter)) {
        return false;
      }
      if (!matchesProvince(item.name, item.streetAddress, province)) {
        return false;
      }
      if (!q) return true;
      return item.searchText.includes(q);
    });
  }, [items, query, typeFilter, province]);

  const runNearMe = useCallback(async () => {
    setNearMeLoading(true);
    setNearMeError(null);
    setNearMeProgress("Getting your location…");
    try {
      if (!canSync) {
        setNearMeError(
          "Near Me needs a network connection to map new campuses. Connect online once to cache locations near you.",
        );
        setNearMeProgress(null);
        setNearby([]);
        return;
      }

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setNearMeError(
          "Location permission is required to show institutions near you.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const origin: LatLng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setUserCoords(origin);

      if (!hasGoogleMapsApiKey()) {
        setNearby([]);
        setNearMeProgress(null);
        setNearMeError(
          "Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY (Geocoding API) to rank providers by distance. You can still open Google Maps near you.",
        );
        return;
      }

      const pool = filtered.length ? filtered : items;
      setNearMeProgress(`Mapping campuses (0/${Math.min(pool.length, NEAR_ME_GEOCODE_LIMIT)})…`);
      const ranked = await rankProvidersByDistance(pool, origin, {
        limit: NEAR_ME_GEOCODE_LIMIT,
        onProgress: (done, total) => {
          setNearMeProgress(`Mapping campuses (${done}/${total})…`);
        },
      });
      setNearby(ranked.slice(0, NEAR_ME_SHOW));
      setNearMeProgress(null);
    } catch (err) {
      setNearMeError(
        err instanceof Error
          ? err.message
          : "Could not determine nearby providers.",
      );
      setNearMeProgress(null);
    } finally {
      setNearMeLoading(false);
    }
  }, [filtered, items, canSync]);

  useEffect(() => {
    if (viewMode === "map" && !nearby.length && !nearMeLoading && !nearMeError) {
      void runNearMe();
    }
    // Only auto-run when switching into map mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const totalCached = Math.max(vault.providersCached, items.length);
  const typeFilters = providerTypeFilterDefs();
  const provinceShort =
    PROVINCE_OPTIONS.find((p) => p.id === province)?.short ?? "All Provinces";

  const typeCounts = useMemo(() => {
    const counts: Record<ProviderTypeFilterId, number> = {
      all: items.length,
      tvet: 0,
      uni: 0,
      uot: 0,
      cos: 0,
    };
    for (const item of items) {
      if (matchesProviderType(item.name, item.streetAddress, "tvet")) {
        counts.tvet += 1;
      }
      if (matchesProviderType(item.name, item.streetAddress, "uni")) {
        counts.uni += 1;
      }
      if (matchesProviderType(item.name, item.streetAddress, "uot")) {
        counts.uot += 1;
      }
      if (matchesProviderType(item.name, item.streetAddress, "cos")) {
        counts.cos += 1;
      }
    }
    return counts;
  }, [items]);

  const resetFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setProvince("all");
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.registerRow}>
        <MaterialIcon
          name="account_balance"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles.registerText}>Official National Registry</Text>
      </View>

      <Text style={styles.title}>Learning Providers Directory</Text>
      <Text style={styles.subtitle}>
        Lapho Ungafunda Khona · {totalCached} Public Universities & TVET
        Colleges across South Africa
      </Text>

      <View style={styles.pillRow}>
        <View style={styles.accreditedPill}>
          <Text style={styles.accreditedText}>
            {totalCached} Accredited Public Institutions
          </Text>
        </View>
        <View style={styles.zeroPill}>
          <MaterialIcon name="cell_wifi" size={14} color={colors.secondary} />
          <Text style={styles.zeroText}>Zero-Rated</Text>
        </View>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search by college name, city, town, province..."
      />

      <Text style={styles.provinceLabel}>Geographic Region (All 9 Provinces)</Text>
      <Pressable
        style={styles.provinceTrigger}
        onPress={() => setProvinceOpen(true)}
      >
        <MaterialIcon name="map" size={18} color={colors.primary} />
        <Text style={styles.provinceTriggerText} numberOfLines={1}>
          {province === "all"
            ? "All 9 Provinces (South Africa)"
            : PROVINCE_OPTIONS.find((p) => p.id === province)?.label}
        </Text>
        <MaterialIcon
          name="expand_more"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {typeFilters.map((item) => {
          const active = typeFilter === item.id;
          const count =
            item.id === "all"
              ? totalCached
              : typeCounts[item.id] || undefined;
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
              {count != null ? (
                <View
                  style={[styles.countPill, active && styles.countPillActive]}
                >
                  <Text
                    style={[
                      styles.countText,
                      active && styles.countTextActive,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <View style={styles.resultsLeft}>
          <MaterialIcon name="verified" size={16} color={colors.primary} />
          <Text style={styles.resultsText}>
            Showing{" "}
            <Text style={styles.resultsStrong}>{filtered.length}</Text> Selected
            Providers
          </Text>
        </View>
        <View style={styles.viewToggle}>
          <Pressable
            style={[
              styles.viewBtn,
              viewMode === "list" && styles.viewBtnActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <MaterialIcon
              name="view_list"
              size={16}
              color={
                viewMode === "list" ? colors.onPrimary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.viewBtnText,
                viewMode === "list" && styles.viewBtnTextActive,
              ]}
            >
              List
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.viewBtn,
              viewMode === "map" && styles.viewBtnActive,
            ]}
            onPress={() => setViewMode("map")}
          >
            <MaterialIcon
              name="location_on"
              size={16}
              color={
                viewMode === "map" ? colors.onPrimary : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.viewBtnText,
                viewMode === "map" && styles.viewBtnTextActive,
              ]}
            >
              Map
            </Text>
          </Pressable>
        </View>
      </View>

      {viewMode === "map" ? (
        <View style={styles.mapPanel}>
          <View style={styles.mapPanelHead}>
            <MaterialIcon name="pin_drop" size={28} color={colors.primary} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.mapTitle}>Interactive DHET GIS</Text>
              <Text style={styles.mapBody}>
                Nationwide public educational nodes · Near Me
              </Text>
            </View>
          </View>
          <Text style={styles.mapHint}>
            Near Me uses your location and Google Maps. Distances are approximate
            from campus addresses on the national register.
          </Text>

          <View style={styles.nearMeActions}>
            <Pressable
              style={[styles.nearMePrimary, nearMeLoading && styles.disabled]}
              disabled={nearMeLoading}
              onPress={() => void runNearMe()}
            >
              {nearMeLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <MaterialIcon
                    name="my_location"
                    size={18}
                    color={colors.onPrimary}
                  />
                  <Text style={styles.nearMePrimaryText}>Use my location</Text>
                </>
              )}
            </Pressable>
            <Pressable
              style={styles.nearMeSecondary}
              disabled={!userCoords && nearMeLoading}
              onPress={() => {
                if (userCoords) {
                  void openNearbyEducationSearch(userCoords);
                  return;
                }
                void (async () => {
                  const permission =
                    await Location.requestForegroundPermissionsAsync();
                  if (!permission.granted) {
                    setNearMeError(
                      "Location permission is required to open Google Maps near you.",
                    );
                    return;
                  }
                  const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                  });
                  const origin = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  };
                  setUserCoords(origin);
                  await openNearbyEducationSearch(origin);
                })();
              }}
            >
              <MaterialIcon name="map" size={18} color={colors.primary} />
              <Text style={styles.nearMeSecondaryText}>Open Google Maps</Text>
            </Pressable>
          </View>

          {nearMeProgress ? (
            <Text style={styles.nearMeProgress}>{nearMeProgress}</Text>
          ) : null}
          {nearMeError ? (
            <Text style={styles.nearMeError}>{nearMeError}</Text>
          ) : null}

          {nearby.length ? (
            <View style={styles.nearList}>
              <Text style={styles.nearListTitle}>
                Closest from your filters ({nearby.length})
              </Text>
              {nearby.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.nearRow}
                  onPress={() =>
                    router.push(href(`/directory/providers/${item.id}`))
                  }
                >
                  <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                    <Text style={styles.nearName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.nearMeta} numberOfLines={1}>
                      {formatDistanceKm(item.distanceKm)}
                      {item.streetAddress
                        ? ` · ${providerLocationLabel(item.name, item.streetAddress)}`
                        : ""}
                    </Text>
                  </View>
                  <Pressable
                    style={styles.nearMapsBtn}
                    onPress={() =>
                      void openProviderInMaps(
                        item.name,
                        item.streetAddress,
                        item.coords,
                      )
                    }
                    accessibilityLabel={`Open ${item.name} in maps`}
                  >
                    <MaterialIcon
                      name="directions"
                      size={18}
                      color={colors.primary}
                    />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          ) : !nearMeLoading && !nearMeError ? (
            <Text style={styles.mapHint}>
              Tap Use my location to rank campuses near you.
            </Text>
          ) : null}
        </View>
      ) : null}

      {loading ? <LoadingState label="Loading providers…" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !filtered.length ? (
        <EmptyState
          title="No institutions found"
          body="We couldn't find accredited colleges or universities matching your current filter criteria."
        />
      ) : null}
      {!loading && !filtered.length ? (
        <Pressable style={styles.resetBtn} onPress={resetFilters}>
          <Text style={styles.resetText}>Reset All Filters</Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <Screen scroll={false} contentStyle={styles.fill}>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={totalCached}
        fromCache={fromCache}
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
        detail={`${fromCache ? "Cached" : "Live"} · ${totalCached} providers on device`}
      />

      <FlatList
        data={loading || viewMode === "map" ? [] : filtered}
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
          !loading ? (
            <View style={styles.footerBlock}>
              {cursor && !query.trim() && viewMode === "list" ? (
                <Pressable
                  style={styles.loadMore}
                  disabled={loadingMore}
                  onPress={() => {
                    setLoadingMore(true);
                    void load({ next: cursor });
                  }}
                >
                  <MaterialIcon name="sync" size={20} color={colors.primary} />
                  <Text style={styles.loadMoreText}>
                    {loadingMore
                      ? "Loading…"
                      : `Load Next ${PAGE_SIZE} Providers`}
                  </Text>
                </Pressable>
              ) : null}

              <View style={styles.helpBanner}>
                <View style={styles.helpTop}>
                  <MaterialIcon
                    name="support_agent"
                    size={24}
                    color={colors.gold}
                  />
                  <Text style={styles.helpTitle}>
                    Need Help Choosing Where to Study?
                  </Text>
                </View>
                <Text style={styles.helpBody}>
                  Speak with an official DHET Khetha Career Guidance practitioner
                  for free advisory services.
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
                      name="chat"
                      size={18}
                      color={colors.onPrimary}
                    />
                    <Text style={styles.smsText}>SMS / &quot;Please Call&quot;</Text>
                  </Pressable>
                </View>
                <Text style={styles.helpHours}>
                  {HELPLINE.hours} · Toll-Free All Networks · Region:{" "}
                  {provinceShort}
                </Text>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => {
          const accent = providerAccent(item.name, item.streetAddress);
          const focuses = providerFocusAreas(item.name);
          const icons = providerFocusIcons(item.name);
          const amenities = providerAmenities(item.name);

          return (
            <View style={styles.card}>
              <View style={styles.cardHero}>
                <Image
                  source={providerImage(index)}
                  style={styles.cardHeroImage}
                  resizeMode="cover"
                />
                <View style={styles.cardHeroOverlay} />
                <View style={styles.heroBadges}>
                  <View
                    style={[styles.heroBadge, { backgroundColor: accent }]}
                  >
                    <Text style={styles.heroBadgeText}>
                      {providerTypeBadge(item.name, item.streetAddress)}
                    </Text>
                  </View>
                  <View style={styles.heroBadgeLight}>
                    <Text style={styles.heroBadgeLightText}>
                      {providerSpecialtyBadge(item.name, item.streetAddress)}
                    </Text>
                  </View>
                </View>
                <View style={styles.heroMeta}>
                  <View style={styles.heroMetaPill}>
                    <MaterialIcon
                      name="place"
                      size={14}
                      color={colors.onPrimary}
                    />
                    <Text style={styles.heroMetaText} numberOfLines={1}>
                      {providerLocationLabel(item.name, item.streetAddress)}
                    </Text>
                  </View>
                  <View style={styles.heroMetaPill}>
                    <Text style={styles.heroMetaText}>
                      {providerCampusCount(item.name)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardTagline}>
                  {providerTagline(item.name)}
                </Text>

                <View style={styles.footprint}>
                  <MaterialIcon
                    name="apartment"
                    size={16}
                    color={colors.primary}
                  />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.footprintLabel}>Campus Footprint</Text>
                    <Text style={styles.footprintBody}>
                      {providerCampusFootprint(item.name, item.streetAddress)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.focusLabel}>
                  Key Focus Areas & Specialisations:
                </Text>
                <View style={styles.focusRow}>
                  {focuses.map((focus, i) => (
                    <View key={focus} style={styles.focusChip}>
                      <MaterialIcon
                        name={icons[i % icons.length]}
                        size={14}
                        color={accent}
                      />
                      <Text style={[styles.focusText, { color: accent }]}>
                        {focus}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.amenityRow}>
                  {amenities.map((itemAmenity) => (
                    <View key={itemAmenity.label} style={styles.amenity}>
                      <MaterialIcon
                        name={itemAmenity.icon}
                        size={14}
                        color={colors.success}
                      />
                      <Text style={styles.amenityText}>
                        {itemAmenity.label}
                      </Text>
                    </View>
                  ))}
                </View>

                <Pressable
                  style={[styles.cta, { backgroundColor: accent }]}
                  onPress={() =>
                    router.push(href(`/directory/providers/${item.id}`))
                  }
                >
                  <Text style={styles.ctaText}>
                    {providerCtaLabel(item.name, item.streetAddress)}
                  </Text>
                  <MaterialIcon
                    name="arrow_forward"
                    size={18}
                    color={colors.onPrimary}
                  />
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      <Modal
        visible={provinceOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setProvinceOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setProvinceOpen(false)}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <MaterialIcon name="map" size={24} color={colors.primary} />
                <Text style={styles.modalTitle}>Browse by Province</Text>
              </View>
              <Pressable
                onPress={() => setProvinceOpen(false)}
                style={styles.modalClose}
              >
                <MaterialIcon
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {PROVINCE_OPTIONS.map((opt) => {
                const active = province === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.provinceOption,
                      active && styles.provinceOptionActive,
                    ]}
                    onPress={() => {
                      setProvince(opt.id);
                      setProvinceOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.provinceOptionText,
                        active && styles.provinceOptionTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
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
    letterSpacing: 1.1,
    fontWeight: "700",
  },
  title: {
    ...typography.headlineLg,
    color: colors.text,
    fontSize: 24,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: -4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  accreditedPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  accreditedText: {
    ...typography.caption,
    color: "#08503C",
    fontWeight: "800",
  },
  zeroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  zeroText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "800",
  },
  provinceLabel: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  provinceTrigger: {
    minHeight: 48,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  provinceTriggerText: {
    ...typography.labelMd,
    color: colors.text,
    flex: 1,
  },
  filterRow: {
    gap: spacing.sm,
    paddingVertical: 2,
    paddingRight: spacing.lg,
  },
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
  filterChipActive: { backgroundColor: colors.primaryDark },
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
    fontWeight: "700",
  },
  countTextActive: { color: colors.onPrimary },
  resultsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  resultsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  resultsText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  resultsStrong: { fontWeight: "800", color: colors.text },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: 2,
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radii.md,
  },
  viewBtnActive: { backgroundColor: colors.primary },
  viewBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  viewBtnTextActive: { color: colors.onPrimary },
  mapPanel: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  mapPanelHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  mapTitle: { ...typography.headlineSm, color: colors.text },
  mapBody: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  mapHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  nearMeActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  nearMePrimary: {
    flexGrow: 1,
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  nearMePrimaryText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  nearMeSecondary: {
    flexGrow: 1,
    minHeight: 44,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
  },
  nearMeSecondaryText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  nearMeProgress: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "600",
  },
  nearMeError: {
    ...typography.caption,
    color: colors.error,
  },
  nearList: { gap: spacing.sm },
  nearListTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  nearRow: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  nearName: { ...typography.labelLg, color: colors.text, fontWeight: "700" },
  nearMeta: { ...typography.caption, color: colors.textSecondary },
  nearMapsBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.65 },
  resetBtn: {
    alignSelf: "center",
    minHeight: 44,
    paddingHorizontal: spacing.xl,
    justifyContent: "center",
  },
  resetText: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "800",
  },
  list: { gap: spacing.md, paddingBottom: spacing.xxxl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  cardHero: {
    height: 148,
    backgroundColor: colors.muted,
  },
  cardHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  cardHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.35)",
  },
  heroBadges: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  heroBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  heroBadgeLight: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroBadgeLightText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "700",
  },
  heroMeta: {
    position: "absolute",
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  heroMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(15,23,42,0.55)",
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroMetaText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  cardBody: { padding: spacing.lg, gap: spacing.sm },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  cardTagline: { ...typography.bodySm, color: colors.textSecondary },
  footprint: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  footprintLabel: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  footprintBody: { ...typography.bodySm, color: colors.textSecondary },
  focusLabel: {
    ...typography.labelMd,
    color: colors.text,
    marginTop: 2,
  },
  focusRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  focusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  focusText: { ...typography.caption, fontWeight: "700" },
  amenityRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  amenity: { flexDirection: "row", alignItems: "center", gap: 4 },
  amenityText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  cta: {
    minHeight: 48,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  ctaText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  footerBlock: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
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
  },
  loadMoreText: { ...typography.labelLg, color: colors.primary },
  helpBanner: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  helpTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  helpTitle: {
    ...typography.headlineSm,
    color: colors.text,
    flex: 1,
  },
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  helpActions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  callBtn: {
    flex: 1,
    minWidth: 140,
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
  helpHours: {
    ...typography.caption,
    color: colors.textMuted,
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
  provinceOption: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  provinceOptionActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  provinceOptionText: { ...typography.bodyMd, color: colors.text },
  provinceOptionTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
