"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminInput, FormField } from "@/components/admin/form-field";
import { useAdminFetch } from "@/components/admin/reauth";
import { adminBtnDark } from "@/components/admin/admin-ui";
import { cellMain, cellMuted, cellText, focusRing, rowDanger } from "@/components/admin/v5/ui";
import { fmtDateLong } from "@/lib/admin-dates";
import { isValidDiscountCode, normalizeDiscountCode } from "@/lib/polar-discounts";
import type { CheckoutPlan } from "@/lib/plan-config";

export type DiscountRow = {
  id: string;
  code: string;
  value: string;
  duration: string;
  plans: string[];
  used: string;
  /** Every redemption used up. */
  full: boolean;
  endsAt: string | null;
  expired: boolean;
};

type PlanOption = { id: CheckoutPlan; title: string; price: string; ready: boolean };

async function errorOf(r: Response | null, fallback: string): Promise<string> {
  if (!r) return fallback;
  const j = (await r.json().catch(() => ({}))) as { error?: unknown };
  return typeof j.error === "string" ? j.error : fallback;
}

const radioCls = "h-4 w-4 accent-[#5440e8]";
const optionCls =
  "flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-3.5 text-[14px] font-semibold text-[#121226] transition-colors hover:border-[#c9c0ff] has-[:checked]:border-[#5440e8] has-[:checked]:bg-[#f7f6fb] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 sm:min-h-10";

export function DiscountsClient({ rows, plans, disabled }: { rows: DiscountRow[]; plans: PlanOption[]; disabled: boolean }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [listMsg, setListMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function remove(row: DiscountRow) {
    if (!confirm(`Delete the code ${row.code}? Buyers can't use it after this. Orders already paid with it aren't affected.`)) return;
    setDeleting(row.id);
    setListMsg(null);
    const r = await adminFetch(`/api/admin-panel/discounts/${encodeURIComponent(row.id)}`, { method: "DELETE" }, { action: `delete the code ${row.code}` }).catch(
      () => null,
    );
    setDeleting(null);
    if (!r?.ok) return setListMsg({ ok: false, text: await errorOf(r, "Couldn't delete the code.") });
    setListMsg({ ok: true, text: `${row.code} deleted.` });
    router.refresh();
  }

  const columns: DataTableColumn<DiscountRow>[] = [
    { key: "code", header: "Code", render: (r) => <span className={`lc-mono ${cellMain}`}>{r.code}</span> },
    {
      key: "value",
      header: "Discount",
      render: (r) => (
        <div>
          <p className={`whitespace-nowrap ${cellText}`}>{r.value}</p>
          <p className={cellMuted}>{r.duration}</p>
        </div>
      ),
    },
    { key: "plans", header: "Plans", render: (r) => <span className={cellText}>{r.plans.join(", ")}</span> },
    {
      key: "used",
      header: "Used / max",
      align: "right",
      render: (r) => <span className={`${cellText} ${r.full ? "font-bold text-[#a15c00]" : ""}`}>{r.used}</span>,
    },
    {
      key: "expiry",
      header: "Expires",
      render: (r) =>
        r.expired ? (
          <StatusBadge tone="red">Expired {fmtDateLong(r.endsAt)}</StatusBadge>
        ) : (
          <span className={`whitespace-nowrap ${cellMuted}`}>{r.endsAt ? fmtDateLong(r.endsAt) : "Never"}</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (r) => (
        <button type="button" onClick={() => remove(r)} disabled={deleting !== null} className={`${rowDanger} disabled:opacity-50`} aria-label={`Delete ${r.code}`}>
          {deleting === r.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-3">
        {listMsg ? (
          <p role={listMsg.ok ? "status" : "alert"} className={`text-[14px] font-semibold ${listMsg.ok ? "text-[#0b4f35]" : "text-[#a3222a]"}`}>
            {listMsg.text}
          </p>
        ) : null}
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyTitle="No discount codes yet"
          emptyDescription="Codes you create here appear on the Polar payment step for the plans you pick."
        />
      </div>
      <CreateDiscountForm plans={plans} disabled={disabled} onCreated={() => router.refresh()} />
    </div>
  );
}

function CreateDiscountForm({ plans, disabled, onCreated }: { plans: PlanOption[]; disabled: boolean; onCreated: () => void }) {
  const adminFetch = useAdminFetch();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"percentage" | "fixed">("percentage");
  const [percent, setPercent] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState<"once" | "forever">("once");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [picked, setPicked] = useState<CheckoutPlan[]>(plans.filter((p) => p.ready).map((p) => p.id));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const normalized = normalizeDiscountCode(code);
  const codeError = code && !isValidDiscountCode(normalized) ? "3–32 characters, letters A–Z and digits 0–9 only." : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isValidDiscountCode(normalized)) return setMsg({ ok: false, text: "Enter a code: 3–32 letters A–Z and digits 0–9." });
    if (!picked.length) return setMsg({ ok: false, text: "Pick at least one plan." });
    setSaving(true);
    const r = await adminFetch(
      "/api/admin-panel/discounts",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalized,
          kind,
          percent: kind === "percentage" && percent !== "" ? Number(percent) : null,
          amountUsd: kind === "fixed" && amount !== "" ? Number(amount) : null,
          duration,
          maxRedemptions: maxRedemptions !== "" ? Number(maxRedemptions) : null,
          endsOn: endsOn || null,
          plans: picked,
        }),
      },
      { action: `create the discount code ${normalized}` },
    ).catch(() => null);
    setSaving(false);
    if (!r?.ok) return setMsg({ ok: false, text: await errorOf(r, "Couldn't create the code.") });
    setMsg({ ok: true, text: `${normalized} created. It works at checkout right away.` });
    setCode("");
    setPercent("");
    setAmount("");
    setMaxRedemptions("");
    setEndsOn("");
    onCreated();
  }

  return (
    <SectionCard title="New code" description="Created in Polar. Buyers type it on the payment step.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <fieldset disabled={disabled || saving} className="space-y-4">
          <FormField label="Code" hint="A–Z, 0–9 · 3–32" htmlFor="discount-code" error={codeError} required>
            <AdminInput
              id="discount-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              maxLength={32}
              autoComplete="off"
              spellCheck={false}
              placeholder="SPRING20"
              className="lc-mono uppercase"
              aria-invalid={!!codeError}
            />
          </FormField>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-bold text-[#4a4862]">Discount</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className={optionCls}>
                <input type="radio" name="discount-kind" className={radioCls} checked={kind === "percentage"} onChange={() => setKind("percentage")} />
                Percent off
              </label>
              <label className={optionCls}>
                <input type="radio" name="discount-kind" className={radioCls} checked={kind === "fixed"} onChange={() => setKind("fixed")} />
                Fixed $ off
              </label>
            </div>
          </fieldset>

          {kind === "percentage" ? (
            <FormField label="Percent off" hint="1–100" htmlFor="discount-percent" required>
              <AdminInput id="discount-percent" type="number" inputMode="decimal" min={1} max={100} step="any" value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="20" />
            </FormField>
          ) : (
            <FormField label="Amount off (USD)" hint="e.g. 5 or 4.50" htmlFor="discount-amount" required>
              <AdminInput id="discount-amount" type="number" inputMode="decimal" min={0.01} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5" />
            </FormField>
          )}

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-bold text-[#4a4862]">Duration</legend>
            <div className="grid grid-cols-2 gap-2">
              <label className={optionCls}>
                <input type="radio" name="discount-duration" className={radioCls} checked={duration === "once"} onChange={() => setDuration("once")} />
                Once
              </label>
              <label className={optionCls}>
                <input type="radio" name="discount-duration" className={radioCls} checked={duration === "forever"} onChange={() => setDuration("forever")} />
                Forever
              </label>
            </div>
            <p className="mt-1.5 text-[12px] leading-[1.5] text-[#66647c]">
              Passes are one payment either way. For Pro, &ldquo;once&rdquo; discounts the first month only; &ldquo;forever&rdquo; every renewal.
            </p>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <FormField label="Max redemptions" hint="Optional" htmlFor="discount-max">
              <AdminInput id="discount-max" type="number" inputMode="numeric" min={1} step={1} value={maxRedemptions} onChange={(e) => setMaxRedemptions(e.target.value)} placeholder="No limit" />
            </FormField>
            <FormField label="Last day" hint="Optional · UTC" htmlFor="discount-ends">
              <AdminInput id="discount-ends" type="date" value={endsOn} onChange={(e) => setEndsOn(e.target.value)} />
            </FormField>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[13px] font-bold text-[#4a4862]">Plans</legend>
            <div className="space-y-2">
              {plans.map((p) => (
                <label key={p.id} className={optionCls}>
                  <input
                    type="checkbox"
                    className={radioCls}
                    disabled={!p.ready}
                    checked={picked.includes(p.id)}
                    onChange={(e) => setPicked((cur) => (e.target.checked ? [...cur, p.id] : cur.filter((x) => x !== p.id)))}
                  />
                  <span className="min-w-0 flex-1">{p.title}</span>
                  <span className="text-[13px] font-normal text-[#66647c]">{p.ready ? p.price : "No Polar product set"}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>

        {msg ? (
          <p
            role={msg.ok ? "status" : "alert"}
            className={`rounded-2xl px-4 py-3 text-[14px] font-semibold ${msg.ok ? "bg-[#dcf5ea] text-[#0b4f35]" : "bg-[#fbe2e3] text-[#a3222a]"}`}
          >
            {msg.text}
          </p>
        ) : null}

        <button type="submit" disabled={disabled || saving} className={`${adminBtnDark} ${focusRing} w-full`}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {saving ? "Creating…" : "Create code"}
        </button>
      </form>
    </SectionCard>
  );
}
