import OpenAI from "openai";

/** Cap the response size so a runaway generation can't drain credits or
 *  stall a request. Most of our JSON outputs sit well under 1.5K tokens —
 *  raise per-route via `maxTokens` if a specific endpoint needs more. */
const DEFAULT_MAX_TOKENS = 2000;

/** OpenAI calls block route handlers. Hard-stop after 60s so a hung
 *  upstream can't keep a serverless invocation alive until it times out
 *  at the platform level. */
const DEFAULT_TIMEOUT_MS = 60_000;

export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key, timeout: DEFAULT_TIMEOUT_MS });
}

export async function chatJson<T>(args: {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
}): Promise<T> {
  const client = getOpenAI();
  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const res = await client.chat.completions.create({
    model: args.model ?? "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: args.maxTokens ?? DEFAULT_MAX_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
  });
  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error("Empty response");
  return JSON.parse(text) as T;
}
