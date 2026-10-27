import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { JdClient } from "./ui";

type Props = { params: Promise<{ id: string }> };

export default async function JdPage({ params }: Props) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/login?next=/resume/${id}/jd`);

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) notFound();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="jd"
      title="Match to a job"
      lead="Paste a job description to see your match score, the keywords you cover, missing skills and rewrites for your bullets."
    >
      <JdClient resumeId={id} />
    </ResumeToolLayout>
  );
}
