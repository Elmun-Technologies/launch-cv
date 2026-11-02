"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import type { StaffRole } from "@/lib/admin-guard";
import type { Settings } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";
import { adminBtnDanger, adminBtnPrimary, adminBtnSoft } from "@/components/admin/admin-ui";

type Member = { id: string; email: string; name: string | null; role: StaffRole; viaEnv: boolean; totp: boolean };
const ROLES: StaffRole[] = ["owner", "admin", "editor", "support"];

export function SecurityClient({
  me,
  team,
  security,
  canManage,
  permissions,
  activity,
}: {
  me: { id: string; role: StaffRole };
  team: Member[];
  security: Settings["security"];
  canManage: boolean;
  /** Server-rendered permission matrix, shown under the team list. */
  permissions?: ReactNode;
  /** Server-rendered recent sensitive activity, shown under the sign-in rules. */
  activity?: ReactNode;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StaffRole>("editor");
  const [sec, setSec] = useState(security);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function call(key: string, url: string, body: unknown, method = "POST", okText = "Saved.") {
    setBusy(key);
    setMsg(null);
    const r = await adminFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setMsg(r?.ok ? { ok: true, text: okText } : { ok: false, text: j.error ?? "Couldn't save." });
    if (r?.ok) router.refresh();
    return !!r?.ok;
  }

  const toggleCls = (on: boolean) => `relative h-[26px] w-11 rounded-full transition-colors ${on ? "bg-[#5440e8]" : "bg-[#4a4862]"}`;

  return (
    <div className="flex flex-col gap-[18px]">
      {msg ? (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 text-[14px] font-medium ${msg.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"}`}
        >
          {msg.text}
        </p>
      ) : null}

      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex min-w-0 flex-col gap-[18px]">
          <SectionCard title="Team" description={`${team.length} staff account${team.length === 1 ? "" : "s"}`} flush>
            <ul>
              {team.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-[#e2e0ea] px-5 py-3.5 first:border-t-0 sm:px-6"
                >
                  <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
                    <p className="truncate text-[14px] font-bold text-[#121226]">
                      {m.name || m.email}
                      {m.id === me.id ? <span className="ml-1.5 text-[12px] font-medium text-[#66647c]">(you)</span> : null}
                    </p>
                    <p className="truncate text-[12px] text-[#66647c]">{m.email}</p>
                  </div>
                  <StatusBadge tone={m.totp ? "green" : "amber"} dot>
                    {m.totp ? "2FA on" : "2FA not set up"}
                  </StatusBadge>
                  {canManage && !m.viaEnv ? (
                    <AdminSelect
                      aria-label={`Role for ${m.email}`}
                      value={m.role}
                      disabled={busy !== null}
                      onChange={(e) => void call(`role-${m.id}`, "/api/admin-panel/team", { email: m.email, role: e.target.value }, "POST", "Role updated.")}
                      className="w-[132px]! capitalize"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </AdminSelect>
                  ) : (
                    <span className="min-w-[110px] text-[13px]">
                      <StatusBadge tone={m.role === "owner" ? "slate" : "violet"}>
                        <span className="capitalize">{m.role}</span>
                      </StatusBadge>
                      {m.viaEnv ? <span className="mt-1 block text-[11px] text-[#66647c]">via ADMIN_EMAILS</span> : null}
                    </span>
                  )}
                  {canManage ? (
                    <div className="flex gap-2">
                      {m.totp ? (
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => {
                            if (confirm(`Reset two-factor sign-in for ${m.email}? They'll set it up again on their next visit.`))
                              void call(`2fa-${m.id}`, "/api/admin-panel/2fa/reset", { userId: m.id }, "POST", "Two-factor reset.");
                          }}
                          className={`${adminBtnSoft} px-3.5! text-[13px]!`}
                        >
                          Reset 2FA
                        </button>
                      ) : null}
                      {!m.viaEnv && m.id !== me.id ? (
                        <button
                          type="button"
                          disabled={busy !== null}
                          onClick={() => {
                            if (confirm(`Remove ${m.email} from the team? Their account stays; they lose admin access.`))
                              void call(`rm-${m.id}`, "/api/admin-panel/team", { email: m.email, role: "user" }, "POST", "Removed from team.");
                          }}
                          className={`${adminBtnDanger} px-3.5! text-[13px]!`}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
            {canManage ? (
              <form
                className="flex flex-wrap items-end gap-3 border-t border-[#e2e0ea] bg-[#f7f6fb] px-5 py-4 sm:px-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (await call("add", "/api/admin-panel/team", { email, role }, "POST", `${email} added as ${role}.`)) setEmail("");
                }}
              >
                <label className="block min-w-0 basis-full text-[13px] font-bold text-[#4a4862] sm:min-w-[240px] sm:flex-1 sm:basis-auto">
                  Add a team member (they need an account with a verified email)
                  <AdminInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="mt-1.5" />
                </label>
                <AdminSelect aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="w-[132px]! capitalize">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </AdminSelect>
                <button type="submit" disabled={busy !== null} className={adminBtnPrimary}>
                  {busy === "add" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserPlus className="h-4 w-4" aria-hidden />}
                  Add
                </button>
              </form>
            ) : null}
          </SectionCard>

          {permissions}
        </div>

        <div className="flex min-w-0 flex-col gap-[18px]">
          <section className="rounded-[24px] bg-[#111118] p-5 text-white sm:p-6" aria-labelledby="signin-rules">
            <h2 id="signin-rules" className="text-[18px] font-extrabold tracking-[-0.01em]">
              Admin sign-in rules
            </h2>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#2f2d48] py-3">
              <span className="min-w-0 text-[14px]">
                <b id="req2fa-label" className="block">
                  Require an authenticator code for every admin
                </b>
                <span id="req2fa-desc" className="text-[12px] leading-[1.45] text-[#a9a6c2]">Strongly recommended. Staff who already set up 2FA always need it.</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={sec.requireAdmin2fa}
                aria-labelledby="req2fa-label"
                aria-describedby="req2fa-desc"
                disabled={!canManage}
                onClick={() => setSec({ ...sec, requireAdmin2fa: !sec.requireAdmin2fa })}
                className="inline-flex h-11 w-[52px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className={toggleCls(sec.requireAdmin2fa)}>
                  <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${sec.requireAdmin2fa ? "left-[21px]" : "left-[3px]"}`} />
                </span>
              </button>
            </div>
            <label className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2f2d48] py-3 text-[14px]">
              <span className="min-w-0">
                <b className="block">Sign out of admin after idle</b>
                <span className="text-[12px] text-[#a9a6c2]">Minutes, 5–720</span>
              </span>
              <AdminInput
                type="number"
                min={5}
                max={720}
                disabled={!canManage}
                value={sec.adminIdleMinutes}
                onChange={(e) => setSec({ ...sec, adminIdleMinutes: Number(e.target.value) || 5 })}
                className="w-[112px]! tabular-nums"
              />
            </label>
            {canManage ? (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void call("sec", "/api/admin-panel/settings/security", sec, "PUT")}
                className={`${adminBtnPrimary} mt-3`}
              >
                {busy === "sec" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save
              </button>
            ) : (
              <p className="mt-3 text-[13px] text-[#a9a6c2]">Only an owner can change these.</p>
            )}
          </section>

          {activity}
        </div>
      </div>
    </div>
  );
}
