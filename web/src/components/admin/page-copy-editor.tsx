"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";

export type PageCopyEditorProps = {
  pageKey: string;
  label: string;
  description: string;
  initialJson: string;
};

export function PageCopyEditor({ pageKey, label, description, initialJson }: PageCopyEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialJson);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : "parse error"}`);
      return;
    }

    startSaving(async () => {
      const res = await fetch(`/api/admin-panel/cms/pages/${encodeURIComponent(pageKey)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: parsed }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(j.error ?? "Save failed");
        return;
      }
      setSavedAt(new Date());
      router.refresh();
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/admin-panel/cms/pages"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#FAFBFC] hover:text-[#0F172A]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">{label}</h1>
            <p className="mt-1 font-mono text-[12px] text-[#94A3B8]">{pageKey}</p>
            {savedAt ? (
              <p className="mt-1 inline-flex items-center gap-1 text-[12px] text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> Saved at {savedAt.toLocaleTimeString()}
              </p>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
      </div>

      <p className="text-[13px] leading-[1.6] text-[#475569]">{description}</p>

      {error ? (
        <p className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-[13px] text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      ) : null}

      <SectionCard
        title="JSON content"
        description="Structured copy as JSON. Keys are consumed by the public page at render time."
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="block min-h-[420px] w-full resize-y rounded-lg border border-[#E2E8F0] bg-white p-4 font-mono text-[13px] leading-[1.65] text-[#0F172A] outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15"
        />
      </SectionCard>
    </div>
  );
}
