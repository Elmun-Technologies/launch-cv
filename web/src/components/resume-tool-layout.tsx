import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export type ResumeTool = "edit" | "jd" | "fit" | "packet" | "evidence" | "snapshots";

const TOOLS: { key: ResumeTool; label: string }[] = [
  { key: "edit", label: "Edit" },
  { key: "jd", label: "Match to a job" },
  { key: "fit", label: "Role fit" },
  { key: "packet", label: "Cover letter & interview" },
  { key: "evidence", label: "Consistency" },
  { key: "snapshots", label: "Versions" },
];

/** Frame for the per-resume tool pages (/resume/[id]/*): resume title, tool tabs, page heading. */
export function ResumeToolLayout({
  resumeId,
  resumeTitle,
  active,
  title,
  lead,
  children,
}: {
  resumeId: string;
  resumeTitle: string;
  active: ResumeTool;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111111]">
      <header className="border-b border-[#EEEEEB] bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1000px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/resumes"
              aria-label="Back to resumes"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#F5F5F3]"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>
            <span className="truncate text-[15px] font-medium">{resumeTitle}</span>
          </div>
          <Logo variant="light" size="sm" href="/dashboard" />
        </div>
        <nav aria-label="Resume tools" className="mx-auto max-w-[1000px] overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-1 whitespace-nowrap">
            {TOOLS.map((t) => {
              const on = t.key === active;
              return (
                <li key={t.key}>
                  <Link
                    href={`/resume/${resumeId}/${t.key}`}
                    aria-current={on ? "page" : undefined}
                    className={`inline-flex h-11 items-center border-b-2 px-3 text-[14px] ${
                      on ? "border-[#111111] font-medium text-[#111111]" : "border-transparent text-[#6B6B6B] hover:text-[#111111]"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-[1000px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[30px]">{title}</h1>
        <p className="mt-1.5 max-w-[640px] text-[15px] leading-[1.55] text-[#6B6B6B]">{lead}</p>
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}
