import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/brand-mark";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandMark size={22} stroke="#FFFFFF" bar="#FFFFFF" lines="#BFDBFE" strokeWidth={3} />
      </div>
    ),
    { ...size },
  );
}
