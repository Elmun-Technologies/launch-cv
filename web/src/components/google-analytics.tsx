import Script from "next/script";

const DEFAULT_MEASUREMENT_ID = "G-BQJVBJ207Q";

/** GA4 via gtag. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to override or use empty string to disable. */
export function GoogleAnalytics() {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const id =
    raw === undefined || raw === ""
      ? DEFAULT_MEASUREMENT_ID
      : raw.trim() === "false" || raw.trim() === "0"
        ? ""
        : raw.trim();

  if (!id || !id.startsWith("G-")) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
        `.trim()}
      </Script>
    </>
  );
}
