import { Pressable, StyleSheet, Text } from "react-native";
import { colors, layout, radii, spacing, typography } from "../theme";

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function OptionButton({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.minTouch,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  label: {
    ...typography.bodyMd,
    color: colors.text,
  },
  labelSelected: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
});
