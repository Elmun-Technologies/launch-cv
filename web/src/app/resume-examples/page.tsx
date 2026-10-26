import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { RESUME_EXAMPLES, type ResumeExample } from "@/lib/resume-examples";

export const metadata = buildMarketingMetadata({
  title: "Resume Examples by Job — With Keywords & Bullet Points",
  description:
    "Resume examples for software engineers, product managers, analysts, marketers, designers and more — each with summary and bullet examples, keywords and ATS tips.",
  pathname: "/resume-examples",
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume examples", "resume samples", "resume examples by job", "ATS resume examples"],
});

const GROUPS: ResumeExample["group"][] = ["Tech & product", "Business", "Creative", "People & service"];

const ld = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Resume examples",
  url: absoluteUrl("/resume-examples"),
  hasPart: RESUME_EXAMPLES.map((e) => ({
    "@type": "Article",
    headline: `${e.role} resume example`,
    url: absoluteUrl(`/resume-examples/${e.slug}`),
  })),
};

export default function ResumeExamplesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[820px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Resume examples. <span className="text-[#8A8A86]">Written for the job, readable by the software.</span>
          </h1>
          <p className="mt-5 max-w-[600px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            Each example comes with summary lines and bullet points you can adapt, the keywords recruiters search for
            in that role, and tips for getting through applicant tracking systems.
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
            {GROUPS.flatMap((g) => RESUME_EXAMPLES.filter((e) => e.group === g)).map((e) => (
              <Link key={e.slug} href={`/resume-examples/${e.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F5F3]">
                  <Image
                    src={e.photo.src}
                    alt={e.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 280px, 50vw"
                    className="object-cover object-[center_30%] transition duration-300 group-hover:scale-[1.02]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[12px] text-[#3F3F3F]">
                    {e.group}
                  </span>
                </div>
                <p className="mt-3 text-[16px] font-semibold leading-snug group-hover:text-[#1D4ED8]">{e.role} resume</p>
                <p className="mt-0.5 text-[14px] text-[#6B6B6B]">{e.level}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
                Already have a resume? <span className="text-[#8A8A86]">See how it scores.</span>
              </h2>
              <p className="mt-2 text-[16px] text-[#3F3F3F]">Free ATS check, no sign-up, about 10 seconds.</p>
            </div>
            <CtaLink
              cta="free_ats_check"
              location="resume_examples_index"
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
