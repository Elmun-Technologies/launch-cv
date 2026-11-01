import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AI_MODELS, AI_TOOL_LABELS, getSettings, type AiTool } from "@/lib/app-settings";
import { currentSpend } from "@/lib/ai-budget";
import { AdminShell } from "@/components/admin-shell";
import { LimitsForm } from "./limits-form";

export const dynamic = "force-dynamic";

export default async function LimitsPage() {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [settings, spend, byTool] = await Promise.all([
    getSettings(),
    currentSpend(),
    prisma.aiCall.groupBy({
      by: ["tool"],
      where: { createdAt: { gte: monthStart } },
      _sum: { costMicros: true },
      _count: { _all: true },
    }),
  ]);
  const tools = (Object.keys(AI_TOOL_LABELS) as AiTool[]).map((t) => {
    const row = byTool.find((r) => r.tool === t);
    return { tool: t, label: AI_TOOL_LABELS[t], calls: row?._count._all ?? 0, usd: (row?._sum.costMicros ?? 0) / 1_000_000 };
  });

  return (
    <AdminShell email={admin.email} pageTitle="Limits & budgets">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">Limits &amp; budgets</h1>
          <p className="mt-1 max-w-[720px] text-[13px] leading-[1.6] text-[#6B6B6B]">
            Spend caps, plan quotas, rate limits, models and emergency switches. Changes apply within 30 seconds and are
            written to the audit log.
          </p>
        </div>
        <LimitsForm initial={settings} spend={spend} tools={tools} models={[...AI_MODELS]} />
      </div>
    </AdminShell>
  );
}
