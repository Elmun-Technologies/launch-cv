"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  Home, FileText, Briefcase, Users, Building2, Target,
  Settings, Mail, Gift, HelpCircle, Menu, X, ShieldCheck, Plus,
} from "lucide-react";
import { AccountMenu } from "@/components/site-header";
import { SiteMark } from "@/components/site/brand";
import { siteFontVars } from "@/lib/site-fonts";
import { PUBLIC_PLANS } from "@/lib/monetization";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  exact?: boolean;
  exclude?: string;
  short?: string;
  /** Other path prefixes that belong to this item (e.g. a saved ATS report counts as Resumes). */
  also?: string[];
};

const mainMenu: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/resumes", label: "Resumes", icon: FileText, also: ["/dashboard/ats-report"] },
  { href: "/dashboard/job-tracker", label: "Job tracker", icon: Briefcase, short: "Tracker" },
  { href: "/dashboard/company-matcher", label: "Company matcher", icon: Target },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
];

const othersMenu: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exclude: "/dashboard/settings/email-templates" },
  { href: "/dashboard/settings/email-templates", label: "Email templates", icon: Mail },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
  { href: "/dashboard/support", label: "Help", icon: HelpCircle },
];

const adminMenu: NavItem[] = [{ href: "/admin-panel", label: "Admin panel", icon: ShieldCheck }];

/** Phone bottom bar: the four places people go most. Everything else is in the menu. */
const bottomNav: NavItem[] = [mainMenu[0], mainMenu[1], mainMenu[2], othersMenu[0]];

type Usage = {
  paid: boolean;
  plan: string;
  /** "YYYY-MM" of the current usage row; limits reset on the 1st of the next month. */
  month?: string;
  limits: { jd: number; packet: number; roleFit: number };
  used: { jd: number; packet: number; roleFit: number };
  isAdmin?: boolean;
};

const PLAN_TITLES: Record<string, string> = {
  starter: PUBLIC_PLANS.starter.title,
  professional: PUBLIC_PLANS.professional.title,
  elite: PUBLIC_PLANS.elite.title,
  lifetime: PUBLIC_PLANS.lifetime.title,
};

function resetLabel(month?: string): string {
  const m = month?.match(/^(\d{4})-(\d{2})$/);
  if (!m) return "Usage resets on the 1st";
  const next = new Date(Number(m[1]), Number(m[2]), 1); // month index = next month
  return `Usage resets ${next.toLocaleDateString("en-US", { month: "short" })} 1`;
}

function Meter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const color = pct >= 100 ? "bg-[#c42b30]" : pct >= 80 ? "bg-[#f2a91f]" : "bg-[#5440e8]";
  return (
    <div>
      <p className="flex justify-between gap-2 text-[12px] text-[#4a4862]">
        <span>{label}</span>
        <span className="[font-feature-settings:'tnum']">
          {used.toLocaleString("en-US")}/{limit.toLocaleString("en-US")}
        </span>
      </p>
      <div aria-hidden="true" className="mt-[5px] h-1.5 overflow-hidden rounded-full bg-white">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ usage, onNavigate }: { usage: Usage; onNavigate?: () => void }) {
  if (!usage.paid) {
    return (
      <div className="rounded-[18px] bg-[#f1eff8] p-4">
        <p className="text-[13px] font-extrabold text-[#121226]">No plan yet</p>
        <p className="mt-1 text-[12px] leading-[18px] text-[#4a4862]">
          Unlock AI rewrites, job matching and cover letters from {PUBLIC_PLANS.starter.priceDisplay}/month.
        </p>
        <Link
          href="/dashboard/settings/subscription"
          onClick={onNavigate}
          className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! mt-3 flex min-h-11 items-center justify-center rounded-full bg-[#5440e8] text-[14px] font-semibold text-white transition-colors hover:bg-[#4430d6]"
        >
          See plans
        </Link>
      </div>
    );
  }
  return (
    <div className="rounded-[18px] bg-[#f1eff8] p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-extrabold text-[#121226]">{PLAN_TITLES[usage.plan] ?? "Your plan"}</span>
        <Link
          href="/dashboard/settings/subscription"
          onClick={onNavigate}
          aria-label="Manage plan"
          className="focus-visible:outline-[#5440e8]! -my-3 -mr-2 inline-flex min-h-11 items-center px-2 text-[12px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]"
        >
          Manage
        </Link>
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        <Meter label="Job-post analyses" used={usage.used.jd} limit={usage.limits.jd} />
        <Meter label="Role-fit checks" used={usage.used.roleFit} limit={usage.limits.roleFit} />
        <Meter label="Packets" used={usage.used.packet} limit={usage.limits.packet} />
      </div>
      <p className="mt-2.5 text-[11px] text-[#66647c]">{resetLabel(usage.month)}</p>
    </div>
  );
}

/**
 * Client half of the signed-in app frame (design v5): white sidebar with the main nav, plan
 * usage and account menu on desktop; a top bar, slide-in menu and bottom tab
 * bar on phones. Sets the v5 type and colors (`lc-site`) for every page inside.
 * `pageTitle` names the main landmark; pages render their own H1.
 */
export function DashboardShellClient({
  children,
  email,
  name,
  pageTitle,
}: {
  children: React.ReactNode;
  email?: string | null;
  name?: string | null;
  pageTitle?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let c = true;
    (async () => {
      const r = await fetch("/api/usage").catch(() => null);
      if (!r?.ok) return;
      const j = (await r.json().catch(() => null)) as Usage | null;
      if (c && j) setUsage(j);
    })();
    return () => {
      c = false;
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    closeRef.current?.focus();
    const opener = openRef.current;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [mobileOpen]);

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    if (item.exclude && pathname.startsWith(item.exclude)) return false;
    const under = (p: string) => pathname === p || pathname.startsWith(`${p}/`);
    return under(item.href) || !!item.also?.some(under);
  }

  const hideTopBanner = pathname.startsWith("/dashboard/settings/subscription");
  const closeMenu = () => setMobileOpen(false);

  function navList(items: NavItem[]) {
    return (
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              aria-current={active ? "page" : undefined}
              className={`focus-visible:outline-[#5440e8]! focus-visible:rounded-[14px]! flex min-h-11 items-center gap-3 rounded-[14px] px-3 py-2 text-[15px] transition-colors duration-200 ${
                active ? "bg-[#111118] font-bold text-white" : "font-medium text-[#24223a] hover:bg-[#f1eff8] hover:text-[#121226]"
              }`}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  const groupLabel = "mx-3 mb-1.5 mt-[18px] text-[11px] font-bold uppercase tracking-[0.1em] text-[#66647c]";

  const logo = (
    <Link href="/dashboard" aria-label="LaunchCV dashboard" className="focus-visible:outline-[#5440e8]! focus-visible:rounded-xl! group inline-flex items-center gap-2.5 rounded-xl text-[#121226]">
      <SiteMark size={32} className="transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
      <span className="text-[20px] font-extrabold tracking-[-0.02em]">
        launch<span className="text-[#5440e8]">cv</span>
      </span>
    </Link>
  );

  const sidebarBody = (
    <>
      <Link
        href="/resume/new"
        onClick={closeMenu}
        className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! lc-btn-lift mt-[22px] flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#5440e8] px-4 text-[15px] font-semibold text-white hover:bg-[#4430d6] motion-reduce:hover:transform-none"
      >
        <Plus className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden /> New resume
      </Link>
      <nav aria-label="App" className="-mx-1 mt-[18px] min-h-0 flex-1 overflow-y-auto px-1 pb-2">
        {navList(mainMenu)}
        <p className={groupLabel}>Other</p>
        {navList(othersMenu)}
        {usage?.isAdmin ? (
          <>
            <p className={groupLabel}>Admin</p>
            {navList(adminMenu)}
          </>
        ) : null}
      </nav>
      <div className="shrink-0 pt-3">
        {usage ? <PlanCard usage={usage} onNavigate={closeMenu} /> : null}
        <div className="mt-3">
          <AccountMenu email={email} name={name} isAdmin={!!usage?.isAdmin} placement="up" onNavigate={closeMenu} />
        </div>
      </div>
    </>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className={`lc-site ${siteFontVars} flex h-dvh overflow-hidden bg-[#eeecf4] text-[#121226] print:block print:h-auto print:overflow-visible print:bg-white`}>
        <a
          href="#app-main"
          className="print:hidden focus-visible:outline-[#5440e8]! focus-visible:rounded-full! sr-only z-[60] rounded-full bg-[#111118] px-4 py-3 text-[14px] font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>

        {/* DESKTOP SIDEBAR */}
        <aside aria-label="Sidebar" className="hidden w-[264px] shrink-0 flex-col border-r border-[#e2e0ea] bg-white px-4 py-[22px] lg:flex print:hidden!">
          <div className="px-1.5">{logo}</div>
          {sidebarBody}
        </aside>

        {/* PHONE / TABLET MENU */}
        <AnimatePresence>
          {mobileOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                className="absolute inset-0 bg-[#121226]/40"
                onClick={closeMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
                className="absolute left-0 top-0 flex h-full w-[300px] max-w-[86vw] flex-col bg-white px-4 py-4 shadow-[0_24px_48px_-20px_rgba(36,24,120,0.35)]"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between px-1.5">
                  {logo}
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={closeMenu}
                    aria-label="Close menu"
                    className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] transition-colors hover:bg-[#e4dfff]"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                {sidebarBody}
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:block print:overflow-visible">
          {/* PHONE / TABLET TOP BAR */}
          <header className="flex shrink-0 items-center justify-between border-b border-[#e2e0ea] bg-white px-4 py-2 sm:px-8 lg:hidden print:hidden">
            <Link href="/dashboard" aria-label="LaunchCV dashboard" className="focus-visible:outline-[#5440e8]! focus-visible:rounded-xl! inline-flex min-h-11 items-center gap-2 rounded-xl text-[#121226]">
              <SiteMark size={28} />
              <span className="text-[17px] font-extrabold tracking-[-0.02em]">
                launch<span className="text-[#5440e8]">cv</span>
              </span>
            </Link>
            <button
              ref={openRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111118] text-white transition-colors hover:bg-[#2a2940]"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </header>

          {usage && !usage.paid && !hideTopBanner ? (
            <div
              role="region"
              aria-label="Plan"
              className="flex shrink-0 items-center justify-between gap-3 border-b border-[#c9c0ff] bg-[#e4dfff] px-4 py-2 text-[13px] sm:px-8 sm:text-[14px] lg:hidden print:hidden"
            >
              <p className="min-w-0 font-medium text-[#121226]">
                <span className="sm:hidden">AI tools from {PUBLIC_PLANS.starter.priceDisplay}/mo</span>
                <span className="hidden sm:inline">
                  AI tools unlock on a plan — from {PUBLIC_PLANS.starter.priceDisplay}/month or {PUBLIC_PLANS.lifetime.priceDisplay} once.
                </span>
              </p>
              <Link
                href="/dashboard/settings/subscription"
                className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#5440e8] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#4430d6]"
              >
                See plans
              </Link>
            </div>
          ) : null}

          <main
            id="app-main"
            tabIndex={-1}
            aria-label={pageTitle}
            className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-5 outline-none focus-visible:outline-none! sm:px-8 sm:pt-8 lg:px-10 lg:pb-12 print:overflow-visible print:p-0"
          >
            {children}
          </main>

          {/* PHONE / TABLET BOTTOM BAR */}
          <nav
            aria-label="Quick links"
            className="grid shrink-0 grid-cols-4 border-t border-[#e2e0ea] bg-white px-2 pb-[max(env(safe-area-inset-bottom),10px)] pt-1.5 lg:hidden print:hidden"
          >
            {bottomNav.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:outline-[#5440e8]! focus-visible:rounded-xl! flex min-h-[52px] flex-col items-center justify-center gap-[3px] rounded-xl text-[11px] font-bold transition-colors hover:bg-[#f1eff8] ${
                    active ? "text-[#5440e8]" : "text-[#4a4862]"
                  }`}
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden />
                  {item.short ?? item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </MotionConfig>
  );
}
