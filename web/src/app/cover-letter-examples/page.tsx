import Link from "next/link";
import { ResumeSheet } from "@/components/site/resume-sheet";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnWhite, labelCls } from "@/components/site/ui";
import { LetterMini } from "@/components/site/library/letter-mini";
import { ShowAllList } from "@/components/site/library/show-all-list";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { RESUME_EXAMPLES, RESUME_GROUPS, type ResumeExample } from "@/lib/resume-examples";
import { getCoverLetterExample } from "@/lib/cover-letter-examples";
import { COVER_SITUATIONS, COVER_SITUATION_BASE } from "@/lib/seo/cover-letter-situations";

export const metadata = buildMarketingMetadata({
  title: "Cover Letter Examples by Job — Annotated",
  description:
    "Cover letter examples for nurses, teachers, engineers, analysts, managers and more — each annotated paragraph by paragraph, with tips and the matching resume.",
  pathname: "/cover-letter-examples",
  image: DEFAULT_OG_IMAGE,
  keywords: ["cover letter examples", "cover letter samples", "cover letter examples by job", "how to write a cover letter"],
});

const GROUPS = RESUME_GROUPS;
const TILE = ["bg-[#c9c0ff]", "bg-[#e4dfff]"];

const items = GROUPS.flatMap((g) => RESUME_EXAMPLES.filter((e) => e.group === g))
  .map((e) => ({ e, c: getCoverLetterExample(e.slug) }))
  .filter((x): x is { e: ResumeExample; c: NonNullable<typeof x.c> } => !!x.c);

/** The hero shows the opening of a real example letter and its first annotation. */
const featured = items.find((x) => x.e.slug === "product-manager") ?? items[0];

const ld = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${absoluteUrl("/cover-letter-examples")}#webpage`,
  name: "Cover letter examples",
  url: absoluteUrl("/cover-letter-examples"),
  isPartOf: { "@id": WEBSITE_ID },
  inLanguage: "en-US",
  hasPart: items.map(({ e }) => ({
    "@type": "Article",
    headline: `${e.role} cover letter example`,
    url: absoluteUrl(`/cover-letter-examples/${e.slug}`),
  })),
};

export default function CoverLetterExamplesPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} flex flex-col justify-between gap-4 pt-4 lg:flex-row lg:items-end lg:gap-12 lg:pt-10`}>
        <div className="max-w-[880px]">
          <p className={labelCls}>/ Cover letter examples</p>
          <h1 className="mt-3.5 text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-5 sm:text-[56px] sm:leading-[1.05] lg:text-[64px] lg:leading-[66px]">
            Cover letter examples. <span className="text-[#7c7a94]">Annotated, paragraph by paragraph.</span>
          </h1>
        </div>
        <p className="max-w-[380px] text-[16px] leading-[1.6] text-[#4a4862] sm:text-[17px] sm:leading-[27px] lg:mb-2">
          Each letter is written by the same person as one of our resume examples, so you can see how a letter and a resume
          work together. Every paragraph is annotated with what it&apos;s doing.
        </p>
      </section>

      {/* STAGE */}
      {featured ? (
        <section className={`${container} pt-[22px] lg:pt-11`}>
          <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-[#5440e8] sm:h-[380px] lg:h-[420px] lg:rounded-[36px]">
            <p aria-hidden="true" className="lc-poster absolute left-[18px] top-3.5 m-0 text-[60px] leading-[60px] text-[#6a58ee] sm:left-10 sm:top-[30px] sm:text-[100px] sm:leading-[100px] lg:text-[150px] lg:leading-[140px]">
              DEAR…
            </p>
            <div aria-hidden="true" className="absolute -bottom-[170px] -right-[60px] hidden h-[460px] w-[460px] rounded-full bg-[#4430d6] sm:block" />
            <ResumeSheet
              example={featured.e.slug}
              className="absolute -right-4 bottom-0 h-[170px] w-[140px] rotate-6 [--peek:0.172] sm:right-8 sm:h-[260px] sm:w-[210px] sm:rotate-3 sm:[--peek:0.257] lg:right-14 lg:h-[330px] lg:w-[260px] lg:[--peek:0.319]"
            />
            <Link
              href={`/cover-letter-examples/${featured.e.slug}`}
              className="lc-float group absolute left-4 top-[90px] w-[220px] -rotate-3 rounded-lg bg-white p-4 text-[10px] leading-[15px] text-[#24223a] transition-transform duration-300 hover:rotate-0 sm:left-10 sm:top-[130px] sm:w-[360px] sm:rounded-[10px] sm:p-6 sm:text-[13px] sm:leading-5 lg:left-[60px] lg:top-[150px] lg:w-[440px] lg:p-7 lg:text-[14px] lg:leading-[22px]"
            >
              <span className="sr-only">Read the {featured.e.role.toLowerCase()} cover letter example: </span>
              <span className="block">Dear {featured.c.target.hiringManager},</span>
              <span className="mt-1.5 line-clamp-3 sm:mt-2.5 sm:line-clamp-6 lg:line-clamp-none">{featured.c.paragraphs[0]}</span>
            </Link>
            <div className="lc-float lc-drift absolute left-[540px] top-[170px] hidden w-[280px] rounded-[20px] bg-[#111118] p-[18px] text-white lg:block">
              <p className="text-[12px] font-bold tracking-[0.06em] text-[#c9c0ff]">WHY IT WORKS</p>
              <p className="mt-1.5 text-[14px] leading-[21px]">{featured.c.annotations[0]}</p>
            </div>
            <span aria-hidden="true" className="lc-poster absolute bottom-[34px] left-[60px] hidden -rotate-[5deg] rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118] lg:block">
              {items.length} ROLES
            </span>
          </div>
        </section>
      ) : null}

      {/* GRID */}
      <section className={`${container} pt-[22px] lg:pt-12`}>
        <h2 className="sr-only">Cover letter examples by role</h2>
        <ShowAllList
          noun="letters"
          initial={12}
          className="grid gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
          itemClassName="flex"
          items={items.map(({ e, c }, i) => ({
            key: e.slug,
            node: (
              <Link
                href={`/cover-letter-examples/${e.slug}`}
                className="lc-card lc-rise group flex w-full items-center justify-between gap-3 rounded-[22px] px-[18px] py-4 text-[#121226] sm:block sm:rounded-[26px] sm:p-2"
              >
                <div className={`relative hidden h-[230px] overflow-hidden rounded-[20px] sm:block ${TILE[i % TILE.length]}`}>
                  <LetterMini
                    letter={c}
                    name={e.resume.name}
                    contact={e.resume.contact}
                    className="absolute left-1/2 top-6 h-[273px] w-[210px] -translate-x-1/2 p-3.5 text-[5.8px] leading-[9px] shadow-[0_18px_36px_-18px_rgba(10,6,60,.45)] transition-transform duration-300 group-hover:-translate-y-1"
                  />
                </div>
                <div className="min-w-0 sm:px-2.5 sm:pb-2 sm:pt-3.5">
                  <p className="text-[16px] font-extrabold tracking-[-0.01em] group-hover:text-[#5440e8] sm:text-[19px]">
                    {e.role}
                    <span className="sr-only"> cover letter example</span>
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#66647c] sm:mt-[3px] sm:text-[13px]">
                    For: {c.target.title}
                    <span className="hidden sm:inline">, {c.target.company}</span>
                  </p>
                  <p aria-hidden="true" className="mt-3 hidden text-[14px] font-semibold text-[#5440e8] sm:block">
                    Read the letter →
                  </p>
                </div>
                <span aria-hidden="true" className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#111118] text-white sm:hidden">
                  →
                </span>
              </Link>
            ),
          }))}
        />
        <p className="mt-3 text-[12px] text-[#66647c] sm:mt-5 sm:text-[13px]">Sample letters. Names, companies and figures are illustrative.</p>
      </section>

      {/* BY SITUATION */}
      <section id="situations" className={`${container} scroll-mt-6 pt-14 lg:pt-[110px]`}>
        <p className={labelCls}>/ By situation</p>
        <h2 className="mt-3 text-[30px] font-extrabold leading-[34px] tracking-[-0.03em] sm:text-[40px] sm:leading-[44px]">
          Cover letters for your situation. <span className="text-[#7c7a94]">Fill-in templates with an email version.</span>
        </h2>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 sm:gap-3.5 lg:mt-10 lg:grid-cols-4">
          {COVER_SITUATIONS.map((s) => (
            <li key={s.slug} className="flex">
              <Link
                href={`${COVER_SITUATION_BASE}/${s.slug}`}
                className="lc-card lc-rise group flex w-full flex-col rounded-[22px] p-5 text-[#121226] sm:rounded-[26px] sm:p-6"
              >
                <span className="text-[17px] font-extrabold group-hover:text-[#5440e8] sm:text-[19px]">
                  {s.card.t}
                  <span className="sr-only"> cover letter</span>
                </span>
                <span className="mt-1.5 flex-1 text-[14px] leading-[21px] text-[#4a4862]">{s.card.d}</span>
                <span aria-hidden="true" className="mt-3 text-[14px] font-semibold text-[#5440e8]">
                  See the template →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA BAND */}
      <section className={`${container} pt-14 lg:pt-[110px]`}>
        <div className="lc-reveal flex flex-col gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:px-16 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] sm:text-[34px] sm:leading-[38px] lg:text-[42px] lg:leading-[46px] lg:tracking-[-0.035em]">
              Write yours from your own resume.
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-[#e4dfff] sm:text-[16px] lg:mt-3 lg:text-[18px]">
              From your resume and the job post — formal or neutral tone.
            </p>
          </div>
          <CtaLink cta="cover_letter_feature" location="cover_letter_examples_index" href="/features/cover-letter" className={`${btnWhite} flex-none`}>
            Generate my cover letter
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
