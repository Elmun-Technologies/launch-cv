"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, UserPlus } from "lucide-react";
import type { StaffRole } from "@/lib/admin-guard";
import type { Settings } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminInput, AdminSelect } from "@/components/admin/form-field";
import { RowMenu, type RowMenuItem } from "@/components/admin/row-menu";
import { RecoveryCodesList } from "@/components/admin/recovery-codes-list";
import { adminBtnDark, adminBtnPrimary, adminBtnSoft } from "@/components/admin/admin-ui";

type Member = { id: string; email: string; name: string | null; role: StaffRole; viaEnv: boolean; totp: boolean; lastActive: string };
type EmailState = { configured: boolean; last: { ok: boolean; reason: string | null; when: string } | null };
const ROLES: StaffRole[] = ["owner", "admin", "editor", "support"];
const ROLE_TONE: Record<StaffRole, "slate" | "violet" | "blue" | "default"> = { owner: "slate", admin: "violet", editor: "blue", support: "default" };

function Toggle({ on, labelledBy, describedBy, disabled, onClick }: { on: boolean; labelledBy: string; describedBy?: string; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 w-[52px] shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className={`relative h-[26px] w-11 rounded-full transition-colors ${on ? "bg-[#5440e8]" : "bg-[#4a4862]"}`}>
        <span className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[21px]" : "left-[3px]"}`} />
      </span>
    </button>
  );
}

function Rule({ id, title, hint, children, extra }: { id: string; title: string; hint: ReactNode; children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="border-t border-[#2f2d48] py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-[14px]">
          <b id={`${id}-label`} className="block">
            {title}
          </b>
          <span id={`${id}-desc`} className="block text-[12px] leading-[1.45] text-[#a9a6c2]">
            {hint}
          </span>
        </span>
        {children}
      </div>
      {extra}
    </div>
  );
}

export function SecurityClient({
  me,
  team,
  security,
  canManage,
  currentIp,
  email,
  recoveryLeft,
  permissions,
  activity,
}: {
  me: { id: string; role: StaffRole; totp: boolean };
  team: Member[];
  security: Settings["security"];
  canManage: boolean;
  /** This request's address, so the allow-list can include it. */
  currentIp: string | null;
  email: EmailState;
  recoveryLeft: number;
  /** Server-rendered permission matrix, shown under the team list. */
  permissions?: ReactNode;
  /** Server-rendered recent sensitive activity, shown under the sign-in rules. */
  activity?: ReactNode;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<StaffRole>("editor");
  const [sec, setSec] = useState(security);
  const [ipText, setIpText] = useState(security.ipAllowlist.join("\n"));
  const [ipOn, setIpOn] = useState(security.ipAllowlist.length > 0);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const inviteInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inviteOpen) inviteInput.current?.focus();
  }, [inviteOpen]);

  async function call(key: string, url: string, body: unknown, action: string, okText = "Saved.", method = "POST") {
    setBusy(key);
    setMsg(null);
    const r = await adminFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }, { action }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setMsg(r?.ok ? { ok: true, text: okText } : { ok: false, text: j.error ?? "Couldn't save." });
    if (r?.ok) router.refresh();
    return { ok: !!r?.ok, j, status: r?.status ?? 0 };
  }

  const ipList = ipOn ? ipText.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean) : [];

  async function saveRules() {
    const value = { ...sec, ipAllowlist: ipList };
    let res = await call("sec", "/api/admin-panel/settings/security", value, "save the admin sign-in rules", "Sign-in rules saved.", "PUT");
    if (!res.ok && res.j.code === "ip_lockout") {
      if (!confirm(`${res.j.error} Save anyway? You'd need another network, or ADMIN_IP_ALLOWLIST_DISABLED=1 in hosting, to get back in.`)) {
        setMsg({ ok: false, text: "Not saved. Add your current address to the list first." });
        return;
      }
      res = await call("sec", "/api/admin-panel/settings/security?confirmLockout=1", value, "save the admin sign-in rules", "Sign-in rules saved.", "PUT");
    }
    if (res.ok && res.j.value) {
      setSec(res.j.value);
      setIpText((res.j.value.ipAllowlist as string[]).join("\n"));
      setIpOn((res.j.value.ipAllowlist as string[]).length > 0);
    }
  }

  async function regenerate() {
    if (recoveryLeft > 0 && !confirm("Replace your recovery codes? The old ones stop working.")) return;
    setBusy("codes");
    setMsg(null);
    const r = await adminFetch("/api/admin-panel/2fa/recovery-codes", { method: "POST" }, { action: "generate new recovery codes" }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok && Array.isArray(j.codes)) {
      setCodes(j.codes);
      router.refresh();
    } else setMsg({ ok: false, text: j.error ?? "Couldn't generate codes." });
  }

  const menuFor = (m: Member): RowMenuItem[] => {
    if (!canManage) return [];
    const items: RowMenuItem[] = [];
    if (!m.viaEnv) {
      for (const r of ROLES.filter((r) => r !== m.role)) {
        items.push({
          label: `Make ${r}`,
          onSelect: () => void call(`role-${m.id}`, "/api/admin-panel/team", { email: m.email, role: r }, `make ${m.email} ${r === "admin" || r === "owner" ? "an" : "a"} ${r}`, "Role updated."),
        });
      }
    }
    const tail: RowMenuItem[] = [];
    if (m.totp) {
      tail.push({
        label: "Reset 2FA",
        onSelect: () => {
          if (confirm(`Reset two-factor sign-in for ${m.email}? They'll set it up again on their next visit.`))
            void call(`2fa-${m.id}`, "/api/admin-panel/2fa/reset", { userId: m.id }, `reset two-factor sign-in for ${m.email}`, "Two-factor reset.");
        },
      });
    }
    if (!m.viaEnv && m.id !== me.id) {
      tail.push({
        label: "Remove from team",
        danger: true,
        onSelect: () => {
          if (confirm(`Remove ${m.email} from the team? Their account stays; they lose admin access.`))
            void call(`rm-${m.id}`, "/api/admin-panel/team", { email: m.email, role: "user" }, `remove ${m.email} from the team`, "Removed from team.");
        },
      });
    }
    return items.length && tail.length ? [...items, "separator", ...tail] : [...items, ...tail];
  };

  const emailBadge = !email.configured ? (
    <StatusBadge tone="amber">Email not configured</StatusBadge>
  ) : email.last && !email.last.ok ? (
    <StatusBadge tone="amber">Last email failed</StatusBadge>
  ) : null;

  return (
    <div className="flex flex-col gap-[18px]">
      {msg ? (
        <p role="status" className={`rounded-2xl px-4 py-3 text-[14px] font-medium ${msg.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"}`}>
          {msg.text}
        </p>
      ) : null}

      <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="flex min-w-0 flex-col gap-[18px]">
          <SectionCard
            title="Team"
            description={`${team.length} staff account${team.length === 1 ? "" : "s"}`}
            flush
            action={
              canManage ? (
                <button type="button" onClick={() => setInviteOpen((o) => !o)} aria-expanded={inviteOpen} aria-controls="invite-form" className={adminBtnPrimary}>
                  <UserPlus className="h-4 w-4" aria-hidden /> Invite
                </button>
              ) : null
            }
          >
            {canManage && inviteOpen ? (
              <form
                id="invite-form"
                className="flex flex-wrap items-end gap-3 border-b border-[#e2e0ea] bg-[#f7f6fb] px-5 py-4 sm:px-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await call("add", "/api/admin-panel/team", { email: inviteEmail, role: inviteRole }, `add ${inviteEmail} as ${inviteRole}`, `${inviteEmail} added as ${inviteRole}.`);
                  if (res.ok) {
                    setInviteEmail("");
                    setInviteOpen(false);
                  }
                }}
              >
                <label className="block min-w-0 basis-full text-[13px] font-bold text-[#4a4862] sm:min-w-[220px] sm:flex-1 sm:basis-auto">
                  Email (they need an account with a verified email)
                  <input
                    ref={inviteInput}
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="mt-1.5 block h-11 w-full rounded-[12px] border-[1.5px] border-[#e2e0ea] bg-white px-3.5 text-[15px] font-normal text-[#121226] outline-none hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15"
                  />
                </label>
                <AdminSelect aria-label="Role" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as StaffRole)} className="w-[132px]! capitalize">
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </AdminSelect>
                <button type="submit" disabled={busy !== null} className={adminBtnDark}>
                  {busy === "add" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Add to team
                </button>
              </form>
            ) : null}
            <ul>
              {team.map((m) => (
                <li
                  key={m.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto_auto_72px_40px] sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-[#121226]">
                      {m.name || m.email}
                      {m.id === me.id ? <span className="ml-1.5 text-[12px] font-medium text-[#66647c]">(you)</span> : null}
                    </p>
                    <p className="truncate text-[12px] text-[#66647c]">
                      {m.email}
                      {m.viaEnv ? " · via ADMIN_EMAILS" : ""}
                    </p>
                  </div>
                  <div className="col-start-2 row-start-1 sm:hidden">
                    <RowMenu label={`Actions for ${m.email}`} items={menuFor(m)} disabled={busy !== null} />
                  </div>
                  <div className="col-span-2 flex flex-wrap items-center gap-2 sm:contents">
                    <StatusBadge tone={ROLE_TONE[m.role]}>
                      <span className="capitalize">{m.role}</span>
                    </StatusBadge>
                    <StatusBadge tone={m.totp ? "green" : "amber"} dot>
                      {m.totp ? "2FA on" : "2FA off"}
                    </StatusBadge>
                    <span className="text-[12px] text-[#66647c] sm:text-right" title="Last active in the admin panel">
                      <span className="sm:sr-only">Last active </span>
                      {m.lastActive}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <RowMenu label={`Actions for ${m.email}`} items={menuFor(m)} disabled={busy !== null} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          {permissions}
        </div>

        <div className="flex min-w-0 flex-col gap-[18px]">
          <section className="rounded-[24px] bg-[#111118] p-5 text-white sm:p-6" aria-labelledby="signin-rules">
            <h2 id="signin-rules" className="text-[18px] font-extrabold tracking-[-0.01em]">
              Sign-in rules for admins
            </h2>
            <div className="mt-3">
              <Rule id="r-2fa" title="Require 2FA for all admins" hint="Authenticator app codes; recovery codes shown once">
                <Toggle
                  on={sec.requireAdmin2fa}
                  labelledBy="r-2fa-label"
                  describedBy="r-2fa-desc"
                  disabled={!canManage}
                  onClick={() => setSec({ ...sec, requireAdmin2fa: !sec.requireAdmin2fa })}
                />
              </Rule>
              <Rule id="r-reauth" title="Re-confirm before secret changes" hint="Password + 2FA, valid 5 minutes. Always on.">
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-[#a9a6c2]" aria-hidden />
                  <Toggle on labelledBy="r-reauth-label" describedBy="r-reauth-desc" disabled />
                </span>
              </Rule>
              <Rule id="r-idle" title="Admin session timeout" hint={`Sign out after ${sec.adminIdleMinutes} min idle (5–720)`}>
                <AdminInput
                  type="number"
                  min={5}
                  max={720}
                  aria-label="Admin session timeout, in minutes"
                  aria-describedby="r-idle-desc"
                  disabled={!canManage}
                  value={sec.adminIdleMinutes}
                  onChange={(e) => setSec({ ...sec, adminIdleMinutes: Number(e.target.value) || 5 })}
                  className="w-[96px]! tabular-nums"
                />
              </Rule>
              <Rule
                id="r-ip"
                title="Restrict admin to IP list"
                hint="Optional — your office or VPN"
                extra={
                  ipOn ? (
                    <div className="mt-2.5">
                      <label htmlFor="r-ip-list" className="block text-[12px] font-bold text-[#c9c7d8]">
                        Allowed addresses or ranges, one per line
                      </label>
                      <textarea
                        id="r-ip-list"
                        rows={3}
                        disabled={!canManage}
                        value={ipText}
                        onChange={(e) => setIpText(e.target.value)}
                        placeholder={"203.0.113.0/24\n2001:db8::/48"}
                        spellCheck={false}
                        className="lc-mono mt-1 block w-full rounded-[12px] border-[1.5px] border-[#2f2d48] bg-[#1d1c2e] px-3 py-2 text-[13px] text-white outline-none placeholder:text-[#7c7a94] focus:border-[#c9c0ff] focus:ring-4 focus:ring-[#5440e8]/30"
                      />
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[12px] text-[#a9a6c2]">
                        Your address: <span className="lc-mono text-white">{currentIp ?? "unknown"}</span>
                        {canManage && currentIp && !ipList.includes(currentIp) ? (
                          <button
                            type="button"
                            onClick={() => setIpText((t) => (t.trim() ? `${t.trim()}\n${currentIp}` : currentIp))}
                            className="inline-flex min-h-[44px] items-center font-bold text-[#c9c0ff] hover:text-white sm:min-h-0"
                          >
                            Add my address
                          </button>
                        ) : null}
                      </p>
                    </div>
                  ) : null
                }
              >
                <Toggle
                  on={ipOn}
                  labelledBy="r-ip-label"
                  describedBy="r-ip-desc"
                  disabled={!canManage}
                  onClick={() => {
                    if (!ipOn && !ipText.trim() && currentIp) setIpText(currentIp);
                    setIpOn(!ipOn);
                  }}
                />
              </Rule>
              <Rule
                id="r-mail"
                title="Email me on every key change"
                hint={email.configured ? "To every owner address" : "Turn on email in Integrations → Resend to send these"}
                extra={emailBadge ? <div className="mt-1.5">{emailBadge}</div> : null}
              >
                <Toggle
                  on={sec.emailOwnerOnKeyChange}
                  labelledBy="r-mail-label"
                  describedBy="r-mail-desc"
                  disabled={!canManage}
                  onClick={() => setSec({ ...sec, emailOwnerOnKeyChange: !sec.emailOwnerOnKeyChange })}
                />
              </Rule>
            </div>
            {canManage ? (
              <button type="button" disabled={busy !== null} onClick={() => void saveRules()} className={`${adminBtnPrimary} mt-3`}>
                {busy === "sec" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Save rules
              </button>
            ) : (
              <p className="mt-3 text-[13px] text-[#a9a6c2]">Only an owner can change these.</p>
            )}
          </section>

          {me.totp ? (
            <SectionCard
              title="Your recovery codes"
              description={codes ? "Shown once — save them now." : `${recoveryLeft} of 10 left. Each code signs you in once if you lose your phone.`}
              action={
                <button type="button" onClick={() => void regenerate()} disabled={busy !== null} className={adminBtnSoft}>
                  {busy === "codes" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  {recoveryLeft ? "Regenerate" : "Generate"}
                </button>
              }
            >
              {codes ? (
                <RecoveryCodesList codes={codes} email={team.find((t) => t.id === me.id)?.email ?? ""} />
              ) : (
                <p className={`text-[13px] ${recoveryLeft <= 2 ? "font-semibold text-[#a3262b]" : "text-[#4a4862]"}`}>
                  {recoveryLeft === 0 ? "You have no recovery codes. Generate a set and store it in your password manager." : recoveryLeft <= 2 ? "Running low — generate a new set." : "Regenerating replaces every old code."}
                </p>
              )}
            </SectionCard>
          ) : null}

          {activity}
        </div>
      </div>
    </div>
  );
}
