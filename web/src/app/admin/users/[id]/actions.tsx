"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Trash2 } from "lucide-react";

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
    if (!confirm("Permanently delete this user and ALL their data?")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.push("/admin/users");
  }

  return (
    <div className="space-y-4">
      {/* Change Role */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7C5CFC]" />
          <h3 className="text-[15px] font-semibold text-gray-900">Change Role</h3>
        </div>
        <div className="p-6 space-y-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={handleSaveRole}
            disabled={saving || role === currentRole}
            className="w-full rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4FE0] disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Role"}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="border-b border-red-100 px-6 py-4 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-500" />
          <h3 className="text-[15px] font-semibold text-red-600">Danger Zone</h3>
        </div>
        <div className="p-6">
          <button
            onClick={handleDelete}
            className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
