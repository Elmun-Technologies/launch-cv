/**
 * Decorative wireframe of a resume layout (chronological, hybrid or
 * functional) for the format overview cards. Hidden from assistive tech; the
 * card's text says what the layout is.
 */
type Kind = "chronological" | "hybrid" | "functional";

/** Bar widths (%) and tone: h = name, t = title/date line, b = body text, s = skill chip row. */
const LINES: Record<Kind, { w: number; t: "h" | "t" | "b" | "s" }[]> = {
  chronological: [
    { w: 50, t: "h" },
    { w: 80, t: "t" },
    { w: 100, t: "b" },
    { w: 90, t: "b" },
    { w: 70, t: "t" },
    { w: 100, t: "b" },
    { w: 85, t: "b" },
  ],
  hybrid: [
    { w: 50, t: "h" },
    { w: 100, t: "s" },
    { w: 80, t: "t" },
    { w: 100, t: "b" },
    { w: 70, t: "t" },
    { w: 100, t: "b" },
    { w: 85, t: "b" },
  ],
  functional: [
    { w: 50, t: "h" },
    { w: 40, t: "t" },
    { w: 100, t: "b" },
    { w: 40, t: "t" },
    { w: 100, t: "b" },
    { w: 30, t: "t" },
    { w: 60, t: "b" },
  ],
};

export function FormatSketch({ kind, onDark = false }: { kind: Kind; onDark?: boolean }) {
  return (
    <div aria-hidden="true" className={`flex h-[150px] flex-col gap-[7px] rounded-[14px] p-[18px] sm:h-[180px] ${onDark ? "bg-white" : "bg-[#f1eff8]"}`}>
      {LINES[kind].map((l, i) =>
        l.t === "s" ? (
          <span key={i} className="flex gap-1.5">
            {[22, 18, 26, 16].map((w, j) => (
              <span key={j} className="h-[10px] rounded-full bg-[#5440e8]/70" style={{ width: `${w}%` }} />
            ))}
          </span>
        ) : (
          <span
            key={i}
            className={`rounded ${l.t === "h" ? "h-[10px] bg-[#121226]" : l.t === "t" ? "h-[6px] bg-[#c9c0ff]" : "h-[6px] bg-[#d9d4f2]"}`}
            style={{ width: `${l.w}%` }}
          />
        ),
      )}
    </div>
  );
}
