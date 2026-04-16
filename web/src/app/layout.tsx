import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";
import { ToastProvider } from "@/components/toast";
import { AppProviders } from "@/app/providers";
import { JsonLd } from "@/components/json-ld";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Launch CV — AI Resume Builder for 12+ Industries",
    template: "%s | Launch CV",
  },
  description:
    "Build tailored resumes with AI-powered JD alignment, role-fit rubrics, evidence graphs, and interview-ready packets. Paid plans: Starter, Professional, Elite, or Lifetime.",
  keywords: ["resume builder", "AI resume", "job application", "JD alignment", "cover letter", "interview prep"],
  openGraph: {
    url: siteUrl,
    title: "Launch CV — AI Resume Builder",
    description: "Not just a resume builder — a job-landing system. Tailored for 12+ industries.",
    type: "website",
    siteName: "Launch CV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch CV — AI Resume Builder",
    description: "Build winning resumes with AI. JD alignment, role-fit scoring, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "dz90Yv149kX83SmMMEE6jz4_gegmV8_owlAFe1MzOMw",
  },
};

const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Launch CV",
      url: siteUrl,
      description: "AI-powered resume and job search platform for modern job seekers.",
    },
    {
      "@type": "WebSite",
      name: "Launch CV",
      url: siteUrl,
      description: "Tailored resumes, JD alignment, ATS scoring, cover letters, and interview prep.",
      publisher: { "@type": "Organization", name: "Launch CV" },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={rootStructuredData} />
        <AppProviders>
          {children}
          <CookieBanner />
          <ToastProvider />
        </AppProviders>
      </body>
    </html>
  );
}
