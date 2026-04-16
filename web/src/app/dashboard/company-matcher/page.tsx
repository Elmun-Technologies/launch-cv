import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { MatcherClient } from "./matcher-client";

export default async function CompanyMatcherPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <DashboardShell email={session.email} pageTitle="Company Matcher">
      <MatcherClient
        resumes={resumes.map((r) => ({
          id: r.id,
          title: r.title,
          updatedAt: r.updatedAt.toISOString(),
        }))}
      />
    </DashboardShell>
  );
}
