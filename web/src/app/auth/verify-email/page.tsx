"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { AuthLayout, AuthNotice, authDarkBtnCls, authH1SmCls, authInlineLinkCls, authLeadCls } from "@/components/auth-layout";

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
        setErr(j.error ?? "Couldn't verify the email. The link may be expired.");
        return;
      }
      setMsg("Your email is verified.");
    })();
  }, [token]);

  if (err) {
    return (
      <div className="mt-6">
        <AuthNotice tone="error" title="Verification failed">
          <p className="mt-0.5">{err}</p>
        </AuthNotice>
        <p className="mt-[18px] text-[14px] text-[#4a4862]">
          Need a new link?{" "}
          <Link href="/auth/resend-verify" className={authInlineLinkCls}>
            Resend verification email →
          </Link>
        </p>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="mt-6">
        <AuthNotice tone="success">
          <p className="font-bold">{msg}</p>
        </AuthNotice>
        <Link href="/login" className={`${authDarkBtnCls} group mt-6`}>
          Continue to sign in
          <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div role="status" className="mt-6 flex items-center gap-3 text-[16px] text-[#4a4862]">
      <Loader2 className="h-5 w-5 text-[#5440e8] motion-safe:animate-spin" aria-hidden="true" />
      Verifying your email…
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      mode="verify"
      stageNote={<p className="text-[15px] font-semibold leading-[23px]">Once you&apos;re verified, sign in and pick up where you left off.</p>}
    >
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e4dfff]">
        <Mail className="h-7 w-7 text-[#5440e8]" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h1 className={`mt-[22px] ${authH1SmCls}`}>Verify your email.</h1>
      <p className={authLeadCls}>One-time check — usually finishes in a second or two.</p>
      <Suspense fallback={<p className="mt-6 text-[14px] text-[#66647c]">Loading…</p>}>
        <VerifyInner />
      </Suspense>
    </AuthLayout>
  );
}
