import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { MaterialIcon } from "../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../components/KhethaBrandBar";
import { LanguagePicker } from "../../components/LanguagePicker";
import { useLocale } from "../../contexts/LocaleContext";
import { HELPLINE, OFFLINE_VAULT_STATS } from "../../data/staticContent";
import { QUESTIONNAIRE_PATH_IMAGES } from "../../data/learningPaths";
import { colors, radii, shadows, spacing, typography } from "../../theme";
import { href } from "../../utils/href";

export default function HomeScreen() {
  const router = useRouter();
  const { home: t } = useLocale();
  const careersCount = OFFLINE_VAULT_STATS.careersCached.toLocaleString();

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        rightLabel={t.homeTab}
        detail={t.offlineDetail(
          careersCount,
          OFFLINE_VAULT_STATS.qualificationsCached,
          OFFLINE_VAULT_STATS.providersCached,
        )}
      />

      <View style={styles.officialPill}>
        <MaterialIcon name="verified" size={16} color={colors.success} />
        <Text style={styles.officialText}>{t.officialPill}</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{t.heroTitle}</Text>
        <Text style={styles.heroBody}>{t.heroBody}</Text>
        <LanguagePicker
          label={t.voiceLabel}
          labelStyle={{ color: "#FFFFFF" }}
        />
      </View>

      <View style={styles.counselCard}>
        <View style={styles.counselTop}>
          <View style={styles.counselLeft}>
            <MaterialIcon name="support_agent" size={20} color={colors.secondary} />
            <Text style={styles.counselKicker}>{t.counselKicker}</Text>
          </View>
          <View style={styles.freePill}>
            <Text style={styles.freeText}>{t.free}</Text>
          </View>
        </View>
        <Text style={styles.counselBody}>{t.counselBody(HELPLINE.hours)}</Text>
        <View style={styles.counselActions}>
          <Pressable
            style={styles.counselBtn}
            onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
          >
            <MaterialIcon name="call" size={16} color={colors.primary} />
            <View>
              <Text style={styles.counselBtnTitle}>{HELPLINE.tollFreeDisplay}</Text>
              <Text style={styles.counselBtnMeta}>{t.tollFree}</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.counselBtn}
            onPress={() =>
              void Linking.openURL(`https://wa.me/27${HELPLINE.whatsapp.slice(1)}`)
            }
          >
            <MaterialIcon name="whatsapp" size={16} color={colors.success} />
            <View>
              <Text style={styles.counselBtnTitle}>
                {HELPLINE.whatsappDisplay}
              </Text>
              <Text style={styles.counselBtnMeta}>{t.whatsapp}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.section}>{t.gatewaysTitle}</Text>
        <Text style={styles.sectionSub}>{t.gatewaysSub}</Text>
      </View>

      <GatewayCard
        accent={colors.secondary}
        icon="account_tree"
        tag={t.subjectTag}
        title={t.subjectTitle}
        body={t.subjectBody}
        metaIcon="rule"
        meta={t.subjectMeta}
        cta={t.subjectCta}
        banner={QUESTIONNAIRE_PATH_IMAGES.subjectChooser}
        onPress={() => router.push(href("/questionnaires/subject-chooser"))}
      />
      <GatewayCard
        accent={colors.primary}
        icon="psychology"
        tag={t.careerTag}
        title={t.careerTitle}
        body={t.careerBody}
        metaIcon="data_saver_on"
        meta={t.careerMeta}
        cta={t.careerCta}
        banner={QUESTIONNAIRE_PATH_IMAGES.careerChoice}
        onPress={() => router.push(href("/questionnaires/career-choice"))}
      />
      <GatewayCard
        accent={colors.ochre}
        icon="work_history"
        tag={t.jobFitTag}
        title={t.jobFitTitle}
        body={t.jobFitBody}
        metaIcon="handyman"
        meta={t.jobFitMeta}
        cta={t.jobFitCta}
        banner={QUESTIONNAIRE_PATH_IMAGES.jobFit}
        onPress={() => router.push(href("/questionnaires/job-fit"))}
      />

      <View style={styles.sectionHead}>
        <Text style={styles.section}>{t.directoryTitle}</Text>
        <Text style={styles.sectionSub}>{t.directorySub}</Text>
      </View>

      <View style={styles.dirGrid}>
        <DirTile
          icon="engineering"
          iconBg={colors.primaryMuted}
          iconColor={colors.primary}
          title={t.careersDirTitle}
          body={t.careersDirBody(careersCount)}
          cta={t.careersDirCta}
          onPress={() => router.push(href("/directory"))}
        />
        <DirTile
          icon="school"
          iconBg={colors.secondarySubtle}
          iconColor={colors.secondary}
          title={t.whatStudyTitle}
          body={t.whatStudyBody(OFFLINE_VAULT_STATS.qualificationsCached)}
          cta={t.whatStudyCta}
          onPress={() => router.push(href("/directory/qualifications"))}
        />
        <DirTile
          icon="location_on"
          iconBg="#EFF6FF"
          iconColor={colors.secondary}
          title={t.whereStudyTitle}
          body={t.whereStudyBody}
          cta={t.whereStudyCta}
          onPress={() => router.push(href("/directory/providers"))}
        />
        <DirTile
          icon="payments"
          iconBg="#FFF4E5"
          iconColor={colors.ochre}
          title={t.fundingTitle}
          body={t.fundingBody}
          cta={t.fundingCta}
          onPress={() => router.push(href("/helpline"))}
        />
      </View>

      <View style={styles.demandHead}>
        <View style={styles.demandTitleRow}>
          <MaterialIcon
            name="local_fire_department"
            size={20}
            color={colors.ochre}
          />
          <Text style={styles.section}>{t.demandTitle}</Text>
        </View>
        <Pressable onPress={() => router.push(href("/directory"))}>
          <View style={styles.gazetted}>
            <Text style={styles.gazettedText}>{t.gazetted}</Text>
          </View>
        </Pressable>
      </View>
      <Text style={styles.sectionSub}>{t.demandSub}</Text>

      {(
        [
          {
            id: "solar",
            title: t.solarTitle,
            meta: t.solarMeta,
            icon: "wb_sunny",
            tone: "#C2611A",
          },
          {
            id: "software",
            title: t.softwareTitle,
            meta: t.softwareMeta,
            icon: "code",
            tone: "#2B6CB0",
          },
          {
            id: "millwright",
            title: t.millwrightTitle,
            meta: t.millwrightMeta,
            icon: "precision_manufacturing",
            tone: "#15803D",
          },
        ] as const
      ).map((item) => (
        <Pressable
          key={item.id}
          style={styles.demandRow}
          onPress={() => router.push(href("/directory"))}
        >
          <View style={[styles.demandIcon, { backgroundColor: `${item.tone}22` }]}>
            <MaterialIcon name={item.icon} size={22} color={item.tone} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.demandTitle}>{item.title}</Text>
            <Text style={styles.demandMeta}>{item.meta}</Text>
          </View>
          <MaterialIcon name="chevron_right" size={20} color={colors.textMuted} />
        </Pressable>
      ))}

      <View style={styles.policy}>
        <MaterialIcon name="policy" size={18} color={colors.secondary} />
        <Text style={styles.policyText}>{t.policy}</Text>
      </View>

      <View style={styles.quoteBox}>
        <MaterialIcon name="format_quote" size={28} color={colors.gold} />
        <Text style={styles.quote}>{t.quote}</Text>
        <Text style={styles.quoteAttr}>{t.quoteAttr}</Text>
        <Text style={styles.version}>{t.version}</Text>
      </View>
    </Screen>
  );
}

function GatewayCard({
  accent,
  icon,
  tag,
  title,
  body,
  metaIcon,
  meta,
  cta,
  banner,
  onPress,
}: {
  accent: string;
  icon: string;
  tag: string;
  title: string;
  body: string;
  metaIcon: string;
  meta: string;
  cta: string;
  banner: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.gateway} onPress={onPress}>
      <View style={styles.gatewayBanner}>
        <Image
          source={banner}
          style={styles.gatewayBannerImage}
          resizeMode="cover"
        />
        <View style={styles.gatewayBannerOverlay} />
        <View style={[styles.gatewayBannerTag, { backgroundColor: accent }]}>
          <Text style={styles.gatewayBannerTagText}>{tag}</Text>
        </View>
      </View>
      <View style={[styles.gatewayAccent, { backgroundColor: accent }]} />
      <View style={styles.gatewayInner}>
        <View style={styles.gatewayTop}>
          <View style={[styles.gatewayIcon, { backgroundColor: `${accent}18` }]}>
            <MaterialIcon name={icon} size={22} color={accent} />
          </View>
        </View>
        <Text style={styles.gatewayTitle}>{title}</Text>
        <Text style={styles.gatewayBody}>{body}</Text>
        <View style={styles.gatewayMeta}>
          <MaterialIcon name={metaIcon} size={14} color={colors.textMuted} />
          <Text style={styles.gatewayMetaText}>{meta}</Text>
        </View>
        <View style={[styles.gatewayCta, { backgroundColor: accent }]}>
          <Text style={styles.gatewayCtaText}>{cta}</Text>
          <MaterialIcon name="arrow_forward" size={16} color={colors.onPrimary} />
        </View>
      </View>
    </Pressable>
  );
}

function DirTile({
  icon,
  iconBg,
  iconColor,
  title,
  body,
  cta,
  onPress,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.dirTile} onPress={onPress}>
      <View style={[styles.dirIcon, { backgroundColor: iconBg }]}>
        <MaterialIcon name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.dirTitle}>{title}</Text>
      <Text style={styles.dirBody}>{body}</Text>
      <View style={styles.dirCtaRow}>
        <Text style={[styles.dirCta, { color: iconColor }]}>{cta}</Text>
        <MaterialIcon name="chevron_right" size={16} color={iconColor} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  officialPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  officialText: { ...typography.caption, color: colors.success, fontWeight: "700" },
  hero: {
    backgroundColor: colors.primaryDark,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadows.card,
  },
  heroTitle: { ...typography.headlineLg, color: colors.gold },
  heroBody: { ...typography.bodySm, color: "rgba(255,255,255,0.9)" },
  voiceLabel: {
    ...typography.caption,
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs,
  },
  langRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langChip: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langChipActive: { backgroundColor: colors.card },
  langText: { ...typography.caption, color: colors.onPrimary, fontWeight: "700" },
  langTextActive: { color: colors.primaryDark },
  counselCard: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  counselTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counselLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  counselKicker: {
    ...typography.labelMd,
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  freePill: {
    backgroundColor: colors.success,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  freeText: { ...typography.caption, color: colors.onPrimary, fontWeight: "800" },
  counselBody: { ...typography.bodySm, color: colors.textSecondary },
  counselActions: { flexDirection: "row", gap: spacing.sm },
  counselBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  counselBtnTitle: { ...typography.labelMd, color: colors.text },
  counselBtnMeta: { ...typography.caption, color: colors.textMuted },
  sectionHead: { gap: 4, marginTop: spacing.xs },
  section: { ...typography.headlineSm, color: colors.text },
  sectionSub: { ...typography.bodySm, color: colors.textSecondary },
  gateway: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.card,
  },
  gatewayBanner: {
    height: 120,
    backgroundColor: colors.muted,
  },
  gatewayBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  gatewayBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.28)",
  },
  gatewayBannerTag: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gatewayBannerTagText: {
    ...typography.caption,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  gatewayAccent: { height: 4, width: "100%" },
  gatewayInner: { padding: spacing.lg, gap: spacing.sm },
  gatewayTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  gatewayIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  gatewayTag: { ...typography.caption, fontWeight: "700", flexShrink: 1 },
  gatewayTitle: { ...typography.headlineSm, color: colors.text },
  gatewayBody: { ...typography.bodySm, color: colors.textSecondary },
  gatewayMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  gatewayMetaText: { ...typography.caption, color: colors.textMuted },
  gatewayCta: {
    marginTop: spacing.xs,
    minHeight: 42,
    borderRadius: radii.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  gatewayCtaText: { ...typography.labelLg, color: colors.onPrimary },
  dirGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  dirTile: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  dirIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dirTitle: { ...typography.labelLg, color: colors.text },
  dirBody: { ...typography.caption, color: colors.textSecondary, minHeight: 48 },
  dirCtaRow: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 },
  dirCta: { ...typography.labelMd },
  demandHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  demandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  gazetted: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  gazettedText: { ...typography.caption, color: colors.ochre, fontWeight: "700" },
  demandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  demandIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  demandTitle: { ...typography.labelLg, color: colors.text },
  demandMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  policy: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  policyText: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  quoteBox: {
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  quote: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  quoteAttr: { ...typography.labelMd, color: colors.ochre },
  version: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
});
