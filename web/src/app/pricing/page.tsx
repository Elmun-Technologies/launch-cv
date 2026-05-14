import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { Check, ArrowRight, ArrowUpRight, Sparkles, Infinity as InfinityIcon, Minus } from "lucide-react";
import { PUBLIC_PLANS, planMarketingBullets } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const SUB_NEXT = "/dashboard/settings/subscription";
const registerHref = `/register?next=${encodeURIComponent(SUB_NEXT)}`;

export const metadata = buildMarketingMetadata({
  title: "Pricing — Pay Monthly, Yearly, or Once for Life",
  description:
    "Launch CV pricing: Starter at $9/mo, Professional at $29/yr (most chosen), Lifetime at $149 once. Every AI tool included. No freemium gimmicks.",
  pathname: "/pricing",
  keywords: ["Launch CV pricing", "resume builder cost", "Lifetime resume", "ATS resume subscription"],
});

const faqs = [
  { q: "Is there a free tier?", a: "No. Launch CV is a professional product. AI workflows unlock after you choose a paid plan (Starter, Professional, Elite, or Lifetime). You can create an account to manage billing, but checkout activates the AI." },
  { q: "How does billing work?", a: "Starter is billed monthly. Professional and Elite are single annual payments through Lemon Squeezy. Lifetime is a one-time purchase. Receipts and renewals live in your Lemon customer portal." },
  { q: "Can I change plans later?", a: "Yes. Upgrade any time for higher monthly ceilings. Cancel a subscription and you keep access until the paid period ends. Lifetime never renews — it stays active while the product is offered." },
  { q: "Do you offer refunds?", a: "Yes — a 7-day money-back guarantee on subscription plans, where Lemon Squeezy policy allows. Email support and we'll coordinate with our payment provider." },
  { q: "What's a 'fair-use cap' on Lifetime?", a: "Lifetime users get the same generous monthly AI limits as Elite (2,000 JD analyses, 1,000 packets, 2,000 role-fit checks). Pay once, use forever — within those healthy ceilings." },
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
  elite: "For volume applicants & switchers",
  lifetime: "Pay once. Sleep forever.",
};

// Feature comparison table rows
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
  return <span className="font-body text-[12px] font-bold text-[#0F172A]">{v}</span>;
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF7] text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-[0.10] blur-[140px]" />
          <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 pb-20 pt-16">
          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F172A]/15 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#0F172A]">
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" /> Pricing · Simple by design
            </span>
            <h1 className="mt-6 font-display text-[64px] font-extrabold leading-[0.94] tracking-[-0.04em] text-[#0F172A] sm:text-[88px] lg:text-[112px]">
              Pay monthly.<br />
              Pay yearly.<br />
              <span className="lc-mega-italic text-[#1A56DB]">Or pay once</span>{" "}<span className="text-[#94A3B8]">— for life.</span>
            </h1>
            <p className="mt-7 max-w-[640px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              No freemium games. No data harvesting. No surprise upgrades buried in modals. Three subscription tiers plus a Lifetime option for people who&apos;d rather not think about renewals.
            </p>
          </div>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className="relative bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              const bullets = planMarketingBullets(key);
              const isLifetime = key === "lifetime";

              return (
                <RevealOnView key={key}>
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-8 transition ${
                      popular
                        ? "border-[#0F172A] shadow-[0_30px_80px_-20px_rgba(15,23,42,0.25)]"
                        : isLifetime
                        ? "border-[#1A56DB]/30 bg-gradient-to-b from-[#EFF6FF] to-white"
                        : "border-[#E2E8F0]"
                    }`}
                  >
                    {popular && (
                      <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider text-white">
                        <Sparkles className="h-3 w-3" /> Most chosen
                      </span>
                    )}
                    {isLifetime && (
                      <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#1A56DB] px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider text-white">
                        <InfinityIcon className="h-3 w-3" /> Pay once
                      </span>
                    )}

                    <div>
                      <p className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{cfg.title}</p>
                      <p className="mt-1 font-body text-[13px] text-[#64748B]">{planTagline[key]}</p>
                    </div>

                    <div className="mt-7 flex items-baseline gap-1.5">
                      <span className="font-display text-[64px] font-extrabold leading-none tracking-tight text-[#0F172A]">{cfg.priceDisplay}</span>
                      <span className="font-body text-[15px] font-semibold text-[#94A3B8]">{cfg.periodLabel}</span>
                    </div>
                    <p className="mt-2 font-body text-[12px] leading-relaxed text-[#94A3B8]">{cfg.billingExplainer}</p>

                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />

                    <p className="font-body text-[13px] font-semibold text-[#475569]">{cfg.valueLine}</p>
                    <ul className="mt-5 flex-1 space-y-3">
                      {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 font-body text-[14px] leading-snug text-[#334155]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={registerHref}
                      className={`mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3.5 font-body text-[14px] font-bold transition ${
                        popular
                          ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                          : isLifetime
                          ? "bg-[#1A56DB] text-white hover:bg-[#1D4ED8]"
                          : "border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                      }`}
                    >
                      {planCtaLabel(key)} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </RevealOnView>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-[720px] text-center font-body text-[13px] leading-relaxed text-[#94A3B8]">
            After signup, complete checkout in{" "}
            <Link href={SUB_NEXT} className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">Subscription settings</Link>. Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(SUB_NEXT)}`} className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">Sign in</Link>.
            7-day money-back where Lemon Squeezy allows.
          </p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[760px]">
              <span className="lc-overline text-[#1A56DB]">Compare plans · line by line</span>
              <h2 className="mt-3 font-display text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[52px]">
                Every AI tool included.<br />
                Only the <span className="italic">ceilings</span> change.
              </h2>
            </div>
          </RevealOnView>

          <div className="overflow-hidden rounded-3xl border border-[#E2E8F0]">
            <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] bg-[#0F172A] text-white">
              <div className="px-5 py-4 font-body text-[11px] font-bold uppercase tracking-wider text-white/60">Feature</div>
              <div className="px-5 py-4 text-center">
                <p className="font-display text-[14px] font-bold">Starter</p>
                <p className="font-body text-[11px] text-white/55">$9/mo</p>
              </div>
              <div className="bg-[#1A56DB] px-5 py-4 text-center">
                <p className="font-display text-[14px] font-bold">Professional</p>
                <p className="font-body text-[11px] text-white/80">$29/yr · popular</p>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="font-display text-[14px] font-bold">Lifetime</p>
                <p className="font-body text-[11px] text-white/55">$149 once</p>
              </div>
            </div>

            <div className="divide-y divide-[#E2E8F0] bg-white">
              {compareGroups.map((g) => (
                <div key={g.g}>
                  <div className="bg-[#FAFAF7] px-5 py-3">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#475569]">{g.g}</p>
                  </div>
                  {g.rows.map((r) => (
                    <div key={r.l} className="grid grid-cols-[1.6fr_repeat(3,1fr)] items-center px-0 hover:bg-[#FAFAF7]">
                      <div className="px-5 py-3 font-body text-[14px] text-[#0F172A]">{r.l}</div>
                      <div className="px-5 py-3 text-center"><CellValue v={r.v.starter} /></div>
                      <div className="bg-[#EFF6FF]/40 px-5 py-3 text-center"><CellValue v={r.v.professional} /></div>
                      <div className="px-5 py-3 text-center"><CellValue v={r.v.lifetime} /></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center font-body text-[13px] text-[#94A3B8]">
            Elite ($79/yr) sits between Professional and Lifetime — same tools, higher ceilings. Available at checkout.
          </p>
        </div>
      </section>

      {/* VALUE STORY */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-white/55">What you&apos;re actually paying for</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[56px]">
                  A real product.<br />
                  Run by real people.<br />
                  <span className="lc-gradient-text-animated">Funded by users — not ads.</span>
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-white/70 lg:col-span-5">
                Most resume tools monetize you. They sell your data, gate your downloads, or push you into upsells the moment you commit. Launch CV is the opposite: paid up front, transparent limits, zero ads, your data is yours.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { k: "No data sold", d: "Your resume, your applications, your interview practice — never shared, never sold, never used for ads." },
              { k: "No watermarks", d: "Every PDF, every DOCX, every cover letter exports clean. No 'Made with Launch CV' baked in." },
              { k: "Predictable limits", d: "Every plan publishes its monthly AI ceiling. No mystery throttling, no surprise paywalls." },
              { k: "Real human support", d: "Reply in under a business day. Same email queue your founder reads, every morning." },
              { k: "Cancel without drama", d: "One click in Lemon Squeezy. No retention pop-ups, no 'are you sure' dark patterns." },
              { k: "Lifetime really is lifetime", d: "One payment. Updates included. Active while the product exists — and we're building it for the long haul." },
            ].map((p) => (
              <div key={p.k} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                <Check className="h-5 w-5 text-emerald-300" />
                <h3 className="mt-4 font-display text-[18px] font-bold tracking-tight">{p.k}</h3>
                <p className="mt-2 font-body text-[14px] leading-[1.65] text-white/65">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="lc-overline text-[#1A56DB]">FAQ</span>
              <h2 className="mt-3 font-display text-[38px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0F172A] sm:text-[44px]">
                Frequently asked,<br />
                <span className="italic">honestly answered.</span>
              </h2>
              <p className="mt-5 font-body text-[14px] leading-[1.7] text-[#475569]">
                Need something specific? <Link href="/dashboard/support" className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">Email us</Link> — reply in under a business day.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-[#E2E8F0] rounded-3xl border border-[#E2E8F0] bg-[#FAFAF7]">
                {faqs.map((f) => (
                  <details key={f.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[17px] font-bold text-[#0F172A]">
                      {f.q}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-open:rotate-45" />
                    </summary>
                    <p className="mt-3 font-body text-[14px] leading-[1.7] text-[#475569]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B0F19] py-20 text-white">
        <div className="mx-auto max-w-[1000px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Pick a plan.<br />
            <span className="lc-gradient-text-animated">Start applying.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[480px] font-body text-[17px] leading-[1.65] text-white/70">
            One paste. Six AI tools. The job search you wish you&apos;d run a year ago.
          </p>
          <Link href={registerHref} className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#0B0F19]">
            Create my account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
