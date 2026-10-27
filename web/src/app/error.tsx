"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-[#111111]">
      <div className="w-full max-w-[560px] py-20">
        <p className="text-[14px] text-[#6B6B6B]">Something broke on our side</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[44px]">
          Sorry — this page didn&apos;t load.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[#3F3F3F]">
          Your work is saved. Try again, and if it keeps happening email{" "}
          <a href="mailto:support@launch-cv.com" className="font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
            support@launch-cv.com
          </a>
          {error?.digest ? (
            <>
              {" "}with reference <code className="rounded bg-[#F5F5F3] px-1.5 py-0.5 text-[13px]">{error.digest}</code>.
            </>
          ) : (
            "."
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="soha-btn-primary">
            Try again
          </button>
          <a href="/dashboard" className="soha-btn-secondary">
            Go to my dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
