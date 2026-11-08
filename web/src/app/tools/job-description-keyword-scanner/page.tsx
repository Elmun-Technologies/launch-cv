import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { container, labelCls } from "@/components/site/ui";
import { KeywordScanner } from "@/components/site/tools/keyword-scanner";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, ToolStage, toolSectionPad } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { KEYWORD_SCANNER_PATH, toolPageLd } from "@/lib/seo/free-tools";
import type { FaqItem } from "@/lib/faq-ld";

const PATH = KEYWORD_SCANNER_PATH;
const DESCRIPTION =
  "Paste a job description to pull out its key skills and tools, ranked by importance, and see which ones your resume is missing. Free, runs in your browser.";

export const metadata = buildMarketingMetadata({
  title: "Job Description Keyword Scanner — Free Tool",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "job description keyword scanner",
    "resume keyword scanner",
    "extract keywords from job description",
    "job description keywords",
    "resume keyword checker",
  ],
});

const faqs: FaqItem[] = [
  {
    q: "How does the scanner find keywords?",
    a: "It matches the posting against the skills, tools and certifications listed in LaunchCV's resume examples, then adds names it doesn't know that look like tools (HubSpot, GA4), repeat, or are listed in the requirements, plus lower-case phrases that repeat. Posting boilerplate such as benefits, locations and equal-opportunity text is left out.",
  },
  {
    q: "What do “Required” and “Preferred” mean?",
    a: "Required means the term appears under a heading such as Requirements or Qualifications, or in a line with “must” or “required”. Preferred means it only appears in nice-to-have lines, such as “Preferred” or “is a plus”. Other terms are listed without a label.",
  },
  {
    q: "Why is a keyword marked missing when I have that skill?",
    a: "The match looks for the same words, with plurals and punctuation folded, so “forecast models” doesn't match “Forecasting”. If the skill is true for you, use the posting's wording in your skills section or a bullet.",
  },
  {
    q: "Should I add every missing keyword to my resume?",
    a: "No. Add the ones that are true for you, and show each in a bullet with what you did. Anything on your resume is something an interviewer can ask about.",
  },
  {
    q: "Is my job description or resume uploaded?",
    a: "No. The scan runs in your browser. Neither text is sent to LaunchCV or saved anywhere, and closing the page clears it.",
  },
  {
    q: "Will matching every keyword get me past the ATS?",
    a: "Not on its own. Each applicant tracking system and recruiter searches differently, and a resume the software can't read loses its keywords. The free ATS check looks at formatting and structure too.",
  },
];

const ranking = [
  { t: "Requirements first", d: "Terms under Requirements or Qualifications, or in a “must” line, weigh the most." },
  { t: "Then the day-to-day", d: "Responsibilities, and lines without a heading, come next." },
  { t: "Nice-to-haves after", d: "“Preferred” and “a plus” lines count less. The company blurb and benefits count least." },
  { t: "The job title", d: "A term in the posting's first line, usually the title, moves up the list." },
];

const inlineLink = "lc-link font-semibold text-[#5440e8]";

export default function KeywordScannerPage() {
  return (
    <SiteShell>
      <JsonLd data={toolPageLd({ name: "Job Description Keyword Scanner", crumb: "Keyword scanner", path: PATH, description: DESCRIPTION, faqs })} />
      <ToolHero
        crumb="Keyword scanner"
        title="Job description keyword scanner."
        muted="See what the job asks for."
        lead="Paste a job posting. Get its skills, tools and certifications, most important first — and, with your resume, which ones you're missing."
        mobileLead="Paste a job posting. See its keywords ranked, and which your resume is missing."
      />
      <ToolStage>
        <KeywordScanner />
      </ToolStage>

      {/* Answer-first explanation */}
      <section className={`${container} ${toolSectionPad}`}>
        <div className="lc-reveal grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className={labelCls}>/ What it does</p>
            <h2 className="lc-h2 mt-5">
              What a keyword scanner does. <span>And how to use it.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-[16px] leading-[26px] text-[#4a4862] lg:text-[17px] lg:leading-7">
            <p>
              A job description keyword scanner reads a job posting and lists the skills, tools, certifications and job titles it asks for, so you can check
              that your resume uses the same words. Applicant tracking systems store your resume as text that recruiters search, so the posting&apos;s own
              wording matters.
            </p>
            <p>
              This scanner weighs each term by how often and where it appears. A mention under Requirements counts more than one under Responsibilities, a
              nice-to-have counts less, and the company blurb counts least. Terms in the job title move up. Paste your resume as well and each term is
              marked as in your resume or missing.
            </p>
            <p>
              Add a missing keyword only if it&apos;s true for you, and show it in a bullet with a result. For the usual keywords of a whole role, see{" "}
              <Link href="/resume-keywords" className={inlineLink}>
                resume keywords by job
              </Link>
              . To check that the software can read your resume at all, run the{" "}
              <Link href="/free-ats-check" className={inlineLink}>
                free ATS check
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <NumberedCards label="How it ranks" title="Not every mention counts the same." muted="Where a term appears matters." items={ranking} />
      <MoreTools current="keywords" />
      <ToolFaq title="Keyword scanner," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="keyword_scanner_next"
        title="Found the gaps? Put them in a real resume."
        lead="The free ATS check scores your resume and names each fix. The editor, templates and PDF export are free with an account."
      />
    </SiteShell>
  );
}
