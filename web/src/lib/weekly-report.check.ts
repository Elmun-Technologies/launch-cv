/**
 * Self-checks for the pure parts of lib/weekly-report.ts (window, deltas, rendering).
 * Nothing touches the database or sends email.
 * Run: npx tsx src/lib/weekly-report.check.ts
 */
import assert from "node:assert/strict";
import { changeNote, pointsNote, renderWeeklyReport, weekLabel, weeklyWindow, type WeeklyReport } from "@/lib/weekly-report";

let n = 0;
const eq = (a: unknown, b: unknown, msg?: string) => {
  n++;
  assert.deepEqual(a, b, msg);
};

// Monday 13:07 UTC → the full Mon–Sun before it.
const w = weeklyWindow(new Date("2026-11-09T13:07:00Z"));
eq(w.from.toISOString(), "2026-11-02T00:00:00.000Z");
eq(w.to.toISOString(), "2026-11-09T00:00:00.000Z");
eq(w.prevFrom.toISOString(), "2026-10-26T00:00:00.000Z");
eq(w.prevTo.toISOString(), "2026-11-02T00:00:00.000Z");
eq(weekLabel(w.from, w.to), "Nov 2 – Nov 8, 2026");
// Mid-week "send now": the last 7 complete days.
eq(weeklyWindow(new Date("2026-11-12T08:00:00Z")).from.toISOString(), "2026-11-05T00:00:00.000Z");

const int = (x: number) => String(x);
eq(changeNote(120, 100, int), { note: "+20% vs 100", tone: "good" });
eq(changeNote(80, 100, int), { note: "−20% vs 100", tone: "bad" });
eq(changeNote(120, 100, int, false), { note: "+20% vs 100", tone: "bad" });
eq(changeNote(5, 0, int), { note: "new (was 0)", tone: "good" });
eq(changeNote(0, 0, int), { note: "no change", tone: "neutral" });
eq(changeNote(100, 100, int), { note: "±0% vs 100", tone: "neutral" });
eq(pointsNote(3.5, 2.3), { note: "+1.2 pts vs 2.3%", tone: "good" });
eq(pointsNote(2, 2), { note: "no change", tone: "neutral" });
eq(pointsNote(null, 50), { note: "was 50%", tone: "neutral" });
eq(pointsNote(10, null), { note: "no data before", tone: "neutral" });

const report: WeeklyReport = {
  ...w,
  traffic: { visitors: { cur: 1200, prev: 1000 }, sessions: { cur: 1500, prev: 1300 }, signups: { cur: 30, prev: 25 }, signupConversionPct: { cur: 2.5, prev: 2.5 } },
  revenue: { purchases: { cur: 4, prev: 2 }, netUsd: { cur: 96.3, prev: 78 }, mrr: { cur: 58, prev: 29 }, activePasses: { cur: 3, prev: 1 }, listPricedPurchases: 1 },
  ai: { spendUsd: { cur: 4.2, prev: 3.1 }, marginPct: { cur: 95.6, prev: 96 } },
  topPages: [{ path: "/<script>", visitors: 10 }],
  topSources: [],
  funnel: [
    { label: "Visited the site", cur: 1200, prev: 1000 },
    { label: "Signed up", cur: 30, prev: 25 },
    { label: "Paid", cur: 3, prev: 1 },
  ],
  winback: { sent: { cur: 5, prev: 0 }, redeemed: { cur: 1, prev: 0 } },
  problems: [],
};
const mail = renderWeeklyReport(report, "https://launch-cv.com");
eq(mail.subject, "LaunchCV weekly report: Nov 2 – Nov 8, 2026");
for (const s of ["1,200", "+20% vs 1,000", "$96.30", "+100% vs $29", "95.6%", "/&lt;script&gt;", "No page views recorded this week.", "None found.", "counted at list price", "10% of sign-ups"]) {
  n++;
  assert.ok(mail.html.includes(s), `html has ${s}`);
}
n++;
assert.ok(!mail.html.includes("/<script>"), "paths are escaped");
n++;
assert.ok(mail.text.includes("- Visitors: 1,200 (+20% vs 1,000)"), "text version lists rows");

console.log(`weekly-report: ${n} checks passed`);
