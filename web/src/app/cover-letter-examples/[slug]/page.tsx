import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, btnSoft, labelCls, Breadcrumbs, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { CopyPill } from "@/components/site/library/copy-pill";
import { ArrowCard } from "@/components/site/library/arrow-card";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { fitTitle, buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { getResumeExample } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES, getCoverLetterExample, type CoverLetterExample } from "@/lib/cover-letter-examples";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return COVER_LETTER_EXAMPLES.map((c) => ({ slug: c.slug }));
}

/** "HR Generalist" → "HR generalist": lowercases words but keeps acronyms. */
const roleLower = (role: string) => role.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCoverLetterExample(slug);
  const e = getResumeExample(slug);
  if (!c || !e) return {};
  const role = roleLower(e.role);
  return buildMarketingMetadata({
    title: fitTitle(`${e.role} Cover Letter Example (Annotated)`, `${e.role} Cover Letter Example`),
    description: `A ${role} cover letter example, paragraph by paragraph: what each part does, tips for your own and how it pairs with a ${role} resume.`,
    pathname: `/cover-letter-examples/${slug}`,
    image: DEFAULT_OG_IMAGE,
    keywords: [`${role} cover letter`, `${role} cover letter example`, `cover letter for ${role}`, `${role} cover letter sample`],
  });
}

const UPDATED = "2026-10-27";
const UPDATED_LABEL = new Date(`${UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const sectionCls = `${container} pt-16 lg:pt-[130px]`;
const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";

function letterText(c: CoverLetterExample, name: string): string {
  return [`Dear ${c.target.hiringManager},`, "", ...c.paragraphs.flatMap((p) => [p, ""]), "Sincerely,", name].join("\n");
}

export default async function CoverLetterExamplePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCoverLetterExample(slug);
  const e = getResumeExample(slug);
  if (!c || !e) notFound();

  const r = e.resume;
  const role = roleLower(e.role);
  const firstName = r.name.split(" ")[0];
  const url = absoluteUrl(`/cover-letter-examples/${slug}`);
  const startHref = `/register?next=${encodeURIComponent(`/resume/new?example=${slug}`)}`;
  const related = e.related.flatMap((s) => {
    const re = getResumeExample(s);
    const rc = getCoverLetterExample(s);
    return re && rc ? [{ e: re, c: rc }] : [];
  });

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${e.role} cover letter example`,
        url,
        dateModified: UPDATED,
        inLanguage: "en-US",
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: { "@id": absoluteUrl("/#organization") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Cover letter examples", item: absoluteUrl("/cover-letter-examples") },
          { "@type": "ListItem", position: 3, name: e.role, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} pt-4 lg:pt-8`}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/cover-letter-examples", label: "Cover letter examples" },
            { label: e.role },
          ]}
        />
        <div className="mt-3.5 flex flex-col justify-between gap-5 sm:mt-6 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-[860px]">
            <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[63px]">
              {e.role} cover letter example. <span className="text-[#7c7a94]">Annotated, paragraph by paragraph.</span>
            </h1>
            <p className="mt-4 max-w-[680px] text-[16px] leading-[1.6] text-[#4a4862] sm:text-[18px] sm:leading-7">
              {r.name} is applying for the {c.target.title} role at {c.target.company}. The letter goes with their{" "}
              <Link href={`/resume-examples/${slug}`} className={inlineLink}>
                {role} resume example
              </Link>{" "}
              — same person, same results — so you can see how the two work together.
            </p>
          </div>
          <div className="flex flex-none flex-col gap-2.5 sm:flex-row lg:flex-col">
            <CtaLink cta="cover_letter_feature" location="cover_letter_example" href="/features/cover-letter" className={btnPrimary}>
              Write mine from my resume
            </CtaLink>
            <Link href={`/resume-examples/${slug}`} className={`${btnWhite} hidden sm:inline-flex`}>
              See the matching resume
            </Link>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-[#66647c] sm:mt-4 sm:text-[14px]">
          By{" "}
          <Link href="/about" className="lc-link hover:text-[#5440e8]">
            {SITE_AUTHOR.name}
          </Link>{" "}
          · Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
        </p>
      </section>

      {/* THE LETTER + ANNOTATIONS */}
      <section className={`${container} pt-[22px] lg:pt-12`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 lg:mb-4">
          <h2 className="text-[20px] font-extrabold tracking-[-0.02em] sm:text-[24px]">{e.role} cover letter</h2>
          <CopyPill text={letterText(c, r.name)} label="Copy text" />
        </div>
        <div className="grid items-start gap-2.5 lg:grid-cols-[1.3fr_0.7fr] lg:gap-6">
          <div className="rounded-[24px] bg-[#e4dfff] p-3 sm:p-8 lg:rounded-[36px] lg:p-10">
            <div className="rounded-lg bg-white py-[22px] pl-11 pr-[18px] text-[14px] leading-[22px] text-[#24223a] shadow-[0_30px_60px_-24px_rgba(36,24,120,.4)] sm:rounded-[10px] sm:py-12 sm:pl-[72px] sm:pr-12 sm:text-[16px] sm:leading-[27px] lg:py-[52px] lg:pl-[84px] lg:pr-14">
              <p className="text-[17px] font-extrabold sm:text-[22px]">{r.name}</p>
              <p className="mt-0.5 break-words text-[#66647c]">{r.contact}</p>
              <p className="mt-[22px]">
                {c.target.hiringManager}
                <br />
                {c.target.title}, {c.target.company}
              </p>
              <p className="mt-[22px]">Dear {c.target.hiringManager},</p>
              {c.paragraphs.map((p, i) => (
                <p key={i} className="relative mt-4">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[30px] top-px inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5440e8] text-[12px] font-extrabold text-white sm:-left-[46px] sm:top-0.5 sm:h-[26px] sm:w-[26px] sm:text-[13px]"
                  >
                    {i + 1}
                  </span>
                  {p}
                </p>
              ))}
              <p className="mt-[22px]">
                Sincerely,
                <br />
                {r.name}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 lg:sticky lg:top-6 lg:gap-4">
            <div className="rounded-[24px] bg-[#111118] px-[18px] py-[22px] text-white sm:p-8 lg:rounded-[32px]">
              <h3 className={`${labelCls} !text-[16px] !text-[#c9c0ff]`}>What each paragraph does</h3>
              <ol className="mt-2.5 sm:mt-4">
                {c.annotations.map((a, i) => (
                  <li key={i} className="flex gap-3.5 border-t border-[#2f2d48] py-[18px]">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[13px] font-extrabold text-white"
                    >
                      {i + 1}
                    </span>
                    <p className="text-[14px] leading-[21px] text-[#e9e7f3] sm:text-[15px] sm:leading-[23px]">
                      <span className="sr-only">Paragraph {i + 1}: </span>
                      {a}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lc-card rounded-[24px] p-5 sm:p-6">
              <h3 className="text-[18px] font-bold">Start from {firstName}&apos;s resume</h3>
              <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">
                Opens the matching resume in the editor with every section filled in. Swap in your own details.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <CtaLink cta="use_example" location="cover_letter_example" href={startHref} className={`${btnPrimary} w-full`}>
                  Start from this resume
                </CtaLink>
                <CtaLink cta="free_ats_check" location="cover_letter_example" href="/free-ats-check" className={`${btnSoft} w-full`}>
                  Check my resume
                </CtaLink>
              </div>
            </div>
            <p className="px-2 text-[13px] text-[#66647c]">Sample letter. Names, companies and figures are illustrative.</p>
          </div>
        </div>
      </section>

      {/* TIPS */}
      <section className={sectionCls}>
        <div className="lc-reveal max-w-[980px]">
          <p className={labelCls}>/ Tips</p>
          <h2 className="lc-h2 mt-5">
            Tips for your {role} <span>cover letter.</span>
          </h2>
        </div>
        <ol className="mt-[18px] grid gap-2 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-3">
          {c.tips.map((t, i) => (
            <li key={t.t} className="lc-card lc-reveal rounded-3xl p-5 sm:p-[26px]">
              <p className="lc-mono text-[13px] text-[#5440e8]">0{i + 1}</p>
              <p className="mt-4 text-[18px] font-extrabold sm:mt-7 sm:text-[20px]">{t.t}</p>
              <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">{t.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WRITE YOURS */}
      <section className={`${container} pt-3 lg:pt-6`}>
        <div className="lc-reveal flex flex-col items-start justify-between gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:flex-row sm:items-center sm:gap-10 sm:p-10 lg:rounded-[36px] lg:px-14 lg:py-11">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] sm:text-[30px] sm:leading-9">Write yours from your own resume</h2>
            <p className="mt-2 max-w-[520px] text-[15px] leading-6 text-[#e4dfff] sm:text-[17px] sm:leading-[26px]">
              LaunchCV drafts a cover letter from your resume and the job post, then you edit it. Included in every paid plan.
            </p>
          </div>
          <CtaLink cta="cover_letter_feature" location="cover_letter_example_band" href="/features/cover-letter" className={`${btnWhite} flex-none`}>
            How it works
          </CtaLink>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${sectionCls} grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title="Cover letter" muted="FAQ." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className={inlineLink}>
              support@launch-cv.com
            </a>
          </p>
        </div>
        <FaqList faqs={c.faqs} />
      </section>

      {/* RELATED */}
      {related.length > 0 ? (
        <section className={`${container} pt-14 lg:pt-[110px]`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className={labelCls}>
              <span aria-hidden="true">/ </span>Related cover letters
            </h2>
            <Link href="/cover-letter-examples" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#5440e8] hover:underline">
              All {COVER_LETTER_EXAMPLES.length} cover letters →
            </Link>
          </div>
          <div className="mt-3.5 grid gap-2 sm:grid-cols-3 sm:gap-4 lg:mt-5">
            {related.map((x) => (
              <ArrowCard key={x.e.slug} href={`/cover-letter-examples/${x.e.slug}`} title={`${x.e.role} cover letter`} sub={x.c.target.title} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
