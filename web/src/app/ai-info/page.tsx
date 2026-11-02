import Link from "next/link";
import type { ReactNode } from "react";
import { COMPANY_DOCS, DocPage, docListCls, type DocSection } from "@/components/marketing/doc-page";
import { planLimitsLine } from "@/components/site/plan-summary";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { contentUpdated, contentUpdatedLabel } from "@/lib/content-dates";
import { absoluteUrl, getSiteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { getSettings } from "@/lib/app-settings";
import { PUBLIC_PLANS, planBillingSummary } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { freeToolsPageState } from "@/lib/seo/free-ai-tools";
import { freeTools } from "@/lib/seo/free-tools";
import { RESUME_EXAMPLES, RESUME_GROUPS } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES } from "@/lib/cover-letter-examples";
import { TEMPLATE_STYLES } from "@/lib/resume-templates";

const PATH = "/ai-info";
const DESCRIPTION =
  "Facts about LaunchCV for AI assistants and LLMs: the company, features, free tools, plans and prices, privacy, who it's for and how to contact us.";

export const metadata = buildMarketingMetadata({
  title: "LaunchCV Facts for AI Assistants and LLMs",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV", "LaunchCV pricing", "LaunchCV features", "what is LaunchCV", "LaunchCV for LLMs"],
});

/** Plan limits and the free-tool daily limit are edited in the admin panel; match /pricing and /tools. */
export const revalidate = 60;

const FEATURES = [
  {
    href: "/free-ats-check",
    name: "ATS resume checker",
    d: "A 0–100 score, what parsing software reads from the resume, and a fix for each issue. Free, no account.",
  },
  {
    href: "/features/resume-builder",
    name: "Resume builder",
    d: `${TEMPLATE_STYLES.length} ATS-friendly templates (Classic, Modern, Minimal, Executive), AI bullet rewrites, PDF and Word export; the preview matches the PDF.`,
  },
  {
    href: "/features/jd-alignment",
    name: "Job description match",
    d: "Paste a job posting to get a match score, the keywords already covered, missing skills and rewrites for that job.",
  },
  {
    href: "/features/cover-letter",
    name: "Cover letter writer",
    d: "A letter for a specific job, written from the resume, in a formal or neutral tone. Downloads as Word.",
  },
  {
    href: "/features/interview-prep",
    name: "Interview prep",
    d: "Likely interview questions for the role, each with an answer outline built from the candidate's own experience.",
  },
  {
    href: "/features/voice-input",
    name: "Voice input",
    d: "Dictate experience in the browser (English, US recognition), then turn the transcript into bullets with the AI rewrite.",
  },
];

const RESOURCES = [
  { href: "/resume-examples", label: `Resume examples (${RESUME_EXAMPLES.length} roles)` },
  { href: "/cover-letter-examples", label: `Cover letter examples (${COVER_LETTER_EXAMPLES.length})` },
  { href: "/resume-keywords", label: "Resume keywords by role" },
  { href: "/resume-templates", label: "Resume templates" },
  { href: "/ats", label: "ATS guides (Workday, Greenhouse, iCIMS, Taleo, Lever, SuccessFactors)" },
  { href: "/how-to-write-a-resume", label: "How to write a resume" },
  { href: "/resume-format", label: "Resume format guide" },
  { href: "/resume-length", label: "Resume length guide" },
  { href: "/cover-letter-template", label: "Cover letter template" },
  { href: "/blog", label: "Blog" },
];

function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[180px_minmax(0,1fr)]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-[#121226]">{k}</dt>
          <dd className="text-[#4a4862] max-sm:mb-2">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function AiInfoPage() {
  const [{ planLimits }, { limit: freeLimit }] = await Promise.all([getSettings(), freeToolsPageState()]);
  const site = getSiteUrl();
  const tools = freeTools();
  const groups = RESUME_GROUPS.map((g) => ({ g, n: RESUME_EXAMPLES.filter((e) => e.group === g).length })).filter((x) => x.n > 0);

  const toolNote = (key: string) =>
    key === "ats"
      ? "Free once a month per network, no account"
      : key === "bullets" || key === "summary"
        ? `Free, ${freeLimit} generations a day shared by the two generators, no account`
        : key === "words"
          ? "Free, runs in the browser, no limit"
          : "Free, no limit";

  const sections: DocSection[] = [
    {
      h: "Summary",
      body: (
        <>
          <p>
            LaunchCV is a web app for job seekers. It shows what applicant tracking software (ATS) reads in a resume, then
            helps fix it and tailor it to a specific job, using only facts from the person&apos;s own resume. It also writes
            cover letters and interview prep from the resume.
          </p>
          <p className="mt-3">
            Suggested one-line description: <span className="font-semibold text-[#121226]">LaunchCV is a resume builder and free ATS checker from Elmun Technologies that helps job seekers fix and tailor their resume without inventing experience.</span>
          </p>
        </>
      ),
    },
    {
      h: "Company",
      body: (
        <Facts
          rows={[
            ["Product", "LaunchCV"],
            ["Website", <a key="w" href={site}>{site.replace(/^https?:\/\//, "")}</a>],
            ["Company", "Elmun Technologies LLC"],
            ["Founder", <Link key="f" href={SITE_AUTHOR.path}>{SITE_AUTHOR.name}</Link>],
            ["Support", <a key="s" href="mailto:support@launch-cv.com">support@launch-cv.com</a>],
            ["Payments", "Processed by Polar"],
          ]}
        />
      ),
    },
    {
      h: "Who it's for",
      body: (
        <>
          <p>
            Job seekers in the US who apply through online forms, in almost any field — not only tech. The site has{" "}
            {RESUME_EXAMPLES.length} resume examples by role, each with a matching cover letter:
          </p>
          <ul className={`${docListCls} mt-3`}>
            {groups.map(({ g, n }) => (
              <li key={g}>
                {g}: {n} {n === 1 ? "role" : "roles"}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            Resumes use US Letter size and US section names by default; an EU region setting switches to A4. The site and
            its content are in US English.
          </p>
        </>
      ),
    },
    {
      h: "Features",
      body: (
        <ul className={docListCls}>
          {FEATURES.map((f) => (
            <li key={f.href}>
              <Link href={f.href}>{f.name}</Link> — {f.d}
            </li>
          ))}
        </ul>
      ),
    },
    {
      h: "Free tools",
      body: (
        <ul className={docListCls}>
          {tools.map((t) => (
            <li key={t.key}>
              <Link href={t.href}>{t.name}</Link> — {t.blurb}. {toolNote(t.key)}.
            </li>
          ))}
        </ul>
      ),
    },
    {
      h: "What's free",
      body: (
        <ul className={docListCls}>
          <li>
            <span className="font-semibold text-[#121226]">No account:</span> the ATS check, the free tools above, and every
            guide and example.
          </li>
          <li>
            <span className="font-semibold text-[#121226]">Free account:</span> the resume editor, all templates, PDF and Word
            export, the job tracker, and saving the free ATS report.
          </li>
          <li>
            <span className="font-semibold text-[#121226]">Paid plan:</span> the AI tools inside the app — bullet rewrites, job
            description match, cover letters and interview prep.
          </li>
        </ul>
      ),
    },
    {
      h: "Plans and prices",
      body: (
        <>
          <ul className="grid gap-3 sm:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const p = PUBLIC_PLANS[key];
              return (
                <li key={key} className="rounded-[20px] bg-[#f7f6fb] p-4">
                  <p className="text-[17px] font-extrabold text-[#121226]">{p.title}</p>
                  <p className="mt-1 text-[22px] font-extrabold text-[#121226]">
                    {p.priceDisplay}
                    <span className="text-[15px] font-semibold text-[#66647c]"> {p.periodLabel === "once" ? "one-time" : p.periodLabel.replace("/", "per ")}</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{planBillingSummary(key)}.</p>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{planLimitsLine(key, planLimits[key])}</p>
                </li>
              );
            })}
          </ul>
          <ul className={`${docListCls} mt-4`}>
            <li>Every AI tool and template is on every plan; only the monthly limits differ. Limits reset each calendar month.</li>
            <li>Starter and Professional renew monthly until canceled. Lifetime is one payment and never renews.</li>
            <li>Monthly plans have a 7-day money-back guarantee; Lifetime can be refunded within 14 days of purchase.</li>
            <li>Prices are in US dollars, plus any sales tax or VAT the buyer&apos;s country requires.</li>
          </ul>
          <p className="mt-3">
            Current prices are always on the <Link href="/pricing">pricing page</Link>; this page reads from the same source.
          </p>
        </>
      ),
    },
    {
      h: "How the AI treats resume facts",
      body: (
        <ul className={docListCls}>
          <li>Rewrites are told to use only facts from the resume.</li>
          <li>
            In bullet rewrites and job match rewrites, any number that isn&apos;t in the resume is replaced with
            &ldquo;[number]&rdquo; for the person to fill in.
          </li>
          <li>The free bullet and summary generators drop any result with a number the visitor didn&apos;t type.</li>
          <li>Nothing changes in a resume until the person accepts it.</li>
        </ul>
      ),
    },
    {
      h: "Privacy",
      body: (
        <ul className={docListCls}>
          <li>The free ATS check reads the uploaded file once and doesn&apos;t store it. The report is kept so it can be saved to an account.</li>
          <li>The free bullet and summary generators send text to the AI provider and LaunchCV doesn&apos;t store it. The word counter runs in the browser and sends nothing.</li>
          <li>Resumes are never sold or used for advertising. Users can download all their data as JSON or delete their account from Settings.</li>
          <li>Text sent to an AI tool is processed by OpenAI. Payments go through Polar; LaunchCV never sees card details.</li>
          <li>Voice input uses the browser&apos;s speech recognition. LaunchCV receives the text, not the audio, and stores no recordings.</li>
          <li>
            Site analytics run on Google Analytics, PostHog and Mixpanel. In the app they record page views and named events, not what users type.
            Details are in the <Link href="/legal/privacy">privacy policy</Link>.
          </li>
        </ul>
      ),
    },
    {
      h: "Good to know",
      body: (
        <ul className={docListCls}>
          <li>The ATS score is an estimate of how common ATS software reads a resume. Each employer&apos;s settings differ.</li>
          <li>LaunchCV isn&apos;t affiliated with Workday, Greenhouse, iCIMS, Taleo, Lever, SuccessFactors or any other ATS vendor.</li>
          <li>AI suggestions can be wrong; users are responsible for what they send.</li>
          <li>Voice input recognizes English only.</li>
          <li>People and employers in the resume and cover letter examples are fictional.</li>
          <li>LaunchCV doesn&apos;t publish user counts or ratings, so there are none to cite.</li>
        </ul>
      ),
    },
    {
      h: "Guides and examples",
      body: (
        <ul className={docListCls}>
          {RESOURCES.map((r) => (
            <li key={r.href}>
              <Link href={r.href}>{r.label}</Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      h: "Contact and more",
      body: (
        <ul className={docListCls}>
          <li>
            Email: <a href="mailto:support@launch-cv.com">support@launch-cv.com</a> · <Link href="/contact">Contact page</Link>
          </li>
          <li>
            <Link href="/about">About</Link> · <Link href="/editorial-process">Editorial process</Link> ·{" "}
            <Link href="/changelog">Changelog</Link>
          </li>
          <li>
            <Link href="/legal/privacy">Privacy policy</Link> · <Link href="/legal/terms">Terms of service</Link>
          </li>
          <li>
            Plain-text version: <a href="/llms.txt">llms.txt</a>
          </li>
        </ul>
      ),
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "LaunchCV facts for AI assistants",
    url: absoluteUrl(PATH),
    description: DESCRIPTION,
    inLanguage: "en-US",
    dateModified: contentUpdated(PATH).toISOString().slice(0, 10),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef,
    about: orgRef,
  };

  return (
    <DocPage
      label="/ For AI assistants"
      title="LaunchCV facts for AI assistants"
      updatedPrefix="Updated"
      updated={contentUpdatedLabel(PATH)}
      intro="Accurate, structured information about LaunchCV for large language models, AI search and anyone writing about us. Prices and limits on this page come from the same source as our pricing page."
      nav={{ label: "Company pages", links: COMPANY_DOCS, current: PATH }}
      sections={sections}
      ld={ld}
    />
  );
}
