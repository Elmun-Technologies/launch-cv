import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { planOfRow, planResolver, purchaseValue } from "@/lib/admin-billing";
import { PUBLIC_PLANS } from "@/lib/monetization";
import type { PlanId } from "@/lib/plan-config";
import { addDays, hasFilters, zonedDay, type TrafficQuery } from "@/lib/traffic/filters";

/**
 * SQL for Admin → Analytics. Every query is bounded by a date range and the
 * global filters, aggregates in Postgres and returns plain numbers (counts are
 * cast to int, averages to float8, so no BigInt/Decimal leaks out).
 *
 * Conversion attribution (sign-ups and purchases → pages and sources):
 * a sign-up or purchase by user U is credited to the ENTRY PAGE of U's first
 * session — the earliest session whose anonymous visitor id was also seen on a
 * page view signed in as U (so the visit before signing up counts), looking
 * back up to 30 days before the range. Events with no such session are
 * "not attributed": they count in the unfiltered totals but in no page or
 * source row, and drop out when a filter is on.
 */

export type Range = { from: Date; to: Date };
export type Filters = Pick<TrafficQuery, "country" | "device" | "channel">;

const LOOKBACK_MS = 30 * 86_400_000;

function where(range: Range, f: Filters, alias?: "e" | "p"): Prisma.Sql {
  const c = (col: string) => Prisma.raw(alias ? `${alias}."${col}"` : `"${col}"`);
  const parts = [Prisma.sql`${c("createdAt")} >= ${range.from}`, Prisma.sql`${c("createdAt")} < ${range.to}`];
  if (f.country) parts.push(Prisma.sql`${c("country")} = ${f.country}`);
  if (f.device) parts.push(Prisma.sql`${c("device")} = ${f.device}`);
  if (f.channel) parts.push(Prisma.sql`${c("channel")} = ${f.channel}`);
  return Prisma.join(parts, " AND ");
}

const localTs = (tz: string, col = `"createdAt"`) => Prisma.sql`((${Prisma.raw(col)} AT TIME ZONE 'UTC') AT TIME ZONE ${tz})`;

// ─── Totals ──────────────────────────────────────────────────────────────────

export type Totals = { visitors: number; sessions: number; pageviews: number; avgSessionMs: number; bounces: number; entries: number };

export async function totals(range: Range, f: Filters): Promise<Totals> {
  const rows = await prisma.$queryRaw<Totals[]>`
    WITH pv AS (
      SELECT "visitorId", "sessionId", "createdAt", "durationMs", "isEntry", "isBounce" FROM "PageView" WHERE ${where(range, f)}
    ), s AS (
      SELECT "sessionId", EXTRACT(EPOCH FROM (MAX("createdAt" + "durationMs" * INTERVAL '1 millisecond') - MIN("createdAt"))) * 1000 AS ms
      FROM pv GROUP BY 1
    )
    SELECT
      (SELECT COUNT(DISTINCT "visitorId") FROM pv)::int AS visitors,
      (SELECT COUNT(*) FROM s)::int AS sessions,
      (SELECT COUNT(*) FROM pv)::int AS pageviews,
      COALESCE((SELECT AVG(ms) FROM s), 0)::float8 AS "avgSessionMs",
      (SELECT COUNT(*) FROM pv WHERE "isEntry" AND "isBounce")::int AS bounces,
      (SELECT COUNT(*) FROM pv WHERE "isEntry")::int AS entries`;
  return rows[0] ?? { visitors: 0, sessions: 0, pageviews: 0, avgSessionMs: 0, bounces: 0, entries: 0 };
}

/** Distinct visitors with a page view in the last 5 minutes. */
export async function liveVisitors(f: Filters, now: Date): Promise<number> {
  const rows = await prisma.$queryRaw<{ n: number }[]>`
    SELECT COUNT(DISTINCT "visitorId")::int AS n FROM "PageView" WHERE ${where({ from: new Date(now.getTime() - 5 * 60_000), to: new Date(now.getTime() + 60_000) }, f)}`;
  return rows[0]?.n ?? 0;
}

// ─── Time series ─────────────────────────────────────────────────────────────

export type SeriesPoint = { key: string; visitors: number; sessions: number; pageviews: number; signups: number };

/** One point per local hour (single-day ranges) or day, zeros included. */
export async function series(q: TrafficQuery, conv: Conversion[]): Promise<SeriesPoint[]> {
  const hourly = q.granularity === "hour";
  const unit = Prisma.raw(hourly ? `'hour'` : `'day'`);
  const fmt = Prisma.raw(hourly ? `'YYYY-MM-DD"T"HH24'` : `'YYYY-MM-DD'`);
  const rows = await prisma.$queryRaw<Omit<SeriesPoint, "signups">[]>`
    SELECT to_char(date_trunc(${unit}, ${localTs(q.tz)}), ${fmt}) AS key,
      COUNT(DISTINCT "visitorId")::int AS visitors, COUNT(DISTINCT "sessionId")::int AS sessions, COUNT(*)::int AS pageviews
    FROM "PageView" WHERE ${where(q, q)} GROUP BY 1`;
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const signups = new Map<string, number>();
  const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: q.tz, hour: "2-digit", hourCycle: "h23" });
  for (const c of conv) {
    if (c.name !== "signup") continue;
    const k = hourly ? `${zonedDay(c.at, q.tz)}T${hourFmt.format(c.at).padStart(2, "0")}` : zonedDay(c.at, q.tz);
    signups.set(k, (signups.get(k) ?? 0) + 1);
  }
  const keys: string[] = [];
  if (hourly) {
    // All 24 hours, so a day in progress keeps the same axis (later hours are 0).
    for (let h = 0; h < 24; h++) keys.push(`${q.fromDay}T${String(h).padStart(2, "0")}`);
  } else {
    for (let d = q.fromDay; d <= q.toDay; d = addDays(d, 1)) keys.push(d);
  }
  return keys.map((key) => ({
    key,
    visitors: byKey.get(key)?.visitors ?? 0,
    sessions: byKey.get(key)?.sessions ?? 0,
    pageviews: byKey.get(key)?.pageviews ?? 0,
    signups: signups.get(key) ?? 0,
  }));
}

/** Sessions started per local weekday (1 = Mon … 7 = Sun) and hour (0–23). */
export async function heatmap(q: TrafficQuery): Promise<number[][]> {
  const rows = await prisma.$queryRaw<{ dow: number; h: number; n: number }[]>`
    SELECT EXTRACT(ISODOW FROM t)::int AS dow, EXTRACT(HOUR FROM t)::int AS h, COUNT(*)::int AS n
    FROM (SELECT ${localTs(q.tz)} AS t FROM "PageView" WHERE "isEntry" AND ${where(q, q)}) x
    GROUP BY 1, 2`;
  const grid = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const r of rows) if (r.dow >= 1 && r.dow <= 7 && r.h >= 0 && r.h < 24) grid[r.dow - 1][r.h] = r.n;
  return grid;
}

// ─── Pages ───────────────────────────────────────────────────────────────────

/** Dynamic SEO routes shown as one expandable row. */
export const PAGE_GROUPS = ["/resume-examples/", "/resume-keywords/", "/blog/", "/ats/", "/cover-letter-examples/", "/compare/", "/alternatives/"];

const GROUP_SQL = Prisma.raw(
  `CASE ${PAGE_GROUPS.map((p) => `WHEN "path" LIKE '${p}%' THEN '${p}*'`).join(" ")} ELSE "path" END`,
);

/** Group key of a path ("/blog/x" → "/blog/*"), or the path itself. */
export function pageGroupOf(path: string): string {
  const g = PAGE_GROUPS.find((p) => path.startsWith(p) && path.length > p.length);
  return g ? `${g}*` : path;
}

export type PageStats = {
  path: string;
  views: number;
  visitors: number;
  avgMs: number;
  entries: number;
  exits: number;
  bounces: number;
  signups: number;
  paid: number;
};
export type PageRow = PageStats & { children?: PageStats[] };

export async function pages(q: TrafficQuery, conv: Conversion[]): Promise<PageRow[]> {
  const rows = await prisma.$queryRaw<(Omit<PageStats, "signups" | "paid"> & { grp: string; isGroup: number })[]>`
    WITH pv AS (
      SELECT "path", "visitorId", "durationMs", "isEntry", "isBounce",
        ROW_NUMBER() OVER (PARTITION BY "sessionId" ORDER BY "createdAt" DESC, "id" DESC) = 1 AS is_exit,
        ${GROUP_SQL} AS grp
      FROM "PageView" WHERE ${where(q, q)}
    )
    SELECT grp, COALESCE("path", grp) AS path, GROUPING("path")::int AS "isGroup",
      COUNT(*)::int AS views, COUNT(DISTINCT "visitorId")::int AS visitors,
      COALESCE(AVG(NULLIF("durationMs", 0)), 0)::float8 AS "avgMs",
      COUNT(*) FILTER (WHERE "isEntry")::int AS entries,
      COUNT(*) FILTER (WHERE is_exit)::int AS exits,
      COUNT(*) FILTER (WHERE "isEntry" AND "isBounce")::int AS bounces
    FROM pv GROUP BY GROUPING SETS ((grp, "path"), (grp))`;

  const credit = new Map<string, { signups: number; paid: number }>();
  const add = (k: string, name: string) => {
    const c = credit.get(k) ?? { signups: 0, paid: 0 };
    if (name === "signup") c.signups += 1;
    else c.paid += 1;
    credit.set(k, c);
  };
  for (const c of firstPerUser(conv, q)) {
    if (!c.entry) continue;
    add(c.entry.path, c.name);
    const g = pageGroupOf(c.entry.path);
    if (g !== c.entry.path) add(g, c.name);
  }
  const withCredit = (r: Omit<PageStats, "signups" | "paid">, key: string): PageStats => ({
    path: r.path,
    views: r.views,
    visitors: r.visitors,
    avgMs: r.avgMs,
    entries: r.entries,
    exits: r.exits,
    bounces: r.bounces,
    signups: credit.get(key)?.signups ?? 0,
    paid: credit.get(key)?.paid ?? 0,
  });

  const out = new Map<string, PageRow>();
  const kids = new Map<string, PageStats[]>();
  for (const r of rows) {
    const isGroup = r.grp.endsWith("/*");
    if (r.isGroup === 1) out.set(r.grp, { ...withCredit(r, r.grp), path: r.grp });
    else if (isGroup) kids.set(r.grp, [...(kids.get(r.grp) ?? []), withCredit(r, r.path)]);
  }
  for (const [g, list] of kids) {
    const row = out.get(g);
    if (row) row.children = list.sort((a, b) => b.views - a.views);
  }
  return [...out.values()].sort((a, b) => b.views - a.views);
}

// ─── Dimensions (sources, audience) ──────────────────────────────────────────

export const DIMENSIONS = {
  channel: { sql: `"channel"`, entry: (e: EntryRow) => e.channel, skipNull: false },
  referrer: { sql: `"referrerHost"`, entry: (e: EntryRow) => e.referrerHost, skipNull: true },
  utmSource: { sql: `"utmSource"`, entry: (e: EntryRow) => e.utmSource, skipNull: true },
  utmMedium: { sql: `"utmMedium"`, entry: (e: EntryRow) => e.utmMedium, skipNull: true },
  utmCampaign: { sql: `"utmCampaign"`, entry: (e: EntryRow) => e.utmCampaign, skipNull: true },
  device: { sql: `"device"`, entry: (e: EntryRow) => e.device, skipNull: false },
  browser: { sql: `"browser"`, entry: (e: EntryRow) => e.browser, skipNull: false },
  os: { sql: `"os"`, entry: (e: EntryRow) => e.os, skipNull: false },
  lang: { sql: `"lang"`, entry: (e: EntryRow) => e.lang, skipNull: false },
  country: { sql: `"country"`, entry: (e: EntryRow) => e.country, skipNull: false },
  region: { sql: `"region"`, entry: (e: EntryRow) => (e.country === "US" ? e.region : null), skipNull: false },
} as const;
export type Dimension = keyof typeof DIMENSIONS;

export type DimRow = { key: string | null; visitors: number; sessions: number; pageviews: number; signups: number; paid: number };

export async function breakdown(q: TrafficQuery, dim: Dimension, conv: Conversion[], limit = 100): Promise<DimRow[]> {
  const d = DIMENSIONS[dim];
  const col = Prisma.raw(d.sql);
  const extra = dim === "region" ? Prisma.sql` AND "country" = 'US'` : d.skipNull ? Prisma.sql` AND ${col} IS NOT NULL` : Prisma.empty;
  const rows = await prisma.$queryRaw<Omit<DimRow, "signups" | "paid">[]>`
    SELECT ${col} AS key, COUNT(DISTINCT "visitorId")::int AS visitors, COUNT(DISTINCT "sessionId")::int AS sessions, COUNT(*)::int AS pageviews
    FROM "PageView" WHERE ${where(q, q)}${extra}
    GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT ${limit}`;
  const credit = new Map<string | null, { signups: number; paid: number }>();
  for (const c of firstPerUser(conv, q)) {
    if (!c.entry) continue;
    if (dim === "region" && c.entry.country !== "US") continue;
    const k = d.entry(c.entry) ?? null;
    const v = credit.get(k) ?? { signups: 0, paid: 0 };
    if (c.name === "signup") v.signups += 1;
    else v.paid += 1;
    credit.set(k, v);
  }
  return rows.map((r) => ({ ...r, signups: credit.get(r.key)?.signups ?? 0, paid: credit.get(r.key)?.paid ?? 0 }));
}

export type VisitorTypeRow = { returning: boolean; visitors: number; sessions: number; signups: number; paid: number };

/** New vs returning, from session entry views. */
export async function visitorTypes(q: TrafficQuery, conv: Conversion[]): Promise<VisitorTypeRow[]> {
  const rows = await prisma.$queryRaw<{ returning: boolean; visitors: number; sessions: number }[]>`
    SELECT "isReturning" AS returning, COUNT(DISTINCT "visitorId")::int AS visitors, COUNT(*)::int AS sessions
    FROM "PageView" WHERE "isEntry" AND ${where(q, q)} GROUP BY 1`;
  const credited = firstPerUser(conv, q).filter((c) => c.entry);
  return [false, true].map((returning) => {
    const r = rows.find((x) => x.returning === returning);
    const mine = credited.filter((c) => c.entry!.isReturning === returning);
    return {
      returning,
      visitors: r?.visitors ?? 0,
      sessions: r?.sessions ?? 0,
      signups: mine.filter((c) => c.name === "signup").length,
      paid: mine.filter((c) => c.name !== "signup").length,
    };
  });
}

/** Countries with traffic in the range (unfiltered), for the filter menu. */
export async function countryOptions(range: Range): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ country: string }[]>`
    SELECT "country" FROM "PageView" WHERE "createdAt" >= ${range.from} AND "createdAt" < ${range.to} AND "country" IS NOT NULL
    GROUP BY 1 ORDER BY COUNT(DISTINCT "visitorId") DESC LIMIT 80`;
  return rows.map((r) => r.country);
}

// ─── Conversions ─────────────────────────────────────────────────────────────

export type EntryRow = {
  sessionId: string;
  createdAt: Date;
  path: string;
  channel: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  country: string | null;
  region: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  lang: string | null;
  isReturning: boolean;
};
export type Conversion = { id: string; userId: string; name: "signup" | "pay_success"; at: Date; meta: unknown; entry: EntryRow | null };

/** Sign-up and purchase events in the range, each with the entry view of the user's first session (or null). */
export async function conversions(range: Range): Promise<Conversion[]> {
  const lookback = new Date(range.from.getTime() - LOOKBACK_MS);
  const rows = await prisma.$queryRaw<(Omit<Conversion, "entry"> & Partial<EntryRow>)[]>`
    WITH conv AS (
      SELECT "id", "userId", "name", "createdAt", "meta" FROM "AnalyticsEvent"
      WHERE "name" IN ('signup', 'pay_success') AND "createdAt" >= ${range.from} AND "createdAt" < ${range.to} AND "userId" IS NOT NULL
    ), users AS (
      SELECT DISTINCT "userId" FROM conv
    ), uv AS (
      SELECT DISTINCT p."userId", p."visitorId" FROM "PageView" p JOIN users u ON u."userId" = p."userId"
      WHERE p."createdAt" >= ${lookback} AND p."createdAt" < ${range.to}
    ), ft AS (
      SELECT DISTINCT ON (uv."userId") uv."userId" AS uid, e."sessionId", e."createdAt" AS "entryAt", e."path", e."channel", e."referrerHost",
        e."utmSource", e."utmMedium", e."utmCampaign", e."country", e."region", e."device", e."browser", e."os", e."lang", e."isReturning"
      FROM uv JOIN "PageView" e ON e."visitorId" = uv."visitorId" AND e."isEntry"
      WHERE e."createdAt" >= ${lookback} AND e."createdAt" < ${range.to}
      ORDER BY uv."userId", e."createdAt"
    )
    SELECT conv."id", conv."userId", conv."name", conv."createdAt" AS at, conv."meta", ft.*
    FROM conv LEFT JOIN ft ON ft.uid = conv."userId"
    ORDER BY conv."createdAt"`;
  return rows.map((r) => {
    const x = r as typeof r & { entryAt?: Date; uid?: string };
    return {
      id: r.id,
      userId: r.userId,
      name: r.name,
      at: r.at,
      meta: r.meta,
      entry: x.sessionId
        ? {
            sessionId: x.sessionId,
            createdAt: x.entryAt!,
            path: x.path!,
            channel: x.channel!,
            referrerHost: x.referrerHost ?? null,
            utmSource: x.utmSource ?? null,
            utmMedium: x.utmMedium ?? null,
            utmCampaign: x.utmCampaign ?? null,
            country: x.country ?? null,
            region: x.region ?? null,
            device: x.device!,
            browser: x.browser ?? null,
            os: x.os ?? null,
            lang: x.lang ?? null,
            isReturning: !!x.isReturning,
          }
        : null,
    };
  });
}

export function matchesFilters(e: EntryRow | null, f: Filters): boolean {
  if (!hasFilters(f)) return true;
  if (!e) return false;
  return (!f.country || e.country === f.country) && (!f.device || e.device === f.device) && (!f.channel || e.channel === f.channel);
}

/** Conversions that pass the filters (all of them when no filter is on). */
export function filtered(conv: Conversion[], f: Filters): Conversion[] {
  return conv.filter((c) => matchesFilters(c.entry, f));
}

/**
 * One credit per user and event type: a user who paid twice in the range
 * counts once in "paid started here", matching "people", not orders.
 */
export function firstPerUser(conv: Conversion[], f: Filters): Conversion[] {
  const seen = new Set<string>();
  return filtered(conv, f).filter((c) => {
    const k = `${c.name}:${c.userId}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export type ConversionSummary = {
  signups: number;
  payers: number;
  purchases: number;
  revenue: number;
  /** Events in the range with no first session found. */
  unattributed: number;
};

export async function summarize(conv: Conversion[], f: Filters): Promise<ConversionSummary> {
  const list = filtered(conv, f);
  const pays = list.filter((c) => c.name === "pay_success");
  const subs = pays.length
    ? await prisma.subscription.findMany({
        where: { userId: { in: [...new Set(pays.map((p) => p.userId))] } },
        select: { userId: true, stripePriceId: true, stripeSubscriptionId: true, currentPeriodEnd: true },
      })
    : [];
  const planOf = await planResolver(subs.map((s) => s.stripePriceId));
  const planOfUser = new Map(subs.map((s) => [s.userId, planOfRow(s, planOf)]));
  let revenue = 0;
  for (const p of pays) {
    const metaPlan = (p.meta as { plan?: string } | null)?.plan;
    const plan = (metaPlan && metaPlan in PUBLIC_PLANS ? metaPlan : planOfUser.get(p.userId)) as PlanId | undefined;
    revenue += purchaseValue(p.meta, plan);
  }
  return {
    signups: new Set(list.filter((c) => c.name === "signup").map((c) => c.userId)).size,
    payers: new Set(pays.map((c) => c.userId)).size,
    purchases: pays.length,
    revenue,
    unattributed: conv.filter((c) => !c.entry).length,
  };
}

// ─── Funnel ──────────────────────────────────────────────────────────────────

export type FunnelStep = { id: string; label: string; n: number; hint: string };

const AI_EVENTS = ["jd_run", "impact_rewrite", "role_fit", "packet", "evidence_check"];

/**
 * Visitors and free ATS checks are counted in the range. The steps from
 * sign-up on follow the people who signed up in the range (a cohort): how many
 * of them went on to verify, create a resume, use AI, start checkout and pay.
 */
export async function funnel(q: TrafficQuery, conv: Conversion[], visitors: number): Promise<FunnelStep[]> {
  const cohort = [...new Set(filtered(conv, q).filter((c) => c.name === "signup").map((c) => c.userId))];
  const ats = hasFilters(q)
    ? await prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(DISTINCT a."meta"->>'visitorId')::int AS n FROM "AnalyticsEvent" a
        WHERE a."name" = 'free_ats_check' AND a."createdAt" >= ${q.from} AND a."createdAt" < ${q.to}
          AND a."meta"->>'visitorId' IN (SELECT DISTINCT "visitorId" FROM "PageView" WHERE ${where(q, q)})`
    : await prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(DISTINCT COALESCE(a."meta"->>'visitorId', a."id"))::int AS n FROM "AnalyticsEvent" a
        WHERE a."name" = 'free_ats_check' AND a."createdAt" >= ${q.from} AND a."createdAt" < ${q.to}`;

  let verified = 0;
  let resume = 0;
  let ai = 0;
  let checkout = 0;
  let paid = 0;
  if (cohort.length) {
    const since = q.from;
    const [v, r, a, ev] = await Promise.all([
      prisma.user.count({ where: { id: { in: cohort }, emailVerifiedAt: { not: null } } }),
      prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(*)::int AS n FROM unnest(${cohort}::text[]) AS u(id)
        WHERE EXISTS (SELECT 1 FROM "Resume" r WHERE r."userId" = u.id)
           OR EXISTS (SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id AND e."name" = 'resume_created' AND e."createdAt" >= ${since})`,
      prisma.$queryRaw<{ n: number }[]>`
        SELECT COUNT(*)::int AS n FROM unnest(${cohort}::text[]) AS u(id)
        WHERE EXISTS (SELECT 1 FROM "AiCall" c WHERE c."userId" = u.id AND c."createdAt" >= ${since})
           OR EXISTS (SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = u.id AND e."name" IN (${Prisma.join(AI_EVENTS)}) AND e."createdAt" >= ${since})`,
      prisma.analyticsEvent.groupBy({
        by: ["name", "userId"],
        where: { userId: { in: cohort }, name: { in: ["checkout_started", "pay_success"] }, createdAt: { gte: since } },
      }),
    ]);
    verified = v;
    resume = r[0]?.n ?? 0;
    ai = a[0]?.n ?? 0;
    checkout = ev.filter((e) => e.name === "checkout_started").length;
    paid = ev.filter((e) => e.name === "pay_success").length;
  }
  return [
    { id: "visit", label: "Visited the site", n: visitors, hint: "Unique visitors in the range" },
    { id: "ats", label: "Ran a free ATS check", n: ats[0]?.n ?? 0, hint: "Unique visitors who ran a check (older checks count once each)" },
    { id: "signup", label: "Signed up", n: cohort.length, hint: "New accounts in the range — the cohort for the steps below" },
    { id: "verified", label: "Verified email", n: verified, hint: "Of the cohort" },
    { id: "resume", label: "Created a resume", n: resume, hint: "Of the cohort" },
    { id: "ai", label: "Used an AI tool", n: ai, hint: "Of the cohort: any AI call" },
    { id: "checkout", label: "Started checkout", n: checkout, hint: "Of the cohort" },
    { id: "paid", label: "Paid", n: paid, hint: "Of the cohort" },
  ];
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventRow = { name: string; count: number; users: number };

/** Server-side product events in the range (not affected by the traffic filters). */
export async function topEvents(range: Range, limit = 30): Promise<EventRow[]> {
  return prisma.$queryRaw<EventRow[]>`
    SELECT "name", COUNT(*)::int AS count, COUNT(DISTINCT "userId")::int AS users FROM "AnalyticsEvent"
    WHERE "createdAt" >= ${range.from} AND "createdAt" < ${range.to}
    GROUP BY 1 ORDER BY 2 DESC LIMIT ${limit}`;
}

// ─── Journeys ────────────────────────────────────────────────────────────────

export type JourneyStep = { path: string; at: Date; durationMs: number };
export type Journey = {
  sessionId: string;
  start: Date;
  entry: EntryRow;
  city: string | null;
  steps: JourneyStep[];
  userId: string | null;
  userEmail: string | null;
  signedUp: boolean;
  paid: boolean;
};

export const JOURNEYS_PER_PAGE = 30;

/**
 * Sessions that started in the range, newest first. A session "signed up" or
 * "paid" when one of its signed-in users has that event between the session's
 * start (minus 5 minutes) and 30 minutes after its last view.
 */
export async function journeys(
  q: TrafficQuery,
  opts: { convertedOnly: boolean; entryPath: string | null; page: number; perPage?: number },
): Promise<{ total: number; list: Journey[] }> {
  const conds: Prisma.Sql[] = [Prisma.sql`e."isEntry"`, where(q, q, "e")];
  if (opts.entryPath) conds.push(Prisma.sql`e."path" = ${opts.entryPath}`);
  if (opts.convertedOnly) {
    conds.push(Prisma.sql`EXISTS (
      SELECT 1 FROM "PageView" p JOIN "AnalyticsEvent" a ON a."userId" = p."userId" AND a."name" IN ('signup', 'pay_success')
      WHERE p."sessionId" = e."sessionId" AND p."userId" IS NOT NULL
        AND p."createdAt" >= e."createdAt" AND p."createdAt" < e."createdAt" + INTERVAL '1 day'
        AND a."createdAt" >= e."createdAt" - INTERVAL '5 minutes' AND a."createdAt" < p."createdAt" + INTERVAL '30 minutes')`);
  }
  const w = Prisma.join(conds, " AND ");
  const perPage = Math.min(5000, Math.max(1, opts.perPage ?? JOURNEYS_PER_PAGE));
  const offset = Math.max(0, opts.page - 1) * perPage;
  const [count, entries] = await Promise.all([
    prisma.$queryRaw<{ n: number }[]>`SELECT COUNT(*)::int AS n FROM "PageView" e WHERE ${w}`,
    prisma.$queryRaw<(EntryRow & { city: string | null })[]>`
      SELECT e."sessionId", e."createdAt", e."path", e."channel", e."referrerHost", e."utmSource", e."utmMedium", e."utmCampaign",
        e."country", e."region", e."city", e."device", e."browser", e."os", e."lang", e."isReturning"
      FROM "PageView" e WHERE ${w}
      ORDER BY e."createdAt" DESC LIMIT ${perPage} OFFSET ${offset}`,
  ]);
  if (!entries.length) return { total: count[0]?.n ?? 0, list: [] };

  const ids = entries.map((e) => e.sessionId);
  const minStart = new Date(Math.min(...entries.map((e) => e.createdAt.getTime())));
  const maxStart = new Date(Math.max(...entries.map((e) => e.createdAt.getTime())));
  const views = await prisma.pageView.findMany({
    where: { sessionId: { in: ids }, createdAt: { gte: minStart, lt: new Date(maxStart.getTime() + 86_400_000) } },
    orderBy: { createdAt: "asc" },
    select: { sessionId: true, path: true, createdAt: true, durationMs: true, userId: true },
  });
  const bySession = new Map<string, typeof views>();
  for (const v of views) bySession.set(v.sessionId, [...(bySession.get(v.sessionId) ?? []), v]);
  const userIds = [...new Set(views.map((v) => v.userId).filter((x): x is string => !!x))];
  const [users, events] = userIds.length
    ? await Promise.all([
        prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true } }),
        prisma.analyticsEvent.findMany({
          where: {
            userId: { in: userIds },
            name: { in: ["signup", "pay_success"] },
            createdAt: { gte: new Date(minStart.getTime() - 5 * 60_000), lt: new Date(maxStart.getTime() + 2 * 86_400_000) },
          },
          select: { userId: true, name: true, createdAt: true },
        }),
      ])
    : [[], []];
  const emailOf = new Map(users.map((u) => [u.id, u.email]));

  const list = entries.map((e) => {
    const rows = bySession.get(e.sessionId) ?? [];
    const uid = rows.find((r) => r.userId)?.userId ?? null;
    const sessionUsers = new Set(rows.map((r) => r.userId).filter(Boolean));
    const lastAt = rows.length ? rows[rows.length - 1].createdAt.getTime() : e.createdAt.getTime();
    const inWindow = (name: string) =>
      events.some(
        (ev) =>
          ev.name === name &&
          sessionUsers.has(ev.userId) &&
          ev.createdAt.getTime() >= e.createdAt.getTime() - 5 * 60_000 &&
          ev.createdAt.getTime() < lastAt + 30 * 60_000,
      );
    return {
      sessionId: e.sessionId,
      start: e.createdAt,
      entry: e,
      city: e.city,
      steps: rows.map((r) => ({ path: r.path, at: r.createdAt, durationMs: r.durationMs })),
      userId: uid,
      userEmail: uid ? (emailOf.get(uid) ?? null) : null,
      signedUp: inWindow("signup"),
      paid: inWindow("pay_success"),
    };
  });
  return { total: count[0]?.n ?? 0, list };
}

// ─── Live ────────────────────────────────────────────────────────────────────

export type LiveData = {
  visitors: number;
  pages: { path: string; visitors: number }[];
  recent: { path: string; at: string; country: string | null; device: string; channel: string; referrerHost: string | null }[];
};

export async function live(now: Date): Promise<LiveData> {
  const since = new Date(now.getTime() - 5 * 60_000);
  const [v, pagesNow, recent] = await Promise.all([
    prisma.$queryRaw<{ n: number }[]>`SELECT COUNT(DISTINCT "visitorId")::int AS n FROM "PageView" WHERE "createdAt" >= ${since}`,
    // Each active visitor's latest page.
    prisma.$queryRaw<{ path: string; visitors: number }[]>`
      SELECT "path", COUNT(*)::int AS visitors FROM (
        SELECT DISTINCT ON ("visitorId") "visitorId", "path" FROM "PageView" WHERE "createdAt" >= ${since}
        ORDER BY "visitorId", "createdAt" DESC
      ) x GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 50`,
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { path: true, createdAt: true, country: true, device: true, channel: true, referrerHost: true },
    }),
  ]);
  return {
    visitors: v[0]?.n ?? 0,
    pages: pagesNow,
    recent: recent.map(({ createdAt, ...r }) => ({ ...r, at: createdAt.toISOString() })),
  };
}
