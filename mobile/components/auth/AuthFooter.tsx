import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcon } from "../MaterialIcon";
import { useLocale } from "../../contexts/LocaleContext";
import { HELPLINE } from "../../data/staticContent";
import { colors, radii, spacing, typography } from "../../theme";

export function AuthFooter() {
  const { strings } = useLocale();
  const t = strings.auth;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.muted}>{t.footerHelpline}</Text>
        <Pressable onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}>
          <Text style={styles.link}>{HELPLINE.tollFreeDisplay}</Text>
        </Pressable>
        <Text style={styles.muted}>{t.footerTollFree}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.muted}>
          {t.footerSms} {HELPLINE.whatsappDisplay}
        </Text>
        <Text style={styles.dot}>·</Text>
        <Text style={styles.link}>{t.footerPrivacy}</Text>
      </View>
    </View>
  );
}

export function HelpContactCards({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  const { strings } = useLocale();
  const t = strings.auth;
  const resolvedTitle = title ?? t.needHelpLogin;
  const resolvedBody = body ?? t.needHelpLoginBody;

  return (
    <View style={styles.help}>
      <View style={styles.helpTitleRow}>
        <MaterialIcon name="support_agent" size={20} color={colors.primary} />
        <Text style={styles.helpTitle}>{resolvedTitle}</Text>
      </View>
      <Text style={styles.helpBody}>{resolvedBody}</Text>
      <View style={styles.contactCol}>
        <Pressable
          style={styles.contactCard}
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        >
          <MaterialIcon name="call" size={18} color={colors.success} />
          <Text style={styles.contactText}>
            {t.tollFreeLabel}{" "}
            <Text style={styles.strong}>{HELPLINE.tollFreeDisplay}</Text>
          </Text>
        </Pressable>
        <Pressable
          style={styles.contactCard}
          onPress={() =>
            void Linking.openURL(`https://wa.me/27${HELPLINE.whatsapp.slice(1)}`)
          }
        >
          <MaterialIcon name="chat" size={18} color={colors.success} />
          <Text style={styles.contactText}>
            {t.whatsappLabel}{" "}
            <Text style={styles.strong}>{HELPLINE.whatsappDisplay}</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#F0F3FF",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  muted: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  link: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: "700",
  },
  dot: { color: colors.textSecondary },
  help: {
    backgroundColor: "#E7EEFF",
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    width: "100%",
  },
  helpTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  helpTitle: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "700",
    flexShrink: 1,
  },
  helpBody: { ...typography.bodySm, color: colors.textSecondary },
  contactCol: { gap: spacing.sm, marginTop: 4 },
  contactCard: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactText: { ...typography.labelMd, color: colors.text, flex: 1, flexShrink: 1 },
  strong: { fontWeight: "700" },
});
