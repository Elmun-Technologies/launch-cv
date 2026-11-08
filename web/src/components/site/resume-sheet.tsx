import { ResumePreview, type TemplateStyle } from "@/components/resume-preview";
import { PaperPeek } from "@/components/site/paper-peek";
import { getResumeExample } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";

/**
 * A real resume page from one of the written examples, rendered with the same
 * preview the builder uses. Marketing stages use it where a product shot reads
 * better than a photo: it rises from the bottom of the stage like a sheet on a
 * desk. Position and size it with `className` (`absolute`, offsets, a width and
 * a height or `top`/`bottom`) and set `[--peek:…]` per breakpoint.
 *
 * Decorative: the sample text is hidden from screen readers (the page around it
 * says what it is), and the sheet carries a small "Sample" tag.
 */
export function ResumeSheet({
  example,
  template = "modern",
  className = "",
  tag = true,
}: {
  example: string;
  template?: TemplateStyle;
  className?: string;
  /** Show the "Sample resume" tag in the sheet's top-right corner. */
  tag?: boolean;
}) {
  const e = getResumeExample(example);
  if (!e) return null;
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <PaperPeek className="absolute inset-0 rounded-t-[8px] shadow-[0_24px_48px_-20px_rgba(10,6,60,.45)]">
        <ResumePreview content={exampleToContent(e)} template={template} />
      </PaperPeek>
      {tag ? (
        <span className="absolute right-2.5 top-2.5 rounded-full bg-[#f1eff8] px-2 py-[3px] text-[10px] font-semibold text-[#66647c] sm:text-[11px]">
          Sample resume
        </span>
      ) : null}
    </div>
  );
}
