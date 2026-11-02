"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Menu,
  X,
  Plug,
  Gauge,
  Lock,
} from "lucide-react";
import { SiteMark } from "@/components/site/brand";
import { siteFontVars } from "@/lib/site-fonts";

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
      { href: "/admin-panel/cms/blog", label: "Blog posts", icon: FileEdit },
      { href: "/admin-panel/cms/testimonials", label: "Testimonials", icon: MessageSquare },
      { href: "/admin-panel/cms/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin-panel/cms/pages", label: "Page copy", icon: Layers },
      { href: "/admin-panel/cms/media", label: "Media library", icon: ImageIcon },
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
    label: "Integrations",
    items: [
      { href: "/admin-panel/integrations", label: "Integrations", icon: Plug },
      { href: "/admin-panel/limits", label: "Limits & budgets", icon: Gauge },
      { href: "/admin-panel/security", label: "Security", icon: Lock },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin-panel/audit", label: "Audit log", icon: ShieldCheck },
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

  // Escape closes the phone drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const initials = (email ?? "Admin").slice(0, 1).toUpperCase();

  return (
    <div className={`lc-site ${siteFontVars} flex h-[100dvh] overflow-hidden bg-[#eeecf4] text-[#121226]`}>
      {/* Sidebar — static from lg, a drawer below it */}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-[264px] max-w-[85vw] shrink-0 flex-col bg-[#111118] text-white transition-[translate,transform,visibility] duration-200 lg:static lg:w-[248px] lg:translate-x-0 ${
          mobileOpen ? "visible translate-x-0 shadow-[0_24px_60px_-10px_rgba(10,6,60,.6)]" : "invisible -translate-x-full lg:visible"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[68px] shrink-0 items-center justify-between gap-2 px-5">
          <Link href="/admin-panel" className="inline-flex items-center gap-2.5 rounded-lg" aria-label="LaunchCV admin home">
            <SiteMark size={30} />
            <span className="text-[18px] font-extrabold tracking-[-0.02em]">
              launch<span className="text-[#c9c0ff]">cv</span>
            </span>
            <span className="rounded-full bg-[#ff7a33] px-2.5 py-[5px] text-[12px] font-bold leading-none text-[#111118]">Admin</span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[#c9c7d8] transition hover:bg-[#1d1c2e] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3.5 pb-4">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mx-3 mb-1.5 mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8f8da8]">{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-3 text-[14px] transition-colors lg:min-h-[38px] ${
                          active
                            ? "bg-[#5440e8] font-bold text-white"
                            : "font-medium text-[#c9c7d8] hover:bg-[#1d1c2e] hover:text-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge === "new" ? (
                          <span className="rounded-full bg-[#ff7a33] px-2 py-0.5 text-[10px] font-bold text-[#111118]">New</span>
                        ) : null}
                        {item.badge === "soon" ? (
                          <span className="rounded-full bg-[#2a2940] px-2 py-0.5 text-[10px] font-bold text-[#c9c7d8]">Soon</span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Back to app */}
        <div className="shrink-0 border-t border-[#2f2d48] px-3.5 py-3">
          <Link
            href="/dashboard"
            className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-[13px] font-bold text-[#c9c0ff] transition-colors hover:bg-[#1d1c2e] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to the app
          </Link>
        </div>
      </aside>

      {/* Backdrop for the phone drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-[#111118]/45 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-[#e2e0ea] bg-[#eeecf4] px-4 sm:px-6 lg:px-9">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="admin-sidebar"
              onClick={() => setMobileOpen((v) => !v)}
              className="-ml-1.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#121226] transition hover:bg-white lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <SiteMark size={26} className="shrink-0 lg:hidden" />
            {pageTitle ? (
              <p className="ml-1 truncate text-[15px] font-bold tracking-[-0.01em] text-[#4a4862] lg:ml-0">{pageTitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {email ? <span className="hidden max-w-[240px] truncate text-[13px] text-[#4a4862] sm:inline">{email}</span> : null}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111118] text-[13px] font-bold text-white"
              aria-hidden
              title={email ?? undefined}
            >
              {initials}
            </span>
          </div>
        </header>

        {/* Content */}
        <main tabIndex={0} id="admin-main" aria-label={pageTitle ?? "Admin"} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden focus:outline-none px-4 pb-12 pt-6 sm:px-6 lg:px-9 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
