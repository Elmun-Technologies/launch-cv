"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Badge, pillWhite, toolCard, toolH2 } from "@/components/app/tools/tool-ui";

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
    <div className="flex flex-col gap-4">
      {msg ? (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 text-[14px] leading-[21px] ${msg.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"}`}
        >
          {msg.ok ? (
            <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
          )}
          <p className="min-w-0">
            {msg.text}{" "}
            {msg.ok && msg.text === "Restored." ? (
              <Link href={`/resume/${resumeId}/edit`} className="font-bold underline underline-offset-2">
                Open the editor
              </Link>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="grid items-start gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:gap-5">
        <section className={`${toolCard} order-2 lg:order-1`} aria-labelledby="versions-h">
          <h2 id="versions-h" className={toolH2}>
            Saved versions
          </h2>
          {rows.length === 0 ? (
            <p className="mt-2 text-[14px] text-[#4a4862]">No saved versions yet.</p>
          ) : (
            <ul className="mt-2.5">
              {rows.map((s, i) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[12px_1fr_auto] items-center gap-3.5 border-t border-[#e2e0ea] py-4 sm:grid-cols-[24px_1fr_auto] sm:gap-[18px] sm:py-[18px]"
                >
                  <span aria-hidden="true" className={`h-3 w-3 rounded-full sm:ml-1.5 ${i === 0 ? "bg-[#5440e8]" : "bg-[#c9c7d8]"}`} />
                  <div className="min-w-0">
                    <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <b className="min-w-0 truncate text-[15px] sm:text-[16px]">{s.label ?? "Saved version"}</b>
                      {i === 0 ? <Badge tone="lilac">Latest</Badge> : null}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#66647c]">{fmt(s.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void restore(s.id)}
                    className={pillWhite}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form onSubmit={save} className="order-1 rounded-[22px] bg-[#5440e8] p-[18px] text-white sm:rounded-[26px] sm:p-6 lg:order-2">
          <h2 className="text-[19px] font-extrabold sm:text-[20px]">Save this version</h2>
          <label htmlFor="version-name" className="mt-1.5 block text-[14px] text-[#e4dfff]">
            Name it after the job you’re sending it to.
          </label>
          <input
            id="version-name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={120}
            placeholder="e.g. Northwind — Senior PM"
            className="mt-3.5 block h-12 w-full rounded-[14px] bg-white px-4 text-[16px] text-[#121226] outline-none placeholder:text-[#706e88] focus:ring-4 focus:ring-white/40 focus-visible:outline-none! sm:text-[15px]"
          />
          <button
            type="submit"
            disabled={saving}
            className="lc-btn-lift mt-2.5 inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-white px-[26px] text-[16px] font-semibold text-[#121226] hover:bg-[#f1eff8] focus-visible:outline-white! disabled:pointer-events-none disabled:opacity-60 motion-reduce:transform-none"
          >
            {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
            Save current version
          </button>
          <p className="mt-3 text-[12px] leading-[18px] text-[#e4dfff]">Restoring a version replaces the current resume. Save first if you want to keep it.</p>
        </form>
      </div>
    </div>
  );
}
