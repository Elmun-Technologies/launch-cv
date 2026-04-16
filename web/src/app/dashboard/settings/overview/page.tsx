import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { subscriptionRowGrantsPro } from "@/lib/entitlements";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  FileText, Briefcase, Users, Building2, TrendingUp,
  Calendar, Clock, CreditCard, HardDrive, ArrowRight,
  UserCircle, Gift,
} from "lucide-react";

export default async function OverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [resumeCount, appCount, contactCount, companyCount, user] =
    await Promise.all([
      prisma.resume.count({ where: { userId: session.sub } }),
      prisma.jobApplication.count({ where: { userId: session.sub } }),
      prisma.contact.count({ where: { userId: session.sub } }),
      prisma.company.count({ where: { userId: session.sub } }),
      prisma.user.findUnique({
        where: { id: session.sub },
        select: {
          createdAt: true,
          subscription: { select: { status: true, currentPeriodEnd: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Resumes", value: resumeCount, icon: FileText, color: "violet", trend: "+2 this week" },
    { label: "Applications", value: appCount, icon: Briefcase, color: "blue", trend: "+5 this week" },
    { label: "Contacts", value: contactCount, icon: Users, color: "emerald", trend: "+3 this month" },
    { label: "Companies", value: companyCount, icon: Building2, color: "amber", trend: "+1 this month" },
  ] as const;

  const iconColors: Record<string, string> = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const trendColors: Record<string, string> = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const planStatus = subscriptionRowGrantsPro(
    user?.subscription
      ? {
          status: user.subscription.status,
          currentPeriodEnd: user.subscription.currentPeriodEnd,
        }
      : null,
  )
    ? "Pro"
    : "Free";
  const storageUsed = 1.2;
  const storageTotal = 5;
  const storagePercent = Math.round((storageUsed / storageTotal) * 100);

  const quickLinks = [
    { label: "Edit Profile", href: "/dashboard/settings", icon: UserCircle },
    { label: "Manage Subscription", href: "/dashboard/settings/subscription", icon: CreditCard },
    { label: "View Referrals", href: "/dashboard/referrals", icon: Gift },
  ];

  return (
    <DashboardShell email={session.email} pageTitle="Overview">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-gray-900">Account Overview</h1>
          <p className="mt-1 text-[15px] text-gray-500">Your account at a glance</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColors[s.color]}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${trendColors[s.color]}`}>
                  <TrendingUp className="h-3 w-3" />
                  {s.trend}
                </span>
              </div>
              <p className="mt-4 text-[32px] font-bold leading-none text-gray-900">
                {s.value}
              </p>
              <p className="mt-1 text-[13px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Account Activity */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[15px] font-bold text-gray-900">Account Activity</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Account Created</p>
                  <p className="text-[13px] font-medium text-gray-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Last Login</p>
                  <p className="text-[13px] font-medium text-gray-900">Just now</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400">Plan Status</p>
                  <p className="text-[13px] font-medium text-gray-900">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                        planStatus === "Pro"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {planStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h2 className="text-[15px] font-bold text-gray-900">Storage</h2>
            <div className="mt-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <HardDrive className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[32px] font-bold leading-none text-gray-900">
                    {storageUsed} <span className="text-[15px] font-medium text-gray-400">GB</span>
                  </p>
                  <p className="mt-1 text-[13px] text-gray-500">
                    of {storageTotal} GB used
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-violet-600">
                  {storagePercent}%
                </span>
              </div>
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#7C5CFC] transition-all"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className="mt-2 text-[12px] text-gray-400">
                {(storageTotal - storageUsed).toFixed(1)} GB remaining
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-[15px] font-bold text-gray-900">Quick Links</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <link.icon className="h-5 w-5" />
                </div>
                <span className="text-[13px] font-semibold text-gray-700 group-hover:text-violet-600">
                  {link.label}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-gray-300 transition group-hover:text-violet-500" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
