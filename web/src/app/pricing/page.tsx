import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { CtaLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { container, labelCls } from "@/components/site/ui";
import { PUBLIC_PLANS, planPriceLabel, planBillingDuration } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { getSettings } from "@/lib/app-settings";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { getPageCopy } from "@/lib/cms/page-copy";
import { getFaqsFor } from "@/lib/cms/faqs";

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

/** Limits are edited in the admin panel; refresh the page at most once a minute. */
export const revalidate = 60;

type Limits = Awaited<ReturnType<typeof getSettings>>["planLimits"];

const n = (v: number) => v.toLocaleString("en-US");

function buildFaqs(limits: Limits) {
  const L = limits.lifetime;
  return [
    {
      q: "Is there a free plan?",
      a: "The ATS check is free and needs no account. The editor, PDF export, templates and job tracker are free with an account. The AI tools — rewriting bullets, matching your resume to a job, cover letters and interview prep — unlock on a paid plan.",
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
      a: `Lifetime comes with the highest monthly limits we offer: ${n(L.jd)} job-description analyses, ${n(L.packet)} application packets and ${n(L.roleFit)} role-fit checks every month. Limits reset monthly.`,
    },
    {
      q: "Which payment methods do you accept?",
      a: "Checkout runs on Polar, which accepts major credit and debit cards. Prices are in US dollars; sales tax or VAT is added where your country requires it.",
    },
  ];
}

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

function buildLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Pricing | LaunchCV",
        description: `LaunchCV pricing — ${CHECKOUT_PLAN_ORDER.map((k) => PUBLIC_PLANS[k].title).join(", ")}.`,
        url: absoluteUrl("/pricing"),
        isPartOf: { "@id": WEBSITE_ID },
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
}

function planCtaLabel(key: CheckoutPlan): string {
  return key === "lifetime" ? "Buy Lifetime" : `Choose ${PUBLIC_PLANS[key].title}`;
}

const limitRows = [
  { l: "Job-post analyses", k: "jd" },
  { l: "Role-fit checks", k: "roleFit" },
  { l: "Application packets", k: "packet" },
] as const;

/** `free`: available without a plan. The AI tools are the paid part. */
const toolRows = [
  { l: "ATS check and score", free: true },
  { l: "Resume editor and PDF export", free: true },
  { l: "All 4 resume templates", free: true },
  { l: "Job tracker, contacts and companies", free: true },
  { l: "Bullet rewrites and summary writer", free: false },
  { l: "Cover letters and interview prep", free: false },
  { l: "Company matcher and email drafts", free: false },
];

const FREE_BULLETS = ["ATS check and score", "Resume editor & PDF", "All 4 templates", "Job tracker"];

const UNLOCKS = [
  { t: "Bullet rewrites", d: "Duties into results." },
  { t: "Cover letters", d: "Written for each job." },
  { t: "Interview prep", d: "Likely questions + notes." },
  { t: "Company matcher", d: "And email drafts." },
];

/** Plan order on phones: the popular plan first, Free last (desktop keeps price order). */
const MOBILE_ORDER: Record<CheckoutPlan, string> = {
  professional: "order-1",
  starter: "order-2",
  elite: "order-3",
  lifetime: "order-3",
};

const sectionPad = "pt-24 lg:pt-[130px]";
const linkCls = "lc-link font-semibold text-[#5440e8]";

function Tick({ dark = false }: { dark?: boolean }) {
  return (
    <span aria-hidden="true" className={`mr-1.5 font-bold ${dark ? "text-white" : "text-[#0b7a4f]"}`}>
      ✓
    </span>
  );
}

function Yes() {
  return (
    <>
      <span aria-hidden="true" className="font-bold text-[#0b7a4f]">
        ✓
      </span>
      <span className="sr-only">Included</span>
    </>
  );
}

function No() {
  return (
    <>
      <span aria-hidden="true" className="text-[#7c7a94]">
        —
      </span>
      <span className="sr-only">Not included</span>
    </>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">{children}</span>;
}

export default async function PricingPage() {
  const { planLimits: limits } = await getSettings();
  const [copy, cmsFaqs] = await Promise.all([getPageCopy("pricing.hero"), getFaqsFor("pricing")]);
  const faqs = cmsFaqs.length ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer })) : buildFaqs(limits);
  const ld = buildLd(faqs);

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML, nothing above the fold waits for JavaScript. */}
      <section className={`${container} flex flex-col gap-4 pt-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pt-12`}>
        <div className="max-w-[820px]">
          <p className={labelCls}>/ Pricing</p>
          <h1 className="mt-3.5 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:mt-5 sm:text-[56px] lg:text-[68px] lg:leading-[70px]">
            {copy.title} {copy.titleMuted ? <span className="text-[#7c7a94]">{copy.titleMuted}</span> : null}
          </h1>
        </div>
        <p className="max-w-[340px] text-[16px] leading-[25px] text-[#4a4862] sm:text-[18px] sm:leading-7 lg:mb-2">
          {copy.lead}
        </p>
      </section>

      {/* PLANS */}
      <section className={`${container} pt-[34px] lg:pt-12`}>
        <div className="grid items-stretch gap-2.5 md:grid-cols-2 md:gap-3.5 lg:grid-cols-[0.9fr_1fr_1.1fr_1fr]">
          {/* Free */}
          <div className="order-4 flex flex-col gap-[18px] rounded-3xl border-2 border-dashed border-[#c9c0ff] px-[22px] py-5 md:order-none md:p-7">
            <div>
              <div className="flex items-baseline justify-between md:block">
                <p className="text-[15px] font-semibold text-[#4a4862] md:text-[16px]">Free</p>
                <p className="text-[32px] font-bold tracking-[-0.03em] md:mt-2 md:text-[50px] md:leading-[54px] md:tracking-[-0.04em]">$0</p>
              </div>
              <p className="mt-1.5 text-[14px] leading-[22px] text-[#4a4862] md:hidden">
                ATS check, editor, PDF export, all 4 templates and the job tracker.
              </p>
              <p className="mt-1.5 hidden text-[15px] text-[#4a4862] md:block">Check, build and download.</p>
            </div>
            <ul className="hidden flex-col gap-2.5 border-t border-[#d9d4f2] pt-[18px] text-[15px] md:flex">
              {FREE_BULLETS.map((b) => (
                <li key={b}>
                  <Tick />
                  {b}
                </li>
              ))}
            </ul>
            <CtaLink
              cta="check_resume"
              location="pricing_free"
              href="/free-ats-check"
              className="lc-btn-lift mt-auto rounded-full bg-white p-[15px] text-center text-[15px] font-semibold text-[#121226] hover:bg-[#f1eff8]"
            >
              Check my resume
            </CtaLink>
          </div>

          {CHECKOUT_PLAN_ORDER.map((key) => {
            const cfg = PUBLIC_PLANS[key];
            const L = limits[key];
            const hot = !!cfg.popular;
            const period = key === "lifetime" ? "once" : cfg.periodLabel;
            const bullets = [
              `${n(L.jd)} job-post analyses / mo`,
              `${n(L.roleFit)} role-fit checks / mo`,
              `${n(L.packet)} application packets / mo`,
              "Every AI tool",
              key === "lifetime" ? "Never renews" : "Cancel anytime",
            ];
            const cta = (
              <CtaLink
                cta="choose_plan"
                plan={key}
                location="pricing_card"
                selectsPlan
                href={planHref(key)}
                className={`lc-btn-lift mt-auto rounded-full text-center text-[15px] font-semibold ${
                  hot ? "bg-white p-4 text-[#121226]" : "bg-[#111118] p-[13px] text-white hover:bg-[#2a2940] md:p-[15px]"
                }`}
              >
                {planCtaLabel(key)}
              </CtaLink>
            );

            if (hot) {
              return (
                <div
                  key={key}
                  className={`${MOBILE_ORDER[key]} lc-rise relative mt-3 flex flex-col gap-[18px] rounded-3xl bg-[#5440e8] px-[22px] pb-[22px] pt-[26px] text-white shadow-[0_24px_48px_-20px_rgba(36,24,120,.45)] md:order-none md:mt-0 md:p-7 md:pt-[46px] lg:-my-[18px]`}
                >
                  <span className="lc-poster absolute -top-3 left-5 -rotate-[4deg] rounded-full bg-[#ff7a33] px-[11px] py-1.5 text-[11px] text-[#111118] md:-top-3.5 md:left-7 md:px-3.5 md:py-2 md:text-[12px]">
                    MOST PICKED
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-[#e4dfff] md:text-[16px]">{cfg.title}</p>
                    <p className="mt-1 text-[48px] font-bold leading-[52px] tracking-[-0.04em] md:mt-2 md:text-[58px] md:leading-[60px]">
                      {cfg.priceDisplay}
                      <span className="text-[14px] font-medium tracking-normal text-[#e4dfff] md:text-[16px]"> {period}</span>
                    </p>
                    <p className="mt-1.5 hidden text-[15px] text-[#e4dfff] md:block">{cfg.valueLine}</p>
                  </div>
                  <ul className="flex flex-col gap-2 border-t border-white/25 pt-3.5 text-[14px] md:gap-2.5 md:pt-[18px] md:text-[15px]">
                    {bullets.map((b) => (
                      <li key={b}>
                        <Tick dark />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {cta}
                </div>
              );
            }

            return (
              <div
                key={key}
                className={`${MOBILE_ORDER[key]} lc-card lc-rise flex flex-col gap-3.5 rounded-3xl px-[22px] py-5 md:order-none md:gap-[18px] md:p-7`}
              >
                <div>
                  <div className="flex items-baseline justify-between md:block">
                    <p className="text-[15px] font-semibold text-[#4a4862] md:text-[16px]">{cfg.title}</p>
                    <p className="text-[32px] font-bold tracking-[-0.03em] md:mt-2 md:text-[50px] md:leading-[54px] md:tracking-[-0.04em]">
                      {cfg.priceDisplay}
                      <span className="text-[13px] font-medium tracking-normal text-[#66647c] md:text-[16px]"> {period}</span>
                    </p>
                  </div>
                  <p className="mt-1.5 text-[14px] leading-[22px] text-[#4a4862] md:hidden">
                    {n(L.jd)} analyses · {n(L.roleFit)} role-fit checks · {n(L.packet)} packets a month.
                    {key === "lifetime" ? " Never renews." : ""}
                  </p>
                  <p className="mt-1.5 hidden text-[15px] text-[#4a4862] md:block">{cfg.valueLine}</p>
                </div>
                <ul className="hidden flex-col gap-2.5 border-t border-[#e2e0ea] pt-[18px] text-[15px] md:flex">
                  {bullets.map((b) => (
                    <li key={b}>
                      <Tick />
                      {b}
                    </li>
                  ))}
                </ul>
                {cta}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 text-center text-[13px] text-[#4a4862] sm:text-[14px] lg:mt-9">
          <p className="flex flex-wrap justify-center gap-x-[22px] gap-y-1">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mr-1 inline align-[-2px]">
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Secure checkout by Polar
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>Cards accepted</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>Prices in USD, tax added where required</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>7-day money-back guarantee on monthly plans</span>
          </p>
          <p>
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(SUB_NEXT)}`} className={`${linkCls} inline-block py-2`}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* WHAT A PLAN UNLOCKS */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal lg:mx-auto lg:max-w-[980px] lg:text-center">
          <p className={labelCls}>/ What a plan unlocks</p>
          <h2 className="lc-h2 mt-5">
            The free check finds the problems. <span>The AI tools fix them with you.</span>
          </h2>
        </div>
        <div className="lc-reveal relative mt-[22px] h-[400px] overflow-hidden rounded-[28px] bg-[#e4dfff] lg:mt-12 lg:h-[620px] lg:rounded-[36px]">
          <div aria-hidden="true" className="absolute bottom-[-130px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#c9c0ff] lg:bottom-[-220px] lg:h-[560px] lg:w-[560px]" />
          <Image
            src="/images/people/woman-hoodie.webp"
            alt="Young woman in a denim jacket and hoodie, smiling"
            width={856}
            height={1080}
            sizes="(min-width: 1024px) 444px, 270px"
            className="absolute bottom-0 left-1/2 h-[340px] w-auto max-w-none -translate-x-1/2 lg:h-[560px]"
          />

          {/* Phone: one compact example card */}
          <div className="lc-float absolute left-3 top-3.5 rounded-2xl bg-white px-3.5 py-2.5 lg:hidden">
            <p className="text-[11px] text-[#66647c]">Job match · example</p>
            <p className="text-[22px] font-bold">
              72 <span className="text-[13px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
            </p>
          </div>

          {/* Desktop: four example cards */}
          <div className="lc-float lc-drift absolute left-12 top-12 hidden w-[330px] rounded-3xl bg-white p-[22px] lg:block">
            <p className="flex items-center gap-2">
              <Badge>Bullet rewrites</Badge>
              <span className="text-[12px] text-[#66647c]">Example</span>
            </p>
            <p className="mt-3.5 text-[14px] text-[#66647c] line-through">Responsible for the onboarding project</p>
            <p className="mt-1.5 text-[17px] font-semibold leading-6">Redesigned onboarding; week-1 activation rose from 38% to 57%.</p>
          </div>
          <div className="lc-float lc-drift-2 absolute left-12 top-[290px] hidden w-[330px] rounded-3xl bg-[#111118] p-[22px] text-white lg:block">
            <p className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-[#2a2840] px-2.5 py-[5px] text-[12px] font-bold text-[#c9c0ff]">Cover letter</span>
              <span className="text-[12px] text-[#b3b0c8]">Example</span>
            </p>
            <p className="mt-3.5 text-[15px] leading-[23px] text-[#e9e7f3]">
              “Your team is moving clinics onto self-scheduling — I led exactly that rollout at Brightpath, and no-shows fell 23%…”
            </p>
          </div>
          <div className="lc-float lc-drift-3 absolute right-12 top-12 hidden w-[320px] rounded-3xl bg-white p-[22px] lg:block">
            <Badge>Job match</Badge>
            <p className="mt-3 text-[40px] font-bold leading-[44px] tracking-[-0.04em]">
              72 <span className="text-[18px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
            </p>
            <p className="mt-1 text-[13px] text-[#66647c]">After adding two missing skills (example)</p>
          </div>
          <div className="lc-float lc-drift absolute right-12 top-[238px] hidden w-[320px] rounded-3xl bg-white p-[22px] lg:block">
            <p className="flex items-center gap-2">
              <Badge>Interview prep</Badge>
              <span className="text-[12px] text-[#66647c]">Example</span>
            </p>
            <p className="mt-3 text-[16px] font-bold">“Tell me about a launch that didn&apos;t go to plan.”</p>
            <p className="mt-1.5 text-[14px] leading-[21px] text-[#4a4862]">Likely questions for this job, with notes drawn from your resume.</p>
          </div>
          <span aria-hidden="true" className="lc-poster absolute bottom-4 right-3 -rotate-6 rounded-full bg-[#ff7a33] px-3 py-[7px] text-[11px] text-[#111118] lg:bottom-12 lg:right-16 lg:px-[15px] lg:py-[9px] lg:text-[13px]">
            <span className="lg:hidden">EVERY PAID PLAN</span>
            <span className="hidden lg:inline">ON EVERY PAID PLAN</span>
          </span>
        </div>
        <ul className="mt-2.5 grid grid-cols-2 gap-2 lg:hidden">
          {UNLOCKS.map((u) => (
            <li key={u.t} className="lc-card rounded-3xl p-4">
              <p className="text-[16px] font-bold">{u.t}</p>
              <p className="mt-1 text-[13px] text-[#4a4862]">{u.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* COMPARE */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal">
          <p className={labelCls}>/ Compare</p>
          <h2 className="lc-h2 mt-5">
            Same tools. <span>Different monthly limits.</span>
          </h2>
        </div>
        <div role="region" aria-label="Plan comparison table" tabIndex={0} className="lc-card relative mt-6 overflow-x-auto rounded-3xl px-4 pb-4 pt-2 sm:px-7 lg:mt-10">
          <table className="w-full min-w-[620px] border-collapse text-[15px] [font-feature-settings:'tnum']">
            <caption className="sr-only">Plan comparison: monthly limits and included tools</caption>
            <thead>
              <tr className="border-b-2 border-[#121226]">
                <th scope="col" className="w-[36%] py-[18px] text-left font-semibold text-[#66647c]">
                  Each month
                </th>
                <th scope="col" className="py-[18px] text-center font-bold">
                  Free
                </th>
                {CHECKOUT_PLAN_ORDER.map((key) => (
                  <th key={key} scope="col" className={`py-[18px] text-center font-bold ${PUBLIC_PLANS[key].popular ? "text-[#5440e8]" : ""}`}>
                    {PUBLIC_PLANS[key].title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {limitRows.map((r, i) => (
                <tr key={r.k} className={i === limitRows.length - 1 ? "border-b-2 border-[#121226]" : "border-b border-[#e2e0ea]"}>
                  <th scope="row" className="py-[15px] text-left font-semibold">
                    {r.l}
                  </th>
                  <td className="py-[15px] text-center">
                    <No />
                  </td>
                  {CHECKOUT_PLAN_ORDER.map((key) => (
                    <td key={key} className={`py-[15px] text-center ${PUBLIC_PLANS[key].popular ? "font-bold text-[#5440e8]" : ""}`}>
                      {n(limits[key][r.k])}
                    </td>
                  ))}
                </tr>
              ))}
              {toolRows.map((r) => (
                <tr key={r.l} className="border-b border-[#e2e0ea]">
                  <th scope="row" className="py-[15px] text-left font-normal">
                    {r.l}
                  </th>
                  <td className="py-[15px] text-center">{r.free ? <Yes /> : <No />}</td>
                  {CHECKOUT_PLAN_ORDER.map((key) => (
                    <td key={key} className="py-[15px] text-center">
                      <Yes />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-[15px] text-left font-normal">
                  Billing
                </th>
                <td className="py-[15px] text-center">
                  <No />
                </td>
                {CHECKOUT_PLAN_ORDER.map((key) => (
                  <td key={key} className="py-[15px] text-center">
                    {key === "lifetime" ? "One-time" : "Monthly"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* GUARANTEE */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal relative overflow-hidden rounded-[28px] bg-[#111118] px-[22px] py-7 text-white lg:h-[440px] lg:rounded-[36px] lg:p-0">
          <p aria-hidden="true" className="lc-poster text-[62px] leading-[58px] text-[#5440e8] sm:text-[96px] sm:leading-[90px] lg:absolute lg:right-12 lg:top-10 lg:text-right lg:text-[120px] lg:leading-[110px] xl:text-[150px] xl:leading-[136px]">
            7 DAYS
          </p>
          <p aria-hidden="true" className="lc-poster mt-1 text-[28px] leading-[30px] text-[#c9c0ff] sm:text-[44px] sm:leading-[46px] lg:absolute lg:right-12 lg:top-[150px] lg:mt-0 lg:text-right lg:text-[52px] lg:leading-[52px] xl:top-[176px] xl:text-[64px] xl:leading-[64px]">
            MONEY BACK
          </p>
          <div className="mt-[22px] lg:absolute lg:bottom-16 lg:left-16 lg:mt-0 lg:max-w-[420px] xl:max-w-[460px]">
            <h2 className="text-[26px] font-extrabold leading-[31px] tracking-[-0.03em] lg:text-[40px] lg:leading-[46px]">Not for you? Get your money back.</h2>
            <p className="mt-2.5 text-[15px] leading-[23px] text-[#c9c7d8] lg:mt-3.5 lg:text-[17px] lg:leading-[26px]">
              Email support within 7 days of paying for a monthly plan, or 14 days for Lifetime. Cancel any time from Settings in one click.
            </p>
            <Link href="/legal/terms" className="lc-link mt-3 inline-block py-2 text-[15px] font-semibold text-[#c9c0ff] hover:text-white">
              Read the refund terms
            </Link>
          </div>
          <span aria-hidden="true" className="lc-poster absolute bottom-14 right-16 hidden -rotate-[5deg] rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118] lg:block">
            LIFETIME: 14 DAYS
          </span>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${container} ${sectionPad} grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lc-reveal">
          <p className={labelCls}>/ Questions</p>
          <h2 className="lc-h2 mt-5">
            Billing, <span>plainly.</span>
          </h2>
          <p className="mt-5 hidden text-[16px] leading-[25px] text-[#4a4862] lg:block">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className={linkCls}>
              support@launch-cv.com
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-1.5 lg:gap-2">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="lc-faq group rounded-[22px] bg-white p-[18px] transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] open:shadow-[0_1px_2px_rgba(18,18,38,.04),0_10px_30px_-18px_rgba(18,18,38,.22)] lg:rounded-3xl lg:px-6 lg:py-[22px]"
              open={i === 0}
            >
              <summary className="flex min-h-[44px] items-center justify-between gap-4">
                <span className="text-[16px] font-bold lg:text-[18px]">{f.q}</span>
                <span
                  className="lc-plus inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] group-hover:bg-[#e4dfff] group-open:bg-[#111118] group-open:text-white"
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862] lg:mt-3 lg:text-[16px] lg:leading-[26px]">{f.a}</p>
            </details>
          ))}
          <p className="mt-3 text-[15px] text-[#4a4862] lg:hidden">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className={linkCls}>
              support@launch-cv.com
            </a>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
