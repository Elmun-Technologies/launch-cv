"use client";

import { useState } from "react";
import { CtaLink } from "@/components/cta-link";

/** Shared bits for the free tool widgets (v5 look). */

export const fieldLabel = "block text-[13px] font-bold text-[#4a4862]";
export const fieldCls =
  "mt-1.5 block min-h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 py-3 text-[16px] leading-6 text-[#121226] transition-colors placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] disabled:bg-[#f6f5fa] sm:text-[15px]";
export const toolBtn =
  "lc-btn-lift motion-reduce:hover:transform-none inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-[26px] py-[14px] text-[16px] font-semibold";

export function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}

export function Spinner() {
  return <span aria-hidden="true" className="inline-block h-[18px] w-[18px] rounded-full border-[2.5px] border-white border-r-transparent motion-safe:animate-spin" />;
}

/** Copy button with a unique accessible name per option. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
        className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3.5 text-[13px] font-bold text-white transition-colors hover:bg-white/20"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {copied ? (
            <path d="m5 12 5 5 9-10" />
          ) : (
            <>
              <rect x="9" y="9" width="11" height="11" rx="2" />
              <path d="M5 15V6a2 2 0 0 1 2-2h9" />
            </>
          )}
        </svg>
        <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied` : ""}
      </span>
    </>
  );
}

export type ToolErr = { message: string; limit: boolean };

/** Inline error under a form; the daily-limit case links to sign-up. */
export function ToolError({ err, location }: { err: ToolErr | null; location: string }) {
  return (
    <div role="alert">
      {err ? (
        <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-[#fbe2e3] p-3.5 text-[14px] text-[#8f1d22]">
          <span aria-hidden="true" className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white font-extrabold text-[#c42b30]">
            !
          </span>
          <div>
            <p>{err.message}</p>
            {err.limit ? (
              <CtaLink cta="create_account" location={location} href="/register" className="lc-link mt-1 inline-block py-1 font-semibold text-[#8f1d22]">
                Create a free account →
              </CtaLink>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** POST JSON to a free generator route and normalize the outcome. */
export async function postGenerator<T>(url: string, body: unknown): Promise<{ ok: true; data: T } | { ok: false; err: ToolErr }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok) return { ok: true, data: json as T };
    const message = typeof json.error === "string" && json.error ? json.error : "Something went wrong. Please try again.";
    return { ok: false, err: { message, limit: res.status === 429 } };
  } catch {
    return { ok: false, err: { message: "Network error. Check your connection and try again.", limit: false } };
  }
}

/** "3 of 10 free generations left today" — only when the API reported it. */
export function RemainingNote({ remaining, limit }: { remaining?: number | null; limit?: number }) {
  if (typeof remaining !== "number" || typeof limit !== "number") return null;
  return (
    <p className="mt-3 text-[12px] text-[#b3b0c8]">
      {remaining} of {limit} free generations left today
    </p>
  );
}

export function PausedNote() {
  return (
    <p role="status" className="mb-4 rounded-2xl bg-[#fdf0d5] p-3.5 text-[14px] text-[#7a4600]">
      The free writing tools are paused for a short while. Please try again later.
    </p>
  );
}
