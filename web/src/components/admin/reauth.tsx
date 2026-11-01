"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

/**
 * Sensitive admin calls (keys, limits, roles) answer 401 `reauth_required`
 * unless the admin confirmed password + code in the last 5 minutes.
 * `useAdminFetch()` asks for them in a dialog and retries once.
 */

type Ask = () => Promise<boolean>;
const Ctx = createContext<Ask | null>(null);

export function ReauthProvider({ children, hasPassword, hasTotp }: { children: React.ReactNode; hasPassword: boolean; hasTotp: boolean }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const ask = useCallback<Ask>(() => {
    setPassword("");
    setCode("");
    setError(null);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function close(ok: boolean) {
    setOpen(false);
    resolver.current?.(ok);
    resolver.current = null;
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await fetch("/api/admin-panel/reauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, code }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(false);
    if (r?.ok) close(true);
    else setError(j.error ?? "Couldn't confirm. Try again.");
  }

  return (
    <Ctx.Provider value={ask}>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111118]/50 px-4" onClick={() => close(false)}>
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="reauth-title"
            onSubmit={confirm}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-[28px] bg-white p-7 shadow-[0_40px_80px_-30px_rgba(10,6,60,.6)]"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e4dfff] text-[#3a2bb8]">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="reauth-title" className="mt-3 text-[22px] font-extrabold">
              Confirm it&apos;s you
            </h2>
            <p className="mt-1 text-[14px] leading-[1.55] text-[#4a4862]">
              This change affects keys, limits or access. It&apos;s written to the audit log.
            </p>
            {hasPassword ? (
              <label className="mt-4 block text-[13px] font-semibold text-[#4a4862]">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] px-4 text-[15px] font-normal text-[#121226] outline-none focus:border-[#5440e8]"
                  required
                  autoFocus
                />
              </label>
            ) : null}
            {hasTotp ? (
              <label className="mt-3 block text-[13px] font-semibold text-[#4a4862]">
                6-digit code from your authenticator
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={7}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1.5 h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] px-4 font-mono text-[17px] tracking-[0.25em] text-[#121226] outline-none focus:border-[#5440e8]"
                  required
                  autoFocus={!hasPassword}
                />
              </label>
            ) : null}
            {error ? (
              <p role="alert" className="mt-2 text-[13px] text-[#c42b30]">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => close(false)} className="h-12 flex-1 rounded-full bg-[#f1eff8] text-[15px] font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={busy} className="h-12 flex-1 rounded-full bg-[#5440e8] text-[15px] font-semibold text-white hover:bg-[#4430d6] disabled:opacity-60">
                {busy ? "Checking…" : "Confirm"}
              </button>
            </div>
            <p className="mt-3 text-center text-[12px] text-[#66647c]">Valid for 5 minutes. 5 wrong tries lock admin access for 15 minutes.</p>
          </form>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

/** fetch() for admin APIs that transparently asks for re-confirmation when needed. */
export function useAdminFetch() {
  const ask = useContext(Ctx);
  return useCallback(
    async (url: string, init?: RequestInit): Promise<Response> => {
      const r = await fetch(url, init);
      if (r.status !== 401 || !ask) return r;
      const j = await r.clone().json().catch(() => ({}));
      if (j.code !== "reauth_required") return r;
      if (!(await ask())) return r;
      return fetch(url, init);
    },
    [ask],
  );
}
