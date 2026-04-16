import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { ResumeEditor } from "@/components/resume-editor";

type Props = { params: Promise<{ id: string }> };

export default async function EditResumePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect(`/login?next=/resume/${(await params).id}/edit`);

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) notFound();

  const content = parseResumeContent(resume.content);

  return (
    <ResumeEditor
      resumeId={resume.id}
      initialTitle={resume.title}
      initialVertical={resume.vertical}
      initialRegion={resume.regionMode}
      initialContent={content}
    />
  );
}
