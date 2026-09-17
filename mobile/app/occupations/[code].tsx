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
import { getOccupation } from "../../services/ncapData";
import { stableUrlId } from "../../services/ids";
import type { Occupation } from "../../services/types";

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
    router.push(`/qualifications/${id}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        {loading ? <ActivityIndicator color="#0B3D2E" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {occupation ? (
          <View style={styles.block}>
            <Text style={styles.kicker}>Occupation</Text>
            <Text style={styles.title}>{occupation.title}</Text>
            <Text style={styles.code}>Code {occupation.occupationCode}</Text>

            <FavouriteToggle
              type="occupation"
              url={occupation.url}
              title={occupation.title}
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
              <Text style={styles.sectionTitle}>Tasks</Text>
              {(occupation.tasks?.length ? occupation.tasks : ["No tasks listed."]).map(
                (task) => (
                  <Text key={task} style={styles.bullet}>
                    • {task}
                  </Text>
                ),
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learning pathways / quals</Text>
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
  code: { fontSize: 14, color: "#6A7B73" },
  section: { gap: 8, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0B3D2E" },
  body: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  bullet: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  link: { fontSize: 14, lineHeight: 21, color: "#0B3D2E", fontWeight: "600" },
});
