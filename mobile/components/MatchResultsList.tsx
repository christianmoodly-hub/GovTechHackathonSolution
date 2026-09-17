import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { QuestionnaireMatch } from "../services/types";

type Props = {
  matches: QuestionnaireMatch[];
  completedAt?: string;
};

export function MatchResultsList({ matches, completedAt }: Props) {
  const router = useRouter();

  if (!matches.length) {
    return (
      <Text style={styles.empty}>
        No strong occupation matches yet. Try different answers for a broader set.
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      {completedAt ? (
        <Text style={styles.meta}>
          Saved {new Date(completedAt).toLocaleString()}
        </Text>
      ) : null}
      <FlatList
        data={matches}
        keyExtractor={(item) => item.occupationCode}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/occupations/[code]",
                params: { code: item.occupationCode },
              })
            }
          >
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.code}>
                Code {item.occupationCode} · match score {item.score}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  meta: { fontSize: 12, color: "#6A7B73" },
  empty: { fontSize: 15, color: "#4A5C54", lineHeight: 22 },
  sep: { height: 10 },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E2DC",
    padding: 14,
    alignItems: "center",
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    backgroundColor: "#0B3D2E",
    color: "#fff",
    fontWeight: "700",
    lineHeight: 28,
  },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: "700", color: "#10231C" },
  code: { fontSize: 12, color: "#6A7B73" },
});
