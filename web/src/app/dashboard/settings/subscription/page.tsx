import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard-shell";
import { SubscriptionSettingsClient } from "./subscription-settings-client";
import { CheckoutSuccessScreen } from "./checkout-success-screen";
import { getSettings } from "@/lib/app-settings";

export default async function SubscriptionPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/settings/subscription");

  // Back from Polar: a standalone success screen, without the billing page under it.
  if ((await searchParams).checkout === "success") {
    const latest = await prisma.resume.findFirst({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    return <CheckoutSuccessScreen email={session.email} resumeId={latest?.id ?? null} />;
  }

  return (
    <DashboardShell email={session.email} pageTitle="Subscription">
      <SubscriptionSettingsClient limits={(await getSettings()).planLimits} />
    </DashboardShell>
  );
}
