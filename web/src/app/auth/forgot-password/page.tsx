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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setMsg("If the email is registered, a password reset link will be sent shortly.");
  }

  return (
    <AuthLayout mode="recover">
      <AuthBackLink />
      <h1 className={`mt-[22px] ${authH1SmCls}`}>Reset your password.</h1>
      <p className={authLeadCls}>Enter the email on your account and we&apos;ll send a reset link. The link expires in 60 minutes.</p>

      <form onSubmit={onSubmit} className="mt-6">
        <label htmlFor="forgot-email" className={authLabelCls}>
          Email
        </label>
        <input
          id="forgot-email"
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
          {loading ? "Sending…" : "Send reset link"}
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
