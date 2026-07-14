import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { KeyFacts } from "@/components/key-facts";
import { RevealOnView } from "@/components/reveal-on-view";
import { FeatureRelatedLinks } from "@/components/feature-related-links";
import { StickyCta } from "@/components/sticky-cta";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { ProductScreenshot } from "@/components/product-screenshot";
import { absoluteUrl } from "@/lib/site";
import { FaqSection } from "@/components/faq-section";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import {
  FileText,
  ArrowRight,
  Check,
  Wand2,
  Layers,
  Eye,
  Download,
  Sparkles,
  Target,
  Mail,
  Mic,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Resume Builder for Software Engineers, Free",
  description:
    "The AI resume builder software engineers trust: 4 ATS-tested templates, quantified bullets, and PDF/DOCX export in minutes. Build yours free →",
  pathname: "/features/resume-builder",
  keywords: [
    "resume builder software engineer",
    "AI resume builder",
    "ATS friendly resume builder",
    "professional resume templates",
    "online resume maker",
    "resume generator AI",
  ],
});

const faqs: FaqItem[] = [
  {
    q: "How long does building a resume take with LaunchCV?",
    a: "Building a resume with LaunchCV takes just a few minutes from blank page to finished PDF. You type your work history in plain language, the AI returns quantified bullets, you pick a template, and the live preview updates as you go before you export.",
  },
  {
    q: "Do I need writing skills to use the LaunchCV resume builder?",
    a: "No, you do not need any writing skills to use the LaunchCV resume builder. You describe your work in plain, everyday language, and the AI turns your rough notes into quantified, action-led bullets that each close with a measurable outcome. Non-native English speakers can start from casual phrasing too.",
  },
  {
    q: "How many resume templates does LaunchCV offer?",
    a: "LaunchCV offers a set of ATS-tested templates, including Atlas for tech, Nova for marketing and product, Pulse for design, Vector for engineering, Forge for leadership, and Quill for finance and legal. Every one is built for how common ATS platforms parse resumes.",
  },
  {
    q: "Can I export my LaunchCV resume as PDF or DOCX?",
    a: "Yes, you can export your LaunchCV resume as both PDF and DOCX with one click. There is also a plain-text view designed for pasting into LinkedIn or an email body. The live preview is pixel-accurate, so what you see is exactly what exports, with no spacing or font surprises.",
  },
  {
    q: "Are LaunchCV resume templates ATS-friendly?",
    a: "Yes, every LaunchCV template is ATS-friendly and built for how common ATS platforms like Workday, Greenhouse, Lever, and iCIMS parse resumes. There are no hidden tables, bad fonts, or zero-width spaces, so applicant tracking systems read your resume cleanly. Every template uses the same parse-safe structure as the ATS Score Checker.",
  },
  {
    q: "Can I keep different resume versions for different jobs?",
    a: "Yes, LaunchCV versions every save automatically, so you can roll back any change and keep separate cuts of your resume for different roles. You can also reorder sections by dragging and add Projects, Certifications, Languages, Publications, or Awards, tailoring each version to the job you are targeting.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Resume Builder | LaunchCV",
      url: absoluteUrl("/features/resume-builder"),
      description: "AI-powered resume builder with 4 ATS-tested templates and quantified bullets.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Resume Builder", item: absoluteUrl("/features/resume-builder") },
      ],
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
    faqPageLd(faqs),
  ],
};

const keyFacts = [
  "Four ATS-tested templates, built for how common ATS software parses resumes.",
  "AI writes quantified, action-led bullets from plain-language input.",
  "Live pixel-accurate preview with PDF, DOCX, and plain-text export.",
  "Go from blank page to a finished resume in minutes.",
];

const templates = [
  { n: "Atlas", c: "Modern minimal · Tech & SaaS" },
  { n: "Nova", c: "Two-column · Marketing & PM" },
  { n: "Pulse", c: "Editorial · Design & Creative" },
  { n: "Vector", c: "Compact · Engineering" },
  { n: "Forge", c: "Executive · Leadership" },
  { n: "Quill", c: "Classic · Finance & Legal" },
];

const benefits = [
  { i: Wand2, t: "AI bullet writing", d: "Plain language in. Quantified, action-led bullets out. Each line closes with measurable outcome." },
  { i: Eye, t: "Live preview", d: "WYSIWYG to the pixel. No surprise spacing or font swaps on export." },
  { i: Layers, t: "Four ATS-safe templates", d: "Every template is built for how common ATS software like Workday, Greenhouse, Lever, and iCIMS parses resumes." },
  { i: FileText, t: "Section flexibility", d: "Drag to reorder. Add Projects, Certifications, Languages, Publications, Awards — or remove what doesn&apos;t apply." },
  { i: Download, t: "PDF & DOCX export", d: "One click, two formats. Plain-text view for LinkedIn paste or email body." },
  { i: Sparkles, t: "Version history", d: "Every save versioned. Roll back any change. Keep different cuts for different roles." },
];

// Why it works — honest, benefit-led copy. No fabricated user quotes or company names.
const whyItWorks = [
  {
    t: "Plain language in, polished bullets out",
    d: "Describe what you did in your own words — the AI structures it into quantified, action-led bullets without inventing details.",
  },
  {
    t: "Built for non-native and first-time writers",
    d: "If formal resume language doesn't come naturally, the AI turns rough, honest notes into professional phrasing you can stand behind.",
  },
];

export default function ResumeBuilderPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 0%, rgba(124,58,237,0.07), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <FileText className="h-3.5 w-3.5 text-[#2563EB]" />
                AI Resume Builder
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Describe your work. The AI writes the resume.
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Type your work history in plain language and LaunchCV returns quantified, ATS-tuned bullets. Pick a template, watch the preview update live, and export. Minutes from blank page to PDF.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="The AI Resume Builder turns plain-language work history into quantified, ATS-tuned bullet points. Choose from four ATS-tested templates, watch a live pixel-accurate preview, and export to PDF or DOCX — most people go from blank page to finished resume in minutes."
                facts={keyFacts}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="feature_resume_builder"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(124,58,237,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Build my resume
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="#templates"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See all templates
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "4", l: "ATS-tested templates" },
                  { v: "Minutes", l: "To first draft" },
                  { v: "6", l: "AI tools, one plan" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* EDITOR MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">LaunchCV editor</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                    AI writing
                  </span>
                </div>

                <div className="grid sm:grid-cols-2">
                  <div className="border-b border-[#E2E8F0] bg-[#FAFBFC] p-5 sm:border-b-0 sm:border-r">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Your rough input</p>
                    <div className="mt-3 space-y-2 text-[13px] leading-[1.6] text-[#475569]">
                      <p className="rounded-md bg-white px-3 py-2 ring-1 ring-[#E2E8F0]">
                        i ran the eng team at acme, around 8 people, we shipped a new payments api
                      </p>
                      <p className="rounded-md bg-white px-3 py-2 ring-1 ring-[#E2E8F0]">
                        helped reduce churn somehow, like 20%
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">AI bullets</p>
                    <ul className="mt-3 space-y-2.5 text-[13px] leading-[1.55] text-[#0F172A]">
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                        <span>Led 8-engineer team to ship Payments API v2, processing <span className="rounded bg-blue-100 px-1 text-blue-800">$12M / month</span> in 6 months post-launch.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                        <span>Cut churn from <span className="rounded bg-blue-100 px-1 text-blue-800">9.4% → 7.5%</span> via onboarding redesign and SDK error surfacing.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                        <span>Owned Q3/Q4 roadmap, partnering with Product and DevRel across 3 timezones.</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-md bg-[#2563EB] px-3 py-1.5 text-[11px] font-semibold text-white">Accept all</button>
                      <button className="rounded-md bg-white px-3 py-1.5 text-[11px] font-semibold text-[#475569] ring-1 ring-[#E2E8F0]">Regenerate</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFBFC] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-blue-700" />
                    <span className="text-[11px] font-semibold text-[#0F172A]">Live preview · synced</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Template: Atlas · 2 pages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#2563EB]">See it in action</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">A look inside the resume builder</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/resume-builder.svg"
            alt="The LaunchCV resume builder editor turning rough, plain-language notes into quantified, ATS-ready resume bullet points with a live preview."
            caption="Type rough notes on the left; LaunchCV returns quantified, ATS-ready bullets on the right."
          />
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Templates · 12 verticals</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Designed by recruiters, approved by ATS
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every template runs through the same parser farm we use for the ATS Score Checker — no hidden tables, no bad fonts, no zero-width spaces.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t, i) => (
              <RevealOnView key={t.n}>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <div className="aspect-[3/4] rounded-lg bg-[#F8FAFC] p-4">
                    <div className="space-y-1.5">
                      <div className="h-2 w-1/2 rounded-full bg-[#0F172A]/35" />
                      <div className="h-1.5 w-1/3 rounded-full bg-[#0F172A]/25" />
                    </div>
                    <div className="mt-4 space-y-1">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <div key={k} className="h-1 rounded-full bg-[#0F172A]/12" style={{ width: `${60 + (k * 7) % 35}%` }} />
                      ))}
                    </div>
                    <div className="mt-4 space-y-1">
                      {Array.from({ length: 4 }).map((_, k) => (
                        <div key={k} className="h-1 rounded-full bg-[#0F172A]/12" style={{ width: `${50 + (k * 11) % 40}%` }} />
                      ))}
                    </div>
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: 4 }).map((_, k) => (
                        <span key={k} className="h-1.5 w-6 rounded-full bg-[#0F172A]/25" />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-[#0F172A]">{t.n}</p>
                      <p className="text-[12px] text-[#94A3B8]">{t.c}</p>
                    </div>
                    <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#475569]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>

          <p className="mt-10 text-center text-[14px] text-[#64748B]">
            + six more templates inside the app.{" "}
            <CtaLink cta="get_started" location="feature_resume_builder" href="/register" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              See them all
            </CtaLink>
          </p>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">The transform</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What you type. What we ship.
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">What you wrote</p>
              <p className="mt-4 text-[17px] leading-[1.55] text-[#475569]">
                &ldquo;managed social media, made content, helped grow followers&rdquo;
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-7">
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-800">
                AI rewrite
              </span>
              <p className="mt-4 text-[17px] leading-[1.55] text-[#0F172A]">
                Managed company social presence across 4 channels, lifting <span className="rounded bg-blue-100 px-1 text-blue-800">follower count by 127%</span> and engagement from <span className="rounded bg-blue-100 px-1 text-blue-800">1.8% to 4.6%</span> over six months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Capabilities</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built like a writer, ships like an engineer
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <b.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{b.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-[#E2E8F0] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                From blank page to ATS-ready resume in five steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                The LaunchCV AI resume builder does the heavy lifting: you supply the facts, the AI writes the bullets, and the live preview keeps everything ATS-friendly from the first keystroke.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Choose from 12+ professional resume templates tuned for tech, finance, healthcare, marketing, design, and management." },
              { n: "02", t: "Describe your work", d: "Type or speak plain-language notes. This resume generator AI turns them into quantified, action-led bullets." },
              { n: "03", t: "Watch the live preview", d: "Every edit renders instantly — the WYSIWYG preview is exactly what exports, with no surprise spacing." },
              { n: "04", t: "Run an ATS check", d: "Score your resume 0–100 for how common ATS platforms parse it, and fix anything that would break parsing." },
              { n: "05", t: "Export and apply", d: "Download as PDF or DOCX in one click, or copy a plain-text version for LinkedIn." },
            ].map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-[13px] font-bold text-[#2563EB]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{s.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#2563EB]">Why LaunchCV</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                An AI resume builder vs. the old way
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                A generic online resume maker hands you a blank template and wishes you luck. LaunchCV gives you writing, formatting, and ATS testing in one place.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What matters</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#2563EB]">LaunchCV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">DIY or generic maker</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Time to first draft", a: "Minutes, with AI-written bullets", b: "Hours staring at a blank page" },
                  { k: "Templates", a: "12+ recruiter-designed, ATS-tested layouts", b: "Clever designs that break parsers" },
                  { k: "Bullet quality", a: "Quantified, outcome-first, tailored", b: "Vague duties copied from the job post" },
                  { k: "ATS coverage", a: "Built for common ATS parsers", b: "No visibility into how you parse" },
                  { k: "Export", a: "PDF and DOCX, plain-text ready", b: "Locked or lossy formats" },
                  { k: "Proof", a: "4 ATS-tested templates, 6 AI tools in one plan", b: "—" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                        <span className="text-[#0F172A]">{r.a}</span>
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[#64748B]">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SCENARIO */}
      <section className="border-t border-[#E2E8F0] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#2563EB]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Dana rebuilt a resume in one lunch break
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Dana spent three years in retail management and wanted to move into operations. Her old resume was a wall of duties — &ldquo;responsible for scheduling&rdquo;, &ldquo;handled customers&rdquo; — and it had gone unanswered for two months.
              </p>
              <p>
                She opened the AI resume builder, picked a clean template, and typed what she actually did in plain language. The AI returned quantified bullets — <span className="font-medium text-[#0F172A]">&ldquo;Cut weekly scheduling time by 30% for a 22-person team&rdquo;</span> — in place of the vague originals, and the live preview stayed ATS-friendly throughout.
              </p>
              <p>
                Before exporting, she ran the built-in ATS check, cleared two formatting flags, and downloaded a PDF. Total time: one lunch break, in line with the platform&apos;s under-five-minute average build time.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/ats-score" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Check an ATS score <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/voice-input" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Speak your bullets <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {whyItWorks.map((w) => (
              <RevealOnView key={w.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <h3 className="text-[17px] font-semibold text-[#0F172A]">{w.t}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[#475569]">{w.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match bullets to a target role.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
              { href: "/features/voice-input", t: "Voice Input", d: "Speak experience, AI writes it.", icon: Mic },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <r.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-0.5 text-[13px] text-[#64748B]">{r.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Your best resume is five minutes away
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            No writing skills required. Tell the AI what you did — it handles the rest.
          </p>
          <CtaLink cta="get_started" location="feature_resume_builder"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Build my resume
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      <FeatureRelatedLinks
        accent="violet"
        useCases={[
          {
            href: "/use-cases/software-engineers",
            title: "Resumes for software engineers",
            desc: "Templates and AI bullets tuned for engineering scope, stack, and impact.",
          },
          {
            href: "/use-cases/designers",
            title: "Resumes for designers",
            desc: "Clean, ATS-safe layouts that still make your design work stand out.",
          },
        ]}
        reading={[
          {
            href: "/blog/ai-resume-builder-complete-guide",
            title: "AI resume builder: the complete guide",
            desc: "How AI writes bullet points, optimizes keywords, and formats for ATS.",
          },
          {
            href: "/blog/how-to-write-an-ats-friendly-resume",
            title: "How to write an ATS-friendly resume",
            desc: "The formatting rules that keep parsers from dropping your experience.",
          },
          {
            href: "/blog/voice-to-resume",
            title: "Build your resume by speaking",
            desc: "Beat the blank page — dictate your experience and let AI structure it.",
          },
        ]}
      />

      <FaqSection items={faqs} accent="#2563EB" />

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        primaryClassName="bg-[#2563EB] hover:bg-[#1D4ED8]"
        location="feature_resume_builder"
      />

      <LandingFooter />
    </div>
  );
}
