import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ChevronLeft, ChevronRight, FileText, Plus, Search, SlidersHorizontal } from "lucide-react";

export default async function ResumesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const resumes = await prisma.resume.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardShell email={session.email} pageTitle="Resume Builder">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">My Resumes</h1>
            <p className="mt-1 text-[13px] text-gray-500">{resumes.length} resume{resumes.length !== 1 ? "s" : ""} created</p>
          </div>
          <Link href="/resume/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">
            <Plus className="h-4 w-4" />New Resume
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input className="soha-input h-10 pl-9" placeholder="Search resumes..." />
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition hover:border-gray-200 hover:text-gray-600">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
              <select className="soha-select !h-10 !w-40 !text-[13px]"><option>Sort: Newest</option><option>Sort: Oldest</option><option>Sort: A-Z</option></select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-gray-100 bg-[#FAFAFA] text-[11px] uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Resume</th>
                  <th className="px-4 py-3.5 font-semibold">Score</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold">Match</th>
                  <th className="px-4 py-3.5 font-semibold">Updated</th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {resumes.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-[13px] text-gray-500">No resumes yet. <Link href="/resume/new" className="font-medium text-[#7C5CFC] hover:underline">Create one</Link></td></tr>
                ) : (
                  resumes.map((r, idx) => (
                    <tr key={r.id} className="text-[13px] transition hover:bg-[#FAFAFA]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                            <FileText className="h-5 w-5 text-[#7C5CFC]" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-900">{r.title}</span>
                            <p className="mt-0.5 text-[11px] text-gray-400">Resume</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-medium text-gray-600">{29 + idx * 7}%</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">Active</span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{(idx + 1) * 10}</td>
                      <td className="px-4 py-4 text-gray-500">{r.updatedAt.toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/resume/${r.id}/edit`} className="rounded-xl border border-[#7C5CFC]/20 bg-violet-50 px-4 py-1.5 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-[#7C5CFC] hover:text-white">Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {resumes.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
              <div className="flex items-center gap-2 text-[13px] text-gray-500">
                <span>Result per page:</span>
                <select className="rounded-xl border border-gray-100 bg-white px-2.5 py-1 text-[13px] text-gray-700"><option>6</option><option>10</option><option>20</option></select>
              </div>
              <div className="flex items-center gap-1 text-[13px]">
                <button type="button" className="rounded-xl border border-gray-100 px-2.5 py-1.5 text-gray-400 transition hover:border-gray-200 hover:text-gray-600"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" className="h-8 min-w-8 rounded-xl px-2 text-gray-500 transition hover:bg-gray-50">1</button>
                <button type="button" className="h-8 min-w-8 rounded-xl px-2 text-gray-500 transition hover:bg-gray-50">2</button>
                <button type="button" className="h-8 min-w-8 rounded-xl bg-[#7C5CFC] px-2 font-semibold text-white">3</button>
                <span className="px-1 text-gray-400">...</span>
                <button type="button" className="h-8 min-w-8 rounded-xl px-2 text-gray-500 transition hover:bg-gray-50">8</button>
                <button type="button" className="h-8 min-w-8 rounded-xl px-2 text-gray-500 transition hover:bg-gray-50">9</button>
                <button type="button" className="h-8 min-w-8 rounded-xl px-2 text-gray-500 transition hover:bg-gray-50">10</button>
                <button type="button" className="rounded-xl border border-gray-100 px-2.5 py-1.5 text-gray-400 transition hover:border-gray-200 hover:text-gray-600"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
