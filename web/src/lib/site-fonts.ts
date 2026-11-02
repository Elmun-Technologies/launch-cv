import localFont from "next/font/local";

/**
 * Marketing-site type (design system v5): Figtree for text, Archivo Expanded for
 * poster lines, JetBrains Mono for data. Self-hosted from src/fonts (OFL-1.1),
 * so builds don't download from Google Fonts.
 */
export const figtree = localFont({
  src: "../fonts/figtree-latin-wght-normal.woff2",
  weight: "300 900",
  variable: "--font-figtree",
  display: "swap",
});

export const archivo = localFont({
  src: "../fonts/archivo-latin-wdth-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  // Decorative poster type only — don't compete with the hero text/image for bandwidth.
  preload: false,
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

export const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jbmono",
  display: "swap",
  preload: false,
});

export const siteFontVars = `${figtree.variable} ${archivo.variable} ${jetbrains.variable}`;
