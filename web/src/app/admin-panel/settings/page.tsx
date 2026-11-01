import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Gauge, Lock, Plug, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  // The only values that must live in hosting. Everything else is in the panel.
  const bootstrap = [
    { key: "DATABASE_URL", what: "Database connection", ok: !!process.env.DATABASE_URL },
    { key: "AUTH_SECRET", what: "Signs sign-in sessions", ok: (process.env.AUTH_SECRET ?? "").trim().length >= 16 },
    { key: "KEY_ENCRYPTION_KEY", what: "Encrypts API keys saved in the panel", ok: secretBoxReady() },
    { key: "ADMIN_EMAILS", what: "First owner(s) — optional once the team is set up", ok: !!process.env.ADMIN_EMAILS?.trim() },
  ];

  const links = [
    { href: "/admin-panel/integrations", icon: Plug, title: "Integrations", text: "OpenAI, Polar, Resend, Google sign-in, analytics keys" },
    { href: "/admin-panel/limits", icon: Gauge, title: "Limits & budgets", text: "AI spend caps, plan quotas, rate limits, models, switches" },
    { href: "/admin-panel/security", icon: Lock, title: "Security", text: "Team, roles, two-factor sign-in, sensitive activity" },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">Settings</h1>
          <p className="mt-1 text-[13px] text-[#6B6B6B]">Everything is managed here, except four values that live in the hosting environment.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-xl border border-[#E5E5E2] bg-white p-5 transition hover:border-[#D9D9D5] hover:shadow-sm">
              <div className="flex items-center justify-between">
                <l.icon className="h-5 w-5 text-[#2563EB]" aria-hidden />
                <ArrowUpRight className="h-4 w-4 text-[#8A8A86] transition group-hover:text-[#2563EB]" aria-hidden />
              </div>
              <p className="mt-3 text-[14px] font-semibold text-[#111111]">{l.title}</p>
              <p className="mt-1 text-[12px] leading-[1.5] text-[#6B6B6B]">{l.text}</p>
            </Link>
          ))}
        </div>

        <SectionCard title="Hosting environment" description="Set once in your hosting provider. Values are never shown here." flush>
          <ul className="divide-y divide-[#E5E5E2]">
            {bootstrap.map((e) => (
              <li key={e.key} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[12px] text-[#111111]">{e.key}</p>
                  <p className="truncate text-[12px] text-[#6B6B6B]">{e.what}</p>
                </div>
                {e.ok ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-3 w-3" aria-hidden /> Set
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                    <XCircle className="h-3 w-3" aria-hidden /> Missing
                  </span>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AdminShell>
  );
}
