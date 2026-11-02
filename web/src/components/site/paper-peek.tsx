import type { ReactNode } from "react";

/**
 * A close-up of a resume page. The preview is laid out at full US Letter width
 * (816px at 96 dpi) and scaled by `--peek` (default 0.6), so the text stays
 * readable; the frame clips whatever runs past its edges, like a page that
 * doesn't fit on the desk. Position and size the frame with `className`
 * (`relative` or `absolute`, a width, and a height or aspect ratio) and set
 * `[--peek:…]` per breakpoint if needed.
 */
export function PaperPeek({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className="absolute left-0 top-0 w-[816px] origin-top-left" style={{ transform: "scale(var(--peek, 0.6))" }}>
        {children}
      </div>
    </div>
  );
}
