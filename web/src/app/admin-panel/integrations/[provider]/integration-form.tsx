"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { ProviderStatus } from "@/lib/integrations";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminBtnPrimary, adminBtnWhite } from "@/components/admin/admin-ui";

type Result = { ok: boolean; message: string } | null;

export function IntegrationForm({ status, canEdit }: { status: ProviderStatus; canEdit: boolean }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(status.fields.filter((f) => !f.secret).map((f) => [f.key, f.display])),
  );
  const [skipTest, setSkipTest] = useState(false);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [result, setResult] = useState<Result>(null);

  function changedValues(): Record<string, string | null> {
    const out: Record<string, string | null> = {};
    for (const f of status.fields) {
      const v = (values[f.key] ?? "").trim();
      if (f.secret) {
        if (v) out[f.key] = v;
      } else if (v !== f.display) {
        out[f.key] = v || null;
      }
    }
    return out;
  }

  async function save() {
    const changed = changedValues();
    if (!Object.keys(changed).length) {
      setResult({ ok: false, message: "Nothing changed." });
      return;
    }
    setBusy("save");
    setResult(null);
    const r = await adminFetch(`/api/admin-panel/integrations/${status.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: changed, skipTest }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok) {
      setResult({ ok: true, message: j.test ? `Saved. ${j.test.message}.` : "Saved." });
      setValues((v) => Object.fromEntries(Object.entries(v).filter(([k]) => !status.fields.find((f) => f.key === k)?.secret)));
      router.refresh();
    } else {
      setResult({ ok: false, message: j.error ?? "Couldn't save." });
    }
  }

  async function remove(key: string) {
    setBusy("save");
    const r = await adminFetch(`/api/admin-panel/integrations/${status.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values: { [key]: null }, skipTest: true }),
    }).catch(() => null);
    setBusy(null);
    if (r?.ok) {
      setResult({ ok: true, message: "Removed. The hosting env value (if any) applies again." });
      router.refresh();
    } else setResult({ ok: false, message: "Couldn't remove." });
  }

  async function test() {
    setBusy("test");
    setResult(null);
    const r = await adminFetch(`/api/admin-panel/integrations/${status.id}/test`, { method: "POST" }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setResult(r?.ok ? { ok: !!j.ok, message: `${j.message} (${j.ms} ms)` } : { ok: false, message: j.error ?? "Test failed." });
    router.refresh();
  }

  return (
    <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <SectionCard
        title="Credentials"
        description={
          status.testedAt
            ? `Last tested ${new Date(status.testedAt).toLocaleString()}${status.testError ? ` — ${status.testError}` : " — OK"}`
            : "Not tested yet"
        }
        action={
          status.docsUrl ? (
            <a
              href={status.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 text-[13px] font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-0"
            >
              Get keys <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null
        }
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          {status.fields.map((f) => {
            const id = `f-${f.key}`;
            const hint = f.source === "panel" ? "Set in panel" : f.source === "env" ? "From hosting env" : "Not set";
            return (
              <FormField key={f.key} label={f.label} hint={hint} htmlFor={id}>
                {f.options ? (
                  <AdminSelect id={id} disabled={!canEdit} value={values[f.key] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}>
                    <option value="">Default</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </AdminSelect>
                ) : (
                  <AdminInput
                    id={id}
                    type={f.secret ? "password" : "text"}
                    autoComplete="off"
                    spellCheck={false}
                    disabled={!canEdit}
                    placeholder={f.secret ? (f.display ? `${f.display} — paste a new value to replace` : f.placeholder ?? "Paste value") : f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="lc-mono sm:text-[13px]!"
                  />
                )}
                {f.help ? <span className="mt-1.5 block text-[12px] leading-[1.5] text-[#66647c]">{f.help}</span> : null}
                {canEdit && f.source === "panel" ? (
                  <button
                    type="button"
                    onClick={() => void remove(f.key)}
                    className="mt-1 inline-flex min-h-[44px] items-center text-[13px] font-bold text-[#a3262b] hover:underline sm:min-h-[28px]"
                  >
                    Remove panel value
                  </button>
                ) : null}
              </FormField>
            );
          })}

          {canEdit ? (
            <>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-[14px] bg-[#f7f6fb] px-4 py-2.5 text-[13px] leading-[1.45] text-[#4a4862]">
                <input
                  type="checkbox"
                  checked={skipTest}
                  onChange={(e) => setSkipTest(e.target.checked)}
                  className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#5440e8]"
                />
                Save without testing (only if the provider is down right now)
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={!!busy} className={adminBtnPrimary}>
                  {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Test &amp; save
                </button>
                <button type="button" onClick={() => void test()} disabled={!!busy} className={adminBtnWhite}>
                  {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Test current
                </button>
              </div>
            </>
          ) : (
            <p className="rounded-[14px] bg-[#f7f6fb] px-4 py-3 text-[13px] text-[#4a4862]">Read only — an owner can change these.</p>
          )}
        </form>
        {result ? (
          <p
            role="status"
            className={`mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[14px] leading-[1.5] ${
              result.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"
            }`}
          >
            {result.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            {result.message}
          </p>
        ) : null}
      </SectionCard>

      <div className="flex flex-col gap-[18px]">
        <section className="rounded-[24px] bg-[#111118] p-5 text-white sm:p-6">
          <h2 className="text-[18px] font-extrabold tracking-[-0.01em]">How changes are saved</h2>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-[1.55] text-[#c9c7d8]">
            <li>
              <b className="text-white">Test &amp; save</b> checks a new value with the provider first. If the test fails, nothing is
              saved and your current settings still apply.
            </li>
            <li>Keys are write-only: once saved, only the last 4 characters are shown.</li>
            <li>
              Changes need your password and authenticator code, are written to the audit log (field names only, never values), and
              reach every server within 60 seconds.
            </li>
          </ul>
        </section>

        <SectionCard title="Where each value comes from" flush>
          <ul>
            {status.fields.map((f) => (
              <li key={f.key} className="flex items-center justify-between gap-3 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
                <span className="min-w-0 truncate text-[14px] font-semibold text-[#121226]">{f.label}</span>
                <StatusBadge tone={f.source === "panel" ? "green" : f.source === "env" ? "blue" : "default"}>
                  {f.source === "panel" ? "Admin panel" : f.source === "env" ? "Hosting env" : "Not set"}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
