import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader } from "@/components/admin/v5/ui";
import { fmtDate } from "@/lib/admin-dates";
import { maskEmail } from "@/lib/admin-labels";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  primary: string;
  /** Joined with " · "; empty parts are dropped. */
  meta: Array<string | null | undefined>;
  status?: { label: string; tone: "default" | "green" | "amber" | "blue" };
  owner: string;
  date: Date;
};
type Section = { title: string; count: number; items: Item[] };

const REFERRAL_STATUS: Record<string, { label: string; tone: "default" | "green" | "amber" | "blue" }> = {
  pending: { label: "Invited", tone: "amber" },
  registered: { label: "Signed up", tone: "blue" },
  credited: { label: "Credited", tone: "green" },
};


const clean = (parts: Array<string | null | undefined>) => parts.map((p) => p?.trim()).filter((p): p is string => !!p && p !== "—");

function requestNow() {
  return Date.now();
}

export default async function AdminContentPage() {
  const admin = await requireAdmin("users");
  if (!admin) redirect("/admin-panel/access-denied");
  const now = requestNow();

  const [contactCount, companyCount, referralCount, recentContacts, recentCompanies, recentReferrals] = await Promise.all([
    prisma.contact.count(),
    prisma.company.count(),
    prisma.referral.count(),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, role: true, company: true, status: true, createdAt: true, user: { select: { email: true } } },
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

  const sections: Section[] = [
    {
      title: "Companies",
      count: companyCount,
      items: recentCompanies.map((c) => ({
        id: c.id,
        primary: c.name,
        meta: [c.industry, c.location],
        owner: c.user.email,
        date: c.createdAt,
      })),
    },
    {
      title: "Contacts",
      count: contactCount,
      items: recentContacts.map((c) => ({
        id: c.id,
        primary: c.name,
        meta: [c.role, c.company, c.status && c.status !== "active" ? `Status: ${c.status.replace(/_/g, " ").toLowerCase()}` : null],
        owner: c.user.email,
        date: c.createdAt,
      })),
    },
    {
      title: "Referrals",
      count: referralCount,
      items: recentReferrals.map((r) => ({
        id: r.id,
        primary: r.referredEmail ? maskEmail(r.referredEmail) : `Invite code ${r.code}`,
        meta: [],
        status: REFERRAL_STATUS[r.status] ?? { label: r.status, tone: "default" as const },
        owner: r.user.email,
        date: r.createdAt,
      })),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="User CRM">
      <div className="space-y-5">
        <AdminPageHeader
          title="User CRM"
          description="Companies, contacts and referrals users have added in their dashboards — the 5 most recent across all accounts. Emails are masked."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              description="Most recent 5 entries"
              action={
                <span className="text-[18px] font-extrabold tabular-nums text-[#5440e8]">
                  {section.count.toLocaleString("en-US")}
                  <span className="sr-only"> total</span>
                </span>
              }
              flush
            >
              {section.items.length === 0 ? (
                <p className="px-6 py-8 text-center text-[14px] text-[#66647c]">No {section.title.toLowerCase()} yet.</p>
              ) : (
                <ul>
                  {section.items.map((item) => {
                    const meta = clean(item.meta);
                    return (
                      <li key={item.id} className="border-t border-[#e2e0ea] px-5 py-2.5 text-[13px] first:border-t-0 sm:px-6">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 break-words font-bold text-[#121226]">{item.primary}</p>
                          {item.status ? (
                            <span className="shrink-0">
                              <StatusBadge tone={item.status.tone}>{item.status.label}</StatusBadge>
                            </span>
                          ) : null}
                        </div>
                        {meta.length ? <p className="break-words text-[#4a4862]">{meta.join(" · ")}</p> : null}
                        <p className="mt-0.5 break-words text-[12px] text-[#66647c]">
                          <span className="sr-only">Added by </span>
                          {maskEmail(item.owner)} · {fmtDate(item.date, now)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </SectionCard>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
