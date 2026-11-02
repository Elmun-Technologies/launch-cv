"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import {
  CmsCard,
  CmsEditorHeader,
  CmsField,
  CmsNotice,
  VisibilityBadge,
  cmsBtnDanger,
  cmsBtnPrimary,
  cmsInputCls,
  cmsSelectCls,
  cmsTextareaCls,
} from "@/components/admin/cms-ui";
import { FAQ_PLACEMENTS as PLACEMENTS } from "@/components/admin/cms-placements";

export type FaqEditorData = {
  id: string | null;
  question: string;
  answer: string;
  placement: string;
  order: number;
  published: boolean;
};

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
    <div className="pb-16">
      <CmsEditorHeader
        back={{ href: "/admin-panel/cms/faqs", label: "FAQs" }}
        title={isNew ? "New FAQ" : "Edit FAQ"}
        meta={<VisibilityBadge published={data.published} />}
        actions={
          <button type="button" onClick={save} disabled={saving} className={cmsBtnPrimary}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isNew ? "Create FAQ" : "Save"}
          </button>
        }
      />

      {error ? (
        <div className="mt-4">
          <CmsNotice tone="error">{error}</CmsNotice>
        </div>
      ) : null}

      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <CmsCard padding="p-4 sm:p-7">
          <div className="flex flex-col gap-4">
            <CmsField label="Question" required>
              <input
                value={data.question}
                onChange={(e) => update("question", e.target.value)}
                placeholder="Is there a free tier?"
                className={cmsInputCls}
              />
            </CmsField>
            <CmsField label="Answer" required hint="Markdown is rendered on the public page.">
              <textarea
                rows={8}
                value={data.answer}
                onChange={(e) => update("answer", e.target.value)}
                placeholder="No. LaunchCV is a professional product…"
                className={cmsTextareaCls}
              />
            </CmsField>
          </div>
        </CmsCard>

        <div className="flex min-w-0 flex-col gap-3.5">
          <CmsCard title="Placement">
            <div className="flex flex-col gap-3">
              <CmsField label="Page" required>
                <select value={data.placement} onChange={(e) => update("placement", e.target.value)} className={cmsSelectCls}>
                  <option value="">— select —</option>
                  {PLACEMENTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </CmsField>
              <CmsField label="Order" hint="Lower numbers appear first.">
                <input
                  type="number"
                  value={data.order}
                  onChange={(e) => update("order", Number(e.target.value) || 0)}
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Status">
                <select
                  value={data.published ? "published" : "hidden"}
                  onChange={(e) => update("published", e.target.value === "published")}
                  className={cmsSelectCls}
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </CmsField>
            </div>
          </CmsCard>

          {!isNew ? (
            <CmsCard title="Danger zone" description="Deleting an FAQ can't be undone.">
              <button type="button" onClick={destroy} disabled={deleting} className={`${cmsBtnDanger} w-full`}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                Delete FAQ
              </button>
            </CmsCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
