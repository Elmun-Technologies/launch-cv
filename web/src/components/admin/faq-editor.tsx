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
  placements: string[];
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

  function togglePlacement(value: string) {
    setData((p) => ({
      ...p,
      placements: p.placements.includes(value) ? p.placements.filter((x) => x !== value) : [...p.placements, value],
    }));
  }

  async function save() {
    setError(null);
    if (!data.placements.length) {
      setError("Pick at least one page for this FAQ.");
      return;
    }
    startSaving(async () => {
      const url = isNew ? "/api/admin-panel/cms/faqs" : `/api/admin-panel/cms/faqs/${data.id}`;
      const method = isNew ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: data.question,
          answer: data.answer,
          placements: data.placements,
          published: data.published,
        }),
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
          <CmsCard title="Placement" description="Pick every page this question should appear on.">
            <fieldset>
              <legend className="sr-only">Pages</legend>
              <div className="flex flex-col gap-2">
                {PLACEMENTS.map((p) => {
                  const checked = data.placements.includes(p.value);
                  return (
                    <label
                      key={p.value}
                      className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[14px] border-[1.5px] px-3.5 py-2 text-[14px] font-semibold transition-colors focus-within:ring-4 focus-within:ring-[#5440e8]/15 ${
                        checked
                          ? "border-[#5440e8] bg-[#f1eff8] text-[#121226]"
                          : "border-[#e2e0ea] bg-white text-[#4a4862] hover:border-[#c9c0ff]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePlacement(p.value)}
                        className="h-4 w-4 shrink-0 accent-[#5440e8]"
                      />
                      {p.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <p className="mt-3 text-[12px] leading-[18px] text-[#66647c]">
              To change the order, drag the question on the FAQs list.
            </p>
          </CmsCard>

          <CmsCard title="Visibility">
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
