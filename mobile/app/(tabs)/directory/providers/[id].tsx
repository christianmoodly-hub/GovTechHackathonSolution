import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, LoadingState } from "../../../../components/Screen";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import { getProvider } from "../../../../services/ncapData";
import type { Provider } from "../../../../services/types";
import { colors, radii, spacing, typography } from "../../../../theme";

export default function ProviderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        setError(err instanceof Error ? err.message : "Failed to load provider");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {provider ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>Learning provider</Text>
          <Text style={styles.title}>{provider.name}</Text>

          <FavouriteToggle
            type="provider"
            url={provider.url}
            title={provider.name}
            entityId={provider.id}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            {provider.website ? (
              <Pressable onPress={() => void Linking.openURL(provider.website!)}>
                <Text style={styles.link}>{provider.website}</Text>
              </Pressable>
            ) : null}
            {provider.email ? (
              <Pressable
                onPress={() => void Linking.openURL(`mailto:${provider.email}`)}
              >
                <Text style={styles.link}>{provider.email}</Text>
              </Pressable>
            ) : null}
            {provider.telephone ? (
              <Pressable
                onPress={() =>
                  void Linking.openURL(
                    `tel:${provider.telephone!.replace(/\s+/g, "")}`,
                  )
                }
              >
                <Text style={styles.link}>{provider.telephone}</Text>
              </Pressable>
            ) : null}
            {provider.streetAddress ? (
              <Text style={styles.body}>{provider.streetAddress}</Text>
            ) : null}
            {!provider.website &&
            !provider.email &&
            !provider.telephone &&
            !provider.streetAddress ? (
              <Text style={styles.body}>No contact details listed.</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offered qualifications</Text>
            {(provider.offeredQualifications?.length
              ? provider.offeredQualifications
              : [{ title: "No qualifications listed on this record." }]
            )
              .slice(0, 20)
              .map((qual, index) => (
                <Text key={`${qual.title}-${index}`} style={styles.bullet}>
                  • {qual.title}
                  {qual.nqf_level ? ` (${qual.nqf_level})` : ""}
                </Text>
              ))}
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
  body: { ...typography.bodySm, color: colors.textSecondary },
  bullet: { ...typography.bodySm, color: colors.textSecondary },
  link: { ...typography.bodySm, color: colors.primary, fontWeight: "600" },
});
