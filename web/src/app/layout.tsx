import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";
import { ToastProvider } from "@/components/toast";
import { AppProviders } from "@/app/providers";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@/components/google-analytics";
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
      logo: `${siteUrl}/icon.png`,
      sameAs: ["https://twitter.com/launchcv", "https://linkedin.com/company/launchcv"],
      description: "AI-powered resume and job search platform for modern job seekers.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@launch-cv.com",
      },
    },
    {
      "@type": "WebSite",
      name: "Launch CV",
      url: siteUrl,
      description: "Tailored resumes, JD alignment, ATS scoring, cover letters, and interview prep.",
      publisher: { "@type": "Organization", name: "Launch CV" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/features?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: ["Home", "Features", "JD Alignment", "Resume Builder", "Cover Letter", "Interview Prep", "ATS Score", "Voice Input", "Pricing", "Blog", "Company Matcher", "About"],
      url: [
        siteUrl,
        `${siteUrl}/features`,
        `${siteUrl}/features/jd-alignment`,
        `${siteUrl}/features/resume-builder`,
        `${siteUrl}/features/cover-letter`,
        `${siteUrl}/features/interview-prep`,
        `${siteUrl}/features/ats-score`,
        `${siteUrl}/features/voice-input`,
        `${siteUrl}/pricing`,
        `${siteUrl}/blog`,
        `${siteUrl}/company-matcher`,
        `${siteUrl}/about`,
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "Launch CV",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "9.00",
          priceCurrency: "USD",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M", unitCode: "MON" },
        },
        {
          "@type": "Offer",
          name: "Professional",
          price: "29.00",
          priceCurrency: "USD",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1Y", unitCode: "ANN" },
        },
        {
          "@type": "Offer",
          name: "Elite",
          price: "79.00",
          priceCurrency: "USD",
          priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1Y", unitCode: "ANN" },
        },
        {
          "@type": "Offer",
          name: "Lifetime",
          price: "149.00",
          priceCurrency: "USD",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "2400",
        bestRating: "5",
        worstRating: "1",
      },
      description:
        "AI-powered resume builder with JD alignment, ATS scoring, cover letter generation, interview prep, and voice input. Paid plans for serious job seekers.",
      featureList: [
        "AI Resume Builder",
        "JD Alignment Match",
        "ATS Score Checker",
        "Cover Letter Generator",
        "Interview Preparation",
        "Voice Input",
      ],
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
        <GoogleAnalytics />
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
