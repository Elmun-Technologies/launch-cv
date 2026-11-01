import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Breadcrumbs, btn, container, labelCls } from "@/components/site/ui";
import { FaqList } from "@/components/marketing/feature-page";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Best ATS Resume Checkers in 2026 — How to Choose",
  description:
    "A buyer's guide to ATS resume checkers: six criteria that separate a real ATS check from a keyword counter, and what to expect from a free one.",
  pathname: "/compare/ats-resume-checkers",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "best ATS resume checker",
    "ATS resume checker comparison",
    "ATS resume scanner",
    "free ATS checker",
    "how to choose an ATS checker",
  ],
});

const faqs: FaqItem[] = [
  {
    q: "What is the best ATS resume checker?",
    a: "The one that checks how your resume is parsed — layout, sections, dates, contact details — and tells you exactly what to change, not just a keyword percentage. For tailoring, pair it with a tool that compares your resume against the specific job description.",
  },
  {
    q: "Are free ATS resume checkers accurate?",
    a: "They're a good guide when they look at parsing and structure, not only keyword overlap. No checker can reproduce each employer's private ATS settings, so treat any score as a way to find problems rather than a guarantee.",
  },
  {
    q: "What should I look for in an ATS checker?",
    a: "Parsing and formatting checks, a specific and prioritized fix list, keyword analysis for your role, clear data handling, and the option to try it before paying.",
  },
  {
    q: "How does LaunchCV compare?",
    a: "LaunchCV's ATS check is free with no account and returns a 0–100 score with prioritized fixes. Matching against a specific job description, bullet rewrites, cover letters and interview prep are in the paid plans.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Best ATS Resume Checkers in 2026 — How to Choose",
      url: absoluteUrl("/compare/ats-resume-checkers"),
      description: "Six criteria for choosing an ATS resume checker.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Best ATS resume checkers", item: absoluteUrl("/compare/ats-resume-checkers") },
      ],
    },
    faqPageLd(faqs),
  ],
};

const criteria = [
  {
    t: "It checks parsing, not just keywords",
    d: "Most rejections from software come from layout: tables, columns, text boxes and contact details in headers. A checker that only counts keyword overlap misses all of them.",
  },
  {
    t: "It can compare against a specific job",
    d: "A resume is a fit for one role, not good or bad in general. Look for a way to compare against the posting you're applying to.",
  },
  {
    t: "Fixes are specific and ranked",
    d: "“Improve formatting” doesn't help. You want “move your email out of the header”, with the highest-impact fixes first.",
  },
  {
    t: "Keyword advice you can back up",
    d: "Good tools show what's missing and help you add what's true — not stuff terms you can't talk about in an interview.",
  },
  {
    t: "Clear data handling",
    d: "Your resume is personal data. Check what's stored, for how long, and whether you can try it without an account.",
  },
  {
    t: "You can try it first",
    d: "A free check lets you judge whether the advice is useful before you pay for anything.",
  },
];

const rows: { l: string; a: boolean | string; b: boolean | string }[] = [
  { l: "Checks layout and parsing problems", a: true, b: false },
  { l: "Score with prioritized fixes", a: true, b: "Score only" },
  { l: "Free, no account", a: true, b: "Varies" },
  { l: "Compare against a specific job post", a: "Paid plans", b: "Keyword % only" },
  { l: "Rewrites for weak bullets", a: "Paid plans", b: false },
  { l: "Cover letter and interview prep", a: "Paid plans", b: false },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true)
    return (
      <>
        <span aria-hidden="true" className="font-extrabold text-[#0b7a4f]">
          ✓
        </span>
        <span className="sr-only">Yes</span>
      </>
    );
  if (v === false)
    return (
      <>
        <span aria-hidden="true" className="text-[#8f8ca6]">
          —
        </span>
        <span className="sr-only">No</span>
      </>
    );
  return <span className="text-[13px] text-[#4a4862] sm:text-[14px]">{v}</span>;
}

const sectionPad = "pt-16 sm:pt-24 lg:pt-[130px]";

export default function CompareAtsCheckersPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} pt-4 lg:pt-8`}>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center lg:pr-6">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Best ATS resume checkers" }]} />
            <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:mt-[22px] lg:text-[58px] lg:leading-[61px]">
              How to choose an ATS resume checker. <span className="text-[#7c7a94]">Six things that matter.</span>
            </h1>
            <p className="mt-3.5 text-[16px] leading-[25px] text-[#4a4862] sm:text-[18px] sm:leading-7 lg:mt-5">
              Every resume tool says it beats the ATS. Many only count keywords. Here&apos;s what separates a useful check from a number.
            </p>
          </div>

          {/* Poster stage — illustrative, desktop only (as in the mobile mockup). */}
          <div className="relative hidden h-[560px] overflow-hidden rounded-[36px] bg-[#111118] lg:block">
            <p aria-hidden="true" className="lc-poster absolute left-8 top-6 m-0 text-[120px] leading-[110px] text-[#2a2840]">
              VS
            </p>
            <div className="lc-float lc-drift absolute left-10 top-[130px] w-[250px] xl:top-[150px] rounded-[22px] bg-white p-[22px] text-[#121226]">
              <p className="flex justify-between text-[13px] text-[#66647c]">
                Full ATS check <span className="text-[11px] font-semibold">Example</span>
              </p>
              <ul className="mt-3 flex flex-col gap-2 text-[14px] font-semibold">
                {["Layout & parsing", "Contact details found", "Ranked fixes", "Free, no account"].map((x) => (
                  <li key={x}>
                    <span aria-hidden="true" className="text-[#0b7a4f]">
                      ✓
                    </span>{" "}
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lc-float lc-drift-2 absolute right-6 top-[320px] w-[250px] xl:right-10 xl:top-[230px] rounded-[22px] border border-[#2f2d48] bg-[#1d1c2e] p-[22px] text-white">
              <p className="flex justify-between text-[13px] text-[#9a97b3]">
                Keyword counter <span className="text-[11px] font-semibold text-[#c9c0ff]">Example</span>
              </p>
              <p className="mt-2 text-[44px] font-bold leading-[48px]">63%</p>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#b3b0c8]">“Add more keywords.” No word on the two columns that hid your email.</p>
            </div>
            <span aria-hidden="true" className="lc-poster absolute bottom-6 left-10 -rotate-[4deg] xl:bottom-10 rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118]">
              PICK THE LEFT ONE
            </span>
          </div>
        </div>
      </section>

      {/* SIX CRITERIA */}
      <section className={`${container} pt-6 sm:pt-24 lg:pt-[130px]`}>
        <div className="lc-reveal hidden max-w-[980px] sm:block">
          <p className={labelCls}>/ Six criteria</p>
          <h2 className="lc-h2 mt-5">What a good checker does.</h2>
        </div>
        <h2 className="sr-only sm:hidden">Six criteria</h2>
        <ol className="grid gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {criteria.map((c, i) => (
            <li key={c.t} className="lc-card lc-rise lc-reveal rounded-3xl p-[18px] sm:p-[26px]">
              <p className="lc-mono text-[12px] text-[#5440e8] sm:text-[13px]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-[17px] font-extrabold sm:mt-8 sm:text-[21px] sm:leading-[27px] sm:tracking-[-0.015em]">{c.t}</h3>
              <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862] sm:mt-2 sm:text-[15px] sm:leading-[23px]">{c.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* SIDE BY SIDE */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal max-w-[980px]">
          <p className={labelCls}>/ Side by side</p>
          <h2 className="lc-h2 mt-3.5 lg:mt-5">
            A full check vs. <span>a keyword counter.</span>
          </h2>
        </div>
        <div className="lc-card lc-reveal mt-4 overflow-x-auto rounded-3xl px-4 pb-2 pt-1 sm:mt-10 sm:px-7 sm:pb-3 sm:pt-2">
          <table className="w-full border-collapse text-[13px] sm:text-[15px]">
            <caption className="sr-only">LaunchCV compared with keyword-match scanners</caption>
            <colgroup>
              <col className="w-[46%] sm:w-1/2" />
              <col className="w-[27%] sm:w-1/4" />
              <col className="w-[27%] sm:w-1/4" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="py-3 sm:py-[18px]">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="px-1 py-3 text-center font-bold text-[#5440e8] sm:py-[18px]">
                  LaunchCV
                </th>
                <th scope="col" className="px-1 py-3 text-center font-bold text-[#66647c] sm:py-[18px]">
                  Keyword-match scanners
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.l} className="border-t border-[#e2e0ea] transition-colors hover:bg-[#f7f6fb]">
                  <th scope="row" className="py-3 pr-2 text-left font-semibold sm:py-4">
                    {r.l}
                  </th>
                  <td className="px-1 py-3 text-center sm:py-4">
                    <Cell v={r.a} />
                  </td>
                  <td className="px-1 py-3 text-center sm:py-4">
                    <Cell v={r.b} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] leading-5 text-[#66647c]">
          &ldquo;Keyword-match scanners&rdquo; describes the common category of tools that return a match percentage. Individual products vary; check
          each one&apos;s current features.
        </p>
      </section>

      {/* FAQ */}
      <section className={`${container} ${sectionPad}`}>
        <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lc-reveal">
            <p className={labelCls}>/ Questions</p>
            <h2 className="lc-h2 mt-3.5 lg:mt-5">
              ATS checkers, <span>answered.</span>
            </h2>
            <p className="mt-5 hidden text-[16px] leading-[25px] text-[#4a4862] lg:block">
              Something else?{" "}
              <a href="mailto:support@launch-cv.com" className="font-semibold text-[#5440e8] hover:underline">
                support@launch-cv.com
              </a>
            </p>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={`${container} pb-4 pt-14 sm:pt-20 lg:pt-[110px]`}>
        <div className="lc-reveal flex flex-col gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:px-16 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[42px] lg:leading-[46px]">Try a full check — it&apos;s free.</h2>
            <p className="mt-2 text-[15px] leading-[23px] text-[#e4dfff] lg:mt-3 lg:text-[18px]">
              No account. Score and fixes in about 10 seconds.{" "}
              <Link href="/blog/what-is-an-ats-score" className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white">
                What the score means
              </Link>
            </p>
          </div>
          <CtaLink cta="free_ats_check" location="compare_ats" href="/free-ats-check" className={`${btn} flex-none bg-white text-[#121226] hover:bg-[#f1eff8]`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
