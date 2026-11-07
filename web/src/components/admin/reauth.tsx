"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { siteFontVars } from "@/lib/site-fonts";

const fieldCls =
  "mt-1.5 block h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] font-normal text-[#121226] outline-none transition-[border-color,box-shadow] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none!";

/**
 * Sensitive admin calls (keys, limits, roles) answer 401 `reauth_required`
 * unless the admin confirmed password + code in the last 5 minutes.
 * `useAdminFetch()` asks for them in a dialog and retries once.
 *
 * Pass `{ action: "save the OpenAI key", keyChange: true }` as the third
 * argument so the dialog says what is being confirmed, and (when the
 * "email the owner on every key change" rule is on) that owners are emailed.
 */

export type ReauthIntent = {
  /** Finishes the sentence "Confirm to …", e.g. "save the OpenAI key". */
  action?: string;
  /** An integration key change: owners are emailed when that rule is on. */
  keyChange?: boolean;
};

type Ask = (intent?: ReauthIntent) => Promise<boolean>;
const Ctx = createContext<Ask | null>(null);

export function ReauthProvider({
  children,
  hasPassword,
  hasTotp,
  emailOwnerOnKeyChange = false,
}: {
  children: React.ReactNode;
  hasPassword: boolean;
  hasTotp: boolean;
  /** Admin → Security rule "Email the owner on every key change" is on. */
  emailOwnerOnKeyChange?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<ReauthIntent>({});
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const ask = useCallback<Ask>((next) => {
    setIntent(next ?? {});
    setPassword("");
    setCode("");
    setUseRecovery(false);
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

  const owners = !!intent.keyChange && emailOwnerOnKeyChange;

  return (
    <Ctx.Provider value={ask}>
      {children}
      {open ? (
        // z-[70]: above the cookie banner (z-50) and the admin shell's overlays.
        <div
          className={`lc-site ${siteFontVars} fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#111118]/45 px-4 py-6`}
          onClick={() => close(false)}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="reauth-title"
            aria-describedby="reauth-desc"
            onSubmit={confirm}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") close(false);
            }}
            className="w-full max-w-[460px] rounded-[28px] bg-white p-6 text-[#121226] shadow-[0_40px_80px_-30px_rgba(10,6,60,.6)] sm:p-8"
          >
            <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#e4dfff] text-[#3a2bb8]">
              <ShieldCheck className="h-6 w-6" aria-hidden />
            </span>
            <h2 id="reauth-title" className="mt-4 text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em]">
              Confirm it&apos;s you
            </h2>
            <p id="reauth-desc" className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">
              {intent.action ? (
                <>
                  Confirm to <b className="font-bold text-[#121226]">{intent.action}</b>.{" "}
                </>
              ) : (
                <>This change affects keys, limits or access. </>
              )}
              It&apos;s written to the audit log.
              {owners ? <span className="mt-1 block">The owner is emailed about this change.</span> : null}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {hasPassword ? (
                <label className="block text-[13px] font-bold text-[#4a4862]">
                  Password
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={fieldCls}
                    required
                    autoFocus
                  />
                </label>
              ) : null}
              {hasTotp ? (
                <div>
                  <label className="block text-[13px] font-bold text-[#4a4862]">
                    {useRecovery ? "Recovery code" : "6-digit code from your authenticator"}
                    {useRecovery ? (
                      <input
                        key="recovery"
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={16}
                        placeholder="xxxxx-xxxxx"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`${fieldCls} font-mono text-[18px]! tracking-[0.12em]`}
                        required
                        autoFocus
                      />
                    ) : (
                      <input
                        key="totp"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={7}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className={`${fieldCls} font-mono text-[18px]! tracking-[0.25em]`}
                        required
                        autoFocus={!hasPassword}
                      />
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setUseRecovery((v) => !v);
                      setCode("");
                    }}
                    className="mt-1.5 inline-flex min-h-[44px] items-center text-[13px] font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-[28px]"
                  >
                    {useRecovery ? "Use your authenticator code" : "Use a recovery code instead"}
                  </button>
                </div>
              ) : null}
            </div>
            {error ? (
              <p role="alert" className="mt-3 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#a3222a]">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="lc-btn-lift h-[52px] flex-1 rounded-full bg-[#f1eff8] text-[15px] font-semibold text-[#121226] hover:bg-[#e4dfff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="lc-btn-lift h-[52px] flex-1 rounded-full bg-[#5440e8] text-[15px] font-semibold text-white hover:bg-[#4430d6] disabled:pointer-events-none disabled:opacity-60"
              >
                {busy ? "Checking…" : "Confirm"}
              </button>
            </div>
            <p className="mt-4 text-center text-[12px] leading-[1.5] text-[#66647c]">Valid for 5 minutes. 5 wrong tries lock admin access for 15 minutes.</p>
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
    async (url: string, init?: RequestInit, intent?: ReauthIntent): Promise<Response> => {
      const r = await fetch(url, init);
      if (r.status !== 401 || !ask) return r;
      const j = await r.clone().json().catch(() => ({}));
      if (j.code !== "reauth_required") return r;
      if (!(await ask(intent))) return r;
      return fetch(url, init);
    },
    [ask],
  );
}
