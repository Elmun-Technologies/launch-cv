"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/admin/section-card";
import { Meter } from "@/components/admin/v5/ui";
import { countryFlag, countryName, deviceLabel, fmtInt } from "@/lib/traffic/labels";
import { fmtAgo } from "@/lib/admin-dates";
import type { LiveData } from "@/lib/traffic/queries";

const REFRESH_MS = 15_000;

/** Active visitors (last 5 minutes) and the page each is on, refreshed every 15 seconds. */
export function LivePanel({ initial, initialAt }: { initial: LiveData; initialAt: number }) {
  const [data, setData] = useState(initial);
  const [at, setAt] = useState(initialAt);
  const [now, setNow] = useState(initialAt);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let stop = false;
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/admin-panel/analytics/live", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as LiveData;
        if (!stop) {
          setData(next);
          setAt(Date.now());
          setFailed(false);
        }
      } catch {
        if (!stop) setFailed(true);
      }
    };
    const poll = setInterval(tick, REFRESH_MS);
    const clock = setInterval(() => setNow(Date.now()), 5_000);
    return () => {
      stop = true;
      clearInterval(poll);
      clearInterval(clock);
    };
  }, []);

  const max = Math.max(1, ...data.pages.map((p) => p.visitors));
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,320px)_1fr]">
        <div className="self-start rounded-[22px] bg-[#5440e8] p-5 text-white">
          <p className="flex items-center gap-2 text-[13px] text-[#e4dfff]">
            <span className="relative inline-flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#9ff0c8] opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#9ff0c8]" />
            </span>
            Active visitors · last 5 minutes
          </p>
          <p className="mt-1.5 text-[44px] font-extrabold leading-none tracking-[-0.03em] tabular-nums" aria-live="polite">
            {fmtInt(data.visitors)}
          </p>
          <p className="mt-2 text-[12px] font-semibold text-[#e4dfff]">
            {failed ? "Couldn't refresh — retrying" : `Updated ${fmtAgo(at, now)} · refreshes every 15 s`}
          </p>
        </div>
        <SectionCard title="Pages they're on" description="Each active visitor's latest page">
          {data.pages.length === 0 ? (
            <p className="py-6 text-center text-[14px] text-[#66647c]">No data yet — nobody in the last 5 minutes.</p>
          ) : (
            <ul>
              {data.pages.map((p) => (
                <li key={p.path} className="border-t border-[#e2e0ea] py-2.5 first:border-t-0">
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="lc-mono min-w-0 truncate text-[#121226]">{p.path}</span>
                    <b className="shrink-0 tabular-nums">{fmtInt(p.visitors)}</b>
                  </div>
                  <div className="mt-1.5">
                    <Meter pct={(p.visitors / max) * 100} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
      <SectionCard title="Latest page views" description="Last 5 minutes, newest first" flush>
        {data.recent.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-[#66647c]">No data yet</p>
        ) : (
          <ul>
            {data.recent.map((r, i) => (
              <li key={`${r.at}-${i}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#e2e0ea] px-5 py-2.5 text-[13px] first:border-t-0 sm:px-6">
                <span className="lc-mono min-w-0 truncate text-[#121226]">{r.path}</span>
                <span className="flex shrink-0 flex-wrap items-center gap-x-3 text-[12px] text-[#4a4862]">
                  <span>{r.country ? `${countryFlag(r.country)} ${countryName(r.country)}` : "Unknown"}</span>
                  <span>{deviceLabel(r.device)}</span>
                  <span>{r.channel}{r.referrerHost ? ` · ${r.referrerHost}` : ""}</span>
                  <time dateTime={r.at}>{fmtAgo(r.at, now)}</time>
                </span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
