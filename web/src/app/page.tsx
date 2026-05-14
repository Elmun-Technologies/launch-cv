import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Star,
  Target,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  Mic,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "AI Resume Builder & Job Search Copilot",
  description:
    "Paste a job description — Launch CV rewrites your resume, scores ATS fit, and writes your cover letter. Real interviews. Real offers. In real days.",
  pathname: "/",
  keywords: ["Launch CV", "AI resume builder", "ATS resume", "JD alignment", "cover letter AI", "interview prep"],
});

const homeLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Launch CV — AI Resume Builder & Job Search Copilot",
      description:
        "Tailored resumes, ATS scoring, JD alignment, cover letters, and interview prep for serious job seekers.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "Launch CV", url: getSiteUrl() },
    },
  ],
};

const featureGrid = [
  {
    href: "/features/jd-alignment",
    eyebrow: "01 / Match",
    title: "JD Alignment",
    desc: "Paste a job ad. Get a side-by-side gap map and AI-rewritten bullets. Score climbs from 42% → 91% live.",
    icon: Target,
    accent: "bg-blue-50 text-blue-700",
    span: "lg:col-span-2",
  },
  {
    href: "/features/ats-score",
    eyebrow: "02 / Score",
    title: "ATS Scanner",
    desc: "Workday, Greenhouse, Lever — every parser, simulated. 12 issue checks. One-click fix list.",
    icon: BarChart3,
    accent: "bg-orange-50 text-orange-700",
    span: "",
  },
  {
    href: "/features/resume-builder",
    eyebrow: "03 / Write",
    title: "AI Resume Builder",
    desc: "12 ATS-tested templates. Plain-English in. Quantified, professional bullets out. 5-minute build.",
    icon: FileText,
    accent: "bg-violet-50 text-violet-700",
    span: "",
  },
  {
    href: "/features/cover-letter",
    eyebrow: "04 / Send",
    title: "Cover Letter Generator",
    desc: "Pulls the company mission, tech stack, and hiring manager tone. Personalized letter in 60 seconds.",
    icon: Mail,
    accent: "bg-teal-50 text-teal-700",
    span: "lg:col-span-2",
  },
  {
    href: "/features/interview-prep",
    eyebrow: "05 / Practice",
    title: "Interview Prep",
    desc: "200+ role-specific questions from your resume and the JD. Scored answers. Model responses.",
    icon: MessageSquare,
    accent: "bg-emerald-50 text-emerald-700",
    span: "",
  },
  {
    href: "/features/voice-input",
    eyebrow: "06 / Speak",
    title: "Voice Input",
    desc: "Talk like you would to a friend. AI turns it into resume-grade bullet points. No blank page.",
    icon: Mic,
    accent: "bg-pink-50 text-pink-700",
    span: "",
  },
];

const testimonials = [
  { name: "Sarah K.", role: "Software Engineer → Stripe", quote: "Zero interviews in 3 months. Four interviews in one week after Launch CV. The JD matching is unreal.", rating: 5 },
  { name: "Marcus T.", role: "Product Manager → Notion", quote: "ATS score went 38 → 93. Within two weeks I had three offers. The fixes were embarrassingly obvious in hindsight.", rating: 5 },
  { name: "Priya N.", role: "Marketing Lead → HubSpot", quote: "The cover letter generator writes better letters than I do. Two hours saved per application. Not an exaggeration.", rating: 5 },
  { name: "David L.", role: "Operations Manager", quote: "Voice input is the only way I write bullets now. Speak the story, get a quantified resume line back.", rating: 5 },
  { name: "Emma R.", role: "UX Designer (career switch)", quote: "Career changer here. Launch CV told me exactly which keywords I was missing for the new field. Hired in 6 weeks.", rating: 5 },
  { name: "James O.", role: "Data Analyst", quote: "The AI mock interviews ruined every bad coaching course I've ever paid for. Cheaper. Better. Faster.", rating: 5 },
];

const faqs = [
  { q: "Is there a free plan?", a: "No — Launch CV is a paid professional product. AI features require an active plan (Starter, Professional, Elite, or Lifetime). Create an account to manage billing; checkout unlocks the AI." },
  { q: "What is ATS and why does it matter?", a: "Applicant Tracking Systems scan and filter resumes before any human sees them. 75% of resumes are rejected by ATS. Launch CV is tested against the 15 most common platforms — Workday, Greenhouse, Lever, iCIMS and more." },
  { q: "What file formats can I download?", a: "PDF and DOCX — both ATS-clean. We also expose plain text for email pasting or LinkedIn import." },
  { q: "Is my data safe and private?", a: "Yes. 256-bit encryption, GDPR + CCPA compliant, and we never sell user data. Voice audio is processed in-memory and discarded immediately after transcription." },
  { q: "How is this different from other resume builders?", a: "We aren't a template gallery. We pair the builder with JD alignment, ATS scoring, cover letters and interview prep — under one paid plan with predictable AI limits." },
  { q: "How long does a real resume take?", a: "Most users finish a polished, ATS-tested PDF in under 5 minutes — with AI suggestions, real-time preview, and zero formatting tinkering." },
  { q: "Does it work for all industries?", a: "Yes — 12 templates across tech, finance, healthcare, marketing, design, operations and management. The AI is calibrated per vertical." },
  { q: "What is the Lifetime plan?", a: "One payment of $149, no renewals. Generous monthly fair-use AI caps included. Pay once, keep using forever." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF7] text-[#0F172A]">
      <JsonLd data={homeLd} />
      <LandingNav />

      {/* ═══════════════════════════════════════
          1. EDITORIAL HERO (dark, mega type)
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0B0F19] pt-[88px] text-white">
        {/* subtle grid + glow */}
        <div className="lc-grid-bg pointer-events-none absolute inset-0 opacity-[0.5]" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="lc-blob-1 absolute -left-32 top-10 h-[520px] w-[520px] rounded-full bg-[#1A56DB] opacity-[0.22] blur-[140px]" />
          <div className="lc-blob-2 absolute -right-24 top-40 h-[420px] w-[420px] rounded-full bg-[#7C3AED] opacity-[0.20] blur-[140px]" />
          <div className="lc-blob-3 absolute bottom-0 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-[#0D9488] opacity-[0.15] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-32 lg:pt-24">
          {/* LEFT: massive editorial headline */}
          <div className="lg:col-span-7">
            <div className="lc-motion-fade flex items-center gap-3">
              <span className="lc-overline text-white/60">Issue №25 · Spring 2026</span>
              <span className="lc-rule" />
              <span className="lc-overline text-white/40">The Job Search, Rebuilt</span>
            </div>

            <h1 className="lc-motion-fade lc-s2 mt-6 font-display font-extrabold leading-[0.92] tracking-[-0.045em] text-white text-[64px] sm:text-[88px] lg:text-[112px]">
              Stop applying.
              <br />
              <span className="lc-mega-italic text-white/90">Start</span>{" "}
              <span className="lc-gradient-text-animated">getting hired.</span>
            </h1>

            <p className="lc-motion-fade lc-s3 mt-8 max-w-[560px] font-body text-[18px] leading-[1.65] text-white/70 sm:text-[20px]">
              Launch CV is the AI job-search workroom for people who treat hiring like a project — not a hobby.
              Paste a job ad. Get the resume, the cover letter, the interview prep — written, scored, and ready in minutes.
            </p>

            <div className="lc-motion-fade lc-s4 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-[#0B0F19] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)]"
              >
                See pricing & start <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#showcase"
                className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-semibold text-white/80"
              >
                Watch the workflow <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="lc-motion-fade lc-s5 mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-white/55">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
                <span className="ml-2 font-semibold text-white">4.9/5</span>
                <span>from 2,400+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
                <span>Tested on 15 ATS engines</span>
              </div>
              <div className="hidden items-center gap-2 md:inline-flex">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#60A5FA]" />
                <span>Pay once · Lifetime available</span>
              </div>
            </div>
          </div>

          {/* RIGHT: stacked resume + ATS callouts */}
          <div className="relative lg:col-span-5">
            <div className="lc-motion-fade lc-s5 relative">
              {/* annotation chips */}
              <div className="absolute -left-2 -top-4 z-20 hidden lg:block">
                <div className="lc-glow-ring rounded-2xl bg-[#0F172A]/80 px-3 py-2 backdrop-blur">
                  <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/60">Live score</p>
                  <p className="mt-0.5 font-display text-[22px] font-bold text-[#34D399]">94 / 100</p>
                </div>
              </div>
              <div className="absolute -right-3 top-32 z-20 hidden lg:block">
                <div className="rotate-3 rounded-2xl bg-[#7C3AED] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(124,58,237,0.6)]">
                  <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">Keywords</p>
                  <p className="font-display text-[16px] font-bold text-white">+ 14 matched</p>
                </div>
              </div>

              {/* layered resume mockup */}
              <div className="relative">
                {/* back card */}
                <div className="absolute -right-4 top-6 hidden h-[88%] w-[92%] rotate-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur sm:block" />
                {/* front mockup */}
                <div className="lc-float relative lc-window rotate-[-2deg]">
                  <div className="lc-window-bar">
                    <span className="lc-window-dot bg-[#FF5F57]" />
                    <span className="lc-window-dot bg-[#FEBC2E]" />
                    <span className="lc-window-dot bg-[#28C840]" />
                    <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">resume_v3_final.pdf</span>
                  </div>
                  <div className="bg-white p-5 text-[#0F172A]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-[18px] font-bold leading-tight">Sarah Khan</p>
                        <p className="mt-0.5 font-body text-[11px] font-semibold text-[#475569]">Senior Software Engineer · NYC</p>
                        <div className="mt-1 flex gap-2 text-[10px] text-[#64748B]">
                          <span>sarah@email.com</span><span>·</span><span>linkedin.com/in/sarahk</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                        <span className="font-body text-[10px] font-bold text-[#15803D]">ATS 94%</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A56DB]">Experience</p>
                      <p className="mt-2 font-body text-[12px] font-bold text-[#0F172A]">Senior Engineer · Stripe</p>
                      <p className="font-body text-[10px] text-[#94A3B8]">Jun 2022 — Present</p>
                      <ul className="mt-2 space-y-1.5 font-body text-[11px] leading-snug text-[#334155]">
                        <li className="flex gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#1A56DB]" />
                          <span><span className="lc-highlight-swipe">Led migration of 3 SaaS systems</span>, reducing deploy time by 40%.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#1A56DB]" />
                          <span>Shipped 12 features, lifting retention by <span className="font-bold text-[#1A56DB]">34%</span> over 2 quarters.</span>
                        </li>
                        <li className="flex gap-1.5">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#1A56DB]" />
                          <span>Owned $2M ARR product line with 8 engineers across 2 timezones.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4">
                      <p className="font-body text-[10px] font-bold uppercase tracking-[0.1em] text-[#1A56DB]">Skills</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {["TypeScript", "Go", "Postgres", "AWS", "K8s", "GraphQL"].map((k) => (
                          <span key={k} className="lc-pill bg-[#F1F5F9] text-[#334155]">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* marquee logo strip — at bottom of hero, contrasting */}
        <div className="relative border-t border-white/10 bg-black/40 py-7">
          <p className="mb-4 px-6 text-center font-body text-[11px] uppercase tracking-[0.18em] text-white/40">
            Used by people now at
          </p>
          <div className="overflow-hidden">
            <div className="lc-marquee-slow">
              {[...Array(2)].map((_, p) => (
                <div key={p} className="flex items-center gap-14 px-7">
                  {["Stripe", "Notion", "Linear", "HubSpot", "Vercel", "Figma", "Airbnb", "Shopify", "Datadog", "OpenAI", "Anthropic", "Ramp"].map((n) => (
                    <span key={n} className="shrink-0 font-display text-[20px] font-bold tracking-tight text-white/35">
                      {n}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. EDITORIAL PROBLEM STATEMENT
          ═══════════════════════════════════════ */}
      <section className="bg-[#FAFAF7] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
              <div className="lg:col-span-4">
                <span className="lc-overline text-[#1A56DB]">A Note from the Editors</span>
                <span className="lc-rule mt-3 block bg-[#1A56DB]" />
              </div>
              <div className="lg:col-span-8">
                <h2 className="font-display text-[40px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px] lg:text-[64px]">
                  Hiring isn&apos;t hard because{" "}
                  <span className="bg-[#FEF08A] px-2">you aren&apos;t qualified.</span>{" "}
                  It&apos;s hard because nobody{" "}
                  <span className="italic">reads</span> your resume.
                </h2>
                <p className="mt-7 max-w-[640px] font-body text-[18px] leading-[1.75] text-[#475569]">
                  Recruiters spend 7 seconds per CV. Applicant Tracking Systems filter out 75% before any human glance.
                  The problem isn&apos;t your career — it&apos;s the format, the keywords, and the time it takes to tailor 50 applications by hand.
                  Launch CV fixes all three. Faster than you can finish your coffee.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href="/features" className="lc-link-underline font-body text-[14px] font-bold text-[#0F172A]">
                    See the toolkit <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className="lc-link-underline font-body text-[14px] font-bold text-[#1A56DB]">
                    View pricing <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. BENTO SHOWCASE
          ═══════════════════════════════════════ */}
      <section id="showcase" className="relative bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <span className="lc-overline text-[#1A56DB]">The Toolkit</span>
              <h2 className="mt-3 font-display text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Six AI tools.<br />One job search.
              </h2>
            </div>
            <Link href="/features" className="lc-link-underline hidden font-body text-[14px] font-bold text-[#0F172A] sm:inline-flex">
              All features <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <RevealOnView>
            <div className="grid gap-5 lg:grid-cols-3">
              {featureGrid.map((f, i) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`lc-bento group relative flex flex-col justify-between border border-[#E5E7EB] bg-white p-7 ${f.span}`}
                  style={{
                    minHeight: f.span ? 280 : 240,
                    backgroundImage:
                      i % 3 === 0
                        ? "radial-gradient(circle at 88% 12%, rgba(26,86,219,0.08), transparent 38%)"
                        : i % 3 === 1
                        ? "radial-gradient(circle at 12% 88%, rgba(124,58,237,0.08), transparent 38%)"
                        : "radial-gradient(circle at 50% 100%, rgba(13,148,136,0.08), transparent 42%)",
                  }}
                >
                  <div>
                    <p className="lc-overline text-[#94A3B8]">{f.eyebrow}</p>
                    <h3 className="mt-3 font-display text-[26px] font-bold leading-tight tracking-tight text-[#0F172A]">
                      {f.title}
                    </h3>
                    <p className="mt-3 max-w-[420px] font-body text-[14px] leading-[1.65] text-[#475569]">{f.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.accent}`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                    <span className="inline-flex items-center gap-1 font-body text-[13px] font-bold text-[#0F172A] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
                      Read more <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. STATS WALL (dark — uses HomeClient counters)
          ═══════════════════════════════════════ */}
      <HomeClient />

      {/* ═══════════════════════════════════════
          5. WORKFLOW — EDITORIAL 3-ACT
          ═══════════════════════════════════════ */}
      <section className="bg-[#FAFAF7] py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="text-center">
              <span className="lc-overline text-[#1A56DB]">How It Works · 3 Acts</span>
              <h2 className="mx-auto mt-4 max-w-[680px] font-display text-[42px] font-bold leading-[1.08] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                A polished application, in less time than a coffee break.
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-16 space-y-20">
            {[
              {
                step: "Act 01",
                title: "Bring your raw material",
                copy: "Paste an existing resume, type your experience plainly, or just speak it. No styling, no formatting, no anxiety. We meet you wherever your job history lives.",
                badge: "You",
                badgeClass: "bg-[#EFF6FF] text-[#1A56DB]",
                visual: (
                  <div className="lc-window">
                    <div className="lc-window-bar"><span className="lc-window-dot bg-[#FF5F57]"/><span className="lc-window-dot bg-[#FEBC2E]"/><span className="lc-window-dot bg-[#28C840]"/></div>
                    <div className="grid gap-3 p-6">
                      <div className="rounded-xl border border-dashed border-[#1A56DB]/40 bg-[#EFF6FF]/60 p-4">
                        <p className="font-body text-[12px] font-bold uppercase tracking-wider text-[#1A56DB]">Voice input</p>
                        <p className="mt-2 font-body text-[15px] italic text-[#0F172A]">&ldquo;I managed a team of five doing customer support and trained six new hires last year.&rdquo;</p>
                        <div className="mt-3 flex items-end gap-[3px]" aria-hidden>
                          {[10, 22, 16, 28, 14, 30, 18, 22, 12, 24, 10, 18, 26, 14, 20].map((h, idx) => (
                            <span key={idx} className="lc-wave-bar text-[#1A56DB]" style={{ height: h, animationDelay: `${idx * 0.08}s` }} />
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] p-4 font-body text-[13px] text-[#475569]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Or upload</p>
                        <p className="mt-2">resume_old.pdf · 142 KB</p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                step: "Act 02",
                title: "AI does the writing, scoring, matching",
                copy: "Bullets get quantified. Keywords get embedded. Your resume gets cross-checked against the job description, the ATS, and the industry. You watch your score climb in real time.",
                badge: "AI",
                badgeClass: "bg-[#EDE9FE] text-[#6D28D9]",
                visual: (
                  <div className="lc-window">
                    <div className="lc-window-bar"><span className="lc-window-dot bg-[#FF5F57]"/><span className="lc-window-dot bg-[#FEBC2E]"/><span className="lc-window-dot bg-[#28C840]"/></div>
                    <div className="space-y-4 p-6">
                      {[
                        { l: "Keyword match", v: 91, c: "from-[#1A56DB] to-[#3B82F6]" },
                        { l: "ATS compatibility", v: 94, c: "from-[#059669] to-[#10B981]" },
                        { l: "Readability", v: 88, c: "from-[#7C3AED] to-[#A78BFA]" },
                        { l: "Industry fit", v: 86, c: "from-[#EA580C] to-[#F97316]" },
                      ].map((r) => (
                        <div key={r.l}>
                          <div className="mb-1.5 flex items-center justify-between font-body text-[12px]">
                            <span className="font-semibold text-[#475569]">{r.l}</span>
                            <span className="font-bold text-[#0F172A]">{r.v}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                            <div className={`h-full rounded-full bg-gradient-to-r ${r.c} transition-[width] duration-700`} style={{ width: `${r.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                step: "Act 03",
                title: "Ship the application that gets replies",
                copy: "Export a PDF or DOCX that actually passes ATS. Generate the matched cover letter. Practice the interview before you book it. All from one screen, all under one plan.",
                badge: "Done",
                badgeClass: "bg-[#DCFCE7] text-[#15803D]",
                visual: (
                  <div className="lc-window">
                    <div className="lc-window-bar"><span className="lc-window-dot bg-[#FF5F57]"/><span className="lc-window-dot bg-[#FEBC2E]"/><span className="lc-window-dot bg-[#28C840]"/></div>
                    <div className="space-y-3 p-6">
                      {[
                        { i: "📄", t: "resume_stripe_2026.pdf", s: "ATS-safe · 2 pages · 142 KB" },
                        { i: "✉️", t: "cover_letter_stripe.pdf", s: "Personalized · 312 words" },
                        { i: "🎤", t: "interview_drill_session.md", s: "12 questions · scored 8.4/10" },
                      ].map((f) => (
                        <div key={f.t} className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3.5">
                          <span className="text-[20px]">{f.i}</span>
                          <div className="flex-1">
                            <p className="font-body text-[13px] font-bold text-[#0F172A]">{f.t}</p>
                            <p className="font-body text-[11px] text-[#94A3B8]">{f.s}</p>
                          </div>
                          <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 font-body text-[11px] font-bold text-[#15803D]">Ready</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((act, i) => (
              <RevealOnView key={act.step}>
                <div className={`grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[80px] font-extrabold leading-none tracking-tight text-[#0F172A]/10">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="lc-overline text-[#475569]">{act.step}</span>
                        <span className={`ml-2 rounded-full px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wide ${act.badgeClass}`}>
                          {act.badge}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-4 font-display text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-[#0F172A] sm:text-[42px]">
                      {act.title}
                    </h3>
                    <p className="mt-4 max-w-[460px] font-body text-[17px] leading-[1.7] text-[#475569]">{act.copy}</p>
                  </div>
                  <div className="lg:col-span-7">{act.visual}</div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. PULL QUOTE + REVIEWS GRID
          ═══════════════════════════════════════ */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="lc-overline text-white/50">Reader Letters</span>
                <span className="lc-rule mt-3 block bg-white/40" />
                <p className="mt-8 font-display text-[34px] font-bold leading-[1.18] tracking-[-0.02em] sm:text-[44px]">
                  &ldquo;I went from zero callbacks in three months to four interviews in seven days.&rdquo;
                </p>
                <p className="mt-6 font-body text-[14px] text-white/60">
                  Sarah K. · Software Engineer · Hired at Stripe
                </p>

                <div className="mt-12 flex gap-8 border-t border-white/10 pt-8">
                  <div>
                    <p className="font-display text-[40px] font-extrabold leading-none">4.9</p>
                    <p className="mt-1 font-body text-[12px] text-white/55">Avg rating · 2,400+ reviews</p>
                  </div>
                  <div>
                    <p className="font-display text-[40px] font-extrabold leading-none">93%</p>
                    <p className="mt-1 font-body text-[12px] text-white/55">Get an interview within 4 weeks</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  {testimonials.map((t) => (
                    <div key={t.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.07]">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                      <p className="mt-3 font-body text-[14px] leading-[1.7] text-white/80">&ldquo;{t.quote}&rdquo;</p>
                      <p className="mt-4 font-body text-[12px] font-bold text-white">{t.name}</p>
                      <p className="font-body text-[11px] text-white/50">{t.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. PRICING TEASER
          ═══════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#1A56DB]">Pricing · Simple by Design</span>
                <h2 className="mt-3 font-display text-[42px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                  Pay monthly. Pay yearly. Or pay once — for life.
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                No freemium, no data harvesting, no surprise upsells. Just three subscription tiers and a Lifetime option for people who&apos;d rather not think about renewals.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-5 lg:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              const tagline: Record<string, string> = {
                starter: "Try the workflow — monthly, cancel anytime.",
                professional: "Best value for a full active job hunt.",
                lifetime: "One payment. Forever access. Sleep well.",
              };
              return (
                <div
                  key={key}
                  className={`relative flex flex-col rounded-3xl border bg-white p-8 ${
                    popular ? "border-[#0F172A] shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)]" : "border-[#E2E8F0]"
                  }`}
                >
                  {popular && (
                    <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-white">
                      <Sparkles className="h-3 w-3" /> Most chosen
                    </span>
                  )}
                  <p className="font-display text-[20px] font-bold text-[#0F172A]">{cfg.title}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{tagline[key]}</p>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-[56px] font-extrabold tracking-tight text-[#0F172A]">{cfg.priceDisplay}</span>
                    <span className="font-body text-[15px] text-[#94A3B8]">{cfg.periodLabel}</span>
                  </div>
                  <p className="mt-2 font-body text-[12px] text-[#94A3B8]">{cfg.billingExplainer}</p>
                  <ul className="mt-6 flex-1 space-y-3 font-body text-[14px] text-[#334155]">
                    {[
                      "All 6 AI tools",
                      key === "starter" ? "Monthly AI limits — fair use" : "Generous AI ceilings",
                      "PDF + DOCX export",
                      key === "lifetime" ? "Lifetime updates" : "Cancel anytime",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-3.5 font-body text-[14px] font-bold transition ${
                      popular
                        ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                        : "border border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                    }`}
                  >
                    {key === "lifetime" ? "Buy Lifetime" : `Get ${cfg.title}`} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center font-body text-[13px] text-[#94A3B8]">
            7-day money-back where Lemon Squeezy allows. View full comparison on <Link href="/pricing" className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">pricing</Link>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. FAQ
          ═══════════════════════════════════════ */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="lc-overline text-[#1A56DB]">FAQ</span>
              <h2 className="mt-3 font-display text-[38px] font-bold leading-[1.1] tracking-[-0.02em] text-[#0F172A] sm:text-[44px]">
                Frequently asked,<br /><span className="italic">honestly answered.</span>
              </h2>
              <p className="mt-5 font-body text-[15px] leading-[1.7] text-[#475569]">
                Can&apos;t find what you need? <Link href="/dashboard/support" className="font-bold text-[#1A56DB] underline-offset-2 hover:underline">Email the team</Link> — we reply in under a business day.
              </p>
            </div>
            <div className="lg:col-span-8">
              <HomeClient faqItems={faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. FINAL CTA — full-bleed editorial
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-20 blur-[140px]" aria-hidden />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[#7C3AED] opacity-20 blur-[140px]" aria-hidden />
        <div className="relative mx-auto max-w-[1100px] px-6 text-center">
          <span className="lc-overline text-white/60">The Bottom Line</span>
          <h2 className="mx-auto mt-5 max-w-[900px] font-display text-[56px] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-[80px] lg:text-[104px]">
            Your next job is{" "}
            <span className="lc-gradient-text-animated">one paste away.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-white/70">
            Create your account, choose a plan, paste a job description. The first interview reply lands sooner than you think.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-body text-[16px] font-bold text-[#0B0F19] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.45)]"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="lc-link-underline font-body text-[14px] font-semibold text-white/80"
            >
              From {PUBLIC_PLANS.starter.priceDisplay}{PUBLIC_PLANS.starter.periodLabel} · Lifetime {PUBLIC_PLANS.lifetime.priceDisplay}
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
