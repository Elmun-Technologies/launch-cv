import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { PUBLIC_PLANS } from "@/lib/monetization";

export const metadata = buildMarketingMetadata({
  title: "Resume Tools — ATS Checker, Builder, JD Match, Cover Letters",
  description:
    "Every LaunchCV tool in one place: a free ATS checker, an ATS-friendly resume builder, job-description matching, cover letters, interview prep and voice input.",
  pathname: "/features",
  image: FEATURES_OG_IMAGE,
  keywords: ["resume tools", "ATS checker", "AI resume builder", "match resume to job description", "AI cover letter", "interview prep"],
});

const tools = [
  {
    href: "/free-ats-check",
    name: "ATS resume checker",
    d: "Your 0–100 score, what the parser can't read and a fix for each issue.",
    tag: "Free",
    photo: { src: "/images/photos/resume-clipboard.webp", alt: "Resume on a clipboard next to a laptop" },
  },
  {
    href: "/features/resume-builder",
    name: "Resume builder",
    d: "Four ATS-friendly templates, AI bullet rewrites and a PDF that matches the preview.",
    photo: { src: "/images/photos/resume-review-desk.webp", alt: "Resume being reviewed at a desk" },
  },
  {
    href: "/features/jd-alignment",
    name: "Job description match",
    d: "Match score, covered keywords, missing skills and rewrites for one specific posting.",
    photo: { src: "/images/photos/job-seeker-laptop.webp", alt: "Job seeker comparing a resume with a posting" },
  },
  {
    href: "/features/cover-letter",
    name: "Cover letters",
    d: "A letter for this job, written from your resume, in a formal or neutral tone.",
    photo: { src: "/images/photos/handshake-desk.webp", alt: "Two people shaking hands across a desk" },
  },
  {
    href: "/features/interview-prep",
    name: "Interview prep",
    d: "Ten likely questions for the role, with answer outlines from your experience.",
    photo: { src: "/images/photos/interview-panel.webp", alt: "Candidate in an interview with a hiring panel" },
  },
  {
    href: "/features/voice-input",
    name: "Voice input",
    d: "Talk through your experience; turn the transcript into results-first bullets.",
    photo: { src: "/images/photos/role-customer-service.webp", alt: "Professionals wearing headsets" },
  },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "LaunchCV tools",
  itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absoluteUrl(t.href) })),
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[820px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Everything between your resume <span className="text-[#8A8A86]">and the interview.</span>
          </h1>
          <p className="mt-5 max-w-[600px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            Start with the free ATS check. Every other tool is included in each plan, from{" "}
            {PUBLIC_PLANS.starter.priceDisplay}/month — plans only differ in monthly limits.
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-8">
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="group flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#F5F5F3]">
                  <Image
                    src={t.photo.src}
                    alt={t.photo.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  {t.tag ? (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-[#0E7A48]">
                      {t.tag}
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-[18px] font-semibold group-hover:text-[#1D4ED8]">{t.name}</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{t.d}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
                Not sure where to start? <span className="text-[#8A8A86]">Check your resume.</span>
              </h2>
              <p className="mt-2 text-[16px] text-[#3F3F3F]">Free, no sign-up, about 10 seconds.</p>
            </div>
            <CtaLink
              cta="free_ats_check"
              location="features_index"
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
