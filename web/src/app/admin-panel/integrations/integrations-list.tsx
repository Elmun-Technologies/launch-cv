"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/reauth";
import { StatusBadge } from "@/components/admin/status-badge";
import { adminBtnDark, adminBtnSoft, adminBtnWhite, adminEyebrow } from "@/components/admin/admin-ui";

export type IntegrationRow = {
  id: string;
  name: string;
  group: string;
  purpose: string;
  tile: { bg: string; fg: string };
  state: "connected" | "missing" | "partial" | "error";
  keyPreview: string;
  source: string;
  testedLabel: string | null;
  testMs: number | null;
  testError: string | null;
};

type TestResult = { ok: boolean; message: string; ms?: number };

const STATE: Record<IntegrationRow["state"], { label: string; tone: "green" | "amber" | "red" | "default" }> = {
  connected: { label: "Connected", tone: "green" },
  partial: { label: "Incomplete", tone: "amber" },
  error: { label: "Test failed", tone: "red" },
  missing: { label: "Not connected", tone: "default" },
};

async function runTest(adminFetch: ReturnType<typeof useAdminFetch>, id: string, name: string): Promise<TestResult> {
  const r = await adminFetch(`/api/admin-panel/integrations/${id}/test`, { method: "POST" }, { action: `test ${name}` }).catch(() => null);
  const j = r ? await r.json().catch(() => ({})) : {};
  if (!r?.ok) return { ok: false, message: j.error ?? "Test couldn't run." };
  return { ok: !!j.ok, message: j.message ?? (j.ok ? "Passed" : "Failed"), ms: j.ms };
}

/**
 * Integrations grouped by kind, with a live "Test" per row and "Test all"
 * (stored values only — the same check that runs before a key is saved).
 */
export function IntegrationsList({ rows, canTest, intro, notices }: { rows: IntegrationRow[]; canTest: boolean; intro: ReactNode; notices: ReactNode }) {
  const router = useRouter();
  const adminFetch = useAdminFetch();
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState<string | null>(null);
  const groups = [...new Set(rows.map((r) => r.group))];
  const testable = rows.filter((r) => r.state !== "missing");

  async function test(row: IntegrationRow) {
    setBusy((b) => new Set(b).add(row.id));
    const res = await runTest(adminFetch, row.id, row.name);
    setResults((r) => ({ ...r, [row.id]: res }));
    setBusy((b) => {
      const n = new Set(b);
      n.delete(row.id);
      return n;
    });
    return res;
  }

  async function testAll() {
    setSummary(null);
    const out = await Promise.all(testable.map((r) => test(r)));
    const passed = out.filter((o) => o.ok).length;
    setSummary(`${passed} of ${out.length} passed${out.length - passed ? ` · ${out.length - passed} failed` : ""}.`);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">{intro}</div>
        {canTest ? (
          <div className="flex flex-wrap items-center gap-3">
            {summary ? <span className="text-[13px] font-semibold text-[#4a4862]">{summary}</span> : null}
            <button type="button" onClick={() => void testAll()} disabled={busy.size > 0 || !testable.length} className={adminBtnWhite}>
              {busy.size > 1 ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Test all
            </button>
          </div>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {summary ?? ""}
      </p>
      {notices}

      {groups.map((group) => (
        <section key={group} aria-labelledby={`grp-${group}`}>
          <h2 id={`grp-${group}`} className={`${adminEyebrow} mb-2 mt-[22px]`}>
            {group}
          </h2>
          <ul className="lc-card overflow-hidden rounded-[22px]">
            {rows
              .filter((p) => p.group === group)
              .map((p) => {
                const res = results[p.id];
                const running = busy.has(p.id);
                const connected = p.state === "connected";
                return (
                  <li
                    key={p.id}
                    className="grid grid-cols-[40px_1fr_auto] items-center gap-x-4 gap-y-2 border-t border-[#e2e0ea] px-4 py-4 first:border-t-0 sm:px-5 lg:grid-cols-[40px_minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.1fr)_auto]"
                  >
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[16px] font-extrabold"
                      style={{ background: p.tile.bg, color: p.tile.fg }}
                      aria-hidden
                    >
                      {p.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <b className="block text-[15px] text-[#121226]">{p.name}</b>
                      <span className="block text-[13px] leading-[1.4] text-[#66647c]">{p.purpose}</span>
                    </span>
                    <span className="col-start-2 row-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 lg:contents">
                      <span className="lg:col-start-3 lg:row-start-1">
                        <StatusBadge tone={STATE[p.state].tone} dot>
                          {STATE[p.state].label}
                        </StatusBadge>
                      </span>
                      <span className="lc-mono min-w-0 truncate text-[12px] text-[#4a4862] lg:col-start-4 lg:row-start-1">{p.keyPreview || "—"}</span>
                      <span className="min-w-0 text-[13px] leading-[1.4] lg:col-start-5 lg:row-start-1" aria-live="polite">
                        {running ? (
                          <span className="text-[#66647c]">Testing…</span>
                        ) : res ? (
                          <span className={res.ok ? "text-[#0b7a4f]" : "text-[#a3262b]"}>
                            {res.ok ? "Passed" : res.message}
                            {res.ms != null ? <span className="text-[#66647c]"> · {res.ms.toLocaleString("en-US")} ms</span> : null}
                          </span>
                        ) : p.state === "error" && p.testError ? (
                          <span className="text-[#a3262b]">{p.testError}</span>
                        ) : (
                          <span className="text-[#66647c]">
                            {p.testedLabel ? (
                              <>
                                Tested {p.testedLabel}
                                {p.testMs != null ? ` · ${p.testMs.toLocaleString("en-US")} ms` : ""}
                              </>
                            ) : (
                              p.source
                            )}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="col-start-3 row-start-1 flex items-center gap-1.5 lg:col-start-6">
                      {canTest && p.state !== "missing" ? (
                        <button
                          type="button"
                          onClick={() => void test(p).then(() => router.refresh())}
                          disabled={running}
                          className={`${adminBtnSoft} px-3.5! sm:px-4!`}
                          aria-label={`Test ${p.name}`}
                        >
                          {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                          Test
                        </button>
                      ) : null}
                      <Link
                        href={`/admin-panel/integrations/${p.id}`}
                        className={connected ? adminBtnWhite : adminBtnDark}
                        aria-label={`${p.state === "missing" ? "Connect" : "Manage"} ${p.name}`}
                      >
                        <span className="hidden sm:inline">{p.state === "missing" ? "Connect" : "Manage"}</span>
                        <ArrowUpRight className="h-4 w-4 sm:hidden" aria-hidden />
                      </Link>
                    </span>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </>
  );
}
