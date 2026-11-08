import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { SectionCard } from "@/components/admin/section-card";
import { AnalyticsFrame, exportHref } from "@/components/admin/traffic/frame";
import { ATTRIBUTION_NOTE, BreakdownTable, ExportLink, InfoTip, type BreakdownItem } from "@/components/admin/traffic/ui";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { breakdown, conversions, type DimRow } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

const CHANNEL_HELP =
  "Paid: utm_medium cpc/ppc/paid or an ad click id. Email: utm_medium email/newsletter or a webmail referrer. AI assistants: ChatGPT, Perplexity, Claude, Gemini, Copilot. Social: social networks or utm_medium social. Organic search: Google, Bing, DuckDuckGo, Yahoo, Ecosia, Baidu, Yandex. Referral: any other site. Direct: no referrer and no tags.";

const items = (rows: DimRow[], label: (k: string | null) => string = (k) => k ?? "(none)"): BreakdownItem[] =>
  rows.map((r) => ({ key: r.key ?? "∅", label: label(r.key), visitors: r.visitors, sessions: r.sessions, signups: r.signups, paid: r.paid }));

export default async function AnalyticsSourcesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const q = parseTrafficQuery(await searchParams, requestNow());
  const conv = await conversions(q);
  const [channels, referrers, utmSource, utmMedium, utmCampaign] = await Promise.all([
    breakdown(q, "channel", conv),
    breakdown(q, "referrer", conv),
    breakdown(q, "utmSource", conv),
    breakdown(q, "utmMedium", conv),
    breakdown(q, "utmCampaign", conv),
  ]);

  return (
    <AnalyticsFrame email={admin.email} q={q} tab="sources">
      <SectionCard
        title="Channels"
        description="Where sessions came from, grouped"
        action={
          <div className="flex items-center gap-2">
            <InfoTip text={CHANNEL_HELP} label="Channel rules" />
            <InfoTip text={ATTRIBUTION_NOTE} label="Attribution rule" />
            <ExportLink href={exportHref(q, "channels")} />
          </div>
        }
      >
        <BreakdownTable items={items(channels)} nameHeader="Channel" />
      </SectionCard>

      <SectionCard title="Referrer sites" description="External sites that sent visitors" action={<ExportLink href={exportHref(q, "referrers")} />}>
        <BreakdownTable items={items(referrers)} nameHeader="Site" limit={25} />
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-3">
        <SectionCard title="UTM source" action={<ExportLink href={exportHref(q, "utm-source")} />}>
          <BreakdownTable items={items(utmSource)} nameHeader="Source" showSessions={false} limit={20} />
        </SectionCard>
        <SectionCard title="UTM medium" action={<ExportLink href={exportHref(q, "utm-medium")} />}>
          <BreakdownTable items={items(utmMedium)} nameHeader="Medium" showSessions={false} limit={20} />
        </SectionCard>
        <SectionCard title="UTM campaign" action={<ExportLink href={exportHref(q, "utm-campaign")} />}>
          <BreakdownTable items={items(utmCampaign)} nameHeader="Campaign" showSessions={false} limit={20} />
        </SectionCard>
      </div>
    </AnalyticsFrame>
  );
}
