import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { csvResponse, toCsv } from "@/lib/admin-csv";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { countryName, hourLabel, languageName, usStateName, WEEKDAYS } from "@/lib/traffic/labels";
import {
  breakdown,
  conversions,
  filtered,
  funnel,
  heatmap,
  journeys,
  pages,
  series,
  topEvents,
  totals,
  visitorTypes,
  type DimRow,
  type Dimension,
} from "@/lib/traffic/queries";

/**
 * CSV for any Admin → Analytics table, with the same range, timezone and
 * filters as the page (`?table=pages&range=30d&country=US…`). Staff with
 * dashboard access; each export is audited.
 */

const DIM_TABLES: Record<string, { dim: Dimension; name: string; label?: (k: string | null) => string }> = {
  channels: { dim: "channel", name: "channel" },
  referrers: { dim: "referrer", name: "referrer_host" },
  "utm-source": { dim: "utmSource", name: "utm_source" },
  "utm-medium": { dim: "utmMedium", name: "utm_medium" },
  "utm-campaign": { dim: "utmCampaign", name: "utm_campaign" },
  devices: { dim: "device", name: "device" },
  browsers: { dim: "browser", name: "browser" },
  os: { dim: "os", name: "os" },
  languages: { dim: "lang", name: "language", label: (k) => (k ? `${k} (${languageName(k)})` : "") },
  countries: { dim: "country", name: "country", label: (k) => (k ? `${k} (${countryName(k)})` : "") },
  regions: { dim: "region", name: "us_state", label: (k) => (k ? `${k} (${usStateName(k)})` : "") },
};

const pct = (a: number, b: number) => (b > 0 ? ((a / b) * 100).toFixed(2) : "");

function dimCsv(name: string, rows: DimRow[], label: (k: string | null) => string) {
  return toCsv(
    [name, "visitors", "sessions", "pageviews", "signups", "signup_conversion_pct", "paid"],
    rows.map((r) => [label(r.key), r.visitors, r.sessions, r.pageviews, r.signups, pct(r.signups, r.visitors), r.paid]),
  );
}

export async function GET(req: Request) {
  const { staff, error } = await adminApi("view");
  if (error) return error;

  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);
  const table = params.table ?? "";
  const q = parseTrafficQuery(params, Date.now());
  const conv = await conversions(q);
  let csv: string | null = null;

  const dimSpec = DIM_TABLES[table];
  if (dimSpec) {
    csv = dimCsv(dimSpec.name, await breakdown(q, dimSpec.dim, conv, 5000), dimSpec.label ?? ((k) => k ?? ""));
  } else if (table === "dynamics") {
    const points = await series(q, filtered(conv, q));
    csv = toCsv([q.granularity === "hour" ? "hour" : "day", "visitors", "sessions", "pageviews", "signups"], points.map((p) => [p.key, p.visitors, p.sessions, p.pageviews, p.signups]));
  } else if (table === "hours" || table === "weekdays" || table === "heatmap") {
    const grid = await heatmap(q);
    if (table === "hours") csv = toCsv(["hour", "sessions"], Array.from({ length: 24 }, (_, h) => [hourLabel(h), grid.reduce((a, r) => a + r[h], 0)]));
    else if (table === "weekdays") csv = toCsv(["weekday", "sessions"], grid.map((r, d) => [WEEKDAYS[d], r.reduce((a, b) => a + b, 0)]));
    else csv = toCsv(["weekday", ...Array.from({ length: 24 }, (_, h) => hourLabel(h))], grid.map((r, d) => [WEEKDAYS[d], ...r]));
  } else if (table === "funnel") {
    const t = await totals(q, q);
    const steps = await funnel(q, conv, t.visitors);
    csv = toCsv(["step", "count", "conversion_from_previous_pct", "note"], steps.map((s, i) => [s.label, s.n, i ? pct(s.n, steps[i - 1].n) : "", s.hint]));
  } else if (table === "events") {
    csv = toCsv(["event", "count", "users"], (await topEvents(q, 500)).map((e) => [e.name, e.count, e.users]));
  } else if (table === "pages" || table === "entry-pages" || table === "exit-pages") {
    const rows = await pages(q, conv);
    const flat = rows.flatMap((r) => r.children ?? [r]);
    if (table === "pages") {
      csv = toCsv(
        ["page", "group", "views", "unique_visitors", "avg_time_sec", "entries", "exits", "bounce_pct", "signups_started_here", "paid_started_here"],
        rows.flatMap((g) =>
          [g, ...(g.children ?? [])].map((r, i) => [
            r.path,
            g.children ? (i === 0 ? "group total" : g.path) : "",
            r.views,
            r.visitors,
            Math.round(r.avgMs / 1000),
            r.entries,
            r.exits,
            pct(r.bounces, r.entries),
            r.signups,
            r.paid,
          ]),
        ),
      );
    } else {
      const key = table === "entry-pages" ? "entries" : "exits";
      csv = toCsv(
        ["page", key, "views", "unique_visitors", "signups_started_here", "paid_started_here"],
        flat.filter((r) => r[key] > 0).sort((a, b) => b[key] - a[key]).map((r) => [r.path, r[key], r.views, r.visitors, r.signups, r.paid]),
      );
    }
  } else if (table === "new-returning") {
    csv = toCsv(["visitor", "visitors", "sessions", "signups", "paid"], (await visitorTypes(q, conv)).map((t) => [t.returning ? "returning" : "new", t.visitors, t.sessions, t.signups, t.paid]));
  } else if (table === "journeys") {
    const { list } = await journeys(q, { convertedOnly: params.conv === "1", entryPath: params.entry?.slice(0, 300) || null, page: 1, perPage: 2000 });
    csv = toCsv(
      ["started_utc", "entry_page", "exit_page", "pages", "path", "duration_sec", "channel", "referrer", "utm_campaign", "country", "region", "device", "browser", "os", "returning", "signed_up", "paid", "user_id"],
      list.map((j) => [
        j.start.toISOString(),
        j.steps[0]?.path ?? j.entry.path,
        j.steps[j.steps.length - 1]?.path ?? j.entry.path,
        j.steps.length,
        j.steps.map((s) => `${s.path} (${Math.round(s.durationMs / 1000)}s)`).join(" > "),
        Math.round(j.steps.reduce((a, s) => a + s.durationMs, 0) / 1000),
        j.entry.channel,
        j.entry.referrerHost ?? "",
        j.entry.utmCampaign ?? "",
        j.entry.country ?? "",
        j.entry.region ?? "",
        j.entry.device,
        j.entry.browser ?? "",
        j.entry.os ?? "",
        j.entry.isReturning,
        j.signedUp,
        j.paid,
        j.userId ?? "",
      ]),
    );
  }
  if (csv === null) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  await recordAudit({
    actorId: staff.sub,
    action: "analytics.export",
    entity: "PageView",
    diff: { table, from: q.fromDay, to: q.toDay, tz: q.tz, ...(q.country ? { country: q.country } : {}), ...(q.device ? { device: q.device } : {}), ...(q.channel ? { source: q.channel } : {}) },
    ip: getClientIp(req),
  });
  return csvResponse(`launchcv-${table}-${q.fromDay}-to-${q.toDay}.csv`, csv);
}
