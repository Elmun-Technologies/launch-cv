import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { DEFAULT_SETTINGS, getSettings, saveSettingsGroup, type SettingsGroup } from "@/lib/app-settings";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

/** Save one settings group (limits, budget, switches, models, security). Re-confirm required. */
export async function PUT(req: Request, { params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!(group in DEFAULT_SETTINGS)) return NextResponse.json({ error: "Unknown settings group" }, { status: 404 });
  const g = await adminApi(group === "security" ? "roles" : "limits", { reauth: true });
  if (g.error) return g.error;
  const value = await req.json().catch(() => null);
  if (!value || typeof value !== "object") return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const key = group as SettingsGroup;
  const before = (await getSettings())[key];
  const saved = await saveSettingsGroup(key, value, g.staff.sub);
  await recordAudit({
    actorId: g.staff.sub,
    action: "settings.update",
    entity: "AppSetting",
    entityId: key,
    diff: { before: before as object, after: saved as object },
    ip: getClientIp(req),
  });
  return NextResponse.json({ ok: true, value: saved });
}
