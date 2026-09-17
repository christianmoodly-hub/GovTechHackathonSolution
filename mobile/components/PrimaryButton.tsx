import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, layout, radii, spacing, typography } from "../theme";

type Variant = "primary" | "secondary" | "gold";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  busy,
  variant = "primary",
  style,
}: Props) {
  const isDisabled = disabled || busy;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "gold" && styles.gold,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator
          color={variant === "secondary" ? colors.primary : colors.onPrimary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "secondary" && styles.secondaryLabel,
            variant === "gold" && styles.goldLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minTouch,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  gold: { backgroundColor: colors.gold },
  disabled: { opacity: 0.45 },
  label: { ...typography.labelLg, color: colors.onPrimary },
  secondaryLabel: { color: colors.primary },
  goldLabel: { color: colors.text },
});
