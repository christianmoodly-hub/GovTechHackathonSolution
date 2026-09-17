import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { HELPLINE, WALK_IN_CENTRES } from "../../data/staticContent";
import { colors, radii, spacing, typography } from "../../theme";

export default function HelplineScreen() {
  return (
    <Screen>
      <Text style={styles.kicker}>Official DHET service</Text>
      <Text style={styles.title}>Career advice directory & contacts</Text>
      <Text style={styles.body}>
        DHET Career Development Services provides free, independent guidance to
        citizens across South Africa.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Toll-free helpline</Text>
        <Text style={styles.meta}>{HELPLINE.hours}</Text>
        <Text style={styles.number}>{HELPLINE.tollFreeDisplay}</Text>
        <PrimaryButton
          label="Call toll-free now"
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>WhatsApp live helpdesk</Text>
        <Text style={styles.number}>{HELPLINE.whatsappDisplay}</Text>
        <PrimaryButton
          label="Chat on WhatsApp"
          variant="secondary"
          onPress={() =>
            void Linking.openURL(`https://wa.me/27${HELPLINE.whatsapp.slice(1)}`)
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>SMS / Please Call Me</Text>
        <Text style={styles.body}>
          SMS HELP or send a Please Call Me to {HELPLINE.whatsappDisplay}. An
          advisor calls back within 2 business hours.
        </Text>
        <Pressable onPress={() => void Linking.openURL(`sms:${HELPLINE.whatsapp}`)}>
          <Text style={styles.link}>Open SMS →</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Walk-in CDS centres</Text>
      {WALK_IN_CENTRES.map((centre) => (
        <View key={centre.id} style={styles.centre}>
          <Text style={styles.cardTitle}>{centre.name}</Text>
          <Text style={styles.meta}>{centre.city}</Text>
          <Text style={styles.body}>{centre.address}</Text>
          <Text style={styles.meta}>{centre.hours}</Text>
          {centre.accessible ? (
            <Text style={styles.badge}>Wheelchair accessible</Text>
          ) : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    ...typography.labelMd,
    color: colors.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { ...typography.headlineLg, color: colors.text },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  section: { ...typography.headlineSm, color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.headlineSm, color: colors.text },
  meta: { ...typography.bodySm, color: colors.textMuted },
  number: { ...typography.headlineMd, color: colors.primary },
  link: { ...typography.labelLg, color: colors.primary },
  centre: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: 4,
  },
  badge: {
    ...typography.caption,
    color: colors.success,
    marginTop: spacing.xs,
    fontWeight: "700",
  },
});
