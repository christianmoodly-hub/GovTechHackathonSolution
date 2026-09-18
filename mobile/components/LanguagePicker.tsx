import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useLocale } from "../contexts/LocaleContext";
import { LANGUAGES } from "../data/staticContent";
import { isAppLocale, type AppLocale } from "../i18n/types";
import { MaterialIcon } from "./MaterialIcon";
import { colors, radii, shadows, spacing, typography } from "../theme";

type Props = {
  /** Optional label above the control. Defaults to common.voiceLabel. */
  label?: string;
  showLabel?: boolean;
  /** e.g. white text on the dark home hero. */
  labelStyle?: StyleProp<TextStyle>;
};

/** Language selector: current language button opens a scrollable list of all 11 SA languages. */
export function LanguagePicker({ label, showLabel = true, labelStyle }: Props) {
  const { locale, setLocale, common } = useLocale();
  const [open, setOpen] = useState(false);

  const current =
    LANGUAGES.find((lang) => lang.id === locale)?.label ?? "English";

  return (
    <View style={styles.wrap}>
      {showLabel ? (
        <Text style={[styles.label, labelStyle]}>
          {label ?? common.voiceLabel}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={common.changeLanguage}
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <MaterialIcon name="language" size={18} color={colors.primary} />
        <Text style={styles.triggerText}>{current}</Text>
        <MaterialIcon name="expand_more" size={20} color={colors.textMuted} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>{common.selectLanguage}</Text>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
            >
              {LANGUAGES.map((lang) => {
                const id = lang.id as string;
                if (!isAppLocale(id)) return null;
                const active = locale === id;
                return (
                  <Pressable
                    key={id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={lang.label}
                    onPress={() => {
                      setLocale(id as AppLocale);
                      setOpen(false);
                    }}
                    style={[styles.row, active && styles.rowActive]}
                  >
                    <Text
                      style={[styles.rowText, active && styles.rowTextActive]}
                    >
                      {lang.label}
                    </Text>
                    {active ? (
                      <MaterialIcon
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setOpen(false)}
              accessibilityRole="button"
            >
              <Text style={styles.closeText}>{common.close}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
    minHeight: 44,
  },
  triggerText: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "700",
    flexShrink: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    maxHeight: "75%",
    ...shadows.card,
  },
  sheetTitle: {
    ...typography.headlineMd,
    color: colors.text,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  list: { flexGrow: 0 },
  listContent: { gap: spacing.xs, paddingBottom: spacing.md },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    minHeight: 48,
  },
  rowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  rowText: {
    ...typography.bodyMd,
    color: colors.text,
    fontWeight: "600",
  },
  rowTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  closeBtn: {
    marginTop: spacing.sm,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  closeText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "700",
  },
});
