"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

  return null;
}
