import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { Lightbulb, Plus, Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ResumeThumb } from "@/components/app/shell/resume-thumb";
import { ago, appBtnPrimary, appBtnSmDark, appBtnSmSoft, appBtnWhite, appCard, appH1, appLead } from "@/components/app/shell/ui";
import { parseResumeContent } from "@/lib/resume-json";
import { ResumesToolbar } from "./resumes-toolbar";
import { ResumeCardMenu, TemplateName } from "./resume-card-menu";

type SortKey = "newest" | "oldest" | "az";

const ORDER_BY: Record<SortKey, Prisma.ResumeOrderByWithRelationInput> = {
  newest: { updatedAt: "desc" },
  oldest: { updatedAt: "asc" },
  az: { title: "asc" },
};

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

  const countLabel = `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}`;

  return (
    <DashboardShell email={session.email} pageTitle="Resumes">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className={appH1}>Resumes</h1>
            <p className={`${appLead} text-[13px]! text-[#66647c]! sm:text-[16px]! sm:text-[#4a4862]!`}>
              {countLabel}
              {q ? <> matching &ldquo;{q}&rdquo;</> : <span className="hidden sm:inline"> · one per kind of role works best</span>}
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <Link href="/resume/new" className={appBtnWhite}>
              <Upload className="h-4 w-4" strokeWidth={2} aria-hidden /> Import resume
            </Link>
            <Link href="/resume/new" className={appBtnPrimary}>
              <Plus className="h-4 w-4" strokeWidth={2.2} aria-hidden /> New resume
            </Link>
          </div>
        </div>

        <ResumesToolbar q={q} sort={sort} />

        {resumes.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-[24px] border-2 border-dashed border-[#b5aaf7] bg-white/50 px-6 py-14 text-center sm:rounded-[28px]">
            {q ? (
              <>
                <p className="text-[17px] font-extrabold">No resumes match &ldquo;{q}&rdquo;</p>
                <p className="mt-1 text-[14px] text-[#4a4862]">Try another word from the resume&apos;s title.</p>
              </>
            ) : (
              <>
                <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#5440e8] text-white">
                  <Plus className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <p className="mt-4 text-[20px] font-extrabold">No resumes yet</p>
                <p className="mx-auto mt-1 max-w-[420px] text-[15px] leading-[23px] text-[#4a4862]">
                  Start from a blank page, or import the resume you already have and improve it.
                </p>
                <Link href="/resume/new" className={`${appBtnPrimary} mt-5`}>
                  Create your first resume
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {resumes.map((r) => {
              const content = parseResumeContent(r.content);
              const edited = `Edited ${ago(r.updatedAt)}`;
              return (
                <li key={r.id} className="relative min-w-0 focus-within:z-20">
                  <article
                    aria-label={r.title}
                    className={`${appCard} lc-rise grid h-full grid-cols-[110px_1fr] gap-3 rounded-[20px]! p-2 motion-reduce:hover:transform-none sm:flex sm:flex-col sm:gap-0 sm:rounded-[24px]!`}
                  >
                    <Link
                      href={`/resume/${r.id}/edit`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="relative block h-[130px] overflow-hidden rounded-[14px] bg-[#e4dfff] sm:h-[250px] sm:rounded-2xl"
                    >
                      <span className="absolute left-1/2 top-3 -translate-x-1/2 sm:hidden">
                        <ResumeThumb content={content} width={100} />
                      </span>
                      <span className="absolute left-1/2 top-[18px] hidden -translate-x-1/2 sm:block">
                        <ResumeThumb content={content} width={231} />
                      </span>
                    </Link>
                    <div className="flex min-w-0 flex-col px-1 py-1.5 sm:flex-1 sm:px-2.5 sm:pb-2 sm:pt-3.5">
                      <div className="flex items-start justify-between gap-1">
                        <h2 className="line-clamp-2 min-w-0 break-words text-[15px] font-extrabold leading-[19px] sm:text-[17px] sm:leading-6">{r.title}</h2>
                        <ResumeCardMenu id={r.id} title={r.title} />
                      </div>
                      <p className="mt-[3px] text-[12px] text-[#66647c] sm:text-[13px]">
                        <TemplateName id={r.id} />
                        {edited}
                      </p>
                      <div className="mt-auto flex gap-1.5 pt-2.5 sm:pt-3.5">
                        <Link href={`/resume/${r.id}/edit`} className={`${appBtnSmDark} text-[13px]! max-sm:px-3.5 sm:flex-1`}>
                          Edit<span className="sr-only"> {r.title}</span>
                        </Link>
                        <Link href={`/resume/${r.id}/jd`} className={`${appBtnSmSoft} shrink-0 whitespace-nowrap text-[13px]! px-3.5!`}>
                          <span className="sm:hidden">Match</span>
                          <span className="hidden sm:inline">Match to a job</span>
                          <span className="sr-only"> for {r.title}</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
            {!q ? (
              <li className="hidden sm:block">
                <Link
                  href="/resume/new"
                  className="focus-visible:outline-[#5440e8]! focus-visible:rounded-[24px]! flex h-full min-h-[420px] flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-[#b5aaf7] text-[15px] font-bold text-[#3a2bb8] transition-colors hover:border-[#5440e8] hover:bg-white/60"
                >
                  <span aria-hidden="true" className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#5440e8] text-white">
                    <Plus className="h-6 w-6" strokeWidth={2.2} />
                  </span>
                  New resume
                </Link>
              </li>
            ) : null}
          </ul>
        )}

        {resumes.length > 0 ? (
          <Link href="/resume/new" className={`${appBtnPrimary} mt-3.5 w-full sm:hidden`}>
            <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden /> New resume
          </Link>
        ) : null}

        <div className="mt-5 hidden items-center gap-3.5 rounded-[22px] bg-white px-[22px] py-[18px] sm:flex">
          <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4dfff] text-[#3a2bb8]">
            <Lightbulb className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <p className="flex-1 text-[15px] text-[#4a4862]">
            <b className="text-[#121226]">Tip:</b>{" "}keep one resume per kind of role, then use &ldquo;Match to a job&rdquo; to tailor it to each
            posting.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
