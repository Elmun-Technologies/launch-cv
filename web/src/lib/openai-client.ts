import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getIntegrationValue } from "@/lib/integrations";
import { getSettings, type AiTool } from "@/lib/app-settings";
import { AiUnavailableError, assertAiAllowed, recordAiCall } from "@/lib/ai-budget";

export { AiUnavailableError } from "@/lib/ai-budget";

/** Cap the response size so a runaway generation can't drain credits or
 *  stall a request. Most of our JSON outputs sit well under 1.5K tokens —
 *  raise per-route via `maxTokens` if a specific endpoint needs more. */
const DEFAULT_MAX_TOKENS = 2000;

/** OpenAI calls block route handlers. Hard-stop after 60s so a hung
 *  upstream can't keep a serverless invocation alive until it times out
 *  at the platform level. */
const DEFAULT_TIMEOUT_MS = 60_000;

let client: { key: string; c: OpenAI } | null = null;

/** The API key comes from Admin → Integrations (falls back to OPENAI_API_KEY). */
export async function getOpenAI(): Promise<OpenAI | null> {
  const key = await getIntegrationValue("openai", "apiKey");
  if (!key) return null;
  if (!client || client.key !== key) client = { key, c: new OpenAI({ apiKey: key, timeout: DEFAULT_TIMEOUT_MS }) };
  return client.c;
}

/**
 * One JSON-mode chat completion, with the admin's kill switch, spend caps and
 * per-user limit checked first and the cost recorded afterwards.
 */
export async function chatJson<T>(args: {
  system: string;
  user: string;
  tool: AiTool;
  userId?: string | null;
  /** Paying users keep working when the cap is set to "pause free only". */
  paid?: boolean;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  await assertAiAllowed({ tool: args.tool, userId: args.userId, paid: args.paid });
  const openai = await getOpenAI();
  if (!openai) {
    throw new AiUnavailableError("AI tools aren't configured yet. Please try again later.");
  }
  const model = args.model ?? (await getSettings()).models[args.tool] ?? "gpt-4o-mini";
  let res: OpenAI.Chat.Completions.ChatCompletion;
  try {
    res = await openai.chat.completions.create({
      model,
      temperature: 0.2,
      max_tokens: args.maxTokens ?? DEFAULT_MAX_TOKENS,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: args.system },
        { role: "user", content: args.user },
      ],
    });
  } catch (e) {
    await recordAiCall({ tool: args.tool, userId: args.userId, model, inputTokens: 0, outputTokens: 0, ok: false });
    throw e;
  }
  await recordAiCall({
    tool: args.tool,
    userId: args.userId,
    model,
    inputTokens: res.usage?.prompt_tokens ?? 0,
    outputTokens: res.usage?.completion_tokens ?? 0,
    ok: true,
  });
  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text) as T;
}

/** Route helper: friendly 503 for paused/capped AI, otherwise a generic 502. */
export function aiErrorResponse(e: unknown) {
  if (e instanceof AiUnavailableError) {
    return NextResponse.json({ error: e.message, code: "ai_unavailable" }, { status: 503 });
  }
  return NextResponse.json({ error: "The AI request failed. Please try again." }, { status: 502 });
}
