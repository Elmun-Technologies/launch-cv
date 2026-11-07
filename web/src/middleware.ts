import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_2FA_COOKIE, COOKIE_NAME, sessionCookieBase, signPurposeToken, verifyPurposeToken, verifySessionToken } from "@/lib/auth-token";
import { checkSameOrigin, CROSS_ORIGIN_ERROR, UNSAFE_METHODS } from "@/lib/same-origin";

/** Path prefixes that require an authenticated session. */
const PROTECTED_PREFIXES = ["/dashboard", "/resume", "/admin-panel"];

function pathMatches(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Only same-origin paths are safe to bounce a user back to. Blocks
 * `//evil.com`, `/\evil.com`, full URLs, and anything with a scheme. */
function safeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (value.length > 512) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.includes("://")) return null;
  return value;
}

/**
 * Admin requests carry their path and method to the server (lib/admin-guard
 * reads them for the audit log and the origin check). Always overwritten, so
 * a client can't supply its own values.
 */
function adminRequestHeaders(req: NextRequest): Headers {
  const h = new Headers(req.headers);
  h.set("x-lc-path", req.nextUrl.pathname);
  h.set("x-lc-method", req.method);
  return h;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin API: state-changing calls must come from this site (CSRF defense).
  if (pathMatches(pathname, "/api/admin-panel")) {
    if (UNSAFE_METHODS.has(req.method)) {
      const verdict = checkSameOrigin(req.headers);
      if (!verdict.ok) {
        console.warn("[admin] cross-site request refused", req.method, pathname, verdict.reason);
        return NextResponse.json({ error: CROSS_ORIGIN_ERROR, code: "cross_origin" }, { status: 403 });
      }
    }
    return NextResponse.next({ request: { headers: adminRequestHeaders(req) } });
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathMatches(pathname, p));
  if (!isProtected) return NextResponse.next();
  const forward = pathMatches(pathname, "/admin-panel") ? { request: { headers: adminRequestHeaders(req) } } : undefined;

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    // Keep the query (e.g. ?plan=) so the user lands exactly where they were headed.
    const next = safeNextPath(pathname + req.nextUrl.search);
    if (next) url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  // Admin idle timeout: each admin page view pushes the 2FA cookie's expiry forward
  // by its own window; with no activity for that long, the code is asked again.
  if (pathMatches(pathname, "/admin-panel")) {
    const t = req.cookies.get(ADMIN_2FA_COOKIE)?.value;
    const ok = t ? await verifyPurposeToken(t, `admin2fa:${session.sub}`) : null;
    if (ok && ok.ttl > 0) {
      const res = NextResponse.next(forward);
      res.cookies.set(ADMIN_2FA_COOKIE, await signPurposeToken(session.sub, `admin2fa:${session.sub}`, ok.ttl), {
        ...sessionCookieBase(),
        sameSite: "strict",
        maxAge: ok.ttl,
      });
      return res;
    }
  }
  return NextResponse.next(forward);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume/:path*",
    "/admin-panel/:path*",
    "/api/admin-panel/:path*",
  ],
};
