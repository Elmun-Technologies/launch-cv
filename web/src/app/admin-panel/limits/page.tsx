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
      <div className="mx-auto max-w-[1280px]">
        <LimitsForm initial={settings} spend={spend} tools={tools} models={[...AI_MODELS]} />
      </div>
    </AdminShell>
  );
}
