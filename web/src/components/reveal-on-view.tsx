"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealOnViewProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Subtle scroll reveal. Respects `prefers-reduced-motion` (no animation).
 */
export function RevealOnView({ children, className = "" }: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lc-reveal-block transition-[opacity,transform] duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0 motion-reduce:translate-y-0"
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
