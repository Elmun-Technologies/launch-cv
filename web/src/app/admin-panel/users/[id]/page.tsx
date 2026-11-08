import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { can, isAdminUser, requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, Avatar, StatTile, rowLink } from "@/components/admin/v5/ui";
import { billingOf, listPrice, planResolver } from "@/lib/admin-billing";
import { appStatusBadge, isStaffRole, planLabel, regionLabel, roleLabel, verticalLabel } from "@/lib/admin-labels";
import { fmtAgo, fmtDate, fmtDateLong, fmtDateTime } from "@/lib/admin-dates";
import { planLimits } from "@/lib/app-settings";
import { monthKey } from "@/lib/usage-limits";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { UserDetailActions, UserHeaderActions } from "./actions";

export const dynamic = "force-dynamic";

/** What a tracked event means, in words (events come from lib/analytics.ts `trackEvent`). */
const EVENT_LABELS: Record<string, string> = {
  signup: "Signed up",
  login_success: "Signed in",
  google_account_linked: "Linked Google sign-in",
  email_verified: "Verified their email",
  email_verify_sent: "Was sent a verification email",
  password_reset_requested: "Asked for a password reset",
  password_reset_done: "Reset their password",
  resume_created: "Created a resume",
  resume_deleted: "Deleted a resume",
  resume_snapshot: "Saved a resume version",
  resume_snapshot_restore: "Restored a resume version",
  jd_run: "Ran job match",
  role_fit: "Ran a role-fit check",
  packet: "Generated a packet",
  impact_rewrite: "Rewrote bullets",
  evidence_check: "Ran a consistency check",
  pdf_export: "Downloaded a PDF",
  docx_export: "Downloaded a Word file",
  cover_letter_docx_export: "Downloaded a cover letter",
  checkout_started: "Started checkout",
  pay_success: "Paid",
  account_export: "Exported their account data",
  account_delete: "Asked to delete their account",
  satisfaction_survey: "Answered the satisfaction survey",
  free_ats_check: "Ran the free ATS check",
};
/** Noise that says nothing about what the user did. */
const HIDDEN_EVENTS = new Set(["email_verify_skipped"]);

const AUDIT_LABELS: Record<string, string> = {
  "user.role.change": "Role changed by staff",
  "user.plan.grant": "Plan granted by staff",
  "user.plan.revoke": "Granted plan removed by staff",
  "user.usage.reset": "AI usage reset by staff",
  "user.suspend": "Suspended by staff",
  "user.unsuspend": "Access restored by staff",
};

function eventLabel(name: string, meta: unknown): string {
  const m = (meta ?? {}) as { provider?: string; plan?: string };
  if (name === "signup" && m.provider === "google") return "Signed up with Google";
  if (name === "pay_success" && m.plan && m.plan in PUBLIC_PLANS) return `Paid for ${PUBLIC_PLANS[m.plan as keyof typeof PUBLIC_PLANS].title}`;
  return EVENT_LABELS[name] ?? name.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function auditLabel(action: string, diff: unknown): string {
  const d = (diff ?? {}) as { to?: unknown };
  const base = AUDIT_LABELS[action] ?? action;
  if (action === "user.role.change" && typeof d.to === "string") return `${base}: ${roleLabel(d.to)}`;
  if (action === "user.plan.grant" && d.to && typeof d.to === "object") {
    const to = d.to as { plan?: string; until?: string | null };
    return `${base}: ${planLabel(to.plan)}${to.until ? ` until ${fmtDateLong(to.until)}` : ""}`;
  }
  return base;
}

function requestNow() {
  return Date.now();
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");

  const { id } = await params;
  const now = requestNow();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      resumes: {
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: { id: true, title: true, vertical: true, regionMode: true, updatedAt: true },
      },
      jobApplications: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, company: true, status: true, createdAt: true },
      },
      subscription: true,
      _count: { select: { resumes: true, jobApplications: true } },
    },
  });
  if (!user) notFound();

  const [interviewing, jdRuns, usage, payEvents, events, audits] = await Promise.all([
    prisma.jobApplication.count({ where: { userId: id, status: { in: ["interviewing", "interview"] } } }),
    prisma.jdRun.findMany({
      where: { resume: { userId: id } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { result: true },
    }),
    prisma.usageMonth.findUnique({ where: { userId_month: { userId: id, month: monthKey() } } }),
    prisma.analyticsEvent.findMany({ where: { userId: id, name: "pay_success" }, select: { meta: true } }),
    prisma.analyticsEvent.findMany({
      where: { userId: id, name: { notIn: [...HIDDEN_EVENTS] } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, meta: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { entity: "User", entityId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, action: true, diff: true, createdAt: true },
    }),
  ]);

  const sub = user.subscription;
  const planOf = await planResolver([sub?.stripePriceId]);
  const billing = billingOf(sub, user, planOf, now);
  const limits = await planLimits(billing.plan);

  // Purchase value at list price: each payment's own plan, else the current plan.
  const value = payEvents.reduce((a, e) => {
    const p = (e.meta as { plan?: string } | null)?.plan;
    return a + (p && p in PUBLIC_PLANS ? PUBLIC_PLANS[p as keyof typeof PUBLIC_PLANS].priceAmount : listPrice(billing.plan));
  }, 0);

  const scores = jdRuns
    .map((r) => (r.result as { match_score?: unknown } | null)?.match_score)
    .filter((s): s is number => typeof s === "number" && Number.isFinite(s));
  const bestAts = scores.length ? Math.round(Math.max(...scores)) : null;

  let planHint = "No paid plan";
  if (billing.granted) {
    planHint = user.grantedPlanUntil ? `Granted until ${fmtDateLong(user.grantedPlanUntil)}` : "Granted · no end date";
  } else if (billing.oneTime && billing.paying) {
    planHint = sub?.currentPeriodEnd ? `Pass · ends ${fmtDate(sub.currentPeriodEnd, now)}` : "One-time purchase · no end date";
  } else if (billing.status === "expired" && sub?.currentPeriodEnd) planHint = `Pass ended ${fmtDate(sub.currentPeriodEnd, now)}`;
  else if (billing.status === "past_due") planHint = "Payment past due";
  else if (billing.paying && sub?.currentPeriodEnd) {
    planHint = `${sub.cancelAtPeriodEnd ? "Ends" : "Renews"} ${fmtDate(sub.currentPeriodEnd, now)}`;
  } else if (sub && !billing.paying) planHint = `Subscription ${sub.status}`;

  const meters = [
    { label: "Job-post analyses", used: usage?.jdCount ?? 0, max: limits.jd },
    { label: "Role-fit checks", used: usage?.roleFitCount ?? 0, max: limits.roleFit },
    { label: "Packets", used: usage?.packetCount ?? 0, max: limits.packet },
  ];
  const usedThisMonth = meters.reduce((a, m) => a + m.used, 0);

  const activity = [
    ...events.map((e) => ({ id: e.id, text: eventLabel(e.name, e.meta), at: e.createdAt, staff: false })),
    ...audits.map((a) => ({ id: a.id, text: auditLabel(a.action, a.diff), at: a.createdAt, staff: true })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8);

  const signIn = user.googleId ? (user.passwordHash ? "Google + email sign-in" : "Google sign-in") : "Email sign-in";
  const staffTarget = isAdminUser(user);
  const canSuspend = user.id !== admin.sub && (!staffTarget || admin.role === "owner");
  const grantedUntil = user.grantedPlanUntil ? user.grantedPlanUntil.toISOString().slice(0, 10) : null;

  const fields: Array<{ label: string; value: string; mono?: boolean }> = [
    { label: "User ID", value: user.id, mono: true },
    { label: "Email", value: user.email },
    { label: "Name", value: user.name ?? "—" },
    { label: "Role", value: roleLabel(user.role) },
    { label: "Sign-in", value: signIn },
    { label: "Email verified", value: user.emailVerifiedAt ? fmtDateLong(user.emailVerifiedAt) : "Not verified" },
    { label: "Two-factor", value: user.totpEnabledAt ? `On since ${fmtDateLong(user.totpEnabledAt)}` : "Off" },
    { label: "Suspended", value: user.suspendedAt ? `Since ${fmtDateTime(user.suspendedAt, now)} UTC` : "No" },
    {
      label: "Granted plan",
      value: user.grantedPlan
        ? `${planLabel(user.grantedPlan)}${user.grantedPlanUntil ? ` until ${fmtDateLong(user.grantedPlanUntil)}` : ""}`
        : "—",
    },
    { label: "Billing customer ID", value: sub?.stripeCustomerId ?? user.stripeCustomerId ?? "—", mono: true },
    { label: "Subscription ID", value: sub?.stripeSubscriptionId ?? "—", mono: true },
    { label: "Subscription status", value: sub ? `${sub.status}${sub.cancelAtPeriodEnd ? " · cancels at period end" : ""}` : "—" },
    { label: "Period end", value: sub?.currentPeriodEnd ? fmtDateLong(sub.currentPeriodEnd) : "—" },
    { label: "Created", value: `${fmtDateTime(user.createdAt, now)} UTC` },
    { label: "Updated", value: `${fmtDateTime(user.updatedAt, now)} UTC` },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="User detail">
      <div className="space-y-5">
        <AdminPageHeader
          back={{ href: "/admin-panel/users", label: "Users" }}
          leading={<Avatar name={user.name} email={user.email} size="lg" />}
          title={user.name || user.email}
          description={
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 break-words">
              <span>
                {user.name ? `${user.email} · ` : ""}joined {fmtDateLong(user.createdAt)} · {signIn}
              </span>
              {isStaffRole(user.role) ? <StatusBadge tone="slate">{roleLabel(user.role)}</StatusBadge> : null}
              {user.suspendedAt ? <StatusBadge tone="red">Suspended</StatusBadge> : null}
            </span>
          }
          actions={
            <UserHeaderActions
              userId={user.id}
              grantedPlan={user.grantedPlan}
              grantedUntil={grantedUntil}
              suspended={!!user.suspendedAt}
              canSuspend={canSuspend}
              usageThisMonth={usedThisMonth}
            />
          }
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile featured label="Plan" value={planLabel(billing.plan)} hint={planHint} />
          <StatTile
            label="Value"
            value={`$${value.toLocaleString("en-US")}`}
            hint={payEvents.length ? `${payEvents.length} payment${payEvents.length === 1 ? "" : "s"} · list prices` : "No payments recorded"}
          />
          <StatTile label="Resumes" value={user._count.resumes} hint={bestAts !== null ? `best ATS ${bestAts}` : "No job-match score yet"} />
          <StatTile label="Applications" value={user._count.jobApplications} hint={`${interviewing} interviewing`} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="AI usage this month" description={`${planLabel(billing.plan)} plan limits · resets on the 1st`}>
            <ul className="space-y-3.5">
              {meters.map((m) => {
                const pct = m.max > 0 ? Math.min(100, (m.used / m.max) * 100) : 0;
                return (
                  <li key={m.label}>
                    <div className="flex justify-between gap-3 text-[13px] text-[#4a4862]">
                      <span>{m.label}</span>
                      <span className="tabular-nums">
                        {m.used.toLocaleString("en-US")}/{m.max.toLocaleString("en-US")}
                      </span>
                    </div>
                    <div
                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f1eff8]"
                      role="progressbar"
                      aria-label={m.label}
                      aria-valuemin={0}
                      aria-valuemax={Math.max(m.max, m.used)}
                      aria-valuenow={m.used}
                      aria-valuetext={`${m.used} of ${m.max} used`}
                    >
                      <div className={`h-full rounded-full ${pct >= 80 ? "bg-[#f2a91f]" : "bg-[#5440e8]"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            {billing.plan === "none" ? (
              <p className="mt-4 text-[13px] text-[#66647c]">Free accounts have no AI quota; the counters only fill on a paid or granted plan.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Activity" description="Tracked events and staff actions, newest first" flush>
            {activity.length === 0 ? (
              <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No activity recorded yet.</p>
            ) : (
              <ul>
                {activity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-5 py-2.5 text-[14px] first:border-t-0 sm:px-6">
                    <span className="min-w-0 break-words">
                      {a.text}
                      {a.staff ? <span className="sr-only"> (staff action)</span> : null}
                    </span>
                    <time dateTime={a.at.toISOString()} title={`${fmtDateTime(a.at, now)} UTC`} className="shrink-0 text-[13px] text-[#66647c]">
                      {fmtAgo(a.at, now)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard title="Resumes" description={`${user._count.resumes} total · 5 most recent`} flush>
            {user.resumes.length === 0 ? (
              <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No resumes.</p>
            ) : (
              <ul>
                {user.resumes.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#121226]">{r.title}</p>
                      <p className="truncate text-[12px] text-[#66647c]">
                        {verticalLabel(r.vertical)} · {regionLabel(r.regionMode)}
                      </p>
                    </div>
                    <p className="shrink-0 text-[13px] text-[#66647c]">{fmtAgo(r.updatedAt, now)}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Applications"
            description={`${user._count.jobApplications} total · 5 most recent`}
            flush
            action={
              user._count.jobApplications > 0 ? (
                <Link href="/admin-panel/applications" className={rowLink}>
                  All applications
                </Link>
              ) : undefined
            }
          >
            {user.jobApplications.length === 0 ? (
              <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No applications.</p>
            ) : (
              <ul>
                {user.jobApplications.map((a) => {
                  const b = appStatusBadge(a.status);
                  return (
                    <li
                      key={a.id}
                      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#121226]">{a.title || "Untitled"}</p>
                        {a.company ? <p className="truncate text-[12px] text-[#66647c]">{a.company}</p> : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <StatusBadge tone={b.tone}>{b.label}</StatusBadge>
                        <p className="text-[13px] text-[#66647c]">{fmtDate(a.createdAt, now)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>

        <details className="group lc-card overflow-hidden rounded-[24px]">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[18px] font-extrabold tracking-[-0.01em] text-[#121226] sm:px-6 [&::-webkit-details-marker]:hidden">
            Details
            <span className="flex items-center gap-2 text-[13px] font-semibold text-[#66647c]">
              Account fields, role and deletion
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>
          <div className="grid gap-5 border-t border-[#e2e0ea] p-4 sm:p-5 lg:grid-cols-3">
            <dl className="min-w-0 rounded-[20px] bg-[#f7f6fb] lg:col-span-2">
              {fields.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col gap-0.5 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                >
                  <dt className="text-[13px] font-semibold text-[#4a4862]">{f.label}</dt>
                  <dd className={`min-w-0 break-all text-[14px] text-[#121226] sm:max-w-[60%] sm:text-right ${f.mono ? "lc-mono text-[13px]" : ""}`}>
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            <UserDetailActions userId={user.id} currentRole={user.role} canChangeRole={can(admin.role, "roles")} />
          </div>
        </details>
      </div>
    </AdminShell>
  );
}

