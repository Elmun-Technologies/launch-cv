"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { resetUser } from "@/lib/analytics-client";

const PORTAL_URL = process.env.NEXT_PUBLIC_POLAR_PORTAL_URL || "https://polar.sh/purchases";

/** Download a copy of the account's data, or delete the account. */
export function AccountDataSection({
  hasPassword,
  email,
  hasActiveSubscription,
}: {
  hasPassword: boolean;
  email: string;
  hasActiveSubscription: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function del(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hasPassword ? { password: confirm } : { confirmEmail: confirm }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setBusy(false);
    if (!res?.ok) {
      setErr(typeof j.error === "string" ? j.error : "Couldn't delete the account. Please try again.");
      return;
    }
    resetUser();
    window.location.href = "/";
  }

  return (
    <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#111111]">Your data</h2>
      <p className="mt-1 text-[14px] text-[#6B6B6B]">Download everything in your account, or delete it permanently.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/api/account/export" className="soha-btn-secondary">
          Download my data
        </a>
        <button type="button" onClick={() => setOpen((o) => !o)} className="soha-btn-secondary !text-[#B42318]">
          Delete account
        </button>
      </div>

      {open ? (
        <form onSubmit={del} className="mt-5 flex flex-col gap-3 rounded-xl border border-[#F6D3CD] bg-[#FDF2F0] p-4">
          <p className="text-[14px] text-[#111111]">
            This deletes your resumes, applications, contacts and reports. It can&apos;t be undone.
          </p>
          {hasActiveSubscription ? (
            <p className="text-[14px] text-[#111111]">
              <span className="font-medium">Cancel your subscription first</span> in the{" "}
              <a href={PORTAL_URL} target="_blank" rel="noreferrer" className="text-[#1D4ED8] underline">
                billing portal
              </a>{" "}
              — deleting the account doesn&apos;t stop payments.
            </p>
          ) : null}
          <label>
            <span className="soha-label mb-1.5">
              {hasPassword ? "Enter your password to confirm" : `Type ${email} to confirm`}
            </span>
            <input
              type={hasPassword ? "password" : "email"}
              autoComplete={hasPassword ? "current-password" : "off"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="soha-input"
            />
          </label>
          {err ? (
            <p role="alert" className="text-[14px] text-[#B42318]">
              {err}
            </p>
          ) : null}
          <div>
            <button
              type="submit"
              disabled={busy || !confirm.trim()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#B42318] px-5 text-[14px] font-medium text-white hover:bg-[#912018] disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Delete my account
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
