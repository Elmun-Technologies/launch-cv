"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function Form() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(j.error ?? "Error");
      return;
    }
    setOk(true);
  }

  if (!token) {
    return <p className="text-sm text-red-400">Invalid or expired link.</p>;
  }

  if (ok) {
    return (
      <p className="text-sm text-emerald-400">
        Password updated.{" "}
        <Link className="underline" href="/login">
          Sign in
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs text-zinc-400">New password (min 8)</span>
        <input
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <button
        type="submit"
        className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500"
      >
        Save
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/login" className="text-sm text-emerald-400 hover:underline">
        ← Sign in
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">New password</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-zinc-500">Loading...</p>}>
        <Form />
      </Suspense>
    </main>
  );
}
