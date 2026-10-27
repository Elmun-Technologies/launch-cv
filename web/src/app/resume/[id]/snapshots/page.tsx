import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { SnapshotsClient } from "./snapshots-client";

type Props = { params: Promise<{ id: string }> };

export default async function SnapshotsPage({ params }: Props) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/login?next=/resume/${id}/snapshots`);

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
    include: { snapshots: { orderBy: { createdAt: "desc" } } },
  });
  if (!resume) notFound();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="snapshots"
      title="Versions"
      lead="Save a version before big changes or for each application. Restoring a version replaces the current resume."
    >
      <SnapshotsClient resumeId={id} initial={resume.snapshots.map((s) => ({ id: s.id, label: s.label, createdAt: s.createdAt.toISOString() }))} />
    </ResumeToolLayout>
  );
}
