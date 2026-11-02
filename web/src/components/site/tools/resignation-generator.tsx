"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  formatLastDay,
  RESIGNATION_LIMITS as L,
  RESIGNATION_REASONS,
  RESIGNATION_TONES,
  type ResignationReason,
  type ResignationResponse,
  type ResignationTone,
} from "@/lib/seo/free-tools-config";
import { WordDownload } from "./word-download";
import { CopyButton, PausedNote, RemainingNote, SparkIcon, Spinner, ToolError, fieldCls, fieldLabel, postGenerator, toolBtn, type ToolErr } from "./tool-kit";

/** Example before the first run: every fact in it is in the example input. */
const EXAMPLE = {
  input: "Jordan Ellis · manager Priya Raman · Northfield Supply Co. · Customer Support Specialist · last day Friday, November 13, 2026 · new job · formal · offer to help",
  text: "Dear Priya Raman,\n\nPlease accept this letter as formal notice of my resignation from my position as Customer Support Specialist at Northfield Supply Co. I have accepted a new role, and my last day will be Friday, November 13, 2026.\n\nThank you for your support and for the opportunities I have had here.\n\nBefore I leave, I will document my open work and help train whoever takes over my responsibilities.\n\nSincerely,\nJordan Ellis",
};


export function ResignationGenerator({ limit, paused }: { limit: number; paused: boolean }) {
  const id = useId();
  const [name, setName] = useState("");
  const [manager, setManager] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [lastDay, setLastDay] = useState("");
  const [reason, setReason] = useState<ResignationReason>("none");
  const [tone, setTone] = useState<ResignationTone>("formal");
  const [offerHelp, setOfferHelp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<ToolErr | null>(null);
  const [result, setResult] = useState<ResignationResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (name.trim().length < 2) return setErr({ message: "Add your name.", limit: false });
    if (manager.trim().length < 2) return setErr({ message: "Add your manager's name.", limit: false });
    if (company.trim().length < 2) return setErr({ message: "Add the company name.", limit: false });
    if (position.trim().length < 2) return setErr({ message: "Add your job title.", limit: false });
    if (!formatLastDay(lastDay)) return setErr({ message: "Pick your last day — a real date within a year of today.", limit: false });
    setErr(null);
    setLoading(true);
    const r = await postGenerator<ResignationResponse>("/api/free/resignation-letter", { name, manager, company, position, lastDay, reason, tone, offerHelp });
    setLoading(false);
    if (!r.ok) return setErr(r.err);
    setResult(r.data);
    if (window.matchMedia?.("(max-width: 1023px)")?.matches) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  const letters = result?.letters ?? [];

  return (
    <div className="lc-float mx-auto grid max-w-[1100px] overflow-hidden rounded-[26px] bg-white lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[36px]">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 p-[18px] sm:p-7 lg:p-9">
        {paused ? <PausedNote /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className={fieldLabel}>
              Your name
            </label>
            <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} maxLength={L.name} autoComplete="name" placeholder="e.g. Jordan Ellis" required className={fieldCls} />
          </div>
          <div>
            <label htmlFor={`${id}-manager`} className={fieldLabel}>
              Manager&apos;s name
            </label>
            <input id={`${id}-manager`} value={manager} onChange={(e) => setManager(e.target.value)} maxLength={L.name} autoComplete="off" placeholder="e.g. Priya Raman" required className={fieldCls} />
          </div>
          <div>
            <label htmlFor={`${id}-company`} className={fieldLabel}>
              Company
            </label>
            <input id={`${id}-company`} value={company} onChange={(e) => setCompany(e.target.value)} maxLength={L.company} autoComplete="organization" placeholder="e.g. Northfield Supply Co." required className={fieldCls} />
          </div>
          <div>
            <label htmlFor={`${id}-position`} className={fieldLabel}>
              Your job title
            </label>
            <input id={`${id}-position`} value={position} onChange={(e) => setPosition(e.target.value)} maxLength={L.position} autoComplete="organization-title" placeholder="e.g. Customer Support Specialist" required className={fieldCls} />
          </div>
          <div>
            <label htmlFor={`${id}-last`} className={fieldLabel}>
              Last day
            </label>
            <input id={`${id}-last`} type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} required className={fieldCls} />
          </div>
          <div>
            <label htmlFor={`${id}-reason`} className={fieldLabel}>
              Reason <span className="font-medium text-[#66647c]">(optional)</span>
            </label>
            <select id={`${id}-reason`} value={reason} onChange={(e) => setReason(e.target.value as ResignationReason)} className={`${fieldCls} appearance-auto`}>
              {RESIGNATION_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <fieldset>
          <legend className={fieldLabel}>Tone</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {RESIGNATION_TONES.map((t) => (
              <label
                key={t.value}
                className="relative inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-[#e2e0ea] px-4 text-[15px] font-semibold text-[#121226] transition-colors hover:border-[#c9c0ff] has-[:checked]:border-[#5440e8] has-[:checked]:bg-[#e4dfff] has-[:checked]:text-[#3a2bb8] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#5440e8]"
              >
                <input type="radio" name={`${id}-tone`} value={t.value} checked={tone === t.value} onChange={() => setTone(t.value)} className="sr-only" />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-[#24223a]">
          <input type="checkbox" checked={offerHelp} onChange={(e) => setOfferHelp(e.target.checked)} className="h-5 w-5 flex-none accent-[#5440e8]" />
          Offer to help with the transition
        </label>
        <button
          type="submit"
          disabled={loading || paused}
          aria-busy={loading}
          className={`${toolBtn} mt-1 w-full bg-[#5440e8] text-white hover:bg-[#4430d6] disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {loading ? <Spinner /> : <SparkIcon />}
          {loading ? "Writing…" : "Write my letter"}
        </button>
        <p className="text-center text-[13px] text-[#4a4862]">Free · {limit} a day · no account · uses only what you typed</p>
        <ToolError err={err} location="resignation_generator" />
      </form>

      <div ref={resultsRef} className="scroll-mt-24 bg-[#111118] p-[18px] text-white sm:p-7 lg:p-9">
        <div aria-live="polite" aria-busy={loading}>
          {loading ? (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">WRITING YOUR LETTER…</p>
              <div className="mt-3 flex flex-col gap-3" aria-hidden="true">
                {[0, 1].map((i) => (
                  <div key={i} className="rounded-[18px] bg-[#1d1c2e] p-[18px] motion-safe:animate-pulse">
                    <div className="h-3 w-[96%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[88%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[92%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[54%] rounded-full bg-[#2f2d48]" />
                  </div>
                ))}
              </div>
            </>
          ) : letters.length > 0 ? (
            <>
              <h2 className="sr-only">Your resignation letters</h2>
              <ol className="flex flex-col gap-3">
                {letters.map((l, i) => (
                  <li key={l.label} className={`rounded-[18px] p-[18px] ${i === 0 ? "bg-[#5440e8]" : "bg-[#1d1c2e]"}`}>
                    <h3 className={`text-[12px] font-extrabold tracking-[0.08em] ${i === 0 ? "text-[#e4dfff]" : "text-[#c9c0ff]"}`}>{l.label.toUpperCase()}</h3>
                    <p className="mt-2 whitespace-pre-line text-[15px] leading-6 [overflow-wrap:anywhere]">{l.text}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <CopyButton text={l.text} label={`${l.label.toLowerCase()} letter`} />
                      <WordDownload text={l.text} filename={`resignation-letter-${l.label.toLowerCase()}`} srLabel={`Download ${l.label.toLowerCase()} letter as Word`} tone="panel" />
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3.5 text-[12px] text-[#b3b0c8]">Uses only what you typed. Read it once more, and tell your manager before you send it.</p>
              <RemainingNote remaining={result?.remaining} limit={result?.limit} />
              <Link href="/resignation-letter" className="lc-link mt-3 inline-flex min-h-11 items-center text-[14px] font-semibold text-[#c9c0ff] hover:text-white">
                How much notice to give, and what not to say →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">EXAMPLE</p>
              <p className="mt-3 text-[14px] leading-[22px] text-[#b3b0c8]">
                <span className="font-semibold text-white">You type:</span> {EXAMPLE.input}
              </p>
              <div className="mt-3 rounded-[18px] bg-[#5440e8] px-[18px] py-4">
                <p className="text-[12px] font-extrabold tracking-[0.08em] text-[#e4dfff]">STANDARD</p>
                <p className="mt-1.5 whitespace-pre-line text-[15px] leading-6">{EXAMPLE.text}</p>
              </div>
              <p className="mt-3.5 text-[12px] leading-[18px] text-[#b3b0c8]">
                You get a standard and a short version in the tone you pick, with your last day exactly as you entered it. Nothing is added that you didn&apos;t
                type — no notice period, no tenure, no projects.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
