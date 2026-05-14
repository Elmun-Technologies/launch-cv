import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  Star,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Target,
  FileText,
  Mail,
  Upload,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "ATS Score Checker — See Exactly Why Your Resume Is Getting Filtered",
  description:
    "Upload your resume. Get a 0–100 ATS score in 8 seconds, with every parser-breaking issue mapped to a one-click fix. The average user gains +43 points after the first pass.",
  pathname: "/features/ats-score",
  keywords: ["ATS score checker", "resume ATS test", "applicant tracking system resume", "ATS resume checker free", "resume pass ATS"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "ATS Score Checker | Launch CV",
      url: absoluteUrl("/features/ats-score"),
      description: "Get your ATS resume score and a prioritized fix list.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "ATS Score", item: absoluteUrl("/features/ats-score") },
      ],
    },
  ],
};

const issues = [
  { p: "High", t: "Embedded text box in 'Experience'", d: "ATS parsers can't extract content from text boxes. Convert to plain paragraphs.", color: "border-red-200 bg-red-50 text-red-700" },
  { p: "High", t: "Multi-column layout", d: "Two-column resumes break parsing order. Move to single-column for ATS rounds.", color: "border-red-200 bg-red-50 text-red-700" },
  { p: "Medium", t: "Non-standard fonts (Calibri Light)", d: "Some parsers default-substitute. Use Inter, Source Sans, or Arial.", color: "border-amber-200 bg-amber-50 text-amber-700" },
  { p: "Medium", t: "Date format inconsistency", d: "You mix 'Mar 2022' and '03/22'. Standardize to one — preferably MMM YYYY.", color: "border-amber-200 bg-amber-50 text-amber-700" },
  { p: "Low", t: "Header bar (graphic)", d: "Header graphic blocks contact-info parsing on iCIMS. Move email + phone to body.", color: "border-yellow-200 bg-yellow-50 text-yellow-700" },
];

const atsEngines = ["Workday", "Greenhouse", "Lever", "iCIMS", "Taleo", "Bullhorn", "BambooHR", "JazzHR", "SmartRecruiters", "Recruitee", "Jobvite", "ICIMS", "Ashby", "Pinpoint", "Breezy"];

const benefits = [
  { t: "Formatting parser", d: "Catches tables, text boxes, columns, graphics, and header/footer issues that break ATS in seconds." },
  { t: "Keyword density check", d: "Measures keyword richness against industry benchmarks for your target role." },
  { t: "File compatibility test", d: "Validates file type, size, encoding, and font embedding across 15 parsers." },
  { t: "Section structure audit", d: "Confirms Work Experience, Education, Skills and Contact Info are all parseable." },
  { t: "Date format consistency", d: "ATS systems need uniform date formats. We flag every inconsistency for you." },
  { t: "Contact info parsing test", d: "Ensures name, email, phone and LinkedIn land in standard parseable positions." },
];

const testimonials = [
  { q: "My ATS score went from 38% to 93%. I had no idea how broken my resume was — tables, headers, the wrong fonts. Two weeks later, three offers.", n: "Marcus T.", r: "Product Manager → Notion" },
  { q: "I sent 50 applications with zero responses. Launch CV's ATS checker showed me my resume was rejected before any human ever saw it. Hired in 3 weeks.", n: "Chloe W.", r: "Operations Analyst" },
];

export default function AtsScorePage() {
  return (
    <div className="lc-theme-orange flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO — scorecard centerpiece */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF7ED] to-white pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#EA580C] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-60 h-[400px] w-[400px] rounded-full bg-[#D97706] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EA580C]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#EA580C]">
                <BarChart3 className="h-3.5 w-3.5" /> Feature · ATS Score
              </span>
              <span className="lc-tape hidden sm:inline-flex">75% of resumes are auto-rejected</span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[80px] lg:text-[100px]">
              <span className="block">Find out</span>
              <span className="block lc-mega-italic text-[#EA580C]">why you&apos;re</span>
              <span className="block">getting <span className="bg-[#FEF08A] px-2">filtered.</span></span>
            </h1>

            <p className="mt-7 max-w-[540px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              Upload your resume. In 8 seconds you get a 0–100 ATS score, a breakdown by parser dimension, and a prioritized list of every fix. The average user gains <span className="font-bold text-[#0F172A]">+43 points</span> after one pass.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#EA580C] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(234,88,12,0.7)]">
                Check my score <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#issues" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See the kinds of issues we catch <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0F172A]/10 pt-6">
              {[
                { v: "+43", l: "Avg point gain · 1 pass" },
                { v: "8s", l: "Time to score" },
                { v: "15", l: "ATS engines tested" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[28px] font-extrabold leading-none tracking-tight text-[#0F172A]">{s.v}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — gauge dashboard */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="lc-window">
                <div className="lc-window-bar">
                  <span className="lc-window-dot bg-[#FF5F57]" />
                  <span className="lc-window-dot bg-[#FEBC2E]" />
                  <span className="lc-window-dot bg-[#28C840]" />
                  <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">ATS Report · resume_v3.pdf</span>
                </div>

                <div className="grid grid-cols-1 gap-0 sm:grid-cols-5">
                  {/* gauge */}
                  <div className="sm:col-span-2 flex flex-col items-center justify-center border-b border-[#E2E8F0] bg-[#FFF7ED] p-6 sm:border-b-0 sm:border-r">
                    <div className="relative h-[160px] w-[160px]">
                      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#FED7AA" strokeWidth="14" />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="url(#g)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          className="lc-gauge-arc"
                          style={{ ["--lc-gauge-target" as string]: "57" }}
                        />
                        <defs>
                          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#EA580C" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="font-display text-[44px] font-extrabold leading-none text-[#0F172A]">80</p>
                        <p className="font-body text-[10px] uppercase tracking-wider text-[#94A3B8]">of 100</p>
                      </div>
                    </div>
                    <p className="mt-4 font-body text-[12px] font-bold uppercase tracking-wider text-[#EA580C]">Good · fixes recommended</p>
                  </div>

                  {/* category breakdown */}
                  <div className="sm:col-span-3 p-6">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Breakdown</p>
                    <div className="mt-3 space-y-3">
                      {[
                        { l: "Formatting", v: 72, c: "bg-amber-500" },
                        { l: "Keywords", v: 86, c: "bg-emerald-500" },
                        { l: "Structure", v: 91, c: "bg-emerald-500" },
                        { l: "Readability", v: 78, c: "bg-amber-500" },
                      ].map((r) => (
                        <div key={r.l}>
                          <div className="mb-1 flex items-center justify-between font-body text-[12px]">
                            <span className="text-[#475569]">{r.l}</span>
                            <span className="font-bold text-[#0F172A]">{r.v}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#FFF7ED]">
                            <div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.v}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-px border-t border-[#E2E8F0] bg-[#E2E8F0]">
                  {[
                    { l: "High issues", v: 2, c: "text-red-600" },
                    { l: "Medium", v: 4, c: "text-amber-600" },
                    { l: "Low", v: 6, c: "text-yellow-600" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white p-4 text-center">
                      <p className={`font-display text-[24px] font-extrabold ${s.c}`}>{s.v}</p>
                      <p className="font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-[#EA580C] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(234,88,12,0.6)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">If fixed</p>
                <p className="font-display text-[18px] font-extrabold text-white">→ 96 / 100</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATS engines marquee */}
      <section className="border-y border-[#E2E8F0] bg-white py-10">
        <p className="mb-4 text-center font-body text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">Simulated parsers</p>
        <div className="overflow-hidden">
          <div className="lc-marquee-slow">
            {[...Array(2)].map((_, p) => (
              <div key={p} className="flex items-center gap-10 px-6">
                {atsEngines.map((n) => (
                  <span key={`${p}-${n}`} className="shrink-0 font-display text-[18px] font-bold tracking-tight text-[#94A3B8]">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISSUE LIST */}
      <section id="issues" className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#EA580C]">Issue list · prioritized</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Every bug.<br />
                <span className="italic text-[#EA580C]">Named.</span> Ranked. Fixable.
              </h2>
            </div>
          </RevealOnView>

          <div className="space-y-3">
            {issues.map((i, idx) => (
              <RevealOnView key={i.t}>
                <div className={`group flex items-start gap-5 rounded-2xl border-2 bg-white p-5 ${i.color}`}>
                  <span className="mt-0.5 inline-flex h-6 shrink-0 items-center rounded-full px-2.5 font-body text-[11px] font-bold uppercase tracking-wider">
                    {i.p}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0F172A]">{i.t}</h3>
                      <span className="hidden font-body text-[12px] font-bold text-[#94A3B8] sm:inline">Issue · {String(idx + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="mt-1 font-body text-[14px] leading-[1.65] text-[#475569]">{i.d}</p>
                  </div>
                  <button className="hidden shrink-0 rounded-full bg-[#0F172A] px-4 py-2 font-body text-[12px] font-bold text-white transition group-hover:bg-[#1E293B] sm:block">
                    Fix it
                  </button>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#EA580C]">What we test</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Six dimensions. One score.<br />
                <span className="italic">Zero</span> mystery.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {benefits.map((b, i) => (
              <RevealOnView key={b.t}>
                <div className="flex gap-5 border-t border-[#0F172A]/10 pt-7">
                  <span className="font-display text-[28px] font-extrabold leading-none text-[#EA580C]">
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

      {/* PROCESS */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12">
              <span className="lc-overline text-white/55">3-step process</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
                Upload. Analyze. Fix.<br />
                <span className="lc-gradient-text-animated">All before lunch.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { i: Upload, t: "Upload your file", d: "PDF, DOCX, or pasted plain text. We parse it in under 2 seconds — same way 15 ATS engines would." },
              { i: AlertTriangle, t: "Get every issue named", d: "12 categories of parsing failures detected. Each one tagged High / Medium / Low priority, with a specific fix path." },
              { i: CheckCircle2, t: "Apply the fixes & rescore", d: "Fix inside Launch CV or in your own tool. Re-upload, re-score. Most users gain 20–40 points on round one." },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.07]">
                <p className="font-display text-[52px] font-extrabold leading-none tracking-tight text-white/15">{String(i + 1).padStart(2, "0")}</p>
                <s.i className="mt-4 h-6 w-6 text-orange-300" />
                <h3 className="mt-4 font-display text-[20px] font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2 font-body text-[14px] leading-[1.7] text-white/65">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-white p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[20px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F172A]">&quot;{t.q}&quot;</p>
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

      {/* RELATED */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#EA580C]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume to a target role.", icon: Target },
              { href: "/features/resume-builder", t: "Resume Builder", d: "12 ATS-safe templates.", icon: FileText },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#EA580C] hover:bg-[#FFF7ED]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFEDD5] text-[#EA580C]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#EA580C]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EA580C] via-[#C2410C] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            A <span className="italic text-orange-200">90+</span> ATS score<br />
            changes everything.
          </h2>
          <p className="mx-auto mt-7 max-w-[560px] font-body text-[17px] leading-[1.65] text-white/85">
            Launch CV users improve their ATS score by an average of 43 points on the first pass. More score = more human eyes = more interview replies.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#EA580C] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Check my ATS score <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#EA580C] py-3 font-body text-[14px] font-bold text-white">
          Check my score <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
