"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Row = { id: string; label: string | null; createdAt: string };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function SnapshotsClient({ resumeId, initial }: { resumeId: string; initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch(`/api/resumes/${resumeId}/snapshots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(label.trim() ? { label: label.trim() } : {}),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setSaving(false);
    if (!res?.ok) {
      setMsg({ ok: false, text: "Couldn't save this version. Please try again." });
      return;
    }
    const snap = (j.snapshot ?? j) as Partial<Row>;
    setRows((r) => [
      { id: String(snap.id ?? Date.now()), label: snap.label ?? (label.trim() || null), createdAt: snap.createdAt ?? new Date().toISOString() },
      ...r,
    ]);
    setLabel("");
    setMsg({ ok: true, text: "Version saved." });
  }

  async function restore(sid: string) {
    setMsg(null);
    if (!confirm("Replace the current resume with this version? Save the current one first if you want to keep it.")) return;
    const res = await fetch(`/api/resumes/${resumeId}/snapshots/${sid}/restore`, { method: "POST" }).catch(() => null);
    setMsg(res?.ok ? { ok: true, text: "Restored." } : { ok: false, text: "Couldn't restore this version." });
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={save} className="flex flex-col gap-2 rounded-2xl border border-[#E5E5E2] bg-white p-5 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="mb-1.5 block text-[13px] font-medium">Name this version</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={120}
            placeholder="e.g. Northwind — Senior PM"
            className="h-[42px] w-full rounded-[10px] border border-[#D9D9D5] px-3 text-[14px] outline-none focus:border-[#111111] focus:ring-4 focus:ring-black/5"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-[#111111] px-5 text-[14px] font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Save current version
        </button>
      </form>

      {msg ? (
        <p role="status" className={`text-[14px] ${msg.ok ? "text-[#0E7A48]" : "text-[#B42318]"}`}>
          {msg.text}{" "}
          {msg.ok && msg.text === "Restored." ? (
            <Link href={`/resume/${resumeId}/edit`} className="font-medium underline">
              Open the editor
            </Link>
          ) : null}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="text-[14px] text-[#6B6B6B]">No saved versions yet.</p>
      ) : (
        <ul className="rounded-2xl border border-[#E5E5E2] bg-white">
          {rows.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 border-t border-[#EEEEEB] px-5 py-3.5 first:border-t-0">
              <div className="min-w-0">
                <p className="truncate text-[15px]">{s.label ?? "Saved version"}</p>
                <p className="text-[13px] text-[#6B6B6B]">{fmt(s.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => void restore(s.id)}
                className="h-9 shrink-0 rounded-full border border-[#D9D9D5] px-4 text-[13px] font-medium hover:border-[#111111]"
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
