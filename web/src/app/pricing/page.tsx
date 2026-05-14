import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { Check, ArrowRight, Sparkles, Infinity as InfinityIcon, Minus, ChevronDown } from "lucide-react";
import { PUBLIC_PLANS, planMarketingBullets } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const SUB_NEXT = "/dashboard/settings/subscription";
const registerHref = `/register?next=${encodeURIComponent(SUB_NEXT)}`;

export const metadata = buildMarketingMetadata({
  title: "Pricing — Monthly, Yearly, or Pay Once",
  description:
    "Launch CV pricing: Starter at $9/mo, Professional at $29/yr (most chosen), Lifetime at $149 once. Every AI tool included on every plan. No freemium games.",
  pathname: "/pricing",
  keywords: ["Launch CV pricing", "resume builder cost", "Lifetime resume", "ATS resume subscription", "AI resume pricing"],
});

const faqs = [
  {
    q: "Is there a free tier?",
    a: "No. Launch CV is a professional product. AI workflows unlock after you choose a paid plan: Starter, Professional, Elite, or Lifetime. You can create an account to manage billing — checkout activates the AI.",
  },
  {
    q: "How does billing work?",
    a: "Starter is billed monthly. Professional and Elite are single annual payments through Lemon Squeezy. Lifetime is a one-time purchase. Receipts and renewals live in your Lemon customer portal.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade at any time for higher monthly ceilings. Cancel a subscription and you keep access until the paid period ends. Lifetime never renews — it stays active while the product is offered.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes — a 7-day money-back guarantee on subscription plans, where Lemon Squeezy policy allows. Email support and we&apos;ll coordinate with our payment provider.",
  },
  {
    q: "What's the fair-use cap on Lifetime?",
    a: "Lifetime users get the same generous monthly AI limits as Elite (2,000 JD analyses, 1,000 packets, 2,000 role-fit checks). Pay once, use forever — within those healthy ceilings.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Pricing | Launch CV",
      description: "Launch CV pricing — Starter, Professional, Elite, Lifetime.",
      url: absoluteUrl("/pricing"),
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
  if (key === "lifetime") return "Buy Lifetime";
  if (key === "starter") return "Start with Starter";
  if (key === "elite") return "Get Elite";
  return "Get Professional";
}

const planTagline: Record<CheckoutPlan, string> = {
  starter: "For the one-shot, focused hunt",
  professional: "For most active job seekers",
  lifetime: "Pay once, no renewals",
  elite: "For volume applicants",
};

const compareGroups = [
  {
    g: "AI ceilings (per month)",
    rows: [
      { l: "JD analyses", v: { starter: "35", professional: "120", lifetime: "2,000" } },
      { l: "Application packets", v: { starter: "15", professional: "55", lifetime: "1,000" } },
      { l: "Role-fit checks", v: { starter: "35", professional: "120", lifetime: "2,000" } },
    ],
  },
  {
    g: "Tools (all included)",
    rows: [
      { l: "AI Resume Builder", v: { starter: true, professional: true, lifetime: true } },
      { l: "JD Alignment", v: { starter: true, professional: true, lifetime: true } },
      { l: "ATS Scanner", v: { starter: true, professional: true, lifetime: true } },
      { l: "Cover Letter Generator", v: { starter: true, professional: true, lifetime: true } },
      { l: "Interview Prep", v: { starter: true, professional: true, lifetime: true } },
      { l: "Voice Input", v: { starter: false, professional: true, lifetime: true } },
      { l: "Company Matcher", v: { starter: false, professional: true, lifetime: true } },
    ],
  },
  {
    g: "Export & extras",
    rows: [
      { l: "PDF + DOCX export", v: { starter: true, professional: true, lifetime: true } },
      { l: "All 12 templates", v: { starter: "Core only", professional: true, lifetime: true } },
      { l: "Job tracker, contacts, companies", v: { starter: true, professional: true, lifetime: true } },
      { l: "Email support", v: { starter: "Standard", professional: "Standard", lifetime: "Priority" } },
      { l: "Priority feature rollouts", v: { starter: false, professional: false, lifetime: true } },
    ],
  },
];

function CellValue({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-[#059669]" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-[#CBD5E1]" />;
  return <span className="text-[12px] font-semibold text-[#0F172A]">{v}</span>;
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.06), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-12">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" /> Pricing
            </span>
            <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
              Pay monthly, yearly, or once — for life
            </h1>
            <p className="mt-6 max-w-[640px] text-[17px] leading-[1.65] text-[#475569]">
              Three subscription tiers plus a Lifetime option for people who&apos;d rather not think about renewals. No freemium games. No data harvesting. No surprise upgrades.
            </p>
          </div>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="pb-20 pt-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              const bullets = planMarketingBullets(key);
              const isLifetime = key === "lifetime";

              return (
                <RevealOnView key={key}>
                  <div
                    className={`flex h-full flex-col rounded-2xl bg-white p-7 ${
                      popular
                        ? "border-2 border-[#1A56DB] shadow-[0_20px_60px_-20px_rgba(26,86,219,0.25)]"
                        : "border border-[#E2E8F0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[17px] font-semibold text-[#0F172A]">{cfg.title}</p>
                      {popular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1A56DB]">
                          <Sparkles className="h-3 w-3" /> Most chosen
                        </span>
                      )}
                      {isLifetime && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-[11px] font-semibold text-[#15803D]">
                          <InfinityIcon className="h-3 w-3" /> Pay once
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-[#64748B]">{planTagline[key]}</p>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <span className="text-[48px] font-bold leading-none tracking-tight text-[#0F172A]">{cfg.priceDisplay}</span>
                      <span className="text-[14px] font-medium text-[#94A3B8]">{cfg.periodLabel}</span>
                    </div>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#94A3B8]">{cfg.billingExplainer}</p>

                    <ul className="mt-6 flex-1 space-y-2.5">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#334155]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={registerHref}
                      className={`mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] font-semibold transition ${
                        popular
                          ? "bg-[#1A56DB] text-white hover:bg-[#1D4ED8]"
                          : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {planCtaLabel(key)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </RevealOnView>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-[720px] text-center text-[13px] leading-relaxed text-[#94A3B8]">
            After signup, complete checkout in{" "}
            <Link href={SUB_NEXT} className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
              Subscription settings
            </Link>
            . Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(SUB_NEXT)}`} className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
              Sign in
            </Link>
            . 7-day money-back where Lemon Squeezy allows.
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Compare plans</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Every AI tool included — only the ceilings change
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-hidden rounded-xl border border-[#E2E8F0]">
            <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] bg-white">
              <div className="border-b border-[#E2E8F0] px-5 py-4 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Feature
              </div>
              <div className="border-b border-[#E2E8F0] px-5 py-4 text-center">
                <p className="text-[13px] font-semibold text-[#0F172A]">Starter</p>
                <p className="text-[11px] text-[#94A3B8]">$9/mo</p>
              </div>
              <div className="border-b border-[#E2E8F0] bg-[#EFF6FF]/50 px-5 py-4 text-center">
                <p className="text-[13px] font-semibold text-[#1A56DB]">Professional</p>
                <p className="text-[11px] text-[#475569]">$29/yr · popular</p>
              </div>
              <div className="border-b border-[#E2E8F0] px-5 py-4 text-center">
                <p className="text-[13px] font-semibold text-[#0F172A]">Lifetime</p>
                <p className="text-[11px] text-[#94A3B8]">$149 once</p>
              </div>
            </div>

            <div className="divide-y divide-[#E2E8F0] bg-white">
              {compareGroups.map((g) => (
                <div key={g.g}>
                  <div className="bg-[#FAFBFC] px-5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">{g.g}</p>
                  </div>
                  {g.rows.map((r) => (
                    <div key={r.l} className="grid grid-cols-[1.6fr_repeat(3,1fr)] items-center">
                      <div className="px-5 py-3 text-[13px] text-[#0F172A]">{r.l}</div>
                      <div className="px-5 py-3 text-center"><CellValue v={r.v.starter} /></div>
                      <div className="bg-[#EFF6FF]/30 px-5 py-3 text-center"><CellValue v={r.v.professional} /></div>
                      <div className="px-5 py-3 text-center"><CellValue v={r.v.lifetime} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-[#94A3B8]">
            Elite ($79/yr) sits between Professional and Lifetime — same tools, higher ceilings. Available at checkout.
          </p>
        </div>
      </section>

      {/* VALUE GRID */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Why pay for resume software</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A real product, funded by users — not ads
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Most resume tools monetize you instead. We charge up front so we can build something reliable, predictable, and continuously improved.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { k: "No data sold", d: "Your resume, applications, and interview practice — never shared, never sold, never used for ads." },
              { k: "No watermarks", d: "Every PDF, DOCX, and cover letter exports clean. No &lsquo;Made with Launch CV&rsquo; baked in." },
              { k: "Predictable limits", d: "Every plan publishes its monthly AI ceiling. No mystery throttling, no surprise paywalls." },
              { k: "Real human support", d: "Reply in under a business day. Same email queue the founder reads." },
              { k: "Cancel without drama", d: "One click in Lemon Squeezy. No retention pop-ups, no &lsquo;are you sure&rsquo; flows." },
              { k: "Lifetime really is lifetime", d: "One payment. Updates included. Active while the product exists." },
            ].map((p) => (
              <RevealOnView key={p.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#1A56DB]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{p.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: p.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="lc-overline text-[#1A56DB]">FAQ</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#475569]">
                Need something specific?{" "}
                <Link href="/dashboard/support" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                  Email support
                </Link>{" "}
                — we reply within one business day.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-white">
                {faqs.map((f) => (
                  <details key={f.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold text-[#0F172A]">
                      {f.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-[14px] leading-[1.7] text-[#475569]" dangerouslySetInnerHTML={{ __html: f.a }} />
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Pick a plan, start applying
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            One paste. Six AI tools. The job search you wish you&apos;d run a year ago.
          </p>
          <Link
            href={registerHref}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            Create my account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
