import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Lock } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses, type ProviderStatus } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminEyebrow, adminH1, adminLead } from "@/components/admin/admin-ui";

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

/** Brand-neutral initial tiles, cycling through the v5 palette. */
const TILES = [
  "bg-[#111118] text-white",
  "bg-[#5440e8] text-white",
  "bg-[#c9c0ff] text-[#111118]",
  "bg-[#ff7a33] text-[#111118]",
  "bg-[#e4dfff] text-[#111118]",
];

/** What to show in the "key" column: a masked secret (••••last4), else a plain value. Never plaintext secrets. */
function keyPreview(p: ProviderStatus) {
  const f = p.fields.find((x) => x.secret && x.display) ?? p.fields.find((x) => !x.secret && !x.options && x.display);
  return f?.display ?? "";
}

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function IntegrationsPage() {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const providers = await integrationStatuses();
  const canEdit = can(admin.role, "secrets");
  const groups = [...new Set(providers.map((p) => p.group))];

  return (
    <AdminShell email={admin.email} pageTitle="Integrations">
      <div className="mx-auto max-w-[1280px]">
        <div>
          <h1 className={adminH1}>Integrations</h1>
          <p className={adminLead}>
            API keys for the services LaunchCV uses. Keys entered here take effect within a minute — no redeploy. Where a key
            isn&apos;t set here, the hosting environment variable is used.
          </p>
        </div>

        <div className="mt-[18px] flex items-start gap-3.5 rounded-[20px] bg-[#111118] px-5 py-4 text-white">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#5440e8]">
            <Lock className="h-4 w-4" aria-hidden />
          </span>
          <p className="text-[14px] leading-[21px] text-[#e4e2ee]">
            <b className="text-white">Keys are write-only.</b> After you save one it&apos;s encrypted (AES-256-GCM) before it&apos;s
            stored, and only the last 4 characters are shown again. Changing a key needs your password and authenticator code,
            and is written to the audit log.
          </p>
        </div>

        {!secretBoxReady() ? (
          <div role="alert" className="mt-3 rounded-[20px] bg-[#fbe2e3] px-5 py-4 text-[14px] leading-[1.6] text-[#8f1d22]">
            <b>KEY_ENCRYPTION_KEY isn&apos;t set in hosting.</b> Keys can&apos;t be saved from the panel until it is. Add a random
            value of 32+ characters (for example the output of <code className="lc-mono text-[13px]">openssl rand -base64 48</code>) to the
            hosting environment once, then redeploy. Never change it afterwards — stored keys would become unreadable.
          </div>
        ) : null}
        {!canEdit ? (
          <p className="mt-3 flex items-center gap-2.5 rounded-[20px] bg-white px-5 py-3.5 text-[14px] text-[#4a4862]">
            <Lock className="h-4 w-4 shrink-0 text-[#66647c]" aria-hidden /> Only an owner can connect or replace keys. You can see their status.
          </p>
        ) : null}

        {groups.map((group) => (
          <section key={group} aria-labelledby={`grp-${group}`}>
            <h2 id={`grp-${group}`} className={`${adminEyebrow} mb-2 mt-[22px]`}>
              {group}
            </h2>
            <ul className="lc-card overflow-hidden rounded-[22px]">
              {providers
                .filter((p) => p.group === group)
                .map((p) => {
                  const i = providers.indexOf(p);
                  const key = keyPreview(p);
                  const connected = p.state === "connected";
                  return (
                    <li key={p.id} className="border-t border-[#e2e0ea] first:border-t-0">
                      <Link
                        href={`/admin-panel/integrations/${p.id}`}
                        className="group grid grid-cols-[40px_1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-4 transition-colors hover:bg-[#f7f6fb] focus-visible:rounded-none! focus-visible:outline-offset-[-3px]! sm:px-5 lg:grid-cols-[40px_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto]"
                      >
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-[16px] font-extrabold ${TILES[i % TILES.length]}`} aria-hidden>
                          {p.name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <b className="block text-[15px] text-[#121226]">{p.name}</b>
                          <span className="block text-[13px] leading-[1.4] text-[#66647c]">{p.purpose}</span>
                        </span>
                        <span className="col-start-2 row-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 lg:contents">
                          <span className="lg:col-start-3 lg:row-start-1">
                            <StatusBadge tone={STATE[p.state].tone} dot>
                              {STATE[p.state].label}
                            </StatusBadge>
                          </span>
                          <span className="lc-mono min-w-0 truncate text-[12px] text-[#4a4862] lg:col-start-4 lg:row-start-1">{key || "—"}</span>
                          <span className="min-w-0 text-[13px] leading-[1.4] lg:col-start-5 lg:row-start-1">
                            {p.state === "error" && p.testError ? (
                              <span className="text-[#a3262b]">{p.testError}</span>
                            ) : (
                              <span className="text-[#66647c]">
                                {sourceLabel(p)}
                                {p.testedAt ? <span className="block">Tested {dateFmt.format(new Date(p.testedAt))}</span> : null}
                              </span>
                            )}
                          </span>
                        </span>
                        <span
                          className={`col-start-3 row-start-1 inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 text-[14px] sm:px-4 font-semibold transition-colors lg:col-start-6 ${
                            connected
                              ? "bg-[#f1eff8] text-[#121226] group-hover:bg-[#e4dfff]"
                              : "bg-[#111118] text-white group-hover:bg-[#2a2940]"
                          }`}
                        >
                          <span className="hidden sm:inline">{p.state === "missing" ? "Connect" : "Manage"}</span>
                          <span className="sr-only sm:hidden">{p.state === "missing" ? "Connect" : "Manage"}</span>
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
