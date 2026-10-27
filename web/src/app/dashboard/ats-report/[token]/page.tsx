import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { DimensionBars, FixItem, scoreVerdict } from "@/components/ats-report-parts";
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
    select: { id: true, userId: true, report: true },
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

  return (
    <DashboardShell email={session.email} pageTitle="ATS report">
      <div className="mx-auto max-w-[1000px] pb-16">
        <div className="flex flex-col gap-8 border-b border-[#EEEEEB] pb-10 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex-1">
            <p className="text-[14px] text-[#6B6B6B]">Your ATS score · saved to your account</p>
            <p className="mt-1.5 flex items-baseline gap-3">
              <span className="text-[80px] font-semibold leading-[0.9] tracking-[-0.05em] text-[#111111]">
                {report.overall}
              </span>
              <span className="text-[22px] text-[#6E6E6A]">/ 100</span>
            </p>
            <h1 className="mt-5 max-w-[560px] text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#111111]">
              {scoreVerdict(report.overall)}{" "}
              <span className="text-[#6E6E6A]">Here is every issue we found.</span>
            </h1>
          </div>
          <div className="w-full lg:max-w-[380px]">
            <DimensionBars dimensions={report.dimensions} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-10 lg:flex-row">
          <section className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#111111]">
                All {report.totalFixes} fixes
              </h2>
              <span className="text-[14px] text-[#6B6B6B]">
                {report.issueCounts.high} high · {report.issueCounts.medium} medium · {report.issueCounts.low} low
              </span>
            </div>
            <ol className="mt-3">
              {report.fixes.map((f, i) => (
                <FixItem key={`${i}-${f.title}`} fix={f} n={i + 1} />
              ))}
            </ol>
          </section>

          <aside className="flex w-full flex-col gap-4 lg:w-[320px]">
            <div className="rounded-[18px] bg-[#111111] p-6 text-white">
              <p className="text-[18px] font-semibold tracking-[-0.01em]">Fix them in the editor</p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#B5B5B0]">
                Import your resume, apply the fixes with AI rewrites and download a clean PDF.
              </p>
              <Link
                href="/resume/new"
                className="mt-4 inline-flex h-11 items-center rounded-full bg-white px-5 text-[14px] font-medium text-[#111111]"
              >
                Import my resume
              </Link>
            </div>
            <Link
              href="/dashboard/settings/subscription"
              className="flex items-center gap-4 overflow-hidden rounded-[18px] border border-[#E5E5E2]"
            >
              <Image
                src="/images/photos/interview-panel.webp"
                alt="Candidate in an interview with a hiring panel"
                width={1200}
                height={900}
                className="h-[110px] w-[120px] object-cover"
              />
              <span className="pr-4 text-[15px] font-medium leading-snug text-[#111111]">
                Tailor it to each job and prep for the interview
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
