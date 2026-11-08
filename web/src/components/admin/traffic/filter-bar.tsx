"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { chipCls, focusRing, pillBtn } from "@/components/admin/v5/ui";
import { CHANNELS, DEVICES, PRESETS, TIMEZONES, trafficSearch, type Preset, type TzId } from "@/lib/traffic/filters";
import { countryFlag, countryName, deviceLabel } from "@/lib/traffic/labels";

export type FilterState = {
  preset: Preset;
  tzId: TzId;
  fromDay: string;
  toDay: string;
  country: string | null;
  device: (typeof DEVICES)[number] | null;
  channel: (typeof CHANNELS)[number] | null;
};

const selectCls = `h-10 min-w-0 rounded-full border-[1.5px] border-transparent bg-white pl-4 pr-8 text-[14px] font-semibold text-[#121226] hover:border-[#c9c0ff] ${focusRing}`;

/**
 * Date presets, custom range, timezone and the global filters for Admin →
 * Analytics. Every change is a URL change, so views are shareable and the
 * server renders the data; tab-specific params (page, entry…) are dropped.
 */
export function TrafficFilterBar({ state, countries, today }: { state: FilterState; countries: string[]; today: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [customOpen, setCustomOpen] = useState(state.preset === "custom");
  const [from, setFrom] = useState(state.fromDay);
  const [to, setTo] = useState(state.toDay);

  const go = (patch: Partial<FilterState>) => router.push(`${pathname}${trafficSearch({ ...state, ...patch })}`, { scroll: false });
  const countryList = state.country && !countries.includes(state.country) ? [state.country, ...countries] : countries;
  const filtersOn = !!(state.country || state.device || state.channel);

  return (
    <div className="lc-card space-y-3 rounded-[24px] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Date range" className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === "custom" ? customOpen || state.preset === "custom" : state.preset === p.id}
              className={chipCls(p.id === "custom" ? customOpen || state.preset === "custom" : state.preset === p.id && !customOpen)}
              onClick={() => {
                if (p.id === "custom") setCustomOpen((o) => !o);
                else {
                  setCustomOpen(false);
                  go({ preset: p.id });
                }
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Timezone" className="flex gap-1 rounded-full bg-[#f1eff8] p-1">
          {TIMEZONES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={state.tzId === t.id}
              onClick={() => go({ tzId: t.id })}
              className={`inline-flex min-h-9 items-center rounded-full px-3 text-[13px] font-bold ${focusRing} ${
                state.tzId === t.id ? "bg-white text-[#121226] shadow-sm" : "text-[#4a4862] hover:text-[#121226]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {customOpen ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (from && to) go({ preset: "custom", fromDay: from, toDay: to });
          }}
        >
          <label className="grid gap-1 text-[12px] font-bold text-[#4a4862]">
            From
            <input type="date" required value={from} max={today} onChange={(e) => setFrom(e.target.value)} className={`${selectCls} pr-4`} />
          </label>
          <label className="grid gap-1 text-[12px] font-bold text-[#4a4862]">
            To
            <input type="date" required value={to} max={today} onChange={(e) => setTo(e.target.value)} className={`${selectCls} pr-4`} />
          </label>
          <button type="submit" className={`${pillBtn} bg-[#111118]! text-white!`}>
            Apply
          </button>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-[#e2e0ea] pt-3">
        <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">Filter</span>
        <label className="sr-only" htmlFor="tf-country">
          Country
        </label>
        <select id="tf-country" className={selectCls} value={state.country ?? ""} onChange={(e) => go({ country: e.target.value || null })}>
          <option value="">All countries</option>
          {countryList.map((c) => (
            <option key={c} value={c}>
              {countryFlag(c)} {countryName(c)}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="tf-device">
          Device
        </label>
        <select
          id="tf-device"
          className={selectCls}
          value={state.device ?? ""}
          onChange={(e) => go({ device: (e.target.value || null) as FilterState["device"] })}
        >
          <option value="">All devices</option>
          {DEVICES.map((d) => (
            <option key={d} value={d}>
              {deviceLabel(d)}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="tf-source">
          Source
        </label>
        <select
          id="tf-source"
          className={selectCls}
          value={state.channel ?? ""}
          onChange={(e) => go({ channel: (e.target.value || null) as FilterState["channel"] })}
        >
          <option value="">All sources</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {filtersOn ? (
          <button type="button" onClick={() => go({ country: null, device: null, channel: null })} className={`${chipCls(false)} text-[#5440e8]!`}>
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
