"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortalUrl } from "@/lib/public-config";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { ExternalLink, Loader2 } from "lucide-react";
import { PUBLIC_PLANS, freeAllowanceSentence, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PASS_DAYS, isPassPlan, type CheckoutPlan } from "@/lib/plan-config";
import {
  Badge,
  PageHeader,
  SettingsTabs,
  UsageMeter,
  btnSmDark,
  btnSmPrimary,
  btnSmSoft,
  btnSmWhite,
  cardCls,
  cardTitleCls,
  inlineLinkCls,
} from "@/components/app/account/ui";

type StatusPayload = {
  pro: boolean;
  paid?: boolean;
  plan?: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** One-time purchase (a pass or legacy Lifetime): it never renews. */
  oneTime: boolean;
  /** Per sold plan: why checkout would be refused right now, or null. */
  checkoutBlocked: Partial<Record<CheckoutPlan, string | null>>;
};

type Counts = { jd: number; packet: number; roleFit: number };
/** This month's usage from /api/usage (the same numbers the app shell shows). */
type UsagePayload = { month: string | null; limits: Counts; used: Counts };

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
    oneTime: !!j.oneTime,
    checkoutBlocked: j.checkoutBlocked && typeof j.checkoutBlocked === "object" ? j.checkoutBlocked : {},
  };
}

async function fetchUsage(): Promise<UsagePayload | null> {
  const r = await fetch("/api/usage", { cache: "no-store" }).catch(() => null);
  if (!r?.ok) return null;
  const j = (await r.json().catch(() => null)) as Partial<UsagePayload> | null;
  if (!j?.limits || !j.used) return null;
  return { month: typeof j.month === "string" ? j.month : null, limits: j.limits, used: j.used };
}

/**
 * Usage is counted per calendar month (one UsageMonth row per "YYYY-MM"), so it
 * resets on the 1st whatever the plan's renewal date is; "2026-11" → "Dec 1".
 */
function resetDate(month: string | null): string | null {
  const m = month?.match(/^(\d{4})-(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]), 1).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const isPaid = (s: StatusPayload | null) => s?.paid === true || s?.pro === true;
const n = (v: number) => v.toLocaleString("en-US");

const METERS = [
  { k: "jd", l: "Job-post analyses" },
  { k: "roleFit", l: "Role-fit checks" },
  { k: "packet", l: "Application packets" },
] as const;

export function SubscriptionSettingsClient({
  limits,
}: {
  limits: Record<CheckoutPlan | "free", { jd: number; packet: number; roleFit: number }>;
}) {
  const portalUrl = usePortalUrl();
  const router = useRouter();
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [usage, setUsage] = useState<UsagePayload | null>(null);
  const autoStarted = useRef(false);

  useEffect(() => {
    let c = true;
    // Back from checkout (?checkout=success) the page renders CheckoutSuccessScreen instead of this client.
    (async () => {
      try {
        const s = await fetchStatus();
        if (c) setStatus(s);
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

  // Usage meters: the plan's limits, or the free monthly allowance without a plan.
  useEffect(() => {
    if (statusLoading) return;
    let c = true;
    void fetchUsage().then((u) => {
      if (c) setUsage(u);
    });
    return () => {
      c = false;
    };
  }, [statusLoading, paid, currentPlan]);

  // Older pricing and paywall links point here with ?plan=<plan>: forward them to
  // that plan's checkout page, which opens payment straight away (?start=1).
  useEffect(() => {
    if (statusLoading || paid || autoStarted.current) return;
    const plan = new URLSearchParams(window.location.search).get("plan") as CheckoutPlan | null;
    if (plan && CHECKOUT_PLAN_ORDER.includes(plan)) {
      autoStarted.current = true;
      router.replace(`/checkout/${plan}?start=1`);
    }
  }, [statusLoading, paid, router]);

  const renewDate = status?.currentPeriodEnd
    ? new Date(status.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const oneTime = paid && !!status?.oneTime;
  const isLifetime = oneTime && !renewDate;
  const onPass = oneTime && !!renewDate;
  const renewing = paid && !oneTime && !!renewDate && !status?.cancelAtPeriodEnd;
  const currentCfg = paid && currentPlan !== "none" ? PUBLIC_PLANS[currentPlan] : undefined;

  const planLine = !paid
    ? `The ATS check stays free. ${freeAllowanceSentence(limits.free)}`
    : isLifetime
      ? "One-time purchase — no renewals."
      : onPass
        ? `Pass active until ${renewDate}. It doesn't renew.`
        : renewDate
          ? `${status?.cancelAtPeriodEnd ? "Cancelled — access until" : "Renews on"} ${renewDate}.`
          : "Active.";
  const priceLine = currentCfg && currentPlan !== "none" ? planPriceLabel(currentPlan) : null;

  const blockedNotes = [...new Set(CHECKOUT_PLAN_ORDER.map((k) => status?.checkoutBlocked[k]).filter((x): x is string => !!x))];

  // Highest usage share, for the "running low" note under the meters.
  const fullest = usage
    ? METERS.map((m) => ({ ...m, pct: usage.limits[m.k] > 0 ? Math.round((usage.used[m.k] / usage.limits[m.k]) * 100) : 0 })).sort(
        (a, b) => b.pct - a.pct,
      )[0]
    : null;
  const resets = resetDate(usage?.month ?? null);

  return (
    <div className="mx-auto w-full max-w-[1160px] pb-12">
      <PageHeader title="Settings" lead="Your plan, usage and billing." />
      <SettingsTabs current="/dashboard/settings/subscription" />

      <div className="mt-5 flex flex-col gap-4 sm:gap-5">
        <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-2">
          <section
            aria-labelledby="current-plan-label"
            className={`rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-7 ${usage ? "" : "lg:col-span-2"}`}
          >
            <p id="current-plan-label" className="text-[12px] font-bold tracking-[0.08em] text-[#e4dfff] sm:text-[13px]">
              CURRENT PLAN
            </p>
            {statusLoading ? (
              <p className="mt-2 inline-flex items-center gap-2 text-[17px] text-[#e4dfff]">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…
              </p>
            ) : (
              <>
                <p className="mt-1.5 text-[30px] font-extrabold leading-[36px] tracking-[-0.03em] sm:mt-2 sm:text-[36px] sm:leading-[42px]">
                  {paid ? planLabel(status?.plan ?? null) : "Free account"}
                </p>
                <p className="mt-1 text-[14px] leading-[21px] text-[#e4dfff] sm:text-[15px]">
                  {priceLine ? `${priceLine} · ` : ""}
                  {planLine}
                </p>
              </>
            )}
            {paid ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-[18px]">
                <a href={portalUrl} target="_blank" rel="noreferrer" className={`${btnSmWhite} max-sm:w-full`}>
                  Billing portal <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                {renewing ? (
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="lc-link hidden min-h-11 items-center px-3 text-[14px] font-semibold text-[#e4dfff] hover:text-white focus-visible:outline-white! sm:inline-flex"
                  >
                    Cancel plan<span className="sr-only"> in the billing portal (opens in a new tab)</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </section>

          {usage ? (
            <section className={cardCls}>
              <h2 className={cardTitleCls}>{paid ? "This month" : "Free AI checks this month"}</h2>
              {resets ? (
                <p className="mt-0.5 text-[13px] text-[#66647c]">
                  Usage resets on the 1st of each month, next on {resets}
                  {renewing ? <span className="hidden sm:inline">. Your plan renewal date doesn&apos;t change this.</span> : null}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-3.5">
                {METERS.filter((m) => paid || usage.limits[m.k] > 0).map((m) => (
                  <UsageMeter key={m.k} label={m.l} used={usage.used[m.k]} limit={usage.limits[m.k]} />
                ))}
              </div>
              {fullest && fullest.pct >= 80 ? (
                <p className={`mt-3.5 text-[13px] font-semibold ${fullest.pct >= 100 ? "text-[#a3262b]" : "text-[#a15c00]"}`}>
                  {fullest.pct >= 100
                    ? `You've used all of this month's ${fullest.l.toLowerCase()}.`
                    : `You've used ${fullest.pct}% of your ${fullest.l.toLowerCase()}.`}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>

        <section aria-labelledby="plans-heading">
          <h2 id="plans-heading" className="sr-only">
            Plans
          </h2>
          <p className="mb-2.5 text-[14px] leading-[21px] text-[#4a4862]">
            Every AI tool is on every plan. The passes give full access for {PASS_DAYS.week} or {PASS_DAYS.quarter} days and never
            auto-renew; buying another pass while one is active adds its days to the end. {PUBLIC_PLANS.professional.title} renews
            monthly; cancel anytime from the billing portal.
          </p>
          {blockedNotes.map((note) => (
            <p key={note} className="mb-2.5 rounded-2xl bg-[#f1eff8] px-4 py-3 text-[13px] leading-[19px] text-[#4a4862]">
              {note}
            </p>
          ))}
          <div className="grid gap-2.5 md:grid-cols-3 md:gap-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const L = limits[key];
              const isCurrent = paid && currentPlan === key;
              const isPopular = !!cfg.popular && !paid;
              const period = cfg.periodLabel;
              const pass = isPassPlan(key);
              // A pass can be bought again while it runs: it extends the current one.
              const canExtend = pass && onPass;
              const blocked = status?.checkoutBlocked[key] ?? null;
              const label =
                canExtend
                    ? `Add ${PASS_DAYS[key]} days`
                    : pass
                      ? `Get the ${cfg.title}`
                      : paid
                        ? `Switch to ${cfg.title}`
                        : `Choose ${cfg.title}`;
              const shortLabel = canExtend ? "Extend" : pass ? "Buy" : paid ? "Switch" : "Choose";
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-3 rounded-[20px] px-[18px] py-4 sm:gap-4 sm:px-5 md:flex-col md:items-stretch md:justify-start md:gap-0 md:rounded-[22px] md:p-[22px] ${
                    isCurrent && !canExtend ? "bg-[#111118] text-white max-sm:hidden" : isCurrent ? "bg-[#111118] text-white" : isPopular ? "bg-white ring-2 ring-[#5440e8]" : "lc-card"
                  }`}
                >
                  {/* Phones: one line per plan (the current plan is already in the card above). */}
                  <div className="min-w-0 sm:hidden">
                    <p className="text-[16px] font-bold">
                      {cfg.title} · {planPriceLabel(key)}
                      {isPopular ? <span className="ml-1.5 inline-block whitespace-nowrap rounded-full bg-[#e4dfff] px-2 py-0.5 align-[2px] text-[11px] font-bold text-[#3a2bb8]">Recommended</span> : null}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-[17px] text-[#66647c]">
                      {pass ? "No auto-renewal · " : ""}
                      {n(L.jd)} analyses · {n(L.roleFit)} role-fit · {n(L.packet)} packets a month
                    </p>
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[16px] font-bold">{cfg.title}</h3>
                      {isCurrent ? (
                        <Badge tone="primary">Current</Badge>
                      ) : isPopular ? (
                        <Badge tone="lilac">Recommended</Badge>
                      ) : cfg.badge ? (
                        <Badge tone="lilac">{cfg.badge}</Badge>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[22px] font-extrabold tracking-[-0.03em] md:mt-2 md:text-[30px] md:leading-[36px]">
                      {cfg.priceDisplay}
                      <span className="text-[14px] font-medium tracking-normal"> {period}</span>
                    </p>
                    <p className={`mt-1 text-[13px] leading-[19px] ${isCurrent ? "text-[#c9c7d8]" : "text-[#66647c]"}`}>
                      {n(L.jd)} analyses · {n(L.roleFit)} role-fit checks · {n(L.packet)} packets a month
                    </p>
                  </div>
                  {isCurrent && !canExtend ? null : (
                    blocked || statusLoading ? (
                      <button
                        type="button"
                        disabled
                        title={blocked ?? undefined}
                        aria-label={`${label}, ${cfg.priceDisplay} ${period}`}
                        className={`${isPopular ? btnSmPrimary : paid ? btnSmSoft : btnSmDark} shrink-0 max-sm:px-3.5 md:mt-3.5 md:self-start`}
                      >
                        <span className="sm:hidden">{shortLabel}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ) : (
                      <CtaLink
                        cta="choose_plan"
                        plan={key}
                        location="subscription_settings"
                        selectsPlan
                        href={`/checkout/${key}`}
                        aria-label={`${label}, ${cfg.priceDisplay} ${period}`}
                        className={`${isPopular ? btnSmPrimary : paid ? btnSmSoft : btnSmDark} shrink-0 max-sm:px-3.5 md:mt-3.5 md:self-start`}
                      >
                        <span className="sm:hidden">{shortLabel}</span>
                        <span className="hidden sm:inline">{label}</span>
                      </CtaLink>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {renewing ? (
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="lc-link mx-auto -my-1 inline-flex min-h-11 items-center px-3 text-[14px] font-bold text-[#a3262b] hover:text-[#7f1d1d] sm:hidden"
          >
            Cancel plan<span className="sr-only"> in the billing portal (opens in a new tab)</span>
          </a>
        ) : null}

        <div className="flex flex-col gap-1 text-center text-[13px] leading-[20px] text-[#66647c]">
          <p>
            Secure checkout by Polar. Passes never auto-renew. 7-day money-back guarantee on monthly plans.{" "}
            <Link href="/legal/terms" className="lc-link font-semibold text-[#4a4862] hover:text-[#5440e8]">
              Terms
            </Link>
          </p>
          <p>
            Questions about billing?{" "}
            <Link href="/dashboard/support" className={inlineLinkCls}>
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
