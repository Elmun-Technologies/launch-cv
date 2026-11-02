import Link from "next/link";
import { cmsDateFmt } from "@/components/admin/cms-ui";
import { PAGE_COPY } from "@/lib/cms/page-copy";

/** The editable page-copy keys (registry and defaults live in lib/cms/page-copy.ts). */
export const PAGE_COPY_SECTIONS = Object.entries(PAGE_COPY).map(([key, d]) => ({ key, label: d.label, description: d.description }));

/**
 * Master list of page-copy sections (left column of the Page copy screen).
 * `updated` maps a key to its last saved time; keys without a row still use
 * the defaults in code.
 */
export function PageCopySectionNav({ activeKey, updated }: { activeKey?: string; updated: Map<string, Date> }) {
  return (
    <nav aria-label="Page copy sections" className="lc-card min-w-0 rounded-[24px] p-2.5">
      <ul className="flex flex-col gap-0.5">
        {PAGE_COPY_SECTIONS.map((p) => {
          const active = p.key === activeKey;
          const at = updated.get(p.key);
          return (
            <li key={p.key}>
              <Link
                href={`/admin-panel/cms/pages/${encodeURIComponent(p.key)}`}
                aria-current={active ? "page" : undefined}
                className={`block rounded-2xl px-4 py-3.5 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[#5440e8] ${
                  active ? "bg-[#111118] text-white" : "text-[#121226] hover:bg-[#f7f6fb]"
                }`}
              >
                <span className="block text-[15px] font-bold">{p.label}</span>
                <span className={`mt-0.5 block text-[12px] leading-[17px] ${active ? "text-[#c9c7d8]" : "text-[#66647c]"}`}>
                  {p.description} ·{" "}
                  {at ? (
                    <>Updated {cmsDateFmt.format(at)}</>
                  ) : (
                    <span className={active ? "text-[#ffd08a]" : "font-semibold text-[#a15c00]"}>Using code defaults</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
