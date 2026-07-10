"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = { value: number; suffix?: string; prefix?: string; label: string };

const STATS: Stat[] = [
  { value: 50000, suffix: "+", label: "Resumes built" },
  { value: 4.9, label: "Average rating", suffix: "/5" },
  { value: 15, label: "ATS engines tested" },
  { value: 5, suffix: " min", label: "Avg. build time" },
];

function StatItem({ stat, index, start }: { stat: Stat; index: number; start: boolean }) {
  const reduce = useReducedMotion();
  // Initialise to the final value so the figure is never a frozen "0" during
  // SSR, with JS disabled, or if the in-view trigger never fires.
  const [v, setV] = useState(stat.value);
  const [mounted, setMounted] = useState(false);
  const isFloat = !Number.isInteger(stat.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted || reduce) return; // no-JS / reduced-motion keep the final value
    if (!start) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setV(0); // armed off-screen → count up cleanly once in view
      return;
    }
    const c = animate(0, stat.value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (x) => setV(isFloat ? Math.round(x * 10) / 10 : Math.round(x)),
    });
    return () => c.stop();
  }, [mounted, start, stat.value, isFloat, reduce]);

  const display = isFloat ? v.toFixed(1) : v.toLocaleString();

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
