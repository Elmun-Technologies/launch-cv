import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getUserPlanId } from "@/lib/plans";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { checkoutConflict, isOneTimeRow } from "@/lib/entitlement-rules";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.sub },
    select: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, stripeSubscriptionId: true },
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
    /** One-time purchase (a pass or legacy Lifetime): it never renews. */
    oneTime: !!sub && isOneTimeRow(sub),
    /** Per sold plan: why checkout would be refused right now (same rule as /api/polar/checkout), or null. */
    checkoutBlocked: Object.fromEntries(CHECKOUT_PLAN_ORDER.map((p) => [p, checkoutConflict(sub, p)])),
  });
}
