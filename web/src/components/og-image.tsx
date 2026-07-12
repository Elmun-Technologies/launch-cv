import type { ReactElement } from "react";
import { BrandMark } from "./brand-mark";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph card used by the site's `opengraph-image` routes so every
 * social share carries consistent LaunchCV branding.
 */
export function OgImage({
  title,
  subtitle,
  pills = ["JD Alignment", "Resume Builder", "ATS Score", "Interview Prep"],
}: {
  title: string;
  subtitle: string;
  pills?: string[];
}): ReactElement {
  return (
    <div
      style={{
        background: "#0F172A",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "0px",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(96,165,250,0.20) 0%, transparent 70%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "14px",
            background: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BrandMark size={40} stroke="#FFFFFF" bar="#FFFFFF" lines="#BFDBFE" strokeWidth={2.8} />
        </div>
        <span style={{ fontSize: "32px", fontWeight: 700, color: "#fff", display: "flex" }}>
          <span>launch</span>
          <span style={{ color: "#60A5FA" }}>cv</span>
        </span>
      </div>

      <div
        style={{
          fontSize: "62px",
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: "-2px",
          maxWidth: "960px",
          marginBottom: "24px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "24px",
          color: "#94A3B8",
          textAlign: "center",
          maxWidth: "720px",
          lineHeight: 1.5,
          marginBottom: "40px",
        }}
      >
        {subtitle}
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {pills.map((label) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "999px",
              padding: "10px 20px",
              fontSize: "18px",
              color: "#CBD5E1",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "32px",
          right: "48px",
          fontSize: "16px",
          color: "#475569",
          fontWeight: 500,
        }}
      >
        launch-cv.com
      </div>
    </div>
  );
}
