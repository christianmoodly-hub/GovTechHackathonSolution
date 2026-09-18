import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { layout, radii, spacing, typography } from "../theme";

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
  const { colors, highContrast } = useAccessibility();
  const isDisabled = disabled || busy;

  const bg =
    variant === "primary"
      ? colors.primary
      : variant === "gold"
        ? highContrast
          ? colors.primary
          : "#F2A900"
        : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderWidth: variant === "secondary" || highContrast ? 2 : 0,
          borderColor: colors.primary,
        },
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
            {
              color:
                variant === "secondary"
                  ? colors.primary
                  : variant === "gold" && !highContrast
                    ? "#0F172A"
                    : colors.onPrimary,
            },
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
  disabled: { opacity: 0.45 },
  label: { ...typography.labelLg },
});
