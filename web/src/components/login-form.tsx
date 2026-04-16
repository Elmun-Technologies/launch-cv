"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
    setLoading(true); setError(null); setNeedVerify(false);
    const res = await fetch("/api/auth/login", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim(), password }) });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      if (res.status === 403 && j.code === "email_not_verified") { setNeedVerify(true); setError(j.error ?? "Email not verified"); }
      else setError(typeof j.error === "string" ? j.error : "Error");
      return;
    }
    window.location.href = next;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC] text-sm font-bold text-white">L</span>
          </Link>
          <h1 className="mt-4 text-[28px] font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Don&apos;t have an account? <Link className="font-medium text-[#7C5CFC] hover:underline" href="/register">Sign up</Link>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] font-semibold text-gray-900">Email</label>
              <input type="email" required className="soha-input mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-gray-900">Password</label>
                <Link className="text-[11px] text-gray-400 hover:text-[#7C5CFC]" href="/auth/forgot-password">Forgot password?</Link>
              </div>
              <div className="relative mt-1.5">
                <input type={showPw ? "text" : "password"} required minLength={8} className="soha-input pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" tabIndex={-1} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
            {needVerify ? <p className="text-[13px] text-amber-600"><Link className="font-medium underline" href="/auth/resend-verify">Resend verification email</Link></p> : null}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Please wait..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
