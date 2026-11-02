"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { authDarkBtnCls } from "@/components/auth-layout";
import type { InboxLink } from "./mask-email";

type Status = "idle" | "sending" | "sent" | "limited" | "error";

const STATUS_COPY: Record<Status, string> = {
  idle: "",
  sending: "Sending a new link…",
  sent: "Sent. A fresh link is on its way and can take a minute to arrive.",
  limited: "You've asked for a few links already. Try again in an hour.",
  error: "We couldn't send the email just now. Try again in a moment.",
};

/** "Open my email app" plus an inline resend for the signed-in, unverified user. */
export function CheckInbox({ inbox }: { inbox: InboxLink }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function resend() {
    setStatus("sending");
    const res = await fetch("/api/auth/resend-verification", { method: "POST" }).catch(() => null);
    if (!res) return setStatus("error");
    if (res.status === 429) return setStatus("limited");
    if (!res.ok) return setStatus("error");
    const j = await res.json().catch(() => ({}));
    if (j.already) {
      // Verified in another tab meanwhile: the server page now shows the verified state.
      router.refresh();
      return;
    }
    setStatus("sent");
  }

  const bad = status === "limited" || status === "error";

  return (
    <>
      <a
        href={inbox.href}
        {...(inbox.webmail ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${authDarkBtnCls} mt-6`}
      >
        {inbox.label}
        {inbox.webmail ? (
          <>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </>
        ) : null}
      </a>
      <p className="mt-[18px] text-[14px] leading-[21px] text-[#4a4862]">
        Didn&apos;t get it? Check spam, or{" "}
        <button
          type="button"
          onClick={resend}
          disabled={status === "sending" || status === "sent"}
          className="lc-link font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8] disabled:cursor-default disabled:text-[#4a4862]"
        >
          send it again
        </button>
        .
      </p>
      <p
        aria-live="polite"
        className={`text-[14px] leading-[21px] ${bad ? "text-[#a3222a]" : "text-[#08603e]"} ${status === "idle" ? "" : "mt-2"}`}
      >
        {STATUS_COPY[status]}
      </p>
    </>
  );
}
