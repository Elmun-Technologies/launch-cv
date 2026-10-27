"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { AccountDataSection } from "./account-data-section";

type Sub = { status: string; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; lifetime: boolean } | null;
type Msg = { ok: boolean; text: string } | null;

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
      <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
      {sub ? <p className="mt-1 text-[14px] text-[#6B6B6B]">{sub}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Status({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p role={msg.ok ? "status" : "alert"} className={`text-[14px] ${msg.ok ? "text-[#0E7A48]" : "text-[#B42318]"}`}>
      {msg.text}
    </p>
  );
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className="soha-input pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A86] hover:text-[#111111]"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function SettingsClient({
  subscription,
  userName,
  userEmail,
  emailVerified = false,
  hasPassword = true,
  googleLinked = false,
}: {
  emailVerified?: boolean;
  hasPassword?: boolean;
  googleLinked?: boolean;
  subscription: Sub;
  userName?: string | null;
  userEmail: string;
}) {
  const paid = subscriptionRowGrantsPaid(
    subscription
      ? { status: subscription.status, currentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null }
      : null,
  );
  const renews = paid && subscription && !subscription.lifetime && !subscription.cancelAtPeriodEnd;

  const [name, setName] = useState(userName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<Msg>(null);

  const [havePassword, setHavePassword] = useState(hasPassword);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<Msg>(null);

  async function patch(body: Record<string, string>): Promise<Msg> {
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    if (res?.ok) return null;
    const j = res ? await res.json().catch(() => ({})) : {};
    return { ok: false, text: typeof j.error === "string" ? j.error : "Couldn't save. Please try again." };
  }

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setSavingName(true);
    setNameMsg(null);
    const err = await patch({ name: name.trim() });
    setSavingName(false);
    setNameMsg(err ?? { ok: true, text: "Saved." });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword.length < 8) return setPwMsg({ ok: false, text: "Use at least 8 characters." });
    if (newPassword !== confirmPassword) return setPwMsg({ ok: false, text: "The two passwords don't match." });
    setSavingPw(true);
    const err = await patch(havePassword ? { currentPassword, newPassword } : { newPassword });
    setSavingPw(false);
    if (err) return setPwMsg(err);
    setPwMsg({ ok: true, text: havePassword ? "Password updated." : "Password set. You can now sign in with your email too." });
    setHavePassword(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">Settings</h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">Your profile, sign-in and data.</p>
      </div>

      <Card title="Profile">
        <form onSubmit={saveName} className="flex flex-col gap-4">
          <label>
            <span className="soha-label mb-1.5">Full name</span>
            <input
              className="soha-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              autoComplete="name"
            />
          </label>
          <div>
            <span className="soha-label mb-1.5">Email</span>
            <div className="flex h-[42px] items-center justify-between gap-3 rounded-[10px] border border-[#EEEEEB] bg-[#FAFAF9] px-3 text-[14px] text-[#3F3F3F]">
              <span className="truncate">{userEmail}</span>
              {emailVerified ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-[13px] text-[#0E7A48]">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Verified
                </span>
              ) : (
                <span className="shrink-0 text-[13px] text-[#B2610A]">Not verified</span>
              )}
            </div>
            <p className="mt-1.5 text-[13px] text-[#8A8A86]">
              To change your email, write to{" "}
              <a href="mailto:support@launch-cv.com" className="text-[#1D4ED8] hover:underline">
                support@launch-cv.com
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" disabled={savingName} className="soha-btn-primary inline-flex items-center gap-2 disabled:opacity-60">
              {savingName ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Save
            </button>
            <Status msg={nameMsg} />
          </div>
        </form>
      </Card>

      <Card
        title="Sign-in"
        sub={havePassword ? "Change the password you use with your email." : "Add a password so you can also sign in with your email."}
      >
        {googleLinked ? (
          <p className="mb-5 flex items-center gap-2 rounded-[10px] border border-[#EEEEEB] bg-[#FAFAF9] px-3 py-2.5 text-[14px] text-[#3F3F3F]">
            <Check className="h-4 w-4 shrink-0 text-[#0E7A48]" aria-hidden />
            Google sign-in is connected.
          </p>
        ) : null}
        <form onSubmit={savePassword} className="flex flex-col gap-4">
          {havePassword ? (
            <label>
              <span className="soha-label mb-1.5">Current password</span>
              <PasswordInput value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
            </label>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="soha-label mb-1.5">{havePassword ? "New password" : "Password"}</span>
              <PasswordInput value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </label>
            <label>
              <span className="soha-label mb-1.5">Repeat it</span>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={savingPw || !newPassword || (havePassword && !currentPassword)}
              className="soha-btn-primary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {savingPw ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {havePassword ? "Update password" : "Set password"}
            </button>
            <Status msg={pwMsg} />
          </div>
        </form>
      </Card>

      <Card title="Plan">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-[#3F3F3F]">
            {!paid ? (
              <>No plan yet. Plans start at {PUBLIC_PLANS.starter.priceDisplay}/month.</>
            ) : subscription?.lifetime ? (
              <>Lifetime access.</>
            ) : subscription?.currentPeriodEnd ? (
              <>
                {renews ? "Renews" : "Active until"} {fmtDate(subscription.currentPeriodEnd)}.
              </>
            ) : (
              <>Active.</>
            )}
          </p>
          <Link href="/dashboard/settings/subscription" className="soha-btn-secondary shrink-0 text-center">
            {paid ? "Manage plan" : "See plans"}
          </Link>
        </div>
      </Card>

      <AccountDataSection hasPassword={havePassword} email={userEmail} hasActiveSubscription={!!renews} />
    </div>
  );
}
