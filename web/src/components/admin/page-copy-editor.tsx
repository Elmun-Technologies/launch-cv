"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, Eye, History, RotateCcw } from "lucide-react";
import {
  CmsBackLink,
  CmsField,
  CmsNotice,
  charCounterTone,
  cmsBtnPrimary,
  cmsBtnSoft,
  cmsBtnWhite,
  cmsInputCls,
  cmsTextareaCls,
} from "@/components/admin/cms-ui";

export type PageCopyVersionItem = {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  savedByEmail: string | null;
  /** First line of the copy, to tell versions apart. */
  summary: string;
};

export type PageCopyEditorProps = {
  pageKey: string;
  label: string;
  description: string;
  initialJson: string;
  /** The copy that ships in code, used to fill fields a restored version doesn't have. */
  defaults: Record<string, unknown>;
  /** Max characters per field (per item for lists), from the registry. */
  max: Record<string, number>;
  /** Public page that shows this copy, opened by Preview. */
  previewHref: string;
  versions: PageCopyVersionItem[];
  historyLimit: number;
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Path = (string | number)[];

/** Keys whose text runs long enough to deserve a textarea. Decided by key, not length, so the control never swaps while typing. */
const LONG_TEXT = /subhead|tagline|paragraph|description|body|text|mission|lead/i;

/** cleanPageCopy() allows 300 characters for fields without a registry limit. */
const DEFAULT_MAX = 300;

// UTC so the server render and the browser agree (no hydration mismatch).
const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

function humanize(key: string): string {
  if (key === "href") return "Link (URL)";
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((w) => (w === "cta" ? "CTA" : w));
  const out = words.join(" ");
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function singular(label: string): string {
  return label.endsWith("s") ? label.slice(0, -1) : label;
}

function setIn(root: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = root.slice();
    copy[head as number] = setIn(copy[head as number] ?? null, rest, value);
    return copy;
  }
  if (root && typeof root === "object") {
    return { ...root, [head]: setIn((root as Record<string, Json>)[head as string] ?? null, rest, value) };
  }
  return root;
}

function isPlainObject(v: unknown): v is Record<string, Json> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

export function PageCopyEditor({
  pageKey,
  label,
  description,
  initialJson,
  defaults,
  max,
  previewHref,
  versions,
  historyLimit,
}: PageCopyEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialJson);
  const [published, setPublished] = useState(initialJson);
  const [saving, startSaving] = useTransition();
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"fields" | "json">("fields");
  const dirty = text !== published;

  function save() {
    setError(null);
    setNotice(null);
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
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(j.error ?? "Publish failed");
        return;
      }
      setPublished(text);
      setNotice(`Published at ${new Date().toLocaleTimeString("en-US")}`);
      router.refresh();
    });
  }

  function restore(v: PageCopyVersionItem) {
    const when = dateTimeFmt.format(new Date(v.createdAt));
    if (!confirm(`Restore the version from ${when}? It replaces the copy on the live site now.`)) return;
    setError(null);
    setNotice(null);
    setRestoringId(v.id);
    startSaving(async () => {
      try {
        const res = await fetch(`/api/admin-panel/cms/pages/${encodeURIComponent(pageKey)}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ versionId: v.id }),
        });
        const j = (await res.json().catch(() => ({}))) as { error?: string; pageCopy?: { data?: unknown } };
        if (!res.ok || !j.pageCopy) {
          setError(j.error ?? "Restore failed");
          return;
        }
        const restored = JSON.stringify({ ...defaults, ...(isPlainObject(j.pageCopy.data) ? j.pageCopy.data : {}) }, null, 2);
        setText(restored);
        setPublished(restored);
        setNotice(`Restored the version from ${when}`);
        router.refresh();
      } finally {
        setRestoringId(null);
      }
    });
  }

  // The form view edits the same JSON text the JSON view shows, so saving is unchanged.
  const parsed = useMemo<{ ok: true; value: Json } | { ok: false }>(() => {
    try {
      return { ok: true, value: JSON.parse(text) as Json };
    } catch {
      return { ok: false };
    }
  }, [text]);

  function setValue(path: Path, value: Json) {
    if (!parsed.ok) return;
    setText(JSON.stringify(setIn(parsed.value, path, value), null, 2));
  }

  function renderNode(value: Json, path: Path, fieldLabel: string, key: string): ReactNode {
    const id = path.join(".");
    if (typeof value === "string") {
      const long = LONG_TEXT.test(key) || typeof path[path.length - 1] === "number";
      const limit = max[String(path[0])] ?? DEFAULT_MAX;
      const len = value.trim().length;
      const over = len > limit;
      return (
        <CmsField
          key={id}
          label={fieldLabel}
          counter={
            <>
              {len}/{limit}
              <span className="sr-only"> characters{over ? ", over the limit" : ""}</span>
            </>
          }
          counterTone={over ? "warn" : charCounterTone(len, { max: limit })}
          error={over ? `Shorten this to ${limit} characters or fewer.` : null}
        >
          {long ? (
            <textarea
              rows={value.length > 160 ? 5 : 3}
              value={value}
              onChange={(e) => setValue(path, e.target.value)}
              aria-invalid={over || undefined}
              className={cmsTextareaCls}
            />
          ) : (
            <input
              value={value}
              onChange={(e) => setValue(path, e.target.value)}
              aria-invalid={over || undefined}
              className={key === "href" ? `${cmsInputCls} lc-mono` : cmsInputCls}
            />
          )}
        </CmsField>
      );
    }
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      return (
        <fieldset key={id} className="flex flex-col gap-3">
          <legend className="text-[13px] font-bold text-[#121226]">{fieldLabel}</legend>
          {value.map((v, i) => renderNode(v, [...path, i], `${singular(fieldLabel)} ${i + 1}`, key))}
        </fieldset>
      );
    }
    if (isPlainObject(value)) {
      return (
        <fieldset key={id} className="rounded-2xl border-[1.5px] border-[#efedf7] p-4">
          <legend className="px-1 text-[13px] font-bold text-[#121226]">{fieldLabel}</legend>
          <div className="flex flex-col gap-3">{Object.entries(value).map(([k, v]) => renderNode(v, [...path, k], humanize(k), k))}</div>
        </fieldset>
      );
    }
    return (
      <p key={id} className="rounded-[14px] bg-[#f7f6fb] px-3.5 py-3 text-[13px] text-[#4a4862]">
        <b className="text-[#121226]">{fieldLabel}</b> can only be edited in the JSON view.
      </p>
    );
  }

  const tabCls = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-bold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8] sm:min-h-9 ${
      active ? "bg-[#111118] text-white" : "text-[#4a4862] hover:text-[#121226]"
    }`;

  return (
    <section aria-labelledby="page-copy-title" className="lc-card min-w-0 rounded-[24px] p-4 sm:p-6">
      <div className="lg:hidden">
        <CmsBackLink href="/admin-panel/cms/pages">All sections</CmsBackLink>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 id="page-copy-title" className="text-[18px] font-extrabold text-[#121226]">
            {label}
          </h2>
          <p className="lc-mono mt-0.5 text-[12px] text-[#66647c]">{pageKey}</p>
        </div>
        <div className="flex flex-wrap gap-2 self-start">
          <a href={previewHref} target="_blank" rel="noopener noreferrer" className={cmsBtnWhite}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview
            <span className="sr-only"> the live page (opens in a new tab)</span>
          </a>
          <button type="button" onClick={save} disabled={saving} className={cmsBtnPrimary}>
            {saving && !restoringId ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Publish
          </button>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-[21px] text-[#4a4862]">{description}</p>
      {dirty ? (
        <p className="mt-1.5 text-[13px] leading-5 text-[#a15c00]">
          You have unpublished changes. Preview shows the live page, so publish first to see them there.
        </p>
      ) : null}

      <div role="status" className="mt-3 empty:hidden">
        {notice ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0b7a4f]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {notice}
          </span>
        ) : null}
      </div>

      {error ? (
        <div className="mt-3">
          <CmsNotice tone="error">{error}</CmsNotice>
        </div>
      ) : null}

      <div role="group" aria-label="Editor view" className="mt-4 inline-flex gap-1 rounded-full bg-[#f1eff8] p-1">
        <button type="button" aria-pressed={view === "fields"} onClick={() => setView("fields")} className={tabCls(view === "fields")}>
          Fields
        </button>
        <button type="button" aria-pressed={view === "json"} onClick={() => setView("json")} className={tabCls(view === "json")}>
          JSON
        </button>
      </div>

      <div className="mt-4">
        {view === "json" ? (
          <CmsField label="JSON content" hint="Structured copy as JSON. Use this view to add or remove keys.">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              className={`${cmsTextareaCls} lc-mono min-h-[420px] resize-y leading-[1.65] sm:text-[13px]!`}
            />
          </CmsField>
        ) : !parsed.ok ? (
          <CmsNotice tone="error">
            The JSON has a syntax error, so the field view is unavailable.{" "}
            <button type="button" onClick={() => setView("json")} className="font-bold underline underline-offset-2">
              Fix it in the JSON view
            </button>
            .
          </CmsNotice>
        ) : isPlainObject(parsed.value) ? (
          <div className="flex flex-col gap-3.5">
            {Object.entries(parsed.value).map(([k, v]) => renderNode(v, [k], humanize(k), k))}
          </div>
        ) : (
          <p className="text-[14px] text-[#4a4862]">This content isn&apos;t an object, so edit it in the JSON view.</p>
        )}
      </div>

      <details className="group mt-5 border-t border-[#e2e0ea] pt-3">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg text-[13px] text-[#66647c] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8] [&::-webkit-details-marker]:hidden">
          <History className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Version history keeps the last {historyLimit} published versions.{" "}
            <span className="font-bold text-[#5440e8] group-open:hidden">{versions.length ? `Show ${versions.length}` : "Show"}</span>
            <span className="hidden font-bold text-[#5440e8] group-open:inline">Hide</span>
          </span>
        </summary>
        {versions.length === 0 ? (
          <p className="mt-2 text-[13px] text-[#4a4862]">No versions yet. Each publish adds one.</p>
        ) : (
          <ol className="mt-2 flex flex-col">
            {versions.map((v, i) => (
              <li key={v.id} className="flex flex-col gap-2 border-t border-[#efedf7] py-2.5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[#121226]">
                    <time dateTime={v.createdAt}>{dateTimeFmt.format(new Date(v.createdAt))}</time>
                    {i === 0 ? <span className="ml-2 font-semibold text-[#0b7a4f]">Live</span> : null}
                  </p>
                  <p className="truncate text-[12px] text-[#66647c]">
                    {v.savedByEmail ?? "Earlier save"} · {v.summary}
                  </p>
                </div>
                {i === 0 ? null : (
                  <button
                    type="button"
                    onClick={() => restore(v)}
                    disabled={saving}
                    className={`${cmsBtnSoft} shrink-0 self-start sm:self-auto`}
                    aria-label={`Restore the version from ${dateTimeFmt.format(new Date(v.createdAt))}`}
                  >
                    {restoringId === v.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    )}
                    Restore
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </details>
    </section>
  );
}
