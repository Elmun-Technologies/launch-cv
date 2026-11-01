import { siteFontVars } from "@/lib/site-fonts";

/** Route-level placeholder while a dashboard page loads (v5 ground, sidebar silhouette on desktop). */
export default function DashboardLoading() {
  return (
    <div className={`lc-site ${siteFontVars} flex h-dvh overflow-hidden`} role="status" aria-label="Loading">
      <div className="hidden w-[264px] shrink-0 flex-col gap-3 border-r border-[#e2e0ea] bg-white px-4 py-[22px] lg:flex">
        <div className="soha-skeleton h-8 w-32" />
        <div className="soha-skeleton mt-4 h-12 w-full rounded-full!" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="soha-skeleton h-9 w-full rounded-[14px]!" />
        ))}
      </div>
      <div className="flex-1 space-y-6 overflow-hidden px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10">
        <div className="soha-skeleton h-9 w-56" />
        <div className="soha-skeleton h-[120px] w-full rounded-[28px]!" />
        <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
          <div className="lc-card rounded-[28px] p-6">
            <div className="soha-skeleton h-5 w-40" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="soha-skeleton h-[230px] rounded-2xl!" />
              ))}
            </div>
          </div>
          <div className="lc-card rounded-[28px] p-6">
            <div className="soha-skeleton h-5 w-32" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="soha-skeleton h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
