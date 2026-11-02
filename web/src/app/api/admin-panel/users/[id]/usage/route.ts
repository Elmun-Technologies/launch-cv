import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { monthKey } from "@/lib/usage-limits";

/** Reset this month's AI counters (UsageMonth) for one user. The old counts go to the audit log. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { staff, error } = await adminApi("users", { reauth: true });
  if (error) return error;
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const month = monthKey();
  const row = await prisma.usageMonth.findUnique({ where: { userId_month: { userId: id, month } } });
  if (!row || row.jdCount + row.packetCount + row.roleFitCount === 0) {
    return NextResponse.json({ reset: false, month });
  }
  await prisma.usageMonth.update({ where: { id: row.id }, data: { jdCount: 0, packetCount: 0, roleFitCount: 0 } });
  await recordAudit({
    actorId: staff.sub,
    action: "user.usage.reset",
    entity: "User",
    entityId: id,
    diff: { month, from: { jd: row.jdCount, roleFit: row.roleFitCount, packet: row.packetCount }, to: { jd: 0, roleFit: 0, packet: 0 } },
    ip: getClientIp(req),
  });
  return NextResponse.json({ reset: true, month });
}
