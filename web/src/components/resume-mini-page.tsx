import type { ResumeContent } from "@/types/resume";

/** Tiny, real-text preview of a resume's first lines. */
export function MiniPage({ content }: { content: ResumeContent }) {
  const c = content;
  const name = c.contact.fullName || "Your name";
  if (!c.contact.fullName && !c.summary && c.experience.length === 0) {
    return (
      <div className="flex h-[208px] w-[86%] max-w-[228px] items-center justify-center bg-white text-[12px] text-[#6E6E6A] shadow-[0_6px_16px_-8px_rgba(0,0,0,0.25)]">
        Empty draft
      </div>
    );
  }
  return (
    <div className="h-[208px] w-[86%] max-w-[228px] overflow-hidden bg-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.25)]" aria-hidden>
      <div className="origin-top-left scale-[0.38] p-10 text-[13px] leading-[1.5] text-[#1c1c1c]" style={{ width: "263%" }}>
        <p className="text-[28px] font-bold">{name}</p>
        {c.headline ? <p className="text-[#555]">{c.headline}</p> : null}
        {c.summary ? (
          <>
            <p className="mt-4 border-b-2 border-[#1c1c1c] pb-1 text-[12px] font-bold tracking-[0.08em]">SUMMARY</p>
            <p className="mt-1.5">{c.summary.slice(0, 220)}</p>
          </>
        ) : null}
        {c.experience.length > 0 ? (
          <>
            <p className="mt-4 border-b-2 border-[#1c1c1c] pb-1 text-[12px] font-bold tracking-[0.08em]">EXPERIENCE</p>
            {c.experience.slice(0, 2).map((x) => (
              <div key={x.id} className="mt-2">
                <p className="flex justify-between font-semibold">
                  <span>{[x.role, x.company].filter(Boolean).join(", ")}</span>
                  <span>{[x.start, x.end].filter(Boolean).join(" – ")}</span>
                </p>
                <ul className="list-disc pl-5">
                  {x.bullets.slice(0, 3).map((b) => (
                    <li key={b.id}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : null}
        {c.skills.length > 0 ? (
          <>
            <p className="mt-4 border-b-2 border-[#1c1c1c] pb-1 text-[12px] font-bold tracking-[0.08em]">SKILLS</p>
            <p className="mt-1.5">{c.skills.slice(0, 10).join(" · ")}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
