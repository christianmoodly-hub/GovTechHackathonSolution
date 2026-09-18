import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Linking } from "react-native";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import type { Content, FunctionCall, Part } from "firebase/ai";
import { useAccessibility } from "./AccessibilityContext";
import { useAuth } from "./AuthContext";
import { useConnectivity } from "./ConnectivityContext";
import { useLocale } from "./LocaleContext";
import { getAssistantStrings, type AssistantStrings } from "../i18n/assistant";
import type { AppLocale } from "../i18n/types";
import { createActionTools, type ActionHost } from "../services/ai/actions";
import { appHelpTools } from "../services/ai/appHelp";
import { createAssistantModel, describeAssistantError } from "../services/ai/client";
import { matchIntent } from "../services/ai/intents";
import { createProfileTools, retrievalTools } from "../services/ai/retrieval";
import {
  createScreenActionRegistry,
  type ScreenActionRegistry,
  type ScreenActionSet,
} from "../services/ai/screenActions";
import type { ToolRegistry } from "../services/ai/types";
import {
  needsCatalogueGrounding,
  RETRIEVAL_TOOL_NAMES,
} from "../services/ai/grounding";
import { speak, stopSpeaking, sanitizeAssistantReply } from "../services/voice/speech";
import { href } from "../utils/href";

export type AssistantRole = "user" | "assistant";

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  text: string;
  /** Set while the model is still streaming this message. */
  streaming?: boolean;
  /** Spoken rather than typed. */
  fromVoice?: boolean;
  isError?: boolean;
};

export type AssistantStatus =
  | "idle"
  | "listening"
  | "transcribing"
  | "thinking"
  | "working"
  | "speaking";

export type PendingConfirm = {
  what: string;
  resolve: (allowed: boolean) => void;
};

type AssistantContextValue = {
  isOpen: boolean;
  open: (options?: { voice?: boolean }) => void;
  close: () => void;
  messages: AssistantMessage[];
  status: AssistantStatus;
  busy: boolean;
  strings: AssistantStrings;
  /** Set when the model asked to leave the app and we need a yes or no. */
  pendingConfirm: PendingConfirm | null;
  /** Non-blocking notice, e.g. no voice installed for this language. */
  notice: string | null;
  dismissNotice: () => void;
  sendText: (text: string) => Promise<void>;
  sendVoice: (clip: { base64: string; mimeType: string }) => Promise<void>;
  setStatus: (status: AssistantStatus) => void;
  reset: () => void;
  stopSpeech: () => void;
  registerScreen: ScreenActionRegistry["register"];
  /**
   * Open the overlay and bump `listenNonce` so the overlay starts recording.
   * Used by volume-down, shake, and the launcher long-press.
   */
  requestListen: () => void;
  listenNonce: number;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/** Tool-calling rounds allowed per user turn before we force an answer. */
const MAX_TOOL_ROUNDS = 4;

/** Turns kept in history. Each turn can carry tool traffic, so keep it tight. */
const MAX_HISTORY_TURNS = 12;

function messageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Gemini 3 requires thoughtSignature on functionCall parts when we echo the
 * model turn back. Clone parts as plain objects and normalise snake_case so
 * the field survives Firebase/Gemini response formats.
 */
function preserveModelParts(parts: unknown[]): Record<string, unknown>[] {
  return parts.map((part) => {
    if (!part || typeof part !== "object") return {};
    const raw = part as Record<string, unknown>;
    const next: Record<string, unknown> = { ...raw };
    const snake = raw.thought_signature;
    if (
      next.thoughtSignature == null &&
      typeof snake === "string" &&
      snake.length > 0
    ) {
      next.thoughtSignature = snake;
    }
    delete next.thought_signature;
    return next;
  });
}

function modelPartsHaveRequiredSignatures(parts: Record<string, unknown>[]): boolean {
  const firstCall = parts.find((part) => part.functionCall);
  if (!firstCall) return true;
  return typeof firstCall.thoughtSignature === "string" && firstCall.thoughtSignature.length > 0;
}

/**
 * Pull a speakable confirmation out of a tool result for the shortcut path,
 * where no model turn produces prose.
 */
function describeToolResult(
  result: Record<string, unknown>,
  strings: AssistantStrings,
): string {
  if (typeof result.description === "string") return result.description;
  if (typeof result.error === "string") return result.error;
  if (typeof result.opened === "string") return strings.opened(result.opened);
  if (typeof result.screenName === "string") {
    return strings.openedScreen(result.screenName);
  }
  return strings.working;
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const { setHighContrast, setTextZoom } = useAccessibility();
  const { user, profile, applyLocalProfile } = useAuth();
  const { canSync } = useConnectivity();

  const strings = useMemo(() => getAssistantStrings(locale), [locale]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [screenActionNames, setScreenActionNames] = useState<string[]>([]);
  const [listenNonce, setListenNonce] = useState(0);

  /** Conversation history we own, so the system instruction can change per turn. */
  const historyRef = useRef<Content[]>([]);
  /** Whether the current turn arrived by voice, so we know to speak the reply. */
  const voiceTurnRef = useRef(false);
  /** Warn once per session that the user's language has no installed voice. */
  const warnedNoVoiceRef = useRef(false);
  const pathnameRef = useRef(pathname);
  const profileRef = useRef(profile);
  const localeRef = useRef<AppLocale>(locale);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const screens = useMemo(
    () => createScreenActionRegistry(setScreenActionNames),
    [],
  );

  const busy =
    status === "thinking" || status === "working" || status === "transcribing";

  const dismissNotice = useCallback(() => setNotice(null), []);

  const stopSpeech = useCallback(() => {
    stopSpeaking();
    setStatus((current) => (current === "speaking" ? "idle" : current));
  }, []);

  const open = useCallback((options?: { voice?: boolean }) => {
    setIsOpen(true);
    if (options?.voice) voiceTurnRef.current = true;
  }, []);

  const requestListen = useCallback(() => {
    voiceTurnRef.current = true;
    setIsOpen(true);
    setListenNonce((n) => n + 1);
  }, []);

  const close = useCallback(() => {
    stopSpeaking();
    setIsOpen(false);
    setStatus("idle");
  }, []);

  const reset = useCallback(() => {
    stopSpeaking();
    historyRef.current = [];
    setMessages([]);
    setStatus("idle");
    setNotice(null);
  }, []);

  const confirmLeaveApp = useCallback(
    (what: string) =>
      new Promise<boolean>((resolve) => {
        setPendingConfirm({
          what,
          resolve: (allowed) => {
            setPendingConfirm(null);
            resolve(allowed);
          },
        });
      }),
    [],
  );

  const host = useMemo<ActionHost>(
    () => ({
      navigate: (path) => router.push(href(path)),
      goBack: () => {
        if (!router.canGoBack()) return false;
        router.back();
        return true;
      },
      currentPath: () => pathnameRef.current ?? "/",
      screens,
      setLocale,
      currentLocale: () => localeRef.current,
      setHighContrast,
      setTextZoom,
      uid: () => user?.uid ?? null,
      profile: () => profileRef.current,
      applyProfile: applyLocalProfile,
      confirmLeaveApp,
      openExternal: async (url) => {
        await Linking.openURL(url);
      },
    }),
    [
      router,
      screens,
      setLocale,
      setHighContrast,
      setTextZoom,
      user?.uid,
      applyLocalProfile,
      confirmLeaveApp,
    ],
  );

  const registry = useMemo<ToolRegistry>(
    () => ({
      ...retrievalTools,
      ...appHelpTools,
      ...createProfileTools(user?.uid ?? null),
      ...createActionTools(host),
    }),
    [host, user?.uid],
  );

  const speakReply = useCallback(
    async (text: string) => {
      const cleaned = sanitizeAssistantReply(text);
      if (!cleaned) return;
      setStatus("speaking");
      const plan = await speak(cleaned, localeRef.current, {
        onDone: () =>
          setStatus((current) => (current === "speaking" ? "idle" : current)),
      });
      if (plan.fellBack && plan.missingLanguage && !warnedNoVoiceRef.current) {
        warnedNoVoiceRef.current = true;
        setNotice(strings.voiceNotAvailable(plan.missingLanguage));
      }
    },
    [strings],
  );

  const pushMessage = useCallback((message: AssistantMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const runTool = useCallback(
    async (name: string, args: Record<string, unknown>) => {
      const spec = registry[name];
      if (!spec) {
        return { ok: false, error: `There is no tool called ${name}.` };
      }
      try {
        return await spec.handler(args ?? {});
      } catch (err) {
        console.warn(`[assistant] tool ${name} failed`, err);
        return {
          ok: false,
          error:
            err instanceof Error
              ? `That failed: ${err.message}`
              : "That failed for an unknown reason.",
        };
      }
    },
    [registry],
  );

  /**
   * One user turn: call the model, run any tools it requests, loop until it
   * produces prose. Uses non-streaming generateContent because Gemini 3
   * attaches thoughtSignature to functionCall parts, and the Firebase stream
   * aggregator drops that field — which then 400s the next tool round.
   */
  const runTurn = useCallback(
    async (userParts: Part[], displayText: string, fromVoice: boolean) => {
      voiceTurnRef.current = fromVoice;
      stopSpeaking();

      pushMessage({
        id: messageId(),
        role: "user",
        text: displayText,
        fromVoice,
      });

      historyRef.current = [
        ...historyRef.current.slice(-(MAX_HISTORY_TURNS * 3)),
        { role: "user", parts: userParts },
      ];

      const replyId = messageId();
      pushMessage({ id: replyId, role: "assistant", text: "", streaming: true });
      setStatus("thinking");

      const updateReply = (text: string, done: boolean) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === replyId
              ? { ...message, text, streaming: !done }
              : message,
          ),
        );
      };

      // Typed catalogue questions must hit NCAP search/get tools this turn.
      const requireCatalogueTools =
        !fromVoice && needsCatalogueGrounding(displayText);
      let usedRetrievalTool = false;
      let forcedToolReminder = false;

      try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
          const model = createAssistantModel(registry, {
            locale: localeRef.current,
            currentPath: pathnameRef.current ?? "/",
            screenActions: screenActionNames,
            displayName: profileRef.current?.demographics?.fullName ?? null,
            role: profileRef.current?.demographics?.role ?? null,
            isGuest: !user || user.isAnonymous,
            voiceMode: fromVoice,
          });

          const result = await model.generateContent({
            contents: historyRef.current,
          });

          const response = result.response;
          const calls: FunctionCall[] = response.functionCalls() ?? [];
          // Keep the raw parts object graph so thoughtSignature survives the
          // next request. Do not rebuild functionCall parts from calls alone.
          const candidateParts = preserveModelParts(
            response.candidates?.[0]?.content?.parts ?? [],
          );

          if (!calls.length) {
            let finalText = "";
            try {
              finalText = sanitizeAssistantReply(response.text() ?? "");
            } catch {
              finalText = "";
            }

            // Model answered from memory — nudge it once to call a tool.
            if (
              requireCatalogueTools &&
              !usedRetrievalTool &&
              !forcedToolReminder &&
              round < MAX_TOOL_ROUNDS - 1
            ) {
              forcedToolReminder = true;
              console.warn(
                "[assistant] catalogue question answered without tools; forcing lookup",
              );
              historyRef.current = [
                ...historyRef.current,
                {
                  role: "user",
                  parts: [
                    {
                      text: "You must look this up in the NCAP catalogue with a search_* or get_* tool before answering. Call a tool now. Do not invent careers, bursaries, institutions, dates or requirements.",
                    },
                  ],
                },
              ];
              continue;
            }

            if (requireCatalogueTools && !usedRetrievalTool) {
              console.warn(
                "[assistant] blocked ungrounded catalogue reply",
                displayText.slice(0, 80),
              );
              finalText = strings.notFound;
            } else if (!finalText.trim()) {
              finalText = strings.notFound;
            }

            historyRef.current = [
              ...historyRef.current,
              { role: "model", parts: [{ text: finalText }] },
            ];
            updateReply(finalText, true);
            if (fromVoice) await speakReply(finalText);
            else setStatus("idle");
            return;
          }

          if (!modelPartsHaveRequiredSignatures(candidateParts)) {
            console.warn(
              "[assistant] model returned functionCall without thoughtSignature; clearing history",
              candidateParts.map((part) => Object.keys(part)),
            );
            // Without the signature the next round always 400s. Drop history so
            // a follow-up question can start clean.
            historyRef.current = historyRef.current.slice(0, -1);
            throw new Error(
              "thought_signature missing from model function call",
            );
          }

          setStatus("working");
          updateReply(strings.working, false);

          const responseParts: Part[] = [];
          for (const call of calls) {
            if (RETRIEVAL_TOOL_NAMES.has(call.name)) {
              usedRetrievalTool = true;
            }
            const output = await runTool(
              call.name,
              (call.args ?? {}) as Record<string, unknown>,
            );
            if (__DEV__) {
              console.log(
                "[assistant] tool",
                call.name,
                output.ok === false ? "fail" : "ok",
                typeof output.matchCount === "number"
                  ? `matches=${output.matchCount}`
                  : typeof output.found === "boolean"
                    ? `found=${output.found}`
                    : "",
              );
            }
            const functionResponse: {
              name: string;
              response: Record<string, unknown>;
              id?: string;
            } = { name: call.name, response: output };
            // Gemini Developer API maps call ↔ response by id when present.
            if ("id" in call && typeof (call as { id?: string }).id === "string") {
              functionResponse.id = (call as { id: string }).id;
            }
            responseParts.push({ functionResponse });
          }

          historyRef.current = [
            ...historyRef.current,
            {
              role: "model",
              parts: candidateParts.length
                ? (candidateParts as unknown as Part[])
                : calls.map((call) => ({ functionCall: call })),
            },
            { role: "user", parts: responseParts },
          ];
        }

        // Ran out of rounds without prose — say so rather than going silent.
        const fallback = strings.notFound;
        updateReply(fallback, true);
        if (fromVoice) await speakReply(fallback);
        else setStatus("idle");
      } catch (err) {
        console.warn("[assistant] turn failed", err);
        const message = describeAssistantError(err);
        setMessages((current) =>
          current.map((entry) =>
            entry.id === replyId
              ? { ...entry, text: message, streaming: false, isError: true }
              : entry,
          ),
        );
        if (fromVoice) await speakReply(message);
        else setStatus("idle");
      }
    },
    [
      pushMessage,
      registry,
      runTool,
      screenActionNames,
      speakReply,
      strings,
      user,
    ],
  );

  /**
   * Try the local shortcut table first. It answers the common navigation
   * commands instantly and is the only path that works with no network.
   */
  const tryShortcut = useCallback(
    async (text: string, fromVoice: boolean): Promise<boolean> => {
      const intent = matchIntent(text);
      if (!intent) return false;
      if (!registry[intent.tool]) return false;

      pushMessage({ id: messageId(), role: "user", text, fromVoice });
      setStatus("working");

      const output = await runTool(intent.tool, intent.args);
      const templated = intent.reply(strings);
      const reply = sanitizeAssistantReply(
        output.ok === false
          ? describeToolResult(output, strings)
          : templated || describeToolResult(output, strings),
      );

      pushMessage({ id: messageId(), role: "assistant", text: reply });

      // Keep the model's history honest about what the user asked and what
      // happened, so follow-up questions still have context.
      historyRef.current = [
        ...historyRef.current,
        { role: "user", parts: [{ text }] },
        { role: "model", parts: [{ text: reply }] },
      ];

      if (fromVoice) await speakReply(reply);
      else setStatus("idle");
      return true;
    },
    [pushMessage, registry, runTool, speakReply, strings],
  );

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      if (await tryShortcut(trimmed, false)) return;

      if (!canSync) {
        pushMessage({ id: messageId(), role: "user", text: trimmed });
        pushMessage({
          id: messageId(),
          role: "assistant",
          text: `${strings.offline}. ${strings.offlineHint}`,
          isError: true,
        });
        return;
      }

      await runTurn([{ text: trimmed }], trimmed, false);
    },
    [busy, canSync, pushMessage, runTurn, strings, tryShortcut],
  );

  const sendVoice = useCallback(
    async (clip: { base64: string; mimeType: string }) => {
      if (busy) return;

      if (!canSync) {
        pushMessage({
          id: messageId(),
          role: "assistant",
          text: `${strings.offline}. ${strings.offlineHint}`,
          isError: true,
        });
        await speakReply(strings.offlineHint);
        return;
      }

      setStatus("transcribing");
      // Gemini reads the audio directly, so there is no separate transcription
      // step; the prompt tells it to answer what it hears — not caption it.
      await runTurn(
        [
          {
            inlineData: { mimeType: clip.mimeType, data: clip.base64 },
          },
          {
            text: "The user spoke the attached audio. Answer or act on what they asked in plain sentences. Do not produce a transcript, captions, or timestamps. If the audio is silent or unintelligible, say you did not catch it and ask them to repeat.",
          },
        ],
        strings.voiceMessage,
        true,
      );
    },
    [busy, canSync, pushMessage, runTurn, speakReply, strings],
  );

  const value = useMemo<AssistantContextValue>(
    () => ({
      isOpen,
      open,
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
      registerScreen: screens.register,
      requestListen,
      listenNonce,
    }),
    [
      isOpen,
      open,
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
      reset,
      stopSpeech,
      screens.register,
      requestListen,
      listenNonce,
    ],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) {
    throw new Error("useAssistant must be used within AssistantProvider");
  }
  return ctx;
}

/**
 * Register what the focused screen lets the assistant do. Pass a stable object
 * (memoise it) or the registry will churn on every render.
 *
 * Registers on focus so tab screens that stay mounted do not steal the
 * "current screen" from whichever tab is actually showing.
 */
export function useAssistantActions(actions: ScreenActionSet | null): void {
  const { registerScreen } = useAssistant();

  useFocusEffect(
    useCallback(() => {
      if (!actions) return;
      return registerScreen(actions);
    }, [actions, registerScreen]),
  );
}
