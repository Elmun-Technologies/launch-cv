"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { AdminSelect, FormField } from "@/components/admin/form-field";
import { useAdminFetch } from "@/components/admin/reauth";

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
    <div className="space-y-5">
      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-[13px] text-red-800">
          {error}
        </p>
      ) : null}
      <SectionCard
        title="Role"
        description="Promote or demote this user"
        action={<Shield className="h-4 w-4 text-[#2563EB]" />}
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] py-2 text-[13px] font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save role"}
          </button>
          {!canChangeRole ? <p className="text-[12px] text-[#6B6B6B]">Only an owner can change roles.</p> : null}
        </div>
      </SectionCard>

      <section className="overflow-hidden rounded-xl border border-red-200 bg-white">
        <header className="border-b border-red-200 bg-red-50/40 px-5 py-4">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-red-800">
            <Trash2 className="h-4 w-4" />
            Danger zone
          </h2>
          <p className="mt-0.5 text-[12px] text-red-700">
            Deletion is irreversible and cascades to all user-owned data.
          </p>
        </header>
        <div className="p-5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-[13px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {deleting ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </section>
    </div>
  );
}
