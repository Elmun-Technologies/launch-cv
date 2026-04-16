"use client";

import Link from "next/link";
import { useState } from "react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { JdAlignResult } from "@/types/ai-results";
import {
  Loader2,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  CreditCard,
} from "lucide-react";

function StatusDot({ status }: { status: string }) {
  if (status === "met")
    return (
      <span className="soha-badge-emerald">
        <Check className="h-3 w-3" /> Met
      </span>
    );
  if (status === "partial")
    return (
      <span className="soha-badge-amber">
        <AlertTriangle className="h-3 w-3" /> Partial
      </span>
    );
  return (
    <span className="soha-badge-red">
      <X className="h-3 w-3" /> Missing
    </span>
  );
}

function Skeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="soha-skeleton h-14 w-full" />
      ))}
    </div>
  );
}

export function JdClient({ resumeId }: { resumeId: string }) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [result, setResult] = useState<JdAlignResult | null>(null);
  const [jdRunId, setJdRunId] = useState<string | null>(null);
  const [applyBusy, setApplyBusy] = useState<string | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [appTitle, setAppTitle] = useState("");
  const [appCompany, setAppCompany] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setUpgrade(false);
    setSaveMsg(null);
    const res = await fetch("/api/ai/jd-align", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jdText: jd }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      return;
    }
    setResult(j.result as JdAlignResult);
    setJdRunId(typeof j.jdRunId === "string" ? j.jdRunId : null);
  }

  async function applyBullet(
    experienceId: string,
    bulletId: string,
    text: string,
  ) {
    setApplyBusy(`${experienceId}:${bulletId}`);
    setError(null);
    const res = await fetch(`/api/resumes/${resumeId}/apply-bullet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId, bulletId, text }),
    });
    setApplyBusy(null);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed to apply");
    }
  }

  async function saveApplication() {
    if (!jdRunId) return;
    setSaveBusy(true);
    setSaveMsg(null);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        jdRunId,
        title: appTitle.trim() || undefined,
        company: appCompany.trim() || undefined,
      }),
    });
    setSaveBusy(false);
    const j = await res.json().catch(() => ({}));
    setSaveMsg(res.ok ? "Application added." : (j.error ?? "Failed to save"));
  }

  return (
    <div className="space-y-6">
      <AiDisclaimer />
      <AiUsageBanner usage={usage} kind="jd" />

      <div>
        <label className="soha-label">Job description</label>
        <textarea
          className="soha-textarea mt-1.5 min-h-[180px]"
          placeholder="Paste the job description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </div>
      <button
        type="button"
        disabled={loading || jd.length < 40}
        onClick={() => void run()}
        className="soha-btn-primary"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "AI is processing..." : "Analyze"}
      </button>

      {error ? (
        <div className="soha-card flex items-start gap-3 border-red-200 bg-red-50">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm text-red-600">{error}</p>
            {upgrade ? (
              <Link
                href="/dashboard/settings"
                className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <CreditCard className="h-3 w-3" /> Upgrade to Pro
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading ? <Skeleton /> : null}

      {result && !loading ? (
        <div className="animate-fadeIn space-y-8">
          {/* Match Score */}
          <section className="soha-card flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex flex-col items-center">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${result.match_score >= 75 ? "border-emerald-400" : result.match_score >= 50 ? "border-amber-400" : "border-red-400"}`}>
                <span className="text-3xl font-bold text-gray-900">{result.match_score}</span>
              </div>
              <p className="mt-2 text-xs font-semibold text-gray-500">ATS Match Score</p>
            </div>
            <div className="flex-1">
              {result.keyword_coverage.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700">Keywords matched</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {result.keyword_coverage.map((kw) => (
                      <span key={kw} className="soha-badge-emerald text-[10px]">{kw}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          {/* Skill Gap Analysis */}
          {result.skill_gaps.length > 0 ? (
            <section className="soha-card">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Skill Gap Analysis</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className="px-3 py-2.5 font-medium">Skill</th>
                      <th className="px-3 py-2.5 font-medium">Status</th>
                      <th className="px-3 py-2.5 font-medium">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.skill_gaps.map((sg, i) => (
                      <tr key={i} className="transition hover:bg-gray-50">
                        <td className="px-3 py-2.5 font-medium text-gray-700">{sg.skill}</td>
                        <td className="px-3 py-2.5"><StatusDot status={sg.status === "strong" ? "met" : sg.status === "partial" ? "partial" : "missing"} /></td>
                        <td className="px-3 py-2.5 text-gray-500">{sg.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {/* Gap map */}
          <section className="soha-card">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Gap map
            </h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[500px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Requirement</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.gap_map.map((row, i) => (
                    <tr
                      key={i}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-3 py-2.5 text-gray-700">
                        {row.requirement}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusDot status={row.status} />
                      </td>
                      <td className="px-3 py-2.5 text-gray-500">
                        {row.evidence ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rewritten bullets */}
          <section className="soha-card">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Bullet variants
            </h2>
            <div className="space-y-3">
              {result.rewritten_bullets.map((b, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="text-sm text-gray-800">{b.new_text}</p>
                  <p className="mt-2 text-xs text-gray-500">{b.reason}</p>
                  <button
                    type="button"
                    disabled={
                      applyBusy === `${b.experienceId}:${b.bulletId}`
                    }
                    onClick={() =>
                      void applyBullet(
                        b.experienceId,
                        b.bulletId,
                        b.new_text,
                      )
                    }
                    className="soha-btn-secondary mt-3 text-xs"
                  >
                    {applyBusy === `${b.experienceId}:${b.bulletId}` ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <ArrowRight className="h-3 w-3" />
                    )}
                    Apply to resume
                  </button>
                </div>
              ))}
            </div>
          </section>

          {result.remove_suggestions.length > 0 ? (
            <section className="soha-card">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Removal suggestions
              </h2>
              <ul className="space-y-2">
                {result.remove_suggestions.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                    <span>
                      <code className="text-xs text-gray-400">
                        {r.bulletId}
                      </code>{" "}
                      — {r.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {result.explanations.length > 0 ? (
            <section className="soha-card">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Explanations
              </h2>
              <ul className="space-y-1.5">
                {result.explanations.map((e, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    • {e}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Save to applications */}
          {jdRunId ? (
            <section className="soha-card">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Add to applications
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className="soha-input"
                  placeholder="Job title"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                />
                <input
                  className="soha-input"
                  placeholder="Company"
                  value={appCompany}
                  onChange={(e) => setAppCompany(e.target.value)}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={saveBusy}
                  onClick={() => void saveApplication()}
                  className="soha-btn-primary text-xs"
                >
                  {saveBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}{" "}
                  Save
                </button>
                <Link
                  href="/dashboard/applications"
                  className="soha-btn-secondary text-xs"
                >
                  Applications
                </Link>
              </div>
              {saveMsg ? (
                <p className="mt-2 text-xs text-gray-500">{saveMsg}</p>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
