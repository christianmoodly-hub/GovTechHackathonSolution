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
import { getProvider } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Provider } from "../../../../services/types";
import { OFFLINE_VAULT_STATS } from "../../../../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  STITCH_PROVIDER_DETAIL_HERO,
  providerAccent,
  providerCampusHubs,
  providerCrumbType,
  providerDetailStats,
  providerFaculties,
  providerHeadOffice,
  providerHeroBadges,
  providerShortCode,
  providerTagline,
  providerWebsiteHost,
} from "../../../../utils/providerPresentation";

const NSFAS_URL = "https://www.nsfas.org.za/";

export default function ProviderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCampus, setOpenCampus] = useState<string>("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) {
        setError("Missing provider id");
        setLoading(false);
        return;
      }
      try {
        const data = await getProvider(String(id));
        if (!alive) return;
        if (!data) setError("Provider not found");
        setProvider(data);
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load provider",
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const name = provider?.name ?? "";
  const hubs = useMemo(
    () => (name ? providerCampusHubs(name, provider?.streetAddress) : []),
    [name, provider?.streetAddress],
  );
  const faculties = useMemo(
    () =>
      name
        ? providerFaculties(
            name,
            (provider?.offeredQualifications ?? []).map((q) => q.title),
          )
        : [],
    [name, provider?.offeredQualifications],
  );
  const stats = useMemo(
    () =>
      name
        ? providerDetailStats(
            name,
            provider?.offeredQualifications?.length,
          )
        : [],
    [name, provider?.offeredQualifications],
  );

  useEffect(() => {
    if (hubs.length) setOpenCampus(hubs[0].id);
  }, [hubs]);

  const onShare = async () => {
    if (!provider) return;
    try {
      await Share.share({
        message: `${provider.name} — Khetha NCAP`,
        title: provider.name,
      });
    } catch {
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }
  };

  const openQual = async (saqaUrl?: string | null, title?: string) => {
    if (saqaUrl) {
      const qualId = await stableUrlId(saqaUrl);
      router.push(href(`/directory/qualifications/${qualId}`));
      return;
    }
    if (title) {
      router.push(href("/directory/qualifications"));
    }
  };

  const tel = provider?.telephone?.replace(/\s+/g, "") ?? null;
  const website = provider?.website ?? null;
  const websiteLabel = providerWebsiteHost(website);
  const headOffice = name
    ? providerHeadOffice(name, provider?.streetAddress)
    : null;
  const badges = name
    ? providerHeroBadges(name, provider?.streetAddress)
    : null;
  const accent = name
    ? providerAccent(name, provider?.streetAddress)
    : colors.primary;
  const applicationUrl = website
    ? website.startsWith("http")
      ? website
      : `https://${website}`
    : "https://www.tvetcolleges.co.za/";

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.providersCached}
        fromCache
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
      />

      <View style={styles.navRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to providers"
        >
          <MaterialIcon
            name="arrow_back_ios"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.backText}>Providers</Text>
        </Pressable>
        <View style={styles.navActions}>
          {provider ? (
            <FavouriteToggle
              compact
              type="provider"
              url={provider.url}
              title={provider.name}
              entityId={provider.id}
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

      {toast ? (
        <View style={styles.toast}>
          <MaterialIcon name="check_circle" size={16} color={colors.success} />
          <Text style={styles.toastText}>Institution link copied!</Text>
        </View>
      ) : null}

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {provider && badges && headOffice ? (
        <View style={styles.block}>
          <View style={styles.crumb}>
            <Text style={styles.crumbText}>Providers</Text>
            <MaterialIcon
              name="chevron_right"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.crumbText} numberOfLines={1}>
              {providerCrumbType(provider.name, provider.streetAddress)}
            </Text>
            <MaterialIcon
              name="chevron_right"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.crumbActive}>
              {providerShortCode(provider.name)}
            </Text>
          </View>

          <View style={styles.hero}>
            <Image
              source={STITCH_PROVIDER_DETAIL_HERO}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroBadgeTop}>
              <MaterialIcon name="verified" size={14} color={colors.primary} />
              <Text style={styles.heroBadgeTopText}>{badges.primary}</Text>
            </View>
            <View style={styles.heroBadgeBottom}>
              <MaterialIcon name="electric_bolt" size={14} color={colors.text} />
              <Text style={styles.heroBadgeBottomText}>{badges.secondary}</Text>
            </View>
          </View>

          <Text style={styles.title}>{provider.name}</Text>
          <Text style={styles.tagline}>{providerTagline(provider.name)}</Text>

          <View style={styles.grid}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.gridCard}>
                <MaterialIcon name={stat.icon} size={20} color={accent} />
                <Text style={styles.gridLabel}>{stat.label}</Text>
                <Text style={styles.gridValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.sectionTitleRow}>
                <MaterialIcon name="hub" size={20} color={colors.primary} />
                <Text style={styles.sectionHeading}>Contact & Head Office</Text>
              </View>
              <View style={styles.verifiedPill}>
                <Text style={styles.verifiedText}>Verified Contact</Text>
              </View>
            </View>

            <View style={styles.addressRow}>
              <MaterialIcon
                name="location_on"
                size={18}
                color={colors.primary}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.addressTitle}>{headOffice.title}</Text>
                <Text style={styles.addressBody}>{headOffice.address}</Text>
              </View>
            </View>

            <View style={styles.contactActions}>
              {tel ? (
                <Pressable
                  style={[styles.callBtn, { backgroundColor: accent }]}
                  onPress={() => void Linking.openURL(`tel:${tel}`)}
                >
                  <MaterialIcon
                    name="phone_in_talk"
                    size={18}
                    color={colors.onPrimary}
                  />
                  <View>
                    <Text style={styles.callLabel}>General Inquiries</Text>
                    <Text style={styles.callNumber}>
                      {provider.telephone}
                    </Text>
                  </View>
                </Pressable>
              ) : null}
              {provider.email ? (
                <Pressable
                  style={styles.emailBtn}
                  onPress={() =>
                    void Linking.openURL(`mailto:${provider.email}`)
                  }
                >
                  <MaterialIcon name="mail" size={18} color={accent} />
                  <Text style={[styles.emailText, { color: accent }]}>
                    Get Email
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {provider.email ? (
              <View style={styles.linkRow}>
                <MaterialIcon name="mail" size={16} color={colors.textMuted} />
                <Text style={styles.linkText}>{provider.email}</Text>
              </View>
            ) : null}
            {websiteLabel ? (
              <Pressable
                style={styles.linkRow}
                onPress={() => void Linking.openURL(applicationUrl)}
              >
                <MaterialIcon
                  name="language"
                  size={16}
                  color={colors.textMuted}
                />
                <Text style={styles.linkAccent}>{websiteLabel}</Text>
                <MaterialIcon
                  name="open_in_new"
                  size={14}
                  color={colors.primary}
                />
              </Pressable>
            ) : null}
            <Text style={styles.zeroNote}>
              Free zero-rated data via state network
            </Text>

            <View style={styles.advisory}>
              <MaterialIcon
                name="support_agent"
                size={18}
                color={colors.primary}
              />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.advisoryTitle}>
                  Walk-in Career Advisory Office
                </Text>
                <Text style={styles.advisoryBody}>
                  Student Support Centre, Block B
                </Text>
                <Text style={styles.advisoryHours}>
                  Mon–Fri: 08:00 – 15:30 (No appointment required)
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon
                name="apartment"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionHeading}>Campuses & Learning Hubs</Text>
            </View>
            <View style={styles.metaPill}>
              <Text style={styles.metaPillText}>
                {hubs.length} Key Centers
              </Text>
            </View>
          </View>

          {hubs.map((hub) => {
            const open = openCampus === hub.id;
            return (
              <View key={hub.id} style={styles.hubCard}>
                <Pressable
                  style={styles.hubHeader}
                  onPress={() =>
                    setOpenCampus((prev) => (prev === hub.id ? "" : hub.id))
                  }
                >
                  <View style={styles.hubIcon}>
                    <MaterialIcon
                      name={hub.icon}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.hubName}>{hub.name}</Text>
                    <Text style={styles.hubSub}>{hub.subtitle}</Text>
                  </View>
                  <MaterialIcon
                    name={open ? "expand_less" : "expand_more"}
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
                {open ? (
                  <View style={styles.hubBody}>
                    <Text style={styles.hubFocusLabel}>Focus Capabilities:</Text>
                    <Text style={styles.hubFocus}>{hub.focus}</Text>
                    <View style={styles.hubAddress}>
                      <MaterialIcon
                        name="pin_drop"
                        size={16}
                        color={colors.textMuted}
                      />
                      <Text style={styles.hubAddressText}>{hub.address}</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}

          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon name="category" size={20} color={colors.primary} />
              <Text style={styles.sectionHeading}>Faculties & Programmes</Text>
            </View>
            <Pressable
              onPress={() => router.push(href("/directory/qualifications"))}
            >
              <Text style={styles.viewAll}>
                {provider.offeredQualifications?.length
                  ? `View All ${provider.offeredQualifications.length}`
                  : "NQF 2 to 6"}
              </Text>
            </Pressable>
          </View>

          {faculties.map((fac) => (
            <View key={fac.id} style={styles.facultyCard}>
              <View style={styles.facultyTop}>
                <Text style={styles.facultyTitle}>{fac.title}</Text>
                <View style={styles.facultyBadge}>
                  <Text style={styles.facultyBadgeText}>{fac.badge}</Text>
                </View>
              </View>
              <Text style={styles.facultyBody}>{fac.body}</Text>
              <View style={styles.facultyTags}>
                {fac.tags.map((tag) => (
                  <View key={tag} style={styles.facultyTag}>
                    <Text style={styles.facultyTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {(provider.offeredQualifications?.length ?? 0) > 0 ? (
            <View style={styles.offeredList}>
              <Text style={styles.offeredTitle}>Listed on this NCAP record</Text>
              {provider.offeredQualifications.slice(0, 8).map((qual, index) => (
                <Pressable
                  key={`${qual.title}-${index}`}
                  style={styles.offeredRow}
                  onPress={() => void openQual(qual.saqa_url, qual.title)}
                >
                  <Text style={styles.offeredText} numberOfLines={2}>
                    {qual.title}
                    {qual.nqf_level ? ` · ${qual.nqf_level}` : ""}
                  </Text>
                  <MaterialIcon
                    name="chevron_right"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.nsfasCard}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcon
                name="account_balance_wallet"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.sectionHeading}>
                NSFAS Bursary Guide for {providerShortCode(provider.name)}
              </Text>
            </View>
            <Text style={styles.nsfasSub}>
              100% Free Tuition & Allowances for Qualifiers
            </Text>
            <View style={styles.nsfasPoint}>
              <MaterialIcon
                name="check_circle"
                size={18}
                color={colors.success}
              />
              <Text style={styles.nsfasPointText}>
                Full bursary coverage for South African citizens with annual
                combined household income below{" "}
                <Text style={styles.nsfasStrong}>R350,000</Text> (or R600,000
                for students with disabilities).
              </Text>
            </View>
            {[
              {
                n: "1",
                title: "Create your myNSFAS Profile",
                body: "Register online at nsfas.org.za using your South African ID and personal cell number.",
              },
              {
                n: "2",
                title: "Receive Campus Reference Number",
                body: "Complete free online pre-enrolment on the college portal to link your NSFAS application profile.",
              },
              {
                n: "3",
                title: "Tuition & Reg Fees 100% Waived",
                body: "Once provisionally funded, no registration deposits or textbook levies may be charged.",
              },
            ].map((step) => (
              <View key={step.n} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{step.n}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepBody}>{step.body}</Text>
                </View>
              </View>
            ))}
            <Pressable
              style={styles.nsfasLink}
              onPress={() => void Linking.openURL(NSFAS_URL)}
            >
              <Text style={styles.nsfasLinkText}>Open NSFAS portal</Text>
              <MaterialIcon
                name="open_in_new"
                size={16}
                color={colors.primary}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.applyBtn, { backgroundColor: accent }]}
            onPress={() => void Linking.openURL(applicationUrl)}
          >
            <Text style={styles.applyBtnText}>
              Visit College Application Portal
            </Text>
            <MaterialIcon
              name="open_in_new"
              size={18}
              color={colors.onPrimary}
            />
          </Pressable>

          {tel || provider.email ? (
            <Pressable
              style={styles.advisorBtn}
              onPress={() =>
                tel
                  ? void Linking.openURL(`tel:${tel}`)
                  : void Linking.openURL(`mailto:${provider.email}`)
              }
            >
              <MaterialIcon
                name="support_agent"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.advisorText}>
                Contact Campus Career Advisor
              </Text>
            </Pressable>
          ) : null}

          <View style={styles.verifiedFooter}>
            <MaterialIcon name="lock" size={14} color={colors.textMuted} />
            <Text style={styles.verifiedFooterText}>
              Official DHET Khetha Verified Institutional Profile
            </Text>
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
  toast: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: spacing.sm,
  },
  toastText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  error: { ...typography.bodySm, color: colors.error },
  block: { gap: spacing.md, paddingBottom: spacing.xxxl },
  crumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    flexWrap: "wrap",
  },
  crumbText: { ...typography.caption, color: colors.textMuted },
  crumbActive: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "800",
  },
  hero: {
    height: 180,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.muted,
    ...shadows.card,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.28)",
  },
  heroBadgeTop: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeTopText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "800",
    flexShrink: 1,
  },
  heroBadgeBottom: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroBadgeBottomText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
  },
  title: { ...typography.headlineLg, color: colors.text, fontSize: 24 },
  tagline: { ...typography.bodyMd, color: colors.textSecondary },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  gridCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: 4,
  },
  gridLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  gridValue: { ...typography.labelLg, color: colors.text, fontWeight: "800" },
  contactCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  contactHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
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
  verifiedPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verifiedText: {
    ...typography.caption,
    color: "#08503C",
    fontWeight: "800",
  },
  addressRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  addressTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  addressBody: { ...typography.bodySm, color: colors.textSecondary },
  contactActions: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  callBtn: {
    flex: 1,
    minWidth: 160,
    minHeight: 56,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  callLabel: {
    ...typography.caption,
    color: "rgba(255,255,255,0.85)",
  },
  callNumber: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  emailBtn: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emailText: { ...typography.labelLg, fontWeight: "800" },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  linkText: { ...typography.bodySm, color: colors.textSecondary },
  linkAccent: {
    ...typography.bodySm,
    color: colors.primary,
    fontWeight: "700",
    flexShrink: 1,
  },
  zeroNote: {
    ...typography.caption,
    color: colors.textMuted,
  },
  advisory: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  advisoryTitle: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "800",
  },
  advisoryBody: { ...typography.bodySm, color: colors.textSecondary },
  advisoryHours: { ...typography.caption, color: colors.textMuted },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaPill: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  viewAll: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  hubCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  hubHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    minHeight: 64,
  },
  hubIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  hubName: { ...typography.labelLg, color: colors.text },
  hubSub: { ...typography.caption, color: colors.textMuted },
  hubBody: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  hubFocusLabel: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  hubFocus: { ...typography.bodySm, color: colors.textSecondary },
  hubAddress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  hubAddressText: { ...typography.caption, color: colors.textMuted },
  facultyCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  facultyTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  facultyTitle: {
    ...typography.headlineSm,
    color: colors.text,
    flex: 1,
  },
  facultyBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  facultyBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "800",
  },
  facultyBody: { ...typography.bodySm, color: colors.textSecondary },
  facultyTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  facultyTag: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  facultyTagText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  offeredList: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.xs,
    ...shadows.card,
  },
  offeredTitle: {
    ...typography.labelMd,
    color: colors.textMuted,
    marginBottom: 4,
  },
  offeredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  offeredText: {
    ...typography.bodySm,
    color: colors.text,
    flex: 1,
  },
  nsfasCard: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: "#83D7B4",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  nsfasSub: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  nsfasPoint: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  nsfasPointText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 1,
  },
  nsfasStrong: { fontWeight: "800", color: colors.text },
  stepRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-start",
    marginTop: 4,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  stepTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  stepBody: { ...typography.bodySm, color: colors.textSecondary },
  nsfasLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  nsfasLinkText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "800",
  },
  applyBtn: {
    minHeight: 52,
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
  advisorBtn: {
    minHeight: 48,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  advisorText: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "800",
  },
  verifiedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: spacing.sm,
  },
  verifiedFooterText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});
