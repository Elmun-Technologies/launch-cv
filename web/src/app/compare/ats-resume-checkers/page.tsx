import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Minus } from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Best ATS Resume Checkers in 2026 — How to Choose",
  description:
    "A buyer's guide to ATS resume checkers: six criteria that separate a real ATS check from a keyword counter, and what to expect from a free one.",
  pathname: "/compare/ats-resume-checkers",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "best ATS resume checker",
    "ATS resume checker comparison",
    "ATS resume scanner",
    "free ATS checker",
    "how to choose an ATS checker",
  ],
});

const faqs: FaqItem[] = [
  {
    q: "What is the best ATS resume checker?",
    a: "The one that checks how your resume is parsed — layout, sections, dates, contact details — and tells you exactly what to change, not just a keyword percentage. For tailoring, pair it with a tool that compares your resume against the specific job description.",
  },
  {
    q: "Are free ATS resume checkers accurate?",
    a: "They're a good guide when they look at parsing and structure, not only keyword overlap. No checker can reproduce each employer's private ATS settings, so treat any score as a way to find problems rather than a guarantee.",
  },
  {
    q: "What should I look for in an ATS checker?",
    a: "Parsing and formatting checks, a specific and prioritised fix list, keyword analysis for your role, clear data handling, and the option to try it before paying.",
  },
  {
    q: "How does LaunchCV compare?",
    a: "LaunchCV's ATS check is free with no account and returns a 0–100 score with prioritised fixes. Matching against a specific job description, bullet rewrites, cover letters and interview prep are in the paid plans.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Best ATS Resume Checkers in 2026 — How to Choose",
      url: absoluteUrl("/compare/ats-resume-checkers"),
      description: "Six criteria for choosing an ATS resume checker.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Best ATS resume checkers", item: absoluteUrl("/compare/ats-resume-checkers") },
      ],
    },
    faqPageLd(faqs),
  ],
};

const criteria = [
  {
    t: "It checks parsing, not just keywords",
    d: "Most rejections from software come from layout: tables, columns, text boxes and contact details in headers. A checker that only counts keyword overlap misses all of them.",
  },
  {
    t: "It can compare against a specific job",
    d: "A resume is a fit for one role, not good or bad in general. Look for a way to compare against the posting you're applying to.",
  },
  {
    t: "Fixes are specific and ranked",
    d: "“Improve formatting” doesn't help. You want “move your email out of the header”, with the highest-impact fixes first.",
  },
  {
    t: "Keyword advice you can back up",
    d: "Good tools show what's missing and help you add what's true — not stuff terms you can't talk about in an interview.",
  },
  {
    t: "Clear data handling",
    d: "Your resume is personal data. Check what's stored, for how long, and whether you can try it without an account.",
  },
  {
    t: "You can try it first",
    d: "A free check lets you judge whether the advice is useful before you pay for anything.",
  },
];

const rows: { l: string; a: boolean | string; b: boolean | string }[] = [
  { l: "Checks layout and parsing problems", a: true, b: false },
  { l: "Score with prioritised fixes", a: true, b: "Score only" },
  { l: "Free, no account", a: true, b: "Varies" },
  { l: "Compare against a specific job post", a: "Paid plans", b: "Keyword % only" },
  { l: "Rewrites for weak bullets", a: "Paid plans", b: false },
  { l: "Cover letter and interview prep", a: "Paid plans", b: false },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto h-4 w-4" aria-label="Yes" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-[#C9C9C4]" aria-label="No" />;
  return <span className="text-[14px] text-[#3F3F3F]">{v}</span>;
}

const h2 = "text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]";

export default function CompareAtsCheckersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 pt-[120px] sm:px-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1">
            <h1 className="text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[54px]">
              How to choose an ATS resume checker. <span className="text-[#8A8A86]">Six things that matter.</span>
            </h1>
            <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[#3F3F3F]">
              Every resume tool says it beats the ATS. Many only count keywords. Here&apos;s what separates a useful
              check from a number.
            </p>
          </div>
          <div className="relative h-[280px] overflow-hidden rounded-[20px] sm:h-[380px] lg:w-[44%] lg:shrink-0">
            <Image
              src="/images/photos/recruiter-desk.webp"
              alt="Recruiter reviewing applications at a desk"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={h2}>Six criteria</h2>
          <ol className="mt-7 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {criteria.map((c, i) => (
              <li key={c.t} className="border-t border-[#EEEEEB] py-5">
                <p className="text-[14px] text-[#6E6E6A] [font-feature-settings:'tnum']">{i + 1}</p>
                <p className="mt-1 text-[17px] font-semibold">{c.t}</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{c.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={h2}>
            A full check vs. <span className="text-[#8A8A86]">a keyword counter.</span>
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-[#EEEEEB] text-[#6B6B6B]">
                  <th className="w-[46%] py-4 text-left font-medium">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th className="py-4 font-medium text-[#111111]">LaunchCV</th>
                  <th className="py-4 font-medium">Keyword-match scanners</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.l} className="border-b border-[#EEEEEB]">
                    <td className="py-4">{r.l}</td>
                    <td className="py-4 text-center">
                      <Cell v={r.a} />
                    </td>
                    <td className="py-4 text-center">
                      <Cell v={r.b} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-[#6B6B6B]">
            &ldquo;Keyword-match scanners&rdquo; describes the common category of tools that return a match percentage.
            Individual products vary; check each one&apos;s current features.
          </p>
        </section>

        <section className="mx-auto max-w-[860px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={`${h2} text-center`}>FAQ</h2>
          <div className="mt-6 border-b border-[#E5E5E2]">
            {faqs.map((x, i) => (
              <details key={x.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                  {x.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{x.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
                Judge it yourself. <span className="text-[#8A8A86]">The check is free.</span>
              </h2>
              <p className="mt-2 text-[16px] text-[#3F3F3F]">
                No account. Score and fixes in about 10 seconds.{" "}
                <Link href="/blog/what-is-an-ats-score" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                  What the score means
                </Link>
              </p>
            </div>
            <CtaLink
              cta="free_ats_check"
              location="compare_ats"
              href="/free-ats-check"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#2563EB] px-6 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
            >
              Check my resume — free
            </CtaLink>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
