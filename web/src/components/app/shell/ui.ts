/**
 * v5 building blocks for the signed-in app (cabinet). Same palette as
 * components/site/ui.tsx, sized for a tool UI: 44px+ touch targets, smaller
 * type, and the hover lift switched off for reduced motion.
 *
 * Colors: ink #121226, body #4a4862, muted #66647c, ground #eeecf4,
 * primary #5440e8 (hover #4430d6), lilac #e4dfff / #c9c0ff, soft #f1eff8,
 * dark #111118, hairline #e2e0ea.
 */

/**
 * The legacy global `*:focus-visible` rule (unlayered) squares off focused
 * pills and paints the ring blue; these keep the element's shape and use v5 purple.
 */
export const focusRing = "focus-visible:outline-[#5440e8]!";
export const focusPill = `${focusRing} focus-visible:rounded-full!`;

const base =
  `${focusPill} lc-btn-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-[11px] text-[15px] font-semibold motion-reduce:hover:transform-none disabled:pointer-events-none disabled:opacity-60`;

export const appBtnPrimary = `${base} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const appBtnWhite = `${base} bg-white text-[#121226] hover:bg-[#f7f6fc]`;
export const appBtnDark = `${base} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const appBtnSoft = `${base} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;

/** Small pill buttons inside cards (still 44px tall). */
const smallBase =
  `${focusPill} inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-bold transition-colors duration-200`;
export const appBtnSmDark = `${smallBase} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const appBtnSmSoft = `${smallBase} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;

/** Inline text link in purple ("See all →"). */
export const appLink =
  `${focusRing} lc-link inline-flex min-h-11 items-center text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]`;

/** Page H1 inside the app shell. */
export const appH1 = "text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#121226] sm:text-[36px] sm:leading-10";
export const appLead = "mt-1.5 text-[15px] text-[#4a4862] sm:text-[16px]";

/** White card. */
export const appCard = "lc-card rounded-[24px] sm:rounded-[28px]";

/** Status pill. */
export const badge = "inline-block shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold";

/** Text field (52px, 16px text so iOS doesn't zoom). */
export const appInput =
  "block w-full rounded-2xl border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! disabled:opacity-60";

/** v5 tones for 0–100 ATS scores: same bands as the free check (80+ ready, 65–79 readable, below 65 at risk). */
export function scoreTone(v: number): { ring: string; bg: string; fg: string } {
  if (v >= 80) return { ring: "#22b07d", bg: "#dcf5ea", fg: "#0b4f35" };
  if (v >= 65) return { ring: "#f2a91f", bg: "#fdf0d5", fg: "#7a4600" };
  return { ring: "#c42b30", bg: "#fbe2e3", fg: "#8f1d22" };
}

/** "5 min ago", "3 h ago", "yesterday", "4 days ago", "Oct 22". */
export function ago(d: Date): string {
  const s = Math.max(0, (Date.now() - d.getTime()) / 1000);
  if (s < 60 * 60) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 60 * 60 * 24) return `${Math.round(s / 3600)} h ago`;
  const days = Math.round(s / 86400);
  if (days < 30) return days === 1 ? "yesterday" : `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
