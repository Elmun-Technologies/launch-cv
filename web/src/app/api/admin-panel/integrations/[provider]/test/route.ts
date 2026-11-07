import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { providerDef, recordTestResult, testIntegration } from "@/lib/integrations";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

/** Live connection test with the stored values (row "Test", "Test all", "Test connection"). */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const g = await adminApi("limits");
  if (g.error) return g.error;
  const { provider } = await params;
  if (!providerDef(provider)) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  const result = await testIntegration(provider);
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
