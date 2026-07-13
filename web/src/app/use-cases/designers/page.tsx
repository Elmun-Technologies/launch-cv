import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { StickyCta } from "@/components/sticky-cta";
import { ArrowRight, Palette, Layers, Sparkles, Eye, Check } from "lucide-react";
import { KeyFacts } from "@/components/key-facts";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";

export const metadata = buildMarketingMetadata({
  title: "Designer Resume Builder — Turn Portfolio Into Offers",
  description:
    "Your portfolio shows the work — your resume should land the interview. LaunchCV writes ATS-clean design bullets that quantify impact and shipping speed.",
  pathname: "/use-cases/designers",
  image: DEFAULT_OG_IMAGE,
  keywords: ["designer resume", "UX designer resume", "product designer resume ATS", "design portfolio resume"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: absoluteUrl("/use-cases/designers"),
      name: "Resume for Designers | LaunchCV",
      description:
        "LaunchCV writes ATS-clean design bullets that quantify impact, systems thinking, and shipping speed — so your resume lands the interview.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Use Cases", item: absoluteUrl("/use-cases") },
        { "@type": "ListItem", position: 3, name: "Designer Resume", item: absoluteUrl("/use-cases/designers") },
      ],
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
  ],
};

const designKeywords = [
  "Design systems", "Figma", "Prototyping", "Tokens", "Accessibility (WCAG)", "User research",
  "Usability testing", "Information architecture", "Interaction design", "Motion", "Service design",
  "Critique", "Cross-functional", "Hand-off", "Pixel-perfect", "Brand", "Visual design",
];

const examples = [
  { before: "redesigned the dashboard", after: "Led 6-week dashboard rework with PM + 3 engineers, lifting daily-active time-on-task by 41% (15.2 → 21.4 min) and cutting support tickets by 28%." },
  { before: "built design system", after: "Designed and shipped the v2 token library + 84 Figma components across web, iOS, Android — adopted by 9 product squads, cutting average ship time from 18 → 11 days." },
  { before: "did user testing", after: "Ran weekly moderated tests (n = 6, 12 cycles) for the onboarding rebuild — surfaced 14 critical issues pre-ship; activation parity reached week-of-launch." },
];

export default function DesignersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 12% 0%, rgba(219,39,119,0.05), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Palette className="h-3.5 w-3.5 text-[#DB2777]" /> For Designers
              </span>
              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Your portfolio shows the work. Your resume lands the room.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Most designers under-sell themselves on paper. LaunchCV quantifies your hand-off impact, system contributions, research depth, and shipping speed — without making it sound like a banker wrote it.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="LaunchCV writes ATS-clean design resume bullets that quantify impact, design-system contributions, research depth, and shipping speed — so your resume lands the interview your portfolio deserves. It uses design-specific language (not banker-speak) and a design keyword library matched to each job description."
                facts={[
                  "Quantifies hand-off impact, design-system work, research depth, and shipping speed.",
                  "Design keyword library (Figma, design systems, WCAG, IA, prototyping) per job.",
                  "Writes in design language, not corporate boilerplate.",
                  "ATS-clean formatting built for how ATS platforms parse resumes.",
                ]}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="usecase_designer"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(219,39,119,0.4)] transition hover:bg-[#BE185D]"
                >
                  Build my design resume
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="/features/resume-builder"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See Resume Builder
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Design keyword library — pre-loaded</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {designKeywords.map((s) => (
                    <span key={s} className="rounded-md bg-pink-50 px-2 py-0.5 text-[11px] font-medium text-pink-800 ring-1 ring-pink-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-[1.7] text-[#64748B]">
                  + 100 more across product, brand, motion, and service design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#DB2777]">Why it matters</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              The most beautiful designer resume is the one that never parses
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Designers are trained to make the artifact gorgeous — so a UX designer resume ends up in two columns, with a custom typeface and links buried in a header graphic. That is exactly the layout an applicant tracking system fails to read.
              </p>
              <p>
                LaunchCV keeps the impact and drops the parsing risk. Your design portfolio resume stays clean and quantified, so the product designer resume ATS screen passes and a human actually sees the work. Three things stay true:
              </p>
            </div>
            <ul className="mt-5 space-y-2.5 text-[15px] leading-[1.6] text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#DB2777]" />
                <span><span className="font-medium text-[#0F172A]">Impact is quantified</span> — adoption, time-on-task, and tickets, not just &ldquo;redesigned&rdquo;.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#DB2777]" />
                <span><span className="font-medium text-[#0F172A]">The portfolio stays reachable</span> — live links in a parseable Selected Work section.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#DB2777]" />
                <span><span className="font-medium text-[#0F172A]">The format parses</span> — single-column layouts built for how major ATS platforms parse.</span>
              </li>
            </ul>
          </RevealOnView>
        </div>
      </section>

      {/* 4 DIMENSIONS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">Design impact, made legible</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Pixel-perfect bullets, recruiter-perfect resume
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Layers, k: "System contributions", d: "Tokens added, components shipped, adoption across squads." },
              { i: Sparkles, k: "Ship velocity", d: "Concept-to-production timelines, hand-off quality, dev parity." },
              { i: Eye, k: "Research depth", d: "Tests run, participants, decisions changed, features killed." },
              { i: Palette, k: "Craft quality", d: "Accessibility scores, motion principles, design QA pass rate." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-700">
                    <m.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{m.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{m.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#E11D48]">Inside the product</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Clean, ATS-safe layouts for designers</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/resume-templates.svg"
            alt="A gallery of ATS-safe, single-column resume templates in LaunchCV, giving designers a clean layout that still parses cleanly."
            caption="Portfolio-worthy without the parser risk — every template is single-column and ATS-tested."
          />
        </div>
      </section>

      {/* DIFF EXAMPLES */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">3 real rewrites</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What hiring designers actually want to read
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-xl border border-[#E2E8F0] bg-white p-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-red-100 bg-red-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Before</p>
                    <p className="mt-2 text-[14px] text-[#475569]">&ldquo;{e.before}&rdquo;</p>
                  </div>
                  <div className="rounded-lg border border-pink-100 bg-pink-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-700">After · AI rewrite</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO-FRIENDLY */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <p className="lc-overline text-[#DB2777]">Portfolio-friendly</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Your portfolio is the main act. The resume opens the door.
                </h2>
                <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-[#475569]">
                  Every LaunchCV resume includes a dedicated, ATS-parseable Selected Work section. Live links, short context, and the metric that mattered. The recruiter clicks. The portfolio takes over.
                </p>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Selected work · auto-formatted</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { t: "Activation Funnel Rebuild", c: "stripe.com — Sr. PD · 2024", m: "+41% time-on-task · −28% tickets" },
                      { t: "Design System v2 (Tokens + 84 components)", c: "internal · 2023", m: "9 squads adopted · ship time 18 → 11 days" },
                      { t: "Onboarding Research Cycle", c: "linear.app — Sr. PD · 2023", m: "n = 72 · 14 critical issues pre-ship" },
                    ].map((p) => (
                      <div key={p.t} className="rounded-lg bg-[#FAFBFC] p-4 ring-1 ring-[#E2E8F0]">
                        <p className="text-[14px] font-semibold text-[#0F172A]">{p.t}</p>
                        <p className="text-[12px] text-[#64748B]">{p.c}</p>
                        <p className="mt-1 font-mono text-[11px] text-emerald-700">{p.m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Build a designer resume in five steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                LaunchCV pairs an AI resume builder with JD matching and an ATS check, so your design portfolio resume opens the door your work deserves.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Import or describe your work", d: "Paste an existing resume or describe each project in plain language — voice input works too." },
              { n: "02", t: "Load a target job description", d: "JD Alignment maps the systems, research, and craft signals the role asks for." },
              { n: "03", t: "Let AI quantify the impact", d: "Bullets are rewritten with adoption, time-on-task, ship velocity, and research depth." },
              { n: "04", t: "Check the ATS score", d: "Score your UX designer resume 0–100 with our ATS check; a single-column Selected Work section stays parseable." },
              { n: "05", t: "Export with portfolio links", d: "Download PDF or DOCX with live, ATS-safe links straight to your best case studies." },
            ].map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-pink-50 text-[13px] font-bold text-[#DB2777]">
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
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">Why designers use it</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A generic builder vs. a product designer resume ATS engine
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Beautiful, portfolio-style resumes are exactly what applicant tracking systems choke on. LaunchCV keeps the impact and drops the parsing risk.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What hiring designers scan</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#DB2777]">LaunchCV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Generic resume builder</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Impact metrics", a: "Adoption, time-on-task, and tickets quantified", b: "“Redesigned the dashboard”" },
                  { k: "Systems work", a: "Tokens, components, and squad adoption surfaced", b: "Buried in a paragraph" },
                  { k: "ATS formatting", a: "Single-column, built for how ATS parses", b: "Portfolio layouts that break parsing" },
                  { k: "Portfolio links", a: "A parseable Selected Work section", b: "Links trapped inside a graphic" },
                  { k: "Research depth", a: "Tests, participants, and decisions changed", b: "Left off entirely" },
                  { k: "Proof", a: "Free ATS score — no signup", b: "No feedback loop" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#DB2777]" />
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
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#DB2777]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Mara made a portfolio-heavy resume actually parse
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Mara&apos;s resume was a designer&apos;s resume: two columns, a custom typeface, and her project links tucked into a beautiful header graphic. It looked great and never got a callback. The applicant tracking system could not read most of it.
              </p>
              <p>
                She rebuilt it in LaunchCV. The design portfolio resume kept a clean Selected Work section — live links, one line of context, and the metric that mattered. Her vague &ldquo;redesigned the dashboard&rdquo; became <span className="font-medium text-[#0F172A]">&ldquo;Led a 6-week dashboard rework, lifting daily time-on-task by 41% and cutting support tickets by 28%&rdquo;</span>.
              </p>
              <p>
                An ATS score check confirmed the new single-column layout parsed cleanly. The portfolio still did the closing; the resume finally opened the door.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/resume-builder" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Build the resume <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/ats-score" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Check the ATS score <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#DB2777]">FAQ</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">Common questions</h2>
          </RevealOnView>

          <div className="mt-10 space-y-4">
            {[
              { q: "Why does a designer resume need to be ATS-friendly?", a: "Because the resume is parsed before a human sees it. A UX designer resume with columns, graphics, or embedded links often fails; every template here is single-column and built for how ATS platforms parse resumes." },
              { q: "Can I still show my portfolio?", a: "Yes. Each resume includes a dedicated, parseable Selected Work section with live links and the metric that mattered — the recruiter clicks, and your portfolio takes over." },
              { q: "Will the AI quantify design work honestly?", a: "It surfaces the numbers you already have — adoption, time-on-task, tickets, research reach — and never fabricates metrics or projects." },
              { q: "How fast is it, and does it help?", a: "A first draft takes minutes, and a built-in ATS check shows exactly what to fix before you apply." },
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
            Related reading:{" "}
            <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#DB2777] hover:underline">What is an ATS score?</Link> and{" "}
            <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#DB2777] hover:underline">How to check your ATS score</Link>.
          </p>
        </div>
      </section>

      {/* EXPLORE THE TOOLS */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Explore the tools</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "AI Resume Builder", d: "4 ATS-ready templates and quantified bullets." },
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match your resume to any job description." },
              { href: "/features/ats-score", t: "ATS Score Checker", d: "A 0–100 ATS readiness score." },
              { href: "/features/cover-letter", t: "Cover Letter Generator", d: "A tailored letter in 60 seconds." },
              { href: "/features/interview-prep", t: "Interview Prep", d: "Role-specific questions with model answer outlines." },
              { href: "/features/voice-input", t: "Voice Input", d: "Speak your experience, AI writes it." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <p className="text-[14px] font-semibold text-[#0F172A] transition group-hover:text-[#DB2777]">{r.t}</p>
                <p className="mt-1 text-[13px] text-[#64748B]">{r.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">More use cases</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/software-engineers", t: "For Software Engineers", d: "Stack, on-call, scope, latency, throughput." },
              { href: "/use-cases/product-managers", t: "For Product Managers", d: "Roadmap wins, OKRs, A/B tests, stakeholders." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#CBD5E1]"
              >
                <div>
                  <p className="text-[16px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#DB2777]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            The taste is yours. Let the resume keep up.
          </h2>
          <CtaLink cta="get_started" location="usecase_designer"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#BE185D]"
          >
            Build my design resume
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      <StickyCta
        primaryHref="/register"
        primaryLabel="Build my design resume"
        primaryClassName="bg-[#DB2777] hover:bg-[#BE185D]"
        location="use_case_designers"
      />

      <LandingFooter />
    </div>
  );
}
