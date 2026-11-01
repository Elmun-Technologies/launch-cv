"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { ProviderStatus } from "@/lib/integrations";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/form-field";

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
    <div className="space-y-5">
      <SectionCard
        title="Credentials"
        description={
          status.testedAt
            ? `Last tested ${new Date(status.testedAt).toLocaleString()}${status.testError ? ` — ${status.testError}` : " — OK"}`
            : "Not tested yet"
        }
        action={
          status.docsUrl ? (
            <a href={status.docsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:underline">
              Get keys <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ) : null
        }
      >
        <form
          className="space-y-4"
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
                    className="font-mono"
                  />
                )}
                {f.help ? <span className="mt-1 block text-[11px] text-[#8A8A86]">{f.help}</span> : null}
                {canEdit && f.source === "panel" ? (
                  <button type="button" onClick={() => void remove(f.key)} className="mt-1 text-[11px] font-semibold text-red-700 hover:underline">
                    Remove panel value
                  </button>
                ) : null}
              </FormField>
            );
          })}

          {canEdit ? (
            <>
              <label className="flex items-center gap-2 text-[12px] text-[#3F3F3F]">
                <input type="checkbox" checked={skipTest} onChange={(e) => setSkipTest(e.target.checked)} />
                Save without testing (only if the provider is down right now)
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="submit" disabled={!!busy} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#111111] px-4 text-[13px] font-semibold text-white hover:bg-[#2b2b2b] disabled:opacity-60">
                  {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Test &amp; save
                </button>
                <button type="button" onClick={() => void test()} disabled={!!busy} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E5E2] bg-white px-4 text-[13px] font-semibold text-[#111111] hover:bg-[#FAFAF9] disabled:opacity-60">
                  {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Test current
                </button>
              </div>
            </>
          ) : (
            <p className="text-[12px] text-[#6B6B6B]">Read only — an owner can change these.</p>
          )}
        </form>
        {result ? (
          <p role="status" className={`mt-4 flex items-start gap-2 text-[13px] ${result.ok ? "text-emerald-700" : "text-red-700"}`}>
            {result.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
            {result.message}
          </p>
        ) : null}
      </SectionCard>
      <p className="text-[12px] leading-[1.6] text-[#6B6B6B]">
        Changes need your password and authenticator code, are written to the audit log (field names only, never values), and
        reach every server within 60 seconds.
      </p>
    </div>
  );
}
