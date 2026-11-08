"use client";

import { useState } from "react";
import { DailyLineChart } from "@/components/admin/charts";
import { ChipButton, ChipGroup } from "@/components/admin/v5/ui";
import { LabeledBarChart } from "@/components/admin/traffic/charts";
import { hourLabel } from "@/lib/traffic/labels";

export type TrendPoint = { key: string; visitors: number; sessions: number; pageviews: number; signups: number };

const METRICS = [
  { id: "visitors", label: "Visitors" },
  { id: "sessions", label: "Sessions" },
  { id: "pageviews", label: "Pageviews" },
  { id: "signups", label: "Sign-ups" },
] as const;
type Metric = (typeof METRICS)[number]["id"];

/** Dynamics with a metric toggle: daily line, or hourly columns for a single day. */
export function TrendChart({ points, hourly }: { points: TrendPoint[]; hourly: boolean }) {
  const [metric, setMetric] = useState<Metric>("visitors");
  const noun = METRICS.find((m) => m.id === metric)!.label.toLowerCase();
  return (
    <div>
      <ChipGroup label="Metric">
        {METRICS.map((m) => (
          <ChipButton key={m.id} active={metric === m.id} onClick={() => setMetric(m.id)}>
            {m.label}
          </ChipButton>
        ))}
      </ChipGroup>
      <div className="mt-4">
        {hourly ? (
          <LabeledBarChart
            noun={noun}
            labelEvery={3}
            bars={points.map((p) => {
              const h = Number(p.key.slice(11, 13));
              return { label: hourLabel(h).replace(" ", "").toLowerCase(), value: p[metric], title: `${hourLabel(h)}: ${p[metric].toLocaleString("en-US")} ${noun}` };
            })}
          />
        ) : (
          <DailyLineChart noun={noun} points={points.map((p) => ({ day: p.key, count: p[metric] }))} />
        )}
      </div>
    </div>
  );
}
