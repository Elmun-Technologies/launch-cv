import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { bootstrapEmails, can, PERMISSION_LABELS, requestContext, requireAdmin, staffRoleOf, STAFF_ROLES, type Permission } from "@/lib/admin-guard";
import { getSettings } from "@/lib/app-settings";
import { emailConfigured } from "@/lib/owner-notify";
import { remainingRecoveryCodes } from "@/lib/recovery-codes";
import { maskIp } from "@/lib/ip-allowlist";
import { nowMs, relativeTime } from "@/lib/relative-time";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { adminH1, adminLead, adminLink } from "@/components/admin/admin-ui";
import { SecurityClient } from "./security-client";
import { activityLines, type ActivityEvent } from "./describe-activity";

export const dynamic = "force-dynamic";

const SENSITIVE = [
  "integration.update",
  "integration.disconnect",
  "integration.test",
  "settings.update",
  "user.role.change",
  "user.delete",
  "admin.2fa.enable",
  "admin.2fa.reset",
  "admin.2fa.failed",
  "admin.2fa.recovery.used",
  "admin.2fa.recovery.generate",
  "admin.reauth.failed",
  "admin.denied",
  "admin.ip.blocked",
  "admin.origin.blocked",
];

const dayFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export default async function SecurityPage() {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const bootstrap = bootstrapEmails();

  const [rows, settings, events, recoveryLeft, mailOk, lastNotify, ctx] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ role: { in: [...STAFF_ROLES] } }, { email: { in: bootstrap } }] },
      select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true, totpEnabledAt: true, adminLastSeenAt: true },
      orderBy: { createdAt: "asc" },
    }),
    getSettings(),
    prisma.auditLog.findMany({
      where: { action: { in: SENSITIVE } },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: { id: true, action: true, entity: true, entityId: true, diff: true, ip: true, createdAt: true, actorId: true, actor: { select: { email: true, name: true } } },
    }),
    remainingRecoveryCodes(admin.sub),
    emailConfigured(),
    prisma.auditLog.findFirst({ where: { action: "admin.notify.key-change" }, orderBy: { createdAt: "desc" }, select: { diff: true, createdAt: true } }),
    requestContext(),
  ]);

  const now = nowMs();
  const members = rows
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: staffRoleOf(u),
      viaEnv: u.role === "user" && bootstrap.includes(u.email.toLowerCase()),
      totp: !!u.totpEnabledAt,
      lastActive: u.adminLastSeenAt ? relativeTime(u.adminLastSeenAt, now) : "never",
    }))
    .filter((u) => u.role !== null)
    .map((u) => ({ ...u, role: u.role! }));

  // Names for "target" users in role/2FA events.
  const targetIds = [...new Set(events.filter((e) => e.entity === "User" && e.entityId).map((e) => e.entityId!))];
  const targetRows = targetIds.length ? await prisma.user.findMany({ where: { id: { in: targetIds } }, select: { id: true, name: true, email: true } }) : [];
  const targets = new Map(targetRows.map((u) => [u.id, u.name || u.email]));
  const short = (a: { name: string | null; email: string } | null) => (a ? a.name?.split(" ")[0] || a.email.split("@")[0] : "someone");
  const lines = activityLines(
    events.map<ActivityEvent>((e) => ({ ...e, actorName: e.actor ? short(e.actor) : e.ip ? maskIp(e.ip) : "unknown" })),
    targets,
  ).slice(0, 12);

  const perms = Object.keys(PERMISSION_LABELS) as Permission[];
  const notifyDiff = (lastNotify?.diff ?? null) as { ok?: boolean; reason?: string } | null;

  return (
    <AdminShell email={admin.email} pageTitle="Security">
      <div className="mx-auto max-w-[1280px] space-y-5">
        <div>
          <h1 className={adminH1}>Security</h1>
          <p className={adminLead}>Who can do what, how they sign in, and what they did.</p>
        </div>

        <SecurityClient
          me={{ id: admin.sub, role: admin.role, totp: admin.totpEnabled }}
          team={members}
          security={settings.security}
          canManage={can(admin.role, "roles")}
          currentIp={ctx.ip}
          email={{
            configured: mailOk,
            last: lastNotify
              ? { ok: !!notifyDiff?.ok, reason: notifyDiff?.reason ?? null, when: relativeTime(lastNotify.createdAt, now) }
              : null,
          }}
          recoveryLeft={recoveryLeft}
          permissions={
            <SectionCard title="Permissions" flush>
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Permissions by role">
                <table className="w-full min-w-[560px] text-left text-[14px]">
                  <thead className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                    <tr>
                      <th scope="col" className="py-3 pl-5 pr-3 font-bold sm:pl-6">
                        Permission
                      </th>
                      {STAFF_ROLES.map((r) => (
                        <th key={r} scope="col" className="px-3 py-3 text-center font-bold last:pr-5 sm:last:pr-6">
                          {r}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {perms.map((p) => (
                      <tr key={p} className="border-t border-[#e2e0ea]">
                        <th scope="row" className="py-2.5 pl-5 pr-3 font-medium text-[#121226] sm:pl-6">
                          {PERMISSION_LABELS[p]}
                        </th>
                        {STAFF_ROLES.map((r) => (
                          <td key={r} className="px-3 py-2.5 text-center last:pr-5 sm:last:pr-6">
                            {can(r, p) ? (
                              <span className="font-extrabold text-[#0b7a4f]">
                                <span aria-hidden>✓</span>
                                <span className="sr-only">Allowed</span>
                              </span>
                            ) : (
                              <span className="font-extrabold text-[#9d9bb3]">
                                <span aria-hidden>—</span>
                                <span className="sr-only">Not allowed</span>
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          }
          activity={
            <SectionCard
              title="Recent sensitive actions"
              flush
              action={
                <Link href="/admin-panel/audit" className={`${adminLink} text-[13px]`}>
                  Audit log →
                </Link>
              }
            >
              {lines.length === 0 ? (
                <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">Nothing yet.</p>
              ) : (
                <ul>
                  {lines.map((l) => (
                    <li key={l.id} className="flex items-baseline justify-between gap-3 border-t border-[#e2e0ea] px-5 py-3 text-[13px] first:border-t-0 sm:px-6">
                      <p className="min-w-0">
                        <b className={`font-bold ${l.tone === "warn" ? "text-[#a3262b]" : "text-[#121226]"}`}>
                          {l.text}
                          {l.count > 1 ? ` ×${l.count}` : ""}
                        </b>
                        <span className="text-[#66647c]"> · {l.who}</span>
                      </p>
                      <time dateTime={l.when.toISOString()} className="shrink-0 text-[12px] text-[#66647c]">
                        {now - l.when.getTime() < 86_400_000 ? relativeTime(l.when, now) : dayFmt.format(l.when)}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          }
        />
      </div>
    </AdminShell>
  );
}
