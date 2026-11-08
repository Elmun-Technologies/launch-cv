import { prisma } from "@/lib/prisma";
import { getSettings, type AiTool } from "@/lib/app-settings";
import { sendTransactionalEmail } from "@/lib/email";

/**
 * Spend control for every AI call (see lib/openai-client.ts):
 *  - before a call: kill switch, monthly/daily caps and the per-user daily cap;
 *  - after a call: its cost is recorded in AiCall and budget alerts are sent.
 */

/** USD per 1M tokens (input, output). Provider list prices; check them when adding a model. */
export const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1": { input: 2, output: 8 },
  // Claude list prices. Thinking is billed as output, so Claude calls run more output tokens per answer.
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-opus-5-5": { input: 4, output: 20 },
};

export function costMicros(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICES[model] ?? MODEL_PRICES["gpt-4o"];
  // tokens × USD/1M tokens = micro-dollars
  return Math.ceil(inputTokens * p.input + outputTokens * p.output);
}

/** Thrown when a call is refused for budget, switch or per-user reasons. Routes map it to HTTP 503. */
export class AiUnavailableError extends Error {
  status = 503;
}

function startOfUtcDay(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function startOfUtcMonth(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

async function spendSince(since: Date, userId?: string): Promise<number> {
  const r = await prisma.aiCall.aggregate({
    _sum: { costMicros: true },
    where: { createdAt: { gte: since }, ...(userId ? { userId } : {}) },
  });
  return (r._sum.costMicros ?? 0) / 1_000_000;
}

let spendCache: { at: number; day: number; month: number } | null = null;

export async function currentSpend(): Promise<{ day: number; month: number }> {
  if (spendCache && Date.now() - spendCache.at < 10_000) return spendCache;
  const [day, month] = await Promise.all([spendSince(startOfUtcDay()), spendSince(startOfUtcMonth())]);
  spendCache = { at: Date.now(), day, month };
  return spendCache;
}

export async function assertAiAllowed(args: { tool: AiTool; userId?: string | null; paid?: boolean }) {
  const s = await getSettings();
  if (!s.switches.aiTools) {
    throw new AiUnavailableError("AI tools are paused for maintenance. Please try again a little later.");
  }
  const { budget } = s;
  if (budget.monthlyCapUsd > 0 || budget.dailyCapUsd > 0) {
    const spend = await currentSpend();
    const capped =
      (budget.monthlyCapUsd > 0 && spend.month >= budget.monthlyCapUsd) ||
      (budget.dailyCapUsd > 0 && spend.day >= budget.dailyCapUsd);
    if (capped && (budget.onCap === "pause_all" || (budget.onCap === "pause_free" && !args.paid))) {
      throw new AiUnavailableError(
        args.paid
          ? "AI tools are busy right now. Please try again in a little while."
          : "Free AI checks are busy right now. Please try again later — paid plans aren't affected.",
      );
    }
  }
  if (args.userId && budget.perUserDailyUsd > 0) {
    const mine = await spendSince(startOfUtcDay(), args.userId);
    if (mine >= budget.perUserDailyUsd) {
      throw new AiUnavailableError("You've reached today's AI safety limit. It resets at midnight UTC.");
    }
  }
}

export async function recordAiCall(args: {
  tool: AiTool;
  userId?: string | null;
  model: string;
  inputTokens: number;
  outputTokens: number;
  ok: boolean;
}) {
  const micros = args.ok ? costMicros(args.model, args.inputTokens, args.outputTokens) : 0;
  try {
    await prisma.aiCall.create({
      data: {
        userId: args.userId ?? null,
        tool: args.tool,
        provider: args.model.startsWith("claude-") ? "anthropic" : "openai",
        model: args.model,
        inputTokens: args.inputTokens,
        outputTokens: args.outputTokens,
        costMicros: micros,
        ok: args.ok,
      },
    });
    if (spendCache) {
      spendCache.day += micros / 1_000_000;
      spendCache.month += micros / 1_000_000;
    }
    if (micros > 0) await maybeSendBudgetAlert();
  } catch {
    // Never fail the user's request because accounting failed.
  }
}

const ALERT_KEY = "budgetAlerts";

async function maybeSendBudgetAlert() {
  const s = await getSettings();
  const cap = s.budget.monthlyCapUsd;
  const to = s.budget.alertEmail;
  if (!cap || !to) return;
  const { month } = await currentSpend();
  const pct = (month / cap) * 100;
  // Thresholds from Admin → Limits & budgets (default 50/80/100).
  const levels = s.budget.alertLevels.filter((l) => pct >= l);
  if (!levels.length) return;
  const monthKey = startOfUtcMonth().toISOString().slice(0, 7);
  const row = await prisma.appSetting.findUnique({ where: { key: ALERT_KEY } });
  const prev = (row?.value ?? {}) as { month?: string; sent?: number[] };
  const sent = prev.month === monthKey ? prev.sent ?? [] : [];
  const level = levels.filter((l) => !sent.includes(l)).pop();
  if (level === undefined) return;
  await prisma.appSetting.upsert({
    where: { key: ALERT_KEY },
    create: { key: ALERT_KEY, value: { month: monthKey, sent: [...sent, level] } },
    update: { value: { month: monthKey, sent: [...sent, level] } },
  });
  const capReached = pct >= 100;
  const action =
    !capReached
      ? "Nothing is paused yet."
      : s.budget.onCap === "alert_only"
        ? "Calls continue because the cap is set to alert only."
        : s.budget.onCap === "pause_all"
          ? "All AI tools are now paused until the cap is raised or the month resets."
          : "Free AI checks are paused; paid users continue.";
  await sendTransactionalEmail({
    to,
    subject: `LaunchCV AI spend at ${level}% of the $${cap} monthly cap`,
    text: `AI spend this month is $${month.toFixed(2)} of $${cap} (${Math.round(pct)}%). ${action}\n\nChange the cap in Admin → Limits & budgets.`,
    html: `<p>AI spend this month is <b>$${month.toFixed(2)}</b> of $${cap} (${Math.round(pct)}%).</p><p>${action}</p><p>Change the cap in Admin → Limits &amp; budgets.</p>`,
  });
}
