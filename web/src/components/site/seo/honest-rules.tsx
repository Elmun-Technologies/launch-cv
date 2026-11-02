import type { ReactNode } from "react";
import { labelCls } from "@/components/site/ui";
import { HONEST_RULES } from "@/lib/seo/resume-keywords";

/** Dark v5 panel: how to use keywords honestly. `footer` holds a page-specific CTA. */
export function HonestRules({ title, lead, footer }: { title: ReactNode; lead?: ReactNode; footer?: ReactNode }) {
  return (
    <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-5 pt-7 text-white sm:p-10 lg:rounded-[36px] lg:p-16">
      <p className={`${labelCls} !text-[#c9c0ff]`}>/ Use them honestly</p>
      <h2 className="lc-h2 mt-5 text-white">{title}</h2>
      {lead ? <p className="mt-4 max-w-[640px] text-[16px] leading-[25px] text-[#d6d3e6] sm:text-[17px] sm:leading-7">{lead}</p> : null}
      <ol className="mt-4 grid sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        {HONEST_RULES.map((t, i) => (
          <li key={t.t} className="border-t border-[#2f2d48] py-[13px] sm:rounded-[22px] sm:border sm:bg-[#1d1c2e] sm:p-6">
            <p className="lc-mono hidden text-[12px] text-[#c9c0ff] sm:block" aria-hidden="true">
              0{i + 1}
            </p>
            <h3 className="text-[16px] font-bold sm:mt-6 sm:text-[18px]">{t.t}</h3>
            <p className="mt-[3px] text-[13px] leading-5 text-[#b3b0c8] sm:mt-2 sm:text-[14px] sm:leading-[22px]">{t.d}</p>
          </li>
        ))}
      </ol>
      {footer}
    </div>
  );
}
