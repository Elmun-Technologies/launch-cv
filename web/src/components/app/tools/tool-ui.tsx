"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

/**
 * v5 building blocks for the per-resume AI tools (/resume/[id]/*).
 * Colors follow components/site/ui.tsx: ink #121226, body #4a4862, muted #66647c,
 * primary #5440e8, dark #111118, hairline #e2e0ea, soft #f1eff8 / #f7f6fb.
 */

/** White card. */
export const toolCard = "lc-card rounded-[22px] p-4 sm:rounded-[26px] sm:p-[26px]";
/** Dark (ink) panel. */
export const toolDark = "rounded-[22px] bg-[#111118] p-[18px] text-white sm:rounded-[26px] sm:p-6";
/** Card heading. */
export const toolH2 = "text-[17px] font-extrabold tracking-[-0.01em] sm:text-[20px]";
/** Small caps eyebrow. */
export const toolEyebrow = "text-[12px] font-bold tracking-[.08em] sm:text-[13px]";

const pill =
  "lc-btn-lift motion-reduce:transform-none inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold disabled:pointer-events-none disabled:opacity-60";
export const pillDark = `${pill} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const pillSoft = `${pill} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
export const pillWhite = `${pill} bg-white text-[#121226] ring-1 ring-[#e2e0ea] hover:ring-[#c9c0ff]`;
export const pillPrimary = `${pill} bg-[#5440e8] text-white hover:bg-[#4430d6]`;

/** Big primary action (Analyze, Generate…). */
export const toolSubmit =
  "lc-btn-lift motion-reduce:transform-none inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#5440e8] px-[26px] text-[16px] font-semibold text-white hover:bg-[#4430d6] disabled:pointer-events-none disabled:opacity-60";

const fieldBase =
  "block w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! disabled:opacity-60 sm:text-[15px]";
/** 48px single-line input; 16px text on phones (no iOS zoom). */
export const toolInput = `${fieldBase} h-12`;
export const toolTextarea = `${fieldBase} py-3.5 leading-[22px] sm:text-[14px]`;
export const toolLabel = "block text-[13px] font-bold text-[#4a4862]";

/** Ring color by score band (0–100). */
export function scoreColor(pct: number) {
  if (pct >= 80) return "#22b07d";
  if (pct >= 60) return "#f2a91f";
  return "#c42b30";
}

/** Circular score (0–100) in v5 style. */
export function ScoreRing({ score, size = 96, label }: { score: number; size?: number; label?: string }) {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  const r = 45;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label ?? `Score ${s} out of 100`} className="shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#efedf7" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={scoreColor(s)}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(s / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226">
        {s}
      </text>
    </svg>
  );
}

const BADGE = {
  green: "bg-[#dcf5ea] text-[#0b4f35]",
  amber: "bg-[#fdf0d5] text-[#7a4600]",
  red: "bg-[#fbe2e3] text-[#a3262b]",
  lilac: "bg-[#e4dfff] text-[#3a2bb8]",
  soft: "bg-[#f1eff8] text-[#121226]",
} as const;

export function Badge({ tone, children, className = "" }: { tone: keyof typeof BADGE; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-[5px] text-center text-[12px] font-bold leading-none ${BADGE[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Loading placeholder rows. */
export function ToolSkeleton({ rows = 4, className = "h-14" }: { rows?: number; className?: string }) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`w-full rounded-[18px] bg-white/70 motion-safe:animate-pulse ${className}`} />
      ))}
    </div>
  );
}

/** Copy-to-clipboard pill. */
export function CopyButton({ text, className = pillSoft, label = "Copy" }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  function handleCopy() {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button type="button" onClick={handleCopy} className={className}>
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** Sparkle icon used on the AI actions in the mockups. */
export function SparkIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}
