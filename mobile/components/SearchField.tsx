import { StyleSheet, TextInput, View, Text } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { colors, layout, radii, spacing, typography } from "../theme";

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
        <MaterialIcon name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
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
  wrap: { gap: spacing.sm },
  label: { ...typography.labelLg, color: colors.text },
  field: {
    minHeight: layout.minTouch,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.text,
    paddingVertical: spacing.md,
  },
});
