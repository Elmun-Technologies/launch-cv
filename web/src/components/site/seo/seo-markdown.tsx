import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SourceRef } from "./source-list";

/**
 * Markdown for long-form SEO guides, styled like v5 blog posts. Internal links
 * use next/link; `[source](#source-<id>)` becomes a numbered footnote that
 * points at the page's SourceList (pass the ids in display order).
 */
export function SeoMarkdown({ children, sourceIds = [] }: { children: string; sourceIds?: string[] }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ ...props }) => <h3 className={h3Cls} {...props} />,
        h2: ({ ...props }) => <h3 className={h3Cls} {...props} />,
        h3: ({ ...props }) => <h3 className={h3Cls} {...props} />,
        p: ({ ...props }) => <p className="mt-4" {...props} />,
        ul: ({ ...props }) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-[22px] marker:text-[#5440e8]" {...props} />,
        ol: ({ ...props }) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-[22px] marker:font-bold marker:text-[#5440e8]" {...props} />,
        strong: ({ ...props }) => <strong className="font-bold text-[#121226]" {...props} />,
        code: ({ ...props }) => <code className="lc-mono rounded-md bg-[#f1eff8] px-1.5 py-0.5 text-[0.85em] text-[#121226]" {...props} />,
        a: ({ href = "", children }) => {
          if (href.startsWith("#source-")) {
            const id = href.slice("#source-".length);
            return <SourceRef id={id} n={sourceIds.indexOf(id) + 1} />;
          }
          if (href.startsWith("/")) {
            return (
              <Link href={href} className={linkCls}>
                {children}
              </Link>
            );
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {children}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

const h3Cls = "mt-8 scroll-mt-6 text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#121226] sm:text-[22px]";
const linkCls =
  "font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]";
