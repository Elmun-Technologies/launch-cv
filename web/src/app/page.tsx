import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS, planMarketingBullets } from "@/lib/monetization";
import { AnimatedGrid } from "@/components/animated-grid";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import {
  Check,
  ArrowRight,
  ChevronDown,
  Target,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  Mic,
  Zap,
  Star,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "AI Resume Builder & Job Search Copilot",
  description:
    "Paste a job description — Launch CV rewrites your resume, scores ATS fit, and generates your cover letter. Paid plans: Starter, Professional, Elite, or Lifetime.",
  pathname: "/",
  keywords: ["Launch CV", "resume builder", "ATS resume", "JD alignment", "cover letter AI", "interview prep"],
});

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Launch CV — AI Resume Builder & Job Search Copilot",
      description:
        "Tailored resumes, ATS scoring, JD alignment, cover letters, and interview prep for modern job seekers.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "Launch CV", url: getSiteUrl() },
    },
  ],
};

const features = [
  { href: "/features/jd-alignment", icon: Target, title: "JD Alignment Match", accent: "blue", desc: "Paste any job description — AI highlights every gap, missing keyword, and optimization opportunity. Score up to 95% match." },
  { href: "/features/resume-builder", icon: FileText, title: "AI Resume Builder", accent: "violet", desc: "12+ ATS-tested templates. AI writes professional bullet points from your raw input — no writing skills needed." },
  { href: "/features/cover-letter", icon: Mail, title: "Cover Letter Generator", accent: "teal", desc: "Personalized, job-specific cover letters in 60 seconds. Professional tone, ready to send." },
  { href: "/features/interview-prep", icon: MessageSquare, title: "Interview Preparation", accent: "green", desc: "AI generates questions based on your exact role, resume, and job description. Get scored feedback." },
  { href: "/features/ats-score", icon: BarChart3, title: "ATS Score Checker", accent: "orange", desc: "See exactly how your resume scores against applicant tracking systems. Get an actionable fix checklist." },
  { href: "/features/voice-input", icon: Mic, title: "Voice Input", accent: "pink", desc: "Just speak your experience naturally. AI transcribes and transforms your words into polished resume bullets." },
];

const accentMap: Record<string, string> = {
  blue: "bg-[#EFF6FF] text-[#1A56DB]",
  violet: "bg-[#EDE9FE] text-[#6D28D9]",
  teal: "bg-[#F0FDFA] text-[#0D9488]",
  green: "bg-[#DCFCE7] text-[#15803D]",
  orange: "bg-[#FFF7ED] text-[#C2410C]",
  pink: "bg-[#FDF2F8] text-[#9D174D]",
};

const testimonials = [
  { name: "Sarah K.", role: "Software Engineer → Stripe", quote: "I went from 0 interviews in 3 months to 4 in one week after using Launch CV. The JD matching is a game changer.", rating: 5 },
  { name: "Marcus T.", role: "Product Manager → Notion", quote: "My ATS score went from 38% to 93%. I had no idea how broken my resume was. Within 2 weeks I had 3 offers.", rating: 5 },
  { name: "Priya N.", role: "Marketing Lead → HubSpot", quote: "The cover letter generator wrote better letters than I ever could. Saved me 2–3 hours per application.", rating: 5 },
  { name: "David L.", role: "Operations Manager", quote: "Voice input is brilliant. I just talked about my job history and it came out polished and professional.", rating: 5 },
  { name: "Emma R.", role: "UX Designer (career switch)", quote: "As a career changer, I was lost. Launch CV showed me exactly what keywords to add for a completely new field.", rating: 5 },
  { name: "James O.", role: "Data Analyst", quote: "The interview prep feature is underrated. Practicing with AI questions specific to the job made me so much more confident.", rating: 5 },
];

const faqs = [
  { q: "Is there a free plan?", a: "No — Launch CV is a paid professional product. AI features require an active plan (Starter, Professional, Elite, or Lifetime). You can create an account to explore settings, but AI workflows unlock after checkout." },
  { q: "What is ATS and why does it matter?", a: "Applicant Tracking Systems scan and filter resumes before a human ever reads them. 75% of resumes are rejected by ATS. We help you pass every major platform." },
  { q: "What file formats can I download?", a: "PDF and DOCX. Both are ATS-compatible. You can also copy plain text for email or LinkedIn." },
  { q: "Is my data safe and private?", a: "Yes. We use 256-bit encryption. We never sell your data. GDPR and CCPA compliant. Your audio is never stored after voice transcription." },
  { q: "How is this different from other resume builders?", a: "We combine resume building + JD matching + ATS scoring + cover letters + interview prep in one platform — all AI-powered with generous limits per plan." },
  { q: "How long does it take to build a resume?", a: "Most users complete a polished resume in under 5 minutes with AI bullet suggestions and real-time preview." },
  { q: "Does it work for all industries?", a: "Yes — we have templates and AI training data for 12+ verticals including tech, finance, healthcare, marketing, design, and management." },
  { q: "What is the Lifetime plan?", a: "Lifetime is a one-time payment of $149 that gives you ongoing access without renewals. Monthly AI limits apply (generous fair-use caps) — pay once, use forever." },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={homeStructuredData} />
      <LandingNav />

      {/* ──────────────── 1. HERO ──────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0F172A] pt-[72px]">
        {/* Mesh blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="lc-blob-1 absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-[0.18] blur-[120px]" />
          <div className="lc-blob-2 absolute right-[5%] top-[30%] h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[120px]" />
          <div className="lc-blob-3 absolute bottom-[10%] left-[40%] h-[350px] w-[350px] rounded-full bg-[#0D9488] opacity-[0.12] blur-[100px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1280px] px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-[720px] text-center">
            {/* Top badge */}
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 lc-shimmer">
              <span className="font-body text-[13px] font-semibold text-white/90">✨ Rated #1 AI Resume Builder — 2025</span>
            </div>

            {/* H1 */}
            <h1 className="lc-motion-fade lc-s2 font-display text-[48px] font-[800] leading-[1.08] tracking-[-0.03em] text-white sm:text-[64px] lg:text-[72px]">
              Build the Resume<br />
              <span className="lc-gradient-text-animated">That Gets You Hired.</span>
            </h1>

            {/* Subheadline */}
            <p className="lc-motion-fade lc-s3 mx-auto mt-6 max-w-[560px] font-body text-[18px] leading-[1.75] text-[#94A3B8] sm:text-[20px]">
              AI-powered. ATS-optimized. Ready in 5 minutes. Join professionals who landed interviews with Launch CV.
            </p>

            {/* CTA group */}
            <div className="lc-motion-fade lc-s4 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="lc-btn-primary lc-ripple lc-pulse-glow px-8 py-4 text-[16px]"
              >
                View plans & get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="font-body text-[15px] font-semibold text-[#94A3B8] transition hover:text-white">
                From {PUBLIC_PLANS.starter.priceDisplay}{PUBLIC_PLANS.starter.periodLabel} · Lifetime {PUBLIC_PLANS.lifetime.priceDisplay}
              </Link>
            </div>

            {/* Social proof */}
            <div className="lc-motion-fade lc-s5 mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <span className="font-body text-[13px] text-[#94A3B8]">★★★★★ 4.9/5 from 2,400+ reviews</span>
              <span className="text-[#475569]">·</span>
              <span className="font-body text-[13px] text-[#94A3B8]">ATS-optimized</span>
              <span className="text-[#475569]">·</span>
              <span className="font-body text-[13px] text-[#94A3B8]">Lifetime plan available</span>
            </div>
          </div>

          {/* Hero visual — resume mockup */}
          <div className="lc-motion-fade lc-s5 mx-auto mt-16 max-w-[640px]">
            <div className="lc-float relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              <div className="rounded-xl bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-6 w-48 rounded bg-[#0F172A]" />
                    <div className="mt-1.5 h-3.5 w-32 rounded bg-[#64748B]/40" />
                    <div className="mt-1 h-3 w-56 rounded bg-[#94A3B8]/30" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    <span className="font-body text-[12px] font-bold text-[#15803D]">ATS 94%</span>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {["Work Experience", "Skills", "Education"].map((s) => (
                    <div key={s}>
                      <div className="h-2.5 w-24 rounded bg-[#1A56DB]/60" />
                      <div className="mt-2 space-y-1.5">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-5/6 rounded bg-gray-100" />
                        <div className="h-2 w-4/6 rounded bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating AI chip */}
              <div className="absolute -right-4 top-8 flex items-center gap-2 rounded-xl bg-[#1A56DB] px-3 py-2 shadow-lg">
                <Zap className="h-3.5 w-3.5 text-white" />
                <span className="font-body text-[12px] font-bold text-white">AI Enhanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-[#475569]">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ──────────────── 2. TRUST / LOGO BAR ──────────────── */}
      <section className="overflow-hidden border-y border-[#E2E8F0] bg-[#F8FAFC] py-10">
        <p className="mb-6 text-center font-body text-[13px] font-medium text-[#94A3B8]">
          Trusted by professionals from
        </p>
        <div className="overflow-hidden">
          <div className="lc-ticker-track">
            {[...Array(2)].map((_, pass) => (
              <div key={pass} className="flex items-center gap-14 px-8">
                {["Google", "Amazon", "Deloitte", "Meta", "Stripe", "Salesforce", "JPMorgan", "McKinsey"].map((name) => (
                  <span key={name} className="shrink-0 font-display text-[16px] font-bold text-[#94A3B8] opacity-50 transition-opacity hover:opacity-100">
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 3. VALUE PROPOSITION ──────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <p className="lc-eyebrow">Everything you need</p>
            <h2 className="lc-h2 mx-auto mt-4 max-w-[600px]">
              One Platform. Every Tool You Need to Get Hired.
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] text-[#64748B]">
              From resume creation to interview prep — Launch CV covers every step of your job search.
            </p>
          </div>

          <AnimatedGrid className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="lc-card lc-spotlight group p-8"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${accentMap[f.accent]}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-[18px] font-bold text-[#0F172A]">{f.title}</h3>
                <p className="mt-2 font-body text-[14px] leading-[1.7] text-[#475569]">{f.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-body text-[13px] font-semibold text-[#1A56DB] opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </AnimatedGrid>
        </div>
      </section>

      {/* ──────────────── 4. HOW IT WORKS ──────────────── */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <p className="lc-eyebrow">How it works</p>
            <h2 className="lc-h2 mx-auto mt-4 max-w-[500px]">
              From Zero to Hired — In 3 Steps
            </h2>
            <p className="mx-auto mt-3 max-w-[480px] font-body text-[16px] text-[#64748B]">
              Most users complete and apply with an AI-optimized resume in under 10 minutes.
            </p>
          </div>

          <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
            {/* Connector line — sits below the numbers, between cards */}
            <div className="pointer-events-none absolute left-[calc(16.67%+8px)] right-[calc(16.67%+8px)] top-[52px] hidden h-px border-t-2 border-dashed border-[#CBD5E1] lg:block" />

            {[
              {
                n: "01",
                badge: "You",
                badgeColor: "bg-[#EFF6FF] text-[#1A56DB]",
                title: "Paste your experience",
                desc: "Enter your work history in plain language, or speak it with voice input. Takes 2 minutes.",
                visual: (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <Mic className="h-3.5 w-3.5 shrink-0 text-[#1A56DB]" />
                      <span className="font-body text-[12px] text-[#64748B]">Managed a team of 5 doing support…</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-[#1A56DB]" />
                      <span className="font-body text-[12px] text-[#64748B]">Upload existing resume (PDF/DOCX)</span>
                    </div>
                  </div>
                ),
              },
              {
                n: "02",
                badge: "AI",
                badgeColor: "bg-[#EDE9FE] text-[#7C3AED]",
                title: "AI builds & scores it",
                desc: "AI rewrites your bullets, maps keywords from the job description, and checks ATS compatibility.",
                visual: (
                  <div className="space-y-2">
                    {[
                      { label: "Keyword match", pct: 91, color: "bg-[#1A56DB]" },
                      { label: "ATS score", pct: 94, color: "bg-[#059669]" },
                      { label: "Readability", pct: 88, color: "bg-[#7C3AED]" },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-body text-[11px] text-[#64748B]">{row.label}</span>
                          <span className="font-body text-[11px] font-semibold text-[#334155]">{row.pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                n: "03",
                badge: "Done",
                badgeColor: "bg-[#DCFCE7] text-[#15803D]",
                title: "Download & apply",
                desc: "Export as PDF, generate a cover letter, and send. The whole process takes under 10 minutes.",
                visual: (
                  <div className="space-y-2">
                    {[
                      { icon: "📄", label: "resume_final.pdf", sub: "ATS-safe · 2 pages" },
                      { icon: "✉️", label: "cover_letter.pdf", sub: "AI-personalized" },
                    ].map((f) => (
                      <div key={f.label} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                        <span className="text-[16px]">{f.icon}</span>
                        <div>
                          <p className="font-body text-[12px] font-semibold text-[#334155]">{f.label}</p>
                          <p className="font-body text-[11px] text-[#94A3B8]">{f.sub}</p>
                        </div>
                        <span className="ml-auto font-body text-[11px] font-bold text-[#059669]">Ready</span>
                      </div>
                    ))}
                  </div>
                ),
              },
            ].map((step) => (
              <div key={step.n} className="flex flex-col">
                {/* Number + badge row */}
                <div className="relative z-10 mb-5 flex items-center gap-3">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-[#E2E8F0] shadow-sm">
                    <span className="font-display text-[18px] font-bold text-[#0F172A]">{step.n}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
                {/* Content card */}
                <div className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <h3 className="font-display text-[18px] font-bold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#64748B]">{step.desc}</p>
                  <div className="mt-5 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                    {step.visual}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 5. STATISTICS (client — counters) ──────────────── */}
      <HomeClient />

      {/* ──────────────── 6. FEATURE SPOTLIGHTS ──────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-[1280px] space-y-24 px-6">
          {/* Spotlight 1 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 lg:order-1">
              <div className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF]">
                    <FileText className="h-4 w-4 text-[#1A56DB]" />
                  </div>
                  <span className="font-display text-[14px] font-bold text-[#0F172A]">Resume Builder</span>
                  <span className="ml-auto lc-badge-ai">AI</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    "Led cross-functional delivery of 3 SaaS migrations, reducing time-to-deploy by 40%",
                    "Managed a team of 8 engineers across 2 time zones delivering $2M ARR product",
                    "Designed and shipped 12 features increasing user retention by 34%",
                  ].map((b) => (
                    <div key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
                      <p className="font-body text-[13px] leading-snug text-[#334155]">{b}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:order-2">
              <p className="lc-eyebrow">AI Resume Builder</p>
              <h2 className="lc-h2 mt-3">The AI Writes. You Just Direct.</h2>
              <ul className="mt-6 space-y-3">
                {["AI-written bullets from plain language input", "Real-time preview as you type", "12+ ATS-tested industry templates", "PDF & DOCX export in one click"].map((b) => (
                  <li key={b} className="flex items-center gap-3 font-body text-[15px] text-[#334155]">
                    <Check className="h-5 w-5 shrink-0 text-[#059669]" /> {b}
                  </li>
                ))}
              </ul>
              <Link href="/features/resume-builder" className="lc-btn-primary mt-8 inline-flex">
                Start Building <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Spotlight 2 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="lc-eyebrow">JD Alignment</p>
              <h2 className="lc-h2 mt-3">Match Any Job in Seconds.</h2>
              <p className="mt-4 font-body text-[16px] leading-[1.7] text-[#64748B]">
                Paste a job description — AI maps every requirement to your resume, flags gaps, and rewrites bullets to score up to 95% match.
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div className="text-center">
                  <p className="font-display text-[32px] font-bold text-[#DC2626]">42%</p>
                  <p className="font-body text-[12px] text-[#94A3B8]">Before</p>
                </div>
                <ArrowRight className="h-6 w-6 text-[#94A3B8]" />
                <div className="text-center">
                  <p className="font-display text-[32px] font-bold text-[#059669]">91%</p>
                  <p className="font-body text-[12px] text-[#94A3B8]">After</p>
                </div>
                <span className="font-body text-[13px] text-[#64748B]">ATS match score</span>
              </div>
              <Link href="/features/jd-alignment" className="lc-btn-primary mt-8 inline-flex">
                Try JD Alignment <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-red-100 bg-white p-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wide text-red-500">Before</p>
                  <p className="mt-2 font-body text-[12px] text-[#475569]">"Helped team complete projects on time."</p>
                  <div className="mt-3 lc-progress-bar">
                    <div className="h-full rounded-full bg-red-400" style={{ width: "34%" }} />
                  </div>
                  <p className="mt-1 font-body text-[11px] text-red-500">Match: 34%</p>
                </div>
                <div className="rounded-xl border border-green-100 bg-white p-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wide text-green-600">After</p>
                  <p className="mt-2 font-body text-[12px] text-[#475569]">"Led delivery of 3 SaaS migrations, reducing deploy time by 40% using Agile."</p>
                  <div className="mt-3 lc-progress-bar">
                    <div className="lc-progress-fill" style={{ width: "91%" }} />
                  </div>
                  <p className="mt-1 font-body text-[11px] text-green-600">Match: 91%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spotlight 3 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 lg:order-1">
              <div className="flex flex-col gap-3">
                <div className="self-start rounded-2xl rounded-tl-sm bg-[#1A56DB] px-4 py-3 text-white">
                  <p className="font-body text-[12px] font-semibold text-white/70">AI:</p>
                  <p className="font-body text-[13px]">Tell me about a time you led a cross-functional project under a tight deadline.</p>
                </div>
                <div className="self-end rounded-2xl rounded-tr-sm border border-[#E2E8F0] bg-white px-4 py-3">
                  <p className="font-body text-[13px] text-[#334155]">In Q3 I led a 4-team sprint to ship the new onboarding…</p>
                </div>
                <div className="self-start rounded-2xl rounded-tl-sm bg-[#F0FDF4] px-4 py-3">
                  <p className="font-body text-[12px] font-semibold text-[#15803D]">AI Feedback — Score: 8/10</p>
                  <p className="font-body text-[12px] text-[#334155]">Strong STAR structure. Add quantified outcome (e.g. reduced time-to-activation by X%).</p>
                </div>
              </div>
            </div>
            <div className="lg:order-2">
              <p className="lc-eyebrow">Interview Prep</p>
              <h2 className="lc-h2 mt-3">Practice Until You're Unshakeable.</h2>
              <p className="mt-4 font-body text-[16px] leading-[1.7] text-[#64748B]">
                200+ role-specific questions generated from your resume and JD. AI scores every answer and gives expert feedback.
              </p>
              <Link href="/features/interview-prep" className="lc-btn-primary mt-8 inline-flex">
                Start Practicing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 7. TESTIMONIALS ──────────────── */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <p className="font-body text-[13px] text-[#94A3B8]">⭐ 4.9/5 average · 2,400+ reviews</p>
            <h2 className="lc-h2 mx-auto mt-3 max-w-[480px]">Stories from Real Job Seekers</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="lc-card lc-spotlight flex flex-col p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="mt-4 flex-1 font-body text-[14px] leading-[1.7] text-[#475569]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-[#E2E8F0] pt-4">
                  <p className="font-body text-[14px] font-semibold text-[#0F172A]">{t.name}</p>
                  <p className="font-body text-[13px] text-[#94A3B8]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 8. PRICING PREVIEW ──────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <p className="lc-eyebrow">Pricing</p>
            <h2 className="lc-h2 mx-auto mt-4 max-w-[480px]">Simple Plans. No Surprises.</h2>
            <p className="mx-auto mt-3 font-body text-[15px] text-[#64748B]">
              Monthly, annual, or pay once — pick what matches your job search.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-[900px] mx-auto">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              const tagline: Record<string, string> = {
                starter: "Try it monthly, cancel anytime",
                professional: "Best value for a full job search",
                lifetime: "Pay once, use forever",
              };
              return (
                <div
                  key={key}
                  className={`relative flex flex-col rounded-2xl border-2 bg-white p-7 ${popular ? "border-[#1A56DB] shadow-xl shadow-blue-500/10 scale-[1.02]" : "border-[#E2E8F0]"}`}
                >
                  {popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#1A56DB] px-4 py-1 font-body text-[11px] font-bold uppercase tracking-wide text-white whitespace-nowrap">
                      Most Popular
                    </span>
                  )}
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{cfg.title}</p>
                  <p className="mt-1 font-body text-[12px] text-[#94A3B8]">{tagline[key]}</p>
                  <p className="mt-4 flex flex-wrap items-baseline gap-1">
                    <span className="font-display text-[40px] font-bold text-[#0F172A]">{cfg.priceDisplay}</span>
                    <span className="font-body text-[14px] text-[#94A3B8]">{cfg.periodLabel}</span>
                  </p>
                  <p className="mt-2 font-body text-[12px] leading-snug text-[#64748B]">{cfg.billingExplainer}</p>
                  <Link
                    href="/pricing"
                    className={`mt-6 flex w-full items-center justify-center rounded-xl py-3 font-body text-[14px] font-bold transition ${popular ? "bg-[#1A56DB] text-white hover:bg-[#1D4ED8] shadow-lg shadow-blue-500/20" : "border-2 border-[#E2E8F0] text-[#334155] hover:border-[#1A56DB] hover:text-[#1A56DB]"}`}
                  >
                    {key === "lifetime" ? "Get Lifetime →" : `Start ${cfg.title} →`}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center font-body text-[13px] text-[#94A3B8]">
            ✓ Cancel subscriptions anytime &nbsp;·&nbsp; ✓ Lifetime — pay once, keep forever &nbsp;·&nbsp; ✓ No hidden fees
          </p>
          <p className="mt-6 text-center">
            <Link href="/pricing" className="font-body text-[14px] font-semibold text-[#1A56DB] hover:underline">
              View full pricing & compare plans →
            </Link>
          </p>
        </div>
      </section>

      {/* ──────────────── 9. FAQ (client — accordion) ──────────────── */}
      <section className="bg-[#F8FAFC] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <p className="lc-eyebrow">FAQ</p>
            <h2 className="lc-h2 mx-auto mt-4 max-w-[400px]">Frequently Asked Questions</h2>
          </div>
          {/* FAQ accordion is client-side — rendered via HomeClient */}
          <HomeClient faqItems={faqs} />
        </div>
      </section>

      {/* ──────────────── 10. FINAL CTA ──────────────── */}
      <section className="bg-gradient-to-r from-[#1A56DB] to-[#7C3AED] py-20">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-5 px-6 text-center">
          <h2 className="font-display text-[32px] font-bold leading-tight text-white sm:text-[40px]">
            Ready to Land Your Dream Job?
          </h2>
          <p className="font-body text-[17px] text-white/80">
            Create an account, choose a plan, and let AI build the resume that gets you hired.
          </p>
          <Link
            href="/register"
            className="mt-2 inline-flex items-center gap-2 rounded-[10px] bg-white px-8 py-4 font-body text-[16px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            Build My Resume <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 font-body text-[13px] text-white/70">
            <span>✓ ATS-optimized</span>
            <span>✓ PDF & DOCX download</span>
            <span>✓ Lifetime plan available</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
