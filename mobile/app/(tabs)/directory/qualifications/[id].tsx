import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, LoadingState } from "../../../../components/Screen";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import { getQualification } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Qualification } from "../../../../services/types";
import { FUNDING_CARDS } from "../../../../data/staticContent";
import { colors, radii, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";

export default function QualificationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [qualification, setQualification] = useState<Qualification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) {
        setError("Missing qualification id");
        setLoading(false);
        return;
      }
      try {
        const data = await getQualification(String(id));
        if (!alive) return;
        if (!data) setError("Qualification not found");
        setQualification(data);
      } catch (err) {
        if (!alive) return;
        setError(
          err instanceof Error ? err.message : "Failed to load qualification",
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const openProvider = async (url: string | null | undefined) => {
    if (!url) return;
    const providerDocId = await stableUrlId(url);
    router.push(href(`/directory/providers/${providerDocId}`));
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {qualification ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>Qualification</Text>
          <Text style={styles.title}>{qualification.title}</Text>
          {qualification.nqfLevel ? (
            <Text style={styles.meta}>{qualification.nqfLevel}</Text>
          ) : null}
          {qualification.duration ? (
            <Text style={styles.meta}>Duration: {qualification.duration}</Text>
          ) : null}

          <FavouriteToggle
            type="qualification"
            url={qualification.url}
            title={qualification.title}
            entityId={qualification.id}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Providers</Text>
            {(qualification.providers?.length
              ? qualification.providers
              : [{ name: "No providers listed on this record.", url: null }]
            ).map((provider, index) =>
              provider.url ? (
                <Pressable
                  key={`${provider.name}-${index}`}
                  onPress={() => void openProvider(provider.url)}
                >
                  <Text style={styles.link}>• {provider.name}</Text>
                </Pressable>
              ) : (
                <Text key={`${provider.name}-${index}`} style={styles.bullet}>
                  • {provider.name}
                </Text>
              ),
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding guidance</Text>
            <Text style={styles.bullet}>{FUNDING_CARDS[0].body}</Text>
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { ...typography.labelLg, color: colors.primary },
  error: { color: colors.error },
  block: { gap: spacing.md },
  kicker: {
    ...typography.labelMd,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  title: { ...typography.headlineLg, color: colors.text },
  meta: { ...typography.bodySm, color: colors.textMuted },
  section: {
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionTitle: { ...typography.headlineSm, color: colors.primary },
  bullet: { ...typography.bodySm, color: colors.textSecondary },
  link: { ...typography.bodySm, color: colors.primary, fontWeight: "600" },
});
