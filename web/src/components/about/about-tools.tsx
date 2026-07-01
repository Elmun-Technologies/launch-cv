"use client";

import { motion, useReducedMotion } from "motion/react";
import { Target, FileText, BarChart3, Mail, MessageSquare, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Tool = { icon: LucideIcon; title: string; desc: string; bg: string; text: string; span?: boolean };

const TOOLS: Tool[] = [
  { icon: Target, title: "JD Alignment", desc: "Maps every requirement to your resume and lifts your match score.", bg: "bg-blue-50", text: "text-blue-600", span: true },
  { icon: FileText, title: "Resume Builder", desc: "12 ATS-tested templates. Plain input becomes quantified bullets.", bg: "bg-violet-50", text: "text-violet-600" },
  { icon: BarChart3, title: "ATS Score", desc: "Scored against 15 engines with a prioritized fix list.", bg: "bg-orange-50", text: "text-orange-600" },
  { icon: Mail, title: "Cover Letters", desc: "Personalized in 60 seconds. Four tones, fourteen languages.", bg: "bg-teal-50", text: "text-teal-600" },
  { icon: MessageSquare, title: "Interview Prep", desc: "Role-specific questions with AI-scored answers.", bg: "bg-emerald-50", text: "text-emerald-600", span: true },
  { icon: Mic, title: "Voice Input", desc: "Speak your experience — AI turns it into resume bullets.", bg: "bg-pink-50", text: "text-pink-600" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function AboutTools() {
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? {} : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-[680px]">
          <p className="lc-overline text-[#1A56DB]">One product, six tools</p>
          <h2 className="mt-3 lc-section-headline text-[#0F172A]">
            Everything the job hunt needs — in one place
          </h2>
        </div>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        >
          {TOOLS.map((t) => (
            <motion.div
              key={t.title}
              variants={item}
              className={`group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-22px_rgba(15,23,42,0.2)] ${
                t.span ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.bg} ${t.text} transition-transform duration-300 group-hover:scale-110`}>
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold text-[#0F172A]">{t.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[#475569]">{t.desc}</p>
              {/* decorative corner glow */}
              <span
                className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40 ${t.bg}`}
                aria-hidden
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
