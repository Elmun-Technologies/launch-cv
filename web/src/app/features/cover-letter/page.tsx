import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  Mail,
  ArrowRight,
  Check,
  Star,
  Building2,
  User,
  Send,
  Sparkles,
  FileText,
  MessageSquare,
  Target,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Cover Letter Generator — Personalized Letters in 60 Seconds",
  description:
    "Generate a tailored, professional cover letter from your resume and job description in under a minute. Four tones, fourteen languages, ATS-safe formatting.",
  pathname: "/features/cover-letter",
  keywords: [
    "AI cover letter generator",
    "cover letter writer",
    "personalized cover letter",
    "job application cover letter",
    "cover letter maker",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Cover Letter Generator | Launch CV",
      url: absoluteUrl("/features/cover-letter"),
      description: "AI cover letters personalized to the company, role, and hiring manager.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Cover Letter", item: absoluteUrl("/features/cover-letter") },
      ],
    },
  ],
};

const tones = [
  { k: "Professional", d: "Crisp, formal, polished. Best for finance, legal, enterprise." },
  { k: "Enthusiastic", d: "Warm, energetic, mission-led. Best for startups and agencies." },
  { k: "Concise", d: "Two hundred words, every line earning its place. Best for engineers." },
  { k: "Creative", d: "Hooked opening, distinctive voice. Best for design and marketing." },
];

const benefits = [
  { t: "Deep personalization", d: "AI extracts the company mission, tech stack, and required skills from the JD — and weaves them in naturally." },
  { t: "Four tones", d: "Professional, Enthusiastic, Concise, Creative. Preview the change live before generating." },
  { t: "Three opening hooks", d: "Generates three different first paragraphs. Pick the one that sounds like you." },
  { t: "ATS-safe formatting", d: "Plain-text structure that works in an email body, ATS upload, or PDF attachment." },
  { t: "Word-count control", d: "Short (250) · Standard (400) · Detailed (600). You choose the length." },
  { t: "Fourteen languages", d: "English, German, French, Spanish, Portuguese, Dutch, Italian, and seven more." },
];

const steps = [
  { i: FileText, t: "Connect a resume", d: "Use a Launch CV resume or paste an existing one. Your career history is the foundation." },
  { i: Building2, t: "Paste the JD", d: "AI auto-extracts the company, role, tech stack, and hiring tone — no manual tagging." },
  { i: User, t: "Optional personal context", d: "Hiring manager name, mutual connection, why-this-company line. AI weaves it in." },
  { i: Sparkles, t: "Pick tone + length", d: "Choose from four tones and three lengths. Preview the voice before generating." },
  { i: Mail, t: "Generate", d: "AI returns three openings, one full body, and two closings — all editable inline." },
  { i: Send, t: "Send", d: "Copy to clipboard, paste into email, or export PDF. Plain-text compatible everywhere." },
];

const testimonials = [
  {
    q: "The cover letter generator writes better letters than I ever could. It pulled details from the JD I hadn't even noticed. Two-to-three hours saved per application.",
    n: "Priya N.",
    r: "Marketing Lead at HubSpot",
  },
  {
    q: "I was embarrassed by my own cover letters. The AI made them sound genuinely enthusiastic and specific. I got a callback from every company I used it on.",
    n: "Alex T.",
    r: "Sales Manager",
  },
];

export default function CoverLetterPage() {
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
              "radial-gradient(circle at 12% 0%, rgba(13,148,136,0.07), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Mail className="h-3.5 w-3.5 text-[#0D9488]" />
                Cover Letter Generator
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Personalized cover letters in 60 seconds
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Stop opening the blank document. Launch CV pulls the company mission, the tech stack, and the hiring manager&apos;s tone — then writes a letter you&apos;d be proud to send.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(13,148,136,0.4)] transition hover:bg-[#0F766E]"
                >
                  Write my first letter
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#preview"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See an example
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "60 sec", l: "Per letter" },
                  { v: "14", l: "Languages" },
                  { v: "3", l: "Opening hooks" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LETTER MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 pt-6 pb-4">
                  <div>
                    <p className="text-[16px] font-semibold text-[#0F172A]">Sarah Khan</p>
                    <p className="text-[12px] text-[#94A3B8]">sarah@email.com · NYC</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-700 ring-1 ring-teal-200">
                    Draft v3
                  </span>
                </div>

                <div className="space-y-3 px-6 py-5 text-[14px] leading-[1.75] text-[#0F172A]">
                  <p className="text-[#94A3B8]">March 12, 2026</p>
                  <p>Dear hiring team at Stripe,</p>
                  <p>
                    I&apos;ve been following Stripe&apos;s expansion into <span className="rounded bg-teal-100 px-1 text-teal-800">embedded finance</span> since the launch of Issuing — and I&apos;d love to bring my six years of payments infrastructure experience to the <span className="rounded bg-teal-100 px-1 text-teal-800">Senior Software Engineer, Money Movement</span> team.
                  </p>
                  <p>
                    At my current role I led the migration of <span className="rounded bg-teal-100 px-1 text-teal-800">three SaaS systems</span> serving 1,200+ accounts, cutting deploy time by 40% with a TypeScript and Go stack. The challenges Stripe is solving — global rails, sub-100ms settlement — are exactly the problems I want to spend the next chapter of my career on.
                  </p>
                  <p className="text-[#94A3B8]">_______________</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700">Tone · Enthusiastic</span>
                    <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#475569]">312 words</span>
                  </div>
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-[#0D9488] px-3 py-1.5 text-[12px] font-semibold text-white">
                    <Send className="h-3.5 w-3.5" /> Copy &amp; send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TONES */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#0D9488]">Pick your voice</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Four tones, same job description, very different letters
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Tone is the difference between a recruiter calling you back and skipping to the next CV. Preview each voice before you generate.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tones.map((t, i) => (
              <RevealOnView key={t.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Tone · {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-[18px] font-semibold tracking-tight text-[#0F172A]">{t.k}</p>
                  <p className="mt-2 text-[13px] leading-[1.65] text-[#475569]">{t.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section id="preview" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#0D9488]">A real example</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Same JD. Two voices. Pick the one that sounds like you.
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-7">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">Professional</span>
                <span className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#94A3B8]">312 words</span>
              </div>
              <p className="mt-5 text-[15px] leading-[1.7] text-[#0F172A]">
                &ldquo;I am writing to express my interest in the Senior Product Manager role at Linear. With seven years of B2B SaaS experience — most recently leading the activation workstream at Datadog — I believe my background in technical product strategy and developer-tools positioning aligns with the responsibilities outlined in your job description.&rdquo;
              </p>
            </div>
            <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-7">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[11px] font-semibold text-teal-800">Enthusiastic</span>
                <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#475569] ring-1 ring-[#E2E8F0]">298 words</span>
              </div>
              <p className="mt-5 text-[15px] leading-[1.7] text-[#0F172A]">
                &ldquo;I&apos;ve been a Linear power user since the very first Cycles ship — and the day I read your Method docs was the day I decided I wanted to build PM tools, not just use them. The Senior PM role you posted is the most specifically me-shaped role I&apos;ve seen in a year, and I want to tell you why.&rdquo;
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
              <p className="lc-overline text-[#0D9488]">What&apos;s included</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built like a copywriter, not like a template
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#0D9488]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{b.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[680px]">
              <p className="lc-overline text-[#0D9488]">Workflow</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Pasted JD to finished letter, before your coffee cools
              </h2>
            </div>
          </RevealOnView>

          <div className="space-y-3">
            {steps.map((s, i) => (
              <RevealOnView key={s.t}>
                <div className="flex items-start gap-5 rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                    <s.i className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Step {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-[17px] font-semibold text-[#0F172A]">{s.t}</h3>
                    <p className="mt-1 text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#0D9488]">Customer stories</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Letters that got replies</h2>
            </div>
          </RevealOnView>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
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
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume keywords to the JD.", icon: Target },
              { href: "/features/resume-builder", t: "Resume Builder", d: "ATS-tested templates and bullets.", icon: FileText },
              { href: "/features/interview-prep", t: "Interview Prep", d: "Drill the role before you call.", icon: MessageSquare },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
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
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Write a letter you&apos;d actually be proud to send
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Personalized, professional, and ready in 60 seconds. No blank-page anxiety.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#0F766E]"
          >
            Write my first letter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
