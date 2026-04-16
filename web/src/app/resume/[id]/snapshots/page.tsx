import Link from "next/link";
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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
        <Link href={`/resume/${id}/edit`} className="hover:text-white">
          ← Edit
        </Link>
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-white">Resume snapshots</h1>
      <p className="mt-2 text-sm text-zinc-400">Restore to a previous version (overwrites the current resume).</p>
      <SnapshotsClient resumeId={id} initial={resume.snapshots.map((s) => ({ id: s.id, label: s.label, createdAt: s.createdAt.toISOString() }))} />
    </main>
  );
}
