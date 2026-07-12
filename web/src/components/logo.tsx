import Link from "next/link";
import { BrandMark } from "./brand-mark";

type LogoProps = {
  /** "dark" = light text (for dark backgrounds), "light" = dark text (for light BGs) */
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
};

const sizeMap = {
  sm: { mark: 28, text: "text-[16px]", gap: "gap-2" },
  md: { mark: 34, text: "text-[19px]", gap: "gap-2" },
  lg: { mark: 46, text: "text-[26px]", gap: "gap-2.5" },
};

export function Logo({ variant = "light", size = "md", href = "/" }: LogoProps) {
  const s = sizeMap[size];
  // "launch" adapts to the surface; "cv" is always brand blue.
  const launchColor = variant === "dark" ? "text-white" : "text-[#0F172A]";

  return (
    <Link href={href} className={`inline-flex items-center ${s.gap} shrink-0`}>
      <BrandMark size={s.mark} />
      <span className={`font-display font-extrabold tracking-tight ${s.text}`}>
        <span className={launchColor}>launch</span>
        <span className="text-[#2563EB]">cv</span>
      </span>
    </Link>
  );
}

/** Icon-only version (document mark, no wordmark) */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return <BrandMark size={size} className={className} />;
}
