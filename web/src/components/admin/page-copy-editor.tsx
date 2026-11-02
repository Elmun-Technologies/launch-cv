"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { CmsBackLink, CmsField, CmsNotice, cmsBtnPrimary, cmsInputCls, cmsTextareaCls } from "@/components/admin/cms-ui";

export type PageCopyEditorProps = {
  pageKey: string;
  label: string;
  description: string;
  initialJson: string;
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type Path = (string | number)[];

/** Keys whose text runs long enough to deserve a textarea. Decided by key, not length, so the control never swaps while typing. */
const LONG_TEXT = /subhead|tagline|paragraph|description|body|text|mission|lead/i;

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

export function PageCopyEditor({ pageKey, label, description, initialJson }: PageCopyEditorProps) {
  const router = useRouter();
  const [text, setText] = useState(initialJson);
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"fields" | "json">("fields");

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
      return (
        <CmsField key={id} label={fieldLabel} counter={`${value.length} characters`}>
          {long ? (
            <textarea rows={value.length > 160 ? 5 : 3} value={value} onChange={(e) => setValue(path, e.target.value)} className={cmsTextareaCls} />
          ) : (
            <input value={value} onChange={(e) => setValue(path, e.target.value)} className={key === "href" ? `${cmsInputCls} lc-mono` : cmsInputCls} />
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
        <button type="button" onClick={save} disabled={saving} className={`${cmsBtnPrimary} self-start`}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Save
        </button>
      </div>

      <p className="mt-3 text-[14px] leading-[21px] text-[#4a4862]">{description}</p>

      <div role="status" className="empty:hidden mt-3">
        {savedAt ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0b7a4f]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved at {savedAt.toLocaleTimeString("en-US")}
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
          <CmsField
            label="JSON content"
            hint="Structured copy as JSON. Use this view to add or remove keys."
          >
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
    </section>
  );
}
