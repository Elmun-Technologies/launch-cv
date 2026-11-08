"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Settings } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { adminBtnPrimary } from "@/components/admin/admin-ui";

type Switches = Settings["switches"];
type Product = Settings["product"];

/** A labelled switch row (light card). */
export function SwitchRow({
  id,
  title,
  hint,
  on,
  disabled,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  hint: string;
  on: boolean;
  disabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <li className="border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0">
          <b id={`${id}-label`} className="block text-[14px] text-[#121226]">
            {title}
          </b>
          <span id={`${id}-desc`} className="block text-[12px] leading-[1.45] text-[#66647c]">
            {hint}
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-desc`}
          disabled={disabled}
          onClick={onToggle}
          className="inline-flex h-11 w-[52px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className={`relative h-[26px] w-11 rounded-full transition-colors ${on ? "bg-[#5440e8]" : "bg-[#c9c7d8]"}`}>
            <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[21px]" : "left-[3px]"}`} />
          </span>
        </button>
      </div>
      {children}
    </li>
  );
}

/**
 * Admin → Settings → Product. Free ATS check and sign-ups are the same
 * switches as Limits & budgets (one setting, two places); Google sign-in and
 * the maintenance banner live here. Every change is re-confirmed and audited.
 */
export function ProductToggles({ switches, product, canEdit }: { switches: Switches; product: Product; canEdit: boolean }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [sw, setSw] = useState(switches);
  const [prod, setProd] = useState(product);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function put<G extends "switches" | "product">(group: G, value: G extends "switches" ? Switches : Product, action: string) {
    setBusy(group);
    setMsg(null);
    const r = await adminFetch(
      `/api/admin-panel/settings/${group}`,
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) },
      { action },
    ).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok) {
      if (group === "switches") setSw(j.value as Switches);
      else setProd(j.value as Product);
      setMsg({ ok: true, text: "Saved. Takes effect within 30 seconds." });
      router.refresh();
    } else {
      setMsg({ ok: false, text: j.error ?? "Couldn't save." });
    }
  }

  const toggle = (key: "freeAtsCheck" | "googleSignIn" | "signups", label: string) =>
    void put("switches", { ...sw, [key]: !sw[key] }, `${sw[key] ? "turn off" : "turn on"} ${label}`);

  const disabled = !canEdit || busy !== null;
  const messageChanged = prod.maintenanceMessage !== product.maintenanceMessage;

  return (
    <SectionCard title="Product" description={canEdit ? "Switches apply within 30 seconds." : "Only an owner or admin can change these."} flush>
      <ul>
        <SwitchRow id="pt-ats" title="Free ATS check" hint="One per network per month" on={sw.freeAtsCheck} disabled={disabled} onToggle={() => toggle("freeAtsCheck", "the free ATS check")} />
        <SwitchRow id="pt-google" title="Google sign-in" hint="Shown on login and register" on={sw.googleSignIn} disabled={disabled} onToggle={() => toggle("googleSignIn", "Google sign-in")} />
        <SwitchRow
          id="pt-maint"
          title="Maintenance banner"
          hint="Shows a notice across the app"
          on={prod.maintenanceBanner}
          disabled={disabled}
          onToggle={() => void put("product", { ...prod, maintenanceBanner: !prod.maintenanceBanner }, `${prod.maintenanceBanner ? "hide" : "show"} the maintenance banner`)}
        >
          <form
            className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              void put("product", prod, "change the maintenance message");
            }}
          >
            <label className="block min-w-0 flex-1 text-[12px] font-bold text-[#4a4862]">
              Banner message
              <input
                type="text"
                maxLength={240}
                disabled={!canEdit}
                value={prod.maintenanceMessage}
                placeholder="We're doing some maintenance. Some features may be briefly unavailable."
                onChange={(e) => setProd({ ...prod, maintenanceMessage: e.target.value })}
                className="mt-1 block h-11 w-full rounded-[12px] border-[1.5px] border-[#e2e0ea] bg-white px-3 text-[14px] font-normal text-[#121226] outline-none hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 disabled:bg-[#f7f6fb]"
              />
            </label>
            {canEdit ? (
              <button type="submit" disabled={busy !== null || !messageChanged} className={adminBtnPrimary}>
                {busy === "product" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save message
              </button>
            ) : null}
          </form>
        </SwitchRow>
        <SwitchRow id="pt-signups" title="New sign-ups" hint="Turn off to pause registrations" on={sw.signups} disabled={disabled} onToggle={() => toggle("signups", "new sign-ups")} />
      </ul>
      {msg ? (
        <p role="status" className={`border-t border-[#e2e0ea] px-5 py-3 text-[13px] font-semibold sm:px-6 ${msg.ok ? "text-[#0b7a4f]" : "text-[#c42b30]"}`}>
          {msg.text}
        </p>
      ) : null}
    </SectionCard>
  );
}
