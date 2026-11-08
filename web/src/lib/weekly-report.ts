import { prisma } from "@/lib/prisma";
import { loadRevenue } from "@/lib/admin-revenue";
import { loadProduct } from "@/lib/admin-product";
import { configProblems } from "@/lib/admin-config-problems";
import { DAY_MS, dayKey, fmtUsd, grossMarginPct, parseRange, round2, utcMidnight } from "@/lib/biz-metrics";
import { breakdown, conversions, funnel, pages, totals } from "@/lib/traffic/queries";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { WINBACK_SENT_EVENT } from "@/lib/winback";
import { transactionalEmail, type EmailRow, type EmailSection } from "@/lib/email-layout";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { emailConfigured, ownerEmails } from "@/lib/owner-notify";
import { redactString } from "@/lib/redact";

/**
 * Weekly email report to owners (cron/weekly-report, Mondays; Admin →
 * Settings → "Send me this week's report now").
 *
 * The last 7 complete UTC days next to the 7 before them. Every number comes
 * from the loaders behind the admin pages (Analytics, Revenue, Product), with
 * the same definitions, so the email and the panel agree.
 */

/** AppSetting row with the cron's last run (not a settings group); its own 6-day guard, separate from win-back's. */
export const WEEKLY_REPORT_LAST_RUN_KEY = "weeklyReportLastRun";

export type Pair = { cur: number; prev: number };
export type NullablePair = { cur: number | null; prev: number | null };

export type WeeklyReport = {
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
  traffic: { visitors: Pair; sessions: Pair; signups: Pair; signupConversionPct: NullablePair };
  revenue: { purchases: Pair; netUsd: Pair; mrr: Pair; activePasses: Pair; listPricedPurchases: number };
  ai: { spendUsd: Pair; marginPct: NullablePair };
  topPages: { path: string; visitors: number }[];
  topSources: { source: string; visitors: number }[];
  funnel: { label: string; cur: number; prev: number }[];
  winback: { sent: Pair; redeemed: Pair };
  problems: string[];
};

/** The 7 complete UTC days before today, and the 7 before those. */
export function weeklyWindow(now: Date): { from: Date; to: Date; prevFrom: Date; prevTo: Date } {
  const to = utcMidnight(now);
  const from = new Date(to.getTime() - 7 * DAY_MS);
  return { from, to, prevFrom: new Date(from.getTime() - 7 * DAY_MS), prevTo: from };
}

const pctOf = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : null);

export async function loadWeeklyReport(now: Date): Promise<WeeklyReport> {
  const w = weeklyWindow(now);
  const nowMs = now.getTime();
  const lastDay = (to: Date) => dayKey(new Date(to.getTime() - DAY_MS));

  // Same range objects the admin pages build from ?range=custom&from=…&to=… (UTC).
  const bizCur = parseRange({ range: "custom", from: dayKey(w.from), to: lastDay(w.to) }, nowMs, null);
  const bizPrev = parseRange({ range: "custom", from: dayKey(w.prevFrom), to: lastDay(w.prevTo) }, nowMs, null);
  const qCur = parseTrafficQuery({ range: "custom", from: dayKey(w.from), to: lastDay(w.to), tz: "utc" }, nowMs);
  const qPrev = parseTrafficQuery({ range: "custom", from: dayKey(w.prevFrom), to: lastDay(w.prevTo), tz: "utc" }, nowMs);
  const noFilter = { country: null, device: null, channel: null };

  const [tCur, tPrev, convCur, convPrev, revenue, revenuePrev, productCur, productPrev, sentCur, sentPrev, problems] = await Promise.all([
    totals(qCur, noFilter),
    totals(qPrev, noFilter),
    conversions(qCur),
    conversions(qPrev),
    loadRevenue(bizCur, nowMs),
    loadRevenue(bizPrev, nowMs),
    loadProduct(bizCur, nowMs),
    loadProduct(bizPrev, nowMs),
    prisma.analyticsEvent.count({ where: { name: WINBACK_SENT_EVENT, createdAt: { gte: w.from, lt: w.to } } }),
    prisma.analyticsEvent.count({ where: { name: WINBACK_SENT_EVENT, createdAt: { gte: w.prevFrom, lt: w.prevTo } } }),
    configProblems(),
  ]);
  const [funnelCur, funnelPrev, pageRows, sourceRows] = await Promise.all([
    funnel(qCur, convCur, tCur.visitors),
    funnel(qPrev, convPrev, tPrev.visitors),
    pages(qCur, convCur),
    breakdown(qCur, "channel", convCur, 5),
  ]);

  const step = (steps: typeof funnelCur, id: string) => steps.find((s) => s.id === id)?.n ?? 0;
  const signups = { cur: step(funnelCur, "signup"), prev: step(funnelPrev, "signup") };
  const net = { cur: revenue.kpis.cur.netUsd, prev: revenuePrev.kpis.cur.netUsd };
  const spend = { cur: round2(productCur.totalCostUsd), prev: round2(productPrev.totalCostUsd) };
  const redeemed = (r: typeof revenue) => r.codes.filter((c) => c.winback).reduce((a, c) => a + c.uses, 0);

  return {
    ...w,
    traffic: {
      visitors: { cur: tCur.visitors, prev: tPrev.visitors },
      sessions: { cur: tCur.sessions, prev: tPrev.sessions },
      signups,
      signupConversionPct: { cur: pctOf(signups.cur, tCur.visitors), prev: pctOf(signups.prev, tPrev.visitors) },
    },
    revenue: {
      purchases: { cur: revenue.kpis.cur.purchases, prev: revenuePrev.kpis.cur.purchases },
      netUsd: net,
      // MRR and passes are point-in-time: at the end of each week.
      mrr: { cur: revenue.kpis.cur.mrr, prev: revenuePrev.kpis.cur.mrr },
      activePasses: { cur: revenue.kpis.cur.activePasses, prev: revenuePrev.kpis.cur.activePasses },
      listPricedPurchases: revenue.listPricedPurchases,
    },
    ai: {
      spendUsd: spend,
      marginPct: { cur: grossMarginPct(net.cur, spend.cur), prev: grossMarginPct(net.prev, spend.prev) },
    },
    topPages: [...pageRows]
      .sort((a, b) => b.visitors - a.visitors || b.views - a.views)
      .slice(0, 5)
      .map((p) => ({ path: p.path, visitors: p.visitors })),
    topSources: sourceRows.slice(0, 5).map((s) => ({ source: s.key ?? "Unknown", visitors: s.visitors })),
    funnel: ["visit", "signup", "paid"].map((id) => ({
      label: funnelCur.find((s) => s.id === id)?.label ?? id,
      cur: step(funnelCur, id),
      prev: step(funnelPrev, id),
    })),
    winback: { sent: { cur: sentCur, prev: sentPrev }, redeemed: { cur: redeemed(revenue), prev: redeemed(revenuePrev) } },
    problems,
  };
}

/* ───────────────────────── Rendering ───────────────────────── */

const DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const DATE_Y = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** "Nov 2 – Nov 8, 2026" for [from, to). */
export function weekLabel(from: Date, to: Date): string {
  return `${DATE.format(from)} – ${DATE_Y.format(new Date(to.getTime() - DAY_MS))}`;
}

const int = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) => (n === null ? "—" : `${n.toFixed(1).replace(/\.0$/, "")}%`);

/** "+12% vs 120", "new (was 0)", "no change", for counts and money. */
export function changeNote(cur: number, prev: number, fmt: (n: number) => string, goodWhenUp = true): Pick<EmailRow, "note" | "tone"> {
  if (prev === 0) {
    if (cur === 0) return { note: "no change", tone: "neutral" };
    return { note: "new (was 0)", tone: goodWhenUp ? "good" : "bad" };
  }
  const change = Math.round(((cur - prev) / Math.abs(prev)) * 100);
  if (change === 0) return { note: `±0% vs ${fmt(prev)}`, tone: "neutral" };
  const up = change > 0;
  return { note: `${up ? "+" : "−"}${Math.abs(change)}% vs ${fmt(prev)}`, tone: up === goodWhenUp ? "good" : "bad" };
}

/** Percent values change in points: "+1.2 pts vs 3.4%". */
export function pointsNote(cur: number | null, prev: number | null): Pick<EmailRow, "note" | "tone"> {
  if (cur === null || prev === null) return { note: prev === null ? "no data before" : `was ${pct(prev)}`, tone: "neutral" };
  const d = Math.round((cur - prev) * 10) / 10;
  if (d === 0) return { note: `no change`, tone: "neutral" };
  return { note: `${d > 0 ? "+" : "−"}${Math.abs(d)} pts vs ${pct(prev)}`, tone: d > 0 ? "good" : "bad" };
}

export function renderWeeklyReport(r: WeeklyReport, baseUrl: string): { subject: string; html: string; text: string } {
  const label = weekLabel(r.from, r.to);
  const usd = (n: number) => fmtUsd(n);
  const row = (l: string, p: Pair, fmt: (n: number) => string, goodWhenUp = true): EmailRow => ({ label: l, value: fmt(p.cur), ...changeNote(p.cur, p.prev, fmt, goodWhenUp) });

  const sections: EmailSection[] = [
    {
      title: "Traffic",
      rows: [
        row("Visitors", r.traffic.visitors, int),
        row("Sessions", r.traffic.sessions, int),
        row("Sign-ups", r.traffic.signups, int),
        { label: "Sign-up conversion", value: pct(r.traffic.signupConversionPct.cur), ...pointsNote(r.traffic.signupConversionPct.cur, r.traffic.signupConversionPct.prev) },
      ],
    },
    {
      title: "Money",
      rows: [
        row("Purchases", r.revenue.purchases, int),
        row("Net revenue", r.revenue.netUsd, usd),
        row("MRR (end of week)", r.revenue.mrr, usd),
        row("Active passes (end of week)", r.revenue.activePasses, int),
      ],
    },
    {
      title: "AI cost",
      rows: [
        row("AI spend", r.ai.spendUsd, (n) => (n > 0 && n < 1 ? `$${n.toFixed(2)}` : usd(n)), false),
        {
          label: "Margin after AI",
          value: r.ai.marginPct.cur === null ? "— (no revenue)" : pct(r.ai.marginPct.cur),
          ...pointsNote(r.ai.marginPct.cur, r.ai.marginPct.prev),
        },
      ],
    },
    {
      title: "Funnel: visit → sign-up → paid",
      // Same steps as Admin → Analytics: "Paid" counts this week's sign-ups who have paid.
      rows: r.funnel.map((s, i) => ({
        label: i === 2 ? `${s.label} (of these sign-ups)` : s.label,
        value: int(s.cur),
        note: i === 0 ? `was ${int(s.prev)}` : `${pct(pctOf(s.cur, r.funnel[i - 1].cur))} of ${i === 1 ? "visitors" : "sign-ups"} · was ${int(s.prev)}`,
        tone: "neutral" as const,
      })),
    },
    {
      title: "Top pages by visitors",
      rows: r.topPages.map((p) => ({ label: p.path, value: int(p.visitors) })),
      empty: "No page views recorded this week.",
    },
    {
      title: "Top sources by visitors",
      rows: r.topSources.map((s) => ({ label: s.source, value: int(s.visitors) })),
      empty: "No page views recorded this week.",
    },
    {
      title: "Win-back emails",
      rows: [row("Sent", r.winback.sent, int), row("Redeemed (purchases with a win-back code)", r.winback.redeemed, int)],
    },
    {
      title: "Config problems",
      rows: r.problems.map((p) => ({ label: p, value: "" })),
      empty: "None found.",
    },
  ];

  const paragraphs = [
    `Here are last week's numbers (${label}, UTC), each next to the week before.`,
    ...(r.revenue.listPricedPurchases > 0
      ? [`${r.revenue.listPricedPurchases} purchase${r.revenue.listPricedPurchases === 1 ? " has" : "s have"} no recorded amount and ${r.revenue.listPricedPurchases === 1 ? "is" : "are"} counted at list price.`]
      : []),
    ...(r.problems.length ? [`${r.problems.length} setting${r.problems.length === 1 ? " needs" : "s need"} attention — see the end of this email.`] : []),
  ];

  const { html, text } = transactionalEmail({
    preheader: `${int(r.traffic.visitors.cur)} visitors · ${int(r.traffic.signups.cur)} sign-ups · ${usd(r.revenue.netUsd.cur)} net revenue`,
    heading: `Your week: ${label}`,
    paragraphs,
    sections,
    cta: { label: "Open the admin overview", url: `${baseUrl}/admin-panel` },
    footnote:
      "Sent to LaunchCV owners every Monday. Definitions match Admin → Analytics, Revenue and Product. Turn it off in Admin → Settings → Weekly report.",
  });
  return { subject: `LaunchCV weekly report: ${label}`, html, text };
}

/* ───────────────────────── Sending ───────────────────────── */

export type SendResult = { sent: number; recipients: number; skipped?: string; error?: string };

/** Load, render and send to each address. Skips (and logs) when Resend isn't configured. */
export async function sendWeeklyReport(args: { to: string[] | "owners"; now?: Date }): Promise<SendResult> {
  const now = args.now ?? new Date();
  if (!(await emailConfigured())) {
    console.warn("[weekly-report] Resend isn't configured (Admin → Integrations); report not sent");
    return { sent: 0, recipients: 0, skipped: "email not configured" };
  }
  const to = args.to === "owners" ? await ownerEmails() : args.to;
  if (!to.length) {
    console.warn("[weekly-report] no owner email; report not sent");
    return { sent: 0, recipients: 0, skipped: "no owner email" };
  }
  const report = await loadWeeklyReport(now);
  const mail = renderWeeklyReport(report, appBaseUrl());
  let sent = 0;
  let error = "";
  for (const addr of to) {
    const r = await sendTransactionalEmail({ to: addr, subject: mail.subject, html: mail.html, text: mail.text }).catch((e: unknown) => ({
      ok: false as const,
      error: e instanceof Error ? e.message : "send failed",
    }));
    if (r.ok) sent++;
    else error = redactString(r.error).slice(0, 200);
  }
  return { sent, recipients: to.length, ...(error ? { error } : {}) };
}
