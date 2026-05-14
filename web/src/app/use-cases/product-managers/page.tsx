import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, Compass, BarChart3, Users, Target, Sparkles, Check } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Resume Builder for Product Managers",
  description:
    "PM hiring is signal-starved. Launch CV turns your roadmaps, OKRs, and A/B tests into the language recruiters scan for — quantified, baselined, ATS-clean.",
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
  "Cross-functional", "0→1", "Growth", "Pricing", "GTM", "Discovery", "User research", "North-star",
  "PLG", "Strategy", "Prioritization", "RICE", "JTBD",
];

const examples = [
  { before: "led product team", after: "Owned PM workstream for 3 squads (8 engineers, 2 designers) shipping the activation funnel rebuild — moved D7 activation from 31% → 48%." },
  { before: "did user research", after: "Ran 24 generative interviews + a 9-segment cluster analysis across 1,200 NPS responses — reframed our ICP, killed 2 planned features, accelerated 1." },
  { before: "worked on pricing", after: "Led pricing experiment moving Starter from $19 → $9/mo with a Lifetime tier — net-new MRR up 38%, conversion-to-paid up 2.4×, churn flat." },
];

export default function ProductManagersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 12% 0%, rgba(124,58,237,0.06), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Compass className="h-3.5 w-3.5 text-[#7C3AED]" /> For Product Managers
              </span>
              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Stop listing features. Start landing interviews.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                PM hiring is signal-starved: recruiters skim for roadmap scope, metric ownership, and cross-functional delta. Launch CV turns your wins into the exact language they screen for — quantified, baselined, ATS-clean.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(124,58,237,0.4)] transition hover:bg-[#6D28D9]"
                >
                  Build my PM resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/features/jd-alignment"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See JD Alignment
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">PM keyword library — pre-loaded</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pmKeywords.map((s) => (
                    <span key={s} className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-800 ring-1 ring-violet-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-[1.7] text-[#64748B]">
                  + 120 more across B2B, B2C, marketplace, and platform PM tracks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 DIMENSIONS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">Four dimensions of PM impact</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Scope, Metric, Delta, Baseline
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every AI-generated PM bullet contains all four. Senior reviewers scan for them in the first six seconds.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Users, k: "Scope", d: "Team size, surface area, customer segment, dollar value of owned product line." },
              { i: BarChart3, k: "Metric", d: "Activation, retention, conversion, NPS, revenue, latency — whichever you moved." },
              { i: Target, k: "Delta", d: "Before → after. Percentage and absolute. Annualized when honest." },
              { i: Sparkles, k: "Baseline", d: "vs. control, vs. prior quarter, vs. industry benchmark." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                    <m.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{m.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* DIFF EXAMPLES */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">3 real rewrites</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What hiring committees actually look for
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-xl border border-[#E2E8F0] bg-white p-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-red-100 bg-red-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Before</p>
                    <p className="mt-2 text-[14px] text-[#475569]">&ldquo;{e.before}&rdquo;</p>
                  </div>
                  <div className="rounded-lg border border-violet-100 bg-violet-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">After · AI rewrite</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">Sections built for PMs</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Not just Experience
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: "Shipped products", d: "Named launches with scope, segment, and outcome. Public ones link out." },
              { h: "Experiments run", d: "A/B tests, scope, lift, statistical significance. Failures honestly noted." },
              { h: "Discovery work", d: "User interviews, surveys, JTBD studies — quantified by reach and decisions changed." },
              { h: "Stakeholder mgmt", d: "C-suite reviews owned, cross-functional partnerships, board updates if applicable." },
              { h: "Talks and writing", d: "Public-speaking, blog posts, podcast appearances, internal RFCs cited externally." },
              { h: "Education and certs", d: "MBA, Reforge, Lenny&apos;s, PMC — issued and verified-link-included where possible." },
            ].map((s) => (
              <RevealOnView key={s.h}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#7C3AED]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{s.h}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: s.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">More use cases</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/software-engineers", t: "For Software Engineers", d: "Stack, on-call, scope, latency, throughput." },
              { href: "/use-cases/designers", t: "For Designers", d: "Portfolio links, system work, research, hand-off impact." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#CBD5E1]"
              >
                <div>
                  <p className="text-[16px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#7C3AED]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Your wins are real. Make the resume show it.
          </h2>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#6D28D9]"
          >
            Build my PM resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
