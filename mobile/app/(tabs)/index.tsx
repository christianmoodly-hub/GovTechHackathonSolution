import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../contexts/AuthContext";
import {
  FUNDING_CARDS,
  HELPLINE,
  OFFLINE_VAULT_STATS,
} from "../../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../../theme";
import { href } from "../../utils/href";

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const completedCount = Object.values(profile?.questionnaireResults ?? {}).filter(
    (result) => result && Array.isArray(result.matches) && result.matches.length,
  ).length;
  const favouritesCount = profile?.favourites?.length ?? 0;

  return (
    <Screen>
      <Text style={styles.brand}>National Career Advice Portal</Text>
      <Text style={styles.title}>
        Your self-help tool for informed career and study decisions
      </Text>
      <Text style={styles.body}>
        Signed in as {user?.email}. {completedCount} questionnaire
        {completedCount === 1 ? "" : "s"} completed · {favouritesCount} saved items.
      </Text>

      <View style={styles.banner}>
        <Text style={styles.bannerMark}>☎</Text>
        <View style={styles.bannerBody}>
          <Text style={styles.bannerTitle}>Free career counselling</Text>
          <Text style={styles.bannerText}>
            Speak to a Career Advisor ({HELPLINE.hours}) · Toll-free{" "}
            {HELPLINE.tollFreeDisplay}
          </Text>
        </View>
        <Pressable onPress={() => router.push(href("/helpline"))}>
          <Text style={styles.link}>Open</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Core decision gateways</Text>
      <GatewayCard
        mark="1"
        title="Subject Choice"
        body="Find Grade 10–12 subjects that keep tertiary doors open."
        cta="Explore subjects"
        onPress={() => router.push(href("/questionnaires/subject-chooser"))}
      />
      <GatewayCard
        mark="2"
        title="Career Choice Questionnaire"
        body="Discover occupations aligned with your interests and personality."
        cta="Start assessment"
        onPress={() => router.push(href("/questionnaires/career-choice"))}
      />
      <GatewayCard
        mark="3"
        title="Job Fit Questionnaire"
        body="Match working style and technical skills with TVET and workplace roles."
        cta="Check job fit"
        onPress={() => router.push(href("/questionnaires/job-fit"))}
      />

      <Text style={styles.section}>Explore directory</Text>
      <Pressable style={styles.dirRow} onPress={() => router.push(href("/directory"))}>
        <Text style={styles.dirTitle}>Careers directory</Text>
        <Text style={styles.dirMeta}>
          {OFFLINE_VAULT_STATS.careersCached.toLocaleString()} occupations
        </Text>
      </Pressable>
      <Pressable
        style={styles.dirRow}
        onPress={() => router.push(href("/directory/qualifications"))}
      >
        <Text style={styles.dirTitle}>What to study</Text>
        <Text style={styles.dirMeta}>
          {OFFLINE_VAULT_STATS.qualificationsCached.toLocaleString()} qualifications
        </Text>
      </Pressable>
      <Pressable
        style={styles.dirRow}
        onPress={() => router.push(href("/directory/providers"))}
      >
        <Text style={styles.dirTitle}>Where to study</Text>
        <Text style={styles.dirMeta}>
          {OFFLINE_VAULT_STATS.providersCached.toLocaleString()} providers
        </Text>
      </Pressable>

      <Text style={styles.section}>Funding & NSFAS</Text>
      {FUNDING_CARDS.map((card) => (
        <View key={card.id} style={styles.fundCard}>
          <Text style={styles.fundTitle}>{card.title}</Text>
          <Text style={styles.fundBody}>{card.body}</Text>
        </View>
      ))}

      <View style={styles.vault}>
        <Text style={styles.fundTitle}>Offline vault</Text>
        <Text style={styles.fundBody}>
          {OFFLINE_VAULT_STATS.storageLabel} · {OFFLINE_VAULT_STATS.note}
        </Text>
      </View>
    </Screen>
  );
}

function GatewayCard({
  mark,
  title,
  body,
  cta,
  onPress,
}: {
  mark: string;
  title: string;
  body: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.gateway} onPress={onPress}>
      <View style={styles.mark}>
        <Text style={styles.markText}>{mark}</Text>
      </View>
      <View style={styles.gatewayBody}>
        <Text style={styles.gatewayTitle}>{title}</Text>
        <Text style={styles.gatewayText}>{body}</Text>
        <Text style={styles.link}>{cta} →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brand: {
    ...typography.labelMd,
    color: colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  section: { ...typography.headlineSm, color: colors.text, marginTop: spacing.sm },
  banner: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  bannerMark: { fontSize: 22, color: colors.secondary },
  bannerBody: { flex: 1, gap: 2 },
  bannerTitle: { ...typography.labelLg, color: colors.text },
  bannerText: { ...typography.bodySm, color: colors.textSecondary },
  link: { ...typography.labelLg, color: colors.primary },
  gateway: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    ...shadows.card,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: { ...typography.labelLg, color: colors.primary },
  gatewayBody: { flex: 1, gap: 6 },
  gatewayTitle: { ...typography.headlineSm, color: colors.text },
  gatewayText: { ...typography.bodySm, color: colors.textSecondary },
  dirRow: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 4,
  },
  dirTitle: { ...typography.labelLg, color: colors.text },
  dirMeta: { ...typography.bodySm, color: colors.textMuted },
  fundCard: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: 4,
  },
  fundTitle: { ...typography.labelLg, color: colors.text },
  fundBody: { ...typography.bodySm, color: colors.textSecondary },
  vault: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.lg,
    gap: 4,
    backgroundColor: colors.primaryMuted,
  },
});
