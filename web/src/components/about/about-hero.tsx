"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const R = 78;
const CIRC = 2 * Math.PI * R;
const REJECTED = 75;

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

export function AboutHero() {
  const reduce = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ringRef, { once: true, amount: 0.5 });
  const pct = useCountUp(REJECTED, inView);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden bg-white pt-[96px]">
      {/* aurora background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute -left-40 -top-20 h-[520px] w-[520px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(26,86,219,0.16), transparent 65%)" }}
          animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-10 h-[460px] w-[460px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.14), transparent 65%)" }}
          animate={reduce ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <motion.div className="lg:col-span-7" variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" />
              Our story
            </motion.span>

            <motion.h1 variants={item} className="mt-6 lc-hero-headline text-[#0F172A]">
              We built Launch CV because hiring is broken.
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569] sm:text-[18px]">
              Roughly three in four resumes are rejected by automated software before any human sees them. The reason is
              rarely talent — it&apos;s formatting, keywords, and time. Launch CV is the tool we wished existed when our
              friends, our students, and we ourselves were stuck on the wrong side of that filter.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.div whileHover={reduce ? undefined : { scale: 1.025 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Start free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
              >
                View pricing
              </Link>
            </motion.div>
          </motion.div>

          {/* The 75% problem — animated ring */}
          <div className="lg:col-span-5">
            <motion.div
              ref={ringRef}
              className="relative mx-auto max-w-[360px] rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_30px_60px_-25px_rgba(15,23,42,0.18)]"
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">
                The problem
              </p>
              <div className="relative mx-auto mt-4 h-[200px] w-[200px]">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r={R} fill="none" stroke="#EEF2F7" strokeWidth="16" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={R}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    initial={reduce ? false : { strokeDashoffset: CIRC }}
                    animate={inView ? { strokeDashoffset: CIRC * (1 - REJECTED / 100) } : undefined}
                    transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[46px] font-bold leading-none text-[#0F172A]">{pct}%</span>
                  <span className="mt-1 text-[12px] font-medium text-[#64748B]">rejected by ATS</span>
                </div>
              </div>
              <p className="mt-5 text-center text-[13px] leading-[1.6] text-[#475569]">
                of qualified resumes never reach a human. <span className="font-semibold text-[#1A56DB]">Launch CV flips that.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
