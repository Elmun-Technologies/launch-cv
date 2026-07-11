import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, Palette, Layers, Sparkles, Eye } from "lucide-react";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { FaqSection, buildFaqPageLd, type FaqEntry } from "@/components/faq-section";

export const metadata = buildMarketingMetadata({
  title: "Designer Resume Builder — Turn Portfolio Into Offers",
  description:
    "Your portfolio shows the work — your resume should land the interview. Launch CV writes ATS-clean design bullets that quantify impact and shipping speed.",
  pathname: "/use-cases/designers",
  image: DEFAULT_OG_IMAGE,
  keywords: ["designer resume", "UX designer resume", "product designer resume ATS", "design portfolio resume"],
});

const faqs: FaqEntry[] = [
  {
    q: "How should designers show a portfolio on a resume?",
    a: "Designers should link the portfolio from a dedicated, ATS-parseable Selected Work section that gives each project a live link, short context, and the metric that mattered. Launch CV auto-formats this section so a recruiter can click through, while the resume itself stays clean enough to pass ATS parsing.",
  },
  {
    q: "How do I write a resume for a UX or product designer role?",
    a: "Write a designer resume that quantifies hand-off impact, system contributions, research depth, and shipping speed instead of listing tools. Launch CV rewrites vague lines like redesigned the dashboard into measured outcomes such as lifting time-on-task 41% and cutting support tickets 28%, keeping the formatting ATS-clean throughout.",
  },
  {
    q: "How do I show design system work on a resume?",
    a: "Show design system work by quantifying tokens added, components shipped, and adoption across squads rather than saying built design system. Launch CV formats these contributions automatically, turning that phrase into shipped a v2 token library plus 84 Figma components adopted by 9 product squads, cutting ship time from 18 to 11 days.",
  },
  {
    q: "What keywords should a designer resume include?",
    a: "A designer resume should include the craft and process terms your target role names, such as design systems, Figma, prototyping, accessibility, user research, and hand-off. Launch CV pre-loads a design keyword library with over 100 terms across product, brand, motion, and service design, then aligns them to each posting.",
  },
  {
    q: "How do I quantify user research on a designer resume?",
    a: "Quantify user research by stating tests run, participants, decisions changed, and features killed instead of writing did user testing. Launch CV formats research depth for you, turning that line into ran 12 weekly moderated cycles that surfaced 14 critical issues before ship, so hiring designers see rigor at a glance.",
  },
  {
    q: "Does a designer really need a resume if I have a portfolio?",
    a: "Yes, designers still need a resume because it opens the door that the portfolio then walks through. Launch CV treats the portfolio as the main act and builds an ATS-clean resume with a Selected Work section, so recruiters and their parsers can find you before the visuals ever load.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: absoluteUrl("/use-cases/designers"),
      name: "Resume for Designers | Launch CV",
      description:
        "Launch CV writes ATS-clean design bullets that quantify impact, systems thinking, and shipping speed — so your resume lands the interview.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Use Cases", item: absoluteUrl("/use-cases") },
        { "@type": "ListItem", position: 3, name: "Designer Resume", item: absoluteUrl("/use-cases/designers") },
      ],
    },
    buildFaqPageLd(faqs),
  ],
};

const designKeywords = [
  "Design systems", "Figma", "Prototyping", "Tokens", "Accessibility (WCAG)", "User research",
  "Usability testing", "Information architecture", "Interaction design", "Motion", "Service design",
  "Critique", "Cross-functional", "Hand-off", "Pixel-perfect", "Brand", "Visual design",
];

const examples = [
  { before: "redesigned the dashboard", after: "Led 6-week dashboard rework with PM + 3 engineers, lifting daily-active time-on-task by 41% (15.2 → 21.4 min) and cutting support tickets by 28%." },
  { before: "built design system", after: "Designed and shipped the v2 token library + 84 Figma components across web, iOS, Android — adopted by 9 product squads, cutting average ship time from 18 → 11 days." },
  { before: "did user testing", after: "Ran weekly moderated tests (n = 6, 12 cycles) for the onboarding rebuild — surfaced 14 critical issues pre-ship; activation parity reached week-of-launch." },
];

export default function DesignersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 12% 0%, rgba(219,39,119,0.05), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Palette className="h-3.5 w-3.5 text-[#DB2777]" /> For Designers
              </span>
              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Your portfolio shows the work. Your resume lands the room.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Most designers under-sell themselves on paper. Launch CV quantifies your hand-off impact, system contributions, research depth, and shipping speed — without making it sound like a banker wrote it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(219,39,119,0.4)] transition hover:bg-[#BE185D]"
                >
                  Build my design resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/features/resume-builder"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See Resume Builder
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Design keyword library — pre-loaded</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {designKeywords.map((s) => (
                    <span key={s} className="rounded-md bg-pink-50 px-2 py-0.5 text-[11px] font-medium text-pink-800 ring-1 ring-pink-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-[1.7] text-[#64748B]">
                  + 100 more across product, brand, motion, and service design.
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
              <p className="lc-overline text-[#DB2777]">Design impact, made legible</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Pixel-perfect bullets, recruiter-perfect resume
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Layers, k: "System contributions", d: "Tokens added, components shipped, adoption across squads." },
              { i: Sparkles, k: "Ship velocity", d: "Concept-to-production timelines, hand-off quality, dev parity." },
              { i: Eye, k: "Research depth", d: "Tests run, participants, decisions changed, features killed." },
              { i: Palette, k: "Craft quality", d: "Accessibility scores, motion principles, design QA pass rate." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-700">
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
              <p className="lc-overline text-[#DB2777]">3 real rewrites</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What hiring designers actually want to read
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
                  <div className="rounded-lg border border-pink-100 bg-pink-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-700">After · AI rewrite</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO-FRIENDLY */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="lc-overline text-[#DB2777]">Portfolio-friendly</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Your portfolio is the main act. The resume opens the door.
                </h2>
                <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-[#475569]">
                  Every Launch CV resume includes a dedicated, ATS-parseable Selected Work section. Live links, short context, and the metric that mattered. The recruiter clicks. The portfolio takes over.
                </p>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Selected work · auto-formatted</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { t: "Activation Funnel Rebuild", c: "stripe.com — Sr. PD · 2024", m: "+41% time-on-task · −28% tickets" },
                      { t: "Design System v2 (Tokens + 84 components)", c: "internal · 2023", m: "9 squads adopted · ship time 18 → 11 days" },
                      { t: "Onboarding Research Cycle", c: "linear.app — Sr. PD · 2023", m: "n = 72 · 14 critical issues pre-ship" },
                    ].map((p) => (
                      <div key={p.t} className="rounded-lg bg-[#FAFBFC] p-4 ring-1 ring-[#E2E8F0]">
                        <p className="text-[14px] font-semibold text-[#0F172A]">{p.t}</p>
                        <p className="text-[12px] text-[#64748B]">{p.c}</p>
                        <p className="mt-1 font-mono text-[11px] text-emerald-700">{p.m}</p>
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
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">More use cases</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/software-engineers", t: "For Software Engineers", d: "Stack, on-call, scope, latency, throughput." },
              { href: "/use-cases/product-managers", t: "For Product Managers", d: "Roadmap wins, OKRs, A/B tests, stakeholders." },
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
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#DB2777]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            The taste is yours. Let the resume keep up.
          </h2>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#BE185D]"
          >
            Build my design resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <FaqSection items={faqs} accent="#DB2777" />

      <LandingFooter />
    </div>
  );
}
