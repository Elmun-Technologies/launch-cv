import { NextResponse } from "next/server";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { logError } from "@/lib/redact";
import { sendWeeklyReport } from "@/lib/weekly-report";

/**
 * Admin → Settings → Weekly report → "Send me this week's report now": the
 * same email the Monday cron sends, for the last 7 complete UTC days, to the
 * admin who clicked only. Revenue numbers, so owners and admins (limits);
 * re-confirmed and audited. Doesn't touch the cron's last-run guard.
 */
export async function POST(req: Request) {
  const g = await adminApi("limits", { reauth: true });
  if (g.error) return g.error;
  const ip = getClientIp(req);
  const audit = (diff: Record<string, string | number | boolean>) =>
    recordAudit({ actorId: g.staff.sub, action: "report.weekly.send-now", entity: "Email", entityId: "weekly-report", diff, ip });
  try {
    const r = await sendWeeklyReport({ to: [g.staff.email] });
    await audit({ ok: r.sent > 0, sent: r.sent, ...(r.skipped ? { skipped: r.skipped } : {}), ...(r.error ? { error: r.error } : {}) });
    if (r.skipped === "email not configured") {
      return NextResponse.json({ error: "Email isn't set up yet — connect Resend in Integrations first." }, { status: 503 });
    }
    if (!r.sent) return NextResponse.json({ error: `Couldn't send: ${r.error ?? "unknown error"}` }, { status: 502 });
    return NextResponse.json({ ok: true, to: g.staff.email });
  } catch (e) {
    logError("[reports/weekly] send-now failed", e);
    await audit({ ok: false, error: "report failed" });
    return NextResponse.json({ error: "Couldn't build the report. Nothing was sent." }, { status: 500 });
  }
}
