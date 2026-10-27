import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";

export const metadata = buildMarketingMetadata({
  title: "About LaunchCV — Who We Are and Why We Built It",
  description:
    "LaunchCV shows job seekers what applicant tracking software sees in their resume and helps them fix it — without inventing anything. Built by Elmun Technologies.",
  pathname: "/about",
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV", "about LaunchCV", "Elmun Technologies", "ATS resume checker", "AI resume builder"],
});

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About LaunchCV",
  url: absoluteUrl("/about"),
  description: "Who builds LaunchCV and why.",
  mainEntity: {
    "@type": "Organization",
    name: "LaunchCV",
    legalName: "Elmun Technologies LLC",
    url: absoluteUrl("/"),
    email: "support@launch-cv.com",
    founder: { "@type": "Person", name: SITE_AUTHOR.name, jobTitle: SITE_AUTHOR.role },
  },
};

const principles = [
  { t: "Your data stays yours", d: "We never sell your resumes or use them to advertise. You can download or delete everything in your account." },
  { t: "No made-up experience", d: "Rewrites only use facts from your resume, and you approve every change." },
  { t: "Plain prices", d: "A free ATS check, two monthly plans and Lifetime. 7-day refund on monthly plans." },
];

const roles = [
  { src: "/images/photos/role-software-engineer.webp", label: "Software engineers", alt: "Software engineer working at a laptop" },
  { src: "/images/photos/role-designer.webp", label: "Designers", alt: "Designer reviewing work on screen" },
  { src: "/images/photos/role-customer-service.webp", label: "Customer service", alt: "Customer service specialist with a headset" },
  { src: "/images/photos/role-data-analyst.webp", label: "Data analysts", alt: "Data analyst looking at charts" },
];

export default function AboutPage() {
  const initials = SITE_AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={aboutLd} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[900px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[60px]">
            We build tools for the part of job hunting nobody sees.{" "}
            <span className="text-[#8A8A86]">The software.</span>
          </h1>
        </section>

        <section className="mx-auto flex max-w-[1200px] flex-col gap-12 px-5 pt-14 sm:px-8 lg:flex-row lg:gap-16">
          <div className="flex flex-col gap-5 text-[17px] leading-[1.65] text-[#3F3F3F] lg:w-[62%]">
            <p>
              LaunchCV started in 2024 after watching qualified friends apply to dozens of jobs and hear nothing back.
              Their experience was fine. Their resumes just weren&apos;t being read — tables the software skipped,
              headings it didn&apos;t recognize, keywords it couldn&apos;t find.
            </p>
            <p>
              So we built a checker that shows you exactly what that software sees, and tools that help you fix it
              without inventing anything. Every suggestion uses facts from your own resume, and you approve every
              change.
            </p>
            <p>We&apos;re a small team at Elmun Technologies, and we read every support email.</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F3] font-semibold text-[#111111]">
                {initials}
              </span>
              <div>
                <p className="font-semibold text-[#111111]">{SITE_AUTHOR.name}</p>
                <p className="text-[15px] text-[#6B6B6B]">Founder</p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col border-b border-[#EEEEEB]">
            {principles.map((p) => (
              <div key={p.t} className="border-t border-[#EEEEEB] py-5">
                <p className="font-semibold">{p.t}</p>
                <p className="mt-1 text-[15px] leading-[1.6] text-[#3F3F3F]">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-[104px]">
          <h2 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">
            Who we build for. <span className="text-[#8A8A86]">Anyone applying through a form.</span>
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {roles.map((r) => (
              <figure key={r.label}>
                <Image
                  src={r.src}
                  alt={r.alt}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 280px, 50vw"
                  className="h-[220px] w-full rounded-2xl object-cover object-[center_30%] sm:h-[300px]"
                />
                <figcaption className="mt-2.5 text-[15px] font-medium">{r.label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F5F5F3] md:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-4 p-8 sm:p-12">
              <h2 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">
                Get in touch. <span className="text-[#8A8A86]">A person reads every email.</span>
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#3F3F3F]">
                Questions about billing, your account or the product — write to us and we&apos;ll get back to you.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a
                  href="mailto:support@launch-cv.com"
                  className="inline-flex h-12 items-center rounded-full bg-[#111111] px-6 text-[15px] font-medium text-white hover:bg-black"
                >
                  support@launch-cv.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center rounded-full border border-[#D9D9D5] bg-white px-6 text-[15px] font-medium hover:border-[#111111]"
                >
                  All contact options
                </Link>
              </div>
            </div>
            <div className="relative min-h-[260px] md:w-[42%]">
              <Image
                src="/images/photos/colleagues-celebrate.webp"
                alt="Colleagues celebrating good news at work"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
