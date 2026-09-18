import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useAssistant } from "../../contexts/AssistantContext";
import { radii, shadows, spacing, typography } from "../../theme";
import { MaterialIcon } from "../MaterialIcon";

/**
 * Floating launcher. Deliberately large and always in the same place so it can
 * be found by feel, and labelled for TalkBack and VoiceOver.
 *
 * Sits above the tab bar. Hidden while the overlay is open.
 */
export function AssistantLauncher() {
  const { isOpen, open, requestListen, strings } = useAssistant();
  const { colors, textScale } = useAccessibility();

  if (isOpen) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        onPress={() => open()}
        onLongPress={() => requestListen()}
        delayLongPress={350}
        style={[styles.button, { backgroundColor: colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel={strings.a11yOpen}
        accessibilityHint={strings.voiceHint}
      >
        <MaterialIcon name="forum" size={26} color={colors.onPrimary} />
        <Text
          style={[
            styles.label,
            { color: colors.onPrimary, fontSize: 13 * textScale },
          ]}
          numberOfLines={1}
        >
          {strings.launcher}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: spacing.lg,
    bottom: 96,
    zIndex: 40,
  },
  button: {
    minHeight: 56,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
    elevation: 6,
  },
  label: { ...typography.labelLg, fontWeight: "700" },
});
