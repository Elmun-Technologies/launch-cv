"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { cmsBtnPrimary } from "@/components/admin/cms-ui";

/**
 * "Upload" action for the media library. Uses the same endpoint as the blog
 * editor's image picker (/api/admin-panel/media/upload), then refreshes the grid.
 */
export function MediaUploadButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", file.name);
      const res = await fetch("/api/admin-panel/media/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { asset?: { url: string }; error?: string };
      if (!res.ok || !data.asset) {
        setError(data.error ?? "Upload failed");
        return;
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={`${cmsBtnPrimary} px-5`}>
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Plus className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />}
        {uploading ? "Uploading…" : "Upload"}
      </button>
      <p role="alert" className="text-[13px] font-semibold text-[#a3222a] empty:hidden">
        {error}
      </p>
    </div>
  );
}
