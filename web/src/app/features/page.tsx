import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Features — The Complete AI Job-Search Toolkit",
  description:
    "Six AI tools in one product: JD alignment, AI resume builder, ATS scanner, cover letter generator, interview prep, voice input. One subscription. Zero blank pages.",
  pathname: "/features",
  keywords: ["Launch CV features", "JD alignment", "ATS score", "interview prep", "cover letter AI"],
});

const features = [
  {
    icon: Target,
    eyebrow: "01 · Match",
    title: "JD Alignment",
    description: "Paste a job ad. Watch your match score climb from 42% to 91% in under 60 seconds. Every gap mapped, every keyword woven in.",
    href: "/features/jd-alignment",
    bg: "from-[#EFF6FF] to-white",
    accent: "text-[#1A56DB]",
    pillBg: "bg-[#EFF6FF] text-[#1A56DB]",
    stats: [{ k: "+49 pts", v: "Avg score jump" }, { k: "8s", v: "Time to analyze" }],
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: FileText,
    eyebrow: "02 · Write",
    title: "AI Resume Builder",
    description: "Plain English in. ATS-tested, quantified bullets out. 12 industry templates. 5 minutes from blank to PDF.",
    href: "/features/resume-builder",
    bg: "from-[#FAF5FF] to-white",
    accent: "text-[#7C3AED]",
    pillBg: "bg-[#F3E8FF] text-[#7C3AED]",
    stats: [{ k: "12", v: "Templates" }, { k: "5 min", v: "Avg build" }],
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    icon: BarChart3,
    eyebrow: "03 · Score",
    title: "ATS Scanner",
    description: "Every parser-breaking format issue, named and ranked. The average user gains 43 points after the first pass.",
    href: "/features/ats-score",
    bg: "from-[#FFF7ED] to-white",
    accent: "text-[#EA580C]",
    pillBg: "bg-[#FFEDD5] text-[#EA580C]",
    stats: [{ k: "15", v: "ATS engines" }, { k: "+43", v: "Avg gain" }],
    span: "",
  },
  {
    icon: Mail,
    eyebrow: "04 · Send",
    title: "Cover Letter Generator",
    description: "Personalized to the company, the role, the hiring manager. Four tones. Fourteen languages. 60 seconds.",
    href: "/features/cover-letter",
    bg: "from-[#F0FDFA] to-white",
    accent: "text-[#0D9488]",
    pillBg: "bg-[#CCFBF1] text-[#0D9488]",
    stats: [{ k: "60s", v: "Per letter" }, { k: "14", v: "Languages" }],
    span: "lg:col-span-2",
  },
  {
    icon: MessageSquare,
    eyebrow: "05 · Practice",
    title: "Interview Prep",
    description: "200+ role-specific questions. AI-scored answers. Model responses on tap. Drill until your worst day still wins.",
    href: "/features/interview-prep",
    bg: "from-[#F0FDF4] to-white",
    accent: "text-[#059669]",
    pillBg: "bg-[#DCFCE7] text-[#059669]",
    stats: [{ k: "200+", v: "Questions" }, { k: "1–10", v: "Scoring" }],
    span: "",
  },
  {
    icon: Mic,
    eyebrow: "06 · Speak",
    title: "Voice Input",
    description: "Click the mic, describe your work to a friend, watch it become a polished bullet. 12 languages. Zero typing.",
    href: "/features/voice-input",
    bg: "from-[#FDF2F8] to-white",
    accent: "text-[#DB2777]",
    pillBg: "bg-pink-100 text-[#DB2777]",
    stats: [{ k: "12", v: "Languages" }, { k: "0", v: "Audio stored" }],
    span: "",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Features | Launch CV",
      description: "Six AI-powered tools for job seekers, in one paid product.",
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
  ],
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B0F19] pt-[104px] text-white">
        <div className="lc-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#1A56DB] opacity-[0.2] blur-[140px]" />
          <div className="absolute -right-32 top-40 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.18] blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-6 pb-24 pt-16">
          <div className="max-w-[820px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" /> 6 tools · 1 subscription
            </span>
            <h1 className="mt-6 font-display text-[64px] font-extrabold leading-[0.94] tracking-[-0.04em] sm:text-[96px] lg:text-[128px]">
              The whole<br />
              <span className="lc-gradient-text-animated">job search,</span><br />
              <span className="italic text-white/90">under one roof.</span>
            </h1>
            <p className="mt-7 max-w-[600px] font-body text-[18px] leading-[1.65] text-white/65 sm:text-[20px]">
              Launch CV isn&apos;t a resume builder with a chatbot bolted on. It&apos;s six purpose-built AI tools for every stage of the hunt — match, write, score, send, practice, speak — wired together under one paid plan.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-[#0B0F19]">
                See pricing & get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#tools" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-white/80">
                Browse the toolkit <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO TOOLKIT */}
      <section id="tools" className="relative -mt-12 bg-[#FAFAF7] pb-24 pt-12">
        <div className="mx-auto max-w-[1320px] px-6">
          <RevealOnView>
            <div className="grid auto-rows-[minmax(260px,auto)] gap-5 lg:grid-cols-3 lg:auto-rows-[minmax(220px,auto)]">
              {features.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`lc-bento group relative flex flex-col justify-between overflow-hidden bg-gradient-to-br ${f.bg} p-7 ring-1 ring-[#E2E8F0] ${f.span}`}
                >
                  <div>
                    <p className="lc-overline text-[#94A3B8]">{f.eyebrow}</p>
                    <h3 className="mt-3 font-display text-[28px] font-bold leading-[1.1] tracking-tight text-[#0F172A] sm:text-[32px]">
                      {f.title}
                    </h3>
                    <p className="mt-3 max-w-[440px] font-body text-[14px] leading-[1.7] text-[#475569] sm:text-[15px]">
                      {f.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div className="flex gap-5">
                      {f.stats.map((s) => (
                        <div key={s.v}>
                          <p className={`font-display text-[24px] font-extrabold leading-none tracking-tight ${f.accent}`}>{s.k}</p>
                          <p className="mt-1 font-body text-[10px] uppercase tracking-wider text-[#94A3B8]">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.pillBg} transition-transform group-hover:scale-110`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                  </div>

                  <ArrowUpRight className={`absolute right-7 top-7 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100 ${f.accent}`} />
                </Link>
              ))}
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* WORKFLOW STRIP */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#1A56DB]">A single workflow</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[60px]">
                  Tools that don&apos;t<br />
                  just sit side-by-side —<br />
                  <span className="italic">they hand off.</span>
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                Every output is the next tool&apos;s input. The resume feeds the ATS scan. The JD alignment seeds the cover letter. The cover letter seeds the interview prep. One subscription, no copy-pasting between tabs.
              </p>
            </div>
          </RevealOnView>

          <RevealOnView>
            <div className="relative overflow-x-auto">
              <div className="flex min-w-[800px] items-center justify-between gap-4 px-2">
                {[
                  { l: "Voice / paste", t: "Raw input", color: "bg-pink-100 text-[#DB2777]" },
                  { l: "Resume Builder", t: "AI bullets", color: "bg-[#F3E8FF] text-[#7C3AED]" },
                  { l: "ATS Scanner", t: "Score + fixes", color: "bg-[#FFEDD5] text-[#EA580C]" },
                  { l: "JD Alignment", t: "Keyword match", color: "bg-[#EFF6FF] text-[#1A56DB]" },
                  { l: "Cover Letter", t: "Personalized letter", color: "bg-[#CCFBF1] text-[#0D9488]" },
                  { l: "Interview Prep", t: "Scored answers", color: "bg-[#DCFCE7] text-[#059669]" },
                ].map((s, i, arr) => (
                  <div key={s.l} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-[16px] font-bold ${s.color}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-3 font-body text-[12px] font-bold text-[#0F172A]">{s.l}</p>
                      <p className="font-body text-[11px] text-[#94A3B8]">{s.t}</p>
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-[#CBD5E1]" />}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B0F19] py-20 text-white">
        <div className="mx-auto max-w-[1000px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            One subscription.<br />
            <span className="lc-gradient-text-animated">Six superpowers.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/70">
            Every tool included on every plan. AI ceilings scale with the tier — pick whichever matches how hard you&apos;re applying.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/pricing" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#0B0F19]">
              View pricing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="lc-link-underline font-body text-[14px] font-bold text-white/80">
              Or create an account
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
