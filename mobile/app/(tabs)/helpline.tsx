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
  GUIDANCE_TOPICS,
  HELPLINE,
  OFFLINE_VAULT_STATS,
  PROVINCES,
  WALK_IN_CENTRES,
} from "../../data/staticContent";
import { colors, radii, shadows, spacing, typography } from "../../theme";
import { href } from "../../utils/href";
import { useRouter } from "expo-router";

const ROLE_OPTIONS = [
  { id: "learner", label: "Learner (Gr 9-12)", icon: "school" },
  { id: "tvet", label: "TVET / College", icon: "engineering" },
  { id: "work", label: "Work Seeker", icon: "work" },
] as const;

const CITY_FILTERS = [
  "All Cities",
  "Pretoria",
  "Durban",
  "Cape Town",
  "Bloemfontein",
] as const;

export default function HelplineScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [province, setProvince] = useState("");
  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]["id"]>("learner");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [confidential, setConfidential] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [cityFilter, setCityFilter] = useState<(typeof CITY_FILTERS)[number]>(
    "All Cities",
  );
  const [provinceOpen, setProvinceOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);

  const centres = useMemo(() => {
    if (cityFilter === "All Cities") return WALK_IN_CENTRES;
    return WALK_IN_CENTRES.filter((c) => c.city === cityFilter);
  }, [cityFilter]);

  const canSubmit =
    fullName.trim().length > 1 &&
    province &&
    topic &&
    message.trim().length > 5 &&
    confidential;

  const onSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setFullName("");
    setProvince("");
    setTopic("");
    setMessage("");
    setRole("learner");
    setConfidential(true);
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
        cachedCount={OFFLINE_VAULT_STATS.careersCached}
        fromCache
        rightLabel="Decisions"
        onRightPress={() => router.push(href("/questionnaires"))}
        detail="Zero-Rated Support · Official DHET CDS Channels"
      />

      <View style={styles.kickerRow}>
        <MaterialIcon name="verified" size={16} color={colors.primary} />
        <Text style={styles.kicker}>Official DHET Service</Text>
      </View>
      <Text style={styles.title}>Career Advice Directory & Contacts</Text>
      <Text style={styles.body}>
        DHET Career Development Services (CDS) provides certified, independent,
        and free career guidance to all citizens across South Africa.
      </Text>

      <View style={styles.zeroBanner}>
        <MaterialIcon name="wifi_channel" size={20} color={colors.primary} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.zeroTitle}>Zero-Rated Support:</Text>
          <Text style={styles.zeroBody}>
            All official toll-free lines and WhatsApp helpdesks run with zero
            data deductions on supported SA networks.
          </Text>
        </View>
      </View>

      <View style={styles.onlineRow}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>Advisors Online Now</Text>
        <Text style={styles.onlineMeta}>Avg. pickup &lt; 45s</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="call" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Toll-Free Helpline</Text>
          </View>
          <View style={styles.freePill}>
            <Text style={styles.freePillText}>Free</Text>
          </View>
        </View>
        <Text style={styles.meta}>
          {HELPLINE.hours} · National Line
        </Text>
        <Text style={styles.number}>{HELPLINE.tollFreeDisplay}</Text>
        <Text style={styles.cardBody}>
          Free from landlines and mobile networks (Vodacom, MTN, Telkom, Cell
          C).
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
          <Text style={styles.primaryBtnText}>Call Toll-Free Now</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="chat" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>WhatsApp Live Helpdesk</Text>
          </View>
          <View style={styles.popularPill}>
            <Text style={styles.popularPillText}>Popular</Text>
          </View>
        </View>
        <Text style={styles.meta}>Accredited Career Specialists</Text>
        <Text style={styles.number}>{HELPLINE.whatsappDisplay}</Text>
        <Text style={styles.cardBody}>
          Text your career questions directly or initiate automated guidance
          options anytime.
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
          <Text style={styles.primaryBtnText}>Chat on WhatsApp</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleRow}>
            <MaterialIcon name="sms" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Free SMS / &quot;Please Call Me&quot;</Text>
          </View>
          <View style={styles.zeroPill}>
            <Text style={styles.zeroPillText}>Zero airtime required</Text>
          </View>
        </View>
        <View style={styles.smsLine}>
          <MaterialIcon
            name="contact_phone"
            size={18}
            color={colors.secondary}
          />
          <Text style={styles.smsLineText}>
            SMS Line: {HELPLINE.whatsappDisplay}
          </Text>
        </View>
        <Text style={styles.cardBody}>
          Simply SMS the word <Text style={styles.strong}>&quot;HELP&quot;</Text> or
          send a free standard USSD <Text style={styles.strong}>&quot;Please Call Me&quot;</Text>{" "}
          to {HELPLINE.whatsappDisplay}.
        </Text>
        <View style={styles.callbackNote}>
          <MaterialIcon name="schedule" size={16} color={colors.primary} />
          <Text style={styles.callbackText}>
            A qualified counselor calls you back within 2 business hours.
          </Text>
        </View>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() =>
            void Linking.openURL(`sms:${HELPLINE.whatsapp}?body=HELP`)
          }
        >
          <Text style={styles.secondaryBtnText}>Open SMS</Text>
        </Pressable>
      </View>

      <View style={styles.formCard}>
        <View style={styles.cardTitleRow}>
          <MaterialIcon
            name="contact_mail"
            size={22}
            color={colors.primary}
          />
          <Text style={styles.cardTitle}>Send an Enquiry or Callback</Text>
        </View>
        <Text style={styles.cardBody}>
          Complete this secure form. Requests are saved offline if you lose
          connectivity and synchronised automatically.
        </Text>

        {submitted ? (
          <View style={styles.successBanner}>
            <MaterialIcon
              name="check_circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.successText}>
              Your advisory request was registered! Reference #CDS-9824. An
              advisor will contact you shortly.
            </Text>
          </View>
        ) : null}

        <Text style={styles.fieldLabel}>Full Name & Surname *</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>Province *</Text>
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
            {province || "Select your province"}
          </Text>
          <MaterialIcon
            name="expand_more"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>

        <Text style={styles.fieldLabel}>I am currently a: *</Text>
        <View style={styles.roleRow}>
          {ROLE_OPTIONS.map((opt) => {
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

        <Text style={styles.fieldLabel}>Guidance Topic *</Text>
        <Pressable style={styles.select} onPress={() => setTopicOpen(true)}>
          <Text
            style={[styles.selectText, !topic && styles.selectPlaceholder]}
            numberOfLines={1}
          >
            {topic || "Select Guidance Topic"}
          </Text>
          <MaterialIcon
            name="expand_more"
            size={20}
            color={colors.textSecondary}
          />
        </Pressable>

        <Text style={styles.fieldLabel}>Your Message or Question *</Text>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text.slice(0, 300))}
          placeholder="Describe your question…"
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
          <Text style={styles.checkText}>Always keep my data confidential.</Text>
        </Pressable>

        <View style={styles.offlineHint}>
          <MaterialIcon name="cloud_sync" size={16} color={colors.secondary} />
          <Text style={styles.offlineHintText}>
            Queues locally if your network disconnects.
          </Text>
        </View>

        <Pressable
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={onSubmit}
        >
          <MaterialIcon name="send" size={18} color={colors.text} />
          <Text style={styles.submitBtnText}>
            Submit Free Advisory Request
          </Text>
        </Pressable>
      </View>

      <View style={styles.centresHead}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.sectionTitle}>Walk-in CDS Centres</Text>
          <Text style={styles.sectionBody}>
            Visit an accredited DHET practitioner in person
          </Text>
        </View>
        <View style={styles.centresCount}>
          <Text style={styles.centresCountText}>52 Centres</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cityRow}
      >
        {CITY_FILTERS.map((city) => {
          const active = cityFilter === city;
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
              <Text style={styles.directionsText}>Get Directions</Text>
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

      <Text style={styles.sectionTitle}>Official Digital Channels</Text>
      <Text style={styles.sectionBody}>
        Connect for daily bursary postings, career fairs, and apprenticeship
        updates.
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
            <Text style={styles.channelSub}>{channel.subtitle}</Text>
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
          “An investment in knowledge pays the best interest.”
        </Text>
        <Text style={styles.quoteAttr}>
          — Benjamin Franklin · Adopted by Khetha CDS
        </Text>
      </View>

      <Text style={styles.footerBrand}>
        Department of Higher Education and Training · Republic of South Africa
      </Text>
      <Text style={styles.footerNote}>
        Free, impartial, and accessible to learners, students, and citizens of
        all abilities.
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
            <Text style={styles.modalTitle}>Select your province</Text>
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
            <Text style={styles.modalTitle}>Select Guidance Topic</Text>
            <ScrollView style={{ maxHeight: 420 }}>
              {GUIDANCE_TOPICS.map((item) => (
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
