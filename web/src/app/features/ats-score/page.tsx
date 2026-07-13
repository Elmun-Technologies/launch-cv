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
  BarChart3,
  ArrowRight,
  Check,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Target,
  FileText,
  Mail,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "ATS Score Checker: Free 0–100 Rating in Seconds",
  description:
    "Check your ATS score with a parser modeled on how ATS platforms like Workday and Greenhouse read resumes. Get a 0–100 rating plus a prioritized fix list in seconds. Try it free →",
  pathname: "/features/ats-score",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "ATS score checker",
    "ATS score",
    "ATS assessment",
    "test resume ATS",
    "resume ATS test",
    "applicant tracking system resume",
    "ATS resume checker",
    "resume pass ATS",
    "check resume ATS score",
  ],
});

// Single source of truth for the FAQ: the visible section below and the
// FAQPage JSON-LD both read from this array, so Google's rich result always
// matches the on-page text verbatim. Questions map to exact Search Console
// queries: "ATS score checker", "check resume ATS score", "resume pass ATS".
const faqs: FaqItem[] = [
  {
    q: "What is an ATS score checker?",
    a: "An ATS score checker is a tool that simulates how applicant tracking systems parse and rank your resume, then returns a 0–100 score. LaunchCV checks your resume the way common ATS platforms — like Workday, Greenhouse, and Lever — parse it, and returns a prioritized list of every formatting and keyword fix.",
  },
  {
    q: "How do I check the ATS score of my resume?",
    a: "Upload your resume as a PDF, DOCX, or pasted plain text on the free ATS check page. In seconds you get a 0–100 ATS score, a breakdown across formatting, keywords, structure, and readability, and a fix list ranked High, Medium, and Low priority. No account is required to see your score.",
  },
  {
    q: "What is a good ATS score for a resume?",
    a: "Aim for 80 or higher, measured against the specific job description you are applying to. Scores below 65 are at high risk of being filtered out before a recruiter ever sees them. Each fix on your prioritized list is designed to move the needle — the score updates live as you apply them.",
  },
  {
    q: "Why is my resume failing ATS?",
    a: "The most common reasons a resume fails ATS parsing are multi-column layouts, text inside tables or text boxes, header/footer graphics that hide contact info, non-embedded fonts, and inconsistent date formats. The checker names each issue on your resume specifically and tells you exactly how to fix it.",
  },
  {
    q: "Which ATS engines does LaunchCV test against?",
    a: "LaunchCV's checker is built around the parsing rules common to widely used applicant tracking systems — like Workday, Greenhouse, Lever, and iCIMS — flagging the layout and formatting choices most likely to break in one of them.",
  },
  {
    q: "Is the ATS resume checker free?",
    a: "Yes. You can test your resume and see your ATS score and full parser breakdown for free, with no account. The one-click AI fixes and the rest of the toolkit (JD alignment, cover letters, interview prep) are on a paid plan.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "ATS Score Checker | LaunchCV",
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
    howToLd({
      name: "How to check your resume's ATS score",
      description:
        "Upload your resume to get a 0–100 ATS score and a prioritized fix list, then apply the fixes and re-score.",
      totalTime: "PT1M",
      url: absoluteUrl("/features/ats-score"),
      steps: [
        { name: "Upload your file", text: "Upload a PDF, DOCX, or pasted plain text — parsed in seconds, modeled on how common ATS platforms read resumes." },
        { name: "Get every issue named", text: "Parsing failures across formatting, keywords, structure, and readability are detected and tagged High, Medium, or Low priority with a specific fix path." },
        { name: "Apply the fixes and rescore", text: "Fix inside LaunchCV or your own tool, then re-upload to confirm your score improved." },
      ],
    }),
    speakableLd(["h1", ".lc-key-facts-lead"]),
    faqPageLd(faqs),
  ],
};

const keyFacts = [
  "Score range: 0–100 across formatting, keywords, structure, and readability.",
  "Built for how ATS platforms like Workday, Greenhouse, Lever, and iCIMS parse resumes.",
  "A prioritized, plain-English fix list — no guessing what to change first.",
  "Free to check — no account required.",
];

const issues = [
  { p: "High", t: "Embedded text box in Experience", d: "ATS parsers can&apos;t extract content from text boxes. Convert to plain paragraphs." },
  { p: "High", t: "Multi-column layout", d: "Two-column resumes break parsing order. Switch to single-column for ATS rounds." },
  { p: "Medium", t: "Non-standard fonts", d: "Some parsers fall back when fonts aren&apos;t embedded. Use Inter, Source Sans, or Arial." },
  { p: "Medium", t: "Date format inconsistency", d: "You mix &lsquo;Mar 2022&rsquo; and &lsquo;03/22&rsquo;. Standardize on MMM YYYY." },
  { p: "Low", t: "Header graphic blocks contact parsing", d: "Header art can hide contact info from ATS parsing. Move email and phone to the body." },
];

const benefits = [
  { t: "Formatting parser", d: "Catches tables, text boxes, columns, graphics, and header/footer issues that break ATS." },
  { t: "Keyword density check", d: "Measures keyword richness against industry benchmarks for your target role." },
  { t: "File compatibility test", d: "Validates file type, size, encoding, and font embedding for common ATS parsers." },
  { t: "Section structure audit", d: "Confirms Work Experience, Education, Skills, and Contact Info are all parseable." },
  { t: "Date format consistency", d: "ATS systems need uniform date formats. We flag every inconsistency." },
  { t: "Contact info parsing test", d: "Ensures name, email, phone, and LinkedIn land in standard parseable positions." },
];

// Why it works — honest, benefit-led copy. No fabricated user quotes or company names.
const whyItWorks = [
  {
    t: "See exactly what's broken, not just a number",
    d: "Every issue is named and ranked — tables, fonts, header graphics, date formats — so you know precisely what to fix first.",
  },
  {
    t: "Free, no account, no waiting",
    d: "Upload once and get your score with a full parser breakdown. The rest of the toolkit is there when you're ready.",
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
                Upload your resume. In seconds you get a 0–100 ATS score, a breakdown by parser dimension, and a <span className="font-semibold text-[#0F172A]">prioritized list of every fix</span>.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="LaunchCV's ATS Score Checker returns a 0–100 ATS score in seconds, built for how ATS platforms like Workday, Greenhouse, and Lever parse resumes. It names every parsing issue by priority. Checking your score is free and needs no account."
                facts={keyFacts}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="free_ats_check" location="feature_ats_score"
                  href="/free-ats-check"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(234,88,12,0.4)] transition hover:bg-[#C2410C]"
                >
                  Check my score free
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="#issues"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See the issues we catch
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "0–100", l: "ATS score scale" },
                  { v: "Free", l: "No signup" },
                  { v: "PDF/DOCX", l: "Files accepted" },
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

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#EA580C]">See it in action</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Your ATS score, itemized</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/ats-score.svg"
            alt="The LaunchCV ATS score checker showing a 91 out of 100 ATS score with a formatting, keyword-match, structure, and readability breakdown and the top fix to apply."
            caption="Every parser-breaking issue named and ranked — the highest-impact fix shown first."
          />
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
              { i: Upload, t: "Upload your file", d: "PDF, DOCX, or pasted plain text. We parse it in seconds, the same way common ATS platforms would." },
              { i: AlertTriangle, t: "Get every issue named", d: "12 categories of parsing failures detected, each tagged High, Medium, or Low priority with a specific fix path." },
              { i: CheckCircle2, t: "Apply the fixes and rescore", d: "Fix inside LaunchCV or in your own tool. Re-upload to confirm — most users gain 20–40 points on round one." },
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

      {/* DEEP DIVE — crawlable topical depth */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#EA580C]">The complete guide</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How an ATS score checker actually works
            </h2>
          </RevealOnView>

          <div className="mt-8 space-y-6 text-[16px] leading-[1.8] text-[#334155]">
            <p>
              An <strong>ATS score checker</strong> reads your resume the same way an
              applicant tracking system does — as a machine, not a person. Before a recruiter
              ever opens your application, software from Workday, Greenhouse, Lever, iCIMS, and
              a dozen others extracts your text, splits it into sections, and matches it against
              the job description. If the parser stumbles on a two-column layout or a name buried
              in a header graphic, your experience never registers — which is why so many strong
              candidates get no reply.
            </p>
            <p>
              To <strong>check the ATS score of your resume</strong>, upload a PDF or DOCX and
              LaunchCV runs it through a parser built around how common ATS platforms read
              resumes. You get a 0–100 score in seconds, broken into four dimensions: formatting
              (can the text be extracted cleanly), keywords (does it contain the terms the role asks for),
              structure (are Work Experience, Education, Skills, and Contact Info all detected),
              and readability (is the language clear and quantified). Each dimension is scored
              independently so you can see exactly where the points are leaking.
            </p>

            <h3 className="pt-2 text-[20px] font-semibold tracking-tight text-[#0F172A]">
              What counts as a good ATS score?
            </h3>
            <p>
              A <strong>good ATS score</strong> is 80 or higher against the specific job you are
              applying to — not a generic template. Anything below 65 is at real risk of being
              auto-rejected. Because the score is relative to one job description, the same resume
              can score 92 for one role and 58 for another; that is expected, and it is why
              tailoring matters. Pair the score with{" "}
              <Link href="/features/jd-alignment" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                JD alignment to match your resume to the job description
              </Link>{" "}
              before you submit.
            </p>

            <h3 className="pt-2 text-[20px] font-semibold tracking-tight text-[#0F172A]">
              The formatting mistakes that make a resume fail ATS
            </h3>
            <p>
              Most <strong>ATS parsing failures</strong> come from a short list of formatting
              choices: multi-column layouts that scramble reading order, tables and text boxes the
              parser cannot read, contact details trapped in a header or footer, decorative fonts
              that are not embedded in the file, and mixed date formats. LaunchCV flags every one
              of these on your resume by name, tags it High, Medium, or Low priority, and gives you
              a plain-English fix — then lets you re-score to confirm the gain. If you want the
              background first, read{" "}
              <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                what an ATS score is and how it is calculated
              </Link>
              , or the step-by-step{" "}
              <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                guide to checking your resume&apos;s ATS score
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
              <p className="lc-overline text-[#EA580C]">Why check first</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Guessing vs. an ATS resume checker
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Most resumes are filtered by an applicant tracking system before a human ever opens them. A quick ATS resume test tells you exactly why — and how to fix it.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What matters</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#EA580C]">ATS Score Checker</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Applying blind</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Score", a: "A 0–100 ATS score in seconds", b: "No idea why you are filtered" },
                  { k: "Coverage", a: "Built for how common ATS platforms parse", b: "One black-box upload" },
                  { k: "Issue list", a: "Every problem ranked High, Medium, Low", b: "Silent rejection, no reason given" },
                  { k: "Fix path", a: "A specific fix for each flagged issue", b: "Trial and error across dozens of applications" },
                  { k: "Typical result", a: "A prioritized, plain-English fix list", b: "Same resume, same silence" },
                  { k: "Confidence", a: "Re-upload to confirm you pass ATS", b: "Never know if it worked" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#EA580C]" />
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
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#EA580C]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Sam found out his resume never reached a human
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Sam had sent 40 applications for operations roles and gotten two rejections and 38 silences. The resume looked great to him — a polished two-column design with a header graphic and a custom font. That was the problem.
              </p>
              <p>
                He uploaded it to the ATS score checker and got a score of <span className="font-medium text-[#0F172A]">54 out of 100</span> in seconds. The report named the culprits: a text box the parser could not read, a multi-column layout that scrambled the reading order, and contact details trapped in the header graphic.
              </p>
              <p>
                He switched to a single-column ATS-tested template, moved his email and phone into the body, and standardized his dates. On the re-check his score jumped to 91. The same experience, finally readable, started getting replies.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/free-ats-check" className="inline-flex items-center gap-1.5 rounded-lg bg-[#EA580C] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#C2410C]">
                Check my score free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/resume-builder" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-white">
                Start from an ATS-safe template <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#EA580C]">FAQ</p>
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
            Learn more in{" "}
            <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#EA580C] hover:underline">What is an ATS score?</Link> and{" "}
            <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#EA580C] hover:underline">How to check your ATS score</Link>.
          </p>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
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
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume to a target role.", icon: Target },
              { href: "/features/resume-builder", t: "Resume Builder", d: "4 ATS-safe templates.", icon: FileText },
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
          <CtaLink cta="free_ats_check" location="feature_ats_score"
            href="/free-ats-check"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#C2410C]"
          >
            Check my ATS score free
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
              { href: "/blog/what-is-an-ats-score", t: "What is an ATS score?", d: "Meaning, full form, and what a good score looks like." },
              { href: "/blog/how-to-check-ats-score-of-resume", t: "How to check your ATS score", d: "A 4-step guide using a free resume ATS score checker." },
              { href: "/blog/resume-keywords-for-software-engineers", t: "Resume keywords for engineers", d: "The 2026 keyword list and how to use it." },
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
        accent="orange"
        useCases={[
          {
            href: "/use-cases/product-managers",
            title: "Resumes for product managers",
            desc: "Get a clean ATS score on a PM resume packed with roadmap and metric keywords.",
          },
          {
            href: "/use-cases/designers",
            title: "Resumes for designers",
            desc: "Pass ATS parsing while still showcasing portfolio and design-system impact.",
          },
        ]}
      />

      <StickyCta
        primaryHref="/free-ats-check"
        primaryLabel="Check my score free"
        primaryClassName="bg-[#EA580C] hover:bg-[#C2410C]"
        location="feature_ats_score"
      />

      <LandingFooter />
    </div>
  );
}
