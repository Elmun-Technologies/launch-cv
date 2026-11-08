import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AnalyticsFrame } from "@/components/admin/traffic/frame";
import { LivePanel } from "@/components/admin/traffic/live-panel";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { live } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

export default async function AnalyticsLivePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const now = requestNow();
  const q = parseTrafficQuery(await searchParams, now);
  const data = await live(new Date(now));
  return (
    <AnalyticsFrame email={admin.email} q={q} tab="live" showFilters={false}>
      <LivePanel initial={data} initialAt={now} />
    </AnalyticsFrame>
  );
}
