import type { ReactNode } from "react";
import { Info } from "lucide-react";

/** Small print under AI results. Pass `children` to replace the default wording. */
export function AiDisclaimer({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[12px] leading-[18px] text-[#66647c] ${className}`}>
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        {children ??
          "AI suggestions only use what’s in your resume and the job post, but they can still be wrong. Review each one before you use it."}
      </span>
    </p>
  );
}
