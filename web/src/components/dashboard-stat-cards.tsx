"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, animate } from "motion/react";
import { TrendingUp, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type DashboardStat = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend: string;
};

function useCountUp(target: number, duration = 0.9) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration, reduce]);
  return value;
}

function StatCard({ stat, index }: { stat: DashboardStat; index: number }) {
  const count = useCountUp(stat.value);
  return (
    <motion.div
      className="rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.15)]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-gray-500">{stat.label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
          <stat.icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <p className="mt-3 text-[32px] font-bold leading-none tracking-tight text-gray-900">
        {count.toLocaleString()}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
          <TrendingUp className="h-3 w-3" />
          {stat.trend}
        </span>
        <span className="text-[11px] text-gray-400">
          Last Update: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </motion.div>
  );
}

export function DashboardStatCards({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s, i) => (
        <StatCard key={s.label} stat={s} index={i} />
      ))}
    </div>
  );
}
