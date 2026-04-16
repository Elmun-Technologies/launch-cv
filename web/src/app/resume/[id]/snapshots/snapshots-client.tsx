"use client";

import { useState } from "react";

type Row = { id: string; label: string | null; createdAt: string };

export function SnapshotsClient({ resumeId, initial }: { resumeId: string; initial: Row[] }) {
  const [msg, setMsg] = useState<string | null>(null);

  async function restore(sid: string) {
    setMsg(null);
    if (!confirm("Overwrite the current resume with this snapshot?")) return;
    const res = await fetch(`/api/resumes/${resumeId}/snapshots/${sid}/restore`, { method: "POST" });
    if (!res.ok) {
      setMsg("Error");
      return;
    }
    setMsg("Restored. Go to the edit page.");
  }

  return (
    <div className="mt-8 space-y-3">
      {msg ? <p className="text-sm text-emerald-400">{msg}</p> : null}
      {initial.length === 0 ? (
        <p className="text-sm text-zinc-500">No snapshots yet. Click the &quot;Snapshot&quot; button in the editor.</p>
      ) : (
        <ul className="space-y-2">
          {initial.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm"
            >
              <div>
                <div className="text-white">{s.label ?? "Snapshot"}</div>
                <div className="text-xs text-zinc-500">{new Date(s.createdAt).toLocaleString()}</div>
              </div>
              <button
                type="button"
                className="rounded-md border border-zinc-600 px-2 py-1 text-xs hover:bg-zinc-900"
                onClick={() => void restore(s.id)}
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
