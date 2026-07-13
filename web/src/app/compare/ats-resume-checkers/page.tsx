import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { FaqSection } from "@/components/faq-section";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";
import {
  ArrowRight,
  Check,
  X,
  Search,
  Target,
  ShieldCheck,
  Gauge,
  Wallet,
  FileText,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Best ATS Resume Checkers in 2026 — How to Choose",
  description:
    "A buyer's guide to ATS resume checkers: the 6 criteria that separate a real ATS score checker from a keyword counter, and how to choose the right one.",
  pathname: "/compare/ats-resume-checkers",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "best ATS resume checker",
    "ATS resume checker comparison",
    "ATS resume scanner",
    "LaunchCV alternative",
    "free ATS checker",
    "resume checker tool",
    "how to choose an ATS checker",
  ],
});

const faqs: FaqItem[] = [
  {
    q: "What is the best ATS resume checker?",
    a: "The best ATS resume checker is the one that parses your resume like real applicant tracking systems, scores it against a specific job description rather than a generic template, and returns fixes you can act on — not just a keyword count. LaunchCV is built for how platforms like Workday, Greenhouse, and Lever parse resumes, scores relative to the job you paste in, and lists every fix by priority.",
  },
  {
    q: "Are free ATS resume checkers accurate?",
    a: "A free checker is accurate if it actually simulates parsing (extracting text, detecting sections, checking formatting) rather than just counting keyword overlap. LaunchCV's ATS score and full parser breakdown are free with no account, so you can judge the accuracy before paying for anything.",
  },
  {
    q: "What should I look for in an ATS checker?",
    a: "Look for six things: parsing against real ATS engines, scoring against a specific job description, a prioritized and specific fix list, keyword gap analysis, safe handling of your data, and speed. A tool that only returns a number without telling you what to change will not move your ranking.",
  },
  {
    q: "Is LaunchCV a good alternative to other resume checkers?",
    a: "LaunchCV combines an ATS score checker, JD alignment, a resume builder, cover letters, and interview prep under one plan, with a free ATS score and no per-scan paywall. If you want scoring plus the tools to actually fix and tailor your resume in the same place, it is a strong alternative to single-purpose scanners.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Best ATS Resume Checkers in 2026 — How to Choose | LaunchCV",
      url: absoluteUrl("/compare/ats-resume-checkers"),
      description:
        "A buyer's guide to choosing an ATS resume checker: the six criteria that matter and how LaunchCV measures up.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Compare", item: absoluteUrl("/compare/ats-resume-checkers") },
        { "@type": "ListItem", position: 3, name: "ATS Resume Checkers", item: absoluteUrl("/compare/ats-resume-checkers") },
      ],
    },
    faqPageLd(faqs),
  ],
};

const criteria = [
  {
    icon: Search,
    t: "Real ATS parsing, not keyword counting",
    d: "The tool should extract your text and detect sections the way Workday, Greenhouse, and Lever do. A checker that only counts keyword overlap misses the formatting failures — tables, columns, header graphics — that actually get resumes rejected.",
  },
  {
    icon: Target,
    t: "Scored against a specific job description",
    d: "A resume is not “good” or “bad” in the abstract; it is a fit for one role. The checker should score against the job description you paste in, so the same resume can be tuned per application instead of chasing a generic number.",
  },
  {
    icon: FileText,
    t: "A prioritized, specific fix list",
    d: "A score with no instructions is a dead end. Look for High/Medium/Low priority fixes written in plain English — “convert this text box to a paragraph,” not “improve formatting.”",
  },
  {
    icon: Gauge,
    t: "Keyword gap analysis and rewrites",
    d: "The strongest tools show which required keywords you are missing and help you add the ones you can honestly claim, rather than leaving you to guess or stuff terms you cannot back up.",
  },
  {
    icon: ShieldCheck,
    t: "Safe, private handling of your resume",
    d: "Your resume is sensitive data. Prefer tools that encrypt in transit and at rest, are transparent about retention, and do not sell your data — and that let you try a scan without an account.",
  },
  {
    icon: Wallet,
    t: "Fair pricing without a per-scan paywall",
    d: "Some scanners charge per scan or hide the score behind a subscription. A free score with no account lets you judge accuracy first, and one predictable plan beats paying every time you tweak a bullet.",
  },
];

const rows = [
  { label: "Free ATS score (no account)", launchcv: true, keywordCounter: false, note: "Judge accuracy before you pay" },
  { label: "Built for real ATS platforms", launchcv: true, keywordCounter: false, note: "Modeled on Workday, Greenhouse, Lever & more" },
  { label: "Scores against the job description", launchcv: true, keywordCounter: "Partial", note: "Relative, per-role scoring" },
  { label: "Prioritized fix list", launchcv: true, keywordCounter: false, note: "High / Medium / Low, specific" },
  { label: "Keyword gap analysis + rewrites", launchcv: true, keywordCounter: "Count only", note: "Adds terms you can support" },
  { label: "Builder, cover letter, interview prep", launchcv: true, keywordCounter: false, note: "One plan, no tab-hopping" },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-emerald-600" aria-label="Yes" />;
  if (value === false) return <X className="mx-auto h-5 w-5 text-[#CBD5E1]" aria-label="No" />;
  return <span className="text-[13px] font-medium text-[#334155]">{value}</span>;
}

export default function AtsResumeCheckersComparePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 12% 0%, rgba(234,88,12,0.06), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-[820px] px-6 pb-16 pt-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
            <Search className="h-3.5 w-3.5 text-[#EA580C]" />
            Buyer&apos;s guide · 2026
          </span>
          <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
            How to choose the best ATS resume checker
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.7] text-[#475569]">
            Every resume tool claims to &ldquo;beat the ATS.&rdquo; Most just count keywords. This
            guide covers the six criteria that separate a real{" "}
            <Link href="/features/ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              ATS score checker
            </Link>{" "}
            from a glorified word counter — and how LaunchCV measures up.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/free-ats-check"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(234,88,12,0.4)] transition hover:bg-[#C2410C]"
            >
              Check my resume free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#criteria"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
            >
              See the 6 criteria
            </Link>
          </div>
        </div>
      </section>

      {/* CRITERIA */}
      <section id="criteria" className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#EA580C]">What actually matters</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six criteria for choosing an ATS resume checker
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c) => (
              <RevealOnView key={c.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#EA580C]">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{c.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[#475569]">{c.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#EA580C]">Side by side</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A full toolkit vs. a keyword counter
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Many popular scanners stop at a keyword-match percentage. Here is how that compares
                to a checker built around real parsing and fixes.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-4 pr-4 text-[13px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Capability
                  </th>
                  <th className="px-4 py-4 text-center text-[14px] font-bold text-[#EA580C]">LaunchCV</th>
                  <th className="px-4 py-4 text-center text-[13px] font-semibold text-[#64748B]">
                    Keyword-count scanner
                  </th>
                  <th className="hidden py-4 pl-4 text-[13px] font-semibold uppercase tracking-wider text-[#94A3B8] sm:table-cell">
                    Why it matters
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-[#F1F5F9]">
                    <td className="py-4 pr-4 text-[14px] font-medium text-[#0F172A]">{r.label}</td>
                    <td className="px-4 py-4 text-center"><Cell value={r.launchcv} /></td>
                    <td className="px-4 py-4 text-center"><Cell value={r.keywordCounter} /></td>
                    <td className="hidden py-4 pl-4 text-[13px] text-[#64748B] sm:table-cell">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[12px] text-[#94A3B8]">
            Comparison reflects LaunchCV&apos;s capabilities versus the common &ldquo;keyword match
            percentage&rdquo; category of resume scanners. Feature sets of individual competing
            products change often — always confirm current details on their own sites.
          </p>
        </div>
      </section>

      {/* VERDICT / DEEP DIVE */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[760px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#EA580C]">The bottom line</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              Pick the tool that tells you what to fix
            </h2>
          </RevealOnView>
          <div className="mt-8 space-y-6 text-[16px] leading-[1.8] text-[#334155]">
            <p>
              The <strong>best ATS resume checker</strong> for your job search is not the one with
              the flashiest score — it is the one that changes what you do next. A keyword-match
              percentage feels precise, but if it does not tell you that your two-column layout is
              scrambling the parse order, or which of the job&apos;s required skills you are actually
              missing, it cannot lift your ranking.
            </p>
            <p>
              That is why LaunchCV pairs a free{" "}
              <Link href="/features/ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                ATS score checker
              </Link>{" "}
              with{" "}
              <Link href="/features/jd-alignment" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                JD alignment
              </Link>{" "}
              and a resume builder in one place: score your resume, see every fix ranked by
              priority, tailor it to the exact job, and re-score — without paying per scan or
              copy-pasting between tools. If you are still learning the fundamentals, start with{" "}
              <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                what an ATS score is
              </Link>{" "}
              and{" "}
              <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                how to check your resume&apos;s ATS score
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection items={faqs} accent="#EA580C" heading="Choosing an ATS resume checker — FAQ" />

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">See your ATS score in eight seconds</h2>
          <p className="mx-auto mt-4 max-w-[540px] text-[16px] leading-[1.65] text-[#475569]">
            Free, no account. Upload your resume and get a 0–100 score with every fix named and
            ranked.
          </p>
          <Link
            href="/free-ats-check"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#C2410C]"
          >
            Check my resume free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
