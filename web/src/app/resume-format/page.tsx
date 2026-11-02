import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Breadcrumbs, btn, container, labelCls } from "@/components/site/ui";
import { ContentToc, ContentTocMobile } from "@/components/site/content/content-toc";
import { FaqList, KeyFactsCard } from "@/components/site/content/key-facts";
import { initials } from "@/components/site/content/blog-cards";
import { FormatSketch } from "@/components/site/seo/format-sketch";
import { SeoMarkdown } from "@/components/site/seo/seo-markdown";
import { SourceList } from "@/components/site/seo/source-list";
import { ResumePreview } from "@/components/resume-preview";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { faqPageLd } from "@/lib/faq-ld";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { getPostBySlug } from "@/lib/blog-posts";
import { getResumeExample } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { TEMPLATE_SPECS, type TemplateStyle } from "@/lib/resume-templates";
import {
  FORMAT_KINDS,
  FORMAT_SECTIONS,
  FORMAT_TABLE,
  QUICK_RULES,
  RESUME_FORMAT_FAQS,
  RESUME_FORMAT_PUBLISHED,
  RESUME_FORMAT_READING,
  RESUME_FORMAT_SOURCES,
  RESUME_FORMAT_UPDATED,
  type FormatSection,
} from "@/lib/seo/resume-format";

const PATH = "/resume-format";
const TITLE = fitTitle("Resume Format 2026: Chronological, Hybrid or Functional?", "Resume Format Guide (2026)");
const HEADLINE = "Resume format: what to use in 2026, and why";
const DESCRIPTION =
  "Which resume format to use in 2026: chronological vs hybrid vs functional, section order, length, fonts, margins, and PDF vs Word for ATS, with real examples.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESUME_FORMAT_PUBLISHED, modifiedTime: RESUME_FORMAT_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "resume format",
    "best resume format 2026",
    "chronological resume",
    "hybrid resume",
    "functional resume",
    "resume format for ATS",
    "resume PDF or Word",
    "resume font size and margins",
  ],
});

const SOURCE_IDS = RESUME_FORMAT_SOURCES.map((s) => s.id);
const dateLabel = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/** Real templates rendered with written examples (same pairs as the homepage). */
const TEMPLATE_EXAMPLES: { template: TemplateStyle; example: string }[] = [
  { template: "classic", example: "software-engineer" },
  { template: "modern", example: "product-manager" },
  { template: "minimal", example: "marketing-manager" },
  { template: "executive", example: "financial-analyst" },
];

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/resume-templates", t: "Resume templates", d: "Four one-column templates, free with a PDF export." },
  { href: "/resume-examples", t: "Resume examples", d: "Written examples by role, ready to edit with your own experience." },
  { href: "/free-ats-check", t: "Free ATS check", d: "See how a parser reads your file — no account needed." },
  { href: "/resume-keywords", t: "Resume keywords", d: "The skills and terms recruiters search for, by role." },
];

const h2Cls = "scroll-mt-6 text-[26px] font-extrabold leading-[31px] tracking-[-0.02em] text-[#121226] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.025em]";
const articleCls = "text-[17px] leading-[28px] text-[#24223a] sm:text-[18px] sm:leading-[30px] [overflow-wrap:anywhere] [&_li>p]:mt-0";
const linkCls = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]";

function wordCount(): number {
  const text = [
    ...FORMAT_SECTIONS.flatMap((s) => [s.title, ...s.body, ...(s.after ?? [])]),
    ...RESUME_FORMAT_FAQS.flatMap((f) => [f.q, f.a]),
    ...QUICK_RULES,
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

function FormatsTable() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Resume formats compared (scrolls sideways on small screens)"
      className="relative mt-6 overflow-x-auto rounded-2xl bg-white p-1 [overflow-wrap:normal]"
    >
      <table className="w-full min-w-[560px] border-collapse text-[15px] leading-6">
        <caption className="sr-only">Chronological, hybrid and functional resume formats: who each one suits and what to watch out for</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]">
              Format
            </th>
            <th scope="col" className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]">
              Best for
            </th>
            <th scope="col" className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]">
              Watch out for
            </th>
          </tr>
        </thead>
        <tbody>
          {FORMAT_TABLE.map((r) => (
            <tr key={r.format} className="align-top transition-colors hover:bg-[#f7f6fb]">
              <th scope="row" className="border-b border-[#efedf7] px-4 py-3 text-left font-bold text-[#121226]">
                {r.format}
              </th>
              <td className="border-b border-[#efedf7] px-4 py-3">{r.bestFor}</td>
              <td className="border-b border-[#efedf7] px-4 py-3">{r.watchOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionOrderFigure() {
  const e = getResumeExample("project-manager");
  if (!e) return null;
  return (
    <figure className="mt-7 grid items-center gap-5 rounded-[24px] bg-[#e4dfff] p-4 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-8 sm:p-7">
      <div className="mx-auto w-full max-w-[300px] shadow-[0_24px_48px_-20px_rgba(10,6,60,.45)]">
        <ResumePreview content={exampleToContent(e)} template="classic" />
      </div>
      <figcaption className="text-[15px] leading-6 text-[#3a2bb8]">
        <span className="block text-[12px] font-bold tracking-[0.08em]">REAL EXAMPLE</span>
        <span className="mt-2 block text-[#24223a]">
          Our{" "}
          <Link href={`/resume-examples/${e.slug}`} className={linkCls}>
            {e.role.toLowerCase()} resume example
          </Link>{" "}
          in the Classic template: contact line, summary, experience with the latest job first, then education and skills — one column, plain headings.
        </span>
      </figcaption>
    </figure>
  );
}

function TemplatesFigure() {
  const items = TEMPLATE_EXAMPLES.flatMap((t) => {
    const e = getResumeExample(t.example);
    return e ? [{ ...t, e }] : [];
  });
  return (
    <ul className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
      {items.map(({ template, e }) => (
        <li key={template}>
          <Link
            href={`/resume-templates#${template}`}
            className="lc-card group block rounded-[20px] transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(36,24,120,0.45)] p-2.5 transition-colors hover:bg-[#f7f6fb] sm:p-3"
          >
            <span className="block overflow-hidden rounded-[12px] bg-[#f1eff8] p-3 sm:p-4" aria-hidden="true">
              <span className="mx-auto block max-w-[260px]">
                <ResumePreview content={exampleToContent(e)} template={template} />
              </span>
            </span>
            <span className="mt-2.5 block px-1 text-[15px] font-extrabold text-[#121226] group-hover:text-[#5440e8]">
              {TEMPLATE_SPECS[template].label} template →
            </span>
            <span className="block px-1 pb-1 text-[13px] leading-5 text-[#66647c]">Shown with the {e.role.toLowerCase()} example</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Figure({ kind }: { kind: NonNullable<FormatSection["figure"]> }) {
  if (kind === "formats-table") return <FormatsTable />;
  if (kind === "section-order") return <SectionOrderFigure />;
  return <TemplatesFigure />;
}

export default function ResumeFormatPage() {
  const url = absoluteUrl(PATH);
  const minutes = Math.max(1, Math.round(wordCount() / 230));
  const toc = [
    ...FORMAT_SECTIONS.map((s) => ({ id: s.id, text: s.title })),
    { id: "sources", text: "Sources" },
    { id: "faq", text: "FAQ" },
  ];
  const reading = RESUME_FORMAT_READING.map((slug) => getPostBySlug(slug)).filter((p) => !!p);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: HEADLINE,
        description: DESCRIPTION,
        url,
        datePublished: RESUME_FORMAT_PUBLISHED,
        dateModified: RESUME_FORMAT_UPDATED,
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
        articleSection: "Resume Tips",
        wordCount: wordCount(),
        citation: RESUME_FORMAT_SOURCES.map((s) => s.url),
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable-description", ".lc-key-facts-lead"] },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Resume format", item: url },
        ],
      },
      faqPageLd(RESUME_FORMAT_FAQS),
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <header className={`${container} pt-4 lg:pt-10`}>
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Resume format" }]} />
        <div className="mt-3.5 grid gap-4 lg:mt-[22px] lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
          <h1 className="text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:text-[64px] lg:leading-[66px]">
            Resume format: <span className="text-[#7c7a94]">what to use in 2026, and why.</span>
          </h1>
          <div>
            <p className="speakable-description text-[16px] leading-[26px] text-[#4a4862] sm:text-[17px] sm:leading-[27px]">
              The short answer: reverse-chronological, one column, standard headings, a text-based PDF. Here&apos;s the reasoning and the exceptions, for job
              seekers in the US.
            </p>
            <p className="mt-3.5 flex items-center gap-2.5 text-[13px] text-[#66647c] sm:text-[14px]">
              <span aria-hidden="true" className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#e4dfff] text-[12px] font-extrabold text-[#3a2bb8]">
                {initials(SITE_AUTHOR.name)}
              </span>
              <span>
                By{" "}
                <Link href="/about" rel="author" className="lc-link font-semibold text-[#121226] hover:text-[#5440e8]">
                  {SITE_AUTHOR.name}
                </Link>{" "}
                · Updated <time dateTime={RESUME_FORMAT_UPDATED}>{dateLabel(RESUME_FORMAT_UPDATED)}</time> · {minutes} min read
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* THREE FORMATS */}
      <section aria-labelledby="formats-at-a-glance" className={`${container} pt-8 lg:pt-12`}>
        <h2 id="formats-at-a-glance" className="sr-only">
          The three resume formats at a glance
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-3.5">
          {FORMAT_KINDS.map((k) => (
            <li key={k.id} className={`rounded-[24px] p-5 sm:rounded-[28px] sm:p-6 lg:p-7 ${k.featured ? "bg-[#5440e8] text-white" : "bg-white"}`}>
              <FormatSketch kind={k.id} onDark={k.featured} />
              <p className="mt-4 text-[22px] font-extrabold sm:mt-[18px] sm:text-[24px]">{k.name}</p>
              <p className={`mt-1.5 text-[15px] leading-[23px] ${k.featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{k.short}</p>
              <p className={`mt-3 text-[13px] font-extrabold ${k.featured ? "text-white" : "text-[#3a2bb8]"}`}>{k.verdict}</p>
            </li>
          ))}
        </ul>
      </section>

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
            {FORMAT_SECTIONS.map((s, i) => (
              <section key={s.id} aria-labelledby={s.id} className={i === 0 ? "" : "mt-12 sm:mt-[52px]"}>
                <h2 id={s.id} className={h2Cls}>
                  {s.title}
                </h2>
                {s.body.map((md, j) => (
                  <SeoMarkdown key={j} sourceIds={SOURCE_IDS}>
                    {md}
                  </SeoMarkdown>
                ))}
                {i === 0 ? (
                  <div className="mt-6">
                    <KeyFactsCard
                      title="Quick rules"
                      lead="Reverse-chronological, one column, standard headings, a text-based PDF."
                      facts={QUICK_RULES}
                    />
                  </div>
                ) : null}
                {s.figure ? <Figure kind={s.figure} /> : null}
                {s.after?.map((md, j) => (
                  <SeoMarkdown key={`a${j}`} sourceIds={SOURCE_IDS}>
                    {md}
                  </SeoMarkdown>
                ))}
              </section>
            ))}

            <section aria-labelledby="sources" className="mt-12 border-t border-[#d9d4f2] pt-8 sm:mt-[52px]">
              <h2 id="sources" className={h2Cls}>
                Sources
              </h2>
              <p className="mt-3 text-[15px] leading-6 text-[#4a4862]">
                Every number on this page comes from one of these. Links checked <time dateTime={RESUME_FORMAT_UPDATED}>{dateLabel(RESUME_FORMAT_UPDATED)}</time>.
              </p>
              <div className="lc-card mt-5 rounded-3xl p-5 sm:p-7">
                <SourceList items={RESUME_FORMAT_SOURCES.map((s) => ({ id: s.id, label: s.label, url: s.url, note: s.note }))} />
              </div>
            </section>
          </article>

          <section id="faq" aria-labelledby="faq-title" className="mt-14 scroll-mt-6">
            <h2 id="faq-title" className={h2Cls}>
              Frequently asked questions
            </h2>
            <div className="mt-5">
              <FaqList items={RESUME_FORMAT_FAQS} />
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside
          aria-label="Check your resume format"
          className="flex min-w-0 max-w-[720px] flex-col gap-3 lg:col-start-2 xl:sticky xl:top-6 xl:col-start-3 xl:row-start-1 xl:self-start"
        >
          <div className="rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-6">
            <p className="text-[21px] font-extrabold leading-[26px] tracking-[-0.02em]">Is your format ATS-safe?</p>
            <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">Free, no account needed. See what the parser reads.</p>
            <CtaLink
              cta="free_ats_check"
              location="resume_format"
              href="/free-ats-check"
              className="lc-btn-lift mt-4 inline-flex w-full items-center justify-center rounded-full bg-white p-3.5 text-[15px] font-semibold text-[#121226] hover:bg-[#f1eff8] sm:w-auto xl:w-full"
            >
              Check my resume
            </CtaLink>
          </div>
          <div className="lc-card rounded-[24px] p-5">
            <p className="text-[15px] font-extrabold">Templates in this format</p>
            <p className="mt-1 text-[13px] leading-5 text-[#4a4862]">All four are one column and free with an account.</p>
            <Link href="/resume-templates" className="mt-2.5 inline-flex min-h-[44px] items-center text-[14px] font-bold text-[#5440e8] hover:text-[#4430d6]">
              <span className="lc-link">See templates →</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* KEEP GOING */}
      <section aria-labelledby="keep-going" className={`${container} pt-16 lg:pt-[110px]`}>
        <h2 id="keep-going" className={labelCls}>
          / Keep going
        </h2>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {RELATED.map((r) => (
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
              {reading.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-[24px] bg-white p-5 transition-colors hover:bg-[#f7f6fb] sm:p-6">
                    <span className="text-[12px] font-bold tracking-[0.08em] text-[#66647c]">{p.category.toUpperCase()}</span>
                    <span className="mt-1.5 text-[17px] font-extrabold leading-snug group-hover:text-[#5440e8]">{p.title}</span>
                    <span className="mt-1.5 line-clamp-2 text-[14px] leading-[21px] text-[#4a4862]">{p.description}</span>
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
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[42px] lg:leading-[46px]">Got the format right? Check it.</h2>
            <p className="mt-2 text-[15px] leading-[23px] text-[#e4dfff] lg:mt-3 lg:text-[18px]">The free ATS check flags columns, tables and missing contact details.</p>
          </div>
          <CtaLink cta="free_ats_check" location="resume_format_footer" href="/free-ats-check" className={`${btn} flex-none bg-white text-[#121226] hover:bg-[#f1eff8]`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
