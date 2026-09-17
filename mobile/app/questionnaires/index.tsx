import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

const TOOLS = [
  {
    href: "/questionnaires/subject-chooser",
    title: "Subject Chooser",
    body: "Match careers to the school subjects you enjoy.",
    key: "subjectChooser" as const,
  },
  {
    href: "/questionnaires/career-choice",
    title: "Career Choice",
    body: "Explore interests and values to find career directions.",
    key: "careerChoice" as const,
  },
  {
    href: "/questionnaires/job-fit",
    title: "Job Fit",
    body: "See which occupations match how you like to work.",
    key: "jobFit" as const,
  },
];

export default function QuestionnairesHub() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Home</Text>
        </Pressable>
        <Text style={styles.title}>Questionnaires</Text>
        <Text style={styles.subtitle}>
          Three separate NCAP-style tools. Each saves its own results to your
          profile.
        </Text>

        {TOOLS.map((tool) => {
          const prior = profile?.questionnaireResults?.[tool.key];
          return (
            <Pressable
              key={tool.href}
              style={styles.card}
              onPress={() => router.push(tool.href as never)}
            >
              <Text style={styles.cardTitle}>{tool.title}</Text>
              <Text style={styles.cardBody}>{tool.body}</Text>
              <Text style={styles.badge}>
                {prior?.matches?.length
                  ? `${prior.matches.length} saved matches`
                  : "Not completed yet"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  container: { flex: 1, padding: 24, gap: 14 },
  back: { color: "#0B3D2E", fontWeight: "600", marginBottom: 4 },
  title: { fontSize: 30, fontWeight: "700", color: "#10231C" },
  subtitle: { fontSize: 15, lineHeight: 22, color: "#4A5C54", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E2DC",
    padding: 16,
    gap: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#10231C" },
  cardBody: { fontSize: 14, lineHeight: 20, color: "#4A5C54" },
  badge: { fontSize: 12, fontWeight: "700", color: "#0B3D2E" },
});
