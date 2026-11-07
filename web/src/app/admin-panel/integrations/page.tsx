import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses, type ProviderStatus } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { nowMs, relativeTime } from "@/lib/relative-time";
import { AdminShell } from "@/components/admin-shell";
import { adminH1, adminLead } from "@/components/admin/admin-ui";
import { IntegrationsList, type IntegrationRow } from "./integrations-list";

export const dynamic = "force-dynamic";

function sourceLabel(p: ProviderStatus) {
  const sources = new Set(p.fields.filter((f) => f.source !== "none").map((f) => f.source));
  if (!sources.size) return "—";
  if (sources.size === 2) return "Panel + hosting env";
  return sources.has("panel") ? "Admin panel" : "Hosting env";
}

/** What to show in the "key" column: a masked secret (••••last4), else a plain value. Never plaintext secrets. */
function keyPreview(p: ProviderStatus) {
  const f = p.fields.find((x) => x.secret && x.display) ?? p.fields.find((x) => !x.secret && !x.options && x.display);
  return f?.display ?? "";
}

export default async function IntegrationsPage() {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const providers = await integrationStatuses();
  const canEdit = can(admin.role, "secrets");
  const now = nowMs();

  const rows: IntegrationRow[] = providers.map((p) => ({
    id: p.id,
    name: p.name,
    group: p.group,
    purpose: p.purpose,
    tile: p.tile,
    state: p.state,
    keyPreview: keyPreview(p),
    source: sourceLabel(p),
    testedLabel: p.testedAt ? relativeTime(p.testedAt, now) : null,
    testMs: p.testMs,
    testError: p.testError,
  }));

  return (
    <AdminShell email={admin.email} pageTitle="Integrations">
      <div className="mx-auto max-w-[1280px]">
        <IntegrationsList
          rows={rows}
          canTest={can(admin.role, "limits")}
          intro={
            <>
              <h1 className={adminH1}>Integrations</h1>
              <p className={adminLead}>
                Connect and rotate every external service here. Keys entered here take effect within a minute — no redeploy.
                Where a key isn&apos;t set here, the hosting environment variable is used.
              </p>
            </>
          }
          notices={
            <>
              <div className="mt-[18px] flex items-start gap-3.5 rounded-[20px] bg-[#111118] px-5 py-4 text-white">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#5440e8]">
                  <Lock className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-[14px] leading-[21px] text-[#e4e2ee]">
                  <b className="text-white">Keys are write-only.</b>{" "}
                  After you save one it&apos;s encrypted (AES-256-GCM) before it&apos;s stored, and only the last 4 characters are
                  shown again. Changing a key needs your password and authenticator code, and is written to the audit log.
                </p>
              </div>

              {!secretBoxReady() ? (
                <div role="alert" className="mt-3 rounded-[20px] bg-[#fbe2e3] px-5 py-4 text-[14px] leading-[1.6] text-[#8f1d22]">
                  <b>KEY_ENCRYPTION_KEY isn&apos;t set in hosting.</b> Keys can&apos;t be saved from the panel until it is. Add a random
                  value of 32+ characters (for example the output of <code className="lc-mono text-[13px]">openssl rand -base64 48</code>) to
                  the hosting environment once, then redeploy. To change it later, run{" "}
                  <code className="lc-mono text-[13px]">scripts/rotate-key-encryption-key.ts</code> first, or stored keys become unreadable.
                </div>
              ) : null}
              {!canEdit ? (
                <p className="mt-3 flex items-center gap-2.5 rounded-[20px] bg-white px-5 py-3.5 text-[14px] text-[#4a4862]">
                  <Lock className="h-4 w-4 shrink-0 text-[#66647c]" aria-hidden /> Only an owner can connect or replace keys. You can see
                  their status and run tests.
                </p>
              ) : null}
            </>
          }
        />
      </div>
    </AdminShell>
  );
}
