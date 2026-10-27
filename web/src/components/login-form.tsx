"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
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
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#111111]">
          Sign in to LaunchCV
        </h1>
        <p className="mt-2 text-[13px] leading-[1.55] text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
            Create one
          </Link>
        </p>
      </div>

      {/* Social sign-in */}
      {googleEnabled ? (
        <div className="mb-5 space-y-4">
          <GoogleSignInButton mode="login" next={explicitNext} />
          <AuthDivider label="or continue with email" />
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-medium text-[#111111]">
            Email
          </label>
          <input
              id="login-email"
            type="email"
            required
            className="h-[46px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3.5 text-[15px] text-[#111111] outline-none transition focus:border-[#111111] focus:ring-4 focus:ring-black/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-password" className="text-[13px] font-medium text-[#111111]">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[12px] font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className="h-[46px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3.5 text-[15px] text-[#111111] outline-none transition focus:border-[#111111] focus:ring-4 focus:ring-black/5 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6E6A] transition hover:text-[#475569]"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-[13px] text-red-700">{error}</p>
            {needVerify ? (
              <Link
                href="/auth/resend-verify"
                className="mt-1 block text-[12px] font-semibold text-red-700 underline underline-offset-2"
              >
                Resend verification email →
              </Link>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#111111] py-3 text-[15px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-[12px] text-[#6E6E6A]">
        Sign-in is protected over HTTPS. We never sell your data.
      </p>
    </AuthLayout>
  );
}
