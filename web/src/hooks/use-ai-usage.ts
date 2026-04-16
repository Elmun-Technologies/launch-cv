"use client";

import { useEffect, useState } from "react";

export type AiUsagePayload = {
  pro: boolean;
  paid?: boolean;
  plan?: string;
  month: string;
  limits: { jd: number; packet: number; roleFit: number };
  used: { jd: number; packet: number; roleFit: number };
};

export function useAiUsage() {
  const [data, setData] = useState<AiUsagePayload | null>(null);
  useEffect(() => {
    void fetch("/api/usage")
      .then((r) => r.json())
      .then((j) => {
        if (j && typeof j.used === "object") setData(j as AiUsagePayload);
      })
      .catch(() => setData(null));
  }, []);
  return data;
}
