"use client";

/**
 * The editor's LaunchCV Score card and "Target a job" keyword panel. Both read a
 * `ResumeScore` from lib/resume-score.ts (rule-based, computed in the browser) and never
 * call an API. Items and suggestions jump to the field they're about via `onJump`.
 */
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Plus, Target, X } from "lucide-react";
import { PriorityBadge, ScoreRing, scoreBarColor, scoreColor, scoreLabel } from "@/components/ats-report-parts";
import { SCORE_WEIGHTS, type ResumeScore, type ScoreItem, type ScoreTarget } from "@/lib/resume-score";
import type { KeywordMatch, KeywordPlacement } from "@/lib/resume-keywords";

const PRIORITY = { high: "High", medium: "Medium", low: "Low" } as const;
/** Items shown before "Show all". */
const FIRST_ITEMS = 6;

const softBtn =
  "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#f1eff8] px-3.5 text-[13px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff]";
const linkBtn =
  "inline-flex min-h-10 items-center gap-1 rounded-full text-[13px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]";

function verdict(total: number): string {
  if (total >= 80) return "Only small fixes left.";
  if (total >= 65) return "Readable. A few fixes will make it stronger.";
  return "Start with the fixes marked High.";
}

function ItemRow({ item, onJump }: { item: ScoreItem; onJump: (t: ScoreTarget) => void }) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-[14px] font-bold leading-5 text-[#121226]">{item.message}</span>
        <PriorityBadge priority={PRIORITY[item.severity]} />
      </span>
      <span className="mt-1 block text-[13px] leading-[19px] text-[#4a4862]">{item.fix}</span>
      {item.points > 0 || item.target ? (
        <span className="mt-1.5 flex items-center gap-3 text-[12px] font-bold">
          {item.points > 0 ? <span className="text-[#0b7a4f]">Up to +{item.points}</span> : null}
          {item.target ? <span className="text-[#5440e8]" aria-hidden="true">Go to field →</span> : null}
        </span>
      ) : null}
    </>
  );
  return (
    <li>
      {item.target ? (
        <button
          type="button"
          onClick={() => onJump(item.target!)}
          className="block w-full rounded-[14px] px-3 py-2.5 text-left transition-colors hover:bg-[#f7f6fb] focus-visible:rounded-[14px]!"
        >
          {body}
        </button>
      ) : (
        <div className="px-3 py-2.5">{body}</div>
      )}
    </li>
  );
}

export function ScoreCard({ score, onJump, className = "" }: { score: ResumeScore; onJump: (t: ScoreTarget) => void; className?: string }) {
  const uid = useId();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const items = showAll ? score.items : score.items.slice(0, FIRST_ITEMS);
  const n = score.items.length;
  const kwApplies = score.categories.some((c) => c.id === "keywords" && c.applicable);

  return (
    <section id="lcv-score" aria-labelledby={`${uid}-h`} className={`lc-card scroll-mt-4 rounded-[22px] bg-white p-4 sm:p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <ScoreRing score={score.total} size={72} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 id={`${uid}-h`} className="text-[16px] font-extrabold tracking-[-0.01em] text-[#121226]">LaunchCV Score</h2>
          <p className="text-[14px] font-bold" style={{ color: scoreColor(score.total) }}>{scoreLabel(score.total)}</p>
          <p className="mt-0.5 text-[13px] leading-[18px] text-[#66647c]">{verdict(score.total)}</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-1">
        {score.categories.map((cat) => {
          const open = openCat === cat.id;
          return (
            <li key={cat.id}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${uid}-${cat.id}`}
                onClick={() => setOpenCat(open ? null : cat.id)}
                className="block w-full rounded-[12px] px-2 py-1.5 text-left transition-colors hover:bg-[#f7f6fb] focus-visible:rounded-[12px]!"
              >
                <span className="flex items-baseline justify-between gap-2 text-[13px]">
                  <span className="min-w-0 font-semibold text-[#24223a]">
                    {cat.label} <span className="font-normal text-[#66647c]">· {cat.weight}%</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    {cat.applicable ? (
                      <span className="font-bold" style={{ color: scoreColor(cat.score) }}>{cat.score}<span className="sr-only"> out of 100</span></span>
                    ) : (
                      <span className="font-semibold text-[#66647c]">Off</span>
                    )}
                    <ChevronDown className={`h-3.5 w-3.5 text-[#66647c] motion-safe:transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                  </span>
                </span>
                <span aria-hidden="true" className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#efedf7]">
                  {cat.applicable ? (
                    <span
                      className="block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500"
                      style={{ width: `${cat.score}%`, background: scoreBarColor(cat.score) }}
                    />
                  ) : null}
                </span>
                {cat.note ? <span className="mt-1 block text-[12px] text-[#66647c]">{cat.note}</span> : null}
              </button>
              <div id={`${uid}-${cat.id}`} hidden={!open} className="px-2 pb-2 pt-1">
                {cat.checks.length ? (
                  <ul className="flex flex-col gap-1">
                    {cat.checks.map((ch) => {
                      const full = ch.earned >= ch.max;
                      return (
                        <li key={ch.id} className="flex items-start gap-2 text-[13px] leading-[18px]">
                          <span className={`mt-px inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${full ? "bg-[#dcf5ea]" : "bg-[#fdf0d5]"}`}>
                            {full ? <Check className="h-2.5 w-2.5 text-[#0b7a4f]" strokeWidth={3} aria-hidden="true" /> : <X className="h-2.5 w-2.5 text-[#7a4600]" strokeWidth={3} aria-hidden="true" />}
                          </span>
                          <span className="min-w-0 flex-1 text-[#24223a]">
                            {ch.label}
                            {ch.detail ? <span className="text-[#66647c]"> · {ch.detail}</span> : null}
                          </span>
                          <span className="shrink-0 tabular-nums text-[#4a4862]">
                            {Math.round(ch.earned)}/{ch.max}
                            <span className="sr-only"> points</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[13px] text-[#66647c]">Paste a job description under “Target a job” to check keywords.</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 border-t border-[#e2e0ea] pt-3">
        {n === 0 ? (
          <p className="flex items-center gap-2 px-2 text-[14px] font-bold text-[#0b7a4f]">
            <Check className="h-4 w-4" aria-hidden="true" /> Nothing to fix right now
          </p>
        ) : (
          <>
            <button
              type="button"
              aria-expanded={listOpen}
              aria-controls={`${uid}-fixes`}
              onClick={() => setListOpen((v) => !v)}
              className="flex min-h-11 w-full items-center justify-between gap-2 rounded-[12px] px-2 text-left text-[14px] font-extrabold text-[#121226] transition-colors hover:bg-[#f7f6fb] focus-visible:rounded-[12px]!"
            >
              {n} {n === 1 ? "thing" : "things"} to fix
              <ChevronDown className={`h-4 w-4 text-[#66647c] motion-safe:transition-transform ${listOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <div id={`${uid}-fixes`} hidden={!listOpen}>
              <ol className="mt-1 flex flex-col gap-0.5">
                {items.map((it) => <ItemRow key={it.id} item={it} onJump={onJump} />)}
              </ol>
              {n > FIRST_ITEMS ? (
                <button type="button" onClick={() => setShowAll((v) => !v)} className={`${linkBtn} px-3`}>
                  {showAll ? "Show fewer" : `Show all ${n}`}
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div className="mt-2 px-2">
        <button type="button" aria-expanded={howOpen} aria-controls={`${uid}-how`} onClick={() => setHowOpen((v) => !v)} className={linkBtn}>
          How this score works
          <ChevronDown className={`h-3.5 w-3.5 motion-safe:transition-transform ${howOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <div id={`${uid}-how`} hidden={!howOpen} className="pb-1 text-[12px] leading-[18px] text-[#4a4862]">
          <p>
            A guide built from the simple checks listed above, run in your browser as you type. No AI. It doesn&apos;t
            predict whether you&apos;ll get an interview; it shows what&apos;s missing or hard to read.
          </p>
          <p className="mt-1.5">
            Weights: content {SCORE_WEIGHTS.content}%, impact {SCORE_WEIGHTS.impact}%, writing {SCORE_WEIGHTS.writing}%, ATS format {SCORE_WEIGHTS.ats}%,
            keywords {SCORE_WEIGHTS.keywords}%.{" "}
            {kwApplies ? "" : "With no job description, keywords are left out and the other four are scaled to 100. "}
            80+ is “Ready to send”, 65–79 “Readable”, below 65 “At risk”.
          </p>
        </div>
      </div>
    </section>
  );
}

const PLACE_LABEL: Record<KeywordPlacement, string> = {
  skills: "Go to Skills",
  bullet: "Go to bullet",
  summary: "Go to summary",
  headline: "Go to headline",
  certifications: "Go to Certifications",
};

function MissingRow({ m, skills, onJump, onAddSkill }: { m: KeywordMatch; skills: string[]; onJump: (t: ScoreTarget) => void; onAddSkill: (s: string) => void }) {
  const s = m.suggestion!;
  const added = skills.some((x) => x.trim().toLowerCase() === m.term.toLowerCase());
  return (
    <li className="rounded-[14px] bg-[#f7f6fb] px-3 py-2.5">
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[14px] font-bold text-[#121226]">{m.term}</span>
        {m.count > 1 ? <span className="text-[12px] text-[#66647c]">{m.count}× in the job</span> : null}
      </p>
      <p className="mt-0.5 text-[13px] leading-[19px] text-[#4a4862]">{s.text}</p>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
        {s.canAddSkill && !added ? (
          <button type="button" onClick={() => onAddSkill(m.term)} className={`${softBtn} bg-white!`}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Add to skills<span className="sr-only">: {m.term}</span>
          </button>
        ) : null}
        {s.where !== "skills" || !s.canAddSkill ? (
          <button type="button" onClick={() => onJump(s.target)} className={linkBtn}>
            {PLACE_LABEL[s.where]}<span className="sr-only"> for {m.term}</span> →
          </button>
        ) : null}
      </div>
    </li>
  );
}

export function KeywordPanel({ resumeId, jd, onJdChange, score, skills, onJump, onAddSkill, className = "" }: {
  resumeId: string;
  jd: string;
  onJdChange: (v: string) => void;
  score: ResumeScore;
  skills: string[];
  onJump: (t: ScoreTarget) => void;
  onAddSkill: (s: string) => void;
  className?: string;
}) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  /** Focus the textarea once, right after "Paste a job description" opens it. */
  const focusJd = useRef(false);
  const [showAllMissing, setShowAllMissing] = useState(false);
  const report = score.keywords;
  const found = report?.terms.filter((t) => t.present) ?? [];
  const missing = report?.terms.filter((t) => !t.present && t.suggestion) ?? [];
  const shownMissing = showAllMissing ? missing : missing.slice(0, 6);
  const expanded = open || jd.trim().length > 0;

  return (
    <section aria-labelledby={`${uid}-h`} className={`lc-card rounded-[22px] bg-white p-4 sm:p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e4dfff]">
          <Target className="h-[18px] w-[18px] text-[#5440e8]" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${uid}-h`} className="text-[16px] font-extrabold tracking-[-0.01em] text-[#121226]">Target a job</h2>
          <p className="mt-0.5 text-[13px] leading-[18px] text-[#66647c]">
            Paste a job description to see which of its terms your resume uses. Simple word matching in your browser; saved on this device only.
          </p>
        </div>
      </div>

      {!expanded ? (
        <button type="button" onClick={() => { focusJd.current = true; setOpen(true); }} className={`${softBtn} mt-3 w-full`}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Paste a job description
        </button>
      ) : (
        <>
          <label htmlFor={`${uid}-jd`} className="mt-3 block text-[13px] font-bold text-[#4a4862]">Job description</label>
          <textarea
            id={`${uid}-jd`}
            data-score-target="jd"
            value={jd}
            onChange={(e) => onJdChange(e.target.value)}
            rows={5}
            ref={(el) => { if (el && focusJd.current) { focusJd.current = false; el.focus(); } }}
            placeholder="Paste the full job posting here…"
            className="mt-1.5 block max-h-[260px] min-h-[110px] w-full resize-y rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-3.5 py-2.5 text-[16px] leading-6 text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-[14px]! sm:text-[14px] sm:leading-[21px]"
          />
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
            {jd ? (
              <button type="button" onClick={() => { onJdChange(""); setOpen(false); }} className={linkBtn}>
                Clear
              </button>
            ) : <span />}
            <Link href={`/resume/${resumeId}/jd`} className={linkBtn}>
              Deeper analysis: Match to a job (AI) →
            </Link>
          </div>

          {jd.trim() && report ? (
            report.total < 3 ? (
              <p role="status" className="mt-3 rounded-[14px] bg-[#f7f6fb] px-3 py-2.5 text-[13px] text-[#4a4862]">
                We couldn&apos;t find enough skills or tools in that text yet. Paste the full posting, including the requirements.
              </p>
            ) : (
              <div className="mt-3">
                <p className="text-[14px] font-bold text-[#121226]">
                  {report.found} of {report.total} job terms found in your resume
                </p>
                {found.length ? (
                  <>
                    <h3 className="mt-3 text-[12px] font-extrabold tracking-[0.06em] text-[#0b7a4f]">FOUND</h3>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {found.map((t) => (
                        <li key={t.key} className="inline-flex items-center gap-1 rounded-full bg-[#dcf5ea] px-2.5 py-[5px] text-[13px] font-semibold text-[#0b4f35]">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> {t.term}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {missing.length ? (
                  <>
                    <h3 className="mt-4 text-[12px] font-extrabold tracking-[0.06em] text-[#a3262b]">MISSING</h3>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5" aria-label="Missing terms">
                      {missing.map((t) => (
                        <li key={t.key} className="rounded-full border-[1.5px] border-[#f3c4c6] px-2.5 py-1 text-[13px] font-semibold text-[#8f1d22]">
                          {t.term}
                        </li>
                      ))}
                    </ul>
                    <h3 className="mt-4 text-[13px] font-bold text-[#121226]">Where each could fit</h3>
                    <p className="mt-0.5 text-[12px] leading-[18px] text-[#66647c]">Only add what&apos;s true for you. We never write claims into your bullets.</p>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {shownMissing.map((m) => <MissingRow key={m.key} m={m} skills={skills} onJump={onJump} onAddSkill={onAddSkill} />)}
                    </ul>
                    {missing.length > 6 ? (
                      <button type="button" onClick={() => setShowAllMissing((v) => !v)} className={`${linkBtn} mt-1`}>
                        {showAllMissing ? "Show fewer" : `Show all ${missing.length}`}
                      </button>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-3 text-[13px] font-bold text-[#0b7a4f]">Your resume uses every term we found.</p>
                )}
              </div>
            )
          ) : null}
        </>
      )}
    </section>
  );
}
