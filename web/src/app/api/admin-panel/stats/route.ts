import { payingSubscriptionWhere } from "@/lib/admin-billing";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    users,
    resumes,
    applications,
    contacts,
    companies,
    activeSubscriptions,
    analyticsEvents,
    aiUsage,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.jobApplication.count(),
    prisma.contact.count(),
    prisma.company.count(),
    // Same access rule as the app: excludes ended passes (lib/admin-billing.ts).
    prisma.subscription.count({ where: payingSubscriptionWhere() }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.usageMonth.count({ where: { month: { gte: thirtyDaysAgo.toISOString().slice(0, 7) } } }),
  ]);

  return NextResponse.json({
    users,
    resumes,
    applications,
    contacts,
    companies,
    activeSubscriptions,
    analyticsEvents,
    aiUsage,
  });
}
