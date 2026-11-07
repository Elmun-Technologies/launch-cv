import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { generateRecoveryCodes, remainingRecoveryCodes } from "@/lib/recovery-codes";

/** How many unused recovery codes the signed-in staff member has left. */
export async function GET() {
  const g = await adminApi("view");
  if (g.error) return g.error;
  return NextResponse.json({ remaining: await remainingRecoveryCodes(g.staff.sub) }, { headers: { "Cache-Control": "no-store" } });
}

/** Regenerate: replaces all of your recovery codes with 10 new ones, shown once. Re-confirm required. */
export async function POST(req: Request) {
  const g = await adminApi("view", { reauth: true });
  if (g.error) return g.error;
  if (!g.staff.totpEnabled) return NextResponse.json({ error: "Turn on two-factor sign-in first." }, { status: 400 });
  const codes = await generateRecoveryCodes(g.staff.sub);
  await recordAudit({
    actorId: g.staff.sub,
    action: "admin.2fa.recovery.generate",
    entity: "User",
    entityId: g.staff.sub,
    diff: { count: codes.length, where: "regenerate" },
    ip: getClientIp(req),
  });
  return NextResponse.json({ ok: true, codes }, { headers: { "Cache-Control": "no-store" } });
}
