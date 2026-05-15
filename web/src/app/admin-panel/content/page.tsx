import { redirect } from "next/navigation";
import { Mail, Building2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";

type Section = {
  title: string;
  count: number;
  icon: typeof Mail;
  headers: string[];
  rows: Array<Array<string | { kind: "status"; value: string }>>;
};

export default async function AdminContentPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const [
    contactCount,
    companyCount,
    referralCount,
    recentContacts,
    recentCompanies,
    recentReferrals,
  ] = await Promise.all([
    prisma.contact.count(),
    prisma.company.count(),
    prisma.referral.count(),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        industry: true,
        location: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        code: true,
        referredEmail: true,
        status: true,
        createdAt: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const sections: Section[] = [
    {
      title: "Contacts",
      count: contactCount,
      icon: Mail,
      headers: ["Name", "Email", "Company", "Owner", "Date"],
      rows: recentContacts.map((c) => [
        c.name,
        c.email ?? "—",
        c.company ?? "—",
        c.user.email,
        c.createdAt.toLocaleDateString(),
      ]),
    },
    {
      title: "Companies",
      count: companyCount,
      icon: Building2,
      headers: ["Name", "Industry", "Location", "Owner", "Date"],
      rows: recentCompanies.map((c) => [
        c.name,
        c.industry ?? "—",
        c.location ?? "—",
        c.user.email,
        c.createdAt.toLocaleDateString(),
      ]),
    },
    {
      title: "Referrals",
      count: referralCount,
      icon: Users,
      headers: ["Code", "Referred email", "Status", "Owner", "Date"],
      rows: recentReferrals.map((r) => [
        r.code,
        r.referredEmail ?? "—",
        { kind: "status" as const, value: r.status },
        r.user.email,
        r.createdAt.toLocaleDateString(),
      ]),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="User CRM">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">User CRM</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Contacts, companies, and referrals collected inside user dashboards. Read-only snapshot.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {sections.map((s) => (
            <KpiCard key={s.title} label={s.title} value={s.count} icon={s.icon} />
          ))}
        </div>

        {sections.map((section) => (
          <SectionCard
            key={section.title}
            title={`Recent ${section.title.toLowerCase()}`}
            description="Most recent 5 entries across all users"
            flush
          >
            {section.rows.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">
                No {section.title.toLowerCase()} yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#FAFBFC]">
                      {section.headers.map((h) => (
                        <th
                          key={h}
                          className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#475569]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, i) => (
                      <tr key={i} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#FAFBFC]">
                        {row.map((cell, j) => {
                          if (typeof cell === "object" && cell !== null && "kind" in cell) {
                            return (
                              <td key={j} className="px-5 py-3">
                                <StatusBadge tone={statusToTone(cell.value)}>{cell.value}</StatusBadge>
                              </td>
                            );
                          }
                          return (
                            <td key={j} className="px-5 py-3 text-[#475569]">
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        ))}
      </div>
    </AdminShell>
  );
}
