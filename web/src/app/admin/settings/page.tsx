import { redirect } from "next/navigation";
import { Settings, CheckCircle2, XCircle, Shield, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { MakeAdminForm } from "./make-admin-form";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const envChecks = [
    { name: "OpenAI", key: "OPENAI_API_KEY", configured: !!process.env.OPENAI_API_KEY },
    { name: "Lemon Squeezy API", key: "LEMON_SQUEEZY_API_KEY", configured: !!process.env.LEMON_SQUEEZY_API_KEY },
    { name: "Lemon webhook secret", key: "LEMON_WEBHOOK_SECRET", configured: !!process.env.LEMON_WEBHOOK_SECRET },
    { name: "Resend", key: "RESEND_API_KEY", configured: !!process.env.RESEND_API_KEY },
    { name: "Database", key: "DATABASE_URL", configured: !!process.env.DATABASE_URL },
    { name: "Auth secret", key: "AUTH_SECRET", configured: !!process.env.AUTH_SECRET },
  ];

  const dbAdmins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, email: true, name: true },
  });

  return (
    <AdminShell email={admin.email} pageTitle="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Settings</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Environment configuration and admin user management.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Environment status"
            description="Configured secrets required for full functionality"
            action={<Settings className="h-4 w-4 text-[#1A56DB]" />}
            flush
          >
            <ul className="divide-y divide-[#E2E8F0]">
              {envChecks.map((e) => (
                <li key={e.key} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#0F172A]">{e.name}</p>
                    <p className="truncate font-mono text-[11px] text-[#94A3B8]">{e.key}</p>
                  </div>
                  {e.configured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Configured
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                      <XCircle className="h-3 w-3" />
                      Missing
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="space-y-5">
            <MakeAdminForm />

            <SectionCard
              title="DB admin users"
              description="Users with role = &lsquo;admin&rsquo; in the database"
              action={<Shield className="h-4 w-4 text-[#1A56DB]" />}
              flush
            >
              {dbAdmins.length === 0 ? (
                <p className="px-5 py-6 text-center text-[13px] text-[#94A3B8]">No admin users in DB.</p>
              ) : (
                <ul className="divide-y divide-[#E2E8F0]">
                  {dbAdmins.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[11px] font-semibold text-white">
                        {(a.name || a.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[#0F172A]">{a.name || "—"}</p>
                        <p className="truncate text-[11px] text-[#64748B]">{a.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {adminEmails.length > 0 ? (
              <SectionCard
                title="Admin emails · env"
                description="Email allow-list from ADMIN_EMAILS environment variable"
                action={<Mail className="h-4 w-4 text-[#1A56DB]" />}
                flush
              >
                <ul className="divide-y divide-[#E2E8F0]">
                  {adminEmails.map((email) => (
                    <li key={email} className="px-5 py-3 font-mono text-[12px] text-[#475569]">
                      {email}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            ) : null}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
