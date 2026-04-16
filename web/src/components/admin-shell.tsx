"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  BarChart3,
  CreditCard,
  Database,
  Cpu,
  Settings,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/resumes", label: "Resumes", icon: FileText },
  { href: "/admin/applications", label: "Applications", icon: Briefcase },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/content", label: "Content", icon: Database },
  { href: "/admin/ai-usage", label: "AI Usage", icon: Cpu },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  email,
  pageTitle,
}: {
  children: React.ReactNode;
  email?: string | null;
  pageTitle?: string;
}) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-[220px] shrink-0 flex-col bg-[#1E1B4B]">
        {/* Logo */}
        <div className="flex h-[60px] items-center gap-2.5 border-b border-white/10 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#1E1B4B]">
            P
          </span>
          <span className="text-[14px] font-semibold tracking-tight text-white">
            Launch CV Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-indigo-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Back to App */}
        <div className="border-t border-white/10 px-3 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-indigo-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-[60px] items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-3">
            {pageTitle && (
              <h1 className="text-[15px] font-semibold text-gray-900">
                {pageTitle}
              </h1>
            )}
            <span className="rounded-md bg-red-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            {email && (
              <span className="text-[13px] text-gray-500">{email}</span>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E1B4B] text-[12px] font-bold text-white">
              {email ? email[0].toUpperCase() : "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
