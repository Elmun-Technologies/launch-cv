import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, labelCls, Breadcrumbs, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { AtsFactGrid, AtsSourceList } from "@/components/site/seo/ats-sources";
import { CheckList } from "@/components/site/seo/check-list";
import { FormFillArt } from "@/components/site/seo/form-fill-art";
import { NumberedCards } from "@/components/site/seo/numbered-cards";
import { SeoCtaBand } from "@/components/site/seo/seo-cta-band";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { faqPageLd } from "@/lib/faq-ld";
import { getResumeExample } from "@/lib/resume-examples";
import { ATS_CHECKED_LABEL, ATS_UPDATED, ATS_VENDORS, GENERAL_ATS_TIPS, atsPageTitle, getAtsVendor } from "@/lib/seo/ats-vendors";

type Params = { vendor: string };

// No `dynamicParams = false`: in this Next build it 404s prerendered pages after
// on-demand revalidation. Unknown slugs hit notFound() below instead.
export function generateStaticParams(): Params[] {
  return ATS_VENDORS.map((v) => ({ vendor: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { vendor } = await params;
  const v = getAtsVendor(vendor);
  if (!v) return {};
  const n = v.name.toLowerCase();
  return buildMarketingMetadata({
    title: atsPageTitle(v),
    description: v.metaDescription,
    pathname: `/ats/${v.slug}`,
    image: DEFAULT_OG_IMAGE,
    keywords: [`${n} resume tips`, `${n} resume format`, `${n} resume parsing`, `${n} application`, `${n} ats`],
  });
}

const UPDATED_LABEL = new Date(`${ATS_UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const sectionCls = `${container} scroll-mt-6 pt-16 lg:pt-[130px]`;
const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";

export default async function AtsVendorPage({ params }: { params: Promise<Params> }) {
  const { vendor } = await params;
  const v = getAtsVendor(vendor);
  if (!v) notFound();
  const example = getResumeExample(v.heroExample);
  const others = ATS_VENDORS.filter((x) => x.slug !== v.slug);
  const url = absoluteUrl(`/ats/${v.slug}`);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: `${v.name} resume tips`,
        description: v.metaDescription,
        url,
        image: DEFAULT_OG_IMAGE,
        dateModified: ATS_UPDATED,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: orgRef,
        about: { "@type": "SoftwareApplication", name: v.fullName, applicationCategory: "BusinessApplication" },
        citation: v.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "ATS guides", item: absoluteUrl("/ats") },
          { "@type": "ListItem", position: 3, name: v.name, item: url },
        ],
      },
      faqPageLd(v.faqs),
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} grid items-stretch gap-[22px] pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-8`}>
        <div className="flex flex-col justify-center lg:pr-6">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/ats", label: "ATS guides" },
              { label: v.name },
            ]}
          />
          <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-6 sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[63px]">
            {v.name} resume tips. <span className="text-[#7c7a94]">{v.tagline}</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">{v.intro}</p>
          <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
            <CtaLink cta="free_ats_check" location={`ats_${v.slug}`} href="/free-ats-check" className={btnPrimary}>
              Check my resume — free
            </CtaLink>
          </div>
          <p className="mt-3 text-[13px] leading-5 text-[#66647c] sm:mt-4">
            LaunchCV isn&apos;t affiliated with {v.fullName}. Behavior varies with each employer&apos;s settings.{" "}
            <span className="whitespace-nowrap">
              Updated <time dateTime={ATS_UPDATED}>{UPDATED_LABEL}</time> ·{" "}
              <a href="#sources" className={inlineLink}>
                Sources
              </a>
            </span>
          </p>
        </div>
        {example ? <FormFillArt example={example} poster={v.poster} /> : null}
      </section>

      {/* WHAT THE DOCS SAY */}
      <section id="facts" className={sectionCls}>
        <SectionHead
          className="lc-reveal max-w-[980px]"
          label="What we checked"
          title={`What the ${v.fullName} docs say.`}
          muted="Each point links to its source."
        />
        <div className="mt-[18px] lg:mt-9">
          <AtsFactGrid slug={v.slug} facts={v.facts} sources={v.sources} />
        </div>
      </section>

      {/* WHAT TRIPS IT UP (general) */}
      <section id="pitfalls" className={sectionCls}>
        <SectionHead
          className="lc-reveal max-w-[980px]"
          label="What trips it up"
          title="Four things to fix"
          muted="before you upload."
          lead="General guidance for resume parsers in most applicant tracking systems, not specific to one vendor."
        />
        <NumberedCards items={GENERAL_ATS_TIPS} className="mt-[18px] lg:mt-9" />
      </section>

      {/* APPLYING THROUGH (dark) */}
      <section id="tips" className={sectionCls}>
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-5 pt-7 text-white sm:p-10 lg:rounded-[36px] lg:p-16">
          <p className={`${labelCls} !text-[#c9c0ff]`}>/ Applying through {v.name}</p>
          <h2 className="lc-h2 mt-5 text-white">Tips for {v.name} applications.</h2>
          <ol className="mt-4 grid sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {v.tips.map((t, i) => (
              <li key={t.t} className="border-t border-[#2f2d48] py-[13px] sm:rounded-[22px] sm:border sm:bg-[#1d1c2e] sm:p-6">
                <p className="lc-mono hidden text-[12px] text-[#c9c0ff] sm:block" aria-hidden="true">
                  0{i + 1}
                </p>
                <h3 className="text-[16px] font-bold sm:mt-6 sm:text-[18px]">{t.t}</h3>
                <p className="mt-[3px] text-[13px] leading-5 text-[#b3b0c8] sm:mt-2 sm:text-[14px] sm:leading-[22px]">{t.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CHECKLIST */}
      <section id="checklist" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-12`}>
        <SectionHead
          className="lc-reveal"
          label="Checklist"
          title="Before you hit Upload."
          lead={
            <>
              Not sure your file passes?{" "}
              <Link href="/free-ats-check" className={inlineLink}>
                Run the free ATS check
              </Link>{" "}
              or look up{" "}
              <Link href="/resume-keywords" className={inlineLink}>
                keywords for your job
              </Link>
              .
            </>
          }
        />
        <CheckList items={v.checklist} label={`${v.name} upload checklist`} />
      </section>

      {/* OTHER SYSTEMS */}
      <section aria-labelledby="other-systems" className={`${container} pt-14 lg:pt-[110px]`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="other-systems" className={labelCls}>
            <span aria-hidden="true">/ </span>Other systems
          </h2>
          <Link href="/ats" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#5440e8] hover:underline">
            All ATS guides <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
        <ul className="mt-3.5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:mt-[18px] lg:grid-cols-5">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/ats/${o.slug}`}
                className="lc-card lc-rise group flex min-h-[60px] items-center justify-between gap-3 rounded-[20px] px-5 py-4 text-[16px] font-extrabold text-[#121226] sm:rounded-3xl sm:p-[22px] sm:text-[17px]"
              >
                <span className="group-hover:text-[#5440e8]">
                  {o.name}
                  <span className="sr-only"> resume tips</span>
                </span>
                <span aria-hidden="true" className="text-[#5440e8] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title={`${v.name},`} muted="answered." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className={inlineLink}>
              support@launch-cv.com
            </a>
          </p>
        </div>
        <FaqList faqs={v.faqs} />
      </section>

      {/* SOURCES */}
      <section id="sources" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <SectionHead
          label={`Sources (checked ${ATS_CHECKED_LABEL})`}
          title="Where this comes from."
          lead={`Only ${v.fullName}'s own public help pages, documentation and announcements. Each employer configures its own system, so what you see may differ.`}
        />
        <AtsSourceList slug={v.slug} sources={v.sources} />
      </section>

      <SeoCtaBand title="See what a parser reads in your resume." sub="Free check · no sign-up · your file isn't stored." location={`ats_${v.slug}_bottom`} />
    </SiteShell>
  );
}
