"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/reauth";
import { pillBtn } from "@/components/admin/v5/ui";
import { downloadResponse } from "@/lib/admin-csv";

/**
 * Downloads one table as CSV from an admin export route (same filters as the
 * page). Exports with personal data ask for a password + code first (handled
 * by useAdminFetch when the route answers reauth_required).
 */
export function ExportCsvButton({ href, filename, label = "CSV" }: { href: string; filename: string; label?: string }) {
  const adminFetch = useAdminFetch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    const r = await adminFetch(href, undefined, { action: "export this table" }).catch(() => null);
    if (r?.ok) await downloadResponse(r, filename);
    else setError((r && (await r.json().catch(() => ({}))).error) || "Couldn't export.");
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={run} disabled={busy} className={`${pillBtn} bg-[#f1eff8]! min-h-9! px-3 text-[13px]`} aria-label={`Export ${label} as CSV`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
        {busy ? "Exporting…" : "CSV"}
      </button>
      {error ? (
        <p role="alert" className="text-[12px] font-semibold text-[#a3222a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
