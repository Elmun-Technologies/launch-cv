import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { PacketClient } from "./ui";

type Props = { params: Promise<{ id: string }> };

export default async function PacketPage({ params }: Props) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/login?next=/resume/${id}/packet`);

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) notFound();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="packet"
      title="Cover letter & interview"
      lead="Generate a cover letter, an elevator pitch and ten likely interview questions with answer outlines for one job."
    >
      <PacketClient resumeId={id} />
    </ResumeToolLayout>
  );
}
