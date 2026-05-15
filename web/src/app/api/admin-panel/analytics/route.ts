import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { name: true, createdAt: true },
  });

  const eventCounts: Record<string, number> = {};
  const dailySignups: Record<string, number> = {};
  const dailyAiUsage: Record<string, number> = {};

  for (const e of events) {
    eventCounts[e.name] = (eventCounts[e.name] ?? 0) + 1;

    const day = e.createdAt.toISOString().slice(0, 10);

    if (e.name === "signup") {
      dailySignups[day] = (dailySignups[day] ?? 0) + 1;
    }

    if (e.name === "ai_usage" || e.name === "ai_generate") {
      dailyAiUsage[day] = (dailyAiUsage[day] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    eventCounts,
    dailySignups: Object.entries(dailySignups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    dailyAiUsage: Object.entries(dailyAiUsage)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  });
}
