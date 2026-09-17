import { Image, Pressable, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";
import { MaterialIcon } from "./MaterialIcon";
import { colors, layout, radii, spacing, typography } from "../theme";

type Props = {
  label: string;
  description?: string;
  icon?: string;
  image?: ImageSourcePropType;
  selected?: boolean;
  onPress: () => void;
};

export function OptionButton({
  label,
  description,
  icon,
  image,
  selected,
  onPress,
}: Props) {
  const rich = Boolean(description || icon || image);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        rich && styles.rich,
        selected && (rich ? styles.selectedFilled : styles.selected),
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={styles.row}>
        {icon && !image ? (
          <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
            <MaterialIcon
              name={icon}
              size={22}
              color={selected ? colors.onPrimary : colors.primary}
            />
          </View>
        ) : null}
        <View style={styles.copy}>
          <Text
            style={[
              styles.label,
              selected && (rich ? styles.labelOnPrimary : styles.labelSelected),
            ]}
          >
            {label}
          </Text>
          {description ? (
            <Text
              style={[
                styles.description,
                selected && rich && styles.descriptionOnPrimary,
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
        {selected ? (
          <MaterialIcon
            name="check_circle"
            size={22}
            color={rich ? colors.onPrimary : colors.primary}
          />
        ) : (
          <View style={styles.radio} />
        )}
      </View>
      {image ? (
        <View style={styles.imageWrap}>
          <Image source={image} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageOverlayText}>
              {selected ? "Selected environment" : "Tap to select"}
            </Text>
          </View>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: layout.minTouch,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    overflow: "hidden",
  },
  rich: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  selectedFilled: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primaryDark,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapSelected: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  copy: { flex: 1, gap: 4 },
  label: {
    ...typography.bodyMd,
    color: colors.text,
    fontWeight: "600",
  },
  labelSelected: {
    fontWeight: "700",
    color: colors.primaryDark,
  },
  labelOnPrimary: {
    color: colors.onPrimary,
    fontWeight: "700",
  },
  description: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  descriptionOnPrimary: {
    color: "rgba(255,255,255,0.88)",
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  imageWrap: {
    height: 110,
    borderRadius: radii.md,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    position: "absolute",
    left: 8,
    bottom: 8,
    backgroundColor: "rgba(15,23,42,0.7)",
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageOverlayText: { ...typography.caption, color: "#fff", fontWeight: "700" },
});
