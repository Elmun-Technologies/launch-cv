import { redirect } from "next/navigation";
import { Settings, CheckCircle2, XCircle, Shield, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
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
    { name: "Lemon Webhook Secret", key: "LEMON_WEBHOOK_SECRET", configured: !!process.env.LEMON_WEBHOOK_SECRET },
    { name: "Resend", key: "RESEND_API_KEY", configured: !!process.env.RESEND_API_KEY },
    { name: "Database", key: "DATABASE_URL", configured: !!process.env.DATABASE_URL },
    { name: "JWT Secret", key: "JWT_SECRET", configured: !!process.env.JWT_SECRET },
  ];

  const dbAdmins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, email: true, name: true },
  });

  return (
    <AdminShell email={admin.email} pageTitle="Settings">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">Settings</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Environment Status */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
              <Settings className="h-4 w-4 text-[#7C5CFC]" />
              <h3 className="text-[15px] font-semibold text-gray-900">Environment Status</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {envChecks.map((e) => (
                <div key={e.key} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{e.name}</p>
                    <p className="text-[11px] text-gray-400">{e.key}</p>
                  </div>
                  {e.configured ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Configured
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                      <XCircle className="h-3 w-3" /> Missing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Make User Admin */}
            <MakeAdminForm />

            {/* Current Admins */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#7C5CFC]" />
                <h3 className="text-[15px] font-semibold text-gray-900">DB Admin Users</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {dbAdmins.length === 0 ? (
                  <p className="px-6 py-6 text-center text-[13px] text-gray-400">No admin users in DB</p>
                ) : (
                  dbAdmins.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 px-6 py-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7C5CFC] text-[11px] font-bold text-white">
                        {(a.name || a.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">{a.name || "—"}</p>
                        <p className="text-[11px] text-gray-400">{a.email}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Admin Emails from Env */}
            {adminEmails.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#7C5CFC]" />
                  <h3 className="text-[15px] font-semibold text-gray-900">Admin Emails (ENV)</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {adminEmails.map((email) => (
                    <div key={email} className="px-6 py-3">
                      <p className="text-[13px] text-gray-600">{email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
