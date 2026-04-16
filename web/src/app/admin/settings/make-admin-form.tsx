"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

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
      const res = await fetch("/api/admin/make-admin", {
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
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-[#7C5CFC]" />
        <h3 className="text-[15px] font-semibold text-gray-900">Make User Admin</h3>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="user@example.com"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] text-gray-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4FE0] disabled:opacity-40"
        >
          {status === "loading" ? "Saving…" : "Promote to Admin"}
        </button>
        {status === "success" && (
          <p className="text-[13px] text-emerald-600">{message}</p>
        )}
        {status === "error" && (
          <p className="text-[13px] text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
}
