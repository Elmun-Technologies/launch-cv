import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPro } from "@/lib/entitlements";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.sub },
    select: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });

  const row = sub
    ? { status: sub.status, currentPeriodEnd: sub.currentPeriodEnd }
    : null;

  return NextResponse.json({
    pro: subscriptionRowGrantsPro(row),
    status: sub?.status ?? null,
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
  });
}
