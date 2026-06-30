import { ImageResponse } from "next/og";

export const runtime = "edge";

/**
 * Stable 512×512 branded logo served at /logo.png — used as the Organization
 * `logo` in structured data (needs a real, square, reasonably large image).
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1A56DB 0%, #7C3AED 100%)",
          fontFamily: "sans-serif",
          fontSize: 300,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-12px",
        }}
      >
        L
      </div>
    ),
    { width: 512, height: 512 },
  );
}
