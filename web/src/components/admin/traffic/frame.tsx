import type { ReactNode } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader, focusRing } from "@/components/admin/v5/ui";
import { TrafficFilterBar } from "@/components/admin/traffic/filter-bar";
import { describeRange, hasFilters, trafficSearch, zonedDay, type TrafficQuery } from "@/lib/traffic/filters";
import { countryName, deviceLabel } from "@/lib/traffic/labels";
import { countryOptions } from "@/lib/traffic/queries";

export const ANALYTICS_TABS = [
  { id: "traffic", href: "/admin-panel/analytics", label: "Traffic" },
  { id: "pages", href: "/admin-panel/analytics/pages", label: "Pages" },
  { id: "sources", href: "/admin-panel/analytics/sources", label: "Sources" },
  { id: "audience", href: "/admin-panel/analytics/audience", label: "Audience" },
  { id: "journeys", href: "/admin-panel/analytics/journeys", label: "Journeys" },
  { id: "live", href: "/admin-panel/analytics/live", label: "Live" },
] as const;
export type AnalyticsTab = (typeof ANALYTICS_TABS)[number]["id"];

/** CSV export URL for one table with the page's range and filters. */
export function exportHref(q: TrafficQuery, table: string, extra: Record<string, string | null> = {}): string {
  const s = trafficSearch(q, { table, ...extra });
  return `/api/admin-panel/analytics/export${s}`;
}

/** Shell, title, tabs and the filter bar around every Admin → Analytics tab. */
export async function AnalyticsFrame({
  email,
  q,
  tab,
  children,
  showFilters = true,
}: {
  email: string;
  q: TrafficQuery;
  tab: AnalyticsTab;
  children: ReactNode;
  showFilters?: boolean;
}) {
  const countries = showFilters ? await countryOptions(q) : [];
  const filterText = [q.country ? countryName(q.country) : null, q.device ? deviceLabel(q.device) : null, q.channel].filter(Boolean).join(" · ");
  const search = trafficSearch(q);
  return (
    <AdminShell email={email} pageTitle="Analytics">
      <div className="space-y-5">
        <AdminPageHeader
          title="Analytics"
          description={
            tab === "live"
              ? "Who is on the site right now. First-party, cookie-less page analytics."
              : `${describeRange(q)}${hasFilters(q) ? ` · Filtered: ${filterText}` : ""}. First-party, cookie-less page analytics.`
          }
        />
        <nav aria-label="Analytics sections" className="-mx-1 overflow-x-auto px-1">
          <ul className="flex min-w-max gap-1 rounded-full bg-white p-1">
            {ANALYTICS_TABS.map((t) => (
              <li key={t.id}>
                <Link
                  href={`${t.href}${t.id === "live" ? "" : search}`}
                  aria-current={t.id === tab ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-4 text-[14px] font-bold transition-colors sm:min-h-10 ${focusRing} ${
                    t.id === tab ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {showFilters ? (
          <TrafficFilterBar
            state={{ preset: q.preset, tzId: q.tzId, fromDay: q.fromDay, toDay: q.toDay, country: q.country, device: q.device, channel: q.channel }}
            countries={countries}
            today={zonedDay(q.now, q.tz)}
          />
        ) : null}
        {children}
      </div>
    </AdminShell>
  );
}
