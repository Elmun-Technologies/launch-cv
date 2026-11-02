"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { AuthNotice, authDarkBtnCls, authInlineLinkCls } from "@/components/auth-layout";

/** Consumes the token from the verification email. */
export function VerifyToken({ token }: { token: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => null);
      const j = res ? await res.json().catch(() => ({})) : {};
      if (!live) return;
      if (!res?.ok) {
        setErr(j.error ?? "Couldn't verify the email. The link may be expired.");
        return;
      }
      setMsg("Your email is verified.");
    })();
    return () => {
      live = false;
    };
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
