import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { redactString } from "@/lib/redact";
import { sendWelcomeTest } from "@/lib/welcome-offer";

/**
 * Admin → Discounts → Welcome offer → "Send test to me": the real email, with the
 * saved settings and a dummy code, to the signed-in admin. No Polar discount is
 * created and nothing is recorded as sent. Owners and admins; audited.
 */
export async function POST(req: Request) {
  const g = await adminApi("limits");
  if (g.error) return g.error;
  const r = await sendWelcomeTest({ to: g.staff.email, userId: g.staff.sub }).catch((e: unknown) => ({
    ok: false as const,
    error: e instanceof Error ? e.message : "send failed",
  }));
  await recordAudit({
    actorId: g.staff.sub,
    action: "welcome.test",
    entity: "Email",
    entityId: "welcome",
    diff: { ok: r.ok },
    ip: getClientIp(req),
  });
  if (!r.ok) return NextResponse.json({ error: `Couldn't send: ${redactString(r.error).slice(0, 200)}` }, { status: 502 });
  return NextResponse.json({ ok: true, to: g.staff.email });
}
