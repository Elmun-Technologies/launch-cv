import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { Check, ArrowRight, Zap, HelpCircle } from "lucide-react";
import { PUBLIC_PLANS, planMarketingBullets } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const SUB_NEXT = "/dashboard/settings/subscription";
const registerHref = `/register?next=${encodeURIComponent(SUB_NEXT)}`;

export const metadata = buildMarketingMetadata({
  title: "Pricing",
  description:
    "Launch CV pricing — Starter, Professional, Elite, and Lifetime. A paid product built for serious job searches: AI limits, templates, and job-search tools.",
  pathname: "/pricing",
  keywords: ["Launch CV pricing", "resume builder cost", "Lifetime resume", "ATS resume subscription"],
});

const faqs = [
  {
    q: "Is there a free tier?",
    a: "No. Launch CV is a professional product: AI and premium workflows unlock after you choose a paid plan (monthly, annual, or Lifetime). You can create an account to manage billing, but features that consume AI require an active plan.",
  },
  {
    q: "How does billing work?",
    a: "Starter is billed monthly. Professional and Elite are single annual payments through Lemon Squeezy. Lifetime is a one-time purchase with ongoing fair-use monthly AI caps. Receipts and renewals are in your Lemon customer portal.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade when you need higher monthly ceilings; if you cancel a subscription, you keep access until the end of the paid period. Lifetime does not renew — it stays active while the product is offered.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on subscription plans where Lemon Squeezy policy allows. Contact support and we will help coordinate with our payment provider.",
  },
  {
    q: "What about retention and add-ons?",
    a: "Annual plans reward sustained job searches. We may add optional human reviews or coaching later; core plans stay simple with clear AI limits so you always know what you are paying for.",
  },
];

const pricingStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Pricing | Launch CV",
      description: "Launch CV — Starter, Professional, Elite, and Lifetime plans.",
      url: absoluteUrl("/pricing"),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ],
};

function planCtaLabel(key: CheckoutPlan): string {
  if (key === "lifetime") return "Get Lifetime";
  if (key === "starter") return "Get Starter";
  if (key === "elite") return "Get Elite";
  return "Get Professional";
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={pricingStructuredData} />
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Zap className="h-3.5 w-3.5" />
              Pricing
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Pay once or subscribe.{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                Always professional.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              Three subscription tiers plus Lifetime — built for people who treat a job search like a project, not a hobby.
              Pick the ceiling that matches how hard you are applying.
            </p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const bullets = planMarketingBullets(key);
              const popular = !!cfg.popular;
              return (
                <div
                  key={key}
                  className={`relative flex flex-col rounded-2xl border-2 bg-white p-7 ${
                    popular
                      ? "border-[#7C5CFC] shadow-xl shadow-blue-500/10"
                      : "border-gray-100 shadow-[0_1px_3px_rgba(16,24,40,0.04)]"
                  }`}
                >
                  {popular ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#7C5CFC] px-3 py-1 text-xs font-bold text-white">
                      Most popular
                    </span>
                  ) : null}
                  <p className="text-sm font-bold text-gray-700">{cfg.title}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-1.5 text-[40px] font-bold leading-none text-gray-900 sm:text-[44px]">
                    <span>{cfg.priceDisplay}</span>
                    <span className="text-lg font-semibold tracking-normal text-gray-400">{cfg.periodLabel}</span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{cfg.valueLine}</p>
                  <p className="mt-2 text-xs leading-snug text-gray-400">{cfg.billingExplainer}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {bullets.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFC]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={registerHref}
                    className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                      popular
                        ? "bg-[#7C5CFC] text-white shadow-lg shadow-blue-500/25 hover:bg-[#6B4CE0]"
                        : "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {planCtaLabel(key)}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-2xl px-4 text-center text-xs leading-relaxed text-gray-400">
            After you sign up, complete checkout in{" "}
            <Link href={SUB_NEXT} className="font-semibold text-[#7C5CFC] underline-offset-2 hover:underline">
              Subscription settings
            </Link>
            . Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(SUB_NEXT)}`} className="font-semibold text-[#7C5CFC] underline-offset-2 hover:underline">
              Sign in
            </Link>
            .
          </p>
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
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to run a serious job search?</h2>
            <p className="text-base text-white/85">Create an account, choose a plan, and unlock AI in under a minute.</p>
            <Link
              href={registerHref}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
