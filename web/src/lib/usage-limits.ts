import { prisma } from "@/lib/prisma";
import { getUserPlanId, limitsForPlan, type PlanId } from "@/lib/plans";

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
  const plan: PlanId = await getUserPlanId(userId);
  const limits = limitsForPlan(plan);
  const row = await getUsageRow(userId);
  const used = kind === "jd" ? row.jdCount : kind === "packet" ? row.packetCount : row.roleFitCount;
  const max = kind === "jd" ? limits.jd : kind === "packet" ? limits.packet : limits.roleFit;
  const paid = plan !== "none";
  if (used >= max) {
    return {
      ok: false as const,
      plan,
      paid,
      used,
      max,
      kind,
      message: paid
        ? "Monthly AI limit reached for your plan. Resets next month, or upgrade in Subscription."
        : "Activate a plan to use AI features. Launch CV is paid-only — choose Starter, Professional, Elite, or Lifetime on the Pricing page.",
    };
  }
  return { ok: true as const, plan, paid, used, max, kind };
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
