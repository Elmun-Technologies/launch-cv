"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResendVerifyPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    await fetch("/api/auth/resend-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg("If the email is registered and not yet verified, a verification email will be sent.");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <Link href="/login" className="text-sm text-emerald-400 hover:underline">
        ← Sign in
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">Resend verification email</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs text-zinc-400">Email</span>
          <input
            type="email"
            required
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          Submit
        </button>
      </form>
      {msg ? <p className="mt-4 text-sm text-zinc-400">{msg}</p> : null}
    </main>
  );
}
