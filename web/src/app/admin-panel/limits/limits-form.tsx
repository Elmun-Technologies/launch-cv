"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AiTool, Settings, SettingsGroup } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";

type ToolRow = { tool: AiTool; label: string; calls: number; usd: number };

const SWITCHES: { key: keyof Settings["switches"]; label: string; off: string }[] = [
  { key: "aiTools", label: "AI tools", off: "All AI features answer “paused for maintenance”." },
  { key: "freeAtsCheck", label: "Free ATS check", off: "The public free check is turned off." },
  { key: "signups", label: "New sign-ups", off: "Registration and new Google accounts are refused." },
  { key: "checkout", label: "Checkout", off: "Buy buttons show “checkout is paused”." },
  { key: "freeTools", label: "Free writing tools", off: "The free bullet and summary generators answer “paused”." },
];

const RATE_LABELS: Record<keyof Settings["rateLimits"], string> = {
  aiPerUserPerHour: "AI requests / user / hour",
  importPerUserPerHour: "Imports / user / hour",
  pdfPerUserPerHour: "PDF exports / user / hour",
  freeAtsPerIpPerHour: "Free ATS checks / IP / hour",
  freeToolsPerIpPerDay: "Free bullet + summary generations / IP / day",
  registerPerIpPerHour: "Sign-ups / IP / hour",
  loginPer15Min: "Login attempts / 15 min",
  forgotPerIpPerHour: "Password resets / IP / hour",
};

const PLAN_LABELS: Record<keyof Settings["planLimits"], string> = {
  starter: "Starter",
  professional: "Professional",
  lifetime: "Lifetime",
  elite: "Elite (legacy)",
};

const money = (n: number) => `$${n.toFixed(n < 10 ? 2 : 0)}`;

export function LimitsForm({ initial, spend, tools, models }: { initial: Settings; spend: { day: number; month: number }; tools: ToolRow[]; models: string[] }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [s, setS] = useState<Settings>(initial);
  const [busy, setBusy] = useState<SettingsGroup | null>(null);
  const [msg, setMsg] = useState<{ group: SettingsGroup; ok: boolean; text: string } | null>(null);

  async function save(group: SettingsGroup, value: unknown = s[group]) {
    setBusy(group);
    setMsg(null);
    const r = await adminFetch(`/api/admin-panel/settings/${group}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok) {
      setS((prev) => ({ ...prev, [group]: j.value }));
      setMsg({ group, ok: true, text: "Saved." });
      router.refresh();
    } else {
      setMsg({ group, ok: false, text: j.error ?? "Couldn't save." });
    }
  }

  const set = <G extends SettingsGroup>(group: G, patch: Partial<Settings[G]>) => setS((prev) => ({ ...prev, [group]: { ...prev[group], ...patch } }));

  const SaveBar = ({ group }: { group: SettingsGroup }) => (
    <div className="mt-4 flex items-center gap-3">
      <button
        type="button"
        onClick={() => void save(group)}
        disabled={busy !== null}
        className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#111111] px-4 text-[13px] font-semibold text-white hover:bg-[#2b2b2b] disabled:opacity-60"
      >
        {busy === group ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Save
      </button>
      {msg?.group === group ? (
        <span role="status" className={`text-[12px] ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>
          {msg.text}
        </span>
      ) : null}
    </div>
  );

  const cap = s.budget.monthlyCapUsd;
  const pct = cap > 0 ? Math.min(100, (spend.month / cap) * 100) : 0;
  const barColor = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-[#2563EB]";
  const num = (v: string) => (v === "" ? 0 : Number(v));

  return (
    <div className="space-y-5">
      <SectionCard title="Emergency switches" description="Turning a switch off takes effect within 30 seconds. Saves immediately.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {SWITCHES.map((sw) => {
            const on = s.switches[sw.key];
            return (
              <li key={sw.key} className="flex items-start justify-between gap-4 rounded-lg border border-[#E5E5E2] p-4">
                <div>
                  <p className="text-[13px] font-semibold text-[#111111]">{sw.label}</p>
                  <p className="mt-0.5 text-[12px] text-[#6B6B6B]">{on ? "On" : sw.off}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={sw.label}
                  disabled={busy !== null}
                  onClick={() => void save("switches", { ...s.switches, [sw.key]: !on })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-emerald-500" : "bg-[#D9D9D5]"} disabled:opacity-60`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </li>
            );
          })}
        </ul>
        {msg?.group === "switches" ? (
          <p role="status" className={`mt-3 text-[12px] ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>
            {msg.text}
          </p>
        ) : null}
      </SectionCard>

      <SectionCard title="AI spend" description="Real cost of every AI call, from token counts and model list prices. Days and months are UTC.">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E6A]">This month</p>
            <p className="mt-1 text-[24px] font-semibold tabular-nums text-[#111111]">
              {money(spend.month)}
              {cap > 0 ? <span className="text-[14px] font-medium text-[#6B6B6B]"> / {money(cap)}</span> : null}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E6A]">Today</p>
            <p className="mt-1 text-[24px] font-semibold tabular-nums text-[#111111]">
              {money(spend.day)}
              {s.budget.dailyCapUsd > 0 ? <span className="text-[14px] font-medium text-[#6B6B6B]"> / {money(s.budget.dailyCapUsd)}</span> : null}
            </p>
          </div>
          <div className="self-end">
            {cap > 0 ? (
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F5F3]" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Monthly cap used">
                <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            ) : (
              <p className="text-[12px] text-amber-700">No monthly cap set — spend is unlimited.</p>
            )}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-[#6E6E6A]">
              <tr>
                <th className="py-2 font-semibold">Tool</th>
                <th className="py-2 text-right font-semibold">Calls (month)</th>
                <th className="py-2 text-right font-semibold">Cost (month)</th>
                <th className="py-2 pl-4 font-semibold">Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {tools.map((t) => (
                <tr key={t.tool}>
                  <td className="py-2 text-[#111111]">{t.label}</td>
                  <td className="py-2 text-right tabular-nums">{t.calls.toLocaleString()}</td>
                  <td className="py-2 text-right tabular-nums">{money(t.usd)}</td>
                  <td className="py-2 pl-4">
                    <AdminSelect aria-label={`Model for ${t.label}`} value={s.models[t.tool]} onChange={(e) => set("models", { [t.tool]: e.target.value } as Partial<Settings["models"]>)} className="!py-1">
                      {models.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </AdminSelect>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SaveBar group="models" />
      </SectionCard>

      <SectionCard title="Budget caps" description="0 means no cap. Alerts are emailed at 50%, 80% and 100% of the monthly cap.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-semibold text-[#3F3F3F]">
            Monthly cap (USD)
            <AdminInput type="number" min={0} step="1" value={s.budget.monthlyCapUsd} onChange={(e) => set("budget", { monthlyCapUsd: num(e.target.value) })} className="mt-1.5" />
          </label>
          <label className="block text-[12px] font-semibold text-[#3F3F3F]">
            Daily cap (USD)
            <AdminInput type="number" min={0} step="1" value={s.budget.dailyCapUsd} onChange={(e) => set("budget", { dailyCapUsd: num(e.target.value) })} className="mt-1.5" />
          </label>
          <label className="block text-[12px] font-semibold text-[#3F3F3F]">
            When a cap is reached
            <AdminSelect value={s.budget.onCap} onChange={(e) => set("budget", { onCap: e.target.value as Settings["budget"]["onCap"] })} className="mt-1.5">
              <option value="pause_free">Pause free users, paid keep working</option>
              <option value="pause_all">Pause all AI</option>
              <option value="alert_only">Only send an alert</option>
            </AdminSelect>
          </label>
          <label className="block text-[12px] font-semibold text-[#3F3F3F]">
            Per-user daily safety cap (USD)
            <AdminInput type="number" min={0} step="0.5" value={s.budget.perUserDailyUsd} onChange={(e) => set("budget", { perUserDailyUsd: num(e.target.value) })} className="mt-1.5" />
          </label>
          <label className="block text-[12px] font-semibold text-[#3F3F3F] sm:col-span-2">
            Alert email
            <AdminInput type="email" value={s.budget.alertEmail} placeholder="you@company.com" onChange={(e) => set("budget", { alertEmail: e.target.value })} className="mt-1.5" />
          </label>
        </div>
        <SaveBar group="budget" />
      </SectionCard>

      <SectionCard title="Plan quotas" description="Monthly AI runs included in each plan. Shown on the pricing page and enforced in the app.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-[#6E6E6A]">
              <tr>
                <th className="py-2 font-semibold">Plan</th>
                <th className="py-2 font-semibold">Job matches</th>
                <th className="py-2 font-semibold">Application packets</th>
                <th className="py-2 font-semibold">Role fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E2]">
              {(Object.keys(PLAN_LABELS) as (keyof Settings["planLimits"])[]).map((plan) => (
                <tr key={plan}>
                  <td className="py-2 pr-3 font-medium text-[#111111]">{PLAN_LABELS[plan]}</td>
                  {(["jd", "packet", "roleFit"] as const).map((k) => (
                    <td key={k} className="py-2 pr-3">
                      <AdminInput
                        type="number"
                        min={0}
                        aria-label={`${PLAN_LABELS[plan]} ${k}`}
                        value={s.planLimits[plan][k]}
                        onChange={(e) => set("planLimits", { [plan]: { ...s.planLimits[plan], [k]: num(e.target.value) } } as Partial<Settings["planLimits"]>)}
                        className="!w-24 !py-1"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SaveBar group="planLimits" />
      </SectionCard>

      <SectionCard title="Rate limits" description="Abuse protection, shared across all servers.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(RATE_LABELS) as (keyof Settings["rateLimits"])[]).map((k) => (
            <label key={k} className="block text-[12px] font-semibold text-[#3F3F3F]">
              {RATE_LABELS[k]}
              <AdminInput type="number" min={1} value={s.rateLimits[k]} onChange={(e) => set("rateLimits", { [k]: num(e.target.value) } as Partial<Settings["rateLimits"]>)} className="mt-1.5" />
            </label>
          ))}
        </div>
        <SaveBar group="rateLimits" />
      </SectionCard>
    </div>
  );
}
