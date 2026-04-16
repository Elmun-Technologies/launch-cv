import Link from "next/link";

type LogoProps = {
  /** "dark" = white text (for dark backgrounds), "light" = dark text (for light BGs) */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
};

const sizeMap = {
  sm: { mark: 28, text: "text-[14px]", gap: "gap-2" },
  md: { mark: 36, text: "text-[16px]", gap: "gap-2.5" },
  lg: { mark: 48, text: "text-[20px]", gap: "gap-3" },
};

export function Logo({ variant = "light", size = "md", href = "/" }: LogoProps) {
  const s = sizeMap[size];
  const textColor = variant === "dark" ? "text-white" : "text-[#0F172A]";

  return (
    <Link href={href} className={`inline-flex items-center ${s.gap} shrink-0`}>
      {/* Mark — gradient square with "L" */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1A56DB" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <rect width="36" height="36" rx="9" fill="url(#logo-grad)" />
        {/* "L" letterform */}
        <text
          x="10"
          y="27"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="22"
          fontWeight="800"
          fill="white"
          letterSpacing="-1"
        >
          L
        </text>
      </svg>

      {/* Wordmark */}
      <span className={`font-display font-bold tracking-tight ${s.text} ${textColor}`}>
        Launch CV
      </span>
    </Link>
  );
}

/** Icon-only version (square mark, no text) */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Launch CV"
    >
      <defs>
        <linearGradient id="logomark-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A56DB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="9" fill="url(#logomark-grad)" />
      <text
        x="10"
        y="27"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="800"
        fill="white"
        letterSpacing="-1"
      >
        L
      </text>
    </svg>
  );
}
