import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { MaterialIcon } from "../MaterialIcon";
import { colors, layout, radii, spacing, typography } from "../../theme";

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
          <Text style={styles.label}>{label}</Text>
          {trailingLabel ? <Text style={styles.trailingLabel}>{trailingLabel}</Text> : null}
        </View>
      ) : null}
      <View style={styles.inputWrap}>
        {leadingIcon ? (
          <MaterialIcon
            name={leadingIcon}
            size={20}
            color={colors.textSecondary}
            style={styles.leadingIcon}
          />
        ) : null}
        <TextInput
          placeholderTextColor="#6F7A73"
          style={[
            styles.input,
            leadingIcon ? styles.inputWithIcon : null,
            trailing ? styles.inputWithTrailing : null,
            style,
          ]}
          {...inputProps}
        />
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
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
        {checked ? <MaterialIcon name="check" size={14} color={colors.onPrimary} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkTitle}>{title}</Text>
        {body ? <Text style={styles.checkBody}>{body}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  label: { ...typography.labelLg, color: colors.text },
  trailingLabel: { ...typography.caption, color: colors.textSecondary },
  inputWrap: { position: "relative", justifyContent: "center" },
  leadingIcon: { position: "absolute", left: 12, zIndex: 1 },
  trailing: {
    position: "absolute",
    right: 4,
    height: layout.minTouch,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: layout.minTouch,
    borderRadius: radii.md,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.md,
    ...typography.bodyMd,
    color: colors.text,
  },
  inputWithIcon: { paddingLeft: 40 },
  inputWithTrailing: { paddingRight: 44 },
  hint: { ...typography.caption, color: colors.textSecondary },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkTitle: { ...typography.bodySm, color: colors.text, fontWeight: "700" },
  checkBody: { ...typography.caption, color: colors.textSecondary },
});
