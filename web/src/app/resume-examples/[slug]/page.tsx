import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, labelCls, Breadcrumbs, Chip, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { CopyPill } from "@/components/site/library/copy-pill";
import { ArrowCard } from "@/components/site/library/arrow-card";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { ResumePreview } from "@/components/resume-preview";
import { fitTitle, buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { RESUME_EXAMPLES, exampleResumeText, getResumeExample } from "@/lib/resume-examples";
import { getCoverLetterExample } from "@/lib/cover-letter-examples";
import { exampleToContent } from "@/lib/example-to-content";

type Params = { slug: string };

// Unknown slugs 404 via notFound(). (dynamicParams = false made every page 404
// after an on-demand revalidation in Next 16, e.g. when the footer copy changed.)

export function generateStaticParams(): Params[] {
  return RESUME_EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getResumeExample(slug);
  if (!e) return {};
  return buildMarketingMetadata({
    title: fitTitle(`${e.role} Resume Example & Keywords (2026)`, `${e.role} Resume Example (2026)`, `${e.role} Resume Example`),
    description: `A ${roleLower(e.role)} resume example you can copy, with summary and bullet examples, the keywords recruiters search for and ATS tips.`,
    pathname: `/resume-examples/${e.slug}`,
    image: DEFAULT_OG_IMAGE,
    keywords: [
      `${roleLower(e.role)} resume`,
      `${roleLower(e.role)} resume example`,
      `${roleLower(e.role)} resume keywords`,
      `${roleLower(e.role)} resume summary`,
    ],
  });
}

const UPDATED = "2026-10-26";
const UPDATED_LABEL = new Date(`${UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const sectionCls = `${container} scroll-mt-6 pt-16 lg:pt-[130px]`;
const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";
const NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

/** Cut-out portraits for the roles the design pairs with one; every other role uses its own photo. */
const CUTOUTS: Record<string, { src: string; w: number; h: number; alt: string }> = {
  "registered-nurse": { src: "/images/people/nurse-arms-crossed.webp", w: 759, h: 1080, alt: "Smiling nurse in blue scrubs with a stethoscope, arms crossed" },
  "ux-designer": { src: "/images/people/woman-hoodie.webp", w: 856, h: 1080, alt: "Young woman in a denim jacket and hoodie, smiling" },
  "marketing-manager": { src: "/images/people/woman-red-top.webp", w: 747, h: 1080, alt: "Laughing woman in a red top" },
};

export default async function ResumeExamplePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const e = getResumeExample(slug);
  if (!e) notFound();

  const r = e.resume;
  const role = roleLower(e.role);
  const startHref = `/register?next=${encodeURIComponent(`/resume/new?example=${e.slug}`)}`;
  const url = absoluteUrl(`/resume-examples/${e.slug}`);
  const related = e.related.map(getResumeExample).filter((x) => !!x);
  const hasLetter = !!getCoverLetterExample(e.slug);
  const cutout = CUTOUTS[e.slug];
  const firstName = r.name.split(" ")[0];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${e.role} resume example`,
        description: e.intro,
        url,
        image: absoluteUrl(e.photo.src),
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
          { "@type": "ListItem", position: 2, name: "Resume examples", item: absoluteUrl("/resume-examples") },
          { "@type": "ListItem", position: 3, name: e.role, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: e.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} grid items-stretch gap-[22px] pt-4 lg:grid-cols-2 lg:gap-6 lg:pt-7`}>
        <div className="flex flex-col justify-center lg:pr-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/resume-examples", label: "Resume examples" },
              { label: e.role },
            ]}
          />
          <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-6 sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[62px]">
            {e.role} resume example. <span className="text-[#7c7a94]">Plus the keywords recruiters search for.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">{e.intro}</p>
          <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
            <CtaLink cta="use_example" location="resume_example" href={startHref} className={btnPrimary}>
              Start from this example
            </CtaLink>
            <CtaLink cta="free_ats_check" location="resume_example" href="/free-ats-check" className={`${btnWhite} hidden sm:inline-flex`}>
              Check my resume — free
            </CtaLink>
          </div>
          <p className="mt-3 text-center text-[12px] text-[#66647c] sm:mt-[18px] sm:text-left sm:text-[14px]">
            By{" "}
            <Link href="/about" className="lc-link hover:text-[#5440e8]">
              {SITE_AUTHOR.name}
            </Link>
            <span className="hidden sm:inline">, {SITE_AUTHOR.role}</span> · Updated <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
          </p>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-[28px] bg-[#e4dfff] sm:h-[520px] lg:h-[640px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute left-[18px] top-3.5 m-0 text-[64px] leading-[60px] text-[#d3cbff] sm:left-8 sm:top-7 sm:text-[104px] sm:leading-[96px]">
            {monogram(e.role)}
          </p>
          <div aria-hidden="true" className="absolute bottom-[-120px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#c9c0ff] sm:bottom-[-190px] sm:h-[520px] sm:w-[520px]" />
          {cutout ? (
            <Image
              src={cutout.src}
              alt={cutout.alt}
              width={cutout.w}
              height={cutout.h}
              priority
              sizes={`(min-width: 1024px) ${Math.round((540 * cutout.w) / cutout.h)}px, (min-width: 640px) ${Math.round((440 * cutout.w) / cutout.h)}px, ${Math.round((320 * cutout.w) / cutout.h)}px`}
              className="absolute bottom-0 left-1/2 h-[320px] w-auto max-w-none -translate-x-1/2 sm:h-[440px] lg:h-[540px]"
            />
          ) : (
            <div className="absolute inset-x-4 bottom-4 top-[92px] overflow-hidden rounded-[22px] sm:inset-x-7 sm:bottom-7 sm:top-[140px] lg:rounded-[26px]">
              <Image src={e.photo.src} alt={e.photo.alt} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-[center_30%]" />
            </div>
          )}
          <div className="lc-float lc-drift absolute right-7 top-9 hidden w-[230px] rounded-[22px] bg-white p-[18px] sm:block">
            <p className="text-[13px] text-[#66647c]">Keywords recruiters search for</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {e.keywords.slice(0, 5).map((k) => (
                <li key={k}>
                  <Chip tone="lilac">{k}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <span className="lc-poster absolute bottom-4 left-3 max-w-[calc(100%-24px)] -rotate-6 overflow-hidden text-ellipsis rounded-full bg-[#ff7a33] px-[11px] py-1.5 text-[10px] uppercase text-[#111118] sm:bottom-11 sm:left-auto sm:right-9 sm:px-3.5 sm:py-2 sm:text-[12px]">
            {e.level}
          </span>
        </div>
      </section>

      {/* THE EXAMPLE */}
      <section id="example" className={sectionCls}>
        <div className="lc-reveal flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHead label="The example" title={`${e.role} resume example.`} />
          <CopyPill text={exampleResumeText(e)} label="Copy text" className="self-start sm:self-auto" />
        </div>
        <div className="mt-[18px] grid items-start gap-2.5 lg:mt-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-6">
          <div className="rounded-[24px] bg-[#5440e8] p-3.5 sm:p-8 lg:rounded-[36px] lg:p-10">
            <div className="shadow-[0_30px_60px_-24px_rgba(10,6,60,.6)]">
              <ResumePreview content={exampleToContent(e)} template="classic" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5 lg:gap-4">
            <div className="rounded-[24px] bg-[#111118] px-5 py-[22px] text-white sm:p-7 lg:rounded-[28px]">
              <h3 className={`${labelCls} !text-[14px] !text-[#c9c0ff] sm:!text-[16px]`}>Why it works</h3>
              <p className="mt-2.5 text-[15px] leading-6 text-[#e9e7f3] sm:mt-3.5 sm:text-[17px] sm:leading-[27px]">{e.whyItWorks}</p>
            </div>
            <div className="lc-card rounded-[24px] p-5 sm:p-6">
              <h3 className="text-[18px] font-bold">Use this as your starting point</h3>
              <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">
                Opens in the editor with every section filled in. Swap in your own details and download a PDF free.
              </p>
              <CtaLink cta="use_example" location="resume_example_sample" href={startHref} className={`${btnPrimary} mt-4 w-full`}>
                Start from this example
              </CtaLink>
            </div>
            {hasLetter ? (
              <ArrowCard href={`/cover-letter-examples/${e.slug}`} title={`See ${firstName}'s cover letter`} sub="Applying with a cover letter? Same person, annotated." />
            ) : null}
            <p className="px-2 text-[13px] text-[#66647c]">Sample resume. Names, companies and figures are illustrative.</p>
          </div>
        </div>
      </section>

      {/* SUMMARIES */}
      <section id="summary" className={sectionCls}>
        <SectionHead
          className="lc-reveal"
          label="Summary examples"
          title={`${NUM[e.summaries.length] ?? e.summaries.length} summary examples.`}
          muted="Pick the one closest to you."
          lead="Two or three lines: your level, your field and one result."
        />
        <ul className="mt-[18px] grid gap-2 lg:mt-10 lg:grid-cols-3 lg:gap-4">
          {e.summaries.map((s) => (
            <li key={s.level} className="lc-card lc-reveal flex flex-col rounded-3xl p-[18px] sm:p-6">
              <span>
                <Chip tone="lilac">{s.level}</Chip>
              </span>
              <p className="mt-2.5 flex-1 text-[15px] leading-[23px] sm:mt-4 sm:text-[16px] sm:leading-[25px]">{s.text}</p>
              <CopyPill text={s.text} tone="soft" className="mt-4 self-start" />
            </li>
          ))}
        </ul>
      </section>

      {/* BULLETS */}
      <section id="bullets" className={sectionCls}>
        <SectionHead
          className="lc-reveal"
          label="Bullet points"
          title="Bullet point examples."
          muted="From duty to result."
          lead="Turn duties into results: what you did, how, and what changed."
        />
        <ul className="mt-[18px] flex flex-col gap-2 sm:hidden">
          {e.bullets.map((b) => (
            <li key={b.skill} className="lc-card rounded-3xl px-[18px] py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">{b.skill}</p>
              <p className="mt-2 text-[14px] text-[#66647c] line-through decoration-[#c42b30]">
                <span className="sr-only">Instead of: </span>
                {b.weak}
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-[22px]">
                <span className="text-[#0b7a4f]" aria-hidden="true">
                  ✓
                </span>{" "}
                <span className="sr-only">Write: </span>
                {b.strong}
              </p>
            </li>
          ))}
        </ul>
        <div className="lc-card lc-reveal mt-10 hidden rounded-3xl px-8 pb-3 pt-2.5 sm:block">
          <table className="w-full border-collapse text-left text-[15px] leading-[23px]">
            <thead>
              <tr className="text-[13px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                <th scope="col" className="w-[160px] py-4 pr-5 font-bold">
                  Skill
                </th>
                <th scope="col" className="py-4 pr-5 font-bold">
                  Instead of
                </th>
                <th scope="col" className="py-4 font-bold">
                  Write
                </th>
              </tr>
            </thead>
            <tbody>
              {e.bullets.map((b) => (
                <tr key={b.skill} className="border-t border-[#e2e0ea] align-top">
                  <th scope="row" className="py-5 pr-5 font-bold">
                    {b.skill}
                  </th>
                  <td className="w-[40%] py-5 pr-5 text-[#66647c] line-through decoration-[#c42b30]">{b.weak}</td>
                  <td className="py-5 font-semibold">
                    <span className="text-[#0b7a4f]" aria-hidden="true">
                      ✓
                    </span>{" "}
                    {b.strong}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* KEYWORDS */}
      <section id="keywords" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <SectionHead
          className="lc-reveal"
          label="Keywords"
          title={`Keywords and skills for ${role}s.`}
          lead={`These come up often in ${role} job posts. Include only the ones you can back up in an interview, and use the exact wording from the post you're applying to.`}
        />
        <ul className="lc-reveal flex flex-wrap gap-1.5 sm:gap-2 lg:pt-2">
          {e.keywords.map((k, i) => (
            <li
              key={k}
              className={`rounded-full px-3 py-2 text-[13px] font-semibold sm:px-4 sm:py-2.5 sm:text-[15px] ${i < 4 ? "bg-[#5440e8] text-white" : "bg-white text-[#121226]"}`}
            >
              {k}
            </li>
          ))}
        </ul>
      </section>

      {/* TIPS (dark) + mid CTA */}
      <section id="tips" className={sectionCls}>
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-5 pt-7 text-white sm:p-10 lg:rounded-[36px] lg:p-16">
          <p className={`${labelCls} !text-[#c9c0ff]`}>/ ATS tips</p>
          <h2 className="lc-h2 mt-5 text-white">ATS tips for {role}s.</h2>
          <ol className="mt-4 grid sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {e.tips.map((t, i) => (
              <li key={t.t} className="border-t border-[#2f2d48] py-[13px] sm:rounded-[22px] sm:border sm:bg-[#1d1c2e] sm:p-6">
                <p className="lc-mono hidden text-[12px] text-[#c9c0ff] sm:block">0{i + 1}</p>
                <p className="text-[16px] font-bold sm:mt-6 sm:text-[18px]">{t.t}</p>
                <p className="mt-[3px] text-[13px] leading-5 text-[#b3b0c8] sm:mt-2 sm:text-[14px] sm:leading-[22px]">{t.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-col items-start justify-between gap-4 rounded-[22px] bg-[#5440e8] p-5 sm:mt-6 sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="text-[20px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[24px]">How does your {role} resume compare?</p>
              <p className="mt-1.5 text-[15px] text-[#e4dfff]">Free ATS score, missing keywords and fixes in about 10 seconds.</p>
            </div>
            <CtaLink cta="free_ats_check" location="resume_example_mid" href="/free-ats-check" className={`${btnWhite} flex-none`}>
              Check my resume
            </CtaLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${sectionCls} grid items-start gap-[18px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title={`${e.role} resume FAQ.`} />
          {hasLetter ? (
            <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
              Writing the cover letter too?{" "}
              <Link href={`/cover-letter-examples/${e.slug}`} className={inlineLink}>
                See {firstName}&apos;s cover letter, annotated
              </Link>
            </p>
          ) : null}
        </div>
        <FaqList faqs={e.faqs} />
      </section>

      {/* RELATED */}
      {related.length > 0 ? (
        <section className={`${container} pt-14 lg:pt-[120px]`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className={labelCls}>
              <span aria-hidden="true">/ </span>Related examples
            </h2>
            <Link href="/resume-examples" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-[#5440e8] hover:underline">
              All {RESUME_EXAMPLES.length} examples →
            </Link>
          </div>
          <div className="mt-3.5 grid gap-2 sm:grid-cols-3 sm:gap-4 lg:mt-5">
            {related.map((x) => (
              <ArrowCard key={x.slug} href={`/resume-examples/${x.slug}`} title={x.role} sub={x.level} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}

/** "HR Generalist" → "HR generalist": lowercases words but keeps acronyms. */
function roleLower(role: string): string {
  return role.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());
}

/** Decorative poster letters: "Registered Nurse" → "RN", "UX Designer" → "UXD". */
function monogram(role: string): string {
  return role
    .split(/\s+/)
    .map((w) => (/^[A-Z]{2,}$/.test(w) ? w : w.charAt(0)))
    .join("")
    .toUpperCase();
}
