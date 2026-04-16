import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Briefcase, AlertTriangle, Sparkles, Target, FileText, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Builder for Product Managers | Launch CV",
  description: "Create resumes tailored for product management roles. Showcase impact, leadership, and cross-functional collaboration to land PM interviews.",
};

const painPoints = [
  {
    icon: AlertTriangle,
    problem: "Difficulty quantifying product impact",
    solution: "Our AI helps you frame product outcomes as measurable business metrics — revenue, adoption, retention, and NPS.",
  },
  {
    icon: AlertTriangle,
    problem: "Balancing technical and business language",
    solution: "Smart bullet rewrites position you as the bridge between engineering and business — exactly what companies want.",
  },
  {
    icon: AlertTriangle,
    problem: "Generic resumes that don't show PM thinking",
    solution: "PM-specific templates with sections for product strategy, cross-functional leadership, and stakeholder management.",
  },
  {
    icon: AlertTriangle,
    problem: "Every PM job description is slightly different",
    solution: "JD Alignment tailors your resume to each specific role — whether it's growth PM, platform PM, or 0-to-1.",
  },
];

const keywords = [
  "Product Strategy", "Roadmap Planning", "User Research", "A/B Testing",
  "OKRs / KPIs", "Stakeholder Management", "Agile / Scrum", "Sprint Planning",
  "Go-to-Market", "Customer Discovery", "PRD / Spec Writing", "Data Analysis",
  "SQL", "Cross-functional Leadership", "Revenue Growth", "Retention",
  "Feature Prioritization", "Competitive Analysis", "User Personas", "Jira / Confluence",
];

export default function ProductManagersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Briefcase className="h-3.5 w-3.5" />
              For Product Managers
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Land your next{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                product role
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              Product management is one of the most competitive fields to break into. Launch CV helps you craft a resume that showcases your strategic thinking, leadership, and measurable impact — exactly what hiring managers look for.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#6B4CE0]">
                Build your PM resume <ArrowRight className="h-4 w-4" />
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
              PM resumes require a unique blend of strategic, technical, and leadership language.
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
            <h2 className="text-center text-2xl font-bold text-gray-900">How Launch CV Helps PMs</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">JD Alignment</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Whether it&apos;s a growth PM role at a startup or a platform PM at FAANG, align your resume to the exact requirements.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">PM Templates</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Purpose-built sections for product strategy, metrics ownership, cross-functional leadership, and launch outcomes.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Impact Framing</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  AI helps you quantify product impact in terms hiring managers care about: revenue, retention, adoption, and efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Top PM Keywords</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Launch CV ensures these keywords appear naturally throughout your resume where they match your experience.
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
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to land your next PM role?</h2>
            <p className="text-base text-white/80">Join product leaders who use Launch CV to showcase their impact and get more interviews.</p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Build your PM resume <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
