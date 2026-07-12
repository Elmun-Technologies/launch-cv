import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";

export const runtime = "edge";
export const alt = "LaunchCV — AI Resume Builder & Job Search Platform";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgImage
      title="The AI job search platform that lands more interviews."
      subtitle="Resume builder, JD alignment, ATS scoring, cover letters & interview prep — one plan."
    />,
    { ...size },
  );
}
