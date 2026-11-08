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

type Marketing = Settings["marketing"];

export type WinbackStats = { sent: number; recent: number; redeemed: number | null };

/**
 * Admin → Discounts → Win-back email: settings (group "marketing", saved
 * through the settings API with re-confirm and audit), counts, and a test send.
 */
export function WinbackCard({ marketing, stats }: { marketing: Marketing; stats: WinbackStats }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [m, setM] = useState(marketing);
  const [num, setNum] = useState({
    winbackPercent: String(marketing.winbackPercent),
    winbackValidHours: String(marketing.winbackValidHours),
    winbackDelayHours: String(marketing.winbackDelayHours),
  });
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(next: Marketing, action: string) {
    setBusy("save");
    setMsg(null);
    const r = await adminFetch(
      "/api/admin-panel/settings/marketing",
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) },
      { action },
    ).catch(() => null);
    const j = (r ? await r.json().catch(() => ({})) : {}) as { value?: Marketing; error?: string };
    setBusy(null);
    if (r?.ok && j.value) {
      setM(j.value);
      setNum({
        winbackPercent: String(j.value.winbackPercent),
        winbackValidHours: String(j.value.winbackValidHours),
        winbackDelayHours: String(j.value.winbackDelayHours),
      });
      setMsg({ ok: true, text: "Saved. The next daily run uses these settings." });
      router.refresh();
    } else {
      setMsg({ ok: false, text: j.error ?? "Couldn't save." });
    }
  }

  async function sendTest() {
    setBusy("test");
    setMsg(null);
    const r = await adminFetch("/api/admin-panel/discounts/winback-test", { method: "POST" }, { action: "send a test win-back email" }).catch(() => null);
    const j = (r ? await r.json().catch(() => ({})) : {}) as { to?: string; error?: string };
    setBusy(null);
    setMsg(r?.ok ? { ok: true, text: `Test sent to ${j.to}. It uses the saved settings and a dummy code that doesn't work at checkout.` } : { ok: false, text: j.error ?? "Couldn't send the test." });
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Start from the latest saved settings (props refresh after a save) so the
    // welcome-offer fields saved by the card above aren't overwritten.
    void save(
      {
        ...marketing,
        winbackEnabled: m.winbackEnabled,
        postalAddress: m.postalAddress,
        winbackPercent: Number(num.winbackPercent),
        winbackValidHours: Number(num.winbackValidHours),
        winbackDelayHours: Number(num.winbackDelayHours),
      },
      "change the win-back email settings",
    );
  };

  const noAddress = !marketing.postalAddress.trim();

  return (
    <SectionCard
      title="Win-back email"
      description={`One email, once per person, to signed-in users who started a checkout or reached the free AI limit and haven't paid. It carries a personal single-use code. Sent by a daily job, ${marketing.winbackDelayHours} h after the event.`}
    >
      <div className="space-y-4">
        {noAddress ? (
          <p role="alert" className="rounded-2xl bg-[#fdf0d5] px-4 py-3 text-[14px] font-semibold text-[#7a4600]">
            Emails won&apos;t send until a postal address is set (US CAN-SPAM)
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
        {stats.redeemed === null ? <p className="text-[12px] text-[#66647c]">Couldn&apos;t read redemptions from Polar.</p> : null}

        <form onSubmit={submit} className="space-y-4" noValidate>
          <fieldset disabled={busy !== null} className="space-y-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[14px] font-semibold text-[#121226]">
              <input type="checkbox" className="h-4 w-4 accent-[#5440e8]" checked={m.winbackEnabled} onChange={(e) => setM({ ...m, winbackEnabled: e.target.checked })} />
              Send the win-back email
            </label>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              <FormField label="Percent off" hint="5–90" htmlFor="wb-percent">
                <AdminInput id="wb-percent" type="number" inputMode="numeric" min={5} max={90} step={1} value={num.winbackPercent} onChange={(e) => setNum({ ...num, winbackPercent: e.target.value })} />
              </FormField>
              <FormField label="Code valid (hours)" hint="12–336" htmlFor="wb-valid">
                <AdminInput id="wb-valid" type="number" inputMode="numeric" min={12} max={336} step={1} value={num.winbackValidHours} onChange={(e) => setNum({ ...num, winbackValidHours: e.target.value })} />
              </FormField>
              <FormField label="Delay (hours)" hint="1–168" htmlFor="wb-delay">
                <AdminInput id="wb-delay" type="number" inputMode="numeric" min={1} max={168} step={1} value={num.winbackDelayHours} onChange={(e) => setNum({ ...num, winbackDelayHours: e.target.value })} />
              </FormField>
            </div>
            <FormField label="Postal address" hint="Shown in the footer · max 200" htmlFor="wb-address">
              <AdminInput
                id="wb-address"
                value={m.postalAddress}
                maxLength={200}
                autoComplete="off"
                placeholder="Street, city, state, ZIP, country"
                onChange={(e) => setM({ ...m, postalAddress: e.target.value })}
              />
            </FormField>
          </fieldset>

          {msg ? (
            <p
              role={msg.ok ? "status" : "alert"}
              className={`rounded-2xl px-4 py-3 text-[14px] font-semibold ${msg.ok ? "bg-[#dcf5ea] text-[#0b4f35]" : "bg-[#fbe2e3] text-[#a3222a]"}`}
            >
              {msg.text}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col 2xl:flex-row">
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
