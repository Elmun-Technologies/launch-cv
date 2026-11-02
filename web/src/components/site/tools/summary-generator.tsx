"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CtaLink } from "@/components/cta-link";
import { SUMMARY_LIMITS, type SummaryResponse } from "@/lib/seo/free-tools-config";
import {
  CopyButton,
  PausedNote,
  RemainingNote,
  SparkIcon,
  Spinner,
  ToolError,
  fieldCls,
  fieldLabel,
  postGenerator,
  toolBtn,
  type ToolErr,
} from "./tool-kit";

const L = SUMMARY_LIMITS;
const STRENGTH_HINTS = [
  "e.g. led an hourly rounding project that cut unit falls by 35%",
  "e.g. precepted new graduate nurses",
  "e.g. telemetry and cardiac monitoring",
  "e.g. Spanish–English bilingual",
];

/** Example before the first run: every fact in the three versions is in the input. */
const EXAMPLE = {
  input: "Registered Nurse · 6 years · med-surg and telemetry · led an hourly rounding project that cut unit falls by 35% · precepted new graduate nurses",
  versions: [
    { label: "Short", text: "Registered nurse with 6 years in med-surg and telemetry who led a rounding project that cut unit falls by 35%." },
    {
      label: "Standard",
      text: "Registered nurse with 6 years in med-surg and telemetry. Led an hourly rounding project that cut unit falls by 35% and precepted new graduate nurses.",
    },
    {
      label: "Detailed",
      text: "Med-surg and telemetry nurse with 6 years of experience who precepts new graduate nurses. Led an hourly rounding project that cut unit falls by 35%.",
    },
  ],
};

/** The middle version is the one most people use, so it gets the accent card (as in the canvas). */
const ACCENT = "Standard";

export function SummaryGenerator({ limit, paused }: { limit: number; paused: boolean }) {
  const id = useId();
  const [role, setRole] = useState("");
  const [years, setYears] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [strengths, setStrengths] = useState<string[]>(() => Array.from({ length: L.minStrengths }, () => ""));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<ToolErr | null>(null);
  const [result, setResult] = useState<SummaryResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const addedRef = useRef<number | null>(null);

  function addStrength() {
    addedRef.current = strengths.length;
    setStrengths((prev) => (prev.length < L.maxStrengths ? [...prev, ""] : prev));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    const y = Number(years);
    const filled = strengths.map((s) => s.trim()).filter(Boolean);
    if (role.trim().length < 2) return setErr({ message: "Add your job title.", limit: false });
    if (years.trim() === "" || !Number.isInteger(y) || y < 0 || y > L.maxYears) {
      return setErr({ message: `Add your years of experience as a whole number from 0 to ${L.maxYears}.`, limit: false });
    }
    if (filled.length < L.minStrengths) return setErr({ message: `Add at least ${L.minStrengths} strengths or achievements.`, limit: false });
    setErr(null);
    setLoading(true);
    const r = await postGenerator<SummaryResponse>("/api/free/summary-generator", { role, years: y, specialty, strengths: filled });
    setLoading(false);
    if (!r.ok) return setErr(r.err);
    setResult(r.data);
    if (window.matchMedia?.("(max-width: 1023px)")?.matches) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  const summaries = result?.summaries ?? [];

  return (
    <div className="lc-float mx-auto grid max-w-[1100px] overflow-hidden rounded-[26px] bg-white lg:grid-cols-[0.9fr_1.1fr] lg:rounded-[36px]">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 p-[18px] sm:p-7 lg:p-9">
        {paused ? <PausedNote /> : null}
        <div>
          <label htmlFor={`${id}-role`} className={fieldLabel}>
            Job title
          </label>
          <input
            id={`${id}-role`}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            maxLength={L.role}
            autoComplete="organization-title"
            placeholder="e.g. Registered Nurse"
            required
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor={`${id}-years`} className={fieldLabel}>
            Years of experience
          </label>
          <input
            id={`${id}-years`}
            type="number"
            inputMode="numeric"
            min={0}
            max={L.maxYears}
            step={1}
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 6"
            required
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor={`${id}-specialty`} className={fieldLabel}>
            Setting or specialty <span className="font-medium text-[#66647c]">(optional)</span>
          </label>
          <input
            id={`${id}-specialty`}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            maxLength={L.specialty}
            placeholder="e.g. Med-surg and telemetry"
            className={fieldCls}
          />
        </div>
        <fieldset aria-describedby={`${id}-strengths-hint`}>
          <legend className={fieldLabel}>Strengths or achievements</legend>
          <p id={`${id}-strengths-hint`} className="mt-0.5 text-[12px] text-[#66647c]">
            Add {L.minStrengths} to {L.maxStrengths}. Results with numbers work best — if they&apos;re true.
          </p>
          <div className="mt-1 flex flex-col gap-2">
            {strengths.map((s, i) => (
              <div key={i}>
                <label htmlFor={`${id}-s${i}`} className="sr-only">
                  Strength or achievement {i + 1}
                  {i >= L.minStrengths ? " (optional)" : ""}
                </label>
                <input
                  id={`${id}-s${i}`}
                  ref={(el) => {
                    if (el && addedRef.current === i) {
                      addedRef.current = null;
                      el.focus();
                    }
                  }}
                  value={s}
                  onChange={(e) => setStrengths((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                  maxLength={L.strength}
                  placeholder={`${STRENGTH_HINTS[i]}${i >= L.minStrengths ? " (optional)" : ""}`}
                  required={i < L.minStrengths}
                  className={`${fieldCls} !mt-0`}
                />
              </div>
            ))}
          </div>
          {strengths.length < L.maxStrengths ? (
            <button
              type="button"
              onClick={addStrength}
              className="mt-2 inline-flex min-h-10 items-center gap-1.5 rounded-full px-1 text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]"
            >
              <span aria-hidden="true">+</span> Add another <span className="font-medium text-[#66647c]">(optional)</span>
            </button>
          ) : null}
        </fieldset>
        <button
          type="submit"
          disabled={loading || paused}
          aria-busy={loading}
          className={`${toolBtn} mt-1 w-full bg-[#5440e8] text-white hover:bg-[#4430d6] disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {loading ? <Spinner /> : <SparkIcon />}
          {loading ? "Writing…" : "Write summaries"}
        </button>
        <p className="text-center text-[13px] text-[#4a4862]">Free · {limit} a day · no account · uses only what you typed</p>
        <ToolError err={err} location="summary_generator" />
      </form>

      <div ref={resultsRef} className="scroll-mt-24 bg-[#111118] p-[18px] text-white sm:p-7 lg:p-9">
        <div aria-live="polite" aria-busy={loading}>
          {loading ? (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">WRITING YOUR SUMMARIES…</p>
              <div className="mt-3 flex flex-col gap-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-[18px] bg-[#1d1c2e] p-[18px] motion-safe:animate-pulse">
                    <div className="h-3 w-[96%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[88%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[54%] rounded-full bg-[#2f2d48]" />
                  </div>
                ))}
              </div>
            </>
          ) : summaries.length > 0 ? (
            <>
              <h2 className="sr-only">Your summaries</h2>
              <ol className="flex flex-col gap-3">
                {summaries.map((s) => {
                  const accent = s.label === ACCENT;
                  return (
                    <li key={s.label} className={`rounded-[18px] p-[18px] ${accent ? "bg-[#5440e8]" : "bg-[#1d1c2e]"}`}>
                      <h3 className={`text-[12px] font-extrabold tracking-[0.08em] ${accent ? "text-[#e4dfff]" : "text-[#c9c0ff]"}`}>
                        {s.label.toUpperCase()}
                      </h3>
                      <p className="mt-2 text-[15px] leading-6 lg:text-[16px] lg:leading-[25px]">{s.text}</p>
                      <div className="mt-2.5">
                        <CopyButton text={s.text} label={`${s.label.toLowerCase()} summary`} />
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3.5 text-[12px] text-[#b3b0c8]">Uses only what you typed. Read it once more before you paste it in.</p>
              <RemainingNote remaining={result?.remaining} limit={result?.limit} />
              <CtaLink
                cta="create_resume"
                location="summary_generator_result"
                href="/register"
                className={`${toolBtn} mt-4 w-full bg-white text-[#121226] hover:bg-[#e4dfff] sm:w-auto`}
              >
                Build my resume with this — free
              </CtaLink>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">EXAMPLE</p>
              <p className="mt-3 text-[14px] leading-[22px] text-[#b3b0c8]">
                <span className="font-semibold text-white">You type:</span> {EXAMPLE.input}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {EXAMPLE.versions.map((v) => (
                  <li key={v.label} className={`rounded-[18px] px-[18px] py-4 ${v.label === ACCENT ? "bg-[#5440e8]" : "bg-[#1d1c2e]"}`}>
                    <p className={`text-[12px] font-extrabold tracking-[0.08em] ${v.label === ACCENT ? "text-[#e4dfff]" : "text-[#c9c0ff]"}`}>
                      {v.label.toUpperCase()}
                    </p>
                    <p className="mt-1.5 text-[15px] leading-6">{v.text}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[12px] leading-[18px] text-[#b3b0c8]">
                Short is one or two sentences. Standard adds your setting and results. Detailed leads with the scope of your work and any
                leadership you list. Nothing is added that you didn&apos;t type.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
