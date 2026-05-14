import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth-token";
import { getAdminHost, isAdminRequest, isHostSplitConfigured } from "@/lib/admin-host";

/** Path prefixes that require an authenticated session. */
const PROTECTED_PREFIXES = ["/dashboard", "/resume", "/admin"];

/**
 * Paths reachable from the admin subdomain (admin.launch-cv.com).
 * Marketing pages, /register, /dashboard etc. are blocked there.
 *
 * Static assets (/_next/*, /favicon.ico, …) are excluded by the matcher
 * below, so they're always reachable on either host.
 */
const ADMIN_HOST_ALLOWED_PREFIXES: string[] = [
  "/admin",
  "/api/admin",
  "/api/auth",
  "/api/account",
  "/api/feedback",
  "/login",
  "/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verify",
];

function pathMatches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isAllowedOnAdminHost(pathname: string): boolean {
  if (pathname === "/") return false; // admin host has no marketing landing
  return ADMIN_HOST_ALLOWED_PREFIXES.some((p) => pathMatches(pathname, p));
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const host = req.headers.get("host");
  const isAdmin = isAdminRequest(host);
  const splitOn = isHostSplitConfigured();

  // ─── 1. HOST-BASED ROUTING (only enforced when env vars set) ──────────
  if (splitOn) {
    if (isAdmin) {
      // Admin host: "/" → "/admin"
      if (pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      // Block everything outside the admin allowlist.
      if (!isAllowedOnAdminHost(pathname)) {
        // For pages, redirect the user to the marketing host.
        if (!pathname.startsWith("/api/")) {
          const apex = process.env.NEXT_PUBLIC_APEX_HOST ?? "launch-cv.com";
          const target = new URL(`${pathname}${search}`, `https://${apex}`);
          return NextResponse.redirect(target);
        }
        // For non-admin APIs called from admin host, return 404.
        return new NextResponse("Not found", { status: 404 });
      }
    } else {
      // On the public host — block /admin and /api/admin
      if (pathMatches(pathname, "/admin")) {
        // Page redirect to admin host
        const adminHost = getAdminHost();
        const target = new URL(`${pathname}${search}`, `https://${adminHost}`);
        return NextResponse.redirect(target);
      }
      if (pathMatches(pathname, "/api/admin")) {
        // API: don't redirect (preserves method + body); return 404 instead.
        return new NextResponse("Not found", { status: 404 });
      }
    }
  }

  // ─── 2. AUTH (session required for protected prefixes) ─────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathMatches(pathname, p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Run middleware on everything except static assets and Next.js internals.
  // We need the broad matcher so host-based routing can intercept marketing
  // pages on the admin subdomain (and vice versa).
  matcher: ["/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|uploads/|icon\\.|apple-icon\\.|opengraph-image).*)"],
};
