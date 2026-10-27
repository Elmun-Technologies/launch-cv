import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { RESUME_EXAMPLES, type ResumeExample } from "@/lib/resume-examples";
import { getCoverLetterExample } from "@/lib/cover-letter-examples";

export const metadata = buildMarketingMetadata({
  title: "Cover Letter Examples by Job — Annotated",
  description:
    "Cover letter examples for nurses, teachers, engineers, analysts, managers and more — each annotated paragraph by paragraph, with tips and the matching resume.",
  pathname: "/cover-letter-examples",
  image: DEFAULT_OG_IMAGE,
  keywords: ["cover letter examples", "cover letter samples", "cover letter examples by job", "how to write a cover letter"],
});

const GROUPS: ResumeExample["group"][] = ["Tech & product", "Business", "Creative", "People & service"];

const items = GROUPS.flatMap((g) => RESUME_EXAMPLES.filter((e) => e.group === g))
  .map((e) => ({ e, c: getCoverLetterExample(e.slug) }))
  .filter((x): x is { e: ResumeExample; c: NonNullable<typeof x.c> } => !!x.c);

/** The opening line always names the role; the sentence after it is the hook worth previewing. */
const hook = (p: string) => {
  // Split only where a sentence ends and the next begins, so "99.99%" and "£3.4M" stay whole.
  const sentences = p.split(/(?<=[.!?])\s+(?=[A-Z])/);
  return (sentences[1] ?? sentences[0]).trim();
};

const ld = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Cover letter examples",
  url: absoluteUrl("/cover-letter-examples"),
  hasPart: items.map(({ e }) => ({
    "@type": "Article",
    headline: `${e.role} cover letter example`,
    url: absoluteUrl(`/cover-letter-examples/${e.slug}`),
  })),
};

export default function CoverLetterExamplesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[860px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Cover letter examples. <span className="text-[#8A8A86]">Short, specific, and about the job.</span>
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            Each letter is written by the same person as one of our resume examples, so you can see how a letter and a
            resume work together. Every paragraph is annotated with what it&apos;s doing.
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-8">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ e, c }) => (
              <li key={e.slug}>
                <Link
                  href={`/cover-letter-examples/${e.slug}`}
                  className="group flex h-full flex-col rounded-[14px] border border-[#E5E5E2] p-5 hover:border-[#111111]"
                >
                  <span className="text-[13px] text-[#6B6B6B]">{e.group}</span>
                  <span className="mt-1 text-[17px] font-semibold group-hover:text-[#1D4ED8]">{e.role} cover letter</span>
                  <span className="mt-0.5 text-[14px] text-[#6B6B6B]">
                    For {c.target.title} at {c.target.company}
                  </span>
                  <span className="mt-3 line-clamp-3 text-[15px] leading-[1.55] text-[#3F3F3F]">
                    &ldquo;{hook(c.paragraphs[0] ?? "")}&rdquo;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
                The resume comes first. <span className="text-[#8A8A86]">Check yours free.</span>
              </h2>
              <p className="mt-2 text-[16px] text-[#3F3F3F]">See how an ATS reads it in about 10 seconds — no sign-up.</p>
            </div>
            <CtaLink
              cta="free_ats_check"
              location="cover_letter_examples_index"
              href="/free-ats-check"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#2563EB] px-6 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
            >
              Check my resume — free
            </CtaLink>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
