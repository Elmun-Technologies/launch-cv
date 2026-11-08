import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Breadcrumbs, btn, container, labelCls } from "@/components/site/ui";
import { FaqList } from "@/components/site/content/key-facts";
import { SourceList, SourceRef } from "@/components/site/seo/source-list";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { PUBLIC_PLANS, freeAllowanceSentence, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, isPassPlan } from "@/lib/plan-config";
import { getSettings } from "@/lib/app-settings";
import {
  COMPARE_ROWS,
  JOBSCAN_CHECKED,
  JOBSCAN_CHECKED_LABEL,
  JOBSCAN_SOURCES,
  JOBSCAN_STRENGTHS,
  jobscanSource,
  jobscanSourceNo,
  type JobscanSourceId,
} from "@/lib/seo/jobscan-comparison";

const PATH = "/alternatives/jobscan";
const TITLE = fitTitle("Jobscan Alternative: LaunchCV vs Jobscan (2026)", "Jobscan Alternative: LaunchCV vs Jobscan");
const DESCRIPTION =
  "Looking for a Jobscan alternative? An honest LaunchCV vs Jobscan comparison of ATS checks, job matching, prices and refunds, with every Jobscan claim sourced.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["Jobscan alternative", "LaunchCV vs Jobscan", "Jobscan alternatives", "free Jobscan alternative", "ATS resume checker"],
});

/** Plan limits are edited in the admin panel; refresh at most once a minute. */
export const revalidate = 60;

const n = (v: number) => v.toLocaleString("en-US");
const PRICE_LINE = CHECKOUT_PLAN_ORDER.map((k) => `${PUBLIC_PLANS[k].title} ${planPriceLabel(k)}`)
  .join(", ")
  .replace(/, ([^,]*)$/, " or $1");
const PASS_NAMES = CHECKOUT_PLAN_ORDER.filter(isPassPlan).map((k) => PUBLIC_PLANS[k].title).join(" and ");

const buildFaqs = (free: { jd: number; roleFit: number }): FaqItem[] => [
  {
    q: "Can I bring my resume over to LaunchCV?",
    a: "Yes. Upload your resume as a PDF or Word (.docx) file, or paste your LinkedIn profile text, and LaunchCV fills in each section for you to review before you edit or export it.",
  },
  {
    q: "Is LaunchCV's ATS check really free?",
    a: `Yes. It needs no account and returns a 0–100 score with a prioritized list of fixes. ${freeAllowanceSentence(free)} Cover letters and interview prep are on the paid plans. Jobscan's free plan, by contrast, includes job-post matching for 5 scans a month.`,
  },
  {
    q: "Is LaunchCV cheaper than Jobscan?",
    a: `LaunchCV costs ${PRICE_LINE}. Jobscan lists its current prices on its plan page, so compare them there. If you'd rather not subscribe, LaunchCV's ${PASS_NAMES} are single payments with no auto-renewal.`,
  },
  {
    q: "Does LaunchCV optimize LinkedIn profiles?",
    a: "No. LaunchCV can import your LinkedIn profile text to start a resume, but it doesn't score or rewrite the profile itself. Jobscan's LinkedIn Optimization is built for that.",
  },
  {
    q: "Does LaunchCV tell me which ATS an employer uses?",
    a: "No. LaunchCV checks your resume against rules that hold across common applicant tracking systems: one column, standard headings, contact details as plain text and one date format. Jobscan's ATS Tips detect the employer's system from the application link.",
  },
  {
    q: "How do refunds compare?",
    a: "LaunchCV's monthly plan has a 7-day money-back guarantee, and its passes never renew. Jobscan's cancellation policy considers refunds case by case when you ask within 2 calendar days of a billing period starting and haven't used the service in that period.",
  },
  {
    q: "Can I use both?",
    a: "Yes. Both have a free tier, so you can run your resume through each and keep whichever advice you find more useful before paying for anything.",
  },
];

const sectionPad = "pt-16 sm:pt-24 lg:pt-[130px]";
const linkCls = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]";

function Refs({ ids, dark = false }: { ids: JobscanSourceId[]; dark?: boolean }) {
  return (
    <span className={dark ? "[&_a]:text-white" : ""}>
      {ids.map((id) => (
        <SourceRef key={id} id={id} n={jobscanSourceNo(id)} />
      ))}
    </span>
  );
}

export default async function JobscanAlternativePage() {
  const { planLimits: L } = await getSettings();
  const FAQS = buildFaqs(L.free);
  const paidJd = CHECKOUT_PLAN_ORDER.map((k) => n(L[k].jd)).join(", ").replace(/, ([^,]*)$/, " or $1");
  const matchLine = `${L.free.jd > 0 ? `Free account — ${n(L.free.jd)} a month. ` : ""}Paid plans — ${paidJd} job matches a month (${CHECKOUT_PLAN_ORDER.map((k) => PUBLIC_PLANS[k].title).join(", ")})`;

  const rows = COMPARE_ROWS.map((r) => ({
    ...r,
    launchcv: r.launchcv ?? (r.label === "Price" ? PRICE_LINE : matchLine),
  }));

  const url = absoluteUrl(PATH);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "LaunchCV vs Jobscan: an honest side-by-side",
        description: DESCRIPTION,
        url,
        datePublished: JOBSCAN_CHECKED,
        dateModified: JOBSCAN_CHECKED,
        image: DEFAULT_OG_IMAGE,
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url, jobTitle: SITE_AUTHOR.role },
        publisher: orgRef,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en-US",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        about: [
          { "@type": "SoftwareApplication", name: "LaunchCV", applicationCategory: "BusinessApplication" },
          { "@type": "SoftwareApplication", name: "Jobscan", applicationCategory: "BusinessApplication", url: "https://www.jobscan.co/" },
        ],
        citation: JOBSCAN_SOURCES.map((s) => s.url),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-description"] },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "LaunchCV vs Jobscan", item: url },
        ],
      },
      faqPageLd(FAQS),
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <section className={`${container} pt-4 lg:pt-10`}>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "LaunchCV vs Jobscan" }]} />
        <div className="mt-3.5 flex flex-col gap-4 lg:mt-[22px] lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h1 className="max-w-[860px] text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:text-[64px] lg:leading-[66px]">
            LaunchCV vs Jobscan. <span className="text-[#7c7a94]">An honest side-by-side.</span>
          </h1>
          <p className="speakable-description max-w-[360px] text-[16px] leading-[25px] text-[#4a4862] lg:mb-1.5">
            We make LaunchCV, so read this as our view. Every Jobscan detail links to Jobscan&apos;s own page and was checked on{" "}
            <time dateTime={JOBSCAN_CHECKED}>{JOBSCAN_CHECKED_LABEL}</time>.
          </p>
        </div>
      </section>

      {/* WHO SHOULD PICK WHICH */}
      <section className={`${container} pt-8 lg:pt-10`}>
        <h2 className="sr-only">Which one to pick</h2>
        <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#5440e8] p-6 text-white sm:p-9 lg:rounded-[36px]">
            <p aria-hidden="true" className="lc-poster absolute right-6 top-2.5 m-0 text-[72px] leading-[80px] text-[#6a58ee] sm:text-[100px] sm:leading-[100px]">
              LCV
            </p>
            <h3 className="relative text-[24px] font-extrabold sm:text-[28px]">Pick LaunchCV if…</h3>
            <ul className="relative mt-4 flex list-disc flex-col gap-1.5 pl-5 text-[16px] leading-[26px] marker:text-[#c9c0ff]">
              <li>you want an ATS check with no account, before anything else</li>
              <li>you want the builder, all 4 templates, PDF export and job tracker free with an account</li>
              <li>
                you&apos;d rather buy a {PUBLIC_PLANS.week.title} ({planPriceLabel("week")}, no auto-renewal) than subscribe
              </li>
              <li>you want cover letters and interview prep on every paid plan</li>
              <li>you want a 7-day money-back window on monthly plans</li>
            </ul>
          </div>
          <div className="rounded-[28px] bg-white p-6 sm:p-9 lg:rounded-[36px]">
            <h3 className="text-[24px] font-extrabold sm:text-[28px]">Pick Jobscan if…</h3>
            <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-[16px] leading-[26px] text-[#24223a] marker:text-[#5440e8]">
              {JOBSCAN_STRENGTHS.map((s) => (
                <li key={s.text}>
                  {s.text}
                  <Refs ids={s.src} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SIDE BY SIDE */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal max-w-[980px]">
          <p className={labelCls}>/ Side by side</p>
          <h2 className="lc-h2 mt-3.5 lg:mt-5">
            Features and prices. <span>Sourced.</span>
          </h2>
        </div>
        <div
          tabIndex={0}
          role="region"
          aria-label="LaunchCV and Jobscan feature comparison (scrolls sideways on small screens)"
          className="lc-card relative mt-6 overflow-x-auto rounded-3xl px-4 pb-2 pt-1 sm:mt-10 sm:rounded-[28px] sm:px-8 sm:pb-3 sm:pt-2"
        >
          <table className="w-full min-w-[620px] border-collapse text-[14px] sm:text-[15px]">
            <caption className="sr-only">LaunchCV compared with Jobscan. Jobscan details checked {JOBSCAN_CHECKED_LABEL}.</caption>
            <colgroup>
              <col className="w-[36%]" />
              <col className="w-[32%]" />
              <col className="w-[32%]" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="py-4 text-left sm:py-[18px]">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="px-2 py-4 text-left font-extrabold text-[#5440e8] sm:py-[18px]">
                  LaunchCV
                </th>
                <th scope="col" className="px-2 py-4 text-left font-extrabold sm:py-[18px]">
                  Jobscan
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-[#e2e0ea] align-top transition-colors hover:bg-[#f7f6fb]">
                  <th scope="row" className="py-3.5 pr-3 text-left font-bold sm:py-4">
                    {r.label}
                  </th>
                  <td className={`px-2 py-3.5 sm:py-4 ${r.launchcvNo ? "text-[#66647c]" : "text-[#24223a]"}`}>{r.launchcv}</td>
                  <td className="px-2 py-3.5 text-[#24223a] sm:py-4">
                    {r.link ? (
                      <a href={jobscanSource("plan").url} target="_blank" rel="noopener noreferrer" className={linkCls}>
                        See Jobscan&apos;s plan page<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      r.jobscan
                    )}
                    <Refs ids={r.src} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-[#66647c]">
          Jobscan details checked <time dateTime={JOBSCAN_CHECKED}>{JOBSCAN_CHECKED_LABEL}</time> on jobscan.co. The small numbers link to the sources below. Tell us if something
          changed:{" "}
          <a href="mailto:support@launch-cv.com" className="font-semibold text-[#5440e8] hover:underline">
            support@launch-cv.com
          </a>
        </p>
        <p className="mt-4 text-[15px] leading-6 text-[#4a4862]">
          Comparing more than two tools?{" "}
          <Link href="/compare/ats-resume-checkers" className={linkCls}>
            How to choose an ATS resume checker
          </Link>{" "}
          covers the six things worth checking. Or see{" "}
          <Link href="/pricing" className={linkCls}>
            LaunchCV pricing
          </Link>{" "}
          and{" "}
          <Link href="/features/jd-alignment" className={linkCls}>
            how job matching works
          </Link>
          .
        </p>
      </section>

      {/* SOURCES */}
      <section aria-labelledby="sources" className={`${container} pt-16 sm:pt-20 lg:pt-[110px]`}>
        <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lc-reveal">
            <p className={labelCls}>/ Sources</p>
            <h2 id="sources" className="lc-h2 mt-3.5 lg:mt-5">
              Sources <span>(checked Nov 2026).</span>
            </h2>
            <p className="mt-4 text-[16px] leading-[25px] text-[#4a4862]">
              Each line is what we say about Jobscan, followed by the Jobscan page we checked it against on{" "}
              <time dateTime={JOBSCAN_CHECKED}>{JOBSCAN_CHECKED_LABEL}</time>. Products change, so check the linked page before you decide.
            </p>
          </div>
          <div className="lc-card rounded-3xl p-5 sm:p-7">
            <SourceList items={JOBSCAN_SOURCES.map((s) => ({ id: s.id, label: s.page, url: s.url, note: s.claim }))} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${container} ${sectionPad}`}>
        <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lc-reveal">
            <p className={labelCls}>/ Questions</p>
            <h2 className="lc-h2 mt-3.5 lg:mt-5">
              Switching, <span>answered.</span>
            </h2>
            <p className="mt-5 hidden text-[16px] leading-[25px] text-[#4a4862] lg:block">
              Something else?{" "}
              <a href="mailto:support@launch-cv.com" className="font-semibold text-[#5440e8] hover:underline">
                support@launch-cv.com
              </a>
            </p>
          </div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={`${container} pb-4 pt-14 sm:pt-20 lg:pt-[110px]`}>
        <div className="lc-reveal flex flex-col gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:px-16 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[42px] lg:leading-[46px]">Try the free check, then decide.</h2>
            <p className="mt-2 text-[15px] leading-[23px] text-[#e4dfff] lg:mt-3 lg:text-[18px]">
              No account needed.{" "}
              <Link href="/resume-format" className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white">
                Read the resume format guide
              </Link>
            </p>
          </div>
          <CtaLink cta="free_ats_check" location="alternatives_jobscan" href="/free-ats-check" className={`${btn} flex-none bg-white text-[#121226] hover:bg-[#f1eff8]`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
