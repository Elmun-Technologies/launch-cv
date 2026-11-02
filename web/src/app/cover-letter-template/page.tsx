import Link from "next/link";
import { GuidePage, guideLd, guideLinkCls, guideWordCount } from "@/components/site/seo/guide-page";
import { NumberedCards } from "@/components/site/seo/numbered-cards";
import { LetterSheet } from "@/components/site/seo/letter-sheet";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { getResumeExample } from "@/lib/resume-examples";
import { getCoverLetterExample } from "@/lib/cover-letter-examples";
import {
  COVER_LETTER_TEMPLATE,
  COVER_TEMPLATE_EXAMPLE,
  COVER_TEMPLATE_FAQS,
  COVER_TEMPLATE_PUBLISHED,
  COVER_TEMPLATE_QUICK,
  COVER_TEMPLATE_READING,
  COVER_TEMPLATE_SECTIONS,
  COVER_TEMPLATE_UPDATED,
  TEMPLATE_PARAGRAPH_ROLES,
} from "@/lib/seo/cover-letter-template";

const PATH = "/cover-letter-template";
const CRUMB = "Cover letter template";
const TITLE = fitTitle("Cover Letter Template (Free, Copy & Paste) for 2026", "Free Cover Letter Template (2026)");
const HEADLINE = "Cover letter template: copy it, then make it yours";
const DESCRIPTION =
  "A free, copy-and-paste US cover letter template with each paragraph explained, a filled-in example, formatting rules and the mistakes to avoid.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: COVER_TEMPLATE_PUBLISHED, modifiedTime: COVER_TEMPLATE_UPDATED, authors: [SITE_AUTHOR.name], section: "Cover Letters" },
  keywords: [
    "cover letter template",
    "free cover letter template",
    "cover letter format",
    "how to write a cover letter",
    "cover letter example",
    "simple cover letter template",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/cover-letter-examples", t: "Cover letter examples", d: "Annotated letters by role, each paired with a resume." },
  { href: "/features/cover-letter", t: "AI cover letter generator", d: "A draft written from your resume and the job post." },
  { href: "/how-to-write-a-resume", t: "How to write a resume", d: "Eight steps from a blank page to a finished resume." },
  { href: "/resume-examples", t: "Resume examples", d: "Written examples by role, ready to edit with your own experience." },
];

function TemplateFigure() {
  return (
    <LetterSheet
      heading="Cover letter template"
      headingId="template-letter"
      letter={COVER_LETTER_TEMPLATE}
      copyLabel="Copy template"
      placeholders
      footnote="Replace every [bracketed] placeholder. The numbers mark the four paragraphs explained below."
    />
  );
}

function ExampleFigure() {
  const c = getCoverLetterExample(COVER_TEMPLATE_EXAMPLE);
  const e = getResumeExample(COVER_TEMPLATE_EXAMPLE);
  if (!c || !e) return null;
  const letter = {
    name: e.resume.name,
    contact: e.resume.contact,
    recipient: [c.target.hiringManager, c.target.company],
    greeting: `Dear ${c.target.hiringManager},`,
    paragraphs: c.paragraphs,
    signoff: "Sincerely,",
  };
  return (
    <>
      <LetterSheet
        heading={`${e.role} cover letter`}
        headingId="example-letter"
        letter={letter}
        footnote={
          <>
            Sample letter: names, companies and figures are illustrative. See the{" "}
            <Link href={`/cover-letter-examples/${c.slug}`} className={guideLinkCls}>
              full {e.role.toLowerCase()} cover letter example
            </Link>{" "}
            and the{" "}
            <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
              matching resume
            </Link>
            .
          </>
        }
      />
      <div className="mt-6 rounded-[24px] bg-[#111118] px-[18px] py-[22px] text-white sm:p-8">
        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[#c9c0ff]">What each paragraph does</h3>
        <ol className="mt-2.5 sm:mt-4">
          {c.annotations.map((a, i) => (
            <li key={i} className="flex gap-3.5 border-t border-[#2f2d48] py-[16px]">
              <span aria-hidden="true" className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[13px] font-extrabold text-white">
                {i + 1}
              </span>
              <p className="text-[15px] leading-[23px] text-[#e9e7f3]">
                <span className="sr-only">Paragraph {i + 1}: </span>
                <span className="font-bold text-white">{TEMPLATE_PARAGRAPH_ROLES[i]?.t}.</span> {a}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default function CoverLetterTemplatePage() {
  const words = guideWordCount(COVER_TEMPLATE_SECTIONS, COVER_TEMPLATE_FAQS, [...COVER_TEMPLATE_QUICK, ...COVER_LETTER_TEMPLATE.paragraphs]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: COVER_TEMPLATE_PUBLISHED,
    updated: COVER_TEMPLATE_UPDATED,
    words,
    section: "Cover Letters",
    faqs: COVER_TEMPLATE_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Cover letter template:"
      muted="copy it, then make it yours."
      lead="A free US cover letter template you can copy in one click, with what to write in each paragraph, a filled-in example and the formatting rules."
      updated={COVER_TEMPLATE_UPDATED}
      words={words}
      intro={{ heading: "The four paragraphs at a glance", node: <NumberedCards items={TEMPLATE_PARAGRAPH_ROLES} reveal={false} /> }}
      sections={COVER_TEMPLATE_SECTIONS}
      figures={{ template: <TemplateFigure />, example: <ExampleFigure /> }}
      keyFacts={{ afterSection: "header-greeting", title: "Quick rules", lead: "Four short paragraphs, one strong example, under one page.", facts: COVER_TEMPLATE_QUICK }}
      faqs={COVER_TEMPLATE_FAQS}
      aside={{
        label: "Write your cover letter",
        title: "Draft it from your resume",
        sub: "LaunchCV writes a first draft from your resume and the job post. You edit it.",
        cta: { cta: "cover_letter_feature", location: "cover_letter_template", href: "/features/cover-letter", label: "See how it works" },
        card: { title: "More letters by role", sub: "Annotated examples, each paired with a resume.", href: "/cover-letter-examples", link: "Cover letter examples" },
      }}
      related={RELATED}
      reading={COVER_TEMPLATE_READING}
      finalCta={{
        title: "Letter ready? Check the resume it goes with.",
        sub: "The free ATS check flags columns, tables, missing contact details and inconsistent dates.",
        cta: "free_ats_check",
        location: "cover_letter_template_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
