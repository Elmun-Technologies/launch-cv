import { NOT_LEGAL_ADVICE } from "@/lib/seo/resignation-letter";

/** Amber "not legal advice" note for the resignation letter pages. */
export function LegalNote() {
  return (
    <p className="mt-6 rounded-2xl bg-[#fdf0d5] p-4 text-[15px] leading-6 text-[#5c3a00]">
      <span className="font-bold">Not legal advice. </span>
      {NOT_LEGAL_ADVICE}
    </p>
  );
}
