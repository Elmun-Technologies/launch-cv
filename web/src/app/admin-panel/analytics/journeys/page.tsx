import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { SectionCard } from "@/components/admin/section-card";
import { focusRing, pillBtn } from "@/components/admin/v5/ui";
import { AnalyticsFrame, exportHref } from "@/components/admin/traffic/frame";
import { ExportLink, NoData } from "@/components/admin/traffic/ui";
import { maskEmail } from "@/lib/admin-labels";
import { parseTrafficQuery, trafficSearch } from "@/lib/traffic/filters";
import { countryFlag, countryName, deviceLabel, fmtDuration, fmtInt, usStateName } from "@/lib/traffic/labels";
import { journeys, JOURNEYS_PER_PAGE } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AnalyticsJourneysPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const params = await searchParams;
  const q = parseTrafficQuery(params, requestNow());
  const convertedOnly = first(params.conv) === "1";
  const entryPath = (first(params.entry) ?? "").slice(0, 300) || null;
  const page = Math.max(1, Math.min(1000, Number(first(params.page)) || 1));

  const [{ total, list }, entryOptions] = await Promise.all([
    journeys(q, { convertedOnly, entryPath, page }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: {
        isEntry: true,
        createdAt: { gte: q.from, lt: q.to },
        ...(q.country ? { country: q.country } : {}),
        ...(q.device ? { device: q.device } : {}),
        ...(q.channel ? { channel: q.channel } : {}),
      },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 50,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / JOURNEYS_PER_PAGE));
  const own = { conv: convertedOnly ? "1" : null, entry: entryPath };
  const hidden = Object.entries(Object.fromEntries(new URLSearchParams(trafficSearch(q).slice(1))));
  const tz = q.tz;
  const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const options = entryPath && !entryOptions.some((o) => o.path === entryPath) ? [{ path: entryPath, _count: { path: 0 } }, ...entryOptions] : entryOptions;

  return (
    <AnalyticsFrame email={admin.email} q={q} tab="journeys">
      <SectionCard
        title="Visit journeys"
        description={`${fmtInt(total)} session${total === 1 ? "" : "s"} started in the range, newest first. Time on each page in brackets.`}
        action={<ExportLink href={exportHref(q, "journeys", own)} />}
      >
        <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
          {hidden.map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <label className="grid gap-1 text-[12px] font-bold text-[#4a4862]">
            Entry page
            <select
              name="entry"
              defaultValue={entryPath ?? ""}
              className={`h-10 max-w-[320px] rounded-full border-[1.5px] border-[#e2e0ea] bg-white pl-4 pr-8 text-[14px] font-semibold text-[#121226] ${focusRing}`}
            >
              <option value="">Any entry page</option>
              {options.map((o) => (
                <option key={o.path} value={o.path}>
                  {o.path} ({o._count.path})
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold text-[#121226]">
            <input type="checkbox" name="conv" value="1" defaultChecked={convertedOnly} className="h-4 w-4 accent-[#5440e8]" />
            Converted only (signed up or paid)
          </label>
          <button type="submit" className={`${pillBtn} bg-[#111118]! text-white!`}>
            Apply
          </button>
        </form>

        {list.length === 0 ? (
          <NoData />
        ) : (
          <ol className="space-y-3">
            {list.map((j) => {
              const place = j.entry.country
                ? `${countryFlag(j.entry.country)} ${j.entry.country === "US" && j.entry.region ? `${usStateName(j.entry.region)}, ` : j.city ? `${j.city}, ` : ""}${countryName(j.entry.country)}`
                : "Unknown location";
              const durationMs = j.steps.reduce((a, s) => a + s.durationMs, 0);
              return (
                <li key={j.sessionId} className="rounded-[18px] border border-[#e2e0ea] p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#4a4862]">
                    <time dateTime={j.start.toISOString()} className="font-bold text-[#121226]">
                      {time.format(j.start)}
                    </time>
                    <span>{place}</span>
                    <span>
                      {deviceLabel(j.entry.device)} · {j.entry.browser ?? "Unknown browser"} · {j.entry.os ?? "Unknown OS"}
                    </span>
                    <span className="rounded-full bg-[#f1eff8] px-2 py-0.5 font-bold text-[#121226]">
                      {j.entry.channel}
                      {j.entry.referrerHost ? ` · ${j.entry.referrerHost}` : ""}
                      {j.entry.utmCampaign ? ` · ${j.entry.utmCampaign}` : ""}
                    </span>
                    {j.entry.isReturning ? <span className="rounded-full bg-[#f1eff8] px-2 py-0.5 font-bold">Returning</span> : null}
                    {j.signedUp ? <span className="rounded-full bg-[#e4dfff] px-2 py-0.5 font-bold text-[#3a2bb8]">Signed up</span> : null}
                    {j.paid ? <span className="rounded-full bg-[#d8f3e6] px-2 py-0.5 font-bold text-[#0b5e3c]">Paid</span> : null}
                    <span className="ml-auto">
                      {j.steps.length} page{j.steps.length === 1 ? "" : "s"} · {fmtDuration(durationMs)}
                    </span>
                  </div>
                  <ol className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[13px]" aria-label="Pages in order">
                    {j.steps.map((s, i) => (
                      <li key={`${s.path}-${i}`} className="inline-flex items-center gap-1.5">
                        {i > 0 ? <ArrowRight className="h-3.5 w-3.5 text-[#9a97b0]" aria-hidden /> : null}
                        <span className={`lc-mono rounded-lg px-2 py-1 ${i === 0 ? "bg-[#e4dfff] text-[#121226]" : i === j.steps.length - 1 ? "bg-[#f1eff8] text-[#121226]" : "bg-[#faf9fd] text-[#4a4862]"}`}>
                          {s.path}
                          <span className="ml-1 text-[11px] text-[#66647c]">({fmtDuration(s.durationMs)})</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  {j.userId ? (
                    <p className="mt-2 text-[12px]">
                      <Link href={`/admin-panel/users/${j.userId}`} className={`font-bold text-[#5440e8] hover:text-[#3a2bb8] ${focusRing}`}>
                        Signed in as {j.userEmail ? maskEmail(j.userEmail) : "a deleted user"} → open in Users
                      </Link>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}

        {pages > 1 ? (
          <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[14px] text-[#4a4862]">
            <span className="tabular-nums">
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link className={pillBtn} href={`/admin-panel/analytics/journeys${trafficSearch(q, { ...own, page: page - 1 > 1 ? String(page - 1) : null })}`}>
                  Newer
                </Link>
              ) : null}
              {page < pages ? (
                <Link className={pillBtn} href={`/admin-panel/analytics/journeys${trafficSearch(q, { ...own, page: String(page + 1) })}`}>
                  Older
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </SectionCard>
    </AnalyticsFrame>
  );
}
