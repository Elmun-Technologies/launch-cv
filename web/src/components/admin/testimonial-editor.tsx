"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/form-field";
import { SectionCard } from "@/components/admin/section-card";

export type TestimonialEditorData = {
  id: string | null;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  quote: string;
  rating: number | "";
  placement: string[];
  order: number;
  published: boolean;
};

const PLACEMENT_OPTIONS = [
  { value: "home", label: "Home page" },
  { value: "features/jd-alignment", label: "Features · JD Alignment" },
  { value: "features/resume-builder", label: "Features · Resume Builder" },
  { value: "features/cover-letter", label: "Features · Cover Letter" },
  { value: "features/interview-prep", label: "Features · Interview Prep" },
  { value: "features/ats-score", label: "Features · ATS Score" },
  { value: "features/voice-input", label: "Features · Voice Input" },
];

export function TestimonialEditor({ initial }: { initial: TestimonialEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<TestimonialEditorData>(initial);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isNew = data.id === null;
  function update<K extends keyof TestimonialEditorData>(key: K, value: TestimonialEditorData[K]) {
    setData((p) => ({ ...p, [key]: value }));
  }

  function togglePlacement(p: string) {
    update("placement", data.placement.includes(p) ? data.placement.filter((x) => x !== p) : [...data.placement, p]);
  }

  function payload() {
    return {
      authorName: data.authorName,
      authorRole: data.authorRole || null,
      authorAvatarUrl: data.authorAvatarUrl || null,
      quote: data.quote,
      rating: data.rating === "" ? null : Number(data.rating),
      placement: data.placement,
      order: data.order,
      published: data.published,
    };
  }

  async function save() {
    setError(null);
    startSaving(async () => {
      try {
        if (isNew) {
          const res = await fetch("/api/admin-panel/cms/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload()),
          });
          const j = (await res.json()) as { testimonial?: { id: string }; error?: string };
          if (!res.ok || !j.testimonial) {
            setError(j.error ?? "Failed to create");
            return;
          }
          router.push(`/admin-panel/cms/testimonials/${j.testimonial.id}`);
        } else {
          const res = await fetch(`/api/admin-panel/cms/testimonials/${data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload()),
          });
          const j = (await res.json()) as { error?: string };
          if (!res.ok) {
            setError(j.error ?? "Failed to save");
            return;
          }
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  async function destroy() {
    if (!data.id) return;
    if (!confirm("Delete this testimonial?")) return;
    startDeleting(async () => {
      const res = await fetch(`/api/admin-panel/cms/testimonials/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin-panel/cms/testimonials");
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/admin-panel/cms/testimonials"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#FAFBFC] hover:text-[#0F172A]"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">
              {isNew ? "New testimonial" : data.authorName || "Untitled"}
            </h1>
            <p className="mt-1 text-[12px] text-[#64748B]">
              {data.published ? "Published" : "Hidden"} · Order {data.order}
            </p>
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
          <SectionCard title="Quote">
            <div className="space-y-3">
              <FormField label="Quote" required hint="Without surrounding quotation marks">
                <AdminTextarea
                  rows={4}
                  value={data.quote}
                  onChange={(e) => update("quote", e.target.value)}
                  placeholder="ATS score went from 38 to 93. Three offers in two weeks."
                />
              </FormField>
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField label="Author name" required>
                  <AdminInput value={data.authorName} onChange={(e) => update("authorName", e.target.value)} placeholder="Marcus T." />
                </FormField>
                <FormField label="Author role / company">
                  <AdminInput value={data.authorRole} onChange={(e) => update("authorRole", e.target.value)} placeholder="Product Manager at Notion" />
                </FormField>
              </div>
              <FormField label="Avatar URL" hint="Optional — uploaded image or external URL">
                <AdminInput value={data.authorAvatarUrl} onChange={(e) => update("authorAvatarUrl", e.target.value)} placeholder="/uploads/cms/…" />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Placement" description="Where this testimonial should appear">
            <div className="grid grid-cols-2 gap-2">
              {PLACEMENT_OPTIONS.map((p) => {
                const checked = data.placement.includes(p.value);
                return (
                  <label
                    key={p.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition ${
                      checked ? "border-[#1A56DB] bg-[#EFF6FF] text-[#0F172A]" : "border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#FAFBFC]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlacement(p.value)}
                      className="h-3.5 w-3.5"
                    />
                    {p.label}
                  </label>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Visibility">
            <div className="space-y-3">
              <FormField label="Status">
                <AdminSelect
                  value={data.published ? "published" : "hidden"}
                  onChange={(e) => update("published", e.target.value === "published")}
                >
                  <option value="published">Published (visible)</option>
                  <option value="hidden">Hidden</option>
                </AdminSelect>
              </FormField>
              <FormField label="Display order" hint="Lower numbers appear first">
                <AdminInput
                  type="number"
                  value={data.order}
                  onChange={(e) => update("order", Number(e.target.value) || 0)}
                />
              </FormField>
              <FormField label="Star rating" hint="1–5, or blank to omit stars">
                <AdminInput
                  type="number"
                  min={1}
                  max={5}
                  value={data.rating}
                  onChange={(e) => update("rating", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="5"
                />
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
                  Delete testimonial
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
