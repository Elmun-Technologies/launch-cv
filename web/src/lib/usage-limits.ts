import { prisma } from "@/lib/prisma";
import { userHasProSubscription } from "@/lib/entitlements";

export const FREE_MONTHLY = { jd: 5, packet: 2, roleFit: 5 } as const;
export const PRO_MONTHLY = { jd: 200, packet: 100, roleFit: 200 } as const;

export type UsageKind = "jd" | "packet" | "role_fit";

function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function getUsageRow(userId: string) {
  const month = monthKey();
  const existing = await prisma.usageMonth.findUnique({
    where: { userId_month: { userId, month } },
  });
  if (existing) return existing;
  return prisma.usageMonth.create({
    data: { userId, month, jdCount: 0, packetCount: 0, roleFitCount: 0 },
  });
}

export async function assertAiUsageAllowed(userId: string, kind: UsageKind) {
  const pro = await userHasProSubscription(userId);
  const limits = pro ? PRO_MONTHLY : FREE_MONTHLY;
  const row = await getUsageRow(userId);
  const used = kind === "jd" ? row.jdCount : kind === "packet" ? row.packetCount : row.roleFitCount;
  const max = kind === "jd" ? limits.jd : kind === "packet" ? limits.packet : limits.roleFit;
  if (used >= max) {
    return {
      ok: false as const,
      pro,
      used,
      max,
      kind,
      message: pro
        ? "Monthly AI limit reached. Resets at the start of next month, or contact support."
        : "Free plan limit reached. Upgrade to Pro in Account → Subscription.",
    };
  }
  return { ok: true as const, pro, used, max, kind };
}

export async function incrementAiUsage(userId: string, kind: UsageKind) {
  const row = await getUsageRow(userId);
  const data =
    kind === "jd"
      ? { jdCount: { increment: 1 } }
      : kind === "packet"
        ? { packetCount: { increment: 1 } }
        : { roleFitCount: { increment: 1 } };
  await prisma.usageMonth.update({
    where: { id: row.id },
    data,
  });
}
