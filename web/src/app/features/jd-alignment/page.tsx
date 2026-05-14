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
  Check,
  Star,
  Mail,
  FileText,
  BarChart3,
  Plus,
  Minus,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "JD Alignment — Match Your Resume to Any Job",
  description:
    "Paste any job description and watch your match score climb. Launch CV maps every requirement, fills keyword gaps, and rewrites your bullets — all in under 60 seconds.",
  pathname: "/features/jd-alignment",
  keywords: [
    "JD alignment",
    "resume job description match",
    "keyword gap analysis",
    "resume ATS optimization",
    "AI resume tailoring",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "JD Alignment | Launch CV",
      url: absoluteUrl("/features/jd-alignment"),
      description:
        "Match your resume to any job description with AI keyword gap analysis and bullet rewrites.",
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

const missingKeywords = ["Agile/Scrum", "Roadmapping", "OKRs", "A/B testing", "Cross-functional", "SQL"];

const benefits = [
  {
    t: "Keyword extraction",
    d: "AI parses every hard skill, soft skill, tool, and seniority signal in the JD.",
  },
  {
    t: "Ranked gap analysis",
    d: "Side-by-side view of what your resume has versus what the role asks for — sorted by impact.",
  },
  {
    t: "AI bullet rewrites",
    d: "Missing keywords woven naturally into your existing experience. No fabrication, no keyword stuffing.",
  },
  {
    t: "Real-time match score",
    d: "Score updates live as you accept changes. Aim for 90% or higher before submitting.",
  },
  {
    t: "Multi-job tracking",
    d: "Save scores across applications and compare which roles you fit best.",
  },
  {
    t: "Tested on 15 ATS engines",
    d: "Workday, Greenhouse, Lever, iCIMS, Taleo, BambooHR, JazzHR, SmartRecruiters, and more.",
  },
];

const steps = [
  { n: "01", t: "Add your resume", d: "Upload PDF or DOCX, or paste plain text. We parse it in under two seconds." },
  { n: "02", t: "Paste the job description", d: "From LinkedIn, Indeed, or any careers page. URL or raw text — both work." },
  { n: "03", t: "Review your match score", d: "AI extracts every requirement and produces your gap map in under ten seconds." },
  { n: "04", t: "Approve rewrites", d: "Accept AI suggestions one click at a time. The score updates as you go." },
  { n: "05", t: "Export and apply", d: "Download as PDF or DOCX, or push directly into the cover letter generator." },
  { n: "06", t: "Track across roles", d: "Save match scores per application and compare side by side." },
];

const testimonials = [
  {
    q: "I was applying to the same PM roles for months with no callbacks. Launch CV showed me I was missing fourteen critical keywords. Five interviews in ten days after I fixed it.",
    n: "Rachel M.",
    r: "Product Manager at Linear",
  },
  {
    q: "The JD alignment alone is worth the subscription. It feels like having a recruiter whisper exactly what to change before you submit.",
    n: "Tom H.",
    r: "Software Engineer at Datadog",
  },
];

export default function JDAlignmentPage() {
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
              "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.07), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Target className="h-3.5 w-3.5 text-[#1A56DB]" />
                JD Alignment
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Match your resume to any job in under a minute
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Paste a job description. Launch CV scores your fit, flags every missing keyword, and rewrites your bullets to lift the match — typically from around 40% to 90%+.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Run my first alignment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#64748B]">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> 15 ATS engines</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> 12 industries</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#1A56DB]" /> Any JD format</span>
              </div>
            </div>

            {/* MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">JD Alignment · live diff</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> live
                  </span>
                </div>

                <div className="p-6">
                  <div className="rounded-lg border border-red-200 bg-red-50/40 p-4">
                    <div className="flex items-center gap-2">
                      <Minus className="h-3.5 w-3.5 text-red-600" />
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Before · 42% match</p>
                    </div>
                    <p className="mt-2 text-[13px] leading-snug text-[#475569] line-through decoration-red-400/70">
                      Helped team complete projects on time.
                    </p>
                  </div>

                  <div className="my-3 flex items-center gap-2 text-[#94A3B8]">
                    <span className="h-px flex-1 bg-[#E2E8F0]" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">AI rewrite</span>
                    <span className="h-px flex-1 bg-[#E2E8F0]" />
                  </div>

                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plus className="h-3.5 w-3.5 text-emerald-700" />
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">After · 91% match</p>
                      </div>
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700">AI</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-snug text-[#0F172A]">
                      Led cross-functional delivery of 3 enterprise SaaS migrations, cutting time-to-deploy by 40% with Agile/Scrum.
                    </p>
                  </div>

                  <div className="mt-5 rounded-lg bg-[#FAFBFC] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#475569]">Keywords inserted</p>
                      <p className="text-[11px] font-semibold text-emerald-700">+ {missingKeywords.length} added</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missingKeywords.map((k) => (
                        <span key={k} className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { l: "ATS pass", v: "94" },
                      { l: "JD match", v: "91" },
                      { l: "Readability", v: "88" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-lg border border-[#E2E8F0] bg-white p-3 text-center">
                        <p className="text-[24px] font-bold tracking-tight text-[#1A56DB]">{m.v}%</p>
                        <p className="mt-0.5 text-[11px] text-[#64748B]">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-12">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 px-6 sm:grid-cols-4">
          {[
            { v: "+49", l: "Average score jump" },
            { v: "8 sec", l: "Time to analyze" },
            { v: "15", l: "ATS engines tested" },
            { v: "12", l: "Industries calibrated" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-[32px] font-bold tracking-tight text-[#0F172A] sm:text-[40px]">{s.v}</p>
              <p className="mt-1 text-[12px] font-medium uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">What you get</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six AI capabilities behind one button
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#1A56DB]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{b.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                From paste to a 90%+ match in under a minute
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EFF6FF] text-[13px] font-bold text-[#1A56DB]">
                    {s.n}
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
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Customer stories</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                People who got the interview back
              </h2>
            </div>
          </RevealOnView>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <figure className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-[1.7] text-[#0F172A]">&ldquo;{t.q}&rdquo;</blockquote>
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
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "AI Resume Builder", d: "Plain English in, polished bullets out.", icon: FileText },
              { href: "/features/ats-score", t: "ATS Score Checker", d: "Find every parser-breaking format issue.", icon: BarChart3 },
              { href: "/features/cover-letter", t: "Cover Letter Generator", d: "Same JD, tailored letter in 60 seconds.", icon: Mail },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_-15px_rgba(15,23,42,0.15)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Stop guessing what recruiters want
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Let AI show you exactly how to match the job — and rewrite your resume to prove it.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            Run my first alignment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
