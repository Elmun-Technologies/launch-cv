"use client";

import { useEffect, useState } from "react";

export function EvidenceClient({ resumeId }: { resumeId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/ai/evidence-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });
      const j = await res.json().catch(() => ({}));
      if (cancelled) return;
      setLoading(false);
      if (!res.ok) {
        setError(j.error ?? "Error");
        return;
      }
      setResult(j.result);
    })();
    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  return (
    <div className="mt-8 space-y-4">
      {loading ? <p className="text-sm text-zinc-400">Checking...</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {result ? (
        <pre className="overflow-auto rounded-xl border border-zinc-800 bg-black/40 p-4 text-xs text-zinc-200">
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
