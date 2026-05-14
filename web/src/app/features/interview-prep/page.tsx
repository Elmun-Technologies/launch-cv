import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  MessageSquare,
  ArrowRight,
  Check,
  Star,
  Mic,
  Brain,
  CheckCircle2,
  TrendingUp,
  Target,
  FileText,
  Mail,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep — Practice Real, Role-Specific Questions",
  description:
    "Launch CV reads your resume and the job description, then drills you on the exact questions you&apos;re likely to face — with scored AI feedback and benchmark answers.",
  pathname: "/features/interview-prep",
  keywords: [
    "AI interview preparation",
    "interview practice AI",
    "job interview questions",
    "mock interview online",
    "interview coaching AI",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Interview Prep | Launch CV",
      url: absoluteUrl("/features/interview-prep"),
      description: "Role-specific AI interview practice with scored feedback.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Interview Prep", item: absoluteUrl("/features/interview-prep") },
      ],
    },
  ],
};

const categories = [
  { k: "Behavioral", d: "STAR-method questions generated from your resume experience." },
  { k: "Technical", d: "Pulled from the JD&apos;s required skills and tools, with depth tags." },
  { k: "Company & culture", d: "Built from public values, mission, and recent press." },
  { k: "Situational", d: "What-would-you-do scenarios relevant to the exact role." },
  { k: "Curveball", d: "The off-script ones recruiters use to test composure." },
  { k: "Salary & close", d: "Anchoring, negotiation, and post-interview reply scripts." },
];

const benefits = [
  { t: "Role-specific questions", d: "Generated from your resume and the JD. No generic &lsquo;tell me your weakness&rsquo;." },
  { t: "AI scoring 1–10", d: "Every answer rated for Clarity, Relevance, Impact, and STAR structure. With the &lsquo;why&rsquo;." },
  { t: "Model answer for comparison", d: "AI returns a benchmark answer beside yours — to calibrate against, not to memorize." },
  { t: "Progress dashboard", d: "Session-by-session score trend. Watch yourself improve across attempts." },
  { t: "Resume-aware follow-ups", d: "AI digs in like a real interviewer. Mention a project — expect the follow-up question." },
  { t: "Multi-round simulation", d: "Recruiter screen, hiring manager, panel — each stage with the right tone and density." },
];

const testimonials = [
  {
    q: "Interview prep is underrated. Practicing with AI questions specific to the job made me so much more confident. I knew the answers before they asked.",
    n: "James O.",
    r: "Data Analyst at Snowflake",
  },
  {
    q: "I failed four interviews before Launch CV. The AI feedback showed me I wasn&apos;t using STAR properly. Fixed that — hired on the very next one.",
    n: "Nina P.",
    r: "Business Analyst",
  },
];

export default function InterviewPrepPage() {
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
              "radial-gradient(circle at 12% 0%, rgba(5,150,105,0.07), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <MessageSquare className="h-3.5 w-3.5 text-[#059669]" />
                Interview Prep
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Walk into every interview prepared, not rehearsed
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                AI reads your resume and the job description, then drills you on the exact questions you&apos;re likely to face. Every answer is scored, every weakness named, every model answer benchmarked.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#059669] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(5,150,105,0.4)] transition hover:bg-[#047857]"
                >
                  Drill my first interview
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  Browse question banks
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "200+", l: "Questions per role" },
                  { v: "1–10", l: "AI scoring" },
                  { v: "6", l: "Question banks" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CHAT MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">Mock · Senior PM @ Linear</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> live
                  </span>
                </div>

                <div className="space-y-3 p-6">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-semibold text-white">AI</span>
                    <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-[#FAFBFC] px-4 py-3 ring-1 ring-[#E2E8F0]">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Behavioral · Q3</p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-[#0F172A]">
                        Tell me about a cross-functional project that almost shipped late. What did you do?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start justify-end gap-2.5">
                    <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-[#059669] px-4 py-3 text-white">
                      <p className="text-[13px] leading-[1.55]">
                        Q3 last year, our onboarding rebuild was 2 weeks behind. I split the team into a &lsquo;core path&rsquo; and &lsquo;edge cases&rsquo; track, paused non-critical scope, and we shipped on day-of with 91% activation parity…
                      </p>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[10px] font-semibold text-[#0F172A]">You</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-semibold text-white">AI</span>
                    <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Feedback · 8.4 / 10</p>
                      <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
                        {[
                          { l: "Clarity", v: 9 },
                          { l: "Relevance", v: 8 },
                          { l: "Impact", v: 9 },
                          { l: "STAR", v: 7 },
                        ].map((m) => (
                          <div key={m.l} className="text-center">
                            <p className="text-[18px] font-bold text-[#0F172A]">{m.v}</p>
                            <p className="text-[#64748B]">{m.l}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-[12px] leading-[1.55] text-[#0F172A]">
                        Strong framing. Tighten the <span className="rounded bg-emerald-100 px-1 text-emerald-800">Result</span> — quantify activation parity with a hard baseline, e.g. &ldquo;vs. 87% in the prior quarter&rdquo;.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFBFC] px-5 py-3">
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0F172A] ring-1 ring-[#E2E8F0]">
                    <Mic className="h-3.5 w-3.5 text-[#059669]" /> Voice answer
                  </button>
                  <span className="text-[11px] text-[#94A3B8]">Question 3 of 12 · 8.4 avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Question banks</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Six banks, every kind of question
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                AI picks the right mix automatically. Drill the bank that worries you, or run a full mock from screener to panel.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <RevealOnView key={c.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Bank {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[17px] font-semibold text-[#0F172A]">{c.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: c.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SCORING */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Inside the score</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Four dimensions, one honest number
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every answer is graded across the four levers recruiters evaluate. You get the breakdown, the why, and a model answer to calibrate against.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Clarity", d: "How easily a tired recruiter can follow your story at 4 pm.", i: Brain, v: 9 },
              { k: "Relevance", d: "How tightly the example maps to the asked question.", i: Target, v: 8 },
              { k: "Impact", d: "Whether the outcome is quantified, baselined, and yours.", i: TrendingUp, v: 9 },
              { k: "STAR", d: "Situation, Task, Action, Result — all four explicit.", i: CheckCircle2, v: 7 },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <m.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{m.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                  <p className="mt-4 text-[28px] font-bold leading-none tracking-tight text-emerald-700">
                    {m.v}<span className="text-[14px] text-[#94A3B8]">/10</span>
                  </p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Why it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built like a coach, drills like a recruiter
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-emerald-700" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: b.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
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
                  <blockquote className="mt-4 text-[15px] leading-[1.7] text-[#0F172A]" dangerouslySetInnerHTML={{ __html: `&ldquo;${t.q}&rdquo;` }} />
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
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match the resume to the role.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
              { href: "/features/resume-builder", t: "Resume Builder", d: "ATS-tested templates and bullets.", icon: FileText },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
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
            Practice until your worst day still wins
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            200+ role-specific questions. AI-scored answers. Model responses on tap.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#059669] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#047857]"
          >
            Drill my first interview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
