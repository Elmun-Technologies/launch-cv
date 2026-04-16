"use client";

import Link from "next/link";
import { Bell, ChevronDown, Search, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";

export function SiteHeader({ email, pageTitle }: { email?: string | null; pageTitle?: string }) {
  const [showUser, setShowUser] = useState(false);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6">
      <div className="flex items-center gap-3">
        {pageTitle ? (
          <div className="rounded-full bg-[#7C5CFC] px-4 py-1.5 text-[13px] font-semibold text-white">{pageTitle}</div>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-60 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 text-[13px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#7C5CFC]/30 focus:bg-white focus:ring-2 focus:ring-[#7C5CFC]/10"
          />
        </div>

        <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7C5CFC]" />
        </button>

        <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
          <Settings className="h-[18px] w-[18px]" />
        </button>

        {email ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUser((s) => !s)}
              className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-3 py-1.5 transition hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] text-[12px] font-bold text-white">
                {email[0]?.toUpperCase() ?? "U"}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {showUser ? (
              <div className="animate-fadeIn absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl shadow-gray-200/50">
                <div className="border-b border-gray-50 px-4 py-2.5 text-[12px] text-gray-400">{email}</div>
                <Link href="/dashboard/settings" onClick={() => setShowUser(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 transition hover:bg-gray-50">
                  <User className="h-4 w-4 text-gray-400" /> Account Settings
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 transition hover:bg-red-50"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-[#7C5CFC] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">Get started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
