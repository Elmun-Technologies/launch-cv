"use client";

import { useState } from "react";

/**
 * "Download as Word" for the free letter pages: posts the text on screen to
 * /api/free/letter-docx (no account) and saves the .docx it returns. Status
 * changes are announced in a polite live region.
 */
export function WordDownload({
  text,
  filename,
  label = "Download as Word",
  srLabel,
  tone = "light",
}: {
  text: string;
  /** Lowercase, hyphenated, no extension. */
  filename: string;
  label?: string;
  /** Unique accessible name when several buttons share a page. */
  srLabel?: string;
  /** light: white pill (template pages); panel: on the dark generator panel. */
  tone?: "light" | "panel";
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function download() {
    if (state === "busy") return;
    setState("busy");
    const res = await fetch("/api/free/letter-docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, filename }),
    }).catch(() => null);
    if (!res?.ok) {
      setState("error");
      return;
    }
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setState("done");
    setTimeout(() => setState("idle"), 3000);
  }

  const cls =
    tone === "panel"
      ? "inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-bold text-white transition-colors hover:bg-white/20 disabled:opacity-60"
      : "lc-btn-lift inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-[18px] text-[14px] font-semibold text-[#121226] hover:bg-[#e4dfff] disabled:opacity-60";
  const visible = state === "busy" ? "Preparing…" : state === "error" ? "Try again" : state === "done" ? "Downloaded" : label;
  const status =
    state === "busy" ? "Preparing the Word file" : state === "done" ? "Word file downloaded" : state === "error" ? "The download didn't work. Try again." : "";

  return (
    <>
      <button type="button" onClick={() => void download()} disabled={state === "busy"} aria-label={srLabel} className={cls}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </svg>
        <span aria-hidden={srLabel ? true : undefined}>{visible}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {status}
      </span>
    </>
  );
}
