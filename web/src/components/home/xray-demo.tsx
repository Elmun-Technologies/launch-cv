"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Drag to compare a two-column resume with what a parser extracts from it.
 * Sweeps once on its own so visitors see it move; any interaction takes over.
 */

const PARSED: { k: string; v: string; bad?: string }[] = [
  { k: "name", v: "Maria Lopez Product Manager EXPERIENCE" , bad: "merged with the next line" },
  { k: "email", v: "", bad: "not found — it's in the page header" },
  { k: "phone", v: "", bad: "not found" },
  { k: "title", v: "SKILLS SQL Product Manager, Brightpath", bad: "column text mixed in" },
  { k: "dates", v: "2022 Amplitude Now", bad: "unreadable" },
  { k: "experience[0]", v: "Launched self-scheduling, −23% no-shows" },
  { k: "experience[1]", v: "Led 9 engineers and 2 designers" },
  { k: "skills", v: "", bad: "empty — read as part of experience" },
  { k: "section", v: "\"My Journey\"", bad: "heading not recognised" },
];

function ResumeVisual() {
  return (
    <div className="flex h-full bg-white text-[#1c1c1c]">
      <aside className="w-[36%] shrink-0 bg-[#1F2A37] px-5 py-6 text-white sm:px-7 sm:py-8">
        <p className="text-[19px] font-semibold leading-tight sm:text-[22px]">Maria Lopez</p>
        <p className="mt-1 text-[12px] text-[#C9D2DD] sm:text-[13px]">Product Manager</p>
        <div className="mt-6 space-y-1 text-[11px] text-[#C9D2DD] sm:text-[12px]">
          <p>maria.lopez@email.com</p>
          <p>(512) 555-0142</p>
          <p>Austin, TX</p>
        </div>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8FA3B8] sm:text-[11px]">Skills</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["SQL", "Amplitude", "A/B testing", "Roadmaps"].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] sm:text-[11px]">
              {s}
            </span>
          ))}
        </div>
      </aside>
      <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6B6B] sm:text-[11px]">My Journey</p>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <p className="text-[12px] font-semibold sm:text-[14px]">Product Manager, Brightpath</p>
          <p className="shrink-0 text-[10px] text-[#6B6B6B] sm:text-[12px]">2022 – Now</p>
        </div>
        <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-[#333] sm:text-[13px]">
          <li>• Launched self-scheduling, −23% no-shows</li>
          <li>• Led 9 engineers and 2 designers</li>
          <li>• Ran 30+ customer interviews</li>
        </ul>
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <p className="text-[12px] font-semibold sm:text-[14px]">Associate PM, Fieldnote</p>
          <p className="shrink-0 text-[10px] text-[#6B6B6B] sm:text-[12px]">2019 – 2022</p>
        </div>
        <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-[#333] sm:text-[13px]">
          <li>• Activation 38% → 57%</li>
          <li>• Responsible for the pricing page</li>
        </ul>
      </div>
    </div>
  );
}

function ParsedView() {
  return (
    <div className="h-full overflow-hidden bg-[#0F1115] px-5 py-6 font-mono text-[11px] leading-[1.75] text-[#D6D6D2] sm:px-8 sm:py-8 sm:text-[13px]">
      <p className="text-[#7C7C78]">{"// what the parser extracted"}</p>
      {PARSED.map((r) => (
        <p key={r.k} className="flex flex-wrap gap-x-2">
          <span className="text-[#8AB4FF]">{r.k}:</span>
          {r.v ? <span>{r.v}</span> : null}
          {r.bad ? <span className="rounded bg-[#FFE27A] px-1 text-[#111]">{r.bad}</span> : null}
        </p>
      ))}
    </div>
  );
}

export function XrayDemo() {
  const [pos, setPos] = useState(62);
  const touched = useRef(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    let raf = 0;
    const start = performance.now() + 600;
    const dur = 2600;
    const tick = (now: number) => {
      if (touched.current) return;
      const t = Math.max(0, Math.min(1, (now - start) / dur));
      // ease out from the right edge towards the middle, showing the parsed side first
      const eased = 1 - Math.pow(1 - t, 3);
      setPos(92 - eased * 50);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const take = (v: number) => {
    touched.current = true;
    setPos(Math.max(4, Math.min(96, v)));
  };

  return (
    <figure className="m-0">
      <div className="relative h-[360px] overflow-hidden rounded-[18px] border border-[#E5E5E2] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.35)] sm:h-[400px]">
        <div className="absolute inset-0" aria-hidden="true">
          <ParsedView />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden="true">
          <ResumeVisual />
        </div>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
          <div className="absolute inset-y-0 -left-px w-[2px] bg-[#FFE27A] shadow-[0_0_18px_4px_rgba(255,226,122,0.65)] animate-[lcv-scan_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFE27A] text-[14px] font-semibold text-[#111] shadow-[0_6px_20px_rgba(0,0,0,0.3)] ring-4 ring-white/70">
            ⇆
          </div>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium text-[#111] shadow-sm">
          What a recruiter sees
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-[#FFE27A] px-2.5 py-1 text-[12px] font-medium text-[#111]">
          What the software reads
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(pos)}
          onChange={(e) => take(Number(e.target.value))}
          onPointerDown={() => (touched.current = true)}
          aria-label="Drag to compare the resume with what the parser extracts"
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-[13px] text-[#6B6B6B]">
        Drag the handle. A two-column layout looks tidy, but many parsers read it line by line and lose the email, dates and skills.
      </figcaption>
    </figure>
  );
}
