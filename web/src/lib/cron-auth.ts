import crypto from "node:crypto";

/**
 * Who may call a cron route (see app/api/cron/winback).
 *
 * - With CRON_SECRET set (Vercel sends it as `Authorization: Bearer <secret>`
 *   on every cron call), only that header is accepted.
 * - Without it, only requests whose user-agent starts with `vercel-cron/` are
 *   accepted, and at most one run per `minGapHours`, so a spoofed user-agent
 *   can trigger no more than the schedule already does.
 */
export type CronAuthInput = {
  secret: string | undefined;
  authorization: string | null;
  userAgent: string | null;
  lastRunAt: Date | null;
  now: Date;
  minGapHours?: number;
};

export type CronAuthResult = { ok: true } | { ok: false; status: 401 | 429; error: string };

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function cronAuth(input: CronAuthInput): CronAuthResult {
  const secret = input.secret?.trim();
  if (secret) {
    return safeEqual(input.authorization ?? "", `Bearer ${secret}`) ? { ok: true } : { ok: false, status: 401, error: "Unauthorized" };
  }
  if (!(input.userAgent ?? "").startsWith("vercel-cron/")) return { ok: false, status: 401, error: "Unauthorized" };
  const gapMs = (input.minGapHours ?? 20) * 3_600_000;
  if (input.lastRunAt && input.now.getTime() - input.lastRunAt.getTime() < gapMs) {
    return { ok: false, status: 429, error: "Already ran recently" };
  }
  return { ok: true };
}
