import Link from "next/link";
import { BrandMark } from "./brand-mark";

type LogoProps = {
  /** "dark" = light text (for dark backgrounds), "light" = dark text (for light BGs) */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
};

const sizeMap = {
  sm: { box: 28, text: "text-[16px]", gap: "gap-2" },
  md: { box: 34, text: "text-[19px]", gap: "gap-2.5" },
  lg: { box: 46, text: "text-[26px]", gap: "gap-3" },
};

/** Filled brand mark — blue rounded square with a white document, per the brand guidelines. */
export function LogoMark({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[26%] bg-[#2563EB] ${className}`}
      style={{ width: size, height: size }}
    >
      <BrandMark size={Math.round(size * 0.64)} stroke="#FFFFFF" bar="#FFFFFF" lines="#BFDBFE" strokeWidth={3} />
    </span>
  );
}

export function Logo({ variant = "light", size = "md", href = "/" }: LogoProps) {
  const s = sizeMap[size];
  // "launch" adapts to the surface; "cv" is always brand blue.
  const launchColor = variant === "dark" ? "text-white" : "text-[#0F172A]";

  return (
    <Link href={href} className={`inline-flex items-center ${s.gap} shrink-0`}>
      <LogoMark size={s.box} />
      <span className={`font-display font-extrabold tracking-tight ${s.text}`}>
        <span className={launchColor}>launch</span>
        <span className="text-[#2563EB]">cv</span>
      </span>
    </Link>
  );
}
