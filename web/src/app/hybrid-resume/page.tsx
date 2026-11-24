import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { CheckList } from "@/components/site/seo/check-list";
import { CopyPill } from "@/components/site/library/copy-pill";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  HYBRID_COMPARE,
  HYBRID_EXAMPLES,
  HYBRID_QUICK,
  HYBRID_RESUME_FAQS,
  HYBRID_RESUME_PUBLISHED,
  HYBRID_RESUME_READING,
  HYBRID_RESUME_SECTIONS,
  HYBRID_RESUME_UPDATED,
  HYBRID_TEMPLATE,
  HYBRID_WHEN,
  hybridPlainText,
  type HybridDoc,
} from "@/lib/seo/hybrid-resume";

const PATH = "/hybrid-resume";
const CRUMB = "Hybrid resume";
const TITLE = fitTitle("Hybrid Resume: Template, 3 Examples & When to Use It (2026)", "Hybrid Resume Template & Examples (2026)");
const HEADLINE = "Hybrid resume: what it is, when to use it, a free template and three examples";
const DESCRIPTION =
  "Hybrid (combination) resume guide: when to use it, section order, how it compares with chronological and functional, a free template and three finished examples.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: HYBRID_RESUME_PUBLISHED, modifiedTime: HYBRID_RESUME_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "hybrid resume",
    "hybrid resume template",
    "hybrid resume examples",
    "hybrid resume example",
    "combination resume",
    "combination resume template",
    "hybrid resume format",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/resume-format", t: "Resume format", d: "Chronological, hybrid or functional, compared." },
  { href: "/cover-letter/career-change", t: "Career change cover letter", d: "Explain the move in one line, then prove it." },
  { href: "/skills-for-resume", t: "Skills for a resume", d: "Which skills to list, and how to prove them." },
  { href: "/resume-summary-examples", t: "Resume summary examples", d: "Summaries for every job and situation." },
];

/** "[Bracketed]" placeholders get a lilac chip, same convention as LetterSheet. */
function Ph({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className="rounded-[4px] bg-[#e4dfff] px-[2px] text-[#3a2bb8] [box-decoration-break:clone]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function ResumeDocSheet({ heading, headingId, doc, footnote }: { heading: string; headingId: string; doc: HybridDoc; footnote?: React.ReactNode }) {
  return (
    <figure aria-labelledby={headingId} className="mt-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 id={headingId} className="text-[20px] font-extrabold tracking-[-0.02em] text-[#121226] sm:text-[22px]">
          {heading}
        </h3>
        <CopyPill text={hybridPlainText(doc)} label="Copy text" />
      </div>
      <div className="rounded-[24px] bg-[#e4dfff] p-3 sm:p-7 lg:rounded-[32px]">
        <div className="rounded-lg bg-white px-[18px] py-[22px] text-[14px] leading-[22px] text-[#24223a] shadow-[0_30px_60px_-24px_rgba(36,24,120,.4)] [overflow-wrap:anywhere] sm:rounded-[10px] sm:px-10 sm:py-10 sm:text-[15px] sm:leading-[24px]">
          <p className="text-[17px] font-extrabold sm:text-[21px]">
            <Ph text={doc.name} />
          </p>
          <p className="mt-0.5 text-[#66647c]">
            <Ph text={doc.contact} />
          </p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-[18px]">
              <p className="border-b border-[#e2e0ea] pb-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#66647c]">{s.heading}</p>
              <div className="mt-2 space-y-1">
                {s.lines.map((line, i) =>
                  line === "" ? (
                    <div key={i} className="h-2" aria-hidden="true" />
                  ) : line.startsWith("- ") ? (
                    <p key={i} className="relative pl-4 before:absolute before:left-0 before:content-['•']">
                      <Ph text={line.slice(2)} />
                    </p>
                  ) : (
                    <p key={i} className={s.heading === "Experience" ? "font-bold" : undefined}>
                      <Ph text={line} />
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
      {footnote ? <figcaption className="mt-3 px-1 text-[13px] leading-5 text-[#66647c]">{footnote}</figcaption> : null}
    </figure>
  );
}

function CompareCards() {
  return (
    <ul className="mt-6 space-y-2.5">
      {HYBRID_COMPARE.map((c) => (
        <li key={c.format} className="rounded-[20px] bg-white p-4 sm:p-5">
          <p className="text-[16px] font-extrabold text-[#121226]">{c.format}</p>
          <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">
            <span className="font-bold text-[#24223a]">Order:</span> {c.order}
          </p>
          <p className="text-[14px] leading-[21px] text-[#4a4862]">
            <span className="font-bold text-[#24223a]">Best for:</span> {c.bestFor}
          </p>
          <p className="text-[14px] leading-[21px] text-[#4a4862]">
            <span className="font-bold text-[#24223a]">Watch out:</span> {c.risk}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Examples() {
  return (
    <>
      {HYBRID_EXAMPLES.map((e) => (
        <div key={e.id} id={e.id} className="scroll-mt-24">
          <ResumeDocSheet heading={e.title} headingId={`${e.id}-heading`} doc={e.doc} footnote={e.note} />
        </div>
      ))}
    </>
  );
}

export default function HybridResumePage() {
  const words = guideWordCount(HYBRID_RESUME_SECTIONS, HYBRID_RESUME_FAQS, [
    ...HYBRID_QUICK,
    ...HYBRID_WHEN,
    ...HYBRID_COMPARE.flatMap((c) => [c.order, c.bestFor, c.risk]),
    hybridPlainText(HYBRID_TEMPLATE),
    ...HYBRID_EXAMPLES.flatMap((e) => [e.note, hybridPlainText(e.doc)]),
  ]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: HYBRID_RESUME_PUBLISHED,
    updated: HYBRID_RESUME_UPDATED,
    words,
    section: "Resume Tips",
    faqs: HYBRID_RESUME_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Hybrid resume:"
      muted="a free template, three examples, and when to use it."
      lead="A hybrid (combination) resume leads with your skills, then lists your jobs with dates. Here's when it helps, the section order, a template to copy and three finished examples."
      updated={HYBRID_RESUME_UPDATED}
      words={words}
      sections={HYBRID_RESUME_SECTIONS}
      figures={{
        when: <CheckList items={HYBRID_WHEN} label="When a hybrid resume helps" />,
        compare: <CompareCards />,
        template: (
          <ResumeDocSheet
            heading="Hybrid resume template"
            headingId="hybrid-template"
            doc={HYBRID_TEMPLATE}
            footnote={
              <>
                Replace every [bracketed] placeholder with your own details.{" "}
                <WordDownload text={hybridPlainText(HYBRID_TEMPLATE)} filename="hybrid-resume-template" srLabel="Download hybrid resume template as Word" />
              </>
            }
          />
        ),
        examples: <Examples />,
      }}
      keyFacts={{ afterSection: "what-is", title: "Quick rules", lead: "Skills first, then a dated work history.", facts: HYBRID_QUICK }}
      faqs={HYBRID_RESUME_FAQS}
      aside={{
        label: "Build it faster",
        title: "Skills first, done right.",
        sub: "Check how an applicant tracking system reads your hybrid resume: columns, tables, missing dates and more.",
        cta: { cta: "free_ats_check", location: "hybrid_resume", href: "/free-ats-check", label: "Check my resume — free" },
        card: { title: "Changing careers?", sub: "A cover letter that explains the move.", href: "/cover-letter/career-change", link: "Career change cover letter" },
      }}
      related={RELATED}
      reading={HYBRID_RESUME_READING}
      finalCta={{
        title: "Hybrid resume ready? Check how it parses.",
        sub: "The free ATS check flags missing keywords, columns, tables and dates.",
        cta: "free_ats_check",
        location: "hybrid_resume_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
