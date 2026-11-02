import Link from "next/link";
import { COMPANY_DOCS, DocPage, docListCls, type DocSection } from "@/components/marketing/doc-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { contentUpdated, contentUpdatedLabel } from "@/lib/content-dates";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR, SITE_AUTHOR_ID } from "@/lib/author";

const PATH = "/editorial-process";
const DESCRIPTION =
  "How LaunchCV writes and checks its guides, resume examples and AI suggestions: fictional examples, sourced rules, no invented numbers, and how to report an error.";

export const metadata = buildMarketingMetadata({
  title: "Editorial Process — How We Write and Check",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV editorial process", "editorial policy", "how LaunchCV writes guides", "resume example sources"],
});

const sections: DocSection[] = [
  {
    h: "Who writes our pages",
    body: (
      <>
        <p>
          Our guides, resume and cover letter examples, and blog posts are credited to{" "}
          <Link href={SITE_AUTHOR.path}>{SITE_AUTHOR.name}</Link>, {SITE_AUTHOR.role}. LaunchCV is a small team at Elmun
          Technologies LLC.
        </p>
        <p className="mt-3">
          We write for people applying to jobs in the US: plain words, short sentences and advice you can act on.
        </p>
      </>
    ),
  },
  {
    h: "Example people and companies are fictional",
    body: (
      <ul className={docListCls}>
        <li>
          Every person on a <Link href="/resume-examples">resume example</Link> is made up, and so are the employers they
          worked for.
        </li>
        <li>
          Each <Link href="/cover-letter-examples">cover letter example</Link> is written by the same fictional person as
          the matching resume, and only uses facts and numbers from that resume, so the pair reads as one application.
        </li>
        <li>
          Role photos are stock photos that illustrate the job. They don&apos;t show the people named in the examples.
        </li>
      </ul>
    ),
  },
  {
    h: "Credentials and rules come from the source",
    body: (
      <>
        <p>
          When an example names a license, certification or regulation — for example an EPA Section 608 certification, an
          OSHA Outreach card, a CDL endorsement or ServSafe — we write it the way the issuing body writes it and check it
          against that body&apos;s own site.
        </p>
        <p className="mt-3">
          Our long guides, such as the <Link href="/resume-format">resume format guide</Link>,{" "}
          <Link href="/resume-length">resume length guide</Link> and the <Link href="/ats">ATS guides</Link>, list their
          sources at the end and say when the links were last checked. LaunchCV isn&apos;t affiliated with any ATS vendor
          we write about.
        </p>
      </>
    ),
  },
  {
    h: "Numbers and statistics",
    body: (
      <ul className={docListCls}>
        <li>We don&apos;t publish salary figures.</li>
        <li>
          We don&apos;t quote a statistic unless we can link to where it comes from. When we found unsourced claims in older
          posts, we removed them.
        </li>
        <li>
          We don&apos;t show score jumps or results we can&apos;t back up, such as &ldquo;your score will go from 54 to 89&rdquo;.
        </li>
        <li>Numbers inside example resumes belong to the fictional person and are there to show the format.</li>
      </ul>
    ),
  },
  {
    h: "How our AI handles your facts",
    body: (
      <>
        <p>AI writing tools are only useful if they don&apos;t make things up. Here is what ours do:</p>
        <ul className={`${docListCls} mt-3`}>
          <li>
            Bullet rewrites and <Link href="/features/jd-alignment">job description match</Link> rewrites are told to use only
            facts from your resume. If a rewrite contains a number that isn&apos;t in your resume, we replace it with{" "}
            <code className="rounded bg-[#f1eff8] px-1.5 py-0.5 text-[0.9em]">[number]</code> so you fill in the real figure.
          </li>
          <li>
            The free <Link href="/tools/resume-bullet-point-generator">bullet point</Link> and{" "}
            <Link href="/tools/resume-summary-generator">summary</Link> generators drop any result that contains a number
            you didn&apos;t type, including spelled-out numbers like &ldquo;dozens&rdquo;.
          </li>
          <li>Nothing changes in your resume until you accept it.</li>
          <li>AI can still be wrong. Read every line before you send it — it&apos;s your resume.</li>
        </ul>
      </>
    ),
  },
  {
    h: "How the ATS check scores a resume",
    body: (
      <>
        <p>
          The <Link href="/free-ats-check">free ATS check</Link> starts with signals counted by plain rules, without AI:
        </p>
        <ul className={`${docListCls} mt-3`}>
          <li>word count, and whether an email, phone number and links are present;</li>
          <li>whether the experience, education, skills and summary sections are there;</li>
          <li>how many bullets there are and how many include a number;</li>
          <li>which date formats are used, and whether they&apos;re mixed;</li>
          <li>signs of columns or tables, and heavy use of ALL CAPS.</li>
        </ul>
        <p className="mt-3">
          The AI that writes the score and fixes gets these signals as facts it may not contradict. The &ldquo;what the
          software read&rdquo; part of the report — name, contact details, job titles, dates, skills and education — is
          parsed by rules alone. The score is an estimate of how common ATS software reads a resume; each employer&apos;s
          settings differ.
        </p>
      </>
    ),
  },
  {
    h: "Dates",
    body: (
      <p>
        Our guides, examples and blog posts show an <span className="font-semibold text-[#121226]">Updated</span> date. We change it when the content of
        the page changes in a way a reader would notice, and never just to make a page look fresh. Our sitemap uses the same
        dates.
      </p>
    ),
  },
  {
    h: "Photos",
    body: (
      <p>
        Stock photos on LaunchCV come from Unsplash and are used under the{" "}
        <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">
          Unsplash License
        </a>
        . We resize them, and some portraits have the background removed. Resume previews on our pages are drawn from the
        example text, not screenshots of real resumes.
      </p>
    ),
  },
  {
    h: "Corrections",
    body: (
      <p>
        Found a mistake, an outdated rule or a broken source link? Email{" "}
        <a href="mailto:support@launch-cv.com">support@launch-cv.com</a> with the page address. A person reads every email.
        When we fix a factual error, we update the page and its Updated date. You can see what changed in the product on our{" "}
        <Link href="/changelog">changelog</Link>.
      </p>
    ),
  },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Editorial process | LaunchCV",
  url: absoluteUrl(PATH),
  description: DESCRIPTION,
  inLanguage: "en-US",
  dateModified: contentUpdated(PATH).toISOString().slice(0, 10),
  isPartOf: { "@id": WEBSITE_ID },
  publisher: orgRef,
  author: { "@id": SITE_AUTHOR_ID },
  about: orgRef,
};

export default function EditorialProcessPage() {
  return (
    <DocPage
      label="/ Company"
      title="Editorial process"
      updatedPrefix="Updated"
      updated={contentUpdatedLabel(PATH)}
      intro="How we write and check our guides, examples and AI suggestions — and how to tell us when we get something wrong."
      nav={{ label: "Company pages", links: COMPANY_DOCS, current: PATH }}
      sections={sections}
      ld={ld}
    />
  );
}
