"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AuthBackLink,
  AuthLayout,
  AuthNotice,
  authH1SmCls,
  authInputCls,
  authLabelCls,
  authLeadCls,
  authSubmitCls,
} from "@/components/auth-layout";

export default function ResendVerifyPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    await fetch("/api/auth/resend-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setMsg("If the email is registered and not yet verified, a verification email will be sent shortly.");
  }

  return (
    <AuthLayout mode="verify">
      <AuthBackLink />
      <h1 className={`mt-[22px] ${authH1SmCls}`}>Resend verification email.</h1>
      <p className={authLeadCls}>Didn&apos;t get the email? We&apos;ll send a fresh link to your inbox.</p>

      <form onSubmit={onSubmit} className="mt-6">
        <label htmlFor="resend-email" className={authLabelCls}>
          Email
        </label>
        <input
          id="resend-email"
          type="email"
          required
          className={authInputCls}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
        />

        <button type="submit" disabled={loading} className={`${authSubmitCls} mt-[22px]`}>
          {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
          {loading ? "Sending…" : "Resend verification email"}
        </button>
      </form>

      <div aria-live="polite">
        {msg ? (
          <AuthNotice tone="success" announce={false} className="mt-5">
            <p>{msg}</p>
          </AuthNotice>
        ) : null}
      </div>
    </AuthLayout>
  );
}
