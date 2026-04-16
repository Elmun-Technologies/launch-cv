"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2, CreditCard, Check, Sparkles, Crown, HelpCircle, Receipt, ExternalLink,
} from "lucide-react";
import { PUBLIC_PRICING, freePlanMarketingBullets, proPlanMarketingBullets } from "@/lib/monetization";

type StatusPayload = {
  pro: boolean;
  status: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

export function SubscriptionSettingsClient() {
  const [loading, setLoading] = useState(false);
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

  const isPro = status?.pro === true;

  async function startCheckout() {
    setLoading(true);
    const res = await fetch("/api/lemon/checkout", { method: "POST" });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok && j.url) window.location.href = j.url as string;
  }

  const freeBullets = freePlanMarketingBullets();
  const proBullets = proPlanMarketingBullets();

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">Subscription</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          One simple annual plan — pay once, use Pro all year.
        </p>
      </div>

      {!statusLoading && !isPro ? (
        <div className="rounded-2xl border border-[#7C5CFC]/25 bg-gradient-to-r from-violet-50 to-white p-5 shadow-sm">
          <p className="text-[14px] font-bold text-gray-900">Go Pro for {PUBLIC_PRICING.priceDisplay} / year</p>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-600">
            {PUBLIC_PRICING.billingExplainer} {PUBLIC_PRICING.valueLine}
          </p>
          <p className="mt-2 text-[12px] text-gray-500">{PUBLIC_PRICING.upsellHook}</p>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-gray-500">Current plan:</span>
        {statusLoading ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Loading…
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
              isPro ? "bg-violet-100 text-[#5B3FD9]" : "bg-gray-100 text-gray-700"
            }`}
          >
            {isPro ? <Crown className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isPro ? "Pro" : "Free"}
          </span>
        )}
      </div>

      {isPro && status?.currentPeriodEnd ? (
        <p className="text-[13px] text-gray-500">
          {status.cancelAtPeriodEnd ? "Access until " : "Renews "}
          <span className="font-semibold text-gray-800">
            {new Date(status.currentPeriodEnd).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          . Manage payment method in your{" "}
          <a
            href="https://app.lemonsqueezy.com/my-orders"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#7C5CFC] underline-offset-2 hover:underline"
          >
            Lemon Squeezy orders
            <ExternalLink className="mb-0.5 ml-0.5 inline h-3 w-3" />
          </a>{" "}
          if needed.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[15px] font-bold text-gray-900">Free</p>
          <p className="mt-1 text-[13px] text-gray-500">Great for getting started</p>
          <div className="mt-4">
            <span className="text-[32px] font-bold text-gray-900">$0</span>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <ul className="space-y-3">
              {freeBullets.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                  <Check className="h-4 w-4 shrink-0 text-gray-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-[13px] font-semibold text-gray-400"
          >
            {isPro ? "Included with your account" : statusLoading ? "…" : "Current Plan"}
          </button>
        </div>

        <div className="relative rounded-2xl border-2 border-[#7C5CFC] bg-white p-6 shadow-[0_4px_24px_rgba(124,92,252,0.12)]">
          <span className="absolute -top-3 right-6 inline-flex items-center rounded-full bg-[#7C5CFC] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Annual
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Crown className="h-5 w-5" />
          </div>
          <p className="mt-4 text-[15px] font-bold text-gray-900">{PUBLIC_PRICING.headline}</p>
          <p className="mt-1 text-[13px] text-gray-500">Higher AI limits for serious job searches</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-[32px] font-bold text-gray-900">{PUBLIC_PRICING.priceDisplay}</span>
            <span className="text-[14px] font-semibold text-gray-500">{PUBLIC_PRICING.periodLabel}</span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-gray-500">{PUBLIC_PRICING.billingExplainer}</p>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <ul className="space-y-3">
              {proBullets.map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                  <Check className="h-4 w-4 shrink-0 text-[#7C5CFC]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={loading || isPro || statusLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-3 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            {isPro ? "You are on Pro" : loading ? "Redirecting…" : `Upgrade — ${PUBLIC_PRICING.priceDisplay} / year`}
          </button>
          <p className="mt-3 text-center text-[11px] text-gray-400">Secure checkout powered by Lemon Squeezy</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
        <p className="text-[13px] font-semibold text-amber-900">Future upsells (coming soon)</p>
        <p className="mt-1 text-[12px] leading-relaxed text-amber-800/90">
          Resume reviews by experts, interview coaching packs, and team seats can plug into the same checkout later —
          today everything is included in one low annual Pro price.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">Billing History</h2>
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
