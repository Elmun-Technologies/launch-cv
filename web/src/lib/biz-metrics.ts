/**
 * Pure business-metric math for Admin → Revenue and Admin → Product: date
 * ranges, purchase normalization, MRR / ARPPU / passes, renewals, churn,
 * cohort retention, funnel steps and margins. No server imports, so every
 * function here is unit-checked in biz-metrics.check.ts.
 *
 * Money is USD. Times are UTC.
 */

import { PASS_DAYS, PLAN_PRICE_USD, isPassPlan, type CheckoutPlan, type PlanId } from "@/lib/plan-config";

export const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

/* ───────────────────────── Date ranges ───────────────────────── */

export const RANGE_PRESETS = [
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
  { id: "90d", label: "90 days", days: 90 },
  { id: "12m", label: "12 months", days: 365 },
  { id: "all", label: "All time", days: null },
] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number]["id"] | "custom";
export type Bucket = "day" | "week";

export type BizRange = {
  preset: RangePreset;
  /** Inclusive start (UTC midnight). */
  from: Date;
  /** Exclusive end (UTC midnight after the last day). */
  to: Date;
  /** The same-length period right before, for deltas. Null for "all time". */
  prevFrom: Date | null;
  prevTo: Date | null;
  bucket: Bucket;
  /** "Last 30 days", "Oct 1 – Oct 31, 2026", "All time". */
  label: string;
  /** YYYY-MM-DD of the first and last day (both inclusive), for forms and links. */
  fromKey: string;
  toKey: string;
  days: number;
};

/** Longest custom range accepted (keeps every query bounded). */
export const MAX_RANGE_DAYS = 3 * 366;

export function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function utcMidnight(t: number | Date): Date {
  const d = new Date(t);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function parseDay(s: string | undefined | null): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || dayKey(d) !== s ? null : d;
}

const LABEL_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/**
 * Resolve `?range=30d` or `?range=custom&from=YYYY-MM-DD&to=YYYY-MM-DD` into a
 * bounded UTC range. Presets end today (inclusive). "All time" starts at
 * `allFrom` (the first sign-up or purchase). Unknown input → last 30 days.
 */
export function parseRange(
  sp: { range?: string | null; from?: string | null; to?: string | null },
  now: number,
  allFrom: Date | null,
): BizRange {
  const end = new Date(utcMidnight(now).getTime() + DAY_MS);
  const make = (preset: RangePreset, from: Date, to: Date, label: string, withPrev = true): BizRange => {
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY_MS));
    const prevTo = withPrev ? from : null;
    const prevFrom = withPrev ? new Date(from.getTime() - days * DAY_MS) : null;
    return {
      preset,
      from,
      to,
      prevFrom,
      prevTo,
      bucket: days <= 120 ? "day" : "week",
      label,
      fromKey: dayKey(from),
      toKey: dayKey(new Date(to.getTime() - DAY_MS)),
      days,
    };
  };
  if (sp.range === "custom") {
    let a = parseDay(sp.from);
    let b = parseDay(sp.to);
    if (a && b) {
      if (a > b) [a, b] = [b, a];
      const to = new Date(b.getTime() + DAY_MS);
      const from = to.getTime() - a.getTime() > MAX_RANGE_DAYS * DAY_MS ? new Date(to.getTime() - MAX_RANGE_DAYS * DAY_MS) : a;
      return make("custom", from, to, `${LABEL_FMT.format(from)} – ${LABEL_FMT.format(b)}`);
    }
  }
  if (sp.range === "all") {
    const first = utcMidnight(allFrom && allFrom.getTime() < end.getTime() ? allFrom : now);
    const from = end.getTime() - first.getTime() > 20 * 365 * DAY_MS ? new Date(end.getTime() - 20 * 365 * DAY_MS) : first;
    return make("all", from, end, "All time", false);
  }
  const preset = RANGE_PRESETS.find((p) => p.id === sp.range && p.days !== null) ?? RANGE_PRESETS[1];
  const days = preset.days ?? 30;
  return make(preset.id, new Date(end.getTime() - days * DAY_MS), end, `Last ${preset.label.toLowerCase()}`);
}

/** Query string for a range (keeps custom dates), e.g. "range=custom&from=…&to=…". */
export function rangeQuery(r: Pick<BizRange, "preset" | "fromKey" | "toKey">): string {
  if (r.preset === "custom") return `range=custom&from=${r.fromKey}&to=${r.toKey}`;
  return `range=${r.preset}`;
}

/** Monday 00:00 UTC of the week containing `d`. */
export function weekStart(d: Date): Date {
  const m = utcMidnight(d);
  const dow = (m.getUTCDay() + 6) % 7; // Monday = 0
  return new Date(m.getTime() - dow * DAY_MS);
}

export function bucketKey(d: Date, bucket: Bucket): string {
  return dayKey(bucket === "day" ? utcMidnight(d) : weekStart(d));
}

/** Every bucket key from `from` up to (not including) `to`, zeros included. */
export function bucketKeys(from: Date, to: Date, bucket: Bucket): string[] {
  const out: string[] = [];
  const step = bucket === "day" ? DAY_MS : 7 * DAY_MS;
  for (let t = (bucket === "day" ? utcMidnight(from) : weekStart(from)).getTime(); t < to.getTime(); t += step) out.push(dayKey(new Date(t)));
  return out;
}

/** "YYYY-MM" keys of every month that overlaps [from, to). */
export function monthKeys(from: Date, to: Date): string[] {
  const out: string[] = [];
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth();
  while (Date.UTC(y, m, 1) < to.getTime()) {
    out.push(`${y}-${String(m + 1).padStart(2, "0")}`);
    m += 1;
    if (m === 12) {
      m = 0;
      y += 1;
    }
  }
  return out;
}

export function monthBounds(key: string): { start: Date; end: Date } {
  const [y, m] = key.split("-").map(Number);
  return { start: new Date(Date.UTC(y, m - 1, 1)), end: new Date(Date.UTC(y, m, 1)) };
}

/* ───────────────────────── Deltas ───────────────────────── */

export type Delta = { pct: number | null; text: string; tone: "up" | "down" | "flat" | "none" };

/**
 * Change versus the previous period. `prev` null = no previous period (all
 * time). A previous value of 0 has no percentage: "new" when something
 * appeared, "no change" when both are 0. `goodWhenUp` false flips the tone
 * (e.g. discounts, refunds).
 */
export function delta(cur: number, prev: number | null, goodWhenUp = true): Delta {
  if (prev === null || !Number.isFinite(prev)) return { pct: null, text: "No previous period", tone: "none" };
  if (prev === 0) {
    if (cur === 0) return { pct: 0, text: "No change", tone: "flat" };
    return { pct: null, text: "New vs previous period", tone: goodWhenUp ? "up" : "down" };
  }
  const pct = ((cur - prev) / Math.abs(prev)) * 100;
  const rounded = Math.round(pct);
  if (rounded === 0) return { pct, text: "±0% vs previous period", tone: "flat" };
  const up = rounded > 0;
  return {
    pct,
    text: `${up ? "+" : "−"}${Math.abs(rounded)}% vs previous period`,
    tone: up === goodWhenUp ? "up" : "down",
  };
}

/* ───────────────────────── Purchases ───────────────────────── */

export type RawPurchase = { userId: string | null; createdAt: Date; meta: unknown };

export type PurchaseKind = "pass" | "subscription" | "lifetime" | "unknown";

export type Purchase = {
  userId: string | null;
  at: Date;
  /** "none" = the plan couldn't be resolved (shown as "Unknown plan"). */
  plan: PlanId;
  kind: PurchaseKind;
  /** List price of what was bought. */
  listUsd: number;
  /** What was actually paid (after discounts, before tax). */
  paidUsd: number;
  discountUsd: number;
  /** True when the event recorded the amount (newer events); else list price is assumed. */
  amountKnown: boolean;
  code: string | null;
  subscriptionId: string | null;
  orderId: string | null;
  /** False when a pass was paid but didn't change access (meta.applied === false). */
  applied: boolean;
};

const PLAN_IDS = new Set<string>(Object.keys(PLAN_PRICE_USD));
const isCheckoutPlan = (p: unknown): p is CheckoutPlan => typeof p === "string" && PLAN_IDS.has(p);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export function kindOfPlan(plan: PlanId): PurchaseKind {
  if (plan === "none") return "unknown";
  if (isPassPlan(plan)) return "pass";
  if (plan === "lifetime") return "lifetime";
  return "subscription";
}

/** Monthly plans (recurring, billed every month): Pro and legacy Starter / Elite. */
export function isMonthlyPlan(plan: PlanId): boolean {
  return plan === "professional" || plan === "starter" || plan === "elite";
}

/**
 * One `pay_success` event → a purchase. Plan: the event's own `plan`, else the
 * plan of the billing row its `subscriptionId` points to, else Pro for any
 * other subscription payment (Pro is the only monthly plan sold), else the
 * buyer's current billing plan. Paid: `paidCents`, else list price. Discount:
 * `discountCents`, else list − paid when the paid amount is known.
 */
export function normalizePurchase(
  e: RawPurchase,
  ctx: { planOfSubscription?: (id: string) => PlanId | undefined; planOfUser?: (userId: string) => PlanId | undefined } = {},
): Purchase {
  const m = (e.meta && typeof e.meta === "object" ? e.meta : {}) as Record<string, unknown>;
  const subscriptionId = str(m.subscriptionId);
  const orderId = str(m.orderId);
  let plan: PlanId = "none";
  if (isCheckoutPlan(m.plan)) plan = m.plan;
  else if (subscriptionId) plan = ctx.planOfSubscription?.(subscriptionId) ?? "professional";
  else if (e.userId) plan = ctx.planOfUser?.(e.userId) ?? "none";
  const paidCents = num(m.paidCents);
  const listCents = num(m.listCents);
  const discountCents = num(m.discountCents);
  const planList = plan === "none" ? null : PLAN_PRICE_USD[plan];
  const paidUsd = paidCents !== null ? paidCents / 100 : (planList ?? 0);
  const listUsd = listCents !== null ? listCents / 100 : (planList ?? paidUsd);
  const discountUsd = discountCents !== null ? discountCents / 100 : paidCents !== null ? Math.max(0, listUsd - paidUsd) : 0;
  return {
    userId: e.userId,
    at: e.createdAt,
    plan,
    kind: kindOfPlan(plan),
    listUsd,
    paidUsd,
    discountUsd,
    amountKnown: paidCents !== null,
    code: str(m.discountCode)?.toUpperCase() ?? null,
    subscriptionId,
    orderId,
    applied: m.applied !== false,
  };
}

export const inRange = (d: Date, from: Date | null, to: Date | null) =>
  (!from || d.getTime() >= from.getTime()) && (!to || d.getTime() < to.getTime());

/** First purchase time per user, from a user's full purchase history. */
export function firstPurchaseByUser(purchases: Purchase[]): Map<string, Date> {
  const out = new Map<string, Date>();
  for (const p of purchases) {
    if (!p.userId) continue;
    const cur = out.get(p.userId);
    if (!cur || p.at < cur) out.set(p.userId, p.at);
  }
  return out;
}

export type RevenueSummary = {
  grossUsd: number;
  discountUsd: number;
  netUsd: number;
  purchases: number;
  payingUsers: number;
  newCustomers: number;
  /** Net revenue / paying users; null with no paying users. */
  arppu: number | null;
};

/** Revenue KPIs for purchases in [from, to). `firstPurchase` must cover each buyer's whole history. */
export function summarizeRevenue(purchases: Purchase[], from: Date, to: Date, firstPurchase: Map<string, Date>): RevenueSummary {
  let grossUsd = 0;
  let discountUsd = 0;
  let netUsd = 0;
  let count = 0;
  const payers = new Set<string>();
  const fresh = new Set<string>();
  for (const p of purchases) {
    if (!inRange(p.at, from, to)) continue;
    count += 1;
    grossUsd += p.listUsd;
    discountUsd += p.discountUsd;
    netUsd += p.paidUsd;
    if (p.userId) {
      payers.add(p.userId);
      const first = firstPurchase.get(p.userId);
      if (first && inRange(first, from, to)) fresh.add(p.userId);
    }
  }
  return {
    grossUsd: round2(grossUsd),
    discountUsd: round2(discountUsd),
    netUsd: round2(netUsd),
    purchases: count,
    payingUsers: payers.size,
    newCustomers: fresh.size,
    arppu: arppu(netUsd, payers.size),
  };
}

/** Average revenue per paying user. */
export function arppu(netUsd: number, payingUsers: number): number | null {
  return payingUsers > 0 ? round2(netUsd / payingUsers) : null;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ───────────────────────── MRR / ARR ───────────────────────── */

export type RecurringSub = {
  plan: PlanId;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  updatedAt: Date;
  /** First recorded payment of this subscription; null when none was recorded. */
  startedAt: Date | null;
};

const RENEWING_NOW = new Set(["active", "trialing", "on_trial"]);
const STILL_RUNNING = new Set(["active", "trialing", "on_trial", "past_due"]);

/** When a subscription stopped (or will stop) being paid for; null = still renewing. */
export function subscriptionEnd(s: RecurringSub): Date | null {
  const st = s.status.toLowerCase();
  if (STILL_RUNNING.has(st)) return s.cancelAtPeriodEnd ? s.currentPeriodEnd : null;
  return s.currentPeriodEnd ?? s.updatedAt;
}

/**
 * Whether a monthly subscription counts toward MRR at time `t`.
 * Now (t ≥ now): the same rule as Admin → Subscriptions — active or trialing,
 * not cancelling, not past due. In the past: it had started (first recorded
 * payment, unknown start = counted) and hadn't ended yet.
 */
export function renewingAt(s: RecurringSub, t: Date, now: number): boolean {
  if (!isMonthlyPlan(s.plan)) return false;
  if (t.getTime() >= now) return RENEWING_NOW.has(s.status.toLowerCase()) && !s.cancelAtPeriodEnd;
  if (s.startedAt && s.startedAt.getTime() > t.getTime()) return false;
  const end = subscriptionEnd(s);
  return !end || end.getTime() > t.getTime();
}

/** Monthly recurring revenue at `t`, at list price (passes and Lifetime are one-time, never MRR). */
export function mrrAt(subs: RecurringSub[], t: Date, now: number): number {
  return subs.reduce((a, s) => a + (renewingAt(s, t, now) ? PLAN_PRICE_USD[s.plan as CheckoutPlan] : 0), 0);
}

export const arrFromMrr = (mrr: number) => mrr * 12;

/* ───────────────────────── Passes ───────────────────────── */

export type Interval = { start: Date; end: Date };

/**
 * Access windows from a user's pass purchases, stacked the way checkout does it
 * (passPeriodEnd): a pass bought while another runs extends it from its end.
 */
export function passIntervals(purchases: Purchase[]): Map<string, Interval[]> {
  const byUser = new Map<string, Purchase[]>();
  for (const p of purchases) {
    if (!p.userId || p.kind !== "pass" || !p.applied) continue;
    const list = byUser.get(p.userId) ?? [];
    list.push(p);
    byUser.set(p.userId, list);
  }
  const out = new Map<string, Interval[]>();
  for (const [userId, list] of byUser) {
    list.sort((a, b) => a.at.getTime() - b.at.getTime());
    let curEnd: Date | null = null;
    const intervals: Interval[] = [];
    for (const p of list) {
      const days = PASS_DAYS[p.plan as keyof typeof PASS_DAYS];
      const base: Date = curEnd && curEnd > p.at ? curEnd : p.at;
      const end = new Date(base.getTime() + days * DAY_MS);
      intervals.push({ start: p.at, end });
      curEnd = end;
    }
    out.set(userId, intervals);
  }
  return out;
}

/** Users with a pass running at `t`. */
export function activePassesAt(intervals: Map<string, Interval[]>, t: Date): number {
  let n = 0;
  for (const list of intervals.values()) if (list.some((i) => i.start <= t && t < i.end)) n += 1;
  return n;
}

/* ───────────────────────── Sign-up → first purchase ───────────────────────── */

export const TTP_BUCKETS = [
  { label: "Under 1 hour", maxMs: HOUR_MS },
  { label: "1–24 hours", maxMs: 24 * HOUR_MS },
  { label: "1–3 days", maxMs: 3 * DAY_MS },
  { label: "3–7 days", maxMs: 7 * DAY_MS },
  { label: "1–4 weeks", maxMs: 30 * DAY_MS },
  { label: "1–3 months", maxMs: 90 * DAY_MS },
  { label: "3+ months", maxMs: Infinity },
] as const;

export function timeToPurchaseHistogram(deltasMs: number[]): { label: string; count: number }[] {
  const counts: number[] = TTP_BUCKETS.map(() => 0);
  for (const d of deltasMs) {
    const i = TTP_BUCKETS.findIndex((b) => Math.max(0, d) < b.maxMs);
    counts[i === -1 ? TTP_BUCKETS.length - 1 : i] += 1;
  }
  return TTP_BUCKETS.map((b, i) => ({ label: b.label, count: counts[i] }));
}

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** "45 min", "5.2 hours", "3.1 days". */
export function fmtDuration(ms: number | null): string {
  if (ms === null) return "—";
  if (ms < HOUR_MS) return `${Math.max(1, Math.round(ms / 60_000))} min`;
  if (ms < 2 * DAY_MS) return `${(ms / HOUR_MS).toFixed(1)} hours`;
  return `${(ms / DAY_MS).toFixed(1)} days`;
}

/* ───────────────────────── Pass renewals ───────────────────────── */

export type Transition = { from: PlanId; to: PlanId; purchases: number; revenueUsd: number };

export type PassRenewals = {
  /** Users who bought a pass in the range. */
  passBuyers: number;
  /** …of whom bought anything again later (before the range end). */
  boughtAgain: number;
  /** …whose next purchase was another pass. */
  renewedPass: number;
  /** …whose next purchase was a monthly subscription (Pro). */
  switchedToPro: number;
  /** Repeat purchases in the range that followed a pass: previous plan → this plan. */
  transitions: Transition[];
};

/** `history`: every purchase of the buyers concerned, up to the range end. */
export function passRenewals(history: Purchase[], from: Date, to: Date): PassRenewals {
  const byUser = new Map<string, Purchase[]>();
  for (const p of history) {
    if (!p.userId || p.at >= to) continue;
    const l = byUser.get(p.userId) ?? [];
    l.push(p);
    byUser.set(p.userId, l);
  }
  let passBuyers = 0;
  let boughtAgain = 0;
  let renewedPass = 0;
  let switchedToPro = 0;
  const trans = new Map<string, Transition>();
  for (const list of byUser.values()) {
    list.sort((a, b) => a.at.getTime() - b.at.getTime());
    const firstPassIdx = list.findIndex((p) => p.kind === "pass" && inRange(p.at, from, to));
    if (firstPassIdx !== -1) {
      passBuyers += 1;
      const next = list[firstPassIdx + 1];
      if (next) {
        boughtAgain += 1;
        if (next.kind === "pass") renewedPass += 1;
        else if (next.kind === "subscription") switchedToPro += 1;
      }
    }
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const cur = list[i];
      if (prev.kind !== "pass" || !inRange(cur.at, from, to)) continue;
      const k = `${prev.plan}>${cur.plan}`;
      const t = trans.get(k) ?? { from: prev.plan, to: cur.plan, purchases: 0, revenueUsd: 0 };
      t.purchases += 1;
      t.revenueUsd = round2(t.revenueUsd + cur.paidUsd);
      trans.set(k, t);
    }
  }
  return {
    passBuyers,
    boughtAgain,
    renewedPass,
    switchedToPro,
    transitions: [...trans.values()].sort((a, b) => b.purchases - a.purchases),
  };
}

/* ───────────────────────── Pro churn ───────────────────────── */

export type ChurnMonth = {
  month: string;
  /** Monthly subscriptions running at the start of the month. */
  activeAtStart: number;
  /** Subscriptions whose paid period ended this month (cancelled, revoked or unpaid). */
  churned: number;
  /** Cancelled, but still paid until a date later this month. */
  scheduled: number;
  /** churned / activeAtStart, null without a base. */
  ratePct: number | null;
};

export function churnByMonth(subs: RecurringSub[], months: string[], now: number): ChurnMonth[] {
  const monthly = subs.filter((s) => isMonthlyPlan(s.plan));
  return months.map((month) => {
    const { start, end } = monthBounds(month);
    let activeAtStart = 0;
    let churned = 0;
    let scheduled = 0;
    for (const s of monthly) {
      // A past month uses the history rule, even when it is the current month.
      if (start.getTime() <= now && renewingAt(s, start, Number.POSITIVE_INFINITY)) activeAtStart += 1;
      const e = subscriptionEnd(s);
      if (!e || e < start || e >= end) continue;
      if (e.getTime() <= now) churned += 1;
      else scheduled += 1;
    }
    return { month, activeAtStart, churned, scheduled, ratePct: activeAtStart > 0 ? round2((churned / activeAtStart) * 100) : null };
  });
}

/* ───────────────────────── Cohort retention ───────────────────────── */

export type CohortRow = {
  cohort: string;
  size: number;
  /** Week 0…maxWeek: % of the cohort active that week; null = that week hasn't started yet. */
  pct: (number | null)[];
  users: (number | null)[];
};

/**
 * Weekly sign-up cohorts × weeks since sign-up. `active` rows: users of a
 * cohort active in its week `week` (0 = the sign-up week).
 */
export function retentionMatrix(
  sizes: { cohort: string; size: number }[],
  active: { cohort: string; week: number; users: number }[],
  now: number,
  maxWeek = 8,
): CohortRow[] {
  const map = new Map(active.map((a) => [`${a.cohort}|${a.week}`, a.users]));
  return sizes.map(({ cohort, size }) => {
    const start = new Date(`${cohort}T00:00:00Z`).getTime();
    const users: (number | null)[] = [];
    const pct: (number | null)[] = [];
    for (let w = 0; w <= maxWeek; w++) {
      if (start + w * 7 * DAY_MS > now) {
        users.push(null);
        pct.push(null);
        continue;
      }
      const n = map.get(`${cohort}|${w}`) ?? 0;
      users.push(n);
      pct.push(size > 0 ? Math.round((n / size) * 1000) / 10 : null);
    }
    return { cohort, size, pct, users };
  });
}

/* ───────────────────────── Activation funnel ───────────────────────── */

export const FUNNEL_STEPS = [
  { key: "signup", label: "Signed up", optional: false, def: "Accounts created in the range (User.createdAt). Staff accounts are left out." },
  { key: "verified", label: "Email verified", optional: false, def: "User.emailVerifiedAt is set (Google sign-ups are verified on creation)." },
  { key: "resume", label: "First resume", optional: false, def: "Earliest of the user's resumes (Resume.createdAt) or a resume_created event." },
  { key: "ai", label: "First AI tool use", optional: false, def: "Earliest AiCall row for the user (any tool, any outcome)." },
  {
    key: "limit",
    label: "Hit free limit",
    optional: true,
    def: "A free_limit_reached event: a free account was refused for its monthly allowance. Optional: people can pay without hitting it, so later steps don't require it.",
  },
  { key: "checkout", label: "Started checkout", optional: false, def: "A checkout_started event (the user was sent to Polar to pay)." },
  { key: "paid", label: "Paid", optional: false, def: "A pay_success event (first purchase)." },
] as const;
export type FunnelKey = (typeof FUNNEL_STEPS)[number]["key"];
export type FunnelUser = Record<FunnelKey, Date | null>;

export type FunnelStep = {
  key: FunnelKey;
  label: string;
  def: string;
  optional: boolean;
  users: number;
  /** Which step the % and median compare with: the previous required step. */
  baseKey: FunnelKey | null;
  /** % of the base step's users (null for the first step or an empty base). */
  pctOfPrev: number | null;
  /** % of sign-ups. */
  pctOfFirst: number | null;
  /** Median time from the base step, among counted users who did it after the base step. */
  medianFromPrevMs: number | null;
};

/**
 * Ordered funnel over sign-ups in the range: a step counts users who reached it
 * (by now) and every required step before it. "Hit free limit" is optional:
 * it is measured against first AI use, and later steps don't require it.
 */
export function funnelStats(users: FunnelUser[]): FunnelStep[] {
  const first = users.length;
  const required: FunnelKey[] = [];
  let base: { key: FunnelKey; n: number } | null = null;
  return FUNNEL_STEPS.map((s) => {
    const need = [...required, s.key];
    const reached = users.filter((u) => need.every((k) => u[k]));
    const n = reached.length;
    const gaps = base
      ? reached.map((u) => u[s.key]!.getTime() - u[base!.key]!.getTime()).filter((g) => g >= 0)
      : [];
    const step: FunnelStep = {
      key: s.key,
      label: s.label,
      def: s.def,
      optional: s.optional,
      users: n,
      baseKey: base?.key ?? null,
      pctOfPrev: base && base.n ? Math.round((n / base.n) * 1000) / 10 : null,
      pctOfFirst: first ? Math.round((n / first) * 1000) / 10 : null,
      medianFromPrevMs: median(gaps),
    };
    if (!s.optional) {
      required.push(s.key);
      base = { key: s.key, n };
    }
    return step;
  });
}

/* ───────────────────────── Unit economics ───────────────────────── */

/** (revenue − cost) / revenue, in %. Null without revenue. */
export function grossMarginPct(revenueUsd: number, costUsd: number): number | null {
  if (!(revenueUsd > 0)) return null;
  return Math.round(((revenueUsd - costUsd) / revenueUsd) * 1000) / 10;
}

export type PlanEconomics = {
  plan: PlanId;
  /** Users with at least one AI call in the range. */
  aiUsers: number;
  calls: number;
  costUsd: number;
  costPerUser: number | null;
  /** Net purchase revenue in the range, for purchases of this plan. */
  revenueUsd: number;
  marginPct: number | null;
};

/**
 * AI cost grouped by each user's billing plan, next to purchase revenue of the
 * same plan. Users without a billing row are Free ("none").
 */
export function unitEconomics(
  costByUser: { userId: string; costMicros: number; calls: number }[],
  planOfUser: (userId: string) => PlanId,
  revenueByPlan: Map<PlanId, number>,
): PlanEconomics[] {
  const acc = new Map<PlanId, { users: number; calls: number; micros: number }>();
  for (const r of costByUser) {
    const plan = planOfUser(r.userId);
    const a = acc.get(plan) ?? { users: 0, calls: 0, micros: 0 };
    a.users += 1;
    a.calls += r.calls;
    a.micros += r.costMicros;
    acc.set(plan, a);
  }
  const plans = new Set<PlanId>([...acc.keys(), ...revenueByPlan.keys()]);
  return [...plans]
    .map((plan) => {
      const a = acc.get(plan) ?? { users: 0, calls: 0, micros: 0 };
      const costUsd = a.micros / 1_000_000;
      const revenueUsd = round2(revenueByPlan.get(plan) ?? 0);
      return {
        plan,
        aiUsers: a.users,
        calls: a.calls,
        costUsd,
        costPerUser: a.users > 0 ? costUsd / a.users : null,
        revenueUsd,
        marginPct: plan === "none" ? null : grossMarginPct(revenueUsd, costUsd),
      };
    })
    .sort((a, b) => (a.plan === "none" ? 1 : b.plan === "none" ? -1 : b.revenueUsd - a.revenueUsd));
}

/* ───────────────────────── Formatting ───────────────────────── */

/** "$1,234", "$29.50", "$0.42". */
export function fmtUsd(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  const neg = n < 0;
  const a = Math.abs(n);
  const s = a >= 1000 || Number.isInteger(a) ? a.toLocaleString("en-US", { maximumFractionDigits: 0 }) : a.toFixed(2);
  return `${neg ? "−" : ""}$${s}`;
}

/** AI costs are often fractions of a cent: "$0.0042". */
export function fmtCost(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  if (n === 0) return "$0";
  if (n < 0.01) return `$${n.toFixed(4)}`;
  if (n < 100) return `$${n.toFixed(2)}`;
  return fmtUsd(n);
}

export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return `${n.toFixed(digits).replace(/\.0+$/, "")}%`;
}
