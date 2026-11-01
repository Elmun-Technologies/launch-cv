"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  AuthLayout,
  AuthNotice,
  authEyeBtnCls,
  authH1Cls,
  authInlineLinkCls,
  authInputCls,
  authLabelCls,
  authLeadCls,
  authSubmitCls,
} from "@/components/auth-layout";
import { GoogleSignInButton, AuthDivider } from "@/components/google-sign-in-button";
import { identifyUser } from "@/lib/analytics-client";

/** Maps `?error=` codes from the Google OAuth callback to friendly copy. */
const GOOGLE_ERRORS: Record<string, string> = {
  google_unavailable: "Google sign-in isn't available right now. Use your email and password.",
  google_denied: "Google sign-in was cancelled.",
  google_state: "Your Google sign-in session expired. Please try again.",
  google_profile: "We couldn't read your Google profile. Please try again.",
  google_unverified_email: "Your Google email isn't verified. Verify it with Google, then retry.",
  google_server: "Something went wrong finishing Google sign-in. Please try again.",
  signups_paused: "New sign-ups are paused for a short while. Existing accounts can still sign in.",
};

/** Mirror of middleware's safeNextPath — blocks `//evil.com`, schemes, and
 * other off-site bounces that would let an attacker open-redirect users
 * via `/login?next=...`. Keep in sync with src/middleware.ts.
 * Returns null when the value is missing or unsafe so the caller can fall
 * back to a role-aware default (admin → /admin-panel, otherwise /dashboard). */
function safeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (value.length > 512) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.includes("://")) return null;
  return value;
}

export function LoginForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const sp = useSearchParams();
  const explicitNext = safeNextPath(sp.get("next"));
  const googleError = GOOGLE_ERRORS[sp.get("error") ?? ""] ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(googleError);
  const [needVerify, setNeedVerify] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedVerify(false);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      if (res.status === 403 && j.code === "email_not_verified") {
        setNeedVerify(true);
        setError(j.error ?? "Email not verified");
      } else {
        setError(typeof j.error === "string" ? j.error : "Incorrect email or password.");
      }
      return;
    }
    // Destination preference:
    //   1. Explicit `?next=` query param (e.g. middleware-set after blocking /admin-panel)
    //   2. /admin-panel if the user is an admin
    //   3. /dashboard for regular customers
    const json = (await res.json().catch(() => ({}))) as { isAdmin?: boolean; userId?: string };
    // Identify the analytics session (internal id only, no PII) so funnel steps
    // stitch to the same person across sessions and to server-side events.
    if (json.userId) identifyUser(json.userId);
    const defaultNext = json.isAdmin ? "/admin-panel" : "/dashboard";
    window.location.href = explicitNext || defaultNext;
  }

  return (
    <AuthLayout mode="login">
      <div>
        <h1 className={authH1Cls}>Welcome back.</h1>
        <p className={authLeadCls}>
          Sign in to LaunchCV. Don&apos;t have an account?{" "}
          <Link href="/register" className={authInlineLinkCls}>
            Create one
          </Link>
        </p>
      </div>

      {/* Social sign-in */}
      {googleEnabled ? (
        <div className="mt-[30px] space-y-5">
          <GoogleSignInButton mode="login" next={explicitNext} />
          <AuthDivider label="or with email" />
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={onSubmit} className={googleEnabled ? "mt-5" : "mt-[30px]"}>
        <div>
          <label htmlFor="login-email" className={authLabelCls}>
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            className={authInputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="login-password" className={authLabelCls}>
              Password
            </label>
            <Link href="/auth/forgot-password" className="lc-link text-[14px] font-semibold text-[#5440e8] transition-colors hover:text-[#3a2bb8]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className={`${authInputCls} pr-14`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
                aria-describedby={error ? "login-error" : undefined}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
              className={`${authEyeBtnCls} mt-[3px]`}
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {error ? (
          <div id="login-error" className="mt-4">
            <AuthNotice tone="error">
              <p>{error}</p>
              {needVerify ? (
                <Link href="/auth/resend-verify" className="mt-1 inline-block font-bold underline underline-offset-2 hover:no-underline">
                  Resend verification email →
                </Link>
              ) : null}
            </AuthNotice>
          </div>
        ) : null}

        <button type="submit" disabled={loading} className={`${authSubmitCls} mt-6`}>
          {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
