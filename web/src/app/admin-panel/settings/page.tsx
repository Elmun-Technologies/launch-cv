import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Gauge, Lock, Plug, XCircle } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminH1, adminLead } from "@/components/admin/admin-ui";

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
      <div className="mx-auto max-w-[1280px] space-y-5">
        <div>
          <h1 className={adminH1}>Settings</h1>
          <p className={adminLead}>Everything is managed here, except four values that live in the hosting environment.</p>
        </div>

        <div className="grid items-start gap-[18px] lg:grid-cols-2">
          <SectionCard title="Hosting environment" description="Set once in your hosting provider. Values are never shown here." flush>
            <ul>
              {bootstrap.map((e) => (
                <li key={e.key} className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
                  <div className="min-w-0">
                    <p className="lc-mono truncate text-[13px] text-[#121226]">{e.key}</p>
                    <p className="text-[12px] leading-[1.45] text-[#66647c]">{e.what}</p>
                  </div>
                  {e.ok ? (
                    <StatusBadge tone="green">
                      <CheckCircle2 className="h-3 w-3" aria-hidden /> Set
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="red">
                      <XCircle className="h-3 w-3" aria-hidden /> Missing
                    </StatusBadge>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Managed in the panel" description="Keys, limits and access live on their own pages." flush>
            <ul>
              {links.map((l) => (
                <li key={l.href} className="border-t border-[#e2e0ea] first:border-t-0">
                  <Link
                    href={l.href}
                    className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-[#f7f6fb] focus-visible:rounded-none! focus-visible:outline-offset-[-3px]! sm:px-6"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4dfff] text-[#3a2bb8]">
                      <l.icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-[15px] text-[#121226]">{l.title}</b>
                      <span className="block text-[13px] leading-[1.45] text-[#66647c]">{l.text}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#66647c] transition-colors group-hover:text-[#5440e8]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
