import type { ReactNode } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Breadcrumbs, btn, container, labelCls } from "@/components/site/ui";
import { ContentToc, ContentTocMobile } from "@/components/site/content/content-toc";
import { FaqList, KeyFactsCard } from "@/components/site/content/key-facts";
import { initials } from "@/components/site/content/blog-cards";
import { SeoMarkdown } from "@/components/site/seo/seo-markdown";
import { SourceList, type SourceItem } from "@/components/site/seo/source-list";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { getPostBySlug } from "@/lib/blog-posts";

/**
 * Shared frame for the long-form pillar guides (/how-to-write-a-resume,
 * /resume-length, /cover-letter-template), built on the same layout as
 * /resume-format: hero with byline, optional overview band, sticky table of
 * contents, Markdown sections with page-supplied figures, sources, FAQ, a
 * sidebar CTA, "Keep going" links and a closing CTA band.
 */

export type GuideSection = {
  id: string;
  title: string;
  /** Markdown paragraphs and lists, rendered in order. */
  body: string[];
  /** Key of a figure the page supplies, rendered after the body. */
  figure?: string;
  /** More Markdown after the figure. */
  after?: string[];
};

export type GuideCta = { cta: string; location: string; href: string; label: string };

type Props = {
  path: string;
  crumb: string;
  /** H1, first half (ink). */
  title: ReactNode;
  /** H1, second half (grey). */
  muted: ReactNode;
  lead: ReactNode;
  updated: string;
  words: number;
  /** Overview band under the hero (above the fold: no lc-reveal inside). */
  intro?: { heading: string; node: ReactNode };
  sections: GuideSection[];
  figures?: Record<string, ReactNode>;
  keyFacts?: { afterSection: string; title: string; lead: string; facts: string[] };
  sources?: SourceItem[];
  faqs: FaqItem[];
  aside: { label: string; title: string; sub: string; cta: GuideCta; card?: { title: string; sub: string; href: string; link: string } };
  related: { href: string; t: string; d: string }[];
  /** Blog post slugs (lib/blog-posts.ts) to read next. */
  reading?: string[];
  finalCta: { title: string; sub: string } & GuideCta;
};

export const guideH2Cls =
  "scroll-mt-6 text-[26px] font-extrabold leading-[31px] tracking-[-0.02em] text-[#121226] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.025em]";
export const guideLinkCls =
  "font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]";
const articleCls = "text-[17px] leading-[28px] text-[#24223a] sm:text-[18px] sm:leading-[30px] [overflow-wrap:anywhere] [&_li>p]:mt-0";

export const guideDateLabel = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Word count of the readable copy (sections, FAQ and any extra strings such as key facts). */
export function guideWordCount(sections: GuideSection[], faqs: FaqItem[], extra: string[] = []): number {
  const text = [...sections.flatMap((s) => [s.title, ...s.body, ...(s.after ?? [])]), ...faqs.flatMap((f) => [f.q, f.a]), ...extra].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Article + BreadcrumbList + FAQPage graph, same shape as /resume-format. */
export function guideLd(input: {
  path: string;
  headline: string;
  description: string;
  crumb: string;
  published: string;
  updated: string;
  words: number;
  section: string;
  faqs: FaqItem[];
  sources?: SourceItem[];
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: input.headline,
        description: input.description,
        url,
        datePublished: input.published,
        dateModified: input.updated,
        image: DEFAULT_OG_IMAGE,
        author: {
          "@type": "Person",
          name: SITE_AUTHOR.name,
          url: SITE_AUTHOR.url,
          image: SITE_AUTHOR.avatar,
          jobTitle: SITE_AUTHOR.role,
          description: SITE_AUTHOR.bio,
        },
        publisher: orgRef,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en-US",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        articleSection: input.section,
        wordCount: input.words,
        ...(input.sources && input.sources.length > 0 ? { citation: input.sources.map((s) => s.url) } : {}),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-description", ".lc-key-facts-lead"] },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: input.crumb, item: url },
        ],
      },
      faqPageLd(input.faqs),
    ],
  };
}

export function GuidePage({ ld, ...p }: Props & { ld: Record<string, unknown> }) {
  const sourceIds = (p.sources ?? []).map((s) => s.id);
  const hasSources = sourceIds.length > 0;
  const minutes = Math.max(1, Math.round(p.words / 230));
  const toc = [
    ...p.sections.map((s) => ({ id: s.id, text: s.title })),
    ...(hasSources ? [{ id: "sources", text: "Sources" }] : []),
    { id: "faq", text: "FAQ" },
  ];
  const reading = (p.reading ?? []).map((slug) => getPostBySlug(slug)).filter((x) => !!x);

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <header className={`${container} pt-4 lg:pt-10`}>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: p.crumb }]} />
        <div className="mt-3.5 grid gap-4 lg:mt-[22px] lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
          <h1 className="text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:text-[64px] lg:leading-[66px]">
            {p.title} <span className="text-[#7c7a94]">{p.muted}</span>
          </h1>
          <div>
            <p className="speakable-description text-[16px] leading-[26px] text-[#4a4862] sm:text-[17px] sm:leading-[27px]">{p.lead}</p>
            <p className="mt-3.5 flex items-center gap-2.5 text-[13px] text-[#66647c] sm:text-[14px]">
              <span aria-hidden="true" className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#e4dfff] text-[12px] font-extrabold text-[#3a2bb8]">
                {initials(SITE_AUTHOR.name)}
              </span>
              <span>
                By{" "}
                <Link href="/about" rel="author" className="lc-link font-semibold text-[#121226] hover:text-[#5440e8]">
                  {SITE_AUTHOR.name}
                </Link>{" "}
                · Updated <time dateTime={p.updated}>{guideDateLabel(p.updated)}</time> · {minutes} min read
              </span>
            </p>
          </div>
        </div>
      </header>

      {p.intro ? (
        <section aria-labelledby="guide-overview" className={`${container} pt-8 lg:pt-12`}>
          <h2 id="guide-overview" className="sr-only">
            {p.intro.heading}
          </h2>
          {p.intro.node}
        </section>
      ) : null}

      {/* BODY */}
      <div
        className={`${container} grid items-start gap-y-8 pt-10 sm:pt-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-12 lg:pt-[72px] xl:grid-cols-[240px_minmax(0,1fr)_280px] xl:gap-x-14`}
      >
        <div className="hidden lg:sticky lg:top-6 lg:row-span-2 lg:block lg:self-start">
          <ContentToc entries={toc} />
        </div>

        <div className="min-w-0 max-w-[720px]">
          <div className="mb-7 lg:hidden">
            <ContentTocMobile entries={toc} />
          </div>

          <article className={articleCls}>
            {p.sections.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id} className={i === 0 ? "" : "mt-12 sm:mt-[52px]"}>
                <h2 id={s.id} className={guideH2Cls}>
                  {s.title}
                </h2>
                {s.body.map((md, j) => (
                  <SeoMarkdown key={j} sourceIds={sourceIds}>
                    {md}
                  </SeoMarkdown>
                ))}
                {p.keyFacts?.afterSection === s.id ? (
                  <div className="mt-6">
                    <KeyFactsCard title={p.keyFacts.title} lead={p.keyFacts.lead} facts={p.keyFacts.facts} />
                  </div>
                ) : null}
                {s.figure ? p.figures?.[s.figure] : null}
                {s.after?.map((md, j) => (
                  <SeoMarkdown key={`a${j}`} sourceIds={sourceIds}>
                    {md}
                  </SeoMarkdown>
                ))}
              </section>
            ))}

            {hasSources ? (
              <section aria-labelledby="sources" className="mt-12 border-t border-[#d9d4f2] pt-8 sm:mt-[52px]">
                <h2 id="sources" className={guideH2Cls}>
                  Sources
                </h2>
                <p className="mt-3 text-[15px] leading-6 text-[#4a4862]">
                  The rules quoted on this page come from these. Links checked <time dateTime={p.updated}>{guideDateLabel(p.updated)}</time>.
                </p>
                <div className="lc-card mt-5 rounded-3xl p-5 sm:p-7">
                  <SourceList items={p.sources ?? []} />
                </div>
              </section>
            ) : null}
          </article>

          <section id="faq" aria-labelledby="faq-title" className="mt-14 scroll-mt-6">
            <h2 id="faq-title" className={guideH2Cls}>
              Frequently asked questions
            </h2>
            <div className="mt-5">
              <FaqList items={p.faqs} />
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside
          aria-label={p.aside.label}
          className="flex min-w-0 max-w-[720px] flex-col gap-3 lg:col-start-2 xl:sticky xl:top-6 xl:col-start-3 xl:row-start-1 xl:self-start"
        >
          <div className="rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-6">
            <p className="text-[21px] font-extrabold leading-[26px] tracking-[-0.02em]">{p.aside.title}</p>
            <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">{p.aside.sub}</p>
            <CtaLink
              cta={p.aside.cta.cta}
              location={p.aside.cta.location}
              href={p.aside.cta.href}
              className="lc-btn-lift mt-4 inline-flex w-full items-center justify-center rounded-full bg-white p-3.5 text-[15px] font-semibold text-[#121226] hover:bg-[#f1eff8] sm:w-auto xl:w-full"
            >
              {p.aside.cta.label}
            </CtaLink>
          </div>
          {p.aside.card ? (
            <div className="lc-card rounded-[24px] p-5">
              <p className="text-[15px] font-extrabold">{p.aside.card.title}</p>
              <p className="mt-1 text-[13px] leading-5 text-[#4a4862]">{p.aside.card.sub}</p>
              <Link href={p.aside.card.href} className="mt-2.5 inline-flex min-h-[44px] items-center text-[14px] font-bold text-[#5440e8] hover:text-[#4430d6]">
                <span className="lc-link">{p.aside.card.link} →</span>
              </Link>
            </div>
          ) : null}
        </aside>
      </div>

      {/* KEEP GOING */}
      <section aria-labelledby="keep-going" className={`${container} pt-16 lg:pt-[110px]`}>
        <h2 id="keep-going" className={labelCls}>
          / Keep going
        </h2>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {p.related.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="lc-card group flex h-full flex-col rounded-[24px] p-5 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(36,24,120,0.45)] sm:p-6">
                <span className="text-[17px] font-extrabold group-hover:text-[#5440e8]">{r.t} →</span>
                <span className="mt-1.5 text-[14px] leading-[21px] text-[#4a4862]">{r.d}</span>
              </Link>
            </li>
          ))}
        </ul>

        {reading.length > 0 ? (
          <>
            <h2 className={`${labelCls} mt-12 lg:mt-16`}>/ Read next</h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4">
              {reading.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col rounded-[24px] bg-white p-5 transition-colors hover:bg-[#f7f6fb] sm:p-6">
                    <span className="text-[12px] font-bold tracking-[0.08em] text-[#66647c]">{post.category.toUpperCase()}</span>
                    <span className="mt-1.5 text-[17px] font-extrabold leading-snug group-hover:text-[#5440e8]">{post.title}</span>
                    <span className="mt-1.5 line-clamp-2 text-[14px] leading-[21px] text-[#4a4862]">{post.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      {/* FINAL CTA */}
      <section className={`${container} pb-4 pt-14 sm:pt-20 lg:pt-[110px]`}>
        <div className="flex flex-col gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:px-16 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[42px] lg:leading-[46px]">{p.finalCta.title}</h2>
            <p className="mt-2 text-[15px] leading-[23px] text-[#e4dfff] lg:mt-3 lg:text-[18px]">{p.finalCta.sub}</p>
          </div>
          <CtaLink cta={p.finalCta.cta} location={p.finalCta.location} href={p.finalCta.href} className={`${btn} flex-none bg-white text-[#121226] hover:bg-[#f1eff8]`}>
            {p.finalCta.label}
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
