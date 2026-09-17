import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FavouriteToggle } from "../../components/FavouriteToggle";
import { getProvider } from "../../services/ncapData";
import type { Provider } from "../../services/types";

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </Pressable>

        {loading ? <ActivityIndicator color="#0B3D2E" /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {provider ? (
          <View style={styles.block}>
            <Text style={styles.kicker}>Provider</Text>
            <Text style={styles.title}>{provider.name}</Text>

            <FavouriteToggle
              type="provider"
              url={provider.url}
              title={provider.name}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              {provider.website ? (
                <Pressable onPress={() => void Linking.openURL(provider.website!)}>
                  <Text style={styles.link}>{provider.website}</Text>
                </Pressable>
              ) : null}
              {provider.email ? (
                <Text style={styles.body}>{provider.email}</Text>
              ) : null}
              {provider.telephone ? (
                <Text style={styles.body}>{provider.telephone}</Text>
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
  section: { gap: 8, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0B3D2E" },
  body: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  bullet: { fontSize: 14, lineHeight: 21, color: "#4A5C54" },
  link: { fontSize: 14, lineHeight: 21, color: "#0B3D2E", fontWeight: "600" },
});
