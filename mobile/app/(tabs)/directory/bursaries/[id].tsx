import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
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
import { getBursary } from "../../../../services/ncapData";
import type { Bursary } from "../../../../services/types";
import { useVaultStats } from "../../../../hooks/useVaultStats";
import { colors, radii, shadows, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";
import {
  bursaryFieldAccent,
  closingUrgency,
} from "../../../../utils/bursaryPresentation";

export default function BursaryDetailScreen() {
  const router = useRouter();
  const vault = useVaultStats();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bursary, setBursary] = useState<Bursary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) {
        setError("Missing bursary id");
        setLoading(false);
        return;
      }
      try {
        const data = await getBursary(String(id));
        if (!alive) return;
        if (!data) setError("Bursary not found");
        setBursary(data);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load bursary");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const urgency = useMemo(
    () =>
      bursary
        ? closingUrgency(
            bursary.closingDateIso,
            bursary.openAllYear,
            bursary.closingDate,
          )
        : null,
    [bursary],
  );

  const accent = bursary ? bursaryFieldAccent(bursary.fieldSlug) : colors.ochre;

  const onShare = async () => {
    if (!bursary) return;
    try {
      await Share.share({
        message: `${bursary.title} — ${bursary.url}`,
        title: bursary.title,
      });
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <Screen>
        <KhethaBrandBar />
        <LoadingState label="Loading bursary…" />
      </Screen>
    );
  }

  if (error || !bursary) {
    return (
      <Screen>
        <KhethaBrandBar />
        <Text style={styles.errorText}>{error ?? "Bursary not found"}</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to bursaries</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.bursariesCached}
        fromCache
        rightLabel="Directory"
        onRightPress={() => router.push(href("/directory/bursaries"))}
      />

      <View style={styles.navRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Back to bursaries"
        >
          <MaterialIcon name="arrow_back_ios" size={18} color={colors.primary} />
          <Text style={styles.backText}>Bursaries</Text>
        </Pressable>
        <View style={styles.navActions}>
          <FavouriteToggle
            compact
            type="bursary"
            url={bursary.url}
            title={bursary.title}
            entityId={bursary.id}
          />
          <Pressable onPress={() => void onShare()} style={styles.iconBtn}>
            <MaterialIcon name="share" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.hero, { borderLeftColor: accent }]}>
        <View style={[styles.fieldPill, { backgroundColor: accent + "22" }]}>
          <Text style={[styles.fieldPillText, { color: accent }]}>
            {bursary.fieldLabel}
          </Text>
        </View>
        <Text style={styles.title}>{bursary.title}</Text>
        {bursary.providerName ? (
          <Text style={styles.provider}>{bursary.providerName}</Text>
        ) : null}
        {urgency ? (
          <View style={styles.urgencyPill}>
            <MaterialIcon name="event" size={16} color={colors.ochre} />
            <Text style={styles.urgencyText}>{urgency.label}</Text>
          </View>
        ) : null}
        <Text style={styles.attr}>
          Aggregated from ZABursaries · always verify on the provider&apos;s site
        </Text>
      </View>

      {bursary.applicationLink ? (
        <Pressable
          style={styles.primaryBtn}
          onPress={() => void Linking.openURL(bursary.applicationLink!)}
        >
          <Text style={styles.primaryBtnText}>Apply now</Text>
          <MaterialIcon name="open_in_new" size={18} color={colors.onPrimary} />
        </Pressable>
      ) : null}

      {bursary.description ? (
        <Section title="About this bursary">
          <Text style={styles.body}>{bursary.description}</Text>
        </Section>
      ) : null}

      {bursary.eligibility.length ? (
        <Section title="Eligibility">
          {bursary.eligibility.map((item) => (
            <Text key={item} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </Section>
      ) : null}

      {bursary.applicationSteps.length ? (
        <Section title="How to apply">
          {bursary.applicationSteps.map((item, idx) => (
            <Text key={`${idx}-${item.slice(0, 24)}`} style={styles.bullet}>
              {idx + 1}. {item}
            </Text>
          ))}
        </Section>
      ) : null}

      {bursary.requiredDocuments.length ? (
        <Section title="Required documents">
          {bursary.requiredDocuments.map((item) => (
            <View key={item} style={styles.docRow}>
              <MaterialIcon name="check_box" size={18} color={colors.primary} />
              <Text style={styles.docText}>{item}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {(bursary.contactInfo ||
        bursary.contactEmail ||
        bursary.contactPhone) && (
        <Section title="Contact">
          {bursary.contactInfo ? (
            <Text style={styles.body}>{bursary.contactInfo}</Text>
          ) : null}
          {bursary.contactEmail ? (
            <Pressable
              onPress={() =>
                void Linking.openURL(`mailto:${bursary.contactEmail}`)
              }
              style={styles.contactBtn}
            >
              <MaterialIcon name="mail" size={18} color={colors.primary} />
              <Text style={styles.contactBtnText}>{bursary.contactEmail}</Text>
            </Pressable>
          ) : null}
          {bursary.contactPhone ? (
            <Pressable
              onPress={() =>
                void Linking.openURL(
                  `tel:${bursary.contactPhone!.replace(/\s+/g, "")}`,
                )
              }
              style={styles.contactBtn}
            >
              <MaterialIcon name="call" size={18} color={colors.primary} />
              <Text style={styles.contactBtnText}>{bursary.contactPhone}</Text>
            </Pressable>
          ) : null}
        </Section>
      )}

      <Pressable
        style={styles.secondaryBtn}
        onPress={() => void Linking.openURL(bursary.url)}
      >
        <Text style={styles.secondaryBtnText}>View original listing</Text>
        <MaterialIcon name="open_in_new" size={16} color={colors.primary} />
      </Pressable>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { ...typography.labelLg, color: colors.primary },
  navActions: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  hero: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderLeftWidth: 4,
    ...shadows.card,
    marginBottom: spacing.lg,
  },
  fieldPill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  fieldPillText: { ...typography.labelMd, fontWeight: "600" },
  title: { ...typography.headlineSm, color: colors.text },
  provider: { ...typography.bodyMd, color: colors.textSecondary },
  urgencyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#FFF4E5",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  urgencyText: { ...typography.labelMd, color: colors.ochre },
  attr: { ...typography.caption, color: colors.textSecondary },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  primaryBtnText: { ...typography.labelLg, color: colors.onPrimary },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  secondaryBtnText: { ...typography.labelLg, color: colors.primary },
  section: { marginBottom: spacing.lg, gap: spacing.sm },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary, lineHeight: 22 },
  bullet: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: 6,
  },
  docText: { ...typography.bodyMd, color: colors.text, flex: 1 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 6,
  },
  contactBtnText: { ...typography.labelLg, color: colors.primary },
  errorText: { ...typography.bodyMd, color: colors.error, margin: spacing.lg },
  backLink: { marginHorizontal: spacing.lg },
  backLinkText: { ...typography.labelLg, color: colors.primary },
});
