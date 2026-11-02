import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, Breadcrumbs, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { NumberedCards } from "@/components/site/seo/numbered-cards";
import { SeoCtaBand } from "@/components/site/seo/seo-cta-band";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { faqPageLd } from "@/lib/faq-ld";
import { ATS_CHECKED_LABEL, ATS_INDEX_FAQS, ATS_UPDATED, ATS_VENDORS, GENERAL_ATS_TIPS } from "@/lib/seo/ats-vendors";

export const metadata = buildMarketingMetadata({
  title: "ATS Resume Guides: Workday, Greenhouse, iCIMS & More",
  description:
    "How Workday, Greenhouse, iCIMS, Taleo, Lever and SuccessFactors handle your resume, from their own documentation, with tips for applying through each one.",
  pathname: "/ats",
  image: DEFAULT_OG_IMAGE,
  keywords: ["ATS resume guide", "applicant tracking system resume", "Workday resume tips", "Greenhouse resume", "Taleo resume", "iCIMS resume"],
});

const url = absoluteUrl("/ats");
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      name: "ATS resume guides",
      description: "Guides to how six applicant tracking systems handle resumes, based on each vendor's own documentation.",
      url,
      dateModified: ATS_UPDATED,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: orgRef,
      inLanguage: "en-US",
      hasPart: ATS_VENDORS.map((v) => ({
        "@type": "Article",
        headline: `${v.name} resume tips`,
        url: absoluteUrl(`/ats/${v.slug}`),
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "ATS guides", item: url },
      ],
    },
    faqPageLd(ATS_INDEX_FAQS),
  ],
};

const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";

export default function AtsIndexPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <section className={`${container} grid items-stretch gap-[22px] pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-8`}>
        <div className="flex flex-col justify-center lg:pr-6">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "ATS guides" }]} />
          <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-6 sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[63px]">
            ATS resume guides. <span className="text-[#7c7a94]">From the vendors&apos; own docs.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">
            What {ATS_VENDORS.length} applicant tracking systems say about resume uploads, parsing and autofill, with practical tips for applying through each one.
            Every vendor claim links to its source.
          </p>
          <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
            <a href="#systems" className={btnPrimary}>
              Pick a system
            </a>
            <CtaLink cta="free_ats_check" location="ats_index" href="/free-ats-check" className={`${btnWhite} max-sm:hidden`}>
              Check my resume — free
            </CtaLink>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-[#66647c] sm:mt-4">
            LaunchCV isn&apos;t affiliated with any of these vendors. Sources checked {ATS_CHECKED_LABEL}.
          </p>
        </div>
        <div aria-hidden="true" className="relative hidden h-[420px] overflow-hidden rounded-[36px] bg-[#111118] sm:block lg:h-[480px]">
          <p aria-hidden="true" className="lc-poster absolute left-[30px] top-6 m-0 text-[92px] leading-[92px] text-[#2a2840]">ATS</p>
          <ul className="absolute inset-x-8 bottom-9 grid grid-cols-2 gap-2.5 lg:bottom-12">
            {ATS_VENDORS.map((v, i) => (
              <li
                key={v.slug}
                className={`lc-float flex items-center justify-between rounded-[18px] border border-[#2f2d48] bg-[#1d1c2e] px-4 py-3.5 text-[15px] font-bold text-[#e9e7f3] ${i % 2 ? "lc-drift-2" : "lc-drift"}`}
              >
                {v.name}
                <span className="lc-mono text-[11px] font-medium text-[#c9c0ff]">{v.poster}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SYSTEMS */}
      <section id="systems" className={`${container} scroll-mt-6 pt-16 lg:pt-[130px]`}>
        <SectionHead className="max-w-[980px]" label="The guides" title={`${ATS_VENDORS.length} systems.`} muted="Pick the one on your application page." />
        <ul className="mt-[18px] grid gap-2 sm:grid-cols-2 sm:gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-4">
          {ATS_VENDORS.map((v) => (
            <li key={v.slug}>
              <Link href={`/ats/${v.slug}`} className="lc-card lc-rise group flex h-full flex-col rounded-[22px] p-5 text-[#121226] sm:rounded-3xl sm:p-[26px]">
                <span className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">
                    {v.facts.length} sourced points · {v.sources.length} sources
                  </span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#111118] text-white transition-colors group-hover:bg-[#5440e8] sm:h-10 sm:w-10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                </span>
                <h3 className="mt-5 text-[21px] font-extrabold leading-[27px] tracking-[-0.01em] group-hover:text-[#5440e8] sm:mt-7 sm:text-[24px]">
                  {v.fullName}
                  <span className="sr-only"> resume tips</span>
                </h3>
                <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">{v.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* GENERAL */}
      <section id="general" className={`${container} scroll-mt-6 pt-16 lg:pt-[130px]`}>
        <SectionHead
          className="lc-reveal max-w-[980px]"
          label="Any system"
          title="Four fixes that help"
          muted="almost everywhere."
          lead="General guidance for resume parsers in most applicant tracking systems. Check the vendor guides for what each one documents."
        />
        <NumberedCards items={GENERAL_ATS_TIPS} className="mt-[18px] lg:mt-9" />
      </section>

      {/* HOW WE RESEARCH */}
      <section className={`${container} pt-16 lg:pt-[130px]`}>
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 py-7 text-white sm:p-10 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:rounded-[36px] lg:p-16">
          <h2 className="lc-h2 text-white">
            How we research these. <span className="!text-[#b3b0c8]">No guesses.</span>
          </h2>
          <ul className="mt-5 flex flex-col gap-4 text-[15px] leading-6 text-[#d6d3e6] sm:text-[16px] lg:mt-0">
            <li>
              <b className="text-white">Vendor sources only.</b> Every point about a system comes from that vendor&apos;s own help center, documentation or
              newsroom, and links to the page.
            </li>
            <li>
              <b className="text-white">Dated.</b> Each source shows the date we last checked it. These guides were last checked in {ATS_CHECKED_LABEL}.
            </li>
            <li>
              <b className="text-white">General tips are labeled.</b> Advice we couldn&apos;t confirm for a specific vendor is written as general guidance, not as a
              fact about that system.
            </li>
            <li>
              <b className="text-white">Employers decide a lot.</b> Each company configures its own system, so the fields and file types you see can differ.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${container} grid scroll-mt-6 items-start gap-[18px] pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pt-[130px]`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title="Applicant tracking systems," muted="answered." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Need the right words for your job?{" "}
            <Link href="/resume-keywords" className={inlineLink}>
              Resume keywords by job
            </Link>
          </p>
        </div>
        <FaqList faqs={ATS_INDEX_FAQS} />
      </section>

      <SeoCtaBand title="See what a parser reads in your resume." sub="Free check · no sign-up · your file isn't stored." location="ats_index_bottom" />
    </SiteShell>
  );
}
