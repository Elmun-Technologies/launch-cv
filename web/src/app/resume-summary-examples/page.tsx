import Link from "next/link";
import { GuidePage, guideLd, guideLinkCls, guideWordCount } from "@/components/site/seo/guide-page";
import { GuideTable } from "@/components/site/seo/guide-table";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { RESUME_EXAMPLES, RESUME_GROUPS } from "@/lib/resume-examples";
import {
  RESUME_SUMMARY_FAQS,
  RESUME_SUMMARY_PUBLISHED,
  RESUME_SUMMARY_READING,
  RESUME_SUMMARY_SECTIONS,
  RESUME_SUMMARY_UPDATED,
  SITUATION_SUMMARIES,
  SUMMARY_FORMULA,
  SUMMARY_QUICK,
  SUMMARY_REWRITES,
} from "@/lib/seo/resume-summary";

const PATH = "/resume-summary-examples";
const CRUMB = "Resume summary examples";
const ROLE_COUNT = RESUME_EXAMPLES.length;
/** Exact count: one per role plus the situation examples. */
const EXAMPLE_COUNT = ROLE_COUNT + SITUATION_SUMMARIES.length;
const TITLE = fitTitle(`${EXAMPLE_COUNT} Resume Summary Examples by Job & Situation (2026)`, "Resume Summary Examples (2026)");
const HEADLINE = "Resume summary examples for every job and situation";
const DESCRIPTION = `Resume summary examples for ${ROLE_COUNT} jobs and 8 situations (no experience, career change, senior), a 3-part formula, weak vs. strong rewrites and mistakes to avoid.`;

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESUME_SUMMARY_PUBLISHED, modifiedTime: RESUME_SUMMARY_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "resume summary examples",
    "professional summary examples",
    "resume summary",
    "how to write a resume summary",
    "resume summary no experience",
    "career change resume summary",
    "resume profile examples",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/tools/resume-summary-generator", t: "Resume summary generator", d: "A draft summary from your title, experience and best result — free." },
  { href: "/resume-examples", t: "Resume examples", d: "Full sample resumes by role, ready to edit with your own experience." },
  { href: "/how-to-write-a-resume", t: "How to write a resume", d: "Eight steps from a blank page to a finished resume." },
  { href: "/resume-action-verbs", t: "Resume action verbs", d: "Strong verbs grouped by the kind of work, with example bullets." },
];

function FormulaCards() {
  return (
    <ol className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-3.5">
      {SUMMARY_FORMULA.map((f) => (
        <li key={f.step} className="rounded-[24px] bg-white p-5 sm:p-6">
          <span className="lc-poster inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#5440e8] text-[15px] text-white">{f.step}</span>
          <p className="mt-3 text-[18px] font-extrabold text-[#121226]">{f.label}</p>
          <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">&ldquo;{f.example}&rdquo;</p>
        </li>
      ))}
    </ol>
  );
}

function SituationCards() {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
      {SITUATION_SUMMARIES.map((s) => (
        <li key={s.key} id={`summary-${s.key}`} className="scroll-mt-6 rounded-[24px] bg-white p-5 sm:p-6">
          <p className="text-[18px] font-extrabold text-[#121226]">{s.label}</p>
          <p className="mt-0.5 text-[13px] font-bold leading-[18px] text-[#3a2bb8]">{s.when}</p>
          <blockquote className="mt-3 border-l-[3px] border-[#c9c0ff] pl-3.5 text-[15px] leading-[24px] text-[#24223a]">{s.text}</blockquote>
          <p className="mt-3 text-[14px] leading-[21px] text-[#66647c]">
            <b className="text-[#121226]">Why it works:</b> {s.tip}
          </p>
        </li>
      ))}
    </ul>
  );
}

/** One summary per role, grouped like the examples index. Each links to the full example. */
function RoleSummaries() {
  return (
    <div className="mt-6 space-y-3">
      {RESUME_GROUPS.map((group) => {
        const roles = RESUME_EXAMPLES.filter((e) => e.group === group).sort((a, b) => a.role.localeCompare(b.role));
        if (!roles.length) return null;
        return (
          <details key={group} className="group rounded-[24px] bg-white [&_summary::-webkit-details-marker]:hidden" open={group === RESUME_GROUPS[0]}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[18px] font-extrabold text-[#121226] sm:px-6">
              <span>
                {group} <span className="text-[14px] font-semibold text-[#66647c]">· {roles.length} roles</span>
              </span>
              <span aria-hidden="true" className="text-[#5440e8] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="divide-y divide-[#eeecf5] px-5 pb-3 sm:px-6">
              {roles.map((e) => (
                <li key={e.slug} className="py-4">
                  <h3 className="text-[16px] font-extrabold text-[#121226]">
                    <Link href={`/resume-examples/${e.slug}#summary`} className="hover:text-[#5440e8]">
                      {e.role} resume summary
                    </Link>
                  </h3>
                  <p className="mt-1 text-[15px] leading-[24px] text-[#4a4862]">{e.resume.summary}</p>
                  {e.summaries.length ? (
                    <p className="mt-1.5 text-[13px] text-[#66647c]">
                      More for {e.summaries.map((s) => s.level.toLowerCase()).join(", ")}:{" "}
                      <Link href={`/resume-examples/${e.slug}`} className={guideLinkCls}>
                        {e.role} resume example
                      </Link>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}

export default function ResumeSummaryExamplesPage() {
  const roleText = RESUME_EXAMPLES.map((e) => e.resume.summary);
  const words = guideWordCount(RESUME_SUMMARY_SECTIONS, RESUME_SUMMARY_FAQS, [
    ...SUMMARY_QUICK,
    ...SUMMARY_REWRITES.flat(),
    ...SITUATION_SUMMARIES.flatMap((s) => [s.text, s.tip]),
    ...roleText,
  ]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: RESUME_SUMMARY_PUBLISHED,
    updated: RESUME_SUMMARY_UPDATED,
    words,
    section: "Resume Tips",
    faqs: RESUME_SUMMARY_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Resume summary examples"
      muted={`for ${ROLE_COUNT} jobs and every situation.`}
      lead="Two to four lines that make a recruiter keep reading. Use the three-part formula, see weak summaries rewritten, and copy an example for your job or situation."
      updated={RESUME_SUMMARY_UPDATED}
      words={words}
      sections={RESUME_SUMMARY_SECTIONS}
      figures={{
        formula: <FormulaCards />,
        rewrites: (
          <GuideTable label="Weak vs. strong resume summaries" caption="Weak resume summaries rewritten, with what changed" columns={["Weak", "Strong", "What changed"]} rows={SUMMARY_REWRITES} />
        ),
        situations: <SituationCards />,
        roles: <RoleSummaries />,
      }}
      keyFacts={{ afterSection: "what-is", title: "Quick rules", lead: "Short, specific and written for the job you want.", facts: SUMMARY_QUICK }}
      faqs={RESUME_SUMMARY_FAQS}
      aside={{
        label: "Write your summary",
        title: "Stuck on the first line?",
        sub: "Enter your title, years and best result. The free generator drafts a summary you can edit.",
        cta: { cta: "summary_generator", location: "resume_summary_examples", href: "/tools/resume-summary-generator", label: "Open the summary generator" },
        card: { title: "Then check the whole resume", sub: "See what an applicant tracking system reads, free.", href: "/free-ats-check", link: "Free ATS check" },
      }}
      related={RELATED}
      reading={RESUME_SUMMARY_READING}
      finalCta={{
        title: "Summary written? Check what the software reads.",
        sub: "The free ATS check flags missing keywords, columns, tables and contact details.",
        cta: "free_ats_check",
        location: "resume_summary_examples_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
