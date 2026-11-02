"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AiTool, Settings, SettingsGroup } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";
import { adminBtnPrimary } from "@/components/admin/admin-ui";

type ToolRow = { tool: AiTool; label: string; calls: number; usd: number };

const SWITCHES: { key: keyof Settings["switches"]; label: string; off: string }[] = [
  { key: "aiTools", label: "AI tools", off: "All AI features answer “paused for maintenance”." },
  { key: "freeAtsCheck", label: "Free ATS check", off: "The public free check is turned off." },
  { key: "signups", label: "New sign-ups", off: "Registration and new Google accounts are refused." },
  { key: "checkout", label: "Checkout", off: "Buy buttons show “checkout is paused”." },
];

const RATE_LABELS: Record<keyof Settings["rateLimits"], string> = {
  aiPerUserPerHour: "AI requests / user / hour",
  importPerUserPerHour: "Imports / user / hour",
  pdfPerUserPerHour: "PDF exports / user / hour",
  freeAtsPerIpPerHour: "Free ATS checks / IP / hour",
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
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => void save(group)} disabled={busy !== null} className={adminBtnPrimary}>
        {busy === group ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Save
      </button>
      {msg?.group === group ? (
        <span role="status" className={`text-[13px] font-semibold ${msg.ok ? "text-[#0b7a4f]" : "text-[#c42b30]"}`}>
          {msg.text}
        </span>
      ) : null}
    </div>
  );

  const cap = s.budget.monthlyCapUsd;
  const pct = cap > 0 ? Math.min(100, (spend.month / cap) * 100) : 0;
  const barColor = pct >= 100 ? "bg-[#ff9ca0]" : pct >= 80 ? "bg-[#ffc46b]" : "bg-white";
  const num = (v: string) => (v === "" ? 0 : Number(v));

  const labelCls = "block text-[13px] font-bold text-[#4a4862]";

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        {/* AI spend */}
        <section className="rounded-[24px] bg-[#5440e8] p-5 text-white sm:p-[26px]" aria-labelledby="spend-title">
          <h2 id="spend-title" className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#e4dfff]">
            AI spend · this month
          </h2>
          <p className="mt-1.5 text-[36px] font-extrabold leading-[1.1] tracking-[-0.03em] tabular-nums sm:text-[40px]">
            {money(spend.month)}
            {cap > 0 ? <span className="text-[18px] font-bold text-[#e4dfff]"> / {money(cap)}</span> : null}
          </p>
          {cap > 0 ? (
            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Monthly cap used"
            >
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          ) : (
            <p className="mt-3 inline-block rounded-full bg-[#fdf0d5] px-3 py-1.5 text-[13px] font-bold text-[#7a4600]">
              No monthly cap set — spend is unlimited.
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-white/20 pt-4">
            <p className="text-[14px] text-[#e4dfff]">
              Today <b className="text-[20px] font-extrabold tabular-nums text-white">{money(spend.day)}</b>
              {s.budget.dailyCapUsd > 0 ? <span className="tabular-nums"> / {money(s.budget.dailyCapUsd)}</span> : null}
            </p>
            <p className="text-[12px] leading-[1.5] text-[#e4dfff]">Real cost from token counts and model list prices. Days and months are UTC.</p>
          </div>
        </section>

        {/* Emergency switches */}
        <section className="rounded-[24px] bg-[#111118] p-5 text-white sm:p-6" aria-labelledby="switches-title">
          <h2 id="switches-title" className="text-[18px] font-extrabold tracking-[-0.01em]">
            Emergency switches
          </h2>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#a9a6c2]">Turning a switch off takes effect within 30 seconds. Saves immediately.</p>
          <ul className="mt-3">
            {SWITCHES.map((sw) => {
              const on = s.switches[sw.key];
              return (
                <li key={sw.key} className="flex items-center justify-between gap-3 border-t border-[#2f2d48] py-2.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold">{sw.label}</p>
                    <p className={`text-[12px] leading-[1.45] ${on ? "text-[#a9a6c2]" : "font-semibold text-[#ffb08a]"}`}>{on ? "On" : sw.off}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={sw.label}
                    disabled={busy !== null}
                    onClick={() => void save("switches", { ...s.switches, [sw.key]: !on })}
                    className="inline-flex h-11 w-[52px] shrink-0 items-center justify-center rounded-full disabled:opacity-60"
                  >
                    <span className={`relative h-[26px] w-11 rounded-full transition-colors ${on ? "bg-[#5440e8]" : "bg-[#4a4862]"}`}>
                      <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[21px]" : "left-[3px]"}`} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {msg?.group === "switches" ? (
            <p role="status" className={`mt-2 text-[13px] font-semibold ${msg.ok ? "text-[#7ee0b5]" : "text-[#ff9ca0]"}`}>
              {msg.text}
            </p>
          ) : null}
        </section>
      </div>

      <SectionCard title="Plan quotas" description="Monthly AI runs included in each plan. Shown on the pricing page and enforced in the app.">
        <div className="relative -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
              <tr>
                <th scope="col" className="py-2.5 pr-3 font-bold">Plan</th>
                <th scope="col" className="py-2.5 pr-3 font-bold">Job matches</th>
                <th scope="col" className="py-2.5 pr-3 font-bold">Application packets</th>
                <th scope="col" className="py-2.5 font-bold">Role fit</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(PLAN_LABELS) as (keyof Settings["planLimits"])[]).map((plan) => (
                <tr key={plan} className="border-t border-[#e2e0ea]">
                  <th scope="row" className="py-2.5 pr-3 font-bold text-[#121226]">
                    {PLAN_LABELS[plan]}
                  </th>
                  {(["jd", "packet", "roleFit"] as const).map((k) => (
                    <td key={k} className="py-2.5 pr-3 last:pr-0">
                      <AdminInput
                        type="number"
                        min={0}
                        aria-label={`${PLAN_LABELS[plan]} ${k}`}
                        value={s.planLimits[plan][k]}
                        onChange={(e) => set("planLimits", { [plan]: { ...s.planLimits[plan], [k]: num(e.target.value) } } as Partial<Settings["planLimits"]>)}
                        className="max-w-[140px] tabular-nums"
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

      <div className="grid items-start gap-[18px] lg:grid-cols-2">
        <SectionCard title="Budget caps" description="0 means no cap. Alerts are emailed at 50%, 80% and 100% of the monthly cap.">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              Monthly cap (USD)
              <AdminInput type="number" min={0} step="1" value={s.budget.monthlyCapUsd} onChange={(e) => set("budget", { monthlyCapUsd: num(e.target.value) })} className="mt-1.5" />
            </label>
            <label className={labelCls}>
              Daily cap (USD)
              <AdminInput type="number" min={0} step="1" value={s.budget.dailyCapUsd} onChange={(e) => set("budget", { dailyCapUsd: num(e.target.value) })} className="mt-1.5" />
            </label>
            <label className={labelCls}>
              When a cap is reached
              <AdminSelect value={s.budget.onCap} onChange={(e) => set("budget", { onCap: e.target.value as Settings["budget"]["onCap"] })} className="mt-1.5">
                <option value="pause_free">Pause free users, paid keep working</option>
                <option value="pause_all">Pause all AI</option>
                <option value="alert_only">Only send an alert</option>
              </AdminSelect>
            </label>
            <label className={labelCls}>
              Per-user daily safety cap (USD)
              <AdminInput type="number" min={0} step="0.5" value={s.budget.perUserDailyUsd} onChange={(e) => set("budget", { perUserDailyUsd: num(e.target.value) })} className="mt-1.5" />
            </label>
            <label className={`${labelCls} sm:col-span-2`}>
              Alert email
              <AdminInput type="email" value={s.budget.alertEmail} placeholder="you@company.com" onChange={(e) => set("budget", { alertEmail: e.target.value })} className="mt-1.5" />
            </label>
          </div>
          <SaveBar group="budget" />
        </SectionCard>

        <SectionCard title="Rate limits" description="Abuse protection, shared across all servers.">
          <div className="grid gap-4 sm:grid-cols-2">
            {(Object.keys(RATE_LABELS) as (keyof Settings["rateLimits"])[]).map((k) => (
              <label key={k} className={labelCls}>
                {RATE_LABELS[k]}
                <AdminInput type="number" min={1} value={s.rateLimits[k]} onChange={(e) => set("rateLimits", { [k]: num(e.target.value) } as Partial<Settings["rateLimits"]>)} className="mt-1.5" />
              </label>
            ))}
          </div>
          <SaveBar group="rateLimits" />
        </SectionCard>
      </div>

      <SectionCard title="Model per tool" description="Calls and cost this month (UTC), and the model each AI tool uses.">
        <div className="relative -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
              <tr>
                <th scope="col" className="py-2.5 pr-3 font-bold">Tool</th>
                <th scope="col" className="py-2.5 pr-3 text-right font-bold">Calls (month)</th>
                <th scope="col" className="py-2.5 pr-3 text-right font-bold">Cost (month)</th>
                <th scope="col" className="py-2.5 pl-4 font-bold">Model</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.tool} className="border-t border-[#e2e0ea]">
                  <th scope="row" className="py-2.5 pr-3 font-bold text-[#121226]">
                    {t.label}
                  </th>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{t.calls.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{money(t.usd)}</td>
                  <td className="py-2.5 pl-4">
                    <AdminSelect
                      aria-label={`Model for ${t.label}`}
                      value={s.models[t.tool]}
                      onChange={(e) => set("models", { [t.tool]: e.target.value } as Partial<Settings["models"]>)}
                      className="lc-mono min-w-[180px] sm:text-[13px]!"
                    >
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
    </div>
  );
}
