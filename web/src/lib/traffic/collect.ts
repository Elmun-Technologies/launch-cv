import { createHash, randomBytes } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/request-ip";
import { getSiteUrl } from "@/lib/site";

/**
 * Server side of first-party page analytics (POST /api/t).
 *
 * Privacy model (same as Plausible): no cookie and no stored IP. A visitor id
 * is SHA-256(daily salt + IP + user-agent + site), truncated. The salt is
 * random, kept in AppSetting "trafficSalt" and replaced every UTC day, so
 * yesterday's ids can't be recomputed and nobody is followed across days.
 */

export const SALT_KEY = "trafficSalt";
/** Paths that are never recorded. */
export const SKIP_PREFIXES = ["/admin-panel", "/admin-2fa", "/api", "/_next"];
/** Longest time credited to one page view. */
export const MAX_VIEW_MS = 30 * 60_000;
/** Raw page views are kept this many months (daily cron). */
export const RETENTION_MONTHS = 13;

export function isSkippedPath(path: string): boolean {
  return SKIP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Trim, drop control characters and cap the length; empty → null. */
export function clean(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
  return s || null;
}

/**
 * Path to store: no query or hash, no trailing slash, and segments that look
 * like record ids (cuid, uuid, long hex or digits) collapsed to ":id" so
 * private documents never show up by id and app pages group together.
 */
export function normalizePath(raw: string): string | null {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return null;
  let path = raw.split(/[?#]/)[0] ?? "/";
  try {
    path = decodeURI(path);
  } catch {
    // keep as sent
  }
  path = path
    .split("/")
    .map((seg) =>
      /^c[a-z0-9]{20,32}$/.test(seg) ||
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg) ||
      /^[0-9a-f]{24,}$/i.test(seg) ||
      /^\d{5,}$/.test(seg)
        ? ":id"
        : seg,
    )
    .join("/");
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return clean(path, 300);
}

export type Utm = { utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; utmTerm: string | null; utmContent: string | null };

/** UTM tags (lowercased source/medium) and whether an ad click id was present, from a query string. */
export function parseUtm(query: string): Utm & { adClick: boolean } {
  let sp: URLSearchParams;
  try {
    sp = new URLSearchParams(query.slice(0, 2000));
  } catch {
    sp = new URLSearchParams();
  }
  const get = (k: string, lower = false) => {
    const v = clean(sp.get(k), 150);
    return v && lower ? v.toLowerCase() : v;
  };
  return {
    utmSource: get("utm_source", true),
    utmMedium: get("utm_medium", true),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
    adClick: ["gclid", "gbraid", "wbraid", "msclkid", "dclid"].some((k) => sp.has(k)),
  };
}

/** Hosts that count as "this site" (their referrers are internal navigation). */
export function siteHosts(req: Request): string[] {
  const out = new Set<string>();
  const add = (h: string | null | undefined) => {
    const v = (h ?? "").toLowerCase().split(":")[0].replace(/^www\./, "");
    if (v) out.add(v);
  };
  try {
    add(new URL(getSiteUrl()).hostname);
  } catch {
    // ignore
  }
  add(req.headers.get("host"));
  add(req.headers.get("x-forwarded-host"));
  return [...out];
}

function decodeHeader(v: string | null, max: number): string | null {
  if (!v) return null;
  try {
    return clean(decodeURIComponent(v), max);
  } catch {
    return clean(v, max);
  }
}

/** Geo from the hosting edge (Vercel). Null locally. */
export function geoOf(req: Request): { country: string | null; region: string | null; city: string | null } {
  const country = clean(req.headers.get("x-vercel-ip-country"), 2)?.toUpperCase() ?? null;
  return {
    country: country && /^[A-Z]{2}$/.test(country) && country !== "XX" ? country : null,
    region: decodeHeader(req.headers.get("x-vercel-ip-country-region"), 10)?.toUpperCase() ?? null,
    city: decodeHeader(req.headers.get("x-vercel-ip-city"), 80),
  };
}

/** Do Not Track or Global Privacy Control sent by the browser. */
export function optedOut(req: Request): boolean {
  return req.headers.get("dnt") === "1" || req.headers.get("sec-gpc") === "1";
}

const utcDay = (now = new Date()) => now.toISOString().slice(0, 10);
let saltCache: { day: string; salt: string } | null = null;

/**
 * Today's salt. The first request of a UTC day writes a new random one; the
 * conditional upsert keeps a single winner when several servers race.
 */
export async function dailySalt(now = new Date()): Promise<string> {
  const day = utcDay(now);
  if (saltCache?.day === day) return saltCache.salt;
  const read = async () => {
    const row = await prisma.appSetting.findUnique({ where: { key: SALT_KEY } });
    const v = row?.value as { day?: unknown; salt?: unknown } | null;
    return v && v.day === day && typeof v.salt === "string" ? v.salt : null;
  };
  let salt = await read();
  if (!salt) {
    const value = JSON.stringify({ day, salt: randomBytes(32).toString("hex") });
    await prisma.$executeRaw`
      INSERT INTO "AppSetting" ("key", "value", "updatedAt") VALUES (${SALT_KEY}, ${value}::jsonb, NOW())
      ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()
      WHERE "AppSetting"."value"->>'day' IS DISTINCT FROM ${day}`;
    salt = await read();
    if (!salt) throw new Error("traffic salt unavailable");
  }
  saltCache = { day, salt };
  return salt;
}

/** Today's anonymous visitor id for this request (20 hex chars). */
export async function visitorIdFor(req: Request, now = new Date()): Promise<string> {
  const salt = await dailySalt(now);
  const ua = req.headers.get("user-agent") ?? "";
  const site = (() => {
    try {
      return new URL(getSiteUrl()).hostname;
    } catch {
      return "launch-cv";
    }
  })();
  return createHash("sha256").update(`${salt}|${getClientIp(req)}|${ua}|${site}`).digest("hex").slice(0, 20);
}

/** Visitor id to attach to a server-side event, or undefined when the browser opted out. Never throws. */
export async function eventVisitorId(req: Request): Promise<string | undefined> {
  if (optedOut(req)) return undefined;
  try {
    return await visitorIdFor(req);
  } catch {
    return undefined;
  }
}

export type PageViewInput = {
  visitorId: string;
  sessionId: string;
  userId: string | null;
  path: string;
  title: string | null;
  referrerHost: string | null;
  utm: Utm;
  channel: string;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  lang: string | null;
  isReturning: boolean;
};

/**
 * Store one page view. The first view of a session is its entry (and a bounce
 * until a second view arrives); later views inherit the session's visitor id
 * and acquisition fields, and fill in the previous view's time on page when
 * the browser didn't report it.
 */
export async function recordPageView(input: PageViewInput, now = new Date()): Promise<string> {
  const prev = await prisma.pageView.findFirst({
    where: { sessionId: input.sessionId, createdAt: { gte: new Date(now.getTime() - 24 * 3_600_000) } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      durationMs: true,
      visitorId: true,
      referrerHost: true,
      utmSource: true,
      utmMedium: true,
      utmCampaign: true,
      utmTerm: true,
      utmContent: true,
      channel: true,
    },
  });

  const base = {
    sessionId: input.sessionId,
    userId: input.userId,
    path: input.path,
    title: input.title,
    country: input.country,
    region: input.region,
    city: input.city,
    device: input.device,
    browser: input.browser,
    os: input.os,
    lang: input.lang,
    createdAt: now,
  };

  if (!prev) {
    const row = await prisma.pageView.create({
      data: {
        ...base,
        visitorId: input.visitorId,
        referrerHost: input.referrerHost,
        ...input.utm,
        channel: input.channel,
        isEntry: true,
        isBounce: true,
        isReturning: input.isReturning,
      },
      select: { id: true },
    });
    return row.id;
  }

  const gap = Math.min(MAX_VIEW_MS, Math.max(0, now.getTime() - prev.createdAt.getTime()));
  const [row] = await prisma.$transaction([
    prisma.pageView.create({
      data: {
        ...base,
        visitorId: prev.visitorId,
        referrerHost: prev.referrerHost,
        utmSource: prev.utmSource,
        utmMedium: prev.utmMedium,
        utmCampaign: prev.utmCampaign,
        utmTerm: prev.utmTerm,
        utmContent: prev.utmContent,
        channel: prev.channel,
      },
      select: { id: true },
    }),
    // Time on the previous page: the gap, unless the browser already reported visible time.
    prisma.pageView.updateMany({ where: { id: prev.id, durationMs: 0 }, data: { durationMs: gap } }),
    prisma.pageView.updateMany({ where: { sessionId: input.sessionId, isEntry: true, isBounce: true }, data: { isBounce: false } }),
  ]);
  return row.id;
}

/** Visible time reported when the visitor leaves or hides a page (keeps the larger value). */
export async function recordEngagement(id: string, sessionId: string, ms: number): Promise<void> {
  const value = Math.round(Math.min(MAX_VIEW_MS, Math.max(0, ms)));
  if (!value) return;
  await prisma.$executeRaw`
    UPDATE "PageView" SET "durationMs" = GREATEST("durationMs", ${value})
    WHERE "id" = ${id} AND "sessionId" = ${sessionId} AND "createdAt" > NOW() - INTERVAL '1 day'`;
}

/** Delete page views older than the retention window, in batches. Returns the number deleted. */
export async function purgeOldPageViews(now = new Date(), maxBatches = 20): Promise<number> {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RETENTION_MONTHS);
  let total = 0;
  for (let i = 0; i < maxBatches; i++) {
    const n = await prisma.$executeRaw(
      Prisma.sql`DELETE FROM "PageView" WHERE "id" IN (SELECT "id" FROM "PageView" WHERE "createdAt" < ${cutoff} LIMIT 20000)`,
    );
    total += n;
    if (n < 20000) break;
  }
  return total;
}
