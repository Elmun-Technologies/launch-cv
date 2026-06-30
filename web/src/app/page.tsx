import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { HomeClient } from "@/components/home-client";
import { LandingHero } from "@/components/landing-hero";
import { MotionReveal, MotionStagger, MotionItem } from "@/components/motion-reveal";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import {
  ArrowRight,
  Check,
  Star,
  Target,
  FileText,
  Mail,
  MessageSquare,
  BarChart3,
  Mic,
} from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "AI Resume Builder & Job Search Platform",
  description:
    "Launch CV pairs an AI resume builder with JD alignment, ATS scoring, cover letter generation, interview prep, and voice input. One paid plan. Built for serious job seekers.",
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
      name: "Launch CV — AI Resume Builder & Job Search Platform",
      description:
        "AI resume builder with JD alignment, ATS scoring, cover letters, and interview prep — under one subscription.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "Launch CV", url: getSiteUrl() },
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
    desc: "Twelve ATS-tested templates. Plain-English input becomes quantified, professional bullets.",
    icon: FileText,
    iconBg: "bg-violet-50 text-violet-700",
  },
  {
    href: "/features/ats-score",
    title: "ATS Score Checker",
    desc: "Run your resume through 15 ATS engines. Get a 0–100 score and a prioritized fix list.",
    icon: BarChart3,
    iconBg: "bg-orange-50 text-orange-700",
  },
  {
    href: "/features/cover-letter",
    title: "Cover Letter Generator",
    desc: "Personalized letters in 60 seconds. Four tones. Fourteen languages. ATS-safe formatting.",
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
    desc: "Speak naturally and Launch CV turns your words into ATS-ready resume bullets. Twelve languages supported.",
    icon: Mic,
    iconBg: "bg-pink-50 text-pink-700",
  },
];

const trustedBy = ["Stripe", "Notion", "Linear", "HubSpot", "Vercel", "Figma", "Datadog", "Ramp"];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer at Stripe",
    quote: "Zero callbacks for three months. Four interviews in one week after Launch CV rewrote my bullets to match the JDs.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Product Manager at Notion",
    quote: "My ATS score went from 38 to 93. Three offers in two weeks. The fixes were obvious in hindsight.",
    rating: 5,
  },
  {
    name: "Priya N.",
    role: "Marketing Lead at HubSpot",
    quote: "The cover letter generator writes better letters than I do. Saves me two hours per application — easily.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is there a free plan?",
    a: "No. Launch CV is a paid professional product. AI features require an active plan: Starter, Professional, or Lifetime. You can create an account first; checkout unlocks the AI.",
  },
  {
    q: "Why does ATS matter?",
    a: "Applicant Tracking Systems scan and filter resumes before a human reads them. Roughly 75% of resumes are auto-rejected. Launch CV is tested against the 15 most common ATS platforms.",
  },
  {
    q: "What file formats can I download?",
    a: "PDF and DOCX, both ATS-clean. A plain-text view is also available for email pasting or LinkedIn import.",
  },
  {
    q: "How is this different from other resume builders?",
    a: "Launch CV pairs the builder with JD alignment, ATS scoring, cover letters, and interview prep — under one paid plan with predictable AI limits and no upsell modals.",
  },
  {
    q: "Is my data safe and private?",
    a: "Yes. Data is encrypted in transit and at rest, we are GDPR and CCPA compliant, and we never sell user data. Voice audio is processed in-memory and discarded after transcription.",
  },
  {
    q: "How long does building a resume take?",
    a: "Most users finish a polished, ATS-tested PDF in under five minutes with AI suggestions and the live preview.",
  },
  {
    q: "Does it work for all industries?",
    a: "Yes. Twelve templates across tech, finance, healthcare, marketing, design, operations, and management. The AI is calibrated per vertical.",
  },
  {
    q: "What is the Lifetime plan?",
    a: "A one-time payment of $79 with no renewals. Generous monthly fair-use AI caps included. Pay once, keep using.",
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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={homeLd} />
      <JsonLd data={faqLd} />
      <LandingNav />

      {/* HERO */}
      <LandingHero />

      {/* TRUST BAR */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-center text-[12px] font-medium uppercase tracking-wider text-[#94A3B8]">
            Built with — and used by — people now at
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-80">
            {trustedBy.map((n) => (
              <span key={n} className="text-[16px] font-semibold tracking-tight text-[#64748B]">
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">The toolkit</p>
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
                  <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#1A56DB]">
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A complete application in three steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Most users finish their first ATS-clean resume and cover letter in under ten minutes.
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
                copy: "Quantified bullets. Keywords mapped to the JD. ATS score against 15 engines. All within seconds.",
              },
              {
                n: "03",
                title: "Export and apply",
                copy: "PDF, DOCX, or plain text. Cover letter generated from the same JD. Interview drills ready to start.",
              },
            ].map((s) => (
              <MotionReveal key={s.n}>
                <div className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EFF6FF] text-[13px] font-bold text-[#1A56DB]">
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

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Customer stories</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Trusted by people who landed offers
              </h2>
            </div>
          </MotionReveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <MotionReveal key={t.name}>
                <figure className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-[1.7] text-[#0F172A]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <p className="text-[14px] font-semibold text-[#0F172A]">{t.name}</p>
                    <p className="text-[13px] text-[#64748B]">{t.role}</p>
                  </figcaption>
                </figure>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <MotionReveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="lc-overline text-[#1A56DB]">Pricing</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Pay monthly, yearly, or once
                </h2>
              </div>
              <p className="text-[16px] leading-[1.65] text-[#475569] lg:col-span-5">
                Every tool is included on every plan. The only thing that changes is the monthly AI ceiling.
              </p>
            </div>
          </MotionReveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
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
                    popular ? "border-2 border-[#1A56DB] shadow-[0_20px_40px_-20px_rgba(26,86,219,0.25)]" : "border border-[#E2E8F0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[16px] font-semibold text-[#0F172A]">{cfg.title}</p>
                    {popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#1A56DB]">
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
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/pricing"
                    className={`mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] font-semibold transition ${
                      popular
                        ? "bg-[#1A56DB] text-white hover:bg-[#1D4ED8]"
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
              <p className="lc-overline text-[#1A56DB]">FAQ</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#475569]">
                Can&apos;t find what you need?{" "}
                <Link href="/dashboard/support" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
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

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Start your next job search the right way
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Create an account, choose a plan, and paste your first job description. The first interview reply often lands within days.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]"
            >
              From {PUBLIC_PLANS.starter.priceDisplay}{PUBLIC_PLANS.starter.periodLabel} · Lifetime {PUBLIC_PLANS.lifetime.priceDisplay}
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
