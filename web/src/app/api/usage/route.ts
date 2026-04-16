import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserPlanId, limitsForPlan } from "@/lib/plans";
import { getUsageRow } from "@/lib/usage-limits";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlanId(session.sub);
  const paid = plan !== "none";
  const pro = paid; // legacy field for clients
  const row = await getUsageRow(session.sub);
  const limits = limitsForPlan(plan);

  return NextResponse.json({
    pro,
    paid,
    plan,
    month: row.month,
    limits,
    used: { jd: row.jdCount, packet: row.packetCount, roleFit: row.roleFitCount },
  });
}
