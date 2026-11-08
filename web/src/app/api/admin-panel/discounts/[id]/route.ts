import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { discountValueLabel, isPolarId } from "@/lib/polar-discounts";
import { deletePolarDiscount, getPolarDiscount } from "@/lib/polar-discounts-server";

/** Delete a Polar discount code. Owners and admins, after re-confirming; audited. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await adminApi("limits", { reauth: true });
  if (g.error) return g.error;
  const { id } = await params;
  if (!isPolarId(id)) return NextResponse.json({ error: "Unknown discount." }, { status: 400 });

  // Read it first so the audit log names the code, not just an id.
  const before = await getPolarDiscount(id);
  if (!before.ok) return NextResponse.json({ error: before.error }, { status: before.status === 404 ? 404 : 502 });

  const r = await deletePolarDiscount(id);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.status === 404 ? 404 : 502 });

  await recordAudit({
    actorId: g.staff.sub,
    action: "discount.delete",
    entity: "Discount",
    entityId: id,
    diff: {
      deleted: {
        title: before.data.code ?? before.data.name,
        value: discountValueLabel(before.data),
        redemptions: before.data.redemptions_count ?? 0,
      },
    },
    ip: getClientIp(req),
  });

  return NextResponse.json({ ok: true });
}
