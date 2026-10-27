import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { Plus } from "lucide-react";
import { MiniPage } from "@/components/resume-mini-page";
import { parseResumeContent } from "@/lib/resume-json";
import { ResumesToolbar } from "./resumes-toolbar";

type SortKey = "newest" | "oldest" | "az";

const ORDER_BY: Record<SortKey, Prisma.ResumeOrderByWithRelationInput> = {
  newest: { updatedAt: "desc" },
  oldest: { updatedAt: "asc" },
  az: { title: "asc" },
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function ResumesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const sort: SortKey = sp.sort === "oldest" || sp.sort === "az" ? sp.sort : "newest";

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.sub,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: ORDER_BY[sort],
  });

  return (
    <DashboardShell email={session.email} pageTitle="Resumes">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
              Resumes <span className="text-[#8A8A86]">— one per kind of role you apply for.</span>
            </h1>
            <p className="mt-1 text-[15px] text-[#6B6B6B]">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
              {q ? <> matching &ldquo;{q}&rdquo;</> : null}
            </p>
          </div>
          <Link href="/resume/new" className="soha-btn-primary inline-flex shrink-0 items-center gap-1.5">
            <Plus className="h-4 w-4" aria-hidden /> New resume
          </Link>
        </div>

        <ResumesToolbar q={q} sort={sort} />

        {resumes.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[#D9D9D5] bg-white px-6 py-14 text-center">
            {q ? (
              <p className="text-[15px] text-[#6B6B6B]">No resumes match &ldquo;{q}&rdquo;.</p>
            ) : (
              <>
                <p className="text-[17px] font-semibold">No resumes yet</p>
                <p className="mx-auto mt-1 max-w-[420px] text-[14px] text-[#6B6B6B]">
                  Start from a blank page, or import the resume you already have and improve it.
                </p>
                <Link href="/resume/new" className="soha-btn-secondary mt-5 inline-flex">
                  Create your first resume
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {resumes.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/resume/${r.id}/edit`}
                  className="block rounded-[14px] border border-[#E5E5E2] bg-white p-3 hover:border-[#111111]"
                >
                  <div className="flex h-[180px] justify-center overflow-hidden rounded-lg bg-[#F5F5F3] pt-3 sm:h-[220px]">
                    <MiniPage content={parseResumeContent(r.content)} />
                  </div>
                  <p className="mt-3 truncate text-[15px] font-medium text-[#111111]">{r.title}</p>
                  <p className="text-[13px] text-[#6B6B6B]">Edited {dateFmt.format(r.updatedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardShell>
  );
}
