import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Code2, AlertTriangle, Sparkles, Check, Target, FileText, BarChart3 } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Resume Builder for Software Engineers",
  description:
    "Create ATS-optimized resumes tailored for software engineering roles. Highlight technical skills, quantify impact, and land more interviews.",
  pathname: "/use-cases/software-engineers",
  keywords: ["software engineer resume", "developer resume", "ATS", "Launch CV"],
});

const painPoints = [
  {
    icon: AlertTriangle,
    problem: "Technical jargon that ATS can't parse",
    solution: "Our AI translates your technical achievements into ATS-friendly language while preserving accuracy.",
  },
  {
    icon: AlertTriangle,
    problem: "Hard to quantify engineering impact",
    solution: "Smart prompts help you surface metrics like latency reduction, uptime improvement, and user growth.",
  },
  {
    icon: AlertTriangle,
    problem: "Generic templates that don't fit engineering roles",
    solution: "Engineering-specific templates with sections for tech stack, projects, open source, and certifications.",
  },
  {
    icon: AlertTriangle,
    problem: "No feedback on what's working or not",
    solution: "JD Alignment and ATS Score give you concrete data on exactly where your resume needs improvement.",
  },
];

const keywords = [
  "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust",
  "React", "Node.js", "AWS", "Docker", "Kubernetes", "CI/CD",
  "REST APIs", "GraphQL", "PostgreSQL", "MongoDB", "Redis",
  "System Design", "Microservices", "Agile/Scrum", "Git",
  "TDD", "Performance Optimization", "Data Structures",
];

export default function SoftwareEngineersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Code2 className="h-3.5 w-3.5" />
              For Software Engineers
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Land your dream{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                engineering role
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              Stop getting filtered out by ATS. Launch CV helps software engineers write resumes that showcase technical depth, quantify impact, and pass automated screens — so you can focus on what you do best: building great software.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#6B4CE0]">
                Build your resume free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                See all features
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Pain Points We Solve</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Engineering resumes have unique challenges. Here&apos;s how Launch CV tackles each one.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {painPoints.map((pp) => (
                <div key={pp.problem} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400">
                      <pp.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{pp.problem}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed text-gray-500">{pp.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">How Launch CV Helps Engineers</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">JD Alignment</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Paste any SWE job description and see exactly which skills, technologies, and requirements your resume is missing.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Engineering Templates</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Pre-built templates with sections for tech stack, side projects, open source contributions, and publications.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">ATS Optimization</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Ensure your technical resume passes Greenhouse, Lever, Workday, and other ATS systems used by top tech companies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Top Engineering Keywords</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Launch CV ensures these high-impact keywords appear naturally in your resume when they match your experience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {keywords.map((kw) => (
                <span key={kw} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to land your next engineering role?</h2>
            <p className="text-base text-white/80">Join thousands of engineers who use Launch CV to get past ATS and into interviews.</p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Build your resume free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
