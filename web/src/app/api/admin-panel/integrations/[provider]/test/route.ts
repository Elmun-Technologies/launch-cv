import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { providerDef, recordTestResult, testIntegration } from "@/lib/integrations";
import { recordAudit } from "@/lib/cms/audit";

/** Live connection test with the stored values. */
export async function POST(_req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const g = await adminApi("limits");
  if (g.error) return g.error;
  const { provider } = await params;
  if (!providerDef(provider)) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  const result = await testIntegration(provider);
  await recordTestResult(provider, result.ok, result.message);
  await recordAudit({ actorId: g.staff.sub, action: "integration.test", entity: "Integration", entityId: provider, diff: { ok: result.ok } });
  return NextResponse.json(result);
}
