import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { QuestionnaireMatch } from "../services/types";
import { colors, radii, spacing, typography } from "../theme";
import { href } from "../utils/href";

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
              router.push(href(`/directory/occupations/${item.occupationCode}`))
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
  wrap: { gap: spacing.md },
  meta: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.bodyMd, color: colors.textSecondary },
  sep: { height: spacing.sm },
  row: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
    backgroundColor: colors.primary,
    color: colors.onPrimary,
    fontWeight: "700",
    lineHeight: 28,
  },
  body: { flex: 1, gap: 2 },
  title: { ...typography.labelLg, color: colors.text },
  code: { ...typography.caption, color: colors.textMuted },
});
