import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";

export const runtime = "edge";
export const alt = "Check your ATS score free — no sign-up | Launch CV";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgImage
      title="Check your ATS score — free."
      subtitle="Upload your resume and get a 0–100 ATS score with a full parser breakdown in seconds. No sign-up."
      pills={["No sign-up", "0–100 score", "Full breakdown", "15 ATS engines"]}
    />,
    { ...size },
  );
}
