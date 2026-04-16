import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { CompaniesClient, type CompanyRow } from "./companies-client";

export default async function CompaniesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await prisma.company.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
  });

  const initial: CompanyRow[] = rows.map((c) => ({
    id: c.id, name: c.name, industry: c.industry, location: c.location,
    size: c.size, type: c.type, website: c.website, foundedYear: c.foundedYear,
    description: c.description, createdAt: c.createdAt.toISOString(),
  }));

  return (
    <DashboardShell pageTitle="Companies" email={session.email}>
      <CompaniesClient initial={initial} />
    </DashboardShell>
  );
}
