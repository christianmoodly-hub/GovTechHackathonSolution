import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { radii, shadows, spacing, typography } from "../theme";

type Props = {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
};

export function EntityCard({ title, subtitle, meta, onPress }: Props) {
  const { colors, highContrast } = useAccessibility();

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: highContrast ? 2 : 1,
        },
        !highContrast && shadows.card,
      ]}
    >
      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? (
          <Text style={[styles.meta, { color: colors.textMuted }]}>{meta}</Text>
        ) : null}
      </View>
      {onPress ? (
        <Text style={[styles.chevron, { color: colors.primary }]}>›</Text>
      ) : null}
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
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  body: { flex: 1, gap: 4 },
  title: { ...typography.headlineSm },
  subtitle: { ...typography.bodySm },
  meta: { ...typography.caption },
  chevron: { fontSize: 22, fontWeight: "700" },
});
