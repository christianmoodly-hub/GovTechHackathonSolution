import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, isSignedIn, signOut, profile } = useAuth();
  const completedCount = Object.values(profile?.questionnaireResults ?? {}).filter(
    (result) => result && Array.isArray(result.matches) && result.matches.length,
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.brand}>NCAP</Text>
        <Text style={styles.title}>Career advice</Text>
        <Text style={styles.body}>
          Signed in as {user?.email}
          {"\n"}
          isSignedIn: {String(isSignedIn)}
        </Text>
        <Text style={styles.meta}>
          {completedCount} questionnaire tool{completedCount === 1 ? "" : "s"}{" "}
          completed · {profile?.favourites?.length ?? 0} favourites
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/questionnaires")}
        >
          <Text style={styles.buttonText}>Open questionnaires</Text>
        </Pressable>

        <Pressable onPress={() => void signOut()} style={styles.secondary}>
          <Text style={styles.secondaryText}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    gap: 12,
  },
  brand: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#0B3D2E",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10231C",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5C54",
  },
  meta: {
    fontSize: 14,
    color: "#6A7B73",
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#0B3D2E",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondary: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },
  secondaryText: {
    color: "#0B3D2E",
    fontWeight: "600",
  },
});
