import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { MaterialIcon } from "../MaterialIcon";
import { colors, radii, spacing, typography } from "../../theme";

type FieldProps = TextInputProps & {
  label?: string;
  hint?: string;
  trailingLabel?: string;
  leadingIcon?: string;
  trailing?: ReactNode;
};

export function AuthField({
  label,
  hint,
  trailingLabel,
  leadingIcon,
  trailing,
  style,
  ...inputProps
}: FieldProps) {
  return (
    <View style={styles.field}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label} numberOfLines={2}>
            {label}
          </Text>
          {trailingLabel ? (
            <Text style={styles.trailingLabel} numberOfLines={1}>
              {trailingLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.inputWrap}>
        {leadingIcon ? (
          <View style={styles.leadingSlot} pointerEvents="none">
            <MaterialIcon
              name={leadingIcon}
              size={20}
              color={colors.textSecondary}
            />
          </View>
        ) : null}
        <TextInput
          placeholderTextColor="#6F7A73"
          underlineColorAndroid="transparent"
          {...inputProps}
          style={[styles.input, style]}
        />
        {trailing ? <View style={styles.trailingSlot}>{trailing}</View> : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function AuthCheckbox({
  checked,
  onToggle,
  title,
  body,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  body?: string;
}) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? (
          <MaterialIcon name="check" size={14} color={colors.onPrimary} />
        ) : null}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.checkTitle}>{title}</Text>
        {body ? <Text style={styles.checkBody}>{body}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4, width: "100%" },
  labelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  label: { ...typography.labelLg, color: colors.text, flex: 1, flexShrink: 1 },
  trailingLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 0,
    marginTop: 2,
  },
  inputWrap: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.canvas,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    overflow: "hidden",
  },
  leadingSlot: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  trailingSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 48,
    paddingHorizontal: spacing.sm,
    paddingVertical: Platform.OS === "android" ? 10 : 12,
    margin: 0,
    fontSize: 15,
    fontWeight: "400",
    color: colors.text,
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  },
  hint: { ...typography.caption, color: colors.textSecondary },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    width: "100%",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkTitle: { ...typography.bodySm, color: colors.text, fontWeight: "700" },
  checkBody: { ...typography.caption, color: colors.textSecondary },
});
