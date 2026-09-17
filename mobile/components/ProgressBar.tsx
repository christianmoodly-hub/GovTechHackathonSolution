import { StyleSheet, Text, View } from "react-native";
import { colors, radii, spacing, typography } from "../theme";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const ratio = Math.min(Math.max(current / safeTotal, 0), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        Question {Math.min(current, total)} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  track: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.bodySm,
    color: colors.textMuted,
    fontWeight: "600",
  },
});
