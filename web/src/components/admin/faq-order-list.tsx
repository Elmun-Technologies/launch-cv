"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, GripVertical, Loader2 } from "lucide-react";
import { VisibilityBadge, cmsTextLinkCls } from "@/components/admin/cms-ui";

export type FaqListRow = {
  id: string;
  question: string;
  placementLabel: string;
  published: boolean;
};

const ROW_GRID =
  "md:grid md:grid-cols-[5.5rem_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] md:items-center md:gap-3.5";

const iconBtn =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg text-[#4a4862] transition-colors hover:bg-[#f1eff8] hover:text-[#121226] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[#5440e8] disabled:pointer-events-none disabled:opacity-35 md:h-9 md:w-9";

type SaveState = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };

/**
 * FAQ list with drag-to-reorder. Every row also has Move up / Move down
 * buttons, so the order can be changed with a keyboard or screen reader.
 * Each change saves the full order (PUT /api/admin-panel/cms/faqs/reorder).
 */
export function FaqOrderList({ initial }: { initial: FaqListRow[] }) {
  const [rows, setRows] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [announce, setAnnounce] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string[] | null>(null);
  const inFlight = useRef(false);
  const buttons = useRef(new Map<string, HTMLButtonElement | null>());

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function flush() {
    if (inFlight.current || !pending.current) return;
    const ids = pending.current;
    pending.current = null;
    inFlight.current = true;
    setSave({ kind: "saving" });
    try {
      const res = await fetch("/api/admin-panel/cms/faqs/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) setSave({ kind: "error", message: j.error ?? "Couldn't save the order." });
      else if (!pending.current) setSave({ kind: "saved" });
    } catch {
      setSave({ kind: "error", message: "Couldn't save the order. Check your connection." });
    } finally {
      inFlight.current = false;
      if (pending.current) void flush();
    }
  }

  function commit(next: FaqListRow[]) {
    setRows(next);
    pending.current = next.map((r) => r.id);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 350);
  }

  function move(id: string, delta: -1 | 1, focus?: "up" | "down") {
    const from = rows.findIndex((r) => r.id === id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= rows.length) return;
    const next = rows.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    commit(next);
    setAnnounce(`Moved “${row.question}” to position ${to + 1} of ${rows.length}.`);
    if (focus) {
      // At the top or bottom the pressed button is disabled; keep focus on the row.
      const edge = (focus === "up" && to === 0) || (focus === "down" && to === rows.length - 1);
      const target = edge ? (focus === "up" ? "down" : "up") : focus;
      requestAnimationFrame(() => buttons.current.get(`${id}:${target}`)?.focus());
    }
  }

  function onDragStart(e: DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    const li = (e.currentTarget as HTMLElement).closest("li");
    if (li) e.dataTransfer.setDragImage(li, 24, 24);
  }

  function onDragOver(e: DragEvent, id: string) {
    if (!dragId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overId !== id) setOverId(id);
  }

  function onDrop(e: DragEvent, targetId: string) {
    e.preventDefault();
    const id = dragId;
    setDragId(null);
    setOverId(null);
    if (!id || id === targetId) return;
    const from = rows.findIndex((r) => r.id === id);
    const to = rows.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const next = rows.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    commit(next);
    setAnnounce(`Moved “${row.question}” to position ${to + 1} of ${rows.length}.`);
  }

  return (
    <>
      <div className="flex min-h-6 items-center justify-end gap-2 pt-2 text-[13px] font-semibold" aria-live="polite">
        {save.kind === "saving" ? (
          <span className="inline-flex items-center gap-1.5 text-[#66647c]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Saving order…
          </span>
        ) : save.kind === "saved" ? (
          <span className="text-[#0b7a4f]">Order saved</span>
        ) : save.kind === "error" ? (
          <span className="text-[#a3222a]">
            {save.message}{" "}
            <button
              type="button"
              onClick={() => {
                pending.current = rows.map((r) => r.id);
                void flush();
              }}
              className="underline underline-offset-2"
            >
              Retry
            </button>
          </span>
        ) : null}
      </div>
      <p className="sr-only" aria-live="assertive">
        {announce}
      </p>
      <div aria-hidden="true" className={`hidden pb-3.5 pt-1.5 text-[12px] font-bold tracking-[0.06em] text-[#66647c] ${ROW_GRID}`}>
        <span>ORDER</span>
        <span>QUESTION</span>
        <span>PLACEMENT</span>
        <span>STATUS</span>
        <span className="w-10" />
      </div>
      <ol aria-label="FAQs in display order">
        {rows.map((r, i) => (
          <li
            key={r.id}
            onDragOver={(e) => onDragOver(e, r.id)}
            onDrop={(e) => onDrop(e, r.id)}
            onDragEnd={() => {
              setDragId(null);
              setOverId(null);
            }}
            className={`flex flex-col gap-2 border-t py-2.5 text-[14px] transition-colors md:first:border-t ${ROW_GRID} ${
              overId === r.id && dragId && dragId !== r.id ? "border-[#5440e8] bg-[#f7f6fb]" : "border-[#e2e0ea]"
            } ${dragId === r.id ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-0.5">
              <span
                draggable
                onDragStart={(e) => onDragStart(e, r.id)}
                title="Drag to reorder"
                aria-hidden="true"
                className="hidden h-9 w-6 cursor-grab items-center justify-center text-[#9a98b0] hover:text-[#4a4862] active:cursor-grabbing md:inline-flex"
              >
                <GripVertical className="h-4 w-4" />
              </span>
              <button
                type="button"
                ref={(el) => {
                  buttons.current.set(`${r.id}:up`, el);
                }}
                onClick={() => move(r.id, -1, "up")}
                disabled={i === 0}
                aria-label={`Move up: ${r.question}`}
                className={iconBtn}
              >
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                ref={(el) => {
                  buttons.current.set(`${r.id}:down`, el);
                }}
                onClick={() => move(r.id, 1, "down")}
                disabled={i === rows.length - 1}
                aria-label={`Move down: ${r.question}`}
                className={iconBtn}
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="min-w-0 font-bold leading-[21px] text-[#121226] [overflow-wrap:anywhere]">{r.question}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
              <span className="min-w-0 text-[#4a4862] [overflow-wrap:anywhere]">
                <span className="sr-only">Placement: </span>
                {r.placementLabel}
              </span>
              <span>
                <VisibilityBadge published={r.published} />
              </span>
              <Link href={`/admin-panel/cms/faqs/${r.id}`} className={`${cmsTextLinkCls} ml-auto md:ml-0`} aria-label={`Edit FAQ: ${r.question}`}>
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
