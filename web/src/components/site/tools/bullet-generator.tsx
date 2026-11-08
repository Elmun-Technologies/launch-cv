"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { CtaLink } from "@/components/cta-link";
import { BULLET_LIMITS, LEVELS, type BulletResponse, type Level } from "@/lib/seo/free-tools-config";
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

/** Example shown before the first run: the output keeps the input's facts ("about 60"), nothing added. */
const EXAMPLE = {
  input: "answered customer calls and emails, about 60 a day, and fixed billing problems so people didn't have to call back",
  bullets: [
    "Fixed billing problems so customers didn't have to call back, while answering about 60 calls and emails a day",
    "Answered about 60 customer calls and emails a day and fixed billing problems before they turned into repeat calls",
  ],
};

export function BulletGenerator({ limit, paused }: { limit: number; paused: boolean }) {
  const id = useId();
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<Level>("experienced");
  const [duty, setDuty] = useState("");
  const [metric, setMetric] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<ToolErr | null>(null);
  const [result, setResult] = useState<BulletResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (role.trim().length < 2) return setErr({ message: "Add your job title.", limit: false });
    if (duty.trim().length < 10) return setErr({ message: "Describe what you did in a few more words.", limit: false });
    setErr(null);
    setLoading(true);
    const r = await postGenerator<BulletResponse>("/api/free/bullet-generator", { role, level, duty, metric });
    setLoading(false);
    if (!r.ok) return setErr(r.err);
    setResult(r.data);
    // On phones the results sit below the form — bring them into view.
    if (window.matchMedia?.("(max-width: 1023px)")?.matches) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  const bullets = result?.bullets ?? [];

  return (
    <div className="lc-float mx-auto grid max-w-[1100px] overflow-hidden rounded-[26px] bg-white lg:grid-cols-2 lg:rounded-[36px]">
      <form onSubmit={onSubmit} noValidate className="p-[18px] sm:p-7 lg:p-9" aria-describedby={`${id}-promise`}>
        {paused ? <PausedNote /> : null}
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,8.5rem)] gap-2 sm:grid-cols-2 sm:gap-2.5">
          <div>
            <label htmlFor={`${id}-role`} className={fieldLabel}>
              Job title
            </label>
            <input
              id={`${id}-role`}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              maxLength={BULLET_LIMITS.role}
              autoComplete="organization-title"
              placeholder="e.g. Support Rep"
              required
              className={fieldCls}
            />
          </div>
          <div>
            <label htmlFor={`${id}-level`} className={fieldLabel}>
              Level
            </label>
            <select id={`${id}-level`} value={level} onChange={(e) => setLevel(e.target.value as Level)} className={`${fieldCls} cursor-pointer`}>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2.5 sm:mt-3.5">
          <label htmlFor={`${id}-duty`} className={fieldLabel}>
            What did you do?
          </label>
          <textarea data-clarity-mask="True"
            id={`${id}-duty`}
            value={duty}
            onChange={(e) => setDuty(e.target.value)}
            maxLength={BULLET_LIMITS.duty}
            rows={4}
            required
            aria-describedby={`${id}-duty-hint`}
            placeholder="Say it the way you'd tell a friend — one duty or result."
            className={`${fieldCls} min-h-[120px] resize-y sm:min-h-[132px] lg:min-h-[150px]`}
          />
          <p id={`${id}-duty-hint`} className="mt-1.5 flex justify-between gap-3 text-[12px] text-[#66647c] max-sm:sr-only">
            <span>One duty or accomplishment at a time works best.</span>
            <span aria-hidden="true">
              {duty.length}/{BULLET_LIMITS.duty}
            </span>
          </p>
        </div>
        <div className="mt-2.5 sm:mt-3">
          <label htmlFor={`${id}-metric`} className={fieldLabel}>
            Number or result <span className="font-medium text-[#66647c]">(optional)</span>
          </label>
          <input
            id={`${id}-metric`}
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            maxLength={BULLET_LIMITS.metric}
            aria-describedby={`${id}-metric-hint`}
            placeholder="e.g. 60 a day, 41 clinics, fewer repeat calls"
            className={fieldCls}
          />
          <p id={`${id}-metric-hint`} className="mt-1.5 text-[12px] text-[#66647c]">
            Only add a number you can back up in an interview.
          </p>
        </div>

        <div className="mt-3 flex flex-col-reverse gap-2.5 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p id={`${id}-promise`} className="text-[13px] text-[#4a4862] sm:text-left">
            Free · {limit} a day · no account · uses only what you typed
          </p>
          <button
            type="submit"
            disabled={loading || paused}
            aria-busy={loading}
            className={`${toolBtn} w-full shrink-0 whitespace-nowrap bg-[#5440e8] text-white hover:bg-[#4430d6] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
          >
            {loading ? <Spinner /> : <SparkIcon />}
            {loading ? "Writing…" : "Generate bullets"}
          </button>
        </div>
        <ToolError err={err} location="bullet_generator" />
      </form>

      <div ref={resultsRef} className="scroll-mt-24 bg-[#111118] p-[18px] text-white sm:p-7 lg:p-9">
        <div aria-live="polite" aria-busy={loading}>
          {loading ? (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">WRITING YOUR BULLETS…</p>
              <div className="mt-3 flex flex-col gap-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-[18px] bg-[#1d1c2e] p-4 motion-safe:animate-pulse">
                    <div className="h-3 w-[92%] rounded-full bg-[#2f2d48]" />
                    <div className="mt-2.5 h-3 w-[64%] rounded-full bg-[#2f2d48]" />
                  </div>
                ))}
              </div>
            </>
          ) : bullets.length > 0 ? (
            <>
              <h2 className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">
                {bullets.length} {bullets.length === 1 ? "BULLET" : "BULLETS"}
              </h2>
              <ol className="mt-3 flex flex-col gap-3">
                {bullets.map((b, i) => (
                  <li key={b} className={`rounded-[18px] p-4 lg:px-[18px] ${i === 0 ? "bg-[#5440e8]" : "bg-[#1d1c2e]"}`}>
                    <p className="text-[15px] font-semibold leading-[23px] lg:text-[16px] lg:leading-6">{b}</p>
                    <div className="mt-2.5">
                      <CopyButton text={b} label={`bullet ${i + 1}`} />
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3.5 text-[12px] text-[#b3b0c8]">Uses only what you typed. Check each bullet before you use it.</p>
              <RemainingNote remaining={result?.remaining} limit={result?.limit} />
              <CtaLink
                cta="create_resume"
                location="bullet_generator_result"
                href="/register"
                className={`${toolBtn} mt-4 w-full bg-white text-[#121226] hover:bg-[#e4dfff] sm:w-auto`}
              >
                Build my resume with these — free
              </CtaLink>
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">EXAMPLE</p>
              <p className="mt-3 text-[14px] leading-[22px] text-[#b3b0c8]">
                <span className="font-semibold text-white">You type:</span> “{EXAMPLE.input}”
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {EXAMPLE.bullets.map((b, i) => (
                  <li key={b} className={`rounded-[18px] p-4 text-[15px] font-semibold leading-[23px] lg:px-[18px] lg:text-[16px] lg:leading-6 ${i === 0 ? "bg-[#5440e8]" : "bg-[#1d1c2e]"}`}>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[12px] text-[#b3b0c8]">
                Uses only what you typed — “about 60” stays “about 60”. Add a number only if you can back it up.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
