"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, animate } from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Counts up to `to` once the element scrolls into view. */
function useCountUp(to: number, start: boolean, duration = 1.1) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [start, to, duration, reduce]);
  return value;
}

export function LandingHero() {
  const reduce = useReducedMotion();
  const mockupRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mockupRef, { once: true, amount: 0.4 });
  const score = useCountUp(91, inView);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden bg-white pt-[96px]">
      {/* Animated background wash */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.07), transparent 45%), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.06), transparent 50%)",
          }}
          animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-16 lg:pb-28 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <motion.div className="lg:col-span-7" variants={container} initial="hidden" animate="show">
            <motion.span
              variants={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" />
              AI job-search platform · all six tools in one plan
            </motion.span>

            <motion.h1 variants={item} className="mt-6 lc-hero-headline text-[#0F172A]">
              The AI job search platform that lands more interviews.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569] sm:text-[18px]"
            >
              Paste a job description and Launch CV rewrites your resume to match it, scores your ATS readiness, drafts the cover letter, and drills you on likely interview questions — all from one workspace.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.div whileHover={reduce ? undefined : { scale: 1.025 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
                >
                  Get started
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

            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#64748B]"
            >
              <div className="inline-flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
                <span className="ml-1 font-semibold text-[#0F172A]">4.9/5</span>
                <span>from 2,400+ reviews</span>
              </div>
              <span className="hidden h-3 w-px bg-[#E2E8F0] sm:inline-block" />
              <span>Tested on 15 ATS engines</span>
            </motion.div>
          </motion.div>

          {/* Product mockup */}
          <div className="lg:col-span-5">
            <motion.div
              ref={mockupRef}
              className="relative"
              initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            >
              <motion.div
                className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]"
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">resume_stripe.pdf · ATS-clean</span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[18px] font-bold leading-tight text-[#0F172A]">Sarah Khan</p>
                      <p className="mt-0.5 text-[12px] text-[#64748B]">Senior Software Engineer · NYC</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> ATS {inView ? score : 0}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Experience</p>
                    <p className="mt-2 text-[13px] font-semibold text-[#0F172A]">Senior Engineer · Stripe</p>
                    <p className="text-[11px] text-[#94A3B8]">Jun 2022 — Present</p>
                    <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-[#334155]">
                      {[
                        "Led migration of 3 SaaS systems, cutting deploy time by 40%.",
                        "Shipped 12 features, lifting retention 34% over two quarters.",
                        "Owned $2M ARR product line with 8 engineers across 2 timezones.",
                      ].map((line) => (
                        <li key={line} className="flex gap-1.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#1A56DB]" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">Top skills</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["TypeScript", "Go", "Postgres", "AWS", "Kubernetes", "GraphQL"].map((k) => (
                        <span key={k} className="rounded-md bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#334155]">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* floating match-score badge */}
              <motion.div
                className="absolute -right-2 -top-2 hidden rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.2)] sm:block"
                initial={reduce ? false : { opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : undefined}
                transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">Match score</p>
                <p className="text-[18px] font-bold text-[#0F172A]">42 → {inView ? score : 42}%</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
