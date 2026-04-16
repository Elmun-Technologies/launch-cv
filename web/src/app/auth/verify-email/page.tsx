"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyInner() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setErr("Token is missing"));
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
        setErr(j.error ?? "Error");
        return;
      }
      setMsg("Email verified. You can now sign in.");
    })();
  }, [token]);

  return (
    <div className="mt-8">
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      {msg ? (
        <p className="text-sm text-emerald-400">
          {msg}{" "}
          <Link className="underline" href="/login">
            Sign in
          </Link>
        </p>
      ) : !err ? (
        <p className="text-sm text-zinc-500">Verifying...</p>
      ) : null}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/" className="text-sm text-emerald-400 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">Verify email</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-zinc-500">Loading...</p>}>
        <VerifyInner />
      </Suspense>
    </main>
  );
}
