import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { FileText, Plus } from "lucide-react";
import { ResumesToolbar } from "./resumes-toolbar";

type SortKey = "newest" | "oldest" | "az";

const ORDER_BY: Record<SortKey, Prisma.ResumeOrderByWithRelationInput> = {
  newest: { updatedAt: "desc" },
  oldest: { updatedAt: "asc" },
  az: { title: "asc" },
};

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

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
    <DashboardShell email={session.email} pageTitle="Resume Builder">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">My Resumes</h1>
            <p className="mt-1 text-[13px] text-gray-500">
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} {q ? "found" : "created"}
            </p>
          </div>
          <Link href="/resume/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">
            <Plus className="h-4 w-4" />New Resume
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <ResumesToolbar q={q} sort={sort} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-gray-100 bg-[#FAFAFA] text-[11px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Resume</th>
                  <th className="px-4 py-3.5 font-semibold">Region</th>
                  <th className="px-4 py-3.5 font-semibold">Created</th>
                  <th className="px-4 py-3.5 font-semibold">Updated</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {resumes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-[13px] text-gray-500">
                      {q ? (
                        <>No resumes match &ldquo;{q}&rdquo;.</>
                      ) : (
                        <>No resumes yet. <Link href="/resume/new" className="font-medium text-[#7C5CFC] hover:underline">Create one</Link></>
                      )}
                    </td>
                  </tr>
                ) : (
                  resumes.map((r) => (
                    <tr key={r.id} className="text-[13px] transition hover:bg-[#FAFAFA]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                            <FileText className="h-5 w-5 text-[#7C5CFC]" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{r.title}</span>
                            {r.vertical ? <p className="mt-0.5 text-[11px] text-gray-400">{r.vertical}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{r.regionMode.toUpperCase()}</td>
                      <td className="px-4 py-4 text-gray-500">{dateFmt.format(r.createdAt)}</td>
                      <td className="px-4 py-4 text-gray-500">{dateFmt.format(r.updatedAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/resume/${r.id}/edit`} className="rounded-xl border border-[#7C5CFC]/20 bg-violet-50 px-4 py-1.5 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-[#7C5CFC] hover:text-white">Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
