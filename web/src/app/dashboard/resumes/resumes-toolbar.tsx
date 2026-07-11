"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

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
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="relative w-72">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          aria-label="Search resumes"
          className="soha-input h-10 pl-9"
          placeholder="Search resumes..."
          value={value}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <select
        aria-label="Sort resumes"
        className="soha-select !h-10 !w-40 !text-[13px]"
        value={sort}
        onChange={(e) => pushParams({ sort: e.target.value })}
      >
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="az">Sort: A-Z</option>
      </select>
    </div>
  );
}
