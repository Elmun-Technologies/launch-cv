import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { FreeAtsClient } from "@/components/free-ats-client";
import { XrayDemo } from "@/components/home/xray-demo";
import { FixDemo } from "@/components/home/fix-demo";
import { CountUp, FloatingChips, Magnetic, Marker, Marquee, Reveal, Spotlight, Tilt, WordReveal } from "@/components/home/fx";
import { ResumePreview } from "@/components/resume-preview";
import { getResumeExample, RESUME_EXAMPLES } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { TEMPLATE_SPECS, type TemplateStyle } from "@/lib/resume-templates";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { getPublishedPosts } from "@/lib/cms/blog";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS, planPriceLabel, planNameList } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { ArrowRight, Check, Minus } from "lucide-react";

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

/** One job post, marked up the way the matcher reads it. */
const JOB_KEYWORDS = [
  { k: "roadmap", have: true },
  { k: "SQL", have: true },
  { k: "A/B testing", have: true },
  { k: "customer interviews", have: true },
  { k: "stakeholder management", have: false },
  { k: "pricing", have: true },
  { k: "B2B SaaS", have: true },
  { k: "OKRs", have: false },
];

const FACTS = [
  { n: "~10 s", l: "to your ATS score" },
  { n: "0", l: "files kept after the check" },
  { n: "4", l: "ATS-safe templates, free PDF" },
  { n: "16", l: "role examples with cover letters" },
];

/** The real templates, rendered by the same component as the editor preview. */
const templates = (
  [
    { template: "classic", example: "software-engineer" },
    { template: "modern", example: "product-manager" },
    { template: "minimal", example: "marketing-manager" },
    { template: "executive", example: "financial-analyst" },
  ] as { template: TemplateStyle; example: string }[]
).flatMap((t) => {
  const e = getResumeExample(t.example);
  return e ? [{ ...t, content: exampleToContent(e) }] : [];
});

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
    a: "Your data is encrypted in transit and at rest, and we never sell it. Resume text is sent to our AI provider only to produce the results you ask for. Voice input uses your browser's speech recognition; we receive the text, not the audio.",
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

const h2 = "text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111111] sm:text-[46px]";
const grey = "text-[#8A8A86]";

export default async function Home() {
  const latestPosts = (await getPublishedPosts()).slice(0, 3);
  const pm = getResumeExample("product-manager");

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={homeLd} />
      <JsonLd data={faqLd} />
      <LandingNav />
      <main>
        {/* HERO — the real check, right here */}
        <section
          id="check"
          className="scroll-mt-16 bg-[#FAFAF7] bg-[radial-gradient(#E4E2DC_1px,transparent_1px)] [background-size:22px_22px]"
        >
          <Spotlight className="pb-16 pt-[112px] sm:pt-[132px]">
          <div className="mx-auto max-w-[1100px] px-5 text-center sm:px-6">
            <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[#E5E5E2] bg-white px-3.5 py-1.5 text-[12px] text-[#3F3F3F] sm:gap-x-3 sm:px-4 sm:text-[13px]">
              <span>Free ATS check</span>
              <span className="text-[#C9C9C4]">·</span>
              <span>No sign-up</span>
              <span className="text-[#C9C9C4]">·</span>
              <span>Your file isn&apos;t stored</span>
            </p>
            <h1 className="mx-auto mt-6 max-w-[920px] text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[64px] lg:text-[76px]">
              <WordReveal text="Find out why your resume" />{" "}
              <Marker delay={700}>
                <WordReveal text="isn't getting interviews." delay={0.3} />
              </Marker>
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-[17px] leading-[1.6] text-[#3F3F3F] sm:text-[19px]">
              Most applications are read by software before a person sees them. Upload yours and see what that software
              gets wrong — with a fix for every issue.
            </p>
          </div>
          <Reveal delay={0.5} className="relative mx-auto mt-10 max-w-[1100px] px-5 sm:px-6">
            <FloatingChips />
            <FreeAtsClient />
          </Reveal>
          <div className="mx-auto mt-14 max-w-[1100px] px-5 sm:px-6">
            <p className="text-center text-[13px] text-[#6B6B6B]">Checked against the parsing rules common to</p>
            <div className="mt-3">
              <Marquee items={["Workday", "Greenhouse", "Lever", "iCIMS", "Taleo", "SuccessFactors", "SmartRecruiters", "Ashby", "Jobvite", "BambooHR"]} />
            </div>
          </div>
          </Spotlight>
        </section>

        {/* X-RAY */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-28">
          <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[14px] font-medium text-[#6B6B6B]">Why good resumes get filtered</p>
              <h2 className={`${h2} mt-3`}>
                It looks fine to you. <span className={grey}>The software reads something else.</span>
              </h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#3F3F3F]">
                Columns, text boxes and headers are the usual culprits. The parser reads left to right, line by line, and
                the email, dates or skills end up in the wrong field — or nowhere.
              </p>
              <p className="mt-4 text-[17px] leading-[1.65] text-[#3F3F3F]">
                LaunchCV reads your resume the same way and shows you exactly what came out.
              </p>
            </div>
            <XrayDemo />
          </Reveal>
        </section>

        {/* FIX DEMO */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-32">
          <div className="max-w-[760px]">
            <p className="text-[14px] font-medium text-[#6B6B6B]">From report to ready</p>
            <h2 className={`${h2} mt-3`}>
              Every issue comes with the fix. <span className={grey}>Try it on this one.</span>
            </h2>
          </div>
          <Reveal className="mt-10">
            <FixDemo />
          </Reveal>
        </section>

        {/* TAILOR */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-32">
          <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[18px] border border-[#E5E5E2] bg-white p-6 sm:p-8">
                <p className="text-[13px] text-[#6B6B6B]">Job post · Senior Product Manager · Northwind</p>
                <p className="mt-3 text-[15px] leading-[1.75] text-[#3F3F3F]">
                  You&apos;ll own the <Marker delay={180}>roadmap</Marker> for our <Marker delay={360}>B2B SaaS</Marker>{" "}
                  scheduling product, run <Marker delay={540}>customer interviews</Marker> and use{" "}
                  <Marker delay={720}>SQL</Marker> and <Marker delay={900}>A/B testing</Marker> to decide what ships.
                  Strong <Marker delay={1080}>stakeholder management</Marker> across sales and legal, experience with{" "}
                  <Marker delay={1260}>pricing</Marker>, and a habit of setting clear <Marker delay={1440}>OKRs</Marker>.
                </p>
                <div className="mt-6 border-t border-[#EEEEEB] pt-5">
                  <div className="flex items-baseline justify-between">
                    <p className="text-[15px] font-semibold">Your resume covers</p>
                    <p className="text-[15px] font-semibold tabular-nums">
                      {JOB_KEYWORDS.filter((k) => k.have).length} of {JOB_KEYWORDS.length}
                    </p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#EEEEEB]">
                    <div
                      className="h-2 rounded-full bg-[#111111] transition-[width] duration-1000"
                      style={{ width: `${(JOB_KEYWORDS.filter((k) => k.have).length / JOB_KEYWORDS.length) * 100}%` }}
                    />
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px]">
                    {JOB_KEYWORDS.map((k) => (
                      <li key={k.k} className={`flex items-center gap-2 ${k.have ? "text-[#111111]" : "text-[#C2341B]"}`}>
                        {k.have ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden /> : <Minus className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                        {k.k}
                        <span className="sr-only">{k.have ? "(covered)" : "(missing)"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[14px] font-medium text-[#6B6B6B]">One resume, many jobs</p>
              <h2 className={`${h2} mt-3`}>
                Paste the job post. <span className={grey}>See what it&apos;s looking for.</span>
              </h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#3F3F3F]">
                LaunchCV pulls out the skills and phrases the employer uses, checks which ones your resume already says,
                and suggests rewrites for the bullets that should — using only what you actually did.
              </p>
              <p className="mt-4 text-[17px] leading-[1.65] text-[#3F3F3F]">
                Then write the cover letter and prepare for the interview from the same job post.
              </p>
              <Link
                href="/features/jd-alignment"
                className="mt-6 inline-flex items-center gap-1.5 font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]"
              >
                How job matching works <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* FACTS */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-28">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-[#E5E5E2] bg-[#E5E5E2] lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.l} className="group bg-white px-6 py-7 transition-colors hover:bg-[#FFFBEA]">
                <dt className="sr-only">{f.l}</dt>
                <dd className="text-[40px] font-semibold leading-none tracking-[-0.04em] sm:text-[48px]">
                  <CountUp value={f.n} />
                </dd>
                <dd className="mt-2 text-[14px] text-[#6B6B6B]">{f.l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* TEMPLATES */}
        <section className="pt-24 sm:pt-32">
          <div className="mx-auto flex max-w-[1100px] flex-wrap items-end justify-between gap-6 px-5 sm:px-6">
            <h2 className={`${h2} max-w-[700px]`}>
              Four templates. <span className={grey}>All one column, all readable by the software.</span>
            </h2>
            <Link
              href="/resume-templates"
              className="inline-flex h-11 items-center rounded-full border border-[#D9D9D5] px-5 text-[15px] font-medium transition hover:border-[#111111]"
            >
              See the templates
            </Link>
          </div>
          <div className="mx-auto mt-10 flex max-w-[1100px] gap-5 overflow-x-auto px-5 pb-2 sm:px-6 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {templates.map((t) => (
              <Link key={t.template} href="/resume-templates" className="group block w-[240px] shrink-0 lg:w-auto">
                <Tilt>
                  <span className="block rounded-[14px] bg-[#F3F1EC] p-5 transition-[background-color,box-shadow] duration-300 group-hover:bg-[#ECE9E2] group-hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]" aria-hidden="true">
                    <ResumePreview content={t.content} template={t.template} />
                  </span>
                </Tilt>
                <span className="mt-3 flex items-center justify-between text-[15px] font-medium">
                  {TEMPLATE_SPECS[t.template].label}
                  <span className="translate-x-[-4px] text-[13px] text-[#1D4ED8] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Use it →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* EXAMPLES INDEX */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-32">
          <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className={h2}>
                Start from a real example. <span className={grey}>Not a blank page.</span>
              </h2>
              <p className="mt-5 text-[17px] leading-[1.65] text-[#3F3F3F]">
                Each one has a full resume, the keywords for that role and an annotated cover letter by the same person.
                Open it in the editor and replace the details with yours.
              </p>
              {pm ? (
                <Link
                  href="/resume-examples/product-manager"
                  className="mt-6 inline-flex items-center gap-1.5 font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]"
                >
                  See the {pm.role.toLowerCase()} example <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {RESUME_EXAMPLES.map((e) => (
                <li key={e.slug} className="border-t border-[#E5E5E2]">
                  <Link
                    href={`/resume-examples/${e.slug}`}
                    className="group -mx-3 flex items-center justify-between gap-3 rounded-[10px] px-3 py-3.5 transition-colors hover:bg-[#F3F1EC]"
                  >
                    <span>
                      <span className="block text-[16px] font-medium group-hover:text-[#1D4ED8]">{e.role}</span>
                      <span className="block text-[13px] text-[#6B6B6B]">{e.level}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#8A8A86] transition group-hover:translate-x-0.5 group-hover:text-[#1D4ED8]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* PRICING */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-32">
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="flex-1">
              <h2 className={h2}>
                The check is free. <span className={grey}>The AI tools start at {PUBLIC_PLANS.starter.priceDisplay} a month.</span>
              </h2>
              <p className="mt-5 max-w-[440px] text-[17px] leading-[1.6] text-[#3F3F3F]">
                The editor, PDF export and templates are free too. Every plan has every AI tool; they differ only in monthly
                limits. Cancel in one click, or pay once with Lifetime.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:flex-[1.3]">
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
                    className={`group flex flex-col rounded-[14px] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.35)] ${
                      cfg.popular ? "border-2 border-[#111111]" : "border border-[#E5E5E2] hover:border-[#111111]"
                    }`}
                  >
                    <span className="text-[15px] text-[#6B6B6B]">{cfg.title}</span>
                    <span className="mt-1 text-[32px] font-semibold tracking-[-0.03em]">
                      {cfg.priceDisplay}
                      <span className="ml-1 text-[14px] font-normal tracking-normal text-[#6B6B6B]">{cfg.periodLabel}</span>
                    </span>
                    <span className="mt-1 flex-1 text-[14px] leading-[1.5] text-[#3F3F3F]">{cfg.valueLine}</span>
                    <span className="mt-4 inline-flex items-center gap-1 whitespace-nowrap text-[14px] font-medium text-[#111111]">
                      Details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </CtaLink>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-32">
          <h2 className={`${h2} text-center`}>Questions</h2>
          <HomeClient faqItems={faqs} />
        </section>

        {/* BLOG */}
        {latestPosts.length > 0 ? (
          <section className="mx-auto w-full max-w-[1100px] px-5 pt-24 sm:px-6 sm:pt-28">
            <div className="flex items-end justify-between gap-4">
              <h2 className={h2}>
                Resume guides. <span className={grey}>Written for job seekers.</span>
              </h2>
              <Link
                href="/blog"
                className="hidden shrink-0 font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8] sm:inline"
              >
                All articles →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col border-t border-[#E5E5E2] pt-5">
                  <span className="text-[13px] text-[#6B6B6B]">{post.category}</span>
                  <span className="mt-2 text-[17px] font-semibold leading-snug group-hover:text-[#1D4ED8]">{post.title}</span>
                  <span className="mt-2 line-clamp-2 text-[14px] leading-[1.6] text-[#3F3F3F]">{post.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* FINAL CTA */}
        <section className="mx-auto w-full max-w-[1100px] px-5 pb-24 pt-24 sm:px-6 sm:pt-32">
          <div className="relative overflow-hidden rounded-[24px] bg-[#111111] px-7 py-14 text-center text-white sm:px-14 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2A2A2A_1px,transparent_1px)] [background-size:22px_22px] opacity-70"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-[760px] text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[56px]">
                Ten seconds to see what the software sees.
              </h2>
              <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.6] text-[#B5B5B0]">
                Free, no account, and your file isn&apos;t kept. If it finds nothing to fix, you&apos;ve lost ten seconds.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <CtaLink
                    cta="check_resume"
                    location="home_footer"
                    href="#check"
                    className="lcv-shine inline-flex h-[52px] items-center rounded-full bg-[#FFE27A] px-7 text-[16px] font-medium text-[#111111] transition hover:bg-[#FFD84D]"
                  >
                    Check my resume — free
                  </CtaLink>
                </Magnetic>
                <CtaLink
                  cta="get_started"
                  location="home_footer"
                  href="/register"
                  className="inline-flex h-[52px] items-center rounded-full border border-white/25 px-6 text-[16px] font-medium text-white transition hover:border-white"
                >
                  Build a new resume
                </CtaLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
