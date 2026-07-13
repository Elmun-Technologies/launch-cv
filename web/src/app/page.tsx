import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { LandingHero } from "@/components/landing-hero";
import { ProductShowcase } from "@/components/product-showcase";
import { ResumeTemplateGallery } from "@/components/resume-template-gallery";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/motion-reveal";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { getPublishedPosts } from "@/lib/cms/blog";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS, planPriceLabel, planNameList } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import {
  ArrowRight,
  Check,
  Sparkles,
  Download,
  Target,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  Mic,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "AI Resume Builder & Job Search Platform",
  description: `AI resume builder with JD alignment, ATS scoring, cover letters, and interview prep — all in one plan. Check your resume's ATS score free. Plans from ${planPriceLabel("starter")}.`,
  pathname: "/",
  keywords: [
    "AI resume builder",
    "ATS resume checker",
    "JD alignment",
    "cover letter generator",
    "interview prep AI",
    "resume optimization",
  ],
});

const homeLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "LaunchCV — AI Resume Builder & Job Search Platform",
      description:
        "AI resume builder with JD alignment, ATS scoring, cover letters, and interview prep — under one subscription.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "LaunchCV", url: getSiteUrl() },
    },
  ],
};

const features = [
  {
    href: "/features/jd-alignment",
    title: "JD Alignment",
    desc: "Paste any job description. AI maps every requirement to your resume and rewrites bullets to lift your match score.",
    icon: Target,
    iconBg: "bg-blue-50 text-blue-700",
  },
  {
    href: "/features/resume-builder",
    title: "AI Resume Builder",
    desc: "Four ATS-tested templates. Plain-English input becomes quantified, professional bullets.",
    icon: FileText,
    iconBg: "bg-violet-50 text-violet-700",
  },
  {
    href: "/features/ats-score",
    title: "ATS Score Checker",
    desc: "Check your resume against the formatting and keyword signals ATS software relies on. Get a 0–100 score and a prioritized fix list.",
    icon: BarChart3,
    iconBg: "bg-orange-50 text-orange-700",
  },
  {
    href: "/features/cover-letter",
    title: "Cover Letter Generator",
    desc: "Personalized letters in under a minute. Multiple tones and languages. ATS-safe formatting.",
    icon: Mail,
    iconBg: "bg-teal-50 text-teal-700",
  },
  {
    href: "/features/interview-prep",
    title: "Interview Prep",
    desc: "Role-specific question banks, AI-scored answers, and benchmark responses to calibrate against.",
    icon: MessageSquare,
    iconBg: "bg-emerald-50 text-emerald-700",
  },
  {
    href: "/features/voice-input",
    title: "Voice Input",
    desc: "Speak naturally and LaunchCV turns your words into ATS-ready resume bullets — no typing required.",
    icon: Mic,
    iconBg: "bg-pink-50 text-pink-700",
  },
];

// Honest capability strip — real product facts, not fabricated logos or metrics.
const capabilities = [
  { icon: BarChart3, label: "Free ATS score — no signup" },
  { icon: FileText, label: "4 ATS-tested templates" },
  { icon: Sparkles, label: "6 AI tools, one plan" },
  { icon: Download, label: "PDF & DOCX export" },
];

// "Why it works" — persuasive, benefit-led copy grounded in what the product
// actually does. No invented reviews, ratings, or user counts.
const benefits = [
  {
    icon: Target,
    title: "Tailored to each job, not generic",
    desc: "Paste the job description and LaunchCV maps every requirement to your resume, then rewrites bullets to close the gaps — so you apply with a resume built for that role.",
  },
  {
    icon: BarChart3,
    title: "See what the software sees",
    desc: "Get a 0–100 ATS score with a prioritized, plain-English fix list before a recruiter ever opens your file — no guessing why applications stall.",
  },
  {
    icon: Sparkles,
    title: "One workspace, every step",
    desc: "Resume, JD alignment, ATS score, cover letter, and interview prep share the same context, so each tool builds on the last. No copy-pasting between tabs.",
  },
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
    a: "PDF and DOCX, both ATS-clean. A plain-text view is also available for email pasting or LinkedIn import.",
  },
  {
    q: "How is this different from other resume builders?",
    a: "LaunchCV pairs the builder with JD alignment, ATS scoring, cover letters, and interview prep — under one paid plan with predictable AI limits and no upsell modals.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Your data is encrypted in transit and at rest, and we never sell it. Voice audio is processed in-memory and discarded after transcription.",
  },
  {
    q: "How long does building a resume take?",
    a: "Most users finish a polished, ATS-tested PDF in under five minutes with AI suggestions and the live preview.",
  },
  {
    q: "Does it work for all industries?",
    a: "Yes. The templates work across tech, finance, healthcare, marketing, design, operations, and management, and the AI is calibrated per vertical so the language fits your field.",
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

export default async function Home() {
  const latestPosts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={homeLd} />
      <JsonLd data={faqLd} />
      <LandingNav />

      {/* HERO */}
      <LandingHero />

      {/* CAPABILITY STRIP — honest product facts */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-6">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-10">
            {capabilities.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#475569] sm:text-[14px]"
              >
                <c.icon className="h-4 w-4 shrink-0 text-[#1A56DB]" />
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <ProductShowcase />

      {/* RESUME TEMPLATE GALLERY */}
      <ResumeTemplateGallery />

      {/* FEATURE GRID */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">The toolkit</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six AI tools for every stage of the job search
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Match, write, score, send, practice, and speak — every output feeds the next tool. No copy-pasting between tabs.
              </p>
            </div>
          </MotionReveal>

          <MotionStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <MotionItem key={f.href} className="h-full">
                <Link
                  href={f.href}
                  className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.22)]"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${f.iconBg}`}>
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{f.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563EB]">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* POPULAR RESOURCES — keyword-rich internal linking hub */}
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Most popular</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Start with the two tools job seekers use most
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Two free-to-start tools do the heavy lifting: check whether your resume can pass
                the software, then tailor it to the exact job you want.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <MotionReveal>
              <Link
                href="/features/ats-score"
                className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-7 transition hover:border-[#CBD5E1] hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
                  <BarChart3 className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold text-[#0F172A]">
                  Free ATS score checker — see how your resume reads to ATS software
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-[1.7] text-[#475569]">
                  Upload your resume and get a 0–100 ATS score in seconds, with a
                  prioritized list of every formatting and keyword fix. See{" "}
                  <span className="font-semibold text-[#2563EB] underline-offset-2 group-hover:underline">
                    how to check your resume&apos;s ATS score
                  </span>
                  .
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563EB]">
                  Check my ATS score
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </MotionReveal>

            <MotionReveal>
              <Link
                href="/features/jd-alignment"
                className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-7 transition hover:border-[#CBD5E1] hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.2)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Target className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold text-[#0F172A]">
                  JD alignment — match your resume to any job description
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-[1.7] text-[#475569]">
                  Paste a job description and AI runs a keyword gap analysis, then rewrites your
                  bullets to close the gaps and lift your match score —{" "}
                  <span className="font-semibold text-[#2563EB] underline-offset-2 group-hover:underline">
                    tailor your resume to the job
                  </span>{" "}
                  in under a minute.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563EB]">
                  Align my resume
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </MotionReveal>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#475569]">
            <span className="font-semibold text-[#94A3B8]">Popular guides:</span>
            <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              What is an ATS score?
            </Link>
            <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              How to check your ATS score
            </Link>
            <Link href="/blog/resume-keywords-for-software-engineers" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              Resume keywords for software engineers
            </Link>
            <Link href="/compare/ats-resume-checkers" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              Best ATS resume checkers
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A complete application in three steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Go from raw experience to an ATS-clean resume and a matching cover letter in one sitting.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                n: "01",
                title: "Bring your raw experience",
                copy: "Paste an existing resume, type your history plainly, or speak it with voice input. No formatting required.",
              },
              {
                n: "02",
                title: "AI writes, scores, and matches",
                copy: "Quantified bullets. Keywords mapped to the JD. An ATS score with a prioritized fix list. All within seconds.",
              },
              {
                n: "03",
                title: "Export and apply",
                copy: "PDF, DOCX, or plain text. Cover letter generated from the same JD. Interview drills ready to start.",
              },
            ].map((s) => (
              <MotionReveal key={s.n}>
                <div className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EFF6FF] text-[13px] font-bold text-[#2563EB]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold text-[#0F172A]">{s.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{s.copy}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <HomeClient />

      {/* WHY IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Why it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built to get you seen — not just to format a resume
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every tool targets the real reason applications stall: a resume that doesn&apos;t
                match the job or clear the software screening it first.
              </p>
            </div>
          </MotionReveal>

          <MotionStagger className="mt-12 grid gap-5 lg:grid-cols-3">
            {benefits.map((b) => (
              <MotionItem key={b.title} className="h-full">
                <div className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{b.title}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.7] text-[#475569]">{b.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="lc-overline text-[#2563EB]">Pricing</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Pay monthly or once
                </h2>
              </div>
              <p className="text-[16px] leading-[1.65] text-[#475569] lg:col-span-5">
                Every tool is included on every plan. The only thing that changes is the monthly AI ceiling.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHECKOUT_PLAN_ORDER.map((key) => {
              const cfg = PUBLIC_PLANS[key];
              const popular = !!cfg.popular;
              const tagline: Record<string, string> = {
                starter: "Try the workflow — monthly, cancel anytime.",
                professional: "Best balance of limits and price.",
                lifetime: "One payment. Forever access.",
              };
              return (
                <div
                  key={key}
                  className={`flex flex-col rounded-xl bg-white p-7 ${
                    popular ? "border-2 border-[#2563EB] shadow-[0_20px_40px_-20px_rgba(26,86,219,0.25)]" : "border border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-semibold text-[#0F172A]">{cfg.title}</p>
                    {popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
                        Most chosen
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-[#64748B]">{tagline[key]}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-[40px] font-bold leading-none tracking-tight text-[#0F172A]">{cfg.priceDisplay}</span>
                    <span className="text-[14px] text-[#94A3B8]">{cfg.periodLabel}</span>
                  </div>
                  <p className="mt-2 text-[12px] text-[#94A3B8]">{cfg.billingExplainer}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-[14px] text-[#334155]">
                    {[
                      "All 6 AI tools",
                      key === "starter" ? "Monthly fair-use limits" : "Generous AI ceilings",
                      "PDF + DOCX export",
                      key === "lifetime" ? "Lifetime updates · no renewal" : "Cancel anytime",
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] font-semibold transition ${
                      popular
                        ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                        : "border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {key === "lifetime" ? "Buy Lifetime" : `Choose ${cfg.title}`}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="lc-overline text-[#2563EB]">FAQ</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#475569]">
                Can&apos;t find what you need?{" "}
                <Link href="/contact" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
                  Email support
                </Link>{" "}
                — we reply within one business day.
              </p>
            </div>
            <div className="lg:col-span-8">
              <HomeClient faqItems={faqs} />
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      {latestPosts.length > 0 ? (
        <section className="border-t border-[#E2E8F0] py-20 sm:py-24">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="lc-overline text-[#2563EB]">From the blog</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">Career &amp; resume guides</h2>
              </div>
              <Link
                href="/blog"
                className="hidden shrink-0 items-center gap-1 text-[14px] font-semibold text-[#2563EB] hover:underline sm:inline-flex"
              >
                All articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                    {post.category}
                  </span>
                  <h3 className="mt-2 text-[16px] font-semibold leading-snug text-[#0F172A] transition group-hover:text-[#2563EB]">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-[1.65] text-[#475569]">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563EB]">
                    Read article
                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Start your next job search the right way
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Create an account, choose a plan, and paste your first job description — LaunchCV tailors your resume, scores it against ATS, and drafts the cover letter.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaLink cta="get_started" location="home"
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </CtaLink>
            <Link
              href="/pricing"
              className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]"
            >
              From {PUBLIC_PLANS.starter.priceDisplay} a month · Lifetime {PUBLIC_PLANS.lifetime.priceDisplay}
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
