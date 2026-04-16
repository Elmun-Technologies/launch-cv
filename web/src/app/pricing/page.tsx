import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { Check, ArrowRight, Zap, HelpCircle } from "lucide-react";
import { PUBLIC_PRICING, freePlanMarketingBullets, proPlanMarketingBullets } from "@/lib/monetization";

export const metadata: Metadata = {
  title: "Pricing | Launch CV",
  description: "Simple, transparent pricing for Launch CV. Start free and upgrade to annual Pro for $1.99/year.",
};

const freePlan = {
  name: "Free",
  price: "$0",
  period: "",
  description: "Everything you need to get started",
  features: freePlanMarketingBullets(),
  cta: "Get started free",
  href: "/register",
  popular: false,
};

const proPlan = {
  name: PUBLIC_PRICING.headline,
  price: PUBLIC_PRICING.priceDisplay,
  period: "/year",
  description: `${PUBLIC_PRICING.billingExplainer} ${PUBLIC_PRICING.valueLine}`,
  features: proPlanMarketingBullets(),
  cta: "Get Pro (sign in)",
  href: "/login?next=/dashboard/settings/subscription",
  popular: true,
};

const faqs = [
  {
    q: "Can I really use Launch CV for free?",
    a: "Absolutely. The free plan includes everything you need to create a professional resume, analyze job descriptions, and export PDFs. No credit card required.",
  },
  {
    q: "How does billing work?",
    a: `Pro is a single annual payment of ${PUBLIC_PRICING.priceDisplay} (billed once per year through Lemon Squeezy). You can manage renewals and receipts from your billing portal.`,
  },
  {
    q: "Can I switch between plans?",
    a: "Yes. You can upgrade to Pro at any time and your higher limits activate as soon as your subscription is active. If you cancel, you keep Pro access until the end of the paid period.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on Pro. If you are not satisfied, contact support and we will help coordinate with our payment provider.",
  },
  {
    q: "Will there be add-ons or upsells?",
    a: "We may offer optional services like expert resume reviews later. Core Pro stays one simple yearly price with generous AI limits.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              Simple Pricing
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Start free.{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                Upgrade when ready.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              No hidden fees. No credit card required. Get full access to our core features for free and unlock Pro when you need more power.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto grid max-w-4xl gap-8 px-4 sm:grid-cols-2">
            {[freePlan, proPlan].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-8 ${
                  plan.popular
                    ? "border-[#7C5CFC] shadow-xl shadow-blue-500/10"
                    : "border-gray-100 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#7C5CFC] px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-bold text-gray-700">{plan.name}</p>
                <p className="mt-3 text-[48px] font-bold leading-none text-gray-900">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal text-gray-400">{plan.period}</span>}
                </p>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Check className="h-4 w-4 shrink-0 text-[#7C5CFC]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-[#7C5CFC] text-white shadow-lg shadow-blue-500/25 hover:bg-[#6B4CE0]"
                      : "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF] text-[#7C5CFC]">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Start building your perfect resume today</h2>
            <p className="text-base text-white/80">No credit card needed. Free forever on our starter plan.</p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Create your free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
