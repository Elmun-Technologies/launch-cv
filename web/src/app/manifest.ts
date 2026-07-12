import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LaunchCV — AI Resume Builder & Job Search Platform",
    short_name: "LaunchCV",
    description:
      "AI resume builder with JD alignment, ATS scoring, cover letters, and interview prep — for serious job seekers.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563EB",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
