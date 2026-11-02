"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";

const itemCls =
  "flex min-h-11 w-full items-center gap-2.5 px-4 text-left text-[14px] font-medium text-[#121226] transition-colors hover:bg-[#f1eff8] focus-visible:bg-[#f1eff8] focus-visible:outline-none! disabled:opacity-50";

/** The editor keeps each resume's template in this browser (`lcv_tpl_<id>`). */
const tplKey = (id: string) => `lcv_tpl_${id}`;

function readTemplate(id: string): TemplateStyle | null {
  try {
    const v = window.localStorage.getItem(tplKey(id));
    return TEMPLATE_STYLES.includes(v as TemplateStyle) ? (v as TemplateStyle) : null;
  } catch {
    return null;
  }
}

/**
 * The template name for a resume card ("Modern · "). The template is only
 * stored in this browser, so nothing shows when it was never picked here.
 */
export function TemplateName({ id }: { id: string }) {
  const [tpl, setTpl] = useState<TemplateStyle | null>(null);
  useEffect(() => {
    queueMicrotask(() => setTpl(readTemplate(id)));
  }, [id]);
  if (!tpl) return null;
  return <>{TEMPLATE_SPECS[tpl].label} · </>;
}

/** "…" menu on a resume card: Rename, Duplicate, Delete (confirmed first). */
export function ResumeCardMenu({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"dup" | "del" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const items = [...(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length];
      next?.focus();
      e.preventDefault();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function duplicate() {
    setBusy("dup");
    setError(null);
    const r = await fetch(`/api/resumes/${id}/duplicate`, { method: "POST" }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setOpen(false);
    if (!r?.ok || !j.id) return setError("Couldn't duplicate this resume. Please try again.");
    // Keep the copy on the same template as the original.
    const tpl = readTemplate(id);
    try {
      if (tpl) window.localStorage.setItem(tplKey(String(j.id)), tpl);
    } catch {
      // storage off: the copy opens on the default template
    }
    router.refresh();
  }

  async function remove() {
    setOpen(false);
    if (!window.confirm(`Delete “${title}”? This can't be undone. Its saved versions and tracked jobs go with it.`)) return;
    setBusy("del");
    setError(null);
    const r = await fetch(`/api/resumes/${id}`, { method: "DELETE" }).catch(() => null);
    setBusy(null);
    if (!r?.ok) return setError("Couldn't delete this resume. Please try again.");
    router.refresh();
  }

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`More actions for ${title}`}
        onClick={() => setOpen((o) => !o)}
        disabled={!!busy}
        className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! -mr-1 -mt-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-[#4a4862] transition-colors hover:bg-[#f1eff8] hover:text-[#121226]"
      >
        {busy ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : <MoreHorizontal className="h-5 w-5" aria-hidden />}
      </button>
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={`Actions for ${title}`}
          className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-2xl border border-[#e2e0ea] bg-white py-1.5 shadow-[0_24px_48px_-20px_rgba(36,24,120,0.35)]"
        >
          <button
            type="button"
            role="menuitem"
            className={itemCls}
            onClick={() => {
              setOpen(false);
              setRenaming(true);
            }}
          >
            <Pencil className="h-4 w-4 text-[#66647c]" aria-hidden /> Rename
          </button>
          <button type="button" role="menuitem" className={itemCls} onClick={() => void duplicate()}>
            <Copy className="h-4 w-4 text-[#66647c]" aria-hidden /> Duplicate
          </button>
          <div className="mx-4 my-1 h-px bg-[#e2e0ea]" />
          <button type="button" role="menuitem" className={`${itemCls} text-[#b42318]! hover:bg-[#fbe2e3]!`} onClick={() => void remove()}>
            <Trash2 className="h-4 w-4" aria-hidden /> Delete
          </button>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl bg-[#fbe2e3] px-3 py-2 text-[13px] text-[#a3262b]">
          {error}
        </p>
      ) : null}
      {renaming ? (
        <RenameDialog
          id={id}
          title={title}
          onClose={() => {
            setRenaming(false);
            btnRef.current?.focus();
          }}
          onDone={() => {
            setRenaming(false);
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function RenameDialog({ id, title, onClose, onDone }: { id: string; title: string; onClose: () => void; onDone: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState(title);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const titleId = useId();
  const inputId = useId();

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const t = value.trim();
    if (!t) return setErr("Give the resume a name.");
    if (t === title) return onClose();
    setSaving(true);
    setErr(null);
    const r = await fetch(`/api/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t.slice(0, 200) }),
    }).catch(() => null);
    setSaving(false);
    if (!r?.ok) return setErr("Couldn't rename it. Please try again.");
    onDone();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[420px] max-w-[calc(100%-32px)] rounded-[28px] bg-white p-0 text-[#121226] shadow-[0_40px_80px_-30px_rgba(10,6,60,.6)] backdrop:bg-[#111118]/50"
    >
      <form onSubmit={save} className="p-6">
        <h2 id={titleId} className="text-[22px] font-extrabold tracking-[-0.02em]">
          Rename resume
        </h2>
        <label htmlFor={inputId} className="mt-4 block text-[14px] font-semibold">
          Name
        </label>
        <input
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={200}
          autoFocus
          className="mt-1.5 block h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] outline-none hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[15px]"
        />
        {err ? (
          <p role="alert" className="mt-2 text-[14px] font-semibold text-[#a3262b]">
            {err}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-[#4a4862] hover:bg-[#f1eff8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center gap-2 rounded-full bg-[#5440e8] px-5 text-[15px] font-semibold text-white hover:bg-[#4430d6] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
            Save
          </button>
        </div>
      </form>
    </dialog>
  );
}
