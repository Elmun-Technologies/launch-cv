"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

/** The 10 one-time recovery codes, shown once, with copy and download. */
export function RecoveryCodesList({ codes, email }: { codes: string[]; email: string }) {
  const [copied, setCopied] = useState(false);
  const text = `LaunchCV Admin recovery codes for ${email}\nEach code works once.\n\n${codes.join("\n")}\n`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchcv-admin-recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const btn =
    "lc-btn-lift inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-[#f1eff8] px-4 text-[14px] font-semibold text-[#121226] hover:bg-[#e4dfff] sm:min-h-[40px]";

  return (
    <div className="mt-5">
      <ol aria-label="Recovery codes" className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f7f6fb] p-4">
        {codes.map((c) => (
          <li key={c} className="lc-mono rounded-lg bg-white px-3 py-2 text-center text-[15px] tracking-[0.06em] text-[#121226]">
            {c}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => void copy()} className={btn}>
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" onClick={download} className={btn}>
          <Download className="h-4 w-4" aria-hidden /> Download
        </button>
      </div>
      <p role="status" className="sr-only">
        {copied ? "Recovery codes copied" : ""}
      </p>
    </div>
  );
}
