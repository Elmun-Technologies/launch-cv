/**
 * One date style for the admin panel: "Oct 20" (the year is added only when it
 * isn't the current one), "Oct 20, 14:02" for timestamps, and "2 min ago" for
 * recent activity. Everything is in UTC so server pages, client lists and CSV
 * exports agree no matter where the server or the admin is.
 * Pure functions (no React), safe on the server and in client components.
 */

type DateLike = Date | string | number;

const toDate = (d: DateLike) => (d instanceof Date ? d : new Date(d));

const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const MONTH_DAY_YEAR = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const TIME = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC" });
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });

/** "Oct 20", or "Oct 20, 2025" outside the current year. "—" for null. */
export function fmtDate(d: DateLike | null | undefined, now: DateLike = Date.now()): string {
  if (d === null || d === undefined) return "—";
  const date = toDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return date.getUTCFullYear() === toDate(now).getUTCFullYear() ? MONTH_DAY.format(date) : MONTH_DAY_YEAR.format(date);
}

/** Always with the year: "Oct 20, 2026" (joined dates, expiry dates). */
export function fmtDateLong(d: DateLike | null | undefined): string {
  if (d === null || d === undefined) return "—";
  const date = toDate(d);
  return Number.isNaN(date.getTime()) ? "—" : MONTH_DAY_YEAR.format(date);
}

/** "Oct 20, 14:02" (24-hour, UTC). */
export function fmtDateTime(d: DateLike | null | undefined, now: DateLike = Date.now()): string {
  if (d === null || d === undefined) return "—";
  const date = toDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  return `${fmtDate(date, now)}, ${TIME.format(date)}`;
}

/** "just now", "2 min ago", "3 hr ago", "yesterday", "4 days ago", then "Oct 20". */
export function fmtAgo(d: DateLike | null | undefined, now: DateLike = Date.now()): string {
  if (d === null || d === undefined) return "—";
  const date = toDate(d);
  if (Number.isNaN(date.getTime())) return "—";
  const sec = Math.round((toDate(now).getTime() - date.getTime()) / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  if (days < 2) return "yesterday";
  if (days < 7) return `${days} days ago`;
  return fmtDate(date, now);
}

/** Short weekday, "Mon". */
export function fmtWeekday(d: DateLike): string {
  return WEEKDAY.format(toDate(d));
}

/** ISO timestamp for <time dateTime> and CSV files. */
export function isoString(d: DateLike | null | undefined): string {
  if (d === null || d === undefined) return "";
  const date = toDate(d);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/** UTC calendar day key, "2026-10-20". */
export function utcDayKey(d: DateLike): string {
  return toDate(d).toISOString().slice(0, 10);
}

/** Midnight UTC at the start of the given day. */
export function startOfUtcDay(d: DateLike): Date {
  const x = toDate(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate()));
}

/** Midnight UTC on the 1st of the given month. */
export function startOfUtcMonth(d: DateLike): Date {
  const x = toDate(d);
  return new Date(Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), 1));
}

/**
 * Consecutive UTC days from `from` through `to` (inclusive) with a count per day,
 * filled from the given timestamps. Days with nothing are 0, not skipped.
 */
export function dailyCounts(dates: DateLike[], from: DateLike, to: DateLike): { day: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const d of dates) {
    const k = utcDayKey(d);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: { day: string; count: number }[] = [];
  const end = startOfUtcDay(to).getTime();
  for (let t = startOfUtcDay(from).getTime(); t <= end; t += 86_400_000) {
    const k = new Date(t).toISOString().slice(0, 10);
    out.push({ day: k, count: counts.get(k) ?? 0 });
  }
  return out;
}
