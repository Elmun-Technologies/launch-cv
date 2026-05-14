import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
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
  { icon: Target, title: "Results, not resumes", d: "We don&apos;t measure success by signups. We measure it by interview replies in your inbox." },
  { icon: Shield, title: "Honest AI", d: "Our AI never fabricates experience or numbers. It works with what you actually did — and tells your story sharper." },
  { icon: Zap, title: "Speed and quality", d: "Five minutes from blank page to PDF, ATS-clean. Every time." },
  { icon: Users, title: "Users shape the product", d: "We talk to job seekers weekly. Roadmap priorities are decided by the inbox, not the dashboard." },
];

const techStack = [
  { icon: Code2, name: "Next.js (App Router)", d: "Server-first React with streaming, edge rendering, and route-level caching." },
  { icon: Brain, name: "OpenAI GPT-4 + custom prompts", d: "Each AI tool has its own evaluation harness. Quality regressions get caught before they ship." },
  { icon: Database, name: "Prisma + PostgreSQL", d: "Type-safe schema, managed Postgres, predictable migrations." },
];

const milestones = [
  { y: "2024", t: "Founded", d: "Started after watching one too many qualified friends lose interviews to ATS filtering." },
  { y: "2025", t: "Public launch", d: "First 1,000 paying users in 90 days. Featured in Product Hunt&apos;s resume category." },
  { y: "2026", t: "Six tools, one product", d: "Voice input, JD alignment, ATS scanner, cover letter, interview prep — under one subscription." },
  { y: "Next", t: "Human review add-on", d: "Optional 1:1 reviews with vetted recruiters, layered onto the AI workflow." },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={aboutLd} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="lc-overline text-[#1A56DB]">Our story</p>
              <h1 className="mt-3 lc-hero-headline text-[#0F172A]">
                We built Launch CV because hiring is broken
              </h1>
              <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
                Roughly 75% of resumes are rejected by automated software before any human sees them. The reason is rarely talent — it&apos;s formatting, keywords, and time. Launch CV is the tool we wished existed when our friends, ourselves, and our students were stuck on the wrong side of that filter.
              </p>
            </div>

            <div className="lg:col-span-5">
              <figure className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
                <blockquote className="text-[18px] leading-[1.5] text-[#0F172A]">
                  &ldquo;A resume should reflect what you can do — not how well you fight an ATS parser.&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[#E2E8F0] pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[13px] font-semibold text-white">
                    NE
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A]">Nazir Elmurodov</p>
                    <p className="text-[12px] text-[#64748B]">Founder · Elmun Technologies</p>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="lc-overline text-[#1A56DB]">Mission</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Level the field between candidates and machines
                </h2>
              </div>
              <div className="space-y-5 text-[16px] leading-[1.7] text-[#334155] lg:col-span-8">
                <p>
                  The hiring process has a problem nobody talks about: qualified people get filtered out by software before any human ever reads their work. Not because they lack the skills — because they lack the keywords, the format, or the time.
                </p>
                <p>
                  Launch CV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover letter generation, and interview prep into one professional platform. We charge for it so we can build something reliable and continuously improved — not a freemium tool that monetizes your data.
                </p>
                <p className="text-[#475569]">
                  Our goal is simple: give every job seeker the same advantage that candidates with $200/hour recruiters or $5,000 résumé writers have — delivered by AI, in minutes, at the price of a small subscription.
                </p>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">What we stand for</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Four principles, carved into every decision
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <RevealOnView key={v.title}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: v.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Timeline</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built in public, funded by users
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 space-y-4">
            {milestones.map((m) => (
              <RevealOnView key={m.t}>
                <div className="flex gap-5 rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[13px] font-semibold text-[#1A56DB]">
                    {m.y}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[17px] font-semibold text-[#0F172A]">{m.t}</h3>
                    <p className="mt-1 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: m.d }} />
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Under the hood</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Boring tech, predictable outcomes
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {techStack.map((t) => (
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

      {/* TEAM */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Team</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Small, fast, hands-on
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <RevealOnView>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-7">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[20px] font-semibold text-white">
                  NE
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">Nazir Elmurodov</h3>
                <p className="text-[13px] font-medium text-[#1A56DB]">Founder · Building everything</p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#475569]">
                  Built Launch CV after watching hundreds of qualified candidates get filtered out by ATS. Obsessed with making hiring fairer through better tools.
                </p>
              </div>
            </RevealOnView>
            <RevealOnView>
              <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] bg-white p-7">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F5F9] text-[24px] font-semibold text-[#94A3B8]">
                  +
                </div>
                <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">We&apos;re hiring</h3>
                <p className="text-[13px] font-medium text-[#94A3B8]">Engineers, designers, recruiters</p>
                <p className="mt-3 text-[14px] leading-[1.65] text-[#475569]">
                  Building a small, opinionated team. If you&apos;ve felt the friction of a modern job search and want to fix it for the next million people —{" "}
                  <a href="mailto:hello@launch-cv.com" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                    hello@launch-cv.com
                  </a>
                  .
                </p>
              </div>
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Run a serious job search
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Create an account, choose a plan, paste your first JD. The whole hunt under one roof.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              View pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]">
              Create account
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
