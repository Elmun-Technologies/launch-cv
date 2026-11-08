import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { providerDef, recordTestResult, testIntegration } from "@/lib/integrations";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { sendTransactionalEmail } from "@/lib/email";
import { redactString } from "@/lib/redact";

/** Live connection test with the stored values (row "Test", "Test all", "Test connection"). */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const g = await adminApi("limits");
  if (g.error) return g.error;
  const { provider } = await params;
  if (!providerDef(provider)) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  const result = await testIntegration(provider);
  // For email, prove delivery end to end: send a short test message to the admin who clicked.
  if (provider === "resend" && result.ok) {
    const sent = await sendTransactionalEmail({
      to: g.staff.email,
      subject: "LaunchCV test email",
      html: "<p>This is a test from Admin → Integrations → Resend. If you can read it, verification and password-reset emails are being delivered.</p>",
      text: "This is a test from Admin → Integrations → Resend. If you can read it, verification and password-reset emails are being delivered.",
    });
    if (sent.ok) result.message = `${result.message} · test email sent to ${g.staff.email} (check spam too)`;
    else Object.assign(result, { ok: false, message: `Key works, but sending failed: ${redactString(sent.error).slice(0, 200)}` });
  }
  await recordTestResult(provider, result.ok, result.message, result.ms);
  await recordAudit({
    actorId: g.staff.sub,
    action: "integration.test",
    entity: "Integration",
    entityId: provider,
    diff: { ok: result.ok, ms: result.ms },
    ip: getClientIp(req),
  });
  return NextResponse.json(result);
}
