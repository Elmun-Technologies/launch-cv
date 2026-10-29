"use client";

import Link from "next/link";
import { ChevronDown, LogOut, User, CreditCard, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { resetUser } from "@/lib/analytics-client";

export function SiteHeader({ email, pageTitle, isAdmin = false }: { email?: string | null; pageTitle?: string; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#EEEEEB] bg-white px-4 sm:px-8">
      <p className="truncate text-[15px] font-medium text-[#111111]">{pageTitle}</p>

      {email ? (
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-[#F5F5F3]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-[13px] font-semibold text-white">
              {email[0]?.toUpperCase() ?? "U"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#6B6B6B]" aria-hidden />
          </button>

          {open ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-[#E5E5E2] bg-white py-1.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2)]"
            >
              <p className="truncate border-b border-[#EEEEEB] px-4 pb-2.5 pt-1.5 text-[13px] text-[#6B6B6B]">{email}</p>
              <Link
                href="/dashboard/settings"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#111111] hover:bg-[#F5F5F3]"
              >
                <User className="h-4 w-4 text-[#6B6B6B]" aria-hidden /> Account
              </Link>
              <Link
                href="/dashboard/settings/subscription"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#111111] hover:bg-[#F5F5F3]"
              >
                <CreditCard className="h-4 w-4 text-[#6B6B6B]" aria-hidden /> Plan and billing
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin-panel"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#111111] hover:bg-[#F5F5F3]"
                >
                  <ShieldCheck className="h-4 w-4 text-[#6B6B6B]" aria-hidden /> Admin panel
                </Link>
              ) : null}
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#B42318] hover:bg-[#FDF2F0]"
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
      ) : (
        <Link href="/login" className="rounded-full px-3 py-1.5 text-[14px] text-[#111111] hover:bg-[#F5F5F3]">
          Sign in
        </Link>
      )}
    </header>
  );
}
