import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { can, requireAdmin } from "@/lib/admin-guard";
import { integrationStatuses } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { AdminShell } from "@/components/admin-shell";
import { IntegrationForm } from "./integration-form";

export const dynamic = "force-dynamic";

export default async function IntegrationPage({ params }: { params: Promise<{ provider: string }> }) {
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");
  const { provider } = await params;
  const status = (await integrationStatuses()).find((p) => p.id === provider);
  if (!status) notFound();

  return (
    <AdminShell email={admin.email} pageTitle={status.name}>
      <div className="mx-auto max-w-[760px] space-y-6">
        <Link href="/admin-panel/integrations" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111]">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All integrations
        </Link>
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">{status.name}</h1>
          <p className="mt-1 text-[13px] text-[#6B6B6B]">Used for: {status.purpose}</p>
        </div>
        <IntegrationForm status={status} canEdit={can(admin.role, "secrets") && secretBoxReady()} />
      </div>
    </AdminShell>
  );
}
