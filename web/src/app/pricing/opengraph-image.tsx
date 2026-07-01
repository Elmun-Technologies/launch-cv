import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";

export const runtime = "edge";
export const alt = "Launch CV pricing — Starter, Professional & Lifetime";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgImage
      title="Pay monthly, yearly, or once."
      subtitle="Every AI tool on every plan — Starter $9/mo, Professional $29/yr, Lifetime $79 once."
      pills={["Starter $9/mo", "Professional $29/yr", "Lifetime $79"]}
    />,
    { ...size },
  );
}
