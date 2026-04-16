"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

function RegisterPageInner() {
  const sp = useSearchParams();
  const referralCode = sp.get("ref")?.trim() || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
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
    if (!res.ok) { const j = await res.json().catch(() => ({})); setError(j.error ?? "Error"); return; }
    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC] text-sm font-bold text-white">L</span>
          </Link>
          <h1 className="mt-4 text-[28px] font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-[13px] text-gray-500">
            Already have an account? <Link className="font-medium text-[#7C5CFC] hover:underline" href="/login">Sign in</Link>
          </p>
          {referralCode ? (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-[#7C5CFC]">
              Referral code applied: {referralCode}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] font-semibold text-gray-900">Name (optional)</label>
              <input className="soha-input mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ali" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-900">Email</label>
              <input type="email" required className="soha-input mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-900">Password (min 8)</label>
              <div className="relative mt-1.5">
                <input type={showPw ? "text" : "password"} required minLength={8} className="soha-input pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" tabIndex={-1} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Please wait..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" aria-label="Loading" />
        </main>
      }
    >
      <RegisterPageInner />
    </Suspense>
  );
}
