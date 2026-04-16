import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getUserPlanId } from "@/lib/plans";
import { DashboardShell } from "@/components/dashboard-shell";
import { OnboardingChecklist, type OnboardingStepId } from "@/components/onboarding-checklist";
import {
  FileText, Briefcase, Users, Building2,
  ArrowRight, Plus, Download, TrendingUp,
  MoreHorizontal, Sparkles,
} from "lucide-react";

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, plan, resumeCount, appCount, contactCount, companyCount, recentResumes, recentApps] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.sub }, select: { name: true } }),
    getUserPlanId(session.sub),
    prisma.resume.count({ where: { userId: session.sub } }),
    prisma.jobApplication.count({ where: { userId: session.sub } }),
    prisma.contact.count({ where: { userId: session.sub } }),
    prisma.company.count({ where: { userId: session.sub } }),
    prisma.resume.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, vertical: true, updatedAt: true },
    }) as Promise<{ id: string; title: string; vertical: string | null; updatedAt: Date }[]>,
    prisma.jobApplication.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, company: true, status: true, createdAt: true },
    }) as Promise<{ id: string; title: string | null; company: string | null; status: string; createdAt: Date }[]>,
  ]);

  const firstName = user?.name?.split(" ")[0] || "there";

  // Determine completed onboarding steps from server data
  const completedOnboardingSteps: OnboardingStepId[] = [];
  if (plan !== "none") completedOnboardingSteps.push("activate_plan");
  if (resumeCount > 0) completedOnboardingSteps.push("create_resume");
  // "analyze_jd" — we approximate: if user has any resume, they likely tried it (or we leave it until they come back)
  if (appCount > 0) completedOnboardingSteps.push("track_application");
  if (contactCount > 0) completedOnboardingSteps.push("add_contact");

  // Only show onboarding when user still has things to complete (not all 5 done)
  const showOnboarding = completedOnboardingSteps.length < 5;

  return (
    <DashboardShell email={session.email} pageTitle="Dashboard">
      <div className="space-y-8">
        {/* ── Onboarding checklist ── */}
        {showOnboarding && (
          <OnboardingChecklist completedSteps={completedOnboardingSteps} />
        )}

        {plan === "none" ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">Activate a plan to unlock AI</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-gray-600">
                  Launch CV is paid-only for AI features. Choose Starter, Professional, Elite, or Lifetime in subscription
                  settings.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/settings/subscription"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#6B4CE0]"
            >
              Choose plan
            </Link>
          </div>
        ) : null}

        {/* ── Greeting ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
              Hello, {firstName} <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite]">👋</span>
            </h1>
            <p className="mt-1 text-[15px] text-gray-500">Welcome to Launch CV. Manage your career data easily with us.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-600">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
            <Link href="/resume/new" className="inline-flex items-center gap-2 rounded-lg bg-[#7C5CFC] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#6B4CE0]">
              <Download className="h-4 w-4" /> New Resume
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Resumes", value: resumeCount, icon: FileText, color: "bg-violet-50 text-violet-600", trend: "+12%" },
            { label: "Applications", value: appCount, icon: Briefcase, color: "bg-amber-50 text-amber-600", trend: "+8%" },
            { label: "Contacts", value: contactCount, icon: Users, color: "bg-emerald-50 text-emerald-600", trend: "+5%" },
            { label: "Companies", value: companyCount, icon: Building2, color: "bg-blue-50 text-blue-600", trend: "+3%" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-gray-500">{s.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                  <s.icon className="h-[18px] w-[18px]" />
                </div>
              </div>
              <p className="mt-3 text-[32px] font-bold leading-none tracking-tight text-gray-900">{s.value.toLocaleString()}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />{s.trend}
                </span>
                <span className="text-[11px] text-gray-400">Last Update: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Content Grid ── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          {/* Recent Resumes */}
          <div className="rounded-2xl border border-gray-100 bg-white">
            <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
              <h2 className="text-[15px] font-bold text-gray-900">Recent Resumes</h2>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/resumes" className="text-[13px] font-medium text-[#7C5CFC] transition hover:text-[#6B4CE0]">
                  View All
                </Link>
                <button type="button" className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {recentResumes.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <FileText className="h-7 w-7 text-gray-300" />
                </div>
                <p className="mt-4 text-[14px] font-medium text-gray-500">No resumes yet</p>
                <p className="mt-1 text-[13px] text-gray-400">Create your first resume to get started.</p>
                <Link href="/resume/new" className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">
                  <Plus className="h-3.5 w-3.5" /> Create Resume
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentResumes.map((r) => (
                  <Link key={r.id} href={`/resume/${r.id}/edit`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-gray-50/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                      <FileText className="h-[18px] w-[18px] text-violet-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-gray-900">{r.title}</p>
                      <p className="text-[12px] text-gray-400">{r.vertical} &middot; Updated {r.updatedAt.toLocaleDateString()}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="rounded-2xl border border-gray-100 bg-white">
            <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
              <h2 className="text-[15px] font-bold text-gray-900">Recent Applications</h2>
              <Link href="/dashboard/job-tracker" className="text-[13px] font-medium text-[#7C5CFC] transition hover:text-[#6B4CE0]">
                View All
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <Briefcase className="h-7 w-7 text-gray-300" />
                </div>
                <p className="mt-4 text-[14px] font-medium text-gray-500">No applications yet</p>
                <p className="mt-1 text-[13px] text-gray-400">Start tracking your job applications.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentApps.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <Briefcase className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-gray-900">{a.title || "Untitled"}</p>
                      <p className="text-[12px] text-gray-400">{a.company || "Company"}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      a.status === "accepted" ? "bg-emerald-50 text-emerald-600" :
                      a.status === "interviewing" ? "bg-blue-50 text-blue-600" :
                      a.status === "applying" ? "bg-amber-50 text-amber-600" :
                      "bg-gray-50 text-gray-500"
                    }`}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/resume/new", icon: Plus, label: "Create New Resume", desc: "Start from scratch or import", color: "bg-violet-50 text-violet-600" },
            { href: "/dashboard/job-tracker", icon: Briefcase, label: "Track Applications", desc: "Manage your job pipeline", color: "bg-amber-50 text-amber-600" },
            { href: "/dashboard/contacts", icon: Users, label: "Manage Contacts", desc: "Build your network", color: "bg-emerald-50 text-emerald-600" },
          ].map((a) => (
            <Link key={a.href} href={a.href} className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-gray-200 hover:shadow-sm">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-gray-900">{a.label}</p>
                <p className="text-[12px] text-gray-400">{a.desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-300 transition group-hover:text-gray-500" />
            </Link>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
