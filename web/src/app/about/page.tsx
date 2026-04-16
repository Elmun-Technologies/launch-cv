import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Heart, Shield, Lightbulb, Users, Sparkles, Code2, Database, Brain } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "About Us",
  description:
    "Launch CV is built for job seekers, by job seekers. Learn about our mission to make professional resume building accessible to everyone.",
  pathname: "/about",
  keywords: ["Launch CV", "about", "mission", "resume AI"],
});

const values = [
  {
    icon: Heart,
    title: "Job Seekers First",
    description: "Every feature we build starts with one question: will this help someone land a job? If not, we don't build it.",
  },
  {
    icon: Shield,
    title: "Honesty in AI",
    description: "Our AI never fabricates achievements or metrics. It works with your real experience to present it in the best light.",
  },
  {
    icon: Lightbulb,
    title: "Accessible by Design",
    description: "Professional resume tools shouldn't cost a fortune. Our free tier is genuinely useful — not a teaser for upsells.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We listen to our users obsessively. Feature requests, bug reports, and feedback directly shape our roadmap.",
  },
];

const techStack = [
  {
    icon: Code2,
    name: "Next.js",
    description: "Full-stack React framework for fast, SEO-friendly pages and serverless API routes.",
  },
  {
    icon: Brain,
    name: "AI / LLM",
    description: "Advanced language models for resume analysis, content generation, and JD alignment.",
  },
  {
    icon: Database,
    name: "Prisma + PostgreSQL",
    description: "Type-safe database layer with Prisma ORM for reliable, scalable data management.",
  },
];

const team = [
  {
    name: "Nazir Elmurodov",
    role: "Co-Founder & CEO",
    bio: "Former hiring manager who saw thousands of qualified candidates get filtered out by ATS. Building Launch CV to fix that.",
    avatar: "NE",
  },
  {
    name: "Alex Turner",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer with a passion for AI. Previously built NLP tools at a Fortune 500 company.",
    avatar: "AT",
  },
  {
    name: "Maria Santos",
    role: "Co-Founder & Head of Product",
    bio: "Product leader who spent 5 years in HR tech. Understands both sides of the hiring equation.",
    avatar: "MS",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Our Story
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Built for job seekers,{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                by job seekers
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              We&apos;ve been on both sides of the hiring table. We know the frustration of crafting the perfect resume only to get filtered out by an algorithm. That&apos;s why we built Launch CV.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Our Mission</h2>
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-base leading-relaxed text-gray-600">
                The hiring process is broken. Qualified candidates get rejected by ATS software before a human ever reads their resume. Job seekers spend hours tailoring applications with no feedback on what&apos;s working.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Launch CV exists to level the playing field. We combine AI-powered analysis with industry expertise to help every job seeker — regardless of their writing ability or budget — present their experience in the most compelling way possible. Our goal is simple: help you get past the algorithms and in front of the humans who make hiring decisions.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Our Tech Stack</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Built with modern, scalable technology to deliver the fastest and most reliable experience.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {techStack.map((tech) => (
                <div key={tech.name} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                    <tech.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{tech.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Meet the Team</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              A small, focused team obsessed with helping people land their dream jobs.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#7C3AED] text-lg font-bold text-white">
                    {member.avatar}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-medium text-[#7C5CFC]">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Our Values</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F3FF] text-[#7C5CFC]">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{value.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Join us on our mission</h2>
            <p className="text-base text-white/80">Help us make professional resume building accessible to everyone.</p>
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
