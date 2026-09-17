import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { colors, radii, spacing, typography } from "../theme";

const logo = require("../assets/stitch/shared/img0.jpg");

type Props = {
  /** Kept for call-site compatibility; branding is in the logo image. */
  subtitle?: string;
};

/** Stitch-style top branding strip used across core app screens. */
export function KhethaBrandBar(_props: Props = {}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.right}>
        <Text style={styles.aaa}>AAA</Text>
        <MaterialIcon name="contrast" size={18} color={colors.textSecondary} />
        <View style={styles.avatar}>
          <MaterialIcon name="person" size={16} color={colors.onPrimary} />
        </View>
      </View>
    </View>
  );
}

export function OfflineStatusBar({
  cachedCount,
  fromCache,
  rightLabel,
  onRightPress,
  detail,
}: {
  cachedCount: number;
  fromCache?: boolean;
  rightLabel?: string;
  onRightPress?: () => void;
  detail?: string;
}) {
  return (
    <View style={styles.statusWrap}>
      <View style={styles.statusTop}>
        <View style={styles.statusLeft}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>
            {fromCache ? "Offline Ready" : "Online"} · {cachedCount.toLocaleString()} Cached
          </Text>
        </View>
        {rightLabel ? (
          <Pressable onPress={onRightPress}>
            <Text style={styles.statusLink}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={styles.dbBar}>
        <MaterialIcon name="offline_pin" size={14} color={colors.onPrimary} />
        <Text style={styles.dbText}>
          {detail ??
            `Offline Database Active · ${cachedCount.toLocaleString()} Occupations Available`}
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
    flex: 1,
  },
  // Wide mark — logo asset already contains "khetha NCAP" + CDS subtitle.
  logo: { width: 220, height: 64 },
  right: { flexDirection: "row", alignItems: "center", gap: 10 },
  aaa: { ...typography.labelMd, color: colors.textSecondary, letterSpacing: 1 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  statusWrap: { gap: 6 },
  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  statusText: { ...typography.caption, color: colors.success, fontWeight: "700" },
  statusLink: { ...typography.labelMd, color: colors.primary },
  dbBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryDark,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dbText: { ...typography.caption, color: colors.onPrimary, flex: 1 },
});
