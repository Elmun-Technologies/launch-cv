"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

function VerifyInner() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setErr("Verification token is missing from the link."));
      return;
    }
    (async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error ?? "Couldn&apos;t verify the email. The link may be expired.");
        return;
      }
      setMsg("Your email is verified.");
    })();
  }, [token]);

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
          <div>
            <p className="text-[14px] font-semibold text-red-800">Verification failed</p>
            <p className="mt-1 text-[13px] text-red-700">{err}</p>
            <Link href="/auth/resend-verify" className="mt-2 inline-block text-[13px] font-semibold text-red-700 underline-offset-2 hover:underline">
              Resend verification email →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <div>
            <p className="text-[14px] font-semibold text-emerald-800">{msg}</p>
            <Link
              href="/login"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1E293B]"
            >
              Continue to sign in
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-[14px] text-[#475569]">
      <Loader2 className="h-4 w-4 animate-spin text-[#1A56DB]" />
      Verifying your email…
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout mode="login">
      <div className="mb-7">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-tight text-[#0F172A]">
          Verify your email
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#64748B]">
          One-time check — usually finishes in a second or two.
        </p>
      </div>
      <Suspense fallback={<p className="text-[13px] text-[#94A3B8]">Loading…</p>}>
        <VerifyInner />
      </Suspense>
    </AuthLayout>
  );
}
