import Link from "next/link";

/** LaunchCV mark — purple rounded square with a document (design system v5). */
export function SiteMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="10.4" fill="#5440E8" />
      <g transform="translate(6.4 6.4) scale(0.68)">
        <rect x="10" y="5" width="20" height="30" rx="4.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
        <rect x="13.4" y="11" width="4.8" height="18" rx="2.4" fill="#FFFFFF" />
        <rect x="21" y="12.2" width="6.6" height="2.6" rx="1.3" fill="#CFC7FF" />
        <rect x="21" y="17.6" width="6.6" height="2.6" rx="1.3" fill="#CFC7FF" />
        <rect x="21" y="23" width="4.9" height="2.6" rx="1.3" fill="#CFC7FF" />
      </g>
    </svg>
  );
}

export function SiteLogo({ size = 36, tone = "dark" }: { size?: number; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="LaunchCV home">
      <SiteMark size={size} className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className={`text-[22px] font-extrabold tracking-[-0.02em] ${tone === "dark" ? "text-[#121226]" : "text-white"}`}>
        launch<span className={tone === "dark" ? "text-[#5440e8]" : "text-[#c9c0ff]"}>cv</span>
      </span>
    </Link>
  );
}
