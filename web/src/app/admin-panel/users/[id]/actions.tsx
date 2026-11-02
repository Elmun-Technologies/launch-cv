"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { AdminSelect, FormField } from "@/components/admin/form-field";
import { useAdminFetch } from "@/components/admin/reauth";
import { focusRing } from "@/components/admin/v5/ui";

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
      if (!r.ok) setError((await r.json().catch(() => ({}))).error ?? "Couldn't change the role.");
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
    setError((r && (await r.json().catch(() => ({}))).error) || "Couldn't delete this user.");
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
          <FormField label="Account role">
            <AdminSelect value={role} disabled={!canChangeRole} onChange={(e) => setRole(e.target.value)}>
              {["user", "support", "editor", "admin", "owner"].map((r) => (
                <option key={r} value={r}>
                  {r}
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
          Deletion is irreversible and cascades to all user-owned data.
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
