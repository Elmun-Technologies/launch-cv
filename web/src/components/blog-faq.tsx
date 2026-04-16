"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

export function BlogFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-5 space-y-0 divide-y divide-[#E2E8F0] rounded-2xl border border-[#E2E8F0]">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[#F8FAFC]"
            aria-expanded={open === i}
          >
            <span className="font-body text-[15px] font-semibold text-[#0F172A]">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5">
              <p className="font-body text-[14px] leading-[1.75] text-[#475569]">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
