import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { clientIpFrom } from "@/lib/admin-guard";
import { DEFAULT_SETTINGS, getSettings, saveSettingsGroup, type SettingsGroup } from "@/lib/app-settings";
import { ipAllowed, normalizeAllowlist } from "@/lib/ip-allowlist";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { logError } from "@/lib/redact";

/**
 * Save one settings group (limits, budget, switches, models, product, security). Re-confirm required.
 * Security (team sign-in rules) is owner-only; everything else needs the limits permission.
 *
 * The admin IP allow-list never locks out the person saving it by surprise:
 * if the list doesn't cover the current request's address, the save is
 * refused with `ip_lockout` unless `?confirmLockout=1` is sent.
 */
export async function PUT(req: Request, { params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!(group in DEFAULT_SETTINGS)) return NextResponse.json({ error: "Unknown settings group" }, { status: 404 });
  const g = await adminApi(group === "security" ? "roles" : "limits", { reauth: true });
  if (g.error) return g.error;
  const value = await req.json().catch(() => null);
  if (!value || typeof value !== "object" || Array.isArray(value)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const key = group as SettingsGroup;

  if (key === "security" && "ipAllowlist" in value) {
    const { valid, invalid } = normalizeAllowlist((value as { ipAllowlist: unknown }).ipAllowlist);
    if (invalid.length) {
      return NextResponse.json({ error: `Not an IP address or CIDR range: ${invalid.slice(0, 5).join(", ")}`, code: "invalid_ip" }, { status: 400 });
    }
    const ip = clientIpFrom(req.headers);
    const confirmed = new URL(req.url).searchParams.get("confirmLockout") === "1";
    if (valid.length && !ipAllowed(ip, valid) && !confirmed) {
      return NextResponse.json(
        {
          error: `Your current address (${ip ?? "unknown"}) isn't in this list, so saving it would lock you out of the admin panel.`,
          code: "ip_lockout",
          ip,
        },
        { status: 409 },
      );
    }
  }

  try {
    const before = (await getSettings())[key];
    const saved = await saveSettingsGroup(key, value, g.staff.sub);
    await recordAudit({
      actorId: g.staff.sub,
      action: "settings.update",
      entity: "AppSetting",
      entityId: key,
      // recordAudit redacts anything secret-looking in the diff.
      diff: { before: before as object, after: saved as object },
      ip: getClientIp(req),
    });
    return NextResponse.json({ ok: true, value: saved });
  } catch (e) {
    logError(`[settings] save ${key} failed`, e);
    return NextResponse.json({ error: "Couldn't save. Nothing was changed." }, { status: 500 });
  }
}
