/** "just now", "2 min ago", "3 hr ago", "4 days ago", else "Oct 20". US English, for admin lists. */
export function relativeTime(date: Date | string | null | undefined, now = Date.now()): string {
  if (!date) return "—";
  const t = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  if (!Number.isFinite(t)) return "—";
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 14) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", ...(d > 300 ? { year: "numeric" } : {}) }).format(new Date(t));
}

/** The current time for server-rendered relative labels (kept out of render bodies for the React purity lint). */
export function nowMs(): number {
  return Date.now();
}
