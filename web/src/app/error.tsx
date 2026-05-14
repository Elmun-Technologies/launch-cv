"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="mx-auto max-w-[560px] py-20 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Error 500
        </span>

        <h1 className="mt-6 text-[40px] font-bold leading-tight tracking-tight text-[#0F172A] sm:text-[48px]">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-[1.65] text-[#475569]">
          An unexpected error occurred. Try refreshing the page — if it keeps happening, email{" "}
          <a href="mailto:support@launch-cv.com" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
            support@launch-cv.com
          </a>
          {error?.digest ? (
            <>
              {" "}with reference{" "}
              <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[12px] text-[#475569]">{error.digest}</code>
              .
            </>
          ) : (
            "."
          )}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
          >
            Back to home
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
