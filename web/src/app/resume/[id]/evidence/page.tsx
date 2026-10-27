import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EvidenceClient } from "./ui";
import { AiDisclaimer } from "@/components/ai-disclaimer";

type Props = { params: Promise<{ id: string }> };

export default async function EvidencePage({ params }: Props) {
  const session = await getSession();
  const { id } = await params;
  if (!session) redirect(`/login?next=/resume/${id}/evidence`);

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) notFound();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="evidence"
      title="Consistency check"
      lead="Find mismatched dates, formats and claims across your resume, and the metrics it already contains."
    >
      <div className="max-w-2xl">
        <AiDisclaimer />
      </div>
      <EvidenceClient resumeId={id} />
    </ResumeToolLayout>
  );
}
