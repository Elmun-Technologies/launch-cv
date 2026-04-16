import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ReferralsClient, type ReferralRow } from "./referrals-client";

export default async function ReferralsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const referrals = await prisma.referral.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  const initial: ReferralRow[] = referrals.map((r) => ({
    id: r.id,
    code: r.code,
    referredEmail: r.referredEmail,
    status: r.status,
    creditAmount: r.creditAmount,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <DashboardShell pageTitle="Referrals" email={session.email}>
      <ReferralsClient initial={initial} />
    </DashboardShell>
  );
}
