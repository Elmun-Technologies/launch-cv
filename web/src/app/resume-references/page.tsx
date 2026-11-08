import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { CheckList } from "@/components/site/seo/check-list";
import { ReferenceSheet, referencePlainText } from "@/components/site/seo/reference-sheet";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  REFERENCE_ASK_SCRIPT,
  REFERENCE_PICKS,
  REFERENCES_QUICK,
  REFERENCES_WHEN,
  RESUME_REFERENCES_FAQS,
  RESUME_REFERENCES_PUBLISHED,
  RESUME_REFERENCES_READING,
  RESUME_REFERENCES_SECTIONS,
  RESUME_REFERENCES_TEMPLATE,
  RESUME_REFERENCES_UPDATED,
} from "@/lib/seo/resume-references";

const PATH = "/resume-references";
const CRUMB = "Resume references page";
const TITLE = fitTitle("References Page for a Resume: Free Template & Format (2026)", "Resume References Page Template (2026)");
const HEADLINE = "How to format a references page, who to ask, and a free template";
const DESCRIPTION =
  "A references page for your resume: when you need one, who to pick, how to ask, formatting rules, and a free fill-in template you can copy or download as Word.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESUME_REFERENCES_PUBLISHED, modifiedTime: RESUME_REFERENCES_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "resume references",
    "references page for resume",
    "references page template",
    "how many references should i list",
    "should references be on a resume",
    "professional references list",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/resume-length", t: "Resume length", d: "What to cut, including the \"references available\" line." },
  { href: "/cover-letter/referral", t: "Referral cover letter", d: "Name someone who referred you, the right way." },
  { href: "/how-to-write-a-resume", t: "How to write a resume", d: "Eight steps from a blank page to a finished resume." },
  { href: "/resume-summary-examples", t: "Resume summary examples", d: "Summaries for every job and situation." },
];

function WhoCards() {
  return (
    <ul className="mt-6 space-y-2.5">
      {REFERENCE_PICKS.map((p) => (
        <li key={p.who} className="rounded-[20px] bg-white p-4 sm:p-5">
          <p className="text-[16px] font-extrabold text-[#121226]">{p.who}</p>
          <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{p.why}</p>
        </li>
      ))}
    </ul>
  );
}

function AskScript() {
  return (
    <figure className="mt-6">
      <div className="rounded-[24px] bg-[#f1eff8] p-5 sm:p-7">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#66647c]">{REFERENCE_ASK_SCRIPT.heading}</p>
        <p className="mt-2.5 text-[15px] italic leading-[24px] text-[#24223a] sm:text-[16px] sm:leading-[25px]">&ldquo;{REFERENCE_ASK_SCRIPT.text}&rdquo;</p>
      </div>
    </figure>
  );
}

export default function ResumeReferencesPage() {
  const words = guideWordCount(RESUME_REFERENCES_SECTIONS, RESUME_REFERENCES_FAQS, [
    ...REFERENCES_QUICK,
    ...REFERENCE_PICKS.flatMap((p) => [p.who, p.why]),
    ...REFERENCES_WHEN,
    REFERENCE_ASK_SCRIPT.text,
  ]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: RESUME_REFERENCES_PUBLISHED,
    updated: RESUME_REFERENCES_UPDATED,
    words,
    section: "Resume Tips",
    faqs: RESUME_REFERENCES_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="References page for a resume:"
      muted="format, who to ask, and a free template."
      lead="References go on their own page, sent only when asked. Here's who to pick, how to ask them, and a template to copy or download."
      updated={RESUME_REFERENCES_UPDATED}
      words={words}
      sections={RESUME_REFERENCES_SECTIONS}
      figures={{
        when: <CheckList items={REFERENCES_WHEN} label="When you need a references page" />,
        who: <WhoCards />,
        ask: <AskScript />,
        template: (
          <ReferenceSheet
            heading="References page template"
            headingId="references-template"
            doc={RESUME_REFERENCES_TEMPLATE}
            footnote={
              <>
                Replace every [bracketed] placeholder with your own details.{" "}
                <WordDownload text={referencePlainText(RESUME_REFERENCES_TEMPLATE)} filename="resume-references-template" srLabel="Download references template as Word" />
              </>
            }
          />
        ),
      }}
      keyFacts={{ afterSection: "what-is", title: "Quick rules", lead: "A separate page, sent only when it's asked for.", facts: REFERENCES_QUICK }}
      faqs={RESUME_REFERENCES_FAQS}
      aside={{
        label: "Prep the rest of your application",
        title: "References set, resume next.",
        sub: "Check how an applicant tracking system reads your resume — columns, tables, missing contact details and more.",
        cta: { cta: "free_ats_check", location: "resume_references", href: "/free-ats-check", label: "Check my resume — free" },
        card: { title: "Need a cover letter too?", sub: "Fill-in templates for every situation.", href: "/cover-letter-examples#situations", link: "Cover letter templates" },
      }}
      related={RELATED}
      reading={RESUME_REFERENCES_READING}
      finalCta={{
        title: "References ready? Check the resume they go with.",
        sub: "The free ATS check flags missing keywords, columns, tables and contact details.",
        cta: "free_ats_check",
        location: "resume_references_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
