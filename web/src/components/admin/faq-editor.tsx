"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/form-field";
import { SectionCard } from "@/components/admin/section-card";

export type FaqEditorData = {
  id: string | null;
  question: string;
  answer: string;
  placement: string;
  order: number;
  published: boolean;
};

const PLACEMENTS = [
  { value: "pricing", label: "Pricing page" },
  { value: "home", label: "Home FAQ section" },
  { value: "features/jd-alignment", label: "Features · JD Alignment" },
  { value: "features/resume-builder", label: "Features · Resume Builder" },
  { value: "features/cover-letter", label: "Features · Cover Letter" },
  { value: "features/interview-prep", label: "Features · Interview Prep" },
  { value: "features/ats-score", label: "Features · ATS Score" },
  { value: "features/voice-input", label: "Features · Voice Input" },
];

export function FaqEditor({ initial }: { initial: FaqEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<FaqEditorData>(initial);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isNew = data.id === null;
  function update<K extends keyof FaqEditorData>(key: K, value: FaqEditorData[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    setError(null);
    startSaving(async () => {
      const url = isNew ? "/api/admin-panel/cms/faqs" : `/api/admin-panel/cms/faqs/${data.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = (await res.json()) as { faq?: { id: string }; error?: string };
      if (!res.ok) {
        setError(j.error ?? "Save failed");
        return;
      }
      if (isNew && j.faq) router.push(`/admin-panel/cms/faqs/${j.faq.id}`);
      else router.refresh();
    });
  }

  async function destroy() {
    if (!data.id) return;
    if (!confirm("Delete this FAQ?")) return;
    startDeleting(async () => {
      const res = await fetch(`/api/admin-panel/cms/faqs/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin-panel/cms/faqs");
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/admin-panel/cms/faqs"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#FAFBFC] hover:text-[#0F172A]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">
              {isNew ? "New FAQ" : data.question || "Untitled"}
            </h1>
            <p className="mt-1 font-mono text-[12px] text-[#94A3B8]">{data.placement || "—"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isNew ? "Create" : "Save"}
        </button>
      </div>

      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-[13px] text-red-700">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <SectionCard>
            <div className="space-y-3">
              <FormField label="Question" required>
                <AdminInput value={data.question} onChange={(e) => update("question", e.target.value)} placeholder="Is there a free tier?" />
              </FormField>
              <FormField label="Answer" required hint="Markdown is rendered on the public page">
                <AdminTextarea rows={6} value={data.answer} onChange={(e) => update("answer", e.target.value)} placeholder="No. Launch CV is a professional product…" />
              </FormField>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Placement">
            <div className="space-y-3">
              <FormField label="Page" required>
                <AdminSelect value={data.placement} onChange={(e) => update("placement", e.target.value)}>
                  <option value="">— select —</option>
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </AdminSelect>
              </FormField>
              <FormField label="Order" hint="Lower numbers appear first">
                <AdminInput type="number" value={data.order} onChange={(e) => update("order", Number(e.target.value) || 0)} />
              </FormField>
              <FormField label="Status">
                <AdminSelect value={data.published ? "published" : "hidden"} onChange={(e) => update("published", e.target.value === "published")}>
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </AdminSelect>
              </FormField>
            </div>
          </SectionCard>

          {!isNew ? (
            <section className="overflow-hidden rounded-xl border border-red-200 bg-white">
              <header className="border-b border-red-200 bg-red-50/40 px-5 py-3">
                <h2 className="text-[13px] font-semibold text-red-800">Danger zone</h2>
              </header>
              <div className="p-5">
                <button
                  type="button"
                  onClick={destroy}
                  disabled={deleting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-[13px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete FAQ
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
