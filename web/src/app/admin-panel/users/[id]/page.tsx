import { redirect, notFound } from "next/navigation";
import { FileText, Briefcase, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { can, requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import { AdminPageHeader, Avatar, StatTile } from "@/components/admin/v5/ui";
import { UserDetailActions } from "./actions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      resumes: {
        orderBy: { updatedAt: "desc" },
        take: 10,
        select: { id: true, title: true, vertical: true, updatedAt: true },
      },
      jobApplications: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, company: true, status: true, createdAt: true },
      },
      subscription: true,
    },
  });

  if (!user) notFound();

  const fields: Array<{ label: string; value: string; mono?: boolean }> = [
    { label: "User ID", value: user.id, mono: true },
    { label: "Email", value: user.email },
    { label: "Name", value: user.name ?? "—" },
    { label: "Role", value: user.role },
    {
      label: "Email verified",
      value: user.emailVerifiedAt ? user.emailVerifiedAt.toLocaleDateString() : "Not verified",
    },
    { label: "Lemon customer ID", value: user.stripeCustomerId ?? "—", mono: true },
    { label: "Created", value: user.createdAt.toLocaleDateString() },
  ];

  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
  const sub = user.subscription;

  return (
    <AdminShell email={admin.email} pageTitle="User detail">
      <div className="space-y-5">
        <AdminPageHeader
          back={{ href: "/admin-panel/users", label: "Users" }}
          leading={<Avatar name={user.name} email={user.email} size="lg" />}
          title={user.name || user.email}
          description={
            <span className="break-words">
              {user.name ? `${user.email} · ` : ""}joined {dateFmt.format(user.createdAt)}
            </span>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            featured
            label="Subscription"
            value={<span className="capitalize">{sub ? sub.status : "None"}</span>}
            hint={
              sub
                ? `${sub.cancelAtPeriodEnd ? "Ends" : "Until"} ${sub.currentPeriodEnd ? dateFmt.format(sub.currentPeriodEnd) : "—"}`
                : "No subscription record"
            }
          />
          <StatTile label="Role" value={<span className="capitalize">{user.role}</span>} hint={user.emailVerifiedAt ? "Email verified" : "Email not verified"} />
          <StatTile label="Resumes" value={user.resumes.length} hint="Most recent, up to 10" />
          <StatTile label="Applications" value={user.jobApplications.length} hint="Most recent, up to 10" />
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <SectionCard title="User information" flush>
              <dl>
                {fields.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col gap-0.5 border-t border-[#e2e0ea] px-6 py-3 first:border-t-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  >
                    <dt className="text-[13px] font-semibold text-[#4a4862]">{f.label}</dt>
                    <dd
                      className={`min-w-0 break-all text-[14px] text-[#121226] sm:max-w-[60%] sm:text-right ${
                        f.mono ? "lc-mono text-[13px]" : ""
                      }`}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
                {sub ? (
                  <div className="flex flex-col gap-1 border-t border-[#e2e0ea] px-6 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <dt className="flex items-center gap-1.5 text-[13px] font-semibold text-[#4a4862]">
                      <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                      Subscription
                    </dt>
                    <dd className="flex flex-wrap items-center gap-2 text-[14px] sm:justify-end">
                      <StatusBadge tone={statusToTone(sub.status)} dot>
                        {sub.status}
                      </StatusBadge>
                      <span className="text-[13px] text-[#66647c]">
                        until {sub.currentPeriodEnd?.toLocaleDateString() ?? "—"}
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </SectionCard>
          </div>

          <UserDetailActions userId={user.id} currentRole={user.role} canChangeRole={can(admin.role, "roles")} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Resumes"
            description={`${user.resumes.length} most recent`}
            action={<FileText className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
            flush
          >
            {user.resumes.length === 0 ? (
              <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No resumes.</p>
            ) : (
              <ul>
                {user.resumes.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-6 py-3 first:border-t-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#121226]">{r.title}</p>
                      <p className="truncate text-[12px] text-[#66647c]">{r.vertical}</p>
                    </div>
                    <p className="shrink-0 text-[13px] text-[#66647c]">{r.updatedAt.toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Applications"
            description={`${user.jobApplications.length} most recent`}
            action={<Briefcase className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
            flush
          >
            {user.jobApplications.length === 0 ? (
              <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No applications.</p>
            ) : (
              <ul>
                {user.jobApplications.map((a) => (
                  <li
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#e2e0ea] px-6 py-3 first:border-t-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#121226]">{a.title || "Untitled"}</p>
                      <p className="truncate text-[12px] text-[#66647c]">{a.company || "—"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge tone={statusToTone(a.status)}>{a.status}</StatusBadge>
                      <p className="text-[13px] text-[#66647c]">{a.createdAt.toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
