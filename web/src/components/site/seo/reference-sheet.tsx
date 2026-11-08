import { CopyPill } from "@/components/site/library/copy-pill";

export type ReferenceEntry = {
  name: string;
  title: string;
  org: string;
  relationship: string;
  contact: string[];
};

export type ReferenceDoc = {
  name: string;
  contact: string;
  heading: string;
  entries: ReferenceEntry[];
};

/** Plain-text version, for the copy button and Word download. */
export function referencePlainText(d: ReferenceDoc): string {
  return [
    d.name,
    d.contact,
    "",
    d.heading,
    "",
    ...d.entries.flatMap((e, i) => [
      `${e.name}${e.title ? `, ${e.title}` : ""}`,
      ...(e.org ? [e.org] : []),
      ...(e.relationship ? [e.relationship] : []),
      ...e.contact,
      ...(i < d.entries.length - 1 ? [""] : []),
    ]),
  ].join("\n");
}

/** "[Bracketed]" placeholders get a lilac chip, same convention as LetterSheet. */
function Placeholders({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <span key={i} className="rounded-[4px] bg-[#e4dfff] px-[2px] text-[#3a2bb8] [box-decoration-break:clone]">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * A references page on white paper in a lilac panel, matching LetterSheet's
 * look. Each entry is numbered; placeholders are always highlighted since
 * this document is never shown filled in with a real example.
 */
export function ReferenceSheet({ heading, headingId, doc, footnote }: { heading: string; headingId: string; doc: ReferenceDoc; footnote?: React.ReactNode }) {
  const ph = (text: string) => <Placeholders text={text} />;
  return (
    <figure aria-labelledby={headingId} className="mt-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 id={headingId} className="text-[20px] font-extrabold tracking-[-0.02em] text-[#121226] sm:text-[22px]">
          {heading}
        </h3>
        <CopyPill text={referencePlainText(doc)} label="Copy text" />
      </div>
      <div className="rounded-[24px] bg-[#e4dfff] p-3 sm:p-7 lg:rounded-[32px]">
        <div className="rounded-lg bg-white px-[18px] py-[22px] text-[14px] leading-[22px] text-[#24223a] shadow-[0_30px_60px_-24px_rgba(36,24,120,.4)] [overflow-wrap:anywhere] sm:rounded-[10px] sm:px-10 sm:py-10 sm:text-[16px] sm:leading-[26px]">
          <p className="text-[17px] font-extrabold sm:text-[21px]">{ph(doc.name)}</p>
          <p className="mt-0.5 text-[#66647c]">{ph(doc.contact)}</p>
          <p className="mt-[22px] border-b border-[#e2e0ea] pb-2.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#66647c]">{doc.heading}</p>
          {doc.entries.map((e, i) => (
            <div key={i} className={`relative pl-9 sm:pl-11 ${i === 0 ? "mt-[18px]" : "mt-5"}`}>
              <span
                aria-hidden="true"
                className="absolute left-0 top-px inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5440e8] text-[12px] font-extrabold text-white sm:top-0.5 sm:h-[26px] sm:w-[26px] sm:text-[13px]"
              >
                {i + 1}
              </span>
              <p className="font-bold">
                {ph(e.name)}
                {e.title ? <>, {ph(e.title)}</> : null}
              </p>
              {e.org ? <p>{ph(e.org)}</p> : null}
              {e.relationship ? <p className="text-[#66647c]">{ph(e.relationship)}</p> : null}
              {e.contact.map((line, j) => (
                <p key={j}>{ph(line)}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
      {footnote ? <figcaption className="mt-3 px-1 text-[13px] leading-5 text-[#66647c]">{footnote}</figcaption> : null}
    </figure>
  );
}
