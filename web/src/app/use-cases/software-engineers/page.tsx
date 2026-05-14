import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, ArrowUpRight, Code2, Terminal, GitBranch, Cpu, Database, Cloud, ChevronRight } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Resume for Software Engineers — Built for the Stack You Ship",
  description:
    "ATS-clean templates calibrated for engineering. AI bullets that quantify latency, uptime, throughput. Pass Workday and Greenhouse on your first try.",
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
  { p: "Bullets sound like JIRA tickets", s: "AI rewrites '\"fixed bug in payments\"' as 'reduced p99 checkout latency by 38% across 3 regions'." },
  { p: "Open-source isn't on the resume", s: "Dedicated Projects section with stars / commits / contribution counts pulled in." },
  { p: "ATS rejects clever layouts", s: "Engineering-tested templates: no tables, no graphics, no LaTeX-looking sidebars." },
  { p: "Senior signals don't pop", s: "AI surfaces scope: team size, system tier (T0/T1), on-call rotation, RFC ownership." },
];

const examples = [
  { before: "fixed slow db queries", after: "Cut p95 read latency from 240ms → 48ms on the payments service via index rewrites + connection pooling — saved an estimated $34k/yr in DB IOPS." },
  { before: "shipped some features", after: "Owned end-to-end delivery of 7 features across Q3/Q4, growing weekly active dev seats by 28% (3.2k → 4.1k) on the IDE plugin." },
  { before: "did some on-call work", after: "Led on-call rotation for tier-0 services (12-engineer roster, 24×7), cutting MTTR from 41 min → 9 min via runbook + alert hygiene." },
];

export default function SoftwareEngineersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0B0F19] pt-[104px] text-white">
        <div className="lc-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] rounded-full bg-[#1A56DB] opacity-[0.22] blur-[140px]" aria-hidden />
        <div className="pointer-events-none absolute -right-20 top-40 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.18] blur-[120px]" aria-hidden />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-white/80">
              <Code2 className="h-3.5 w-3.5" /> For Software Engineers
            </span>
            <h1 className="mt-6 font-display text-[64px] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[88px] lg:text-[108px]">
              Ship features.<br />
              <span className="lc-mega-italic text-white/90">Not</span>{" "}
              <span className="lc-gradient-text-animated">JIRA bullets.</span>
            </h1>
            <p className="mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-white/70 sm:text-[20px]">
              Most engineering resumes read like a ticket queue. Launch CV rewrites them with the language hiring managers actually scan for — latency, throughput, scope, ownership, baselines, deltas — and keeps the formatting ATS-clean for Workday, Greenhouse, Lever and 12 more.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-[#0B0F19]">
                Build my engineering resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features/jd-alignment" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-white/80">
                See JD Alignment <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
              <p className="font-body text-[11px] font-bold uppercase tracking-wider text-white/55">Pre-loaded keyword library</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span key={s} className="lc-pill bg-white/10 text-white/85">{s}</span>
                ))}
              </div>
              <p className="mt-5 font-body text-[12px] leading-[1.7] text-white/55">
                + 200 more across Cloud, DevOps, Security, ML, mobile. AI picks the right subset per JD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#1A56DB]">The Diff · 3 real rewrites</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                What hiring managers<br />
                <span className="italic text-[#1A56DB]">actually</span> want to read.
              </h2>
            </div>
          </RevealOnView>

          <div className="space-y-5">
            {examples.map((e, i) => (
              <RevealOnView key={i}>
                <div className="grid gap-3 rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:grid-cols-2 sm:p-7">
                  <div className="rounded-2xl bg-red-50/40 p-5 ring-1 ring-red-100">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-red-600">Before</p>
                    <p className="mt-2 font-mono text-[13px] text-[#475569]">$ {e.before}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50/40 p-5 ring-1 ring-emerald-100">
                    <p className="font-body text-[11px] font-bold uppercase tracking-wider text-emerald-700">After · AI rewrite</p>
                    <p className="mt-2 font-body text-[14px] leading-[1.6] text-[#0F172A]">{e.after}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#1A56DB]">Engineering-specific fixes</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Built for the<br />stuff <span className="italic">you</span> actually ship.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { i: Terminal, ...painPoints[0] },
              { i: GitBranch, ...painPoints[1] },
              { i: Cpu, ...painPoints[2] },
              { i: Cloud, ...painPoints[3] },
            ].map((p) => (
              <RevealOnView key={p.p}>
                <div className="lc-bento h-full bg-[#FAFAF7] p-6 ring-1 ring-[#E2E8F0]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#1A56DB]">
                    <p.i className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-[14px] font-bold uppercase tracking-wider text-red-600">Problem</p>
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{p.p}</p>
                  <p className="mt-3 font-display text-[12px] font-bold uppercase tracking-wider text-emerald-700">We fix it with</p>
                  <p className="font-body text-[14px] leading-[1.65] text-[#475569]">{p.s}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS SUPPORTED */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-white/55">Engineering sections covered</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[56px]">
                Not just Experience.<br />
                <span className="lc-gradient-text-animated">All of the above.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { h: "Tech stack", d: "Cloud, languages, frameworks, datastores — grouped, deduped, ATS-parseable." },
              { h: "Open-source projects", d: "Repo name, stars, commits, role. Maintainer or contributor — auto-detected from GitHub if linked." },
              { h: "System design", d: "RFCs, architecture migrations, scale milestones (10× users, 100× requests, $X cost saved)." },
              { h: "On-call & SRE", d: "Rotation size, MTTR, incident leadership, postmortem ownership." },
              { h: "Certifications", d: "AWS, GCP, K8s, security — with issue date and credential ID." },
              { h: "Publications & talks", d: "Conference talks, blog posts, podcast appearances, internal RFCs cited externally." },
            ].map((s) => (
              <RevealOnView key={s.h}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                  <Database className="h-5 w-5 text-[#60A5FA]" />
                  <h3 className="mt-4 font-display text-[18px] font-bold tracking-tight">{s.h}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-white/65">{s.d}</p>
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
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">More use cases</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#1A56DB]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { href: "/use-cases/product-managers", t: "For Product Managers", d: "Roadmap wins, OKRs, A/B tests, stakeholder scope." },
              { href: "/use-cases/designers", t: "For Designers", d: "Portfolio links, system work, research, hand-off impact." },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#1A56DB] hover:bg-[#EFF6FF]/30">
                <div className="flex-1">
                  <p className="font-display text-[18px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[14px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#94A3B8] transition group-hover:text-[#1A56DB]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B0F19] py-20 text-white">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[64px]">
            Your code is good.<br />
            <span className="lc-gradient-text-animated">Make the resume keep up.</span>
          </h2>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#0B0F19]">
            Build my engineering resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
