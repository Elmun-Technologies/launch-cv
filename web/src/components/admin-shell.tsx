"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  FileEdit,
  MessageSquare,
  HelpCircle,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
  KeyRound,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/logo";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "new" | "soon";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin-panel", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin-panel/cms/blog", label: "Blog posts", icon: FileEdit, badge: "new" },
      { href: "/admin-panel/cms/testimonials", label: "Testimonials", icon: MessageSquare, badge: "soon" },
      { href: "/admin-panel/cms/faqs", label: "FAQs", icon: HelpCircle, badge: "soon" },
      { href: "/admin-panel/cms/pages", label: "Page copy", icon: Layers, badge: "soon" },
      { href: "/admin-panel/cms/media", label: "Media library", icon: ImageIcon, badge: "soon" },
    ],
  },
  {
    label: "Users & billing",
    items: [
      { href: "/admin-panel/users", label: "Users", icon: Users },
      { href: "/admin-panel/subscriptions", label: "Subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin-panel/resumes", label: "Resumes", icon: FileText },
      { href: "/admin-panel/applications", label: "Applications", icon: Briefcase },
      { href: "/admin-panel/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin-panel/ai-usage", label: "AI usage", icon: Cpu },
      { href: "/admin-panel/content", label: "User CRM", icon: Database },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin-panel/audit", label: "Audit log", icon: ShieldCheck, badge: "soon" },
      { href: "/admin-panel/roles", label: "Roles", icon: KeyRound, badge: "soon" },
      { href: "/admin-panel/settings", label: "Settings", icon: Settings },
    ],
  },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  const initials = (email ?? "Admin").slice(0, 1).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFC] text-[#0F172A]">
      {/* Sidebar */}
      <aside
        className={`absolute z-30 flex h-full w-[240px] shrink-0 flex-col border-r border-[#E2E8F0] bg-white transition-transform lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[56px] shrink-0 items-center gap-2 border-b border-[#E2E8F0] px-5">
          <Logo variant="light" size="sm" />
          <span className="ml-1 rounded-md bg-[#0F172A] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition ${
                        active
                          ? "bg-[#F1F5F9] text-[#0F172A]"
                          : "text-[#475569] hover:bg-[#FAFBFC] hover:text-[#0F172A]"
                      }`}
                    >
                      {active ? (
                        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[#1A56DB]" />
                      ) : null}
                      <item.icon
                        className={`h-4 w-4 shrink-0 ${
                          active ? "text-[#1A56DB]" : "text-[#94A3B8] group-hover:text-[#475569]"
                        }`}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge === "new" ? (
                        <span className="rounded bg-blue-50 px-1.5 text-[10px] font-semibold text-blue-700">
                          New
                        </span>
                      ) : null}
                      {item.badge === "soon" ? (
                        <span className="rounded bg-[#F1F5F9] px-1.5 text-[10px] font-medium text-[#94A3B8]">
                          Soon
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Back to app */}
        <div className="shrink-0 border-t border-[#E2E8F0] p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] font-medium text-[#64748B] transition hover:bg-[#FAFBFC] hover:text-[#0F172A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileOpen ? (
        <div
          className="absolute inset-0 z-20 bg-[#0F172A]/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-[56px] shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#475569] transition hover:bg-[#F1F5F9] lg:hidden"
            >
              <ChevronRight className={`h-4 w-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
            </button>
            {pageTitle ? (
              <h1 className="text-[14px] font-semibold tracking-tight text-[#0F172A]">{pageTitle}</h1>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {email ? (
              <span className="hidden text-[12px] text-[#64748B] sm:inline">{email}</span>
            ) : null}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1A56DB] to-[#7C3AED] text-[12px] font-semibold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
