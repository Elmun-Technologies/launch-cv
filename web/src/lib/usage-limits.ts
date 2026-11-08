import { PUBLIC_PLANS, planPriceLabel } from "@/lib/monetization";
import { prisma } from "@/lib/prisma";
import { getUserPlanId, limitsForPlan, type PlanId } from "@/lib/plans";
import { EMAIL_UNVERIFIED_CODE, USAGE_LIMIT_CODE, VERIFY_EMAIL_MESSAGE, usageBlock } from "@/lib/usage-rules";

export type UsageKind = "jd" | "packet" | "role_fit";

export function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Shown when a free account reaches its monthly AI allowance. */
export function freeLimitMessage(): string {
  const week = PUBLIC_PLANS.week;
  return `You've used this month's free AI checks. The ${week.title} is ${planPriceLabel("week")}, with no auto-renewal. Everything you've written stays saved.`;
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
  /** Plan lookup, usage-row read and the email check are independent — run them
   *  in parallel to keep DB round-trips down on this hot path. */
  const [plan, row, user] = await Promise.all([
    getUserPlanId(userId) as Promise<PlanId>,
    getUsageRow(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { emailVerifiedAt: true } }),
  ]);
  const limits = await limitsForPlan(plan);
  const used = kind === "jd" ? row.jdCount : kind === "packet" ? row.packetCount : row.roleFitCount;
  const max = kind === "jd" ? limits.jd : kind === "packet" ? limits.packet : limits.roleFit;
  // Staff-granted plans resolve to a plan id too, so they count as paid here.
  const paid = plan !== "none";
  const block = usageBlock({ paid, emailVerified: !!user?.emailVerifiedAt, used, max });
  if (block === "email_unverified") {
    return {
      ok: false as const,
      code: EMAIL_UNVERIFIED_CODE,
      plan,
      paid,
      used,
      max,
      kind,
      message: VERIFY_EMAIL_MESSAGE,
    };
  }
  if (block === "limit") {
    return {
      ok: false as const,
      code: USAGE_LIMIT_CODE,
      plan,
      paid,
      used,
      max,
      kind,
      message: paid
        ? "You've used this month's AI limit on your plan. It resets on the 1st, or you can move to a plan with more AI checks now."
        : freeLimitMessage(),
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
