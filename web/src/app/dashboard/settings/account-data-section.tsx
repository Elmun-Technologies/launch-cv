"use client";

import { useState } from "react";
import { usePortalUrl } from "@/lib/public-config";
import { Download, Loader2 } from "lucide-react";
import { resetUser } from "@/lib/analytics-client";
import {
  btnSmDanger,
  btnSmDangerSoft,
  btnSmSoft,
  cardCls,
  cardLeadCls,
  cardTitleCls,
  fieldLabelCls,
  inlineLinkCls,
  inputCls,
} from "@/components/app/account/ui";

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
  const portalUrl = usePortalUrl();
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
    <section className={`${cardCls} lg:col-span-2`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 className={cardTitleCls}>Your data</h2>
          <p className={cardLeadCls}>Download everything in your account, or delete it permanently.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/account/export" className={btnSmSoft}>
            <Download className="h-4 w-4" aria-hidden />
            Download my data
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="delete-account-form"
            className={btnSmDangerSoft}
          >
            Delete account
          </button>
        </div>
      </div>

      {open ? (
        <form id="delete-account-form" onSubmit={del} className="mt-5 flex flex-col gap-3.5 rounded-[20px] bg-[#fdf3f3] p-4 sm:p-5">
          <p className="text-[14px] leading-[21px] text-[#121226]">
            This deletes your resumes, applications, contacts and reports. It can&apos;t be undone.
          </p>
          {hasActiveSubscription ? (
            <p className="text-[14px] leading-[21px] text-[#121226]">
              <span className="font-bold">Cancel your subscription first</span> in the{" "}
              <a href={portalUrl} target="_blank" rel="noreferrer" className={inlineLinkCls}>
                billing portal
              </a>{" "}
              — deleting the account doesn&apos;t stop payments.
            </p>
          ) : null}
          <div className="max-w-[440px]">
            <label htmlFor="delete-confirm" className={fieldLabelCls}>
              {hasPassword ? "Enter your password to confirm" : `Type ${email} to confirm`}
            </label>
            <input
              id="delete-confirm"
              type={hasPassword ? "password" : "email"}
              autoComplete={hasPassword ? "current-password" : "off"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputCls} mt-1.5`}
            />
          </div>
          {err ? (
            <p role="alert" className="text-[14px] font-semibold text-[#a3262b]">
              {err}
            </p>
          ) : null}
          <div>
            <button type="submit" disabled={busy || !confirm.trim()} className={btnSmDanger}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Delete my account
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
