import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses, type ProviderStatus } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { IntegrationForm } from "./integration-form";

export const dynamic = "force-dynamic";

const STATE: Record<ProviderStatus["state"], { label: string; tone: "green" | "amber" | "red" | "default" }> = {
  connected: { label: "Connected", tone: "green" },
  partial: { label: "Incomplete", tone: "amber" },
  error: { label: "Test failed", tone: "red" },
  missing: { label: "Not connected", tone: "default" },
};

export default async function IntegrationPage({ params }: { params: Promise<{ provider: string }> }) {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const { provider } = await params;
  const status = (await integrationStatuses()).find((p) => p.id === provider);
  if (!status) notFound();

  return (
    <AdminShell email={admin.email} pageTitle={status.name}>
      <div className="mx-auto max-w-[1280px]">
        <Link
          href="/admin-panel/integrations"
          className="group inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-0"
        >
          <ArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden /> Integrations
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3.5">
          <span className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[#111118] text-[22px] font-extrabold text-white" aria-hidden>
            {status.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#121226] sm:text-[30px]">{status.name}</h1>
            <p className="mt-0.5 text-[14px] text-[#4a4862]">Used for: {status.purpose}</p>
          </div>
          <StatusBadge tone={STATE[status.state].tone} dot>
            {STATE[status.state].label}
          </StatusBadge>
        </div>
        <div className="mt-5">
          <IntegrationForm status={status} canEdit={can(admin.role, "secrets") && secretBoxReady()} />
        </div>
      </div>
    </AdminShell>
  );
}
