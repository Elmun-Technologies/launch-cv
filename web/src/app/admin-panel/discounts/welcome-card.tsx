"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Settings } from "@/lib/app-settings";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, FormField } from "@/components/admin/form-field";
import { useAdminFetch } from "@/components/admin/reauth";
import { adminBtnDark, adminBtnSoft } from "@/components/admin/admin-ui";
import { focusRing } from "@/components/admin/v5/ui";
import type { WinbackStats } from "./winback-card";

type Marketing = Settings["marketing"];

/**
 * Admin → Discounts → Welcome offer: a personal code emailed once a new account's
 * email is confirmed. Same settings group as win-back ("marketing"; the postal
 * address is shared), saved with re-confirm and audit.
 */
export function WelcomeCard({ marketing, stats }: { marketing: Marketing; stats: WinbackStats }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [enabled, setEnabled] = useState(marketing.welcomeEnabled);
  const [num, setNum] = useState({ percent: String(marketing.welcomePercent), hours: String(marketing.welcomeValidHours) });
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy("save");
    setMsg(null);
    const next: Marketing = { ...marketing, welcomeEnabled: enabled, welcomePercent: Number(num.percent), welcomeValidHours: Number(num.hours) };
    const r = await adminFetch(
      "/api/admin-panel/settings/marketing",
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) },
      { action: "change the welcome offer" },
    ).catch(() => null);
    const j = (r ? await r.json().catch(() => ({})) : {}) as { value?: Marketing; error?: string };
    setBusy(null);
    if (r?.ok && j.value) {
      setEnabled(j.value.welcomeEnabled);
      setNum({ percent: String(j.value.welcomePercent), hours: String(j.value.welcomeValidHours) });
      setMsg({ ok: true, text: "Saved. New sign-ups get these settings." });
      router.refresh();
    } else {
      setMsg({ ok: false, text: j.error ?? "Couldn't save." });
    }
  }

  async function sendTest() {
    setBusy("test");
    setMsg(null);
    const r = await adminFetch("/api/admin-panel/discounts/welcome-test", { method: "POST" }, { action: "send a test welcome email" }).catch(() => null);
    const j = (r ? await r.json().catch(() => ({})) : {}) as { to?: string; error?: string };
    setBusy(null);
    setMsg(r?.ok ? { ok: true, text: `Test sent to ${j.to}. It uses the saved settings and a dummy code that doesn't work at checkout.` } : { ok: false, text: j.error ?? "Couldn't send the test." });
  }

  const noAddress = !marketing.postalAddress.trim();

  return (
    <SectionCard
      title="Welcome offer"
      description="One email to each new account, right after the email is confirmed (Google sign-ups: right away). It carries a personal single-use code. Someone holding a valid welcome code doesn't get the win-back email until it ends."
    >
      <div className="space-y-4">
        {noAddress ? (
          <p role="alert" className="rounded-2xl bg-[#fdf0d5] px-4 py-3 text-[14px] font-semibold text-[#7a4600]">
            Emails won&apos;t send until a postal address is set in Win-back email below (US CAN-SPAM)
          </p>
        ) : null}

        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f7f6fb] px-4 py-3">
            <dt className="text-[12px] font-bold text-[#66647c]">Emails sent</dt>
            <dd className="mt-0.5 text-[22px] font-extrabold text-[#121226]">{stats.sent.toLocaleString("en-US")}</dd>
          </div>
          <div className="rounded-2xl bg-[#f7f6fb] px-4 py-3">
            <dt className="text-[12px] font-bold text-[#66647c]">Codes redeemed (90 days)</dt>
            <dd className="mt-0.5 text-[22px] font-extrabold text-[#121226]">
              {stats.redeemed === null ? "—" : `${stats.redeemed.toLocaleString("en-US")} of ${stats.recent.toLocaleString("en-US")}`}
            </dd>
          </div>
        </dl>

        <form onSubmit={(e) => void save(e)} className="space-y-4" noValidate>
          <fieldset disabled={busy !== null} className="space-y-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[14px] font-semibold text-[#121226]">
              <input type="checkbox" className="h-4 w-4 accent-[#5440e8]" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
              Send the welcome offer
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Percent off" hint="5–90" htmlFor="wl-percent">
                <AdminInput id="wl-percent" type="number" inputMode="numeric" min={5} max={90} step={1} value={num.percent} onChange={(e) => setNum({ ...num, percent: e.target.value })} />
              </FormField>
              <FormField label="Code valid (hours)" hint="12–336" htmlFor="wl-valid">
                <AdminInput id="wl-valid" type="number" inputMode="numeric" min={12} max={336} step={1} value={num.hours} onChange={(e) => setNum({ ...num, hours: e.target.value })} />
              </FormField>
            </div>
          </fieldset>

          {msg ? (
            <p
              role={msg.ok ? "status" : "alert"}
              className={`rounded-2xl px-4 py-3 text-[14px] font-semibold ${msg.ok ? "bg-[#dcf5ea] text-[#0b4f35]" : "bg-[#fbe2e3] text-[#a3222a]"}`}
            >
              {msg.text}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" disabled={busy !== null} className={`${adminBtnDark} ${focusRing} flex-1`}>
              {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {busy === "save" ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => void sendTest()} disabled={busy !== null} className={`${adminBtnSoft} ${focusRing} flex-1`}>
              {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Send test to me
            </button>
          </div>
        </form>
      </div>
    </SectionCard>
  );
}
