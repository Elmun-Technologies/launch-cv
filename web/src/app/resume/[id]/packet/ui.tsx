"use client";

import { useId, useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { ToolNotice } from "@/components/tool-notice";
import { isVerifyEmailResponse } from "@/components/verify-email-notice";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { PacketResult } from "@/types/ai-results";
import type { PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";
import {
  CopyButton,
  SparkIcon,
  ToolSkeleton,
  pillDark,
  pillSoft,
  toolCard,
  toolEyebrow,
  toolH2,
  toolLabel,
  toolSubmit,
  toolTextarea,
} from "@/components/app/tools/tool-ui";

type Tone = "formal" | "neutral";
type Tab = "letter" | "pitch" | "questions";

/** Tone picker: a segmented radio group with a visible label. */
function ToneSwitch({ tone, onChange }: { tone: Tone; onChange: (t: Tone) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <span id={id} className="text-[13px] font-bold text-[#4a4862]">
        Tone
      </span>
      <div role="radiogroup" aria-labelledby={id} className="flex gap-1 rounded-full bg-[#f1eff8] p-1">
        {(["formal", "neutral"] as const).map((t) => {
          const on = tone === t;
          return (
            <label
              key={t}
              className={`inline-flex h-11 cursor-pointer items-center rounded-full px-3.5 text-[13px] font-bold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#5440e8] ${
                on ? "bg-[#111118] text-white" : "text-[#4a4862] hover:text-[#121226]"
              }`}
            >
              <input type="radio" name={id} value={t} checked={on} onChange={() => onChange(t)} className="sr-only" />
              {t === "formal" ? "Formal" : "Neutral"}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function pitchSeconds(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round(words / 2.5));
}

export function PacketClient({ resumeId, planLimits }: { resumeId: string; planLimits?: PlanLimitsMap }) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [tone, setTonee] = useState<Tone>("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [result, setResult] = useState<PacketResult | null>(null);
  const [editJd, setEditJd] = useState(false);
  const [tab, setTab] = useState<Tab>("letter");

  async function run() {
    setLoading(true);
    setError(null);
    setUpgrade(false);
    setVerifyEmail(false);
    const res = await fetch("/api/ai/packet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jdText: jd, tone }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      if (isVerifyEmailResponse(j)) setVerifyEmail(true);
      return;
    }
    setResult(j.result as PacketResult);
    setEditJd(false);
  }

  const canRun = !loading && jd.length >= 40;
  const max = usage?.limits.packet ?? 0;
  const usageLine =
    usage?.pro && max > 0 ? (
      <p className="text-[12px] text-[#66647c]">
        Uses 1 of your {max.toLocaleString("en-US")} monthly packets · {usage.used.packet.toLocaleString("en-US")} used
      </p>
    ) : null;

  const jdField = (
    <div>
      <label htmlFor="packet-jd" className={toolLabel}>
        Job description
      </label>
      <textarea
        id="packet-jd"
        className={`${toolTextarea} mt-2 min-h-[200px]`}
        placeholder="Paste the job description..."
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />
    </div>
  );

  const showResult = result && !loading;
  /** First line of the pasted post, for the one-line context bar on phones. */
  const jdLabel = jd.trim().split(/\n/)[0]?.trim().slice(0, 80) || "the job description you pasted";
  const tabCls = (t: Tab) => (tab === t ? "" : "max-lg:hidden");

  return (
    <div className="flex flex-col gap-4">
      <AiUsageBanner usage={usage} kind="packet" limits={planLimits} />

      {!result ? (
        /* First run: job description + tone */
        <section className={`${toolCard} max-w-[820px]`}>
          {jdField}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ToneSwitch tone={tone} onChange={setTonee} />
            {usageLine}
          </div>
          <button type="button" disabled={!canRun} onClick={() => void run()} className={`${toolSubmit} mt-4 sm:w-auto`}>
            {loading ? <Loader2 className="h-[18px] w-[18px] motion-safe:animate-spin" aria-hidden="true" /> : <SparkIcon />}
            {loading ? "Generating..." : "Generate packet"}
          </button>
        </section>
      ) : (
        /* After a run: settings bar with tone + regenerate */
        <section aria-label="Packet settings" className="rounded-[18px] bg-white px-4 py-1 lg:py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            {/* Phones: one compact line, then the Letter / Pitch / Questions tabs straight after. */}
            <p className="flex min-w-0 max-w-full items-center gap-1 text-[14px] text-[#4a4862] max-lg:w-full">
              <span className="shrink-0">Based on</span>
              <b className="min-w-0 truncate text-[#121226] lg:hidden">{jdLabel}</b>
              <b className="hidden text-[#121226] lg:inline">the job description you pasted</b>
              <button
                type="button"
                aria-expanded={editJd}
                aria-controls="packet-jd-panel"
                onClick={() => setEditJd((v) => !v)}
                className="ml-1 inline-flex min-h-11 shrink-0 items-center font-bold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-2 hover:decoration-[#5440e8]"
              >
                {editJd ? "Hide" : "Change"}
              </button>
            </p>
            <div className={`flex flex-wrap items-center gap-2.5 sm:ml-auto ${editJd ? "" : "max-lg:hidden"}`}>
              <ToneSwitch tone={tone} onChange={setTonee} />
              <button type="button" disabled={!canRun} onClick={() => void run()} className={pillSoft}>
                {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <SparkIcon className="h-4 w-4" />}
                {loading ? "Generating..." : "Regenerate"}
              </button>
            </div>
          </div>
          {editJd ? (
            <div id="packet-jd-panel" className="mt-3 border-t border-[#e2e0ea] pt-3">
              {jdField}
            </div>
          ) : null}
        </section>
      )}

      {error ? <ToolNotice message={error} upgrade={upgrade} verifyEmail={verifyEmail} location="packet_paywall" kind="packet" limits={planLimits} autoOpen /> : null}

      {loading ? (
        <div aria-busy="true">
          <ToolSkeleton rows={3} className="h-28" />
        </div>
      ) : null}

      {showResult ? (
        <>
          {/* Phone: one part at a time */}
          <div className="flex gap-1 rounded-full bg-white p-1 lg:hidden" aria-label="Show part" role="group">
            {(
              [
                ["letter", "Letter"],
                ["pitch", "Pitch"],
                ["questions", "Questions"],
              ] as const
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
                className={`h-11 flex-1 rounded-full text-[13px] font-bold transition-colors ${
                  tab === t ? "bg-[#111118] text-white" : "text-[#4a4862] hover:text-[#121226]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-5">
            {/* Cover letter */}
            <section className={`${toolCard} ${tabCls("letter")}`} aria-labelledby="packet-letter-h">
              <div className="flex items-center justify-between gap-3">
                <h2 id="packet-letter-h" className={toolH2}>
                  Cover letter
                </h2>
                <span className="flex gap-2 max-sm:hidden">
                  <WordButton resumeId={resumeId} text={result.cover_letter} className={pillSoft} />
                  <CopyButton text={result.cover_letter} className={pillDark} />
                </span>
              </div>
              <div className="mt-3 whitespace-pre-wrap break-words rounded-[14px] text-[14px] leading-[23px] text-[#24223a] sm:mt-4 sm:border-[1.5px] sm:border-[#e2e0ea] sm:p-7 sm:text-[15px] sm:leading-[25px]">
                {result.cover_letter}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
                <WordButton resumeId={resumeId} text={result.cover_letter} className={`${pillSoft} w-full`} />
                <CopyButton text={result.cover_letter} className={`${pillDark} w-full`} />
              </div>
            </section>

            <div className="flex min-w-0 flex-col gap-4">
              {/* Elevator pitch */}
              <section className={`rounded-[22px] bg-[#5440e8] p-[18px] text-white sm:rounded-[26px] sm:p-6 ${tabCls("pitch")}`} aria-labelledby="packet-pitch-h">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="packet-pitch-h" className={`${toolEyebrow} text-[#e4dfff]`}>
                    ELEVATOR PITCH · ~{pitchSeconds(result.elevator_pitch)} SEC
                  </h2>
                  <CopyButton
                    text={result.elevator_pitch}
                    className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold text-white transition-colors hover:bg-white/15"
                  />
                </div>
                <p className="mt-2.5 whitespace-pre-wrap break-words text-[16px] leading-[25px]">{result.elevator_pitch}</p>
              </section>

              {/* Questions */}
              <section className={`${toolCard} ${tabCls("questions")}`} aria-labelledby="packet-q-h">
                <h2 id="packet-q-h" className={toolH2}>
                  {result.interview_questions.length} likely {result.interview_questions.length === 1 ? "question" : "questions"}
                </h2>
                <div className="mt-3 flex flex-col gap-1.5">
                  {result.interview_questions.map((q, i) => (
                    <details key={i} open={i === 0} className="group rounded-[18px] bg-[#f7f6fb] open:bg-[#e4dfff]">
                      <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 rounded-[18px] px-[18px] py-4 [&::-webkit-details-marker]:hidden">
                        <b className="text-[15px] leading-[21px]">
                          <span className="lc-mono mr-2 text-[12px] text-[#5440e8]">Q{i + 1}</span>
                          {q.question}
                        </b>
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                      </summary>
                      <p className="-mt-1 whitespace-pre-wrap px-[18px] pb-4 text-[14px] leading-[22px] text-[#24223a]">{q.answer_outline}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : null}

      <AiDisclaimer />
    </div>
  );
}

/** Downloads the letter as a .docx headed with this resume's contact details. */
function WordButton({ resumeId, text, className }: { resumeId: string; text: string; className: string }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  async function download() {
    setBusy(true);
    setFailed(false);
    const res = await fetch(`/api/resumes/${resumeId}/cover-letter-docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setFailed(true);
      return;
    }
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? "cover_letter.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button type="button" onClick={() => void download()} disabled={busy} className={className}>
      {busy ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
      {failed ? "Try again" : (
        <span>
          <span className="sr-only">Download cover letter as </span>Word
        </span>
      )}
    </button>
  );
}
