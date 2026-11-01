import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApi } from "@/lib/admin-api";
import { providerDef, recordTestResult, saveIntegrationFields, testIntegration } from "@/lib/integrations";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

const body = z.object({
  values: z.record(z.string(), z.string().max(4000).nullable()),
  /** Save even if the live test fails (e.g. provider temporarily down). */
  skipTest: z.boolean().optional(),
});

/** Save (and first test) credentials for one provider. Owner only, after re-confirming. */
export async function POST(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const g = await adminApi("secrets", { reauth: true });
  if (g.error) return g.error;
  const { provider } = await params;
  const def = providerDef(provider);
  if (!def) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const values = Object.fromEntries(
    Object.entries(parsed.data.values).filter(([k]) => def.fields.some((f) => f.key === k)),
  );
  const incoming = Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === "string" && v.trim())) as Record<string, string>;

  // Test new credentials before they replace the working ones.
  let test: Awaited<ReturnType<typeof testIntegration>> | null = null;
  if (Object.keys(incoming).length && !parsed.data.skipTest) {
    test = await testIntegration(provider, incoming);
    if (!test.ok) {
      return NextResponse.json({ error: `Not saved — ${test.message}. Your current settings still apply.`, test }, { status: 422 });
    }
  }

  try {
    const changed = await saveIntegrationFields(provider, values, g.staff.sub);
    if (test) await recordTestResult(provider, test.ok, test.message);
    await recordAudit({
      actorId: g.staff.sub,
      action: "integration.update",
      entity: "Integration",
      entityId: provider,
      // Field names only — never values.
      diff: { fields: changed, tested: !!test, skippedTest: !!parsed.data.skipTest },
      ip: getClientIp(req),
    });
    return NextResponse.json({ ok: true, changed, test });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Couldn't save" }, { status: 400 });
  }
}
