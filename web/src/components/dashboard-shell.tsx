"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiteHeader } from "@/components/site-header";
import { Logo } from "@/components/logo";
import {
  Home, FileText, Briefcase, Users, Building2, Target,
  Settings, Puzzle, Gift, HelpCircle, Menu, X, ShieldCheck,
} from "lucide-react";
import { PUBLIC_PLANS } from "@/lib/monetization";

type NavItem = { href: string; label: string; icon: typeof Home; exact?: boolean; exclude?: string };

const mainMenu: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/resumes", label: "Resumes", icon: FileText },
  { href: "/dashboard/job-tracker", label: "Job tracker", icon: Briefcase },
  { href: "/dashboard/company-matcher", label: "Company matcher", icon: Target },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
];

const othersMenu: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings, exclude: "/dashboard/settings/email-templates" },
  { href: "/dashboard/settings/email-templates", label: "Email templates", icon: Puzzle },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
  { href: "/dashboard/support", label: "Help", icon: HelpCircle },
];

type Usage = {
  paid: boolean;
  plan: string;
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

function Meter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <div className="mt-2.5">
      <p className="text-[12px] text-[#6B6B6B]">
        {label} · {used} of {limit.toLocaleString("en-US")}
      </p>
      <div className="mt-1 h-[5px] rounded-full bg-[#EEEEEB]">
        <div className={`h-[5px] rounded-full ${pct >= 90 ? "bg-[#C2341B]" : "bg-[#111111]"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function PlanCard({ usage }: { usage: Usage }) {
  if (!usage.paid) {
    return (
      <div className="rounded-[14px] border border-[#E5E5E2] p-3.5">
        <p className="text-[13px] font-medium text-[#111111]">No plan yet</p>
        <p className="mt-1 text-[12px] leading-snug text-[#6B6B6B]">
          Unlock AI rewrites, job matching and cover letters from {PUBLIC_PLANS.starter.priceDisplay}/month.
        </p>
        <Link
          href="/dashboard/settings/subscription"
          className="mt-3 flex h-9 items-center justify-center rounded-full bg-[#2563EB] text-[13px] font-medium text-white hover:bg-[#1D4ED8]"
        >
          See plans
        </Link>
      </div>
    );
  }
  return (
    <Link href="/dashboard/settings/subscription" className="block rounded-[14px] border border-[#E5E5E2] p-3.5 hover:border-[#111111]">
      <p className="flex justify-between text-[13px]">
        <span className="font-medium text-[#111111]">{PLAN_TITLES[usage.plan] ?? "Your plan"}</span>
        <span className="text-[#6B6B6B]">This month</span>
      </p>
      <Meter label="Job matching" used={usage.used.jd} limit={usage.limits.jd} />
      <Meter label="Packets" used={usage.used.packet} limit={usage.limits.packet} />
    </Link>
  );
}

export function DashboardShell({ children, email, pageTitle }: { children: React.ReactNode; email?: string | null; pageTitle?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);

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

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    if (item.exclude && pathname.startsWith(item.exclude)) return false;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  const hideTopBanner = pathname.startsWith("/dashboard/settings/subscription");

  function navList(items: NavItem[]) {
    return (
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex h-9 items-center gap-2.5 rounded-[9px] px-3 text-[14px] transition ${
                active ? "bg-[#F5F5F3] font-medium text-[#111111]" : "text-[#3F3F3F] hover:bg-[#FAFAF9] hover:text-[#111111]"
              }`}
            >
              <item.icon className={`h-4 w-4 ${active ? "text-[#111111]" : "text-[#6E6E6A]"}`} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  }

  const sidebar = (
    <>
      <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-4">
        {navList(mainMenu)}
        <div className="mx-3 my-3 h-px bg-[#EEEEEB]" />
        {navList(othersMenu)}
        {usage?.isAdmin ? (
          <>
            <div className="mx-3 my-3 h-px bg-[#EEEEEB]" />
            {navList([{ href: "/admin-panel", label: "Admin panel", icon: ShieldCheck }])}
          </>
        ) : null}
      </nav>
      {usage ? (
        <div className="px-3 pb-4">
          <PlanCard usage={usage} />
        </div>
      ) : null}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9] text-[#111111]">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[#EEEEEB] bg-white lg:flex">
        <div className="flex h-[60px] shrink-0 items-center px-5">
          <Logo variant="light" size="md" href="/dashboard" />
        </div>
        {sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/25"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="absolute left-0 top-0 flex h-full w-[264px] flex-col bg-white shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-[60px] shrink-0 items-center justify-between px-5">
                <Logo variant="light" size="md" href="/dashboard" />
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-[#6B6B6B]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center bg-white">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="ml-3 flex h-10 w-10 items-center justify-center rounded-full text-[#3F3F3F] hover:bg-[#F5F5F3] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <SiteHeader email={email} pageTitle={pageTitle} isAdmin={!!usage?.isAdmin} />
          </div>
        </div>

        {usage && !usage.paid && !hideTopBanner ? (
          <div role="region" aria-label="Plan" className="flex items-center justify-between gap-3 border-b border-[#DCE6FF] bg-[#EEF3FF] px-4 py-2 text-[13px] sm:px-8 sm:text-[14px] lg:hidden">
            <p className="min-w-0 text-[#111111]">
              <span className="sm:hidden">AI tools from {PUBLIC_PLANS.starter.priceDisplay}/mo</span>
              <span className="hidden sm:inline">
                AI tools unlock on a plan — from {PUBLIC_PLANS.starter.priceDisplay}/month or {PUBLIC_PLANS.lifetime.priceDisplay} once.
              </span>
            </p>
            <Link
              href="/dashboard/settings/subscription"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] px-4 text-[13px] font-medium text-white hover:bg-[#1D4ED8]"
            >
              See plans
            </Link>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
