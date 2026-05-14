import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ArrowRight, Sparkles } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Features — The Complete AI Job Search Toolkit",
  description:
    "Six AI tools in one product: JD alignment, AI resume builder, ATS scanner, cover letter generator, interview prep, voice input. One subscription, zero copy-pasting between tabs.",
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
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
            <Link href="/register" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]">
              Or create an account
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
