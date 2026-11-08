import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Gauge, Lock, Plug, XCircle } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { getSettings } from "@/lib/app-settings";
import { integrationStatuses, providerDef } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminH1, adminLead, adminLink } from "@/components/admin/admin-ui";
import { ProductToggles } from "./product-toggles";
import { WeeklyReportCard } from "./weekly-report-card";
import { prisma } from "@/lib/prisma";
import { emailConfigured, ownerEmails } from "@/lib/owner-notify";
import { WEEKLY_REPORT_LAST_RUN_KEY } from "@/lib/weekly-report";
import { fmtDateTime } from "@/lib/admin-dates";

/** "Nov 9, 13:07 UTC · sent to 2 of 2", from the cron's last-run row. */
async function weeklyLastRun(): Promise<string | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: WEEKLY_REPORT_LAST_RUN_KEY } }).catch(() => null);
  const v = row?.value && typeof row.value === "object" ? (row.value as { at?: unknown; result?: { sent?: unknown; recipients?: unknown; skipped?: unknown } }) : null;
  if (typeof v?.at !== "string") return null;
  const r = v.result ?? {};
  const outcome =
    typeof r.skipped === "string" ? `skipped (${r.skipped})` : typeof r.sent === "number" ? `sent to ${r.sent} of ${String(r.recipients ?? r.sent)}` : "didn't finish";
  return `${fmtDateTime(new Date(v.at))} · ${outcome}`;
}

export const dynamic = "force-dynamic";

/** Providers the app can't run properly without; the rest are optional. */
const ESSENTIAL = new Set(["openai", "polar", "resend"]);

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");
  const [settings, providers, emailReady, owners, lastRun] = await Promise.all([
    getSettings(),
    integrationStatuses(),
    emailConfigured(),
    ownerEmails(),
    weeklyLastRun(),
  ]);

  // The only values that must live in hosting. Everything else is in the panel.
  const bootstrap = [
    { key: "DATABASE_URL", what: "Database connection", ok: !!process.env.DATABASE_URL, optional: false },
    { key: "AUTH_SECRET", what: "Signs sign-in sessions", ok: (process.env.AUTH_SECRET ?? "").trim().length >= 16, optional: false },
    { key: "KEY_ENCRYPTION_KEY", what: "Encrypts API keys saved in the panel", ok: secretBoxReady(), optional: false },
    { key: "ADMIN_EMAILS", what: "First owner(s) — optional once the team is set up", ok: !!process.env.ADMIN_EMAILS?.trim(), optional: true },
  ];

  // Required credentials, e.g. "Polar · webhook secret". Sign-in and analytics show as one line each.
  const lower = (s: string) => (s.startsWith("API") ? s : s.charAt(0).toLowerCase() + s.slice(1));
  // Optional site verification codes and pixels: one summary line per group.
  const optionalGroups = (["Site verification", "Pixels & tags"] as const).map((group) => {
    const list = providers.filter((p) => p.group === group);
    const set = list.filter((p) => p.state === "connected").length;
    return { id: group, label: `${group} · ${set} of ${list.length} set`, set: set > 0, essential: false };
  });
  const config = providers.flatMap((p) => {
    if (p.group === "Site verification" || p.group === "Pixels & tags") return [];
    const required = providerDef(p.id)?.required ?? [];
    const isSet = (key: string) => p.fields.find((f) => f.key === key)?.source !== "none";
    const essential = ESSENTIAL.has(p.id);
    if (p.group === "Sign-in" || p.group === "Analytics") {
      return [{ id: p.id, label: p.id === "ga4" ? "Google Analytics" : p.name, set: required.every(isSet), essential }];
    }
    return required.map((key) => ({
      id: `${p.id}.${key}`,
      label: `${p.name} · ${lower(p.fields.find((f) => f.key === key)?.label ?? key)}`,
      set: isSet(key),
      essential,
    }));
  }).concat(optionalGroups);

  const links = [
    { href: "/admin-panel/integrations", icon: Plug, title: "Integrations", text: "OpenAI, Polar, Resend, Google sign-in, analytics, site verification, pixels" },
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
          <SectionCard
            title="Configuration"
            description="Connected in Integrations. Keys are encrypted and never shown again after saving."
            flush
            action={
              <Link href="/admin-panel/integrations" className={`${adminLink} text-[13px]`}>
                Integrations →
              </Link>
            }
          >
            <ul>
              {config.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
                  <p className="lc-mono min-w-0 truncate text-[13px] text-[#121226]">{c.label}</p>
                  {c.set ? (
                    <StatusBadge tone="green">Set</StatusBadge>
                  ) : c.essential ? (
                    <StatusBadge tone="red">Missing</StatusBadge>
                  ) : (
                    <StatusBadge>Not set</StatusBadge>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          <ProductToggles switches={settings.switches} product={settings.product} canEdit={can(admin.role, "limits")} />

          <WeeklyReportCard reports={settings.reports} canEdit={can(admin.role, "limits")} emailReady={emailReady} owners={owners.length} lastRun={lastRun} />

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
                  ) : e.optional ? (
                    <StatusBadge>Not set (optional)</StatusBadge>
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
