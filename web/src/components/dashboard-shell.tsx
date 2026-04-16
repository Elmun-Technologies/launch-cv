"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  Home, FileText, Briefcase, Users, Building2, Target,
  Settings, Puzzle, Gift, HelpCircle, Menu, X, Zap, Sparkles,
} from "lucide-react";
import { PUBLIC_PLANS, PUBLIC_PRICING } from "@/lib/monetization";

const mainMenu = [
  { href: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { href: "/dashboard/resumes", label: "Resume Builder", icon: FileText },
  { href: "/dashboard/job-tracker", label: "Job Tracker", icon: Briefcase },
  { href: "/dashboard/contacts", label: "Contacts", icon: Users },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/dashboard/company-matcher", label: "Company Match", icon: Target },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
];

const othersMenu = [
  { href: "/dashboard/settings", label: "Account", icon: Settings },
  { href: "/dashboard/settings/email-templates", label: "Extensions", icon: Puzzle },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
];

function UpgradeCard() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 px-4 py-5 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC] text-white shadow-sm">
        <Zap className="h-5 w-5" />
      </div>
      <p className="mt-3 text-[13px] font-bold text-gray-900">
        Plans from {PUBLIC_PLANS.starter.priceDisplay}
        {PUBLIC_PLANS.starter.periodLabel}
      </p>
      <p className="mt-1 text-[11px] leading-snug text-gray-500">{PUBLIC_PRICING.upsellHook}</p>
      <Link
        href="/dashboard/settings/subscription"
        className="mt-4 block w-full rounded-xl bg-[#7C5CFC] py-2.5 text-[12px] font-bold text-white transition hover:bg-[#6B4CE0]"
      >
        Upgrade
      </Link>
    </div>
  );
}

export function DashboardShell({ children, email, pageTitle }: { children: React.ReactNode; email?: string | null; pageTitle?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    let c = true;
    (async () => {
      try {
        const r = await fetch("/api/subscription/status");
        const j = (await r.json().catch(() => ({}))) as { pro?: boolean; paid?: boolean };
        if (c && r.ok) {
          const paid = typeof j.paid === "boolean" ? j.paid : !!j.pro;
          setIsPro(paid);
        }
      } finally {
        if (c) setPlanLoaded(true);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const showUpsell = planLoaded && !isPro;
  const hideTopBanner = pathname.startsWith("/dashboard/settings/subscription");

  function renderNavItems() {
    return (
      <>
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400">Main Menu</div>
        <div className="space-y-0.5 px-2">
          {mainMenu.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tooltip={item.label}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  active
                    ? "bg-[#7C5CFC] text-white shadow-sm shadow-violet-500/20"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${active ? "text-white" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400">Others</div>
        <div className="space-y-0.5 px-2">
          {othersMenu.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tooltip={item.label}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  active
                    ? "bg-[#7C5CFC] text-white shadow-sm shadow-violet-500/20"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${active ? "text-white" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex h-[60px] items-center gap-2.5 border-b border-gray-100 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC] text-[12px] font-bold text-white shadow-sm">L</span>
          <span className="text-[15px] font-bold tracking-tight text-gray-900">Launch CV</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-5">
          {renderNavItems()}
        </nav>

        {showUpsell ? (
          <div className="border-t border-gray-100 px-4 pb-5 pt-4">
            <UpgradeCard />
          </div>
        ) : null}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-[260px] flex-col animate-slideIn overflow-y-auto bg-white shadow-xl">
            <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC] text-[12px] font-bold text-white">L</span>
                <span className="text-[15px] font-bold text-gray-900">Launch CV</span>
              </div>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-gray-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 py-5">{renderNavItems()}</nav>
            {showUpsell ? (
              <div className="border-t border-gray-100 p-4">
                <UpgradeCard />
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="ml-4 flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <SiteHeader email={email} pageTitle={pageTitle} />
          </div>
        </div>

        {showUpsell && !hideTopBanner ? (
          <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-violet-50/30 px-4 py-2.5 sm:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-[13px] text-gray-700 sm:items-center">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#7C5CFC] sm:mt-0" />
                <span>
                  <span className="font-bold text-gray-900">Activate a plan</span> — from{" "}
                  {PUBLIC_PLANS.starter.priceDisplay}
                  {PUBLIC_PLANS.starter.periodLabel} or {PUBLIC_PLANS.lifetime.title} {PUBLIC_PLANS.lifetime.priceDisplay}{" "}
                  {PUBLIC_PLANS.lifetime.periodLabel}. {PUBLIC_PRICING.upsellHook}
                </span>
              </p>
              <Link
                href="/dashboard/settings/subscription"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#6B4CE0]"
              >
                Upgrade
              </Link>
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-y-auto p-5 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
