/**
 * Win-back email: one email, ever, to a signed-in user who started a checkout
 * or used up their free AI checks and still hasn't paid. It carries a personal,
 * single-use Polar discount code. Run daily by /api/cron/winback; settings in
 * Admin → Discounts → Win-back email (Settings["marketing"]).
 *
 * Nothing is sent while the postal address is empty: US CAN-SPAM requires a
 * physical postal address in commercial email, and we never invent one.
 */

import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSettings, type Settings } from "@/lib/app-settings";
import { getUserPlanId } from "@/lib/plans";
import { staffRoleOf } from "@/lib/admin-guard";
import { trackEvent } from "@/lib/analytics";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { transactionalEmail } from "@/lib/email-layout";
import { unsubscribeUrl } from "@/lib/unsubscribe-token";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, isPublicPlan, type CheckoutPlan, type PlanId } from "@/lib/plan-config";
import type { PolarDiscountBody } from "@/lib/polar-discounts";
import { createPolarDiscount, deletePolarDiscount, listPolarDiscounts, soldPlanProductIds } from "@/lib/polar-discounts-server";

export const WINBACK_SENT_EVENT = "winback_sent";
/** Recorded when the welcome offer is sent (lib/welcome-offer.ts); same meta shape as win-back. */
export const WELCOME_SENT_EVENT = "welcome_offer_sent";
export const CHECKOUT_STARTED_EVENT = "checkout_started";
export const FREE_LIMIT_EVENT = "free_limit_reached";
/** How far back past the delay a trigger event still counts. */
export const WINBACK_LOOKBACK_HOURS = 48;
export const WINBACK_MAX_PER_RUN = 100;
export const COMPANY_NAME = "Elmun Technologies LLC";

export type Marketing = Settings["marketing"];
export type WinbackReason = "checkout" | "free_limit";

export type TriggerEvent = { userId: string; name: string; createdAt: Date; meta: unknown };
export type CandidateUser = {
  id: string;
  email: string;
  role: string;
  emailVerifiedAt: Date | null;
  marketingOptOutAt: Date | null;
  suspendedAt: Date | null;
};
export type WinbackCandidate = { userId: string; email: string; plan: CheckoutPlan; reason: WinbackReason };

const HOUR = 3_600_000;

/** Trigger events count when they happened between `delay + 48h` and `delay` hours before `now` (both ends inclusive). */
export function winbackWindow(now: Date, delayHours: number): { from: Date; to: Date } {
  const to = new Date(now.getTime() - delayHours * HOUR);
  return { from: new Date(to.getTime() - WINBACK_LOOKBACK_HOURS * HOUR), to };
}

function metaPlan(meta: unknown): CheckoutPlan | null {
  const p = meta && typeof meta === "object" ? (meta as { plan?: unknown }).plan : null;
  return typeof p === "string" && isPublicPlan(p) ? p : null;
}

/** Why a user may not get the email (null = eligible as far as the user row and history go). */
export function userIneligibility(user: CandidateUser | undefined, alreadySent: boolean): string | null {
  if (!user) return "no_user";
  if (alreadySent) return "already_sent";
  if (!user.emailVerifiedAt) return "unverified";
  if (user.marketingOptOutAt) return "opted_out";
  if (user.suspendedAt) return "suspended";
  if (staffRoleOf(user)) return "staff";
  return null;
}

/**
 * Pure selection: which users get the email, which plan the button opens and
 * why. A checkout in the window wins over a free-limit event (its latest plan
 * is used); otherwise the Week Pass. Paid access is checked afterwards (async).
 * Ordered by each user's earliest trigger in the window.
 */
export function pickCandidates(args: {
  events: TriggerEvent[];
  users: CandidateUser[];
  alreadySent: Set<string>;
  window: { from: Date; to: Date };
}): WinbackCandidate[] {
  const { from, to } = args.window;
  const usersById = new Map(args.users.map((u) => [u.id, u]));
  const inWindow = args.events
    .filter((e) => e.userId && (e.name === CHECKOUT_STARTED_EVENT || e.name === FREE_LIMIT_EVENT))
    .filter((e) => e.createdAt.getTime() >= from.getTime() && e.createdAt.getTime() <= to.getTime())
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const byUser = new Map<string, TriggerEvent[]>();
  for (const e of inWindow) byUser.set(e.userId, [...(byUser.get(e.userId) ?? []), e]);

  const out: WinbackCandidate[] = [];
  for (const [userId, evs] of byUser) {
    const user = usersById.get(userId);
    if (userIneligibility(user, args.alreadySent.has(userId))) continue;
    const checkouts = evs.filter((e) => e.name === CHECKOUT_STARTED_EVENT);
    const reason: WinbackReason = checkouts.length ? "checkout" : "free_limit";
    const plan = (checkouts.length ? metaPlan(checkouts[checkouts.length - 1].meta) : null) ?? "week";
    out.push({ userId, email: user!.email, plan, reason });
  }
  return out;
}

/** "BACK" + 6 random characters A–Z / 0–9. */
export function randomWinbackCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "BACK";
  for (let i = 0; i < 6; i++) s += chars[crypto.randomInt(chars.length)];
  return s;
}

export const WINBACK_CODE_RE = /^BACK[A-Z0-9]{6}$/;
export const WELCOME_CODE_RE = /^HELLO[A-Z0-9]{6}$/;
/** Any personal code we email (win-back or welcome). */
export const PERSONAL_CODE_RE = /^(BACK|HELLO)[A-Z0-9]{6}$/;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** e.g. "Tuesday, November 10, 2026 at 15:07 UTC". */
export function formatUtc(d: Date): string {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} at ${hh}:${mm} UTC`;
}

export function winbackDiscountBody(args: { userId: string; code: string; percent: number; endsAt: Date; productIds: string[] }): PolarDiscountBody {
  return {
    name: `Win-back ${args.userId}`,
    code: args.code,
    type: "percentage",
    basis_points: args.percent * 100,
    duration: "once",
    max_redemptions: 1,
    ends_at: args.endsAt.toISOString(),
    products: args.productIds,
  };
}

const ET = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

/** e.g. "Tuesday, November 10 at 3:07 PM EST" (US Eastern, where most buyers are). */
export function formatEastern(d: Date): string {
  const parts = Object.fromEntries(ET.formatToParts(d).map((p) => [p.type, p.value]));
  return `${parts.weekday}, ${parts.month} ${parts.day} at ${parts.hour}:${parts.minute} ${parts.dayPeriod} ${parts.timeZoneName}`;
}

/** "$7.20": a plan's price after `percent` off. */
export function discountedPrice(plan: CheckoutPlan, percent: number): string {
  const cents = Math.round(PUBLIC_PLANS[plan].priceAmount * 100 * (1 - percent / 100));
  return `$${(cents / 100).toFixed(2)}`;
}

/** "Week Pass, Pro or 90-Day Pass" from the plans on sale. */
export function soldPlanTitles(): string {
  const t = CHECKOUT_PLAN_ORDER.map((p) => PUBLIC_PLANS[p].title);
  return t.length > 1 ? `${t.slice(0, -1).join(", ")} or ${t[t.length - 1]}` : t.join("");
}

/** The email itself (pure). */
export function winbackEmail(args: {
  percent: number;
  validHours: number;
  code: string;
  endsAt: Date;
  plan: CheckoutPlan;
  reason: WinbackReason;
  checkoutUrl: string;
  unsubscribeUrl: string;
  postalAddress: string;
  siteUrl?: string;
}): { subject: string; html: string; text: string } {
  const planTitle = PUBLIC_PLANS[args.plan].title;
  const price = PUBLIC_PLANS[args.plan].priceDisplay;
  const opener =
    args.reason === "checkout"
      ? `You were one step away from the ${planTitle}. Then life happened. We get it: job hunting is a lot.`
      : "You've used this month's free AI checks. That usually means you're applying seriously, so here's a push to finish strong.";
  const subject =
    args.reason === "checkout"
      ? `Your ${planTitle} is waiting: ${args.percent}% off for ${args.validHours} hours`
      : `Keep going: ${args.percent}% off LaunchCV for ${args.validHours} hours`;
  const { html, text } = transactionalEmail({
    preheader: `A personal code just for you: ${args.percent}% off any plan until ${formatEastern(args.endsAt)}.`,
    hero: "winback",
    eyebrow: `Ends in ${args.validHours} hours`,
    heading: args.reason === "checkout" ? "Still want that interview?" : "Don't stop at the free limit",
    paragraphs: [
      opener,
      `So here's ${args.percent}% off, just for you. The ${planTitle} drops from ${price} to ${discountedPrice(args.plan, args.percent)}. The button below opens checkout with your code already applied.`,
    ],
    offer: {
      label: "Your personal code",
      headline: `${args.percent}% off`,
      sub: `${soldPlanTitles()} · one use`,
      code: args.code,
      expires: `Ends ${formatEastern(args.endsAt)}`,
    },
    bullets: [
      "Match your resume to any job post and see the missing keywords",
      "Rewrite weak bullets into results recruiters notice",
      "A cover letter and application packet in minutes",
    ],
    cta: { label: `Claim my ${args.percent}% off`, url: args.checkoutUrl },
    after: ["Good luck out there. You've got this.", "The LaunchCV team"],
    footnote:
      args.reason === "checkout"
        ? "You're getting this because you started a checkout on LaunchCV. We send at most one email like this."
        : "You're getting this because you reached the free plan's AI limit on LaunchCV. We send at most one email like this.",
    footer: { lines: [COMPANY_NAME, args.postalAddress || "(Postal address not set)"], unsubscribeUrl: args.unsubscribeUrl },
    siteUrl: args.siteUrl,
  });
  return { subject, html, text };
}

export function listUnsubscribeHeaders(url: string): Record<string, string> {
  return { "List-Unsubscribe": `<${url}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
}

/* ── Run ── */

export type WinbackDeps = {
  marketing(): Promise<Marketing>;
  findTriggerEvents(from: Date, to: Date): Promise<TriggerEvent[]>;
  findUsers(ids: string[]): Promise<CandidateUser[]>;
  findAlreadySent(ids: string[]): Promise<Set<string>>;
  /** Users whose welcome code is still valid at `now`: they already hold an offer, so no win-back yet. */
  findActiveWelcome?(ids: string[], now: Date): Promise<Set<string>>;
  planOf(userId: string): Promise<PlanId>;
  productIds(): Promise<string[]>;
  createDiscount(body: PolarDiscountBody): Promise<{ ok: true; id: string } | { ok: false; error: string }>;
  deleteDiscount(id: string): Promise<void>;
  sendEmail(args: { to: string; subject: string; html: string; text: string; headers: Record<string, string> }): Promise<{ ok: true } | { ok: false; error: string }>;
  recordSent(userId: string, meta: WinbackSentMeta): Promise<void>;
  baseUrl(): string;
  unsubscribeUrl(userId: string): string;
  randomCode(): string;
  /** Wall clock, for the time budget only. */
  clock(): number;
};

export type WinbackSentMeta = {
  code: string;
  discountId: string;
  plan: CheckoutPlan;
  reason: WinbackReason;
  percent: number;
  endsAt: string;
};

export type WinbackResult =
  | { skipped: "disabled" | "no_postal_address" | "no_products" }
  | { candidates: number; attempted: number; sent: number; failed: number; paid: number; deferred: number; errors: string[] };

export const defaultWinbackDeps: WinbackDeps = {
  marketing: async () => (await getSettings()).marketing,
  findTriggerEvents: (from, to) =>
    prisma.analyticsEvent
      .findMany({
        where: { name: { in: [CHECKOUT_STARTED_EVENT, FREE_LIMIT_EVENT] }, userId: { not: null }, createdAt: { gte: from, lte: to } },
        select: { userId: true, name: true, createdAt: true, meta: true },
        orderBy: { createdAt: "asc" },
        take: 5000,
      })
      .then((rows) => rows.map((r) => ({ ...r, userId: r.userId as string }))),
  findUsers: (ids) =>
    prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, email: true, role: true, emailVerifiedAt: true, marketingOptOutAt: true, suspendedAt: true },
    }),
  findAlreadySent: async (ids) => {
    const rows = await prisma.analyticsEvent.findMany({ where: { name: WINBACK_SENT_EVENT, userId: { in: ids } }, select: { userId: true } });
    return new Set(rows.map((r) => r.userId).filter((x): x is string => !!x));
  },
  findActiveWelcome: async (ids, now) => {
    const rows = await prisma.analyticsEvent.findMany({ where: { name: WELCOME_SENT_EVENT, userId: { in: ids } }, select: { userId: true, meta: true } });
    const out = new Set<string>();
    for (const r of rows) {
      const end = r.meta && typeof r.meta === "object" ? (r.meta as { endsAt?: unknown }).endsAt : null;
      if (r.userId && typeof end === "string" && new Date(end).getTime() > now.getTime()) out.add(r.userId);
    }
    return out;
  },
  planOf: (userId) => getUserPlanId(userId),
  productIds: async () => Object.values(await soldPlanProductIds()).filter((x): x is string => !!x),
  createDiscount: async (body) => {
    const r = await createPolarDiscount(body);
    return r.ok ? { ok: true, id: r.data.id } : { ok: false, error: r.error };
  },
  deleteDiscount: async (id) => {
    await deletePolarDiscount(id).catch(() => null);
  },
  sendEmail: (args) => sendTransactionalEmail(args).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "send failed" })),
  recordSent: (userId, meta) => trackEvent(WINBACK_SENT_EVENT, { userId, meta }),
  baseUrl: () => appBaseUrl(),
  unsubscribeUrl: (userId) => unsubscribeUrl(appBaseUrl(), userId),
  randomCode: randomWinbackCode,
  clock: () => Date.now(),
};

/** Leave room inside the cron's maxDuration; anyone left over is still in the window tomorrow. */
const TIME_BUDGET_MS = 45_000;
const CONCURRENCY = 4;

export async function runWinback(now: Date = new Date(), deps: WinbackDeps = defaultWinbackDeps): Promise<WinbackResult> {
  const m = await deps.marketing();
  if (!m.winbackEnabled) return { skipped: "disabled" };
  if (!m.postalAddress.trim()) return { skipped: "no_postal_address" };

  const window = winbackWindow(now, m.winbackDelayHours);
  const events = await deps.findTriggerEvents(window.from, window.to);
  const ids = [...new Set(events.map((e) => e.userId).filter(Boolean))];
  if (!ids.length) return { candidates: 0, attempted: 0, sent: 0, failed: 0, paid: 0, deferred: 0, errors: [] };
  const [users, alreadySent] = await Promise.all([deps.findUsers(ids), deps.findAlreadySent(ids)]);
  const activeWelcome = deps.findActiveWelcome ? await deps.findActiveWelcome(ids, now) : new Set<string>();
  // Someone still holding a valid welcome code isn't sent a second offer; once it lapses unused, they can be.
  const candidates = pickCandidates({ events, users, alreadySent, window }).filter((c) => !activeWelcome.has(c.userId));

  const productIds = candidates.length ? await deps.productIds() : [];
  if (candidates.length && !productIds.length) return { skipped: "no_products" };

  const started = deps.clock();
  const errors: string[] = [];
  let attempted = 0;
  let sent = 0;
  let failed = 0;
  let paid = 0;
  let deferred = 0;

  async function one(c: WinbackCandidate) {
    // Paid access now (subscription, pass or staff grant): no discount email.
    if ((await deps.planOf(c.userId)) !== "none") {
      paid += 1;
      return;
    }
    if (attempted >= WINBACK_MAX_PER_RUN) {
      deferred += 1;
      return;
    }
    attempted += 1;
    const code = deps.randomCode();
    const endsAt = new Date(now.getTime() + m.winbackValidHours * HOUR);
    const discount = await deps.createDiscount(winbackDiscountBody({ userId: c.userId, code, percent: m.winbackPercent, endsAt, productIds }));
    if (!discount.ok) {
      failed += 1;
      errors.push(`polar: ${discount.error}`.slice(0, 200));
      return;
    }
    const email = winbackEmail({
      percent: m.winbackPercent,
      validHours: m.winbackValidHours,
      code,
      endsAt,
      plan: c.plan,
      reason: c.reason,
      checkoutUrl: `${deps.baseUrl()}/checkout/${c.plan}?code=${code}`,
      unsubscribeUrl: deps.unsubscribeUrl(c.userId),
      postalAddress: m.postalAddress,
      siteUrl: deps.baseUrl(),
    });
    const r = await deps.sendEmail({ to: c.email, ...email, headers: listUnsubscribeHeaders(deps.unsubscribeUrl(c.userId)) });
    if (!r.ok) {
      // Nothing recorded, so a later run retries; the unused code is removed from Polar.
      await deps.deleteDiscount(discount.id);
      failed += 1;
      errors.push(`email: ${r.error}`.slice(0, 200));
      return;
    }
    await deps.recordSent(c.userId, { code, discountId: discount.id, plan: c.plan, reason: c.reason, percent: m.winbackPercent, endsAt: endsAt.toISOString() });
    sent += 1;
  }

  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    if (attempted >= WINBACK_MAX_PER_RUN || deps.clock() - started > TIME_BUDGET_MS) {
      deferred += candidates.length - i;
      break;
    }
    await Promise.all(candidates.slice(i, i + CONCURRENCY).map(one));
  }

  return { candidates: candidates.length, attempted, sent, failed, paid, deferred, errors: errors.slice(0, 10) };
}

/* ── Checkout: the caller's own, unexpired code ── */

export type WinbackOffer = { code: string; discountId: string; percent: number; endsAt: Date; plan: CheckoutPlan | null };

export function parseWinbackOffer(meta: unknown, code: string, now: Date): WinbackOffer | null {
  if (!meta || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  if (m.code !== code || typeof m.discountId !== "string" || !m.discountId) return null;
  const endsAt = typeof m.endsAt === "string" ? new Date(m.endsAt) : null;
  if (!endsAt || Number.isNaN(endsAt.getTime()) || endsAt.getTime() <= now.getTime()) return null;
  const percent = typeof m.percent === "number" && Number.isFinite(m.percent) ? m.percent : 0;
  return { code, discountId: m.discountId, percent, endsAt, plan: metaPlan(m) };
}

/** The personal offer (win-back or welcome) sent to this user with this code, if it hasn't expired. */
export async function findWinbackOffer(userId: string, rawCode: string | null | undefined, now = new Date()): Promise<WinbackOffer | null> {
  const code = (rawCode ?? "").trim().toUpperCase();
  if (!PERSONAL_CODE_RE.test(code)) return null;
  const name = WELCOME_CODE_RE.test(code) ? WELCOME_SENT_EVENT : WINBACK_SENT_EVENT;
  const ev = await prisma.analyticsEvent
    .findFirst({ where: { userId, name, meta: { path: ["code"], equals: code } }, orderBy: { createdAt: "desc" }, select: { meta: true } })
    .catch(() => null);
  return ev ? parseWinbackOffer(ev.meta, code, now) : null;
}

/* ── Admin ── */

/** Emails sent, and how many codes from the last 90 days were redeemed (null when Polar can't be read). */
export function winbackStats(now = new Date()) {
  return personalCodeStats(WINBACK_SENT_EVENT, "Win-back", now);
}

/** The same counts for any personal-code email (event name, Polar discount name prefix). */
export async function personalCodeStats(event: string, polarName: string, now = new Date()): Promise<{ sent: number; recent: number; redeemed: number | null }> {
  const since = new Date(now.getTime() - 90 * 24 * HOUR);
  const [sent, recentRows] = await Promise.all([
    prisma.analyticsEvent.count({ where: { name: event } }),
    prisma.analyticsEvent.findMany({ where: { name: event, createdAt: { gte: since } }, select: { meta: true } }),
  ]);
  const ids = new Set(
    recentRows
      .map((r) => (r.meta && typeof r.meta === "object" ? (r.meta as { discountId?: unknown }).discountId : null))
      .filter((x): x is string => typeof x === "string"),
  );
  if (!ids.size) return { sent, recent: 0, redeemed: 0 };
  const list = await listPolarDiscounts(polarName);
  if (!list.ok) return { sent, recent: ids.size, redeemed: null };
  const redeemed = list.data.filter((d) => ids.has(d.id) && d.redemptions_count > 0).length;
  return { sent, recent: ids.size, redeemed };
}

/** "Send test to me": the real email with a dummy code; no Polar discount, nothing recorded. */
export async function sendWinbackTest(args: { to: string; userId: string; marketing: Marketing; now?: Date }) {
  const now = args.now ?? new Date();
  const m = args.marketing;
  const code = "BACKTEST01";
  const unsub = unsubscribeUrl(appBaseUrl(), args.userId);
  const email = winbackEmail({
    percent: m.winbackPercent,
    validHours: m.winbackValidHours,
    code,
    endsAt: new Date(now.getTime() + m.winbackValidHours * HOUR),
    plan: "week",
    reason: "checkout",
    checkoutUrl: `${appBaseUrl()}/checkout/week?code=${code}`,
    unsubscribeUrl: unsub,
    postalAddress: m.postalAddress,
    siteUrl: appBaseUrl(),
  });
  return sendTransactionalEmail({ to: args.to, ...email, subject: `[Test] ${email.subject}`, headers: listUnsubscribeHeaders(unsub) });
}
