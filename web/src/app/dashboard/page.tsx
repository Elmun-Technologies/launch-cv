import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getUserPlanId } from "@/lib/plans";
import { parseResumeContent } from "@/lib/resume-json";
import { MiniPage } from "@/components/resume-mini-page";
import { DashboardShell } from "@/components/dashboard-shell";
import { CtaLink } from "@/components/cta-link";
import { scoreColor } from "@/components/ats-report-parts";
import type { FreeAtsReport } from "@/types/ai-results";

export const dynamic = "force-dynamic";

/** Same buckets the job tracker uses. */
const STAGE: Record<string, "saved" | "applied" | "interview" | "offer"> = {
  bookmarked: "saved",
  draft: "saved",
  applying: "applied",
  applied: "applied",
  interviewing: "interview",
  interview: "interview",
  negotiating: "offer",
  offer: "offer",
  accepted: "offer",
};

function joinedToday(d: Date): boolean {
  return Date.now() - d.getTime() < 24 * 60 * 60 * 1000;
}

function ago(d: Date): string {
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 60 * 60) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 60 * 60 * 24) return `${Math.round(s / 3600)} h ago`;
  const days = Math.round(s / 86400);
  if (days < 30) return days === 1 ? "yesterday" : `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isReport(v: unknown): v is FreeAtsReport {
  const r = v as FreeAtsReport | null;
  return !!r && typeof r.overall === "number" && Array.isArray(r.fixes);
}

export default async function DashboardHomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, plan, resumes, resumeCount, apps, ats] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.sub }, select: { name: true, createdAt: true } }),
    getUserPlanId(session.sub),
    prisma.resume.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true, content: true },
    }),
    prisma.resume.count({ where: { userId: session.sub } }),
    prisma.jobApplication.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, company: true, status: true },
    }),
    prisma.freeAtsTrial.findFirst({
      where: { userId: session.sub, claimToken: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { claimToken: true, report: true },
    }),
  ]);

  const firstName = user?.name?.trim().split(/\s+/)[0];
  const paid = plan !== "none";
  const isNew = !!user && joinedToday(user.createdAt);
  const report = ats && isReport(ats.report) ? ats.report : null;
  const topFix = report?.fixes.find((f) => f.priority === "High") ?? report?.fixes[0];

  const counts = { applied: 0, interview: 0, offer: 0 };
  for (const a of apps) {
    const st = STAGE[a.status] ?? "saved";
    if (st !== "saved") counts[st] += 1;
  }

  return (
    <DashboardShell email={session.email} pageTitle="Home">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[28px]">
            {isNew ? "Welcome" : "Welcome back"}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <div className="flex gap-2">
            <Link
              href="/resume/new"
              className="inline-flex h-10 items-center rounded-full border border-[#D9D9D5] bg-white px-4 text-[14px] font-medium hover:border-[#111111]"
            >
              Import resume
            </Link>
            <Link
              href="/resume/new"
              className="inline-flex h-10 items-center rounded-full bg-[#111111] px-4 text-[14px] font-medium text-white hover:bg-black"
            >
              New resume
            </Link>
          </div>
        </div>

        <NextStep paid={paid} resumeCount={resumeCount} report={report} token={ats?.claimToken ?? null} topFix={topFix?.title} />

        <div className="flex flex-col gap-6 xl:flex-row">
          {/* RESUMES */}
          <section className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold">Your resumes</h2>
              {resumeCount > 0 ? (
                <Link href="/dashboard/resumes" className="text-[14px] text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                  See all {resumeCount}
                </Link>
              ) : null}
            </div>
            <div className="mt-3.5 grid grid-cols-2 gap-4 md:grid-cols-3">
              {resumes.slice(0, 2).map((r) => (
                <Link
                  key={r.id}
                  href={`/resume/${r.id}/edit`}
                  className="group rounded-[14px] border border-[#E5E5E2] bg-white p-3 hover:border-[#111111]"
                >
                  <div className="flex h-[180px] justify-center overflow-hidden rounded-lg bg-[#F5F5F3] pt-3 sm:h-[220px]">
                    <MiniPage content={parseResumeContent(r.content)} />
                  </div>
                  <p className="mt-3 truncate text-[15px] font-medium">{r.title}</p>
                  <p className="text-[13px] text-[#6B6B6B]">Edited {ago(r.updatedAt)}</p>
                </Link>
              ))}
              <Link
                href={resumeCount > 0 ? "/dashboard/resumes" : "/resume/new"}
                className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D9D9D5] bg-white p-3 text-center text-[14px] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111]"
              >
                <Plus className="h-6 w-6" aria-hidden />
                {resumeCount > 0 ? "Tailor one to a new job" : "Create or import your first resume"}
              </Link>
            </div>
          </section>

          {/* SIDE */}
          <section className="flex w-full flex-col gap-4 xl:w-[340px] xl:shrink-0">
            <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[17px] font-semibold">Applications</h2>
                <Link href="/dashboard/job-tracker" className="text-[14px] text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                  Tracker
                </Link>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                {(
                  [
                    ["Applied", counts.applied],
                    ["Interview", counts.interview],
                    ["Offer", counts.offer],
                  ] as const
                ).map(([l, n]) => (
                  <div key={l} className="rounded-[10px] bg-[#F5F5F3] py-3">
                    <p className="text-[22px] font-semibold [font-feature-settings:'tnum']">{n}</p>
                    <p className="text-[12px] text-[#6B6B6B]">{l}</p>
                  </div>
                ))}
              </div>
              {apps.length > 0 ? (
                <ul className="mt-3.5">
                  {apps.slice(0, 3).map((a) => (
                    <li key={a.id} className="flex justify-between gap-3 border-t border-[#EEEEEB] py-2.5 text-[14px]">
                      <span className="truncate">
                        {[a.company, a.title].filter(Boolean).join(" · ") || "Untitled application"}
                      </span>
                      <span className={STAGE[a.status] === "interview" ? "shrink-0 text-[#1D4ED8]" : "shrink-0 text-[#6B6B6B]"}>
                        {{ saved: "Saved", applied: "Applied", interview: "Interview", offer: "Offer" }[STAGE[a.status] ?? "saved"]}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3.5 text-[14px] leading-[1.55] text-[#6B6B6B]">
                  Track every job you apply to in one place, with the resume version you sent.
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-[14px] border border-[#E5E5E2] bg-white">
              <Image
                src="/images/photos/interview-panel.webp"
                alt="Candidate in an interview with a hiring panel"
                width={1200}
                height={900}
                sizes="340px"
                className="h-[120px] w-full object-cover"
              />
              <div className="px-5 pb-5 pt-4">
                <p className="text-[15px] font-semibold">Got an interview coming up?</p>
                <p className="mt-1 text-[14px] leading-[1.55] text-[#3F3F3F]">
                  Build an application packet: likely questions, answers drawn from your resume and a cover letter for
                  that job.
                </p>
                <Link
                  href={resumes[0] ? `/resume/${resumes[0].id}/packet` : "/resume/new"}
                  className="mt-3 inline-flex h-[38px] items-center rounded-full border border-[#D9D9D5] px-4 text-[14px] font-medium hover:border-[#111111]"
                >
                  {resumes[0] ? "Prepare now" : "Add a resume first"}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function NextStep({
  paid,
  resumeCount,
  report,
  token,
  topFix,
}: {
  paid: boolean;
  resumeCount: number;
  report: FreeAtsReport | null;
  token: string | null;
  topFix?: string;
}) {
  const box = "flex flex-col gap-4 rounded-[14px] border p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6";
  const btn =
    "inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8]";

  if (report && token) {
    return (
      <div className={`${box} border-[#DCE6FF] bg-[#EEF3FF]`}>
        <p className="text-[44px] font-semibold leading-none tracking-[-0.04em]" style={{ color: scoreColor(report.overall) }}>
          {report.overall}
        </p>
        <div className="flex-1">
          <p className="text-[17px] font-semibold">
            Next step: fix {report.totalFixes} {report.totalFixes === 1 ? "issue" : "issues"} from your ATS check
          </p>
          {topFix ? <p className="mt-1 text-[15px] text-[#3F3F3F]">Start with: {topFix}</p> : null}
        </div>
        <Link href={`/dashboard/ats-report/${token}`} className={btn}>
          See all fixes
        </Link>
      </div>
    );
  }

  if (resumeCount === 0) {
    return (
      <div className={`${box} border-[#DCE6FF] bg-[#EEF3FF]`}>
        <div className="flex-1">
          <p className="text-[17px] font-semibold">Start with the resume you already have</p>
          <p className="mt-1 text-[15px] text-[#3F3F3F]">
            Upload a PDF or Word file and every section is filled in for you to edit. No resume yet? Build one from scratch.
          </p>
        </div>
        <CtaLink cta="import_resume" location="dashboard_next_step" href="/resume/new" className={btn}>
          Import my resume
        </CtaLink>
      </div>
    );
  }

  if (!paid) {
    return (
      <div className={`${box} border-[#E5E5E2] bg-white`}>
        <div className="flex-1">
          <p className="text-[17px] font-semibold">Tailor your resume to each job with AI</p>
          <p className="mt-1 text-[15px] text-[#3F3F3F]">
            Match it to a job post, rewrite weak bullets and generate a cover letter — on any plan.
          </p>
        </div>
        <CtaLink cta="choose_plan" location="dashboard_next_step" href="/dashboard/settings/subscription" className={btn}>
          See plans
        </CtaLink>
      </div>
    );
  }

  return (
    <div className={`${box} border-[#E5E5E2] bg-white`}>
      <div className="flex-1">
        <p className="text-[17px] font-semibold">Applying somewhere new?</p>
        <p className="mt-1 text-[15px] text-[#3F3F3F]">Paste the job post and we&apos;ll show what your resume is missing.</p>
      </div>
      <Link href="/dashboard/resumes" className={btn}>
        Tailor a resume
      </Link>
    </div>
  );
}
