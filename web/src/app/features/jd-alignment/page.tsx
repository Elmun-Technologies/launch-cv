import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  Target,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Sparkles,
  X,
  Plus,
  Minus,
  Star,
  Mail,
  FileText,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "JD Alignment — Match Your Resume to Any Job, Instantly",
  description:
    "Paste a job description. Watch your match score climb from 42% to 91%. AI rewrites your bullets, fills your keyword gaps, and ranks every requirement.",
  pathname: "/features/jd-alignment",
  keywords: ["JD alignment", "resume job description match", "keyword gap analysis", "resume ATS optimization", "AI resume tailoring"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "JD Alignment | Launch CV",
      url: absoluteUrl("/features/jd-alignment"),
      description: "Match your resume to any job description with AI — keyword gaps, bullet rewrites, ATS-safe scoring.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "JD Alignment", item: absoluteUrl("/features/jd-alignment") },
      ],
    },
  ],
};

const missingKeywords = ["Agile/Scrum", "Roadmapping", "OKRs", "A/B testing", "Cross-functional", "SQL", "Stakeholder mgmt"];
const matchedKeywords = ["React", "TypeScript", "Product strategy", "User research"];

const benefits = [
  { t: "Keyword extraction", d: "AI scans the JD for every hard skill, soft skill, tool, and seniority signal. Nothing slips through." },
  { t: "Gap analysis, ranked", d: "Side-by-side map of what your resume has vs what the JD wants — ranked by impact on hireability." },
  { t: "AI bullet rewrites", d: "Missing keywords woven in naturally. No robotic stuffing, no fabricated experience." },
  { t: "Real-time match score", d: "Watch the percentage climb live as you accept rewrites. Aim for 90+." },
  { t: "Multi-job tracking", d: "Save match scores across applications. Compare which roles you fit best — and which to skip." },
  { t: "Trained on 15 ATS engines", d: "Workday, Greenhouse, Lever, iCIMS, Taleo, Bullhorn, BambooHR, JazzHR, SmartRecruiters, Recruitee, and more." },
];

const steps = [
  { n: "01", t: "Drop your resume", d: "PDF, DOCX, or pasted text. We parse it in under 2 seconds — no template gymnastics required." },
  { n: "02", t: "Paste the job ad", d: "From LinkedIn, Indeed, a careers page, anywhere. URL or raw text — both work." },
  { n: "03", t: "Run the analysis", d: "AI extracts every requirement, scores your fit, and builds your gap map in under 10 seconds." },
  { n: "04", t: "Review the gaps", d: "Missing keywords appear with priority tags. Tap a tag → see exactly which bullet to upgrade." },
  { n: "05", t: "Accept the rewrites", d: "One click pulls AI suggestions into your resume. The match score updates instantly." },
  { n: "06", t: "Export and apply", d: "PDF, DOCX, or push straight into the cover letter generator. Same workflow for the next role." },
];

const testimonials = [
  { q: "I was applying to the same type of PM role for months with nothing back. Launch CV showed me I was missing 14 critical keywords. After fixing it — five interviews in ten days.", n: "Rachel M.", r: "Product Manager → Linear" },
  { q: "The JD alignment alone is worth the subscription. It's like having a recruiter whisper exactly what to change before you hit submit.", n: "Tom H.", r: "Software Engineer → Datadog" },
];

export default function JDAlignmentPage() {
  return (
    <div className="lc-theme-blue flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* ═══ HERO — bold split ═══ */}
      <section className="relative overflow-hidden bg-[#F8FAFF] pt-[104px]">
        <div className="lc-dot-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-[0.12] blur-[140px]" aria-hidden />

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1A56DB]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#1A56DB]">
                <Target className="h-3.5 w-3.5" /> Feature · JD Alignment
              </span>
              <span className="lc-tape hidden sm:inline-flex">
                <Sparkles className="h-3 w-3" /> 91% avg match after AI rewrites
              </span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.96] tracking-[-0.04em] text-[#0F172A] sm:text-[80px] lg:text-[104px]">
              One paste.<br />
              <span className="bg-[#FEF08A] px-2">90%+ match.</span><br />
              <span className="lc-mega-italic text-[#1E3A8A]">No tailoring</span>{" "}<span className="text-[#94A3B8]">by hand.</span>
            </h1>

            <p className="mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              Paste any job description. Launch CV reads it like a recruiter, scores your resume against every requirement,
              and rewrites your bullets to close the gap — in seconds, not weekends.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#1A56DB] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(26,86,219,0.7)]">
                Run my first alignment <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#how-it-works" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See the workflow <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-body text-[13px] text-[#64748B]">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> 15 ATS engines simulated</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> Tested across 12 industries</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> Works on any JD format</span>
            </div>
          </div>

          {/* RIGHT — diff comparison card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="lc-window">
                <div className="lc-window-bar">
                  <span className="lc-window-dot bg-[#FF5F57]" />
                  <span className="lc-window-dot bg-[#FEBC2E]" />
                  <span className="lc-window-dot bg-[#28C840]" />
                  <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">JD Alignment · live diff</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 font-body text-[11px] font-bold text-[#15803D]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" /> live
                  </span>
                </div>

                <div className="p-5">
                  {/* before line */}
                  <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-wider text-red-600">
                        <Minus className="h-3 w-3" /> Before · 42% match
                      </span>
                    </div>
                    <p className="mt-2 font-body text-[14px] leading-snug text-[#0F172A] lc-strike">
                      Helped team complete projects on time.
                    </p>
                  </div>

                  <div className="my-3 flex items-center gap-2 text-[#94A3B8]">
                    <span className="h-px flex-1 bg-[#E2E8F0]" />
                    <span className="font-body text-[10px] font-bold uppercase tracking-wider">AI rewrites</span>
                    <span className="h-px flex-1 bg-[#E2E8F0]" />
                  </div>

                  {/* after line */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <Plus className="h-3 w-3" /> After · 91% match
                      </span>
                      <span className="lc-badge-ai">AI</span>
                    </div>
                    <p className="mt-2 font-body text-[14px] leading-snug text-[#0F172A]">
                      Led <span className="bg-[#FEF08A] px-1">cross-functional</span> delivery of 3 <span className="bg-[#FEF08A] px-1">enterprise SaaS</span> migrations, reducing time-to-deploy by 40% using <span className="bg-[#FEF08A] px-1">Agile/Scrum</span>.
                    </p>
                  </div>

                  {/* keyword panel */}
                  <div className="mt-5 rounded-xl bg-[#F8FAFC] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#475569]">Keywords inserted</p>
                      <p className="font-body text-[11px] font-bold text-[#15803D]">+ 7 added</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missingKeywords.map((k, i) => (
                        <span key={k} className="lc-pill bg-emerald-100 text-emerald-800" style={{ animation: `lc-num-slide 0.4s ${i * 0.08}s both` }}>
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* score gauge */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { l: "ATS pass", v: "94" },
                      { l: "JD match", v: "91" },
                      { l: "Read score", v: "88" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl border border-[#E2E8F0] bg-white p-3 text-center">
                        <p className="font-display text-[26px] font-extrabold tracking-tight text-[#1A56DB] lc-flip">{m.v}%</p>
                        <p className="mt-0.5 font-body text-[10px] text-[#64748B]">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* floating chip */}
              <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-[#1A56DB] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(26,86,219,0.6)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">Score jump</p>
                <p className="font-display text-[18px] font-extrabold text-white">+49 pts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIPE ═══ */}
      <section className="border-y border-[#E2E8F0] bg-white py-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            { v: "+49", l: "Avg score jump" },
            { v: "8s", l: "Time to analyze" },
            { v: "15", l: "ATS engines simulated" },
            { v: "12", l: "Industries calibrated" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="font-display text-[44px] font-extrabold leading-none tracking-tight text-[#0F172A] sm:text-[52px]">{s.v}</p>
              <p className="mt-2 font-body text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ THE DIFF — long-form comparison ═══ */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#1A56DB]">The Diff</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[60px]">
                  What gets <span className="italic text-[#1A56DB]">added.</span><br />
                  What gets <span className="lc-strike text-[#94A3B8]">deleted.</span><br />
                  What gets <span className="bg-[#FEF08A] px-1.5">highlighted.</span>
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                JD Alignment doesn&apos;t just spit out a score. It marks the surgical changes — keyword by keyword, bullet by bullet — and shows you the receipt for every edit so you can approve, tweak, or reject.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-6 lg:grid-cols-2">
            <RevealOnView>
              <div className="h-full rounded-3xl border border-red-100 bg-white p-7">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <X className="h-4 w-4" />
                  </span>
                  <p className="font-body text-[12px] font-bold uppercase tracking-wider text-red-600">Before · 34% match</p>
                </div>
                <div className="mt-5 space-y-3 font-body text-[15px] leading-[1.7] text-[#334155]">
                  <p className="lc-strike">Helped team complete projects on time.</p>
                  <p className="lc-strike">Worked on customer support tasks.</p>
                  <p className="lc-strike">Did marketing for new product.</p>
                </div>
                <div className="mt-6 border-t border-red-100 pt-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Missing keywords</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {missingKeywords.map((k) => (
                      <span key={k} className="lc-pill border border-red-200 bg-red-50 text-red-700">- {k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnView>

            <RevealOnView>
              <div className="h-full rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-7">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="font-body text-[12px] font-bold uppercase tracking-wider text-emerald-700">After · 91% match</p>
                  <span className="ml-auto lc-badge-ai">AI rewrite</span>
                </div>
                <div className="mt-5 space-y-3 font-body text-[15px] leading-[1.7] text-[#0F172A]">
                  <p>Led <span className="bg-[#FEF08A] px-1">cross-functional</span> delivery of 3 SaaS migrations, reducing <span className="bg-[#FEF08A] px-1">time-to-deploy</span> by 40%.</p>
                  <p>Owned customer-support workflow for 1,200+ accounts, cutting <span className="bg-[#FEF08A] px-1">avg resolution</span> from 14h to 4h.</p>
                  <p>Launched product positioning across 4 channels, lifting trial-to-paid by <span className="bg-[#FEF08A] px-1">A/B-tested</span> 18%.</p>
                </div>
                <div className="mt-6 border-t border-emerald-100 pt-4">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Keywords woven in</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[...matchedKeywords, ...missingKeywords].map((k) => (
                      <span key={k} className="lc-pill bg-emerald-100 text-emerald-800">+ {k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealOnView>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS — bold list ═══ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[640px]">
              <span className="lc-overline text-[#1A56DB]">What you actually get</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Six AI capabilities,<br />one keyboard shortcut.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {benefits.map((b, i) => (
              <RevealOnView key={b.t}>
                <div className="flex gap-5 border-t border-[#0F172A]/10 pt-7">
                  <span className="font-display text-[28px] font-extrabold leading-none text-[#1A56DB]">
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

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="mb-12">
            <span className="lc-overline text-white/55">Step by Step</span>
            <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
              From paste to{" "}
              <span className="lc-gradient-text-animated">90%+ match</span><br />
              in under 60 seconds.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.07]">
                <p className="font-display text-[52px] font-extrabold leading-none tracking-tight text-white/15">{s.n}</p>
                <h3 className="mt-4 font-display text-[20px] font-bold tracking-tight text-white">{s.t}</h3>
                <p className="mt-2 font-body text-[14px] leading-[1.7] text-white/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 text-center">
              <span className="lc-overline text-[#1A56DB]">Reader Letters</span>
              <h2 className="mt-3 font-display text-[42px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[52px]">
                People who got their interview back.
              </h2>
            </div>
          </RevealOnView>
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-white p-8">
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
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#1A56DB]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "AI Resume Builder", d: "Plain English in → polished bullets out.", icon: FileText },
              { href: "/features/ats-score", t: "ATS Score Checker", d: "Find every parser-breaking format issue.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter Generator", d: "Same JD. Tailored letter in 60 seconds.", icon: Mail },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#1A56DB] hover:bg-[#F8FAFF]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1A56DB]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#1A56DB]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="relative overflow-hidden bg-[#1A56DB] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Stop guessing what<br />
            <span className="bg-white px-3 text-[#1A56DB]">recruiters want.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/85">
            Let the AI show you exactly how to match the job — and rewrite your resume to prove it.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#1A56DB] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Run my first alignment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* mobile sticky CTA */}
      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1A56DB] py-3 font-body text-[14px] font-bold text-white">
          Run my alignment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
