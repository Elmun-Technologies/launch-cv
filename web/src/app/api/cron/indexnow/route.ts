import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cronAuth } from "@/lib/cron-auth";
import { getSiteUrl } from "@/lib/site";
import { INDEXNOW_ENDPOINT, indexNowBody, pickIndexNowUrls } from "@/lib/indexnow";
import { logError } from "@/lib/redact";
import sitemap from "@/app/sitemap";

/**
 * Daily IndexNow ping (vercel.json → crons): sends the sitemap URLs whose
 * lastModified is within the last 3 days to Bing / Yandex / Seznam / Naver.
 * The very first run sends every URL. Production only.
 * Auth: lib/cron-auth.ts (CRON_SECRET bearer, or vercel-cron user-agent at most every 20 hours).
 */

export const maxDuration = 60;

const LAST_RUN_KEY = "indexnowLastRun";
const WINDOW_DAYS = 3;

async function lastRun(): Promise<Date | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: LAST_RUN_KEY } }).catch(() => null);
  const at = row?.value && typeof row.value === "object" ? (row.value as { at?: unknown }).at : null;
  const d = typeof at === "string" ? new Date(at) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}

export async function GET(req: Request) {
  const now = new Date();
  const prev = await lastRun();
  const auth = cronAuth({
    secret: process.env.CRON_SECRET,
    authorization: req.headers.get("authorization"),
    userAgent: req.headers.get("user-agent"),
    lastRunAt: prev,
    now,
  });
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ skipped: "not production" });
  }

  const host = new URL(getSiteUrl()).host;
  const urls = pickIndexNowUrls(await sitemap(), host, now, WINDOW_DAYS, !prev);
  let status = 0;
  if (urls.length) {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowBody(host, urls)),
      signal: AbortSignal.timeout(20_000),
    }).catch((e: unknown) => {
      logError("[indexnow]", e);
      return null;
    });
    status = res?.status ?? 0;
    // 200 and 202 both mean accepted; anything else is retried tomorrow (last run isn't saved).
    if (status !== 200 && status !== 202) {
      return NextResponse.json({ error: "IndexNow rejected the request", status, urls: urls.length }, { status: 502 });
    }
  }
  const value = { at: now.toISOString(), urls: urls.length, status } as Prisma.InputJsonValue;
  await prisma.appSetting.upsert({ where: { key: LAST_RUN_KEY }, create: { key: LAST_RUN_KEY, value }, update: { value } });
  return NextResponse.json({ ok: true, submitted: urls.length, status });
}
