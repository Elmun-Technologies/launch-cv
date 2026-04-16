"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight, Gift } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

function RegisterPageInner() {
  const sp = useSearchParams();
  const referralCode = sp.get("ref")?.trim() || "";
  const next = sp.get("next") || "/dashboard";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        ...(referralCode ? { referralCode } : {}),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      return;
    }
    window.location.href = next;
  }

  return (
    <AuthLayout mode="register">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold tracking-tight text-[#0F172A]">Create your account</h1>
        <p className="mt-2 font-body text-[14px] text-[#64748B]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1A56DB] hover:underline">
            Sign in
          </Link>
        </p>
        {referralCode ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2.5">
            <Gift className="h-4 w-4 shrink-0 text-violet-600" />
            <p className="font-body text-[12px] font-semibold text-violet-700">
              Referral code applied: <span className="font-bold">{referralCode}</span>
            </p>
          </div>
        ) : null}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-body text-[13px] font-semibold text-[#334155]">
            Full name <span className="font-normal text-[#94A3B8]">(optional)</span>
          </label>
          <input
            className="soha-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            autoComplete="name"
          />
        </div>

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
          <label className="mb-1.5 block font-body text-[13px] font-semibold text-[#334155]">
            Password <span className="font-normal text-[#94A3B8]">(min 8 characters)</span>
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className="soha-input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      {/* Footer note */}
      <p className="mt-6 font-body text-[12px] leading-relaxed text-[#94A3B8]">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="underline underline-offset-2 hover:text-[#64748B]">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-[#64748B]">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
