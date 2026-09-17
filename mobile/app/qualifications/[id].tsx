import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FavouriteToggle } from "../../components/FavouriteToggle";
import { getQualification } from "../../services/ncapData";
import { stableUrlId } from "../../services/ids";
import type { Qualification } from "../../services/types";

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
    router.push(`/providers/${providerDocId}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        {loading ? <ActivityIndicator color="#0B3D2E" /> : null}
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
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  content: { padding: 24, gap: 16, paddingBottom: 40 },
  back: { color: "#0B3D2E", fontWeight: "600" },
  error: { color: "#A11B1B" },
  block: { gap: 12 },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#6A7B73",
    fontWeight: "700",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#10231C" },
  meta: { fontSize: 14, color: "#6A7B73" },
  section: { gap: 8, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0B3D2E" },
  bullet: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  link: { fontSize: 14, lineHeight: 21, color: "#0B3D2E", fontWeight: "600" },
});
