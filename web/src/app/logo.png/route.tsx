import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

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
          borderRadius: 112,
          background: "#2563EB",
        }}
      >
        <BrandMark size={340} stroke="#FFFFFF" bar="#FFFFFF" lines="#BFDBFE" strokeWidth={2.6} />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
