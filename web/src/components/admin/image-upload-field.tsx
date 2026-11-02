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
 * /api/admin-panel/media/upload (stored in the database and served from
 * /media/<id>.<ext>), and the returned public URL is stored.
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

  const smallBtn =
    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8] disabled:opacity-55 sm:min-h-9";

  return (
    <div className="flex flex-col gap-2">
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

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl bg-[#f7f6fb] p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={alt ?? ""} className="h-16 w-16 shrink-0 rounded-xl bg-white object-cover" />
          <div className="min-w-0 flex-1">
            <p className="lc-mono truncate text-[12px] text-[#4a4862]">{value}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className={`${smallBtn} bg-white text-[#121226] hover:bg-[#e4dfff]`}
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Upload className="h-3.5 w-3.5" aria-hidden="true" />}
                {uploading ? "Uploading…" : "Replace"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className={`${smallBtn} text-[#4a4862] hover:bg-white hover:text-[#a3222a]`}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] border-dashed border-[#c9c0ff] bg-[#f7f6fb] px-4 py-5 text-[#4a4862] transition-colors hover:border-[#5440e8] hover:bg-[#f1eff8] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8] disabled:opacity-55"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#5440e8]" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-5 w-5 text-[#5440e8]" aria-hidden="true" />
          )}
          <span className="text-[14px] font-bold text-[#121226]">{uploading ? "Uploading…" : "Upload image"}</span>
          <span className="text-[12px] text-[#66647c]">PNG, JPG, WebP, GIF or AVIF · max 5 MB</span>
        </button>
      )}

      {error ? (
        <p role="alert" className="text-[13px] font-semibold text-[#a3222a]">
          {error}
        </p>
      ) : null}

      {manual ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/media/… or https://…"
          aria-label="Image URL"
          className="lc-mono block h-11 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-3.5 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[13px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setManual(true)}
          className="inline-flex min-h-11 items-center self-start rounded-lg text-[13px] font-semibold text-[#4a4862] underline-offset-2 hover:text-[#5440e8] hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8] sm:min-h-8"
        >
          or enter a URL manually
        </button>
      )}
    </div>
  );
}
