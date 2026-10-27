import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { ResumePage, ResumeThumb, SAMPLE_RESUMES } from "@/components/home/sample-resume";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { getPublishedPosts } from "@/lib/cms/blog";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS, planPriceLabel, planNameList } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Free ATS Resume Checker & AI Resume Builder",
  description: `Get a free ATS score for your resume in about 10 seconds, see every issue in plain English, then fix it and tailor it to each job. Plans from ${planPriceLabel("starter")}.`,
  pathname: "/",
  keywords: [
    "ATS resume checker",
    "free ATS score",
    "AI resume builder",
    "resume tailoring",
    "cover letter generator",
    "interview prep AI",
  ],
});

const homeLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "LaunchCV — Free ATS Resume Checker & AI Resume Builder",
      description:
        "Check your resume against applicant tracking systems for free, then fix it, tailor it to each job, and write a matching cover letter.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "LaunchCV", url: getSiteUrl() },
    },
  ],
};

const tools = [
  { href: "/free-ats-check", label: "ATS check" },
  { href: "/features/resume-builder", label: "Resume builder" },
  { href: "/features/jd-alignment", label: "Job tailoring" },
  { href: "/features/cover-letter", label: "Cover letters" },
  { href: "/features/interview-prep", label: "Interview prep" },
  { href: "/features/voice-input", label: "Voice input" },
];

const reportRows = [
  { issue: "Contact details are inside a table", impact: "High" },
  { issue: "Missing 6 keywords for Product Manager roles", impact: "High" },
  { issue: "6 bullets list duties, not results", impact: "Medium" },
  { issue: "Heading \"My Journey\" isn't recognized", impact: "Medium" },
];

const filterFacts = [
  {
    t: "Software reads your resume first",
    d: "Applicant tracking systems parse and rank applications before a recruiter opens them.",
  },
  {
    t: "Formatting can hide your experience",
    d: "Tables, columns and text boxes can scramble or drop whole sections.",
  },
  {
    t: "Keywords decide the ranking",
    d: "If the job asks for \"stakeholder management\" and you wrote \"worked with teams\", you rank lower.",
  },
];

const fields = [
  { href: "/resume-examples/software-engineer", label: "Software engineers", sub: "Backend, frontend, full-stack", img: "/images/photos/role-software-engineer.webp", alt: "Software engineer coding on a laptop" },
  { href: "/resume-examples/product-manager", label: "Product managers", sub: "Associate to director", img: "/images/photos/role-product-manager.webp", alt: "Product manager smiling in an office" },
  { href: "/resume-examples/ux-designer", label: "Designers", sub: "UX, product and visual", img: "/images/photos/role-designer.webp", alt: "Designer at her desk" },
  { href: "/resume-examples", label: "Every other role", sub: "Analysts, marketers, support and more", img: "/images/photos/role-data-analyst.webp", alt: "Analyst on a video call" },
];

const templates = [
  { resume: SAMPLE_RESUMES.engineer, name: "Classic" },
  { resume: SAMPLE_RESUMES.finance, name: "Executive" },
  { resume: SAMPLE_RESUMES.designer, name: "Modern" },
  { resume: SAMPLE_RESUMES.marketing, name: "Minimal" },
];

const faqs = [
  {
    q: "Is there a free plan?",
    a: `You can check your ATS score for free — no account needed. Upload your resume and get a 0–100 score with a full parser breakdown instantly. The full prioritized fix list and the rest of the AI toolkit (JD alignment, cover letters, interview prep) are on a paid plan: ${planNameList()}.`,
  },
  {
    q: "Why does ATS matter?",
    a: "Most companies run resumes through Applicant Tracking Systems that scan and rank them before a human reads them, so formatting and keywords decide whether you get seen. LaunchCV checks your resume against the signals these systems rely on and shows you exactly what to fix.",
  },
  {
    q: "What file formats can I download?",
    a: "PDF. It's text-based, so applicant tracking systems can read it, and it keeps names in any script intact.",
  },
  {
    q: "Will it make up experience I don't have?",
    a: "No. Rewrites only use facts that are already in your resume or that you add yourself. You review every change before it's applied.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Your data is encrypted in transit and at rest, and we never sell it. Voice audio is processed in-memory and discarded after transcription.",
  },
  {
    q: "How long does building a resume take?",
    a: "Most people finish a polished, ATS-friendly PDF in one sitting with the suggestions and the live preview.",
  },
  {
    q: "Does it work for all industries?",
    a: "Yes. The templates work across tech, finance, healthcare, marketing, design, operations, and management, and the AI is calibrated per field so the language fits your role.",
  },
  {
    q: "What is the Lifetime plan?",
    a: `A one-time payment of ${PUBLIC_PLANS.lifetime.priceDisplay} with no renewals. Generous monthly fair-use AI caps included. Pay once, keep using.`,
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ISR: keep the homepage fast while surfacing the latest blog posts.
export const revalidate = 300;

const h2 = "text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#111111] sm:text-[40px]";
const grey = "text-[#8A8A86]";

export default async function Home() {
  const latestPosts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={homeLd} />
      <JsonLd data={faqLd} />
      <LandingNav />

      {/* HERO */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-[112px] sm:pt-[136px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-16">
          <h1 className="flex-1 text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px] lg:text-[62px]">
            Find out why your resume isn&apos;t getting interviews. <span className={grey}>Then fix it.</span>
          </h1>
          <div className="flex max-w-[420px] flex-col gap-5">
            <p className="text-[17px] leading-[1.6] text-[#3F3F3F]">
              LaunchCV checks your resume the way applicant tracking systems read it, explains every issue in plain
              English, and helps you rewrite it for each job you apply to.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <CtaLink
                cta="check_resume"
                location="home_hero"
                href="/free-ats-check"
                className="inline-flex h-12 items-center rounded-full bg-[#2563EB] px-6 text-[15px] font-medium text-white transition hover:bg-[#1D4ED8]"
              >
                Check my resume — free
              </CtaLink>
              <span className="text-[14px] text-[#6B6B6B]">No sign-up needed</span>
            </div>
          </div>
        </div>

        <CtaLink
          cta="upload_bar"
          location="home_hero"
          href="/free-ats-check"
          className="mx-auto mt-10 flex max-w-[620px] items-center gap-3 rounded-full border border-[#D9D9D5] bg-white py-2 pl-5 pr-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[#111111]"
        >
          <FileText className="h-5 w-5 shrink-0 text-[#6B6B6B]" aria-hidden="true" />
          <span className="flex-1 text-[15px] text-[#3F3F3F]">
            <span className="font-medium text-[#2563EB]">Upload</span> or drop your resume<span className="hidden sm:inline"> — PDF or Word</span>
          </span>
          <span className="inline-flex h-10 items-center rounded-full bg-[#111111] px-4 text-[14px] font-medium text-white">
            Get my score
          </span>
        </CtaLink>

        {/* Real resumes are the hero image */}
        <div
          className="relative mt-12 h-[340px] overflow-hidden rounded-[20px] bg-[#F5F5F3] sm:h-[520px]"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-16 hidden -translate-x-[560px] -rotate-[5deg] md:block">
            <div className="origin-top-left scale-[0.62] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]">
              <ResumePage resume={SAMPLE_RESUMES.engineer} />
            </div>
          </div>
          <div className="absolute left-1/2 top-10 z-10 -translate-x-[150px] md:-translate-x-[186px]">
            <div className="origin-top-left scale-[0.5] shadow-[0_40px_70px_-24px_rgba(0,0,0,0.32)] md:scale-[0.66]">
              <ResumePage resume={SAMPLE_RESUMES.pm} />
            </div>
            <div className="absolute left-[150px] top-[-14px] flex items-center md:left-[340px] md:top-[18px] gap-2.5 rounded-xl border border-[#E5E5E2] bg-white px-3.5 py-2.5 text-[14px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.25)]">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-[#12A15E] text-[13px] font-bold">
                91
              </span>
              <span>
                <span className="block font-semibold">ATS score</span>
                <span className="block text-[12px] text-[#6B6B6B]">up from 54</span>
              </span>
            </div>
          </div>
          <div className="absolute left-1/2 top-[92px] hidden translate-x-[210px] rotate-[5deg] md:block">
            <div className="origin-top-left scale-[0.62] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]">
              <ResumePage resume={SAMPLE_RESUMES.marketing} />
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS + REPORT */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-24 sm:pt-28">
        <h2 className={`${h2} max-w-[760px]`}>
          Everything you need to apply with confidence. <span className={grey}>In one place.</span>
        </h2>
        <nav aria-label="Tools" className="mt-8 flex flex-wrap gap-1.5">
          {tools.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              className={`inline-flex h-10 items-center rounded-full px-4 text-[15px] font-medium transition ${
                i === 0 ? "bg-[#111111] text-white" : "bg-[#F5F5F3] text-[#3F3F3F] hover:bg-[#EBEBE8]"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-10 overflow-hidden rounded-[20px] bg-[#EEF3FF] px-6 pt-10 sm:px-12 sm:pt-12 lg:flex-row lg:items-end">
          <div className="flex max-w-[360px] flex-col gap-3.5 lg:pb-12">
            <p className="text-[24px] font-semibold leading-[1.25] tracking-[-0.02em]">
              See your resume the way hiring software does
            </p>
            <p className="text-[16px] leading-[1.6] text-[#3F3F3F]">
              A score out of 100, the issues behind it ranked by impact, and a clear fix for each one.
            </p>
            <Link href="/free-ats-check" className="inline-flex items-center gap-1 font-medium text-[#1D4ED8] hover:underline">
              Check my resume <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-7 rounded-t-[14px] bg-white p-7 shadow-[0_-10px_40px_-20px_rgba(29,78,216,0.35)] sm:flex-row">
            <div className="flex shrink-0 flex-col items-center gap-2 sm:w-[180px]">
              <svg width="150" height="150" viewBox="0 0 120 120" role="img" aria-label="Example ATS score: 54 out of 100">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F0F0EE" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E8890C" strokeWidth="10" strokeLinecap="round" strokeDasharray="170 314" transform="rotate(-90 60 60)" />
                <text x="60" y="68" textAnchor="middle" fontSize="30" fontWeight="600" fill="#111111">54</text>
              </svg>
              <p className="font-semibold">Needs work</p>
              <p className="text-[13px] text-[#6B6B6B]">11 issues found</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between border-b border-[#EEEEEB] pb-2.5 text-[13px] text-[#6B6B6B]">
                <span>Issue</span>
                <span>Impact</span>
              </div>
              {reportRows.map((r) => (
                <div key={r.issue} className="flex justify-between gap-3 border-b border-[#EEEEEB] py-3.5 text-[15px]">
                  <span>{r.issue}</span>
                  <span className={`shrink-0 font-medium ${r.impact === "High" ? "text-[#C2341B]" : "text-[#B2610A]"}`}>
                    {r.impact}
                  </span>
                </div>
              ))}
              <p className="py-3.5 text-[15px] text-[#6B6B6B]">7 more</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="pt-24 sm:pt-28">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-6 px-6">
          <h2 className={`${h2} max-w-[700px]`}>
            Templates recruiters can skim in seconds. <span className={grey}>And software can read.</span>
          </h2>
          <Link
            href="/features/resume-builder"
            className="inline-flex h-11 items-center rounded-full border border-[#D9D9D5] px-5 text-[15px] font-medium transition hover:border-[#111111]"
          >
            All templates
          </Link>
        </div>
        <div className="mt-10 flex justify-start gap-6 overflow-x-auto px-6 pb-2 lg:justify-center">
          {templates.map((t) => (
            <figure key={t.name} className="m-0 shrink-0">
              <ResumeThumb resume={t.resume} scale={0.415} height={330} />
              <figcaption className="mt-3 text-[15px] font-medium">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* WHY RESUMES GET FILTERED */}
      <section className="px-6 pt-24 sm:pt-28">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 rounded-[20px] bg-[#111111] px-8 py-12 text-white sm:px-16 sm:py-20 lg:flex-row">
          <h2 className="flex-1 text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[44px]">
            You&apos;re probably not being rejected by people.{" "}
            <span className="text-[#8A8A86]">You&apos;re being filtered before they see you.</span>
          </h2>
          <ol className="flex flex-1 flex-col gap-6">
            {filterFacts.map((f, i) => (
              <li key={f.t} className="flex gap-5">
                <span className="pt-0.5 text-[14px] text-[#8A8A86]">0{i + 1}</span>
                <span>
                  <span className="block text-[17px] font-semibold">{f.t}</span>
                  <span className="mt-1 block text-[15px] leading-[1.6] text-[#B5B5B0]">{f.d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BY FIELD */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-24 sm:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className={h2}>
            Built for your field. <span className={grey}>Not a generic template.</span>
          </h2>
          <Link href="/resume-examples" className="font-medium text-[#1D4ED8] hover:underline">
            All use cases →
          </Link>
        </div>
        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((f) => (
            <Link key={f.label} href={f.href} className="group block">
              <Image
                src={f.img}
                alt={f.alt}
                width={640}
                height={480}
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full rounded-[14px] object-cover"
              />
              <span className="mt-3 flex items-center justify-between text-[16px] font-medium">
                {f.label}
                <ArrowRight className="h-4 w-4 text-[#8A8A86] transition group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="mt-0.5 block text-[14px] text-[#6B6B6B]">{f.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-24 sm:pt-28">
        <div className="flex flex-col gap-10 border-t border-[#EEEEEB] pt-12 lg:flex-row">
          <div className="flex-1">
            <h2 className={h2}>
              Free to check. <span className={grey}>Plans from {PUBLIC_PLANS.starter.priceDisplay} a month.</span>
            </h2>
            <p className="mt-4 max-w-[440px] text-[17px] leading-[1.6] text-[#3F3F3F]">
              Every AI tool is included on every plan. Cancel monthly plans in one click, or pay once with Lifetime.
            </p>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              return (
                <CtaLink
                  key={key}
                  cta="choose_plan"
                  plan={key}
                  location="home_pricing"
                  selectsPlan
                  href="/pricing"
                  className={`flex flex-col rounded-[14px] p-5 transition ${
                    cfg.popular ? "border-2 border-[#111111]" : "border border-[#E5E5E2] hover:border-[#111111]"
                  }`}
                >
                  <span className="text-[15px] text-[#6B6B6B]">{cfg.title}</span>
                  <span className="mt-1 text-[32px] font-semibold tracking-[-0.03em]">
                    {cfg.priceDisplay}
                    <span className="ml-1 text-[14px] font-normal tracking-normal text-[#6B6B6B]">{cfg.periodLabel}</span>
                  </span>
                </CtaLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-24 sm:pt-28">
        <h2 className={`${h2} text-center`}>Questions</h2>
        <HomeClient faqItems={faqs} />
      </section>

      {/* BLOG */}
      {latestPosts.length > 0 ? (
        <section className="mx-auto w-full max-w-[1200px] px-6 pt-24 sm:pt-28">
          <div className="flex items-end justify-between gap-4">
            <h2 className={h2}>
              Resume guides. <span className={grey}>Written for job seekers.</span>
            </h2>
            <Link href="/blog" className="hidden shrink-0 font-medium text-[#1D4ED8] hover:underline sm:inline">
              All articles →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col border-t border-[#E5E5E2] pt-5"
              >
                <span className="text-[13px] text-[#6B6B6B]">{post.category}</span>
                <span className="mt-2 text-[17px] font-semibold leading-snug group-hover:text-[#1D4ED8]">{post.title}</span>
                <span className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-[#3F3F3F]">{post.description}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* FINAL CTA */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-24 sm:pt-28">
        <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F5F5F3] lg:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-6 p-8 sm:p-14">
        <h2 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[48px]">
          See your score in about 10 seconds. <span className={grey}>Then go get the interview.</span>
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <CtaLink
            cta="check_resume"
            location="home_footer"
            href="/free-ats-check"
            className="inline-flex h-[52px] items-center rounded-full bg-[#2563EB] px-7 text-[16px] font-medium text-white transition hover:bg-[#1D4ED8]"
          >
            Check my resume — free
          </CtaLink>
          <CtaLink
            cta="get_started"
            location="home_footer"
            href="/register"
            className="inline-flex h-[52px] items-center rounded-full border border-[#D9D9D5] px-6 text-[16px] font-medium transition hover:border-[#111111]"
          >
            Build a new resume
          </CtaLink>
        </div>
        </div>
        <Image
          src="/images/photos/colleagues-celebrate.webp"
          alt="Two colleagues celebrating at a desk"
          width={1400}
          height={900}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-[260px] w-full object-cover lg:h-auto lg:w-[48%]"
        />
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
