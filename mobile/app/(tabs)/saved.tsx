import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import { Screen } from "../../components/Screen";
import { MaterialIcon } from "../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../components/KhethaBrandBar";
import { FavouriteToggle } from "../../components/FavouriteToggle";
import { LanguagePicker } from "../../components/LanguagePicker";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useConnectivity } from "../../contexts/ConnectivityContext";
import { useLocale } from "../../contexts/LocaleContext";
import {
  LANGUAGES,
  LEARNER_ROLES,
} from "../../data/staticContent";
import { useVaultStats } from "../../hooks/useVaultStats";
import {
  listOfflineBlueprints,
  type OfflineBlueprint,
} from "../../services/offlineBlueprint";
import {
  prepareOfflinePack,
  syncVault,
} from "../../services/offlineVault";
import { stableUrlId } from "../../services/ids";
import type {
  FavouriteRef,
  FavouriteType,
  QuestionnaireId,
  QuestionnaireResult,
} from "../../services/types";
import { colors, radii, shadows, spacing, typography } from "../../theme";
import { href } from "../../utils/href";
import {
  domainBadges,
  occupationPathwayHint,
  occupationSalaryHint,
  occupationTags,
  STITCH_RESULT_IMAGES,
  tagToneColors,
} from "../../utils/occupationPresentation";

const PROFILE_THUMBS = [
  require("../../assets/stitch/profile/img0.jpg"),
  require("../../assets/stitch/profile/img1.jpg"),
] as const;

type VaultFilter = "all" | FavouriteType;

export default function SavedScreen() {
  const router = useRouter();
  const { user, profile, signOut, syncPending, profileFromCache, refreshProfile } =
    useAuth();
  const { canSync } = useConnectivity();
  const vault = useVaultStats();
  const { highContrast, setHighContrast, textScale, zoomLabel } =
    useAccessibility();
  const { locale, home, tabs, common } = useLocale();
  const [filter, setFilter] = useState<VaultFilter>("all");
  const [blueprints, setBlueprints] = useState<OfflineBlueprint[]>([]);
  const [vaultBusy, setVaultBusy] = useState(false);
  const [personaMode, setPersonaMode] = useState<"learner" | "seeker">(() =>
    profile?.demographics?.role === "work_seeker" ? "seeker" : "learner",
  );

  const roleLabel =
    LEARNER_ROLES.find((item) => item.id === profile?.demographics?.role)
      ?.label ?? "Learner";
  const languageLabel =
    LANGUAGES.find((item) => item.id === locale)?.label ?? "English";

  const displayName =
    profile?.demographics?.fullName?.trim() ||
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "Guest explorer";

  const province = profile?.demographics?.province ?? "South Africa";
  const refId = shortRef(user?.uid ?? profile?.id ?? "guest");
  const isVerified = Boolean(user && !user.isAnonymous && user.emailVerified);

  const favourites = profile?.favourites ?? [];
  const filteredFavourites = useMemo(() => {
    if (filter === "all") return favourites;
    return favourites.filter((item) => item.type === filter);
  }, [favourites, filter]);

  const counts = useMemo(
    () => ({
      all: favourites.length,
      occupation: favourites.filter((f) => f.type === "occupation").length,
      qualification: favourites.filter((f) => f.type === "qualification")
        .length,
      provider: favourites.filter((f) => f.type === "provider").length,
    }),
    [favourites],
  );

  const diagnostics = useMemo(() => {
    const map = profile?.questionnaireResults ?? {};
    return (
      Object.entries(map) as Array<
        [QuestionnaireId, QuestionnaireResult | undefined]
      >
    ).filter((entry): entry is [QuestionnaireId, QuestionnaireResult] =>
      Boolean(entry[1]?.matches?.length || entry[1]?.completedAt),
    );
  }, [profile?.questionnaireResults]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void listOfflineBlueprints().then((items) => {
        if (alive) setBlueprints(items);
      });
      vault.refresh();
      return () => {
        alive = false;
      };
    }, [vault.refresh]),
  );

  const onPrepareOfflinePack = async () => {
    if (!canSync) {
      Alert.alert(
        "Connect to prepare",
        "You need an internet connection once to download the offline pack.",
      );
      return;
    }
    setVaultBusy(true);
    try {
      const result = await prepareOfflinePack({
        uid: user?.uid,
        favourites: profile?.favourites ?? [],
      });
      vault.refresh();
      Alert.alert(
        "Offline pack ready",
        `${result.careers.toLocaleString()} careers, ${result.qualifications} qualifications, ${result.providers} campuses, and ${result.favouritesCached} favourites cached on this device.`,
      );
    } catch (err) {
      Alert.alert(
        "Could not prepare offline pack",
        err instanceof Error ? err.message : "Try again when online.",
      );
    } finally {
      setVaultBusy(false);
    }
  };

  const onSyncVault = async () => {
    if (!canSync) {
      Alert.alert(
        "Offline",
        "Connect to the internet to sync favourites, results, and helpline requests.",
      );
      return;
    }
    setVaultBusy(true);
    try {
      const result = await syncVault({ uid: user?.uid, online: true });
      await refreshProfile();
      vault.refresh();
      Alert.alert(
        "Vault synced",
        `Synced ${result.profileFlushed} profile change(s) and ${result.helplineFlushed} helpline request(s). Careers cache: ${result.refreshedCareers.toLocaleString()}.`,
      );
    } catch (err) {
      Alert.alert(
        "Sync failed",
        err instanceof Error ? err.message : "Try again shortly.",
      );
    } finally {
      setVaultBusy(false);
    }
  };

  const openBlueprint = async (item: OfflineBlueprint) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "Blueprint saved",
          `${item.fileName} is stored on this device for offline use.`,
        );
        return;
      }
      await Sharing.shareAsync(item.uri, {
        mimeType: "application/pdf",
        dialogTitle: item.title,
        UTI: "com.adobe.pdf",
      });
    } catch (err) {
      Alert.alert(
        "Could not open blueprint",
        err instanceof Error ? err.message : "Please download it again from your results.",
      );
    }
  };

  const openFavourite = async (item: FavouriteRef) => {
    if (item.type === "occupation") {
      if (item.entityId) {
        router.push(href(`/directory/occupations/${item.entityId}`));
      }
      return;
    }
    const id = item.entityId ?? (await stableUrlId(item.url));
    if (item.type === "qualification") {
      router.push(href(`/directory/qualifications/${id}`));
      return;
    }
    router.push(href(`/directory/providers/${id}`));
  };

  const learnerPersonaLabel = roleLabel.includes("Work")
    ? "Grade 11 Learner"
    : roleLabel.replace(" Learner", "").length > 18
      ? "Learner Mode"
      : roleLabel;

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.careersCached}
        rightLabel={tabs.decisions}
        onRightPress={() => router.push(href("/questionnaires"))}
        detail={home.offlineDetail(
          vault.careersCached.toLocaleString(),
          vault.qualificationsCached,
          vault.providersCached,
        )}
      />
      {profileFromCache || syncPending || vault.pendingProfileWrites > 0 ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.ochre,
            marginBottom: spacing.sm,
          }}
        >
          {syncPending || vault.pendingProfileWrites > 0
            ? "Showing saved profile · sync pending when online"
            : "Showing profile saved on this device"}
        </Text>
      ) : null}

      {/* Title + language */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <MaterialIcon name="folder_shared" size={22} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>My Profile & Vault</Text>
            <Text style={styles.titleSub}>
              Iphrofayili Yami · Ref: DHET-ZA-{refId}
            </Text>
          </View>
        </View>
        <View style={styles.langPill}>
          <MaterialIcon name="translate" size={14} color={colors.gold} />
          <Text style={styles.langPillText}>{languageLabel}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{common.preferredLanguage}</Text>
        <LanguagePicker showLabel={false} />
      </View>

      {/* Profile card */}
      <View style={styles.card}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <MaterialIcon name="school" size={28} color={colors.primary} />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{displayName}</Text>
              {isVerified ? (
                <View style={styles.verifiedPill}>
                  <MaterialIcon
                    name="verified"
                    size={12}
                    color={colors.success}
                  />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.profileMeta}>
              {province} · {roleLabel}
            </Text>
          </View>
        </View>

        <View style={styles.personaSwitch}>
          <Pressable
            style={[
              styles.personaBtn,
              personaMode === "learner" && styles.personaBtnActive,
            ]}
            onPress={() => setPersonaMode("learner")}
          >
            <Text
              style={[
                styles.personaText,
                personaMode === "learner" && styles.personaTextActive,
              ]}
              numberOfLines={1}
            >
              {learnerPersonaLabel}
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.personaBtn,
              personaMode === "seeker" && styles.personaBtnActive,
            ]}
            onPress={() => setPersonaMode("seeker")}
          >
            <Text
              style={[
                styles.personaText,
                personaMode === "seeker" && styles.personaTextActive,
              ]}
              numberOfLines={1}
            >
              Work Seeker Mode
            </Text>
          </Pressable>
        </View>

        <View style={styles.badgeGrid}>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeLabel}>
              <MaterialIcon name="badge" size={12} color={colors.secondary} />{" "}
              DHET Stats ID
            </Text>
            <Text style={styles.infoBadgeValue}>#ZA-{refId}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeLabel}>
              <MaterialIcon name="tune" size={12} color={colors.ochre} />{" "}
              Assistive View
            </Text>
            <Text style={styles.infoBadgeValue}>
              {zoomLabel} · {Math.round(textScale * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.contrastRow}>
          <View style={styles.contrastLeft}>
            <MaterialIcon name="contrast" size={20} color={colors.primary} />
            <View>
              <Text style={styles.contrastTitle}>High Contrast Palette</Text>
              <Text style={styles.contrastSub}>
                Black-on-white colours (same as the contrast icon in the header)
              </Text>
            </View>
          </View>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: colors.borderStrong, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* Offline vault */}
      <View style={styles.card}>
        <View style={styles.vaultHead}>
          <View style={styles.vaultHeadLeft}>
            <MaterialIcon name="cloud_done" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>
                Device Storage & Offline Vault
              </Text>
              <Text style={styles.vaultZeroRated}>
                Zero-Rated Data Access (No Mobile Airtime Required)
              </Text>
            </View>
          </View>
          <View style={styles.storagePill}>
            <Text style={styles.storagePillText}>
              {vault.storageLabel}
            </Text>
          </View>
        </View>

        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              { width: `${Math.max(4, vault.meterPercent)}%` },
            ]}
          />
        </View>
        <View style={styles.meterMeta}>
          <View style={styles.meterMetaLeft}>
            <View style={styles.dot} />
            <Text style={styles.meterMetaText}>
              {vault.careersCached.toLocaleString()} Careers &{" "}
              {vault.qualificationsCached} Qualifications Cached
              {vault.pendingProfileWrites > 0
                ? ` · ${vault.pendingProfileWrites} pending sync`
                : ""}
            </Text>
          </View>
          <Text style={styles.meterPct}>{vault.meterPercent}% full</Text>
        </View>

        <Pressable
          style={[styles.vaultPrimary, vaultBusy && { opacity: 0.7 }]}
          disabled={vaultBusy}
          onPress={() => void onPrepareOfflinePack()}
        >
          <MaterialIcon name="download" size={18} color={colors.onPrimary} />
          <Text style={styles.vaultPrimaryText}>
            {vaultBusy
              ? "Working…"
              : "Prepare offline pack (careers, quals, campuses)"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.vaultSecondary, vaultBusy && { opacity: 0.7 }]}
          disabled={vaultBusy}
          onPress={() => void onSyncVault()}
        >
          <MaterialIcon name="sync" size={18} color={colors.primary} />
          <Text style={styles.vaultSecondaryText}>
            Sync Vault with National Database
          </Text>
        </Pressable>
      </View>

      {/* Offline blueprints */}
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadLeft}>
          <MaterialIcon name="picture_as_pdf" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Offline Blueprints</Text>
        </View>
        <Text style={styles.sectionCount}>
          {blueprints.length} PDF{blueprints.length === 1 ? "" : "s"}
        </Text>
      </View>

      {blueprints.length ? (
        blueprints.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => void openBlueprint(item)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}
          >
            <View style={styles.blueprintRow}>
              <View style={styles.blueprintIcon}>
                <MaterialIcon
                  name="picture_as_pdf"
                  size={22}
                  color={colors.primary}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Text style={styles.blueprintTitle}>{item.title}</Text>
                <Text style={styles.blueprintMeta}>
                  {item.matchCount} matches ·{" "}
                  {new Date(item.savedAt).toLocaleDateString("en-ZA")}
                </Text>
                <Text style={styles.blueprintFile} numberOfLines={1}>
                  {item.fileName}
                </Text>
              </View>
              <MaterialIcon name="share" size={18} color={colors.textSecondary} />
            </View>
          </Pressable>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No offline blueprints yet</Text>
          <Text style={styles.emptyBody}>
            After you finish a questionnaire, tap Download Offline Blueprint on
            your results to save a PDF here.
          </Text>
        </View>
      )}

      {/* Diagnostics */}
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadLeft}>
          <MaterialIcon name="psychology" size={22} color={colors.gold} />
          <Text style={styles.sectionTitle}>Completed Diagnostic Tools</Text>
        </View>
        <Text style={styles.sectionCount}>
          {diagnostics.length} Active Record{diagnostics.length === 1 ? "" : "s"}
        </Text>
      </View>

      {diagnostics.length ? (
        diagnostics.map(([id, result]) => (
          <DiagnosticCard
            key={id}
            id={id}
            result={result}
            onOpen={() => router.push(href(`/questionnaires/results/${id}`))}
          />
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No diagnostics completed yet</Text>
          <Text style={styles.emptyBody}>
            Take Subject Choice, Career Choice, or Job Fit to build your vault
            record.
          </Text>
          <Pressable
            style={styles.emptyCta}
            onPress={() => router.push(href("/questionnaires"))}
          >
            <Text style={styles.emptyCtaText}>Open Decisions</Text>
            <MaterialIcon
              name="arrow_forward"
              size={16}
              color={colors.primary}
            />
          </Pressable>
        </View>
      )}

      {/* Bookmarks */}
      <View style={styles.sectionHead}>
        <View style={styles.sectionHeadLeft}>
          <MaterialIcon name="bookmarks" size={22} color={colors.primary} />
          <Text style={styles.sectionTitle}>Bookmarked Vault Items</Text>
        </View>
        <Text style={styles.sectionMuted}>{counts.all} Total Saved</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(
          [
            ["all", `All Saved (${counts.all})`],
            ["occupation", `Careers (${counts.occupation})`],
            ["qualification", `Qualifications (${counts.qualification})`],
            ["provider", `Campuses (${counts.provider})`],
          ] as const
        ).map(([id, label]) => {
          const active = filter === id;
          return (
            <Pressable
              key={id}
              onPress={() => setFilter(id)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filteredFavourites.length ? (
        filteredFavourites.map((item, index) => (
          <VaultItemCard
            key={`${item.type}-${item.url}`}
            item={item}
            index={index}
            onOpen={() => void openFavourite(item)}
          />
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved items yet</Text>
          <Text style={styles.emptyBody}>
            Favourite careers, qualifications, or campuses from detail screens
            to build your vault.
          </Text>
          <Pressable
            style={styles.emptyCta}
            onPress={() => router.push(href("/directory"))}
          >
            <Text style={styles.emptyCtaText}>Browse Directory</Text>
            <MaterialIcon
              name="arrow_forward"
              size={16}
              color={colors.primary}
            />
          </Pressable>
        </View>
      )}

      {/* Export portfolio */}
      <View style={styles.exportCard}>
        <View style={styles.exportBadges}>
          <View style={styles.exportOfficial}>
            <Text style={styles.exportOfficialText}>OFFICIAL DHET RECORD</Text>
          </View>
          <Text style={styles.exportStandard}>Khetha Verification Standard</Text>
        </View>
        <Text style={styles.exportTitle}>
          Export My Career Portfolio (DHET Certified PDF)
        </Text>
        <Text style={styles.exportBody}>
          Includes your verified RIASEC scores, shortlisted priority careers,
          subject requirements, and nearby TVET college application codes.
        </Text>
        <Pressable
          style={styles.exportBtn}
          onPress={() =>
            Alert.alert(
              "Portfolio Generated",
              `DHET-Portfolio-ZA${refId}.pdf is ready for print or Life Orientation submission.`,
            )
          }
        >
          <MaterialIcon name="picture_as_pdf" size={20} color={colors.text} />
          <Text style={styles.exportBtnText}>
            Generate & Share Career Portfolio
          </Text>
        </Pressable>
        <Text style={styles.exportHint}>
          Ready for print or submission to your school Life Orientation teacher.
        </Text>
      </View>

      <Pressable style={styles.signOut} onPress={() => void signOut()}>
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </Screen>
  );
}

function DiagnosticCard({
  id,
  result,
  onOpen,
}: {
  id: QuestionnaireId;
  result: QuestionnaireResult;
  onOpen: () => void;
}) {
  const dateLabel = result.completedAt
    ? new Date(result.completedAt).toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Saved";
  const topMatch = result.matches?.[0];
  const badges = domainBadges(result.domainScores).slice(0, 2);

  if (id === "careerChoice") {
    const title =
      badges.length >= 2
        ? `${badges[0].label} & ${badges[1].label} Match`
        : badges[0]
          ? `${badges[0].label} Match`
          : "Interest Profile Match";
    return (
      <View style={styles.card}>
        <View style={styles.diagTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.diagKicker}>Holland RIASEC Profiler</Text>
            <Text style={styles.diagTitle}>{title}</Text>
          </View>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{dateLabel}</Text>
          </View>
        </View>
        {badges.length ? (
          <View style={styles.scorePanel}>
            {badges.map((badge, i) => (
              <View key={`${badge.label}-${i}`} style={styles.scoreBlock}>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>{badge.label}</Text>
                  <Text
                    style={[
                      styles.scorePct,
                      { color: i === 0 ? colors.primary : colors.secondary },
                    ]}
                  >
                    {badge.pct}%
                  </Text>
                </View>
                <View style={styles.scoreTrack}>
                  <View
                    style={[
                      styles.scoreFill,
                      {
                        width: `${badge.pct}%`,
                        backgroundColor:
                          i === 0 ? colors.primary : colors.secondary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.diagFooter}>
          {topMatch ? (
            <View style={styles.topFit}>
              <MaterialIcon name="bolt" size={14} color={colors.text} />
              <Text style={styles.topFitText} numberOfLines={1}>
                Top Fit: {topMatch.title}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <Pressable style={styles.linkBtn} onPress={onOpen}>
            <Text style={styles.linkBtnText}>View Report</Text>
            <MaterialIcon
              name="arrow_forward"
              size={14}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  if (id === "jobFit") {
    return (
      <View style={styles.card}>
        <View style={styles.diagTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.diagKicker}>Skills Aptitude Test</Text>
            <Text style={styles.diagTitle}>
              {badges[0]?.label
                ? `${badges[0].label} Sector Fit`
                : "Trades & Workplace Fit"}
            </Text>
          </View>
          <View style={[styles.datePill, styles.datePillMuted]}>
            <Text style={[styles.datePillText, styles.datePillTextMuted]}>
              {dateLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.diagBody}>
          {topMatch
            ? `Strong alignment with ${topMatch.title}. ${result.matches.length} priority occupations matched from your work-style preferences.`
            : "Your job-fit preferences are saved to the vault."}
        </Text>
        <View style={styles.diagFooter}>
          <View style={styles.demandRow}>
            <MaterialIcon name="task_alt" size={16} color={colors.success} />
            <Text style={styles.demandText}>High Sector Demand</Text>
          </View>
          <Pressable style={styles.linkBtn} onPress={onOpen}>
            <Text style={[styles.linkBtnText, { color: colors.secondary }]}>
              Review Answers
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // subjectChooser
  return (
    <View style={styles.card}>
      <View style={styles.diagTop}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.diagKicker, { color: colors.ochre }]}>
            Draft Package Saved
          </Text>
          <Text style={styles.diagTitle}>
            {topMatch?.title ?? "Subject Pathway Package"}
          </Text>
        </View>
        <View style={styles.gradePill}>
          <Text style={styles.gradePillText}>Grade 10/11</Text>
        </View>
      </View>
      <View style={styles.tagRow}>
        {(badges.length ? badges : [{ id: "stream", label: "Subject stream" }]).map(
          (badge) => (
            <View key={badge.id ?? badge.label} style={styles.softTag}>
              <Text style={styles.softTagText}>{badge.label}</Text>
            </View>
          ),
        )}
      </View>
      <View style={styles.diagFooter}>
        <View style={styles.demandRow}>
          <MaterialIcon name="lock_open" size={16} color={colors.primary} />
          <Text style={[styles.demandText, { color: colors.primary }]}>
            {result.matches?.length ?? 0} Career Pathways Unlocked
            {result.answers?.apsTotal
              ? ` · APS ${result.answers.apsTotal}`
              : ""}
          </Text>
        </View>
        <Pressable style={styles.simulateBtn} onPress={onOpen}>
          <Text style={styles.simulateText}>View Results</Text>
        </Pressable>
      </View>
    </View>
  );
}

function VaultItemCard({
  item,
  index,
  onOpen,
}: {
  item: FavouriteRef;
  index: number;
  onOpen: () => void;
}) {
  if (item.type === "occupation") {
    const thumb =
      PROFILE_THUMBS[index % PROFILE_THUMBS.length] ??
      STITCH_RESULT_IMAGES[index % STITCH_RESULT_IMAGES.length];
    const tags = occupationTags(item.title);
    const salary = occupationSalaryHint(item.title);
    const pathway = occupationPathwayHint(item.title);
    const primaryTag = tags[0];
    const tone = primaryTag
      ? tagToneColors(primaryTag.tone)
      : { bg: "#FFF4E5", fg: colors.ochre };

    return (
      <View style={styles.vaultItem}>
        <Pressable style={styles.vaultItemBody} onPress={onOpen}>
          <Image source={thumb} style={styles.thumb} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.vaultItemTop}>
              {primaryTag ? (
                <View style={[styles.scarcePill, { backgroundColor: tone.bg }]}>
                  <Text style={[styles.scarceText, { color: tone.fg }]}>
                    {primaryTag.label}
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <FavouriteToggle
                compact
                type={item.type}
                url={item.url}
                title={item.title}
                entityId={item.entityId}
              />
            </View>
            <Text style={styles.vaultItemTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.vaultItemMeta}>
              {item.entityId ? `OFO ${item.entityId}` : "Career pathway"} ·{" "}
              {pathway}
            </Text>
            <Text style={styles.salary}>
              {salary}
              <Text style={styles.salaryHint}> · indicative</Text>
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.vaultItemFoot} onPress={onOpen}>
          <View style={styles.demandRow}>
            <MaterialIcon
              name="check_circle"
              size={14}
              color={colors.success}
            />
            <Text style={styles.footMeta}>{pathway}</Text>
          </View>
          <View style={styles.linkBtn}>
            <Text style={styles.linkBtnText}>View Details</Text>
            <MaterialIcon
              name="chevron_right"
              size={14}
              color={colors.primary}
            />
          </View>
        </Pressable>
      </View>
    );
  }

  if (item.type === "qualification") {
    return (
      <View style={[styles.card, { gap: spacing.sm }]}>
        <View style={styles.qualTop}>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={styles.nqfPill}>
              <Text style={styles.nqfText}>DHET / SAQA Accredited</Text>
            </View>
            <Text style={styles.vaultItemTitle}>{item.title}</Text>
            <Text style={styles.diagBody}>
              Saved qualification pathway · open for entry requirements &
              providers
            </Text>
          </View>
          <FavouriteToggle
            compact
            type={item.type}
            url={item.url}
            title={item.title}
            entityId={item.entityId}
          />
        </View>
        <View style={styles.qualFoot}>
          <View style={styles.demandRow}>
            <MaterialIcon name="payments" size={14} color={colors.success} />
            <Text style={[styles.footMeta, { color: colors.success }]}>
              Check NSFAS eligibility
            </Text>
          </View>
          <Pressable style={styles.linkBtn} onPress={onOpen}>
            <Text style={styles.linkBtnText}>Open</Text>
            <MaterialIcon
              name="chevron_right"
              size={14}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  // provider
  return (
    <Pressable style={styles.providerCard} onPress={onOpen}>
      <View style={styles.providerIcon}>
        <MaterialIcon
          name="account_balance"
          size={24}
          color={colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.vaultItemTitle}>{item.title}</Text>
        <Text style={styles.vaultItemMeta}>Learning provider · Campus hub</Text>
        <Text style={styles.providerOpen}>View campus details</Text>
      </View>
      <FavouriteToggle
        compact
        type={item.type}
        url={item.url}
        title={item.title}
        entityId={item.entityId}
      />
    </Pressable>
  );
}

function shortRef(id: string) {
  const digits = id.replace(/\D/g, "");
  if (digits.length >= 6) return digits.slice(-6);
  const hex = id.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
  if (hex.length >= 6) return hex.slice(-6);
  return "849204";
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  title: { ...typography.headlineSm, color: colors.text },
  titleSub: { ...typography.caption, color: colors.textSecondary },
  langPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...shadows.card,
  },
  langPillText: { ...typography.labelMd, color: colors.primary },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  profileTop: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.card,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  name: { ...typography.headlineSm, color: colors.text },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  verifiedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  profileMeta: { ...typography.bodySm, color: colors.textSecondary },
  personaSwitch: {
    flexDirection: "row",
    backgroundColor: "#E7EEFF",
    borderRadius: radii.md,
    padding: 4,
    gap: 4,
  },
  personaBtn: {
    flex: 1,
    minHeight: 40,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  personaBtnActive: { backgroundColor: colors.primaryDark },
  personaText: { ...typography.labelMd, color: colors.textMuted },
  personaTextActive: { color: colors.onPrimary },
  badgeGrid: { flexDirection: "row", gap: spacing.sm },
  infoBadge: {
    flex: 1,
    backgroundColor: "#F0F3FF",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 2,
  },
  infoBadgeLabel: { ...typography.caption, color: colors.textSecondary },
  infoBadgeValue: { ...typography.labelMd, color: colors.text },
  contrastRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  contrastLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  contrastTitle: { ...typography.labelMd, color: colors.text },
  contrastSub: { ...typography.caption, color: colors.textSecondary },
  vaultHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  vaultHeadLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    flex: 1,
  },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  vaultZeroRated: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  storagePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  storagePillText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: "700",
  },
  meterTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: "#E7EEFF",
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  meterMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  meterMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  meterMetaText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  meterPct: { ...typography.caption, color: colors.text, fontWeight: "700" },
  vaultPrimary: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  vaultPrimaryText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    flexShrink: 1,
    textAlign: "center",
  },
  vaultSecondary: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: "#F0F3FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  vaultSecondaryText: { ...typography.labelLg, color: colors.primary },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  sectionHeadLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sectionCount: { ...typography.labelMd, color: colors.secondary },
  blueprintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  blueprintIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  blueprintTitle: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  blueprintMeta: { ...typography.caption, color: colors.textSecondary },
  blueprintFile: { ...typography.caption, color: colors.textMuted },
  sectionMuted: { ...typography.labelMd, color: colors.textSecondary },
  diagTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  diagKicker: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  diagTitle: { ...typography.headlineSm, color: colors.text },
  diagBody: { ...typography.bodySm, color: colors.textSecondary },
  datePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  datePillMuted: { backgroundColor: colors.muted },
  datePillText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  datePillTextMuted: { color: colors.textSecondary },
  gradePill: {
    backgroundColor: "#FFDEA8",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gradePillText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "700",
  },
  scorePanel: {
    backgroundColor: "#F0F3FF",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  scoreBlock: { gap: 4 },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreLabel: { ...typography.caption, color: colors.text, fontWeight: "700" },
  scorePct: { ...typography.caption, fontWeight: "800" },
  scoreTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: "#E7EEFF",
    overflow: "hidden",
  },
  scoreFill: { height: "100%", borderRadius: radii.pill },
  diagFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  topFit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFDEA8",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexShrink: 1,
    maxWidth: "62%",
  },
  topFitText: { ...typography.caption, color: colors.text, fontWeight: "700" },
  linkBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  linkBtnText: { ...typography.labelMd, color: colors.primary },
  demandRow: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  demandText: {
    ...typography.labelMd,
    color: colors.success,
    flexShrink: 1,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  softTag: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  softTagText: { ...typography.caption, color: colors.textSecondary },
  simulateBtn: {
    backgroundColor: "#F0F3FF",
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  simulateText: { ...typography.labelMd, color: colors.text },
  filterRow: { gap: spacing.sm, paddingRight: spacing.md },
  filterChip: {
    backgroundColor: colors.card,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...shadows.card,
  },
  filterChipActive: { backgroundColor: colors.primaryDark },
  filterChipText: { ...typography.labelMd, color: colors.textSecondary },
  filterChipTextActive: { color: colors.onPrimary },
  vaultItem: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  vaultItemBody: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  vaultItemTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  scarcePill: {
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "78%",
  },
  scarceText: { ...typography.caption, fontWeight: "700" },
  vaultItemTitle: { ...typography.headlineSm, color: colors.text },
  vaultItemMeta: { ...typography.caption, color: colors.textSecondary },
  salary: { ...typography.labelMd, color: colors.success, fontWeight: "700" },
  salaryHint: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  vaultItemFoot: {
    backgroundColor: "#F0F3FF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  footMeta: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  qualTop: { flexDirection: "row", gap: spacing.sm },
  nqfPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  nqfText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "700",
  },
  qualFoot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  providerCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.card,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  providerOpen: {
    ...typography.labelMd,
    color: colors.primary,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { ...typography.headlineSm, color: colors.text },
  emptyBody: { ...typography.bodySm, color: colors.textSecondary },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  emptyCtaText: { ...typography.labelLg, color: colors.primary },
  exportCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    overflow: "hidden",
  },
  exportBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  exportOfficial: {
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  exportOfficialText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "800",
  },
  exportStandard: {
    ...typography.caption,
    color: "rgba(158,244,208,0.9)",
  },
  exportTitle: {
    ...typography.headlineSm,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  exportBody: {
    ...typography.bodySm,
    color: "rgba(158,244,208,0.9)",
  },
  exportBtn: {
    minHeight: 48,
    borderRadius: radii.md,
    backgroundColor: colors.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  exportBtnText: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "700",
  },
  exportHint: {
    ...typography.caption,
    color: "rgba(158,244,208,0.75)",
    textAlign: "center",
  },
  signOut: {
    alignSelf: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  signOutText: { ...typography.labelLg, color: colors.textMuted },
});
