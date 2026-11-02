import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { getSettings } from "@/lib/app-settings";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/request-ip";
import { consumeRateLimitShared } from "@/lib/rate-limit";

/**
 * Shared plumbing for the public AI writing tools under /tools (bullet, summary
 * and resignation letter generators): admin kill switch, input validation, a per-IP daily
 * quota on the shared DB-backed limiter, and the post-generation guard that
 * drops any option containing a number the visitor didn't type.
 *
 * Model calls go through `chatJson()` in the routes, so the global AI switch,
 * spend caps and cost recording apply as for every other AI feature.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** One quota bucket for both tools: "today's free generations". */
function quotaKey(req: Request) {
  return `free-tools:${getClientIp(req)}`;
}

export const FREE_TOOLS_PAUSED_MESSAGE = "The free writing tools are paused for a short while. Please try again later.";
export const FREE_TOOLS_LIMIT_MESSAGE =
  "You've used today's free generations. Create a free account to keep writing, or come back tomorrow.";

/** Admin → Limits & budgets → "Free writing tools". */
export async function freeToolsPaused(): Promise<NextResponse | null> {
  const s = await getSettings();
  if (s.switches.freeTools) return null;
  return NextResponse.json({ error: FREE_TOOLS_PAUSED_MESSAGE, code: "paused" }, { status: 503 });
}

/** What the tool pages show: the real daily limit and whether generation is switched off. */
export async function freeToolsPageState(): Promise<{ limit: number; paused: boolean }> {
  const s = await getSettings();
  return { limit: s.rateLimits.freeToolsPerIpPerDay, paused: !s.switches.freeTools || !s.switches.aiTools };
}

/** Parse and validate a JSON body; a generic 400 never echoes the input back. */
export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<{ ok: true; data: T } | { ok: false; res: NextResponse }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, res: NextResponse.json({ error: "Please fill in the form and try again." }, { status: 400 }) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return {
      ok: false,
      res: NextResponse.json({ error: first && first.length < 140 ? first : "Please check the form and try again." }, { status: 400 }),
    };
  }
  return { ok: true, data: parsed.data };
}

export type Quota = { limit: number; remaining: number | null; refund: () => Promise<void> };

/**
 * Take one generation from the visitor's daily allowance. Returns a 429
 * response when it's used up. `remaining` is read back from the shared bucket
 * when the database is reachable (null otherwise, and the UI hides it).
 */
export async function takeFreeToolQuota(req: Request): Promise<{ ok: true; quota: Quota } | { ok: false; res: NextResponse }> {
  const limit = (await getSettings()).rateLimits.freeToolsPerIpPerDay;
  const key = quotaKey(req);
  const allowed = await consumeRateLimitShared(key, limit, DAY_MS);
  if (!allowed) {
    return { ok: false, res: NextResponse.json({ error: FREE_TOOLS_LIMIT_MESSAGE, code: "limit", remaining: 0, limit }, { status: 429 }) };
  }
  const row = await prisma.rateLimitBucket.findUnique({ where: { key }, select: { count: true } }).catch(() => null);
  const remaining = row ? Math.max(0, limit - row.count) : null;
  return {
    ok: true,
    quota: {
      limit,
      remaining,
      // Give the generation back when we couldn't produce a usable result.
      refund: async () => {
        await prisma.rateLimitBucket
          .updateMany({ where: { key, count: { gt: 0 } }, data: { count: { decrement: 1 } } })
          .catch(() => undefined);
      },
    },
  };
}

/** Plain text for the prompt: no control characters, collapsed whitespace, capped. */
export function clean(s: string, max: number): string {
  return s
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Every number in a string, normalized ("1,200" → "1200", "3.5" stays). */
function numbersIn(s: string): string[] {
  return (s.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((n) => n.replace(/,/g, "").replace(/\.0+$/, ""));
}

/** Spelled-out numbers the model might use to sneak in a figure. */
const NUMBER_WORDS: Record<string, string> = {
  two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  eleven: "11", twelve: "12", fifteen: "15", twenty: "20", thirty: "30", forty: "40", fifty: "50", hundred: "100",
  dozen: "12", dozens: "12", hundreds: "100", thousands: "1000", doubled: "2", tripled: "3",
};

function numberWordsIn(s: string): string[] {
  return (s.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => w in NUMBER_WORDS).map((w) => NUMBER_WORDS[w]);
}

/**
 * Last line of defense for the "uses only what you typed" promise: an option
 * that contains a number (digits or a spelled-out figure) the visitor didn't
 * give is dropped.
 */
export function onlyKnownNumbers(options: string[], input: string): string[] {
  const known = new Set([...numbersIn(input), ...numberWordsIn(input)]);
  return options.filter((o) => [...numbersIn(o), ...numberWordsIn(o)].every((n) => known.has(n)));
}

const DATE_WORDS =
  /\b(january|february|march|april|may(?=\s+\d)|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|yesterday|weekend|week|weeks|month|months|year|years)\b/g;

/**
 * The same promise for dates: an option that names a month, weekday or span
 * of time ("weeks", "years") the visitor didn't type is dropped, so a letter
 * can't invent a notice period, a tenure or a second date. "May" counts as a
 * month only when a day number follows it, so the verb is left alone.
 */
export function onlyKnownDates(options: string[], input: string): string[] {
  const known = new Set(input.toLowerCase().match(DATE_WORDS) ?? []);
  return options.filter((o) => (o.toLowerCase().match(DATE_WORDS) ?? []).every((w) => known.has(w)));
}

/** Shape a model string list: strings only, trimmed, de-duplicated, length-capped. */
export function toOptions(raw: unknown, max: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of raw) {
    const t = typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
    if (!t || t.length > maxLen || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}
