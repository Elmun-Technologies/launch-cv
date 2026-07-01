"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Category = "All" | "ATS-Friendly" | "Modern" | "Minimalist" | "Creative";
const CATEGORIES: Category[] = ["All", "ATS-Friendly", "Modern", "Minimalist", "Creative"];

/* ── shared tiny building blocks (kept intentionally realistic) ── */
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-1 leading-[1.35]">
      <span className="mt-[3px] h-[3px] w-[3px] shrink-0 rounded-full bg-slate-400" />
      <span>{children}</span>
    </li>
  );
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-slate-100 px-1.5 py-[1px] text-[6.5px] font-medium text-slate-600">{children}</span>;
}

/* ── 1. Modern (dark sidebar) ── */
function ModernDoc() {
  return (
    <div className="flex h-full w-full bg-white text-[7px] text-slate-700">
      <div className="w-[38%] bg-[#1E293B] p-2.5 text-white">
        <div className="mx-auto h-8 w-8 rounded-full bg-white/15" />
        <p className="mt-2 text-center text-[9px] font-bold leading-tight">Sarah Chen</p>
        <p className="text-center text-[6.5px] text-slate-300">Product Designer</p>
        <p className="mt-3 text-[6px] font-bold uppercase tracking-wide text-slate-400">Contact</p>
        <p className="mt-1 text-[6px] text-slate-300">sarah@email.com</p>
        <p className="text-[6px] text-slate-300">San Francisco, CA</p>
        <p className="mt-3 text-[6px] font-bold uppercase tracking-wide text-slate-400">Skills</p>
        <div className="mt-1 space-y-1">
          {["Figma", "Prototyping", "Design Systems", "User Research"].map((s) => (
            <div key={s} className="text-[6px] text-slate-200">{s}</div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-2.5">
        <p className="text-[7px] font-bold uppercase tracking-wide text-[#1E293B]">Experience</p>
        <div className="mt-1">
          <p className="text-[7px] font-semibold text-slate-800">Senior Product Designer</p>
          <p className="text-[6px] text-slate-400">Linear · 2022 — Present</p>
          <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
            <Bullet>Led redesign lifting activation 28%.</Bullet>
            <Bullet>Built the 40-component design system.</Bullet>
          </ul>
        </div>
        <div className="mt-2">
          <p className="text-[7px] font-semibold text-slate-800">Product Designer</p>
          <p className="text-[6px] text-slate-400">Notion · 2019 — 2022</p>
          <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
            <Bullet>Shipped mobile editor to 2M users.</Bullet>
          </ul>
        </div>
        <p className="mt-2 text-[7px] font-bold uppercase tracking-wide text-[#1E293B]">Education</p>
        <p className="mt-1 text-[6.5px] text-slate-700">BFA Design · RISD</p>
      </div>
    </div>
  );
}

/* ── 2. Minimalist (centered serif) ── */
function MinimalDoc() {
  return (
    <div className="h-full w-full bg-white p-3 font-serif text-[7px] text-slate-700">
      <p className="text-center text-[11px] font-semibold tracking-[0.1em] text-slate-900">MARCUS TROY</p>
      <p className="text-center text-[6.5px] tracking-[0.15em] text-slate-500">SOFTWARE ENGINEER</p>
      <p className="mt-1 text-center text-[6px] text-slate-400">marcus@email.com · linkedin.com/in/marcus</p>
      <div className="my-2 h-px bg-slate-200" />
      <p className="text-[7px] font-semibold tracking-[0.12em] text-slate-800">EXPERIENCE</p>
      <div className="mt-1.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[7px] font-semibold text-slate-800">Staff Engineer, Stripe</p>
          <p className="text-[6px] text-slate-400">2021 — Now</p>
        </div>
        <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
          <Bullet>Scaled payments to 2M req/day.</Bullet>
          <Bullet>Cut p99 latency by 45%.</Bullet>
        </ul>
      </div>
      <div className="mt-2">
        <div className="flex items-baseline justify-between">
          <p className="text-[7px] font-semibold text-slate-800">Engineer, Datadog</p>
          <p className="text-[6px] text-slate-400">2018 — 2021</p>
        </div>
        <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
          <Bullet>Owned the metrics ingestion pipeline.</Bullet>
        </ul>
      </div>
      <div className="my-2 h-px bg-slate-200" />
      <p className="text-[7px] font-semibold tracking-[0.12em] text-slate-800">SKILLS</p>
      <p className="mt-1 text-[6.5px] text-slate-600">Go · TypeScript · Kubernetes · Postgres · gRPC</p>
    </div>
  );
}

/* ── 3. Professional / ATS (classic) ── */
function ProfessionalDoc() {
  return (
    <div className="h-full w-full bg-white p-3 text-[7px] text-slate-700">
      <p className="text-[11px] font-bold text-slate-900">Priya Nair</p>
      <p className="text-[7px] font-medium text-[#1A56DB]">Marketing Manager</p>
      <p className="text-[6px] text-slate-400">priya@email.com | (555) 012-3456 | Austin, TX</p>
      <div className="mt-2 border-b border-slate-300 pb-[2px]">
        <p className="text-[7px] font-bold uppercase tracking-wide text-slate-800">Professional Experience</p>
      </div>
      <div className="mt-1.5">
        <div className="flex items-baseline justify-between">
          <p className="text-[7px] font-semibold text-slate-800">Marketing Manager — HubSpot</p>
          <p className="text-[6px] text-slate-400">2020 — Present</p>
        </div>
        <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
          <Bullet>Grew organic traffic 3.2× in 18 months.</Bullet>
          <Bullet>Managed a $1.4M annual budget.</Bullet>
          <Bullet>Led a team of 6 across content and paid.</Bullet>
        </ul>
      </div>
      <div className="mt-2 border-b border-slate-300 pb-[2px]">
        <p className="text-[7px] font-bold uppercase tracking-wide text-slate-800">Education</p>
      </div>
      <p className="mt-1 text-[6.5px] text-slate-700">BBA Marketing — UT Austin, 2016</p>
      <div className="mt-2 border-b border-slate-300 pb-[2px]">
        <p className="text-[7px] font-bold uppercase tracking-wide text-slate-800">Skills</p>
      </div>
      <p className="mt-1 text-[6.5px] text-slate-600">SEO · HubSpot · Google Analytics · Content Strategy</p>
    </div>
  );
}

/* ── 4. Creative (colored header, two-column) ── */
function CreativeDoc() {
  return (
    <div className="h-full w-full overflow-hidden bg-white text-[7px] text-slate-700">
      <div className="bg-gradient-to-r from-[#0D9488] to-[#0891B2] p-2.5 text-white">
        <p className="text-[11px] font-bold leading-tight">Diego Alvarez</p>
        <p className="text-[6.5px] text-teal-50">Full-Stack Developer · diego@email.com</p>
      </div>
      <div className="flex p-2.5">
        <div className="w-[60%] pr-2">
          <p className="text-[7px] font-bold uppercase tracking-wide text-[#0D9488]">Experience</p>
          <div className="mt-1">
            <p className="text-[7px] font-semibold text-slate-800">Lead Developer</p>
            <p className="text-[6px] text-slate-400">Vercel · 2021 — Now</p>
            <ul className="mt-1 space-y-[3px] text-[6.5px] text-slate-600">
              <Bullet>Built edge runtime used by 500k sites.</Bullet>
              <Bullet>Reduced cold starts by 60%.</Bullet>
            </ul>
          </div>
          <div className="mt-2">
            <p className="text-[7px] font-semibold text-slate-800">Developer</p>
            <p className="text-[6px] text-slate-400">GitLab · 2018 — 2021</p>
          </div>
        </div>
        <div className="w-[40%] border-l border-slate-100 pl-2">
          <p className="text-[7px] font-bold uppercase tracking-wide text-[#0D9488]">Skills</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {["React", "Node", "Rust", "GraphQL", "AWS"].map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
          <p className="mt-2 text-[7px] font-bold uppercase tracking-wide text-[#0D9488]">Education</p>
          <p className="mt-1 text-[6.5px] text-slate-700">BS CS · MIT</p>
        </div>
      </div>
    </div>
  );
}

const TEMPLATES: { id: string; name: string; category: Exclude<Category, "All">; ats: boolean; Doc: () => React.ReactElement }[] = [
  { id: "modern", name: "Modern", category: "Modern", ats: true, Doc: ModernDoc },
  { id: "minimal", name: "Minimalist", category: "Minimalist", ats: true, Doc: MinimalDoc },
  { id: "professional", name: "Professional", category: "ATS-Friendly", ats: true, Doc: ProfessionalDoc },
  { id: "creative", name: "Creative", category: "Creative", ats: false, Doc: CreativeDoc },
  { id: "modern2", name: "Executive", category: "Modern", ats: true, Doc: ProfessionalDoc },
  { id: "minimal2", name: "Classic", category: "Minimalist", ats: true, Doc: MinimalDoc },
];

export function ResumeTemplateGallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Category>("All");
  const shown = TEMPLATES.filter((t) => active === "All" || t.category === active || (active === "ATS-Friendly" && t.ats));

  return (
    <section className="border-t border-[#E2E8F0] bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="lc-overline text-[#1A56DB]">Templates</p>
          <h2 className="mt-3 lc-section-headline text-[#0F172A]">
            Recruiter-approved templates, ready in one click
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Every template is ATS-tested and fully editable. Pick a style — the AI fills it with your quantified,
            interview-ready bullet points.
          </p>
        </div>

        {/* category filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition ${
                active === c
                  ? "bg-[#1A56DB] text-white shadow-sm"
                  : "border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* gallery */}
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((t, i) => (
              <motion.div
                key={t.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.25)]">
                  {/* the realistic resume document at A4-ish ratio */}
                  <div className="aspect-[1/1.3] w-full overflow-hidden bg-slate-50">
                    <t.Doc />
                  </div>
                  {/* hover overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link
                      href="/register"
                      className="pointer-events-auto mb-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.03]"
                    >
                      Use this template <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <p className="text-[14px] font-semibold text-[#0F172A]">{t.name}</p>
                  {t.ats ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                      ATS-ready
                    </span>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            Browse all 12 templates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
