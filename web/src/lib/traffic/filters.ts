import { CHANNELS, isChannel, type Channel } from "@/lib/traffic/channel";

/**
 * Admin → Analytics query state: date preset or custom range, timezone,
 * comparison window and the global filters (country, device, source). Parsed
 * from the URL by every analytics page and by the CSV export, so both read
 * exactly the same rows. Pure (no Prisma), safe in client components.
 */

export const PRESETS = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
  { id: "custom", label: "Custom" },
] as const;
export type Preset = (typeof PRESETS)[number]["id"];
export const DEFAULT_PRESET: Preset = "7d";

export const TIMEZONES = [
  { id: "et", tz: "America/New_York", label: "New York" },
  { id: "utc", tz: "UTC", label: "UTC" },
] as const;
export type TzId = (typeof TIMEZONES)[number]["id"];

export const DEVICES = ["desktop", "mobile", "tablet"] as const;
export type DeviceFilter = (typeof DEVICES)[number];

/** Longest custom range, in days. */
export const MAX_RANGE_DAYS = 400;
const DAY = 86_400_000;

export type TrafficQuery = {
  preset: Preset;
  tzId: TzId;
  /** IANA zone used for day/hour buckets and day boundaries. */
  tz: string;
  /** Current window [from, to). `to` never passes "now". */
  from: Date;
  to: Date;
  /** Previous window of the same length, right before `from`. */
  prevFrom: Date;
  prevTo: Date;
  /** First and last local calendar day in the window, "2026-11-01". */
  fromDay: string;
  toDay: string;
  /** Buckets for the dynamics chart. */
  granularity: "hour" | "day";
  country: string | null;
  device: DeviceFilter | null;
  channel: Channel | null;
  now: Date;
};

export type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Minutes the zone is ahead of UTC at `at`. */
function offsetMinutes(at: number, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(at));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return Math.round((asUtc - Math.floor(at / 1000) * 1000) / 60_000);
}

/** The instant local midnight starts on `day` ("2026-11-08") in `tz`. */
export function zonedMidnight(day: string, tz: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - offsetMinutes(guess, tz) * 60_000;
  // Second pass settles DST transitions.
  t = guess - offsetMinutes(t, tz) * 60_000;
  return new Date(t);
}

/** Local calendar day of an instant in `tz`, "2026-11-08". */
export function zonedDay(at: Date | number, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(at));
}

/** `day` plus n calendar days. */
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function parseTrafficQuery(params: RawParams, nowMs: number): TrafficQuery {
  const now = new Date(nowMs);
  const tzId: TzId = first(params.tz) === "utc" ? "utc" : "et";
  const tz = TIMEZONES.find((t) => t.id === tzId)!.tz;
  let preset: Preset = (PRESETS.find((p) => p.id === first(params.range))?.id ?? DEFAULT_PRESET) as Preset;
  const today = zonedDay(now, tz);

  let fromDay: string;
  let toDay: string;
  let to: Date;
  switch (preset) {
    case "today":
      fromDay = toDay = today;
      to = now;
      break;
    case "yesterday":
      fromDay = toDay = addDays(today, -1);
      to = zonedMidnight(today, tz);
      break;
    case "custom": {
      const f = first(params.from);
      const t = first(params.to);
      if (f && t && DAY_RE.test(f) && DAY_RE.test(t) && !Number.isNaN(Date.parse(f)) && !Number.isNaN(Date.parse(t))) {
        fromDay = f <= t ? f : t;
        toDay = f <= t ? t : f;
        if (toDay > today) toDay = today;
        if (fromDay > toDay) fromDay = toDay;
        if (Date.parse(toDay) - Date.parse(fromDay) > MAX_RANGE_DAYS * DAY) fromDay = addDays(toDay, -MAX_RANGE_DAYS);
        const end = zonedMidnight(addDays(toDay, 1), tz);
        to = end.getTime() > nowMs ? now : end;
        break;
      }
      preset = DEFAULT_PRESET;
      fromDay = addDays(today, -6);
      toDay = today;
      to = now;
      break;
    }
    default: {
      const days = preset === "30d" ? 30 : preset === "90d" ? 90 : preset === "12m" ? 365 : 7;
      fromDay = addDays(today, -(days - 1));
      toDay = today;
      to = now;
    }
  }
  const from = zonedMidnight(fromDay, tz);
  const len = Math.max(60_000, to.getTime() - from.getTime());
  const country = (first(params.country) ?? "").toUpperCase();
  const device = first(params.device);
  const channel = first(params.source);

  return {
    preset,
    tzId,
    tz,
    from,
    to,
    prevFrom: new Date(from.getTime() - len),
    prevTo: from,
    fromDay,
    toDay,
    granularity: fromDay === toDay ? "hour" : "day",
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    device: (DEVICES as readonly string[]).includes(device ?? "") ? (device as DeviceFilter) : null,
    channel: isChannel(channel) ? channel : null,
    now,
  };
}

/** URL query for a TrafficQuery with some fields changed (defaults are left out). */
export function trafficSearch(
  q: Pick<TrafficQuery, "preset" | "tzId" | "fromDay" | "toDay" | "country" | "device" | "channel">,
  extra: Record<string, string | null | undefined> = {},
): string {
  const sp = new URLSearchParams();
  if (q.preset !== DEFAULT_PRESET) sp.set("range", q.preset);
  if (q.preset === "custom") {
    sp.set("from", q.fromDay);
    sp.set("to", q.toDay);
  }
  if (q.tzId !== "et") sp.set("tz", q.tzId);
  if (q.country) sp.set("country", q.country);
  if (q.device) sp.set("device", q.device);
  if (q.channel) sp.set("source", q.channel);
  for (const [k, v] of Object.entries(extra)) {
    if (v) sp.set(k, v);
    else sp.delete(k);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** "Nov 1 – Nov 7, 2026 · New York time" */
export function describeRange(q: TrafficQuery): string {
  const fmt = (day: string, withYear: boolean) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" }).format(
      new Date(`${day}T00:00:00Z`),
    );
  const tzLabel = q.tzId === "utc" ? "UTC" : "New York time";
  if (q.fromDay === q.toDay) return `${fmt(q.fromDay, true)} · ${tzLabel}`;
  const sameYear = q.fromDay.slice(0, 4) === q.toDay.slice(0, 4);
  return `${fmt(q.fromDay, !sameYear)} – ${fmt(q.toDay, true)} · ${tzLabel}`;
}

export function hasFilters(q: Pick<TrafficQuery, "country" | "device" | "channel">): boolean {
  return !!(q.country || q.device || q.channel);
}

export { CHANNELS };
