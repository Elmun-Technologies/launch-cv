import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { StickyCta } from "@/components/sticky-cta";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ArrowRight, Sparkles } from "lucide-react";
import { KeyFacts } from "@/components/key-facts";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { FaqSection } from "@/components/faq-section";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { ProductScreenshot } from "@/components/product-screenshot";

export const metadata = buildMarketingMetadata({
  title: "Features — The Complete AI Job Search Toolkit",
  description:
    "Six AI tools in one product: JD alignment, resume builder, ATS scanner, cover letters, interview prep, and voice input — one subscription, one workflow.",
  pathname: "/features",
  keywords: ["Launch CV features", "JD alignment", "ATS score", "interview prep", "cover letter AI", "AI resume builder"],
});

const features = [
  {
    icon: Target,
    title: "JD Alignment",
    description: "Paste a job description. Watch your match score climb from around 40% to 90%+ in under a minute.",
    href: "/features/jd-alignment",
    iconBg: "bg-blue-50 text-blue-700",
    stats: [{ k: "+49 pts", v: "Avg score jump" }, { k: "8 sec", v: "Time to analyze" }],
  },
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Plain English in. ATS-tested, quantified bullets out. 12 industry templates, five minutes from blank to PDF.",
    href: "/features/resume-builder",
    iconBg: "bg-violet-50 text-violet-700",
    stats: [{ k: "12", v: "Templates" }, { k: "5 min", v: "Avg build" }],
  },
  {
    icon: BarChart3,
    title: "ATS Score Checker",
    description: "Every parser-breaking format issue, named and ranked. The average user gains 43 points on the first pass.",
    href: "/features/ats-score",
    iconBg: "bg-orange-50 text-orange-700",
    stats: [{ k: "15", v: "ATS engines" }, { k: "+43", v: "Avg gain" }],
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Personalized to the company, the role, and the hiring manager. Four tones, 14 languages, 60 seconds.",
    href: "/features/cover-letter",
    iconBg: "bg-teal-50 text-teal-700",
    stats: [{ k: "60 sec", v: "Per letter" }, { k: "14", v: "Languages" }],
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "200+ role-specific questions. AI-scored answers. Model responses on tap. Practice until your worst day still wins.",
    href: "/features/interview-prep",
    iconBg: "bg-emerald-50 text-emerald-700",
    stats: [{ k: "200+", v: "Questions" }, { k: "1–10", v: "AI scoring" }],
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Click the mic, describe your work to a friend, watch it become a polished bullet. 12 languages.",
    href: "/features/voice-input",
    iconBg: "bg-pink-50 text-pink-700",
    stats: [{ k: "12", v: "Languages" }, { k: "0", v: "Audio stored" }],
  },
];

const faqs: FaqItem[] = [
  {
    q: "What AI tools does Launch CV include?",
    a: "Launch CV includes six AI tools under one subscription: JD Alignment, AI Resume Builder, ATS Score Checker, Cover Letter Generator, Interview Prep, and Voice Input. Together they cover every stage of the job hunt — match, write, score, send, practice, and speak — with each tool's output feeding the next.",
  },
  {
    q: "Which Launch CV feature should I start with?",
    a: "Start with the AI Resume Builder if you need a resume, since it turns plain English into ATS-tested, quantified bullets in about five minutes using 12 templates. Its output then feeds the ATS Score Checker and JD Alignment, so beginning there seeds the rest of the workflow automatically.",
  },
  {
    q: "How much can Launch CV improve my ATS score?",
    a: "Launch CV's ATS Score Checker raises the average user's score by 43 points on the first pass, naming and ranking every parser-breaking format issue across 15 ATS engines. Separately, JD Alignment lifts a job-match score from around 40% to over 90% in under a minute.",
  },
  {
    q: "Is Launch CV one subscription or do I pay per tool?",
    a: "Launch CV is one subscription that includes all six tools on every plan, so you never pay per tool or copy-paste between tabs. The AI usage ceilings scale with your tier, letting you pick whichever plan matches how hard you are currently applying.",
  },
  {
    q: "Can Launch CV write a cover letter and prep me for interviews?",
    a: "Yes, Launch CV's Cover Letter Generator personalizes letters to the company, role, and hiring manager in about 60 seconds with four tones and 14 languages. Interview Prep then serves 200-plus role-specific questions, scores your answers from 1 to 10, and shows model responses on tap.",
  },
  {
    q: "Can I build my resume by voice with Launch CV?",
    a: "Yes, Launch CV's Voice Input lets you click the mic, describe your work as if talking to a friend, and watch it become a polished bullet in 12 languages. No audio is stored, and the output flows straight into the Resume Builder so nothing is retyped.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Features | Launch CV",
      description: "Six AI-powered tools for job seekers under one subscription.",
      url: absoluteUrl("/features"),
    },
    {
      "@type": "ItemList",
      itemListElement: features.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: f.title,
        url: absoluteUrl(f.href),
      })),
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
    faqPageLd(faqs),
  ],
};

export default function FeaturesPage() {
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
              "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.06), transparent 45%), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.05), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" /> 6 tools · 1 subscription
            </span>
            <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
              The complete AI job search toolkit
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
              Launch CV isn&apos;t a resume builder with a chatbot bolted on. It&apos;s six purpose-built AI tools for every stage of the job hunt — match, write, score, send, practice, speak — wired together under one paid plan.
            </p>

            <KeyFacts
              className="mt-8 max-w-[600px]"
              lead="Launch CV combines six AI tools in one subscription: JD alignment, AI resume builder, ATS score checker, cover letter generator, interview prep, and voice input. Each tool's output feeds the next — the resume feeds the ATS scan, the JD match seeds the cover letter — so there's no copy-pasting between tabs."
              facts={[
                "Six tools, one paid plan — every tool included on every tier.",
                "JD alignment lifts match scores from ~40% to 90%+ in about a minute.",
                "ATS checker tests against 15 engines for an average +43-point gain.",
                "Rated 4.9/5 by 2,400+ job seekers.",
              ]}
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink cta="get_started" location="features_index"
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </CtaLink>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#1A56DB]">Inside the product</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">One workspace for the whole job search</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/resume-builder.svg"
            alt="The Launch CV workspace turning rough, plain-language work notes into quantified, ATS-ready resume bullet points with a live preview."
            caption="From rough notes to ATS-ready bullets — every tool lives in one editor."
          />
        </div>
      </section>

      {/* GRID */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="grid gap-5 lg:grid-cols-3">
              {features.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.iconBg}`}>
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-[20px] font-semibold tracking-tight text-[#0F172A]">{f.title}</h2>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.65] text-[#475569]">{f.description}</p>

                  <div className="mt-5 flex items-end justify-between border-t border-[#E2E8F0] pt-4">
                    <div className="flex gap-5">
                      {f.stats.map((s) => (
                        <div key={s.v}>
                          <p className="text-[18px] font-bold leading-none tracking-tight text-[#0F172A]">{s.k}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1A56DB] opacity-0 transition group-hover:opacity-100">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">A single workflow</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Tools that don&apos;t just sit side by side — they hand off
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every output is the next tool&apos;s input. The resume feeds the ATS scan. The JD alignment seeds the cover letter. The cover letter seeds the interview prep. No copy-pasting between tabs.
              </p>
            </div>
          </RevealOnView>

          <RevealOnView>
            <div className="mt-12 overflow-x-auto">
              <div className="flex min-w-[800px] items-center justify-between gap-4">
                {[
                  { l: "Voice / paste", t: "Raw input", c: "bg-pink-50 text-pink-700" },
                  { l: "Resume Builder", t: "AI bullets", c: "bg-violet-50 text-violet-700" },
                  { l: "ATS Scanner", t: "Score + fixes", c: "bg-orange-50 text-orange-700" },
                  { l: "JD Alignment", t: "Keyword match", c: "bg-blue-50 text-blue-700" },
                  { l: "Cover Letter", t: "Personalized letter", c: "bg-teal-50 text-teal-700" },
                  { l: "Interview Prep", t: "Scored answers", c: "bg-emerald-50 text-emerald-700" },
                ].map((s, i, arr) => (
                  <div key={s.l} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-[14px] font-bold ${s.c}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 text-[13px] font-semibold text-[#0F172A]">{s.l}</p>
                      <p className="text-[11px] text-[#94A3B8]">{s.t}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-[#CBD5E1]" />}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* EXPLORE MORE — keep the visitor moving */}
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Keep exploring</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/use-cases", t: "Resume by role", d: "Guides tuned for engineers, PMs, and designers." },
              { href: "/free-ats-check", t: "Free ATS check", d: "Score your current resume in 8 seconds — no signup." },
              { href: "/blog", t: "Career blog", d: "Evidence-based tactics to land interviews faster." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
              >
                <div>
                  <p className="text-[16px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:translate-x-0.5 group-hover:text-[#1A56DB]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            One subscription, six superpowers
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Every tool included on every plan. AI ceilings scale with the tier — pick whichever matches how hard you&apos;re applying.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              View pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <CtaLink cta="get_started" location="features_index" href="/register" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]">
              Or create an account
            </CtaLink>
          </div>
        </div>
      </section>

      <FaqSection items={faqs} accent="#1A56DB" />

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        location="features_index"
      />

      <LandingFooter />
    </div>
  );
}
