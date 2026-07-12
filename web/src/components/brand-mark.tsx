import type { ReactElement } from "react";

/**
 * LaunchCV brand mark — a résumé/document card with a photo bar and text lines.
 * Pure SVG with no other dependencies so it can be reused in client components,
 * OG image routes (edge runtime), and app icon routes alike.
 *
 * Colors are configurable so the same mark works on light, dark, and
 * solid-blue (app icon) surfaces.
 */
export function BrandMark({
  size = 36,
  stroke = "#2563EB",
  bar = "#2563EB",
  lines = "#93C5FD",
  className,
  strokeWidth = 2.6,
}: {
  size?: number;
  /** Card outline color */
  stroke?: string;
  /** Left photo-bar fill */
  bar?: string;
  /** Right text-line fill */
  lines?: string;
  className?: string;
  strokeWidth?: number;
}): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Document card */}
      <rect
        x="10"
        y="5"
        width="20"
        height="30"
        rx="4.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Left photo bar */}
      <rect x="13.4" y="11" width="4.8" height="18" rx="2.4" fill={bar} />
      {/* Right text lines */}
      <rect x="21" y="12.2" width="6.6" height="2.6" rx="1.3" fill={lines} />
      <rect x="21" y="17.6" width="6.6" height="2.6" rx="1.3" fill={lines} />
      <rect x="21" y="23" width="4.9" height="2.6" rx="1.3" fill={lines} />
    </svg>
  );
}
