import Link from "next/link";
import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { GuideTable } from "@/components/site/seo/guide-table";
import { CheckList } from "@/components/site/seo/check-list";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  ATS_SCORE_GUIDE_FAQS,
  ATS_SCORE_GUIDE_PUBLISHED,
  ATS_SCORE_GUIDE_READING,
  ATS_SCORE_GUIDE_SECTIONS,
  ATS_SCORE_GUIDE_UPDATED,
  QUICK_FACTS,
  RAISE_SCORE_CHECKLIST,
  SCORE_TABLE,
  VENDOR_LINKS,
} from "@/lib/seo/what-is-a-good-ats-score";

const PATH = "/what-is-a-good-ats-score";
const CRUMB = "ATS score";
const TITLE = fitTitle("What Is an ATS Score? Meaning & What a Good Score Is (2026)", "What Is an ATS Score? (2026 Guide)");
const HEADLINE = "What is an ATS score, and what's a good one?";
const DESCRIPTION =
  "ATS score meaning, what a good resume ATS score is, why there's no universal number across Workday, Greenhouse and iCIMS, and how to raise yours.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: ATS_SCORE_GUIDE_PUBLISHED, modifiedTime: ATS_SCORE_GUIDE_UPDATED, authors: [SITE_AUTHOR.name], section: "Job Search" },
  keywords: [
    "ats score",
    "what is an ats score",
    "ats full form",
    "resume ats score",
    "good ats score",
    "what is a good ats score",
    "ats score meaning",
    "ats resume score",
    "ats score checker",
    "applicant tracking system score",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/free-ats-check", t: "Free ATS check", d: "Get your real score and a fix for every issue — no account needed." },
  { href: "/ats", t: "ATS guides by vendor", d: "What Workday, Greenhouse, iCIMS, Ashby and others each parse." },
  { href: "/resume-format", t: "Resume format", d: "Layout, section order and dates that parse cleanly." },
  { href: "/resume-keywords", t: "Resume keywords", d: "The skills and terms recruiters search for, by role." },
];

function VendorsFigure() {
  return (
    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
      {VENDOR_LINKS.map((v) => (
        <li key={v.slug}>
          <Link
            href={`/ats/${v.slug}`}
            className="lc-card group flex h-full flex-col rounded-[20px] p-4 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(36,24,120,0.45)] sm:p-5"
          >
            <span className="text-[16px] font-extrabold group-hover:text-[#5440e8]">{v.name} →</span>
            <span className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{v.tagline}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function WhatIsAGoodAtsScorePage() {
  const extraWords = [...QUICK_FACTS, ...SCORE_TABLE.flat(), ...RAISE_SCORE_CHECKLIST, ...VENDOR_LINKS.flatMap((v) => [v.name, v.tagline])];
  const words = guideWordCount(ATS_SCORE_GUIDE_SECTIONS, ATS_SCORE_GUIDE_FAQS, extraWords);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: ATS_SCORE_GUIDE_PUBLISHED,
    updated: ATS_SCORE_GUIDE_UPDATED,
    words,
    section: "Job Search",
    faqs: ATS_SCORE_GUIDE_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="What is an ATS score,"
      muted="and what's a good one?"
      lead="An ATS score estimates how well applicant tracking software reads your resume. There's no single, universal one — Workday, Greenhouse, iCIMS, Taleo, Lever and SuccessFactors each parse resumes with their own software. Here's how LaunchCV's own 0–100 score works, the five things it checks, and what to do with the result."
      updated={ATS_SCORE_GUIDE_UPDATED}
      words={words}
      sections={ATS_SCORE_GUIDE_SECTIONS}
      figures={{
        vendors: <VendorsFigure />,
        categories: (
          <GuideTable
            label="What LaunchCV's ATS score checks"
            caption="The five weighted categories in LaunchCV's resume score, and what each one checks"
            columns={["Category (weight)", "What it checks"]}
            rows={SCORE_TABLE}
          />
        ),
        checklist: (
          <div className="mt-6">
            <CheckList items={RAISE_SCORE_CHECKLIST} label="How to raise your ATS score" />
          </div>
        ),
      }}
      keyFacts={{ afterSection: "good-score", title: "Quick facts", lead: "80+ is ready to send, 65–79 is readable, below 65 is at risk.", facts: QUICK_FACTS }}
      faqs={ATS_SCORE_GUIDE_FAQS}
      aside={{
        label: "Check your actual ATS score",
        title: "Skip the guessing. Check it.",
        sub: "Free, no account needed — your real score and a fix for every issue.",
        cta: { cta: "free_ats_check", location: "what_is_a_good_ats_score", href: "/free-ats-check", label: "Check my resume" },
        card: { title: "Applying through a specific system?", sub: "See what Workday, Greenhouse, iCIMS and others each parse.", href: "/ats", link: "ATS vendor guides" },
      }}
      related={RELATED}
      reading={ATS_SCORE_GUIDE_READING}
      finalCta={{
        title: "Stop guessing your score. Check it.",
        sub: "The free ATS check gives you the real number and a fix for every issue it finds.",
        cta: "free_ats_check",
        location: "what_is_a_good_ats_score_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
