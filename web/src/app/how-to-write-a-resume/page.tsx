import Link from "next/link";
import { GuidePage, guideLd, guideLinkCls, guideWordCount } from "@/components/site/seo/guide-page";
import { NumberedCards } from "@/components/site/seo/numbered-cards";
import { BulletRewrites } from "@/components/site/seo/bullet-rewrites";
import { CheckList } from "@/components/site/seo/check-list";
import { HighlightTerms } from "@/components/site/seo/highlight-terms";
import { ExampleResumeFigure } from "@/components/site/seo/example-resume-figure";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { getResumeExample } from "@/lib/resume-examples";
import { keywordsIn } from "@/lib/seo/resume-keywords";
import {
  HOW_TO_FAQS,
  HOW_TO_FULL_EXAMPLE,
  HOW_TO_PROOFREAD,
  HOW_TO_PUBLISHED,
  HOW_TO_QUICK,
  HOW_TO_READING,
  HOW_TO_SECTIONS,
  HOW_TO_STEPS,
  HOW_TO_SUMMARY_EXAMPLE,
  HOW_TO_UPDATED,
  howToRewrites,
} from "@/lib/seo/how-to-write-a-resume";

const PATH = "/how-to-write-a-resume";
const CRUMB = "How to write a resume";
const TITLE = fitTitle("How to Write a Resume: Step-by-Step Guide (2026)", "How to Write a Resume (2026 Guide)");
const HEADLINE = "How to write a resume, step by step";
const DESCRIPTION =
  "How to write a resume in 2026, step by step: contact details, summary, achievement bullets, skills, education, tailoring to the job post, ATS formatting and proofreading.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: HOW_TO_PUBLISHED, modifiedTime: HOW_TO_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "how to write a resume",
    "how to make a resume",
    "resume writing guide",
    "resume bullet points",
    "resume summary",
    "tailor resume to job description",
    "ATS-friendly resume",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/resume-format", t: "Resume format", d: "Chronological, hybrid or functional — and the layout rules behind each." },
  { href: "/resume-examples", t: "Resume examples", d: "Written examples by role, ready to edit with your own experience." },
  { href: "/resume-action-verbs", t: "Resume action verbs", d: "Stronger ways to start a bullet, grouped by skill." },
  { href: "/cover-letter-template", t: "Cover letter template", d: "A copyable US template with each paragraph explained." },
];

function ContactFigure() {
  const e = getResumeExample(HOW_TO_SUMMARY_EXAMPLE);
  if (!e) return null;
  const r = e.resume;
  return (
    <figure className="mt-7 rounded-[24px] bg-[#e4dfff] p-4 sm:p-7">
      <div className="rounded-lg bg-white px-5 py-5 text-[#121226] shadow-[0_24px_48px_-20px_rgba(10,6,60,.35)] sm:px-8 sm:py-6">
        <p className="text-[22px] font-extrabold leading-tight sm:text-[26px]">{r.name}</p>
        <p className="mt-1 text-[15px] font-semibold text-[#4a4862]">{r.headline}</p>
        <p className="mt-1 text-[14px] text-[#66647c] [overflow-wrap:anywhere] sm:text-[15px]">{r.contact}</p>
      </div>
      <figcaption className="mt-3 text-[14px] leading-[22px] text-[#3a2bb8]">
        The contact block from our{" "}
        <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
          {e.role.toLowerCase()} resume example
        </Link>
        : name, target title, then location, email and one link on a single line. Names and details are illustrative.
      </figcaption>
    </figure>
  );
}

function SummariesFigure() {
  const e = getResumeExample(HOW_TO_SUMMARY_EXAMPLE);
  if (!e) return null;
  return (
    <figure className="mt-6">
      <ul className="flex flex-col gap-2.5 sm:gap-3">
        {e.summaries.map((s) => (
          <li key={s.level} className="lc-card grid gap-1.5 rounded-[22px] p-[18px] sm:grid-cols-[120px_1fr] sm:gap-5 sm:rounded-3xl sm:p-6">
            <p className="text-[12px] font-bold uppercase leading-5 tracking-[0.06em] text-[#5440e8] sm:pt-0.5">{s.level}</p>
            <p className="text-[15px] leading-[23px] text-[#24223a] sm:text-[16px] sm:leading-[25px]">{s.text}</p>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 px-1 text-[13px] leading-5 text-[#66647c]">
        Summaries from the{" "}
        <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
          {e.role.toLowerCase()} resume example
        </Link>
        . Figures are illustrative.
      </figcaption>
    </figure>
  );
}

function TailoringFigure() {
  const e = getResumeExample(HOW_TO_SUMMARY_EXAMPLE);
  if (!e) return null;
  const rows = e.resume.jobs
    .flatMap((j) => j.bullets)
    .map((b) => ({ b, used: keywordsIn(e, b) }))
    .filter((x) => x.used.length > 0)
    .slice(0, 4);
  if (rows.length === 0) return null;
  return (
    <figure className="lc-card mt-7 rounded-[24px] p-5 sm:p-7">
      <ul className="flex flex-col gap-3">
        {rows.map(({ b, used }) => (
          <li key={b} className="flex gap-2.5 text-[15px] leading-6 text-[#24223a] sm:text-[16px] sm:leading-[26px]">
            <span aria-hidden="true" className="flex-none text-[#5440e8]">
              •
            </span>
            <span>
              <HighlightTerms text={b} terms={used} />
              <span className="sr-only"> (keywords: {used.join(", ")})</span>
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 border-t border-[#e2e0ea] pt-3 text-[14px] leading-[22px] text-[#4a4862]">
        Bullets from the{" "}
        <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
          {e.role.toLowerCase()} resume example
        </Link>
        , with terms from the{" "}
        <Link href={`/resume-keywords/${e.slug}`} className={guideLinkCls}>
          {e.role.toLowerCase()} keyword list
        </Link>{" "}
        highlighted.
      </figcaption>
    </figure>
  );
}

function FullExampleFigure() {
  const e = getResumeExample(HOW_TO_FULL_EXAMPLE);
  if (!e) return null;
  return (
    <ExampleResumeFigure example={e} template="classic">
      Our{" "}
      <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
        {e.role.toLowerCase()} resume example
      </Link>{" "}
      in the Classic template: contact line, a two-line summary, experience with the latest job first and verb-led bullets, then education and skills.
    </ExampleResumeFigure>
  );
}

export default function HowToWriteAResumePage() {
  const words = guideWordCount(HOW_TO_SECTIONS, HOW_TO_FAQS, [...HOW_TO_QUICK, ...HOW_TO_PROOFREAD]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: HOW_TO_PUBLISHED,
    updated: HOW_TO_UPDATED,
    words,
    section: "Resume Tips",
    faqs: HOW_TO_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="How to write a resume:"
      muted="step by step, with real examples."
      lead="Eight steps from a blank page to a resume you can send: what goes in each section, how to turn duties into results, and how to tailor it for each job in the US."
      updated={HOW_TO_UPDATED}
      words={words}
      intro={{ heading: "The eight steps at a glance", node: <NumberedCards items={HOW_TO_STEPS} reveal={false} compact /> }}
      sections={HOW_TO_SECTIONS}
      figures={{
        contact: <ContactFigure />,
        summaries: <SummariesFigure />,
        rewrites: (
          <figure>
            <BulletRewrites items={howToRewrites()} />
            <figcaption className="mt-3 px-1 text-[13px] leading-5 text-[#66647c]">
              Before-and-after pairs from our resume examples; each role name links to the full example. Figures are illustrative.
            </figcaption>
          </figure>
        ),
        tailoring: <TailoringFigure />,
        proofreading: (
          <div className="mt-6">
            <CheckList items={HOW_TO_PROOFREAD} label="Proofreading checklist" />
          </div>
        ),
        "full-example": <FullExampleFigure />,
      }}
      keyFacts={{ afterSection: "before-you-start", title: "The short version", lead: "One column, most recent job first, results in every bullet.", facts: HOW_TO_QUICK }}
      faqs={HOW_TO_FAQS}
      aside={{
        label: "Check your resume",
        title: "Written it? Check it.",
        sub: "Free, no account needed. See what an applicant tracking system reads.",
        cta: { cta: "free_ats_check", location: "how_to_write_resume", href: "/free-ats-check", label: "Check my resume" },
        card: { title: "Need a better bullet?", sub: "Turn a duty into an achievement, free.", href: "/tools/resume-bullet-point-generator", link: "Bullet point generator" },
      }}
      related={RELATED}
      reading={HOW_TO_READING}
      finalCta={{
        title: "Finished your resume? Check it.",
        sub: "The free ATS check flags columns, tables, missing contact details and inconsistent dates.",
        cta: "free_ats_check",
        location: "how_to_write_resume_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
