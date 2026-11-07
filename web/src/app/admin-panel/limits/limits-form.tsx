"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ALERT_LEVEL_CHOICES, type AiTool, type QuotaPlan, type Settings, type SettingsGroup } from "@/lib/app-settings";
import { PLAN_PRICE_USD } from "@/lib/plan-config";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";
import { adminBtnPrimary, adminBtnSoft, adminH1, adminLead } from "@/components/admin/admin-ui";

type ToolRow = { tool: AiTool; label: string; calls: number; usd: number };

/** Groups saved by the page-level Save; switches save on their own, immediately. */
const PAGE_GROUPS = ["planLimits", "rateLimits", "budget", "models"] as const;

const SWITCHES: { key: keyof Settings["switches"]; label: string; on: string; off: string }[] = [
  { key: "aiTools", label: "AI tools", on: "Turn off every AI call instantly", off: "All AI features answer “paused for maintenance”." },
  { key: "freeAtsCheck", label: "Free ATS check", on: "Hide the public checker", off: "The public free check is turned off." },
  { key: "signups", label: "New sign-ups", on: "Pause registrations", off: "Registration and new Google accounts are refused." },
  { key: "checkout", label: "Checkout", on: "Pause new purchases", off: "Buy buttons show “checkout is paused”." },
  {
    key: "freeTools",
    label: "Free writing tools",
    on: "Bullet, summary and resignation letter generators",
    off: "The free bullet, summary and resignation letter generators answer “paused”.",
  },
];

const RATE_LABELS: Record<keyof Settings["rateLimits"], { label: string; unit: string }> = {
  freeAtsPerIpPerHour: { label: "Free ATS checks per network", unit: "/ hour" },
  freeToolsPerIpPerDay: { label: "Free writing-tool generations per network", unit: "/ day" },
  registerPerIpPerHour: { label: "Sign-ups per IP", unit: "/ hour" },
  loginPer15Min: { label: "Login attempts", unit: "/ 15 min" },
  forgotPerIpPerHour: { label: "Password resets per IP", unit: "/ hour" },
  aiPerUserPerHour: { label: "AI requests per user", unit: "/ hour" },
  importPerUserPerHour: { label: "Imports per user", unit: "/ hour" },
  pdfPerUserPerHour: { label: "PDF exports per user", unit: "/ hour" },
};

const PLAN_ROWS: { plan: QuotaPlan; label: string }[] = [
  { plan: "free", label: "Free (no plan)" },
  { plan: "starter", label: `Starter · $${PLAN_PRICE_USD.starter}` },
  { plan: "professional", label: `Professional · $${PLAN_PRICE_USD.professional}` },
  { plan: "lifetime", label: `Lifetime · $${PLAN_PRICE_USD.lifetime}` },
  { plan: "elite", label: "Elite (legacy)" },
];

/** Columns in canvas order. Bullet rewrites and ATS checks have no per-plan quota in the app (see report). */
const QUOTA_COLS: { key: "jd" | "roleFit" | "packet"; label: string }[] = [
  { key: "jd", label: "Job-post analyses / mo" },
  { key: "roleFit", label: "Role-fit checks / mo" },
  { key: "packet", label: "Packets / mo" },
];

const CUTOFF: { value: Settings["budget"]["onCap"]; label: string; hint: string }[] = [
  { value: "pause_free", label: "Pause AI for free accounts only", hint: "Paying users keep working; overage is logged" },
  { value: "pause_all", label: "Pause all AI tools", hint: "Everyone sees “AI tools are busy, try again later”" },
  { value: "alert_only", label: "Keep going and alert me", hint: "No hard stop — not recommended" },
];

const fmtInt = (n: number) => n.toLocaleString("en-US");
const fmtMoney = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n < 10 ? 2 : 0, maximumFractionDigits: n < 10 ? 2 : 0 })}`;

/** Text input that shows "2,000" and accepts "2000" or "2,000". */
function NumInput({
  value,
  onChange,
  money: isMoney = false,
  className = "",
  ...rest
}: { value: number; onChange: (n: number) => void; money?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  const [text, setText] = useState<string | null>(null);
  const shown = text ?? (isMoney ? fmtMoney(value) : fmtInt(value));
  return (
    <AdminInput
      {...rest}
      type="text"
      inputMode={isMoney ? "decimal" : "numeric"}
      value={shown}
      onFocus={() => setText(String(value))}
      onBlur={() => setText(null)}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^\d.]/g, "");
        setText(raw);
        const n = raw === "" ? 0 : Number(raw);
        if (Number.isFinite(n)) onChange(isMoney ? n : Math.round(n));
      }}
      className={`tabular-nums ${className}`}
    />
  );
}

export function LimitsForm({ initial, spend, tools, models }: { initial: Settings; spend: { day: number; month: number }; tools: ToolRow[]; models: string[] }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [saved, setSaved] = useState<Settings>(initial);
  const [s, setS] = useState<Settings>(initial);
  const [busy, setBusy] = useState<"page" | "switches" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [swMsg, setSwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const dirtyGroups = PAGE_GROUPS.filter((g) => JSON.stringify(s[g]) !== JSON.stringify(saved[g]));
  const dirty = dirtyGroups.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function put(group: SettingsGroup, value: unknown, action: string) {
    const r = await adminFetch(
      `/api/admin-panel/settings/${group}`,
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) },
      { action },
    ).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    return r?.ok ? { ok: true as const, value: j.value } : { ok: false as const, error: (j.error as string) ?? "Couldn't save." };
  }

  async function saveAll() {
    setBusy("page");
    setMsg(null);
    let next = saved;
    for (const g of dirtyGroups) {
      const res = await put(g, s[g], "save limits & budgets");
      if (!res.ok) {
        setBusy(null);
        setSaved(next);
        setMsg({ ok: false, text: res.error });
        return;
      }
      next = { ...next, [g]: res.value };
    }
    setSaved(next);
    setS((cur) => ({ ...cur, ...Object.fromEntries(dirtyGroups.map((g) => [g, next[g]])) }));
    setBusy(null);
    setMsg({ ok: true, text: "Saved. Changes apply within 30 seconds." });
    router.refresh();
  }

  function discard() {
    setS((cur) => ({ ...cur, ...Object.fromEntries(PAGE_GROUPS.map((g) => [g, saved[g]])) }));
    setMsg(null);
  }

  async function flip(key: keyof Settings["switches"], label: string) {
    const on = s.switches[key];
    setBusy("switches");
    setSwMsg(null);
    const res = await put("switches", { ...saved.switches, [key]: !on }, `turn ${on ? "off" : "on"} ${label}`);
    setBusy(null);
    if (res.ok) {
      setSaved((p) => ({ ...p, switches: res.value }));
      setS((p) => ({ ...p, switches: res.value }));
      setSwMsg({ ok: true, text: "Saved." });
      router.refresh();
    } else setSwMsg({ ok: false, text: res.error });
  }

  const set = <G extends SettingsGroup>(group: G, patch: Partial<Settings[G]>) => setS((prev) => ({ ...prev, [group]: { ...prev[group], ...patch } }));

  const cap = s.budget.monthlyCapUsd;
  const pct = cap > 0 ? Math.min(100, (spend.month / cap) * 100) : 0;
  const barColor = pct >= 100 ? "bg-[#c42b30]" : pct >= 80 ? "bg-[#c77700]" : "bg-[#5440e8]";
  const labelCls = "block text-[13px] font-bold text-[#4a4862]";
  const levels = s.budget.alertLevels;

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className={adminH1}>Limits &amp; budgets</h1>
          <p className={adminLead}>Plan limits, abuse protection and spend caps. Changes apply within 30 seconds and are written to the audit log.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dirty ? <span className="text-[13px] font-semibold text-[#7a4600]">Unsaved changes</span> : null}
          <button type="button" onClick={discard} disabled={!dirty || busy !== null} className={adminBtnSoft}>
            Discard
          </button>
          <button type="button" onClick={() => void saveAll()} disabled={!dirty || busy !== null} className={adminBtnPrimary}>
            {busy === "page" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save changes
          </button>
        </div>
      </div>
      {msg ? (
        <p role="status" className={`rounded-2xl px-4 py-3 text-[14px] font-medium ${msg.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"}`}>
          {msg.text}
        </p>
      ) : null}

      {/* Plan limits */}
      <SectionCard title="Plan limits" action={<span className="text-[12px] text-[#66647c]">Pricing page and checkout read these values</span>}>
        <div className="relative -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6" tabIndex={0} role="region" aria-label="Plan limits table">
          <table className="w-full min-w-[600px] text-left text-[14px]">
            <thead className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
              <tr>
                <th scope="col" className="py-2.5 pr-3 font-bold">Plan</th>
                {QUOTA_COLS.map((c) => (
                  <th key={c.key} scope="col" className="py-2.5 pr-3 font-bold last:pr-0">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_ROWS.map(({ plan, label }) => (
                <tr key={plan} className="border-t border-[#e2e0ea]">
                  <th scope="row" className="whitespace-nowrap py-2.5 pr-3 font-bold text-[#121226]">
                    {label}
                  </th>
                  {QUOTA_COLS.map((c) => (
                    <td key={c.key} className="py-2.5 pr-3 last:pr-0">
                      <NumInput
                        aria-label={`${label}: ${c.label}`}
                        value={s.planLimits[plan][c.key]}
                        onChange={(n) => set("planLimits", { [plan]: { ...s.planLimits[plan], [c.key]: n } } as Partial<Settings["planLimits"]>)}
                        className="max-w-[160px]"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] leading-[1.5] text-[#66647c]">Free accounts with 0 see the upgrade prompt. Limits reset on the 1st of each month.</p>
      </SectionCard>

      <div className="grid items-start gap-[18px] lg:grid-cols-3">
        {/* Abuse protection */}
        <SectionCard title="Abuse protection" description="Counted in the database, so limits hold across every server.">
          <div className="grid gap-3.5">
            {(Object.keys(RATE_LABELS) as (keyof Settings["rateLimits"])[]).map((k) => (
              <label key={k} className={labelCls}>
                {RATE_LABELS[k].label}
                <span className="mt-1.5 flex items-center gap-2">
                  <NumInput value={s.rateLimits[k]} onChange={(n) => set("rateLimits", { [k]: n } as Partial<Settings["rateLimits"]>)} />
                  <span className="w-[52px] shrink-0 text-[13px] font-medium text-[#66647c]">{RATE_LABELS[k].unit}</span>
                </span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* Spend caps */}
        <SectionCard title="Spend caps" description="0 means no cap. Days and months are UTC.">
          <div>
            <div className="flex items-baseline justify-between gap-3 text-[14px]">
              <b className="text-[#121226]">OpenAI · this month</b>
              <span className="tabular-nums text-[#4a4862]">
                {money(spend.month)} / {cap > 0 ? money(cap) : "no cap"}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#efedf7]" role="progressbar" aria-label="OpenAI monthly cap used" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${cap > 0 ? pct : 0}%` }} />
            </div>
            <p className="mt-1.5 text-[12px] text-[#66647c]">
              Today {money(spend.day)}
              {s.budget.dailyCapUsd > 0 ? ` / ${money(s.budget.dailyCapUsd)}` : ""}. OpenAI is the only provider that bills per call.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className={labelCls}>
              Monthly cap (USD)
              <NumInput money value={s.budget.monthlyCapUsd} onChange={(n) => set("budget", { monthlyCapUsd: n })} className="mt-1.5" />
            </label>
            <label className={labelCls}>
              Daily cap (USD)
              <NumInput money value={s.budget.dailyCapUsd} onChange={(n) => set("budget", { dailyCapUsd: n })} className="mt-1.5" />
            </label>
          </div>
          <fieldset className="mt-4">
            <legend className={labelCls}>When a cap is reached</legend>
            <div className="mt-1.5 divide-y divide-[#e2e0ea] border-y border-[#e2e0ea]">
              {CUTOFF.map((c) => (
                <label key={c.value} className="flex min-h-[44px] cursor-pointer items-start gap-2.5 py-2.5">
                  <input
                    type="radio"
                    name="onCap"
                    value={c.value}
                    checked={s.budget.onCap === c.value}
                    onChange={() => set("budget", { onCap: c.value })}
                    className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#5440e8]"
                  />
                  <span className="min-w-0">
                    <b className="block text-[14px] text-[#121226]">{c.label}</b>
                    <span className="block text-[12px] leading-[1.45] text-[#66647c]">{c.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="mt-4">
            <legend className={labelCls}>Email me at (% of monthly cap)</legend>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {ALERT_LEVEL_CHOICES.map((l) => {
                const on = levels.includes(l);
                return (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("budget", { alertLevels: on ? levels.filter((x) => x !== l) : [...levels, l].sort((a, b) => a - b) })}
                    className={`inline-flex min-h-[40px] min-w-[52px] items-center justify-center rounded-full px-3 text-[13px] font-bold transition-colors ${
                      on ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#4a4862] hover:bg-[#e4dfff]"
                    }`}
                  >
                    {l}%
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[12px] text-[#66647c]">{levels.length ? `One email at each of ${levels.map((l) => `${l}%`).join(", ")}.` : "No alert emails."}</p>
          </fieldset>
          <div className="mt-4 grid gap-3">
            <label className={labelCls}>
              Alert email
              <AdminInput type="email" value={s.budget.alertEmail} placeholder="you@company.com" onChange={(e) => set("budget", { alertEmail: e.target.value })} className="mt-1.5" />
            </label>
            <label className={labelCls}>
              Per-user daily safety cap (USD)
              <NumInput money value={s.budget.perUserDailyUsd} onChange={(n) => set("budget", { perUserDailyUsd: n })} className="mt-1.5" />
            </label>
          </div>
        </SectionCard>

        {/* Kill switches */}
        <section className="rounded-[24px] bg-[#111118] p-5 text-white sm:p-6" aria-labelledby="switches-title">
          <h2 id="switches-title" className="text-[18px] font-extrabold tracking-[-0.01em]">
            Kill switches
          </h2>
          <p className="mt-1 text-[13px] leading-[1.5] text-[#a9a6c2]">Save immediately and take effect within 30 seconds.</p>
          <ul className="mt-3">
            {SWITCHES.map((sw) => {
              const on = s.switches[sw.key];
              return (
                <li key={sw.key} className="flex items-center justify-between gap-3 border-t border-[#2f2d48] py-2.5">
                  <div className="min-w-0">
                    <p id={`sw-${sw.key}`} className="text-[14px] font-bold">
                      {sw.label}
                    </p>
                    <p className={`text-[12px] leading-[1.45] ${on ? "text-[#a9a6c2]" : "font-semibold text-[#ffb08a]"}`}>{on ? sw.on : sw.off}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-labelledby={`sw-${sw.key}`}
                    disabled={busy !== null}
                    onClick={() => void flip(sw.key, sw.label)}
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
          {swMsg ? (
            <p role="status" className={`mt-2 text-[13px] font-semibold ${swMsg.ok ? "text-[#7ee0b5]" : "text-[#ff9ca0]"}`}>
              {swMsg.text}
            </p>
          ) : null}
        </section>
      </div>

      <SectionCard title="Model per tool" description="Calls and cost this month (UTC), and the model each AI tool uses.">
        <div className="relative -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6" tabIndex={0} role="region" aria-label="Model per tool table">
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
                  <td className="py-2.5 pr-3 text-right tabular-nums">{fmtInt(t.calls)}</td>
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
      </SectionCard>
    </div>
  );
}
