"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

type Setup = { secret: string; uri: string; svg: string };

/** Authenticator setup (QR + key, then a code) or the per-browser code check. */
export function TwoFactorForm({ mode, email }: { mode: "setup" | "verify"; email: string }) {
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode !== "setup") return;
    let alive = true;
    void fetch("/api/admin-panel/2fa/setup", { method: "POST" })
      .then(async (r) => {
        const j = await r.json();
        if (!alive) return;
        if (r.ok) setSetup(j as Setup);
        else setError(j.error ?? "Couldn't start setup.");
      })
      .catch(() => alive && setError("Couldn't start setup."));
    return () => {
      alive = false;
    };
  }, [mode]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await fetch("/api/admin-panel/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(false);
    if (r?.ok) {
      router.replace("/admin-panel");
      router.refresh();
    } else {
      setError(j.error ?? "Something went wrong. Try again.");
      setCode("");
    }
  }

  return (
    <div className="w-full max-w-[460px] rounded-[28px] bg-white p-8 shadow-[0_24px_48px_-20px_rgba(36,24,120,.35)]">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4dfff] text-[#3a2bb8]">
        <ShieldCheck className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-4 text-[26px] font-extrabold tracking-[-0.02em]">
        {mode === "setup" ? "Set up two-factor sign-in" : "Enter your 6-digit code"}
      </h1>
      <p className="mt-2 text-[15px] leading-[1.55] text-[#4a4862]">
        {mode === "setup"
          ? "The admin panel needs a code from an authenticator app (Google Authenticator, 1Password, Authy…). Scan the code, then enter the 6 digits it shows."
          : `Open your authenticator app and enter the code for LaunchCV Admin (${email}).`}
      </p>

      {mode === "setup" ? (
        <div className="mt-5 rounded-2xl bg-[#f7f6fb] p-4">
          {setup ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <div
                className="h-[160px] w-[160px] shrink-0 overflow-hidden rounded-xl bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
                role="img"
                aria-label="QR code for your authenticator app"
                dangerouslySetInnerHTML={{ __html: setup.svg }}
              />
              <div className="min-w-0 text-[13px] leading-[1.5] text-[#4a4862]">
                <p className="font-semibold text-[#121226]">Can&apos;t scan? Enter this key:</p>
                <p className="mt-1 break-all font-mono text-[14px] text-[#121226]">{setup.secret}</p>
                <a href={setup.uri} className="mt-2 inline-block font-semibold text-[#5440e8] underline">
                  Open in authenticator app
                </a>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#66647c]">{error ? "" : "Preparing your code…"}</p>
          )}
        </div>
      ) : null}

      <form onSubmit={submit} className="mt-5">
        <label htmlFor="totp" className="block text-[13px] font-semibold text-[#4a4862]">
          6-digit code
        </label>
        <input
          id="totp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1.5 h-[52px] w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] px-4 font-mono text-[20px] tracking-[0.3em] outline-none focus:border-[#5440e8]"
          required
          autoFocus
        />
        {error ? (
          <p role="alert" className="mt-2 text-[14px] text-[#c42b30]">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || code.replace(/\D/g, "").length !== 6 || (mode === "setup" && !setup)}
          className="mt-4 h-[52px] w-full rounded-full bg-[#5440e8] text-[15px] font-semibold text-white transition hover:bg-[#4430d6] disabled:opacity-50"
        >
          {busy ? "Checking…" : mode === "setup" ? "Turn on and continue" : "Continue"}
        </button>
      </form>
      <p className="mt-4 text-center text-[12px] text-[#66647c]">Lost your phone? Ask an owner to reset your two-factor sign-in.</p>
    </div>
  );
}
