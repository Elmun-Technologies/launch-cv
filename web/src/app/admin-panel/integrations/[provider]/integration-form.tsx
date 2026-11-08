"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import type { ProviderStatus } from "@/lib/integrations";
import { useAdminFetch } from "@/components/admin/reauth";
import { SectionCard } from "@/components/admin/section-card";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminBtnDanger, adminBtnPrimary, adminBtnWhite } from "@/components/admin/admin-ui";

type Result = { ok: boolean; message: string } | null;
type Notified = { sent: number; skipped?: string } | null | undefined;

function notifiedText(n: Notified): string {
  if (!n) return "";
  if (n.sent > 0) return ` Owner${n.sent === 1 ? "" : "s"} emailed.`;
  if (n.skipped === "email not configured") return " Owner not emailed — email isn't configured.";
  return "";
}

function ResultNote({ result }: { result: Result }) {
  if (!result) return null;
  return (
    <p
      role="status"
      className={`flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[14px] leading-[1.5] ${
        result.ok ? "bg-[#dcf5ea] text-[#08603e]" : "bg-[#fbe2e3] text-[#a3222a]"
      }`}
    >
      {result.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />}
      {result.message}
    </p>
  );
}

/** Header buttons: live connection test (with latency) and Disconnect (owner, re-confirmed, audited). */
export function IntegrationHeaderActions({
  provider,
  name,
  canTest,
  canDisconnect,
  envFallback,
}: {
  provider: string;
  name: string;
  canTest: boolean;
  canDisconnect: boolean;
  envFallback: boolean;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [busy, setBusy] = useState<"test" | "disconnect" | null>(null);
  const [result, setResult] = useState<Result>(null);

  async function test() {
    setBusy("test");
    setResult(null);
    const r = await adminFetch(`/api/admin-panel/integrations/${provider}/test`, { method: "POST" }, { action: `test ${name}` }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setResult(r?.ok ? { ok: !!j.ok, message: `${j.ok ? "Connection works" : j.message} · ${Number(j.ms ?? 0).toLocaleString("en-US")} ms` } : { ok: false, message: j.error ?? "Test couldn't run." });
    router.refresh();
  }

  async function disconnect() {
    const note = envFallback ? " Values from the hosting environment will apply again." : "";
    if (!confirm(`Disconnect ${name}? Every value saved in the panel for it is deleted.${note}`)) return;
    setBusy("disconnect");
    setResult(null);
    const r = await adminFetch(
      `/api/admin-panel/integrations/${provider}`,
      { method: "DELETE" },
      { action: `disconnect ${name}`, keyChange: true },
    ).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setResult(r?.ok ? { ok: true, message: `Disconnected.${notifiedText(j.notified)}` } : { ok: false, message: j.error ?? "Couldn't disconnect." });
    router.refresh();
  }

  if (!canTest && !canDisconnect) return null;
  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {canTest ? (
          <button type="button" onClick={() => void test()} disabled={busy !== null} className={adminBtnWhite}>
            {busy === "test" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Test connection
          </button>
        ) : null}
        {canDisconnect ? (
          <button type="button" onClick={() => void disconnect()} disabled={busy !== null} className={adminBtnDanger}>
            {busy === "disconnect" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Disconnect
          </button>
        ) : null}
      </div>
      <ResultNote result={result} />
    </div>
  );
}

export type KeyMeta = { label: string; added: string; rotated: string } | null;

export function IntegrationForm({
  status,
  canEdit,
  keyMeta,
  aside,
}: {
  status: ProviderStatus;
  canEdit: boolean;
  /** "Added Oct 20 by Nazir", "Rotated: never" for the main credential, when it's stored in the panel. */
  keyMeta: KeyMeta;
  /** Extra read-only card for the right column (OpenAI budget & models). */
  aside?: ReactNode;
}) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(status.fields.filter((f) => !f.secret).map((f) => [f.key, f.display])),
  );
  const [skipTest, setSkipTest] = useState(false);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [rotating, setRotating] = useState(false);

  const mainKey = status.key?.field ?? status.fields.find((f) => f.secret)?.key;

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
    const secretChanged = status.fields.some((f) => f.secret && f.key in changed);
    const r = await adminFetch(
      `/api/admin-panel/integrations/${status.id}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: changed, skipTest }) },
      { action: `save the ${status.name} ${secretChanged ? "key" : "settings"}`, keyChange: true },
    ).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    if (r?.ok) {
      const tested = j.test ? ` ${j.test.message} · ${Number(j.test.ms ?? 0).toLocaleString("en-US")} ms.` : "";
      setResult({ ok: true, message: `Saved.${tested}${notifiedText(j.notified)}` });
      setValues((v) => Object.fromEntries(Object.entries(v).filter(([k]) => !status.fields.find((f) => f.key === k)?.secret)));
      setRotating(false);
      router.refresh();
    } else {
      setResult({ ok: false, message: j.error ?? "Couldn't save." });
    }
  }

  async function remove(key: string, label: string) {
    setBusy("save");
    const r = await adminFetch(
      `/api/admin-panel/integrations/${status.id}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ values: { [key]: null }, skipTest: true }) },
      { action: `remove the ${status.name} ${label}`, keyChange: true },
    ).catch(() => null);
    setBusy(null);
    if (r?.ok) {
      setResult({ ok: true, message: "Removed. The hosting env value (if any) applies again." });
      router.refresh();
    } else setResult({ ok: false, message: "Couldn't remove." });
  }

  async function test() {
    setBusy("test");
    setResult(null);
    const r = await adminFetch(`/api/admin-panel/integrations/${status.id}/test`, { method: "POST" }, { action: `test ${status.name}` }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setResult(r?.ok ? { ok: !!j.ok, message: `${j.message} · ${Number(j.ms ?? 0).toLocaleString("en-US")} ms` } : { ok: false, message: j.error ?? "Test failed." });
    router.refresh();
  }

  function rotateNow() {
    setRotating(true);
    const el = document.getElementById(`f-${mainKey}`);
    el?.focus();
    el?.scrollIntoView({ block: "center" });
  }

  return (
    <div className="grid items-start gap-[18px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <SectionCard
        title="Credentials"
        description={
          status.testedAt
            ? `Last tested ${new Date(status.testedAt).toLocaleString("en-US")}${status.testMs != null ? ` (${status.testMs.toLocaleString("en-US")} ms)` : ""}${status.testError ? ` — ${status.testError}` : " — OK"}`
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
              {status.docsLabel ?? "Get keys"} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
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
            const isMain = f.key === mainKey;
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
                    aria-describedby={isMain && keyMeta ? "key-meta" : undefined}
                    placeholder={
                      f.secret
                        ? isMain && rotating
                          ? "Paste the new key — it's tested before the old one is replaced"
                          : f.display
                            ? `${f.display} — paste a new value to replace`
                            : f.placeholder ?? "Paste value"
                        : f.placeholder
                    }
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="lc-mono sm:text-[13px]!"
                  />
                )}
                {isMain && keyMeta ? (
                  <span id="key-meta" className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[12px] leading-[1.5] text-[#66647c]">
                    <span>{keyMeta.added}</span>
                    <span>
                      Last rotated: {keyMeta.rotated}
                      {canEdit ? (
                        <>
                          {" · "}
                          <button type="button" onClick={rotateNow} className="inline-flex min-h-[44px] items-center font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-0">
                            Rotate now
                          </button>
                        </>
                      ) : null}
                    </span>
                  </span>
                ) : null}
                {isMain && rotating ? (
                  <span role="status" className="mt-1.5 block rounded-[12px] bg-[#f7f6fb] px-3 py-2 text-[12px] leading-[1.5] text-[#4a4862]">
                    Create a new key at the provider, paste it above and press Test &amp; save. It&apos;s tested with one small request
                    first; the old key keeps working until the new one passes. Then revoke the old key at the provider.
                  </span>
                ) : null}
                {f.help ? <span className="mt-1.5 block text-[12px] leading-[1.5] text-[#66647c]">{f.help}</span> : null}
                {f.helpUrl ? (
                  <a
                    href={f.helpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-[12px] font-bold text-[#5440e8] hover:text-[#3a2bb8] sm:min-h-0"
                  >
                    Where to find it <ExternalLink className="h-3 w-3" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : null}
                {canEdit && f.source === "panel" ? (
                  <button
                    type="button"
                    onClick={() => void remove(f.key, f.label)}
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
          <div className="mt-4">
            <ResultNote result={result} />
          </div>
        ) : null}
      </SectionCard>

      <div className="flex flex-col gap-[18px]">
        {aside}
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
