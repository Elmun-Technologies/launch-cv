import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses, type ProviderStatus } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AI_TOOL_LABELS, getSettings, type AiTool } from "@/lib/app-settings";
import { currentSpend } from "@/lib/ai-budget";
import { nowMs, relativeTime } from "@/lib/relative-time";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { SectionCard } from "@/components/admin/section-card";
import { adminLink } from "@/components/admin/admin-ui";
import { IntegrationForm, IntegrationHeaderActions } from "./integration-form";

export const dynamic = "force-dynamic";

const STATE: Record<ProviderStatus["state"], { label: string; tone: "green" | "amber" | "red" | "default" }> = {
  connected: { label: "Connected", tone: "green" },
  partial: { label: "Incomplete", tone: "amber" },
  error: { label: "Test failed", tone: "red" },
  missing: { label: "Not connected", tone: "default" },
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** OpenAI only: this month's spend against the cap, a straight-line projection, and the model per tool. Read-only. */
async function BudgetAndModels() {
  const [settings, spend] = await Promise.all([getSettings(), currentSpend()]);
  const now = new Date();
  const day = now.getUTCDate();
  const daysInMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  const projected = (spend.month / Math.max(1, day)) * daysInMonth;
  const cap = settings.budget.monthlyCapUsd;
  const pct = cap > 0 ? Math.min(100, (spend.month / cap) * 100) : 0;
  const over = cap > 0 && projected > cap;
  // Compact: one line per model with the tools that use it.
  const byModel = new Map<string, string[]>();
  for (const t of Object.keys(AI_TOOL_LABELS) as AiTool[]) byModel.set(settings.models[t], [...(byModel.get(settings.models[t]) ?? []), AI_TOOL_LABELS[t]]);
  return (
    <SectionCard
      title="Budget & models"
      description="Read only. Change caps and models in Limits & budgets."
      action={
        <Link href="/admin-panel/limits" className={`${adminLink} inline-flex items-center gap-1 text-[13px]`}>
          Limits & budgets <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      }
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#66647c]">This month (UTC)</p>
      <p className="mt-1 text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] tabular-nums text-[#121226]">
        {usd(spend.month)}
        <span className="text-[15px] font-bold text-[#66647c]"> / {cap > 0 ? usd(cap) : "no cap"}</span>
      </p>
      {cap > 0 ? (
        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#efedf7]" role="progressbar" aria-label="Monthly cap used" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div className={`h-full rounded-full ${pct >= 100 ? "bg-[#c42b30]" : pct >= 80 ? "bg-[#c77700]" : "bg-[#5440e8]"}`} style={{ width: `${pct}%` }} />
        </div>
      ) : null}
      <p className={`mt-2 text-[13px] ${over ? "font-semibold text-[#a3262b]" : "text-[#4a4862]"}`}>
        At this pace: ~{usd(projected)} by month end{over ? " — over the cap" : ""}.
      </p>
      <h3 className="mt-4 border-t border-[#e2e0ea] pt-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[#66647c]">Model per tool</h3>
      <ul className="mt-1">
        {[...byModel.entries()].map(([model, names]) => (
          <li key={model} className="flex items-start gap-3 py-1.5 text-[13px] leading-[1.5]">
            <span className="lc-mono shrink-0 rounded-full bg-[#f1eff8] px-2.5 py-0.5 text-[12px] text-[#121226]">{model}</span>
            <span className="min-w-0 text-[#4a4862]">{names.join(", ")}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export default async function IntegrationPage({ params }: { params: Promise<{ provider: string }> }) {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const { provider } = await params;
  const status = (await integrationStatuses()).find((p) => p.id === provider);
  if (!status) notFound();

  const people = status.key
    ? await prisma.user.findMany({
        where: { id: { in: [status.key.addedById, status.key.updatedById].filter((x): x is string => !!x) } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const who = (id: string | null) => {
    const u = people.find((p) => p.id === id);
    return u ? u.name?.split(" ")[0] || u.email : "an owner";
  };
  const meta = status.key
    ? {
        label: status.key.label,
        added: `Added ${dateFmt.format(new Date(status.key.addedAt))} by ${who(status.key.addedById)}`,
        rotated: status.key.rotatedAt ? `${dateFmt.format(new Date(status.key.rotatedAt))} by ${who(status.key.updatedById)}` : "never",
      }
    : null;

  const now = nowMs();
  const lastTest = status.testedAt
    ? `Last test ${status.testError ? "failed" : "passed"} ${relativeTime(status.testedAt, now)}${status.testMs != null ? ` · ${status.testMs.toLocaleString("en-US")} ms` : ""}.`
    : "Not tested yet.";
  const canEdit = can(admin.role, "secrets") && secretBoxReady();
  const hasPanelValues = status.fields.some((f) => f.source === "panel");

  return (
    <AdminShell email={admin.email} pageTitle={status.name}>
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/admin-panel/integrations"
          className="group inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-0"
        >
          <ArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden /> Integrations
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3.5">
            <span
              className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl text-[22px] font-extrabold"
              style={{ background: status.tile.bg, color: status.tile.fg }}
              aria-hidden
            >
              {status.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <h1 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#121226] sm:text-[30px]">{status.name}</h1>
              <p className="mt-0.5 text-[14px] text-[#4a4862]">
                Used for: {status.purpose}. {lastTest}
              </p>
            </div>
            <StatusBadge tone={STATE[status.state].tone} dot>
              {STATE[status.state].label}
            </StatusBadge>
          </div>
          <IntegrationHeaderActions
            provider={status.id}
            name={status.name}
            canTest={status.state !== "missing"}
            canDisconnect={canEdit && hasPanelValues}
            envFallback={status.fields.some((f) => f.source === "env")}
          />
        </div>
        <div className="mt-5">
          <IntegrationForm status={status} canEdit={canEdit} keyMeta={meta} aside={status.id === "openai" || status.id === "anthropic" ? <BudgetAndModels /> : null} />
        </div>
      </div>
    </AdminShell>
  );
}
