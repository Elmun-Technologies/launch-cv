import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { userHasProSubscription } from "@/lib/entitlements";
import { FREE_MONTHLY, PRO_MONTHLY, getUsageRow } from "@/lib/usage-limits";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pro = await userHasProSubscription(session.sub);
  const row = await getUsageRow(session.sub);
  const limits = pro ? PRO_MONTHLY : FREE_MONTHLY;

  return NextResponse.json({
    pro,
    month: row.month,
    limits,
    used: { jd: row.jdCount, packet: row.packetCount, roleFit: row.roleFitCount },
  });
}
