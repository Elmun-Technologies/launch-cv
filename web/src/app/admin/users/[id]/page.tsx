import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, Trash2, FileText, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { UserDetailActions } from "./actions";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

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

  const fields = [
    { label: "ID", value: user.id },
    { label: "Email", value: user.email },
    { label: "Name", value: user.name ?? "—" },
    { label: "Role", value: user.role },
    { label: "Verified", value: user.emailVerifiedAt ? user.emailVerifiedAt.toLocaleDateString() : "Not verified" },
    { label: "Billing customer ID", value: user.stripeCustomerId ?? "—" },
    { label: "Created", value: user.createdAt.toLocaleDateString() },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="User Detail">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-[28px] font-bold text-gray-900">{user.name || user.email}</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* User Info */}
          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-gray-900">User Information</h3>
            </div>
            <div className="divide-y divide-gray-50 px-6">
              {fields.map((f) => (
                <div key={f.label} className="flex items-center justify-between py-3">
                  <span className="text-[13px] font-medium text-gray-500">{f.label}</span>
                  <span className="text-[13px] text-gray-900">{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <UserDetailActions userId={user.id} currentRole={user.role} />
        </div>

        {/* Resumes */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <h3 className="text-[15px] font-semibold text-gray-900">
              Resumes ({user.resumes.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {user.resumes.length === 0 ? (
              <p className="px-6 py-8 text-center text-[13px] text-gray-400">No resumes</p>
            ) : (
              user.resumes.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{r.title}</p>
                    <p className="text-[13px] text-gray-500">{r.vertical}</p>
                  </div>
                  <p className="text-[13px] text-gray-400">{r.updatedAt.toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <h3 className="text-[15px] font-semibold text-gray-900">
              Applications ({user.jobApplications.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {user.jobApplications.length === 0 ? (
              <p className="px-6 py-8 text-center text-[13px] text-gray-400">No applications</p>
            ) : (
              user.jobApplications.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{a.title || "Untitled"}</p>
                    <p className="text-[13px] text-gray-500">{a.company || "—"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <p className="text-[13px] text-gray-400">{a.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-amber-100 text-amber-700",
    offer: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
