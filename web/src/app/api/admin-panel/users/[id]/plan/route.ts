import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";

const bodySchema = z.object({
  /** "none" removes a grant. Billing-owned subscriptions are never touched here. */
  plan: z.enum(["none", ...CHECKOUT_PLAN_ORDER]),
  /** Last day the grant applies (UTC, inclusive), "YYYY-MM-DD". Omit for no end date. */
  until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullish(),
});

/**
 * Grant a plan without a payment (comp, support goodwill, press). Stored on
 * User.grantedPlan so a Polar webhook never overwrites it; lib/plans.ts gives
 * the user the higher of the grant and anything they pay for.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { staff, error } = await adminApi("users", { reauth: true });
  if (error) return error;
  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Pick a plan and, optionally, an end date." }, { status: 400 });
  const { plan, until } = parsed.data;

  let untilDate: Date | null = null;
  if (plan !== "none" && until) {
    untilDate = new Date(`${until}T23:59:59.999Z`);
    if (Number.isNaN(untilDate.getTime()) || untilDate.getTime() <= Date.now()) {
      return NextResponse.json({ error: "The end date must be in the future." }, { status: 400 });
    }
  }

  const before = await prisma.user.findUnique({ where: { id }, select: { grantedPlan: true, grantedPlanUntil: true } });
  if (!before) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const after = await prisma.user.update({
    where: { id },
    data: plan === "none" ? { grantedPlan: null, grantedPlanUntil: null } : { grantedPlan: plan, grantedPlanUntil: untilDate },
    select: { grantedPlan: true, grantedPlanUntil: true },
  });

  await recordAudit({
    actorId: staff.sub,
    action: plan === "none" ? "user.plan.revoke" : "user.plan.grant",
    entity: "User",
    entityId: id,
    diff: {
      from: { plan: before.grantedPlan, until: before.grantedPlanUntil?.toISOString() ?? null },
      to: { plan: after.grantedPlan, until: after.grantedPlanUntil?.toISOString() ?? null },
    },
    ip: getClientIp(req),
  });

  return NextResponse.json({ grantedPlan: after.grantedPlan, grantedPlanUntil: after.grantedPlanUntil });
}
