"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/* ── Capability tile ──
 * Honest, non-fabricated product facts (no invented user counts or ratings).
 * The lead value is a plain string so "Free" reads as well as "4". */
function CapabilityTile({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-[40px] font-bold leading-none tracking-tight text-[#0F172A] sm:text-[44px]">
        {value}
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

  /* ── Capabilities mode (honest product facts) ── */
  return (
    <section className="border-y border-[#E2E8F0] bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <CapabilityTile value="6" label="AI tools, one plan" sub="Match, write, score, send, practice, speak" />
          <CapabilityTile value="4" label="ATS-tested templates" sub="Classic, Modern, Minimal, Executive" />
          <CapabilityTile value="2" label="Export formats" sub="PDF & DOCX, both ATS-clean" />
          <CapabilityTile value="Free" label="ATS score check" sub="No account needed to start" />
        </div>
      </div>
    </section>
  );
}
