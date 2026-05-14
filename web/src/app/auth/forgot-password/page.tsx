"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";

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
    <AuthLayout mode="login">
      <div className="mb-7">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A56DB] hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.1] tracking-tight text-[#0F172A]">
          Reset your password
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#64748B]">
          Enter the email on your account and we&apos;ll send a reset link. The link expires in 60 minutes.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-[#475569]">Email</label>
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

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F172A] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      {msg ? (
        <div className="mt-5 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <p className="text-[13px] leading-[1.5] text-emerald-800">{msg}</p>
        </div>
      ) : null}
    </AuthLayout>
  );
}
