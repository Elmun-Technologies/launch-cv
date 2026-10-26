"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

export function BlogFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-5 border-b border-[#E5E5E2]">
      {items.map((item, i) => (
        <div key={item.q} className="border-t border-[#E5E5E2]">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="text-[17px] font-medium text-[#111111]">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-[#8A8A86] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="pb-5">
              <p className="text-[16px] leading-[1.65] text-[#3F3F3F]">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
