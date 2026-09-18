import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcon } from "./MaterialIcon";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { useConnectivity } from "../contexts/ConnectivityContext";
import { useLocale } from "../contexts/LocaleContext";
import { radii, spacing, typography } from "../theme";
import { href } from "../utils/href";

const coatOfArms = require("../assets/brand/coat-of-arms.jpg");

type Props = {
  /** Kept for call-site compatibility; branding is coat of arms + wordmark. */
  subtitle?: string;
};

/** Top branding strip: SA coat of arms + NCAP Khetha wordmark. */
export function KhethaBrandBar(_props: Props = {}) {
  const router = useRouter();
  const {
    zoomLabel,
    textZoom,
    highContrast,
    colors,
    cycleTextZoom,
    toggleHighContrast,
    resetAccessibility,
  } = useAccessibility();

  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Pressable
          onLongPress={resetAccessibility}
          delayLongPress={500}
          accessibilityRole="imagebutton"
          accessibilityLabel="South African coat of arms. Long press to reset accessibility settings."
          accessibilityHint="Long press to restore default text size and contrast"
        >
          <Image
            source={coatOfArms}
            style={styles.logo}
            resizeMode="contain"
          />
        </Pressable>
        <View style={styles.wordmark}>
          <Text style={[styles.brandTitle, { color: colors.primary }]}>
            NCAP{" "}
            <Text
              style={{
                color: highContrast ? colors.primary : "#F2A900",
                fontWeight: "800",
              }}
            >
              Khetha
            </Text>
          </Text>
          <Text style={[styles.brandSub, { color: colors.textSecondary }]}>
            DHET South Africa
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Pressable
          onPress={cycleTextZoom}
          onLongPress={resetAccessibility}
          style={[
            styles.aaaBtn,
            textZoom > 0 && {
              backgroundColor: highContrast ? "#000000" : colors.primaryMuted,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Text size ${zoomLabel}. Tap to change size. Long press to reset.`}
          accessibilityHint="Cycles AA, AA plus, and AAA. Long press resets to AA."
        >
          <Text
            style={[
              styles.aaa,
              {
                color:
                  textZoom > 0
                    ? highContrast
                      ? colors.onPrimary
                      : colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
            {zoomLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={toggleHighContrast}
          onLongPress={resetAccessibility}
          style={[
            styles.iconBtn,
            highContrast && {
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.primary,
            },
            !highContrast && {
              borderWidth: 1.5,
              borderColor: colors.borderStrong,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            highContrast
              ? "High contrast on. Tap to use normal colours."
              : "High contrast off. Tap for black-on-white colours."
          }
          accessibilityHint="Toggles high contrast colours. Does not change text size."
          accessibilityState={{ selected: highContrast }}
        >
          <MaterialIcon
            name="contrast"
            size={18}
            color={highContrast ? colors.onPrimary : colors.textSecondary}
          />
        </Pressable>
        <Pressable
          style={[styles.avatar, { backgroundColor: colors.primary }]}
          onPress={() => router.push(href("/saved"))}
          accessibilityRole="button"
          accessibilityLabel="Open profile and saved items"
        >
          <MaterialIcon name="person" size={16} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

export function OfflineStatusBar({
  cachedCount,
  fromCache: _fromCache,
  rightLabel,
  onRightPress,
  detail,
}: {
  cachedCount: number;
  /** @deprecated ConnectivityContext drives online/offline label now. */
  fromCache?: boolean;
  rightLabel?: string;
  onRightPress?: () => void;
  detail?: string;
}) {
  const { colors, highContrast } = useAccessibility();
  const { common } = useLocale();
  const { canSync } = useConnectivity();
  const statusLabel = canSync ? common.online : common.offline;
  const statusColor = canSync ? colors.success : colors.ochre;

  return (
    <View style={styles.statusWrap}>
      <View
        style={[
          styles.statusTop,
          {
            backgroundColor: highContrast ? colors.card : colors.primaryMuted,
            borderWidth: highContrast ? 2 : 0,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.statusLeft}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel} · {cachedCount.toLocaleString()} Cached
          </Text>
        </View>
        {rightLabel ? (
          <Pressable onPress={onRightPress}>
            <Text style={[styles.statusLink, { color: colors.primary }]}>
              {rightLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View
        style={[
          styles.dbBar,
          {
            backgroundColor: colors.primaryDark,
            borderWidth: highContrast ? 2 : 0,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcon name="offline_pin" size={14} color={colors.onPrimary} />
        <Text style={[styles.dbText, { color: colors.onPrimary }]}>
          {detail ??
            (canSync
              ? `Directory cache · ${cachedCount.toLocaleString()} items`
              : `Offline mode · ${cachedCount.toLocaleString()} items on device`)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  logo: { width: 64, height: 64 },
  wordmark: { flexShrink: 1, minWidth: 0 },
  brandTitle: {
    ...typography.labelLg,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  brandSub: {
    ...typography.caption,
    marginTop: 1,
  },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  aaaBtn: {
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 8,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  aaa: {
    ...typography.labelMd,
    letterSpacing: 1,
    fontWeight: "800",
  },
  iconBtn: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusWrap: { gap: 6 },
  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: {
    ...typography.caption,
    fontWeight: "700",
  },
  statusLink: { ...typography.labelMd },
  dbBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dbText: { ...typography.caption, flex: 1 },
});
