import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { DimensionTiles, ScoreRing, scoreLabel, scoreVerdict } from "@/components/ats-report-parts";
import { AtsFixList } from "@/components/app/account/ats-fix-list";
import { PageHeader, btnSmPrimary, btnSmWhite } from "@/components/app/account/ui";
import type { FreeAtsReport } from "@/types/ai-results";

export const dynamic = "force-dynamic";

function isReport(v: unknown): v is FreeAtsReport {
  const r = v as FreeAtsReport | null;
  return !!r && typeof r.overall === "number" && Array.isArray(r.fixes) && Array.isArray(r.dimensions);
}

export default async function AtsReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/dashboard/ats-report/${token}`)}`);

  const trial = await prisma.freeAtsTrial.findUnique({
    where: { claimToken: token },
    select: { id: true, userId: true, report: true, createdAt: true },
  });
  if (!trial || !isReport(trial.report)) notFound();

  // First signed-in visit claims the report; after that only its owner can open it.
  if (!trial.userId) {
    const claimed = await prisma.freeAtsTrial.updateMany({
      where: { id: trial.id, userId: null },
      data: { userId: session.sub },
    });
    if (claimed.count === 0) notFound();
  } else if (trial.userId !== session.sub) {
    notFound();
  }

  const report = trial.report;
  const checked = trial.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const high = report.issueCounts.high;

  return (
    <DashboardShell email={session.email} pageTitle="ATS report">
      <div className="mx-auto w-full max-w-[1160px] pb-12">
        <PageHeader
          title="ATS report"
          lead={<>Saved to your account · checked {checked}</>}
          actions={
            <Link href="/resume/new" className={`${btnSmPrimary} px-5 text-[15px]`}>
              Fix in the editor
            </Link>
          }
        />

        <div className="mt-5 grid items-start gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <section
              aria-labelledby="ats-score-title"
              className="lc-card grid gap-5 rounded-[24px] p-[18px] sm:grid-cols-[auto_1fr] sm:items-center sm:gap-7 sm:rounded-[28px] sm:p-7"
            >
              <div className="flex items-center gap-4 sm:block sm:text-center">
                <ScoreRing score={report.overall} className="h-24 w-24 shrink-0 sm:mx-auto sm:h-[150px] sm:w-[150px]" />
                <div className="min-w-0 sm:mt-1.5">
                  <h2 id="ats-score-title" className="text-[20px] font-extrabold text-[#121226] sm:text-[15px]">
                    {scoreLabel(report.overall)}
                  </h2>
                  <p className="mt-0.5 max-w-[220px] text-[13px] leading-[19px] text-[#4a4862] sm:mx-auto sm:max-w-[170px] sm:text-[#66647c]">
                    {scoreVerdict(report.overall)}
                  </p>
                  <p className="mt-1 text-[13px] text-[#4a4862] sm:hidden">
                    {report.totalFixes} fixes · {high} high priority
                  </p>
                </div>
              </div>
              <DimensionTiles dimensions={report.dimensions} />
            </section>

            <AtsFixList fixes={report.fixes} totalFixes={report.totalFixes} />
          </div>

          <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-6">
            <section className="rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-6">
              <h2 className="text-[20px] font-extrabold leading-[25px]">
                {high > 0 ? `Start with the ${high} high-priority ${high === 1 ? "fix" : "fixes"}.` : "Fix them in the editor"}
              </h2>
              <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">
                Import your resume, apply the fixes with AI rewrites and download a clean PDF.
              </p>
              <Link href="/resume/new" className={`${btnSmWhite} mt-4 min-h-12 w-full text-[15px]`}>
                Import my resume
              </Link>
            </section>
            <Link
              href="/dashboard/settings/subscription"
              className="lc-rise group flex items-center gap-4 overflow-hidden rounded-[24px] bg-[#111118] text-white focus-visible:rounded-[24px]! motion-reduce:transition-none motion-reduce:hover:transform-none sm:rounded-[28px]"
            >
              <Image
                src="/images/photos/interview-panel.webp"
                alt="Candidate in an interview with a hiring panel"
                width={1200}
                height={900}
                sizes="120px"
                className="h-[110px] w-[120px] shrink-0 object-cover"
              />
              <span className="pr-4 text-[15px] font-bold leading-[21px]">
                Tailor it to each job and prep for the interview
                <span aria-hidden="true" className="ml-1 inline-block text-[#c9c0ff] transition-transform motion-safe:group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
