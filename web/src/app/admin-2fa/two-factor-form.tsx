"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { RecoveryCodesList } from "@/components/admin/recovery-codes-list";

type Setup = { secret: string; uri: string; svg: string };

const inputCls =
  "lc-mono mt-1.5 h-[52px] w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[20px] text-[#121226] outline-none transition-[border-color,box-shadow] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none!";

/** Authenticator setup (QR + key, then a code, then recovery codes) or the per-browser code check. */
export function TwoFactorForm({ mode, email }: { mode: "setup" | "verify"; email: string }) {
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [codes, setCodes] = useState<string[] | null>(null);

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

  function enter() {
    router.replace("/admin-panel");
    router.refresh();
  }

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
      // Enrollment returns one-time recovery codes: show them before going on.
      if (Array.isArray(j.recoveryCodes) && j.recoveryCodes.length) setCodes(j.recoveryCodes);
      else enter();
    } else {
      setError(j.error ?? "Something went wrong. Try again.");
      setCode("");
    }
  }

  if (codes) {
    return (
      <div className="lc-float w-full max-w-[520px] rounded-[28px] bg-white p-6 sm:p-8">
        <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#dcf5ea] text-[#0b4f35]">
          <ShieldCheck className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-4 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">Save your recovery codes</h1>
        <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">
          Two-factor sign-in is on. If you lose your phone, each of these codes signs you in once instead of the 6 digits. They
          won&apos;t be shown again — store them in your password manager.
        </p>
        <RecoveryCodesList codes={codes} email={email} />
        <button
          type="button"
          onClick={enter}
          className="lc-btn-lift mt-5 h-[54px] w-full rounded-full bg-[#5440e8] text-[16px] font-semibold text-white hover:bg-[#4430d6] focus-visible:rounded-full!"
        >
          I saved them — continue
        </button>
      </div>
    );
  }

  const valid = useRecovery ? code.replace(/[\s-]/g, "").length === 10 : code.replace(/\D/g, "").length === 6;

  return (
    <div className="lc-float w-full max-w-[480px] rounded-[28px] bg-white p-6 sm:p-8">
      <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#e4dfff] text-[#3a2bb8]">
        <ShieldCheck className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-4 text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
        {mode === "setup" ? "Set up two-factor sign-in" : useRecovery ? "Enter a recovery code" : "Enter your 6-digit code"}
      </h1>
      <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">
        {mode === "setup"
          ? "The admin panel needs a code from an authenticator app (Google Authenticator, 1Password, Authy…). Scan the code, then enter the 6 digits it shows."
          : useRecovery
            ? "Each recovery code works once. You saved them when you turned on two-factor sign-in."
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
                <p className="lc-mono mt-1 break-all text-[14px] text-[#121226]">{setup.secret}</p>
                <a href={setup.uri} className="mt-2 inline-flex min-h-[44px] items-center font-bold text-[#5440e8] underline underline-offset-2 hover:text-[#3a2bb8] sm:min-h-0">
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
        <label htmlFor="totp" className="block text-[13px] font-bold text-[#4a4862]">
          {useRecovery ? "Recovery code" : "6-digit code"}
        </label>
        {useRecovery ? (
          <input
            key="recovery"
            id="totp"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={16}
            placeholder="xxxxx-xxxxx"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputCls} tracking-[0.12em]`}
            required
            autoFocus
          />
        ) : (
          <input
            key="totp"
            id="totp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${inputCls} tracking-[0.3em]`}
            required
            autoFocus
          />
        )}
        {error ? (
          <p role="alert" className="mt-3 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#a3222a]">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !valid || (mode === "setup" && !setup)}
          className="lc-btn-lift mt-4 h-[54px] w-full rounded-full bg-[#5440e8] text-[16px] font-semibold text-white hover:bg-[#4430d6] focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-50"
        >
          {busy ? "Checking…" : mode === "setup" ? "Turn on and continue" : "Continue"}
        </button>
      </form>
      {mode === "verify" ? (
        <p className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setUseRecovery((v) => !v);
              setCode("");
              setError(null);
            }}
            className="inline-flex min-h-[44px] items-center text-[14px] font-bold text-[#5440e8] hover:text-[#3a2bb8]"
          >
            {useRecovery ? "Use your authenticator code" : "Lost your phone? Use a recovery code"}
          </button>
        </p>
      ) : null}
      <p className="mt-2 text-center text-[12px] text-[#66647c]">No recovery codes left? Ask an owner to reset your two-factor sign-in.</p>
    </div>
  );
}
