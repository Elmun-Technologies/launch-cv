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
      className="flex flex-col"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-[40px] font-bold leading-none tracking-tight text-[#0F172A] sm:text-[44px]" style={{ animationDelay: `${delay}ms` }}>
        {count}{suffix}
      </p>
      <p className="mt-3 text-[14px] font-semibold text-[#0F172A]">{label}</p>
      <p className="mt-1 text-[13px] text-[#64748B]">{sub}</p>
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
    <section className="border-y border-[#E2E8F0] bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard value={50000} suffix="+" label="Resumes built" sub="And counting" delay={0} />
          <StatCard value={3} suffix="×" label="More interview calls" sub="vs. unoptimized resumes" delay={80} />
          <StatCard value={95} suffix="%" label="ATS pass rate" sub="across major platforms" delay={160} />
          <StatCard value={5} suffix=" min" label="Average build time" sub="blank to download" delay={240} />
        </div>
      </div>
    </section>
  );
}
