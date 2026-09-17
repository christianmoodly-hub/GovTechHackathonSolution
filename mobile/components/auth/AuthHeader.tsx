import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcon } from "../MaterialIcon";
import { colors, radii, spacing, typography } from "../../theme";
import { href } from "../../utils/href";

const brandLogo = require("../../assets/auth/brand-logo.png");

type Props = {
  title: string;
  showBack?: boolean;
  statusRight?: string;
};

export function AuthHeader({
  title,
  showBack = true,
  statusRight = "Secure SSL",
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          {showBack ? (
            <Pressable
              accessibilityLabel="Go back"
              hitSlop={8}
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace(href("/sign-in"));
              }}
              style={styles.iconBtn}
            >
              <MaterialIcon name="arrow_back" size={24} color={colors.text} />
            </Pressable>
          ) : null}
          <Image source={brandLogo} style={styles.logo} resizeMode="contain" />
          <View style={styles.brandText}>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>Khetha NCAP</Text>
              <View style={styles.zeroBadge}>
                <Text style={styles.zeroBadgeText}>Zero-Rated Data</Text>
              </View>
            </View>
            <Text style={styles.brandSub}>
              DHET Career Services · Republic of South Africa
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.iconBtn} accessibilityLabel="Adjust font size">
            <MaterialIcon name="format_size" size={20} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.iconBtn} accessibilityLabel="Toggle contrast">
            <MaterialIcon name="contrast" size={20} color={colors.textSecondary} />
          </Pressable>
          <View style={styles.avatar}>
            <MaterialIcon name="person" size={18} color={colors.onPrimary} />
          </View>
        </View>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusRight}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "rgba(249,249,255,0.94)",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
  },
  logo: { width: 32, height: 32 },
  brandText: { flex: 1, minWidth: 0 },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  brandName: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  zeroBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  zeroBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.success,
  },
  brandSub: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actions: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  pageTitle: { ...typography.headlineSm, color: colors.text, flex: 1 },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: { ...typography.caption, color: colors.success },
});
