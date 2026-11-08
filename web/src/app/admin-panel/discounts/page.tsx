import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader, pillBtn } from "@/components/admin/v5/ui";
import { adminLink } from "@/components/admin/admin-ui";
import { getIntegrationValue } from "@/lib/integrations";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { discountDurationLabel, discountPlanNames, discountValueLabel, redemptionsLabel } from "@/lib/polar-discounts";
import { listPolarDiscounts, polarConnected, productPlanMap, soldPlanProductIds } from "@/lib/polar-discounts-server";
import { DiscountsClient, type DiscountRow } from "./discounts-client";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

export default async function AdminDiscountsPage() {
  // Discount codes change what customers pay: owners and admins only, like limits and budgets.
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");

  const [connected, server, productIds] = await Promise.all([polarConnected(), getIntegrationValue("polar", "server"), soldPlanProductIds()]);
  const list = connected ? await listPolarDiscounts() : null;
  const discounts = list?.ok ? list.data : [];
  const planOf = await productPlanMap(discounts);
  const now = requestNow();

  const rows: DiscountRow[] = discounts.map((d) => ({
    id: d.id,
    code: d.code ?? d.name,
    value: discountValueLabel(d),
    duration: discountDurationLabel(d),
    plans: discountPlanNames(d.products, (id) => planOf.get(id) ?? null, (p) => PUBLIC_PLANS[p].title),
    used: redemptionsLabel(d),
    full: d.max_redemptions != null && d.redemptions_count >= d.max_redemptions,
    endsAt: d.ends_at,
    expired: !!d.ends_at && new Date(d.ends_at).getTime() <= now,
  }));

  const sandbox = server.toLowerCase() === "sandbox";
  const polarUrl = sandbox ? "https://sandbox.polar.sh/dashboard" : "https://polar.sh/dashboard";
  const plans = CHECKOUT_PLAN_ORDER.map((id) => ({ id, title: PUBLIC_PLANS[id].title, price: PUBLIC_PLANS[id].priceDisplay, ready: !!productIds[id] }));

  return (
    <AdminShell email={admin.email} pageTitle="Discounts">
      <div className="space-y-5">
        <AdminPageHeader
          title="Discounts"
          description={`Polar discount codes${sandbox ? " (sandbox)" : ""}. Buyers enter the code on the Polar payment step.`}
          actions={
            <a href={polarUrl} target="_blank" rel="noopener noreferrer" className={pillBtn}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open Polar dashboard
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          }
        />

        {!connected ? (
          <div role="status" className="rounded-[24px] bg-[#fdf0d5] px-5 py-4 text-[14px] text-[#7a4600] sm:px-6">
            Polar isn&apos;t connected, so codes can&apos;t be listed or created.{" "}
            <Link href="/admin-panel/integrations/polar" className={adminLink}>
              Connect Polar
            </Link>
          </div>
        ) : list && !list.ok ? (
          <div role="alert" className="rounded-[24px] bg-[#fbe2e3] px-5 py-4 text-[14px] font-semibold text-[#a3262b] sm:px-6">
            Couldn&apos;t load codes from Polar: {list.error}
          </div>
        ) : null}

        <DiscountsClient rows={rows} plans={plans} disabled={!connected} />
      </div>
    </AdminShell>
  );
}
