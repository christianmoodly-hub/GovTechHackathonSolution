import { useMemo, useState } from "react";
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
import { Screen } from "../../../components/Screen";
import { MaterialIcon } from "../../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../../components/KhethaBrandBar";
import { useAuth } from "../../../contexts/AuthContext";
import { HELPLINE, OFFLINE_VAULT_STATS } from "../../../data/staticContent";
import {
  FIELD_PATHS,
  QUESTIONNAIRE_PATH_IMAGES,
} from "../../../data/learningPaths";
import { colors, radii, shadows, spacing, typography } from "../../../theme";
import { href } from "../../../utils/href";

import type { UserProfile } from "../../../services/types";

type PathwayKey = "subjectChooser" | "careerChoice" | "jobFit";
type PathwayStatus = "completed" | "in_progress" | "pending";

function pathwayStatus(
  key: PathwayKey,
  profile: UserProfile | null | undefined,
): PathwayStatus {
  const prior = profile?.questionnaireResults?.[key];
  if (prior?.completedAt || (prior?.matches?.length ?? 0) > 0) {
    return "completed";
  }
  return "pending";
}

type Pathway = {
  key: PathwayKey;
  href: string;
  accent: string;
  badgeIcon: string;
  badgeLabel: string;
  badgeTone: "green" | "gold" | "blue";
  duration: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  cta: string;
  ctaIcon: string;
  journeyLabel: string;
  banner: ImageSourcePropType;
};

const PATHWAYS: Pathway[] = [
  {
    key: "subjectChooser",
    href: "/questionnaires/subject-chooser",
    accent: colors.primary,
    badgeIcon: "school",
    badgeLabel: "Recommended for High School",
    badgeTone: "green",
    duration: "5–8 mins",
    icon: "menu_book",
    iconBg: colors.primaryMuted,
    iconColor: colors.primary,
    title: "1. Subject Chooser",
    subtitle: "Ukukhetha Izifundo · CAPS Aligned",
    body: "Select your current or prospective Grade 10–12 subjects to test admission into university degrees, TVET college diplomas, and high-demand trades. Prevent closing academic doors early.",
    tags: ["APS Calculator", "Pure Maths vs Math Lit", "Faculty Prerequisites"],
    cta: "Launch Subject Chooser",
    ctaIcon: "chevron_right",
    journeyLabel: "Subject Choice (Grade 10–12)",
    banner: QUESTIONNAIRE_PATH_IMAGES.subjectChooser,
  },
  {
    key: "careerChoice",
    href: "/questionnaires/career-choice",
    accent: colors.gold,
    badgeIcon: "local_fire_department",
    badgeLabel: "Most Popular Diagnostic",
    badgeTone: "gold",
    duration: "12–15 mins",
    icon: "psychology",
    iconBg: "#FFF4E5",
    iconColor: colors.ochre,
    title: "2. Career Choice Questionnaire",
    subtitle: "Holland RIASEC Model · 4 Languages",
    body: "Discover which fields truly match your natural personality, passions, and core thinking style. Generates your official 3-letter RIASEC profile mapped to registered SAQA occupations.",
    tags: [
      "Realistic · Investigative · Artistic",
      "1,432+ SAQA Careers",
      "Audio Voice-Over",
    ],
    cta: "Start Interest Profiler",
    ctaIcon: "arrow_forward",
    journeyLabel: "Career Interest (Holland RIASEC)",
    banner: QUESTIONNAIRE_PATH_IMAGES.careerChoice,
  },
  {
    key: "jobFit",
    href: "/questionnaires/job-fit",
    accent: colors.secondary,
    badgeIcon: "handyman",
    badgeLabel: "Great for Vocational & TVET",
    badgeTone: "blue",
    duration: "10 mins",
    icon: "engineering",
    iconBg: colors.secondarySubtle,
    iconColor: colors.secondary,
    title: "3. Job Fit Questionnaire",
    subtitle: "Workplace Environment Match",
    body: "Evaluate tangible day-to-day realities: outdoor physical trades, engineering workshops, healthcare wards, corporate teams, or independent digital environments.",
    tags: [
      "SETA Apprenticeships",
      "Centres of Specialisation",
      "Work Climate Demands",
    ],
    cta: "Assess Your Job Fit",
    ctaIcon: "chevron_right",
    journeyLabel: "Job Fit (Trade & Artisan Focus)",
    banner: QUESTIONNAIRE_PATH_IMAGES.jobFit,
  },
];

const FAQ = [
  {
    id: 1,
    icon: "check",
    question: "In Grade 9 or choosing Matric subjects?",
    best: "Best choice: 1. Subject Chooser",
    answer:
      "Helps you check APS thresholds early so you don't drop Mathematics or Science if your dream qualification requires it.",
    href: "/questionnaires/subject-chooser",
  },
  {
    id: 2,
    icon: "help_outline",
    question: "No idea what career fits you?",
    best: "Best choice: 2. Career Choice Questionnaire",
    answer:
      "Examines your core psychological preferences and personality affinities to provide a curated shortlist of South African occupations.",
    href: "/questionnaires/career-choice",
  },
  {
    id: 3,
    icon: "handyman",
    question: "Prefer hands-on trades or TVET paths?",
    best: "Best choice: 3. Job Fit Questionnaire",
    answer:
      "Focuses directly on physical, technical, and trade conditions to connect you with SETA artisanal qualifications and Centres of Specialisation.",
    href: "/questionnaires/job-fit",
  },
] as const;

function statusMeta(status: PathwayStatus): {
  icon: string;
  label: string;
  iconColor: string;
  pillBg: string;
  pillFg: string;
  rowBg: string;
} {
  if (status === "completed") {
    return {
      icon: "check_circle",
      label: "Completed",
      iconColor: colors.success,
      pillBg: colors.card,
      pillFg: colors.success,
      rowBg: colors.primaryMuted,
    };
  }
  if (status === "in_progress") {
    return {
      icon: "pending",
      label: "In Progress",
      iconColor: colors.ochre,
      pillBg: "#E7EEFF",
      pillFg: colors.ochre,
      rowBg: colors.muted,
    };
  }
  return {
    icon: "radio_button_unchecked",
    label: "Pending",
    iconColor: colors.textMuted,
    pillBg: colors.muted,
    pillFg: colors.textSecondary,
    rowBg: colors.muted,
  };
}

function badgeColors(tone: Pathway["badgeTone"]) {
  if (tone === "gold") {
    return { bg: "#FFF4E5", fg: colors.ochre };
  }
  if (tone === "blue") {
    return { bg: colors.secondarySubtle, fg: colors.secondary };
  }
  return { bg: colors.primaryMuted, fg: colors.primary };
}

export default function QuestionnairesHub() {
  const router = useRouter();
  const { profile } = useAuth();
  const [faqOpen, setFaqOpen] = useState<number | null>(1);

  const statuses = useMemo(() => {
    const map = {} as Record<PathwayKey, PathwayStatus>;
    for (const p of PATHWAYS) {
      map[p.key] = pathwayStatus(p.key, profile);
    }
    // Mark first incomplete as in_progress for journey UX.
    const firstOpen = PATHWAYS.find((p) => map[p.key] === "pending");
    if (firstOpen) map[firstOpen.key] = "in_progress";
    return map;
  }, [profile]);

  const completedCount = PATHWAYS.filter(
    (p) => statuses[p.key] === "completed",
  ).length;
  const percent = Math.round((completedCount / PATHWAYS.length) * 100);

  const resumeTarget =
    PATHWAYS.find((p) => statuses[p.key] !== "completed") ?? PATHWAYS[0];

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        fromCache
        rightLabel="Decisions"
        detail="DHET National Guidance Engine · Offline Ready · Cached"
      />

      <View style={styles.enginePill}>
        <MaterialIcon name="verified" size={16} color={colors.success} />
        <Text style={styles.engineText}>DHET National Guidance Engine</Text>
        <Text style={styles.engineMuted}>Offline Ready · Cached</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroKicker}>
          Thatha Isinqumo Esifanele · Neem die regte besluit
        </Text>
        <Text style={styles.heroTitle}>Decisions</Text>
        <Text style={styles.heroBody}>
          Unsure where to start? Use our three scientifically calibrated
          decision pathways to match school subjects, personality interests, or
          workplace environment preferences with accredited South African
          qualifications.
        </Text>
      </View>

      <View style={styles.journeyCard}>
        <View style={styles.journeyHead}>
          <View style={styles.journeyTitleRow}>
            <View style={styles.journeyIcon}>
              <MaterialIcon name="explore" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.journeyTitle}>Your Decision Journey</Text>
              <Text style={styles.journeySub}>
                {completedCount} of {PATHWAYS.length} Pathways Completed
              </Text>
            </View>
          </View>
          <View style={styles.percentPill}>
            <Text style={styles.percentText}>{percent}%</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>

        <View style={styles.journeyList}>
          {PATHWAYS.map((p) => {
            const status = statuses[p.key];
            const meta = statusMeta(status);
            return (
              <View
                key={p.key}
                style={[styles.journeyRow, { backgroundColor: meta.rowBg }]}
              >
                <View style={styles.journeyRowLeft}>
                  <MaterialIcon
                    name={meta.icon}
                    size={20}
                    color={meta.iconColor}
                  />
                  <Text
                    style={[
                      styles.journeyRowLabel,
                      status === "completed" && styles.journeyRowLabelDone,
                    ]}
                    numberOfLines={1}
                  >
                    {p.journeyLabel}
                  </Text>
                </View>
                <View
                  style={[styles.statusPill, { backgroundColor: meta.pillBg }]}
                >
                  <Text style={[styles.statusPillText, { color: meta.pillFg }]}>
                    {meta.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          style={styles.resumeBtn}
          onPress={() => router.push(href(resumeTarget.href))}
        >
          <Text style={styles.resumeText}>Resume Active Assessment</Text>
          <MaterialIcon
            name="arrow_forward"
            size={18}
            color={colors.onPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>3 Tailored Pathways</Text>
        <Text style={styles.sectionMeta}>Official DHET Validated</Text>
      </View>

      {PATHWAYS.map((p) => {
        const badge = badgeColors(p.badgeTone);
        return (
          <View key={p.key} style={styles.pathwayCard}>
            <View style={styles.pathwayBanner}>
              <Image
                source={p.banner}
                style={styles.pathwayBannerImage}
                resizeMode="cover"
              />
              <View style={styles.pathwayBannerOverlay} />
              <View style={styles.pathwayBannerBadge}>
                <MaterialIcon name={p.badgeIcon} size={14} color={badge.fg} />
                <Text
                  style={[styles.badgeText, { color: badge.fg }]}
                  numberOfLines={1}
                >
                  {p.badgeLabel}
                </Text>
              </View>
            </View>
            <View style={[styles.accentBar, { backgroundColor: p.accent }]} />
            <View style={styles.pathwayInner}>
              <View style={styles.pathwayMetaRow}>
                <View style={styles.duration}>
                  <MaterialIcon
                    name="timer"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.durationText}>{p.duration}</Text>
                </View>
              </View>

              <View style={styles.pathwayTitleRow}>
                <View style={[styles.pathwayIcon, { backgroundColor: p.iconBg }]}>
                  <MaterialIcon name={p.icon} size={24} color={p.iconColor} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.pathwayTitle}>{p.title}</Text>
                  <Text style={styles.pathwaySubtitle} numberOfLines={2}>
                    {p.subtitle}
                  </Text>
                </View>
              </View>

              <Text style={styles.pathwayBody}>{p.body}</Text>

              <View style={styles.tags}>
                {p.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                style={[styles.pathwayBtn, { backgroundColor: p.accent }]}
                onPress={() => router.push(href(p.href))}
              >
                <Text
                  style={[
                    styles.pathwayBtnText,
                    p.badgeTone === "gold" && styles.pathwayBtnTextDark,
                  ]}
                  numberOfLines={1}
                >
                  {p.cta}
                </Text>
                <MaterialIcon
                  name={p.ctaIcon}
                  size={18}
                  color={
                    p.badgeTone === "gold" ? colors.text : colors.onPrimary
                  }
                />
              </Pressable>
            </View>
          </View>
        );
      })}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Explore by field</Text>
        <Text style={styles.sectionMeta}>Browse directories</Text>
      </View>
      <Text style={styles.fieldIntro}>
        Visual gateways into university, health, and digital careers — no new
        questionnaires, just curated directory routes.
      </Text>

      {FIELD_PATHS.map((field) => (
        <Pressable
          key={field.id}
          style={styles.fieldCard}
          onPress={() => router.push(href(field.href))}
        >
          <View style={styles.fieldBanner}>
            <Image
              source={field.image}
              style={styles.pathwayBannerImage}
              resizeMode="cover"
            />
            <View style={styles.pathwayBannerOverlay} />
            <View style={styles.fieldBannerContent}>
              <View
                style={[styles.fieldIcon, { backgroundColor: `${field.accent}DD` }]}
              >
                <MaterialIcon
                  name={field.icon}
                  size={18}
                  color={colors.onPrimary}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.fieldTitle}>{field.title}</Text>
                <Text style={styles.fieldSubtitle} numberOfLines={2}>
                  {field.subtitle}
                </Text>
              </View>
              <MaterialIcon
                name="arrow_forward"
                size={20}
                color={colors.onPrimary}
              />
            </View>
          </View>
        </Pressable>
      ))}

      <View style={styles.faqCard}>
        <View style={styles.faqHead}>
          <View style={styles.faqIcon}>
            <MaterialIcon name="help" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.faqTitle}>Which tool should I take first?</Text>
            <Text style={styles.faqSub}>
              Tap the question that best matches your situation
            </Text>
          </View>
        </View>

        {FAQ.map((item) => {
          const open = faqOpen === item.id;
          return (
            <View key={item.id} style={styles.faqItem}>
              <Pressable
                style={[styles.faqBtn, open && styles.faqBtnOpen]}
                onPress={() => setFaqOpen(open ? null : item.id)}
              >
                <View style={styles.faqBtnLeft}>
                  <MaterialIcon
                    name={item.icon}
                    size={20}
                    color={open ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[styles.faqQuestion, open && styles.faqQuestionOpen]}
                    numberOfLines={2}
                  >
                    {item.question}
                  </Text>
                </View>
                <MaterialIcon
                  name={open ? "expand_less" : "expand_more"}
                  size={18}
                  color={open ? colors.primary : colors.textSecondary}
                />
              </Pressable>
              {open ? (
                <Pressable
                  style={styles.faqAnswer}
                  onPress={() => router.push(href(item.href))}
                >
                  <Text style={styles.faqBest}>{item.best}</Text>
                  <Text style={styles.faqAnswerBody}>{item.answer}</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={styles.helpCard}>
        <View style={styles.helpTop}>
          <View style={styles.helpIcon}>
            <MaterialIcon
              name="support_agent"
              size={22}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.helpTitle}>
              Need personalized help deciding?
            </Text>
            <Text style={styles.helpBody}>
              A DHET career practitioner is on standby to explain your
              diagnostic results, APS score, and application deadlines at zero
              charge.
            </Text>
          </View>
        </View>
        <Pressable
          style={styles.callBtn}
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        >
          <MaterialIcon name="call" size={18} color={colors.onPrimary} />
          <Text style={styles.callText}>
            Call Toll-Free: {HELPLINE.tollFreeDisplay}
          </Text>
        </Pressable>
        <Pressable
          style={styles.waBtn}
          onPress={() =>
            void Linking.openURL(
              `https://wa.me/27${HELPLINE.whatsapp.slice(1)}`,
            )
          }
        >
          <MaterialIcon name="chat" size={18} color={colors.success} />
          <Text style={styles.waText}>
            WhatsApp: {HELPLINE.whatsappDisplay}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  enginePill: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  engineText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: "700",
  },
  engineMuted: { ...typography.caption, color: colors.textSecondary },
  hero: { gap: 6 },
  heroKicker: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: { ...typography.headlineLg, color: colors.text },
  heroBody: { ...typography.bodySm, color: colors.textSecondary },
  journeyCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  journeyHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  journeyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  journeyIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  journeyTitle: { ...typography.headlineSm, color: colors.text },
  journeySub: { ...typography.caption, color: colors.textSecondary },
  percentPill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  percentText: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  journeyList: { gap: 8 },
  journeyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    borderRadius: radii.lg,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  journeyRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  journeyRowLabel: {
    ...typography.labelMd,
    color: colors.text,
    flexShrink: 1,
  },
  journeyRowLabelDone: { color: "#08503C", fontWeight: "600" },
  statusPill: {
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
  },
  statusPillText: { ...typography.caption, fontWeight: "700" },
  resumeBtn: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  resumeText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  sectionHead: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  sectionMeta: { ...typography.caption, color: colors.textSecondary },
  pathwayCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  pathwayBanner: {
    height: 148,
    backgroundColor: colors.muted,
  },
  pathwayBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  pathwayBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.32)",
  },
  pathwayBannerBadge: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  fieldIntro: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
    marginBottom: spacing.xs,
  },
  fieldCard: {
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  fieldBanner: {
    height: 120,
    backgroundColor: colors.muted,
    justifyContent: "flex-end",
  },
  fieldBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
  },
  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldTitle: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  fieldSubtitle: {
    ...typography.caption,
    color: "rgba(255,255,255,0.9)",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  pathwayInner: {
    padding: spacing.lg,
    paddingLeft: spacing.lg + 6,
    gap: spacing.md,
  },
  pathwayMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexShrink: 1,
    maxWidth: "72%",
  },
  badgeText: { ...typography.caption, fontWeight: "700", flexShrink: 1 },
  duration: { flexDirection: "row", alignItems: "center", gap: 4 },
  durationText: { ...typography.caption, color: colors.textSecondary },
  pathwayTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pathwayIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  pathwayTitle: { ...typography.headlineSm, color: colors.text },
  pathwaySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pathwayBody: { ...typography.bodySm, color: colors.textSecondary },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { ...typography.labelMd, color: colors.text },
  pathwayBtn: {
    minHeight: 48,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  pathwayBtnText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
    flexShrink: 1,
  },
  pathwayBtnTextDark: { color: colors.text },
  faqCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  faqHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 4,
  },
  faqIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  faqTitle: { ...typography.headlineSm, color: colors.text },
  faqSub: { ...typography.caption, color: colors.textSecondary },
  faqItem: { gap: 0 },
  faqBtn: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  faqBtnOpen: { backgroundColor: colors.primaryMuted },
  faqBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  faqQuestion: {
    ...typography.labelMd,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  faqQuestionOpen: { color: "#08503C", fontWeight: "700" },
  faqAnswer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: 4,
  },
  faqBest: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  faqAnswerBody: { ...typography.bodySm, color: colors.textSecondary },
  helpCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  helpTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: { ...typography.headlineSm, color: colors.text },
  helpBody: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  callBtn: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryDark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  callText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "700",
  },
  waBtn: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  waText: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "700",
  },
});
