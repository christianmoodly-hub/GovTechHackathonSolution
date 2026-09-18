import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { layout, radii, spacing, typography } from "../theme";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, style, contentStyle }: Props) {
  const {
    highContrast,
    isCustomized,
    resetAccessibility,
    zoomLabel,
    textScale,
    colors,
  } = useAccessibility();

  const scaledStyle: StyleProp<ViewStyle> =
    textScale === 1
      ? null
      : {
          transform: [{ scale: textScale }],
          width: `${100 / textScale}%` as unknown as number,
          alignSelf: "flex-start",
        };

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle, scaledStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, contentStyle, scaledStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.canvas },
        highContrast && styles.safeHighContrast,
        style,
      ]}
      edges={["top", "left", "right"]}
    >
      {isCustomized ? (
        <Pressable
          style={[styles.resetBanner, { backgroundColor: colors.gold === "#000000" ? "#F2A900" : colors.gold }]}
          onPress={resetAccessibility}
          accessibilityRole="button"
          accessibilityLabel="Reset text size and contrast to default"
        >
          <Text style={[styles.resetBannerText, { color: "#0F172A" }]}>
            Accessibility on ({zoomLabel}
            {highContrast ? " · High contrast" : ""}) — Tap to reset to AA
          </Text>
        </Pressable>
      ) : null}
      {body}
    </SafeAreaView>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  const { colors } = useAccessibility();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={[styles.muted, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  const { colors, highContrast } = useAccessibility();
  return (
    <View
      style={[
        styles.empty,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: highContrast ? 2 : 1,
        },
      ]}
    >
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      {body ? (
        <Text style={[styles.muted, { color: colors.textSecondary }]}>{body}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  safeHighContrast: {
    borderTopWidth: 2,
    borderTopColor: "#000000",
  },
  flex: { flex: 1 },
  resetBanner: {
    marginHorizontal: layout.gutter,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
    zIndex: 20,
  },
  resetBannerText: {
    ...typography.labelMd,
    fontWeight: "800",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  fill: { flex: 1 },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
  },
  empty: {
    borderRadius: 12,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.headlineSm },
  muted: { ...typography.bodyMd },
});
