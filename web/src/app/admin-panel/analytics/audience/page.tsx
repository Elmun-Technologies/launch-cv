import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { SectionCard } from "@/components/admin/section-card";
import { AnalyticsFrame, exportHref } from "@/components/admin/traffic/frame";
import { ATTRIBUTION_NOTE, BreakdownTable, ExportLink, InfoTip, type BreakdownItem } from "@/components/admin/traffic/ui";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { countryFlag, countryName, deviceLabel, languageName, usStateName } from "@/lib/traffic/labels";
import { breakdown, conversions, visitorTypes, type DimRow } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

const items = (rows: DimRow[], label: (k: string | null) => string): BreakdownItem[] =>
  rows.map((r) => ({ key: r.key ?? "∅", label: label(r.key), visitors: r.visitors, sessions: r.sessions, signups: r.signups, paid: r.paid }));
const orUnknown = (k: string | null) => k ?? "Unknown";

export default async function AnalyticsAudiencePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const q = parseTrafficQuery(await searchParams, requestNow());
  const conv = await conversions(q);
  const [devices, browsers, oses, langs, countries, states, types] = await Promise.all([
    breakdown(q, "device", conv),
    breakdown(q, "browser", conv),
    breakdown(q, "os", conv),
    breakdown(q, "lang", conv),
    breakdown(q, "country", conv, 250),
    breakdown(q, "region", conv),
    visitorTypes(q, conv),
  ]);
  const showStates = states.length > 0 && (!q.country || q.country === "US");

  return (
    <AnalyticsFrame email={admin.email} q={q} tab="audience">
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="New vs returning"
          description="By session; returning = this browser visited before"
          action={
            <div className="flex items-center gap-2">
              <InfoTip
                text="A browser counts as returning when it carries our 'visited before' flag (a boolean in local storage, no identifier). Cleared storage or a private window counts as new."
                label="How returning is counted"
              />
              <ExportLink href={exportHref(q, "new-returning")} />
            </div>
          }
        >
          <BreakdownTable
            nameHeader="Visitor"
            items={types.map((t) => ({
              key: t.returning ? "returning" : "new",
              label: t.returning ? "Returning" : "New",
              visitors: t.visitors,
              sessions: t.sessions,
              signups: t.signups,
              paid: t.paid,
            })).filter((t) => t.sessions > 0)}
          />
        </SectionCard>
        <SectionCard
          title="Devices"
          action={
            <div className="flex items-center gap-2">
              <InfoTip text={ATTRIBUTION_NOTE} label="Attribution rule" />
              <ExportLink href={exportHref(q, "devices")} />
            </div>
          }
        >
          <BreakdownTable items={items(devices, deviceLabel)} nameHeader="Device" />
        </SectionCard>
        <SectionCard title="Browsers" action={<ExportLink href={exportHref(q, "browsers")} />}>
          <BreakdownTable items={items(browsers, orUnknown)} nameHeader="Browser" limit={12} />
        </SectionCard>
        <SectionCard title="Operating systems" action={<ExportLink href={exportHref(q, "os")} />}>
          <BreakdownTable items={items(oses, orUnknown)} nameHeader="OS" limit={12} />
        </SectionCard>
        <SectionCard title="Site language" description="The browser's preferred language" action={<ExportLink href={exportHref(q, "languages")} />}>
          <BreakdownTable items={items(langs, (k) => (k ? `${languageName(k)} (${k})` : "Unknown"))} nameHeader="Language" limit={12} />
        </SectionCard>
        <SectionCard title="Countries" description="From the network location, not GPS" action={<ExportLink href={exportHref(q, "countries")} />}>
          <BreakdownTable items={items(countries, (k) => (k ? `${countryFlag(k)} ${countryName(k)}` : "Unknown"))} nameHeader="Country" limit={15} />
        </SectionCard>
      </div>
      {showStates ? (
        <SectionCard title="US states" description="Visitors from the United States" action={<ExportLink href={exportHref(q, "regions")} />}>
          <BreakdownTable items={items(states, usStateName)} nameHeader="State" limit={25} />
        </SectionCard>
      ) : null}
    </AnalyticsFrame>
  );
}
