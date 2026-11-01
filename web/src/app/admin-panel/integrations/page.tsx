import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, KeyRound, Lock } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses, type ProviderStatus } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";

export const dynamic = "force-dynamic";

const STATE: Record<ProviderStatus["state"], { label: string; tone: "green" | "amber" | "red" | "default" }> = {
  connected: { label: "Connected", tone: "green" },
  partial: { label: "Incomplete", tone: "amber" },
  error: { label: "Test failed", tone: "red" },
  missing: { label: "Not connected", tone: "default" },
};

function sourceLabel(p: ProviderStatus) {
  const sources = new Set(p.fields.filter((f) => f.source !== "none").map((f) => f.source));
  if (!sources.size) return "—";
  if (sources.size === 2) return "Panel + hosting env";
  return sources.has("panel") ? "Admin panel" : "Hosting env";
}

export default async function IntegrationsPage() {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const providers = await integrationStatuses();
  const canEdit = can(admin.role, "secrets");
  const groups = [...new Set(providers.map((p) => p.group))];

  return (
    <AdminShell email={admin.email} pageTitle="Integrations">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">Integrations</h1>
          <p className="mt-1 max-w-[720px] text-[13px] leading-[1.6] text-[#6B6B6B]">
            API keys for the services LaunchCV uses. Keys entered here are encrypted (AES-256-GCM) before they&apos;re stored,
            are never shown again in full, and take effect within a minute — no redeploy. Where a key isn&apos;t set here, the
            hosting environment variable is used.
          </p>
        </div>

        {!secretBoxReady() ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] leading-[1.6] text-red-800">
            <b>KEY_ENCRYPTION_KEY isn&apos;t set in hosting.</b> Keys can&apos;t be saved from the panel until it is. Add a random
            value of 32+ characters (for example the output of <code className="font-mono">openssl rand -base64 48</code>) to the
            hosting environment once, then redeploy. Never change it afterwards — stored keys would become unreadable.
          </div>
        ) : null}
        {!canEdit ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E5E2] bg-white px-5 py-3 text-[13px] text-[#3F3F3F]">
            <Lock className="h-4 w-4 text-[#6E6E6A]" aria-hidden /> Only an owner can connect or replace keys. You can see their status.
          </div>
        ) : null}

        {groups.map((group) => (
          <SectionCard key={group} title={group} flush>
            <ul className="divide-y divide-[#E5E5E2]">
              {providers
                .filter((p) => p.group === group)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/admin-panel/integrations/${p.id}`}
                      className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition hover:bg-[#FAFAF9]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F3] text-[#3F3F3F]">
                        <KeyRound className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-[200px] flex-1">
                        <p className="text-[14px] font-semibold text-[#111111]">{p.name}</p>
                        <p className="text-[12px] text-[#6B6B6B]">{p.purpose}</p>
                      </div>
                      <span className="w-[150px] text-[12px] text-[#6B6B6B]">{sourceLabel(p)}</span>
                      <span className="w-[130px]">
                        <StatusBadge tone={STATE[p.state].tone} dot>
                          {STATE[p.state].label}
                        </StatusBadge>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-[#8A8A86] transition group-hover:text-[#2563EB]" aria-hidden />
                    </Link>
                  </li>
                ))}
            </ul>
          </SectionCard>
        ))}
      </div>
    </AdminShell>
  );
}
