import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { AdminPageHeader, SearchField, StatTile, cellMain, cellMuted, cellSub, cellText, chipCls, pillBtn, rowLink } from "@/components/admin/v5/ui";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { getIntegrationValue } from "@/lib/integrations";
import { listPrice, planResolver } from "@/lib/admin-billing";
import { planLabel, subscriptionStatusLabel } from "@/lib/admin-labels";
import { fmtDate } from "@/lib/admin-dates";
import type { PlanId } from "@/lib/plan-config";

export const dynamic = "force-dynamic";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "cancelling", label: "Cancelling" },
  { id: "past_due", label: "Past due" },
  { id: "lifetime", label: "Lifetime" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

type Row = {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  plan: PlanId;
  lifetime: boolean;
  status: string;
  paying: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  stripeSubscriptionId: string;
};

const ACTIVE = new Set(["active", "trialing", "on_trial"]);

function matches(r: Row, f: Filter): boolean {
  if (f === "active") return ACTIVE.has(r.status) && !r.cancelAtPeriodEnd;
  if (f === "cancelling") return r.paying && r.cancelAtPeriodEnd && !r.lifetime;
  if (f === "past_due") return r.status === "past_due";
  if (f === "lifetime") return r.lifetime;
  return true;
}

function requestNow() {
  return Date.now();
}

export default async function AdminSubscriptionsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 200);
  const filter: Filter = FILTERS.find((f) => f.id === sp.status)?.id ?? "all";
  const now = requestNow();

  const [subs, polarServer] = await Promise.all([
    prisma.subscription.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        userId: true,
        status: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        user: { select: { name: true, email: true } },
      },
    }),
    getIntegrationValue("polar", "server"),
  ]);
  const planOf = await planResolver(subs.map((s) => s.stripePriceId));

  const all: Row[] = subs.map((s) => {
    // One-time orders ("order:<id>") are only stored for one-time products, i.e. Lifetime.
    const plan: PlanId = s.stripeSubscriptionId.startsWith("order:") ? "lifetime" : planOf(s.stripePriceId);
    return {
      id: s.id,
      userId: s.userId,
      email: s.user.email,
      name: s.user.name,
      plan,
      lifetime: plan === "lifetime" || s.stripeSubscriptionId.startsWith("order:"),
      status: s.status.toLowerCase(),
      paying: subscriptionRowGrantsPaid({ status: s.status, currentPeriodEnd: s.currentPeriodEnd }),
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      currentPeriodEnd: s.currentPeriodEnd,
      stripeSubscriptionId: s.stripeSubscriptionId,
    };
  });

  // KPIs from the same access rules the app uses, at public list prices.
  const recurringPaying = all.filter((r) => r.paying && !r.lifetime && r.status !== "past_due");
  const mrr = recurringPaying.filter((r) => !r.cancelAtPeriodEnd).reduce((a, r) => a + listPrice(r.plan), 0);
  const activeCount = all.filter((r) => matches(r, "active")).length;
  const cancellingCount = all.filter((r) => matches(r, "cancelling")).length;
  const lifetimeRows = all.filter((r) => r.lifetime && r.paying);
  const lifetimeTotal = lifetimeRows.reduce((a, r) => a + listPrice(r.plan === "none" ? "lifetime" : r.plan), 0);
  const pastDue = all.filter((r) => r.status === "past_due");
  const pastDueMrr = pastDue.filter((r) => !r.lifetime).reduce((a, r) => a + listPrice(r.plan), 0);

  const needle = q.toLowerCase();
  const rows = all.filter(
    (r) =>
      matches(r, filter) &&
      (!needle || r.email.toLowerCase().includes(needle) || (r.name ?? "").toLowerCase().includes(needle) || r.stripeSubscriptionId.toLowerCase().includes(needle)),
  );

  const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
  const polarUrl = polarServer.toLowerCase() === "sandbox" ? "https://sandbox.polar.sh/dashboard" : "https://polar.sh/dashboard";
  const hrefFor = (status: Filter) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status !== "all") p.set("status", status);
    const s = p.toString();
    return `/admin-panel/subscriptions${s ? `?${s}` : ""}`;
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: "user",
      header: "Customer",
      render: (r) => (
        <div className="min-w-0">
          <p className={`truncate ${cellMain}`}>{r.email}</p>
          {r.name ? <p className={`truncate ${cellSub}`}>{r.name}</p> : null}
        </div>
      ),
    },
    { key: "plan", header: "Plan", render: (r) => <span className={cellText}>{planLabel(r.plan)}</span> },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const s = r.lifetime && ACTIVE.has(r.status) ? { label: "Active", tone: "green" as const } : subscriptionStatusLabel(r.status, r.cancelAtPeriodEnd);
        return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>;
      },
    },
    {
      key: "period_end",
      header: "Period end",
      render: (r) => <span className={`whitespace-nowrap ${cellMuted}`}>{r.lifetime ? "—" : fmtDate(r.currentPeriodEnd, now)}</span>,
    },
    {
      key: "cancel_at_end",
      header: "Cancel at end",
      render: (r) =>
        r.lifetime ? (
          <span className={cellMuted}>—</span>
        ) : r.cancelAtPeriodEnd ? (
          <span className="text-[14px] font-bold text-[#a15c00]">Yes</span>
        ) : (
          <span className={cellText}>No</span>
        ),
    },
    {
      key: "view",
      header: "Actions",
      align: "right",
      render: (r) => (
        <Link href={`/admin-panel/users/${r.userId}`} className={rowLink} aria-label={`View ${r.email}`}>
          View
        </Link>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Subscriptions">
      <div className="space-y-5">
        <AdminPageHeader
          title="Subscriptions"
          description="Polar subscriptions and one-time orders. Amounts use public list prices."
          actions={
            <a href={polarUrl} target="_blank" rel="noopener noreferrer" className={pillBtn}>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open Polar dashboard
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          }
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile featured label="MRR" value={usd(mrr)} hint={`${recurringPaying.length - cancellingCount} renewing monthly`} />
          <StatTile label="Active" value={activeCount} hint={cancellingCount ? `${cancellingCount} cancelling` : "None cancelling"} />
          <StatTile label="Lifetime" value={lifetimeRows.length} hint={`${usd(lifetimeTotal)} total`} />
          <StatTile label="Past due" value={pastDue.length} hint={pastDue.length ? `${usd(pastDueMrr)}/mo at risk` : "No failed renewals"} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form method="get" action="/admin-panel/subscriptions" role="search" className="w-full sm:max-w-[380px]">
            {filter !== "all" ? <input type="hidden" name="status" value={filter} /> : null}
            <SearchField id="subs-search" name="q" label="Search subscriptions by email or subscription ID" placeholder="Search email or subscription ID" defaultValue={q} />
          </form>
          <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <Link key={f.id} href={hrefFor(f.id)} aria-current={filter === f.id ? "page" : undefined} className={chipCls(filter === f.id)}>
                {f.label}
              </Link>
            ))}
          </nav>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyTitle={all.length === 0 ? "No subscriptions yet" : "No subscriptions match"}
          emptyDescription={
            all.length === 0
              ? "Subscriptions appear here once users complete checkout via Polar."
              : "Try another status or clear the search."
          }
        />
      </div>
    </AdminShell>
  );
}
