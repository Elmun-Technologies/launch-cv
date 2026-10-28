import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { normalizeChecklist } from "@/lib/application-checklist";
import { JobTrackerClient, type JobRow } from "./job-tracker-client";

export default async function JobTrackerPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [rows, resumes] = await Promise.all([
    prisma.jobApplication.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      include: { resume: { select: { id: true, title: true } } },
    }),
    prisma.resume.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  const initial: JobRow[] = rows.map((r) => ({
    id: r.id,
    resumeId: r.resumeId,
    title: r.title,
    company: r.company,
    status: r.status,
    jdExcerpt: r.jdText.slice(0, 1200),
    checklist: normalizeChecklist(r.checklist),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    resume: r.resume,
  }));

  return (
    <DashboardShell pageTitle="Job tracker" email={session.email}>
      <JobTrackerClient initial={initial} resumes={resumes} />
    </DashboardShell>
  );
}
