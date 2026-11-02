"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

const SORTS = [
  { value: "newest", label: "Recently edited" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Name" },
] as const;

/**
 * Search + sort controls for the resume list. Updates the URL (`?q=`, `?sort=`)
 * so the server component re-queries. Search is debounced; sort applies at once.
 */
export function ResumesToolbar({ q, sort }: { q: string; sort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(q);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function pushParams(next: { q?: string; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.sort !== undefined) {
      if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
      else params.delete("sort");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function onSearch(v: string) {
    setValue(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => pushParams({ q: v.trim() }), 300);
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:mt-6 md:flex-row md:items-center md:justify-between">
      <div className="relative md:w-[360px]">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#66647c]" aria-hidden />
        <input
          type="search"
          aria-label="Search resumes"
          className="block h-12 w-full rounded-full border-[1.5px] border-transparent bg-white pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[15px]"
          placeholder="Search resumes"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div role="group" aria-label="Sort resumes" className="relative -mx-1 flex gap-1.5 overflow-x-auto px-1 py-1">
        {SORTS.map((s) => {
          const on = sort === s.value;
          return (
            <button
              key={s.value}
              type="button"
              aria-pressed={on}
              onClick={() => pushParams({ sort: s.value })}
              className={`focus-visible:outline-[#5440e8]! focus-visible:rounded-full! min-h-11 shrink-0 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
