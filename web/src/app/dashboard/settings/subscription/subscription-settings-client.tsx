"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  CreditCard,
  Check,
  Sparkles,
  Crown,
  HelpCircle,
  Receipt,
  ExternalLink,
  Zap,
} from "lucide-react";
import { PUBLIC_PLANS, planMarketingBullets } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { trackCheckoutStart, trackCtaClick, trackPlanSelected, getGaClientId } from "@/lib/analytics-client";

type StatusPayload = {
  pro: boolean;
  paid?: boolean;
  plan?: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

/** Polar customer portal — set NEXT_PUBLIC_POLAR_PORTAL_URL to your org portal URL. */
const PORTAL_URL = process.env.NEXT_PUBLIC_POLAR_PORTAL_URL || "https://polar.sh/purchases";

const PLAN_ICONS: Record<CheckoutPlan, typeof Sparkles> = {
  starter: Sparkles,
  professional: Crown,
  elite: Zap,
  lifetime: Crown,
};

function planLabel(p: string | null | undefined): string {
  if (!p || p === "none") return "No active plan";
  const key = p as CheckoutPlan;
  if (PUBLIC_PLANS[key]) return PUBLIC_PLANS[key].title;
  return p;
}

async function fetchStatus(): Promise<StatusPayload | null> {
  const r = await fetch("/api/subscription/status", { cache: "no-store" });
  const j = (await r.json().catch(() => ({}))) as Partial<StatusPayload>;
  if (!r.ok) return null;
  return {
    pro: !!j.pro,
    paid: j.paid ?? j.pro,
    plan: j.plan ?? null,
    status: j.status ?? null,
    currentPeriodEnd: j.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: !!j.cancelAtPeriodEnd,
  };
}

const isPaid = (s: StatusPayload | null) => s?.paid === true || s?.pro === true;

export function SubscriptionSettingsClient() {
  const [loadingPlan, setLoadingPlan] = useState<CheckoutPlan | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  /** "waiting" while the payment webhook catches up after a successful checkout. */
  const [returned, setReturned] = useState<"waiting" | "confirmed" | "slow" | null>(null);
  const autoStarted = useRef(false);

  useEffect(() => {
    let c = true;
    const qs = new URLSearchParams(window.location.search);
    const fromCheckout = qs.get("checkout") === "success";
    (async () => {
      try {
        let s = await fetchStatus();
        if (c) setStatus(s);
        if (fromCheckout) {
          if (c) setReturned(isPaid(s) ? "confirmed" : "waiting");
          // The webhook usually lands within a few seconds; poll briefly so the
          // buyer doesn't see "No active plan" right after paying.
          for (let i = 0; i < 10 && c && !isPaid(s); i++) {
            await new Promise((res) => setTimeout(res, 3000));
            s = await fetchStatus();
            if (c) setStatus(s);
          }
          if (c) setReturned(isPaid(s) ? "confirmed" : "slow");
        }
      } finally {
        if (c) setStatusLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  const paid = isPaid(status);
  const currentPlan = (status?.plan as CheckoutPlan | "none" | undefined) ?? "none";

  // Pricing and paywall CTAs link here with ?plan=<plan>: open that checkout
  // straight away instead of making the visitor pick the plan a second time.
  useEffect(() => {
    if (statusLoading || paid || autoStarted.current) return;
    const plan = new URLSearchParams(window.location.search).get("plan") as CheckoutPlan | null;
    if (plan && CHECKOUT_PLAN_ORDER.includes(plan)) {
      autoStarted.current = true;
      void startCheckout(plan);
    }
  }, [statusLoading, paid]);

  async function startCheckout(plan: CheckoutPlan) {
    // CTA click on a "Choose <plan>" button, and the funnel's plan-selection step.
    trackCtaClick({ cta: "choose_plan", plan, location: "subscription_settings" });
    trackPlanSelected(plan, { location: "subscription_settings" });
    setLoadingPlan(plan);
    setCheckoutError(null);
    const res = await fetch("/api/polar/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Pass the GA client id so the webhook-driven purchase event stitches
      // back to this browser's GA4 session.
      body: JSON.stringify({ plan, gaClientId: getGaClientId() }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setLoadingPlan(null);
    if (res?.ok && j.url) {
      // Polar checkout is opening — fire before the redirect leaves the page.
      trackCheckoutStart(plan);
      window.location.href = j.url as string;
      return;
    }
    if (res?.status === 409 && typeof j.error === "string") setCheckoutError(j.error);
    else if (res && res.status >= 500)
      setCheckoutError("Checkout isn't available right now. Please try again in a few minutes or contact support.");
    else setCheckoutError(typeof j.error === "string" ? j.error : "Couldn't open checkout. Please try again.");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">Subscription</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          LaunchCV is a paid product — pick a plan that matches your search intensity. Upgrade anytime; Lifetime is a
          one-time purchase.
        </p>
      </div>

      {returned ? (
        <div
          role="status"
          className={`rounded-2xl border p-5 ${
            returned === "slow" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <p className="text-[14px] font-bold text-gray-900">
            {returned === "confirmed"
              ? "Payment received — you're all set."
              : returned === "waiting"
                ? "Payment received. Activating your plan…"
                : "Payment received. Your plan is still activating."}
          </p>
          <p className="mt-1 text-[13px] text-gray-700">
            {returned === "confirmed" ? (
              <>
                Every AI tool is unlocked.{" "}
                <Link href="/dashboard/resumes" className="font-semibold text-[#2563EB] hover:underline">
                  Go to my resumes
                </Link>
              </>
            ) : returned === "waiting" ? (
              "This usually takes a few seconds."
            ) : (
              "Refresh this page in a minute. If it still shows no plan, contact support and we'll sort it out."
            )}
          </p>
        </div>
      ) : null}

      {checkoutError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-[14px] font-bold text-red-900">{checkoutError}</p>
          <p className="mt-1 text-[13px] text-red-800">
            <a href={PORTAL_URL} target="_blank" rel="noreferrer" className="font-semibold underline">
              Open billing portal
            </a>{" "}
            ·{" "}
            <Link href="/dashboard/support" className="font-semibold underline">
              Contact support
            </Link>
          </p>
        </div>
      ) : null}

      {!statusLoading && !paid && !returned ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <p className="text-[14px] font-bold text-amber-950">No active plan</p>
          <p className="mt-1 text-[13px] leading-relaxed text-amber-900/90">
            AI features stay locked until checkout completes. Choose Starter, Professional, or Lifetime below.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13px] font-medium text-gray-500">Current plan:</span>
        {statusLoading ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
              paid ? "bg-blue-100 text-[#5B3FD9]" : "bg-gray-100 text-gray-700"
            }`}
          >
            {paid ? <Crown className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            {planLabel(status?.plan ?? null)}
          </span>
        )}
      </div>

      {paid && status?.currentPeriodEnd && currentPlan !== "lifetime" ? (
        <p className="text-[13px] text-gray-500">
          {status.cancelAtPeriodEnd ? "Access until " : "Renews "}
          <span className="font-semibold text-gray-800">
            {new Date(status.currentPeriodEnd).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          . Manage billing in your{" "}
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#2563EB] underline-offset-2 hover:underline"
          >
            Polar customer portal
            <ExternalLink className="mb-0.5 ml-0.5 inline h-3 w-3" />
          </a>
          .
        </p>
      ) : null}

      {paid && currentPlan === "lifetime" ? (
        <p className="text-[13px] text-gray-500">
          You are on <span className="font-semibold text-gray-800">Lifetime</span> — no renewals. Receipts are in your
          Polar customer portal.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CHECKOUT_PLAN_ORDER.map((key) => {
          const cfg = PUBLIC_PLANS[key];
          const Icon = PLAN_ICONS[key];
          const bullets = planMarketingBullets(key);
          const isCurrent = paid && currentPlan === key;
          const isPopular = !!cfg.popular;
          return (
            <div
              key={key}
              className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                isPopular ? "border-[#2563EB] shadow-[0_4px_24px_rgba(37, 99, 235,0.12)]" : "border-gray-100"
              }`}
            >
              {isPopular ? (
                <span className="absolute -top-3 left-4 inline-flex rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Popular
                </span>
              ) : null}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-[15px] font-bold text-gray-900">{cfg.title}</p>
              <p className="mt-1 min-h-[36px] text-[12px] leading-snug text-gray-500">{cfg.valueLine}</p>
              <div className="mt-4 flex flex-wrap items-baseline gap-1">
                <span className="text-[28px] font-bold text-gray-900">{cfg.priceDisplay}</span>
                <span className="text-[13px] font-semibold text-gray-500">{cfg.periodLabel}</span>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-gray-400">{cfg.billingExplainer}</p>
              <div className="mt-5 flex-1 border-t border-gray-100 pt-5">
                <ul className="space-y-2.5">
                  {bullets.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[12px] text-gray-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => void startCheckout(key)}
                disabled={!!loadingPlan || statusLoading || isCurrent}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-semibold transition ${
                  isPopular
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8] disabled:opacity-50"
                    : "border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                }`}
              >
                {loadingPlan === key ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {isCurrent ? "Current plan" : loadingPlan === key ? "Redirecting…" : `Choose ${cfg.title}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">Billing history</h2>
        <div className="mt-6 flex flex-col items-center py-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="mt-3 text-[13px] font-medium text-gray-500">Invoices live in Polar</p>
          <p className="mt-1 max-w-sm text-center text-[12px] text-gray-400">
            After checkout, receipts and renewal history appear in your Polar customer portal.
          </p>
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2563EB] hover:underline"
          >
            Open customer portal <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-4">
        <HelpCircle className="h-4 w-4 text-gray-400" />
        <span className="text-[13px] text-gray-500">
          Need help?{" "}
          <Link href="/dashboard/support" className="font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]">
            Contact support
          </Link>
        </span>
      </div>
    </div>
  );
}
