"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

export function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";
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
    window.location.href = next;
  }

  return (
    <AuthLayout mode="login">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-tight text-[#0F172A]">Sign in to Launch CV</h1>
        <p className="mt-2 font-body text-[14px] text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#1A56DB] hover:underline">
            Create one free
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-semibold text-[#334155]">Email address</label>
          <input
            type="email"
            required
            className="soha-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="font-body text-[13px] font-semibold text-[#334155]">Password</label>
            <Link
              href="/auth/forgot-password"
              className="font-body text-[12px] text-[#64748B] transition hover:text-[#1A56DB]"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#64748B]"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="font-body text-[13px] text-red-600">{error}</p>
            {needVerify ? (
              <Link
                href="/auth/resend-verify"
                className="mt-1 block font-body text-[12px] font-semibold text-red-700 underline underline-offset-2"
              >
                Resend verification email →
              </Link>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A56DB] py-3 font-body text-[15px] font-bold text-white transition hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 font-body text-[12px] text-[#94A3B8]">
        Secure sign-in. Your data is encrypted and never shared.
      </p>
    </AuthLayout>
  );
}
