import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, Building2, Users, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";

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
      select: { id: true, name: true, email: true, company: true, createdAt: true, user: { select: { email: true } } },
    }),
    prisma.company.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, industry: true, location: true, createdAt: true, user: { select: { email: true } } },
    }),
    prisma.referral.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, code: true, referredEmail: true, status: true, createdAt: true, user: { select: { email: true } } },
    }),
  ]);

  const sections = [
    {
      title: "Contacts",
      count: contactCount,
      icon: Mail,
      color: "bg-emerald-100 text-emerald-600",
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
      color: "bg-blue-100 text-blue-600",
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
      color: "bg-violet-100 text-violet-600",
      headers: ["Code", "Referred Email", "Status", "Owner", "Date"],
      rows: recentReferrals.map((r) => [
        r.code,
        r.referredEmail ?? "—",
        r.status,
        r.user.email,
        r.createdAt.toLocaleDateString(),
      ]),
    },
  ];

  const referralStatusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
    expired: "bg-gray-100 text-gray-600",
  };

  return (
    <AdminShell email={admin.email} pageTitle="Content">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">Content</h2>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {sections.map((s) => (
            <div
              key={s.title}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[28px] font-bold leading-tight text-gray-900">{s.count}</p>
                <p className="text-[13px] text-gray-500">{s.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini tables */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <section.icon className="h-4 w-4 text-gray-400" />
                <h3 className="text-[15px] font-semibold text-gray-900">
                  Recent {section.title}
                </h3>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {section.headers.map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {section.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={section.headers.length}
                      className="py-8 text-center text-[13px] text-gray-400"
                    >
                      No {section.title.toLowerCase()} yet
                    </td>
                  </tr>
                ) : (
                  section.rows.map((row, i) => (
                    <tr key={i} className="transition hover:bg-gray-50/60">
                      {row.map((cell, j) => {
                        if (section.title === "Referrals" && j === 2) {
                          return (
                            <td key={j} className="px-5 py-2.5">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${referralStatusColor[cell] ?? "bg-gray-100 text-gray-600"}`}
                              >
                                {cell}
                              </span>
                            </td>
                          );
                        }
                        return (
                          <td key={j} className="px-5 py-2.5 text-[13px] text-gray-600">
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
