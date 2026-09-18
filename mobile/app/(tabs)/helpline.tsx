import { useMemo, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Screen } from "../../components/Screen";
import { MaterialIcon } from "../../components/MaterialIcon";
import {
  KhethaBrandBar,
  OfflineStatusBar,
} from "../../components/KhethaBrandBar";
import {
  DIGITAL_CHANNELS,
  HELPLINE,
  PROVINCES,
  WALK_IN_CENTRES,
} from "../../data/staticContent";
import { useVaultStats } from "../../hooks/useVaultStats";
import { useLocale } from "../../contexts/LocaleContext";
import { enqueueHelplineSubmission } from "../../services/offlineProfile";
import { colors, radii, shadows, spacing, typography } from "../../theme";
import { href } from "../../utils/href";
import { useRouter } from "expo-router";

export default function HelplineScreen() {
  const router = useRouter();
  const vault = useVaultStats();
  const { strings, tabs } = useLocale();
  const t = strings.helpline;

  const [fullName, setFullName] = useState("");
  const [province, setProvince] = useState("");
  const [role, setRole] = useState<"learner" | "tvet" | "work">("learner");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [confidential, setConfidential] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);


  const roleOptions = useMemo(
    () => [
      { id: "learner" as const, label: t.roleLearner, icon: "school" },
      { id: "tvet" as const, label: t.roleTvet, icon: "engineering" },
      { id: "work" as const, label: t.roleWork, icon: "work" },
    ],
    [t],
  );
  const cityFilters = useMemo(
    () => [t.allCities, "Pretoria", "Durban", "Cape Town", "Bloemfontein"] as const,
    [t.allCities],
  );
  const guidanceTopics = useMemo(
    () => [
      t.topicSubjectChoice,
      t.topicNsfas,
      t.topicTvetUni,
      t.topicArtisan,
      t.topicDisability,
      t.topicSecondChance,
    ],
    [t],
  );
  const channelSubs: Record<string, string> = useMemo(
    () => ({
      email: t.channelEmailSub,
      facebook: t.channelFacebookSub,
      x: t.channelXSub,
    }),
    [t],
  );

  const activeCity = cityFilter || t.allCities;
  const centres = useMemo(() => {
    if (activeCity === t.allCities) return WALK_IN_CENTRES;
    return WALK_IN_CENTRES.filter((c) => c.city === activeCity);
  }, [activeCity, t.allCities]);

  const canSubmit =
    fullName.trim().length > 1 &&
    province &&
    topic &&
    message.trim().length > 5 &&
    confidential;

  const onSubmit = () => {
    if (!canSubmit) return;
    void (async () => {
      await enqueueHelplineSubmission({
        name: fullName.trim(),
        contact: fullName.trim(),
        province,
        topic: `${role}: ${topic}`,
        message: message.trim(),
      });
      setSubmitted(true);
      setFullName("");
      setProvince("");
      setTopic("");
      setMessage("");
      setRole("learner");
      setConfidential(true);
    })();
  };

  const openMaps = (query: string) => {
    void Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    );
  };

  return (
    <Screen>
      <KhethaBrandBar />
      <OfflineStatusBar
        cachedCount={vault.careersCached}
        rightLabel={tabs.decisions}
        onRightPress={() => router.push(href("/questionnaires"))}
        detail={t.offlineDetail}
      />

      <View style={styles.kickerRow}>
        <MaterialIcon name="verified" size={16} color={colors.primary} />
        <Text style={styles.kicker}>{t.officialService}</Text>
      </View>
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.body}>
        {t.body}
      </Text>

      <View style={styles.zeroBanner}>
        <MaterialIcon name="wifi_channel" size={20} color={colors.primary} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.zeroTitle}>{t.zeroSupportTitle}</Text>
          <Text style={styles.zeroBody}>
            {t.zeroSupportBody}
          </Text>
        </View>
      </View>

      <View style={styles.onlineRow}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>{t.advisorsOnline}</Text>
        <Text style={styles.onlineMeta}>{t.avgPickup}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="call" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>{t.tollFreeHelpline}</Text>
          </View>
          <View style={styles.freePill}>
            <Text style={styles.freePillText}>{t.free}</Text>
          </View>
        </View>
        <Text style={styles.meta}>
          {HELPLINE.hours} · {t.nationalLine}
        </Text>
        <Text style={styles.number}>{HELPLINE.tollFreeDisplay}</Text>
        <Text style={styles.cardBody}>
          {t.tollFreeBody}
        </Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => void Linking.openURL(`tel:${HELPLINE.tollFree}`)}
        >
          <MaterialIcon
            name="phone_in_talk"
            size={18}
            color={colors.onPrimary}
          />
          <Text style={styles.primaryBtnText}>{t.callTollFreeNow}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="chat" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>{t.whatsappHelpdesk}</Text>
          </View>
          <View style={styles.popularPill}>
            <Text style={styles.popularPillText}>{t.popular}</Text>
          </View>
        </View>
        <Text style={styles.meta}>{t.accreditedSpecialists}</Text>
        <Text style={styles.number}>{HELPLINE.whatsappDisplay}</Text>
        <Text style={styles.cardBody}>
          {t.whatsappBody}
        </Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            void Linking.openURL(
              `https://wa.me/27${HELPLINE.whatsapp.slice(1)}`,
            )
          }
        >
          <MaterialIcon name="forum" size={18} color={colors.onPrimary} />
          <Text style={styles.primaryBtnText}>{t.chatWhatsapp}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="sms" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>{t.freeSmsTitle}</Text>
          </View>
          <View style={styles.zeroPill}>
            <Text style={styles.zeroPillText}>{t.zeroAirtime}</Text>
          </View>
        </View>
        <View style={styles.smsLine}>
          <MaterialIcon
            name="contact_phone"
            size={18}
            color={colors.secondary}
          />
          <Text style={styles.smsLineText}>
            {t.smsLine} {HELPLINE.whatsappDisplay}
          </Text>
        </View>
        <Text style={styles.cardBody}>
          {t.smsBodyPrefix} {HELPLINE.whatsappDisplay}.
        </Text>
        <View style={styles.callbackNote}>
          <MaterialIcon name="schedule" size={16} color={colors.primary} />
          <Text style={styles.callbackText}>
            {t.callbackNote}
          </Text>
        </View>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() =>
            void Linking.openURL(`sms:${HELPLINE.whatsapp}?body=HELP`)
          }
        >
          <Text style={styles.secondaryBtnText}>{t.openSms}</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <View style={styles.cardTitleRow}>
          <MaterialIcon
            name="contact_mail"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.cardTitle}>{t.enquiryTitle}</Text>
        </View>
        <Text style={styles.cardBody}>
          {t.enquiryBody}
        </Text>

        {submitted ? (
          <View style={styles.successBanner}>
            <MaterialIcon
              name="check_circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.successText}>
              {t.requestSaved}
            </Text>
          </View>
        ) : null}

        <Text style={styles.fieldLabel}>{t.fullNameLabel}</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder={t.fullNamePlaceholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>{t.provinceLabel}</Text>
        <Pressable
          style={styles.select}
          onPress={() => setProvinceOpen(true)}
        >
          <Text
            style={[
              styles.selectText,
              !province && styles.selectPlaceholder,
            ]}
          >
            {province || t.selectProvince}
          </Text>
          <MaterialIcon
            name="expand_more"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>

        <Text style={styles.fieldLabel}>{t.iAmCurrently}</Text>
        <View style={styles.roleRow}>
          {roleOptions.map((opt) => {
            const active = role === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={[styles.roleChip, active && styles.roleChipActive]}
                onPress={() => setRole(opt.id)}
              >
                <MaterialIcon
                  name={opt.icon}
                  size={18}
                  color={active ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleChipText,
                    active && styles.roleChipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>{t.guidanceTopic}</Text>
        <Pressable style={styles.select} onPress={() => setTopicOpen(true)}>
          <Text
            style={[styles.selectText, !topic && styles.selectPlaceholder]}
            numberOfLines={1}
          >
            {topic || t.selectTopic}
          </Text>
          <MaterialIcon
            name="expand_more"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>

        <Text style={styles.fieldLabel}>{t.messageLabel}</Text>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text.slice(0, 300))}
          placeholder={t.messagePlaceholder}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.textarea]}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{message.length} / 300</Text>

        <Pressable
          style={styles.checkRow}
          onPress={() => setConfidential((v) => !v)}
        >
          <View
            style={[styles.checkbox, confidential && styles.checkboxChecked]}
          >
            {confidential ? (
              <MaterialIcon name="check" size={14} color={colors.onPrimary} />
            ) : null}
          </View>
          <Text style={styles.checkText}>{t.keepConfidential}</Text>
        </Pressable>

        <View style={styles.offlineHint}>
          <MaterialIcon name="cloud_sync" size={16} color={colors.secondary} />
          <Text style={styles.offlineHintText}>
            {t.offlineHint}
          </Text>
        </View>

        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <MaterialIcon name="send" size={18} color={colors.text} />
          <Text style={styles.submitBtnText}>
            {t.submitRequest}
          </Text>
        </Pressable>
      </View>

      <View style={styles.centresHead}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.sectionTitle}>{t.walkInTitle}</Text>
          <Text style={styles.sectionBody}>
            {t.walkInSub}
          </Text>
        </View>
        <View style={styles.centresCount}>
          <Text style={styles.centresCountText}>{t.centresCount}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cityRow}
      >
        {cityFilters.map((city) => {
          const active = activeCity === city;
          return (
            <Pressable
              key={city}
              style={[styles.cityChip, active && styles.cityChipActive]}
              onPress={() => setCityFilter(city)}
            >
              <Text
                style={[
                  styles.cityChipText,
                  active && styles.cityChipTextActive,
                ]}
              >
                {city}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {centres.map((centre) => (
        <View key={centre.id} style={styles.centreCard}>
          <View style={styles.centreBadge}>
            <Text style={styles.centreBadgeText}>{centre.badge}</Text>
          </View>
          <Text style={styles.centreName}>{centre.name}</Text>
          <View style={styles.centreMetaRow}>
            <MaterialIcon
              name="location_on"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.centreMeta}>{centre.address}</Text>
          </View>
          {centre.accessible ? (
            <View style={styles.centreMetaRow}>
              <MaterialIcon
                name="accessible"
                size={16}
                color={colors.success}
              />
              <Text style={styles.accessText}>{centre.accessLabel}</Text>
            </View>
          ) : null}
          <View style={styles.centreMetaRow}>
            <MaterialIcon name="schedule" size={16} color={colors.textMuted} />
            <Text style={styles.centreMeta}>{centre.hours}</Text>
          </View>
          <View style={styles.centreActions}>
            <Pressable
              style={styles.directionsBtn}
              onPress={() => openMaps(centre.mapsQuery)}
            >
              <MaterialIcon
                name="directions"
                size={18}
                color={colors.secondary}
              />
              <Text style={styles.directionsText}>{t.getDirections}</Text>
            </Pressable>
            <Pressable
              style={styles.callIconBtn}
              onPress={() => void Linking.openURL(`tel:${centre.phone}`)}
            >
              <MaterialIcon name="call" size={20} color={colors.primary} />
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>{t.digitalChannels}</Text>
      <Text style={styles.sectionBody}>
        {t.digitalChannelsSub}
      </Text>

      {DIGITAL_CHANNELS.map((channel) => (
        <Pressable
          key={channel.id}
          style={styles.channelRow}
          onPress={() => void Linking.openURL(channel.url)}
        >
          <View style={styles.channelIcon}>
            <MaterialIcon
              name={channel.icon}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.channelLabel} numberOfLines={1}>
              {channel.label}
            </Text>
            <Text style={styles.channelSub}>{channelSubs[channel.id] ?? channel.subtitle}</Text>
          </View>
          <MaterialIcon
            name={channel.id === "email" ? "chevron_right" : "open_in_new"}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      ))}

      <View style={styles.quoteCard}>
        <MaterialIcon name="format_quote" size={24} color={colors.gold} />
        <Text style={styles.quoteText}>
          {t.quote}
        </Text>
        <Text style={styles.quoteAttr}>
          {t.quoteAttr}
        </Text>
      </View>

      <Text style={styles.footerBrand}>
        {t.footerBrand}
      </Text>
      <Text style={styles.footerNote}>
        {t.footerNote}
      </Text>

      <Modal
        visible={provinceOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setProvinceOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setProvinceOpen(false)}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{t.selectProvince}</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {PROVINCES.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.modalOption,
                    province === item && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setProvince(item);
                    setProvinceOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      province === item && styles.modalOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={topicOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setTopicOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setTopicOpen(false)}
        >
          <Pressable
            style={styles.modalSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{t.selectTopic}</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {guidanceTopics.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.modalOption,
                    topic === item && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setTopic(item);
                    setTopicOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      topic === item && styles.modalOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  kicker: {
    ...typography.labelMd,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "800",
  },
  title: { ...typography.headlineLg, color: colors.text, fontSize: 24 },
  body: { ...typography.bodyMd, color: colors.textSecondary },
  zeroBanner: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  zeroTitle: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "800",
  },
  zeroBody: { ...typography.bodySm, color: colors.textSecondary },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  onlineText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: "800",
  },
  onlineMeta: { ...typography.caption, color: colors.textMuted },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    ...typography.headlineSm,
    color: colors.text,
    flexShrink: 1,
  },
  freePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  freePillText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "800",
  },
  popularPill: {
    backgroundColor: "#FFF4E5",
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  popularPillText: {
    ...typography.caption,
    color: colors.ochre,
    fontWeight: "800",
  },
  zeroPill: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  zeroPillText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "800",
  },
  meta: { ...typography.bodySm, color: colors.textMuted },
  number: { ...typography.headlineMd, color: colors.primary, fontWeight: "800" },
  cardBody: { ...typography.bodySm, color: colors.textSecondary },
  strong: { fontWeight: "800", color: colors.text },
  primaryBtn: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  primaryBtnText: {
    ...typography.labelLg,
    color: colors.onPrimary,
    fontWeight: "800",
  },
  secondaryBtn: {
    minHeight: 44,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    ...typography.labelLg,
    color: colors.primary,
    fontWeight: "800",
  },
  smsLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  smsLineText: {
    ...typography.labelMd,
    color: colors.secondary,
    fontWeight: "800",
  },
  callbackNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  callbackText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 1,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  successBanner: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.primaryMuted,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  successText: {
    ...typography.bodySm,
    color: colors.success,
    fontWeight: "700",
    flex: 1,
  },
  fieldLabel: {
    ...typography.labelMd,
    color: colors.text,
    marginTop: 4,
  },
  input: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.md,
    ...typography.bodyMd,
    color: colors.text,
  },
  textarea: {
    minHeight: 110,
    paddingTop: spacing.md,
  },
  charCount: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "right",
  },
  select: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  selectText: {
    ...typography.bodyMd,
    color: colors.text,
    flex: 1,
  },
  selectPlaceholder: { color: colors.textMuted },
  roleRow: { gap: spacing.sm },
  roleChip: {
    minHeight: 48,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  roleChipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
  },
  roleChipTextActive: {
    color: colors.primary,
    fontWeight: "800",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkText: { ...typography.bodySm, color: colors.textSecondary, flex: 1 },
  offlineHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  offlineHintText: { ...typography.caption, color: colors.secondary },
  submitBtn: {
    minHeight: 52,
    backgroundColor: colors.gold,
    borderRadius: radii.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: {
    ...typography.labelLg,
    color: colors.text,
    fontWeight: "800",
  },
  centresHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: { ...typography.headlineSm, color: colors.text },
  sectionBody: { ...typography.bodySm, color: colors.textSecondary },
  centresCount: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  centresCountText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "800",
  },
  cityRow: { gap: spacing.sm, paddingVertical: 2, paddingRight: spacing.lg },
  cityChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cityChipActive: { backgroundColor: colors.primary },
  cityChipText: {
    ...typography.labelMd,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  cityChipTextActive: { color: colors.onPrimary },
  centreCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  centreBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  centreBadgeText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "800",
  },
  centreName: { ...typography.headlineSm, color: colors.text },
  centreMetaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  centreMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
    flex: 1,
  },
  accessText: {
    ...typography.bodySm,
    color: colors.success,
    fontWeight: "700",
    flex: 1,
  },
  centreActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: 4,
  },
  directionsBtn: {
    flex: 1,
    minHeight: 44,
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  directionsText: {
    ...typography.labelMd,
    color: colors.secondary,
    fontWeight: "800",
  },
  callIconBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    ...shadows.card,
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  channelLabel: {
    ...typography.labelMd,
    color: colors.text,
    fontWeight: "700",
  },
  channelSub: { ...typography.caption, color: colors.textMuted },
  quoteCard: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    alignItems: "flex-start",
  },
  quoteText: {
    ...typography.bodyMd,
    color: colors.text,
    fontStyle: "italic",
  },
  quoteAttr: { ...typography.caption, color: colors.textMuted },
  footerBrand: {
    ...typography.labelMd,
    color: colors.textSecondary,
    textAlign: "center",
  },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xxxl,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: { ...typography.headlineSm, color: colors.text },
  modalOption: {
    minHeight: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  modalOptionActive: {
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modalOptionText: { ...typography.bodyMd, color: colors.text },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
