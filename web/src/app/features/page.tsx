import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { btn, container, labelCls } from "@/components/site/ui";
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

type Tool = {
  href: string;
  name: string;
  d: string;
  tag: string;
  free: boolean;
  bg: string;
  poster: string;
  posterColor: string;
  widget: ReactNode;
};

const Ex = () => <span className="block text-[11px] font-semibold text-[#66647c]">Example</span>;

const tools: Tool[] = [
  {
    href: "/free-ats-check",
    name: "ATS resume checker",
    d: "Your 0–100 score, what the parser can't read and a fix for each issue.",
    tag: "Free",
    free: true,
    bg: "#5440e8",
    poster: "ATS",
    posterColor: "#6a58ee",
    widget: (
      <>
        <svg viewBox="0 0 64 64" aria-hidden="true" className="h-11 w-11 lg:h-14 lg:w-14">
          <circle cx="32" cy="32" r="27" fill="none" stroke="#efedf7" strokeWidth="8" />
          <circle cx="32" cy="32" r="27" fill="none" stroke="#22b07d" strokeWidth="8" strokeLinecap="round" strokeDasharray="154 170" transform="rotate(-90 32 32)" />
        </svg>
        <span>
          <Ex />
          <span className="block text-[26px] font-bold leading-[30px] lg:text-[30px] lg:leading-[34px]">91</span>
        </span>
      </>
    ),
  },
  {
    href: "/features/resume-builder",
    name: "Resume builder",
    d: "Four ATS-friendly templates, AI bullet rewrites and a PDF that matches the preview.",
    tag: "Free",
    free: true,
    bg: "#111118",
    poster: "BUILD",
    posterColor: "#2a2840",
    widget: (
      <span className="text-[13px] font-semibold lg:text-[14px]">
        Classic · <b className="text-[#5440e8]">Modern</b> · Minimal · Executive
      </span>
    ),
  },
  {
    href: "/features/jd-alignment",
    name: "Job description match",
    d: "Match score, covered keywords, missing skills and rewrites for one specific posting.",
    tag: "Paid plans",
    free: false,
    bg: "#e4dfff",
    poster: "MATCH",
    posterColor: "#d3cbff",
    widget: (
      <span>
        <Ex />
        <span className="block text-[26px] font-bold leading-[30px] lg:text-[30px] lg:leading-[34px]">
          72 <span className="text-[16px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
        </span>
      </span>
    ),
  },
  {
    href: "/features/cover-letter",
    name: "Cover letters",
    d: "A letter for this job, written from your resume, in a formal or neutral tone.",
    tag: "Paid plans",
    free: false,
    bg: "#c9c0ff",
    poster: "LETTER",
    posterColor: "#b8adff",
    widget: (
      <span className="text-[14px] leading-5">
        <Ex />
        Dear Hiring Team, your posting asks for…
      </span>
    ),
  },
  {
    href: "/features/interview-prep",
    name: "Interview prep",
    d: "Ten likely questions for the role, with answer outlines from your experience.",
    tag: "Paid plans",
    free: false,
    bg: "#ff7a33",
    poster: "PREP",
    posterColor: "#ff9254",
    widget: (
      <span className="text-[14px] font-bold leading-5 lg:text-[15px]">
        <Ex />
        “Tell us about a time research changed your roadmap.”
      </span>
    ),
  },
  {
    href: "/features/voice-input",
    name: "Voice input",
    d: "Talk through your experience; turn the transcript into results-first bullets.",
    tag: "Free in the editor",
    free: true,
    bg: "#111118",
    poster: "SPEAK",
    posterColor: "#2a2840",
    widget: (
      <span aria-hidden="true" className="flex h-[30px] items-center gap-1">
        {[10, 22, 14, 30, 18, 26, 12, 24, 16, 8].map((h, i) => (
          <span key={i} className="w-[5px] rounded-full bg-[#5440e8]" style={{ height: h }} />
        ))}
      </span>
    ),
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
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} pt-4 lg:pt-10`}>
        <p className={labelCls}>/ Tools</p>
        <h1 className="mt-3.5 max-w-[1000px] text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[52px] lg:mt-5 lg:text-[64px] lg:leading-[66px]">
          Everything between your resume <span className="text-[#7c7a94]">and the interview.</span>
        </h1>
        <p className="mt-3.5 max-w-[640px] text-[16px] leading-[25px] text-[#4a4862] sm:text-[18px] sm:leading-7 lg:mt-[22px]">
          Start with the free ATS check. The AI tools are included in each paid plan, from {PUBLIC_PLANS.starter.priceDisplay}/month — plans only
          differ in monthly limits.
        </p>
      </section>

      {/* TOOLS */}
      <section className={`${container} pt-[22px] lg:pt-12`}>
        <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.href} className={i > 2 ? "lc-reveal" : undefined}>
              <Link href={t.href} className="lc-card lc-rise group block h-full rounded-3xl p-2 text-[#121226] lg:rounded-[30px]">
                <div className="relative h-[170px] overflow-hidden rounded-[18px] lg:h-[230px] lg:rounded-[22px]" style={{ background: t.bg }}>
                  <p aria-hidden="true" className="lc-poster absolute left-[18px] top-3 m-0 text-[56px] leading-[56px] lg:text-[76px] lg:leading-[76px]" style={{ color: t.posterColor }}>
                    {t.poster}
                  </p>
                  <span className={`absolute right-3.5 top-3.5 rounded-full px-2.5 py-[5px] text-[12px] font-bold text-[#111118] ${t.free ? "bg-[#22b07d]" : "bg-white"}`}>{t.tag}</span>
                  <div aria-hidden="true" className="lc-float absolute bottom-4 right-4 flex max-w-[78%] items-center gap-2.5 rounded-[18px] bg-white px-4 py-3 transition-transform duration-300 group-hover:-translate-y-1 lg:max-w-[70%]">
                    {t.widget}
                  </div>
                </div>
                <div className="px-2.5 pb-2.5 pt-3.5 lg:px-3 lg:pt-[18px]">
                  <h2 className="text-[19px] font-extrabold tracking-[-0.015em] lg:text-[22px]">{t.name}</h2>
                  <p className="mt-1.5 text-[14px] leading-[21px] text-[#4a4862] lg:text-[15px] lg:leading-[23px]">{t.d}</p>
                  <p className="mt-3 text-[14px] font-bold text-[#5440e8]">
                    <span className="lc-link">Open</span> <span aria-hidden="true">→</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* START HERE */}
      <section className={`${container} pb-4 pt-14 lg:pt-[110px]`}>
        <div className="lc-reveal relative overflow-hidden rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex lg:h-[420px] lg:items-end lg:rounded-[36px] lg:bg-[#111118] lg:p-16">
          <p aria-hidden="true" className="lc-poster absolute left-14 top-10 m-0 hidden text-[110px] leading-[110px] text-[#2a2840] lg:block">
            START HERE
          </p>
          <div aria-hidden="true" className="absolute bottom-[-160px] right-[60px] hidden h-[440px] w-[440px] rounded-full bg-[#5440e8] lg:block" />
          <Image
            src="/images/people/nurse-arms-crossed.webp"
            alt="Smiling nurse in blue scrubs, arms crossed"
            width={759}
            height={1080}
            sizes="267px"
            className="absolute bottom-0 right-[60px] hidden h-[380px] w-auto lg:block"
          />
          <div className="relative z-10 max-w-[520px]">
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[42px] lg:leading-[48px]">
              Not sure where to start? <span className="text-[#e4dfff] lg:text-[#9a97b3]">Check your resume.</span>
            </h2>
            <p className="mt-2 text-[15px] text-[#e4dfff] lg:mt-3 lg:text-[17px] lg:text-[#c9c7d8]">Free, no sign-up, about 10 seconds.</p>
            <CtaLink
              cta="free_ats_check"
              location="features_index"
              href="/free-ats-check"
              className={`${btn} mt-4 w-full bg-white text-[#121226] sm:w-auto lg:mt-6 lg:bg-[#5440e8] lg:text-white lg:hover:bg-[#4430d6]`}
            >
              Check my resume — free
            </CtaLink>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
