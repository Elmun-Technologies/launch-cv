import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import {
  ArrowRight,
  TrendingUp,
  Users,
  Globe,
  DollarSign,
  Target,
  Layers,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  MinusCircle,
  BarChart3,
  Brain,
  Database,
  Code2,
  Mail,
} from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Investor Relations",
  description:
    "Launch CV is building the AI-powered career platform for the next generation of job seekers. Learn about our vision, traction, and investment opportunity.",
  pathname: "/investors",
  keywords: ["Launch CV", "investors", "career tech"],
  robots: { index: false, follow: true },
});

const metrics = [
  { label: "Total Users", value: "10K+", icon: Users },
  { label: "Resumes Created", value: "25K+", icon: Layers },
  { label: "JD Analyses Run", value: "50K+", icon: Target },
  { label: "MoM Growth", value: "35%", icon: TrendingUp },
];

const marketData = [
  { label: "TAM", value: "$400B", description: "Global recruitment & career services market" },
  { label: "SAM", value: "$12B", description: "Online resume builders, career tools, and ATS optimization" },
  { label: "SOM", value: "$240M", description: "AI-powered resume platforms targeting active job seekers" },
];

const competitors = [
  {
    name: "Launch CV",
    jdAlignment: true,
    atsScore: true,
    aiResume: true,
    coverLetter: true,
    interviewPrep: true,
    voiceInput: true,
    /** Product-led: AI and premium workflows require an active plan (monthly, annual, or lifetime). */
    paidFirstAi: true,
    price: "$9/mo – $149 LT",
  },
  {
    name: "Teal",
    jdAlignment: true,
    atsScore: false,
    aiResume: true,
    coverLetter: false,
    interviewPrep: false,
    voiceInput: false,
    paidFirstAi: "partial",
    price: "$29/mo",
  },
  {
    name: "Rezi",
    jdAlignment: false,
    atsScore: true,
    aiResume: true,
    coverLetter: true,
    interviewPrep: false,
    voiceInput: false,
    paidFirstAi: "partial",
    price: "$29/mo",
  },
  {
    name: "Jobscan",
    jdAlignment: true,
    atsScore: true,
    aiResume: false,
    coverLetter: false,
    interviewPrep: false,
    voiceInput: false,
    paidFirstAi: "partial",
    price: "$50/mo",
  },
];

const featureLabels = [
  { key: "jdAlignment" as const, label: "JD Alignment" },
  { key: "atsScore" as const, label: "ATS Score" },
  { key: "aiResume" as const, label: "AI Resume Builder" },
  { key: "coverLetter" as const, label: "Cover Letter" },
  { key: "interviewPrep" as const, label: "Interview Prep" },
  { key: "voiceInput" as const, label: "Voice Input" },
  { key: "paidFirstAi" as const, label: "Paid-first AI (no free AI tier)" },
];

const techHighlights = [
  { icon: Code2, name: "Next.js + React", description: "Server-rendered full-stack web application with optimal SEO and performance" },
  { icon: Brain, name: "LLM / AI Pipeline", description: "Custom-tuned prompts for resume analysis, JD alignment, and content generation" },
  { icon: Database, name: "Prisma + PostgreSQL", description: "Type-safe, scalable database with efficient relational data modeling" },
  { icon: Shield, name: "Enterprise Security", description: "SOC 2 aligned practices, encrypted data at rest and in transit" },
];

const useOfFunds = [
  { category: "Engineering & AI", percentage: 45 },
  { category: "Growth & Marketing", percentage: 25 },
  { category: "Operations", percentage: 15 },
  { category: "Hiring (Sales & CS)", percentage: 15 },
];

const team = [
  {
    name: "Nazir Elmurodov",
    role: "Co-Founder & CEO",
    background: "Former hiring manager. 8+ years in talent acquisition and HR tech. Saw the ATS problem firsthand across hundreds of hiring decisions.",
    avatar: "NE",
  },
  {
    name: "Alex Turner",
    role: "Co-Founder & CTO",
    background: "Full-stack engineer. Previously built NLP tools at a Fortune 500. Deep expertise in AI/ML, distributed systems, and product engineering.",
    avatar: "AT",
  },
  {
    name: "Maria Santos",
    role: "Co-Founder & Head of Product",
    background: "5 years in HR tech product management. Led product at a Series B career platform. Understands both job seekers and employers.",
    avatar: "MS",
  },
];

function StatusIcon({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
  if (value === "partial") return <MinusCircle className="h-5 w-5 text-amber-500" />;
  return <XCircle className="h-5 w-5 text-gray-300" />;
}

export default function InvestorsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <TrendingUp className="h-3.5 w-3.5" />
              Investor Relations
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Launch CV:{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                AI-Powered Career Platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              We&apos;re building the operating system for job seekers — combining AI resume building, JD alignment, interview prep, and career tracking into one intelligent platform.
            </p>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">The Problem</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
              A $400B recruitment market with massive inefficiency on the candidate side.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-[36px] font-bold text-[#7C5CFC]">75%</p>
                <p className="mt-2 text-sm font-bold text-gray-900">Rejected by ATS</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Three out of four resumes are filtered out by applicant tracking systems before a human ever sees them.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-[36px] font-bold text-[#7C5CFC]">4.5h</p>
                <p className="mt-2 text-sm font-bold text-gray-900">Per Application</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Job seekers spend an average of 4.5 hours tailoring each application — resume, cover letter, and research.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="text-[36px] font-bold text-[#7C5CFC]">$0</p>
                <p className="mt-2 text-sm font-bold text-gray-900">Feedback Received</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  Most candidates get zero feedback on why they were rejected, leaving them guessing what to improve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Our Solution</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
              An all-in-one AI platform that turns hours of manual work into minutes.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Target, title: "JD Alignment", body: "AI gap analysis and keyword matching against any job description" },
                { icon: Layers, title: "AI Resume Builder", body: "12+ industry templates with AI-powered bullet suggestions" },
                { icon: Mail, title: "Cover Letter Generator", body: "Personalized cover letters from resume + JD in seconds" },
                { icon: BarChart3, title: "ATS Score Checker", body: "Detailed ATS compatibility analysis with prioritized fixes" },
                { icon: Zap, title: "Interview Prep", body: "Role-specific behavioral and technical practice questions" },
                { icon: Globe, title: "Job Tracker", body: "Track applications, contacts, and companies in one place" },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C5CFC]">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traction */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Traction</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Early metrics showing strong product-market fit.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF] text-[#7C5CFC]">
                    <m.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-[32px] font-bold text-gray-900">{m.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Business Model</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-500">
              Paid-first consumer SaaS: AI and high-intent workflows unlock after checkout. Three recurring tiers plus Lifetime for
              long-term retention without renewals.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#7C5CFC] bg-white p-7 shadow-lg shadow-blue-500/10">
                <p className="text-sm font-bold text-[#7C5CFC] uppercase tracking-wider">Subscriptions</p>
                <p className="mt-3 text-[40px] font-bold text-gray-900">
                  $9<span className="text-lg font-normal text-gray-400">/mo</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-700">Starter · monthly</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  <span className="font-medium text-gray-800">Professional $29/yr</span> and{" "}
                  <span className="font-medium text-gray-800">Elite $79/yr</span> — annual plans anchor LTV for active job
                  searches. Lemon Squeezy handles checkout, tax, and receipts.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Lifetime</p>
                <p className="mt-3 text-[40px] font-bold text-gray-900">
                  $149<span className="text-lg font-normal text-gray-400"> once</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-700">One payment · ongoing access</p>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  Captures users who view a resume as a rare, high-stakes purchase. Paired with fair-use monthly AI caps to keep
                  unit economics predictable.
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-sm text-gray-500">
              We optimize for paid activation and ARPA, not free-to-paid funnel dilution. Expansion: optional human reviews,
              coaching marketplace, and selective B2B in 2027+.
            </p>
          </div>
        </section>

        {/* Market */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Market Opportunity</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {marketData.map((m) => (
                <div key={m.label} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <p className="text-xs font-bold text-[#7C5CFC] uppercase tracking-wider">{m.label}</p>
                  <p className="mt-2 text-[36px] font-bold text-gray-900">{m.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competition */}
        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Competitive Landscape</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Launch CV combines JD-to-resume alignment, ATS scoring, packets, and prep in one stack — with a deliberate
              paid-first AI posture vs. typical freemium resume tools.
            </p>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                    {competitors.map((c) => (
                      <th key={c.name} className={`px-4 py-4 text-center font-bold ${c.name === "Launch CV" ? "text-[#7C5CFC]" : "text-gray-900"}`}>
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureLabels.map((fl) => (
                    <tr key={fl.key} className="border-b border-gray-50">
                      <td className="px-6 py-3 text-gray-700">{fl.label}</td>
                      {competitors.map((c) => (
                        <td key={c.name} className="px-4 py-3 text-center">
                          <span className="inline-flex justify-center">
                            <StatusIcon value={c[fl.key]} />
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-gray-50/50">
                    <td className="px-6 py-3 font-bold text-gray-700">Price</td>
                    {competitors.map((c) => (
                      <td key={c.name} className={`px-4 py-3 text-center font-bold ${c.name === "Launch CV" ? "text-[#7C5CFC]" : "text-gray-700"}`}>
                        {c.price}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tech */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Technology</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Modern, scalable architecture built for speed and reliability.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {techHighlights.map((t) => (
                <div key={t.name} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C5CFC]">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-gray-900">{t.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Leadership Team</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#7C3AED] text-lg font-bold text-white">
                    {member.avatar}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-medium text-[#7C5CFC]">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{member.background}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Ask */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">The Ask</h2>
            <div className="mt-10 rounded-2xl border-2 border-[#7C5CFC] bg-white p-8 shadow-lg shadow-blue-500/10">
              <div className="text-center">
                <p className="text-sm font-bold text-[#7C5CFC] uppercase tracking-wider">Pre-Seed Round</p>
                <p className="mt-3 text-[48px] font-bold text-gray-900">$500K</p>
                <p className="mt-2 text-sm text-gray-500">To accelerate growth, expand the AI pipeline, and reach 100K users.</p>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Use of Funds</h3>
                <div className="mt-4 space-y-3">
                  {useOfFunds.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{item.category}</span>
                        <span className="font-bold text-gray-900">{item.percentage}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED]"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Let&apos;s build the future of job seeking together</h2>
            <p className="text-base text-white/80">We&apos;d love to walk you through our product, metrics, and vision.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:investors@launch-cv.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
              >
                <DollarSign className="h-4 w-4" />
                Contact Us — investors@launch-cv.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
