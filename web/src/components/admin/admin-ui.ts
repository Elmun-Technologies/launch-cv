/**
 * v5 class strings for the admin panel (buttons, page header, labels).
 * Colors follow components/site/ui.tsx. Buttons are 44px tall on phones
 * (touch target) and 40px from `sm` up.
 */

const adminBtn =
  "lc-btn-lift inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold sm:min-h-[40px] disabled:pointer-events-none disabled:opacity-60";

export const adminBtnPrimary = `${adminBtn} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const adminBtnDark = `${adminBtn} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const adminBtnSoft = `${adminBtn} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
export const adminBtnWhite = `${adminBtn} bg-white text-[#121226] ring-1 ring-inset ring-[#e2e0ea] hover:bg-[#f7f6fb]`;
export const adminBtnDanger = `${adminBtn} bg-[#fbe2e3] text-[#a3262b] hover:bg-[#f7cfd1]`;

/** Page H1 (34px on desktop, per the admin mockups). */
export const adminH1 = "text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#121226] sm:text-[34px]";
/** Lead paragraph under the H1. */
export const adminLead = "mt-1.5 max-w-[760px] text-[15px] leading-[1.55] text-[#4a4862]";
/** Small uppercase group label ("AI MODELS"). */
export const adminEyebrow = "text-[12px] font-extrabold uppercase tracking-[0.1em] text-[#66647c]";
/** Purple text link with the v5 underline sweep. */
export const adminLink = "lc-link font-bold text-[#5440e8] hover:text-[#3a2bb8]";
