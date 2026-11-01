import type { ReactNode } from "react";
import { siteFontVars } from "@/lib/site-fonts";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";

/** Page frame for the v5 marketing design: lilac ground, Figtree, new nav and footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className={`lc-site ${siteFontVars} flex min-h-screen flex-col`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <SiteNav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
