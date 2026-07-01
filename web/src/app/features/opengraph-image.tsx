import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";

export const runtime = "edge";
export const alt = "Launch CV features — six AI tools for the job search";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    <OgImage
      title="Six AI tools for every stage of the job search."
      subtitle="Match, write, score, send, practice, and speak — every output feeds the next tool."
      pills={["JD Alignment", "Cover Letter", "ATS Score", "Voice Input"]}
    />,
    { ...size },
  );
}
