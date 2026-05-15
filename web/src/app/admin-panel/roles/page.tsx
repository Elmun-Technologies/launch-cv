import { redirect } from "next/navigation";
import { ShieldCheck, Mail, Users, KeyRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { KpiCard } from "@/components/admin/kpi-card";

export default async function AdminRolesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const envEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const [dbAdmins, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: { role: "admin" },
      select: { id: true, email: true, name: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.count(),
  ]);

  // emails in env that don't yet have a User record
  const dbEmails = new Set(dbAdmins.map((a) => a.email.toLowerCase()));
  const envOnly = envEmails.filter((e) => !dbEmails.has(e.toLowerCase()));

  return (
    <AdminShell email={admin.email} pageTitle="Roles">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Roles &amp; access</h1>
          <p className="mt-1 max-w-[680px] text-[13px] leading-[1.6] text-[#64748B]">
            Admin access is granted in two ways: an email in the{" "}
            <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[12px] text-[#0F172A]">ADMIN_EMAILS</code>{" "}
            environment variable, or a User row in the database with{" "}
            <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[12px] text-[#0F172A]">role = &quot;admin&quot;</code>.
            Promote new admins from{" "}
            <a href="/admin-panel/settings" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
              Settings → Promote user to admin
            </a>
            .
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="DB admin users" value={dbAdmins.length} icon={ShieldCheck} hint="User.role = 'admin'" />
          <KpiCard label="Env-only admins" value={envOnly.length} icon={Mail} hint="ADMIN_EMAILS, no user row yet" />
          <KpiCard label="Total accounts" value={totalUsers} icon={Users} hint="All registered users" />
        </div>

        <SectionCard
          title="Database admin users"
          description="These accounts have full admin access via their User row"
          action={<ShieldCheck className="h-4 w-4 text-[#1A56DB]" />}
          flush
        >
          {dbAdmins.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">
              No DB admins yet. Promote via{" "}
              <a href="/admin-panel/settings" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                Settings
              </a>
              .
            </p>
          ) : (
            <ul className="divide-y divide-[#E2E8F0]">
              {dbAdmins.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFBFC]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[12px] font-semibold text-white">
                      {(a.name || a.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#0F172A]">{a.name || "—"}</p>
                      <p className="truncate text-[11px] text-[#64748B]">{a.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">
                    since {a.createdAt.toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="ADMIN_EMAILS · environment variable"
          description="Email allow-list from Vercel env. These users get admin access on login even without a role change."
          action={<Mail className="h-4 w-4 text-[#1A56DB]" />}
          flush
        >
          {envEmails.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">
              ADMIN_EMAILS is empty. Set it in Vercel → Settings → Environment Variables.
            </p>
          ) : (
            <ul className="divide-y divide-[#E2E8F0]">
              {envEmails.map((e) => (
                <li key={e} className="flex items-center justify-between gap-4 px-5 py-3">
                  <span className="font-mono text-[12px] text-[#0F172A]">{e}</span>
                  {envOnly.includes(e) ? (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                      Pending registration
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      Active account
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="How access works"
          action={<KeyRound className="h-4 w-4 text-[#1A56DB]" />}
        >
          <ol className="space-y-2 text-[13px] leading-[1.7] text-[#475569]">
            <li>
              <span className="font-semibold text-[#0F172A]">1.</span> A logged-in user&apos;s email is compared against{" "}
              <code className="rounded bg-[#F1F5F9] px-1 font-mono text-[12px] text-[#0F172A]">ADMIN_EMAILS</code> (case-insensitive).
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">2.</span> If not found, their{" "}
              <code className="rounded bg-[#F1F5F9] px-1 font-mono text-[12px] text-[#0F172A]">User.role</code> column is checked for{" "}
              <code className="rounded bg-[#F1F5F9] px-1 font-mono text-[12px] text-[#0F172A]">&quot;admin&quot;</code>.
            </li>
            <li>
              <span className="font-semibold text-[#0F172A]">3.</span> Either match → admin panel. Otherwise → access-denied page.
            </li>
          </ol>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
