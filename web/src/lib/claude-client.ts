import Anthropic from "@anthropic-ai/sdk";
import { getIntegrationValue } from "@/lib/integrations";

/** Claude models offered in Admin → Limits & budgets, cheapest first. */
export const CLAUDE_MODELS = ["claude-haiku-5-5", "claude-sonnet-5-5", "claude-opus-5-5"] as const;

export function isClaudeModel(model: string): boolean {
  return model.startsWith("claude-");
}

/** Server-side refusal fallback is offered for these models on the Claude API (not Haiku). */
const SERVER_FALLBACK_MODELS = new Set(["claude-sonnet-5-5", "claude-opus-5-5"]);

/** Thinking is always on for current Claude models and counts against max_tokens, so leave room. */
const MIN_MAX_TOKENS = 16_000;
const TIMEOUT_MS = 60_000;

let client: { key: string; c: Anthropic } | null = null;

/** The API key comes from Admin → Integrations → Claude (falls back to ANTHROPIC_API_KEY). */
export async function getClaude(): Promise<Anthropic | null> {
  const key = await getIntegrationValue("anthropic", "apiKey");
  if (!key) return null;
  if (!client || client.key !== key) client = { key, c: new Anthropic({ apiKey: key, timeout: TIMEOUT_MS, maxRetries: 1 }) };
  return client.c;
}

export class ClaudeRefusalError extends Error {}

/**
 * One request that must answer with a single JSON object. Returns the raw text
 * (parsed by the caller) and token usage for the spend ledger.
 */
export async function claudeJsonText(
  claude: Anthropic,
  args: { model: string; system: string; user: string; maxTokens?: number },
): Promise<{ text: string; inputTokens: number; outputTokens: number }> {
  const useFallback = SERVER_FALLBACK_MODELS.has(args.model);
  const res = await claude.beta.messages.create({
    model: args.model,
    max_tokens: Math.max(args.maxTokens ?? 0, MIN_MAX_TOKENS),
    output_config: { effort: "medium" },
    system: `${args.system}\n\nRespond with a single JSON object and nothing else: no prose before or after it, no code fences.`,
    messages: [{ role: "user", content: args.user }],
    ...(useFallback ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });
  const usage = { inputTokens: res.usage.input_tokens ?? 0, outputTokens: res.usage.output_tokens ?? 0 };
  if (res.stop_reason === "refusal") throw new ClaudeRefusalError("The model declined this request.");
  const text = res.content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return { text, ...usage };
}

/** Pull the JSON object out of a reply, tolerating stray code fences or a sentence around it. */
export function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Empty response");
  return text.slice(start, end + 1);
}

/** Admin → Integrations "Test" button: lists models with the key. */
export async function testClaudeKey(apiKey: string): Promise<{ ok: boolean; message: string }> {
  const c = new Anthropic({ apiKey, timeout: 10_000, maxRetries: 0 });
  try {
    await c.models.list({ limit: 1 });
    return { ok: true, message: "Key accepted" };
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) return { ok: false, message: "Key rejected (401)" };
    if (e instanceof Anthropic.PermissionDeniedError) return { ok: false, message: "Key has no access (403)" };
    if (e instanceof Anthropic.APIError) return { ok: false, message: `Claude API returned ${e.status}` };
    return { ok: false, message: "Couldn't reach the Claude API" };
  }
}
