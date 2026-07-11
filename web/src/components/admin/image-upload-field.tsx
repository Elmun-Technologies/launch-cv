"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";

export type ImageUploadFieldProps = {
  /** Current image URL ("" when unset). */
  value: string;
  onChange: (next: string) => void;
  /** Optional alt text sent with the upload for the media library. */
  alt?: string;
};

/**
 * Upload-first image picker for the admin CMS. Replaces the old
 * paste-a-URL text input: admins pick a file, it's uploaded via
 * /api/admin-panel/media/upload, and the returned public URL is stored.
 * A manual URL override remains available for advanced cases.
 */
export function ImageUploadField({ value, onChange, alt }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("alt", alt || file.name);
        const res = await fetch("/api/admin-panel/media/upload", {
          method: "POST",
          body: formData,
        });
        const data = (await res.json()) as { asset?: { url: string }; error?: string };
        if (!res.ok || !data.asset) {
          setError(data.error ?? "Upload failed");
          return;
        }
        onChange(data.asset.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [alt, onChange],
  );

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#FAFBFC] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={alt ?? ""}
            className="h-14 w-14 shrink-0 rounded-md border border-[#E2E8F0] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[11px] text-[#475569]">{value}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-semibold text-[#64748B] transition hover:bg-[#FAFBFC]"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#CBD5E1] bg-[#FAFBFC] px-4 py-5 text-[#64748B] transition hover:border-[#94A3B8] hover:bg-[#F1F5F9] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImageIcon className="h-5 w-5 text-[#94A3B8]" />
          )}
          <span className="text-[12px] font-semibold">
            {uploading ? "Uploading…" : "Upload image"}
          </span>
          <span className="text-[11px] text-[#94A3B8]">PNG, JPG, WebP, GIF or AVIF · max 5 MB</span>
        </button>
      )}

      {error ? <p className="text-[11px] text-red-600">{error}</p> : null}

      {manual ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/cms/… or https://…"
          className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 font-mono text-[12px] text-[#0F172A] outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/10"
        />
      ) : (
        <button
          type="button"
          onClick={() => setManual(true)}
          className="text-[11px] font-medium text-[#64748B] underline-offset-2 hover:text-[#1A56DB] hover:underline"
        >
          or enter a URL manually
        </button>
      )}
    </div>
  );
}
