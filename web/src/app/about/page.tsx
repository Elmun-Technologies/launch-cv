import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, ArrowUpRight, Target, Shield, Zap, Users, Code2, Database, Brain } from "lucide-react";
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
  { icon: Zap, title: "Speed & quality", d: "A real job search doesn&apos;t have time for slow tools. Five minutes, blank page to PDF, ATS-clean. Every time." },
  { icon: Users, title: "Users shape the product", d: "We talk to job seekers weekly. Roadmap priorities are decided by the inbox, not the dashboard." },
];

const techStack = [
  { icon: Code2, name: "Next.js (App Router)", d: "Server-first React with streaming, edge rendering, and route-level caching. Fast everywhere." },
  { icon: Brain, name: "OpenAI GPT-4 + custom prompts", d: "Each AI tool has its own evaluation harness. Quality regressions get caught before they ship." },
  { icon: Database, name: "Prisma + PostgreSQL", d: "Type-safe schema, managed Postgres, predictable migrations. Boring tech that doesn&apos;t break." },
];

const milestones = [
  { y: "2024", t: "Founded", d: "Started after watching one too many qualified friends lose interviews to ATS filtering." },
  { y: "2025", t: "Public launch", d: "First 1,000 paying users in 90 days. Featured in Product Hunt's resume category." },
  { y: "2026", t: "Six tools, one product", d: "Voice input, JD alignment, ATS scanner, cover letter, interview prep — all under one subscription." },
  { y: "Next", t: "Human review add-on", d: "Optional 1:1 reviews with vetted recruiters, layered onto the AI workflow." },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF7] text-[#0F172A]">
      <JsonLd data={aboutLd} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B0F19] pt-[104px] text-white">
        <div className="lc-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-[0.2] blur-[140px]" aria-hidden />
        <div className="pointer-events-none absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.18] blur-[120px]" aria-hidden />

        <div className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="lc-overline text-white/55">Our Story · Vol. 01</span>
              <h1 className="mt-4 font-display text-[64px] font-extrabold leading-[0.94] tracking-[-0.04em] sm:text-[88px] lg:text-[108px]">
                We built this<br />
                because <span className="lc-mega-italic text-white/90">hiring</span><br />
                <span className="lc-gradient-text-animated">is broken.</span>
              </h1>
              <p className="mt-7 max-w-[600px] font-body text-[18px] leading-[1.65] text-white/65 sm:text-[20px]">
                75% of resumes are rejected by automated software before any human sees them. The reason is rarely talent — it&apos;s formatting, keywords, and time. Launch CV is the tool we wished existed when our friends, ourselves, and our students were stuck on the wrong side of that filter.
              </p>
            </div>

            {/* Right — pull-quote card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                <p className="font-display text-[24px] font-bold leading-[1.4] text-white sm:text-[28px]">
                  &quot;A resume should reflect what you can do — not how well you fight an ATS parser.&quot;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] font-display text-[16px] font-bold text-white">
                    NE
                  </div>
                  <div>
                    <p className="font-body text-[14px] font-bold text-white">Nazir Elmurodov</p>
                    <p className="font-body text-[12px] text-white/55">Founder · Elmun Technologies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION — long-form editorial */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="lc-overline text-[#1A56DB]">Mission</span>
                <span className="lc-rule mt-3 block bg-[#1A56DB]" />
                <h2 className="mt-6 font-display text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[48px]">
                  Level the field<br />
                  between candidates<br />
                  and machines.
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-5 font-display text-[20px] leading-[1.55] text-[#1F2937] sm:text-[22px]">
                <p>
                  The hiring process has a problem that nobody talks about: <span className="bg-[#FEF08A] px-1">qualified people get filtered out by software</span> before any human ever reads their work. Not because they lack the skills. Because they lack the keywords, the format, the hours.
                </p>
                <p>
                  Launch CV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover letter generation, and interview prep — into one professional platform. We charge for it, because that&apos;s how we build something reliable, fast, and continuously improved. Not a freemium tool that monetizes your data instead.
                </p>
                <p className="text-[#475569]">
                  Our goal is brutally simple: give every job seeker the same advantage that candidates with $200/hour recruiters or $5,000 résumé writers have. Delivered by AI, in minutes, at the price of a small monthly subscription — or one Lifetime payment, if you&apos;d rather not think about it again.
                </p>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#1A56DB]">What we stand for</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[60px]">
                Four principles.<br />
                Carved into <span className="italic">every</span> decision.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v, i) => (
              <RevealOnView key={v.title}>
                <div className="lc-bento h-full bg-white p-7 ring-1 ring-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[40px] font-extrabold leading-none tracking-tight text-[#1A56DB]/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1A56DB]">
                      <v.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{v.title}</h3>
                  <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#475569]" dangerouslySetInnerHTML={{ __html: v.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#1A56DB]">Timeline</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Built in public.<br />
                <span className="italic">Funded by users.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="relative">
            <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-[#1A56DB] via-[#7C3AED] to-transparent sm:block" />
            <div className="space-y-6">
              {milestones.map((m) => (
                <RevealOnView key={m.t}>
                  <div className="relative flex gap-6 rounded-2xl border border-[#E2E8F0] bg-[#FAFAF7] p-6">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] font-display text-[14px] font-bold text-white ring-4 ring-white">
                      {m.y}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-[20px] font-bold tracking-tight text-[#0F172A]">{m.t}</h3>
                      <p className="mt-1.5 font-body text-[14px] leading-[1.7] text-[#475569]">{m.d}</p>
                    </div>
                  </div>
                </RevealOnView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-white/55">Under the hood</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[56px]">
                Boring tech.<br />
                <span className="lc-gradient-text-animated">Exciting outcomes.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-5 sm:grid-cols-3">
            {techStack.map((t) => (
              <RevealOnView key={t.name}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                  <t.icon className="h-6 w-6 text-[#60A5FA]" />
                  <h3 className="mt-5 font-display text-[20px] font-bold tracking-tight">{t.name}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-white/65">{t.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#1A56DB]">Team</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Small. Fast.<br />
                <span className="italic">Hands-on.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-6 sm:grid-cols-2">
            <RevealOnView>
              <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] font-display text-[24px] font-bold text-white shadow-[0_18px_40px_-10px_rgba(26,86,219,0.5)]">
                  NE
                </div>
                <h3 className="mt-6 font-display text-[24px] font-bold tracking-tight text-[#0F172A]">Nazir Elmurodov</h3>
                <p className="font-body text-[14px] font-bold text-[#1A56DB]">Founder · Building everything</p>
                <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#475569]">
                  Built Launch CV after watching hundreds of qualified candidates get filtered out by ATS. Obsessed with making hiring fairer through better tools — and faster feedback loops than any other resume product.
                </p>
              </div>
            </RevealOnView>
            <RevealOnView>
              <div className="rounded-3xl border-2 border-dashed border-[#E2E8F0] bg-white p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8FAFC] font-display text-[24px] font-bold text-[#94A3B8] ring-1 ring-[#E2E8F0]">
                  +
                </div>
                <h3 className="mt-6 font-display text-[24px] font-bold tracking-tight text-[#0F172A]">We&apos;re hiring</h3>
                <p className="font-body text-[14px] font-bold text-[#94A3B8]">Engineers, designers, recruiters</p>
                <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#475569]">
                  We&apos;re building a small, opinionated team. If you&apos;ve felt the friction of a modern job search and want to fix it for the next million people — email{" "}
                  <a href="mailto:hello@launch-cv.com" className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">hello@launch-cv.com</a>.
                </p>
              </div>
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A56DB] via-[#1E40AF] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Run a serious<br /><span className="italic">job search.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[480px] font-body text-[17px] leading-[1.65] text-white/85">
            Create an account, choose a plan, paste a JD. The whole hunt — match, write, score, send, practice — under one roof.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/pricing" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#1A56DB] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="lc-link-underline font-body text-[14px] font-bold text-white/80">
              Create account <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
