import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadows, spacing, typography } from "../theme";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
};

export function EntityCard({ title, subtitle, meta, onPress }: Props) {
  const content = (
    <View style={styles.card}>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.card,
  },
  body: { flex: 1, gap: 4 },
  title: { ...typography.headlineSm, color: colors.text },
  subtitle: { ...typography.bodySm, color: colors.textSecondary },
  meta: { ...typography.caption, color: colors.textMuted },
  chevron: { fontSize: 22, color: colors.primary, fontWeight: "700" },
});
