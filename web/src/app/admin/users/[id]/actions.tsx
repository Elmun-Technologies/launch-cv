"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { AdminSelect, FormField } from "@/components/admin/form-field";

export function UserDetailActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveRole() {
    setSaving(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this user and ALL their data? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.push("/admin/users");
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Role"
        description="Promote or demote this user"
        action={<Shield className="h-4 w-4 text-[#1A56DB]" />}
      >
        <div className="space-y-3">
          <FormField label="Account role">
            <AdminSelect value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </AdminSelect>
          </FormField>
          <button
            type="button"
            onClick={handleSaveRole}
            disabled={saving || role === currentRole}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] py-2 text-[13px] font-semibold text-white transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saving…" : "Save role"}
          </button>
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
