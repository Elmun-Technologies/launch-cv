"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Save, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { FormField, AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/form-field";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

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

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link
            href="/admin-panel/cms/blog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] transition hover:bg-[#FAFBFC] hover:text-[#0F172A]"
            aria-label="Back to blog list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">
              {isNew ? "New blog post" : data.title || "Untitled"}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-[12px] text-[#64748B]">
              <StatusBadge tone={data.status === "published" ? "green" : data.status === "scheduled" ? "blue" : data.status === "archived" ? "default" : "amber"} dot>
                {data.status}
              </StatusBadge>
              <span className="font-mono">/{data.slug || "auto-generated"}</span>
              {savedAt ? (
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> Saved
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew ? (
            <button
              type="button"
              onClick={openPreview}
              disabled={previewLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[12px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:opacity-50"
            >
              {previewLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
              Preview
            </button>
          ) : null}
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
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-[13px] text-red-700">{error}</p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main editor column */}
        <div className="space-y-5 lg:col-span-2">
          <SectionCard>
            <div className="space-y-4">
              <FormField label="Title" required>
                <AdminInput value={data.title} onChange={(e) => update("title", e.target.value)} placeholder="The article headline" />
              </FormField>
              <FormField label="Slug" hint="Lowercase, hyphens. Leave blank to auto-generate from title.">
                <AdminInput value={data.slug} onChange={(e) => update("slug", e.target.value)} placeholder="my-new-post" />
              </FormField>
              <FormField label="Short description" required hint={`${data.description.length}/180`}>
                <AdminTextarea
                  rows={2}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="One- or two-sentence summary, shown in /blog and meta description"
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Body" description="Markdown supported (GFM extensions, images via upload toolbar)">
            <MarkdownEditor value={data.bodyMd} onChange={(v) => update("bodyMd", v)} />
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <SectionCard title="Publishing">
            <div className="space-y-3">
              {isNew ? (
                <p className="rounded-md bg-[#FAFBFC] px-3 py-2 text-[12px] text-[#64748B]">
                  Save to create the post as a draft. You can then publish or schedule it.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => changeStatus("draft")}
                      disabled={saving || data.status === "draft"}
                      className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:opacity-50"
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => changeStatus("published")}
                      disabled={saving || data.status === "published"}
                      className="rounded-md bg-[#1A56DB] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-50"
                    >
                      Publish
                    </button>
                  </div>
                  <div className="border-t border-[#E2E8F0] pt-3">
                    <FormField label="Schedule for" hint="Auto-publishes when the time passes">
                      <AdminInput
                        type="datetime-local"
                        value={data.scheduledFor}
                        onChange={(e) => update("scheduledFor", e.target.value)}
                      />
                    </FormField>
                    <button
                      type="button"
                      onClick={() => changeStatus("scheduled")}
                      disabled={saving || !data.scheduledFor || data.status === "scheduled"}
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:opacity-50"
                    >
                      Schedule
                    </button>
                  </div>
                  <div className="border-t border-[#E2E8F0] pt-3">
                    <button
                      type="button"
                      onClick={() => changeStatus("archived")}
                      disabled={saving || data.status === "archived"}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#64748B] transition hover:bg-[#FAFBFC] disabled:opacity-50"
                    >
                      Archive
                    </button>
                  </div>
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Categorization">
            <div className="space-y-3">
              <FormField label="Category">
                <AdminSelect value={data.category} onChange={(e) => update("category", e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </AdminSelect>
              </FormField>
              <FormField label="Tags" hint="Comma-separated">
                <AdminInput
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
                />
              </FormField>
              <FormField label="Reading time" hint="Minutes">
                <AdminInput
                  type="number"
                  min={1}
                  value={data.readingTime}
                  onChange={(e) => update("readingTime", Number(e.target.value) || 1)}
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Author">
            <div className="space-y-3">
              <FormField label="Display name">
                <AdminInput value={data.authorName} onChange={(e) => update("authorName", e.target.value)} />
              </FormField>
              <FormField label="Role / byline">
                <AdminInput value={data.authorRole} onChange={(e) => update("authorRole", e.target.value)} placeholder="Career Research Team" />
              </FormField>
              <FormField label="Bio">
                <AdminTextarea rows={3} value={data.authorBio} onChange={(e) => update("authorBio", e.target.value)} />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Cover image">
            <div className="space-y-3">
              <FormField label="Cover URL" hint="Optional — falls back to category gradient">
                <AdminInput value={data.coverUrl} onChange={(e) => update("coverUrl", e.target.value)} placeholder="/uploads/cms/…" />
              </FormField>
              <FormField label="Cover alt text">
                <AdminInput value={data.coverAlt} onChange={(e) => update("coverAlt", e.target.value)} />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="SEO" description="Overrides defaults derived from title/description">
            <div className="space-y-3">
              <FormField label="SEO title" hint="Recommended ≤ 60 chars">
                <AdminInput value={data.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
              </FormField>
              <FormField label="Meta description" hint="Recommended ≤ 160 chars">
                <AdminTextarea rows={2} value={data.seoDescription} onChange={(e) => update("seoDescription", e.target.value)} />
              </FormField>
              <FormField label="Open-graph image URL">
                <AdminInput value={data.ogImageUrl} onChange={(e) => update("ogImageUrl", e.target.value)} placeholder="/uploads/cms/…" />
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
                  {deleting ? "Deleting…" : "Delete post"}
                </button>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
