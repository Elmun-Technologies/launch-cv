import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteUrl } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ReferralsClient, type ReferralRow } from "./referrals-client";

/**
 * Origin for share links: the configured site URL, unless that points at
 * localhost (a dev or misconfigured env) — then the host this page was served from.
 */
async function shareOrigin(): Promise<string> {
  const site = getSiteUrl();
  if (!/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(site)) return site;
  const h = await headers();
  const host = h.get("x-forwarded-host")?.split(",")[0]?.trim() || h.get("host");
  if (!host) return site;
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || (/^(localhost|127\.|\[::1\])/.test(host) ? "http" : "https");
  return `${proto}://${host}`;
}

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
      <ReferralsClient initial={initial} origin={await shareOrigin()} />
    </DashboardShell>
  );
}
