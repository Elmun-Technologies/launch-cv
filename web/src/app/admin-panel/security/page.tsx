import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { can, PERMISSION_LABELS, requireAdmin, staffRoleOf, STAFF_ROLES, type Permission } from "@/lib/admin-guard";
import { getSettings } from "@/lib/app-settings";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { SecurityClient } from "./security-client";

export const dynamic = "force-dynamic";

const SENSITIVE = [
  "integration.update",
  "integration.test",
  "settings.update",
  "user.role.change",
  "user.delete",
  "admin.2fa.enable",
  "admin.2fa.reset",
  "admin.2fa.failed",
  "admin.reauth.failed",
];

export default async function SecurityPage() {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const bootstrap = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const [rows, settings, events] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ role: { in: [...STAFF_ROLES] } }, { email: { in: bootstrap } }] },
      select: { id: true, email: true, name: true, role: true, emailVerifiedAt: true, totpEnabledAt: true, updatedAt: true },
      orderBy: { createdAt: "asc" },
    }),
    getSettings(),
    prisma.auditLog.findMany({
      where: { action: { in: SENSITIVE } },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: { id: true, action: true, entity: true, entityId: true, ip: true, createdAt: true, actor: { select: { email: true } } },
    }),
  ]);

  const team = rows
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: staffRoleOf(u),
      viaEnv: u.role === "user" && bootstrap.includes(u.email.toLowerCase()),
      totp: !!u.totpEnabledAt,
    }))
    .filter((u) => u.role !== null);

  const perms = Object.keys(PERMISSION_LABELS) as Permission[];

  return (
    <AdminShell email={admin.email} pageTitle="Security">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">Security</h1>
          <p className="mt-1 max-w-[720px] text-[13px] leading-[1.6] text-[#6B6B6B]">
            Who can open the admin panel and what each role can do. Every admin signs in with a password plus an authenticator
            code; keys, limits and roles need a fresh confirmation.
          </p>
        </div>

        <SecurityClient
          me={{ id: admin.sub, role: admin.role }}
          team={team.map((t) => ({ ...t, role: t.role! }))}
          security={settings.security}
          canManage={can(admin.role, "roles")}
        />

        <SectionCard title="What each role can do" flush>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="bg-[#FAFAF9] text-[11px] uppercase tracking-wider text-[#6E6E6A]">
                <tr>
                  <th className="px-5 py-2.5 font-semibold">Permission</th>
                  {STAFF_ROLES.map((r) => (
                    <th key={r} className="px-3 py-2.5 text-center font-semibold capitalize">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {perms.map((p) => (
                  <tr key={p}>
                    <td className="px-5 py-2.5 text-[#111111]">{PERMISSION_LABELS[p]}</td>
                    {STAFF_ROLES.map((r) => (
                      <td key={r} className="px-3 py-2.5 text-center">
                        {can(r, p) ? <span className="text-emerald-600">✓</span> : <span className="text-[#C4C4BF]">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Recent sensitive activity" description="Key, limit, role and sign-in events. Full history is in the audit log." flush>
          {events.length === 0 ? (
            <p className="px-5 py-6 text-center text-[13px] text-[#6E6E6A]">Nothing yet.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E2]">
              {events.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5 text-[12px]">
                  <span className={`font-mono ${e.action.endsWith("failed") ? "text-red-700" : "text-[#111111]"}`}>{e.action}</span>
                  <span className="text-[#6B6B6B]">{e.entityId ?? e.entity}</span>
                  <span className="text-[#6B6B6B]">{e.actor?.email ?? "—"}</span>
                  <span className="ml-auto text-[#8A8A86]">
                    {e.ip ? `${e.ip} · ` : ""}
                    {e.createdAt.toISOString().replace("T", " ").slice(0, 16)} UTC
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
