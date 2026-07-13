import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { KeyFacts } from "@/components/key-facts";
import { RevealOnView } from "@/components/reveal-on-view";
import { FeatureRelatedLinks } from "@/components/feature-related-links";
import { StickyCta } from "@/components/sticky-cta";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";
import { howToLd, speakableLd } from "@/lib/geo";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";
import {
  Target,
  ArrowRight,
  Check,
  Mail,
  FileText,
  BarChart3,
  Plus,
  Minus,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "JD Alignment: Match Your Resume to Any Job in Minutes",
  description:
    "JD alignment scores your resume against any job description, then fills keyword gaps and rewrites bullets to close the match. Start free →",
  pathname: "/features/jd-alignment",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "JD alignment",
    "match resume to job description",
    "resume job description match",
    "tailor resume to job description",
    "keyword gap analysis",
    "resume ATS optimization",
    "AI resume tailoring",
  ],
});

// Single source of truth for the FAQ: the visible section below and the
// FAQPage JSON-LD both read from this array, so Google's rich result always
// matches the on-page text verbatim. Questions map to exact Search Console
// queries: "match resume to job description", "keyword gap analysis", etc.
const faqs: FaqItem[] = [
  {
    q: "How do I match my resume to a job description?",
    a: "Paste the job description into LaunchCV alongside your resume. The AI extracts every hard skill, tool, and seniority signal in the posting, compares it to your resume, and shows a ranked list of the keywords and requirements you are missing — then rewrites your bullets to close the gap without fabricating experience.",
  },
  {
    q: "What is a resume-to-job-description match score?",
    a: "It is a percentage that estimates how closely your resume matches a specific job posting, based on the skills, keywords, and requirements the role asks for. LaunchCV updates the score live as you accept AI rewrites, so you can watch it climb as you close each gap before you apply.",
  },
  {
    q: "What is keyword gap analysis?",
    a: "Keyword gap analysis is a side-by-side view of what your resume already contains versus what the job description requires, sorted by impact. It shows exactly which terms — like Agile/Scrum, roadmapping, SQL, or OKRs — are missing so you can add the ones you can honestly claim.",
  },
  {
    q: "Does tailoring my resume to each job actually help?",
    a: "Yes. Applicant tracking systems rank resumes against the exact job description, so a resume tuned to one posting scores far higher than a generic one. Tailoring the keywords and framing to each role is one of the highest-impact things you can do to get past the ATS filter and reach a recruiter.",
  },
  {
    q: "Does it fabricate experience or keyword-stuff my resume?",
    a: "No. LaunchCV weaves missing keywords into your real, existing experience and flags anything it cannot support with your background. It never invents roles, employers, or numbers. Modern ATS software and human reviewers both penalize keyword stuffing, so the goal is an accurate resume that genuinely matches the role.",
  },
  {
    q: "Can I tailor my resume for multiple jobs at once?",
    a: "Yes. LaunchCV saves a separate match score per application, so you can compare which roles you fit best and reuse a strong base resume across every posting. You tailor each one in about a minute against its job description, instead of rewriting your resume from scratch each time.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "JD Alignment | LaunchCV",
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
    howToLd({
      name: "How to match your resume to a job description",
      description:
        "Paste a job description, review your match score and keyword gaps, approve AI bullet rewrites, and export a tailored resume.",
      totalTime: "PT1M",
      url: absoluteUrl("/features/jd-alignment"),
      steps: [
        { name: "Add your resume", text: "Upload a PDF or DOCX, or paste plain text. It is parsed in under two seconds." },
        { name: "Paste the job description", text: "Add the JD from LinkedIn, Indeed, or any careers page — URL or raw text both work." },
        { name: "Review your match score", text: "AI extracts every requirement and produces your ranked keyword gap map in under ten seconds." },
        { name: "Approve rewrites", text: "Accept AI suggestions one click at a time; the match score updates as you go." },
        { name: "Export and apply", text: "Download as PDF or DOCX, or push directly into the cover letter generator." },
        { name: "Track across roles", text: "Save match scores per application and compare which roles you fit best." },
      ],
    }),
    speakableLd(["h1", ".lc-key-facts-lead"]),
    faqPageLd(faqs),
  ],
};

const keyFacts = [
  "Scores your resume's fit against the job description in about a minute.",
  "Ranked keyword gap analysis maps every JD requirement to your resume.",
  "AI rewrites weave keywords into your real experience — no fabrication or stuffing.",
  "Formats for how ATS platforms like Workday, Greenhouse, and Lever parse resumes.",
];

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
    t: "Built for real ATS platforms",
    d: "Formatting is modeled on how systems like Workday, Greenhouse, Lever, and iCIMS actually parse resumes.",
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

// Why it works — honest, benefit-led copy. No fabricated user quotes or company names.
const whyItWorks = [
  {
    t: "See the gap, not just the score",
    d: "A ranked list of exactly which requirements your resume is missing — not just a number, but what to do about it.",
  },
  {
    t: "Rewrites, never invents",
    d: "AI weaves missing keywords into experience you actually have. It won't fabricate a skill, a tool, or a project you didn't do.",
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
                <Target className="h-3.5 w-3.5 text-[#2563EB]" />
                JD Alignment
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Match your resume to any job in under a minute
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Paste a job description. LaunchCV scores your fit, flags every missing keyword, and rewrites your bullets to close the gaps.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="JD Alignment reads any job description, scores your resume's fit, flags every missing keyword, and rewrites your bullets to close the gaps — in about a minute. It weaves keywords into your real experience without fabrication or stuffing, and formats for how ATS platforms parse resumes."
                facts={keyFacts}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="feature_jd_alignment"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Run my first alignment
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#64748B]">
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> Any JD format</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> No fabricated keywords</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#2563EB]" /> Free to try</span>
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
                        <p className="text-[24px] font-bold tracking-tight text-[#2563EB]">{m.v}%</p>
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

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#2563EB]">See it in action</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Watch your match score climb</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/jd-alignment.svg"
            alt="The LaunchCV JD alignment view matching a resume to a job description, showing a 91% match score, the matched ATS keywords, and each requirement met."
            caption="Paste a job description; watch the match score and matched keywords update as you tailor."
          />
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
              <p className="lc-overline text-[#2563EB]">What you get</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six AI capabilities behind one button
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#2563EB]" />
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
              <p className="lc-overline text-[#2563EB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                From paste to a tailored match in under a minute
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EFF6FF] text-[13px] font-bold text-[#2563EB]">
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

      {/* DEEP DIVE — crawlable topical depth */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#2563EB]">The complete guide</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How to match your resume to a job description
            </h2>
          </RevealOnView>

          <div className="mt-8 space-y-6 text-[16px] leading-[1.8] text-[#334155]">
            <p>
              To <strong>match your resume to a job description</strong>, you first have to read
              the posting the way an applicant tracking system does: as a list of required skills,
              tools, and seniority signals. A recruiter using Workday or Greenhouse ranks every
              applicant against that list, so two candidates with identical experience can land on
              opposite sides of the filter purely based on how closely their resume mirrors the
              language of the role. That is why a generic resume sent to fifty jobs underperforms a
              tailored one sent to five.
            </p>
            <p>
              LaunchCV automates the tailoring. Paste any job description — from LinkedIn, Indeed,
              or a careers page — and the AI runs a <strong>keyword gap analysis</strong>: a
              side-by-side map of what your resume already contains versus what the role asks for,
              ranked by impact. It then rewrites your existing bullets to fold in the missing terms
              naturally, so your <strong>match score</strong> climbs as each gap closes. The score
              updates live as you accept each change, and nothing is fabricated
              — anything the AI cannot support with your real background is flagged, not invented.
            </p>

            <h3 className="pt-2 text-[20px] font-semibold tracking-tight text-[#0F172A]">
              Tailoring vs. keyword stuffing
            </h3>
            <p>
              There is a real difference between <strong>tailoring a resume to a job description</strong>{" "}
              and keyword stuffing. Stuffing means padding your resume with terms you cannot back up;
              both modern ATS software and human reviewers penalize it. Tailoring means reframing the
              genuine work you have already done in the vocabulary the role uses — calling a project
              &ldquo;cross-functional delivery&rdquo; because it was, or surfacing the SQL you actually
              wrote. The result is an accurate resume that also happens to rank well.
            </p>

            <h3 className="pt-2 text-[20px] font-semibold tracking-tight text-[#0F172A]">
              Confirm the match before you apply
            </h3>
            <p>
              A high JD match is only half the job — the resume still has to parse cleanly. After you
              align, run it through the{" "}
              <Link href="/features/ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                ATS score checker to see how your resume reads to ATS software
              </Link>{" "}
              and catch any formatting issues. For the underlying method, see our guides on{" "}
              <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                checking your ATS score
              </Link>{" "}
              and{" "}
              <Link href="/blog/resume-keywords-for-software-engineers" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                choosing the right resume keywords
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Why it beats tailoring by hand</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Manual editing vs. AI resume tailoring
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Tailoring a resume to each job description by hand is slow and easy to get wrong. JD Alignment does the requirement mapping, keyword gap analysis, and rewrites for you.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What matters</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#2563EB]">JD Alignment</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Editing by hand</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Requirement mapping", a: "AI maps every JD requirement to your resume", b: "Guesswork and copy-paste" },
                  { k: "Keyword gap analysis", a: "Ranked list of exactly what is missing", b: "You miss what you cannot see" },
                  { k: "Bullet rewrites", a: "Reworded to match — no fabrication", b: "Rewritten manually for each role" },
                  { k: "Match score", a: "Live score you can lift up to 95%", b: "No feedback before you submit" },
                  { k: "ATS optimization", a: "Tuned for common ATS parsers", b: "Formatting risk on every upload" },
                  { k: "Time per job", a: "Seconds to match and export", b: "30–60 minutes per application" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                        <span className="text-[#0F172A]">{r.a}</span>
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[#64748B]">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SCENARIO */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#2563EB]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Priya turned a 42% match into an interview
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Priya had applied to a dozen product roles with the same resume and heard nothing back. She pasted one job description into JD Alignment and saw the problem in seconds: a <span className="font-medium text-[#0F172A]">42% match</span>, with six required keywords — roadmapping, OKRs, A/B testing, cross-functional, SQL, and stakeholder management — missing entirely.
              </p>
              <p>
                Instead of rewriting from scratch, she accepted the AI rewrites one at a time. Each suggestion wove a missing keyword into experience she already had, and the match score climbed with every click. The keyword gap analysis went from a red list to a clean one.
              </p>
              <p>
                She exported the tailored version, ran it through the ATS score checker to confirm the formatting was clean, and applied. The point was never to game the system — it was to make sure a resume that already fit the role finally read that way to both the parser and the recruiter.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/ats-score" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-white">
                Check your ATS score <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/cover-letter" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-white">
                Generate a matching cover letter <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#2563EB]">FAQ</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">Common questions</h2>
          </RevealOnView>

          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <RevealOnView key={f.q}>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-[16px] font-semibold text-[#0F172A]">{f.q}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{f.a}</p>
                </div>
              </RevealOnView>
            ))}
          </div>

          <p className="mt-8 text-[14px] text-[#64748B]">
            Pair it with the{" "}
            <Link href="/features/resume-builder" className="font-semibold text-[#2563EB] hover:underline">resume builder</Link> and{" "}
            <Link href="/features/interview-prep" className="font-semibold text-[#2563EB] hover:underline">interview prep</Link>, or compare{" "}
            <Link href="/pricing" className="font-semibold text-[#2563EB] hover:underline">plans</Link>.
          </p>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Why it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built to close the gap, not just measure it
              </h2>
            </div>
          </RevealOnView>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {whyItWorks.map((w) => (
              <RevealOnView key={w.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <h3 className="text-[17px] font-semibold text-[#0F172A]">{w.t}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[#475569]">{w.d}</p>
                </div>
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
              { href: "/features/cover-letter", t: "Cover Letter Generator", d: "Same JD, tailored letter in about a minute.", icon: Mail },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_-15px_rgba(15,23,42,0.15)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
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
          <CtaLink cta="get_started" location="feature_jd_alignment"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            Run my first alignment
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      {/* FURTHER READING */}
      <section className="border-t border-[#E2E8F0] bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Further reading</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/blog/how-to-check-ats-score-of-resume", t: "Align your resume with the JD", d: "Check your ATS score and match any job description." },
              { href: "/blog/resume-keywords-for-software-engineers", t: "Resume keywords for engineers", d: "Pick the right keywords for each posting." },
              { href: "/blog/what-is-an-ats-score", t: "What is an ATS score?", d: "How matching drives your ATS ranking." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <p className="text-[14px] font-semibold text-[#0F172A] transition group-hover:text-[#2563EB]">{r.t}</p>
                <p className="mt-1 text-[13px] text-[#64748B]">{r.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeatureRelatedLinks
        accent="blue"
        useCases={[
          {
            href: "/use-cases/software-engineers",
            title: "Resumes for software engineers",
            desc: "Match your engineering resume to the exact stack each job description lists.",
          },
          {
            href: "/use-cases/product-managers",
            title: "Resumes for product managers",
            desc: "Align roadmap wins, OKRs, and metrics with what the PM role is asking for.",
          },
        ]}
      />

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        location="feature_jd_alignment"
      />

      <LandingFooter />
    </div>
  );
}
