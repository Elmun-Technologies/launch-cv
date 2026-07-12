import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandMark size={120} stroke="#FFFFFF" bar="#FFFFFF" lines="#BFDBFE" strokeWidth={2.8} />
      </div>
    ),
    { ...size },
  );
}
