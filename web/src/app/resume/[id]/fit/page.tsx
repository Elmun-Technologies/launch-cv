import Link from "next/link";
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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
        <Link href={`/resume/${id}/edit`} className="hover:text-white">
          ← Edit
        </Link>
        <Link href="/dashboard" className="hover:text-white">
          Dashboard
        </Link>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-white">Role-fit rubric</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Vertical-specific evaluation: overall score and prioritized fixes. JD is optional.
      </p>
      <FitClient resumeId={id} />
    </main>
  );
}
