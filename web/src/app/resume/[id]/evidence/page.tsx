import Link from "next/link";
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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
        <Link href={`/resume/${id}/edit`} className="hover:text-white">
          ← Edit
        </Link>
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-white">Evidence / consistency check</h1>
      <p className="mt-2 text-sm text-zinc-400">Quick report on metrics and evidence linkage.</p>
      <div className="mt-6 max-w-2xl">
        <AiDisclaimer />
      </div>
      <EvidenceClient resumeId={id} />
    </main>
  );
}
