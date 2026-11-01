"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Confetti } from "@/components/home/fx";

/**
 * A worked example of the report: apply each fix and watch the sample resume and
 * its score change. The numbers are this example's, not a promise for any resume.
 */

type Fix = { title: string; why: string; gain: number; tag: string };

const FIXES: Fix[] = [
  { title: "Move contact details out of the page header", why: "Many parsers skip headers, so the email was missing.", gain: 11, tag: "Free report" },
  { title: "Rename “My Journey” to “Experience”", why: "Standard headings tell the software where your jobs start.", gain: 8, tag: "Free report" },
  { title: "Turn a duty into a result", why: "“Responsible for…” says what you were asked to do, not what changed.", gain: 10, tag: "AI rewrite · paid plans" },
  { title: "Add “stakeholder management”", why: "The job post asks for it twice; the resume never says it.", gain: 8, tag: "Job match · paid plans" },
];

const BASE = 54;

function Ring({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const color = score >= 80 ? "#12A15E" : score >= 65 ? "#C2700A" : "#C2341B";
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={`Example score ${score} out of 100`}>
      <circle cx="66" cy="66" r={r} fill="none" stroke="#EEEEEB" strokeWidth="10" />
      <circle
        cx="66"
        cy="66"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`}
        transform="rotate(-90 66 66)"
        style={{ transition: "stroke-dasharray 600ms cubic-bezier(.22,1,.36,1), stroke 300ms" }}
      />
      <text x="66" y="76" textAnchor="middle" fontSize="34" fontWeight="600" fill="#111111">
        {score}
      </text>
    </svg>
  );
}

function Mark({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <span className={`rounded-[3px] px-0.5 transition-colors duration-500 ${on ? "bg-[#FFE27A]" : "bg-transparent"}`}>{children}</span>
  );
}

export function FixDemo() {
  const [done, setDone] = useState<number>(0);
  const target = BASE + FIXES.slice(0, done).reduce((s, f) => s + f.gain, 0);
  const [shown, setShown] = useState(BASE);

  useEffect(() => {
    if (shown === target) return;
    const id = setTimeout(() => setShown((s) => s + (target > s ? 1 : -1)), 18);
    return () => clearTimeout(id);
  }, [shown, target]);

  const applied = (i: number) => done > i;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-[18px] border border-[#E5E5E2] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Ring score={shown} />
            <Confetti fire={done === FIXES.length ? 1 : 0} />
          </div>
          <div>
            <p className="text-[14px] text-[#6B6B6B]">Example ATS score</p>
            <p className="mt-1 text-[22px] font-semibold tracking-[-0.02em]">
              {shown >= 80 ? "Ready to send" : shown >= 65 ? "Getting there" : "Needs work"}
            </p>
            <p className="mt-1 text-[14px] text-[#6B6B6B]">
              {done}/{FIXES.length} fixes applied
            </p>
          </div>
        </div>
        <ol className="mt-6 divide-y divide-[#EEEEEB] border-t border-[#EEEEEB]">
          {FIXES.map((f, i) => {
            const isNext = i === done;
            return (
              <li key={f.title} className={`flex items-start gap-4 py-4 transition-colors duration-500 ${isNext ? "bg-[#FFFBEA] -mx-3 rounded-[10px] px-3" : ""}`}>
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${
                    applied(i) ? "bg-[#111111] text-white" : "border border-[#D9D9D5] text-[#6B6B6B]"
                  }`}
                >
                  {applied(i) ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[15px] font-medium ${applied(i) ? "text-[#6B6B6B]" : "text-[#111111]"}`}>{f.title}</p>
                  <p className="mt-0.5 text-[14px] leading-[1.5] text-[#6B6B6B]">{f.why}</p>
                  <p className="mt-1.5 text-[12px] font-medium text-[#6E6E6A]">
                    {f.tag} · +{f.gain}
                  </p>
                </div>
                {isNext ? (
                  <span className="relative shrink-0">
                    {done === 0 ? (
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#FFE27A] motion-reduce:hidden" aria-hidden="true" />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setDone((d) => d + 1)}
                      className="lcv-shine relative rounded-full bg-[#111111] px-4 py-2 text-[13px] font-medium text-white transition hover:scale-[1.04] hover:bg-black active:scale-95"
                    >
                      Apply fix
                    </button>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        {done === FIXES.length ? (
          <button
            type="button"
            onClick={() => setDone(0)}
            className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-[#6B6B6B] hover:text-[#111111]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Start over
          </button>
        ) : null}
      </div>

      <div className="relative self-start rounded-[18px] bg-[#F3F1EC] p-5 sm:p-8 lg:sticky lg:top-24" aria-live="polite">
        <div className="rounded-[6px] bg-white px-6 py-7 text-[13px] leading-[1.5] text-[#1c1c1c] shadow-[0_20px_50px_-28px_rgba(0,0,0,0.35)] sm:px-9 sm:text-[14px]">
          <p className="text-[22px] font-semibold leading-tight">Maria Lopez</p>
          <p className="mt-0.5 text-[#555]">Product Manager · Austin, TX</p>
          <p className="mt-1 text-[#555]">
            {applied(0) ? (
              <Mark on>maria.lopez@email.com · (512) 555-0142</Mark>
            ) : (
              <span className="text-[#B0B0AA] line-through decoration-[#C2341B]/60">contact details in page header</span>
            )}
          </p>

          <p className="mt-5 border-b border-[#111] pb-1 text-[11px] font-bold uppercase tracking-[0.1em]">
            <Mark on={applied(1)}>{applied(1) ? "Experience" : "My Journey"}</Mark>
          </p>
          <div className="mt-2.5 flex items-baseline justify-between gap-2">
            <p className="font-semibold">Product Manager, Brightpath Health</p>
            <p className="shrink-0 text-[12px] text-[#666]">2022 – Present</p>
          </div>
          <ul className="mt-1.5 list-disc space-y-1 pl-4">
            <li>Launched self-scheduling, cutting no-shows by 23% across 41 clinics</li>
            <li>
              {applied(2) ? (
                <Mark on>Redesigned onboarding; week-1 activation rose from 38% to 57%</Mark>
              ) : (
                "Responsible for the onboarding project"
              )}
            </li>
            <li>
              Led 9 engineers and 2 designers
              {applied(3) ? <Mark on>; ran stakeholder management across clinical, legal and sales</Mark> : null}
            </li>
          </ul>

          <p className="mt-5 border-b border-[#111] pb-1 text-[11px] font-bold uppercase tracking-[0.1em]">Skills</p>
          <p className="mt-2">
            Product strategy · SQL · A/B testing{applied(3) ? <Mark on> · Stakeholder management</Mark> : null}
          </p>
        </div>
        <p className="mt-3 text-[12px] text-[#6B6B6B]">Example resume and scores. Your report lists the fixes for yours.</p>
      </div>
    </div>
  );
}
