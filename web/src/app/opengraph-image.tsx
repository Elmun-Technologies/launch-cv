import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Launch CV — AI Resume Builder & Job Search Copilot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
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
        }}
      >
        {/* Background gradient blob */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,86,219,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            right: "0px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              background: "#1A56DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            L
          </div>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#fff" }}>
            Launch CV
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Build the Resume That Gets You Hired.
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "680px",
            lineHeight: 1.5,
            marginBottom: "40px",
          }}
        >
          AI-powered. ATS-optimized. Ready in 5 minutes.
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {["JD Alignment", "Resume Builder", "ATS Score", "Interview Prep"].map((label) => (
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

        {/* Domain */}
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
    ),
    { ...size },
  );
}
