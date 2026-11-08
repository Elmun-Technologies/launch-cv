import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { buildDiscountBody, discountValueLabel } from "@/lib/polar-discounts";
import { createPolarDiscount, listPolarDiscounts, soldPlanProductIds } from "@/lib/polar-discounts-server";

const bodySchema = z.object({
  code: z.string().max(64),
  kind: z.enum(["percentage", "fixed"]),
  percent: z.number().nullish(),
  amountUsd: z.number().nullish(),
  duration: z.enum(["once", "forever"]),
  maxRedemptions: z.number().nullish(),
  endsOn: z.string().max(10).nullish(),
  plans: z.array(z.enum(CHECKOUT_PLAN_ORDER as unknown as [string, ...string[]])).max(CHECKOUT_PLAN_ORDER.length),
});

/** Every Polar discount code. Owners and admins. */
export async function GET() {
  const g = await adminApi("limits");
  if (g.error) return g.error;
  const r = await listPolarDiscounts();
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status >= 500 ? 502 : r.status });
  return NextResponse.json({ rows: r.data });
}

/** Create a Polar discount code. Owners and admins, after re-confirming; audited. */
export async function POST(req: Request) {
  const g = await adminApi("limits", { reauth: true });
  if (g.error) return g.error;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Fill in the code, the discount and at least one plan." }, { status: 400 });

  const built = buildDiscountBody(parsed.data, await soldPlanProductIds());
  if (!built.ok) return NextResponse.json({ error: built.error }, { status: 400 });

  const r = await createPolarDiscount(built.body);
  // Polar's own message (e.g. a code that already exists) goes back to the form.
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status === 501 ? 501 : 502 });

  await recordAudit({
    actorId: g.staff.sub,
    action: "discount.create",
    entity: "Discount",
    entityId: r.data.id,
    diff: {
      created: {
        title: built.body.code,
        value: discountValueLabel(built.body),
        duration: built.body.duration,
        maxRedemptions: built.body.max_redemptions ?? null,
        endsAt: built.body.ends_at ?? null,
        plans: parsed.data.plans,
      },
    },
    ip: getClientIp(req),
  });

  return NextResponse.json({ ok: true, discount: r.data });
}
