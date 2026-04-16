import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Target, Shield, Zap, Users, Code2, Database, Brain } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "About Us",
  description:
    "Launch CV is a professional AI platform for serious job seekers. We combine resume building, JD alignment, ATS scoring, and interview prep in one product.",
  pathname: "/about",
  keywords: ["Launch CV", "about", "mission", "AI resume builder", "resume platform team"],
});

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Launch CV",
  url: absoluteUrl("/about"),
  description: "Learn about Launch CV — the AI-powered resume and job search platform.",
};

const values = [
  {
    icon: Target,
    title: "Results, Not Resumes",
    description: "We don't just help you build a resume — we help you get interviews. Every feature is measured by one outcome: more callbacks.",
    color: "bg-[#EFF6FF] text-[#1A56DB]",
  },
  {
    icon: Shield,
    title: "Honest AI",
    description: "Our AI never fabricates experience or metrics. It works with what you've actually done and presents it as compellingly as possible.",
    color: "bg-[#DCFCE7] text-[#15803D]",
  },
  {
    icon: Zap,
    title: "Speed & Quality",
    description: "A serious job search doesn't have time for slow tools. Launch CV is built for speed: from blank page to ATS-ready PDF in under 5 minutes.",
    color: "bg-[#EDE9FE] text-[#7C3AED]",
  },
  {
    icon: Users,
    title: "Users Shape the Product",
    description: "We talk to job seekers weekly. Feature priorities, UI changes, and AI improvements are driven directly by what real users tell us they need.",
    color: "bg-[#FFF7ED] text-[#C2410C]",
  },
];

const techStack = [
  { icon: Code2, name: "Next.js 16", description: "Server-first React framework with edge rendering, static generation, and built-in TypeScript." },
  { icon: Brain, name: "OpenAI GPT-4", description: "Advanced language models for resume analysis, JD alignment, bullet rewriting, and content generation." },
  { icon: Database, name: "Prisma + PostgreSQL", description: "Type-safe ORM with a managed PostgreSQL database. Reliable, fast, and scalable." },
];

const team = [
  {
    name: "Nazir Elmurodov",
    role: "Founder & CEO",
    bio: "Built Launch CV after watching hundreds of qualified candidates get filtered out by ATS. Obsessed with making job search fairer through better tools.",
    avatar: "NE",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={aboutLd} />
      <LandingNav />

      <main className="flex-1 pt-[72px]">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#0F172A] pb-20 pt-20 sm:pt-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-[-60px] top-[-60px] h-[400px] w-[400px] rounded-full bg-[#1A56DB] opacity-[0.15] blur-[100px]" />
            <div className="absolute bottom-[-40px] right-[-40px] h-[300px] w-[300px] rounded-full bg-[#7C3AED] opacity-[0.12] blur-[80px]" />
          </div>
          <div className="relative mx-auto max-w-[800px] px-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 font-body text-[12px] font-semibold text-white/80">
              Our Story
            </span>
            <h1 className="mt-6 font-display text-[40px] font-bold leading-[1.12] tracking-[-0.025em] text-white sm:text-[52px]">
              Built for people who take their job search seriously.
            </h1>
            <p className="mx-auto mt-5 max-w-[580px] font-body text-[17px] leading-[1.75] text-[#94A3B8]">
              75% of resumes never reach a human recruiter. Launch CV was built to fix that — with AI that aligns your resume to every job you apply for.
            </p>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="py-20">
          <div className="mx-auto max-w-[800px] px-6">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 sm:p-10">
              <p className="lc-eyebrow">Our Mission</p>
              <h2 className="lc-h2 mt-3 max-w-[520px]">Level the playing field between candidates and ATS.</h2>
              <div className="mt-6 space-y-4 font-body text-[16px] leading-[1.8] text-[#475569]">
                <p>
                  The hiring process has a serious problem: qualified candidates are filtered out by automated software before a human ever reads their resume. Not because they lack the skills — because they lack the keywords, the format, or the time to tailor 50 applications by hand.
                </p>
                <p>
                  Launch CV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover letter generation, and interview preparation into one professional platform. We charge for it because that's how we build something reliable, fast, and continuously improved — not a freemium tool that monetizes your data instead.
                </p>
                <p>
                  Our goal is simple: give you the same advantage that top candidates with professional resume writers or career coaches have — delivered by AI, in minutes, at a fraction of the cost.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-center">
              <p className="lc-eyebrow">What we stand for</p>
              <h2 className="lc-h2 mx-auto mt-3 max-w-[400px]">Our Values</h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {values.map((v) => (
                <div key={v.title} className="lc-card flex items-start gap-5 p-7">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.color}`}>
                    <v.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-[17px] font-bold text-[#0F172A]">{v.title}</h3>
                    <p className="mt-2 font-body text-[14px] leading-[1.7] text-[#64748B]">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-center">
              <p className="lc-eyebrow">Under the hood</p>
              <h2 className="lc-h2 mx-auto mt-3 max-w-[400px]">Technology</h2>
              <p className="mx-auto mt-3 max-w-[480px] font-body text-[15px] text-[#64748B]">
                Modern, scalable architecture built for speed, reliability, and developer transparency.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {techStack.map((t) => (
                <div key={t.name} className="lc-card p-7 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1A56DB]">
                    <t.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-display text-[16px] font-bold text-[#0F172A]">{t.name}</h3>
                  <p className="mt-2 font-body text-[13px] leading-relaxed text-[#64748B]">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="text-center">
              <p className="lc-eyebrow">Who we are</p>
              <h2 className="lc-h2 mx-auto mt-3 max-w-[400px]">The Team</h2>
            </div>
            <div className="mx-auto mt-12 max-w-[400px]">
              {team.map((m) => (
                <div key={m.name} className="lc-card p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] font-display text-[22px] font-bold text-white shadow-lg shadow-blue-500/20">
                    {m.avatar}
                  </div>
                  <h3 className="mt-5 font-display text-[20px] font-bold text-[#0F172A]">{m.name}</h3>
                  <p className="font-body text-[14px] font-semibold text-[#1A56DB]">{m.role}</p>
                  <p className="mt-3 font-body text-[14px] leading-[1.7] text-[#64748B]">{m.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-gradient-to-r from-[#1A56DB] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 text-center">
            <h2 className="font-display text-[28px] font-bold text-white sm:text-[34px]">
              Ready to run a serious job search?
            </h2>
            <p className="font-body text-[16px] text-white/80">
              Create an account, choose a plan, and build the resume that gets you hired.
            </p>
            <Link
              href="/pricing"
              className="mt-2 inline-flex items-center gap-2 rounded-[10px] bg-white px-7 py-3.5 font-body text-[15px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
