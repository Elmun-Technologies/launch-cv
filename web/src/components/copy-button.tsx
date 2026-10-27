"use client";

import { useState } from "react";

/** Small pill that copies `text` to the clipboard and confirms for two seconds. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
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
      className="inline-flex h-9 shrink-0 items-center rounded-full border border-[#D9D9D5] bg-white px-4 text-[13px] font-medium text-[#111111] hover:border-[#111111]"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
