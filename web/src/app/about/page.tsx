import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/motion-reveal";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStats } from "@/components/about/about-stats";
import { AboutTransformation } from "@/components/about/about-transformation";
import { AboutTools } from "@/components/about/about-tools";
import { ArrowRight, Target, Shield, Zap, Users, Code2, Database, Brain } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "About — The Story Behind Launch CV",
  description:
    "Launch CV exists to level the playing field between job seekers and Applicant Tracking Systems. Built by people who got tired of watching qualified candidates lose to format errors.",
  pathname: "/about",
  keywords: ["Launch CV", "about", "mission", "AI resume builder", "resume platform team"],
});

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Launch CV",
  url: absoluteUrl("/about"),
  description: "The story behind Launch CV — built to level the playing field between candidates and ATS.",
};

const values = [
  {
    icon: Target,
    title: "Results, not resumes",
    d: "We don’t measure success by signups. We measure it by interview replies in your inbox.",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Honest AI",
    d: "Our AI never fabricates experience or numbers. It works with what you actually did — and tells your story sharper.",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "Speed and quality",
    d: "Five minutes from blank page to PDF, ATS-clean. Every time.",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: Users,
    title: "Users shape the product",
    d: "We talk to job seekers weekly. Roadmap priorities are decided by the inbox, not the dashboard.",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
];

const techStack = [
  { icon: Code2, name: "Next.js (App Router)", d: "Server-first React with streaming, edge rendering, and route-level caching." },
  { icon: Brain, name: "OpenAI GPT-4 + custom prompts", d: "Each AI tool has its own evaluation harness. Quality regressions get caught before they ship." },
  { icon: Database, name: "Prisma + PostgreSQL", d: "Type-safe schema, managed Postgres, predictable migrations." },
];

const milestones = [
  { y: "2024", t: "Founded", d: "Started after watching one too many qualified friends lose interviews to ATS filtering." },
  { y: "2025", t: "Public launch", d: "First 1,000 paying users in 90 days. Featured in Product Hunt’s resume category." },
  { y: "2026", t: "Six tools, one product", d: "Voice input, JD alignment, ATS scanner, cover letter, interview prep — under one subscription." },
  { y: "Next", t: "Human review add-on", d: "Optional 1:1 reviews with vetted recruiters, layered onto the AI workflow." },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={aboutLd} />
      <LandingNav />

      {/* HERO */}
      <AboutHero />

      {/* STATS STRIP */}
      <AboutStats />

      {/* TRANSFORMATION (before/after visual) */}
      <AboutTransformation />

      {/* SIX TOOLS BENTO */}
      <AboutTools />

      {/* MISSION */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <MotionReveal>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="lc-overline text-[#1A56DB]">Mission</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Level the field between candidates and machines
                </h2>
              </div>
              <div className="space-y-5 text-[16px] leading-[1.7] text-[#334155] lg:col-span-8">
                <p>
                  The hiring process has a problem nobody talks about: qualified people get filtered out by software
                  before any human ever reads their work. Not because they lack the skills — because they lack the
                  keywords, the format, or the time.
                </p>
                <p>
                  Launch CV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover
                  letter generation, and interview prep into one professional platform. We charge for it so we can build
                  something reliable and continuously improved — not a freemium tool that monetizes your data.
                </p>
                <p className="text-[#475569]">
                  Our goal is simple: give every job seeker the same advantage that candidates with $200/hour recruiters
                  or $5,000 résumé writers have — delivered by AI, in minutes, at the price of a small subscription.
                </p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">What we stand for</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Four principles, carved into every decision
              </h2>
            </div>
          </MotionReveal>

          <MotionStagger className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <MotionItem key={v.title} className="h-full">
                <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.18)]">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.bg} ${v.text}`}>
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-[#475569]">{v.d}</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[860px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Timeline</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built in public, funded by users
              </h2>
            </div>
          </MotionReveal>

          <div className="relative mt-12 pl-8">
            {/* connecting line */}
            <span
              className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#1A56DB] via-[#7C3AED] to-[#E2E8F0]"
              aria-hidden
            />
            <MotionStagger className="space-y-6">
              {milestones.map((m) => (
                <MotionItem key={m.t}>
                  <div className="relative">
                    <span className="absolute -left-[29px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] shadow-sm" aria-hidden>
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(15,23,42,0.18)]">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-bold text-[#1A56DB]">
                          {m.y}
                        </span>
                        <h3 className="text-[17px] font-semibold text-[#0F172A]">{m.t}</h3>
                      </div>
                      <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                    </div>
                  </div>
                </MotionItem>
              ))}
            </MotionStagger>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Under the hood</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Boring tech, predictable outcomes
              </h2>
            </div>
          </MotionReveal>

          <MotionStagger className="mt-12 grid gap-5 sm:grid-cols-3">
            {techStack.map((t) => (
              <MotionItem key={t.name} className="h-full">
                <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.15)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{t.name}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{t.d}</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Team</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Small, fast, hands-on</h2>
            </div>
          </MotionReveal>

          <MotionStagger className="mt-12 grid gap-5 sm:grid-cols-2">
            <MotionItem className="h-full">
              <div className="h-full rounded-2xl border border-[#E2E8F0] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.15)]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[20px] font-semibold text-white shadow-sm">
                  NE
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">Nazir Elmurodov</h3>
                <p className="text-[13px] font-medium text-[#1A56DB]">Founder · Building everything</p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#475569]">
                  Built Launch CV after watching hundreds of qualified candidates get filtered out by ATS. Obsessed with
                  making hiring fairer through better tools.
                </p>
              </div>
            </MotionItem>
            <MotionItem className="h-full">
              <div className="h-full rounded-2xl border-2 border-dashed border-[#E2E8F0] bg-white p-7">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F5F9] text-[24px] font-semibold text-[#94A3B8]">
                  +
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">We&apos;re hiring</h3>
                <p className="text-[13px] font-medium text-[#94A3B8]">Engineers, designers, recruiters</p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#475569]">
                  Building a small, opinionated team. If you&apos;ve felt the friction of a modern job search and want to
                  fix it for the next million people —{" "}
                  <a href="mailto:hello@launch-cv.com" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                    hello@launch-cv.com
                  </a>
                  .
                </p>
              </div>
            </MotionItem>
          </MotionStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-[1000px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] px-6 py-16 text-center shadow-[0_30px_60px_-25px_rgba(26,86,219,0.5)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.2), transparent 40%)",
            }}
          />
          <div className="relative">
            <h2 className="text-[28px] font-bold tracking-tight text-white sm:text-[34px]">
              Run a serious job search
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-white/85">
              Create an account, choose a plan, paste your first JD. The whole hunt under one roof.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-[14px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.02]"
              >
                Start free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="text-[14px] font-semibold text-white/90 transition hover:text-white">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
