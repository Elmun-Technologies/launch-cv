import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  DollarSign,
  Target,
  Layers,
  Shield,
  Brain,
  Database,
  Code2,
  Mail,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Investor Relations",
  description:
    "Launch CV is the AI job-search platform for the next generation of candidates. Vision, traction, business model, and how to reach the founder.",
  pathname: "/investors",
  keywords: ["Launch CV investors", "career tech investment", "AI hiring SaaS"],
  robots: { index: false, follow: true },
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Investor Relations | Launch CV",
  url: absoluteUrl("/investors"),
};

const metrics = [
  { label: "Total users", value: "10,000+", icon: Users },
  { label: "Resumes built", value: "25,000+", icon: Layers },
  { label: "JD analyses run", value: "50,000+", icon: Target },
  { label: "MoM growth", value: "35%", icon: TrendingUp },
];

const opportunity = [
  {
    icon: Globe,
    h: "Massive, global market",
    d: "Resume builders is a $2B+ category with low product differentiation. AI is collapsing the gap between consumer tools and $5,000 résumé writers.",
  },
  {
    icon: Brain,
    h: "Defensible AI surface",
    d: "Six purpose-built tools, each with its own evaluation harness. Quality regressions get caught before they ship — most competitors ship a single chatbot.",
  },
  {
    icon: DollarSign,
    h: "Subscription-first economics",
    d: "Predictable ARR with a Lifetime tier acting as a high-LTV anchor. No data monetization, no ads. Customer acquisition cost is honest.",
  },
];

const businessModel = [
  { plan: "Starter", price: "$9/mo", target: "One-shot job seekers", note: "Lowest friction entry; converts to annual at ~22%." },
  { plan: "Professional", price: "$29/yr", target: "Active applicants (most chosen)", note: "Best margin/CAC ratio; default upsell on the pricing page." },
  { plan: "Elite", price: "$79/yr", target: "Career switchers, agency-style volume", note: "Higher AI ceilings; ~6% of paying base, ~14% of revenue." },
  { plan: "Lifetime", price: "$149 once", target: "Loyal power users; viral surface", note: "Used as anchor; raises perceived value of subscriptions." },
];

const moats = [
  { h: "Vertical evaluation harness", d: "Each AI feature has a per-vertical eval set. Competitors release prompts; we release tested prompts." },
  { h: "ATS parser farm", d: "Tested against 15 real parsers — Workday, Greenhouse, Lever, iCIMS, more. Hard to replicate without infra investment." },
  { h: "Six tools, one workflow", d: "Outputs feed inputs. Switching cost rises with usage; no competitor offers the full chain." },
  { h: "Privacy by design", d: "No audio storage, no PII in analytics, GDPR + CCPA compliant. Enterprise & EDU partnerships unlocked." },
];

const stack = [
  { icon: Code2, name: "Next.js (App Router)", d: "Server-first React with edge rendering and route-level caching." },
  { icon: Brain, name: "OpenAI GPT-4 + custom prompts", d: "Per-feature evaluation harnesses gating quality regressions." },
  { icon: Database, name: "Prisma + PostgreSQL", d: "Type-safe schema, managed Postgres on Vercel/Neon." },
  { icon: Lock, name: "Lemon Squeezy", d: "Merchant-of-record handles tax, fraud, and global payments." },
];

export default function InvestorsPage() {
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
              "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.06), transparent 50%), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.05), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-12">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
              <Shield className="h-3.5 w-3.5 text-[#1A56DB]" /> Investor Relations · Confidential
            </span>
            <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
              Building the AI job-search platform for the next decade
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
              Launch CV is the first AI product to bundle resume building, JD alignment, ATS scoring, cover letter generation, interview prep, and voice input under one paid plan. Sustainable subscription economics. No ads. No data sale.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:investors@launch-cv.com"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
              >
                Contact founder
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="#deck"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
              >
                Browse the deck
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Traction · current snapshot</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                  <m.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[24px] font-bold leading-none tracking-tight text-[#0F172A]">{m.value}</p>
                  <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPPORTUNITY */}
      <section id="deck" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">The opportunity</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A category being rebuilt by AI — with one entrant taking the right shape
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunity.map((o) => (
              <RevealOnView key={o.h}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{o.h}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{o.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Business model</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Four tiers, one Lifetime anchor
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every plan includes every AI tool. Only the monthly ceilings change. Lifetime exists to anchor perceived value of the subscription tiers, not to maximize one-time revenue.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
            <div className="grid grid-cols-1 divide-y divide-[#E2E8F0] sm:grid-cols-[1fr_120px_1.4fr_1.4fr] sm:divide-x sm:divide-y-0">
              <div className="bg-[#FAFBFC] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Plan</div>
              <div className="bg-[#FAFBFC] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] sm:text-right">Price</div>
              <div className="bg-[#FAFBFC] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Target</div>
              <div className="bg-[#FAFBFC] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Notes</div>
            </div>
            {businessModel.map((row) => (
              <div key={row.plan} className="grid grid-cols-1 gap-1 border-t border-[#E2E8F0] px-5 py-4 sm:grid-cols-[1fr_120px_1.4fr_1.4fr] sm:gap-0 sm:px-0">
                <div className="text-[14px] font-semibold text-[#0F172A] sm:px-5 sm:py-4">{row.plan}</div>
                <div className="text-[14px] text-[#0F172A] sm:px-5 sm:py-4 sm:text-right">{row.price}</div>
                <div className="text-[13px] text-[#475569] sm:px-5 sm:py-4">{row.target}</div>
                <div className="text-[13px] text-[#475569] sm:px-5 sm:py-4">{row.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOATS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Defensibility</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Why this is hard to copy
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {moats.map((m) => (
              <RevealOnView key={m.h}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{m.h}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Technology</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Boring tech, predictable scale
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {stack.map((t) => (
              <RevealOnView key={t.name}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{t.name}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{t.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">Talk to the founder</h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Pitch deck, customer references, financial model, and DPA available on request. Email reply within one business day.
          </p>
          <a
            href="mailto:investors@launch-cv.com"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            <Mail className="h-4 w-4" />
            investors@launch-cv.com
          </a>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
