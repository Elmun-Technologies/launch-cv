"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import type { Settings } from "@/lib/app-settings";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { adminBtnSoft } from "@/components/admin/admin-ui";
import { SwitchRow } from "./product-toggles";

type Reports = Settings["reports"];

/**
 * Admin → Settings → Weekly report: on/off for the Monday email to owners,
 * and "Send me this week's report now" (to the admin who clicks). Both
 * re-confirmed and audited.
 */
export function WeeklyReportCard({
  reports,
  canEdit,
  emailReady,
  owners,
  lastRun,
}: {
  reports: Reports;
  canEdit: boolean;
  emailReady: boolean;
  owners: number;
  lastRun: string | null;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [value, setValue] = useState(reports);
  const [busy, setBusy] = useState<"toggle" | "send" | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function toggle() {
    setBusy("toggle");
    setMsg(null);
    const next = { ...value, weeklyEnabled: !value.weeklyEnabled };
    const r = await adminFetch(
      "/api/admin-panel/settings/reports",
      { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) },
      { action: `${value.weeklyEnabled ? "turn off" : "turn on"} the weekly report` },
    ).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok) {
      setValue(j.value as Reports);
      setMsg({ ok: true, text: "Saved." });
      router.refresh();
    } else setMsg({ ok: false, text: j.error ?? "Couldn't save." });
  }

  async function sendNow() {
    setBusy("send");
    setMsg(null);
    const r = await adminFetch("/api/admin-panel/reports/weekly", { method: "POST" }, { action: "email yourself this week's report" }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setMsg(r?.ok ? { ok: true, text: `Sent to ${j.to}. Check spam too.` } : { ok: false, text: j.error ?? "Couldn't send." });
  }

  const hint = emailReady
    ? `Mondays at 13:07 UTC to ${owners} owner${owners === 1 ? "" : "s"}: last week's traffic, sign-ups, revenue, AI cost and config problems.`
    : "Email isn't set up (Integrations → Resend), so nothing is sent yet.";

  return (
    <SectionCard title="Weekly report" description={lastRun ? `Last automatic run: ${lastRun}` : "Not sent automatically yet."} flush>
      <ul>
        <SwitchRow
          id="wr-on"
          title="Email owners every Monday"
          hint={hint}
          on={value.weeklyEnabled}
          disabled={!canEdit || busy !== null}
          onToggle={() => void toggle()}
        />
        <li className="border-t border-[#e2e0ea] px-5 py-3 sm:px-6">
          <button type="button" onClick={() => void sendNow()} disabled={!canEdit || !emailReady || busy !== null} className={adminBtnSoft}>
            {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
            Send me this week&apos;s report now
          </button>
          <span className="mt-1.5 block text-[12px] leading-[1.45] text-[#66647c]">The last 7 full days (UTC), to your address only.</span>
        </li>
      </ul>
      {msg ? (
        <p role="status" className={`border-t border-[#e2e0ea] px-5 py-3 text-[13px] font-semibold sm:px-6 ${msg.ok ? "text-[#0b7a4f]" : "text-[#c42b30]"}`}>
          {msg.text}
        </p>
      ) : null}
    </SectionCard>
  );
}
