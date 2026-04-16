import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ApplicationsClient, type ApplicationRow } from "./applications-client";

export default async function ApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await prisma.jobApplication.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
    include: { resume: { select: { id: true, title: true } } },
  });

  const resumes = await prisma.resume.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true },
  });

  const initial: ApplicationRow[] = rows.map((r) => ({
    id: r.id,
    resumeId: r.resumeId,
    jdRunId: r.jdRunId,
    jdText: r.jdText,
    title: r.title,
    company: r.company,
    status: r.status,
    checklist: r.checklist,
    createdAt: r.createdAt.toISOString(),
    resume: r.resume,
  }));

  return (
    <DashboardShell pageTitle="Job Tracker" email={session.email}>
      <ApplicationsClient initial={initial} resumes={resumes} />
    </DashboardShell>
  );
}
