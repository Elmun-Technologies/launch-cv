"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export type RowMenuItem = { label: string; onSelect: () => void; danger?: boolean; disabled?: boolean } | "separator";

/**
 * "⋯" button that opens a small action menu (WAI-ARIA menu button pattern):
 * Enter/Space/ArrowDown open it, arrows move, Escape or Tab close it and
 * focus returns to the button.
 */
export function RowMenu({ label, items, disabled }: { label: string; items: RowMenuItem[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  // Fixed position, so the menu isn't clipped by a card's overflow-hidden.
  const [pos, setPos] = useState<React.CSSProperties>({});
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLUListElement>(null);
  const id = useId();
  const actions = items.filter((i): i is Exclude<RowMenuItem, "separator"> => i !== "separator");

  useEffect(() => {
    if (!open) return;
    const first = menu.current?.querySelector<HTMLButtonElement>("button:not([disabled])");
    first?.focus({ preventScroll: true });
    const onDown = (e: MouseEvent) => {
      if (!menu.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  function openMenu() {
    const r = btn.current?.getBoundingClientRect();
    if (r) {
      const height = 48 + items.length * 42;
      const below = r.bottom + 4 + height < window.innerHeight;
      setPos({
        position: "fixed",
        right: Math.max(8, window.innerWidth - r.right),
        ...(below ? { top: r.bottom + 4 } : { bottom: window.innerHeight - r.top + 4 }),
      });
    }
    setOpen(true);
  }

  function move(dir: 1 | -1 | "first" | "last") {
    const els = [...(menu.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? [])];
    if (!els.length) return;
    const i = els.indexOf(document.activeElement as HTMLButtonElement);
    const next = dir === "first" ? 0 : dir === "last" ? els.length - 1 : (i + dir + els.length) % els.length;
    els[next]?.focus({ preventScroll: true });
  }

  function close(focusButton = true) {
    setOpen(false);
    if (focusButton) btn.current?.focus();
  }

  if (!actions.length) return null;
  return (
    <div>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={label}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openMenu();
          }
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#4a4862] transition-colors hover:bg-[#f1eff8] disabled:opacity-50"
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
      </button>
      {open ? (
        <ul
          ref={menu}
          id={id}
          role="menu"
          aria-label={label}
          style={pos}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              close();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              move(1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              move(-1);
            } else if (e.key === "Home") {
              e.preventDefault();
              move("first");
            } else if (e.key === "End") {
              e.preventDefault();
              move("last");
            } else if (e.key === "Tab") {
              close(false);
            }
          }}
          className="z-40 min-w-[200px] rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(18,18,38,.35)] ring-1 ring-[#e2e0ea]"
        >
          {items.map((item, i) =>
            item === "separator" ? (
              <li key={`sep-${i}`} role="separator" className="my-1 h-px bg-[#e2e0ea]" />
            ) : (
              <li key={item.label} role="none">
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className={`flex min-h-[40px] w-full items-center rounded-xl px-3 text-left text-[14px] font-semibold disabled:opacity-50 ${
                    item.danger ? "text-[#a3262b] hover:bg-[#fbe2e3] focus:bg-[#fbe2e3]" : "text-[#121226] hover:bg-[#f1eff8] focus:bg-[#f1eff8]"
                  } focus:outline-none`}
                >
                  {item.label}
                </button>
              </li>
            ),
          )}
        </ul>
      ) : null}
    </div>
  );
}
