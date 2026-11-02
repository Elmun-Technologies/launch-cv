"use client";

import { useState, useRef, useCallback, useId } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

export type MarkdownEditorProps = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  minHeight?: number;
};

type ToolbarAction =
  | { kind: "wrap"; before: string; after: string }
  | { kind: "linePrefix"; prefix: string }
  | { kind: "snippet"; snippet: string };

export function MarkdownEditor({ value, onChange, placeholder, minHeight = 480 }: MarkdownEditorProps) {
  const uid = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);

  const apply = useCallback(
    (action: ToolbarAction) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const selected = value.slice(start, end);

      let nextValue = value;
      let newCaret = end;

      if (action.kind === "wrap") {
        const wrapped = `${action.before}${selected || ""}${action.after}`;
        nextValue = value.slice(0, start) + wrapped + value.slice(end);
        newCaret = start + action.before.length + (selected.length || 0);
      } else if (action.kind === "linePrefix") {
        // Apply prefix to current line(s)
        const lineStart = value.lastIndexOf("\n", start - 1) + 1;
        const prefixed = `${action.prefix}${value.slice(lineStart, end)}`;
        nextValue = value.slice(0, lineStart) + prefixed + value.slice(end);
        newCaret = end + action.prefix.length;
      } else if (action.kind === "snippet") {
        nextValue = value.slice(0, start) + action.snippet + value.slice(end);
        newCaret = start + action.snippet.length;
      }

      onChange(nextValue);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(newCaret, newCaret);
      });
    },
    [value, onChange],
  );

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", file.name);
        const res = await fetch("/api/admin-panel/media/upload", { method: "POST", body: formData });
        const data = (await res.json()) as { asset?: { url: string }; error?: string };
        if (!res.ok || !data.asset) {
          alert(data.error ?? "Upload failed");
          return;
        }
        const snippet = `\n\n![${file.name}](${data.asset.url})\n\n`;
        apply({ kind: "snippet", snippet });
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [apply]);

  const toolbarButtons: Array<
    | { kind: "tool"; label: string; text: string; action: ToolbarAction; title: string; cls?: string }
    | { kind: "spacer" }
  > = [
    { kind: "tool", label: "h2", text: "H2", action: { kind: "linePrefix", prefix: "## " }, title: "Heading 2" },
    { kind: "tool", label: "h3", text: "H3", action: { kind: "linePrefix", prefix: "### " }, title: "Heading 3" },
    { kind: "spacer" },
    { kind: "tool", label: "b", text: "B", action: { kind: "wrap", before: "**", after: "**" }, title: "Bold" },
    { kind: "tool", label: "i", text: "I", action: { kind: "wrap", before: "_", after: "_" }, title: "Italic", cls: "italic" },
    { kind: "tool", label: "link", text: "Link", action: { kind: "wrap", before: "[", after: "](https://)" }, title: "Link" },
    { kind: "tool", label: "code", text: "Code", action: { kind: "wrap", before: "`", after: "`" }, title: "Inline code" },
    { kind: "spacer" },
    { kind: "tool", label: "ul", text: "List", action: { kind: "linePrefix", prefix: "- " }, title: "Bullet list" },
    { kind: "tool", label: "quote", text: "Quote", action: { kind: "linePrefix", prefix: "> " }, title: "Quote" },
    {
      kind: "tool",
      label: "table",
      text: "Table",
      action: { kind: "snippet", snippet: "\n\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n\n" },
      title: "Table",
    },
  ];

  const toolCls =
    "inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[13px] font-extrabold text-[#4a4862] transition-colors hover:bg-white hover:text-[#121226] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[#5440e8] disabled:opacity-55 sm:h-8 sm:min-w-8";
  const tabCls = (active: boolean) =>
    `inline-flex h-11 items-center rounded-lg px-3 text-[13px] font-bold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-0 focus-visible:outline-[#5440e8] sm:h-8 ${
      active ? "bg-white text-[#121226] shadow-[0_1px_2px_rgba(18,18,38,0.08)]" : "text-[#4a4862] hover:text-[#121226]"
    }`;

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-1 rounded-xl bg-[#f7f6fb] p-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-controls={`${uid}-body`}
          className="flex min-w-0 items-center gap-1 overflow-x-auto"
        >
          {toolbarButtons.map((b, idx) => {
            if (b.kind === "spacer") {
              return <span key={`s-${idx}`} aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-[#e2e0ea]" />;
            }
            return (
              <button
                key={b.label}
                type="button"
                title={b.title}
                aria-label={b.text === b.title ? undefined : `${b.text} (${b.title})`}
                onClick={() => apply(b.action)}
                disabled={activeTab !== "write"}
                className={`${toolCls} ${b.cls ?? ""}`}
              >
                {b.text}
              </button>
            );
          })}
          <span aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-[#e2e0ea]" />
          <button
            type="button"
            title="Insert image"
            onClick={handleImageUpload}
            disabled={uploading || activeTab !== "write"}
            className={toolCls}
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : null}
            {uploading ? "Uploading…" : "Image"}
          </button>
        </div>
        <div role="group" aria-label="Editor view" className="flex shrink-0 gap-0.5 self-start rounded-[10px] bg-[#efedf7] p-0.5 sm:self-auto">
          <button type="button" onClick={() => setActiveTab("write")} aria-pressed={activeTab === "write"} className={tabCls(activeTab === "write")}>
            Write
          </button>
          <button type="button" onClick={() => setActiveTab("preview")} aria-pressed={activeTab === "preview"} className={tabCls(activeTab === "preview")}>
            Preview
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <textarea
          id={`${uid}-body`}
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Start writing… Markdown works: ## for headings, **bold**, - for lists."}
          aria-label="Post body (Markdown)"
          spellCheck
          style={{ minHeight }}
          className="mt-3 block w-full resize-y rounded-2xl border-[1.5px] border-transparent bg-white px-3 py-2 text-[16px] leading-[27px] text-[#24223a] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#e2e0ea] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none!"
        />
      ) : (
        <div id={`${uid}-body`} style={{ minHeight }} className="mt-3 overflow-auto rounded-2xl bg-[#eeecf4] p-4 sm:p-7">
          {value.trim().length === 0 ? (
            <p className="text-[15px] text-[#66647c]">Nothing to preview yet.</p>
          ) : (
            <article className="mx-auto max-w-[720px] text-[17px] leading-[28px] text-[#24223a] [overflow-wrap:anywhere] sm:text-[18px] sm:leading-[30px] [&>h2:first-child]:mt-0 [&>p:first-child]:mt-0 [&_em]:italic [&_li>p]:mt-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (p) => <h2 className={previewH2} {...p} />,
                  h2: (p) => <h2 className={previewH2} {...p} />,
                  h3: (p) => <h3 className="mt-7 text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#121226] sm:text-[21px]" {...p} />,
                  p: (p) => <p className="mt-4" {...p} />,
                  ul: (p) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-[22px] marker:text-[#5440e8]" {...p} />,
                  ol: (p) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-[22px] marker:font-bold marker:text-[#5440e8]" {...p} />,
                  strong: (p) => <strong className="font-bold text-[#121226]" {...p} />,
                  a: (p) => (
                    <a
                      className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] hover:text-[#4430d6]"
                      {...p}
                    />
                  ),
                  code: (p) => <code className="lc-mono rounded-md bg-[#f1eff8] px-1.5 py-0.5 text-[0.85em] text-[#121226]" {...p} />,
                  blockquote: (p) => (
                    <blockquote
                      className="mt-6 rounded-r-2xl border-l-4 border-[#5440e8] bg-white px-5 py-4 text-[#4a4862] [&>p:first-child]:mt-0"
                      {...p}
                    />
                  ),
                  hr: () => <hr className="my-10 border-[#e2e0ea]" />,
                  table: (p) => (
                    <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-1 [overflow-wrap:normal]">
                      <table className="w-full border-collapse text-[15px] leading-6" {...p} />
                    </div>
                  ),
                  th: (p) => <th className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]" {...p} />,
                  td: (p) => <td className="border-b border-[#efedf7] px-4 py-3 align-top" {...p} />,
                  img: (p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img {...p} alt={p.alt ?? ""} className="mt-6 h-auto w-full rounded-[20px]" />
                  ),
                }}
              >
                {value}
              </ReactMarkdown>
            </article>
          )}
        </div>
      )}
    </div>
  );
}

const previewH2 =
  "mt-10 text-[26px] font-extrabold leading-[31px] tracking-[-0.02em] text-[#121226] sm:mt-[52px] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.025em]";
