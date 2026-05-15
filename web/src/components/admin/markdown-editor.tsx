"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bold, Italic, Link as LinkIcon, Heading2, Heading3, Image as ImageIcon, List, Code, Loader2 } from "lucide-react";

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
    | { kind: "tool"; label: string; icon: typeof Bold; action: ToolbarAction; title: string }
    | { kind: "spacer" }
  > = [
    { kind: "tool", label: "h2", icon: Heading2, action: { kind: "linePrefix", prefix: "## " }, title: "Heading 2" },
    { kind: "tool", label: "h3", icon: Heading3, action: { kind: "linePrefix", prefix: "### " }, title: "Heading 3" },
    { kind: "spacer" },
    { kind: "tool", label: "b", icon: Bold, action: { kind: "wrap", before: "**", after: "**" }, title: "Bold" },
    { kind: "tool", label: "i", icon: Italic, action: { kind: "wrap", before: "_", after: "_" }, title: "Italic" },
    { kind: "tool", label: "link", icon: LinkIcon, action: { kind: "wrap", before: "[", after: "](https://)" }, title: "Link" },
    { kind: "tool", label: "code", icon: Code, action: { kind: "wrap", before: "`", after: "`" }, title: "Inline code" },
    { kind: "spacer" },
    { kind: "tool", label: "ul", icon: List, action: { kind: "linePrefix", prefix: "- " }, title: "Bullet list" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] bg-[#FAFBFC] px-3 py-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((b, idx) => {
            if (b.kind === "spacer") {
              return <span key={`s-${idx}`} className="mx-1 h-5 w-px bg-[#E2E8F0]" />;
            }
            const Icon = b.icon;
            return (
              <button
                key={b.label}
                type="button"
                title={b.title}
                onClick={() => apply(b.action)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#475569] transition hover:bg-white hover:text-[#0F172A]"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
          <span className="mx-1 h-5 w-px bg-[#E2E8F0]" />
          <button
            type="button"
            title="Insert image"
            onClick={handleImageUpload}
            disabled={uploading}
            className="flex h-7 items-center gap-1 rounded-md px-2 text-[12px] font-semibold text-[#475569] transition hover:bg-white hover:text-[#0F172A] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
            {uploading ? "Uploading…" : "Image"}
          </button>
        </div>
        <div className="flex rounded-md bg-[#F1F5F9] p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`rounded px-2 py-0.5 transition ${
              activeTab === "write" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`rounded px-2 py-0.5 transition ${
              activeTab === "preview" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Write your post in Markdown…"}
          spellCheck
          style={{ minHeight }}
          className="block w-full resize-y bg-white p-5 font-mono text-[13px] leading-[1.7] text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
        />
      ) : (
        <div style={{ minHeight }} className="overflow-auto bg-white p-6">
          {value.trim().length === 0 ? (
            <p className="text-[13px] text-[#94A3B8]">Nothing to preview yet.</p>
          ) : (
            <article className="max-w-none text-[15px] leading-[1.75] text-[#334155]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: (p) => <h2 className="mt-8 text-[22px] font-semibold tracking-tight text-[#0F172A]" {...p} />,
                  h2: (p) => <h2 className="mt-8 text-[22px] font-semibold tracking-tight text-[#0F172A]" {...p} />,
                  h3: (p) => <h3 className="mt-6 text-[18px] font-semibold tracking-tight text-[#0F172A]" {...p} />,
                  p: (p) => <p className="mt-3" {...p} />,
                  ul: (p) => <ul className="mt-3 list-disc space-y-1.5 pl-6" {...p} />,
                  ol: (p) => <ol className="mt-3 list-decimal space-y-1.5 pl-6" {...p} />,
                  a: (p) => <a className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline" {...p} />,
                  code: (p) => (
                    <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[13px] text-[#0F172A]" {...p} />
                  ),
                  blockquote: (p) => (
                    <blockquote className="mt-4 border-l-4 border-[#E2E8F0] pl-4 italic text-[#475569]" {...p} />
                  ),
                  img: (p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img {...p} alt={p.alt ?? ""} className="mt-4 rounded-xl border border-[#E2E8F0]" />
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
