import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { container, FaqIcon, labelCls } from "@/components/site/ui";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/app-settings";
import { getFaqsFor } from "@/lib/cms/faqs";
import { PUBLIC_PLANS, planMarketingBullets, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PASS_DAYS, isPassPlan, isPublicPlan } from "@/lib/plan-config";
import { checkoutConflict } from "@/lib/entitlement-rules";
import { buildPricingFaqs, checkoutFaqs } from "@/lib/pricing-faqs";
import { findWinbackOffer, PERSONAL_CODE_RE } from "@/lib/winback";
import { CheckoutPanel } from "./checkout-panel";

type Params = { params: Promise<{ plan: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { plan } = await params;
  const title = isPublicPlan(plan) ? `Checkout — ${PUBLIC_PLANS[plan].title}` : "Checkout";
  // A step in the purchase flow, not a landing page.
  return { title, robots: { index: false, follow: false } };
}

const linkCls = "lc-link font-semibold text-[#5440e8]";

function Tick() {
  return (
    <span aria-hidden="true" className="mr-2 font-bold text-[#0b7a4f]">
      ✓
    </span>
  );
}

type PageProps = Params & { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { plan } = await params;
  if (!isPublicPlan(plan)) notFound();
  const rawCode = (await searchParams).code;
  const codeParam = typeof rawCode === "string" && PERSONAL_CODE_RE.test(rawCode.trim().toUpperCase()) ? rawCode.trim().toUpperCase() : null;

  const cfg = PUBLIC_PLANS[plan];
  const pass = isPassPlan(plan);
  const [session, settings, cmsFaqs] = await Promise.all([getSession(), getSettings(), getFaqsFor("pricing")]);
  const limits = settings.planLimits;

  // Same rule as /api/polar/checkout, so a blocked purchase is explained before the click.
  const existing = session
    ? await prisma.subscription.findUnique({
        where: { userId: session.sub },
        select: { stripeSubscriptionId: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
      })
    : null;
  const conflict = session ? checkoutConflict(existing, plan) : null;
  // A win-back code from the email: applied only if it's this user's own and still valid.
  const offer = session && codeParam ? await findWinbackOffer(session.sub, codeParam) : null;
  const paused = settings.switches.checkout ? null : "Checkout is paused for a few minutes. Please try again shortly.";

  const faqs = checkoutFaqs(cmsFaqs.length ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer })) : buildPricingFaqs(limits));
  const bullets = planMarketingBullets(plan, limits);
  const others = CHECKOUT_PLAN_ORDER.filter((k) => k !== plan);

  const after = [
    "Your plan starts as soon as the payment goes through. Every AI tool unlocks on this account.",
    "It shows in Settings → Subscription, with this month's usage. Polar emails you a receipt.",
    pass
      ? `The pass runs for ${PASS_DAYS[plan]} days and doesn't auto-renew, so there's nothing to cancel. Buying another pass while one is active adds its days to the end.`
      : `${cfg.title} renews monthly. Cancel anytime from the billing portal in Settings; you keep access until the end of the period you paid for.`,
  ];

  return (
    <SiteShell>
      <section className={`${container} pt-4 lg:pt-10`}>
        <Link href="/pricing" className="lc-link inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[#4a4862] hover:text-[#5440e8]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All plans
        </Link>

        {/* Phones: plan heading, then the pay card, then the details. Desktop: details left, pay card sticky on the right. */}
        <div className="mt-2 grid items-start gap-6 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-x-14 lg:gap-y-8">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <p className={labelCls}>/ Checkout</p>
            <h1 className="mt-3 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[56px] lg:mt-4 lg:text-[64px]">
              {cfg.title}
            </h1>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-[#121226]">
              <span className="text-[34px] font-bold tracking-[-0.03em] sm:text-[40px]">{cfg.priceDisplay}</span>
              <span className="text-[16px] font-medium text-[#66647c]">{cfg.periodLabel}</span>
              {cfg.badge ? <span className="ml-1 inline-block rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">{cfg.badge}</span> : null}
            </p>
            <p className="mt-2 max-w-[560px] text-[16px] leading-[25px] text-[#4a4862] sm:text-[17px]">
              {cfg.valueLine} {cfg.billingExplainer}
            </p>
          </div>

          {/* Order summary and pay button. */}
          <aside aria-labelledby="order-summary" className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <div className="rounded-[28px] bg-white p-[22px] shadow-[0_24px_48px_-28px_rgba(36,24,120,.35)] sm:p-7">
              <h2 id="order-summary" className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#66647c]">
                Order summary
              </h2>
              <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-[#e2e0ea] pb-4">
                <p className="text-[18px] font-bold">{cfg.title}</p>
                <p className="whitespace-nowrap text-[18px] font-bold">{planPriceLabel(plan)}</p>
              </div>
              <p className="mt-3 text-[14px] leading-[21px] text-[#4a4862]">
                {pass ? `One payment, ${PASS_DAYS[plan]} days of access.` : "Billed monthly until you cancel."} Prices in USD, tax added where required.
              </p>
              <div className="mt-5">
                <CheckoutPanel
                  plan={plan}
                  planTitle={cfg.title}
                  signedIn={!!session}
                  conflict={conflict}
                  paused={paused}
                  discountCode={offer ? offer.code : null}
                  returnCode={session ? null : codeParam}
                />
              </div>
              {offer ? (
                <p role="status" className="mt-4 rounded-2xl bg-[#dcf5ea] px-4 py-3 text-[14px] leading-[20px] text-[#0b4f35]">
                  <b>{offer.percent ? `${offer.percent}% off applied` : "Discount applied"}</b> with your code <span className="lc-mono font-semibold">{offer.code}</span>.
                  You&apos;ll see the lower price on the next step.
                </p>
              ) : (
                <p className="mt-4 rounded-2xl bg-[#f1eff8] px-4 py-3 text-[14px] leading-[20px] text-[#4a4862]">
                  <b className="text-[#121226]">Have a discount code?</b> Enter it on the next step.
                </p>
              )}
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[13px] text-[#66647c]">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Secure checkout by Polar · Cards accepted
              </p>
            </div>
            <p className="mt-3 text-center text-[13px] leading-[20px] text-[#66647c]">
              Not the plan you want?{" "}
              {others.map((k, i) => (
                <span key={k}>
                  {i > 0 ? " · " : ""}
                  <Link href={`/checkout/${k}`} className="lc-link inline-block py-1 font-semibold text-[#4a4862] hover:text-[#5440e8]">
                    {PUBLIC_PLANS[k].title} {PUBLIC_PLANS[k].priceDisplay}
                  </Link>
                </span>
              ))}
            </p>
          </aside>

          {/* What's included and what happens next */}
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <div className="lc-card rounded-3xl p-[22px] sm:p-7">
              <h2 className="text-[18px] font-bold">What&apos;s included</h2>
              <ul className="mt-3.5 grid gap-2.5 text-[15px] sm:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b} className="flex">
                    <Tick />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 rounded-3xl bg-white p-[22px] sm:p-7">
              <h2 className="text-[18px] font-bold">What happens after you pay</h2>
              <ol className="mt-3.5 flex flex-col gap-3 text-[15px] leading-[23px] text-[#4a4862]">
                {after.map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden="true" className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#e4dfff] text-[12px] font-bold text-[#3a2bb8]">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-3 rounded-3xl bg-[#111118] p-[22px] text-white sm:p-7">
              <h2 className="text-[18px] font-bold">{pass ? "No auto-renewal" : "7-day money-back guarantee"}</h2>
              <p className="mt-2 text-[15px] leading-[23px] text-[#c9c7d8]">
                {pass
                  ? "Passes never renew, so there's nothing to cancel. Monthly plans have a 7-day money-back guarantee."
                  : "Monthly plans have a 7-day money-back guarantee — email support within 7 days of paying. Cancel any time from Settings in one click."}
              </p>
              <Link href="/legal/terms" className="lc-link mt-2 inline-block py-1.5 text-[15px] font-semibold text-[#c9c0ff] hover:text-white">
                Read the refund terms
              </Link>
            </div>

            {faqs.length ? (
              <div className="mt-10 lg:mt-14">
                <h2 className="text-[24px] font-extrabold tracking-[-0.03em] sm:text-[28px]">Questions before you pay</h2>
                <div className="mt-4 flex flex-col gap-1.5 lg:gap-2">
                  {faqs.map((f) => (
                    <details key={f.q} className="lc-faq group rounded-[22px] bg-white p-[18px] lg:px-6 lg:py-[20px]">
                      <summary className="flex min-h-[44px] items-center justify-between gap-4">
                        <span className="text-[16px] font-bold">{f.q}</span>
                        <FaqIcon size="sm" />
                      </summary>
                      <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862]">{f.a}</p>
                    </details>
                  ))}
                </div>
                <p className="mt-4 text-[15px] text-[#4a4862]">
                  Something else?{" "}
                  <a href="mailto:support@launch-cv.com" className={linkCls}>
                    support@launch-cv.com
                  </a>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <div className="pb-10" />
    </SiteShell>
  );
}
