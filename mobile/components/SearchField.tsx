import { Platform, StyleSheet, TextInput, View, Text } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { colors, layout, radii, shadows, spacing, typography } from "../theme";

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
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.field}>
        <View style={styles.iconSlot} pointerEvents="none">
          <MaterialIcon name="search" size={20} color={colors.textSecondary} />
        </View>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(111,122,115,0.85)"
          underlineColorAndroid="transparent"
          style={styles.input}
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
  label: { ...typography.labelLg, color: colors.text },
  field: {
    minHeight: layout.minTouch,
    height: 48,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...shadows.card,
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
    color: colors.text,
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
});
