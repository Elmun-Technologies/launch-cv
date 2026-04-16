"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

/* ── Counter hook ── */
function useCounter(target: number, visible: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else { setValue(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return value;
}

/* ── Stat card ── */
function StatCard({ value, suffix, label, sub, delay }: { value: number; suffix: string; label: string; sub: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const count = useCounter(value, visible);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center border-r border-white/10 px-8 py-8 last:border-r-0 max-sm:border-r-0 max-sm:border-b max-sm:last:border-b-0"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="font-display text-[48px] font-bold leading-none text-white sm:text-[56px]" style={{ animationDelay: `${delay}ms` }}>
        {count}{suffix}
      </p>
      <p className="mt-2 font-body text-[14px] font-semibold text-white">{label}</p>
      <p className="mt-1 font-body text-[13px] text-[#94A3B8]">{sub}</p>
    </div>
  );
}

/* ── FAQ accordion item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lc-accordion-item">
      <button type="button" className="lc-accordion-trigger" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <ChevronDown className={`lc-accordion-chevron ${open ? "open" : ""}`} />
      </button>
      <div className={`lc-accordion-body ${open ? "open" : ""}`}>
        <p className="lc-accordion-content">{a}</p>
      </div>
    </div>
  );
}

type FaqItemType = { q: string; a: string };

type HomeClientProps = {
  /** When provided, renders the FAQ accordion grid instead of the stats section */
  faqItems?: FaqItemType[];
};

export function HomeClient({ faqItems }: HomeClientProps) {
  /* ── FAQ mode ── */
  if (faqItems) {
    return (
      <div className="mx-auto mt-12 grid max-w-[1000px] gap-x-12 lg:grid-cols-2">
        {[faqItems.slice(0, 4), faqItems.slice(4)].map((col, ci) => (
          <div key={ci} className="divide-y divide-[#E2E8F0]">
            {col.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        ))}
      </div>
    );
  }

  /* ── Stats mode ── */
  return (
    <section className="bg-[#0F172A] py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          <StatCard value={50000} suffix="+" label="Resumes Created" sub="And counting" delay={0} />
          <StatCard value={3} suffix="×" label="More Interview Calls" sub="Vs. unoptimized resumes" delay={80} />
          <StatCard value={95} suffix="%" label="ATS Pass Rate" sub="Across all major platforms" delay={160} />
          <StatCard value={5} suffix=" min" label="Average Build Time" sub="From blank to download" delay={240} />
        </div>
      </div>
    </section>
  );
}
