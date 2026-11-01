"use client";

import Link from "next/link";
import { ChevronUp, ChevronDown, LogOut, User, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { resetUser } from "@/lib/analytics-client";

const itemCls =
  "focus-visible:outline-[#5440e8]! flex min-h-11 w-full items-center gap-2.5 px-4 text-left text-[14px] font-medium text-[#121226] transition-colors hover:bg-[#f1eff8] focus-visible:rounded-none!";

/**
 * Account button + menu for the app shell (design v5): avatar initial and
 * email, opening Account, Plan and billing, Admin panel (staff) and Sign out.
 * `placement="up"` opens above the button (sidebar footer).
 */
export function AccountMenu({
  email,
  isAdmin = false,
  placement = "up",
  onNavigate,
}: {
  email?: string | null;
  isAdmin?: boolean;
  placement?: "up" | "down";
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!email) {
    return (
      <Link
        href="/login"
        className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center rounded-full px-4 text-[14px] font-semibold text-[#121226] transition-colors hover:bg-[#f1eff8]"
      >
        Sign in
      </Link>
    );
  }

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };
  const Chevron = placement === "up" ? ChevronUp : ChevronDown;

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${email}`}
        className="focus-visible:outline-[#5440e8]! focus-visible:rounded-2xl! flex min-h-11 w-full items-center gap-2.5 rounded-2xl p-2 text-left transition-colors hover:bg-[#f1eff8]"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#c9c0ff] text-[13px] font-extrabold text-[#121226]"
        >
          {email[0]?.toUpperCase() ?? "U"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold text-[#121226]">{email}</span>
          <span className="block text-[12px] text-[#66647c]">Account and sign out</span>
        </span>
        <Chevron className={`h-4 w-4 shrink-0 text-[#66647c] transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Account"
          className={`absolute left-0 right-0 z-50 overflow-hidden rounded-2xl border border-[#e2e0ea] bg-white py-1.5 shadow-[0_24px_48px_-20px_rgba(36,24,120,0.35)] ${
            placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <Link href="/dashboard/settings" role="menuitem" onClick={close} className={itemCls}>
            <User className="h-4 w-4 text-[#66647c]" aria-hidden /> Account
          </Link>
          <Link href="/dashboard/settings/subscription" role="menuitem" onClick={close} className={itemCls}>
            <CreditCard className="h-4 w-4 text-[#66647c]" aria-hidden /> Plan and billing
          </Link>
          {isAdmin ? (
            <Link href="/admin-panel" role="menuitem" onClick={close} className={itemCls}>
              <ShieldCheck className="h-4 w-4 text-[#66647c]" aria-hidden /> Admin panel
            </Link>
          ) : null}
          <div className="mx-4 my-1 h-px bg-[#e2e0ea]" />
          <button
            type="button"
            role="menuitem"
            className={`${itemCls} text-[#b42318]! hover:bg-[#fbe2e3]!`}
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              resetUser();
              window.location.href = "/";
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Legacy top bar (page title + account menu). The v5 app shell no longer
 * renders it — pages show their own H1 — but it stays exported for any caller.
 */
export function SiteHeader({ email, pageTitle, isAdmin = false }: { email?: string | null; pageTitle?: string; isAdmin?: boolean }) {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[#e2e0ea] bg-white px-4 sm:px-8">
      <p className="truncate text-[15px] font-semibold text-[#121226]">{pageTitle}</p>
      <div className="w-[260px] max-w-[60%]">
        <AccountMenu email={email} isAdmin={isAdmin} placement="down" />
      </div>
    </header>
  );
}
