"use client";

import type { ReactNode } from "react";
import { MotionReveal } from "@/components/motion-reveal";

/**
 * Scroll reveal (fade + rise). Thin wrapper over the shared Motion primitive so
 * every page that already uses `RevealOnView` gets the same polished animation.
 * Honors `prefers-reduced-motion`.
 */
export function RevealOnView({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <MotionReveal className={className}>{children}</MotionReveal>;
}
