import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      status: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      updatedAt: true,
      user: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json({ rows: subscriptions });
}
