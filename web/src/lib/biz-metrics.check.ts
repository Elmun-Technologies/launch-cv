/**
 * Self-checks for lib/biz-metrics.ts (Admin → Revenue / Product math).
 * Pure functions only; nothing touches the database.
 * Run: npx tsx src/lib/biz-metrics.check.ts
 */
import {
  DAY_MS,
  activePassesAt,
  arppu,
  arrFromMrr,
  bucketKeys,
  churnByMonth,
  delta,
  firstPurchaseByUser,
  fmtUsd,
  funnelStats,
  grossMarginPct,
  median,
  monthKeys,
  mrrAt,
  normalizePurchase,
  parseRange,
  passIntervals,
  passRenewals,
  retentionMatrix,
  summarizeRevenue,
  timeToPurchaseHistogram,
  unitEconomics,
  weekStart,
  type FunnelUser,
  type RecurringSub,
} from "@/lib/biz-metrics";

const failures: string[] = [];
let count = 0;
function expect(ok: boolean, what: string) {
  count += 1;
  if (!ok) failures.push(what);
}
const near = (a: number | null, b: number) => a !== null && Math.abs(a - b) < 1e-6;

const NOW = new Date("2026-11-08T15:07:00Z").getTime();
const d = (s: string) => new Date(s);
const daysAgo = (n: number) => new Date(NOW - n * DAY_MS);

/* ── Ranges ── */
{
  const r = parseRange({ range: "30d" }, NOW, null);
  expect(r.toKey === "2026-11-08" && r.fromKey === "2026-10-10", "30d covers today and the 29 days before");
  expect(r.prevTo!.getTime() === r.from.getTime() && r.prevFrom!.getTime() === r.from.getTime() - 30 * DAY_MS, "previous period is the same length right before");
  expect(r.bucket === "day", "30d is bucketed by day");
  expect(parseRange({ range: "12m" }, NOW, null).bucket === "week", "12m is bucketed by week");
  const all = parseRange({ range: "all" }, NOW, d("2026-01-15T10:00:00Z"));
  expect(all.fromKey === "2026-01-15" && all.prevFrom === null, "all time starts at the first record and has no previous period");
  const c = parseRange({ range: "custom", from: "2026-10-31", to: "2026-10-01" }, NOW, null);
  expect(c.fromKey === "2026-10-01" && c.toKey === "2026-10-31" && c.days === 31, "custom range swaps reversed dates, both ends inclusive");
  expect(parseRange({ range: "custom", from: "2026-02-30", to: "x" }, NOW, null).preset === "30d", "invalid custom dates fall back to 30 days");
  expect(parseRange({ range: "bogus" }, NOW, null).preset === "30d", "unknown preset falls back to 30 days");
  expect(weekStart(d("2026-11-08T12:00:00Z")).toISOString().startsWith("2026-11-02"), "weeks start on Monday (UTC)");
  expect(bucketKeys(d("2026-11-01T00:00:00Z"), d("2026-11-08T00:00:00Z"), "day").length === 7, "7 day buckets in a week");
  expect(monthKeys(d("2026-09-15T00:00:00Z"), d("2026-11-02T00:00:00Z")).join() === "2026-09,2026-10,2026-11", "month keys overlap the range");
}

/* ── Deltas ── */
{
  expect(delta(120, 100).text === "+20% vs previous period" && delta(120, 100).tone === "up", "growth is +20% and good");
  expect(delta(80, 100).tone === "down", "a drop is bad");
  expect(delta(80, 100, false).tone === "up", "a drop in discounts is good");
  expect(delta(5, 0).pct === null && delta(5, 0).text.startsWith("New"), "no percentage against zero");
  expect(delta(0, 0).text === "No change", "0 vs 0 is no change");
  expect(delta(5, null).tone === "none", "no previous period → no delta");
}

/* ── Purchases ── */
{
  const discounted = normalizePurchase({
    userId: "u1",
    createdAt: daysAgo(1),
    meta: { orderId: "o1", plan: "week", paidCents: 630, listCents: 900, discountCents: 270, discountCode: "backabc123" },
  });
  expect(discounted.plan === "week" && discounted.kind === "pass", "pass plan from the event");
  expect(near(discounted.paidUsd, 6.3) && near(discounted.listUsd, 9) && near(discounted.discountUsd, 2.7), "paid / list / discount from cents");
  expect(discounted.code === "BACKABC123", "discount code upper-cased");

  const old = normalizePurchase({ userId: "u2", createdAt: daysAgo(1), meta: { orderId: "o2", plan: "quarter" } });
  expect(near(old.paidUsd, 69) && old.discountUsd === 0 && !old.amountKnown, "older events fall back to list price, no discount");

  const sub = normalizePurchase({ userId: "u3", createdAt: daysAgo(1), meta: { subscriptionId: "s1", paidCents: 2900 } });
  expect(sub.plan === "professional" && sub.kind === "subscription" && near(sub.listUsd, 29), "subscription payment without a plan is Pro");
  const legacy = normalizePurchase({ userId: "u3", createdAt: daysAgo(1), meta: { subscriptionId: "s9" } }, { planOfSubscription: (id) => (id === "s9" ? "elite" : undefined) });
  expect(legacy.plan === "elite" && near(legacy.paidUsd, 49), "subscription plan from its billing row");
  const subDisc = normalizePurchase({ userId: "u3", createdAt: daysAgo(1), meta: { subscriptionId: "s2", paidCents: 2030 } });
  expect(near(subDisc.discountUsd, 8.7), "discount = list − paid when only the paid amount is known");
  const unknown = normalizePurchase({ userId: null, createdAt: daysAgo(1), meta: null });
  expect(unknown.plan === "none" && unknown.paidUsd === 0, "unknown purchase is worth nothing (never invented)");

  // Summary: u1 new in range (2 purchases), u2 bought before the range too.
  const ps = [
    normalizePurchase({ userId: "u1", createdAt: daysAgo(5), meta: { plan: "week", paidCents: 900, listCents: 900 } }),
    normalizePurchase({ userId: "u1", createdAt: daysAgo(2), meta: { plan: "week", paidCents: 630, listCents: 900, discountCents: 270 } }),
    normalizePurchase({ userId: "u2", createdAt: daysAgo(60), meta: { plan: "week", paidCents: 900 } }),
    normalizePurchase({ userId: "u2", createdAt: daysAgo(3), meta: { plan: "quarter", paidCents: 6900 } }),
  ];
  const first = firstPurchaseByUser(ps);
  const s = summarizeRevenue(ps, daysAgo(30), new Date(NOW + 1), first);
  expect(s.purchases === 3 && s.payingUsers === 2 && s.newCustomers === 1, "3 purchases, 2 payers, 1 new customer");
  expect(near(s.grossUsd, 87) && near(s.discountUsd, 2.7) && near(s.netUsd, 84.3), "gross 87, discounts 2.70, net 84.30");
  expect(near(s.arppu, 42.15), "ARPPU = net / paying users");
  expect(arppu(10, 0) === null, "no ARPPU without payers");
}

/* ── MRR / ARR ── */
{
  const base = { cancelAtPeriodEnd: false, currentPeriodEnd: null, updatedAt: daysAgo(1) };
  const subs: RecurringSub[] = [
    { ...base, plan: "professional", status: "active", startedAt: daysAgo(100) },
    { ...base, plan: "professional", status: "active", startedAt: daysAgo(10) }, // started inside the range
    { ...base, plan: "professional", status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: daysAgo(-5), startedAt: daysAgo(70) },
    { ...base, plan: "professional", status: "past_due", startedAt: daysAgo(90) },
    { ...base, plan: "professional", status: "canceled", currentPeriodEnd: daysAgo(20), startedAt: daysAgo(80) },
    { ...base, plan: "elite", status: "active", startedAt: null },
    { ...base, plan: "week", status: "active", startedAt: daysAgo(3) }, // not monthly: never MRR
  ];
  const now = mrrAt(subs, new Date(NOW), NOW);
  expect(now === 29 + 29 + 49, "MRR now: active, not cancelling, not past due, monthly plans only");
  expect(arrFromMrr(now) === now * 12, "ARR = MRR × 12");
  const past = mrrAt(subs, daysAgo(30), NOW);
  expect(past === 29 + 29 + 29 + 29 + 49, "MRR 30 days ago: everything started and not yet ended");
}

/* ── Passes ── */
{
  const ps = [
    normalizePurchase({ userId: "a", createdAt: daysAgo(10), meta: { plan: "week" } }),
    normalizePurchase({ userId: "a", createdAt: daysAgo(8), meta: { plan: "week" } }), // extends to day −10+14 = +4
    normalizePurchase({ userId: "b", createdAt: daysAgo(100), meta: { plan: "quarter" } }),
    normalizePurchase({ userId: "c", createdAt: daysAgo(2), meta: { plan: "week", applied: false } }),
  ];
  const iv = passIntervals(ps);
  expect(iv.get("a")![1].end.getTime() === daysAgo(10).getTime() + 14 * DAY_MS, "a second pass stacks onto the first");
  expect(activePassesAt(iv, new Date(NOW)) === 1, "one pass running now (b expired, c not applied)");
  expect(activePassesAt(iv, daysAgo(50)) === 1, "b's 90-day pass ran 50 days ago");
}

/* ── Time to first purchase ── */
{
  const h = timeToPurchaseHistogram([30 * 60_000, 2 * 3_600_000, 2 * DAY_MS, 200 * DAY_MS, -5]);
  expect(h[0].count === 2 && h[1].count === 1 && h[2].count === 1 && h[6].count === 1, "histogram buckets (negative clamps to 0)");
  expect(median([5, 1, 3]) === 3 && median([1, 2, 3, 4]) === 2.5 && median([]) === null, "median");
}

/* ── Pass renewals ── */
{
  const from = daysAgo(30);
  const to = new Date(NOW + 1);
  const ps = [
    normalizePurchase({ userId: "x", createdAt: daysAgo(20), meta: { plan: "week" } }),
    normalizePurchase({ userId: "x", createdAt: daysAgo(12), meta: { plan: "week", paidCents: 900 } }),
    normalizePurchase({ userId: "y", createdAt: daysAgo(15), meta: { plan: "week" } }),
    normalizePurchase({ userId: "y", createdAt: daysAgo(5), meta: { subscriptionId: "s", paidCents: 2900 } }),
    normalizePurchase({ userId: "z", createdAt: daysAgo(4), meta: { plan: "quarter" } }),
    normalizePurchase({ userId: "w", createdAt: daysAgo(90), meta: { plan: "week" } }),
    normalizePurchase({ userId: "w", createdAt: daysAgo(3), meta: { plan: "quarter", paidCents: 6900 } }),
  ];
  const r = passRenewals(ps, from, to);
  expect(r.passBuyers === 4, "x, y, z, w bought a pass in range");
  expect(r.boughtAgain === 2 && r.renewedPass === 1 && r.switchedToPro === 1, "x renewed, y switched to Pro, z and w (no later purchase) didn't");
  const ww = r.transitions.find((t) => t.from === "week" && t.to === "week");
  const wq = r.transitions.find((t) => t.from === "week" && t.to === "quarter");
  const wp = r.transitions.find((t) => t.from === "week" && t.to === "professional");
  expect(ww?.purchases === 1 && wq?.purchases === 1 && wp?.purchases === 1 && near(wp!.revenueUsd, 29), "transitions: week→week, week→quarter (w came back), week→Pro");
}

/* ── Churn ── */
{
  const base = { plan: "professional" as const, cancelAtPeriodEnd: false, updatedAt: d("2026-10-20T00:00:00Z") };
  const subs: RecurringSub[] = [
    { ...base, status: "active", currentPeriodEnd: null, startedAt: d("2026-08-01T00:00:00Z") },
    { ...base, status: "canceled", currentPeriodEnd: d("2026-10-12T00:00:00Z"), startedAt: d("2026-08-10T00:00:00Z") },
    { ...base, status: "active", cancelAtPeriodEnd: true, currentPeriodEnd: d("2026-11-20T00:00:00Z"), startedAt: d("2026-09-20T00:00:00Z") },
    { ...base, status: "canceled", currentPeriodEnd: d("2026-11-03T00:00:00Z"), startedAt: d("2026-10-03T00:00:00Z") },
  ];
  const c = churnByMonth(subs, ["2026-10", "2026-11"], NOW);
  expect(c[0].activeAtStart === 3 && c[0].churned === 1 && near(c[0].ratePct, 33.33), "October: 3 running at start, 1 churned");
  expect(c[1].activeAtStart === 3 && c[1].churned === 1 && c[1].scheduled === 1, "November: 1 ended so far, 1 scheduled");
}

/* ── Cohorts ── */
{
  const rows = retentionMatrix(
    [
      { cohort: "2026-10-26", size: 10 },
      { cohort: "2026-11-02", size: 4 },
    ],
    [
      { cohort: "2026-10-26", week: 0, users: 10 },
      { cohort: "2026-10-26", week: 1, users: 3 },
      { cohort: "2026-11-02", week: 0, users: 4 },
    ],
    NOW,
  );
  expect(rows[0].pct[0] === 100 && rows[0].pct[1] === 30 && rows[0].pct[2] === null, "week 1 = 30%, week 2 not started");
  expect(rows[1].pct[0] === 100 && rows[1].pct[1] === null, "this week's cohort only has week 0");
  expect(rows[0].users[1] === 3, "user counts kept next to %");
}

/* ── Funnel ── */
{
  const t = (h: number) => new Date(NOW - 100 * 3_600_000 + h * 3_600_000);
  const u = (o: Partial<FunnelUser>): FunnelUser => ({ signup: t(0), verified: null, resume: null, ai: null, limit: null, checkout: null, paid: null, ...o });
  const f = funnelStats([
    u({ verified: t(1), resume: t(2), ai: t(4), limit: t(10), checkout: t(11), paid: t(12) }),
    u({ verified: t(1), resume: t(3), ai: t(5), checkout: t(30), paid: t(31) }),
    u({ verified: t(2) }),
    u({ resume: t(1), ai: t(2), checkout: t(3), paid: t(4) }), // never verified: drops out after sign-up
    u({}),
  ]);
  expect(f[0].users === 5 && f[1].users === 3 && f[2].users === 2 && f[3].users === 2, "ordered funnel: each step needs the required steps before it");
  expect(f[1].pctOfPrev === 60 && f[2].pctOfFirst === 40, "step % vs previous step and vs sign-ups");
  expect(f[1].medianFromPrevMs === 3_600_000, "median sign-up → verified = 1 h (gaps 1 h, 1 h, 2 h)");
  expect(f[4].optional && f[4].users === 1 && f[4].baseKey === "ai" && f[4].pctOfPrev === 50, "free limit is optional and measured against AI users");
  expect(f[5].users === 2 && f[5].baseKey === "ai" && f[5].pctOfPrev === 100, "checkout doesn't require the free limit; % is vs AI users");
  expect(f[5].medianFromPrevMs === 16 * 3_600_000, "checkout median from first AI use (7 h and 25 h)");
  expect(f[6].users === 2 && f[6].medianFromPrevMs === 3_600_000, "checkout → paid");
  expect(f.every((s) => s.pctOfPrev === null || s.pctOfPrev <= 100), "no step exceeds 100% of its base");
}

/* ── Margin / unit economics ── */
{
  expect(grossMarginPct(100, 12.5) === 87.5, "margin 87.5%");
  expect(grossMarginPct(0, 3) === null, "no margin without revenue");
  expect(grossMarginPct(10, 15) === -50, "negative margin when AI costs more than revenue");
  const plans: Record<string, "professional" | "week" | "none"> = { a: "professional", b: "professional", c: "week", d: "none" };
  const ue = unitEconomics(
    [
      { userId: "a", costMicros: 2_000_000, calls: 20 },
      { userId: "b", costMicros: 1_000_000, calls: 10 },
      { userId: "c", costMicros: 500_000, calls: 5 },
      { userId: "d", costMicros: 250_000, calls: 2 },
    ],
    (id) => plans[id] ?? "none",
    new Map([
      ["professional", 58],
      ["week", 9],
    ]),
  );
  const pro = ue.find((r) => r.plan === "professional")!;
  expect(pro.aiUsers === 2 && near(pro.costUsd, 3) && near(pro.costPerUser, 1.5) && near(pro.marginPct, 94.8), "Pro: $3 cost on $58 → 94.8% margin");
  const free = ue[ue.length - 1];
  expect(free.plan === "none" && near(free.costUsd, 0.25) && free.marginPct === null, "Free last, cost only");
}

expect(fmtUsd(1234.5) === "$1,235" && fmtUsd(29.5) === "$29.50" && fmtUsd(29) === "$29", "USD formatting");

if (failures.length) {
  console.error(`biz-metrics: ${failures.length} of ${count} checks failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`biz-metrics: all ${count} checks passed`);
