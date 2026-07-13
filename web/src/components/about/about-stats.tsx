"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Honest product facts — no invented user counts, ratings, or timings.
// `value` animates as a count-up; `text` renders a static label (e.g. "Free").
type Stat = { value?: number; text?: string; suffix?: string; prefix?: string; label: string };

const STATS: Stat[] = [
  { value: 6, label: "AI tools, one plan" },
  { value: 4, label: "ATS-tested templates" },
  { value: 2, label: "Export formats · PDF & DOCX" },
  { text: "Free", label: "ATS score check" },
];

function StatItem({ stat, index, start }: { stat: Stat; index: number; start: boolean }) {
  const reduce = useReducedMotion();
  const numeric = stat.value ?? 0;
  const isFloat = !Number.isInteger(numeric);
  // Initialise to the final value so the figure is never a frozen "0" during
  // SSR, with JS disabled, or if the in-view trigger never fires.
  const [v, setV] = useState(numeric);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  useEffect(() => {
    if (stat.text !== undefined) return; // static label, nothing to animate
    if (!mounted || reduce) return; // no-JS / reduced-motion keep the final value
    if (!start) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setV(0); // armed off-screen → count up cleanly once in view
      return;
    }
    const c = animate(0, numeric, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (x) => setV(isFloat ? Math.round(x * 10) / 10 : Math.round(x)),
    });
    return () => c.stop();
  }, [mounted, start, numeric, isFloat, reduce, stat.text]);

  const display = stat.text ?? (isFloat ? v.toFixed(1) : v.toLocaleString());

  return (
    <motion.div
      className="text-center"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={start ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
    >
      <p className="text-[34px] font-bold leading-none tracking-tight text-white sm:text-[40px]">
        {stat.prefix}{display}{stat.suffix}
      </p>
      <p className="mt-2 text-[13px] font-medium text-white/60">{stat.label}</p>
    </motion.div>
  );
}

export function AboutStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-[#0B1120] py-14">
      <div ref={ref} className="mx-auto grid max-w-[1000px] grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <StatItem key={s.label} stat={s} index={i} start={inView} />
        ))}
      </div>
    </section>
  );
}
