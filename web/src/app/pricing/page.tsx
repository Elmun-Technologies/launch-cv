import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { PUBLIC_PLANS, planMarketingBullets, planPriceLabel, planBillingDuration } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PLAN_MONTHLY_LIMITS, type CheckoutPlan } from "@/lib/plan-config";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const SUB_NEXT = "/dashboard/settings/subscription";
/** Carries the chosen plan through sign-up so checkout opens right after. */
const planHref = (plan: string) => `/register?next=${encodeURIComponent(`${SUB_NEXT}?plan=${plan}`)}`;

export const metadata = buildMarketingMetadata({
  title: "Pricing — Pay Monthly or Once",
  description: `LaunchCV pricing: ${CHECKOUT_PLAN_ORDER.map(
    (key) => `${PUBLIC_PLANS[key].title} ${planPriceLabel(key)}`,
  ).join(", ")}. Every AI tool on every plan; the ATS check is free.`,
  pathname: "/pricing",
  keywords: ["LaunchCV pricing", "resume builder cost", "Lifetime resume", "ATS resume subscription", "AI resume pricing"],
});

const faqs = [
  {
    q: "Is there a free plan?",
    a: "The ATS check is free and needs no account. The AI tools — rewriting bullets, matching your resume to a job, cover letters and interview prep — unlock on a paid plan.",
  },
  {
    q: "How do I cancel?",
    a: "Open the billing portal from Settings → Subscription and cancel in one click. You keep access until the end of the period you paid for, and you aren't charged again.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Change your plan from the billing portal at any time. Starter and Professional renew monthly; Lifetime is a single payment that never renews.",
  },
  {
    q: "Do you offer refunds?",
    a: "Monthly plans have a 7-day money-back guarantee — email support within 7 days of paying. Lifetime can be refunded within 14 days. Details are in our Terms.",
  },
  {
    q: "What does fair use mean on Lifetime?",
    a: "Lifetime comes with the highest monthly limits we offer: 2,000 job-description analyses, 1,000 application packets and 2,000 role-fit checks every month. Limits reset monthly.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Checkout runs on Polar, which accepts major credit and debit cards. Prices are in US dollars; sales tax or VAT is added where your country requires it.",
  },
];

const planOffers = CHECKOUT_PLAN_ORDER.map((key) => {
  const plan = PUBLIC_PLANS[key];
  const price = String(plan.priceAmount);
  const billingDuration = planBillingDuration(key);
  return {
    "@type": "Offer",
    name: plan.title,
    price,
    priceCurrency: "USD",
    url: absoluteUrl("/pricing"),
    availability: "https://schema.org/InStock",
    ...(billingDuration
      ? {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price,
            priceCurrency: "USD",
            billingDuration,
          },
        }
      : {}),
  };
});

const offerPrices = planOffers.map((o) => Number(o.price));

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Pricing | LaunchCV",
      description: `LaunchCV pricing — ${CHECKOUT_PLAN_ORDER.map((k) => PUBLIC_PLANS[k].title).join(", ")}.`,
      url: absoluteUrl("/pricing"),
    },
    {
      "@type": "Product",
      name: "LaunchCV",
      description:
        "AI resume builder with job-description matching, ATS scoring, cover letters, interview prep and voice input. Every tool is included on every paid plan.",
      brand: { "@type": "Brand", name: "LaunchCV" },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: String(Math.min(...offerPrices)),
        highPrice: String(Math.max(...offerPrices)),
        offerCount: planOffers.length,
        offers: planOffers,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

function planCtaLabel(key: CheckoutPlan): string {
  return key === "lifetime" ? "Buy Lifetime" : `Choose ${PUBLIC_PLANS[key].title}`;
}

const planTagline: Record<CheckoutPlan, string> = {
  starter: "For a focused job search",
  professional: "For applying to many roles a week",
  lifetime: "Pay once, no renewals",
  elite: "For high-volume applicants",
};

const limitRows = [
  { l: "Job-description analyses", k: "jd" },
  { l: "Application packets", k: "packet" },
  { l: "Role-fit checks", k: "roleFit" },
] as const;

const toolRows = [
  "Resume editor and PDF export",
  "All 4 resume templates",
  "Bullet rewrites and summary writer",
  "Cover letters and interview prep",
  "Company matcher and voice input",
  "Job tracker, contacts and companies",
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[760px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Pay monthly or once. <span className="text-[#8A8A86]">Checking your resume is always free.</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            Every AI tool is on every plan. Plans only differ in how much you can use them each month.
          </p>
        </section>

        {/* PLAN CARDS */}
        <section className="mx-auto max-w-[1200px] px-5 pt-12 sm:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              return (
                <div
                  key={key}
                  className={`flex flex-col gap-6 rounded-[20px] p-7 ${
                    popular ? "border-2 border-[#111111]" : "border border-[#E5E5E2]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] text-[#6B6B6B]">{cfg.title}</p>
                      {popular ? (
                        <span className="rounded-full bg-[#EEF3FF] px-2.5 py-1 text-[12px] font-medium text-[#1D4ED8]">
                          Most picked
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[44px] font-semibold tracking-[-0.04em] [font-feature-settings:'tnum']">
                      {cfg.priceDisplay}
                      <span className="text-[15px] font-normal tracking-normal text-[#6B6B6B]">
                        {" "}
                        {key === "lifetime" ? "once" : "/month"}
                      </span>
                    </p>
                    <p className="mt-1 text-[14px] text-[#6B6B6B]">{planTagline[key]}</p>
                  </div>
                  <CtaLink
                    cta="choose_plan"
                    plan={key}
                    location="pricing_card"
                    selectsPlan
                    href={planHref(key)}
                    className={`flex h-12 items-center justify-center rounded-full text-[15px] font-medium transition ${
                      popular
                        ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                        : "border border-[#D9D9D5] text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    {planCtaLabel(key)}
                  </CtaLink>
                  <ul className="flex flex-col gap-2.5">
                    {planMarketingBullets(key).map((b) => (
                      <li key={b} className="flex gap-2.5 text-[15px] leading-[1.5] text-[#3F3F3F]">
                        <Check className="mt-[3px] h-4 w-4 shrink-0 text-[#111111]" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-5 flex flex-col gap-x-3 gap-y-1 text-[14px] text-[#6B6B6B] sm:flex-row sm:flex-wrap">
            <span>7-day money-back guarantee on monthly plans</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <span>Secure checkout by Polar</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <span>Prices in USD, tax added by country</span>
            <span aria-hidden className="hidden sm:inline">·</span>
            <span>
              Already have an account?{" "}
              <Link href={`/login?next=${encodeURIComponent(SUB_NEXT)}`} className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                Sign in
              </Link>
            </span>
          </p>
        </section>

        {/* COMPARE */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-[104px]">
          <h2 className="text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">
            Compare plans <span className="text-[#8A8A86]">— only the limits change.</span>
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[15px] [font-feature-settings:'tnum']">
              <thead>
                <tr className="border-b border-[#EEEEEB] text-[#6B6B6B]">
                  <th className="w-[40%] py-4 text-left font-medium">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th className="py-4 font-medium">Free</th>
                  {CHECKOUT_PLAN_ORDER.map((key) => (
                    <th key={key} className={`py-4 font-medium ${PUBLIC_PLANS[key].popular ? "text-[#111111]" : ""}`}>
                      {PUBLIC_PLANS[key].title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#EEEEEB]">
                  <td className="py-4">ATS score and report</td>
                  <td className="py-4 text-center">
                    <Check className="mx-auto h-4 w-4" aria-label="Included" />
                  </td>
                  {CHECKOUT_PLAN_ORDER.map((key) => (
                    <td key={key} className="py-4 text-center">
                      <Check className="mx-auto h-4 w-4" aria-label="Included" />
                    </td>
                  ))}
                </tr>
                {limitRows.map((r) => (
                  <tr key={r.k} className="border-b border-[#EEEEEB]">
                    <td className="py-4">{r.l} / month</td>
                    <td className="py-4 text-center text-[#6E6E6A]">—</td>
                    {CHECKOUT_PLAN_ORDER.map((key) => (
                      <td key={key} className="py-4 text-center">
                        {PLAN_MONTHLY_LIMITS[key][r.k].toLocaleString("en-US")}
                      </td>
                    ))}
                  </tr>
                ))}
                {toolRows.map((l) => (
                  <tr key={l} className="border-b border-[#EEEEEB]">
                    <td className="py-4">{l}</td>
                    <td className="py-4 text-center text-[#6E6E6A]">—</td>
                    {CHECKOUT_PLAN_ORDER.map((key) => (
                      <td key={key} className="py-4 text-center">
                        <Check className="mx-auto h-4 w-4" aria-label="Included" />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-4">Billing</td>
                  <td className="py-4 text-center text-[#6E6E6A]">—</td>
                  {CHECKOUT_PLAN_ORDER.map((key) => (
                    <td key={key} className="py-4 text-center">
                      {key === "lifetime" ? "One-time" : "Monthly"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-[104px]">
          <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F5F5F3] md:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-4 p-8 sm:p-14">
              <h2 className="text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">
                If it doesn&apos;t help, <span className="text-[#8A8A86]">you get your money back.</span>
              </h2>
              <p className="max-w-[440px] text-[16px] leading-[1.6] text-[#3F3F3F]">
                Email us within 7 days of paying for a monthly plan and we&apos;ll refund you in full. Lifetime can be
                refunded within 14 days.
              </p>
              <Link href="/legal/terms" className="text-[15px] text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                Read the refund terms
              </Link>
            </div>
            <div className="relative min-h-[260px] md:min-h-[360px] md:w-[46%]">
              <Image
                src="/images/photos/handshake-desk.webp"
                alt="Two people shaking hands across a desk"
                fill
                sizes="(min-width: 768px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[860px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <h2 className="text-center text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">
            Billing questions
          </h2>
          <div className="mt-6 border-b border-[#E5E5E2]">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-[15px] text-[#6B6B6B]">
            Something else?{" "}
            <Link href="/contact" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
              Email support
            </Link>
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
