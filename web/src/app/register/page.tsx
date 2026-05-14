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
      <div className="mb-5">
        <h1 className="text-[24px] font-semibold leading-[1.15] tracking-tight text-[#0F172A]">
          Create your Launch CV account
        </h1>
        <p className="mt-2 text-[13px] leading-[1.55] text-[#64748B]">
          Free to create. Pick a plan after sign-up.{" "}
          <Link href="/login" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
        {referralCode ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2">
            <Gift className="h-3.5 w-3.5 shrink-0 text-violet-600" />
            <p className="text-[12px] font-semibold text-violet-700">
              Referral applied: <span className="font-bold">{referralCode}</span>
            </p>
          </div>
        ) : null}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3.5">
        <div>
          <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
            Full name <span className="font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>
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
          <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">Email</label>
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
          <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
            Password <span className="font-normal normal-case tracking-normal text-[#94A3B8]">(min 8)</span>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition hover:text-[#475569]"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3 text-[14px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Creating account…" : "Create my account"}
        </button>
      </form>

      <p className="mt-5 text-[11px] leading-[1.55] text-[#94A3B8]">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="font-semibold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Terms</Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="font-semibold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Privacy Policy</Link>.
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
