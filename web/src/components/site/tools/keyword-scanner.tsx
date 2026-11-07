"use client";

import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { CopyButton } from "@/components/site/tools/tool-kit";
import { scanJobDescription, type ScannedTerm } from "@/lib/resume-keywords";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from "@/lib/seo/keyword-scanner-sample";

const MAX_CHARS = 20_000;

const boxCls =
  "mt-1.5 block w-full resize-y rounded-[18px] border-[1.5px] border-[#e2e0ea] bg-white px-4 py-4 text-[16px] leading-[1.6] text-[#24223a] transition-colors placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] sm:text-[14px] lg:px-[22px] lg:py-5";
const smallBtn =
  "min-h-10 rounded-full px-3.5 text-[13px] font-semibold text-[#5440e8] transition-colors hover:bg-[#f1eff8] disabled:cursor-not-allowed disabled:text-[#9a97b3] disabled:hover:bg-transparent";

function Tile({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="min-w-0 break-words rounded-2xl bg-[#1d1c2e] p-3.5 lg:p-4">
      <dt className="text-[12px] text-[#b3b0c8]">{label}</dt>
      <dd>
        <span className="mt-1 block text-[26px] font-extrabold leading-8 tracking-[-0.02em] tabular-nums lg:text-[30px] lg:leading-9">{value}</span>
        <span className="mt-0.5 block text-[12px] text-[#c9c0ff]">{note}</span>
      </dd>
    </div>
  );
}

function Badge({ tone, children }: { tone: "required" | "preferred" | "title"; children: string }) {
  const cls = tone === "required" ? "bg-[#c9c0ff] text-[#111118]" : tone === "title" ? "bg-white text-[#111118]" : "bg-[#2f2d48] text-[#e4dfff]";
  return <span className={`rounded-full px-2 py-[3px] text-[11px] font-bold ${cls}`}>{children}</span>;
}

function TermRow({ t, rank }: { t: ScannedTerm; rank: number }) {
  return (
    <li className="flex items-start gap-3 border-t border-[#2f2d48] py-2.5 text-[14px]">
      <span aria-hidden="true" className="w-6 flex-none pt-px text-right text-[12px] font-bold tabular-nums text-[#7c7a94]">
        {rank}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="break-words font-semibold">{t.term}</span>
          <span className="text-[#b3b0c8]">
            ×{t.count}
            <span className="sr-only"> {t.count === 1 ? "mention" : "mentions"}</span>
          </span>
          {t.title || t.inTitle ? <Badge tone="title">Job title</Badge> : null}
          {t.priority === "required" ? <Badge tone="required">Required</Badge> : t.priority === "preferred" ? <Badge tone="preferred">Preferred</Badge> : null}
        </span>
      </span>
      {t.present === undefined ? null : t.present ? (
        <span className="flex flex-none items-center gap-1.5 text-[13px] font-semibold text-[#8fe3bf]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
          </svg>
          In resume
        </span>
      ) : (
        <span className="flex flex-none items-center gap-1.5 text-[13px] font-semibold text-[#ff9a66]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
          Missing
        </span>
      )}
    </li>
  );
}

/** Job description keywords, ranked, and checked against a pasted resume — all in the browser. */
export function KeywordScanner() {
  const id = useId();
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const deferredJd = useDeferredValue(jd);
  const deferredResume = useDeferredValue(resume);
  const scan = useMemo(() => scanJobDescription(deferredJd, deferredResume), [deferredJd, deferredResume]);
  const [announce, setAnnounce] = useState("");

  const required = scan.terms.filter((t) => t.priority === "required").length;
  const missing = scan.terms.filter((t) => t.present === false);
  const started = deferredJd.trim().length > 0;

  // One calm screen-reader summary after typing pauses.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!scan.terms.length) return setAnnounce("");
      const base = `${scan.terms.length} keywords found, ${required} marked required.`;
      setAnnounce(scan.resume ? `${base} Your resume has ${scan.resume.found} of ${scan.resume.total}.` : base);
    }, 900);
    return () => window.clearTimeout(t);
  }, [scan, required]);

  return (
    <div className="lc-float mx-auto grid max-w-[1160px] overflow-hidden rounded-[26px] bg-white lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[36px]">
      <div className="flex min-w-0 flex-col p-[18px] sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <label htmlFor={`${id}-jd`} className="text-[13px] font-bold text-[#4a4862]">
            Job description
          </label>
          <span className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                setJd(SAMPLE_JOB_DESCRIPTION);
                setResume(SAMPLE_RESUME);
              }}
              className={smallBtn}
            >
              Try an example
            </button>
            <button
              type="button"
              onClick={() => {
                setJd("");
                setResume("");
              }}
              disabled={!jd && !resume}
              className={smallBtn}
            >
              Clear
            </button>
          </span>
        </div>
        <textarea
          id={`${id}-jd`}
          value={jd}
          onChange={(e) => setJd(e.target.value.slice(0, MAX_CHARS))}
          aria-describedby={`${id}-privacy`}
          spellCheck={false}
          placeholder={"Paste the whole job posting, headings included.\n\nRequirements\n- 3+ years of …"}
          className={`${boxCls} h-[260px] lg:h-[300px]`}
        />

        <label htmlFor={`${id}-resume`} className="mt-5 text-[13px] font-bold text-[#4a4862]">
          Your resume <span className="font-semibold text-[#66647c]">(optional)</span>
        </label>
        <textarea
          id={`${id}-resume`}
          value={resume}
          onChange={(e) => setResume(e.target.value.slice(0, MAX_CHARS))}
          aria-describedby={`${id}-privacy`}
          spellCheck={false}
          placeholder="Paste your resume text to see which keywords it already uses."
          className={`${boxCls} h-[180px] lg:h-[220px]`}
        />
        <p id={`${id}-privacy`} className="mt-2.5 text-[12px] text-[#66647c]">
          Scanned in your browser — nothing is uploaded or saved.
        </p>
      </div>

      <div className="min-w-0 bg-[#111118] p-[18px] text-white sm:p-7 lg:p-8">
        <h2 className="sr-only">Results</h2>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <Tile label="Keywords" value={String(scan.terms.length)} note="Ranked by weight" />
          <Tile label="Required" value={String(required)} note={scan.hasSections || !started ? "In must-have lines" : "No headings found"} />
          <div className="col-span-2 sm:col-span-1">
            <Tile
              label="In your resume"
              value={scan.resume ? `${scan.resume.found}/${scan.resume.total}` : "—"}
              note={scan.resume ? `${missing.length} missing` : "Paste your resume"}
            />
          </div>
        </dl>

        <div className="mb-1 mt-5 flex items-center justify-between gap-3">
          <h3 className="text-[13px] font-extrabold tracking-[0.08em] text-[#c9c0ff]">KEYWORDS, MOST IMPORTANT FIRST</h3>
          {missing.length ? <CopyButton text={missing.map((t) => t.term).join(", ")} label="missing keywords" /> : null}
        </div>
        {scan.terms.length ? (
          <ol>
            {scan.terms.map((t, i) => (
              <TermRow key={t.key} t={t} rank={i + 1} />
            ))}
          </ol>
        ) : (
          <p className="border-t border-[#2f2d48] py-2.5 text-[14px] text-[#b3b0c8]">
            {started
              ? "No skills or tools found yet. Paste the full posting, including the requirements."
              : "Paste a job description. Its skills, tools and certifications show up here, most important first."}
          </p>
        )}
        {scan.terms.length ? (
          <p className="mt-3 text-[12px] leading-[18px] text-[#b3b0c8]">
            Weight counts each mention, more under requirements and the job title, less in the company blurb.
            {scan.resume ? " A keyword counts as in your resume when the same words appear, plurals included." : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
