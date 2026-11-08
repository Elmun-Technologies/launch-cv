import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { CtaLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { ResumePreview } from "@/components/resume-preview";
import { TemplateFan } from "@/components/site/template-fan";
import { ResumeSheet } from "@/components/site/resume-sheet";
import { getResumeExample, RESUME_EXAMPLES } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { TEMPLATE_SPECS, type TemplateStyle } from "@/lib/resume-templates";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { PUBLIC_PLANS, freeAllowanceSentence, planMarketingBullets } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PASS_DAYS, isPassPlan } from "@/lib/plan-config";
import { getSettings } from "@/lib/app-settings";
import { getPageCopy } from "@/lib/cms/page-copy";
import { getFaqsFor } from "@/lib/cms/faqs";
import { getTestimonialsFor } from "@/lib/cms/testimonials";
import { Testimonials } from "@/components/site/testimonials";
import { FaqIcon } from "@/components/site/ui";
import { MOBILE_PLAN_ORDER, planLimitsLine } from "@/components/site/plan-summary";

export const metadata: Metadata = buildMarketingMetadata({
  title: "LaunchCV — Get Your Resume Past the ATS",
  description:
    "See what applicant tracking software reads from your resume, fix every issue in plain English, and tailor it to each job. The ATS check is free, no sign-up.",
  pathname: "/",
});

// Plan quotas come from Admin → Limits; refresh the cached page every minute.
export const revalidate = 60;

const FAQS = [
  {
    q: "Is the ATS check really free?",
    a: "Yes. Upload a PDF or Word file, or paste the text, and you get your score and top fixes without an account. A free account saves the full report.",
  },
  {
    q: "Do you keep my resume file?",
    a: "No. The file is read once to pull out its text and isn't stored. Your report is kept so you can save it to an account after you sign up.",
  },
  {
    q: "Will the AI make up experience?",
    a: "No. Rewrites only use facts that are already in your resume or that you add yourself, and you approve every change before it's applied.",
  },
  {
    q: "What file do I download?",
    a: "A text-based PDF. Applicant tracking systems can read it, and the layout stays exactly as you see it in the preview.",
  },
  {
    q: "Can I cancel or get a refund?",
    a: "Passes are a single payment and never renew, so there's nothing to cancel. Pro can be canceled anytime from the billing portal, and you keep access until the end of the period you paid for. Monthly plans have a 7-day money-back guarantee.",
  },
];

const FEATURED_ROLES = [
  "registered-nurse",
  "software-engineer",
  "product-manager",
  "teacher",
  "data-analyst",
  "accountant",
  "sales-representative",
  "ux-designer",
];

const TEMPLATE_EXAMPLES: { template: TemplateStyle; example: string }[] = [
  { template: "classic", example: "software-engineer" },
  { template: "modern", example: "product-manager" },
  { template: "minimal", example: "marketing-manager" },
  { template: "executive", example: "financial-analyst" },
];

const BUILD_HREF = `/register?next=${encodeURIComponent("/resume/new")}`;
const btn = "lc-btn-lift inline-flex items-center justify-center gap-2 rounded-full px-[26px] py-[17px] text-[16px] font-semibold";
const label = "text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]";

function Check() {
  return <span className="font-bold text-[#0b7a4f]" aria-label="found">✓</span>;
}

export default async function Home() {
  const [{ planLimits }, hero, cta, cmsFaqs, testimonials] = await Promise.all([
    getSettings(),
    getPageCopy("home.hero"),
    getPageCopy("home.cta"),
    getFaqsFor("home"),
    getTestimonialsFor("home", 6),
  ]);
  const faqs = cmsFaqs.length ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer })) : FAQS;
  const roles = FEATURED_ROLES.map((slug) => getResumeExample(slug)).filter((e) => !!e);
  const templates = TEMPLATE_EXAMPLES.flatMap((t) => {
    const e = getResumeExample(t.example);
    return e ? [{ key: t.template, label: TEMPLATE_SPECS[t.template].label, node: <ResumePreview content={exampleToContent(e)} template={t.template} /> }] : [];
  });
  const plans = CHECKOUT_PLAN_ORDER.map((id) => ({
    id,
    cta: isPassPlan(id) ? `Get the ${PUBLIC_PLANS[id].title}` : `Choose ${PUBLIC_PLANS[id].title}`,
  }));
  const freeJd = planLimits.free.jd;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${absoluteUrl("/")}#webpage`,
        url: absoluteUrl("/"),
        name: "LaunchCV — Get your resume past the ATS",
        isPartOf: { "@id": WEBSITE_ID },
        about: orgRef,
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — copy. Static HTML: the headline and CTAs never wait for JavaScript. */}
      <section className="mx-auto grid max-w-[1360px] items-end gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10 lg:pt-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#e4dfff] py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold text-[#3a2bb8] sm:text-[14px]">
            <span className="rounded-full bg-[#5440e8] px-2 py-0.5 text-[11px] text-white sm:text-[12px]">Free</span>
            {hero.badge}
          </p>
          <h1 className="mt-4 text-[42px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:mt-6 sm:text-[60px] lg:text-[72px] lg:leading-[1.03]">
            {hero.title} {hero.titleAccent ? <span className="text-[#5440e8]">{hero.titleAccent}</span> : null}
          </h1>
        </div>
        <div className="lg:pb-1.5">
          <p className="text-[17px] leading-[1.55] sm:text-[19px]">
            {hero.lead}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <CtaLink cta="check_resume" location="home_hero" href="/free-ats-check" className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
              {hero.primaryCta}
            </CtaLink>
            <CtaLink cta="build_resume" location="home_hero" href={BUILD_HREF} className={`${btn} bg-white text-[#121226]`}>
              {hero.secondaryCta}
            </CtaLink>
          </div>
          <p className="mt-3.5 text-center text-[13px] text-[#66647c] sm:text-left sm:text-[14px]">{hero.note} · one free check every 30 days</p>
        </div>
      </section>

      {/* HERO — stage */}
      <section className="mx-auto max-w-[1360px] px-4 pt-7 sm:px-6 lg:px-10 lg:pt-12">
        <div className="relative h-[470px] overflow-hidden rounded-[28px] bg-[#5440e8] sm:h-[560px] lg:h-[600px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute inset-x-0 top-5 m-0 text-center text-[74px] leading-[68px] text-[#c9c0ff] sm:top-8 sm:text-[120px] sm:leading-[112px] lg:text-[168px] lg:leading-[160px]">
            GET <br className="sm:hidden" />
            HIRED
          </p>
          <div aria-hidden="true" className="absolute bottom-[-150px] left-1/2 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-[#4430d6] lg:bottom-[-210px] lg:h-[560px] lg:w-[560px]" />
          <ResumeSheet
            example="product-manager"
            className="absolute bottom-0 left-1/2 h-[270px] w-[220px] -translate-x-1/2 [--peek:0.27] sm:h-[360px] sm:w-[290px] sm:[--peek:0.355] lg:h-[420px] lg:w-[360px] lg:[--peek:0.44]"
          />

          {/* ATS score */}
          <div className="lc-float lc-drift absolute left-2.5 top-[318px] flex items-center gap-2.5 rounded-[18px] bg-white px-3 py-2.5 sm:left-8 sm:top-[260px] lg:left-16 lg:top-[232px] lg:w-[250px] lg:gap-3.5 lg:rounded-3xl lg:p-[18px]">
            <svg viewBox="0 0 64 64" aria-hidden="true" className="h-10 w-10 lg:h-16 lg:w-16">
              <circle cx="32" cy="32" r="27" fill="none" stroke="#efedf7" strokeWidth="7" />
              <circle cx="32" cy="32" r="27" fill="none" stroke="#22b07d" strokeWidth="7" strokeLinecap="round" strokeDasharray="154 170" transform="rotate(-90 32 32)" />
            </svg>
            <div>
              <p className="text-[12px] font-medium text-[#4a4862] lg:text-[14px]">ATS score</p>
              <p className="text-[24px] font-bold leading-[26px] tracking-[-0.03em] lg:text-[34px] lg:leading-[38px]">
                91<span className="text-[11px] font-medium tracking-normal text-[#66647c] lg:text-[14px]">/100</span>
              </p>
              <p className="hidden text-[12px] text-[#66647c] lg:block">Example result</p>
            </div>
          </div>
          <span aria-hidden="true" className="lc-poster absolute left-[118px] top-[300px] rotate-[8deg] rounded-full bg-[#ff7a33] px-2.5 py-1.5 text-[11px] text-[#111118] sm:left-[200px] sm:top-[244px] lg:left-[270px] lg:top-[212px] lg:px-3.5 lg:py-2 lg:text-[14px]">
            FREE
          </span>

          {/* File chip */}
          <div className="lc-float lc-drift-2 absolute bottom-4 left-3 flex items-center gap-2 rounded-full bg-[#111118] py-[7px] pl-[7px] pr-3.5 text-white lg:bottom-auto lg:left-16 lg:top-[382px] lg:gap-3 lg:py-2.5 lg:pl-2.5 lg:pr-[22px]">
            <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#c9c0ff] lg:h-[42px] lg:w-[42px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111118" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                <path d="M14 3v5h5" />
              </svg>
            </span>
            <span>
              <span className="hidden text-[15px] font-semibold lg:block">maria-lopez-resume.pdf</span>
              <span className="block text-[12px] font-semibold lg:text-[13px] lg:font-normal lg:text-[#c9c7d8]">Read in 9 seconds</span>
            </span>
          </div>
          <div className="lc-float lc-drift-3 absolute left-16 top-[470px] hidden w-[280px] rounded-[18px] bg-white px-4 py-3.5 lg:block">
            <p className="flex justify-between text-[14px] font-semibold">
              <span>Contact details found</span>
              <Check />
            </p>
            <p className="mt-2 flex justify-between text-[14px] font-semibold">
              <span>Standard section headings</span>
              <Check />
            </p>
          </div>

          {/* Chat */}
          <div className="absolute right-2.5 top-[300px] flex w-[150px] flex-col gap-1.5 sm:right-8 sm:top-[250px] sm:w-[220px] lg:right-16 lg:top-[226px] lg:w-[300px]">
            <span className="lc-float self-end rounded-[18px_18px_5px_18px] bg-[#111118] px-3 py-2.5 text-[13px] font-medium text-white lg:rounded-[22px_22px_6px_22px] lg:px-4 lg:py-3 lg:text-[16px] lg:shadow-none">
              Is my resume ATS-ready?
            </span>
            <span className="lc-float self-start rounded-[18px_18px_18px_5px] bg-white px-3 py-2.5 text-[13px] font-medium lg:rounded-[22px_22px_22px_6px] lg:px-4 lg:py-3 lg:text-[16px] lg:shadow-none">
              Two fixes and you&apos;re there.
            </span>
          </div>
          {/* Keywords */}
          <div className="lc-float lc-drift-2 absolute right-16 top-[352px] hidden w-[280px] overflow-hidden rounded-[18px] bg-white lg:block">
            <div className="flex justify-between bg-[#111118] px-4 py-3 text-[14px] font-semibold text-white">
              <span>Keywords from the job post</span>
              <span>6/8</span>
            </div>
            {[
              ["SQL", true],
              ["Roadmapping", true],
              ["Stakeholder management", false],
            ].map(([k, ok], i) => (
              <div key={k as string} className={`flex justify-between px-4 py-[11px] text-[14px] font-medium ${i ? "border-t border-[#e2e0ea]" : ""}`}>
                <span>{k}</span>
                {ok ? <Check /> : <span className="font-bold text-[#c42b30]">Missing</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1360px] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10">
        <ol className="grid gap-5 sm:grid-cols-3 sm:gap-10">
          {[
            ["Upload or paste", "PDF, Word or plain text. No account needed for the check."],
            ["See what the software reads", "Fields it found, missed or mixed up — and why, in plain English."],
            ["Fix it and download", "Edit in the builder and export a clean, readable PDF for free."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3.5 border-t-2 border-[#121226] pt-3.5 sm:block sm:pt-5">
              <span className="lc-mono block pt-[3px] text-[13px] text-[#5440e8] sm:pt-0">0{i + 1}</span>
              <span className="block">
                <span className="block text-[18px] font-bold sm:mt-2.5 sm:text-[22px] sm:tracking-[-0.02em]">{t}</span>
                <span className="mt-0.5 block text-[15px] leading-[23px] text-[#4a4862] sm:mt-1.5 sm:text-[16px] sm:leading-[25px]">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ATS CHECK (dark) */}
      <section className="mx-auto max-w-[1360px] px-4 pt-[72px] sm:px-6 sm:pt-20 lg:px-10 lg:pt-[120px]">
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-[18px] pb-[22px] pt-9 text-white sm:px-10 lg:rounded-[36px] lg:px-16 lg:pb-16 lg:pt-[72px]">
          <div className="mx-auto max-w-[820px] sm:text-center">
            <p className={`${label} !text-[#c9c0ff]`}>/ ATS check</p>
            <h2 className="lc-h2 mt-3.5 text-white sm:mt-5">
              It looks fine to you. <span className="!text-[#9a97b3]">The software reads something else.</span>
            </h2>
            <p className="mx-auto mt-3.5 max-w-[640px] text-[16px] leading-[25px] text-[#c9c7d8] sm:mt-5 sm:text-[18px] sm:leading-7">
              Columns, text boxes and page headers are the usual culprits. Many parsers read a page line by line, so your
              email, dates and skills land in the wrong field — or nowhere.
            </p>
          </div>
          <div className="mt-6 grid items-center gap-6 sm:mt-12 lg:mt-14 lg:grid-cols-[1fr_120px_1fr] lg:gap-0">
            <div className="hidden sm:block">
              <span className="inline-block rounded-full bg-white px-3.5 py-[7px] text-[14px] font-semibold text-[#121226]">What a recruiter sees</span>
              <div className="mt-3.5 flex h-[300px] overflow-hidden rounded-xl bg-white text-[12px] leading-[18px] text-[#1c1c28]" aria-label="Example two-column resume">
                <div className="w-[38%] bg-[#24324a] px-[18px] py-6 text-white">
                  <p className="text-[19px] font-extrabold leading-[22px]">Maria Lopez</p>
                  <p className="mt-0.5 text-[#c9d2dd]">Product Manager</p>
                  <p className="mt-4 break-words text-[#c9d2dd]">
                    maria.lopez@email.com
                    <br />
                    (512) 555-0142
                    <br />
                    Austin, TX
                  </p>
                  <p className="mb-1 mt-4 text-[10px] font-bold tracking-[0.12em] text-[#8fa3b8]">SKILLS</p>
                  <p>
                    SQL · Amplitude
                    <br />
                    A/B testing
                    <br />
                    Roadmaps
                  </p>
                </div>
                <div className="flex-1 px-5 py-6">
                  <p className="text-[10px] font-bold tracking-[0.12em] text-[#66647c]">MY JOURNEY</p>
                  <p className="mt-2.5 font-bold">Product Manager, Brightpath</p>
                  <p className="text-[#66647c]">’22 — now</p>
                  <p className="mt-1">• Launched self-scheduling; no-shows fell 23%</p>
                  <p>• Led 9 engineers and 2 designers</p>
                  <p className="mt-3 font-bold">Associate PM, Fieldnote</p>
                  <p className="text-[#66647c]">Mar 2019 – 2022</p>
                  <p className="mt-1">• Activation 38% → 57%</p>
                  <p>• Responsible for the pricing page</p>
                </div>
              </div>
            </div>
            <div className="hidden items-center justify-center gap-2.5 sm:flex lg:flex-col lg:pt-10">
              <span className="inline-flex h-14 w-14 rotate-90 items-center justify-center rounded-full bg-[#5440e8] lg:rotate-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
              <span className="text-[13px] font-semibold text-[#c9c7d8]">ATS parser</span>
            </div>
            <div>
              <span className="inline-block rounded-full bg-[#ff7a33] px-3 py-1.5 text-[13px] font-semibold text-[#111118] sm:px-3.5 sm:py-[7px] sm:text-[14px]">What the software reads</span>
              <div className="lc-mono mt-2.5 overflow-x-auto rounded-[14px] border border-[#2f2d48] bg-[#1d1c2e] px-4 py-[18px] text-[12px] leading-[27px] text-[#e9e7f3] sm:mt-3.5 sm:h-[300px] sm:rounded-xl sm:p-6 sm:text-[13px] sm:leading-[30px]">
                <p className="text-[#9a97b3]">{"// fields extracted"}</p>
                {[
                  ["name", <>Maria Lopez Product Manager</>],
                  ["email", <Bad key="e">not found</Bad>],
                  ["phone", <Bad key="p">not found</Bad>],
                  ["dates", <Bad key="d">’22 — now: unreadable</Bad>],
                  ["skills", <Bad key="s">empty</Bad>],
                  ["section", <>“My Journey” <Bad key="u">unknown</Bad></>],
                ].map(([k, v]) => (
                  <p key={k as string} className="whitespace-nowrap">
                    <span className="inline-block w-[68px] text-[#c9c0ff]">{k}</span> {v}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-[12px] text-[#9a97b3] sm:mt-4 sm:text-center sm:text-[13px]">Sample resume — names are illustrative.</p>
          <div className="mt-2.5 flex flex-col gap-3.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <span className="inline-flex items-center gap-2.5 rounded-[18px] bg-white py-2.5 pl-2.5 pr-3.5 text-[14px] font-semibold text-[#121226] sm:rounded-full sm:pr-[18px] sm:text-[15px]">
              <span className="inline-flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-[#fbe2e3] font-extrabold text-[#c42b30]">!</span>
              Two-column layout hides your contact details
            </span>
            <CtaLink cta="check_resume" location="home_xray" href="/free-ats-check" className={`${btn} w-full bg-[#5440e8] !py-4 text-white hover:bg-[#4430d6] sm:w-auto sm:!px-[22px] sm:!py-3.5 sm:!text-[15px]`}>
              Check mine — free
            </CtaLink>
          </div>
        </div>
      </section>

      {/* REPORT */}
      <section className="mx-auto grid max-w-[1360px] gap-x-[72px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal lg:self-end">
          <p className={label}>/ Your report</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            Every issue comes with the fix. <span>Most take a minute.</span>
          </h2>
          <p className="mt-3.5 text-[16px] leading-[25px] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">
            Your score, the issues behind it ranked by impact, and exactly what to change. The free check shows your top
            fixes; a free account saves the full report.
          </p>
        </div>
        <div className="lc-reveal relative mt-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">
          <div className="lc-card rounded-[22px] p-5 sm:rounded-3xl sm:p-8 lg:mr-10 lg:mt-12">
            <div className="flex items-center gap-3.5 sm:gap-5">
              <svg width="108" height="108" viewBox="0 0 112 112" role="img" aria-label="Example score 54 out of 100" className="h-[72px] w-[72px] shrink-0 sm:h-[108px] sm:w-[108px]">
                <circle cx="56" cy="56" r="46" fill="none" stroke="#f1eff8" strokeWidth="12" />
                <circle cx="56" cy="56" r="46" fill="none" stroke="#f2a91f" strokeWidth="12" strokeLinecap="round" strokeDasharray="156 289" transform="rotate(-90 56 56)" />
                <text x="56" y="66" textAnchor="middle" fontSize="30" fontWeight="700" fill="#121226">
                  54
                </text>
              </svg>
              <div>
                <p className="text-[12px] text-[#66647c] sm:text-[14px]">Example ATS score</p>
                <p className="mt-0.5 text-[20px] font-bold tracking-[-0.02em] sm:text-[26px]">Needs work</p>
                <p className="mt-0.5 text-[13px] text-[#4a4862] sm:text-[14px]">11 issues · 4 high priority</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Issue title="Contact details sit in the page header" level="High" fix="Move your email and phone into the body, under your name." />
              <Issue title="“My Journey” isn’t a heading it knows" level="High" fix="Rename it “Experience”." />
              <Issue title="6 bullets list duties, not results" level="Medium" />
              <Issue title="Dates use three different formats" level="Medium" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#dcf5ea] px-[18px] py-3.5 text-[#0b4f35]">
              <span className="text-[15px] font-semibold">Score after these 4 fixes</span>
              <span className="text-[26px] font-bold tracking-[-0.03em]">91</span>
            </div>
          </div>
          <span className="lc-float lc-drift absolute right-0 top-0 hidden max-w-[220px] rounded-[22px_22px_6px_22px] bg-[#111118] px-4 py-[11px] text-[15px] font-medium text-white lg:block">
            Which fix matters most?
          </span>
        </div>
        <div className="lc-reveal mt-2.5 lg:col-start-1 lg:row-start-2 lg:mt-8 lg:self-start">
          <div className="lc-rise rounded-[22px] bg-[#c9c0ff] p-5 text-[#111118] sm:rounded-3xl sm:px-6 sm:py-[22px]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-bold tracking-[0.08em]">BULLET REWRITE</p>
              <span className="rounded-full bg-[#111118] px-2.5 py-[5px] text-[12px] font-semibold text-white">{freeJd > 0 ? "Free account" : "Paid plans"}</span>
            </div>
            <p className="mt-3 text-[15px] text-[#3d3a5c] line-through">Responsible for the onboarding project</p>
            <p className="mt-1.5 text-[17px] font-semibold leading-6 sm:text-[19px] sm:leading-[27px]">Redesigned onboarding; week-1 activation rose from 38% to 57%.</p>
            <p className="mt-2.5 text-[13px] text-[#3d3a5c]">Uses only facts already in your resume. You approve every change.</p>
          </div>
        </div>
      </section>

      {/* JOB MATCH */}
      <section className="mx-auto max-w-[1360px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal flex flex-col justify-between gap-3.5 sm:gap-5 lg:flex-row lg:items-end lg:gap-12">
          <div className="max-w-[760px]">
            <p className={label}>/ Job match</p>
            <h2 className="lc-h2 mt-3.5 sm:mt-5">
              Paste the job post. <span>See what it&apos;s looking for.</span>
            </h2>
          </div>
          <p className="max-w-[380px] text-[16px] leading-[25px] text-[#4a4862] sm:text-[18px] sm:leading-7">
            Skills the employer asks for, which ones your resume already says, and rewrites for the bullets that should —
            using only what you did.
          </p>
        </div>
        <div className="lc-reveal relative mt-6 h-[380px] overflow-hidden rounded-[28px] bg-[#e4dfff] sm:mt-10 sm:h-auto sm:p-6 sm:pb-0 lg:mt-12 lg:h-[600px] lg:rounded-[36px] lg:p-0">
          <div aria-hidden="true" className="absolute bottom-[-130px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#c9c0ff] sm:hidden lg:block lg:bottom-[-200px] lg:h-[520px] lg:w-[520px]" />
          {/* Phone: a small score badge on the photo; the full cards start at sm. */}
          <div className="lc-float absolute right-3 top-3.5 z-10 rounded-[18px] bg-white px-3.5 py-3 sm:hidden">
            <p className="text-[12px] text-[#4a4862]">Match score</p>
            <p className="text-[26px] font-bold leading-[30px] tracking-[-0.03em]">
              72 <span className="text-[14px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
            </p>
          </div>
          <div className="relative z-10 hidden gap-3 sm:grid sm:grid-cols-2 lg:contents">
            <div className="lc-float rounded-3xl bg-white p-6 lg:absolute lg:left-12 lg:top-12 lg:w-[380px]">
              <p className="text-[13px] text-[#66647c]">Job post · Senior Product Manager (example)</p>
              <p className="mt-3 text-[16px] leading-[29px]">
                You&apos;ll own the <Hit>roadmap</Hit> for a <Hit>B2B SaaS</Hit> product, use <Hit>SQL</Hit> and <Hit>A/B testing</Hit> to
                decide what ships, and lead <Miss>stakeholder management</Miss> across sales and support. Experience setting <Miss>OKRs</Miss> is a plus.
              </p>
              <div className="mt-4 flex gap-3.5 text-[13px] text-[#4a4862]">
                <span>
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-[3px] bg-[#c9c0ff] align-[-1px]" /> On your resume
                </span>
                <span>
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-[3px] bg-[#ffd3bd] align-[-1px]" /> Missing
                </span>
              </div>
            </div>
            <div className="lc-float rounded-3xl bg-white p-6 lg:absolute lg:right-12 lg:top-12 lg:w-[320px]">
              <p className="text-[14px] text-[#4a4862]">Match score</p>
              <p className="mt-0.5 text-[44px] font-bold leading-[48px] tracking-[-0.04em]">
                72 <span className="text-[20px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
              </p>
              <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-[#efedf7]">
                <div className="h-full w-[86%] bg-[#22b07d]" />
              </div>
              <p className="mt-2 text-[13px] text-[#66647c]">After adding two missing skills (example)</p>
              <div className="mt-[18px] flex flex-wrap gap-1.5">
                {["Roadmap", "SQL", "A/B testing"].map((k) => (
                  <span key={k} className="rounded-full bg-[#dcf5ea] px-2.5 py-[5px] text-[12px] font-bold text-[#0b7a4f]">
                    ✓ {k}
                  </span>
                ))}
                {["Stakeholder mgmt", "OKRs"].map((k) => (
                  <span key={k} className="rounded-full bg-[#fbe2e3] px-2.5 py-[5px] text-[12px] font-bold text-[#c42b30]">
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[330px] sm:relative sm:mt-4 sm:h-[360px] lg:absolute lg:mt-0 lg:h-[540px]">
            <ResumeSheet
              example="product-manager"
              template="classic"
              className="absolute bottom-0 left-1/2 h-full w-[250px] -translate-x-1/2 [--peek:0.306] sm:w-[300px] sm:[--peek:0.368] lg:w-[400px] lg:[--peek:0.49]"
            />
          </div>
          <CtaLink
            cta="job_match"
            location="home_job_match"
            href="/features/jd-alignment"
            className={`${btn} lc-float absolute bottom-4 right-4 z-10 bg-[#111118] !px-5 !py-3.5 !text-[15px] text-white hover:bg-[#2a2940] max-sm:hidden lg:bottom-12 lg:right-12 lg:!px-[26px] lg:!py-[17px] lg:!text-[16px]`}
          >
            Match my resume to a job
          </CtaLink>
          <span className="absolute bottom-4 left-4 z-10 hidden rounded-full bg-white px-3.5 py-[9px] text-[13px] font-semibold text-[#4a4862] sm:block lg:bottom-12 lg:left-12">
            {freeJd > 0 ? `${freeJd} free ${freeJd === 1 ? "match" : "matches"} a month with an account` : "Paid plans"}
          </span>
        </div>
        <div className="sm:hidden">
          <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label="Skills from the example job post">
            {["Roadmap", "SQL", "A/B testing"].map((k) => (
              <li key={k} className="rounded-full bg-[#dcf5ea] px-[11px] py-[7px] text-[13px] font-bold text-[#0b7a4f]">
                ✓ {k}
              </li>
            ))}
            {["Stakeholder management", "OKRs"].map((k) => (
              <li key={k} className="rounded-full bg-[#fbe2e3] px-[11px] py-[7px] text-[13px] font-bold text-[#c42b30]">
                + {k}
              </li>
            ))}
          </ul>
          <CtaLink cta="job_match" location="home_job_match" href="/features/jd-alignment" className={`${btn} mt-3.5 w-full bg-[#111118] !py-4 text-white hover:bg-[#2a2940]`}>
            Match my resume to a job
          </CtaLink>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="mx-auto max-w-[1360px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal mx-auto max-w-[980px] sm:text-center">
          <p className={label}>/ Templates</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            Four templates. <span>Every one readable by the software.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-7 text-[#4a4862] sm:text-[18px]">
            Build with a live preview, switch templates any time, and download a PDF or Word file free.
          </p>
        </div>
        <TemplateFan items={templates} />
      </section>

      {/* EXAMPLES */}
      <section className="mx-auto grid max-w-[1360px] items-stretch gap-6 px-4 pt-[72px] sm:px-6 sm:pt-24 lg:grid-cols-2 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal flex flex-col justify-center lg:pl-10">
          <p className={label}>/ Examples</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            Real examples. <span>Not a blank page.</span>
          </h2>
          <p className="mt-3.5 text-[16px] leading-[25px] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">
            {RESUME_EXAMPLES.length} roles, from nurses and electricians to engineers, each with a full resume and the keywords for that job.
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-8 sm:gap-2">
            {roles.map((r, i) => (
              <Link
                key={r.slug}
                href={`/resume-examples/${r.slug}`}
                className={`lc-btn-lift rounded-full px-[17px] py-[11px] text-[15px] font-semibold ${i === 0 ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#121226] hover:text-white"}`}
              >
                {r.role}
              </Link>
            ))}
            <Link href="/resume-examples" className="rounded-full px-[17px] py-[11px] text-[15px] font-semibold text-[#5440e8] hover:underline">
              All {RESUME_EXAMPLES.length} roles →
            </Link>
          </div>
        </div>
        <div className="lc-reveal relative min-h-[400px] overflow-hidden rounded-[28px] bg-[#e4dfff] sm:min-h-[460px] lg:order-first lg:min-h-[580px] lg:rounded-[36px]">
          <div aria-hidden="true" className="absolute bottom-[-160px] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#c9c0ff]" />
          <ResumeSheet
            example="registered-nurse"
            className="absolute bottom-0 left-1/2 h-[250px] w-[250px] -translate-x-1/2 [--peek:0.306] sm:h-[340px] sm:w-[290px] sm:[--peek:0.355] lg:h-[440px] lg:w-[380px] lg:[--peek:0.466]"
          />
          <div className="lc-float lc-drift absolute left-4 top-4 w-[220px] rounded-3xl bg-white p-[18px] lg:left-7 lg:top-7">
            <p className="text-[13px] text-[#66647c]">Example</p>
            <p className="mt-0.5 text-[18px] font-bold">Registered Nurse</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["BLS", "Patient care", "Epic EHR"].map((k) => (
                <span key={k} className="rounded-full bg-[#f1eff8] px-2.5 py-[5px] text-[12px] font-bold">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <CtaLink
            cta="start_from_example"
            location="home_examples"
            href={`/register?next=${encodeURIComponent("/resume/new?example=registered-nurse")}`}
            className="lc-float lc-btn-lift absolute bottom-4 right-4 flex items-center gap-2.5 rounded-full bg-[#111118] py-2 pl-2 pr-[18px] text-white lg:bottom-7 lg:right-7"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#c9c0ff]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111118" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold">Start from this example</span>
          </CtaLink>
        </div>
      </section>

      {testimonials.length ? <Testimonials items={testimonials} /> : null}

      {/* PRICING */}
      <section className="mx-auto max-w-[1360px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal mx-auto max-w-[980px] sm:text-center">
          <p className={label}>/ Pricing</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            The check is free. <span>Passes from {PUBLIC_PLANS.week.priceDisplay} for {PASS_DAYS.week} days.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-7 text-[#4a4862] sm:text-[18px]">
            {freeAllowanceSentence(planLimits.free)} Pay for the weeks you&apos;re searching with a pass that never auto-renews,
            or stay on {PUBLIC_PLANS.professional.title} month to month.
          </p>
        </div>
        <div className="mt-[22px] grid items-stretch gap-2.5 md:mt-10 md:grid-cols-3 md:gap-4 lg:mt-12">
          {plans.map(({ id, cta }) => {
            const p = PUBLIC_PLANS[id];
            const l = planLimits[id];
            const hot = !!p.popular;
            const bullets = planMarketingBullets(id, planLimits);
            const button = (
              <CtaLink
                cta="choose_plan"
                plan={id}
                selectsPlan
                location="home_pricing"
                href={`/checkout/${id}`}
                className={`lc-btn-lift mt-auto rounded-full text-center text-[15px] font-semibold ${hot ? "bg-white p-4 text-[#121226]" : "bg-[#f1eff8] p-[13px] text-[#121226] hover:bg-[#e4dfff] md:p-4"}`}
              >
                {cta}
              </CtaLink>
            );
            // Phones: the popular plan is the one full card; the others are compact rows (same as /pricing).
            if (!hot) {
              return (
                <div key={id} className={`${MOBILE_PLAN_ORDER[id]} lc-reveal lc-rise lc-card flex flex-col gap-3.5 rounded-[22px] px-[22px] py-5 md:order-none md:gap-5 md:rounded-3xl md:p-[30px]`}>
                  <div>
                    <div className="flex items-baseline justify-between md:block">
                      <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-[#4a4862] md:text-[16px]">
                        {p.title}
                        {p.badge ? (
                          <span className="hidden rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8] md:inline">{p.badge}</span>
                        ) : null}
                      </p>
                      <p className="shrink-0 whitespace-nowrap text-[30px] font-bold tracking-[-0.03em] md:mt-2 md:text-[54px] md:leading-[58px] md:tracking-[-0.04em]">
                        {p.priceDisplay}
                        <span className="whitespace-nowrap text-[13px] font-medium tracking-normal text-[#66647c] md:text-[16px]"> {p.periodLabel}</span>
                      </p>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-[22px] text-[#4a4862] md:hidden">{planLimitsLine(id, l)}</p>
                    <p className="mt-1.5 hidden text-[14px] text-[#66647c] md:block">{p.valueLine}</p>
                  </div>
                  <ul className="hidden flex-col gap-2.5 border-t border-[#e2e0ea] pt-5 text-[15px] md:flex">
                    {bullets.map((b) => (
                      <li key={b}>✓ {b}</li>
                    ))}
                  </ul>
                  {button}
                </div>
              );
            }
            return (
              <div
                key={id}
                className={`${MOBILE_PLAN_ORDER[id]} lc-reveal lc-rise relative flex flex-col gap-4 rounded-[22px] bg-[#5440e8] p-[22px] text-white shadow-[0_24px_48px_-20px_rgba(36,24,120,.45)] md:order-none md:gap-5 md:rounded-3xl md:p-[30px]`}
              >
                <span className="absolute right-[18px] top-5 rounded-full bg-[#ff7a33] px-2.5 py-1.5 text-[11px] font-bold text-[#111118] md:right-6 md:top-[26px] md:px-3 md:py-[7px] md:text-[12px]">Recommended</span>
                <div>
                  <p className="text-[15px] font-semibold text-[#e4dfff] md:text-[16px]">{p.title}</p>
                  <p className="mt-1 text-[44px] font-bold leading-[48px] tracking-[-0.04em] md:mt-2 md:text-[54px] md:leading-[58px]">
                    {p.priceDisplay}
                    <span className="text-[14px] font-medium tracking-normal text-[#e4dfff] md:text-[16px]"> {p.periodLabel}</span>
                  </p>
                  <p className="mt-1.5 text-[14px] text-[#e4dfff]">{p.valueLine}</p>
                </div>
                <ul className="flex flex-col gap-2 border-t border-white/25 pt-4 text-[14px] md:gap-2.5 md:pt-5 md:text-[15px]">
                  {bullets.map((b) => (
                    <li key={b}>✓ {b}</li>
                  ))}
                </ul>
                {button}
              </div>
            );
          })}
        </div>
        <p className="mt-3.5 text-center text-[12px] leading-[18px] text-[#66647c] sm:mt-5 sm:text-[14px]">
          Secure checkout by Polar · Passes never auto-renew · 7-day refund on monthly plans · Prices in USD
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto grid max-w-[1360px] items-start gap-[22px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal">
          <p className={label}>/ Questions</p>
          <h2 className="lc-h2 mt-3.5 sm:mt-5">
            Asked a lot. <span>Answered plainly.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-[25px] text-[#4a4862]">
            Something else?{" "}
            <a href="mailto:support@launch-cv.com" className="font-semibold text-[#5440e8] hover:underline">
              support@launch-cv.com
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {faqs.map((f, i) => (
            <details key={f.q} className="lc-faq group rounded-[22px] bg-white p-[18px] transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] sm:rounded-3xl sm:px-6 sm:py-[22px]" open={i === 0}>
              <summary className="flex min-h-[34px] items-center justify-between gap-3 sm:gap-4">
                <span className="text-[16px] font-bold sm:text-[18px]">{f.q}</span>
                <FaqIcon />
              </summary>
              <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862] sm:mt-3 sm:text-[16px] sm:leading-[26px]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1360px] px-4 pt-[72px] sm:px-6 sm:pt-24 lg:px-10 lg:pt-[140px]">
        <div className="lc-reveal relative flex flex-col overflow-hidden rounded-[28px] bg-[#111118] text-white sm:block sm:h-[560px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster px-[22px] pt-7 text-[58px] leading-[56px] text-[#c9c0ff] sm:absolute sm:left-[60px] sm:p-0 sm:top-14 sm:text-[84px] sm:leading-[84px] lg:text-[112px] lg:leading-[112px]">
            NEXT
            <br className="sm:hidden" /> JOB
          </p>
          <div aria-hidden="true" className="absolute -bottom-[180px] -right-[60px] h-[360px] w-[360px] rounded-full bg-[#5440e8] sm:h-[420px] sm:w-[420px] lg:h-[560px] lg:w-[560px]" />
          <ResumeSheet
            example="software-engineer"
            template="classic"
            className="relative order-last ml-auto mr-[22px] mt-6 h-[200px] w-[230px] [--peek:0.282] sm:hidden lg:absolute lg:bottom-0 lg:right-12 lg:mr-0 lg:mt-0 lg:block lg:h-[420px] lg:w-[320px] lg:[--peek:0.392]"
          />
          <div className="relative z-10 px-[22px] pt-8 sm:absolute sm:bottom-16 sm:left-16 sm:max-w-[500px] sm:p-0">
            <h2 className="text-[28px] font-extrabold leading-[33px] tracking-[-0.03em] sm:text-[40px] sm:leading-[1.15]">{cta.title}</h2>
            <p className="mt-2.5 text-[15px] leading-[23px] text-[#c9c7d8] sm:mt-3.5 sm:text-[17px] sm:leading-[26px]">{cta.lead}</p>
            <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-6 sm:flex-row">
              <CtaLink cta="check_resume" location="home_final" href="/free-ats-check" className={`${btn} w-full bg-[#5440e8] !py-4 text-white hover:bg-[#4430d6] sm:w-auto sm:!py-[17px]`}>
                {cta.primaryCta}
              </CtaLink>
              <CtaLink cta="build_resume" location="home_final" href={BUILD_HREF} className={`${btn} bg-white text-[#111118] max-sm:hidden`}>
                {cta.secondaryCta}
              </CtaLink>
            </div>
            <p className="mt-3 text-[13px] text-[#9a97b3] sm:text-[14px]">No sign-up · one free check every 30 days per network</p>
          </div>
          <span aria-hidden="true" className="lc-poster absolute bottom-10 left-[22px] z-10 -rotate-6 rounded-full bg-[#ff7a33] px-3 py-[7px] text-[12px] text-[#111118] sm:bottom-auto sm:left-auto sm:right-6 sm:top-[120px] sm:-rotate-[8deg] sm:px-[15px] sm:py-[9px] sm:text-[14px] lg:left-[600px] lg:right-auto lg:top-[210px]">
            NO SIGN-UP
          </span>
        </div>
      </section>
    </SiteShell>
  );
}

function Bad({ children }: { children: React.ReactNode }) {
  return <span className="rounded-[5px] bg-[#ff7a33] px-[7px] py-0.5 text-[#111118]">{children}</span>;
}

function Hit({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-[#c9c0ff] px-1 py-px">{children}</span>;
}

function Miss({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-[#ffd3bd] px-1 py-px">{children}</span>;
}

function Issue({ title, level, fix }: { title: string; level: "High" | "Medium"; fix?: string }) {
  return (
    <div className="rounded-2xl bg-[#f7f6fb] px-4 py-3.5 transition-colors hover:bg-[#efedf7]">
      <div className="flex justify-between gap-3">
        <span className="text-[15px] font-bold">{title}</span>
        <span className={`h-fit shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold ${level === "High" ? "bg-[#fbe2e3] text-[#c42b30]" : "bg-[#fdf0d5] text-[#a15c00]"}`}>{level}</span>
      </div>
      {fix ? <p className="mt-1 text-[14px] text-[#4a4862]">Fix: {fix}</p> : null}
    </div>
  );
}
