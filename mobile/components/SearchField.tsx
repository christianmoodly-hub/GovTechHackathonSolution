import { Platform, StyleSheet, TextInput, View, Text } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { layout, radii, shadows, spacing, typography } from "../theme";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  label?: string;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = "Search…",
  label,
}: Props) {
  const { colors, highContrast } = useAccessibility();

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.card,
            borderWidth: highContrast ? 2 : 0,
            borderColor: colors.border,
          },
          !highContrast && shadows.card,
        ]}
      >
        <View style={styles.iconSlot} pointerEvents="none">
          <MaterialIcon name="search" size={20} color={colors.textSecondary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            highContrast ? "#444444" : "rgba(111,122,115,0.85)"
          }
          underlineColorAndroid="transparent"
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, width: "100%" },
  label: { ...typography.labelLg },
  field: {
    minHeight: layout.minTouch,
    height: 48,
    borderRadius: radii.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconSlot: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    margin: 0,
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === "android" ? 10 : 12,
    fontSize: 15,
    fontWeight: "400",
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
});
