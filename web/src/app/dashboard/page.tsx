import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Briefcase, FileSearch, Lightbulb, Plus, Upload } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getUserPlanId } from "@/lib/plans";
import { parseResumeContent } from "@/lib/resume-json";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { DashboardShell } from "@/components/dashboard-shell";
import { CtaLink } from "@/components/cta-link";
import { ResumeThumb } from "@/components/app/shell/resume-thumb";
import { TodayDate } from "@/components/app/shell/today-date";
import {
  ago,
  appBtnDark,
  appBtnPrimary,
  appBtnWhite,
  appCard,
  appH1,
  appLead,
  appLink,
  badge,
  scoreTone,
} from "@/components/app/shell/ui";
import type { FreeAtsReport } from "@/types/ai-results";

export const dynamic = "force-dynamic";

type Stage = "saved" | "applied" | "interview" | "offer";

/** Same buckets the job tracker uses. */
const STAGE: Record<string, Stage> = {
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

const STAGE_BADGE: Record<Stage, { label: string; cls: string }> = {
  saved: { label: "Saved", cls: "bg-[#f1eff8] text-[#4a4862]" },
  applied: { label: "Applied", cls: "bg-[#f1eff8] text-[#4a4862]" },
  interview: { label: "Interview", cls: "bg-[#e4dfff] text-[#3a2bb8]" },
  offer: { label: "Offer", cls: "bg-[#dcf5ea] text-[#0b4f35]" },
};

function joinedToday(d: Date): boolean {
  return Date.now() - d.getTime() < 24 * 60 * 60 * 1000;
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
      select: { id: true, title: true, company: true, status: true, resumeId: true },
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
  const token = ats?.claimToken ?? null;
  const topFix = report?.fixes.find((f) => f.priority === "High") ?? report?.fixes[0];
  const hello = `${isNew ? "Welcome" : "Welcome back"}${firstName ? `, ${firstName}` : ""}`;

  const counts = { applied: 0, interview: 0, offer: 0 };
  for (const a of apps) {
    const st = STAGE[a.status] ?? "saved";
    if (st !== "saved") counts[st] += 1;
  }
  const stats = [
    { label: "Applied", n: counts.applied, hl: false },
    { label: "Interview", n: counts.interview, hl: true },
    { label: "Offer", n: counts.offer, hl: false },
  ];

  // Nothing to show yet: a fresh account with no resume, job or claimed ATS report.
  const empty = resumeCount === 0 && apps.length === 0 && !(report && token);

  if (empty) {
    return (
      <DashboardShell email={session.email} pageTitle="Home">
        <div className="mx-auto max-w-[1180px]">
          <h1 className={appH1}>{hello}</h1>
          <p className={appLead}>Let&apos;s get your resume past the software.</p>
          <EmptyStart examplesCount={RESUME_EXAMPLES.length} />
        </div>
      </DashboardShell>
    );
  }

  const interviewApp = apps.find((a) => STAGE[a.status] === "interview" && a.company);
  const packetResumeId = interviewApp?.resumeId ?? resumes[0]?.id;

  return (
    <DashboardShell email={session.email} pageTitle="Home">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <h1 className={appH1}>{hello}</h1>
            <TodayDate className={`${appLead} hidden sm:block`} />
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

        <NextStep
          paid={paid}
          resumeCount={resumeCount}
          report={report}
          token={token}
          topFix={topFix?.title}
          editHref={resumes[0] ? `/resume/${resumes[0].id}/edit` : null}
        />

        {/* Phone: job stats sit right under the next step. */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 sm:hidden">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 ${s.hl ? "bg-[#111118]" : "bg-white"}`}>
              <p className={`text-[24px] font-extrabold leading-8 [font-feature-settings:'tnum'] ${s.hl ? "text-white" : "text-[#121226]"}`}>{s.n}</p>
              <p className={`text-[12px] ${s.hl ? "text-[#c9c7d8]" : "text-[#4a4862]"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-[22px] grid items-start gap-5 sm:mt-6 xl:grid-cols-[1.55fr_1fr]">
          {/* RESUMES */}
          <section aria-labelledby="home-resumes" className={`${appCard} p-4 sm:p-6`}>
            <div className="flex items-center justify-between gap-3">
              <h2 id="home-resumes" className="text-[19px] font-extrabold sm:text-[20px]">
                Your resumes
              </h2>
              {resumeCount > 0 ? (
                <Link href="/dashboard/resumes" className={appLink}>
                  See all {resumeCount} <span aria-hidden="true">&nbsp;→</span>
                </Link>
              ) : null}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-3">
              {resumes.slice(0, 2).map((r) => {
                const content = parseResumeContent(r.content);
                return (
                  <Link
                    key={r.id}
                    href={`/resume/${r.id}/edit`}
                    className="focus-visible:outline-[#5440e8]! focus-visible:rounded-[20px]! sm:focus-visible:rounded-[24px]! lc-card lc-rise block min-w-0 rounded-[20px] p-1.5 text-[#121226] motion-reduce:hover:transform-none sm:rounded-[24px] sm:p-2"
                  >
                    <div className="relative h-[150px] overflow-hidden rounded-2xl bg-[#e4dfff] sm:h-[230px]">
                      <div className="absolute left-1/2 top-[18px] -translate-x-1/2 sm:hidden">
                        <ResumeThumb content={content} width={134} />
                      </div>
                      <div className="absolute left-1/2 top-[18px] hidden -translate-x-1/2 sm:block">
                        <ResumeThumb content={content} width={210} />
                      </div>
                    </div>
                    <div className="px-1 pb-1 pt-2 sm:px-2 sm:pb-1.5 sm:pt-3">
                      <span className="block truncate text-[13px] font-extrabold leading-5 sm:text-[15px]">{r.title}</span>
                      <span className="mt-0.5 block text-[11px] text-[#66647c] sm:mt-1.5 sm:text-[13px]">Edited {ago(r.updatedAt)}</span>
                    </div>
                  </Link>
                );
              })}
              <Link
                href={resumeCount > 0 ? "/dashboard/resumes" : "/resume/new"}
                className={`${
                  resumeCount > 0 ? "hidden sm:flex" : "col-span-2 flex sm:col-span-1"
                } focus-visible:outline-[#5440e8]! focus-visible:rounded-[24px]! min-h-[220px] flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-[#b5aaf7] p-5 text-center text-[15px] font-bold text-[#3a2bb8] transition-colors hover:border-[#5440e8] hover:bg-white/60 sm:min-h-[300px]`}
              >
                <span aria-hidden="true" className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#5440e8] text-white">
                  <Plus className="h-[22px] w-[22px]" strokeWidth={2.2} />
                </span>
                {resumeCount > 0 ? "Tailor one to a new job" : "Create or import your first resume"}
              </Link>
            </div>
          </section>

          {/* SIDE */}
          <div className="flex min-w-0 flex-col gap-5">
            <section aria-labelledby="home-apps" className={`${appCard} p-[18px] sm:p-6`}>
              <div className="flex items-center justify-between gap-3">
                <h2 id="home-apps" className="text-[17px] font-extrabold sm:text-[20px]">
                  Applications
                </h2>
                <Link href="/dashboard/job-tracker" className={appLink}>
                  Tracker <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </div>
              <div className="mt-3 hidden grid-cols-3 gap-2 sm:grid">
                {stats.map((s) => (
                  <div key={s.label} className={`rounded-2xl p-3.5 ${s.hl ? "bg-[#5440e8]" : "bg-[#f1eff8]"}`}>
                    <p className={`text-[28px] font-extrabold leading-9 tracking-[-0.03em] [font-feature-settings:'tnum'] ${s.hl ? "text-white" : "text-[#121226]"}`}>
                      {s.n}
                    </p>
                    <p className={`mt-0.5 text-[13px] ${s.hl ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{s.label}</p>
                  </div>
                ))}
              </div>
              {apps.length > 0 ? (
                <ul className="mt-1 sm:mt-3">
                  {apps.slice(0, 3).map((a) => {
                    const st = STAGE_BADGE[STAGE[a.status] ?? "saved"];
                    return (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-3 border-t border-[#e2e0ea] py-3 text-[13px] first:border-t-0 sm:text-[14px] sm:first:border-t"
                      >
                        <span className="min-w-0 truncate">
                          {a.company ? <b>{a.company}</b> : null}
                          {a.company && a.title ? " · " : null}
                          {a.title || (a.company ? null : "Untitled application")}
                        </span>
                        <span className={`${badge} ${st.cls}`}>{st.label}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-3 text-[14px] leading-[1.55] text-[#4a4862]">
                  Track every job you apply to in one place, with the resume version you sent.
                </p>
              )}
            </section>

            <section
              aria-labelledby="home-packet"
              className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#111118] p-6 text-white sm:rounded-[28px]"
            >
              <div aria-hidden="true" className="absolute -bottom-10 -right-[30px] h-[170px] w-[170px] overflow-hidden rounded-full bg-[#ff7a33] sm:h-[200px] sm:w-[200px]">
                <Image
                  src="/images/people/man-blazer-glasses.webp"
                  alt=""
                  width={767}
                  height={1080}
                  sizes="200px"
                  className="absolute left-1/2 top-2.5 h-[220px] w-auto max-w-none -translate-x-1/2 sm:h-[260px]"
                />
              </div>
              <div className="relative max-w-[58%] sm:max-w-[240px]">
                <h2 id="home-packet" className="text-[19px] font-extrabold leading-[25px] sm:text-[20px]">
                  {interviewApp ? `Interview at ${interviewApp.company} coming up?` : "Got an interview coming up?"}
                </h2>
                <p className="mt-2 text-[14px] leading-[21px] text-[#c9c7d8]">
                  Build an application packet: likely questions, answers drawn from your resume and a cover letter for that job.
                </p>
                <Link
                  href={packetResumeId ? `/resume/${packetResumeId}/packet` : "/resume/new"}
                  className={`${appBtnPrimary} mt-4 px-4! text-[14px]!`}
                >
                  {packetResumeId ? "Prepare now" : "Add a resume first"}
                </Link>
              </div>
            </section>
          </div>
        </div>

        <Link href="/resume/new" className={`${appBtnDark} mt-4 w-full sm:hidden`}>
          <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden /> New resume
        </Link>
      </div>
    </DashboardShell>
  );
}

function ScoreRing({ score, size }: { score: number; size: number }) {
  const r = 44.5;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <span className="inline-flex shrink-0 rounded-full bg-white p-[5px] sm:p-2">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`ATS score ${v} out of 100`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#efedf7" strokeWidth="11" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={scoreTone(v).ring}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * c} ${c}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226">
          {v}
        </text>
      </svg>
    </span>
  );
}

function NextStep({
  paid,
  resumeCount,
  report,
  token,
  topFix,
  editHref,
}: {
  paid: boolean;
  resumeCount: number;
  report: FreeAtsReport | null;
  token: string | null;
  topFix?: string;
  editHref: string | null;
}) {
  let title: string;
  let sub: string | null = null;
  let ring: number | null = null;
  let actions: React.ReactNode;
  const white = `${appBtnWhite} hover:bg-[#f1eff8]!`;
  const dark = appBtnDark;

  if (report && token) {
    const n = report.totalFixes;
    ring = report.overall;
    title = n > 0 ? `Your free check found ${n} ${n === 1 ? "issue" : "issues"}. Start with the top one.` : "Your free ATS check is ready.";
    sub = topFix ? `Top fix: ${topFix}` : null;
    actions = (
      <>
        {editHref ? (
          <Link href={editHref} className={white}>
            Fix it in the editor
          </Link>
        ) : (
          <CtaLink cta="import_resume" location="dashboard_next_step" href="/resume/new" className={white}>
            Import and fix it
          </CtaLink>
        )}
        <Link href={`/dashboard/ats-report/${token}`} className={dark}>
          Full report
        </Link>
      </>
    );
  } else if (resumeCount === 0) {
    title = "Start with the resume you already have";
    sub = "Upload a PDF or Word file and every section is filled in for you to edit. No resume yet? Build one from scratch.";
    actions = (
      <CtaLink cta="import_resume" location="dashboard_next_step" href="/resume/new" className={white}>
        Import my resume
      </CtaLink>
    );
  } else if (!paid) {
    title = "Tailor your resume to each job with AI";
    sub = "Match it to a job post, rewrite weak bullets and generate a cover letter — on any plan.";
    actions = (
      <CtaLink cta="choose_plan" location="dashboard_next_step" href="/dashboard/settings/subscription" className={white}>
        See plans
      </CtaLink>
    );
  } else {
    title = "Applying somewhere new?";
    sub = "Paste the job post and we'll show what your resume is missing.";
    actions = (
      <Link href="/dashboard/resumes" className={white}>
        Tailor a resume
      </Link>
    );
  }

  return (
    <section
      aria-labelledby="home-next"
      className="mt-4 flex flex-col gap-3.5 rounded-[24px] bg-[#5440e8] p-5 text-white sm:mt-7 sm:rounded-[28px] sm:px-8 sm:py-7 xl:flex-row xl:items-center xl:gap-7"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-7">
        {ring !== null ? (
          <>
            <span className="sm:hidden">
              <ScoreRing score={ring} size={64} />
            </span>
            <span className="hidden sm:inline-flex">
              <ScoreRing score={ring} size={92} />
            </span>
          </>
        ) : null}
        <div className="min-w-0">
          <p className="hidden text-[13px] font-bold uppercase tracking-[0.08em] text-[#e4dfff] sm:block">Your next step</p>
          <h2 id="home-next" className="text-[18px] font-extrabold leading-[23px] tracking-[-0.02em] sm:mt-1.5 sm:text-[26px] sm:leading-[31px]">
            {title}
          </h2>
          {sub ? <p className="mt-1.5 hidden text-[15px] text-[#e4dfff] sm:block">{sub}</p> : null}
        </div>
      </div>
      {sub ? <p className="text-[14px] text-[#e4dfff] sm:hidden">{sub}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:shrink-0">{actions}</div>
    </section>
  );
}

function EmptyStart({ examplesCount }: { examplesCount: number }) {
  const steps = [
    {
      n: "01",
      icon: Upload,
      title: "Import your resume",
      text: "We read your PDF or Word file and fill in every section.",
      cta: (
        <CtaLink cta="import_resume" location="dashboard_next_step" href="/resume/new" className={`${appBtnWhite} mt-[18px] text-[14px]!`}>
          Import resume
        </CtaLink>
      ),
      primary: true,
    },
    {
      n: "02",
      icon: FileSearch,
      title: "See your ATS score",
      text: "Find out what the software reads — and what it misses.",
      cta: (
        <Link href="/free-ats-check" className={`${appBtnDark} mt-[18px] text-[14px]!`}>
          Check my resume
        </Link>
      ),
      primary: false,
    },
    {
      n: "03",
      icon: Briefcase,
      title: "Track your first job",
      text: "Save a posting and the resume you send.",
      cta: (
        <Link href="/dashboard/job-tracker" className={`${appBtnDark} mt-[18px] text-[14px]!`}>
          Add a job
        </Link>
      ),
      primary: false,
    },
  ];

  return (
    <>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className={`flex flex-col items-start rounded-[24px] p-6 sm:rounded-[28px] sm:p-7 ${s.primary ? "bg-[#5440e8] text-white" : "lc-card text-[#121226]"}`}
          >
            <p className={`lc-mono text-[13px] ${s.primary ? "text-[#e4dfff]" : "text-[#5440e8]"}`}>
              <span className="sr-only">Step </span>
              {s.n}
            </p>
            <span
              aria-hidden="true"
              className={`mt-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${
                s.primary ? "bg-white text-[#5440e8]" : "bg-[#e4dfff] text-[#3a2bb8]"
              }`}
            >
              <s.icon className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h2 className="mt-[18px] text-[22px] font-extrabold">{s.title}</h2>
            <p className={`mt-1.5 flex-1 text-[15px] leading-[23px] ${s.primary ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{s.text}</p>
            {s.cta}
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-col gap-3 rounded-[22px] bg-white p-5 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <span aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#fdf0d5] text-[#7a4600]">
          <Lightbulb className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <p className="flex-1 text-[15px] text-[#4a4862]">
          <b className="text-[#121226]">No resume yet?</b> Start from one of {examplesCount} full examples for your role and swap in your details.
        </p>
        <Link href="/resume-examples" className={appLink}>
          Browse examples <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
        </Link>
      </div>
    </>
  );
}
