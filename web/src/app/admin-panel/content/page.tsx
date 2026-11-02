import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import { AdminPageHeader } from "@/components/admin/v5/ui";

type Section = {
  title: string;
  count: number;
  items: Array<{ id: string; primary: string; meta: string; status?: string; owner: string; date: string }>;
};

export default async function AdminContentPage() {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");

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
      title: "Companies",
      count: companyCount,
      items: recentCompanies.map((c) => ({
        id: c.id,
        primary: c.name,
        meta: [c.industry ?? "—", c.location ?? "—"].join(" · "),
        owner: c.user.email,
        date: c.createdAt.toLocaleDateString(),
      })),
    },
    {
      title: "Contacts",
      count: contactCount,
      items: recentContacts.map((c) => ({
        id: c.id,
        primary: c.name,
        meta: [c.email ?? "—", c.company ?? "—"].join(" · "),
        owner: c.user.email,
        date: c.createdAt.toLocaleDateString(),
      })),
    },
    {
      title: "Referrals",
      count: referralCount,
      items: recentReferrals.map((r) => ({
        id: r.id,
        primary: r.code,
        meta: r.referredEmail ?? "—",
        status: r.status,
        owner: r.user.email,
        date: r.createdAt.toLocaleDateString(),
      })),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="User CRM">
      <div className="space-y-5">
        <AdminPageHeader
          title="User CRM"
          description="Contacts, companies, and referrals collected inside user dashboards. Read-only snapshot of the 5 most recent entries across all users."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              description="Most recent 5 entries"
              action={
                <span className="text-[18px] font-extrabold tabular-nums text-[#5440e8]">
                  {section.count.toLocaleString()}
                  <span className="sr-only"> total</span>
                </span>
              }
              flush
            >
              {section.items.length === 0 ? (
                <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">
                  No {section.title.toLowerCase()} yet.
                </p>
              ) : (
                <ul>
                  {section.items.map((item) => (
                    <li key={item.id} className="border-t border-[#e2e0ea] px-6 py-2.5 text-[13px] first:border-t-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 break-words font-bold text-[#121226]">{item.primary}</p>
                        {item.status ? (
                          <span className="shrink-0">
                            <StatusBadge tone={statusToTone(item.status)}>{item.status}</StatusBadge>
                          </span>
                        ) : null}
                      </div>
                      <p className="break-words text-[#4a4862]">{item.meta}</p>
                      <p className="mt-0.5 break-words text-[12px] text-[#66647c]">
                        <span className="sr-only">Owner: </span>
                        {item.owner} · {item.date}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
