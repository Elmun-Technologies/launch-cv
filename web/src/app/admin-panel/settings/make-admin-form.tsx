"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/admin/section-card";
import { FormField, AdminInput } from "@/components/admin/form-field";

export function MakeAdminForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/admin-panel/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "User promoted to admin");
        setEmail("");
        router.refresh();
      } else {
        setStatus("error");
        setMessage(data.error ?? "Failed to update");
      }
    } catch {
      setStatus("error");
      setMessage("Network error");
    }
  }

  return (
    <SectionCard
      title="Promote user to admin"
      description="Sets the user.role field to &lsquo;admin&rsquo; in the database"
      action={<UserPlus className="h-4 w-4 text-[#1A56DB]" />}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField label="User email" required>
          <AdminInput
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus("idle");
            }}
            placeholder="user@example.com"
            required
          />
        </FormField>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] py-2 text-[13px] font-semibold text-white transition hover:bg-[#1E293B] disabled:opacity-40"
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {status === "loading" ? "Saving…" : "Promote to admin"}
        </button>

        {status === "success" ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800 ring-1 ring-emerald-200">
            {message}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-[12px] text-red-700 ring-1 ring-red-200">
            {message}
          </p>
        ) : null}
      </form>
    </SectionCard>
  );
}
