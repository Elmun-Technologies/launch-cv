"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Loader2 } from "lucide-react";
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

  const renewDate = status?.currentPeriodEnd
    ? new Date(status.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
          Plan &amp; billing <span className="text-[#8A8A86]">— every tool on every plan.</span>
        </h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">Plans differ only in monthly limits. Cancel anytime from the billing portal.</p>
      </div>

      {returned ? (
        <div
          role="status"
          className={`rounded-[14px] border px-5 py-4 ${
            returned === "slow" ? "border-[#F4D9B0] bg-[#FDF6EC]" : "border-[#CDEBDB] bg-[#EFFAF4]"
          }`}
        >
          <p className="text-[15px] font-medium text-[#111111]">
            {returned === "confirmed"
              ? "Payment received — you're all set."
              : returned === "waiting"
                ? "Payment received. Activating your plan…"
                : "Payment received. Your plan is still activating."}
          </p>
          <p className="mt-1 text-[14px] text-[#3F3F3F]">
            {returned === "confirmed" ? (
              <>
                Every AI tool is unlocked.{" "}
                <Link href="/dashboard/resumes" className="font-medium text-[#1D4ED8] hover:underline">
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
        <div role="alert" className="rounded-[14px] border border-[#F6D3CD] bg-[#FDF2F0] px-5 py-4">
          <p className="text-[15px] font-medium text-[#B42318]">{checkoutError}</p>
          <p className="mt-1 text-[14px] text-[#3F3F3F]">
            <a href={PORTAL_URL} target="_blank" rel="noreferrer" className="font-medium underline">
              Open billing portal
            </a>{" "}
            ·{" "}
            <Link href="/dashboard/support" className="font-medium underline">
              Contact support
            </Link>
          </p>
        </div>
      ) : null}

      <section className="flex flex-col gap-4 rounded-[14px] border border-[#E5E5E2] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] text-[#6B6B6B]">Current plan</p>
          {statusLoading ? (
            <p className="mt-1 inline-flex items-center gap-2 text-[17px] text-[#6B6B6B]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
            </p>
          ) : (
            <>
              <p className="mt-0.5 text-[20px] font-semibold text-[#111111]">{paid ? planLabel(status?.plan ?? null) : "No plan yet"}</p>
              <p className="mt-1 text-[14px] text-[#3F3F3F]">
                {!paid
                  ? "The ATS check stays free. Pick a plan below to unlock the AI tools."
                  : currentPlan === "lifetime"
                    ? "One-time purchase — no renewals."
                    : renewDate
                      ? `${status?.cancelAtPeriodEnd ? "Cancelled — access until" : "Renews on"} ${renewDate}.`
                      : "Active."}
              </p>
            </>
          )}
        </div>
        {paid ? (
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noreferrer"
            className="soha-btn-secondary inline-flex shrink-0 items-center justify-center gap-1.5"
          >
            Manage billing &amp; invoices <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        ) : null}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {CHECKOUT_PLAN_ORDER.map((key) => {
          const cfg = PUBLIC_PLANS[key];
          const bullets = planMarketingBullets(key);
          const isCurrent = paid && currentPlan === key;
          const isPopular = !!cfg.popular;
          return (
            <div
              key={key}
              className={`relative flex flex-col rounded-[14px] border bg-white p-6 ${
                isCurrent ? "border-[#111111]" : isPopular ? "border-[#2563EB] ring-1 ring-[#2563EB]" : "border-[#E5E5E2]"
              }`}
            >
              {isCurrent ? (
                <span className="absolute -top-2.5 left-5 rounded-full bg-[#111111] px-2.5 py-0.5 text-[12px] font-medium text-white">
                  Your plan
                </span>
              ) : isPopular ? (
                <span className="absolute -top-2.5 left-5 rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[12px] font-medium text-white">
                  Most popular
                </span>
              ) : null}
              <p className="text-[15px] font-semibold text-[#111111]">{cfg.title}</p>
              <p className="mt-1 min-h-[40px] text-[13px] leading-snug text-[#6B6B6B]">{cfg.valueLine}</p>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-[32px] font-semibold tracking-[-0.02em] text-[#111111]">{cfg.priceDisplay}</span>
                <span className="text-[14px] text-[#6B6B6B]">{cfg.periodLabel}</span>
              </p>
              <p className="mt-1 text-[12px] leading-snug text-[#8A8A86]">{cfg.billingExplainer}</p>
              <ul className="mt-5 flex-1 space-y-2.5 border-t border-[#EEEEEB] pt-5">
                {bullets.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13px] text-[#3F3F3F]">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#12A15E]" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => void startCheckout(key)}
                disabled={!!loadingPlan || statusLoading || isCurrent}
                className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-medium transition disabled:opacity-50 ${
                  isPopular && !isCurrent
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border border-[#D9D9D5] text-[#111111] hover:border-[#111111]"
                }`}
              >
                {loadingPlan === key ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {isCurrent ? "Current plan" : loadingPlan === key ? "Opening checkout…" : `Choose ${cfg.title}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 text-center text-[13px] text-[#6B6B6B]">
        <p>
          Secure checkout by Polar. 7-day money-back guarantee on monthly plans, 14 days on Lifetime.{" "}
          <Link href="/legal/terms" className="underline hover:text-[#111111]">
            Terms
          </Link>
        </p>
        <p>
          Questions about billing?{" "}
          <Link href="/dashboard/support" className="font-medium text-[#1D4ED8] hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
