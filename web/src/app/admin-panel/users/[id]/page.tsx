import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Briefcase, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import { UserDetailActions } from "./actions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
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

  return (
    <AdminShell email={admin.email} pageTitle="User detail">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Link
            href="/admin-panel/users"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E2] bg-white text-[#3F3F3F] transition hover:bg-[#FAFAF9] hover:text-[#111111]"
            aria-label="Back to users"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">
              {user.name || user.email}
            </h1>
            <p className="mt-1 text-[13px] text-[#6B6B6B]">
              <StatusBadge tone={statusToTone(user.role)}>{user.role}</StatusBadge>
              <span className="ml-2 font-mono text-[11px] text-[#6E6E6A]">{user.id}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionCard title="User information" flush>
              <dl className="divide-y divide-[#E5E5E2]">
                {fields.map((f) => (
                  <div key={f.label} className="flex items-start justify-between gap-4 px-5 py-3">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[#3F3F3F]">
                      {f.label}
                    </dt>
                    <dd
                      className={`max-w-[60%] truncate text-right text-[13px] text-[#111111] ${
                        f.mono ? "font-mono text-[12px]" : ""
                      }`}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
                {user.subscription ? (
                  <div className="flex items-start justify-between gap-4 px-5 py-3">
                    <dt className="text-[12px] font-semibold uppercase tracking-wider text-[#3F3F3F]">
                      <CreditCard className="mr-1 inline h-3 w-3 align-text-bottom" />
                      Subscription
                    </dt>
                    <dd className="text-right text-[13px]">
                      <StatusBadge tone={statusToTone(user.subscription.status)} dot>
                        {user.subscription.status}
                      </StatusBadge>
                      <span className="ml-2 text-[12px] text-[#6E6E6A]">
                        until {user.subscription.currentPeriodEnd?.toLocaleDateString() ?? "—"}
                      </span>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </SectionCard>
          </div>

          <UserDetailActions userId={user.id} currentRole={user.role} />
        </div>

        <SectionCard
          title="Resumes"
          description={`${user.resumes.length} most recent`}
          action={<FileText className="h-4 w-4 text-[#2563EB]" />}
          flush
        >
          {user.resumes.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[#6E6E6A]">No resumes.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E2]">
              {user.resumes.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFAF9]">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#111111]">{r.title}</p>
                    <p className="truncate text-[12px] text-[#6B6B6B]">{r.vertical}</p>
                  </div>
                  <p className="shrink-0 text-[12px] text-[#6E6E6A]">{r.updatedAt.toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Applications"
          description={`${user.jobApplications.length} most recent`}
          action={<Briefcase className="h-4 w-4 text-[#2563EB]" />}
          flush
        >
          {user.jobApplications.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[#6E6E6A]">No applications.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E2]">
              {user.jobApplications.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFAF9]">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#111111]">{a.title || "Untitled"}</p>
                    <p className="truncate text-[12px] text-[#6B6B6B]">{a.company || "—"}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge tone={statusToTone(a.status)}>{a.status}</StatusBadge>
                    <p className="text-[12px] text-[#6E6E6A]">{a.createdAt.toLocaleDateString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
