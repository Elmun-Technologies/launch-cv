import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, ArrowUpRight, BarChart3, Compass, Users, Target, ChevronRight, Sparkles } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Resume for Product Managers — Roadmap Wins. Quantified. ATS-Clean.",
  description:
    "Stop listing features. Start landing PM interviews. AI turns your roadmaps, OKRs, and A/B tests into the bullets hiring managers screen for.",
  pathname: "/use-cases/product-managers",
  keywords: ["product manager resume", "PM resume ATS", "product management resume AI", "Launch CV"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: absoluteUrl("/use-cases/product-managers"),
  name: "Resume for Product Managers | Launch CV",
};

const pmKeywords = [
  "Roadmap", "OKRs", "A/B testing", "Funnel optimization", "Activation", "Retention", "Stakeholder mgmt",
  "Cross-functional", "0→1", "Growth", "Pricing", "GTM", "Discovery", "User research", "North-star metric",
  "PLG", "Enterprise sales", "Strategy", "Prioritization", "RICE", "JTBD",
];

const examples = [
  { before: "led product team", after: "Owned PM workstream for 3 squads (8 engineers, 2 designers, 1 PM-in-training) shipping the activation funnel rebuild — moved D7 activation from 31% → 48%." },
  { before: "did user research", after: "Ran 24 generative interviews + a 9-segment cluster analysis across 1,200 NPS responses — output reframed our ICP, killed 2 planned features, accelerated 1." },
  { before: "worked on pricing", after: "Led pricing experiment moving Starter from $19 → $9/mo with a Lifetime tier added — net-new MRR up 38%, conversion-to-paid up 2.4×, churn flat." },
];

export default function ProductManagersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] to-white pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#7C3AED] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#1A56DB] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C3AED]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#7C3AED]">
              <Compass className="h-3.5 w-3.5" /> For Product Managers
            </span>
            <h1 className="mt-6 font-display text-[64px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[88px] lg:text-[108px]">
              Stop listing<br />
              <span className="lc-strike text-[#94A3B8]">features.</span><br />
              <span className="lc-mega-italic text-[#7C3AED]">Start landing</span> interviews.
            </h1>
            <p className="mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              PM hiring is signal-starved: recruiters skim for roadmap scope, metric ownership, and cross-functional delta. Launch CV turns your wins into the exact language they screen for — quantified, baselined, ATS-clean.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(124,58,237,0.7)]">
                Build my PM resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features/jd-alignment" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See JD Alignment <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(124,58,237,0.3)]">
              <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">PM keyword library — pre-loaded</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {pmKeywords.map((s) => (
                  <span key={s} className="lc-pill bg-[#F3E8FF] text-[#6D28D9]">{s}</span>
                ))}
              </div>
              <p className="mt-5 font-body text-[12px] leading-[1.7] text-[#94A3B8]">
                + 120 more across B2B, B2C, marketplace, platform PM tracks. AI picks the right subset per JD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE QUANTIFY */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#7C3AED]">Four dimensions of PM impact</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Scope. Metric. Delta.<br />
                <span className="italic text-[#7C3AED]">Baseline.</span>
              </h2>
              <p className="mt-5 max-w-[560px] font-body text-[16px] leading-[1.7] text-[#475569]">
                Every AI-generated PM bullet contains all four. Senior reviewers scan for them in the first 6 seconds.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Users, k: "Scope", d: "Team size, surface area, customer segment, dollar value of owned product line." },
              { i: BarChart3, k: "Metric", d: "Activation, retention, conversion, NPS, revenue, latency — whichever you actually moved." },
              { i: Target, k: "Delta", d: "Before → after. Percentage and absolute. Annualized when honest." },
              { i: Sparkles, k: "Baseline", d: "vs. control, vs. prior quarter, vs. industry benchmark. Anchors make the win believable." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="lc-bento h-full bg-[#FAFAF7] p-6 ring-1 ring-[#E2E8F0]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#7C3AED]">
                    <m.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{m.k}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-white/55">3 real rewrites · same role</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[56px]">
                What hiring committees<br />
                <span className="lc-gradient-text-animated">actually look for.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:grid-cols-2 sm:p-7">
                  <div className="rounded-2xl bg-red-500/10 p-5 ring-1 ring-red-500/20">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-red-300">Before</p>
                    <p className="mt-2 font-body text-[14px] text-white/65">&ldquo;{e.before}&rdquo;</p>
                  </div>
                  <div className="rounded-2xl bg-violet-500/10 p-5 ring-1 ring-violet-400/30">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-violet-300">After · AI rewrite</p>
                    <p className="mt-2 font-body text-[14px] leading-[1.6] text-white">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#7C3AED]">Sections built for PMs</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Not just Experience.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: "Shipped products", d: "Named launches with scope, segment, and outcome. Public ones link out." },
              { h: "Experiments run", d: "A/B tests, scope, lift, statistical significance. Failures honestly noted." },
              { h: "Discovery work", d: "User interviews, surveys, JTBD studies — quantified by reach and decisions changed." },
              { h: "Stakeholder mgmt", d: "C-suite reviews owned, cross-functional partnerships, board updates if applicable." },
              { h: "Talks & writing", d: "Public-speaking, blog posts, podcast appearances, internal RFCs cited externally." },
              { h: "Education & certs", d: "MBA, Reforge, Lenny's, PMC — issued and verified-link-included where possible." },
            ].map((s) => (
              <RevealOnView key={s.h}>
                <div className="lc-bento h-full bg-white p-6 ring-1 ring-[#E2E8F0]">
                  <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0F172A]">{s.h}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">More use cases</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#7C3AED]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/software-engineers", t: "For Software Engineers", d: "Stack, on-call, scope, latency, throughput." },
              { href: "/use-cases/designers", t: "For Designers", d: "Portfolio links, system work, research, hand-off impact." },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#7C3AED] hover:bg-[#FAF5FF]">
                <div className="flex-1">
                  <p className="font-display text-[18px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[14px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#94A3B8] transition group-hover:text-[#7C3AED]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[64px]">
            Your wins are real.<br />
            <span className="italic text-violet-200">Make the resume show it.</span>
          </h2>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#7C3AED]">
            Build my PM resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
