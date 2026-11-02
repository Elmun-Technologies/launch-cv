import type { ReactNode } from "react";
import { CopyPill } from "@/components/site/library/copy-pill";

export type LetterContent = {
  name: string;
  contact: string;
  date?: string;
  /** Recipient block, one line each. */
  recipient: string[];
  greeting: string;
  paragraphs: string[];
  signoff: string;
};

/** Plain-text version of a letter, for the copy button. */
export function letterPlainText(l: LetterContent): string {
  return [
    l.name,
    l.contact,
    "",
    ...(l.date ? [l.date, ""] : []),
    ...l.recipient,
    "",
    l.greeting,
    "",
    ...l.paragraphs.flatMap((p) => [p, ""]),
    l.signoff,
    l.name,
  ].join("\n");
}

/** "[Job title]" placeholders get a lilac chip so they're easy to spot and replace. */
function Placeholders({ text, on }: { text: string; on: boolean }) {
  if (!on) return <>{text}</>;
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
 * A cover letter on white paper inside a lilac panel, with numbered paragraph
 * markers (decorative; the explanation sits next to or below the letter) and a
 * copy-text button above it.
 */
export function LetterSheet({
  heading,
  headingId,
  letter,
  copyLabel = "Copy text",
  placeholders = false,
  footnote,
}: {
  heading: string;
  headingId: string;
  letter: LetterContent;
  copyLabel?: string;
  placeholders?: boolean;
  footnote?: ReactNode;
}) {
  const ph = (text: string) => <Placeholders text={text} on={placeholders} />;
  return (
    <figure aria-labelledby={headingId} className="mt-7">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 id={headingId} className="text-[20px] font-extrabold tracking-[-0.02em] text-[#121226] sm:text-[22px]">
          {heading}
        </h3>
        <CopyPill text={letterPlainText(letter)} label={copyLabel} />
      </div>
      <div className="rounded-[24px] bg-[#e4dfff] p-3 sm:p-7 lg:rounded-[32px]">
        <div className="rounded-lg bg-white py-[22px] pl-11 pr-[18px] text-[14px] leading-[22px] text-[#24223a] shadow-[0_30px_60px_-24px_rgba(36,24,120,.4)] [overflow-wrap:anywhere] sm:rounded-[10px] sm:py-10 sm:pl-[64px] sm:pr-10 sm:text-[16px] sm:leading-[26px]">
          <p className="text-[17px] font-extrabold sm:text-[21px]">
            {ph(letter.name)}
          </p>
          <p className="mt-0.5 text-[#66647c]">
            {ph(letter.contact)}
          </p>
          {letter.date ? (
            <p className="mt-[22px]">
              {ph(letter.date)}
            </p>
          ) : null}
          <p className="mt-[22px]">
            {letter.recipient.map((line, i) => (
              <span key={i} className="block">
                {ph(line)}
              </span>
            ))}
          </p>
          <p className="mt-[22px]">
            {ph(letter.greeting)}
          </p>
          {letter.paragraphs.map((para, i) => (
            <p key={i} className="relative mt-4">
              <span
                aria-hidden="true"
                className="absolute -left-[30px] top-px inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#5440e8] text-[12px] font-extrabold text-white sm:-left-[44px] sm:top-0.5 sm:h-[26px] sm:w-[26px] sm:text-[13px]"
              >
                {i + 1}
              </span>
              {ph(para)}
            </p>
          ))}
          <p className="mt-[22px]">
            {letter.signoff}
            <br />
            {ph(letter.name)}
          </p>
        </div>
      </div>
      {footnote ? <figcaption className="mt-3 px-1 text-[13px] leading-5 text-[#66647c]">{footnote}</figcaption> : null}
    </figure>
  );
}
