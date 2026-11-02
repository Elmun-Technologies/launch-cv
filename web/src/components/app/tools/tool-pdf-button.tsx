"use client";

/** "PDF" download in the tool header. Uses the template last picked in the editor (stored per resume). */
export function ToolPdfButton({ resumeId }: { resumeId: string }) {
  function download() {
    let template = "classic";
    try {
      template = window.localStorage.getItem(`lcv_tpl_${resumeId}`) || "classic";
    } catch {
      /* storage blocked — the server falls back to the default template */
    }
    window.open(`/api/resumes/${resumeId}/pdf?template=${encodeURIComponent(template)}`, "_blank", "noopener,noreferrer");
  }
  return (
    <button
      type="button"
      onClick={download}
      aria-label="Download PDF"
      className="lc-btn-lift inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#111118] px-4 text-[14px] font-semibold text-white hover:bg-[#2a2940] motion-reduce:transform-none"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      PDF
    </button>
  );
}
