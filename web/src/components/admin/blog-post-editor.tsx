"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import {
  CmsBadge,
  CmsCard,
  CmsEditorHeader,
  CmsField,
  CmsNotice,
  blogStatusBadge,
  charCounterTone,
  cmsBtnDanger,
  cmsBtnDark,
  cmsBtnPrimary,
  cmsBtnSoft,
  cmsBtnWhite,
  cmsInputCls,
  cmsSelectCls,
  cmsTextareaCls,
} from "@/components/admin/cms-ui";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SeoChecklist } from "@/components/admin/seo-checklist";

export type BlogEditorData = {
  id: string | null;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: number;
  authorName: string;
  authorRole: string;
  authorBio: string;
  bodyMd: string;
  coverUrl: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
  focusKeyword: string;
  status: "draft" | "scheduled" | "published" | "archived";
  scheduledFor: string;
};

const CATEGORIES = ["Resume Tips", "Cover Letters", "Interview Prep", "Job Search"];

export function BlogPostEditor({ initial }: { initial: BlogEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<BlogEditorData>(initial);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isNew = data.id === null;

  function update<K extends keyof BlogEditorData>(key: K, value: BlogEditorData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      slug: data.slug || undefined,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      readingTime: data.readingTime,
      authorName: data.authorName,
      authorRole: data.authorRole || null,
      authorBio: data.authorBio || null,
      bodyMd: data.bodyMd,
      coverUrl: data.coverUrl || null,
      coverAlt: data.coverAlt || null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      ogImageUrl: data.ogImageUrl || null,
      canonicalUrl: data.canonicalUrl || null,
      focusKeyword: data.focusKeyword || null,
    };
    if (!isNew) {
      payload.status = data.status;
      if (data.status === "scheduled") payload.scheduledFor = data.scheduledFor;
    }
    return payload;
  }

  async function save() {
    setError(null);
    startSaving(async () => {
      try {
        if (isNew) {
          const res = await fetch("/api/admin-panel/cms/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildPayload()),
          });
          const json = (await res.json()) as { post?: { id: string }; error?: string };
          if (!res.ok || !json.post) {
            setError(json.error ?? "Failed to create post");
            return;
          }
          setSavedAt(new Date());
          router.push(`/admin-panel/cms/blog/${json.post.id}`);
        } else {
          const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildPayload()),
          });
          const json = (await res.json()) as { error?: string };
          if (!res.ok) {
            setError(json.error ?? "Failed to save");
            return;
          }
          setSavedAt(new Date());
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  async function changeStatus(next: BlogEditorData["status"]) {
    if (isNew) {
      setError("Save the post first before changing status.");
      return;
    }
    update("status", next);
    setError(null);
    startSaving(async () => {
      const body: Record<string, unknown> = { status: next };
      if (next === "scheduled") body.scheduledFor = data.scheduledFor;
      const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Failed to update status");
        return;
      }
      setSavedAt(new Date());
      router.refresh();
    });
  }

  async function destroy() {
    if (!data.id) return;
    if (!confirm("Delete this post permanently?")) return;
    startDeleting(async () => {
      const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin-panel/cms/blog");
      else setError("Failed to delete");
    });
  }

  async function openPreview() {
    if (!data.id) {
      setError("Save the post first before previewing.");
      return;
    }
    setPreviewLoading(true);
    try {
      const res = await fetch(`/api/admin-panel/cms/blog/${data.id}/preview-token`);
      const json = (await res.json()) as { path?: string; error?: string };
      if (!res.ok || !json.path) {
        setError(json.error ?? "Preview unavailable");
        return;
      }
      window.open(json.path, "_blank", "noopener,noreferrer");
    } finally {
      setPreviewLoading(false);
    }
  }

  const badge = blogStatusBadge(data.status);
  const seoTitleLen = data.seoTitle.length;
  const seoDescLen = data.seoDescription.length;
  const serpTitle = data.seoTitle || data.title || "Post title";
  const serpDesc = data.seoDescription || data.description || "The meta description appears here.";
  const showPublish = !isNew && data.status !== "published";

  return (
    <div className="pb-16">
      <CmsEditorHeader
        back={{ href: "/admin-panel/cms/blog", label: "Blog posts" }}
        title={isNew ? "New post" : "Edit post"}
        meta={
          <>
            <CmsBadge tone={badge.tone}>{badge.label}</CmsBadge>
            <span role="status" className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0b7a4f]">
              {savedAt ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Saved
                </>
              ) : null}
            </span>
          </>
        }
        actions={
          <>
            {!isNew ? (
              <button type="button" onClick={openPreview} disabled={previewLoading} className={cmsBtnWhite}>
                {previewLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                Preview
                <span className="sr-only"> (opens in a new tab)</span>
              </button>
            ) : null}
            <button type="button" onClick={save} disabled={saving} className={showPublish ? cmsBtnDark : cmsBtnPrimary}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isNew ? "Create draft" : "Save"}
            </button>
            {showPublish ? (
              <button type="button" onClick={() => changeStatus("published")} disabled={saving} className={cmsBtnPrimary}>
                Publish
              </button>
            ) : null}
          </>
        }
      />

      {error ? (
        <div className="mt-4">
          <CmsNotice tone="error">{error}</CmsNotice>
        </div>
      ) : null}

      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        {/* Main editor column */}
        <CmsCard padding="p-4 sm:p-7">
          <div className="flex flex-col gap-4">
            <CmsField label="Title" required>
              <input
                value={data.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="The article headline"
                className="block w-full rounded-[14px] border-[1.5px] border-transparent bg-white px-3 py-1.5 text-[26px] font-extrabold leading-[32px] tracking-[-0.02em] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#9a98b0] hover:border-[#e2e0ea] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[32px] sm:leading-[38px]"
              />
            </CmsField>
            <CmsField
              label="Short description"
              required
              counter={`${data.description.length}/180`}
              counterTone={charCounterTone(data.description.length, { max: 180 })}
              hint="Shown on /blog and used as the meta description unless you set one under SEO."
            >
              <textarea
                rows={2}
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="One- or two-sentence summary"
                className={cmsTextareaCls}
              />
            </CmsField>
            <div>
              <p className="text-[13px] font-bold text-[#4a4862]">Body</p>
              <p className="mt-0.5 text-[12px] text-[#66647c]">Markdown supported (GFM extensions, images via the Image button).</p>
              <div className="mt-2">
                <MarkdownEditor value={data.bodyMd} onChange={(v) => update("bodyMd", v)} />
              </div>
            </div>
          </div>
        </CmsCard>

        {/* Sidebar — stacks below the editor on smaller screens */}
        <div className="flex min-w-0 flex-col gap-3.5">
          <CmsCard title="SEO" description="Overrides the defaults taken from the title and description.">
            <div className="flex flex-col gap-3">
              <CmsField label="Focus keyword" hint="The primary term this post should rank for.">
                <input
                  value={data.focusKeyword}
                  onChange={(e) => update("focusKeyword", e.target.value)}
                  placeholder="e.g. ATS resume format"
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField
                label="SEO title"
                counter={`${seoTitleLen}/60`}
                counterTone={charCounterTone(seoTitleLen, { max: 60 })}
                hint="Recommended 60 characters or fewer."
              >
                <input
                  value={data.seoTitle}
                  onChange={(e) => update("seoTitle", e.target.value)}
                  placeholder={data.title || "Defaults to the post title"}
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField
                label="Meta description"
                counter={`${seoDescLen}/160`}
                counterTone={charCounterTone(seoDescLen, { min: 120, max: 160 })}
                hint="Recommended 120–160 characters."
              >
                <textarea
                  rows={3}
                  value={data.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  placeholder={data.description || "Defaults to the short description"}
                  className={cmsTextareaCls}
                />
              </CmsField>
              <CmsField label="Slug" hint="Lowercase, hyphens. Leave blank to auto-generate from the title.">
                <span className="flex h-12 items-center overflow-hidden rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white transition-[border-color,box-shadow] focus-within:border-[#5440e8] focus-within:ring-4 focus-within:ring-[#5440e8]/15 hover:border-[#c9c0ff]">
                  <span aria-hidden="true" className="lc-mono shrink-0 pl-4 text-[13px] text-[#66647c]">
                    /blog/
                  </span>
                  <input
                    value={data.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="my-new-post"
                    className="lc-mono h-full min-w-0 flex-1 bg-transparent pr-4 text-[16px] text-[#121226] outline-none placeholder:text-[#706e88] focus-visible:outline-none! sm:text-[13px]"
                  />
                </span>
              </CmsField>

              <figure aria-label="Search result preview" className="m-0 rounded-[14px] bg-[#f7f6fb] p-3.5">
                <p className="truncate text-[12px] text-[#0b7a4f]">launch-cv.com › blog › {data.slug || "auto-generated-slug"}</p>
                <p className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-[21px] text-[#3a2bb8] [overflow-wrap:anywhere]">{serpTitle}</p>
                <p className="mt-0.5 line-clamp-2 text-[12px] leading-[17px] text-[#4a4862] [overflow-wrap:anywhere]">{serpDesc}</p>
              </figure>

              <div className="rounded-[14px] border-[1.5px] border-[#efedf7] p-3.5">
                <SeoChecklist
                  focusKeyword={data.focusKeyword}
                  title={data.seoTitle || data.title}
                  metaDescription={data.seoDescription || data.description}
                  slug={data.slug}
                  bodyMd={data.bodyMd}
                />
              </div>

              <CmsField label="Canonical URL" hint="Optional — defaults to this post's own URL.">
                <input
                  value={data.canonicalUrl}
                  onChange={(e) => update("canonicalUrl", e.target.value)}
                  placeholder="https://launch-cv.com/blog/…"
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Open Graph image" hint="Shown when the post is shared on social or in search." group={{ id: "blog-og-image" }}>
                <ImageUploadField value={data.ogImageUrl} onChange={(v) => update("ogImageUrl", v)} alt={data.title} />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard title="Publishing">
            {isNew ? (
              <p className="rounded-[14px] bg-[#f7f6fb] px-3.5 py-3 text-[13px] leading-5 text-[#4a4862]">
                Save to create the post as a draft. You can then publish or schedule it.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => changeStatus("draft")}
                    disabled={saving || data.status === "draft"}
                    className={cmsBtnSoft}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus("published")}
                    disabled={saving || data.status === "published"}
                    className={cmsBtnPrimary}
                  >
                    Publish
                  </button>
                </div>
                <div className="border-t border-[#e2e0ea] pt-3">
                  <CmsField label="Schedule for" hint="Auto-publishes when the time passes.">
                    <input
                      type="datetime-local"
                      value={data.scheduledFor}
                      onChange={(e) => update("scheduledFor", e.target.value)}
                      className={cmsInputCls}
                    />
                  </CmsField>
                  <button
                    type="button"
                    onClick={() => changeStatus("scheduled")}
                    disabled={saving || !data.scheduledFor || data.status === "scheduled"}
                    className={`${cmsBtnSoft} mt-2 w-full`}
                  >
                    Schedule
                  </button>
                </div>
                <div className="border-t border-[#e2e0ea] pt-3">
                  <button
                    type="button"
                    onClick={() => changeStatus("archived")}
                    disabled={saving || data.status === "archived"}
                    className={`${cmsBtnSoft} w-full`}
                  >
                    Archive
                  </button>
                </div>
              </div>
            )}
          </CmsCard>

          <CmsCard title="Details">
            <div className="flex flex-col gap-3">
              <CmsField label="Category">
                <select value={data.category} onChange={(e) => update("category", e.target.value)} className={cmsSelectCls}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </CmsField>
              <CmsField label="Tags" hint="Comma-separated.">
                <input
                  value={data.tags.join(", ")}
                  onChange={(e) =>
                    update(
                      "tags",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="resume, ATS, career"
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Reading time" hint="Minutes.">
                <input
                  type="number"
                  min={1}
                  value={data.readingTime}
                  onChange={(e) => update("readingTime", Number(e.target.value) || 1)}
                  className={cmsInputCls}
                />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard title="Author">
            <div className="flex flex-col gap-3">
              <CmsField label="Display name">
                <input value={data.authorName} onChange={(e) => update("authorName", e.target.value)} className={cmsInputCls} />
              </CmsField>
              <CmsField label="Role / byline">
                <input
                  value={data.authorRole}
                  onChange={(e) => update("authorRole", e.target.value)}
                  placeholder="Career Research Team"
                  className={cmsInputCls}
                />
              </CmsField>
              <CmsField label="Bio">
                <textarea rows={3} value={data.authorBio} onChange={(e) => update("authorBio", e.target.value)} className={cmsTextareaCls} />
              </CmsField>
            </div>
          </CmsCard>

          <CmsCard title="Cover image">
            <div className="flex flex-col gap-3">
              <CmsField label="Image" hint="Optional — falls back to the category gradient." group={{ id: "blog-cover-image" }}>
                <ImageUploadField value={data.coverUrl} onChange={(v) => update("coverUrl", v)} alt={data.coverAlt || data.title} />
              </CmsField>
              <CmsField label="Cover alt text">
                <input value={data.coverAlt} onChange={(e) => update("coverAlt", e.target.value)} className={cmsInputCls} />
              </CmsField>
            </div>
          </CmsCard>

          {!isNew ? (
            <CmsCard title="Danger zone" description="Deleting a post can't be undone.">
              <button type="button" onClick={destroy} disabled={deleting} className={`${cmsBtnDanger} w-full`}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                {deleting ? "Deleting…" : "Delete post"}
              </button>
            </CmsCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
