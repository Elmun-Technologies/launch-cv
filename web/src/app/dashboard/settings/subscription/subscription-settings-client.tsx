"use client";

import { useEffect, useState } from "react";
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

type StatusPayload = {
  pro: boolean;
  paid?: boolean;
  plan?: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

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

export function SubscriptionSettingsClient() {
  const [loadingPlan, setLoadingPlan] = useState<CheckoutPlan | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    let c = true;
    (async () => {
      try {
        const r = await fetch("/api/subscription/status");
        const j = (await r.json().catch(() => ({}))) as Partial<StatusPayload>;
        if (c && r.ok) {
          setStatus({
            pro: !!j.pro,
            paid: j.paid ?? j.pro,
            plan: j.plan ?? null,
            status: j.status ?? null,
            currentPeriodEnd: j.currentPeriodEnd ?? null,
            cancelAtPeriodEnd: !!j.cancelAtPeriodEnd,
          });
        }
      } finally {
        if (c) setStatusLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  const paid = status?.paid === true || status?.pro === true;
  const currentPlan = (status?.plan as CheckoutPlan | "none" | undefined) ?? "none";

  async function startCheckout(plan: CheckoutPlan) {
    setLoadingPlan(plan);
    const res = await fetch("/api/lemon/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const j = await res.json().catch(() => ({}));
    setLoadingPlan(null);
    if (res.ok && j.url) window.location.href = j.url as string;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">Subscription</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Launch CV is a paid product — pick a plan that matches your search intensity. Upgrade anytime; Lifetime is a
          one-time purchase.
        </p>
      </div>

      {!statusLoading && !paid ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
          <p className="text-[14px] font-bold text-amber-950">No active plan</p>
          <p className="mt-1 text-[13px] leading-relaxed text-amber-900/90">
            AI features stay locked until checkout completes. Choose Starter, Professional, Elite, or Lifetime below.
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
              paid ? "bg-violet-100 text-[#5B3FD9]" : "bg-gray-100 text-gray-700"
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
            href="https://app.lemonsqueezy.com/my-orders"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#7C5CFC] underline-offset-2 hover:underline"
          >
            Lemon Squeezy orders
            <ExternalLink className="mb-0.5 ml-0.5 inline h-3 w-3" />
          </a>
          .
        </p>
      ) : null}

      {paid && currentPlan === "lifetime" ? (
        <p className="text-[13px] text-gray-500">
          You are on <span className="font-semibold text-gray-800">Lifetime</span> — no renewals. Receipts are in your
          Lemon Squeezy account.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
                isPopular ? "border-[#7C5CFC] shadow-[0_4px_24px_rgba(124,92,252,0.12)]" : "border-gray-100"
              }`}
            >
              {isPopular ? (
                <span className="absolute -top-3 left-4 inline-flex rounded-full bg-[#7C5CFC] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Popular
                </span>
              ) : null}
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
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
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7C5CFC]" />
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
                    ? "bg-[#7C5CFC] text-white hover:bg-[#6B4CE0] disabled:opacity-50"
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
          <p className="mt-3 text-[13px] font-medium text-gray-500">Invoices live in Lemon Squeezy</p>
          <p className="mt-1 max-w-sm text-center text-[12px] text-gray-400">
            After checkout, receipts and renewal history appear in your customer account on Lemon Squeezy.
          </p>
          <a
            href="https://app.lemonsqueezy.com/my-orders"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC] hover:underline"
          >
            Open my orders <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pb-4">
        <HelpCircle className="h-4 w-4 text-gray-400" />
        <span className="text-[13px] text-gray-500">
          Need help?{" "}
          <Link href="/dashboard/support" className="font-semibold text-[#7C5CFC] transition hover:text-[#6B4CE0]">
            Contact support
          </Link>
        </span>
      </div>
    </div>
  );
}
