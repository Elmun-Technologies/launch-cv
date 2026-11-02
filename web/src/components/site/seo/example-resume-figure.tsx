import type { ReactNode } from "react";
import { ResumePreview } from "@/components/resume-preview";
import { exampleToContent } from "@/lib/example-to-content";
import type { ResumeExample } from "@/lib/resume-examples";
import type { TemplateStyle } from "@/lib/resume-templates";

/**
 * A real resume example rendered in one of the templates, with a caption
 * (same lilac figure as the "Section order" example on /resume-format).
 */
export function ExampleResumeFigure({
  example,
  template = "classic",
  label = "REAL EXAMPLE",
  children,
}: {
  example: ResumeExample;
  template?: TemplateStyle;
  label?: string;
  children: ReactNode;
}) {
  return (
    <figure className="mt-7 grid items-center gap-5 rounded-[24px] bg-[#e4dfff] p-4 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-8 sm:p-7">
      <div className="mx-auto w-full max-w-[300px] shadow-[0_24px_48px_-20px_rgba(10,6,60,.45)]">
        <ResumePreview content={exampleToContent(example)} template={template} />
      </div>
      <figcaption className="text-[15px] leading-6 text-[#3a2bb8]">
        <span className="block text-[12px] font-bold tracking-[0.08em]">{label}</span>
        <span className="mt-2 block text-[#24223a]">{children}</span>
      </figcaption>
    </figure>
  );
}
