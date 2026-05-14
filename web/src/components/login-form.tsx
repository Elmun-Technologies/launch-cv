"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

/**
 * On the admin subdomain we hide "Create one free" — public registration
 * is not allowed there. On the public host the usual CTA shows.
 */
function AdminAwareSignupHint() {
  const [onAdmin, setOnAdmin] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOnAdmin(isOnAdminHost());
  }, []);

  if (onAdmin) {
    return (
      <p className="mt-2 text-[13px] leading-[1.55] text-[#64748B]">
        Admin access only. Need a customer account?{" "}
        <a
          href={`https://${process.env.NEXT_PUBLIC_APEX_HOST ?? "launch-cv.com"}/register`}
          className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline"
        >
          Register at launch-cv.com
        </a>
      </p>
    );
  }
  return (
    <p className="mt-2 text-[13px] leading-[1.55] text-[#64748B]">
      Don&apos;t have an account?{" "}
      <Link href="/register" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
        Create one free
      </Link>
    </p>
  );
}

/** Detects whether the page is being served from the admin subdomain. */
function isOnAdminHost(): boolean {
  if (typeof window === "undefined") return false;
  const adminHost = (process.env.NEXT_PUBLIC_ADMIN_HOST ?? "").toLowerCase();
  if (!adminHost) return false;
  return window.location.host.toLowerCase().split(":")[0] === adminHost;
}

export function LoginForm() {
  const sp = useSearchParams();
  const explicitNext = sp.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    // Default destination depends on the host:
    //   admin.launch-cv.com → /admin
    //   launch-cv.com       → /dashboard
    const defaultNext = isOnAdminHost() ? "/admin" : "/dashboard";
    window.location.href = explicitNext || defaultNext;
  }

  return (
    <AuthLayout mode="login">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[24px] font-semibold leading-[1.15] tracking-tight text-[#0F172A]">
          Sign in to Launch CV
        </h1>
        <AdminAwareSignupHint />
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
            Email
          </label>
          <input
            type="email"
            required
            className="soha-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[12px] font-semibold text-[#1A56DB] underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className="soha-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#475569]"
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
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-[12px] text-[#94A3B8]">
        Secure sign-in. Your data is encrypted and never shared.
      </p>
    </AuthLayout>
  );
}
