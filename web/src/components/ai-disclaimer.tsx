import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <p className="flex items-start gap-2 text-[13px] leading-relaxed text-[#6B6B6B]">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      AI suggestions only use what&apos;s in your resume and the job post, but they can still be wrong. Review each one before you use it.
    </p>
  );
}
