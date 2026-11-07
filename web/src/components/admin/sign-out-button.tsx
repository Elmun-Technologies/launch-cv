"use client";

import { useState } from "react";
import { resetUser } from "@/lib/analytics-client";

/** Signs out with the POST-only logout route, then returns to the login page. */
export function SignOutButton({ className, label = "Sign out" }: { className?: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        resetUser();
        window.location.assign("/login");
      }}
    >
      {busy ? "Signing out…" : label}
    </button>
  );
}
