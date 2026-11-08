/**
 * Welcome offer: once a new account's email is confirmed (or right away for a
 * Google sign-up), send one email with a personal, single-use Polar code, e.g.
 * 20% off any plan for 48 hours. Settings in Admin → Discounts → Welcome offer
 * (Settings["marketing"].welcome*).
 *
 * Only confirmed addresses get a code, so bots can't farm them. Like win-back,
 * nothing is sent while the postal address is empty (US CAN-SPAM). The checkout
 * applies the code through the same lookup as win-back (findWinbackOffer).
 */

import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/app-settings";
import { getUserPlanId } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";
import { appBaseUrl, sendTransactionalEmail } from "@/lib/email";
import { transactionalEmail } from "@/lib/email-layout";
import { unsubscribeUrl } from "@/lib/unsubscribe-token";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { createPolarDiscount, deletePolarDiscount, soldPlanProductIds } from "@/lib/polar-discounts-server";
import {
  COMPANY_NAME,
  WELCOME_SENT_EVENT,
  discountedPrice,
  formatEastern,
  listUnsubscribeHeaders,
  personalCodeStats,
  soldPlanTitles,
  userIneligibility,
} from "@/lib/winback";

const HOUR = 3_600_000;
/** The button opens the cheapest plan; the code works on every plan on sale. */
const PLAN = "week" as const;

/** "HELLO" + 6 random characters A–Z / 0–9. */
export function randomWelcomeCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "HELLO";
  for (let i = 0; i < 6; i++) s += chars[crypto.randomInt(chars.length)];
  return s;
}

/** The email itself (pure). */
export function welcomeOfferEmail(args: {
  percent: number;
  validHours: number;
  code: string;
  endsAt: Date;
  checkoutUrl: string;
  unsubscribeUrl: string;
  postalAddress: string;
  siteUrl?: string;
}): { subject: string; html: string; text: string } {
  const week = PUBLIC_PLANS[PLAN];
  const { html, text } = transactionalEmail({
    preheader: `Your personal code takes ${args.percent}% off any plan until ${formatEastern(args.endsAt)}.`,
    hero: "welcome",
    eyebrow: "Welcome to LaunchCV",
    heading: `You're in. Here's ${args.percent}% off, just for you.`,
    paragraphs: [
      "Your email is confirmed and your account is ready. Your free plan already includes a monthly ATS check and a few AI checks to try things out.",
      `When you're ready to apply seriously, this code takes ${args.percent}% off any plan. The ${week.title} goes from ${week.priceDisplay} to ${discountedPrice(PLAN, args.percent)}. It's yours for the next ${args.validHours} hours, then it's gone.`,
    ],
    offer: {
      label: "Your welcome offer",
      headline: `${args.percent}% off`,
      sub: `${soldPlanTitles()} · one use · just for you`,
      code: args.code,
      expires: `Ends ${formatEastern(args.endsAt)}`,
    },
    bullets: [
      "See exactly which keywords a job post wants that your resume is missing",
      "Turn duties into results with AI bullet rewrites",
      "Get a tailored cover letter and application packet in minutes",
      "Every template and AI tool, no auto-renewal on passes",
    ],
    cta: { label: `Claim my ${args.percent}% off`, url: args.checkoutUrl },
    after: ["Not ready yet? Start free: import your current resume and run the ATS check. The code waits until it ends.", "The LaunchCV team"],
    footnote: "You're getting this because you just created a LaunchCV account. It's a one-time welcome offer.",
    footer: { lines: [COMPANY_NAME, args.postalAddress || "(Postal address not set)"], unsubscribeUrl: args.unsubscribeUrl },
    siteUrl: args.siteUrl,
  });
  return { subject: `Welcome! ${args.percent}% off LaunchCV, for ${args.validHours} hours only`, html, text };
}

export type WelcomeResult =
  | { sent: true; code: string }
  | { sent: false; reason: "disabled" | "no_postal_address" | "checkout_paused" | "no_products" | "paid" | "polar_failed" | "email_failed" | string };

/**
 * Send the welcome offer to one user if they qualify. Idempotent: a user who
 * already got one is skipped. Never throws (callers run it after the response).
 */
export async function sendWelcomeOffer(userId: string, now: Date = new Date()): Promise<WelcomeResult> {
  try {
    const settings = await getSettings();
    const m = settings.marketing;
    if (!m.welcomeEnabled) return { sent: false, reason: "disabled" };
    if (!m.postalAddress.trim()) return { sent: false, reason: "no_postal_address" };
    if (!settings.switches.checkout) return { sent: false, reason: "checkout_paused" };

    const [user, already] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, emailVerifiedAt: true, marketingOptOutAt: true, suspendedAt: true },
      }),
      prisma.analyticsEvent.count({ where: { userId, name: WELCOME_SENT_EVENT } }),
    ]);
    const why = userIneligibility(user ?? undefined, already > 0);
    if (why || !user) return { sent: false, reason: why ?? "no_user" };
    if ((await getUserPlanId(userId)) !== "none") return { sent: false, reason: "paid" };

    const productIds = Object.values(await soldPlanProductIds()).filter((x): x is string => !!x);
    if (!productIds.length) return { sent: false, reason: "no_products" };

    const code = randomWelcomeCode();
    const endsAt = new Date(now.getTime() + m.welcomeValidHours * HOUR);
    const discount = await createPolarDiscount({
      name: `Welcome ${userId}`,
      code,
      type: "percentage",
      basis_points: m.welcomePercent * 100,
      duration: "once",
      max_redemptions: 1,
      ends_at: endsAt.toISOString(),
      products: productIds,
    });
    if (!discount.ok) {
      await trackEvent("welcome_offer_failed", { userId, meta: { step: "polar", error: discount.error.slice(0, 200) } });
      return { sent: false, reason: "polar_failed" };
    }

    const base = appBaseUrl();
    const unsub = unsubscribeUrl(base, userId);
    const email = welcomeOfferEmail({
      percent: m.welcomePercent,
      validHours: m.welcomeValidHours,
      code,
      endsAt,
      checkoutUrl: `${base}/checkout/${PLAN}?code=${code}`,
      unsubscribeUrl: unsub,
      postalAddress: m.postalAddress,
      siteUrl: base,
    });
    const r = await sendTransactionalEmail({ to: user.email, ...email, headers: listUnsubscribeHeaders(unsub) }).catch((e: unknown) => ({
      ok: false as const,
      error: e instanceof Error ? e.message : "send failed",
    }));
    if (!r.ok) {
      await deletePolarDiscount(discount.data.id).catch(() => null);
      await trackEvent("welcome_offer_failed", { userId, meta: { step: "email", error: r.error.slice(0, 200) } });
      return { sent: false, reason: "email_failed" };
    }
    await trackEvent(WELCOME_SENT_EVENT, {
      userId,
      meta: { code, discountId: discount.data.id, plan: PLAN, reason: "welcome", percent: m.welcomePercent, endsAt: endsAt.toISOString() },
    });
    return { sent: true, code };
  } catch (e) {
    return { sent: false, reason: e instanceof Error ? e.message.slice(0, 120) : "error" };
  }
}

/** "Send test to me": the real email with a dummy code; no Polar discount, nothing recorded. */
export async function sendWelcomeTest(args: { to: string; userId: string; now?: Date }) {
  const now = args.now ?? new Date();
  const m = (await getSettings()).marketing;
  const base = appBaseUrl();
  const code = "HELLOTEST1";
  const unsub = unsubscribeUrl(base, args.userId);
  const email = welcomeOfferEmail({
    percent: m.welcomePercent,
    validHours: m.welcomeValidHours,
    code,
    endsAt: new Date(now.getTime() + m.welcomeValidHours * HOUR),
    checkoutUrl: `${base}/checkout/${PLAN}?code=${code}`,
    unsubscribeUrl: unsub,
    postalAddress: m.postalAddress,
    siteUrl: base,
  });
  return sendTransactionalEmail({ to: args.to, ...email, subject: `[Test] ${email.subject}`, headers: listUnsubscribeHeaders(unsub) });
}

export function welcomeStats(now = new Date()) {
  return personalCodeStats(WELCOME_SENT_EVENT, "Welcome", now);
}
