import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getUserPlanId } from "@/lib/plans";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.sub },
    select: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });

  const plan = await getUserPlanId(session.sub);
  const paid = plan !== "none";

  return NextResponse.json({
    pro: paid,
    paid,
    plan,
    status: sub?.status ?? null,
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
  });
}
