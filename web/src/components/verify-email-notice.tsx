"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { EMAIL_UNVERIFIED_CODE, VERIFY_EMAIL_MESSAGE } from "@/lib/usage-rules";

type Status = "idle" | "sending" | "sent" | "limited" | "error";

const STATUS_COPY: Record<Status, string> = {
  idle: "",
  sending: "",
  sent: "Sent. Open the link in the email, then try again.",
  limited: "You've asked for a few links already. Try again in an hour.",
  error: "We couldn't send the email just now. Try again in a moment.",
};

/** Resends the confirmation link to the signed-in user (same endpoint as /auth/verify-email). */
export function ResendVerifyButton({ className = "", tone = "primary" }: { className?: string; tone?: "primary" | "light" }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function resend() {
    setStatus("sending");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" }).catch(() => null);
    if (!res) return setStatus("error");
    if (res.status === 429) return setStatus("limited");
    if (!res.ok) return setStatus("error");
    const j = (await res.json().catch(() => ({}))) as { already?: boolean };
    if (j.already) {
      // Confirmed in another tab meanwhile: reload so the tool works.
      router.refresh();
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  const btn =
    tone === "light"
      ? "bg-white text-[#121226] hover:bg-[#f1eff8]"
      : "bg-[#5440e8] text-white hover:bg-[#4430d6]";
  return (
    <div className={`flex flex-col items-start gap-1.5 sm:items-end ${className}`}>
      <button
        type="button"
        onClick={() => void resend()}
        disabled={status === "sending" || status === "sent"}
        className={`lc-btn-lift inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-semibold disabled:opacity-70 motion-reduce:transform-none ${btn}`}
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <MailCheck className="h-4 w-4" aria-hidden="true" />}
        {status === "sent" ? "Link sent" : "Resend link"}
      </button>
      <p role="status" aria-live="polite" className={`text-[13px] leading-[19px] ${tone === "light" ? "text-white" : status === "limited" || status === "error" ? "text-[#a3222a]" : "text-[#4a4862]"}`}>
        {STATUS_COPY[status]}
      </p>
    </div>
  );
}

/** Shown instead of the upgrade pitch when a free account must confirm its email before using free AI checks. */
export function VerifyEmailNotice({ message = VERIFY_EMAIL_MESSAGE }: { message?: string }) {
  return (
    <div role="status" className="flex flex-col gap-3 rounded-[20px] bg-[#fdf0d5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] leading-[21px] text-[#121226]">{message}</p>
      <ResendVerifyButton />
    </div>
  );
}

/** True when an AI route refused the call because the email isn't confirmed. */
export function isVerifyEmailResponse(j: unknown): boolean {
  return !!j && typeof j === "object" && (j as { code?: unknown }).code === EMAIL_UNVERIFIED_CODE;
}
