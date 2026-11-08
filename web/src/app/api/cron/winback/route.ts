import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cronAuth } from "@/lib/cron-auth";
import { runWinback } from "@/lib/winback";
import { logError } from "@/lib/redact";

/**
 * Daily win-back email run (vercel.json → crons). See lib/winback.ts.
 * Auth: lib/cron-auth.ts (CRON_SECRET bearer, or vercel-cron user-agent at most every 20 h).
 */

export const maxDuration = 60;

/** AppSetting row holding the last run time (not a settings group). */
const LAST_RUN_KEY = "winbackLastRun";

async function lastRunAt(): Promise<Date | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: LAST_RUN_KEY } }).catch(() => null);
  const at = row?.value && typeof row.value === "object" ? (row.value as { at?: unknown }).at : null;
  const d = typeof at === "string" ? new Date(at) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

async function saveLastRun(now: Date, result: unknown) {
  const value = { at: now.toISOString(), result } as Prisma.InputJsonValue;
  await prisma.appSetting.upsert({ where: { key: LAST_RUN_KEY }, create: { key: LAST_RUN_KEY, value }, update: { value } });
}

export async function GET(req: Request) {
  const now = new Date();
  const auth = cronAuth({
    secret: process.env.CRON_SECRET,
    authorization: req.headers.get("authorization"),
    userAgent: req.headers.get("user-agent"),
    lastRunAt: await lastRunAt(),
    now,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    // Claim the run first, so an overlapping call is refused by the 20 h guard.
    await saveLastRun(now, { running: true });
    const result = await runWinback(now);
    await saveLastRun(now, result);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    logError("[cron/winback] run failed", e);
    return NextResponse.json({ error: "Run failed" }, { status: 500 });
  }
}
