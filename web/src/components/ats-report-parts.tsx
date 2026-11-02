/** Presentational pieces shared by the free ATS result, the dashboard and the saved report page (v5 design). */
import type { FreeAtsFix, FreeAtsParsed, FreeAtsResult } from "@/types/ai-results";

/**
 * ATS score bands, the same everywhere (free check ring and legend, saved
 * report, dashboard): 80+ ready to send, 65–79 readable, below 65 at risk.
 */
export const SCORE_BANDS = { ready: 80, readable: 65 } as const;

export function scoreVerdict(score: number): string {
  if (score >= SCORE_BANDS.ready) return "Ready to send. Only small fixes left.";
  if (score >= SCORE_BANDS.readable) return "Readable, but you're leaving points on the table.";
  return "Parts of your resume may be dropped or misread.";
}

/** Short label for the same bands as `scoreVerdict` (matches the free check's legend). */
export function scoreLabel(score: number): string {
  if (score >= SCORE_BANDS.ready) return "Ready to send";
  if (score >= SCORE_BANDS.readable) return "Readable";
  return "At risk";
}

/** Text-safe score color (AA on white): green / amber / red. */
export function scoreColor(v: number): string {
  if (v >= SCORE_BANDS.ready) return "#0b7a4f";
  if (v >= SCORE_BANDS.readable) return "#a15c00";
  return "#c42b30";
}

/** Fill color for bars and rings (not for text) — the free check's result ring colors. */
export function scoreBarColor(v: number): string {
  if (v >= SCORE_BANDS.ready) return "#22b07d";
  if (v >= SCORE_BANDS.readable) return "#f2a91f";
  return "#c42b30";
}

const PRIORITY_BADGE: Record<FreeAtsFix["priority"], string> = {
  High: "bg-[#fbe2e3] text-[#a3262b]",
  Medium: "bg-[#fdf0d5] text-[#7a4600]",
  Low: "bg-[#f1eff8] text-[#4a4862]",
};

export function PriorityBadge({ priority }: { priority: FreeAtsFix["priority"] }) {
  return (
    <span className={`inline-block shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${PRIORITY_BADGE[priority]}`}>
      {priority}
      <span className="sr-only"> priority</span>
    </span>
  );
}

/** Circular score gauge, 0–100. */
export function ScoreRing({ score, size = 150, className = "" }: { score: number; size?: number; className?: string }) {
  const r = 45.5;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, score));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Score ${score} out of 100`} className={className}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#efedf7" strokeWidth="9" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={scoreBarColor(v)}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(v / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226">
        {score}
      </text>
    </svg>
  );
}

/**
 * One fix as a list row: priority, what's wrong (and why, when the check said),
 * how to fix it. Renders an <li>. `printOnly` rows are hidden on screen but
 * printed, so a downloaded report lists every fix.
 */
export function FixItem({ fix, n, printOnly = false }: { fix: FreeAtsFix; n: number; printOnly?: boolean }) {
  return (
    <li
      data-n={n}
      className={`${printOnly ? "hidden print:grid" : "flex sm:grid"} break-inside-avoid flex-col gap-2 border-t border-[#e2e0ea] py-4 sm:grid-cols-[90px_1fr_1fr] sm:gap-5 sm:py-[18px] print:grid-cols-[90px_1fr_1fr] print:gap-5`}
    >
      <span>
        <PriorityBadge priority={fix.priority} />
      </span>
      <div className="min-w-0">
        <p className="text-[15px] font-bold leading-[21px] text-[#121226]">{fix.title}</p>
        {fix.detail ? <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{fix.detail}</p> : null}
      </div>
      {fix.fix ? (
        <p className="flex gap-2.5 text-[14px] leading-[21px] text-[#24223a]">
          <span className="font-extrabold text-[#0b7a4f]">Fix</span>
          <span className="min-w-0">{fix.fix}</span>
        </p>
      ) : (
        <span className="hidden sm:block" />
      )}
    </li>
  );
}

export function DimensionBars({ dimensions }: { dimensions: FreeAtsResult["dimensions"] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14px]">
      {dimensions.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between">
            <span className="text-[#4a4862]">{d.name}</span>
            <span className="font-bold" style={{ color: scoreColor(d.score) }}>
              {d.score}
            </span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#efedf7]">
            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: scoreBarColor(d.score) }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Which dimension a fix belongs to, from words in its title (checked in this order). */
const DIMENSION_WORDS: { name: string; re: RegExp }[] = [
  { name: "Formatting", re: /column|table|header|footer|font|layout|graphic|image|icon|photo|text box|caps|colou?r|template|file name|symbol|spacing|margin/i },
  { name: "Keywords", re: /keyword|skill|term|jargon|acronym|tools?\b|certification/i },
  { name: "Readability", re: /bullet|date|length|too long|too short|sentence|passive|result|metric|number|quantif|dut(y|ies)|typo|wordy|verb|summary is|paragraph/i },
  { name: "Structure", re: /heading|section|order|contact|education|experience|title|missing|summary|link/i },
];

function dimensionOf(fix: FreeAtsFix): string | null {
  return DIMENSION_WORDS.find((d) => d.re.test(fix.title))?.name ?? null;
}

function lowerFirst(s: string): string {
  return /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}

/**
 * One honest line per dimension: the fixes in the report that belong to it
 * (by the words in their titles), or what its score band means when none do.
 * Nothing here is new information — it only regroups what the check found.
 */
export function dimensionNote(name: string, score: number, fixes: FreeAtsFix[], parsed?: FreeAtsParsed): string {
  const mine = fixes.filter((f) => dimensionOf(f) === name);
  if (mine.length) {
    const shown = mine.slice(0, 2).map((f, i) => (i === 0 ? f.title : lowerFirst(f.title)).replace(/[.\s]+$/, ""));
    const rest = mine.length - shown.length;
    return `${shown.join("; ")}.${rest > 0 ? ` ${rest} more in the list.` : ""}`;
  }
  if (name === "Keywords" && parsed) {
    if (parsed.skills === null) return "No skills section was found.";
    if (parsed.skills.length === 0) return "The skills section is empty.";
  }
  if (score >= SCORE_BANDS.ready) return "No issues found here.";
  if (score >= SCORE_BANDS.readable) return "Readable. No fix in the list is tied to it.";
  return "Scored low, though no single fix in the list is tied to it.";
}

/**
 * Dimension scores as a 2-column grid of tiles (report page). With `notes`,
 * each tile carries one line from `dimensionNote`. `bare` drops the tinted
 * ground for tiles that sit straight on the page (phones).
 */
export function DimensionTiles({
  dimensions,
  className = "",
  notes,
  bare = false,
}: {
  dimensions: FreeAtsResult["dimensions"];
  className?: string;
  notes?: Record<string, string>;
  bare?: boolean;
}) {
  return (
    <ul className={`grid grid-cols-2 gap-2 sm:gap-2.5 ${className}`}>
      {dimensions.map((d) => (
        <li key={d.name} className={`rounded-[18px] p-3.5 sm:rounded-[20px] sm:p-[18px] ${bare ? "bg-white" : "bg-[#f7f6fb]"}`}>
          <div className="flex justify-between gap-2 text-[13px] font-extrabold sm:text-[15px]">
            <span className="min-w-0 break-words text-[#121226]">{d.name}</span>
            <span style={{ color: scoreColor(d.score) }}>
              {d.score}
              <span className="sr-only"> out of 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9e6f3] sm:mt-2.5 sm:h-2">
            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: scoreBarColor(d.score) }} />
          </div>
          {notes?.[d.name] ? <p className="mt-2.5 text-[13px] leading-[19px] text-[#4a4862]">{notes[d.name]}</p> : null}
        </li>
      ))}
    </ul>
  );
}

type Tone = "good" | "warn" | "bad";
const TONE: Record<Tone, string> = {
  good: "bg-[#dcf5ea] text-[#0b4f35]",
  warn: "bg-[#fdf0d5] text-[#7a4600]",
  bad: "bg-[#fbe2e3] text-[#a3262b]",
};

function ratioTone(n: number, of: number): Tone {
  if (of === 0) return "warn";
  if (n === of) return "good";
  return n / of >= 0.5 ? "warn" : "bad";
}

/** "What the software read": the deterministic parse stored with the report, on a dark panel. */
export function ParsedPanel({ parsed, className = "" }: { parsed: FreeAtsParsed; className?: string }) {
  const skills = parsed.skills;
  const rows: { label: string; value: string; tone: Tone }[] = [
    {
      label: "Name",
      value: parsed.name ?? "not found",
      tone: !parsed.name ? "bad" : parsed.nameLooksRight ? "good" : "warn",
    },
    { label: "Email", value: parsed.email ? "found" : "not found", tone: parsed.email ? "good" : "bad" },
    { label: "Phone", value: parsed.phone ? "found" : "not found", tone: parsed.phone ? "good" : "bad" },
    {
      label: "Job titles",
      value: parsed.jobTitles.total ? `${parsed.jobTitles.found} of ${parsed.jobTitles.total} found` : "no dated roles found",
      tone: ratioTone(parsed.jobTitles.found, parsed.jobTitles.total),
    },
    {
      label: "Dates",
      value: parsed.dates.total ? `${parsed.dates.readable} of ${parsed.dates.total} readable` : "none found",
      tone: ratioTone(parsed.dates.readable, parsed.dates.total),
    },
    {
      label: "Skills",
      value:
        skills === null
          ? "no section"
          : skills.length === 0
            ? "empty"
            : `${skills.slice(0, 3).join(", ")}${skills.length > 3 ? ` +${skills.length - 3}` : ""}`,
      tone: skills && skills.length ? "good" : "bad",
    },
    { label: "Education", value: parsed.education ?? "not found", tone: parsed.education ? "good" : "bad" },
  ];
  return (
    <section
      aria-labelledby="ats-parsed-title"
      className={`break-inside-avoid rounded-[24px] bg-[#111118] p-[22px] text-[#e9e7f3] sm:rounded-[28px] sm:p-6 print:border print:border-[#e2e0ea] print:bg-white print:text-[#121226] ${className}`}
    >
      <h2 id="ats-parsed-title" className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#c9c0ff] print:text-[#3a2bb8]">
        What the software read
      </h2>
      <dl className="mt-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3 border-t border-[#2f2d48] py-2.5 text-[13px] print:border-[#e2e0ea]">
            <dt className="shrink-0 text-[#a9a7bd] print:text-[#4a4862]">{r.label}</dt>
            <dd className={`lc-mono min-w-0 break-words rounded-md px-2 py-0.5 text-right text-[12px] ${TONE[r.tone]}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
