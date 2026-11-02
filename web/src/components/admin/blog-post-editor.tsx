"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, Loader2 } from "lucide-react";
import {
  CmsBadge,
  CmsCard,
  CmsDisclosure,
  CmsEditorHeader,
  CmsField,
  CmsNotice,
  blogStatusBadge,
  charCounterTone,
  cmsBtnDanger,
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

type Status = BlogEditorData["status"];

const CATEGORIES = ["Resume Tips", "Cover Letters", "Interview Prep", "Job Search"];

/** Wait this long after the last keystroke before autosaving a draft. */
const AUTOSAVE_DELAY_MS = 1500;

/** The post's content fields as the API takes them. Never includes status. */
function contentPayload(d: BlogEditorData): Record<string, unknown> {
  return {
    slug: d.slug || undefined,
    title: d.title,
    description: d.description,
    category: d.category,
    tags: d.tags,
    readingTime: d.readingTime,
    authorName: d.authorName,
    authorRole: d.authorRole || null,
    authorBio: d.authorBio || null,
    bodyMd: d.bodyMd,
    coverUrl: d.coverUrl || null,
    coverAlt: d.coverAlt || null,
    seoTitle: d.seoTitle || null,
    seoDescription: d.seoDescription || null,
    ogImageUrl: d.ogImageUrl || null,
    canonicalUrl: d.canonicalUrl || null,
    focusKeyword: d.focusKeyword || null,
  };
}

const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export function BlogPostEditor({ initial }: { initial: BlogEditorData }) {
  const router = useRouter();
  const [data, setData] = useState<BlogEditorData>(initial);
  const [saving, startSaving] = useTransition();
  const [deleting, startDeleting] = useTransition();
  const [previewLoading, setPreviewLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // What the server has: the content payload last saved, as JSON.
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(contentPayload(initial)));
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);
  const busy = useRef(false);

  const isNew = data.id === null;
  const payloadJson = JSON.stringify(contentPayload(data));
  const dirty = payloadJson !== savedJson;
  const isDraft = !isNew && data.status === "draft";

  function update<K extends keyof BlogEditorData>(key: K, value: BlogEditorData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  /** After a save, take the slug the server settled on (it may add a suffix to keep it unique). */
  function adoptServerSlug(post: { slug?: string } | undefined, sentJson: string) {
    const sent = JSON.parse(sentJson) as Record<string, unknown>;
    if (post?.slug && post.slug !== data.slug && sent.slug !== undefined) {
      setData((prev) => ({ ...prev, slug: post.slug! }));
      setSavedJson(JSON.stringify({ ...sent, slug: post.slug }));
    } else {
      setSavedJson(sentJson);
    }
  }

  /* ── Autosave (drafts only) ─────────────────────────────────────────
   * Debounced PATCH with { autosave: true }. The server refuses it unless the
   * post is still a draft and never changes status, so autosave can't publish. */
  const autosave = useCallback(
    async (json: string) => {
      if (!data.id || busy.current) return;
      busy.current = true;
      setAutoSaving(true);
      try {
        const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...(JSON.parse(json) as object), autosave: true }),
        });
        const j = (await res.json().catch(() => ({}))) as { post?: { slug?: string }; error?: string; code?: string };
        if (!res.ok) {
          setAutoError(
            j.code === "not_draft"
              ? "This post is no longer a draft, so autosave is off. Reload to see its status."
              : (j.error ?? "Autosave failed."),
          );
          return;
        }
        setAutoError(null);
        setAutoSavedAt(new Date());
        adoptServerSlug(j.post, json);
      } catch {
        setAutoError("Autosave failed. Check your connection.");
      } finally {
        busy.current = false;
        setAutoSaving(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- adoptServerSlug only reads the latest data.slug
    [data.id, data.slug],
  );

  useEffect(() => {
    if (!isDraft || !dirty || autoError) return;
    const t = setTimeout(() => void autosave(payloadJson), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(t);
  }, [isDraft, dirty, autoError, payloadJson, autosave]);

  // Warn before leaving with changes the server doesn't have yet.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /* ── Manual actions ───────────────────────────────────────────────── */

  async function patch(body: Record<string, unknown>): Promise<{ post?: { slug?: string; status?: string } } | null> {
    const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { post?: { slug?: string; status?: string }; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Save failed");
      return null;
    }
    return json;
  }

  function create() {
    setError(null);
    startSaving(async () => {
      try {
        const res = await fetch("/api/admin-panel/cms/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadJson,
        });
        const json = (await res.json().catch(() => ({}))) as { post?: { id: string }; error?: string };
        if (!res.ok || !json.post) {
          setError(json.error ?? "Failed to create post");
          return;
        }
        setSavedJson(payloadJson);
        router.push(`/admin-panel/cms/blog/${json.post.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  /** Saves content without changing status (published, scheduled and archived posts). */
  function save() {
    setError(null);
    setNotice(null);
    const json = payloadJson;
    busy.current = true;
    startSaving(async () => {
      try {
        const res = await patch(JSON.parse(json) as Record<string, unknown>);
        if (!res) return;
        adoptServerSlug(res.post, json);
        setNotice(`Saved at ${timeFmt.format(new Date())}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        busy.current = false;
      }
    });
  }

  /** Saves the current content and moves the post to `next` in one request. */
  function changeStatus(next: Status) {
    if (isNew) return;
    if (next === "published") {
      const where = data.slug ? `/blog/${data.slug}` : "the blog";
      if (!confirm(`Publish “${data.title || "this post"}”? It goes live at ${where} right away.`)) return;
    } else if (next === "draft" && data.status === "published") {
      if (!confirm("Unpublish this post? It comes off the site and returns to drafts.")) return;
    } else if (next === "archived") {
      if (!confirm("Archive this post? It comes off the site.")) return;
    }
    if (next === "scheduled" && !data.scheduledFor) {
      setError("Pick a date and time to schedule the post.");
      return;
    }
    setError(null);
    setNotice(null);
    const json = payloadJson;
    busy.current = true;
    startSaving(async () => {
      try {
        const body: Record<string, unknown> = { ...(JSON.parse(json) as object), status: next };
        if (next === "scheduled") body.scheduledFor = new Date(data.scheduledFor).toISOString();
        const res = await patch(body);
        if (!res) return;
        adoptServerSlug(res.post, json);
        setAutoError(null);
        update("status", next);
        const done: Record<Status, string> = {
          published: "Published",
          scheduled: "Scheduled",
          draft: "Moved to drafts",
          archived: "Archived",
        };
        setNotice(`${done[next]} at ${timeFmt.format(new Date())}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        busy.current = false;
      }
    });
  }

  function destroy() {
    if (!data.id) return;
    if (!confirm("Delete this post permanently?")) return;
    startDeleting(async () => {
      const res = await fetch(`/api/admin-panel/cms/blog/${data.id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin-panel/cms/blog");
      else setError("Failed to delete");
    });
  }

  async function openPreview() {
    if (!data.id) return;
    setPreviewLoading(true);
    try {
      const res = await fetch(`/api/admin-panel/cms/blog/${data.id}/preview-token`);
      const json = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
      if (!res.ok || !json.path) {
        setError(json.error ?? "Preview unavailable");
        return;
      }
      window.open(json.path, "_blank", "noopener,noreferrer");
    } finally {
      setPreviewLoading(false);
    }
  }

  /* ── Title: grows with its text instead of cutting it off ───────────── */
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    // scrollHeight excludes the border; border-box height needs it added back.
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
  }, [data.title]);

  const badge = blogStatusBadge(data.status);
  const draftState = autoError
    ? { tone: "red" as const, label: "Draft · autosave failed" }
    : autoSaving
      ? { tone: "amber" as const, label: "Draft · saving…" }
      : dirty
        ? { tone: "amber" as const, label: "Draft · unsaved changes" }
        : { tone: "amber" as const, label: "Draft · autosaved" };
  const seoTitleLen = data.seoTitle.length;
  const seoDescLen = data.seoDescription.length;
  const serpTitle = data.seoTitle || data.title || "Post title";
  const serpDesc = data.seoDescription || data.description || "The meta description appears here.";
  const canPublish = !isNew && data.status !== "published";

  return (
    <div className="pb-16">
      <CmsEditorHeader
        back={{ href: "/admin-panel/cms/blog", label: "Blog posts" }}
        title={isNew ? "New post" : "Edit post"}
        meta={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="sr-only" aria-live="polite">
              {autoError ? "Autosave failed." : isDraft && autoSavedAt && !dirty && !autoSaving ? `Draft autosaved at ${timeFmt.format(autoSavedAt)}.` : ""}
            </span>
            {isDraft ? <CmsBadge tone={draftState.tone}>{draftState.label}</CmsBadge> : <CmsBadge tone={badge.tone}>{badge.label}</CmsBadge>}
            {isDraft && autoSavedAt && !dirty && !autoError ? (
              <span className="text-[12px] font-semibold text-[#66647c]">{timeFmt.format(autoSavedAt)}</span>
            ) : null}
            {!isDraft && !isNew && dirty ? <span className="text-[12px] font-semibold text-[#a15c00]">Unsaved changes</span> : null}
          </span>
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
            {isNew ? (
              <button type="button" onClick={create} disabled={saving} className={cmsBtnPrimary}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Create draft
              </button>
            ) : null}
            {!isNew && data.status !== "draft" ? (
              <button type="button" onClick={save} disabled={saving} className={data.status === "published" ? cmsBtnPrimary : cmsBtnWhite}>
                {saving && data.status === "published" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {data.status === "published" ? "Save changes" : "Save"}
              </button>
            ) : null}
            {canPublish ? (
              <button type="button" onClick={() => changeStatus("published")} disabled={saving} className={cmsBtnPrimary}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
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
      {autoError ? (
        <div className="mt-4">
          <CmsNotice tone="error">
            {autoError}{" "}
            <button
              type="button"
              onClick={() => {
                setAutoError(null);
                void autosave(payloadJson);
              }}
              className="font-bold underline underline-offset-2"
            >
              Try again
            </button>
          </CmsNotice>
        </div>
      ) : null}
      {notice ? (
        <div className="mt-4">
          <CmsNotice tone="success">{notice}</CmsNotice>
        </div>
      ) : null}

      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        {/* Main editor column */}
        <CmsCard padding="p-4 sm:p-7">
          <div className="flex flex-col gap-4">
            <CmsField label="Title" required>
              <textarea
                ref={titleRef}
                rows={1}
                value={data.title}
                onChange={(e) => update("title", e.target.value.replace(/\s*\n+\s*/g, " "))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                placeholder="The article headline"
                className="block w-full resize-none overflow-hidden rounded-[14px] border-[1.5px] border-transparent bg-white px-3 py-1.5 text-[26px] font-extrabold leading-[32px] tracking-[-0.02em] text-[#121226] outline-none transition-[border-color,box-shadow] [field-sizing:content] placeholder:text-[#9a98b0] hover:border-[#e2e0ea] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[32px] sm:leading-[38px]"
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
                rows={3}
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="One- or two-sentence summary"
                className={cmsTextareaCls}
              />
            </CmsField>
            <div>
              <p className="text-[13px] font-bold text-[#4a4862]">Body</p>
              <p className="mt-0.5 text-[12px] text-[#66647c]">
                Markdown, with the rendered article beside it in Split view. Use H2 and H3 for headings and Image to upload.
              </p>
              <div className="mt-2">
                <MarkdownEditor value={data.bodyMd} onChange={(v) => update("bodyMd", v)} />
              </div>
            </div>
          </div>
        </CmsCard>

        {/* Sidebar: collapsible sections so it stays about as tall as the editor */}
        <div className="flex min-w-0 flex-col gap-3">
          <CmsDisclosure title="SEO" defaultOpen meta={`${seoTitleLen || serpTitle.length}/60`}>
            <div className="flex flex-col gap-3">
              <CmsField
                label="SEO title"
                counter={`${seoTitleLen}/60`}
                counterTone={charCounterTone(seoTitleLen, { max: 60 })}
                hint="Defaults to the post title. Keep it 60 characters or fewer."
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
                  rows={4}
                  value={data.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  placeholder={data.description || "Defaults to the short description"}
                  className={cmsTextareaCls}
                />
              </CmsField>
              <CmsField label="Slug" hint="Lowercase, hyphens. Leave blank to generate it from the title.">
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
            </div>
          </CmsDisclosure>

          <CmsDisclosure title="Focus keyword & checks" meta={data.focusKeyword || "Not set"}>
            <div className="flex flex-col gap-3">
              <CmsField label="Focus keyword" hint="The primary term this post should rank for.">
                <input
                  value={data.focusKeyword}
                  onChange={(e) => update("focusKeyword", e.target.value)}
                  placeholder="e.g. ATS resume format"
                  className={cmsInputCls}
                />
              </CmsField>
              <div className="rounded-[14px] border-[1.5px] border-[#efedf7] p-3.5">
                <SeoChecklist
                  focusKeyword={data.focusKeyword}
                  title={data.seoTitle || data.title}
                  metaDescription={data.seoDescription || data.description}
                  slug={data.slug}
                  bodyMd={data.bodyMd}
                />
              </div>
            </div>
          </CmsDisclosure>

          <CmsDisclosure
            title="Status & schedule"
            meta={isNew ? "New draft" : data.status === "scheduled" && data.scheduledFor ? `Scheduled` : badge.label}
          >
            {isNew ? (
              <p className="rounded-[14px] bg-[#f7f6fb] px-3.5 py-3 text-[13px] leading-5 text-[#4a4862]">
                Create the draft first. Drafts autosave as you type; publish or schedule when it&apos;s ready.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <CmsField label="Schedule for" hint="Publishes automatically at this time (your time zone).">
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
                  disabled={saving || !data.scheduledFor}
                  className={`${cmsBtnSoft} w-full`}
                >
                  {data.status === "scheduled" ? "Update schedule" : "Schedule"}
                </button>
                <div className="grid grid-cols-2 gap-2 border-t border-[#e2e0ea] pt-3">
                  <button
                    type="button"
                    onClick={() => changeStatus("draft")}
                    disabled={saving || data.status === "draft"}
                    className={cmsBtnSoft}
                  >
                    {data.status === "published" ? "Unpublish" : "Move to draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeStatus("archived")}
                    disabled={saving || data.status === "archived"}
                    className={cmsBtnSoft}
                  >
                    Archive
                  </button>
                </div>
              </div>
            )}
          </CmsDisclosure>

          <CmsDisclosure title="Details" meta={data.category}>
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
          </CmsDisclosure>

          <CmsDisclosure title="Author" meta={data.authorName || "Not set"}>
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
          </CmsDisclosure>

          <CmsDisclosure title="Cover image" meta={data.coverUrl ? "Set" : "None"}>
            <div className="flex flex-col gap-3">
              <CmsField label="Image" hint="Optional — falls back to the category gradient." group={{ id: "blog-cover-image" }}>
                <ImageUploadField value={data.coverUrl} onChange={(v) => update("coverUrl", v)} alt={data.coverAlt || data.title} />
              </CmsField>
              <CmsField label="Cover alt text">
                <input value={data.coverAlt} onChange={(e) => update("coverAlt", e.target.value)} className={cmsInputCls} />
              </CmsField>
            </div>
          </CmsDisclosure>

          <CmsDisclosure title="Social image & canonical" meta={data.ogImageUrl ? "Image set" : "Defaults"}>
            <div className="flex flex-col gap-3">
              <CmsField label="Open Graph image" hint="Shown when the post is shared on social or in search." group={{ id: "blog-og-image" }}>
                <ImageUploadField value={data.ogImageUrl} onChange={(v) => update("ogImageUrl", v)} alt={data.title} />
              </CmsField>
              <CmsField label="Canonical URL" hint="Optional — defaults to this post's own URL.">
                <input
                  value={data.canonicalUrl}
                  onChange={(e) => update("canonicalUrl", e.target.value)}
                  placeholder="https://launch-cv.com/blog/…"
                  className={cmsInputCls}
                />
              </CmsField>
            </div>
          </CmsDisclosure>

          {!isNew ? (
            <CmsDisclosure title="Danger zone">
              <p className="mb-3 text-[13px] leading-5 text-[#66647c]">Deleting a post can&apos;t be undone.</p>
              <button type="button" onClick={destroy} disabled={deleting} className={`${cmsBtnDanger} w-full`}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                {deleting ? "Deleting…" : "Delete post"}
              </button>
            </CmsDisclosure>
          ) : null}
        </div>
      </div>
    </div>
  );
}
