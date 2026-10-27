import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { FitClient } from "./ui";

type Props = { params: Promise<{ id: string }> };

export default async function FitPage({ params }: Props) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/login?next=/resume/${id}/fit`);

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) notFound();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="fit"
      title="Role fit"
      lead="See how a hiring manager for this role would score your resume, criterion by criterion."
    >
      <FitClient resumeId={id} />
    </ResumeToolLayout>
  );
}
