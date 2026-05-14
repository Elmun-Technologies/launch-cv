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
  Check,
  Star,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Target,
  FileText,
  Mail,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "ATS Score Checker — See Why Your Resume Is Getting Filtered",
  description:
    "Upload your resume. Get a 0–100 ATS score in eight seconds, with every parser-breaking issue mapped to a one-click fix. The average user gains 43 points on the first pass.",
  pathname: "/features/ats-score",
  keywords: [
    "ATS score checker",
    "resume ATS test",
    "applicant tracking system resume",
    "ATS resume checker",
    "resume pass ATS",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "ATS Score Checker | Launch CV",
      url: absoluteUrl("/features/ats-score"),
      description: "Get an ATS score and a prioritized fix list for your resume.",
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
  { p: "High", t: "Embedded text box in Experience", d: "ATS parsers can&apos;t extract content from text boxes. Convert to plain paragraphs." },
  { p: "High", t: "Multi-column layout", d: "Two-column resumes break parsing order. Switch to single-column for ATS rounds." },
  { p: "Medium", t: "Non-standard fonts", d: "Some parsers fall back when fonts aren&apos;t embedded. Use Inter, Source Sans, or Arial." },
  { p: "Medium", t: "Date format inconsistency", d: "You mix &lsquo;Mar 2022&rsquo; and &lsquo;03/22&rsquo;. Standardize on MMM YYYY." },
  { p: "Low", t: "Header graphic blocks contact parsing", d: "Header art breaks contact-info parsing on iCIMS. Move email and phone to the body." },
];

const atsEngines = ["Workday", "Greenhouse", "Lever", "iCIMS", "Taleo", "Bullhorn", "BambooHR", "JazzHR", "SmartRecruiters", "Recruitee", "Jobvite", "Ashby"];

const benefits = [
  { t: "Formatting parser", d: "Catches tables, text boxes, columns, graphics, and header/footer issues that break ATS." },
  { t: "Keyword density check", d: "Measures keyword richness against industry benchmarks for your target role." },
  { t: "File compatibility test", d: "Validates file type, size, encoding, and font embedding across 15 parsers." },
  { t: "Section structure audit", d: "Confirms Work Experience, Education, Skills, and Contact Info are all parseable." },
  { t: "Date format consistency", d: "ATS systems need uniform date formats. We flag every inconsistency." },
  { t: "Contact info parsing test", d: "Ensures name, email, phone, and LinkedIn land in standard parseable positions." },
];

const testimonials = [
  {
    q: "My ATS score went from 38 to 93. I had no idea how broken my resume was — tables, headers, the wrong fonts. Two weeks later, three offers.",
    n: "Marcus T.",
    r: "Product Manager at Notion",
  },
  {
    q: "I sent 50 applications with zero responses. Launch CV&apos;s ATS checker showed me my resume was rejected before any human ever saw it. Hired in three weeks.",
    n: "Chloe W.",
    r: "Operations Analyst",
  },
];

const priorityClass: Record<string, string> = {
  High: "bg-red-50 text-red-700 ring-red-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Low: "bg-yellow-50 text-yellow-700 ring-yellow-200",
};

export default function AtsScorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 0%, rgba(234,88,12,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <BarChart3 className="h-3.5 w-3.5 text-[#EA580C]" />
                ATS Score Checker
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Find out why your resume is getting filtered
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Upload your resume. In eight seconds you get a 0–100 ATS score, a breakdown by parser dimension, and a prioritized list of every fix. The average user gains <span className="font-semibold text-[#0F172A]">43 points</span> on the first pass.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(234,88,12,0.4)] transition hover:bg-[#C2410C]"
                >
                  Check my score
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#issues"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See the issues we catch
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "+43", l: "Average score gain" },
                  { v: "8 sec", l: "Time to score" },
                  { v: "15", l: "ATS engines" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SCORECARD MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">ATS report · resume_v3.pdf</span>
                </div>

                <div className="grid sm:grid-cols-5">
                  <div className="flex flex-col items-center justify-center border-b border-[#E2E8F0] bg-[#FFF7ED] p-6 sm:col-span-2 sm:border-b-0 sm:border-r">
                    <div className="relative h-[140px] w-[140px]">
                      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#FED7AA" strokeWidth="12" />
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#EA580C" strokeWidth="12" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="57" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[36px] font-bold leading-none tracking-tight text-[#0F172A]">80</p>
                        <p className="text-[10px] uppercase tracking-wider text-[#94A3B8]">of 100</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#C2410C]">
                      Good — fixes recommended
                    </p>
                  </div>

                  <div className="p-6 sm:col-span-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Breakdown</p>
                    <div className="mt-3 space-y-3">
                      {[
                        { l: "Formatting", v: 72, c: "bg-amber-500" },
                        { l: "Keywords", v: 86, c: "bg-emerald-500" },
                        { l: "Structure", v: 91, c: "bg-emerald-500" },
                        { l: "Readability", v: 78, c: "bg-amber-500" },
                      ].map((r) => (
                        <div key={r.l}>
                          <div className="mb-1 flex items-center justify-between text-[12px]">
                            <span className="text-[#475569]">{r.l}</span>
                            <span className="font-semibold text-[#0F172A]">{r.v}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#FFF7ED]">
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
                      <p className={`text-[22px] font-bold ${s.c}`}>{s.v}</p>
                      <p className="text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINES */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-10">
        <p className="text-center text-[12px] font-medium uppercase tracking-wider text-[#94A3B8]">Simulated parsers</p>
        <div className="mx-auto mt-5 max-w-[1100px] flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6">
          {atsEngines.map((n) => (
            <span key={n} className="text-[14px] font-semibold tracking-tight text-[#64748B]">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* ISSUE LIST */}
      <section id="issues" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#EA580C]">Prioritized issue list</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Every bug, named and ranked
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 space-y-3">
            {issues.map((i) => (
              <RevealOnView key={i.t}>
                <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <span className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ${priorityClass[i.p]}`}>
                    {i.p}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">{i.t}</h3>
                    <p className="mt-1 text-[13px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: i.d }} />
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#EA580C]">What we test</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six dimensions, one score, zero mystery
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#EA580C]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{b.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#EA580C]">Three-step process</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Upload. Analyze. Fix.
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              { i: Upload, t: "Upload your file", d: "PDF, DOCX, or pasted plain text. We parse it in under two seconds — same way 15 ATS engines would." },
              { i: AlertTriangle, t: "Get every issue named", d: "12 categories of parsing failures detected, each tagged High, Medium, or Low priority with a specific fix path." },
              { i: CheckCircle2, t: "Apply the fixes and rescore", d: "Fix inside Launch CV or in your own tool. Re-upload to confirm — most users gain 20–40 points on round one." },
            ].map((s, i) => (
              <RevealOnView key={s.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 text-[13px] font-bold text-[#EA580C]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-orange-50 text-[#EA580C]">
                    <s.i className="h-4 w-4" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{s.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <figure className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-[1.7] text-[#0F172A]" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.q}&rdquo;` }} />
                  <figcaption className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <p className="text-[14px] font-semibold text-[#0F172A]">{t.n}</p>
                    <p className="text-[13px] text-[#64748B]">{t.r}</p>
                  </figcaption>
                </figure>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume to a target role.", icon: Target },
              { href: "/features/resume-builder", t: "Resume Builder", d: "12 ATS-safe templates.", icon: FileText },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#EA580C]">
                  <r.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-0.5 text-[13px] text-[#64748B]">{r.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            A 90+ ATS score changes everything
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.65] text-[#475569]">
            More score means more human eyes on your resume — and more interview replies in your inbox.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#C2410C]"
          >
            Check my ATS score
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
