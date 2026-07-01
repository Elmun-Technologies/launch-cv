"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";
import { XCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

function useCountUp(to: number, start: boolean, duration = 1.2) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setV(to);
      return;
    }
    const c = animate(0, to, { duration, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [start, to, duration, reduce]);
  return v;
}

function ScoreBar({ value, color, start, delay }: { value: number; color: string; start: boolean; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="h-2 overflow-hidden rounded-full bg-black/5">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={reduce ? false : { width: 0 }}
        animate={start ? { width: `${value}%` } : undefined}
        transition={{ duration: 1, ease: EASE, delay }}
      />
    </div>
  );
}

const beforeBullets = ["Responsible for various tasks", "Worked on the team's projects", "Helped with different things"];
const afterBullets = [
  "Led migration of 3 services, cutting deploy time 40%",
  "Shipped 12 features, lifting retention 34%",
  "Owned a $2M ARR line with 8 engineers",
];

export function AboutTransformation() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const beforeScore = useCountUp(42, inView);
  const afterScore = useCountUp(94, inView);

  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="lc-overline text-[#1A56DB]">What we actually do</p>
          <h2 className="mt-3 lc-section-headline text-[#0F172A]">
            Same experience. Rewritten to get past the filter.
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Our AI never invents anything. It takes what you did and tells it in the language ATS software — and
            recruiters — reward.
          </p>
        </div>

        <div ref={ref} className="mt-14 grid items-center gap-5 lg:grid-cols-[1fr_auto_1fr]">
          {/* BEFORE */}
          <motion.div
            className="rounded-2xl border border-red-100 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(239,68,68,0.4)]"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[12px] font-bold text-red-600">
                <XCircle className="h-3.5 w-3.5" /> Before
              </span>
              <span className="text-[12px] font-semibold text-red-500">ATS rejected</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[36px] font-bold leading-none text-[#0F172A]">{beforeScore}%</span>
              <span className="text-[13px] text-[#94A3B8]">match score</span>
            </div>
            <div className="mt-3">
              <ScoreBar value={42} color="bg-red-400" start={inView} delay={0.3} />
            </div>
            <ul className="mt-5 space-y-2.5">
              {beforeBullets.map((b) => (
                <li key={b} className="flex gap-2 text-[13px] leading-snug text-[#94A3B8]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-300" />
                  <span className="line-through decoration-red-200">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* arrow */}
          <motion.div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-white shadow-lg lg:rotate-0"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>

          {/* AFTER */}
          <motion.div
            className="relative rounded-2xl border border-emerald-200 bg-white p-6 shadow-[0_24px_60px_-25px_rgba(16,185,129,0.45)]"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          >
            <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full bg-[#1A56DB] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
              <Sparkles className="h-3 w-3" /> AI rewritten
            </span>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> After
              </span>
              <span className="text-[12px] font-semibold text-emerald-600">Interview-ready</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-[36px] font-bold leading-none text-[#0F172A]">{afterScore}%</span>
              <span className="text-[13px] text-[#94A3B8]">match score</span>
            </div>
            <div className="mt-3">
              <ScoreBar value={94} color="bg-emerald-500" start={inView} delay={0.5} />
            </div>
            <ul className="mt-5 space-y-2.5">
              {afterBullets.map((b, i) => (
                <motion.li
                  key={b}
                  className="flex gap-2 text-[13px] leading-snug text-[#334155]"
                  initial={reduce ? false : { opacity: 0, x: 8 }}
                  animate={inView ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.12 }}
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
