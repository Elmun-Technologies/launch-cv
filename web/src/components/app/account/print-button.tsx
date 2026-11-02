"use client";

import { Download } from "lucide-react";

/** Opens the browser's print dialog, where the report can be saved as a PDF (the page has a print stylesheet). */
export function PrintButton({ className = "", label = "Download report" }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <Download className="h-4 w-4" aria-hidden /> {label}
    </button>
  );
}
