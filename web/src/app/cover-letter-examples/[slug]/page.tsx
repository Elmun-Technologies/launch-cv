import type { Metadata } from "next";
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
    title: `${e.role} Cover Letter Example (Annotated)`,
    description: `A ${role} cover letter example, paragraph by paragraph: what each part does, tips for your own and how it pairs with a ${role} resume.`,
    pathname: `/cover-letter-examples/${slug}`,
    image: DEFAULT_OG_IMAGE,
    keywords: [`${role} cover letter`, `${role} cover letter example`, `cover letter for ${role}`, `${role} cover letter sample`],
  });
}

const UPDATED = "2026-10-27";
const h2 = "text-[26px] font-semibold leading-[1.15] tracking-[-0.025em] sm:text-[30px]";

export function letterText(c: CoverLetterExample, name: string): string {
  return [`Dear ${c.target.hiringManager},`, "", ...c.paragraphs.flatMap((p) => [p, ""]), "Sincerely,", name].join("\n");
}

export default async function CoverLetterExamplePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getCoverLetterExample(slug);
  const e = getResumeExample(slug);
  if (!c || !e) notFound();

  const r = e.resume;
  const url = absoluteUrl(`/cover-letter-examples/${slug}`);
  const startHref = `/register?next=${encodeURIComponent(`/resume/new?example=${slug}`)}`;
  const related = e.related.map((s) => ({ e: getResumeExample(s), c: getCoverLetterExample(s) })).filter((x) => x.e && x.c);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${e.role} cover letter example`,
        url,
        dateModified: UPDATED,
        author: { "@type": "Person", name: SITE_AUTHOR.name, url: SITE_AUTHOR.url },
        publisher: { "@type": "Organization", name: "LaunchCV", url: absoluteUrl("/") },
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
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1 pt-[96px]">
        <section className="mx-auto max-w-[1200px] px-5 pt-8 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#111111]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/cover-letter-examples" className="hover:text-[#111111]">
              Cover letter examples
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[#111111]">{e.role}</span>
          </nav>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[52px]">
                {e.role} cover letter example. <span className="text-[#8A8A86]">Annotated, paragraph by paragraph.</span>
              </h1>
              <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-[#3F3F3F]">
                {r.name} is applying for a {roleLower(c.target.title)} role at {c.target.company}. The letter goes with
                their{" "}
                <Link href={`/resume-examples/${slug}`} className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                  {roleLower(e.role)} resume example
                </Link>{" "}
                — same person, same results — so you can see how the two work together.
              </p>
            </div>
            <div className="flex flex-col gap-3.5 lg:w-[340px]">
              <p className="text-[14px] text-[#6B6B6B]">{SITE_AUTHOR.name} · Updated October 2026</p>
              <div className="flex flex-wrap gap-2">
                <CtaLink
                  cta="use_example"
                  location="cover_letter_example"
                  href={startHref}
                  className="inline-flex h-12 items-center rounded-full bg-[#2563EB] px-5 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
                >
                  Start from this resume
                </CtaLink>
                <CtaLink
                  cta="free_ats_check"
                  location="cover_letter_example"
                  href="/free-ats-check"
                  className="inline-flex h-12 items-center rounded-full border border-[#D9D9D5] px-5 text-[15px] font-medium hover:border-[#111111]"
                >
                  Check my resume
                </CtaLink>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-12 sm:px-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className={h2}>{e.role} cover letter</h2>
            <CopyButton text={letterText(c, r.name)} label="Copy text" />
          </div>
          <div className="rounded-2xl bg-[#F5F5F3] p-3 sm:p-9">
            <div className="mx-auto grid max-w-[1040px] gap-6 lg:grid-cols-[minmax(0,680px)_1fr] lg:gap-10">
              <div className="rounded bg-white px-6 py-8 text-[15px] leading-[1.65] text-[#1c1c1c] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)] sm:px-12 sm:py-11">
                <p className="text-[20px] font-bold">{r.name}</p>
                <p className="text-[13px] text-[#555]">{r.contact}</p>
                <p className="mt-6 text-[14px] text-[#555]">
                  {c.target.hiringManager}
                  <br />
                  {c.target.title}, {c.target.company}
                </p>
                <p className="mt-6">Dear {c.target.hiringManager},</p>
                {c.paragraphs.map((p, i) => (
                  <p key={i} className="mt-4">
                    <span className="mr-2 select-none align-super text-[11px] font-semibold text-[#2563EB]" aria-hidden>
                      {i + 1}
                    </span>
                    {p}
                  </p>
                ))}
                <p className="mt-6">Sincerely,</p>
                <p>{r.name}</p>
              </div>
              <ol className="flex flex-col gap-4 self-start text-[15px] leading-[1.55] text-[#3F3F3F] lg:pt-8">
                {c.annotations.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-[#2563EB]">
                      {i + 1}
                    </span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <p className="mx-auto mt-4 max-w-[1040px] text-[13px] text-[#6B6B6B]">
              Sample letter. Names, companies and figures are illustrative.
            </p>
          </div>
        </section>

        <div className="mx-auto flex max-w-[860px] flex-col gap-16 px-5 pb-24 pt-16 sm:px-8">
          <section>
            <h2 className={h2}>Tips for your {roleLower(e.role)} cover letter</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {c.tips.map((t, i) => (
                <li key={t.t} className="flex gap-4">
                  <span className="pt-0.5 text-[15px] tabular-nums text-[#6E6E6A]">0{i + 1}</span>
                  <div>
                    <p className="text-[17px] font-semibold">{t.t}</p>
                    <p className="mt-1 text-[16px] leading-[1.6] text-[#3F3F3F]">{t.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">Write yours from your own resume</p>
              <p className="mt-2 max-w-[460px] text-[15px] leading-[1.6] text-[#3F3F3F]">
                LaunchCV drafts a cover letter from your resume and the job post, then you edit it. Included in every
                plan.
              </p>
            </div>
            <Link href="/features/cover-letter" className="soha-btn-secondary shrink-0 text-center">
              How it works
            </Link>
          </section>

          <section>
            <h2 className={`${h2} mb-3`}>FAQ</h2>
            <div className="border-b border-[#E5E5E2]">
              {c.faqs.map((f, i) => (
                <details key={f.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {related.length > 0 ? (
            <section>
              <h2 className={h2}>Related cover letters</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((x) => (
                  <Link
                    key={x.e!.slug}
                    href={`/cover-letter-examples/${x.e!.slug}`}
                    className="flex items-center justify-between rounded-xl border border-[#E5E5E2] px-4 py-4 text-[15px] hover:border-[#111111]"
                  >
                    {x.e!.role}
                    <ChevronRight className="h-4 w-4 text-[#6E6E6A]" aria-hidden />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
