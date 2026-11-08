import { BarChart3, Code2, Headphones, PenTool, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { btnPrimary, btnWhite, labelCls } from "@/components/site/ui";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { SITE_AUTHOR, SITE_AUTHOR_ID } from "@/lib/author";
import { getPageCopy } from "@/lib/cms/page-copy";
import { planNameList } from "@/lib/monetization";

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
    founder: { "@type": "Person", "@id": SITE_AUTHOR_ID, name: SITE_AUTHOR.name, jobTitle: SITE_AUTHOR.role, url: SITE_AUTHOR.url },
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
    d: `A free ATS check, plus the ${planNameList("and")}. 7-day refund on monthly plans.`,
    card: "lc-card",
    num: "text-[#5440e8]",
    body: "text-[#4a4862]",
  },
];

/** Who we build for — one card per kind of job seeker, with what the tools do for them. */
const roles: { label: string; d: string; Icon: LucideIcon; card: string; icon: string; body: string }[] = [
  {
    label: "Software engineers",
    d: "A skills section that names the stack the job post asks for.",
    Icon: Code2,
    card: "bg-[#c9c0ff] text-[#121226]",
    icon: "bg-white text-[#5440e8]",
    body: "text-[#2b2752]",
  },
  {
    label: "Designers",
    d: "A one-column layout the software can read, with the portfolio link kept.",
    Icon: PenTool,
    card: "bg-[#ff7a33] text-[#111118]",
    icon: "bg-white text-[#111118]",
    body: "text-[#2a1405]",
  },
  {
    label: "Customer service",
    d: "Bullets that turn daily duties into results a recruiter can scan.",
    Icon: Headphones,
    card: "bg-[#5440e8] text-white",
    icon: "bg-white text-[#5440e8]",
    body: "text-[#e4dfff]",
  },
  {
    label: "Data analysts",
    d: "Tools, methods and numbers matched to the words in each job post.",
    Icon: BarChart3,
    card: "bg-[#e4dfff] text-[#121226]",
    icon: "bg-white text-[#5440e8]",
    body: "text-[#4a4862]",
  },
];

export const revalidate = 300;

export default async function AboutPage() {
  const copy = await getPageCopy("about.mission");
  const initials = SITE_AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <SiteShell>
      <JsonLd data={aboutLd} />

      {/* HERO */}
      <section className="mx-auto max-w-[1360px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-10">
        <p className={labelCls}>/ About</p>
        <h1 className="mt-3.5 max-w-[1060px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-5 sm:text-[56px] sm:leading-[1.04] lg:text-[68px] lg:leading-[70px]">
          {copy.title} {copy.titleAccent ? <span className="text-[#5440e8]">{copy.titleAccent}</span> : null}
        </h1>
      </section>

      {/* STORY + PRINCIPLES */}
      <section className="mx-auto grid max-w-[1360px] items-stretch gap-2.5 px-4 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-10 lg:pt-14">
        <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#111118] px-[22px] pb-[22px] pt-7 text-[#e9e7f3] lg:min-h-[520px] lg:rounded-[36px] lg:p-12">
          <p aria-hidden="true" className="lc-poster absolute -right-1.5 bottom-1.5 m-0 text-right text-[56px] leading-[52px] text-[#2a2840] sm:text-[88px] sm:leading-[82px] lg:bottom-6 lg:right-9 lg:text-[120px] lg:leading-[110px]">
            SINCE
            <br />
            2024
          </p>
          <div className="relative flex flex-col gap-3.5 text-[16px] leading-[26px] lg:gap-[18px] lg:text-[18px] lg:leading-[29px]">
            {copy.paragraphs.map((p, i) => (
              // Phones keep the first two paragraphs, like the design.
              <p key={i} className={i > 1 ? "hidden sm:block" : undefined}>
                {p}
              </p>
            ))}
          </div>
          {/* Top padding keeps the story clear of the SINCE 2024 watermark. */}
          <div className="relative mt-auto pt-[72px] sm:pt-[110px] lg:pt-[150px]">
            <div className="flex w-fit items-center gap-2.5 rounded-full bg-white py-[7px] pl-[7px] pr-4 text-[#121226] lg:gap-3 lg:py-2.5 lg:pl-2.5 lg:pr-5">
              <span aria-hidden="true" className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[13px] font-extrabold text-white lg:h-11 lg:w-11 lg:text-[16px]">
                {initials}
              </span>
              <span className="text-[13px] font-bold sm:hidden">
                {SITE_AUTHOR.name} · Founder
              </span>
              <span className="hidden sm:block">
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
      <section className="mx-auto max-w-[1360px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-[130px]">
        <div className="lc-reveal mx-auto max-w-[980px] sm:text-center">
          <p className={labelCls}>/ Who we build for</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            Anyone applying through a form. <span className="hidden sm:inline">Which is almost everyone.</span>
          </h2>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-4 lg:grid-cols-4">
          {roles.map((r) => (
            <li key={r.label} className="lc-reveal">
              <div className={`flex h-full flex-col rounded-[22px] p-4 sm:rounded-3xl sm:p-6 ${r.card}`}>
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${r.icon}`}>
                  <r.Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-[16px] font-bold leading-5 sm:mt-10 sm:text-[20px] sm:leading-6 sm:tracking-[-0.01em]">{r.label}</h3>
                <p className={`mt-1.5 text-[13px] leading-[19px] sm:text-[15px] sm:leading-[23px] ${r.body}`}>{r.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* CONTACT */}
      <section className="mx-auto grid max-w-[1360px] gap-3 px-4 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-4 lg:px-10 lg:pt-[130px]">
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-[22px] py-7 text-white sm:p-10 lg:rounded-[36px] lg:p-14">
          <p className={`${labelCls} !text-[#c9c0ff]`}>/ Get in touch</p>
          <h2 className="lc-h2 mt-3.5 text-white sm:mt-5">
            A person reads <span className="!text-[#9a97b3]">every email.</span>
          </h2>
          <p className="mt-[18px] hidden max-w-[460px] text-[16px] leading-[26px] text-[#c9c7d8] sm:block sm:text-[17px] sm:leading-[27px]">
            Questions about billing, your account or the product — write to us and we&apos;ll get back to you.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-[30px] sm:flex-row">
            <a href="mailto:support@launch-cv.com" className={`${btnPrimary} !py-4 sm:!py-[17px]`}>
              support@launch-cv.com
            </a>
            <Link href="/contact" className={`${btnWhite} max-sm:hidden`}>
              All contact options
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-[#9a97b3] sm:hidden">Elmun Technologies LLC</p>
        </div>
        <div className="lc-card lc-reveal hidden flex-col justify-between gap-8 rounded-[28px] p-7 sm:flex sm:p-10 lg:rounded-[36px]">
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
