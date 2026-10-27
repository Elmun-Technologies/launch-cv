import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { CopyButton } from "@/components/copy-button";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { RESUME_EXAMPLES, exampleResumeText, getResumeExample } from "@/lib/resume-examples";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return RESUME_EXAMPLES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getResumeExample(slug);
  if (!e) return {};
  return buildMarketingMetadata({
    title: `${e.role} Resume Example & Keywords (2026)`,
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
const h2 = "text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[30px]";

export default async function ResumeExamplePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const e = getResumeExample(slug);
  if (!e) notFound();

  const r = e.resume;
  const url = absoluteUrl(`/resume-examples/${e.slug}`);
  const related = e.related.map(getResumeExample).filter((x) => !!x);
  const toc = [
    { id: "example", t: "Resume example" },
    { id: "summary", t: "Summary examples" },
    { id: "bullets", t: "Bullet examples" },
    { id: "keywords", t: "Keywords & skills" },
    { id: "tips", t: "ATS tips" },
    { id: "faq", t: "FAQ" },
  ];

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
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: { "@type": "Organization", name: "LaunchCV", url: absoluteUrl("/") },
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
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1 pt-[96px]">
        <section className="mx-auto max-w-[1200px] px-5 pt-8 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#111111]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/resume-examples" className="hover:text-[#111111]">
              Resume examples
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[#111111]">{e.role}</span>
          </nav>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
            <div className="flex-1">
              <h1 className="text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[52px]">
                {e.role} resume example. <span className="text-[#8A8A86]">Plus the keywords recruiters search for.</span>
              </h1>
              <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-[#3F3F3F]">{e.intro}</p>
            </div>
            <div className="flex flex-col gap-3.5 lg:w-[360px]">
              <p className="text-[14px] text-[#6B6B6B]">
                {SITE_AUTHOR.name} · Updated October 2026
              </p>
              <div className="flex flex-wrap gap-2">
                <CtaLink
                  cta="build_resume"
                  location="resume_example"
                  href="/register"
                  className="inline-flex h-12 items-center rounded-full bg-[#2563EB] px-5 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
                >
                  Build my resume
                </CtaLink>
                <CtaLink
                  cta="free_ats_check"
                  location="resume_example"
                  href="/free-ats-check"
                  className="inline-flex h-12 items-center rounded-full border border-[#D9D9D5] px-5 text-[15px] font-medium hover:border-[#111111]"
                >
                  Check my resume
                </CtaLink>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-10 sm:px-8">
          <div className="relative h-[240px] overflow-hidden rounded-[20px] sm:h-[340px]">
            <Image
              src={e.photo.src}
              alt={e.photo.alt}
              fill
              priority
              sizes="(min-width: 1200px) 1136px, 100vw"
              className="object-cover object-[center_30%]"
            />
            <span className="absolute bottom-5 left-5 rounded-full bg-white px-3.5 py-2 text-[14px]">{e.level}</span>
          </div>
        </section>

        <div className="mx-auto flex max-w-[1200px] gap-16 px-5 pb-24 pt-14 sm:px-8">
          <aside className="sticky top-[96px] hidden w-[200px] shrink-0 self-start lg:block">
            <p className="mb-2 text-[13px] text-[#6B6B6B]">On this page</p>
            <nav aria-label="Contents">
              <ul className="border-l border-[#E5E5E2]">
                {toc.map((x) => (
                  <li key={x.id}>
                    <a
                      href={`#${x.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-3.5 text-[14px] text-[#3F3F3F] hover:border-[#111111] hover:text-[#111111]"
                    >
                      {x.t}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="flex min-w-0 flex-1 flex-col gap-16">
            {/* EXAMPLE */}
            <section id="example" className="flex scroll-mt-[96px] flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className={h2}>{e.role} resume example</h2>
                <CopyButton text={exampleResumeText(e)} label="Copy text" />
              </div>
              <div className="rounded-2xl bg-[#F5F5F3] p-3 sm:p-9">
                <div className="mx-auto max-w-[680px] rounded bg-white px-6 py-8 text-[13.5px] leading-[1.55] text-[#1c1c1c] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)] sm:px-12 sm:py-11">
                  <p className="text-[24px] font-bold leading-tight sm:text-[26px]">{r.name}</p>
                  <p className="mt-1 text-[#555]">
                    {r.headline} · {r.contact}
                  </p>
                  <ResumeHeading>Summary</ResumeHeading>
                  <p className="mt-1.5">{r.summary}</p>
                  <ResumeHeading>Experience</ResumeHeading>
                  {r.jobs.map((j) => (
                    <div key={j.company} className="mt-3">
                      <p className="flex flex-col font-semibold sm:flex-row sm:justify-between">
                        <span>
                          {j.title}, {j.company}
                        </span>
                        <span className="font-normal text-[#555] sm:font-semibold sm:text-[#1c1c1c]">{j.dates}</span>
                      </p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">
                        {j.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <ResumeHeading>Education</ResumeHeading>
                  <p className="mt-1.5">{r.education}</p>
                  <ResumeHeading>Skills</ResumeHeading>
                  <p className="mt-1.5">{r.skills.join(" · ")}</p>
                </div>
                <p className="mx-auto mt-3 max-w-[680px] text-[13px] text-[#6B6B6B]">
                  Sample resume. Names, companies and figures are illustrative.
                </p>
              </div>
              <p className="text-[17px] leading-[1.65] text-[#3F3F3F]">
                <strong className="font-semibold text-[#111111]">Why it works:</strong> {e.whyItWorks}
              </p>
            </section>

            {/* SUMMARIES */}
            <section id="summary" className="flex scroll-mt-[96px] flex-col gap-3.5">
              <h2 className={h2}>Summary examples</h2>
              <p className="text-[17px] leading-[1.65] text-[#3F3F3F]">Two or three lines: your level, your field and one result.</p>
              <div className="border-b border-[#EEEEEB]">
                {e.summaries.map((s) => (
                  <div key={s.level} className="flex flex-col gap-2 border-t border-[#EEEEEB] py-4 sm:flex-row sm:gap-5">
                    <span className="shrink-0 text-[14px] text-[#6B6B6B] sm:w-[120px] sm:pt-0.5">{s.level}</span>
                    <p className="flex-1 text-[16px] leading-[1.65]">{s.text}</p>
                    <CopyButton text={s.text} />
                  </div>
                ))}
              </div>
            </section>

            {/* BULLETS */}
            <section id="bullets" className="flex scroll-mt-[96px] flex-col gap-3.5">
              <h2 className={h2}>Bullet point examples</h2>
              <p className="text-[17px] leading-[1.65] text-[#3F3F3F]">
                Turn duties into results: what you did, how, and what changed.
              </p>
              <ul className="border-b border-[#EEEEEB] sm:hidden">
                {e.bullets.map((b) => (
                  <li key={b.skill} className="border-t border-[#EEEEEB] py-4 text-[15px] leading-[1.55]">
                    <p className="font-medium">{b.skill}</p>
                    <p className="mt-1 text-[#6B6B6B] line-through decoration-[#C9C9C4]">{b.weak}</p>
                    <p className="mt-1">{b.strong}</p>
                  </li>
                ))}
              </ul>
              <div className="hidden sm:block">
                <table className="w-full border-collapse text-[15px]">
                  <thead>
                    <tr className="text-left text-[#6B6B6B]">
                      <th className="w-[18%] border-b border-[#E5E5E2] py-3 pr-4 font-medium">Skill</th>
                      <th className="w-[30%] border-b border-[#E5E5E2] py-3 pr-4 font-medium">Instead of</th>
                      <th className="border-b border-[#E5E5E2] py-3 font-medium">Write</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.bullets.map((b) => (
                      <tr key={b.skill} className="align-top">
                        <td className="border-b border-[#EEEEEB] py-3.5 pr-4 font-medium">{b.skill}</td>
                        <td className="border-b border-[#EEEEEB] py-3.5 pr-4 text-[#6B6B6B]">{b.weak}</td>
                        <td className="border-b border-[#EEEEEB] py-3.5">{b.strong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* KEYWORDS */}
            <section id="keywords" className="flex scroll-mt-[96px] flex-col gap-3.5">
              <h2 className={h2}>Keywords and skills for {roleLower(e.role)}s</h2>
              <p className="text-[17px] leading-[1.65] text-[#3F3F3F]">
                {`These come up often in ${roleLower(e.role)} job posts. Include only the ones you can back up in an interview, and use the exact wording from the post you're applying to.`}
              </p>
              <ul className="flex flex-wrap gap-2">
                {e.keywords.map((k) => (
                  <li key={k} className="rounded-full border border-[#E5E5E2] px-3.5 py-1.5 text-[14px]">
                    {k}
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA */}
            <section className="flex flex-col items-start justify-between gap-5 rounded-[20px] bg-[#111111] p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <p className="text-[22px] font-semibold tracking-[-0.02em] sm:text-[24px]">
                  How does your {roleLower(e.role)} resume compare?
                </p>
                <p className="mt-1.5 text-[15px] text-[#B5B5B0]">
                  Free ATS score, missing keywords and fixes in about 10 seconds.
                </p>
              </div>
              <CtaLink
                cta="free_ats_check"
                location="resume_example_mid"
                href="/free-ats-check"
                className="inline-flex h-12 shrink-0 items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#111111] hover:bg-[#F5F5F3]"
              >
                Check my resume
              </CtaLink>
            </section>

            {/* TIPS */}
            <section id="tips" className="flex scroll-mt-[96px] flex-col gap-3.5">
              <h2 className={h2}>ATS tips for {roleLower(e.role)}s</h2>
              <ol className="flex list-decimal flex-col gap-3 pl-6 text-[17px] leading-[1.65] text-[#3F3F3F] marker:text-[#6E6E6A]">
                {e.tips.map((t) => (
                  <li key={t.t}>
                    <strong className="font-semibold text-[#111111]">{t.t}.</strong> {t.d}
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-[96px]">
              <h2 className={`${h2} mb-3`}>FAQ</h2>
              <div className="border-b border-[#E5E5E2]">
                {e.faqs.map((f, i) => (
                  <details key={f.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown
                        className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* RELATED */}
            {related.length > 0 ? (
              <section>
                <h2 className={h2}>Related examples</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {related.map((x) => (
                    <Link
                      key={x.slug}
                      href={`/resume-examples/${x.slug}`}
                      className="flex items-center justify-between rounded-xl border border-[#E5E5E2] px-4 py-4 text-[15px] hover:border-[#111111]"
                    >
                      {x.role}
                      <ChevronRight className="h-4 w-4 text-[#6E6E6A]" aria-hidden />
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

/** "HR Generalist" → "HR generalist": lowercases words but keeps acronyms. */
function roleLower(role: string): string {
  return role.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());
}

function ResumeHeading({ children }: { children: string }) {
  return (
    <p className="mt-4 border-b-[1.5px] border-[#1c1c1c] pb-1 text-[11.5px] font-bold uppercase tracking-[0.09em]">
      {children}
    </p>
  );
}
