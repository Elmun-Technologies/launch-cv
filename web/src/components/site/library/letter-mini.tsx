import type { CoverLetterExample } from "@/lib/cover-letter-examples";

/**
 * Thumbnail of a real cover letter example (sender, greeting, opening
 * paragraphs), clipped to its paper. Decorative: the full letter lives on the
 * example page, so screen readers skip it.
 */
export function LetterMini({
  letter,
  name,
  contact,
  paragraphs = 2,
  className = "",
}: {
  letter: CoverLetterExample;
  name: string;
  contact?: string;
  paragraphs?: number;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`overflow-hidden rounded-[5px] bg-white text-[#24223a] ${className}`}>
      <p className="m-0 text-[1.7em] font-extrabold leading-tight">{name}</p>
      {contact ? <p className="mt-[0.2em] text-[#66647c]">{contact}</p> : null}
      <p className="mt-[1.4em]">Dear {letter.target.hiringManager},</p>
      {letter.paragraphs.slice(0, paragraphs).map((p, i) => (
        <p key={i} className="mt-[0.9em]">
          {p}
        </p>
      ))}
    </div>
  );
}
