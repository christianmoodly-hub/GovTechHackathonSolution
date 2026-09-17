import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen, LoadingState } from "../../../../components/Screen";
import { FavouriteToggle } from "../../../../components/FavouriteToggle";
import { getOccupation } from "../../../../services/ncapData";
import { stableUrlId } from "../../../../services/ids";
import type { Occupation } from "../../../../services/types";
import { colors, radii, spacing, typography } from "../../../../theme";
import { href } from "../../../../utils/href";

export default function OccupationDetailScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!code) {
        setError("Missing occupation code");
        setLoading(false);
        return;
      }
      try {
        const data = await getOccupation(String(code));
        if (!alive) return;
        if (!data) setError("Occupation not found");
        setOccupation(data);
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "Failed to load occupation");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const openQualification = async (url: string | null | undefined) => {
    if (!url) return;
    const id = await stableUrlId(url);
    router.push(href(`/directory/qualifications/${id}`));
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </Pressable>

      {loading ? <LoadingState /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {occupation ? (
        <View style={styles.block}>
          <Text style={styles.kicker}>Career profile</Text>
          <Text style={styles.title}>{occupation.title}</Text>
          <Text style={styles.code}>OFO {occupation.occupationCode}</Text>

          <FavouriteToggle
            type="occupation"
            url={occupation.url}
            title={occupation.title}
            entityId={occupation.occupationCode}
          />

          {occupation.alternativeTitles?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Also known as</Text>
              <Text style={styles.body}>
                {occupation.alternativeTitles.slice(0, 8).join(" · ")}
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily tasks</Text>
            {(occupation.tasks?.length ? occupation.tasks : ["No tasks listed."]).map(
              (task) => (
                <Text key={task} style={styles.bullet}>
                  • {task}
                </Text>
              ),
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning pathways</Text>
            {(occupation.qualifications?.length
              ? occupation.qualifications
              : [{ title: "No linked qualifications on this record.", url: null }]
            ).map((qual, index) =>
              qual.url ? (
                <Pressable
                  key={`${qual.title}-${index}`}
                  onPress={() => void openQualification(qual.url)}
                >
                  <Text style={styles.link}>• {qual.title}</Text>
                </Pressable>
              ) : (
                <Text key={`${qual.title}-${index}`} style={styles.bullet}>
                  • {qual.title}
                </Text>
              ),
            )}
          </View>

          {occupation.entryRequirements?.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Entry notes</Text>
              {occupation.entryRequirements.slice(0, 8).map((item) => (
                <Text key={item} style={styles.bullet}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}
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
  code: { ...typography.bodySm, color: colors.textMuted },
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
