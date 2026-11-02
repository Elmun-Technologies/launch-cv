"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { PUBLIC_PLANS } from "@/lib/monetization";
import {
  Badge,
  FormStatus,
  PageHeader,
  SettingsTabs,
  btnSmDark,
  btnSmSoft,
  cardCls,
  cardLeadCls,
  cardTitleCls,
  fieldLabelCls,
  inlineLinkCls,
  inputCls,
} from "@/components/app/account/ui";
import { AccountDataSection } from "./account-data-section";

type Sub = { status: string; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; lifetime: boolean } | null;
type Msg = { ok: boolean; text: string } | null;

function Card({ title, sub, children, className = "" }: { title: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`${cardCls} ${className}`}>
      <h2 className={cardTitleCls}>{title}</h2>
      {sub ? <p className={cardLeadCls}>{sub}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1.5">
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        className={`${inputCls} pr-12`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-0.5 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-[#66647c] transition-colors hover:text-[#121226] focus-visible:outline-offset-0!"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-[18px] w-[18px]" aria-hidden /> : <Eye className="h-[18px] w-[18px]" aria-hidden />}
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
    <div className="mx-auto w-full max-w-[1160px] pb-12">
      <PageHeader title="Settings" lead="Your profile, sign-in and data." />
      <SettingsTabs current="/dashboard/settings" />

      <div className="mt-5 grid items-start gap-4 sm:gap-5 lg:grid-cols-2">
        <Card title="Profile">
          <form onSubmit={saveName} className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="settings-name" className={fieldLabelCls}>
                Full name
              </label>
              <input
                id="settings-name"
                className={`${inputCls} mt-1.5`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                autoComplete="name"
              />
            </div>
            <div>
              <p className={`${fieldLabelCls} flex items-center justify-between gap-3`}>
                Email
                {emailVerified ? (
                  <Badge tone="green">
                    <Check className="-mt-px mr-1 inline h-3 w-3" aria-hidden strokeWidth={3} />
                    Verified
                  </Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    <Badge tone="amber">Not verified</Badge>
                    <Link href="/auth/verify-email" className={`${inlineLinkCls} text-[13px]`}>
                      Verify now
                    </Link>
                  </span>
                )}
              </p>
              <p
                className="mt-1.5 flex h-12 items-center truncate rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-[#f7f6fb] px-4 text-[15px] text-[#121226]"
              >
                <span className="truncate">{userEmail}</span>
              </p>
              <p className="mt-1.5 text-[13px] leading-[19px] text-[#66647c]">
                To change your email, write to{" "}
                <a href="mailto:support@launch-cv.com" className={inlineLinkCls}>
                  support@launch-cv.com
                </a>
                .
              </p>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button type="submit" disabled={savingName} className={btnSmDark}>
                {savingName ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save changes
              </button>
              <FormStatus msg={nameMsg} />
            </div>
          </form>
        </Card>

        <Card
          title="Password"
          sub={havePassword ? "Change the password you use with your email." : "Add a password so you can also sign in with your email."}
        >
          {googleLinked ? (
            <p className="mb-4 flex items-center gap-2.5 rounded-2xl bg-[#f7f6fb] px-4 py-3 text-[14px] text-[#24223a]">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dcf5ea] text-[#0b7a4f]">
                <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={3} />
              </span>
              Google sign-in is connected.
            </p>
          ) : null}
          <form onSubmit={savePassword} className="flex flex-col gap-3.5">
            {havePassword ? (
              <div>
                <label htmlFor="settings-pw-current" className={fieldLabelCls}>
                  Current password
                </label>
                <PasswordInput id="settings-pw-current" value={currentPassword} onChange={setCurrentPassword} autoComplete="current-password" />
              </div>
            ) : null}
            <div>
              <label htmlFor="settings-pw-new" className={fieldLabelCls}>
                {havePassword ? "New password" : "Password"}
              </label>
              <PasswordInput id="settings-pw-new" value={newPassword} onChange={setNewPassword} autoComplete="new-password" />
            </div>
            <div>
              <label htmlFor="settings-pw-repeat" className={fieldLabelCls}>
                Repeat it
              </label>
              <PasswordInput id="settings-pw-repeat" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="submit"
                disabled={savingPw || !newPassword || (havePassword && !currentPassword)}
                className={btnSmDark}
              >
                {savingPw ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                {havePassword ? "Update password" : "Set password"}
              </button>
              <FormStatus msg={pwMsg} />
            </div>
          </form>
        </Card>

        <section className={`${cardCls} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:col-span-2`}>
          <div className="min-w-0">
            <h2 className={cardTitleCls}>Plan</h2>
            <p className={cardLeadCls}>
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
          </div>
          <Link href="/dashboard/settings/subscription" className={`${btnSmSoft} shrink-0 self-start sm:self-auto`}>
            {paid ? "Manage plan" : "See plans"}
          </Link>
        </section>

        <AccountDataSection hasPassword={havePassword} email={userEmail} hasActiveSubscription={!!renews} />
      </div>
    </div>
  );
}
