import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { DimensionTiles, ParsedPanel, ScoreRing, dimensionNote, scoreLabel, scoreVerdict } from "@/components/ats-report-parts";
import { AtsFixCards, AtsFixList } from "@/components/app/account/ats-fix-list";
import { PrintButton } from "@/components/app/account/print-button";
import { PageHeader, btnSmPrimary, btnSmWhite } from "@/components/app/account/ui";
import type { FreeAtsReport } from "@/types/ai-results";

export const dynamic = "force-dynamic";

function isReport(v: unknown): v is FreeAtsReport {
  const r = v as FreeAtsReport | null;
  return !!r && typeof r.overall === "number" && Array.isArray(r.fixes) && Array.isArray(r.dimensions);
}

/** Older reports were stored before `parsed` existed; only show the panel for well-formed data. */
function hasParsed(r: FreeAtsReport): boolean {
  const p = r.parsed;
  return !!p && typeof p === "object" && typeof p.email === "boolean" && !!p.jobTitles && !!p.dates;
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
  const fileName = typeof report.fileName === "string" && report.fileName ? report.fileName : null;
  const parsed = hasParsed(report) ? report.parsed : undefined;
  const notes = Object.fromEntries(report.dimensions.map((d) => [d.name, dimensionNote(d.name, d.score, report.fixes, parsed)]));
  const total = Math.max(report.totalFixes, report.fixes.length);

  return (
    <DashboardShell email={session.email} pageTitle="ATS report">
      <div className="mx-auto w-full max-w-[1160px] pb-12 print:max-w-none print:pb-0">
        <PageHeader
          title="ATS report"
          lead={
            <>
              {fileName ? <span className="break-all">{fileName}</span> : "Saved to your account"}
              <span className="hidden sm:inline print:inline"> · checked {checked}</span>
            </>
          }
          actions={
            <div className="hidden gap-2 sm:flex print:hidden">
              <PrintButton className={`${btnSmWhite} px-5 text-[15px]`} />
              <Link href="/resume/new" className={`${btnSmPrimary} px-5 text-[15px]`}>
                Fix in the editor
              </Link>
            </div>
          }
        />

        <div className="mt-4 grid items-start gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="flex min-w-0 flex-col sm:gap-5">
            <section
              aria-labelledby="ats-score-title"
              className="lc-card grid gap-5 rounded-[24px] p-[18px] sm:grid-cols-[auto_1fr] sm:items-center sm:gap-7 sm:rounded-[28px] sm:p-7 print:break-inside-avoid print:shadow-none"
            >
              <div className="flex items-center gap-4 sm:block sm:text-center">
                <ScoreRing score={report.overall} className="h-24 w-24 shrink-0 sm:mx-auto sm:h-[150px] sm:w-[150px]" />
                <div className="min-w-0 sm:mt-1.5">
                  <h2 id="ats-score-title" className="text-[20px] font-extrabold text-[#121226] sm:text-[15px]">
                    {scoreLabel(report.overall)}
                  </h2>
                  <p className="mt-0.5 hidden max-w-[170px] text-[13px] leading-[19px] text-[#66647c] sm:mx-auto sm:block">
                    {report.overall < 80 ? "Aim for 80+" : scoreVerdict(report.overall)}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#4a4862] sm:hidden">
                    {total} {total === 1 ? "issue" : "issues"} · {high} high priority
                  </p>
                </div>
              </div>
              <DimensionTiles dimensions={report.dimensions} notes={notes} className="hidden sm:grid" />
            </section>

            {/* Phones: tiles sit on the page, then the high-priority fixes as cards. */}
            <DimensionTiles dimensions={report.dimensions} bare className="mt-2.5 sm:hidden print:hidden" />
            <div className="sm:hidden print:hidden">
              <AtsFixCards fixes={report.fixes} />
              <Link href="/resume/new" className={`${btnSmPrimary} mt-4 min-h-[52px] w-full text-[16px]`}>
                Fix in the editor
              </Link>
            </div>

            <div className="hidden sm:block print:block">
              <AtsFixList fixes={report.fixes} totalFixes={report.totalFixes} />
            </div>
          </div>

          <aside aria-label="Report summary" className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-6">
            {parsed ? <ParsedPanel parsed={parsed} /> : null}
            <section className="hidden rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:block sm:rounded-[28px] sm:p-6 print:hidden!">
              <h2 className="text-[20px] font-extrabold leading-[25px]">
                {high > 0 ? `Start with the ${high} high-priority ${high === 1 ? "fix" : "fixes"}.` : "Fix them in the editor"}
              </h2>
              <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">
                Import this resume into a one-column template, apply the fixes with AI rewrites and download a clean PDF.
              </p>
              <Link href="/resume/new" className={`${btnSmWhite} mt-4 min-h-12 w-full text-[15px]`}>
                Import into the editor
              </Link>
            </section>
            <Link
              href="/dashboard/settings/subscription"
              className="lc-rise group hidden items-center gap-4 overflow-hidden sm:flex rounded-[24px] bg-[#111118] text-white focus-visible:rounded-[24px]! motion-reduce:transition-none motion-reduce:hover:transform-none sm:rounded-[28px] print:hidden!"
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
