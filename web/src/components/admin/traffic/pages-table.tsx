"use client";

import { Fragment, useState } from "react";
import { ChevronRight } from "lucide-react";
import { focusRing } from "@/components/admin/v5/ui";
import { fmtDuration, fmtInt, fmtPct } from "@/lib/traffic/labels";
import type { PageRow, PageStats } from "@/lib/traffic/queries";

const th = "whitespace-nowrap py-2.5 pr-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#66647c] last:pr-0";
const td = "py-2.5 pr-3 text-right tabular-nums last:pr-0";

function Cells({ r }: { r: PageStats }) {
  return (
    <>
      <td className={`${td} font-semibold`}>{fmtInt(r.views)}</td>
      <td className={td}>{fmtInt(r.visitors)}</td>
      <td className={td}>{fmtDuration(r.avgMs)}</td>
      <td className={td}>{fmtInt(r.entries)}</td>
      <td className={td}>{fmtInt(r.exits)}</td>
      <td className={`${td} text-[#4a4862]`}>{r.entries ? fmtPct(r.bounces, r.entries, 0) : "—"}</td>
      <td className={`${td} font-semibold`}>{fmtInt(r.signups)}</td>
      <td className={td}>{fmtInt(r.paid)}</td>
    </>
  );
}

/** Pages with group rows for dynamic SEO routes (/blog/*, /resume-examples/* …) that expand to their pages. */
export function PagesTable({ rows, limit = 150 }: { rows: PageRow[]; limit?: number }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const toggle = (p: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });
  const shown = rows.slice(0, limit);
  return (
    <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Pages table">
      <table className="w-full min-w-[860px] border-collapse text-left text-[14px]">
        <thead>
          <tr>
            <th scope="col" className={`${th} text-left!`}>Page</th>
            <th scope="col" className={th}>Views</th>
            <th scope="col" className={th}>Unique</th>
            <th scope="col" className={th}>Avg. time</th>
            <th scope="col" className={th}>Entries</th>
            <th scope="col" className={th}>Exits</th>
            <th scope="col" className={th}>Bounce</th>
            <th scope="col" className={th}>Sign-ups started here</th>
            <th scope="col" className={th}>Paid started here</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => {
            const isOpen = open.has(r.path);
            return (
              <Fragment key={r.path}>
                <tr className="border-t border-[#e2e0ea] align-middle">
                  <th scope="row" className="max-w-[340px] py-2.5 pr-3 text-left font-semibold text-[#121226]">
                    {r.children ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggle(r.path)}
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full pr-2 text-left hover:text-[#5440e8] ${focusRing}`}
                      >
                        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} aria-hidden />
                        <span className="lc-mono truncate">{r.path}</span>
                        <span className="shrink-0 rounded-full bg-[#e4dfff] px-2 text-[11px] font-bold text-[#3a2bb8]">{r.children.length} pages</span>
                      </button>
                    ) : (
                      <span className="lc-mono block truncate pl-[22px]" title={r.path}>
                        {r.path}
                      </span>
                    )}
                  </th>
                  <Cells r={r} />
                </tr>
                {isOpen && r.children
                  ? r.children.slice(0, 200).map((c) => (
                      <tr key={c.path} className="border-t border-dashed border-[#e2e0ea] bg-[#faf9fd] align-middle text-[13px]">
                        <th scope="row" className="max-w-[340px] py-2 pr-3 pl-[30px] text-left font-normal text-[#4a4862]">
                          <span className="lc-mono block truncate" title={c.path}>
                            {c.path}
                          </span>
                        </th>
                        <Cells r={c} />
                      </tr>
                    ))
                  : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {rows.length > limit ? <p className="pt-2 text-[12px] text-[#66647c]">Top {limit} of {rows.length} rows by views. The CSV has all of them.</p> : null}
    </div>
  );
}
