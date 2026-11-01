"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { StaffRole } from "@/lib/admin-guard";
import type { Settings } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";

type Member = { id: string; email: string; name: string | null; role: StaffRole; viaEnv: boolean; totp: boolean };
const ROLES: StaffRole[] = ["owner", "admin", "editor", "support"];

export function SecurityClient({
  me,
  team,
  security,
  canManage,
}: {
  me: { id: string; role: StaffRole };
  team: Member[];
  security: Settings["security"];
  canManage: boolean;
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

  return (
    <div className="space-y-5">
      {msg ? (
        <p role="status" className={`rounded-lg px-4 py-2.5 text-[13px] ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
          {msg.text}
        </p>
      ) : null}

      <SectionCard title="Team" description={`${team.length} staff account${team.length === 1 ? "" : "s"}`} flush>
        <ul className="divide-y divide-[#E5E5E2]">
          {team.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
              <div className="min-w-[220px] flex-1">
                <p className="text-[13px] font-medium text-[#111111]">
                  {m.name || m.email}
                  {m.id === me.id ? <span className="ml-1.5 text-[11px] font-normal text-[#8A8A86]">(you)</span> : null}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">{m.email}</p>
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
                  className="!w-[130px] !py-1 capitalize"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </AdminSelect>
              ) : (
                <span className="w-[130px] text-[12px] capitalize text-[#3F3F3F]">
                  {m.role}
                  {m.viaEnv ? <span className="block text-[11px] normal-case text-[#8A8A86]">via ADMIN_EMAILS</span> : null}
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
                      className="h-8 rounded-lg border border-[#E5E5E2] px-3 text-[12px] font-semibold text-[#3F3F3F] hover:bg-[#FAFAF9] disabled:opacity-60"
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
                      className="h-8 rounded-lg border border-red-200 px-3 text-[12px] font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
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
            className="flex flex-wrap items-end gap-3 border-t border-[#E5E5E2] bg-[#FAFAF9] px-5 py-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (await call("add", "/api/admin-panel/team", { email, role }, "POST", `${email} added as ${role}.`)) setEmail("");
            }}
          >
            <label className="block min-w-[240px] flex-1 text-[12px] font-semibold text-[#3F3F3F]">
              Add a team member (they need an account with a verified email)
              <AdminInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="mt-1.5" />
            </label>
            <AdminSelect aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className="!w-[130px] capitalize">
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </AdminSelect>
            <button type="submit" disabled={busy !== null} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#111111] px-4 text-[13px] font-semibold text-white hover:bg-[#2b2b2b] disabled:opacity-60">
              {busy === "add" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Add
            </button>
          </form>
        ) : null}
      </SectionCard>

      <SectionCard title="Admin sign-in rules">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 text-[13px] text-[#111111]">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={sec.requireAdmin2fa}
              disabled={!canManage}
              onChange={(e) => setSec({ ...sec, requireAdmin2fa: e.target.checked })}
            />
            <span>
              <b>Require an authenticator code for every admin</b>
              <span className="block text-[12px] text-[#6B6B6B]">Strongly recommended. Staff who already set up 2FA always need it.</span>
            </span>
          </label>
          <label className="block text-[12px] font-semibold text-[#3F3F3F]">
            Sign out of admin after idle (minutes)
            <AdminInput
              type="number"
              min={5}
              max={720}
              disabled={!canManage}
              value={sec.adminIdleMinutes}
              onChange={(e) => setSec({ ...sec, adminIdleMinutes: Number(e.target.value) || 5 })}
              className="mt-1.5"
            />
          </label>
        </div>
        {canManage ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void call("sec", "/api/admin-panel/settings/security", sec, "PUT")}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[#111111] px-4 text-[13px] font-semibold text-white hover:bg-[#2b2b2b] disabled:opacity-60"
          >
            {busy === "sec" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save
          </button>
        ) : (
          <p className="mt-3 text-[12px] text-[#6B6B6B]">Only an owner can change these.</p>
        )}
      </SectionCard>
    </div>
  );
}
