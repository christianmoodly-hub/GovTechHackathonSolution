import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  HarmBlockThreshold,
  HarmCategory,
  type GenerativeModel,
  type Tool,
} from "firebase/ai";
import { getFirebaseApp } from "../../firebase/client";
import { publicEnv } from "../../utils/publicEnv";
import { initAssistantAppCheck } from "./appCheck";
import { buildSystemInstruction, type InstructionContext } from "./systemInstruction";
import type { ToolRegistry } from "./types";

/**
 * `gemini-3.6-flash` with thinking disabled is the latency sweet spot: tool
 * calls need two round trips, so any thinking budget is felt twice.
 * (gemini-2.5-flash is closed to new Firebase AI Logic projects.)
 */
const DEFAULT_MODEL = "gemini-3.6-flash";

export function assistantModelId(): string {
  return publicEnv("EXPO_PUBLIC_ASSISTANT_MODEL") ?? DEFAULT_MODEL;
}

/**
 * `GenerationConfig` in @firebase/ai 1.4.x has no `thinkingConfig` field, but
 * the SDK forwards the config object to the REST API untouched, so the budget
 * still lands. Typed loosely on purpose.
 */
type LooseGenerationConfig = {
  temperature: number;
  maxOutputTokens: number;
  topP: number;
  thinkingConfig?: { thinkingBudget: number };
};

const SAFETY = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({
  category,
  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}));

export function createAssistantModel(
  registry: ToolRegistry,
  ctx: InstructionContext,
): GenerativeModel {
  initAssistantAppCheck();

  const declarations = Object.values(registry).map((spec) => spec.declaration);
  const tools: Tool[] = declarations.length
    ? [{ functionDeclarations: declarations }]
    : [];

  const generationConfig: LooseGenerationConfig = {
    temperature: 0.3,
    maxOutputTokens: ctx.voiceMode ? 400 : 700,
    topP: 0.9,
    thinkingConfig: { thinkingBudget: 0 },
  };

  return getGenerativeModel(getAI(getFirebaseApp(), { backend: new GoogleAIBackend() }), {
    model: assistantModelId(),
    tools,
    systemInstruction: buildSystemInstruction(ctx),
    safetySettings: SAFETY,
    generationConfig,
  });
}

/** Friendly text for the failure modes users actually hit. */
export function describeAssistantError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("api key") || lower.includes("api-key")) {
    return "The assistant is not configured yet. Check that Firebase AI Logic is enabled for this project.";
  }
  if (lower.includes("app check") || lower.includes("appcheck")) {
    return "The assistant could not verify this app. Try again, or reinstall the latest build.";
  }
  if (lower.includes("thought_signature") || lower.includes("thoughtsignature")) {
    return "Something went wrong while looking that up. Please ask again.";
  }
  if (lower.includes("prepay") || lower.includes("prepayment") || lower.includes("billing")) {
    return "The assistant needs billing set up in Google AI Studio before it can answer.";
  }
  if (lower.includes("quota") || lower.includes("429") || lower.includes("resource-exhausted")) {
    return "The assistant is busy right now. Give it a moment and try again.";
  }
  if (lower.includes("403") || lower.includes("permission")) {
    return "The assistant is not permitted on this project yet. Enable the Gemini Developer API in Firebase.";
  }
  if (lower.includes("network") || lower.includes("fetch") || lower.includes("timeout")) {
    return "I could not reach the assistant. Check your connection and try again.";
  }
  if (lower.includes("safety") || lower.includes("blocked")) {
    return "I cannot answer that one. Ask me about careers, study or funding instead.";
  }
  return "Something went wrong on my side. Please try again.";
}
