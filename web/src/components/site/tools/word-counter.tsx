"use client";

import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { analyzeResumeText, formatReading, LONG_BULLET_WORDS, pageVerdict, wordVerdict } from "@/lib/seo/resume-text-stats";

const MAX_CHARS = 30_000;

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

/** Live resume stats, computed in the browser — the text never leaves the page. */
export function WordCounter() {
  const id = useId();
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const s = useMemo(() => analyzeResumeText(deferred), [deferred]);
  const [announce, setAnnounce] = useState("");

  // One calm screen-reader summary after typing pauses, not one per keystroke.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setAnnounce(
        s.words === 0
          ? ""
          : `${s.words} words, about ${s.pages} ${s.pages === 1 ? "page" : "pages"}, ${s.bullets} bullets, ${s.fillerTotal} filler ${s.fillerTotal === 1 ? "phrase" : "phrases"}.`,
      );
    }, 900);
    return () => window.clearTimeout(t);
  }, [s]);

  return (
    <div className="lc-float mx-auto grid max-w-[1160px] overflow-hidden rounded-[26px] bg-white lg:grid-cols-[1.2fr_0.8fr] lg:rounded-[36px]">
      <div className="flex flex-col p-[18px] sm:p-7 lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${id}-text`} className="text-[13px] font-bold text-[#4a4862]">
            Your resume text
          </label>
          <button
            type="button"
            onClick={() => setText("")}
            disabled={!text}
            className="min-h-10 rounded-full px-3.5 text-[13px] font-semibold text-[#5440e8] transition-colors hover:bg-[#f1eff8] disabled:cursor-not-allowed disabled:text-[#9a97b3] disabled:hover:bg-transparent"
          >
            Clear
          </button>
        </div>
        <textarea
          id={`${id}-text`}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          aria-describedby={`${id}-privacy`}
          spellCheck={false}
          placeholder={"Paste your resume here — keep the bullets as they are.\n\n• Led a weekly …\n• Cut response time …"}
          className="mt-1.5 h-[300px] w-full flex-1 resize-y rounded-[18px] border-[1.5px] border-[#e2e0ea] bg-white px-4 py-4 text-[16px] leading-[1.6] text-[#24223a] transition-colors placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] sm:text-[14px] lg:h-[440px] lg:px-[22px] lg:py-5"
        />
        <p id={`${id}-privacy`} className="mt-2.5 text-[12px] text-[#66647c]">
          Counted in your browser — nothing is uploaded or saved.
        </p>
      </div>

      <div className="bg-[#111118] p-[18px] text-white sm:p-7 lg:p-8">
        <h2 className="sr-only">Results</h2>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
        <dl className="grid grid-cols-2 gap-2">
          <Tile label="Words" value={s.words.toLocaleString("en-US")} note={wordVerdict(s.words)} />
          <Tile label="Est. pages" value={s.pages ? s.pages.toFixed(1) : "0"} note={pageVerdict(s.pages)} />
          <Tile label="Bullets" value={String(s.bullets)} note={s.bullets ? `Avg ${s.avgBulletWords} words` : "Lines starting with •, - or *"} />
          <Tile label="Long bullets" value={String(s.longBullets)} note={`Over ${LONG_BULLET_WORDS} words`} />
          <Tile label="Characters" value={s.characters.toLocaleString("en-US")} note={`${s.charactersNoSpaces.toLocaleString("en-US")} without spaces`} />
          <Tile label="Reading time" value={formatReading(s.readingSeconds)} note="At 238 words a minute" />
        </dl>

        <h3 className="mb-1 mt-5 text-[13px] font-extrabold tracking-[0.08em] text-[#ff9a66]">FILLER PHRASES · {s.fillerTotal}</h3>
        {s.filler.length ? (
          <ul>
            {s.filler.map((f) => (
              <li key={f.phrase} className="flex justify-between gap-3 border-t border-[#2f2d48] py-2.5 text-[14px]">
                <span>
                  “{f.phrase}”{f.count > 1 ? <span className="text-[#b3b0c8]"> ×{f.count}</span> : null}
                </span>
                <span className="text-right text-[#b3b0c8]">{f.tip}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-[#2f2d48] py-2.5 text-[14px] text-[#b3b0c8]">
            {s.words ? "None found. Nice and direct." : "Clichés like “responsible for” or “team player” show up here."}
          </p>
        )}

        <h3 className="mb-2 mt-5 text-[13px] font-extrabold tracking-[0.08em] text-[#c9c0ff]">MOST REPEATED WORDS</h3>
        {s.repeated.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {s.repeated.map((r) => (
              <li key={r.word} className="rounded-full bg-[#1d1c2e] px-3 py-1.5 text-[13px] font-semibold">
                {r.word} <span className="text-[#b3b0c8]">×{r.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-[#b3b0c8]">{s.words ? "No word appears 3 or more times." : "Words used 3 or more times show up here."}</p>
        )}
      </div>
    </div>
  );
}
