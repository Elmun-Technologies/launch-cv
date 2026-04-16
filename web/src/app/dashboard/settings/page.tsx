import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  const sub = await prisma.subscription.findUnique({ where: { userId: session.sub } });

  return (
    <DashboardShell pageTitle="Overview" email={session.email}>
      <SettingsClient
        emailVerified={!!user?.emailVerifiedAt}
        subscription={sub ? { status: sub.status, currentPeriodEnd: sub.currentPeriodEnd?.toISOString() ?? null } : null}
        userName={user?.name}
        userEmail={user?.email}
      />
    </DashboardShell>
  );
}
