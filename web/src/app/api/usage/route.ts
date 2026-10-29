import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserPlanId, limitsForPlan } from "@/lib/plans";
import { getUsageRow } from "@/lib/usage-limits";
import { prisma } from "@/lib/prisma";
import { isAdminUser } from "@/lib/admin-guard";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlanId(session.sub);
  const paid = plan !== "none";
  const pro = paid; // legacy field for clients
  const row = await getUsageRow(session.sub);
  const limits = limitsForPlan(plan);
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, email: true, emailVerifiedAt: true },
  });

  return NextResponse.json({
    pro,
    paid,
    plan,
    month: row.month,
    limits,
    used: { jd: row.jdCount, packet: row.packetCount, roleFit: row.roleFitCount },
    // Lets the app shell show a link to the admin panel; access is still checked there.
    isAdmin: user ? isAdminUser(user) : false,
  });
}
