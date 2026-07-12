import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { StickyCta } from "@/components/sticky-cta";
import { ArrowRight, Code2, Terminal, GitBranch, Cpu, Cloud, Check } from "lucide-react";
import { KeyFacts } from "@/components/key-facts";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";

export const metadata = buildMarketingMetadata({
  title: "Software Engineer Resume Writer: AI, 5-Min Build",
  description:
    "The AI resume writer for software engineers: rewrites your bullets to quantify latency, throughput, and scope — the signals recruiters scan. Try it free →",
  pathname: "/use-cases/software-engineers",
  image: DEFAULT_OG_IMAGE,
  keywords: ["software engineer resume writer", "software engineer resume", "developer resume", "engineering resume ATS", "tech resume AI", "Launch CV"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: absoluteUrl("/use-cases/software-engineers"),
      name: "Resume for Software Engineers | Launch CV",
      description:
        "ATS-clean engineering resumes. AI quantifies latency, throughput, scope, and ownership — the signals hiring managers scan for.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Use Cases", item: absoluteUrl("/use-cases") },
        { "@type": "ListItem", position: 3, name: "Software Engineer Resume", item: absoluteUrl("/use-cases/software-engineers") },
      ],
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
  ],
};

const stack = [
  "TypeScript", "Python", "Go", "Rust", "Java", "Kotlin", "React", "Next.js", "Node", "FastAPI",
  "PostgreSQL", "Redis", "Kafka", "AWS", "GCP", "Kubernetes", "Docker", "Terraform", "GraphQL", "gRPC",
];

const painPoints = [
  { i: Terminal, p: "Bullets sound like JIRA tickets", s: "AI rewrites &lsquo;fixed bug in payments&rsquo; as &lsquo;reduced p99 checkout latency by 38% across 3 regions&rsquo;." },
  { i: GitBranch, p: "Open-source isn&apos;t on the resume", s: "Dedicated Projects section with stars, commits, and contribution role auto-detected from GitHub." },
  { i: Cpu, p: "ATS rejects clever layouts", s: "Engineering-tested templates: no tables, no graphics, no LaTeX-looking sidebars." },
  { i: Cloud, p: "Senior signals don&apos;t pop", s: "AI surfaces scope: team size, system tier, on-call rotation, RFC ownership." },
];

const examples = [
  { before: "fixed slow db queries", after: "Cut p95 read latency from 240ms → 48ms on the payments service via index rewrites and connection pooling — saved an estimated $34k/yr in DB IOPS." },
  { before: "shipped some features", after: "Owned end-to-end delivery of 7 features across Q3/Q4, growing weekly active dev seats by 28% (3.2k → 4.1k) on the IDE plugin." },
  { before: "did some on-call work", after: "Led on-call rotation for tier-0 services (12-engineer roster, 24×7), cutting MTTR from 41 min → 9 min via runbook and alert hygiene." },
];

export default function SoftwareEngineersPage() {
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
            backgroundImage: "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Code2 className="h-3.5 w-3.5 text-[#1A56DB]" /> For Software Engineers
              </span>
              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                A resume that reads like an engineer wrote it
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                Most engineering resumes read like a ticket queue. Launch CV rewrites them with the language hiring managers actually scan for — latency, throughput, scope, ownership, baselines — and keeps formatting ATS-clean for Workday, Greenhouse, Lever, and 12 more.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="Launch CV builds ATS-clean software engineer resumes that quantify latency, throughput, scope, and ownership — the signals hiring managers scan for. It rewrites ticket-style bullets into measurable impact, draws on a 200+ engineering keyword library, and keeps formatting parseable for Workday, Greenhouse, Lever, and 12 more ATS engines."
                facts={[
                  "Rewrites vague bullets into quantified impact (latency, throughput, scope, MTTR).",
                  "200+ engineering keywords pre-loaded; AI picks the right subset per job.",
                  "Engineering-tested templates — no tables, graphics, or sidebars that break ATS.",
                  "Tested against 15 ATS engines, including Workday, Greenhouse, and Lever.",
                ]}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="usecase_swe"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Build my engineering resume
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="/features/jd-alignment"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See JD Alignment
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFC] p-7">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pre-loaded keyword library</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {stack.map((s) => (
                    <span key={s} className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#475569] ring-1 ring-[#E2E8F0]">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-[1.7] text-[#64748B]">
                  + 200 more across Cloud, DevOps, Security, ML, and mobile. AI picks the right subset per JD.
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
            <p className="lc-overline text-[#1A56DB]">Why it matters</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              A great software engineer resume is a parsing problem first
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Strong engineers lose interviews to formatting, not talent. A clever two-column developer resume can read beautifully to you and arrive as garbled text to an applicant tracking system — so the review never happens.
              </p>
              <p>
                Launch CV treats the resume as an engineering resume ATS problem: clean structure in, quantified impact out. The tech resume AI keeps three things true at once:
              </p>
            </div>
            <ul className="mt-5 space-y-2.5 text-[15px] leading-[1.6] text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                <span><span className="font-medium text-[#0F172A]">Impact is measurable</span> — latency, throughput, scope, and ownership, not duty lists.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                <span><span className="font-medium text-[#0F172A]">Formatting is parseable</span> — single-column layouts tested across 15+ ATS platforms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
                <span><span className="font-medium text-[#0F172A]">Keywords fit the role</span> — each posting matched with JD Alignment before you apply.</span>
              </li>
            </ul>
          </RevealOnView>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#1A56DB]">Inside the product</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Matched to the exact engineering role</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/jd-alignment.svg"
            alt="The Launch CV JD alignment view matching a software engineer resume to a backend job description, showing a 91% match and matched keywords like Kubernetes, GraphQL, and AWS."
            caption="Paste a backend job description; Launch CV surfaces the exact keywords and gaps to close."
          />
        </div>
      </section>

      {/* DIFF EXAMPLES */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">The diff · 3 real rewrites</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What hiring managers actually want to read
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-xl border border-[#E2E8F0] bg-white p-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-red-100 bg-red-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">Before</p>
                    <p className="mt-2 font-mono text-[13px] text-[#475569]">$ {e.before}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">After · AI rewrite</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Engineering-specific fixes</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Built for the things you actually ship
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((p) => (
              <RevealOnView key={p.p}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <p.i className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-red-600">Problem</p>
                  <p className="text-[15px] font-semibold text-[#0F172A]" dangerouslySetInnerHTML={{ __html: p.p }} />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-700">We fix it with</p>
                  <p className="text-[13px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: p.s }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">Engineering sections covered</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Not just Experience — all of the above
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: "Tech stack", d: "Cloud, languages, frameworks, datastores — grouped, deduped, ATS-parseable." },
              { h: "Open-source projects", d: "Repo name, stars, commits, role. Maintainer or contributor — auto-detected from GitHub if linked." },
              { h: "System design", d: "RFCs, architecture migrations, scale milestones (10× users, 100× requests, $X cost saved)." },
              { h: "On-call and SRE", d: "Rotation size, MTTR, incident leadership, postmortem ownership." },
              { h: "Certifications", d: "AWS, GCP, K8s, security — with issue date and credential ID." },
              { h: "Publications and talks", d: "Conference talks, blog posts, podcast appearances, internal RFCs cited externally." },
            ].map((s) => (
              <RevealOnView key={s.h}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#1A56DB]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{s.h}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#1A56DB]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Build a software engineer resume in five steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Launch CV combines an AI resume builder, JD matching, and an ATS check so your developer resume reads like impact, not a ticket queue.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Import or speak your experience", d: "Paste your existing resume or describe each role in plain language — voice input works too." },
              { n: "02", t: "Load a target job description", d: "JD Alignment maps the required stack and seniority signals to what you already have." },
              { n: "03", t: "Let AI quantify the work", d: "Bullets are rewritten with latency, throughput, scope, and ownership — the signals hiring managers scan for." },
              { n: "04", t: "Check the ATS score", d: "Score your engineering resume 0–100 across 15+ ATS platforms; templates avoid tables and graphics that break parsing." },
              { n: "05", t: "Export and drill", d: "Download PDF or DOCX, then run interview prep on the exact same role." },
            ].map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#EFF6FF] text-[13px] font-bold text-[#1A56DB]">
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
              <p className="lc-overline text-[#1A56DB]">Why engineers use it</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A generic builder vs. an engineering resume ATS engine
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Most builders hand you a pretty template. Launch CV handles the writing, the JD match, and the parsing risk that actually keeps a developer resume out of the pile.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What hiring managers scan</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#1A56DB]">Launch CV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Generic resume builder</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Impact metrics", a: "Latency, throughput, and scope quantified", b: "“Responsible for” duty lines" },
                  { k: "ATS formatting", a: "Single-column, no tables — tested on 15+ platforms", b: "Sidebars that scramble parsing" },
                  { k: "Keyword match", a: "Stack aligned to each posting", b: "One static skills list for every job" },
                  { k: "Projects & OSS", a: "Dedicated, parseable Projects section", b: "Buried or left off entirely" },
                  { k: "Seniority signals", a: "Team size, on-call, and RFC ownership surfaced", b: "A flat list of tasks" },
                  { k: "Proof", a: "+43 average ATS gain · 95% pass rate", b: "No feedback loop" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A56DB]" />
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
            <p className="lc-overline text-[#1A56DB]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Ravi turned ticket-speak into interviews
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Ravi was a backend engineer with five years of solid work and a resume that read like a JIRA export: &ldquo;fixed slow db queries&rdquo;, &ldquo;did some on-call work&rdquo;. Recruiters were not calling.
              </p>
              <p>
                He pasted a target job description into JD Alignment and let the tech resume AI rewrite. &ldquo;Fixed slow db queries&rdquo; became <span className="font-medium text-[#0F172A]">&ldquo;Cut p95 read latency from 240ms to 48ms on the payments service via index rewrites and connection pooling&rdquo;</span>. His on-call line grew a roster size and an MTTR number. Nothing was invented — the AI just surfaced the scope he had buried.
              </p>
              <p>
                Then he ran the ATS score checker, swapped his two-column layout for a single-column engineering template, and watched the score clear 90. Same career, finally legible to the parser and the hiring manager — and a first-pass gain in line with the platform&apos;s +43-point average.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/jd-alignment" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Match a job description <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/blog/resume-keywords-for-software-engineers" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Resume keywords for engineers <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#1A56DB]">FAQ</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">Common questions</h2>
          </RevealOnView>

          <div className="mt-10 space-y-4">
            {[
              { q: "What makes an engineering resume ATS-friendly?", a: "A single-column layout, standard fonts, and no tables or graphics. Every developer resume template here is tested across 15+ ATS platforms including Workday, Greenhouse, and Lever." },
              { q: "Will the tech resume AI invent metrics?", a: "No. It quantifies what you actually did — latency, throughput, scope, ownership — from your input. It never fabricates numbers, employers, or roles." },
              { q: "Can I tailor the resume per company?", a: "Yes. JD Alignment re-matches your engineering resume to each posting and fills the keyword gaps for that exact role." },
              { q: "How fast is it, and does it help?", a: "A first draft takes under 5 minutes, and most people gain +43 ATS points on the first pass — moving toward the 95% pass rate our templates target." },
            ].map((f) => (
              <RevealOnView key={f.q}>
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-[16px] font-semibold text-[#0F172A]">{f.q}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{f.a}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLORE THE TOOLS */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Explore the tools</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "AI Resume Builder", d: "12+ ATS-tested templates and quantified bullets." },
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match your resume to any job description." },
              { href: "/features/ats-score", t: "ATS Score Checker", d: "A 0–100 score across 15+ ATS platforms." },
              { href: "/features/cover-letter", t: "Cover Letter Generator", d: "A tailored letter in 60 seconds." },
              { href: "/features/interview-prep", t: "Interview Prep", d: "200+ role-specific questions, scored." },
              { href: "/features/voice-input", t: "Voice Input", d: "Speak your experience, AI writes it." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <p className="text-[14px] font-semibold text-[#0F172A] transition group-hover:text-[#1A56DB]">{r.t}</p>
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
              { href: "/use-cases/product-managers", t: "For Product Managers", d: "Roadmap wins, OKRs, A/B tests, stakeholder scope." },
              { href: "/use-cases/designers", t: "For Designers", d: "Portfolio links, system work, research, hand-off impact." },
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
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#1A56DB]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Your code is good. Make the resume keep up.
          </h2>
          <CtaLink cta="get_started" location="usecase_swe"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Build my engineering resume
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        location="use_case_software_engineers"
      />

      <LandingFooter />
    </div>
  );
}
