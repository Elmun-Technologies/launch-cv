import { Archivo, Figtree, JetBrains_Mono } from "next/font/google";

/** Marketing-site type (design system v5): Figtree for text, Archivo Expanded for poster lines, JetBrains Mono for data. */
export const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });

export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
  // Decorative poster type only — don't compete with the hero text/image for bandwidth.
  preload: false,
});

export const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jbmono", display: "swap", preload: false });

export const siteFontVars = `${figtree.variable} ${archivo.variable} ${jetbrains.variable}`;
