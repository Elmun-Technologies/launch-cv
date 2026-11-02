import { ResumeToolLayout } from "@/components/resume-tool-layout";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getSettings } from "@/lib/app-settings";
import { parseResumeContent } from "@/lib/resume-json";
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

  // Current bullet text, so suggested rewrites can show what they replace.
  const bullets: Record<string, string> = {};
  for (const exp of parseResumeContent(resume.content).experience ?? []) {
    for (const b of exp.bullets ?? []) if (b?.text) bullets[`${exp.id}:${b.id}`] = b.text;
  }
  const { planLimits } = await getSettings();

  return (
    <ResumeToolLayout
      resumeId={id}
      resumeTitle={resume.title}
      active="jd"
      title="Match to a job"
      lead="Paste a job description to see your match score, the keywords you cover, missing skills and rewrites for your bullets."
    >
      <JdClient resumeId={id} bullets={bullets} planLimits={planLimits} />
    </ResumeToolLayout>
  );
}
