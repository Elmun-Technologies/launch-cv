"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

function Form() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setErr(j.error ?? "Couldn&apos;t reset password. The link may be expired.");
      return;
    }
    setOk(true);
  }

  if (!token) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
        <div>
          <p className="text-[13px] font-semibold text-red-800">Invalid or expired link</p>
          <Link href="/auth/forgot-password" className="mt-1 inline-block text-[13px] font-semibold text-red-700 underline-offset-2 hover:underline">
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  if (ok) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-[13px] font-semibold text-emerald-800">Password updated</p>
          <Link href="/login" className="mt-1 inline-block text-[13px] font-semibold text-emerald-700 underline-offset-2 hover:underline">
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">
          New password <span className="font-normal normal-case tracking-normal text-[#94A3B8]">(min 8 chars)</span>
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

      {err ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-[13px] text-red-700">{err}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? "Updating…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout mode="login">
      <div className="mb-7">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A56DB] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-tight text-[#0F172A]">
          Set a new password
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#64748B]">
          Choose a strong password — eight characters minimum.
        </p>
      </div>
      <Suspense fallback={<p className="text-[13px] text-[#94A3B8]">Loading…</p>}>
        <Form />
      </Suspense>
    </AuthLayout>
  );
}
