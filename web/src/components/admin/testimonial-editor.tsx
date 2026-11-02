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
import { TESTIMONIAL_PLACEMENTS as PLACEMENT_OPTIONS } from "@/components/admin/cms-placements";

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
  /** YYYY-MM-DD, or "" when no permission is on file. */
  permissionDate: string;
  source: string;
};

/** Mirrors testimonialPublishProblems() in lib/cms/testimonials.ts (the API enforces it). */
function missingForPublish(d: TestimonialEditorData): string[] {
  const out: string[] = [];
  if (!d.authorName.trim()) out.push("author name");
  if (!d.quote.trim()) out.push("quote");
  if (!d.permissionDate) out.push("permission date");
  if (!d.source.trim()) out.push("source");
  return out;
}

export function TestimonialEditor({ initial }: { initial: TestimonialEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<TestimonialEditorData>(initial);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isNew = data.id === null;
  const today = new Date().toISOString().slice(0, 10);
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
      permissionDate: data.permissionDate || null,
      source: data.source.trim() || null,
    };
  }

  const missing = missingForPublish(data);

  async function save() {
    setError(null);
    if (data.published && missing.length) {
      setError(`Can't publish without: ${missing.join(", ")}. Add them, or set the status to Hidden.`);
      return;
    }
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
    <div className="pb-16">
      <CmsEditorHeader
        back={{ href: "/admin-panel/cms/testimonials", label: "Testimonials" }}
        title={isNew ? "New testimonial" : "Edit testimonial"}
        meta={
          <>
            <VisibilityBadge published={data.published} />
            <span className="text-[13px] text-[#66647c]">Order {data.order}</span>
          </>
        }
        actions={
          <button type="button" onClick={save} disabled={saving} className={cmsBtnPrimary}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isNew ? "Create testimonial" : "Save"}
          </button>
        }
      />

      {error ? (
        <div className="mt-4">
          <CmsNotice tone="error">{error}</CmsNotice>
        </div>
      ) : null}

      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="flex min-w-0 flex-col gap-3.5">
          <CmsCard title="Quote" padding="p-4 sm:p-7">
            <div className="flex flex-col gap-4">
              <CmsField label="Quote" required hint="Without surrounding quotation marks. Only real quotes you have permission to publish.">
                <textarea
                  rows={4}
                  value={data.quote}
                  onChange={(e) => update("quote", e.target.value)}
                  placeholder="The customer's words, exactly as they wrote them"
                  className={cmsTextareaCls}
                />
              </CmsField>
              <div className="grid gap-4 sm:grid-cols-2">
                <CmsField label="Author name" required>
                  <input
                    value={data.authorName}
                    onChange={(e) => update("authorName", e.target.value)}
                    placeholder="Marcus T."
                    className={cmsInputCls}
                  />
                </CmsField>
                <CmsField label="Author role / company">
                  <input
                    value={data.authorRole}
                    onChange={(e) => update("authorRole", e.target.value)}
                    placeholder="Product Manager at Notion"
                    className={cmsInputCls}
                  />
                </CmsField>
              </div>
              <CmsField label="Avatar URL" hint="Optional — an uploaded image (/media/…) or an external URL.">
                <input
                  value={data.authorAvatarUrl}
                  onChange={(e) => update("authorAvatarUrl", e.target.value)}
                  placeholder="/media/…"
                  className={cmsInputCls}
                />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard
            title="Permission"
            description="Required before publishing. Keep the written permission itself (email, form, review) where you can find it."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <CmsField label="Permission date" hint="The day the author agreed in writing.">
                <input
                  type="date"
                  value={data.permissionDate}
                  max={today}
                  onChange={(e) => update("permissionDate", e.target.value)}
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Source (where they said it)" hint="For example a support email thread, a survey reply or a review link.">
                <input
                  value={data.source}
                  maxLength={300}
                  onChange={(e) => update("source", e.target.value)}
                  className={cmsInputCls}
                />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard title="Placement" description="Where this testimonial should appear.">
            <fieldset>
              <legend className="sr-only">Placement</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PLACEMENT_OPTIONS.map((p) => {
                  const checked = data.placement.includes(p.value);
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
          </CmsCard>
        </div>

        <div className="flex min-w-0 flex-col gap-3.5">
          <CmsCard title="Visibility">
            <div className="flex flex-col gap-3">
              <CmsField
                label="Status"
                hint={
                  missing.length
                    ? `To publish, add: ${missing.join(", ")}.`
                    : "Only published testimonials with permission on file appear on the site."
                }
              >
                <select
                  value={data.published ? "published" : "hidden"}
                  onChange={(e) => update("published", e.target.value === "published")}
                  className={cmsSelectCls}
                >
                  <option value="published" disabled={missing.length > 0 && !data.published}>
                    Published (visible)
                  </option>
                  <option value="hidden">Hidden</option>
                </select>
              </CmsField>
              <CmsField label="Display order" hint="Lower numbers appear first.">
                <input
                  type="number"
                  value={data.order}
                  onChange={(e) => update("order", Number(e.target.value) || 0)}
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Star rating" hint="1–5, or blank to omit stars.">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={data.rating}
                  onChange={(e) => update("rating", e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="5"
                  className={cmsInputCls}
                />
              </CmsField>
            </div>
          </CmsCard>

          {!isNew ? (
            <CmsCard title="Danger zone" description="Deleting a testimonial can't be undone.">
              <button type="button" onClick={destroy} disabled={deleting} className={`${cmsBtnDanger} w-full`}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                Delete testimonial
              </button>
            </CmsCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
