import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import {
  useAssistant,
  type AssistantMessage,
  type AssistantStatus,
} from "../../contexts/AssistantContext";
import { useConnectivity } from "../../contexts/ConnectivityContext";
import { useLocale } from "../../contexts/LocaleContext";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { speakAndWait } from "../../services/voice/speech";
import { layout, radii, shadows, spacing, typography } from "../../theme";
import { MaterialIcon } from "../MaterialIcon";

export function AssistantOverlay() {
  const {
    isOpen,
    close,
    messages,
    status,
    busy,
    strings,
    pendingConfirm,
    notice,
    dismissNotice,
    sendText,
    sendVoice,
    setStatus,
    reset,
    stopSpeech,
    listenNonce,
  } = useAssistant();
  const { colors, textScale, highContrast } = useAccessibility();
  const { canSync } = useConnectivity();
  const { locale } = useLocale();
  const recorder = useVoiceRecorder();

  const [draft, setDraft] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [handsFreeListen, setHandsFreeListen] = useState(false);
  const listRef = useRef<FlatList<AssistantMessage>>(null);

  useEffect(() => {
    if (!messages.length) return;
    const timer = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      60,
    );
    return () => clearTimeout(timer);
  }, [messages]);

  const onSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMicError(null);
    void sendText(text);
  }, [draft, sendText]);

  const onMicDown = useCallback(async () => {
    if (busy) return;
    setMicError(null);
    setHandsFreeListen(false);
    const result = await recorder.start();
    if (!result.ok) {
      setMicError(
        result.reason === "permission-denied" ? strings.micDenied : strings.micFailed,
      );
      return;
    }
    setStatus("listening");
  }, [busy, recorder, setStatus, strings]);

  const onMicUp = useCallback(async () => {
    if (!recorder.isRecording) return;
    setHandsFreeListen(false);
    const result = await recorder.stop();
    if (!result.ok) {
      setStatus("idle");
      if (result.reason === "too-short" || result.reason === "empty") {
        setMicError(strings.noSpeech);
      } else {
        setMicError(strings.micFailed);
      }
      return;
    }
    await sendVoice(result.clip);
  }, [recorder, sendVoice, setStatus, strings]);

  const handledListenNonce = useRef(0);
  useEffect(() => {
    if (!isOpen || !listenNonce) return;
    if (handledListenNonce.current === listenNonce) return;
    handledListenNonce.current = listenNonce;

    let cancelled = false;
    setHandsFreeListen(true);
    void (async () => {
      setMicError(null);
      try {
        const cue = strings.listening.split(/[.…]/)[0]?.trim() || strings.listening;
        await speakAndWait(cue, locale);
      } catch {
        // Best-effort cue.
      }
      if (cancelled) return;
      const result = await recorder.start();
      if (cancelled) {
        if (result.ok) void recorder.cancel();
        return;
      }
      if (!result.ok) {
        setStatus("idle");
        setMicError(
          result.reason === "permission-denied" ? strings.micDenied : strings.micFailed,
        );
        return;
      }
      setStatus("listening");
    })();

    return () => {
      cancelled = true;
    };
    // recorder/start is stable enough for a nonce-driven effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, listenNonce]);

  useEffect(() => {
    if (isOpen) return;
    setHandsFreeListen(false);
    void recorder.cancel();
    // Only when the overlay closes — recorder identity changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const statusLabel = describeStatus(status, strings);

  return (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      onRequestClose={close}
      accessibilityViewIsModal
    >
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.canvas }]}
        edges={["top", "left", "right", "bottom"]}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.primary, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.headerText}>
            <Text
              style={[
                styles.title,
                { color: colors.onPrimary, fontSize: 18 * textScale },
              ]}
              accessibilityRole="header"
            >
              {strings.title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.onPrimary, fontSize: 12 * textScale },
              ]}
            >
              {strings.subtitle}
            </Text>
          </View>

          {messages.length ? (
            <Pressable
              onPress={reset}
              style={styles.headerBtn}
              accessibilityRole="button"
              accessibilityLabel={strings.clear}
            >
              <MaterialIcon name="history" size={22} color={colors.onPrimary} />
            </Pressable>
          ) : null}

          <Pressable
            onPress={close}
            style={styles.headerBtn}
            accessibilityRole="button"
            accessibilityLabel={strings.a11yClose}
          >
            <MaterialIcon name="close" size={24} color={colors.onPrimary} />
          </Pressable>
        </View>

        {!canSync ? (
          <View style={[styles.banner, { backgroundColor: colors.warning }]}>
            <MaterialIcon name="cloud_off" size={18} color={colors.onPrimary} />
            <Text style={[styles.bannerText, { color: colors.onPrimary }]}>
              {strings.offline} — {strings.offlineHint}
            </Text>
          </View>
        ) : null}

        {notice ? (
          <Pressable
            onPress={dismissNotice}
            style={[styles.banner, { backgroundColor: colors.secondarySubtle }]}
            accessibilityRole="button"
            accessibilityLabel={notice}
          >
            <MaterialIcon name="info" size={18} color={colors.text} />
            <Text style={[styles.bannerText, { color: colors.text }]}>{notice}</Text>
          </Pressable>
        ) : null}

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            accessibilityLabel={strings.a11yTranscript}
            ListEmptyComponent={
              <View
                style={[
                  styles.greeting,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  highContrast && styles.hcBorder,
                ]}
              >
                <Text
                  style={[
                    styles.greetingText,
                    { color: colors.text, fontSize: 15 * textScale },
                  ]}
                >
                  {strings.greeting}
                </Text>
                <Text
                  style={[
                    styles.greetingHint,
                    { color: colors.textSecondary, fontSize: 13 * textScale },
                  ]}
                >
                  {strings.voiceHint}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Bubble message={item} strings={strings} />
            )}
          />

          {statusLabel ? (
            <View
              style={styles.statusRow}
              accessibilityLiveRegion="polite"
              accessibilityLabel={statusLabel}
            >
              {status === "listening" ? (
                <MaterialIcon name="mic" size={16} color={colors.error} />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: colors.textSecondary, fontSize: 13 * textScale },
                ]}
              >
                {statusLabel}
              </Text>
              {status === "speaking" ? (
                <Pressable
                  onPress={stopSpeech}
                  style={[styles.stopBtn, { borderColor: colors.border }]}
                  accessibilityRole="button"
                  accessibilityLabel={strings.stopSpeaking}
                >
                  <Text
                    style={[styles.stopBtnText, { color: colors.textSecondary }]}
                  >
                    {strings.stopSpeaking}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {micError ? (
            <Text
              style={[
                styles.micError,
                { color: colors.error, fontSize: 13 * textScale },
              ]}
              accessibilityLiveRegion="assertive"
            >
              {micError}
            </Text>
          ) : null}

          <View
            style={[
              styles.composer,
              { backgroundColor: colors.card, borderTopColor: colors.border },
              highContrast && styles.hcTopBorder,
            ]}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={onSend}
              placeholder={strings.inputPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                  color: colors.text,
                  fontSize: 15 * textScale,
                },
              ]}
              multiline
              editable={!busy}
              returnKeyType="send"
              accessibilityLabel={strings.inputPlaceholder}
            />

            {draft.trim() ? (
              <Pressable
                onPress={onSend}
                disabled={busy}
                style={[
                  styles.sendBtn,
                  { backgroundColor: busy ? colors.borderStrong : colors.primary },
                ]}
                accessibilityRole="button"
                accessibilityLabel={strings.send}
              >
                <MaterialIcon name="send" size={24} color={colors.onPrimary} />
              </Pressable>
            ) : (
              <Pressable
                onPressIn={() => void onMicDown()}
                onPressOut={() => void onMicUp()}
                disabled={busy}
                style={[
                  styles.micBtn,
                  {
                    backgroundColor: recorder.isRecording
                      ? colors.error
                      : busy
                        ? colors.borderStrong
                        : colors.primary,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={strings.a11yMic}
                accessibilityHint={strings.holdToTalk}
                accessibilityState={{ busy: recorder.isRecording }}
              >
                <MaterialIcon
                  name={recorder.isRecording ? "graphic_eq" : "mic"}
                  size={30}
                  color={colors.onPrimary}
                />
              </Pressable>
            )}
          </View>
        </KeyboardAvoidingView>

        {status === "listening" && handsFreeListen ? (
          <Pressable
            onPress={() => void onMicUp()}
            style={[styles.listenOverlay, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel={strings.a11yMic}
            accessibilityHint={strings.listening}
            accessibilityLiveRegion="assertive"
          >
            <MaterialIcon name="mic" size={88} color={colors.onPrimary} />
            <Text
              style={[
                styles.listenTitle,
                { color: colors.onPrimary, fontSize: 22 * textScale },
              ]}
            >
              {strings.listening}
            </Text>
            <Text
              style={[
                styles.listenHint,
                { color: colors.onPrimary, fontSize: 15 * textScale },
              ]}
            >
              {strings.holdToTalk}
            </Text>
          </Pressable>
        ) : null}

        {pendingConfirm ? (
          <View style={styles.confirmBackdrop}>
            <View
              style={[
                styles.confirmCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.confirmTitle,
                  { color: colors.text, fontSize: 18 * textScale },
                ]}
                accessibilityRole="header"
              >
                {strings.confirmTitle}
              </Text>
              <Text
                style={[
                  styles.confirmBody,
                  { color: colors.textSecondary, fontSize: 15 * textScale },
                ]}
              >
                {strings.confirmBody(pendingConfirm.what)}
              </Text>
              <View style={styles.confirmActions}>
                <Pressable
                  onPress={() => pendingConfirm.resolve(false)}
                  style={[styles.confirmBtn, { backgroundColor: colors.muted }]}
                  accessibilityRole="button"
                  accessibilityLabel={strings.confirmNo}
                >
                  <Text
                    style={[styles.confirmBtnText, { color: colors.textSecondary }]}
                  >
                    {strings.confirmNo}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => pendingConfirm.resolve(true)}
                  style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityLabel={strings.confirmYes}
                >
                  <Text
                    style={[styles.confirmBtnText, { color: colors.onPrimary }]}
                  >
                    {strings.confirmYes}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

function describeStatus(
  status: AssistantStatus,
  strings: ReturnType<typeof useAssistant>["strings"],
): string | null {
  switch (status) {
    case "listening":
      return strings.listening;
    case "transcribing":
      return strings.transcribing;
    case "thinking":
      return strings.thinking;
    case "working":
      return strings.working;
    case "speaking":
      return strings.assistant;
    default:
      return null;
  }
}

function Bubble({
  message,
  strings,
}: {
  message: AssistantMessage;
  strings: ReturnType<typeof useAssistant>["strings"];
}) {
  const { colors, textScale, highContrast } = useAccessibility();
  const mine = message.role === "user";

  const background = message.isError
    ? colors.primaryMuted
    : mine
      ? colors.primary
      : colors.card;
  const textColor = message.isError
    ? colors.error
    : mine
      ? colors.onPrimary
      : colors.text;

  return (
    <View
      style={[styles.bubbleRow, mine ? styles.bubbleRight : styles.bubbleLeft]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: background,
            borderColor: message.isError ? colors.error : colors.border,
          },
          !mine && styles.bubbleBordered,
          highContrast && styles.hcBorder,
        ]}
        accessibilityLabel={`${mine ? strings.you : strings.assistant}: ${message.text}`}
      >
        {message.fromVoice && !message.text ? (
          <View style={styles.voiceTag}>
            <MaterialIcon name="mic" size={14} color={textColor} />
            <Text style={[styles.voiceTagText, { color: textColor }]}>
              {strings.voiceMessage}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.bubbleText,
              { color: textColor, fontSize: 15 * textScale },
            ]}
            accessibilityLiveRegion={message.streaming ? "polite" : "none"}
          >
            {message.fromVoice ? (
              <Text style={styles.voiceInline}>
                {strings.voiceMessage}
                {"\n"}
              </Text>
            ) : null}
            {message.text}
            {message.streaming && !message.text ? "…" : ""}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: layout.gutter,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerText: { flex: 1, minWidth: 0 },
  title: { ...typography.headlineSm },
  subtitle: { ...typography.caption, opacity: 0.85 },
  headerBtn: {
    width: layout.minTouch,
    height: layout.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: layout.gutter,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  bannerText: { ...typography.bodySm, flex: 1 },
  list: {
    padding: layout.gutter,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  greeting: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  greetingText: { ...typography.bodyMd },
  greetingHint: { ...typography.bodySm },
  bubbleRow: { flexDirection: "row" },
  bubbleLeft: { justifyContent: "flex-start" },
  bubbleRight: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "88%",
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleBordered: { borderWidth: 1 },
  bubbleText: { ...typography.bodyMd },
  voiceTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  voiceTagText: { ...typography.labelMd },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: layout.gutter,
    paddingBottom: spacing.sm,
  },
  statusText: { ...typography.bodySm, flex: 1 },
  stopBtn: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: "center",
  },
  stopBtnText: { ...typography.labelMd },
  micError: {
    ...typography.bodySm,
    paddingHorizontal: layout.gutter,
    paddingBottom: spacing.sm,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: layout.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: layout.minTouch,
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    ...typography.bodyMd,
  },
  sendBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  confirmBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  confirmCard: {
    width: "100%",
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  confirmTitle: { ...typography.headlineSm },
  confirmBody: { ...typography.bodyMd },
  confirmActions: { flexDirection: "row", gap: spacing.sm },
  confirmBtn: {
    flex: 1,
    minHeight: layout.minTouch,
    borderRadius: radii.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { ...typography.labelLg },
  listenOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.xxl,
    zIndex: 20,
  },
  listenTitle: { ...typography.headlineMd, fontWeight: "700", textAlign: "center" },
  listenHint: { ...typography.bodyMd, textAlign: "center", opacity: 0.9 },
  voiceInline: { ...typography.labelMd },
  hcBorder: { borderWidth: 2 },
  hcTopBorder: { borderTopWidth: 2 },
});
