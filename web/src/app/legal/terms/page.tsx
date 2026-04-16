import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-zinc-300">
      <Link href="/" className="text-emerald-400 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">Terms of Service (summary)</h1>
      <p className="mt-4">
        By using the Launch CV service you agree to the following. This text provides minimal initial
        terms and should be reviewed by legal counsel before production launch.
      </p>
      <ul className="mt-6 list-disc space-y-3 pl-5">
        <li>The service is provided &ldquo;as is&rdquo;; availability or uptime is not guaranteed.</li>
        <li>AI-generated content may be inaccurate or incomplete; the user is responsible for final text and metrics.</li>
        <li>Keeping your account secure with a strong password is your responsibility.</li>
        <li>Posting spam, illegal content, or content that violates third-party rights is prohibited.</li>
        <li>We may collect technical logs and analytics events to improve the service.</li>
      </ul>
      <p className="mt-8 text-zinc-500">Last updated: 2026-04-14 (placeholder).</p>
    </main>
  );
}
