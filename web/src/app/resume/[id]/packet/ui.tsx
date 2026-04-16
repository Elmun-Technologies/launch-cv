"use client";

import Link from "next/link";
import { useState } from "react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { PacketResult } from "@/types/ai-results";
import {
  Loader2,
  AlertTriangle,
  CreditCard,
  Copy,
  Check,
  MessageSquare,
  Mic,
} from "lucide-react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="soha-btn-ghost !px-2 !py-1 text-xs"
    >
      {copied ? (
        <Check className="h-3 w-3 text-blue-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Skeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="soha-skeleton h-20 w-full" />
      ))}
    </div>
  );
}

export function PacketClient({ resumeId }: { resumeId: string }) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [tone, setTonee] = useState<"formal" | "neutral">("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [result, setResult] = useState<PacketResult | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setUpgrade(false);
    const res = await fetch("/api/ai/packet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jdText: jd, tone }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      return;
    }
    setResult(j.result as PacketResult);
  }

  return (
    <div className="space-y-6">
      <AiDisclaimer />
      <AiUsageBanner usage={usage} kind="packet" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="soha-label">Tone</label>
          <select
            className="soha-select mt-1.5"
            value={tone}
            onChange={(e) =>
              setTonee(e.target.value as "formal" | "neutral")
            }
          >
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>
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
        {loading ? "Generating..." : "Generate packet"}
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
        <div className="animate-fadeIn space-y-6">
          {/* Cover letter */}
          <section className="soha-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <MessageSquare className="h-4 w-4 text-blue-500" /> Cover
                letter
              </h2>
              <CopyButton text={result.cover_letter} />
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {result.cover_letter}
            </pre>
          </section>

          {/* Elevator pitch */}
          <section className="soha-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Mic className="h-4 w-4 text-blue-500" /> Elevator pitch
              </h2>
              <CopyButton text={result.elevator_pitch} />
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
              {result.elevator_pitch}
            </pre>
          </section>

          {/* Questions */}
          <section className="soha-card">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Interview questions
            </h2>
            <div className="space-y-3">
              {result.interview_questions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {q.question}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {q.answer_outline}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
