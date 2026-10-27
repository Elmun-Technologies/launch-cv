"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics-client";
import { useState } from "react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { RoleFitResult } from "@/types/ai-results";
import { Loader2, AlertTriangle, CreditCard } from "lucide-react";

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEEEEB]">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 text-right text-xs tabular-nums text-[#6B6B6B]">
        {score}/{max}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="mt-6 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="soha-skeleton h-10 w-full" />
      ))}
    </div>
  );
}

export function FitClient({ resumeId }: { resumeId: string }) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [result, setResult] = useState<RoleFitResult | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setUpgrade(false);
    const res = await fetch("/api/ai/role-fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        jdText: jd.trim() ? jd : undefined,
      }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      return;
    }
    setResult(j.result as RoleFitResult);
  }

  return (
    <div className="space-y-6">
      <AiDisclaimer />
      <AiUsageBanner usage={usage} kind="roleFit" />

      <div>
        <label className="soha-label">
          JD (optional — leave empty to evaluate resume only)
        </label>
        <textarea
          className="soha-textarea mt-1.5 min-h-[120px]"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description..."
        />
      </div>
      <button
        type="button"
        disabled={loading}
        onClick={() => void run()}
        className="soha-btn-primary"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Evaluating..." : "Evaluate"}
      </button>

      {error ? (
        <div className="soha-card flex items-start gap-3 border-red-200 bg-red-50">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm text-red-600">{error}</p>
            {upgrade ? (
              <Link
                href="/dashboard/settings/subscription"
                onClick={() => trackCtaClick({ cta: "upgrade", location: "role_fit_paywall" })}
                className="mt-1 inline-flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
              >
                <CreditCard className="h-3 w-3" /> Upgrade to Pro
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading ? <Skeleton /> : null}

      {result && !loading ? (
        <div className="animate-fadeIn space-y-6">
          {/* Overall */}
          <div className="soha-card flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#EEF3FF] ring-1 ring-[#DCE6FF]">
              <span className="text-2xl font-semibold text-[#2563EB]">
                {Math.round(result.overall)}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#111111]">
                Overall score
              </div>
              <div className="mt-1 text-xs text-[#6B6B6B]">
                On a 100-point scale. 70+ is a good result.
              </div>
            </div>
          </div>

          {/* Scores */}
          <section className="soha-card">
            <h2 className="mb-4 text-sm font-semibold text-[#111111]">
              Criteria
            </h2>
            <div className="space-y-3">
              {result.scores.map((s, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#3F3F3F]">
                      {s.name}
                    </span>
                  </div>
                  <ScoreBar score={s.score} max={s.max} />
                  <p className="mt-1 text-[11px] text-[#6B6B6B]">
                    {s.comment}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Fixes */}
          {result.prioritized_fixes.length > 0 ? (
            <section className="soha-card">
              <h2 className="mb-3 text-sm font-semibold text-[#111111]">
                Prioritized fixes
              </h2>
              <ol className="space-y-2">
                {result.prioritized_fixes.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[#3F3F3F]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#EEF3FF] text-[10px] font-semibold text-[#2563EB]">
                      {i + 1}
                    </span>
                    {f}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
