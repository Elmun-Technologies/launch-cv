/** Display helpers for Admin → Analytics. Pure, safe in client components. */

const REGION_NAMES = new Intl.DisplayNames(["en"], { type: "region" });
const LANGUAGE_NAMES = new Intl.DisplayNames(["en"], { type: "language" });

export function countryName(code: string | null | undefined): string {
  if (!code) return "Unknown";
  try {
    return REGION_NAMES.of(code) ?? code;
  } catch {
    return code;
  }
}

/** Regional-indicator flag emoji for a 2-letter country code. */
export function countryFlag(code: string | null | undefined): string {
  if (!code || !/^[A-Z]{2}$/.test(code)) return "";
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export function languageName(tag: string | null | undefined): string {
  if (!tag) return "Unknown";
  try {
    return LANGUAGE_NAMES.of(tag) ?? tag;
  } catch {
    return tag;
  }
}

export const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
  DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
  NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  PR: "Puerto Rico", GU: "Guam", VI: "U.S. Virgin Islands", AS: "American Samoa", MP: "Northern Mariana Islands",
};

export function usStateName(code: string | null | undefined): string {
  if (!code) return "Unknown";
  return US_STATES[code] ?? code;
}

export function deviceLabel(d: string | null | undefined): string {
  if (d === "mobile") return "Mobile";
  if (d === "tablet") return "Tablet";
  if (d === "desktop") return "Desktop";
  return "Unknown";
}

/** "2m 05s", "45s", "1h 02m". */
export function fmtDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

export const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

/** "12.4%", "—" when there's no denominator. */
export function fmtPct(part: number, whole: number, digits = 1): string {
  if (!whole) return "—";
  return `${((part / whole) * 100).toFixed(digits)}%`;
}

export function fmtUsd(n: number, cents = false): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 })}`;
}

/** Percent change, or null when there's nothing to compare against. */
export function pctChange(cur: number, prev: number | null | undefined): number | null {
  if (prev === null || prev === undefined || !Number.isFinite(prev) || prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

/** "12 AM", "1 PM". */
export function hourLabel(h: number): string {
  const x = h % 12 === 0 ? 12 : h % 12;
  return `${x} ${h < 12 ? "AM" : "PM"}`;
}
