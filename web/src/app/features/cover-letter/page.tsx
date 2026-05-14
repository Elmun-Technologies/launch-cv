import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Star,
  Building2,
  User,
  Send,
  ChevronRight,
  Target,
  FileText,
  MessageSquare,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Cover Letter Generator — Personalized Letters in 60 Seconds",
  description:
    "Stop staring at a blank page. Launch CV writes a cover letter tailored to the company, the role, and the hiring manager — in your voice, with their keywords, in under a minute.",
  pathname: "/features/cover-letter",
  keywords: ["AI cover letter generator", "cover letter writer", "personalized cover letter", "job application cover letter", "cover letter maker"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Cover Letter Generator | Launch CV",
      url: absoluteUrl("/features/cover-letter"),
      description: "AI cover letters personalized to the company, role and hiring manager — in 60 seconds.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Cover Letter", item: absoluteUrl("/features/cover-letter") },
      ],
    },
  ],
};

const tones = [
  { k: "Professional", d: "Crisp, formal, polished. Great for finance, legal, enterprise.", color: "from-slate-700 to-slate-900" },
  { k: "Enthusiastic", d: "Warm, energetic, mission-led. Great for startups, agencies.", color: "from-teal-500 to-emerald-600" },
  { k: "Concise", d: "200 words, every line earning its place. Great for engineers.", color: "from-blue-600 to-violet-600" },
  { k: "Creative", d: "Hooked opening, distinctive voice. Great for design, marketing.", color: "from-pink-500 to-amber-500" },
];

const benefits = [
  { t: "Deep personalization", d: "AI extracts the company mission, tech stack, and required skills from the JD — then weaves them into the letter naturally, not as a checklist." },
  { t: "Tone control", d: "Pick from Professional, Enthusiastic, Concise, or Creative. Preview the change live before generating." },
  { t: "Three opening hooks", d: "Generates three different first paragraphs. Pick the one that sounds like you — discard the rest." },
  { t: "ATS-safe formatting", d: "Pure plain-text structure. Works inside an email body, an ATS upload, or a PDF attachment." },
  { t: "Word-count control", d: "Short (250) · Standard (400) · Detailed (600). You choose how much real estate the role deserves." },
  { t: "14 languages", d: "Generate in English, German, French, Spanish, Portuguese, Dutch, Italian and 7 more. Same fidelity in every language." },
];

const testimonials = [
  { q: "The cover letter generator wrote better letters than I ever could. It pulled details from the job description I hadn't even noticed. Two-to-three hours saved per application.", n: "Priya N.", r: "Marketing Lead → HubSpot" },
  { q: "I was embarrassed by my own cover letters. The AI made them sound genuinely enthusiastic and specific. I got a callback from every company where I used it.", n: "Alex T.", r: "Sales Manager" },
];

export default function CoverLetterPage() {
  return (
    <div className="lc-theme-teal flex min-h-screen flex-col bg-[#FAFAF7] text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* ═══ HERO — letter-on-desk theme ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDFA] to-[#FAFAF7] pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-20 h-[480px] w-[480px] rounded-full bg-[#0D9488] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-60 h-[380px] w-[380px] rounded-full bg-[#1A56DB] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0D9488]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#0D9488]">
                <Mail className="h-3.5 w-3.5" /> Feature · Cover Letter
              </span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[80px] lg:text-[100px]">
              <span className="block">Dear hiring</span>
              <span className="block lc-mega-italic text-[#0D9488]">manager,</span>
              <span className="block text-[#94A3B8]">…</span>
            </h1>

            <p className="mt-7 max-w-[540px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              Stop opening the blank document. Launch CV writes a tailored cover letter — pulling the company mission,
              the tech stack, the hiring manager&apos;s tone — and produces a letter you&apos;d actually be proud to send.
              In 60 seconds.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#0D9488] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(13,148,136,0.7)]">
                Write my first letter <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#preview" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See a real example <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0F172A]/10 pt-6">
              {[
                { v: "60s", l: "Per letter" },
                { v: "14", l: "Languages" },
                { v: "3", l: "Opening hooks" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[28px] font-extrabold leading-none tracking-tight text-[#0F172A]">{s.v}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — the letter mockup with typewriter line */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* paper-stack */}
              <div className="absolute -right-2 top-3 hidden h-[96%] w-[96%] rotate-2 rounded-2xl border border-[#E2E8F0] bg-white/80 sm:block" />
              <div className="absolute -left-2 -top-3 hidden h-[96%] w-[96%] -rotate-2 rounded-2xl border border-[#E2E8F0] bg-white/60 sm:block" />

              <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_24px_60px_-20px_rgba(13,148,136,0.35)]">
                {/* letterhead */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                  <div>
                    <p className="font-display text-[16px] font-bold text-[#0F172A]">Sarah Khan</p>
                    <p className="font-body text-[11px] text-[#94A3B8]">sarah@email.com · NYC</p>
                  </div>
                  <span className="rounded-full bg-[#F0FDFA] px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                    Draft · v3
                  </span>
                </div>

                <div className="mt-6 space-y-3 font-body text-[14px] leading-[1.75] text-[#0F172A]">
                  <p className="text-[#475569]">March 12, 2026</p>
                  <p><span className="lc-typewriter">Dear hiring team at Stripe,</span></p>
                  <p>
                    I&apos;ve been following Stripe&apos;s expansion into <span className="bg-[#CCFBF1] px-1">embedded finance</span> since the launch of Issuing — and I&apos;d love to bring my 6 years of payments infrastructure experience to the <span className="bg-[#CCFBF1] px-1">Senior Software Engineer, Money Movement</span> team.
                  </p>
                  <p>
                    At my current role, I led the migration of <span className="bg-[#CCFBF1] px-1">3 SaaS systems</span> serving 1,200+ accounts, reducing deploy time by 40% with a TypeScript + Go stack. The challenges Stripe is solving — global rails, sub-100ms settlement — are exactly the problems I want to spend the next chapter of my career on.
                  </p>
                  <p className="text-[#94A3B8]">_______________</p>
                </div>

                {/* meta footer */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="lc-pill bg-[#F0FDFA] text-[#0D9488]">Tone · Enthusiastic</span>
                    <span className="lc-pill bg-[#F8FAFC] text-[#64748B]">312 words</span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3.5 py-1.5 font-body text-[12px] font-bold text-white">
                    <Send className="h-3.5 w-3.5" /> Copy & send
                  </button>
                </div>
              </div>

              {/* floating chip */}
              <div className="absolute -right-4 -top-6 rotate-3 rounded-2xl bg-white px-3 py-2 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.25)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-[#94A3B8]">Generated in</p>
                <p className="font-display text-[18px] font-extrabold text-[#0D9488]">58.2 sec</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TONE PICKER ═══ */}
      <section className="border-y border-[#E2E8F0] bg-white py-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#0D9488]">Pick your voice</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                  Four tones. Same job description.<br />
                  Four <span className="italic">very different</span> letters.
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                Tone isn&apos;t decoration — it&apos;s the difference between a recruiter calling you back and skipping to the next CV.
                Preview each voice before you generate. Switch any time.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tones.map((t, i) => (
              <RevealOnView key={t.k}>
                <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.color} p-6 text-white transition hover:scale-[1.02]`}>
                  <p className="font-body text-[11px] uppercase tracking-[0.16em] text-white/60">Tone · 0{i + 1}</p>
                  <p className="mt-3 font-display text-[28px] font-extrabold tracking-tight">{t.k}</p>
                  <p className="mt-3 font-body text-[13px] leading-[1.65] text-white/80">{t.d}</p>
                  <div className="mt-5 inline-flex items-center gap-1 font-body text-[12px] font-bold text-white opacity-70 transition group-hover:opacity-100">
                    Preview voice <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PREVIEW / EXAMPLE ═══ */}
      <section id="preview" className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-white/55">A real example</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
                  Same job ad.<br />
                  <span className="lc-gradient-text-animated">Different voices.</span>
                </h2>
              </div>
              <p className="font-body text-[15px] leading-[1.7] text-white/70 lg:col-span-5">
                Below: the opening paragraph of a cover letter for a Senior PM role at Linear — written in two tones, from identical inputs. Pick which one sounds like you.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="lc-pill bg-white/10 text-white">Professional</span>
                <span className="lc-pill bg-white/5 text-white/60">312 words</span>
              </div>
              <p className="mt-5 font-display text-[18px] leading-[1.55] tracking-[-0.01em] text-white/90">
                &ldquo;I am writing to express my interest in the Senior Product Manager role at Linear. With seven years of B2B SaaS experience — most recently leading the activation workstream at Datadog — I believe my background in technical product strategy and developer-tools positioning aligns with the responsibilities outlined in your job description.&rdquo;
              </p>
            </div>
            <div className="rounded-3xl border border-emerald-300/30 bg-emerald-500/[0.08] p-7 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="lc-pill bg-emerald-300/20 text-emerald-200">Enthusiastic</span>
                <span className="lc-pill bg-white/5 text-white/60">298 words</span>
              </div>
              <p className="mt-5 font-display text-[18px] leading-[1.55] tracking-[-0.01em] text-white/90">
                &ldquo;I&apos;ve been a Linear power user since the very first Cycles ship — and the day I read your Method docs was the day I decided I wanted to build PM tools, not just use them. The Senior PM role you posted is the most specifically <em className="text-emerald-200">me</em>-shaped role I&apos;ve seen in a year, and I want to tell you why.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[680px]">
              <span className="lc-overline text-[#0D9488]">What&apos;s included</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Built like a copywriter,<br />
                <span className="italic">not</span> like a template.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {benefits.map((b, i) => (
              <RevealOnView key={b.t}>
                <div className="flex gap-5 border-t border-[#0F172A]/10 pt-7">
                  <span className="font-display text-[28px] font-extrabold leading-none text-[#0D9488]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{b.t}</h3>
                    <p className="mt-2 font-body text-[15px] leading-[1.7] text-[#475569]">{b.d}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — vertical timeline ═══ */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-12 text-center">
            <span className="lc-overline text-[#0D9488]">Workflow · 6 Acts</span>
            <h2 className="mx-auto mt-3 max-w-[680px] font-display text-[42px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
              Pasted JD → finished letter,<br />
              before your coffee cools.
            </h2>
          </div>

          <div className="relative">
            {/* timeline rail */}
            <div className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-[#0D9488] via-[#0D9488]/40 to-transparent sm:block" />
            <div className="space-y-6">
              {[
                { i: FileText, t: "Connect a resume", d: "Use a Launch CV resume or paste an existing one. Your career history is the foundation." },
                { i: Building2, t: "Paste the JD", d: "AI auto-extracts the company, role, tech stack, and hiring tone. No manual tagging." },
                { i: User, t: "Optional: add personal context", d: "Hiring manager's name, mutual connection, why-this-company line. AI weaves it in." },
                { i: Sparkles, t: "Choose tone + length", d: "Professional · Enthusiastic · Concise · Creative — 250, 400, or 600 words." },
                { i: Mail, t: "Generate", d: "AI returns three openings, one full body, two closings — all editable inline." },
                { i: Send, t: "Send", d: "Copy to clipboard, paste into email, or export PDF. Plain-text compatible everywhere." },
              ].map((s, i) => (
                <RevealOnView key={s.t}>
                  <div className="relative flex gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#0D9488] hover:shadow-[0_10px_30px_-15px_rgba(13,148,136,0.4)]">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0D9488] ring-4 ring-[#FAFAF7]">
                      <s.i className="h-6 w-6" />
                    </span>
                    <div className="flex-1">
                      <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Step {String(i + 1).padStart(2, "0")}</p>
                      <h3 className="mt-1 font-display text-[20px] font-bold tracking-tight text-[#0F172A]">{s.t}</h3>
                      <p className="mt-1.5 font-body text-[14px] leading-[1.7] text-[#475569]">{s.d}</p>
                    </div>
                  </div>
                </RevealOnView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 text-center">
              <span className="lc-overline text-[#0D9488]">Reader Letters</span>
              <h2 className="mt-3 font-display text-[42px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[52px]">
                Letters that got replies.
              </h2>
            </div>
          </RevealOnView>
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F0FDFA]/40 p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[20px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F172A]">&ldquo;{t.q}&rdquo;</p>
                  <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <p className="font-body text-[14px] font-bold text-[#0F172A]">{t.n}</p>
                    <p className="font-body text-[13px] text-[#94A3B8]">{t.r}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RELATED ═══ */}
      <section className="bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#0D9488]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume keywords to the JD.", icon: Target },
              { href: "/features/resume-builder", t: "Resume Builder", d: "ATS-tested templates, AI bullets.", icon: FileText },
              { href: "/features/interview-prep", t: "Interview Prep", d: "Drill the role before you call.", icon: MessageSquare },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#0D9488] hover:bg-white">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0D9488]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#0D9488]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Write a letter you&apos;d<br />
            <span className="italic text-[#5EEAD4]">actually be proud</span><br />to send.
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/85">
            Personalized. Professional. Ready in 60 seconds. No more blank-page anxiety.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#0D9488] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Write my first letter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0D9488] py-3 font-body text-[14px] font-bold text-white">
          Write my letter <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
