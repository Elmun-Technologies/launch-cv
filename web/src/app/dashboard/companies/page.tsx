import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { CompaniesClient, type CompanyRow, type CompanyStatus } from "./companies-client";

/** Tracker status → company status. A company takes the furthest stage of any job there. */
const STATUS_OF: Record<string, CompanyStatus> = {
  bookmarked: "Saved",
  draft: "Saved",
  applying: "Applied",
  applied: "Applied",
  interviewing: "Interviewing",
  interview: "Interviewing",
  negotiating: "Offer",
  offer: "Offer",
  accepted: "Offer",
  rejected: "Closed",
  closed: "Closed",
};
const RANK: Record<CompanyStatus, number> = { Closed: 0, Saved: 1, Applied: 2, Interviewing: 3, Offer: 4 };
const key = (name: string) => name.trim().toLowerCase();

/** Notes may be stored wrapped with metadata ({ version: "company-meta-v1", description }); show only the text. */
function noteText(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as { version?: string; description?: unknown };
    if (j?.version === "company-meta-v1") return typeof j.description === "string" ? j.description : null;
  } catch {
    // plain text
  }
  return raw;
}

export default async function CompaniesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [rows, apps] = await Promise.all([
    prisma.company.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.jobApplication.findMany({
      where: { userId: session.sub, company: { not: null } },
      select: { company: true, status: true },
    }),
  ]);

  // Join on company name, ignoring case and spacing at the ends.
  const statusByName = new Map<string, CompanyStatus>();
  for (const a of apps) {
    if (!a.company?.trim()) continue;
    const st = STATUS_OF[a.status] ?? "Saved";
    const prev = statusByName.get(key(a.company));
    if (!prev || RANK[st] > RANK[prev]) statusByName.set(key(a.company), st);
  }

  const initial: CompanyRow[] = rows.map((c) => ({
    id: c.id, name: c.name, industry: c.industry, location: c.location,
    size: c.size, type: c.type, website: c.website, foundedYear: c.foundedYear,
    description: noteText(c.description), createdAt: c.createdAt.toISOString(),
    status: statusByName.get(key(c.name)) ?? null,
  }));

  return (
    <DashboardShell pageTitle="Companies" email={session.email}>
      <CompaniesClient initial={initial} />
    </DashboardShell>
  );
}
