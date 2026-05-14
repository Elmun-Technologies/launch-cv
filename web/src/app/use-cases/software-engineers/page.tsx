import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, Code2, Terminal, GitBranch, Cpu, Cloud, Check } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Resume Builder for Software Engineers",
  description:
    "ATS-clean engineering resumes. AI rewrites your bullets to quantify latency, throughput, scope, and ownership — the signals hiring managers actually scan for.",
  pathname: "/use-cases/software-engineers",
  keywords: ["software engineer resume", "developer resume", "engineering resume ATS", "tech resume AI", "Launch CV"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: absoluteUrl("/use-cases/software-engineers"),
  name: "Resume for Software Engineers | Launch CV",
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
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Build my engineering resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
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

      {/* RELATED */}
      <section className="py-16">
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
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Build my engineering resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
