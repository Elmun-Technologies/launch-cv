import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, ArrowUpRight, Palette, Layers, Sparkles, Eye, ChevronRight } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Resume for Designers — A Portfolio's Best Friend",
  description:
    "Your portfolio shows the work. Your resume should land the interview. Launch CV writes design bullets that quantify impact, system thinking, and shipping speed — ATS-clean.",
  pathname: "/use-cases/designers",
  keywords: ["designer resume", "UX designer resume", "product designer resume ATS", "design portfolio resume", "Launch CV"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: absoluteUrl("/use-cases/designers"),
  name: "Resume for Designers | Launch CV",
};

const designKeywords = [
  "Design systems", "Figma", "Prototyping", "Tokens", "Accessibility (WCAG)", "User research",
  "Usability testing", "Information architecture", "Interaction design", "Motion", "Service design",
  "Critique", "Cross-functional", "Hand-off", "Pixel-perfect", "Brand", "Visual design", "Wireframing",
];

const examples = [
  { before: "redesigned the dashboard", after: "Led 6-week dashboard rework with PM + 3 engineers, lifting daily-active time-on-task by 41% (15.2 → 21.4 min) and cutting support tickets on related flows by 28%." },
  { before: "built design system", after: "Designed and shipped the v2 token library + 84 Figma components across web, iOS, Android — adopted by 9 product squads, cutting average ship time per feature from 18 → 11 days." },
  { before: "did user testing", after: "Ran weekly moderated tests (n = 6, 12 cycles) for the onboarding rebuild — surfaced 14 critical issues pre-ship; activation parity reached week-of-launch instead of post-mortem." },
];

export default function DesignersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF2F8] via-white to-[#F0FDFA] pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#DB2777] opacity-[0.12] blur-[140px]" />
          <div className="absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#0D9488] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DB2777]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#DB2777]">
              <Palette className="h-3.5 w-3.5" /> For Designers
            </span>
            <h1 className="mt-6 font-display text-[64px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[88px] lg:text-[108px]">
              Your portfolio<br />
              <span className="lc-mega-italic text-[#DB2777]">shows the work.</span><br />
              <span className="text-[#94A3B8]">Your resume lands the room.</span>
            </h1>
            <p className="mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              Most designers under-sell themselves on paper. We quantify your hand-off impact, system contributions, research depth, and shipping speed — without making it sound like you wrote bullets for a banker.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-7 py-4 text-[15px] font-bold text-white">
                Build my design resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features/resume-builder" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See Resume Builder <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              {/* portfolio polaroid stack */}
              <div className="absolute -right-4 top-4 hidden h-[85%] w-[90%] rotate-3 rounded-2xl bg-gradient-to-br from-pink-100 to-amber-100 sm:block" />
              <div className="absolute -left-2 -top-2 hidden h-[85%] w-[90%] -rotate-2 rounded-2xl bg-gradient-to-br from-teal-100 to-blue-100 sm:block" />
              <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.2)]">
                <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Design keyword library — pre-loaded</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {designKeywords.map((s) => (
                    <span key={s} className="lc-pill bg-[#0F172A] text-white">{s}</span>
                  ))}
                </div>
                <p className="mt-5 font-body text-[12px] leading-[1.7] text-[#475569]">
                  + 100 more across product, brand, motion, service design. AI selects the right subset per JD.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE QUANTIFY */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#DB2777]">Design impact, made legible</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Pixel-perfect bullets.<br />
                <span className="italic text-[#DB2777]">Recruiter-perfect</span> resume.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Layers, k: "System contributions", d: "Tokens added, components shipped, adoption across squads." },
              { i: Sparkles, k: "Ship velocity", d: "Concept → production timelines, hand-off quality, dev parity." },
              { i: Eye, k: "Research depth", d: "Tests run, participants, decisions changed, features killed." },
              { i: Palette, k: "Craft quality", d: "Accessibility scores, motion principles, design QA pass rate." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="lc-bento h-full bg-white p-6 ring-1 ring-[#E2E8F0]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-[#DB2777]">
                    <m.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-bold tracking-tight text-[#0F172A]">{m.k}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#DB2777]">3 real rewrites</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                What hiring designers<br />
                actually want to read.
              </h2>
            </div>
          </RevealOnView>

          <div className="space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-3xl border border-[#E2E8F0] bg-[#FAFAF7] p-6 sm:grid-cols-2 sm:p-7">
                  <div className="rounded-2xl bg-white p-5 ring-1 ring-red-100">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-red-600">Before</p>
                    <p className="mt-2 font-body text-[14px] text-[#475569]">&ldquo;{e.before}&rdquo;</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-white p-5 ring-1 ring-pink-200">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#DB2777]">After · AI rewrite</p>
                    <p className="mt-2 font-body text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO FRIENDLY */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <span className="lc-overline text-white/55">Portfolio-friendly</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[56px]">
                  Your portfolio is<br />
                  the <span className="lc-gradient-text-animated">main act.</span><br />
                  The resume opens the door.
                </h2>
                <p className="mt-6 max-w-[440px] font-body text-[15px] leading-[1.7] text-white/65">
                  Every Launch CV resume includes a dedicated, ATS-parseable Selected Work section. Live links, short context, the metric that mattered. The recruiter clicks. The portfolio takes over.
                </p>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-white/55">Selected work · auto-formatted</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { t: "Activation Funnel Rebuild", c: "stripe.com — Sr. PD · 2024", m: "+41% time-on-task · −28% tickets" },
                      { t: "Design System v2 (Tokens + 84 components)", c: "internal · 2023", m: "9 squads adopted · ship time 18 → 11 days" },
                      { t: "Onboarding Research Cycle (12 weeks)", c: "linear.app — Sr. PD · 2023", m: "n = 72 · 14 critical issues pre-ship" },
                    ].map((p) => (
                      <div key={p.t} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                        <p className="font-display text-[14px] font-bold text-white">{p.t}</p>
                        <p className="font-body text-[12px] text-white/55">{p.c}</p>
                        <p className="mt-2 font-mono text-[11px] text-emerald-300">{p.m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">More use cases</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#DB2777]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/software-engineers", t: "For Software Engineers", d: "Stack, on-call, scope, latency, throughput." },
              { href: "/use-cases/product-managers", t: "For Product Managers", d: "Roadmap wins, OKRs, A/B tests, stakeholders." },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#DB2777] hover:bg-[#FDF2F8]">
                <div className="flex-1">
                  <p className="font-display text-[18px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[14px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#94A3B8] transition group-hover:text-[#DB2777]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[64px]">
            The taste is yours.<br />
            <span className="lc-gradient-text-animated">Let the resume keep up.</span>
          </h2>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#0F172A]">
            Build my design resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
