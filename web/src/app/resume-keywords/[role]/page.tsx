import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, btnSoft, labelCls, Breadcrumbs, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { ArrowCard } from "@/components/site/library/arrow-card";
import { KeywordGroups } from "@/components/site/seo/keyword-groups";
import { HighlightTerms } from "@/components/site/seo/highlight-terms";
import { HonestRules } from "@/components/site/seo/honest-rules";
import { SeoCtaBand } from "@/components/site/seo/seo-cta-band";
import { RoleNextSteps } from "@/components/site/seo/role-next-steps";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { faqPageLd } from "@/lib/faq-ld";
import {
  KEYWORD_ROLES,
  KEYWORDS_UPDATED,
  contextRows,
  getKeywordRole,
  heroKeywords,
  keywordFaqs,
  keywordPageDescription,
  keywordPageTitle,
  keywordStats,
  roleLower,
  roleShort,
} from "@/lib/seo/resume-keywords";
import { withArticle } from "@/lib/article";

type Params = { role: string };

// No `dynamicParams = false`: in this Next build it 404s prerendered pages after
// on-demand revalidation. Unknown slugs hit notFound() below instead.
export function generateStaticParams(): Params[] {
  return KEYWORD_ROLES.map((e) => ({ role: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { role: slug } = await params;
  const e = getKeywordRole(slug);
  if (!e) return {};
  const role = roleLower(e.role);
  return buildMarketingMetadata({
    title: keywordPageTitle(e),
    description: keywordPageDescription(e),
    pathname: `/resume-keywords/${e.slug}`,
    image: DEFAULT_OG_IMAGE,
    keywords: [`${role} resume keywords`, `${role} skills for resume`, `${role} ATS keywords`, `${role} resume skills`],
  });
}

const UPDATED_LABEL = new Date(`${KEYWORDS_UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const sectionCls = `${container} scroll-mt-6 pt-16 lg:pt-[130px]`;
const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";
/** Hero chip colors, in the order the design uses them. */
const HERO_CHIP = [
  "bg-white text-[#121226]",
  "bg-[#111118] text-white",
  "bg-white text-[#121226]",
  "bg-[#ff7a33] text-[#111118]",
  "bg-white text-[#121226]",
  "bg-[#c9c0ff] text-[#111118]",
  "bg-white text-[#121226]",
];
const HERO_TILT = ["-rotate-2", "rotate-1", "", "-rotate-1", "rotate-2", "", "-rotate-2"];

export default async function ResumeKeywordsRolePage({ params }: { params: Promise<Params> }) {
  const { role: slug } = await params;
  const e = getKeywordRole(slug);
  if (!e) notFound();

  const role = roleLower(e.role);
  const short = roleShort(e);
  const { groups, total, inSample } = keywordStats(e);
  const rows = contextRows(e);
  const faqs = keywordFaqs(e);
  const firstName = e.resume.name.split(" ")[0];
  const related = e.related.map(getKeywordRole).filter((x) => !!x);
  const url = absoluteUrl(`/resume-keywords/${e.slug}`);
  const exampleHref = `/resume-examples/${e.slug}`;
  const lead = `The ${total} skills, tools${groups.some((g) => g.id === "credentials") ? " and credentials" : ""} that come up in ${role} job posts, sorted by type, and how to put them in bullets a recruiter believes.`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `${e.role} resume keywords`,
        description: keywordPageDescription(e),
        url,
        ...(e.photo ? { image: absoluteUrl(e.photo.src) } : {}),
        dateModified: KEYWORDS_UPDATED,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: orgRef,
        keywords: e.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Resume keywords", item: absoluteUrl("/resume-keywords") },
          { "@type": "ListItem", position: 3, name: e.role, item: url },
        ],
      },
      faqPageLd(faqs),
    ],
  };


  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML, no reveal animation */}
      <section className={`${container} grid items-stretch gap-[22px] pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-8`}>
        <div className="flex flex-col justify-center lg:pr-6">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/resume-keywords", label: "Resume keywords" },
              { label: e.role },
            ]}
          />
          <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-6 sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[63px]">
            {e.role} resume keywords. <span className="text-[#7c7a94]">The words recruiters search for.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">{lead}</p>
          <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
            <CtaLink cta="free_ats_check" location="resume_keywords" href="/free-ats-check" className={btnPrimary}>
              Check my resume for these
            </CtaLink>
            <Link href={exampleHref} className={`${btnWhite} hidden sm:inline-flex`}>
              See the full example
            </Link>
          </div>
          <p className="mt-3 text-center text-[12px] text-[#66647c] sm:mt-4 sm:text-left sm:text-[14px]">
            By{" "}
            <Link href="/about" className="lc-link hover:text-[#5440e8]">
              {SITE_AUTHOR.name}
            </Link>
            <span className="hidden sm:inline">, {SITE_AUTHOR.role}</span> · Updated <time dateTime={KEYWORDS_UPDATED}>{UPDATED_LABEL}</time>
          </p>
        </div>

        <div aria-hidden="true" className="relative hidden h-[420px] overflow-hidden rounded-[36px] bg-[#5440e8] sm:block lg:h-[560px]">
          <p aria-hidden="true" className="lc-poster absolute left-[30px] top-6 m-0 text-[88px] leading-[86px] text-[#6a58ee] lg:text-[100px] lg:leading-[96px]">
            KEY
            <br />
            WORDS
          </p>
          <ul className="absolute inset-x-8 bottom-9 flex flex-wrap items-center gap-x-3 gap-y-4 lg:bottom-12">
            {heroKeywords(e).map((k, i) => (
              <li
                key={k}
                className={`lc-float rounded-full px-4 py-2.5 text-[15px] font-bold ${HERO_CHIP[i % HERO_CHIP.length]} ${HERO_TILT[i % HERO_TILT.length]} ${i % 3 === 1 ? "lc-drift" : i % 3 === 2 ? "lc-drift-2" : ""}`}
              >
                {k}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE LIST */}
      <section id="list" className={sectionCls}>
        <SectionHead className="max-w-[980px]" label="The list" title="Keywords by type." muted="Use only the ones that are true for you." />
        <div className="mt-[18px] lg:mt-9">
          <KeywordGroups groups={groups} sampleOwner={`${firstName}'s`} />
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-[#4a4862] sm:text-[15px]">
          <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5440e8] text-white">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span>
            {inSample} of {total} appear in {firstName}&apos;s sample resume.{" "}
            <Link href={exampleHref} className={inlineLink}>
              See where
            </Link>
          </span>
        </p>
      </section>

      {/* HOW TO USE THEM */}
      <section id="how" className={sectionCls}>
        <SectionHead
          className="lc-reveal max-w-[980px]"
          label="How to use them"
          title="Put keywords in bullets,"
          muted="not just in a skills list."
          lead="A skills list tells the software you have a skill. A bullet shows a recruiter what you did with it."
        />
        {/* Phones: cards */}
        <ul className="mt-[18px] flex flex-col gap-2 sm:hidden">
          {rows.map((r) => (
            <li key={r.strong} className="lc-card rounded-[20px] p-4">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#66647c]">{r.label}</p>
              <p className="mt-1.5 text-[14px] text-[#66647c] line-through decoration-[#c42b30]">
                <span className="sr-only">Weak: </span>
                {r.weak}
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-[22px]">
                <span className="text-[#0b7a4f]" aria-hidden="true">
                  ✓
                </span>{" "}
                <span className="sr-only">Strong: </span>
                <HighlightTerms text={r.strong} terms={r.used} />
              </p>
            </li>
          ))}
        </ul>
        {/* Tablet and up: table */}
        <div className="lc-card lc-reveal mt-9 hidden rounded-[28px] px-8 pb-3 pt-2 sm:block">
          <table className="w-full border-collapse text-left text-[15px] leading-[23px]">
            <caption className="sr-only">Weak and strong ways to use {role} keywords</caption>
            <thead>
              <tr className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                <th scope="col" className="w-[200px] py-4 pr-5 font-bold">
                  Keyword or skill
                </th>
                <th scope="col" className="w-[34%] py-4 pr-5 font-bold">
                  Weak
                </th>
                <th scope="col" className="py-4 font-bold">
                  Strong
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.strong} className="border-t border-[#e2e0ea] align-top">
                  <th scope="row" className="py-[18px] pr-5 font-bold">
                    {r.label}
                  </th>
                  <td className="py-[18px] pr-5 text-[#66647c] line-through decoration-[#c42b30]">{r.weak}</td>
                  <td className="py-[18px] font-semibold">
                    <span className="text-[#0b7a4f]" aria-hidden="true">
                      ✓
                    </span>{" "}
                    <HighlightTerms text={r.strong} terms={r.used} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 px-1 text-[13px] text-[#66647c]">
          Strong bullets come from {firstName}&apos;s sample resume and our {role} bullet examples. Names and figures are illustrative.
        </p>
      </section>

      {/* HONEST USE (dark) */}
      <section id="honest" className={sectionCls}>
        <HonestRules
          title={
            <>
              Keywords get you found. <span className="!text-[#b3b0c8]">Proof gets you hired.</span>
            </>
          }
          lead={`Mirror the job post's wording for skills you really have. If ${withArticle(role)} post asks for ${e.keywords[0]} and you've used it, say ${e.keywords[0]}, in the post's spelling, and show where.`}
          footer={
            <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-[22px] bg-[#5440e8] p-5 sm:mt-6 sm:flex-row sm:items-center sm:p-7">
              <div>
                <p className="text-[20px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[24px]">Which of these does your resume say?</p>
                <p className="mt-1.5 text-[15px] text-[#e4dfff]">Free ATS score and missing keywords in about 10 seconds.</p>
              </div>
              <CtaLink cta="free_ats_check" location="resume_keywords_mid" href="/free-ats-check" className={`${btnWhite} flex-none`}>
                Check my resume
              </CtaLink>
            </div>
          }
        />
      </section>

      {/* NEXT STEPS */}
      <RoleNextSteps e={e} page="keywords" />

      {/* FAQ */}
      <section id="faq" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title={`${short.length <= 3 ? short : e.role} keywords,`} muted="answered." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className={inlineLink}>
              support@launch-cv.com
            </a>
          </p>
        </div>
        <FaqList faqs={faqs} />
      </section>

      {/* RELATED ROLES */}
      {related.length > 0 ? (
        <section aria-labelledby="related-roles" className={`${container} pt-14 lg:pt-[110px]`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="related-roles" className={labelCls}>
              <span aria-hidden="true">/ </span>Keywords for related roles
            </h2>
            <Link href="/resume-keywords" className={`${btnSoft} !px-5 !py-3 !text-[15px]`}>
              All {KEYWORD_ROLES.length} roles <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-3.5 grid gap-2 sm:grid-cols-3 sm:gap-4 lg:mt-5">
            {related.map((x) => (
              <ArrowCard key={x.slug} href={`/resume-keywords/${x.slug}`} title={`${x.role} keywords`} sub={`${x.keywords.length} keywords`} />
            ))}
          </div>
        </section>
      ) : null}

      <SeoCtaBand
        title="See which of these your resume already says."
        sub="Free ATS check — no sign-up, about 10 seconds."
        location="resume_keywords_bottom"
      />
    </SiteShell>
  );
}
