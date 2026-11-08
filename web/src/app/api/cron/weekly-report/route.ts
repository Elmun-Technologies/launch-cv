import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cronAuth } from "@/lib/cron-auth";
import { getSettings } from "@/lib/app-settings";
import { sendWeeklyReport, WEEKLY_REPORT_LAST_RUN_KEY } from "@/lib/weekly-report";
import { logError } from "@/lib/redact";

/**
 * Weekly owner report, Mondays 13:07 UTC (vercel.json → crons). See lib/weekly-report.ts.
 * Auth: lib/cron-auth.ts (CRON_SECRET bearer, or vercel-cron user-agent at most every 6 days).
 * Off in Admin → Settings → Weekly report; skipped (and logged) while Resend isn't configured.
 */

export const maxDuration = 60;

const MIN_GAP_HOURS = 6 * 24;

async function lastRunAt(): Promise<Date | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: WEEKLY_REPORT_LAST_RUN_KEY } }).catch(() => null);
  const at = row?.value && typeof row.value === "object" ? (row.value as { at?: unknown }).at : null;
  const d = typeof at === "string" ? new Date(at) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

async function saveLastRun(now: Date, result: unknown) {
  const value = { at: now.toISOString(), result } as Prisma.InputJsonValue;
  await prisma.appSetting.upsert({ where: { key: WEEKLY_REPORT_LAST_RUN_KEY }, create: { key: WEEKLY_REPORT_LAST_RUN_KEY, value }, update: { value } });
}

export async function GET(req: Request) {
  const now = new Date();
  const auth = cronAuth({
    secret: process.env.CRON_SECRET,
    authorization: req.headers.get("authorization"),
    userAgent: req.headers.get("user-agent"),
    lastRunAt: await lastRunAt(),
    now,
    minGapHours: MIN_GAP_HOURS,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { reports } = await getSettings();
  if (!reports.weeklyEnabled) return NextResponse.json({ ok: true, skipped: "off" });

  try {
    // Claim the run first, so an overlapping call is refused by the 6-day guard.
    await saveLastRun(now, { running: true });
    const result = await sendWeeklyReport({ to: "owners", now });
    await saveLastRun(now, result);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    logError("[cron/weekly-report] run failed", e);
    await saveLastRun(now, { error: "run failed" }).catch(() => {});
    return NextResponse.json({ error: "Run failed" }, { status: 500 });
  }
}
