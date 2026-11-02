"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/reauth";
import { pillBtn } from "@/components/admin/v5/ui";
import { downloadResponse } from "@/lib/admin-csv";

/** Downloads the audit entries matching the current filters as CSV. */
export function ExportAuditButton({ query }: { query: string }) {
  const adminFetch = useAdminFetch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    const r = await adminFetch(`/api/admin-panel/audit/export${query ? `?${query}` : ""}`).catch(() => null);
    if (r?.ok) await downloadResponse(r, "launchcv-audit.csv");
    else setError("Couldn't export the audit log.");
    setBusy(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={run} disabled={busy} className={pillBtn}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
        {busy ? "Exporting…" : "Export CSV"}
      </button>
      {error ? (
        <p role="alert" className="text-[13px] font-semibold text-[#a3222a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
