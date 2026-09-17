import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcon } from "../MaterialIcon";
import { colors, radii, spacing, typography } from "../../theme";
import { href } from "../../utils/href";

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
      <View style={styles.row}>
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
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
  },
  iconBtn: {
    width: 44,
    height: 44,
    marginLeft: -8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
  },
  pageTitle: {
    ...typography.headlineSm,
    color: colors.text,
    flex: 1,
  },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: { ...typography.caption, color: colors.success },
});
