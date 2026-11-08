"use client";

import { readConsent, resetConsent } from "@/lib/cookie-consent";

/** Privacy policy → "Change your cookie choice": forgets the answer so the notice asks again. */
export function CookieChoiceButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const hadAccepted = readConsent() === "all";
        resetConsent();
        // Tags already running can't be unloaded; start the page fresh so they're gone until the visitor answers again.
        if (hadAccepted) window.location.reload();
      }}
      className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-2 hover:decoration-[#5440e8]"
    >
      Change your cookie choice
    </button>
  );
}
