import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { can, PERMISSION_LABELS, requireAdmin, staffRoleOf, STAFF_ROLES, type Permission } from "@/lib/admin-guard";
import { getSettings } from "@/lib/app-settings";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { adminH1, adminLead, adminLink } from "@/components/admin/admin-ui";
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
  const members = team.map((t) => ({ ...t, role: t.role! }));

  return (
    <AdminShell email={admin.email} pageTitle="Security">
      <div className="mx-auto max-w-[1280px] space-y-5">
        <div>
          <h1 className={adminH1}>Security</h1>
          <p className={adminLead}>
            Who can open the admin panel and what each role can do. Every admin signs in with a password plus an authenticator
            code; keys, limits and roles need a fresh confirmation.
          </p>
        </div>

        {/* Role summary — counts come from the team list below. */}
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STAFF_ROLES.map((r) => {
            const count = members.filter((m) => m.role === r).length;
            const allowed = perms.filter((p) => can(r, p)).length;
            const dark = r === "owner";
            return (
              <li key={r} className={`min-w-0 rounded-[22px] p-5 ${dark ? "bg-[#111118] text-white" : "bg-white"}`}>
                <p className="text-[16px] font-extrabold capitalize sm:text-[18px]">{r}</p>
                <p className={`mt-1 text-[13px] leading-[1.45] ${dark ? "text-[#c9c7d8]" : "text-[#4a4862]"}`}>
                  {allowed} of {perms.length} permissions
                </p>
                <p className="mt-2.5 text-[24px] font-extrabold tabular-nums">
                  {count}
                  <span className={`ml-1.5 text-[13px] font-semibold ${dark ? "text-[#c9c7d8]" : "text-[#66647c]"}`}>{count === 1 ? "person" : "people"}</span>
                </p>
              </li>
            );
          })}
        </ul>

        <SecurityClient
          me={{ id: admin.sub, role: admin.role }}
          team={members}
          security={settings.security}
          canManage={can(admin.role, "roles")}
          permissions={
            <SectionCard title="What each role can do" flush>
              <div className="relative overflow-x-auto">
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
              title="Recent sensitive activity"
              description="Key, limit, role and sign-in events."
              flush
              action={
                <Link href="/admin-panel/audit" className={`${adminLink} text-[13px]`}>
                  Audit log →
                </Link>
              }
            >
              {events.length === 0 ? (
                <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">Nothing yet.</p>
              ) : (
                <ul>
                  {events.map((e) => (
                    <li key={e.id} className="border-t border-[#e2e0ea] px-5 py-3 text-[13px] first:border-t-0 sm:px-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                        <span className={`lc-mono break-all text-[12px] ${e.action.endsWith("failed") ? "text-[#c42b30]" : "text-[#121226]"}`}>
                          {e.action}
                        </span>
                        <span className="text-[12px] text-[#66647c]">{e.createdAt.toISOString().replace("T", " ").slice(0, 16)} UTC</span>
                      </div>
                      <p className="mt-0.5 break-all text-[12px] text-[#4a4862]">
                        <b className="font-semibold text-[#121226]">{e.entityId ?? e.entity}</b> · {e.actor?.email ?? "—"}
                        {e.ip ? <span className="text-[#66647c]"> · {e.ip}</span> : null}
                      </p>
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
