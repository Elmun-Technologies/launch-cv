import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { AUDIT_GROUPS, auditWhere, describeDiff, resolveTargets, targetLabel, type AuditGroup } from "@/lib/admin-audit";
import { csvResponse, toCsv } from "@/lib/admin-csv";
import { maskIp } from "@/lib/admin-labels";
import { utcDayKey } from "@/lib/admin-dates";

const MAX_ROWS = 20_000;

/**
 * CSV of the audit entries matching the page's filters, with the same masking
 * as the page (secret values never appear, IPs lose their last part). Staff
 * with dashboard access only; each export is itself audited.
 */
export async function GET(req: Request) {
  const { staff, error } = await adminApi("view");
  if (error) return error;

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 200) || undefined;
  const entity = url.searchParams.get("entity")?.slice(0, 64) || undefined;
  const action = url.searchParams.get("action")?.slice(0, 64) || undefined;
  const group: AuditGroup = AUDIT_GROUPS.find((g) => g.id === url.searchParams.get("group"))?.id ?? "all";

  const rows = await prisma.auditLog.findMany({
    where: await auditWhere({ q, entity, action, group }),
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
    include: { actor: { select: { email: true } } },
  });
  const targets = await resolveTargets(rows);

  await recordAudit({
    actorId: staff.sub,
    action: "audit.export",
    entity: "AuditLog",
    diff: { rows: rows.length, ...(q ? { search: q } : {}), ...(entity ? { entity } : {}), ...(group !== "all" ? { group } : {}) },
    ip: getClientIp(req),
  });

  const csv = toCsv(
    ["when_utc", "actor", "action", "entity", "entity_id", "target", "change", "ip"],
    rows.map((r) => [
      r.createdAt.toISOString(),
      r.actor?.email ?? "",
      r.action,
      r.entity,
      r.entityId ?? "",
      targetLabel(targets, r),
      describeDiff(r.action, r.diff),
      maskIp(r.ip),
    ]),
  );
  return csvResponse(`launchcv-audit-${utcDayKey(new Date())}.csv`, csv);
}
