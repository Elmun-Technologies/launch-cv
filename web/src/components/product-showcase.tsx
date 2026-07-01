"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, Sparkles, Target, FileText } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const R = 52;
const CIRC = 2 * Math.PI * R;
const SCORE = 91;

const requirements = [
  { label: "5+ years backend experience", matched: true },
  { label: "Distributed systems at scale", matched: true },
  { label: "Go / TypeScript proficiency", matched: true },
  { label: "Team leadership", matched: true },
];

const keywords = ["Kubernetes", "GraphQL", "Postgres", "AWS", "CI/CD", "gRPC"];

export function ProductShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-[#0B1120] py-20 sm:py-28">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at center, rgba(26,86,219,0.22), transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">See it in action</p>
          <h2 className="mt-3 text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[38px]">
            One workspace, from raw resume to matched application
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-[1.65] text-[#94A3B8]">
            Paste a job description on the left, watch the match analysis rebuild your resume on the right — live.
          </p>
        </div>

        <motion.div
          ref={ref}
          className="relative mx-auto mt-14 max-w-[980px]"
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Browser frame */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <div className="ml-4 flex-1">
                <div className="mx-auto w-fit rounded-md bg-white/[0.06] px-4 py-1 text-[11px] font-medium text-[#94A3B8]">
                  app.launch-cv.com/editor
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-white/5 md:grid-cols-2">
              {/* Left — resume */}
              <div className="bg-[#0F172A] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  <FileText className="h-3.5 w-3.5" /> Resume
                </div>
                <p className="mt-4 text-[18px] font-bold text-white">Sarah Khan</p>
                <p className="text-[12px] text-[#64748B]">Senior Software Engineer · San Francisco</p>
                <div className="mt-5 space-y-3">
                  {[
                    "Led migration of 3 services to Kubernetes, cutting deploy time 40%.",
                    "Built a GraphQL gateway serving 2M requests/day on Postgres + gRPC.",
                    "Mentored 8 engineers across 2 timezones; owned $2M ARR line.",
                  ].map((line, i) => (
                    <motion.div
                      key={line}
                      className="flex gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-3"
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      animate={inView ? { opacity: 1, x: 0 } : undefined}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.12 }}
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3B82F6]" />
                      <span className="text-[12.5px] leading-snug text-[#CBD5E1]">{line}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right — JD match analysis */}
              <div className="bg-[#0F172A] p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  <Target className="h-3.5 w-3.5" /> JD Match Analysis
                </div>

                <div className="mt-4 flex items-center gap-5">
                  {/* score ring */}
                  <div className="relative h-[120px] w-[120px] shrink-0">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                      <motion.circle
                        cx="60"
                        cy="60"
                        r={R}
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        initial={reduce ? false : { strokeDashoffset: CIRC }}
                        animate={inView ? { strokeDashoffset: CIRC * (1 - SCORE / 100) } : undefined}
                        transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[26px] font-bold text-white">{SCORE}%</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">Match</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {requirements.map((r, i) => (
                      <motion.div
                        key={r.label}
                        className="flex items-center gap-2"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={inView ? { opacity: 1 } : undefined}
                        transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                          <Check className="h-2.5 w-2.5 text-emerald-400" />
                        </span>
                        <span className="text-[12px] text-[#CBD5E1]">{r.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">Matched keywords</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {keywords.map((k, i) => (
                      <motion.span
                        key={k}
                        className="rounded-md bg-[#1A56DB]/15 px-2 py-1 text-[11px] font-medium text-[#93C5FD] ring-1 ring-inset ring-[#1A56DB]/30"
                        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : undefined}
                        transition={{ duration: 0.35, ease: EASE, delay: 0.9 + i * 0.06 }}
                      >
                        {k}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* floating badge */}
          <motion.div
            className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0F172A] px-3 py-2 shadow-xl sm:flex"
            initial={reduce ? false : { opacity: 0, scale: 0.8, y: 8 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE, delay: 1.1 }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1A56DB]/20">
              <Sparkles className="h-4 w-4 text-[#60A5FA]" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#64748B]">Rewritten by AI</p>
              <p className="text-[12px] font-bold text-white">42 → 91% in 4s</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
