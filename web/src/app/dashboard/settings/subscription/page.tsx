import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { SubscriptionSettingsClient } from "./subscription-settings-client";

export default async function SubscriptionPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard/settings/subscription");

  return (
    <DashboardShell email={session.email} pageTitle="Subscription">
      <SubscriptionSettingsClient />
    </DashboardShell>
  );
}
