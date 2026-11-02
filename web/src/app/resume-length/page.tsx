import Link from "next/link";
import { GuidePage, guideLd, guideLinkCls, guideWordCount } from "@/components/site/seo/guide-page";
import { GuideTable } from "@/components/site/seo/guide-table";
import { CheckList } from "@/components/site/seo/check-list";
import { ExampleResumeFigure } from "@/components/site/seo/example-resume-figure";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { getResumeExample } from "@/lib/resume-examples";
import {
  LENGTH_CARDS,
  LENGTH_CUTS,
  LENGTH_QUICK,
  LENGTH_TABLE,
  RESUME_LENGTH_EXAMPLE,
  RESUME_LENGTH_FAQS,
  RESUME_LENGTH_PUBLISHED,
  RESUME_LENGTH_READING,
  RESUME_LENGTH_SECTIONS,
  RESUME_LENGTH_SOURCES,
  RESUME_LENGTH_UPDATED,
} from "@/lib/seo/resume-length";

const PATH = "/resume-length";
const CRUMB = "Resume length";
const TITLE = fitTitle("How Long Should a Resume Be? One vs. Two Pages (2026)", "Resume Length: One or Two Pages? (2026)");
const HEADLINE = "How long should a resume be? One page, two, and the exceptions";
const DESCRIPTION =
  "How long a resume should be in 2026: one page or two by experience level, what to cut, the USAJOBS two-page limit for federal jobs, and how academic CVs differ.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESUME_LENGTH_PUBLISHED, modifiedTime: RESUME_LENGTH_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "resume length",
    "how long should a resume be",
    "one page resume",
    "two page resume",
    "federal resume length",
    "USAJOBS two page limit",
    "CV vs resume length",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/tools/resume-word-counter", t: "Resume word counter", d: "Words, estimated pages, bullet length and filler — free." },
  { href: "/how-to-write-a-resume", t: "How to write a resume", d: "Eight steps from a blank page to a finished resume." },
  { href: "/resume-format", t: "Resume format", d: "Layout, section order, fonts and margins that parse cleanly." },
  { href: "/resume-examples", t: "Resume examples", d: "Written examples by role, ready to edit with your own experience." },
];

function LengthCards() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
      {LENGTH_CARDS.map((c) => (
        <li key={c.name} className={`rounded-[24px] p-5 sm:rounded-[28px] sm:p-6 ${c.featured ? "bg-[#5440e8] text-white" : "bg-white"}`}>
          <p className="text-[22px] font-extrabold sm:text-[24px]">{c.name}</p>
          <p className={`mt-1.5 text-[13px] font-extrabold ${c.featured ? "text-white" : "text-[#3a2bb8]"}`}>{c.audience}</p>
          <p className={`mt-2 text-[15px] leading-[23px] ${c.featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{c.note}</p>
        </li>
      ))}
    </ul>
  );
}

function ExampleFigure() {
  const e = getResumeExample(RESUME_LENGTH_EXAMPLE);
  if (!e) return null;
  return (
    <ExampleResumeFigure example={e} template="classic">
      Our{" "}
      <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
        {e.role.toLowerCase()} resume example
      </Link>{" "}
      ({e.level.toLowerCase()}) in the Classic template: {e.resume.jobs.length} jobs, {e.resume.jobs.reduce((n, j) => n + j.bullets.length, 0)} bullets, a
      summary, education and one line of skills.
    </ExampleResumeFigure>
  );
}

export default function ResumeLengthPage() {
  const words = guideWordCount(RESUME_LENGTH_SECTIONS, RESUME_LENGTH_FAQS, [...LENGTH_QUICK, ...LENGTH_CUTS, ...LENGTH_TABLE.flat()]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: RESUME_LENGTH_PUBLISHED,
    updated: RESUME_LENGTH_UPDATED,
    words,
    section: "Resume Tips",
    faqs: RESUME_LENGTH_FAQS,
    sources: RESUME_LENGTH_SOURCES,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="How long should a resume be?"
      muted="One page, two, and the exceptions."
      lead="One page early in your career, two once relevant experience fills them. Here's how to decide at each level, what to cut, and why federal resumes and academic CVs follow different rules."
      updated={RESUME_LENGTH_UPDATED}
      words={words}
      intro={{ heading: "Resume length at a glance", node: <LengthCards /> }}
      sections={RESUME_LENGTH_SECTIONS}
      figures={{
        "length-table": (
          <GuideTable
            label="Resume length by experience level"
            caption="Recommended resume length for each experience level, with notes"
            columns={["Experience level", "Length", "Notes"]}
            rows={LENGTH_TABLE}
          />
        ),
        cuts: (
          <div className="mt-6">
            <CheckList items={LENGTH_CUTS} label="What to cut first" />
          </div>
        ),
        example: <ExampleFigure />,
      }}
      keyFacts={{ afterSection: "short-answer", title: "Quick rules", lead: "One page early on, two when you can fill them, never more for a US resume.", facts: LENGTH_QUICK }}
      sources={RESUME_LENGTH_SOURCES}
      faqs={RESUME_LENGTH_FAQS}
      aside={{
        label: "Check your resume length",
        title: "Too long? Count it.",
        sub: "Paste your resume to see words, estimated pages and long bullets. Nothing is uploaded.",
        cta: { cta: "word_counter", location: "resume_length", href: "/tools/resume-word-counter", label: "Open the word counter" },
        card: { title: "Then check the format", sub: "See what an applicant tracking system reads, free.", href: "/free-ats-check", link: "Free ATS check" },
      }}
      related={RELATED}
      reading={RESUME_LENGTH_READING}
      finalCta={{
        title: "Right length? Check what the software reads.",
        sub: "The free ATS check flags columns, tables, missing contact details and inconsistent dates.",
        cta: "free_ats_check",
        location: "resume_length_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
