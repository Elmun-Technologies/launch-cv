import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { StickyCta } from "@/components/sticky-cta";
import { ArrowRight, Compass, BarChart3, Users, Target, Sparkles, Check } from "lucide-react";
import { KeyFacts } from "@/components/key-facts";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";

export const metadata = buildMarketingMetadata({
  title: "Product Manager Resume Builder — Show Roadmap Wins",
  description:
    "PM hiring is signal-starved. LaunchCV turns your roadmaps, OKRs, and A/B tests into the language recruiters scan for — quantified, baselined, ATS-clean.",
  pathname: "/use-cases/product-managers",
  image: DEFAULT_OG_IMAGE,
  keywords: ["product manager resume", "PM resume ATS", "product management resume AI", "LaunchCV"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: absoluteUrl("/use-cases/product-managers"),
      name: "Resume for Product Managers | LaunchCV",
      description:
        "LaunchCV turns your roadmaps, OKRs, and A/B tests into the quantified, ATS-clean language recruiters scan for.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Use Cases", item: absoluteUrl("/use-cases") },
        { "@type": "ListItem", position: 3, name: "Product Manager Resume", item: absoluteUrl("/use-cases/product-managers") },
      ],
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
  ],
};

const pmKeywords = [
  "Roadmap", "OKRs", "A/B testing", "Funnel optimization", "Activation", "Retention", "Stakeholder mgmt",
  "Cross-functional", "0→1", "Growth", "Pricing", "GTM", "Discovery", "User research", "North-star",
  "PLG", "Strategy", "Prioritization", "RICE", "JTBD",
];

const examples = [
  { before: "led product team", after: "Owned PM workstream for 3 squads (8 engineers, 2 designers) shipping the activation funnel rebuild — moved D7 activation from 31% → 48%." },
  { before: "did user research", after: "Ran 24 generative interviews + a 9-segment cluster analysis across 1,200 NPS responses — reframed our ICP, killed 2 planned features, accelerated 1." },
  { before: "worked on pricing", after: "Led pricing experiment moving Starter from $19 → $9/mo with a Lifetime tier — net-new MRR up 38%, conversion-to-paid up 2.4×, churn flat." },
];

export default function ProductManagersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ backgroundImage: "radial-gradient(circle at 12% 0%, rgba(124,58,237,0.06), transparent 50%)" }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Compass className="h-3.5 w-3.5 text-[#7C3AED]" /> For Product Managers
              </span>
              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Stop listing features. Start landing interviews.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                PM hiring is signal-starved: recruiters skim for roadmap scope, metric ownership, and cross-functional delta. LaunchCV turns your wins into the exact language they screen for — quantified, baselined, ATS-clean.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="LaunchCV turns a product manager's roadmaps, OKRs, and A/B tests into the quantified, baselined language recruiters screen for. It surfaces roadmap scope, metric ownership, and cross-functional impact, draws on a PM keyword library, and keeps formatting ATS-clean across 15 tracking systems."
                facts={[
                  "Rewrites PM wins into quantified, baselined outcomes (activation, retention, growth).",
                  "Surfaces roadmap scope, metric ownership, and cross-functional impact recruiters scan for.",
                  "PM keyword library (OKRs, RICE, JTBD, PLG, GTM) matched to each job description.",
                  "ATS-clean formatting tested against 15 tracking systems.",
                ]}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="usecase_pm"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(124,58,237,0.4)] transition hover:bg-[#6D28D9]"
                >
                  Build my PM resume
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
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">PM keyword library — pre-loaded</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pmKeywords.map((s) => (
                    <span key={s} className="rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-800 ring-1 ring-violet-200">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-[1.7] text-[#64748B]">
                  + 120 more across B2B, B2C, marketplace, and platform PM tracks.
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
            <p className="lc-overline text-[#7C3AED]">Why it matters</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              PM hiring rewards evidence, not adjectives
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                A product manager resume is scanned in seconds by people who see hundreds. &ldquo;Led product&rdquo; and &ldquo;drove growth&rdquo; tell them nothing; a quantified outcome against a baseline tells them everything.
              </p>
              <p>
                LaunchCV turns your work into the language a PM resume ATS screen and a hiring committee both reward. The product management resume AI holds three things true on every line:
              </p>
            </div>
            <ul className="mt-5 space-y-2.5 text-[15px] leading-[1.6] text-[#475569]">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
                <span><span className="font-medium text-[#0F172A]">The metric is yours</span> — activation, retention, or revenue you actually moved.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
                <span><span className="font-medium text-[#0F172A]">The scope is explicit</span> — team size, segment, and surface area you owned.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
                <span><span className="font-medium text-[#0F172A]">The format parses</span> — single-column layouts tested across 15+ ATS platforms.</span>
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
              <p className="lc-overline text-[#7C3AED]">Four dimensions of PM impact</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Scope, Metric, Delta, Baseline
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Every AI-generated PM bullet contains all four. Senior reviewers scan for them in the first six seconds.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Users, k: "Scope", d: "Team size, surface area, customer segment, dollar value of owned product line." },
              { i: BarChart3, k: "Metric", d: "Activation, retention, conversion, NPS, revenue, latency — whichever you moved." },
              { i: Target, k: "Delta", d: "Before → after. Percentage and absolute. Annualized when honest." },
              { i: Sparkles, k: "Baseline", d: "vs. control, vs. prior quarter, vs. industry benchmark." },
            ].map((m) => (
              <RevealOnView key={m.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
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
              <p className="lc-overline text-[#7C3AED]">Inside the product</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Roadmap wins, rewritten for recruiters</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/resume-builder.svg"
            alt="The LaunchCV resume builder turning a product manager's rough notes into quantified, metrics-first resume bullet points with a live preview."
            caption="Describe the launch; LaunchCV returns quantified, metrics-first product manager bullets."
          />
        </div>
      </section>

      {/* DIFF EXAMPLES */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">3 real rewrites</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                What hiring committees actually look for
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
                  <div className="rounded-lg border border-violet-100 bg-violet-50/30 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-700">After · AI rewrite</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
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
              <p className="lc-overline text-[#7C3AED]">Sections built for PMs</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Not just Experience
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: "Shipped products", d: "Named launches with scope, segment, and outcome. Public ones link out." },
              { h: "Experiments run", d: "A/B tests, scope, lift, statistical significance. Failures honestly noted." },
              { h: "Discovery work", d: "User interviews, surveys, JTBD studies — quantified by reach and decisions changed." },
              { h: "Stakeholder mgmt", d: "C-suite reviews owned, cross-functional partnerships, board updates if applicable." },
              { h: "Talks and writing", d: "Public-speaking, blog posts, podcast appearances, internal RFCs cited externally." },
              { h: "Education and certs", d: "MBA, Reforge, Lenny&apos;s, PMC — issued and verified-link-included where possible." },
            ].map((s) => (
              <RevealOnView key={s.h}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#7C3AED]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{s.h}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: s.d }} />
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
              <p className="lc-overline text-[#7C3AED]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Build a product manager resume in five steps
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                LaunchCV pairs an AI resume builder with JD matching and an ATS check, so your PM wins land as the language hiring committees actually screen for.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Import or describe your roles", d: "Paste an existing resume or describe each role in plain language — voice input works too." },
              { n: "02", t: "Load a target job description", d: "JD Alignment maps roadmap scope, metric ownership, and stakeholder signals to your experience." },
              { n: "03", t: "Let AI quantify the wins", d: "Every bullet gets Scope, Metric, Delta, and Baseline — the four things senior reviewers scan for first." },
              { n: "04", t: "Check the ATS score", d: "Score your product management resume 0–100 across 15+ ATS platforms and clear every parsing flag." },
              { n: "05", t: "Export and drill", d: "Download PDF or DOCX, then rehearse the exact role with interview prep." },
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
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#7C3AED]">Why PMs use it</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                A generic builder vs. a PM resume ATS engine
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                PM hiring is signal-starved. A generic template leaves your scope and metrics implicit; LaunchCV makes them the first thing a reviewer reads.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What committees scan</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#7C3AED]">LaunchCV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Generic resume builder</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Metric ownership", a: "Activation, retention, and conversion quantified", b: "“Led product” with no numbers" },
                  { k: "Scope", a: "Team size, segment, and dollar value surfaced", b: "Vague, unmeasured ownership" },
                  { k: "ATS formatting", a: "Single-column, tested on 15+ platforms", b: "Layouts that break parsing" },
                  { k: "Keyword match", a: "PM keywords aligned to each JD", b: "One static skills list" },
                  { k: "Experiments", a: "A/B tests with lift and baseline", b: "Left off the page" },
                  { k: "Proof", a: "+43 average ATS gain · 95% pass rate", b: "No feedback loop" },
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
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#7C3AED]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Elena reframed &ldquo;led product team&rdquo;
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Elena had shipped real wins, but her resume flattened them into duties: &ldquo;led product team&rdquo;, &ldquo;did user research&rdquo;, &ldquo;worked on pricing&rdquo;. Recruiters could not see the scope behind the verbs.
              </p>
              <p>
                She loaded a target job description and let the product management resume AI rewrite each line with Scope, Metric, Delta, and Baseline. &ldquo;Led product team&rdquo; became <span className="font-medium text-[#0F172A]">&ldquo;Owned the PM workstream for 3 squads shipping the activation funnel rebuild — moved D7 activation from 31% to 48%&rdquo;</span>. The keyword gap analysis surfaced the exact terms the JD wanted: roadmap, OKRs, A/B testing.
              </p>
              <p>
                A quick ATS score check confirmed the single-column layout parsed cleanly, and she exported. Same track record — now readable in the first six seconds a reviewer gives it, with a first-pass gain in line with the platform&apos;s +43-point average.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/jd-alignment" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Match a job description <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/interview-prep" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Drill the PM interview <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#7C3AED]">FAQ</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">Common questions</h2>
          </RevealOnView>

          <div className="mt-10 space-y-4">
            {[
              { q: "What does a strong PM resume bullet contain?", a: "Scope, Metric, Delta, and Baseline. The product management resume AI builds all four into every line so senior reviewers see impact, not activity." },
              { q: "Is the resume ATS-friendly for PM roles?", a: "Yes. Every template is a single-column, ATS-tested layout checked across 15+ ATS platforms including Workday, Greenhouse, and Lever." },
              { q: "Can I tailor it to each company?", a: "Yes. JD Alignment re-matches your PM resume to each posting and closes the keyword gaps for that role." },
              { q: "How much does it improve my resume?", a: "A first draft takes under 5 minutes, and most people gain +43 ATS points on the first pass toward the 95% pass rate our templates target." },
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
            <Link href="/blog/what-is-an-ats-score" className="font-semibold text-[#7C3AED] hover:underline">What is an ATS score?</Link> and{" "}
            <Link href="/blog/how-to-check-ats-score-of-resume" className="font-semibold text-[#7C3AED] hover:underline">How to check your ATS score</Link>.
          </p>
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
                <p className="text-[14px] font-semibold text-[#0F172A] transition group-hover:text-[#7C3AED]">{r.t}</p>
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
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#7C3AED]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Your wins are real. Make the resume show it.
          </h2>
          <CtaLink cta="get_started" location="usecase_pm"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#6D28D9]"
          >
            Build my PM resume
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        primaryClassName="bg-[#7C3AED] hover:bg-[#6D28D9]"
        location="use_case_product_managers"
      />

      <LandingFooter />
    </div>
  );
}
