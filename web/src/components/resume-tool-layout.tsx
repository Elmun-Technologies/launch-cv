import Link from "next/link";
import type { ReactNode } from "react";
import { siteFontVars } from "@/lib/site-fonts";
import { ToolPdfButton } from "@/components/app/tools/tool-pdf-button";

export type ResumeTool = "edit" | "jd" | "fit" | "packet" | "evidence" | "snapshots";

const TOOLS: { key: ResumeTool; label: string }[] = [
  { key: "edit", label: "Edit" },
  { key: "jd", label: "Match to a job" },
  { key: "fit", label: "Role fit" },
  { key: "packet", label: "Cover letter & interview" },
  { key: "evidence", label: "Consistency" },
  { key: "snapshots", label: "Versions" },
];

/**
 * Frame for the per-resume tool pages (/resume/[id]/*): resume title, tool tabs, page heading.
 * Rendered outside the dashboard shell, so it sets the v5 `lc-site` scope and fonts itself.
 */
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
    <div className={`lc-site ${siteFontVars} min-h-screen overflow-x-clip bg-[#eeecf4] text-[#121226]`}>
      <header className="border-b border-[#e2e0ea] bg-white">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-0 px-4 py-3 lg:px-7 xl:flex-nowrap xl:py-3.5">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/resumes"
              aria-label="Back to resumes"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] transition-colors hover:bg-[#e4dfff]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="m11 18-6-6 6-6" />
              </svg>
            </Link>
            <span className="truncate text-[15px] font-bold sm:text-[16px]">{resumeTitle}</span>
          </div>

          <nav
            aria-label="Resume tools"
            className="-mx-4 order-last w-[calc(100%+32px)] overflow-x-auto px-3 pb-1 pt-1.5 [scrollbar-width:none] sm:-mx-1 sm:w-[calc(100%+8px)] sm:px-0 xl:order-none xl:mx-0 xl:w-auto xl:p-0 [&::-webkit-scrollbar]:hidden"
          >
            <ul className="flex w-max gap-1 whitespace-nowrap p-1 xl:gap-0.5 xl:rounded-full xl:bg-[#f1eff8]">
              {TOOLS.map((t) => {
                const on = t.key === active;
                return (
                  <li key={t.key}>
                    <Link
                      href={`/resume/${resumeId}/${t.key}`}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex h-11 items-center rounded-full px-3 text-[13px] focus-visible:outline-offset-0 font-bold transition-colors sm:px-4 sm:text-[14px] ${
                        on ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#e4dfff] hover:text-[#121226] xl:font-semibold"
                      }`}
                    >
                      {t.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <a
              href={`/api/resumes/${resumeId}/docx`}
              download
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] px-4 text-[14px] font-semibold text-[#121226] hover:bg-[#e4dfff] max-lg:hidden"
            >
              <span>
                <span className="sr-only">Download resume as </span>Word
              </span>
            </a>
            <ToolPdfButton resumeId={resumeId} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-4 pb-14 pt-4 sm:px-6 sm:pt-8 lg:px-10">
        <h1 className="text-[28px] font-extrabold leading-[32px] tracking-[-0.03em] sm:text-[34px] sm:leading-[38px]">{title}</h1>
        <p className="mt-1.5 max-w-[760px] text-[15px] leading-[22px] text-[#4a4862] sm:text-[16px] sm:leading-6">{lead}</p>
        <div className="mt-4 sm:mt-6">{children}</div>
      </main>
    </div>
  );
}
