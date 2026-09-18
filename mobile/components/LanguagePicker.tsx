import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import { useLocale } from "../contexts/LocaleContext";
import { LANGUAGES } from "../data/staticContent";
import { isAppLocale, type AppLocale } from "../i18n/types";
import { colors, radii, spacing, typography } from "../theme";

type Props = {
  /** Optional label above the chips. Defaults to common.voiceLabel. */
  label?: string;
  showLabel?: boolean;
  /** e.g. white text on the dark home hero. */
  labelStyle?: StyleProp<TextStyle>;
};

/** Shared EN / isiZulu / isiXhosa / Afrikaans language chips. */
export function LanguagePicker({ label, showLabel = true, labelStyle }: Props) {
  const { locale, setLocale, common } = useLocale();

  return (
    <View style={styles.wrap}>
      {showLabel ? (
        <Text style={[styles.label, labelStyle]}>
          {label ?? common.voiceLabel}
        </Text>
      ) : null}
      <View style={styles.row}>
        {LANGUAGES.map((lang) => {
          const id = lang.id as string;
          if (!isAppLocale(id)) return null;
          const active = locale === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={lang.label}
              onPress={() => setLocale(id as AppLocale)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {lang.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 40,
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
});
