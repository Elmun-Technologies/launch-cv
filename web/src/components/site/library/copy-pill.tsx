"use client";

import { useState } from "react";

/** v5 copy-to-clipboard pill (the old CopyButton stays for the dashboard). */
export function CopyPill({
  text,
  label = "Copy",
  tone = "light",
  className = "",
}: {
  text: string;
  label?: string;
  tone?: "light" | "soft" | "dark";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const t = {
    light: "bg-white text-[#121226] hover:bg-[#e4dfff]",
    soft: "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]",
    dark: "bg-[#111118] text-white hover:bg-[#2a2940]",
  }[tone];
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className={`lc-btn-lift inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-[18px] text-[14px] font-semibold ${t} ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {copied ? (
          <path d="m5 12 5 5 9-10" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
