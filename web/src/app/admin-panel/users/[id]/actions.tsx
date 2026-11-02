"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/form-field";
import { useAdminFetch } from "@/components/admin/reauth";
import { adminBtnDanger, adminBtnDark, adminBtnSoft } from "@/components/admin/admin-ui";
import { focusRing, pillBtn } from "@/components/admin/v5/ui";
import { roleLabel } from "@/lib/admin-labels";

const GRANT_OPTIONS = [
  { id: "starter", label: "Starter" },
  { id: "professional", label: "Professional" },
  { id: "lifetime", label: "Lifetime" },
] as const;

async function errorOf(r: Response | null, fallback: string): Promise<string> {
  if (!r) return fallback;
  const j = (await r.json().catch(() => ({}))) as { error?: unknown };
  return typeof j.error === "string" ? j.error : fallback;
}

/** Grant plan · Reset usage · Suspend, shown in the page header (as on the canvas). */
export function UserHeaderActions({
  userId,
  grantedPlan,
  grantedUntil,
  suspended,
  canSuspend,
  usageThisMonth,
}: {
  userId: string;
  grantedPlan: string | null;
  /** "YYYY-MM-DD" or null. */
  grantedUntil: string | null;
  suspended: boolean;
  /** False for your own account, or a staff account when you aren't an owner. */
  canSuspend: boolean;
  usageThisMonth: number;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [busy, setBusy] = useState<null | "reset" | "suspend">(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);

  async function resetUsage() {
    if (!confirm("Reset this user's AI usage for this month to zero? Their limits start over today.")) return;
    setBusy("reset");
    setMessage(null);
    const r = await adminFetch(`/api/admin-panel/users/${userId}/usage`, { method: "DELETE" }).catch(() => null);
    setBusy(null);
    if (!r?.ok) return setMessage({ ok: false, text: await errorOf(r, "Couldn't reset usage.") });
    const j = (await r.json().catch(() => ({}))) as { reset?: boolean };
    setMessage({ ok: true, text: j.reset ? "This month's AI usage is reset." : "Nothing to reset — no AI usage this month." });
    router.refresh();
  }

  async function toggleSuspend() {
    const next = !suspended;
    if (
      !confirm(
        next
          ? "Suspend this account? They're signed out everywhere and can't sign in until you restore it. Nothing is deleted."
          : "Restore this account? They can sign in again right away.",
      )
    )
      return;
    setBusy("suspend");
    setMessage(null);
    const r = await adminFetch(`/api/admin-panel/users/${userId}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: next }),
    }).catch(() => null);
    setBusy(null);
    if (!r?.ok) return setMessage({ ok: false, text: await errorOf(r, "Couldn't change the account status.") });
    setMessage({ ok: true, text: next ? "Account suspended." : "Account restored." });
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={pillBtn} onClick={() => setGrantOpen(true)} aria-haspopup="dialog">
          Grant plan
        </button>
        <button type="button" className={pillBtn} onClick={resetUsage} disabled={busy !== null || usageThisMonth === 0}>
          {busy === "reset" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Reset usage
        </button>
        {canSuspend ? (
          <button
            type="button"
            onClick={toggleSuspend}
            disabled={busy !== null}
            className={suspended ? pillBtn : `${adminBtnDanger} ${focusRing}`}
          >
            {busy === "suspend" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {suspended ? "Restore access" : "Suspend"}
          </button>
        ) : null}
      </div>
      {message ? (
        <p role={message.ok ? "status" : "alert"} className={`text-[13px] font-semibold ${message.ok ? "text-[#0b4f35]" : "text-[#a3222a]"}`}>
          {message.text}
        </p>
      ) : null}
      {grantOpen ? (
        <GrantPlanDialog
          userId={userId}
          grantedPlan={grantedPlan}
          grantedUntil={grantedUntil}
          onClose={(saved) => {
            setGrantOpen(false);
            if (saved) {
              setMessage({ ok: true, text: saved });
              router.refresh();
            }
          }}
        />
      ) : null}
    </div>
  );
}

function GrantPlanDialog({
  userId,
  grantedPlan,
  grantedUntil,
  onClose,
}: {
  userId: string;
  grantedPlan: string | null;
  grantedUntil: string | null;
  onClose: (savedMessage: string | null) => void;
}) {
  const adminFetch = useAdminFetch();
  const [plan, setPlan] = useState(grantedPlan ?? "professional");
  const [until, setUntil] = useState(grantedUntil ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.getElementById("grant-plan")?.focus();
  }, []);

  async function save(next: string) {
    setSaving(true);
    setError(null);
    const r = await adminFetch(`/api/admin-panel/users/${userId}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: next, until: next === "none" || !until ? null : until }),
    }).catch(() => null);
    setSaving(false);
    if (!r?.ok) return setError(await errorOf(r, "Couldn't save the plan."));
    onClose(next === "none" ? "Granted plan removed." : "Plan granted.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#111118]/45 px-4 py-6" onClick={() => onClose(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grant-title"
        aria-describedby="grant-desc"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose(null);
        }}
        className="w-full max-w-[440px] rounded-[28px] bg-white p-6 text-left text-[#121226] shadow-[0_40px_80px_-30px_rgba(10,6,60,.6)] sm:p-8"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(plan);
          }}
        >
          <h2 id="grant-title" className="text-[22px] font-extrabold tracking-[-0.02em]">
            Grant a plan
          </h2>
          <p id="grant-desc" className="mt-1.5 text-[14px] leading-[1.55] text-[#4a4862]">
            Gives this user the plan&apos;s AI limits without a payment. It doesn&apos;t touch their Polar subscription; they
            get whichever plan is higher.
          </p>
          <div className="mt-5 space-y-4">
            <FormField label="Plan" htmlFor="grant-plan">
              <AdminSelect id="grant-plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {GRANT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </AdminSelect>
            </FormField>
            <FormField label="Last day (optional)" hint="UTC · empty = no end date" htmlFor="grant-until">
              <AdminInput id="grant-until" type="date" value={until} onChange={(e) => setUntil(e.target.value)} />
            </FormField>
          </div>
          {error ? (
            <p role="alert" className="mt-4 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-semibold text-[#a3222a]">
              {error}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            {grantedPlan ? (
              <button type="button" disabled={saving} onClick={() => save("none")} className={`${adminBtnDanger} ${focusRing}`}>
                Remove grant
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => onClose(null)} className={`${adminBtnSoft} ${focusRing}`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`${adminBtnDark} ${focusRing}`}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {saving ? "Saving…" : "Grant plan"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Role and delete, inside the "Details" disclosure. */
export function UserDetailActions({
  userId,
  currentRole,
  canChangeRole,
}: {
  userId: string;
  currentRole: string;
  /** Only owners can change roles; others see it read-only. */
  canChangeRole: boolean;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveRole() {
    setSaving(true);
    setError(null);
    try {
      const r = await adminFetch(`/api/admin-panel/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!r.ok) setError(await errorOf(r, "Couldn't change the role."));
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this user and ALL their data? This cannot be undone.")) return;
    setDeleting(true);
    setError(null);
    const r = await adminFetch(`/api/admin-panel/users/${userId}`, { method: "DELETE" }).catch(() => null);
    if (r?.ok) {
      router.push("/admin-panel/users");
      return;
    }
    setDeleting(false);
    setError(await errorOf(r, "Couldn't delete this user."));
  }

  return (
    <div className="min-w-0 space-y-5">
      {error ? (
        <p role="alert" className="rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-semibold text-[#a3222a]">
          {error}
        </p>
      ) : null}
      <SectionCard
        title="Role"
        description="Promote or demote this user"
        action={<Shield className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
      >
        <div className="space-y-3">
          <FormField label="Account role" htmlFor="user-role">
            <AdminSelect id="user-role" value={role} disabled={!canChangeRole} onChange={(e) => setRole(e.target.value)}>
              {["user", "support", "editor", "admin", "owner"].map((r) => (
                <option key={r} value={r}>
                  {roleLabel(r)}
                </option>
              ))}
            </AdminSelect>
          </FormField>
          <button
            type="button"
            onClick={handleSaveRole}
            disabled={!canChangeRole || saving || role === currentRole}
            className={`lc-btn-lift inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#111118] px-5 text-[14px] font-semibold text-white hover:bg-[#2a2940] disabled:pointer-events-none disabled:opacity-45 ${focusRing} focus-visible:rounded-full!`}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {saving ? "Saving…" : "Save role"}
          </button>
          {!canChangeRole ? <p className="text-[13px] text-[#66647c]">Only an owner can change roles.</p> : null}
        </div>
      </SectionCard>

      <section aria-labelledby="danger-zone-title" className="rounded-[24px] bg-[#fbe2e3] p-6">
        <h2 id="danger-zone-title" className="flex items-center gap-2 text-[18px] font-extrabold text-[#a3222a]">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Danger zone
        </h2>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#8f1d22]">
          Deletion is irreversible and cascades to all user-owned data. To block access but keep the data, suspend instead.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={`lc-btn-lift mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#c42b30] px-5 text-[14px] font-semibold text-white hover:bg-[#a3222a] disabled:pointer-events-none disabled:opacity-50 ${focusRing} focus-visible:rounded-full!`}
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {deleting ? "Deleting…" : "Delete user"}
        </button>
      </section>
    </div>
  );
}
