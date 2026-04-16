import OpenAI from "openai";

export function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function chatJson<T>(args: {
  system: string;
  user: string;
  model?: string;
}): Promise<T> {
  const client = getOpenAI();
  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const res = await client.chat.completions.create({
    model: args.model ?? "gpt-4o-mini",
    temperature: 0.2,
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
