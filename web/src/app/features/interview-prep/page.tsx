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
  ArrowUpRight,
  Star,
  Mic,
  Brain,
  CheckCircle2,
  ChevronRight,
  Target,
  FileText,
  Mail,
  TrendingUp,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep — Practice the Exact Questions You'll Be Asked",
  description:
    "Launch CV reads your resume and the job description, then generates a real-role question set with scored AI feedback. Walk in prepared. Not rehearsed.",
  pathname: "/features/interview-prep",
  keywords: ["AI interview preparation", "interview practice AI", "job interview questions", "mock interview online", "interview coaching AI"],
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
  { k: "Technical", d: "Pulled from the JD's required skills and tools, with depth tags." },
  { k: "Company & culture", d: "Built from public values, mission, and recent press." },
  { k: "Situational", d: "What-would-you-do scenarios relevant to the exact role." },
  { k: "Curveball", d: "The off-script ones recruiters test composure with." },
  { k: "Salary & close", d: "Anchoring, negotiation, and post-interview reply scripts." },
];

const benefits = [
  { t: "Role-specific questions", d: "Pulled from your resume × the JD. No generic 'tell me your weakness'. Real questions for the role you're chasing." },
  { t: "AI scoring 1–10", d: "Every answer rated for Clarity, Relevance, Impact, STAR structure. Get the four numbers — and the why." },
  { t: "Model answer for comparison", d: "AI returns a benchmark answer beside yours. Not to memorize — to calibrate against." },
  { t: "Progress dashboard", d: "Session-by-session score trend. Watch yourself improve across attempts and categories." },
  { t: "Resume-aware follow-ups", d: "AI digs in like a real interviewer. If you mention a project — expect the follow-up question." },
  { t: "Multi-round simulation", d: "Recruiter screen → hiring manager → panel. Each stage with the right question density and tone." },
];

const testimonials = [
  { q: "Interview prep is underrated. Practicing with AI questions specific to the job made me so much more confident. I knew the answers before they asked.", n: "James O.", r: "Data Analyst → Snowflake" },
  { q: "I failed 4 interviews before Launch CV. The AI feedback showed me I wasn't using STAR properly. Fixed that — hired on the very next one.", n: "Nina P.", r: "Business Analyst" },
];

export default function InterviewPrepPage() {
  return (
    <div className="lc-theme-emerald flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#F0FDF4] pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#059669] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-60 h-[400px] w-[400px] rounded-full bg-[#0D9488] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#059669]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#059669]">
                <MessageSquare className="h-3.5 w-3.5" /> Feature · Interview Prep
              </span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[80px] lg:text-[100px]">
              <span className="block">The interview</span>
              <span className="block lc-mega-italic text-[#059669]">won&apos;t surprise</span>
              <span className="block">you. <span className="italic text-[#94A3B8]">We make sure.</span></span>
            </h1>

            <p className="mt-7 max-w-[540px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              AI reads your resume and the job description, then drills you on the exact questions you&apos;ll be asked.
              Every answer scored, every weakness named, every model answer benchmarked. The room is no longer a black box.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#059669] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(5,150,105,0.7)]">
                Drill my first interview <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#categories" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                Browse question banks <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0F172A]/10 pt-6">
              {[
                { v: "200+", l: "Questions per role" },
                { v: "1–10", l: "AI scoring" },
                { v: "6", l: "Question banks" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[28px] font-extrabold leading-none tracking-tight text-[#0F172A]">{s.v}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT mockup */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="lc-window">
                <div className="lc-window-bar">
                  <span className="lc-window-dot bg-[#FF5F57]" />
                  <span className="lc-window-dot bg-[#FEBC2E]" />
                  <span className="lc-window-dot bg-[#28C840]" />
                  <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">Mock · Senior PM @ Linear</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#DCFCE7] px-2.5 py-1 font-body text-[11px] font-bold text-[#15803D]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" /> live
                  </span>
                </div>

                <div className="space-y-3.5 p-6">
                  <div className="lc-bubble-in lc-bubble-in-d1 flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white">AI</span>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-[#F8FAFC] px-4 py-3 ring-1 ring-[#E2E8F0]">
                      <p className="font-body text-[12px] font-semibold text-[#94A3B8]">Behavioral · Q3</p>
                      <p className="mt-1 font-body text-[13px] leading-[1.6] text-[#0F172A]">
                        Tell me about a cross-functional project that almost shipped late. What did you do?
                      </p>
                    </div>
                  </div>

                  <div className="lc-bubble-in lc-bubble-in-d2 flex items-start justify-end gap-2.5">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-[#059669] px-4 py-3 text-white">
                      <p className="font-body text-[13px] leading-[1.6]">
                        Q3 last year, our onboarding rebuild was 2 weeks behind. I split the team into a &apos;core path&apos; and &apos;edge cases&apos; track, paused non-critical scope, and we shipped on day-of with 91% activation parity…
                      </p>
                    </div>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A]/10 text-[10px] font-bold text-[#0F172A]">You</span>
                  </div>

                  <div className="lc-bubble-in lc-bubble-in-d3 flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white">AI</span>
                    <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[#F0FDF4] px-4 py-3 ring-1 ring-emerald-200">
                      <p className="font-body text-[12px] font-bold uppercase tracking-wider text-[#059669]">Feedback · 8.4 / 10</p>
                      <div className="mt-2 grid grid-cols-4 gap-2 font-body text-[11px]">
                        {[{ l: "Clarity", v: 9 }, { l: "Relevance", v: 8 }, { l: "Impact", v: 9 }, { l: "STAR", v: 7 }].map((m) => (
                          <div key={m.l} className="text-center">
                            <p className="font-display text-[20px] font-extrabold text-[#0F172A]">{m.v}</p>
                            <p className="text-[#64748B]">{m.l}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 font-body text-[12px] leading-[1.6] text-[#0F172A]">
                        Strong situation framing. Tighten the <span className="bg-[#FEF08A] px-1">Result</span>: quantify activation parity with a hard baseline. Try: &quot;vs. 87% in the prior quarter&quot;.
                      </p>
                    </div>
                  </div>

                  <div className="lc-bubble-in lc-bubble-in-d4 flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white">AI</span>
                    <div className="rounded-2xl rounded-tl-md bg-[#F8FAFC] px-4 py-3 ring-1 ring-[#E2E8F0]">
                      <p className="font-body text-[12px] text-[#94A3B8]">Generating follow-up question…</p>
                      <div className="mt-1 flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#94A3B8]" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFAF7] px-5 py-3">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-body text-[11px] font-bold text-[#0F172A] ring-1 ring-[#E2E8F0]">
                    <Mic className="h-3.5 w-3.5 text-[#059669]" /> Voice answer
                  </button>
                  <span className="font-body text-[11px] text-[#94A3B8]">Question 3 of 12 · 8.4 avg</span>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-[#059669] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(5,150,105,0.6)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">Confidence</p>
                <p className="font-display text-[18px] font-extrabold text-white">+ 38%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#059669]">Question banks</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                  Six banks.<br />
                  <span className="italic text-[#059669]">Every</span> kind of question.
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                AI picks the right mix automatically based on the role and round. Drill the bank that worries you, or run a full mock from screener to panel.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <RevealOnView key={c.k}>
                <div className="lc-bento h-full bg-[#FAFAF7] p-6 ring-1 ring-[#E2E8F0] hover:bg-white">
                  <p className="font-display text-[44px] font-extrabold leading-none tracking-tight text-[#059669]/15">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-[20px] font-bold tracking-tight text-[#0F172A]">{c.k}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#475569]">{c.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SCORING ANATOMY */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-white/55">Inside the score</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
                  Four dimensions.<br />
                  <span className="lc-gradient-text-animated">One brutal honest number.</span>
                </h2>
              </div>
              <p className="font-body text-[15px] leading-[1.7] text-white/70 lg:col-span-5">
                Every answer is graded across the four levers recruiters actually evaluate. You get the breakdown, the why, and a model answer to calibrate against.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Clarity", d: "How easily a tired recruiter can follow your story at 4 pm.", i: Brain },
              { k: "Relevance", d: "How tightly the example maps to the asked question.", i: Target },
              { k: "Impact", d: "Whether the outcome is quantified, baselined, and yours.", i: TrendingUp },
              { k: "STAR", d: "Situation · Task · Action · Result — all four explicit.", i: CheckCircle2 },
            ].map((m, i) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                  <m.i className="h-6 w-6 text-emerald-300" />
                  <h3 className="mt-5 font-display text-[24px] font-bold tracking-tight">{m.k}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-white/65">{m.d}</p>
                  <p className="mt-5 font-display text-[44px] font-extrabold leading-none text-emerald-300">{[9, 8, 9, 7][i]}<span className="text-white/30 text-[20px]">/10</span></p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#059669]">Why it works</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Built like a coach.<br />Drills like a recruiter.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {benefits.map((b, i) => (
              <RevealOnView key={b.t}>
                <div className="flex gap-5 border-t border-[#0F172A]/10 pt-7">
                  <span className="font-display text-[28px] font-extrabold leading-none text-[#059669]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{b.t}</h3>
                    <p className="mt-2 font-body text-[15px] leading-[1.7] text-[#475569]">{b.d}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F0FDF4]/40 p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[20px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F172A]">&quot;{t.q}&quot;</p>
                  <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <p className="font-body text-[14px] font-bold text-[#0F172A]">{t.n}</p>
                    <p className="font-body text-[13px] text-[#94A3B8]">{t.r}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#059669]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match the resume to the role.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
              { href: "/features/resume-builder", t: "Resume Builder", d: "ATS-tested templates and bullets.", icon: FileText },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#059669] hover:bg-[#F0FDF4]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#059669]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#059669]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#065F46] via-[#059669] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Walk in <span className="italic text-emerald-300">prepared.</span><br />
            Not rehearsed.
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/85">
            200+ role-specific questions. AI-scored answers. Model responses on tap. Practice until your worst day still wins.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#059669] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Drill my first interview <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#059669] py-3 font-body text-[14px] font-bold text-white">
          Drill my interview <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
