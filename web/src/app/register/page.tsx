"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight, Gift, Sparkles } from "lucide-react";
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
      <div className="mb-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1A56DB]">
          <Sparkles className="h-3 w-3" /> Free to create
        </span>
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-tight text-[#0F172A]">
          Create your Launch CV account
        </h1>
        <p className="mt-3 text-[14px] leading-[1.6] text-[#64748B]">
          Account is free. Pick a plan after — Starter from <span className="font-semibold text-[#0F172A]">$9/mo</span> or <span className="font-semibold text-[#0F172A]">Lifetime $149</span>.
        </p>
        <p className="mt-2 text-[13px] text-[#64748B]">
          Already a user?{" "}
          <Link href="/login" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">Sign in</Link>
        </p>
        {referralCode ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5">
            <Gift className="h-4 w-4 shrink-0 text-violet-600" />
            <p className="font-body text-[12px] font-semibold text-violet-700">
              Referral applied: <span className="font-bold">{referralCode}</span>
            </p>
          </div>
        ) : null}
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-body text-[12px] font-bold uppercase tracking-wider text-[#475569]">
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
          <label className="mb-1.5 block font-body text-[12px] font-bold uppercase tracking-wider text-[#475569]">Email</label>
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
          <label className="mb-1.5 block font-body text-[12px] font-bold uppercase tracking-wider text-[#475569]">
            Password <span className="font-normal normal-case tracking-normal text-[#94A3B8]">(min 8 chars)</span>
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
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="font-body text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3.5 font-body text-[15px] font-bold text-white transition hover:bg-[#1E293B] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Creating account…" : "Create my account"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3 text-[#94A3B8]">
        <span className="h-px flex-1 bg-[#E2E8F0]" />
        <span className="font-body text-[11px] font-bold uppercase tracking-wider">what happens next</span>
        <span className="h-px flex-1 bg-[#E2E8F0]" />
      </div>

      <ol className="space-y-3 font-body text-[13px] leading-[1.55] text-[#475569]">
        {[
          "Verify your email — takes one click.",
          "Pick a plan (Starter, Professional, Lifetime).",
          "Paste a JD or upload a resume. The AI takes it from there.",
        ].map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] font-body text-[10px] font-bold text-white">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      <p className="mt-7 font-body text-[11px] leading-[1.65] text-[#94A3B8]">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="font-bold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Terms</Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="font-bold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Privacy Policy</Link>.
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
