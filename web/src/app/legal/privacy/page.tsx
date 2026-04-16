import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-zinc-300">
      <Link href="/" className="text-emerald-400 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-white">Privacy Policy (summary)</h1>
      <p className="mt-4">
        This policy provides a general overview of how user data is handled. A full GDPR/CCPA
        compliance review by legal counsel is recommended.
      </p>
      <ul className="mt-6 list-disc space-y-3 pl-5">
        <li>
          <strong className="text-zinc-200">Session cookie:</strong> An HTTP-only cookie is used to
          maintain login state.
        </li>
        <li>
          <strong className="text-zinc-200">Stored data:</strong> email, name (optional), password hash,
          resume JSON, JD analysis history, snapshots, internal analytics events (name + timestamp).
        </li>
        <li>
          <strong className="text-zinc-200">Third party:</strong> Resume fragments are sent to the OpenAI
          API for AI features (OPENAI_API_KEY is on your account).
        </li>
        <li>
          <strong className="text-zinc-200">Export and deletion:</strong> JSON export and account deletion
          with password confirmation are available from the dashboard.
        </li>
      </ul>
      <p className="mt-8 text-zinc-500">Questions: support email (NEXT_PUBLIC_SUPPORT_EMAIL).</p>
    </main>
  );
}
