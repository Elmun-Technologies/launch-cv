import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Features | Launch CV",
  description: "Explore all AI-powered features that help you land your dream job — from JD alignment and resume building to interview prep and ATS optimization.",
};

const features = [
  {
    icon: Target,
    title: "JD Alignment",
    description: "Match your resume to any job description with AI-powered gap analysis, keyword matching, and bullet rewrites.",
    href: "/features/jd-alignment",
    color: "from-blue-50 to-blue-100",
  },
  {
    icon: FileText,
    title: "AI Resume Builder",
    description: "Create professional, ATS-friendly resumes in minutes with 12+ industry-specific templates and real-time preview.",
    href: "/features/resume-builder",
    color: "from-purple-50 to-purple-100",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate tailored cover letters from your resume and job description — personalized, professional, and ready to send.",
    href: "/features/cover-letter",
    color: "from-emerald-50 to-emerald-100",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    description: "Practice with AI-generated questions based on the role, your resume, and the job description.",
    href: "/features/interview-prep",
    color: "from-amber-50 to-amber-100",
  },
  {
    icon: BarChart3,
    title: "ATS Score Checker",
    description: "See exactly how your resume scores against applicant tracking systems and get actionable improvement tips.",
    href: "/features/ats-score",
    color: "from-rose-50 to-rose-100",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Speak your experience naturally — our AI turns your words into polished, professional resume bullet points.",
    href: "/features/voice-input",
    color: "from-cyan-50 to-cyan-100",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              6 AI-Powered Tools
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                land the job
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              From resume creation to interview preparation, Launch CV gives you a complete toolkit to stand out in today&apos;s competitive job market.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition hover:border-[#7C5CFC]/20 hover:shadow-lg"
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-[#7C5CFC] transition group-hover:shadow-md`}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{f.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C5CFC] transition group-hover:gap-2.5">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to supercharge your job search?</h2>
            <p className="text-base text-white/80">Join thousands of professionals who trust Launch CV to build winning resumes.</p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
