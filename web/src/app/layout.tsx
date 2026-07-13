import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/cookie-banner";
import { ToastProvider } from "@/components/toast";
import { AppProviders } from "@/app/providers";
import { JsonLd } from "@/components/json-ld";
import { GoogleAnalytics } from "@/components/google-analytics";
import { AttributionTracker } from "@/components/attribution-tracker";
import { getSiteUrl } from "@/lib/site";
import { PUBLIC_PLANS, planPriceLabel, planBillingDuration } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

// Derived from the single pricing source of truth so meta + schema never drift.
const planListWithPrices = CHECKOUT_PLAN_ORDER.map(
  (key, i) =>
    `${i === CHECKOUT_PLAN_ORDER.length - 1 ? "or " : ""}${PUBLIC_PLANS[key].title} (${planPriceLabel(key)})`,
).join(", ");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LaunchCV — AI Resume Builder for 12+ Industries",
    template: "%s | LaunchCV",
  },
  description: `Build tailored resumes with AI-powered JD alignment, role-fit rubrics, evidence graphs, and interview-ready packets. Paid plans: ${planListWithPrices}.`,
  keywords: ["resume builder", "AI resume", "job application", "JD alignment", "cover letter", "interview prep"],
  openGraph: {
    url: siteUrl,
    title: "LaunchCV — AI Resume Builder",
    description: "Not just a resume builder — a job-landing system. Tailored for 12+ industries.",
    type: "website",
    siteName: "LaunchCV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchCV — AI Resume Builder",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

const rootStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LaunchCV",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
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
      name: "LaunchCV",
      url: siteUrl,
      description: "Tailored resumes, JD alignment, ATS scoring, cover letters, and interview prep.",
      publisher: { "@type": "Organization", name: "LaunchCV" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/features?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SiteNavigationElement",
      name: ["Home", "Features", "JD Alignment", "Resume Builder", "Cover Letter", "Interview Prep", "ATS Score", "Voice Input", "Use Cases", "Pricing", "Blog", "Company Matcher", "About"],
      url: [
        siteUrl,
        `${siteUrl}/features`,
        `${siteUrl}/features/jd-alignment`,
        `${siteUrl}/features/resume-builder`,
        `${siteUrl}/features/cover-letter`,
        `${siteUrl}/features/interview-prep`,
        `${siteUrl}/features/ats-score`,
        `${siteUrl}/features/voice-input`,
        `${siteUrl}/use-cases`,
        `${siteUrl}/pricing`,
        `${siteUrl}/blog`,
        `${siteUrl}/company-matcher`,
        `${siteUrl}/about`,
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "LaunchCV",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: CHECKOUT_PLAN_ORDER.map((key) => {
        const plan = PUBLIC_PLANS[key];
        const billingDuration = planBillingDuration(key);
        return {
          "@type": "Offer",
          name: plan.title,
          price: plan.priceAmount.toFixed(2),
          priceCurrency: "USD",
          ...(billingDuration
            ? {
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  billingDuration,
                  unitCode: billingDuration === "P1M" ? "MON" : "ANN",
                },
              }
            : {}),
        };
      }),
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <GoogleAnalytics />
        <AttributionTracker />
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
