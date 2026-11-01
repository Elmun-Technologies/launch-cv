import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { btnPrimary, btnWhite, labelCls } from "@/components/site/ui";
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
    "@id": absoluteUrl("/#organization"),
    name: "LaunchCV",
    legalName: "Elmun Technologies LLC",
    url: absoluteUrl("/"),
    email: "support@launch-cv.com",
    founder: { "@type": "Person", name: SITE_AUTHOR.name, jobTitle: SITE_AUTHOR.role },
  },
};

const principles = [
  {
    t: "Your data stays yours",
    d: "We never sell your resumes or use them to advertise. You can download or delete everything in your account.",
    card: "bg-[#5440e8] text-white",
    num: "text-[#e4dfff]",
    body: "text-[#e4dfff]",
  },
  {
    t: "No made-up experience",
    d: "Rewrites only use facts from your resume, and you approve every change.",
    card: "bg-[#c9c0ff] text-[#111118]",
    num: "text-[#3a2bb8]",
    body: "text-[#2b2752]",
  },
  {
    t: "Plain prices",
    d: "A free ATS check, two monthly plans and Lifetime. 7-day refund on monthly plans.",
    card: "lc-card",
    num: "text-[#5440e8]",
    body: "text-[#4a4862]",
  },
];

/** Who we build for — cut-out portraits stand in for each kind of job seeker. */
const roles = [
  { label: "Software engineers", src: "/images/people/man-blazer-glasses.webp", w: 767, alt: "Man in glasses and a blazer", bg: "bg-[#c9c0ff]" },
  { label: "Designers", src: "/images/people/woman-hoodie.webp", w: 856, alt: "Woman in a denim jacket", bg: "bg-[#ff7a33]" },
  { label: "Customer service", src: "/images/people/man-white-tee.webp", w: 739, alt: "Man in a white t-shirt", bg: "bg-[#5440e8]" },
  { label: "Data analysts", src: "/images/people/woman-blazer-laptop.webp", w: 620, alt: "Woman in a grey blazer", bg: "bg-[#e4dfff]" },
];

export default function AboutPage() {
  const initials = SITE_AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <SiteShell>
      <JsonLd data={aboutLd} />

      {/* HERO */}
      <section className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-10">
        <p className={labelCls}>/ About</p>
        <h1 className="mt-3.5 max-w-[1060px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-5 sm:text-[56px] sm:leading-[1.04] lg:text-[68px] lg:leading-[70px]">
          We build tools for the part of job hunting nobody sees. <span className="text-[#5440e8]">The software.</span>
        </h1>
      </section>

      {/* STORY + PRINCIPLES */}
      <section className="mx-auto grid max-w-[1280px] items-stretch gap-2.5 px-4 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-14">
        <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#111118] px-[22px] pb-[22px] pt-7 text-[#e9e7f3] lg:min-h-[520px] lg:rounded-[36px] lg:p-12">
          <p aria-hidden="true" className="lc-poster absolute -right-1.5 bottom-1.5 m-0 text-right text-[56px] leading-[52px] text-[#2a2840] sm:text-[88px] sm:leading-[82px] lg:bottom-6 lg:right-9 lg:text-[120px] lg:leading-[110px]">
            SINCE
            <br />
            2024
          </p>
          <div className="relative flex flex-col gap-3.5 text-[16px] leading-[26px] lg:gap-[18px] lg:text-[18px] lg:leading-[29px]">
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
          </div>
          <div className="relative mt-auto pt-10">
          <div className="flex w-fit items-center gap-2.5 rounded-full bg-white py-[7px] pl-[7px] pr-4 text-[#121226] lg:gap-3 lg:py-2.5 lg:pl-2.5 lg:pr-5">
            <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#5440e8] text-[13px] font-extrabold text-white lg:h-11 lg:w-11 lg:text-[16px]">
              {initials}
            </span>
            <span>
              <span className="block text-[13px] font-bold lg:text-[15px]">{SITE_AUTHOR.name}</span>
              <span className="block text-[12px] text-[#66647c] lg:text-[13px]">Founder</span>
            </span>
          </div>
          </div>
        </div>

        <ol className="grid gap-2.5 lg:grid-rows-3 lg:gap-3">
          {principles.map((p, i) => (
            <li key={p.t} className={`lc-rise rounded-[24px] p-[22px] lg:rounded-[28px] lg:p-8 ${p.card}`}>
              <p className={`lc-mono hidden text-[12px] lg:block ${p.num}`}>0{i + 1}</p>
              <h2 className="text-[20px] font-extrabold tracking-[-0.02em] lg:mt-3.5 lg:text-[26px]">{p.t}</h2>
              <p className={`mt-1.5 text-[14px] leading-[21px] lg:mt-2 lg:text-[16px] lg:leading-[25px] ${p.body}`}>{p.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHO WE BUILD FOR */}
      <section className="mx-auto max-w-[1280px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-[130px]">
        <div className="lc-reveal mx-auto max-w-[980px] sm:text-center">
          <p className={labelCls}>/ Who we build for</p>
          <h2 className="lc-h2 mt-5">Anyone applying through a form.</h2>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-x-3.5 gap-y-[18px] sm:mt-12 sm:gap-8 lg:grid-cols-4">
          {roles.map((r) => (
            <li key={r.label} className="lc-reveal">
              <figure className="group">
                <div className={`relative aspect-square w-full overflow-hidden rounded-full ${r.bg}`}>
                  <Image
                    src={r.src}
                    alt={r.alt}
                    width={r.w}
                    height={1080}
                    sizes="(min-width: 1024px) 280px, 45vw"
                    className="absolute left-1/2 top-[6%] h-[140%] w-auto max-w-none -translate-x-1/2 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                </div>
                <figcaption className="mt-2 text-center text-[14px] font-bold sm:mt-3.5 sm:text-[17px]">{r.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* CONTACT */}
      <section className="mx-auto grid max-w-[1280px] gap-3 px-4 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:px-10 lg:pt-[130px]">
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-[22px] py-7 text-white sm:p-10 lg:rounded-[36px] lg:p-14">
          <p className={`${labelCls} !text-[#c9c0ff]`}>/ Get in touch</p>
          <h2 className="lc-h2 mt-5 text-white">
            A person reads <span className="!text-[#9a97b3]">every email.</span>
          </h2>
          <p className="mt-[18px] max-w-[460px] text-[16px] leading-[26px] text-[#c9c7d8] sm:text-[17px] sm:leading-[27px]">
            Questions about billing, your account or the product — write to us and we&apos;ll get back to you.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:mt-[30px] sm:flex-row">
            <a href="mailto:support@launch-cv.com" className={btnPrimary}>
              support@launch-cv.com
            </a>
            <Link href="/contact" className={btnWhite}>
              All contact options
            </Link>
          </div>
        </div>
        <div className="lc-card lc-reveal flex flex-col justify-between gap-8 rounded-[28px] p-7 sm:p-10 lg:rounded-[36px]">
          <div>
            <p className="text-[13px] font-bold tracking-[0.08em] text-[#66647c]">COMPANY</p>
            <p className="mt-3 text-[22px] font-extrabold sm:text-[24px]">Elmun Technologies LLC</p>
            <p className="mt-1.5 text-[16px] text-[#4a4862]">Makers of LaunchCV</p>
          </div>
          <div className="flex flex-col items-start gap-1 text-[15px] font-semibold">
            <Link href="/legal/privacy" className="inline-flex min-h-[44px] items-center text-[#5440e8] hover:text-[#4430d6]">
              <span className="lc-link">Privacy policy →</span>
            </Link>
            <Link href="/legal/terms" className="inline-flex min-h-[44px] items-center text-[#5440e8] hover:text-[#4430d6]">
              <span className="lc-link">Terms of service →</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
