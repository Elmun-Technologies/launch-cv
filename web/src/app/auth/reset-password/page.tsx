"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  AuthBackLink,
  AuthLayout,
  AuthNotice,
  authEyeBtnCls,
  authH1SmCls,
  authInputCls,
  authLabelCls,
  authLeadCls,
  authSubmitCls,
} from "@/components/auth-layout";

function Form() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) {
      setErr("The two passwords don't match.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setErr(j.error ?? "Couldn't reset password. The link may be expired.");
      return;
    }
    if (j.signedIn) {
      // Keep the button in its busy state while the dashboard loads.
      router.replace("/dashboard");
      router.refresh();
      return;
    }
    setLoading(false);
    setOk(true);
  }

  if (!token) {
    return (
      <AuthNotice tone="error" title="Invalid or expired link" className="mt-6">
        <Link href="/auth/forgot-password" className="mt-1 inline-block font-bold underline underline-offset-2 hover:no-underline">
          Request a new one
        </Link>
      </AuthNotice>
    );
  }

  if (ok) {
    return (
      <AuthNotice tone="success" title="Password updated" className="mt-6">
        <Link href="/login" className="mt-1 inline-block font-bold underline underline-offset-2 hover:no-underline">
          Sign in →
        </Link>
      </AuthNotice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <label htmlFor="reset-password" className={authLabelCls}>
        New password
      </label>
      <div className="relative">
        <input
          id="reset-password"
          type={showPw ? "text" : "password"}
          required
          minLength={8}
          className={`${authInputCls} pr-14`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="••••••••"
          aria-describedby={err ? "reset-hint reset-error" : "reset-hint"}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPw ? "Hide password" : "Show password"}
          className={`${authEyeBtnCls} mt-[3px]`}
          onClick={() => setShowPw((s) => !s)}
        >
          {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <label htmlFor="reset-confirm" className={`${authLabelCls} mt-4`}>
        Confirm password
      </label>
      <input
        id="reset-confirm"
        type={showPw ? "text" : "password"}
        required
        minLength={8}
        className={authInputCls}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        placeholder="••••••••"
        aria-invalid={err && password !== confirm ? true : undefined}
        aria-describedby={err ? "reset-error" : undefined}
      />

      {err ? (
        <div id="reset-error" className="mt-4">
          <AuthNotice tone="error">
            <p>{err}</p>
          </AuthNotice>
        </div>
      ) : null}

      <button type="submit" disabled={loading} className={`${authSubmitCls} mt-[22px]`}>
        {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
        {loading ? "Saving…" : "Save and sign in"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      mode="recover"
      stageNote={<p className="text-[15px] font-semibold leading-[23px]">Devices you&apos;re already signed in on stay signed in.</p>}
    >
      <AuthBackLink />
      <h1 className={`mt-[22px] ${authH1SmCls}`}>Choose a new password.</h1>
      <p id="reset-hint" className={authLeadCls}>
        At least 8 characters.
      </p>
      <Suspense fallback={<p className="mt-6 text-[14px] text-[#66647c]">Loading…</p>}>
        <Form />
      </Suspense>
    </AuthLayout>
  );
}
