import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { FeatureRelatedLinks } from "@/components/feature-related-links";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  FileText,
  ArrowRight,
  Star,
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
    "The AI resume builder software engineers trust: 12 ATS-tested templates, quantified bullets, and PDF/DOCX export in under 5 minutes. Build yours free →",
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

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Resume Builder | Launch CV",
      url: absoluteUrl("/features/resume-builder"),
      description: "AI-powered resume builder with 12 ATS-tested templates and quantified bullets.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Resume Builder", item: absoluteUrl("/features/resume-builder") },
      ],
    },
  ],
};

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
  { i: Layers, t: "Twelve ATS-safe templates", d: "Every template tested against Workday, Greenhouse, Lever, iCIMS, and 11 more parsers." },
  { i: FileText, t: "Section flexibility", d: "Drag to reorder. Add Projects, Certifications, Languages, Publications, Awards — or remove what doesn&apos;t apply." },
  { i: Download, t: "PDF & DOCX export", d: "One click, two formats. Plain-text view for LinkedIn paste or email body." },
  { i: Sparkles, t: "Version history", d: "Every save versioned. Roll back any change. Keep different cuts for different roles." },
];

const testimonials = [
  {
    q: "I built my resume in under fifteen minutes and it looked better than anything I&apos;d ever spent hours on. The AI suggestions were dead-on for product management.",
    n: "Marcus J.",
    r: "Product Manager at Meta",
  },
  {
    q: "As a non-native English speaker, writing formal job bullets was hard. The AI took my rough notes and made them professional. Hired in a month.",
    n: "Yuna K.",
    r: "UX Designer at Atlassian",
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
                <FileText className="h-3.5 w-3.5 text-[#7C3AED]" />
                AI Resume Builder
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Describe your work. The AI writes the resume.
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Type your work history in plain language and Launch CV returns quantified, ATS-tuned bullets. Pick a template, watch the preview update live, and export. Five minutes from blank page to PDF.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="feature_resume_builder"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(124,58,237,0.4)] transition hover:bg-[#6D28D9]"
                >
                  Build my resume
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="#templates"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See all 12 templates
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "12", l: "Industry templates" },
                  { v: "5 min", l: "Average build time" },
                  { v: "15", l: "ATS engines passed" },
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
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">Launch CV editor</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">AI bullets</p>
                    <ul className="mt-3 space-y-2.5 text-[13px] leading-[1.55] text-[#0F172A]">
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-600" />
                        <span>Led 8-engineer team to ship Payments API v2, processing <span className="rounded bg-violet-100 px-1 text-violet-800">$12M / month</span> in 6 months post-launch.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-600" />
                        <span>Cut churn from <span className="rounded bg-violet-100 px-1 text-violet-800">9.4% → 7.5%</span> via onboarding redesign and SDK error surfacing.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-600" />
                        <span>Owned Q3/Q4 roadmap, partnering with Product and DevRel across 3 timezones.</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-md bg-[#7C3AED] px-3 py-1.5 text-[11px] font-semibold text-white">Accept all</button>
                      <button className="rounded-md bg-white px-3 py-1.5 text-[11px] font-semibold text-[#475569] ring-1 ring-[#E2E8F0]">Regenerate</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFBFC] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-violet-700" />
                    <span className="text-[11px] font-semibold text-[#0F172A]">Live preview · synced</span>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">Template: Atlas · 2 pages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">Templates · 12 verticals</p>
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
            <CtaLink cta="get_started" location="feature_resume_builder" href="/register" className="font-semibold text-[#7C3AED] underline-offset-2 hover:underline">
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
              <p className="lc-overline text-[#7C3AED]">The transform</p>
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
            <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-7">
              <span className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-violet-800">
                AI rewrite
              </span>
              <p className="mt-4 text-[17px] leading-[1.55] text-[#0F172A]">
                Managed company social presence across 4 channels, lifting <span className="rounded bg-violet-100 px-1 text-violet-800">follower count by 127%</span> and engagement from <span className="rounded bg-violet-100 px-1 text-violet-800">1.8% to 4.6%</span> over six months.
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
              <p className="lc-overline text-[#7C3AED]">Capabilities</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built like a writer, ships like an engineer
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
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
              <p className="lc-overline text-[#7C3AED]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                From blank page to ATS-ready resume in five steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                The Launch CV AI resume builder does the heavy lifting: you supply the facts, the AI writes the bullets, and the live preview keeps everything ATS-friendly from the first keystroke.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Pick a template", d: "Choose from 12+ professional resume templates tuned for tech, finance, healthcare, marketing, design, and management." },
              { n: "02", t: "Describe your work", d: "Type or speak plain-language notes. This resume generator AI turns them into quantified, action-led bullets." },
              { n: "03", t: "Watch the live preview", d: "Every edit renders instantly — the WYSIWYG preview is exactly what exports, with no surprise spacing." },
              { n: "04", t: "Run an ATS check", d: "Score your resume 0–100 against 15+ ATS platforms and fix anything that would break parsing." },
              { n: "05", t: "Export and apply", d: "Download as PDF or DOCX in one click, or copy a plain-text version for LinkedIn." },
            ].map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-[13px] font-bold text-[#7C3AED]">
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
              <p className="lc-overline text-[#7C3AED]">Why Launch CV</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                An AI resume builder vs. the old way
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                A generic online resume maker hands you a blank template and wishes you luck. Launch CV gives you writing, formatting, and ATS testing in one place.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What matters</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#7C3AED]">Launch CV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">DIY or generic maker</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Time to first draft", a: "Under 5 minutes with AI-written bullets", b: "Hours staring at a blank page" },
                  { k: "Templates", a: "12+ recruiter-designed, ATS-tested layouts", b: "Clever designs that break parsers" },
                  { k: "Bullet quality", a: "Quantified, outcome-first, tailored", b: "Vague duties copied from the job post" },
                  { k: "ATS coverage", a: "Tested across 15+ ATS platforms", b: "No visibility into how you parse" },
                  { k: "Export", a: "PDF and DOCX, plain-text ready", b: "Locked or lossy formats" },
                  { k: "Proof", a: "50,000+ resumes · 4.9/5 from 2,400+ reviews", b: "—" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
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
            <p className="lc-overline text-[#7C3AED]">A real use scenario</p>
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

      {/* FAQ */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#7C3AED]">FAQ</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">Common questions</h2>
          </RevealOnView>

          <div className="mt-10 space-y-4">
            {[
              { q: "Is this an ATS friendly resume builder?", a: "Yes. Every one of the 12+ templates is tested across 15+ ATS platforms including Workday, Greenhouse, Lever, and iCIMS. You can also run a full ATS score check before you apply." },
              { q: "Do I need writing skills?", a: "No. Describe your work in plain language — or speak it with voice input — and the resume generator AI writes quantified, professional bullets for you." },
              { q: "What can I export?", a: "PDF and DOCX, plus a plain-text view for LinkedIn or email. Formatting stays identical to the live preview." },
              { q: "How much does it cost?", a: "Plans start at $9/month, with a $29/year Professional plan and a $79 one-time Lifetime option." },
            ].map((f) => (
              <RevealOnView key={f.q}>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-[16px] font-semibold text-[#0F172A]">{f.q}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{f.a}</p>
                </div>
              </RevealOnView>
            ))}
          </div>

          <p className="mt-8 text-[14px] text-[#64748B]">
            Explore{" "}
            <Link href="/features/jd-alignment" className="font-semibold text-[#7C3AED] hover:underline">JD Alignment</Link>,{" "}
            <Link href="/features/cover-letter" className="font-semibold text-[#7C3AED] hover:underline">Cover Letters</Link>, and{" "}
            <Link href="/pricing" className="font-semibold text-[#7C3AED] hover:underline">pricing</Link>.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <figure className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-[1.7] text-[#0F172A]">&ldquo;{t.q}&rdquo;</blockquote>
                  <figcaption className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <p className="text-[14px] font-semibold text-[#0F172A]">{t.n}</p>
                    <p className="text-[13px] text-[#64748B]">{t.r}</p>
                  </figcaption>
                </figure>
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
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
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
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#6D28D9]"
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

      <LandingFooter />
    </div>
  );
}
